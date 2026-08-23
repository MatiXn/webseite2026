"use client";

// Bindet den Meta-Pixel ein, sobald eine Marketing-Einwilligung vorliegt.
//
// Zwei Zeitpunkte sind möglich: Die Einwilligung besteht schon beim Laden
// (Wiederkehrer), oder sie wird erst im Banner erteilt. Der zweite Fall ist
// der häufigere — deshalb wird zusätzlich auf das Consent-Ereignis gehört.

import { useEffect } from "react";
import { ladePixel } from "../../lib/meta-pixel";
import { CONSENT_EREIGNIS } from "../../lib/consent";

export default function PixelLader() {
  useEffect(() => {
    ladePixel();

    const beiAenderung = () => ladePixel();
    window.addEventListener(CONSENT_EREIGNIS, beiAenderung);
    return () => window.removeEventListener(CONSENT_EREIGNIS, beiAenderung);
  }, []);

  return null;
}
