import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { leseConsent, setzeConsent, marketingErlaubt, CONSENT_EREIGNIS } from "../../lib/consent";

// Der Pixel wird über einen frischen Modulimport je Test geholt, weil er sich
// intern merkt, ob er schon geladen wurde.
async function frischerPixel() {
  vi.resetModules();
  return import("../../lib/meta-pixel");
}

function pixelSkripte() {
  return [...document.querySelectorAll("script")].filter((s) =>
    s.src.includes("connect.facebook.net"),
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.head.innerHTML = "";
  delete window.fbq;
  delete window._fbq;
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Einwilligung speichern und lesen", () => {
  it("gilt vor der ersten Entscheidung als nicht erteilt", () => {
    expect(leseConsent()).toBeNull();
    expect(marketingErlaubt()).toBe(false);
  });

  it("hält eine Ablehnung fest", () => {
    setzeConsent(false);
    expect(leseConsent()?.marketing).toBe(false);
    expect(marketingErlaubt()).toBe(false);
  });

  it("hält eine Zustimmung mit Zeitpunkt fest", () => {
    setzeConsent(true);
    const consent = leseConsent();

    expect(consent?.marketing).toBe(true);
    expect(Date.parse(consent!.zeitpunkt)).not.toBeNaN();
    expect(marketingErlaubt()).toBe(true);
  });

  it("behandelt einen beschädigten Eintrag wie „noch nicht gefragt“", () => {
    window.localStorage.setItem("phe_consent_v2", "{kein json");
    expect(leseConsent()).toBeNull();
    expect(marketingErlaubt()).toBe(false);
  });

  it("übernimmt keine Zustimmung aus der alten Bannerfassung", () => {
    // Vor August 2026 speicherte der reine Hinweisbanner unter einem anderen
    // Schlüssel. Ein „Verstanden“ von damals ist keine Marketing-Einwilligung.
    window.localStorage.setItem("phe_cookie_consent", "all");
    expect(leseConsent()).toBeNull();
    expect(marketingErlaubt()).toBe(false);
  });

  it("meldet eine Änderung an die Seite", () => {
    const horcher = vi.fn();
    window.addEventListener(CONSENT_EREIGNIS, horcher);
    setzeConsent(true);
    window.removeEventListener(CONSENT_EREIGNIS, horcher);

    expect(horcher).toHaveBeenCalledTimes(1);
  });
});

describe("Meta-Pixel lädt nur mit Einwilligung", () => {
  it("lädt ohne Entscheidung kein Skript", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    const { ladePixel } = await frischerPixel();

    ladePixel();

    expect(pixelSkripte()).toHaveLength(0);
    expect(window.fbq).toBeUndefined();
  });

  it("lädt nach einer Ablehnung kein Skript", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    setzeConsent(false);
    const { ladePixel } = await frischerPixel();

    ladePixel();

    expect(pixelSkripte()).toHaveLength(0);
    expect(window.fbq).toBeUndefined();
  });

  it("lädt nach einer Zustimmung genau ein Skript", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    setzeConsent(true);
    const { ladePixel } = await frischerPixel();

    ladePixel();

    expect(pixelSkripte()).toHaveLength(1);
    expect(pixelSkripte()[0].src).toContain("connect.facebook.net");
    expect(typeof window.fbq).toBe("function");
  });

  it("lädt bei mehrfachem Aufruf nicht mehrfach", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    setzeConsent(true);
    const { ladePixel } = await frischerPixel();

    ladePixel();
    ladePixel();
    ladePixel();

    expect(pixelSkripte()).toHaveLength(1);
  });

  it("lädt ohne hinterlegte Pixel-ID nichts, auch mit Zustimmung", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    setzeConsent(true);
    const { ladePixel } = await frischerPixel();

    ladePixel();

    expect(pixelSkripte()).toHaveLength(0);
  });
});

describe("Lead-Ereignis", () => {
  it("meldet ohne Einwilligung nichts", async () => {
    setzeConsent(false);
    const { meldeLead } = await frischerPixel();
    const fbq = vi.fn();
    window.fbq = fbq as never;

    meldeLead({ kampagne: "kaeltetechniker-koeln", eventId: "e1" });

    expect(fbq).not.toHaveBeenCalled();
  });

  it("meldet mit Einwilligung und übergibt die Ereignis-ID zur Entdopplung", async () => {
    setzeConsent(true);
    const { meldeLead } = await frischerPixel();
    const fbq = vi.fn();
    window.fbq = fbq as never;

    meldeLead({ kampagne: "kaeltetechniker-koeln", eventId: "e1" });

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Lead",
      { content_category: "recruiting", content_name: "kaeltetechniker-koeln" },
      { eventID: "e1" },
    );
  });

  it("überträgt keine personenbezogenen Daten an Meta", async () => {
    setzeConsent(true);
    const { meldeLead } = await frischerPixel();
    const fbq = vi.fn();
    window.fbq = fbq as never;

    meldeLead({ kampagne: "kaeltetechniker-koeln", eventId: "e1" });

    const uebertragen = JSON.stringify(fbq.mock.calls[0]);
    for (const wort of ["@", "Thomas", "Berger", "0173"]) {
      expect(uebertragen, `„${wort}“ darf nicht an Meta gehen`).not.toContain(wort);
    }
  });
});
