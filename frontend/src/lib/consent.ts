// Cookie- und Tracking-Einwilligung, site-weit.
//
// Bis Version 1 gab es hier nur einen Hinweisbanner ohne Wahlmöglichkeit —
// die Website setzte kein Tracking ein. Mit dem Meta-Pixel auf den
// Recruiting-Landingpages gibt es erstmals eine echte Entscheidung, deshalb
// Version 2 mit eigenem Speicherschlüssel: Wer damals nur „Verstanden"
// geklickt hat, hat Marketing nie zugestimmt und muss erneut gefragt werden.

const SPEICHER_SCHLUESSEL = "phe_consent_v2";

/** Wird ausgelöst, sobald sich die Einwilligung ändert. */
export const CONSENT_EREIGNIS = "phe-consent-geaendert";

export type Consent = {
  /** Marketing- und Trackingdienste, insbesondere Meta-Pixel. */
  marketing: boolean;
  /** Zeitpunkt der Entscheidung, ISO-8601. */
  zeitpunkt: string;
};

/** Gibt `null` zurück, wenn noch keine Entscheidung getroffen wurde. */
export function leseConsent(): Consent | null {
  if (typeof window === "undefined") return null;

  try {
    const roh = window.localStorage.getItem(SPEICHER_SCHLUESSEL);
    if (!roh) return null;

    const daten = JSON.parse(roh) as unknown;
    if (
      typeof daten === "object" &&
      daten !== null &&
      typeof (daten as Consent).marketing === "boolean"
    ) {
      return daten as Consent;
    }
  } catch {
    // Defekter Eintrag: wie „noch nicht gefragt" behandeln.
  }

  return null;
}

/** Kurzform für die Stelle, an der es fast immer gebraucht wird. */
export function marketingErlaubt(): boolean {
  return leseConsent()?.marketing === true;
}

export function setzeConsent(marketing: boolean): void {
  if (typeof window === "undefined") return;

  const consent: Consent = { marketing, zeitpunkt: new Date().toISOString() };

  try {
    window.localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(consent));
  } catch {
    // Privater Modus ohne Speicher: Die Entscheidung gilt dann nur für diese
    // Sitzung. Das Ereignis wird trotzdem ausgelöst, damit der Pixel greift.
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EREIGNIS, { detail: consent }));
}
