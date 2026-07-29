// Servicetechniker – published (EPIC 007C). Sachliche, kuratierte Inhalte;
// keine erfundenen Zahlen/Garantien. jobMatch bewusst tag-/keyword-basiert
// (Servicestellen spannen elektro + mechatronik) – siehe Matching-Begründung unten.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";

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
    eyebrow: "Berufsbild · Servicetechnik",
    headline: "Servicetechniker Jobs in Festanstellung",
    intro:
      "Servicetechniker warten, reparieren und nehmen technische Anlagen beim Kunden vor Ort in Betrieb. PHE-Perm vermittelt passende Positionen direkt in Festanstellung und begleitet Bewerber persönlich.",
    primaryCta: { label: "Aktuelle Servicetechniker Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Persönlich beraten lassen", href: "/kontakt" },
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
    title: "Du suchst eine neue Stelle als Servicetechniker?",
    text: "Sieh dir die aktuellen Positionen an oder sprich direkt mit uns über deine Erfahrung, deinen gewünschten Einsatzbereich und deine beruflichen Ziele.",
    primaryCta: { label: "Servicetechniker Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Lebenslauf kostenlos erstellen", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Servicetechniker für Ihr Unternehmen?",
    text: "PHE-Perm unterstützt Industrie- und Serviceunternehmen bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Servicetechniker anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Welche Servicetechniker Jobs vermittelt PHE-Perm?", a: "Positionen in Wartung, Instandhaltung, Inbetriebnahme und technischem Kundendienst – unter anderem in Kälte- und Klimatechnik, Elektro- und Anlagentechnik sowie Mechatronik, ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm Servicetechniker direkt in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Kostet die Vermittlung Bewerber etwas?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Gibt es Servicestellen mit Außendienst?", a: "Ja. Viele Servicepositionen umfassen Kundeneinsätze vor Ort; Reisebereitschaft und Führerschein sind dann je nach Stelle relevant." },
    { q: "Welche Ausbildung wird für Servicetechniker-Stellen benötigt?", a: "In der Regel eine abgeschlossene technische Ausbildung. Die konkreten Anforderungen hängen von der jeweiligen Stelle und dem Einsatzbereich ab." },
    { q: "Können Unternehmen über PHE-Perm Servicetechniker suchen?", a: "Ja. Unternehmen können ihren Bedarf über unsere technische Personalvermittlung anfragen; wir übernehmen die Suche und die persönliche Vorauswahl." },
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
