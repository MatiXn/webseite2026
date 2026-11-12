// Google Ads Conversion-Tracking — nur nach erteilter Marketing-Einwilligung.
//
// Seit 12.11.2026 lädt der Code kein eigenes gtag.js mehr für
// AW-10801717598: Der Google-Tag für Ads liegt im GTM-Container (lib/gtm.ts).
// Der Container kennt aber die Conversion-Labels für Kontakt und Termin nicht.
// Deshalb legt dieser Code die Conversions als gtag-Befehle in den dataLayer,
// und der Google-Tag im Container verarbeitet sie.
//
// 1. Ohne Einwilligung wird nichts gemeldet und nichts geladen.
// 2. Conversions werden erst nach bestätigtem Versand gemeldet, nie beim
//    Öffnen eines Formulars.
//
// An Google gehen nur Ereignisnamen. Keine Namen, keine Telefonnummern, keine
// E-Mail-Adressen.

import { marketingErlaubt } from "./consent";
import { ladeGtm, stelleGtagBereit } from "./gtm";

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

function melde(sendTo: string, parameter?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!marketingErlaubt()) return;

  // Ein Formular kann schneller melden, als der GoogleTagLader seinen Effekt
  // ausführt (z. B. die LinkedIn-Bewerbung direkt beim Seitenaufbau). Dann
  // hier laden. Der Befehl wartet im dataLayer, bis der Container da ist.
  ladeGtm();
  stelleGtagBereit();
  window.gtag!("event", "conversion", { send_to: sendTo, ...parameter });
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
