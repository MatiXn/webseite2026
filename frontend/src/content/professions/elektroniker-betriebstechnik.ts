// Elektroniker für Betriebstechnik – published (Candidate Sprint 04).
// Spezialisierte, kandidatenorientierte Landingpage über die BESTEHENDE Profession
// Engine + ProfessionPageTemplate (keine neue Engine, kein Template-Sonderfall).
// Inhaltlich klar abgegrenzt von der generischen /berufe/elektroniker-Seite:
// Fokus Betriebstechnik – industrielle Anlagen, Instandhaltung, Energieversorgung,
// Produktionsanlagen. KEINE Energie-/Gebäudetechnik, MSR/Gebäudeautomation,
// Servicetechnik, Photovoltaik, SPS, Mechatronik.
//
// Matching bewusst präzise (Titelbegriffe + Tag), NICHT category-breit: trifft exakt
// die 7 echten Betriebstechnik-Stellen (Jobs 1, 6, 8, 9, 11, 12, 24), 0 False
// Positives. Schicht-/Vollkonti-Aussagen erscheinen nur jobbezogen (echte Stellen),
// nie als pauschales Versprechen. Keine erfundenen Gehälter/Benefits.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";
import { contact } from "../contact";

export const elektronikerBetriebstechnik = {
  slug: "elektroniker-betriebstechnik",
  name: "Elektroniker für Betriebstechnik",
  shortName: "Betriebstechnik",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "elektro", // primäre Kategorie (Matching läuft präzise über jobMatch)

  metadataTitle: "Elektroniker für Betriebstechnik Jobs | PHE-Perm",
  metadataDescription:
    "Finde passende Jobs als Elektroniker für Betriebstechnik – Instandhaltung, Störungsbeseitigung und Betrieb industrieller Anlagen, direkt in Festanstellung.",
  canonicalPath: "/berufe/elektroniker-betriebstechnik",
  primaryKeyword: "Elektroniker für Betriebstechnik Jobs",
  secondaryKeywords: [
    "Elektroniker Betriebstechnik Stellenangebote",
    "Betriebselektroniker Jobs",
    "Betriebselektriker Jobs",
    "Elektroniker Betriebstechnik Festanstellung",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Für Elektroniker für Betriebstechnik · Direktvermittlung",
    headline: "Elektroniker für Betriebstechnik (m/w/d) – passende Festanstellung finden",
    intro:
      "Sie halten industrielle Anlagen elektrisch am Laufen und suchen etwas Passendes? Wir vermitteln Elektroniker für Betriebstechnik direkt in Festanstellung – keine Zeitarbeit, für Bewerber kostenfrei und vertraulich. Wir stellen Sie nur bei Stellen vor, die wirklich zu Ihnen passen.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Aktuelle Stellen ansehen", href: "#stellen" },
  },

  overview: {
    title: "Elektroniker für Betriebstechnik: Aufgaben und Wechselgründe",
    paragraphs: [
      "Elektroniker für Betriebstechnik sorgen dafür, dass Produktionsanlagen und industrielle Betriebsmittel elektrisch zuverlässig laufen: Instandhaltung und Störungsbeseitigung, Wartung, Schaltschrankbau sowie die Energieversorgung von Maschinen und Anlagen.",
      "Viele wechseln, weil sie eine feste Anstellung ohne Zeitarbeit, planbarere Arbeitszeiten oder ein passenderes Einsatzumfeld suchen. Ob eine Stelle im Schicht- oder vollkontinuierlichen Betrieb liegt oder ohne Schicht auskommt, hängt von der konkreten Position ab – das klären wir vorab transparent.",
    ],
  },

  specializations: [
    { title: "Instandhaltung & Störungsbeseitigung", focus: ["Fehlersuche an Produktionsanlagen", "Reparatur elektrischer Betriebsmittel", "vorbeugende Wartung"] },
    { title: "Schaltschrankbau & Anlagenverdrahtung", focus: ["Verdrahtung nach Stromlaufplan", "Anschluss von Maschinen und Anlagen", "Funktionsprüfung"] },
    { title: "Energieversorgung & Betriebselektrik", focus: ["elektrische Betriebsbereitschaft", "Prüfungen nach DGUV Vorschrift 3", "Dokumentation"] },
  ],

  tasks: [
    "Instandhaltung industrieller Anlagen",
    "Störungsanalyse und -beseitigung",
    "Wartung elektrischer Betriebsmittel",
    "Schaltschrankbau und Verdrahtung",
    "Energieversorgung von Maschinen und Anlagen",
    "Prüfungen nach DGUV Vorschrift 3",
    "Dokumentation",
  ],

  industries: [
    { name: "Produktion und Fertigung", note: "Elektrische Instandhaltung von Produktionsanlagen." },
    { name: "Industrie und Anlagenbau", note: "Betriebstechnik in industriellen Anlagen." },
    { name: "Energieversorgung", note: "Elektrische Versorgung von Maschinen und Betriebsmitteln." },
    { name: "Automobil- und Zulieferindustrie", note: "Instandhaltung automatisierter Fertigung." },
    { name: "Prozess- und Verfahrenstechnik", note: "Betrieb und Instandhaltung von Prozessanlagen." },
  ],

  requirements: [
    { label: "abgeschlossene Ausbildung als Elektroniker für Betriebstechnik", hint: "oder Betriebselektroniker/-elektriker" },
    { label: "Erfahrung in der industriellen Instandhaltung", hint: "je nach Stelle" },
    { label: "Lesen von Stromlauf- und Schaltplänen" },
    { label: "Schichtbereitschaft", hint: "nur bei Schicht-/Vollkonti-Stellen" },
    { label: "selbstständige Arbeitsweise" },
    { label: "Deutschkenntnisse", hint: "je nach Stelle" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Sie sind Elektroniker für Betriebstechnik und suchen etwas Passendes?",
    text: "Melden Sie sich unverbindlich – gern per WhatsApp. Wir besprechen vertraulich Ihre Erfahrung, Ihr Wunsch-Einsatzumfeld und Ihre Ziele und stellen Sie nur bei passenden Stellen vor.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Lebenslauf senden", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Elektroniker für Betriebstechnik?",
    text: "PHE-Perm unterstützt Industrie- und Produktionsunternehmen bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Ist die Vermittlung für Bewerber kostenlos?", a: "Ja. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Gibt es Stellen im Schichtbetrieb?", a: "Ja, es gibt Betriebstechnik-Stellen im Schicht- und im vollkontinuierlichen Betrieb. Ob eine konkrete Stelle Schicht umfasst, steht in der jeweiligen Ausschreibung." },
    { q: "Gibt es auch Stellen ohne Vollkonti oder 3-Schicht?", a: "Ja. Nicht jede Stelle ist Schicht- oder Vollkonti-Betrieb – es gibt auch Positionen mit festen Arbeitszeiten. Die Arbeitszeit stimmen wir vor einer Vorstellung mit Ihnen ab." },
    { q: "Ist die Kontaktaufnahme vertraulich?", a: "Ja. Ihre Angaben behandeln wir vertraulich; wir stellen Sie erst nach Ihrer ausdrücklichen Zustimmung bei einem Unternehmen vor." },
    { q: "Werden meine Unterlagen nur nach Zustimmung weitergegeben?", a: "Ja, ausschließlich. Wir geben Ihre Unterlagen nur nach ausdrücklicher Absprache an ein Unternehmen weiter." },
    { q: "Kann ich mich initiativ melden?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil mit passenden Positionen ab und melden uns persönlich." },
    { q: "Welche Ausbildung wird typischerweise erwartet?", a: "In der Regel eine abgeschlossene elektrotechnische Ausbildung, etwa als Elektroniker für Betriebstechnik, Betriebselektroniker oder Betriebselektriker. Die konkreten Anforderungen hängen von der jeweiligen Stelle ab." },
  ],

  internalLinks: {
    parent: "/berufe",
    jobs: "/jobs",
    lebenslauf: "/lebenslauf-erstellen",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    // Cross-Link zur breiten Elektroniker-Seite (published).
    relatedProfessions: ["elektroniker"],
  },

  // Präzise Betriebstechnik-Strategie (Sprint 04, freigegeben): Titelbegriffe + Tag,
  // KEIN category-Filter. Trifft exakt Jobs 1, 6, 8, 9, 11, 12, 24 – 0 False Positives.
  jobMatch: {
    keywords: ["Betriebstechnik", "Betriebselektroniker", "Betriebselektriker"],
    tags: ["Betriebstechnik"],
    maxJobs: 8,
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
