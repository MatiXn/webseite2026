// Google Tag Manager — lädt ausschließlich nach erteilter Marketing-Einwilligung.
//
// Consent Mode v2 im „Basic"-Modus: Die Standardwerte (alles abgelehnt) setzt
// public/consent-default.js im <head> jeder Seite. gtm.js selbst wird erst nach
// Zustimmung angefordert, denn schon der Abruf überträgt die IP-Adresse an
// Google (VG Hannover, 2025: Einwilligung nach § 25 TDDDG nötig).
//
// Achtung beim Einrichten im Container: Die Google-Ads-Conversions „Kontakt"
// und „Termin" sendet bereits der Code (lib/google-tag.ts). Im Container dürfen
// dafür keine eigenen Ads-Conversion-Tags liegen, sonst wird doppelt gezählt.
// Jedes neue Tag mit neuem Zweck oder Empfänger (z. B. GA4) braucht Banner-,
// Datenschutz- und ggf. CSP-Anpassung.

import { marketingErlaubt } from "./consent";

/** Container-ID. Nicht geheim — sie steht in jedem Seitenquelltext. */
export const GTM_ID = "GTM-WQZKFVDF";

let geladen = false;

/** Legt dataLayer und gtag an, falls consent-default.js (noch) nicht lief. */
export function stelleGtagBereit(): void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}

/**
 * Meldet die Entscheidung aus dem Banner an Google (Consent Mode v2).
 * Analytics bleibt abgelehnt — die Website setzt kein Google Analytics ein.
 */
export function sendeGoogleConsent(marketing: boolean): void {
  if (typeof window === "undefined") return;
  // Ohne geladenes Google-Skript und ohne Zustimmung gibt es nichts zu melden.
  if (!marketing && !window.gtag) return;

  stelleGtagBereit();
  const wert = marketing ? "granted" : "denied";
  window.gtag!("consent", "update", {
    ad_storage: wert,
    ad_user_data: wert,
    ad_personalization: wert,
  });
}

/**
 * Lädt den GTM-Container. Mehrfachaufrufe sind unschädlich.
 */
export function ladeGtm(): void {
  if (typeof window === "undefined") return;
  if (geladen) return;
  if (!marketingErlaubt()) return;

  geladen = true;

  // Zustimmung vor dem Start-Ereignis melden, damit die Tags sie sehen.
  sendeGoogleConsent(true);
  window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const skript = document.createElement("script");
  skript.async = true;
  skript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(skript);
}
