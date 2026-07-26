// SPS-Programmierer & Automatisierungstechniker – DRAFT (keine Route, kein Hub).
// Werkzeuge (TIA Portal, S7, Codesys …) sachlich und NICHT als pauschal zwingend.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";

export const spsAutomatisierung = {
  slug: "sps-automatisierung",
  name: "SPS-Programmierer und Automatisierungstechniker",
  shortName: "SPS & Automatisierung",
  status: "draft",
  parentSlug: "berufe",
  jobCategory: "it", // in der Job-Datenquelle liegt die SPS-Stelle in Kategorie "it"

  metadataTitle: "SPS-Programmierer Jobs in Festanstellung | PHE-Perm",
  metadataDescription:
    "Finde passende SPS-Programmierer Jobs in Automatisierung, Inbetriebnahme, Steuerungstechnik und Anlagenbau – direkt in Festanstellung.",
  canonicalPath: "/berufe/sps-automatisierung",
  primaryKeyword: "SPS-Programmierer Jobs",
  secondaryKeywords: [
    "Automatisierungstechniker Jobs",
    "SPS Jobs Festanstellung",
    "Steuerungstechniker Stellenangebote",
    "Inbetriebnehmer Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Berufsbild · Automatisierung",
    headline: "SPS-Programmierer Jobs in Festanstellung",
    intro:
      "SPS-Programmierer und Automatisierungstechniker programmieren, nehmen in Betrieb und optimieren automatisierte Anlagen. PHE-Perm vermittelt passende Positionen direkt in Festanstellung und begleitet Bewerber persönlich.",
    primaryCta: { label: "Aktuelle SPS-Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Persönlich beraten lassen", href: "/kontakt" },
  },

  overview: {
    title: "Was macht ein SPS-Programmierer?",
    paragraphs: [
      "SPS-Programmierer und Automatisierungstechniker entwickeln und pflegen die Steuerungen automatisierter Anlagen: Sie programmieren Steuerungen, nehmen Anlagen in Betrieb, analysieren Fehler und optimieren Abläufe. Häufig gehören Visualisierung und HMI sowie die technische Abstimmung mit Mechanik, Elektrik und Kunden dazu.",
      "Die konkreten Werkzeuge und Schwerpunkte hängen von Stelle und Anlage ab – von der Steuerungsprogrammierung über die Inbetriebnahme bis zur Anlagenoptimierung.",
    ],
  },

  specializations: [
    { title: "Steuerungsprogrammierung", focus: ["SPS-Programmierung", "Steuerungs- und Regelungstechnik", "Visualisierung", "HMI"] },
    { title: "Inbetriebnahme", focus: ["Inbetriebnahme vor Ort", "Fehleranalyse", "Anlagenoptimierung", "technische Abstimmung"] },
    { title: "Typische Umgebungen", description: "Kenntnisse sind je nach Stelle relevant, nicht pauschal zwingend.", focus: ["Siemens S7", "TIA Portal", "WinCC", "Beckhoff", "Codesys", "HMI"] },
  ],

  tasks: [
    "SPS-Programmierung",
    "Inbetriebnahme",
    "Steuerungs- und Regelungstechnik",
    "Fehleranalyse",
    "Visualisierung und HMI",
    "Anlagenoptimierung",
    "Dokumentation",
    "technische Abstimmung",
  ],

  industries: [
    { name: "Maschinen- und Anlagenbau", note: "Steuerung und Inbetriebnahme von Maschinen und Anlagen." },
    { name: "Produktionsautomatisierung", note: "Automatisierte Fertigungs- und Produktionslinien." },
    { name: "Prozessindustrie", note: "Steuerungs- und Regelungstechnik in Prozessanlagen." },
    { name: "Sondermaschinenbau", note: "Individuelle Automatisierungslösungen." },
  ],

  requirements: [
    { label: "technische Ausbildung oder Weiterbildung im Bereich Automatisierung/Elektrotechnik" },
    { label: "Erfahrung in der SPS-Programmierung", hint: "je nach Stelle" },
    { label: "Kenntnisse gängiger Steuerungsumgebungen", hint: "z. B. TIA Portal, S7, Codesys – je nach Stelle" },
    { label: "Bereitschaft zur Inbetriebnahme vor Ort", hint: "je nach Stelle" },
    { label: "strukturierte Fehleranalyse" },
    { label: "selbstständige Arbeitsweise" },
    { label: "Deutschkenntnisse", hint: "je nach Projekt und Kundenkontakt" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Du suchst eine neue Stelle in der Automatisierung?",
    text: "Sieh dir die aktuellen Positionen an oder sprich direkt mit uns über deine Erfahrung, deine Steuerungsumgebungen und deine beruflichen Ziele.",
    primaryCta: { label: "SPS-Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Lebenslauf kostenlos erstellen", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen SPS-Programmierer oder Automatisierungstechniker?",
    text: "PHE-Perm unterstützt Unternehmen bei der Suche und persönlichen Vorqualifizierung von Automatisierungsfachkräften für Festanstellungen.",
    primaryCta: { label: "Automatisierungsfachkraft anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Welche SPS- und Automatisierungs-Jobs vermittelt PHE-Perm?", a: "Positionen in Steuerungsprogrammierung, Inbetriebnahme, Steuerungs- und Regelungstechnik sowie Anlagenoptimierung – ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm direkt in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Kostet die Vermittlung Bewerber etwas?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Welche Steuerungsumgebungen sind gefragt?", a: "Je nach Stelle sind Kenntnisse in gängigen Umgebungen wie TIA Portal, Siemens S7 oder Codesys von Vorteil. Sie werden nicht pauschal für alle Positionen vorausgesetzt." },
    { q: "Gehört Inbetriebnahme vor Ort dazu?", a: "Bei vielen Positionen ja. Ob und in welchem Umfang, hängt von der jeweiligen Stelle ab." },
    { q: "Können Unternehmen über PHE-Perm Automatisierungsfachkräfte suchen?", a: "Ja. Unternehmen können ihren Bedarf über unsere technische Personalvermittlung anfragen; wir übernehmen die Suche und die persönliche Vorauswahl." },
  ],

  internalLinks: {
    parent: "/berufe",
    jobs: "/jobs",
    lebenslauf: "/lebenslauf-erstellen",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    relatedProfessions: ["elektroniker"], // nur published Slugs
  },

  // Matching-Begründung: In der Job-Datenquelle liegt die SPS-Stelle strukturiert
  // in Kategorie "it" (aktuell 1 Treffer) – daher category als primäres Signal,
  // zusätzlich eindeutige Titelbegriffe (SPS, Automatisierung, Inbetriebnahme).
  // Ausschluss unspezifischer Softwareentwickler-Stellen, damit keine fachfremden
  // Entwickler-Rollen mitmatchen.
  jobMatch: {
    category: ["it"],
    tags: ["SPS", "Siemens TIA Portal"],
    keywords: ["SPS", "Automatisierung", "Steuerungstechnik", "Inbetriebnahme"],
    excludeKeywords: ["Softwareentwickler", "Applikationsentwickler", "Embedded"],
    maxJobs: 6,
    fallback: "hint-and-joblist",
  },

  publication: {
    published: false,
    indexable: false,
    includeInSitemap: false,
    showInProfessionHub: false,
    showRelatedLinks: false,
  },
} as const satisfies ProfessionContent;
