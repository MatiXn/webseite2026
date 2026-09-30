// Google-Tag (Google Ads Conversion-Tracking) — lädt ausschließlich nach
// erteilter Marketing-Einwilligung.
//
// Es gelten dieselben Regeln wie beim Meta-Pixel (siehe meta-pixel.ts):
//
// 1. Ohne Einwilligung wird gtag.js gar nicht erst angefordert. Google schlägt
//    vor, den Schnipsel fest in den <head> zu setzen — dann ginge die
//    IP-Adresse schon beim ersten Seitenaufruf an Google, vor jeder Wahl im
//    Banner.
// 2. Conversions werden erst nach bestätigtem Versand gemeldet, nie beim
//    Öffnen eines Formulars.
//
// An Google gehen nur Ereignisnamen. Keine Namen, keine Telefonnummern, keine
// E-Mail-Adressen.

import { marketingErlaubt } from "./consent";

/** Konto-ID aus Google Ads. Nicht geheim — sie steht in jedem Seitenquelltext. */
export const GOOGLE_ADS_ID = "AW-10801717598";

/**
 * Conversion-Ziele (`send_to`) der Website-Aktionen in Google Ads.
 *
 * Nicht die Ereignisnamen `ads_conversion_…` aus Googles Anleitungs-Mail
 * verwenden: Die gleichnamigen Aktionen „Kontakt“ und „Termin vereinbaren“
 * werden aus GA4 importiert, und GA4 ist auf der Website nicht eingebunden.
 * Diese hier (angelegt am 30.09.2026) zählen direkt über das Ads-Tag.
 */
export const CONVERSION = {
  /** „Kontakt (Website-Formular)“, Zielvorhaben Kontakt */
  kontakt: `${GOOGLE_ADS_ID}/fh9dCJjl14sdEN7C1J4o`,
  /** „Termin (Telefon/WhatsApp-Klick)“, Zielvorhaben Termin vereinbaren */
  termin: `${GOOGLE_ADS_ID}/CcR9CJvl14sdEN7C1J4o`,
} as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let geladen = false;

/**
 * Lädt gtag.js und meldet den Seitenaufruf.
 * Mehrfachaufrufe sind unschädlich — nach dem ersten Mal passiert nichts.
 */
export function ladeGoogleTag(): void {
  if (typeof window === "undefined") return;
  if (geladen || window.gtag) return;
  if (!marketingErlaubt()) return;

  geladen = true;

  // Offizieller Google-Schnipsel. `arguments` statt Restparameter ist Absicht:
  // gtag.js erkennt Befehle nur als Arguments-Objekt, ein Array ignoriert es.
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  // Consent Mode v2: Google verlangt für Nutzer im EWR ein ausdrückliches
  // Signal. Geladen wird nur nach Zustimmung, also ist Werbung erlaubt.
  // Analytics nutzen wir nicht, das bleibt abgelehnt.
  window.gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);

  const skript = document.createElement("script");
  skript.async = true;
  skript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(skript);
}

function melde(sendTo: string, parameter?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!marketingErlaubt()) return;

  // Ein Formular kann schneller melden, als der GoogleTagLader seinen Effekt
  // ausführt (z. B. die LinkedIn-Bewerbung direkt beim Seitenaufbau). Dann
  // hier laden — gtag puffert das Ereignis, bis das Skript da ist.
  ladeGoogleTag();
  window.gtag?.("event", "conversion", { send_to: sendTo, ...parameter });
}

/**
 * Meldet eine erfolgreich verschickte Anfrage oder Bewerbung.
 * `quelle` unterscheidet in Google Ads, welches Formular es war.
 */
export function meldeKontaktConversion(quelle: string): void {
  melde(CONVERSION.kontakt, { quelle });
}

/** Meldet einen Klick auf einen Telefon- oder WhatsApp-Link. */
export function meldeTerminConversion(kanal: "telefon" | "whatsapp"): void {
  // Ein Klick auf wa.me verlässt oft die Seite. `beacon` sorgt dafür, dass die
  // Meldung trotzdem noch rausgeht.
  melde(CONVERSION.termin, { kanal, transport_type: "beacon" });
}

/** Ordnet einen Link-Ziel einem Terminkanal zu, sonst `null`. */
export function terminKanal(href: string): "telefon" | "whatsapp" | null {
  const ziel = href.trim().toLowerCase();
  if (ziel.startsWith("tel:")) return "telefon";
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|(www\.)?whatsapp\.com)\//.test(ziel)) return "whatsapp";
  if (ziel.startsWith("whatsapp:")) return "whatsapp";
  return null;
}
