// Kältetechniker – published (Candidate Sprint 01A). Kandidatenorientierte
// Landingpage über die bestehende Profession Engine. Sachlich, keine erfundenen
// Zahlen/Gehälter/Benefits. Aussagen zu Reise/Bereitschaft/Wochenende/Firmenwagen
// erscheinen NUR jobbezogen (in den echten Stellen), nie als pauschales Versprechen.
//
// Matching bewusst über den strukturierten Tag "Kältetechnik": dieser Tag liegt exakt
// auf den vier echten Kältetechnik-Stellen (Jobs 2, 15, 20, 25) und auf keiner anderen
// Stelle. Kein category-Filter (würde alle Mechatronik-Jobs ziehen), keine breiten
// Keywords (Service/Wartung/Klima/Anlage) → 0 False Positives. Analyse siehe Bericht.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";
import { contact } from "../contact";

export const kaeltetechniker = {
  slug: "kaeltetechniker",
  name: "Kältetechniker",
  shortName: "Kältetechnik",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "mechatronik", // primäre Kategorie der Kälte-Stellen (Matching läuft über jobMatch)

  metadataTitle: "Kältetechniker Jobs in Festanstellung | PHE-Perm",
  metadataDescription:
    "Finde passende Kältetechniker Jobs in Festanstellung – Service, Wartung und Inbetriebnahme von Kälte- und Klimaanlagen. Direktvermittlung, keine Zeitarbeit.",
  canonicalPath: "/berufe/kaeltetechniker",
  primaryKeyword: "Kältetechniker Jobs",
  secondaryKeywords: [
    "Kältetechniker Stellenangebote",
    "Kältetechniker Festanstellung",
    "Mechatroniker Kältetechnik Jobs",
    "Servicetechniker Kältetechnik Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Für Kältetechniker · Direktvermittlung",
    headline: "Kältetechniker (m/w/d) gesucht – Jobs in Festanstellung",
    intro:
      "Wir vermitteln Kältetechniker, Kältemechatroniker und Servicetechniker der Kältetechnik direkt in Festanstellung – keine Zeitarbeit, persönlich und vertraulich. Wir stellen Sie nur bei passenden Stellen vor, nicht wahllos weiter.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Passende Kältetechnik-Stellen ansehen", href: "#stellen" },
  },

  overview: {
    title: "Kältetechniker: Aufgaben und häufige Wechselgründe",
    paragraphs: [
      "Kältetechniker installieren, warten und reparieren Kälte-, Klima- und Lüftungsanlagen – von der Gewerbekälte über Tiefkühlung bis zur Industriekälte. Viele Positionen umfassen technischen Kundendienst und Service direkt beim Kunden.",
      "Viele Kältetechniker wechseln, weil sie eine feste Anstellung ohne Zeitarbeit, kürzere Anfahrtswege oder ein passenderes Einsatzgebiet suchen. Ob eine Stelle regional ist, mit Firmenwagen oder ohne Übernachtung, hängt von der jeweiligen Position ab – das klären wir vorab transparent.",
    ],
  },

  specializations: [
    { title: "Servicetechniker Kältetechnik", focus: ["Wartung von Kälte- und Klimaanlagen", "Störungsdiagnose", "Kundendienst vor Ort"] },
    { title: "Mechatroniker für Kältetechnik", focus: ["Gewerbe- und Industriekälte", "Inbetriebnahme", "Instandhaltung"] },
    { title: "Kälteanlagenbauer", focus: ["Aufbau und Montage von Kälteanlagen", "Kältemittel-Handling", "Rohrleitungsbau"] },
  ],

  tasks: [
    "Wartung von Kälte- und Klimaanlagen",
    "Störungsdiagnose und Reparatur",
    "Inbetriebnahme",
    "Kältemittel-Handling",
    "Dichtheitsprüfungen",
    "technischer Kundendienst / Service vor Ort",
    "Dokumentation",
  ],

  industries: [
    { name: "Kälte- und Klimatechnik", note: "Service und Bau von Kälte-, Klima- und Lüftungsanlagen." },
    { name: "Gewerbe- und Industriekälte", note: "Kälteanlagen in Handel, Produktion und Prozessindustrie." },
    { name: "Tiefkühl- und Kühlkettenlogistik", note: "Kältetechnik für Tiefkühlung und Kühlketten." },
    { name: "Gebäudetechnik", note: "Klima- und Lüftungstechnik in Gebäuden." },
    { name: "Technischer Kundendienst", note: "Serviceeinsätze bei Kunden vor Ort." },
  ],

  requirements: [
    { label: "abgeschlossene Ausbildung in der Kälte-/Klimatechnik", hint: "z. B. Mechatroniker für Kältetechnik" },
    { label: "Sachkunde nach ChemKlimaschutzV", hint: "je nach Stelle" },
    { label: "Führerschein", hint: "bei Außendienst-/Servicerollen" },
    { label: "Reisebereitschaft", hint: "je nach Stelle" },
    { label: "selbstständige Arbeitsweise" },
    { label: "Kundenorientierung" },
    { label: "Deutschkenntnisse", hint: "je nach Kundenkontakt" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Sie arbeiten in der Kältetechnik und suchen etwas Passendes?",
    text: "Melden Sie sich unverbindlich – gern per WhatsApp. Wir besprechen vertraulich Ihre Erfahrung, Ihr Wunsch-Einsatzgebiet und Ihre Ziele und stellen Sie nur bei passenden Stellen vor.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Lebenslauf senden", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Kältetechniker für Ihr Unternehmen?",
    text: "PHE-Perm unterstützt Unternehmen der Kälte- und Klimatechnik bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Kältetechniker anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Vermittelt PHE-Perm Kältetechniker ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Ist die Kontaktaufnahme vertraulich?", a: "Ja. Ihre Angaben behandeln wir vertraulich; wir stellen Sie erst nach Ihrer ausdrücklichen Zustimmung bei einem Unternehmen vor." },
    { q: "Muss ich für jede Stelle bundesweit reisen?", a: "Nein, das hängt von der jeweiligen Stelle ab. Es gibt regionale Positionen ebenso wie Stellen mit Außendienst; den Reiseanteil klären wir vor einer Vorstellung." },
    { q: "Gibt es Stellen ohne Wochenend- oder Bereitschaftsdienst?", a: "Das unterscheidet sich je nach Position. Ob Bereitschaft oder Wochenendarbeit anfällt, besprechen wir vorab transparent – wir stellen Sie nur bei Stellen vor, die zu Ihren Vorstellungen passen." },
    { q: "Kann ich mich melden, obwohl ich aktuell nicht aktiv suche?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil mit passenden Positionen ab und melden uns persönlich." },
    { q: "Entstehen mir als Kandidat Kosten?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Werden meine Unterlagen ohne Zustimmung weitergegeben?", a: "Nein. Wir geben Ihre Unterlagen nur nach ausdrücklicher Absprache an ein Unternehmen weiter." },
  ],

  internalLinks: {
    parent: "/berufe",
    jobs: "/jobs",
    lebenslauf: "/lebenslauf-erstellen",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    // Fachlich verwandte, veröffentlichte Berufe (Kältemechatronik / Kälte-Service).
    relatedProfessions: ["mechatroniker", "servicetechniker"],
  },

  // Strukturierter Tag "Kältetechnik" – exklusiv auf den echten Kälte-Stellen (2,15,20,25).
  jobMatch: {
    tags: ["Kältetechnik"],
    maxJobs: 6,
    fallback: "hint-and-joblist",
  },

  publication: {
    published: true,
    indexable: true,
    includeInSitemap: true,
    showInProfessionHub: true,
    showRelatedLinks: true,
  },
} as const satisfies ProfessionContent;
