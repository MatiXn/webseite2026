// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { setzeConsent } from "../consent";

const CONSENT_DEFAULT = readFileSync(join(__dirname, "../../../public/consent-default.js"), "utf8");

async function frischesGtm() {
  vi.resetModules();
  return import("../gtm");
}

/** Führt public/consent-default.js aus, wie es der <head> tut. */
function headSkript() {
  window.eval(CONSENT_DEFAULT);
}

function gtmSkripte() {
  return [...document.querySelectorAll("script")].filter((s) => s.src.includes("gtm.js"));
}

function eintraege() {
  return (window.dataLayer ?? []).map((e) =>
    e && typeof e === "object" && "length" in (e as object) ? Array.from(e as ArrayLike<unknown>) : e,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.head.innerHTML = "";
  delete window.gtag;
  delete window.dataLayer;
});

describe("consent-default.js im <head>", () => {
  it("setzt ohne Entscheidung alles auf denied und lädt nichts", () => {
    headSkript();

    const [erster] = eintraege() as unknown[][];
    expect(erster.slice(0, 2)).toEqual(["consent", "default"]);
    expect(erster[2]).toMatchObject({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    expect(eintraege()).not.toContainEqual(expect.arrayContaining(["consent", "update"]));
    expect(document.querySelectorAll("script[src]")).toHaveLength(0);
  });

  it("übernimmt eine frühere Zustimmung sofort als update", () => {
    setzeConsent(true);
    headSkript();

    expect(eintraege()).toContainEqual([
      "consent",
      "update",
      { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" },
    ]);
  });

  it("nutzt denselben Speicherschlüssel wie lib/consent.ts", () => {
    setzeConsent(true);
    const schluessel = Object.keys(window.localStorage);
    expect(schluessel).toHaveLength(1);
    expect(CONSENT_DEFAULT).toContain(`"${schluessel[0]}"`);
  });
});

describe("GTM lädt nur mit Einwilligung", () => {
  it("lädt ohne Entscheidung und nach Ablehnung nichts", async () => {
    headSkript();
    const { ladeGtm } = await frischesGtm();
    ladeGtm();
    setzeConsent(false);
    ladeGtm();

    expect(gtmSkripte()).toHaveLength(0);
  });

  it("lädt nach Zustimmung genau einen Container, Consent vor gtm.js", async () => {
    headSkript();
    setzeConsent(true);
    const { ladeGtm, GTM_ID } = await frischesGtm();
    ladeGtm();
    ladeGtm();

    expect(gtmSkripte()).toHaveLength(1);
    expect(gtmSkripte()[0].src).toBe(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);

    const liste = eintraege();
    const startIndex = liste.findIndex((e) => (e as { event?: string })?.event === "gtm.js");
    const updateIndex = liste.findIndex(
      (e) => Array.isArray(e) && e[0] === "consent" && e[1] === "update",
    );
    expect(startIndex).toBeGreaterThan(-1);
    expect(updateIndex).toBeLessThan(startIndex);
    expect(liste[0]).toEqual(expect.arrayContaining(["consent", "default"]));
  });

  it("meldet einen Widerruf als denied", async () => {
    headSkript();
    const { sendeGoogleConsent } = await frischesGtm();
    sendeGoogleConsent(false);

    expect(eintraege().at(-1)).toEqual([
      "consent",
      "update",
      { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" },
    ]);
  });
});

describe("Google-Ads-Tag mit vorhandenem consent-default.js", () => {
  it("lädt trotz bereits existierendem window.gtag", async () => {
    headSkript();
    setzeConsent(true);
    vi.resetModules();
    const { ladeGoogleTag, GOOGLE_ADS_ID } = await import("../google-tag");
    ladeGoogleTag();

    const skripte = [...document.querySelectorAll("script")].filter((s) => s.src.includes("gtag/js"));
    expect(skripte).toHaveLength(1);
    expect(eintraege()).toContainEqual(["config", GOOGLE_ADS_ID]);
  });
});
