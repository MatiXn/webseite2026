"use client";

// Bindet das Google-Tag site-weit ein, sobald eine Marketing-Einwilligung
// vorliegt, und zählt Klicks auf Telefon- und WhatsApp-Links als
// Conversion „Termin vereinbaren".
//
// Wie beim Meta-Pixel (PixelLader) gibt es zwei Zeitpunkte: Einwilligung schon
// beim Laden oder erst später im Banner — deshalb zusätzlich das
// Consent-Ereignis.
//
// Die Klicks werden über einen einzigen Listener am Dokument erfasst statt an
// jedem Link. So zählen auch Links, die später dazukommen, ohne dass jemand
// daran denken muss.

import { useEffect } from "react";
import { CONSENT_EREIGNIS } from "../../lib/consent";
import { ladeGoogleTag, meldeTerminConversion, terminKanal } from "../../lib/google-tag";

export default function GoogleTagLader() {
  useEffect(() => {
    ladeGoogleTag();

    const beiAenderung = () => ladeGoogleTag();

    const beiKlick = (ereignis: MouseEvent) => {
      const link = (ereignis.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const kanal = terminKanal(link.getAttribute("href") ?? "");
      if (kanal) meldeTerminConversion(kanal);
    };

    window.addEventListener(CONSENT_EREIGNIS, beiAenderung);
    document.addEventListener("click", beiKlick, { capture: true });
    return () => {
      window.removeEventListener(CONSENT_EREIGNIS, beiAenderung);
      document.removeEventListener("click", beiKlick, { capture: true });
    };
  }, []);

  return null;
}
