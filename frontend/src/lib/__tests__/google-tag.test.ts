// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setzeConsent } from "../consent";

// Frischer Modulimport je Test, weil sich das Modul merkt, ob es schon geladen hat.
async function frischesTag() {
  vi.resetModules();
  return import("../google-tag");
}

function tagSkripte() {
  return [...document.querySelectorAll("script")].filter((s) =>
    s.src.includes("googletagmanager.com"),
  );
}

/** gtag.js legt Befehle als Arguments-Objekte ab — für Vergleiche in Arrays umwandeln. */
function befehle() {
  return (window.dataLayer ?? []).map((eintrag) => Array.from(eintrag as ArrayLike<unknown>));
}

beforeEach(() => {
  window.localStorage.clear();
  document.head.innerHTML = "";
  delete window.gtag;
  delete window.dataLayer;
});

describe("Google-Tag lädt nur mit Einwilligung", () => {
  it("lädt ohne Entscheidung kein Skript", async () => {
    const { ladeGoogleTag } = await frischesTag();
    ladeGoogleTag();

    expect(tagSkripte()).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
  });

  it("lädt nach einer Ablehnung kein Skript", async () => {
    setzeConsent(false);
    const { ladeGoogleTag } = await frischesTag();
    ladeGoogleTag();

    expect(tagSkripte()).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
  });

  it("lädt nach einer Zustimmung genau ein Skript mit der Ads-ID", async () => {
    setzeConsent(true);
    const { ladeGoogleTag, GOOGLE_ADS_ID } = await frischesTag();
    ladeGoogleTag();
    ladeGoogleTag();

    expect(tagSkripte()).toHaveLength(1);
    expect(tagSkripte()[0].src).toContain(`id=${GOOGLE_ADS_ID}`);
    expect(befehle()).toContainEqual(["config", GOOGLE_ADS_ID]);
  });

  it("setzt Consent Mode vor der Konfiguration", async () => {
    setzeConsent(true);
    const { ladeGoogleTag } = await frischesTag();
    ladeGoogleTag();

    const namen = befehle().map((b) => b[0]);
    expect(namen.indexOf("consent")).toBeLessThan(namen.indexOf("config"));
    expect(befehle()[0][2]).toMatchObject({ ad_storage: "granted", ad_user_data: "granted" });
  });

  it("übernimmt keine Zustimmung aus Fassung 2 (nur Meta-Pixel)", async () => {
    window.localStorage.setItem(
      "phe_consent_v2",
      JSON.stringify({ marketing: true, zeitpunkt: new Date().toISOString() }),
    );
    const { ladeGoogleTag } = await frischesTag();
    ladeGoogleTag();

    expect(tagSkripte()).toHaveLength(0);
  });
});

describe("Conversions", () => {
  it("meldet ohne Einwilligung nichts und lädt nichts", async () => {
    setzeConsent(false);
    const { meldeKontaktConversion, meldeTerminConversion } = await frischesTag();

    meldeKontaktConversion("kontakt");
    meldeTerminConversion("telefon");

    expect(window.dataLayer).toBeUndefined();
    expect(tagSkripte()).toHaveLength(0);
  });

  it("meldet Kontakt mit Quelle", async () => {
    setzeConsent(true);
    const { meldeKontaktConversion, CONVERSION } = await frischesTag();

    meldeKontaktConversion("bewerbung");

    expect(befehle()).toContainEqual([
      "event",
      "conversion",
      { send_to: CONVERSION.kontakt, quelle: "bewerbung" },
    ]);
  });

  it("lädt das Tag selbst nach, wenn ein Formular vor dem Lader meldet", async () => {
    setzeConsent(true);
    const { meldeKontaktConversion } = await frischesTag();

    meldeKontaktConversion("bewerbung_linkedin");

    expect(tagSkripte()).toHaveLength(1);
    const namen = befehle().map((b) => b[0]);
    expect(namen.indexOf("config")).toBeLessThan(namen.indexOf("event"));
  });

  it("meldet Termin mit Kanal", async () => {
    setzeConsent(true);
    const { meldeTerminConversion, CONVERSION } = await frischesTag();

    meldeTerminConversion("whatsapp");

    expect(befehle()).toContainEqual([
      "event",
      "conversion",
      { send_to: CONVERSION.termin, kanal: "whatsapp", transport_type: "beacon" },
    ]);
  });
});

describe("Conversion-Ziele", () => {
  it("gehören zum Ads-Konto und haben ein Label", async () => {
    const { CONVERSION, GOOGLE_ADS_ID } = await frischesTag();
    for (const ziel of Object.values(CONVERSION)) {
      expect(ziel).toMatch(new RegExp(`^${GOOGLE_ADS_ID}/[A-Za-z0-9_-]+$`));
    }
  });
});

describe("Terminkanal aus Link-Ziel", () => {
  it.each([
    ["tel:+4921115863100", "telefon"],
    ["TEL:0211 123", "telefon"],
    ["https://wa.me/491739980100", "whatsapp"],
    ["https://api.whatsapp.com/send?phone=49173", "whatsapp"],
    ["whatsapp://send?phone=49173", "whatsapp"],
    ["mailto:info@phe-perm.de", null],
    ["/kontakt", null],
    ["https://wa.me.example.com/x", null],
  ])("%s → %s", async (href, erwartet) => {
    const { terminKanal } = await frischesTag();
    expect(terminKanal(href)).toBe(erwartet);
  });
});
