// Globale, unternehmensweite FAQs – KEINE berufs- oder stadtspezifischen Fragen.
// Sachlich, ohne erfundene Zahlen, Preise oder Garantien.

export type FaqEntry = {
  readonly q: string;
  readonly a: string;
};

export type Faq = readonly FaqEntry[];

export const globalFaq = [
  {
    q: "Was ist PHE-Perm Engineering?",
    a: "PHE-Perm Engineering ist eine spezialisierte Personalvermittlung für technische Fachkräfte mit Sitz in Düsseldorf. Wir vermitteln deutschlandweit in unbefristete Festanstellung.",
  },
  {
    q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?",
    a: "Ja. Wir vermitteln ausschließlich direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung.",
  },
  {
    q: "Kostet die Vermittlung Bewerber etwas?",
    a: "Nein. Für Bewerber ist die Vermittlung kostenlos.",
  },
  {
    q: "In welchen Bereichen vermittelt PHE-Perm?",
    a: "In technischen Berufen: Elektrotechnik, Automatisierung und SPS, Mechatronik, Servicetechnik, Kälte- und Klimatechnik, TGA und SHK sowie Engineering.",
  },
  {
    q: "Ist PHE-Perm deutschlandweit tätig?",
    a: "Ja. Unser Sitz ist in Düsseldorf; die Vermittlung erfolgt deutschlandweit.",
  },
  {
    q: "Wie kann ich PHE-Perm erreichen?",
    a: "Telefonisch, per E-Mail, über WhatsApp oder über das Kontaktformular auf der Website.",
  },
] as const satisfies Faq;
