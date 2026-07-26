// Unternehmensphilosophie – keine Marketingtexte, keine erfundenen Aussagen.
// Basis: die freigegebenen Grundsätze der Geschäftsführung und belegte Modell-
// Fakten (Direktvermittlung, keine Zeitarbeit, kostenlos für Bewerber).

export type Trust = {
  readonly mission: string;
  readonly vision: string;
  readonly values: readonly string[];
  readonly principles: readonly string[]; // Grundsätze der Geschäftsführung
  readonly model: readonly string[]; // belegte Fakten zum Vermittlungsmodell
};

export const trust = {
  mission:
    "Technische Fachkräfte persönlich und passgenau in unbefristete Festanstellung vermitteln.",
  vision:
    "Personalvermittlung, die Bewerber als Menschen behandelt und Unternehmen langfristig begleitet.",
  values: [
    "Qualität vor Quantität",
    "Ehrliche Kommunikation",
    "Persönliche Betreuung",
    "Langfristige Partnerschaft",
  ],
  principles: [
    "Der Bewerber ist kein Produkt.",
    "Wir stellen nur passende Positionen vor.",
    "Qualität vor Quantität.",
    "Ehrliche Kommunikation.",
    "Wir übernehmen nur Positionen, bei denen wir echten Mehrwert liefern können.",
    "Wir lernen Unternehmen langfristig kennen.",
  ],
  model: [
    "Direktvermittlung in unbefristete Festanstellung",
    "Keine Zeitarbeit",
    "Keine Arbeitnehmerüberlassung",
    "Persönliche Vorqualifizierung",
    "Für Bewerber kostenlos",
    "Deutschlandweit tätig",
  ],
} as const satisfies Trust;
