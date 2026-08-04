// Servicetechniker – published (EPIC 007C; Candidate Sprint 02: Conversion-Pass).
// Sachliche, kuratierte Inhalte; keine erfundenen Zahlen/Garantien/Gehälter.
// Sprint 02 verbessert NUR Inhalte (kandidatenorientierter Hero, WhatsApp-CTA über
// die zentrale contact.whatsappLink, rein kandidatenseitige FAQ, maxJobs erhöht) –
// keine Architektur-, Route- oder Template-Änderung. jobMatch unverändert konservativ
// (tag "Service" + Titelbegriffe) – trifft exakt die echten Servicetechniker-Stellen,
// 0 False Positives (siehe Matching-Begründung unten).
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";
import { contact } from "../contact";

export const servicetechniker = {
  slug: "servicetechniker",
  name: "Servicetechniker",
  shortName: "Servicetechniker",
  status: "published",
  parentSlug: "berufe",
  jobCategory: null, // Servicestellen spannen mehrere Kategorien (elektro, mechatronik)

  metadataTitle: "Servicetechniker Jobs in Festanstellung | PHE-Perm",
  metadataDescription:
    "Finde passende Servicetechniker Jobs in Wartung, Inbetriebnahme, Kundendienst und technischem Außendienst – direkt in Festanstellung.",
  canonicalPath: "/berufe/servicetechniker",
  primaryKeyword: "Servicetechniker Jobs",
  secondaryKeywords: [
    "Servicetechniker Stellenangebote",
    "Servicetechniker Festanstellung",
    "Servicetechniker Außendienst Jobs",
    "Kundendiensttechniker Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Für Servicetechniker · Direktvermittlung",
    headline: "Servicetechniker (m/w/d) gesucht – Zeit für einen Job, der wirklich passt",
    intro:
      "Sie warten, reparieren und nehmen Anlagen beim Kunden in Betrieb – und suchen etwas Besseres? Wir vermitteln Servicetechniker direkt in Festanstellung, keine Zeitarbeit. Persönlich, vertraulich und nur bei Stellen, die wirklich zu Ihnen passen.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Aktuelle Servicetechniker-Stellen ansehen", href: "#stellen" },
  },

  overview: {
    title: "Was macht ein Servicetechniker?",
    paragraphs: [
      "Servicetechniker sorgen dafür, dass technische Anlagen zuverlässig laufen: Sie warten und reparieren Maschinen, suchen Störungen, nehmen Anlagen in Betrieb und dokumentieren ihre Arbeit. Viele Positionen umfassen Kundendienst und Außendienst mit Einsatz direkt beim Kunden.",
      "Die Schwerpunkte hängen von Branche und Stelle ab – von Kälte- und Klimatechnik über Elektro- und Anlagentechnik bis zu mechatronischen Systemen. Kundenkommunikation und selbstständiges Arbeiten spielen dabei eine wichtige Rolle.",
    ],
  },

  specializations: [
    { title: "Servicetechniker Kälte- und Klimatechnik", focus: ["Wartung von Kälte- und Klimaanlagen", "Störungsbeseitigung", "Kundendienst vor Ort"] },
    { title: "Servicetechniker Elektro- und Anlagentechnik", focus: ["Inbetriebnahme", "Fehlersuche an Anlagen", "Instandhaltung", "Dokumentation"] },
    { title: "Mechatronischer Service", focus: ["mechatronische Systeme", "Wartung und Reparatur", "Außendienst mit Reisebereitschaft"] },
  ],

  tasks: [
    "Wartung",
    "Instandhaltung",
    "Inbetriebnahme",
    "Fehlersuche",
    "Reparatur",
    "technischer Kundendienst",
    "Außendienst",
    "Dokumentation",
    "Kundenkommunikation",
  ],

  industries: [
    { name: "Maschinenbau", note: "Service an Maschinen und Fertigungsanlagen." },
    { name: "Anlagenbau", note: "Inbetriebnahme und Wartung technischer Anlagen." },
    { name: "Kälte- und Klimatechnik", note: "Service an Kälte-, Klima- und Lüftungsanlagen." },
    { name: "Elektrotechnik", note: "Fehlersuche und Instandsetzung elektrischer Anlagen." },
    { name: "Automatisierung", note: "Service an gesteuerten und automatisierten Systemen." },
    { name: "Pumpen- und Versorgungstechnik", note: "Wartung von Pumpen- und Versorgungsanlagen." },
    { name: "Technische Dienstleistungen", note: "Serviceeinsätze im Auftrag von Dienstleistern." },
    { name: "Industrielle Serviceorganisationen", note: "Kundendienst innerhalb industrieller Serviceteams." },
  ],

  requirements: [
    { label: "technische Ausbildung" },
    { label: "Reisebereitschaft", hint: "je nach Stelle" },
    { label: "Führerschein", hint: "bei Außendienstrollen" },
    { label: "selbstständige Arbeitsweise" },
    { label: "Kundenorientierung" },
    { label: "strukturierte Fehlersuche" },
    { label: "Dokumentation" },
    { label: "Deutschkenntnisse", hint: "je nach Kundenkontakt" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Sie suchen eine neue Stelle als Servicetechniker?",
    text: "Melden Sie sich unverbindlich – gern per WhatsApp. Wir besprechen vertraulich Ihre Erfahrung, Ihr Wunsch-Einsatzgebiet und Ihre Ziele und stellen Sie nur bei passenden Stellen vor.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Lebenslauf senden", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Servicetechniker für Ihr Unternehmen?",
    text: "PHE-Perm unterstützt Industrie- und Serviceunternehmen bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Servicetechniker anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Welche Servicetechniker Jobs vermittelt PHE-Perm?", a: "Positionen in Wartung, Instandhaltung, Inbetriebnahme und technischem Kundendienst – unter anderem in Kälte- und Klimatechnik, Elektro- und Anlagentechnik sowie Mechatronik, ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm Servicetechniker ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Ist die Kontaktaufnahme vertraulich?", a: "Ja. Ihre Angaben behandeln wir vertraulich; wir stellen Sie erst nach Ihrer ausdrücklichen Zustimmung bei einem Unternehmen vor." },
    { q: "Muss ich für jede Stelle bundesweit reisen?", a: "Nein, das hängt von der jeweiligen Stelle ab. Es gibt regionale Positionen ebenso wie Stellen mit Außendienst; den Reiseanteil klären wir vor einer Vorstellung." },
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
    relatedProfessions: ["elektroniker", "mechatroniker"], // nur published Ziele
  },

  // Matching-Begründung: Es gibt KEIN dediziertes "service"-category-Feld – die
  // relevanten Stellen liegen in "elektro" und "mechatronik". Deshalb kein
  // category-Filter, sondern das strukturierte Tag "Service" (auf mehreren Jobs
  // gepflegt) plus der eindeutige Titelbegriff "Servicetechniker"/"Kundendienst".
  // Keine Volltextsuche nach bloßem "Service", um Fehltreffer zu vermeiden.
  jobMatch: {
    tags: ["Service"],
    keywords: ["Servicetechniker", "Kundendienst"],
    maxJobs: 8, // Sprint 02: alle echten Servicetechniker-Treffer (7) sichtbar, keine Beschränkung auf 6
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
