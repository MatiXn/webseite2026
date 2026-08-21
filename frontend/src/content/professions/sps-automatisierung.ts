// SPS-Programmierer & Automatisierungstechniker – published (EPIC 007D).
// Werkzeuge (TIA Portal, S7, Codesys …) sachlich und NICHT als pauschal zwingend.
// jobMatch: strukturiert über Kategorie "it" + Tags (SPS, Siemens TIA Portal) –
// bewusst KEINE freien keywords, da SPS/Automatisierung häufig nur Nebenkompetenz
// in Elektro-/Mechatronikstellen ist (Variante B der Vorab-Analyse, EPIC 007D).
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";

export const spsAutomatisierung = {
  slug: "sps-automatisierung",
  name: "SPS-Programmierer und Automatisierungstechniker",
  shortName: "SPS & Automatisierung",
  status: "published",
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

  // Vertiefung Inbetriebnahme/Service: Für eine eigene Servicetechniker-SPS-Seite
  // trägt der Stellenbestand nicht (eine Stelle). Der Aspekt gehört stattdessen
  // hierher — "sps programmierer jobs" ist laut Search Console die stärkste
  // Anfrage dieses Felds.
  focusSection: {
    title: "Inbetriebnahme und Service an SPS-Anlagen",
    paragraphs: [
      "Programmieren ist die eine Hälfte des Berufs, die Anlage zum Laufen bringen die andere. Bei der Inbetriebnahme trifft das Programm zum ersten Mal auf echte Sensorik, echte Antriebe und echte Toleranzen — und genau dort zeigt sich, ob die Logik trägt. Wer diesen Schritt beherrscht, ist für Arbeitgeber deutlich wertvoller als jemand, der nur im Büro projektiert.",
      "Der Serviceanteil bringt Reisetätigkeit mit sich: zur Inbetriebnahme beim Kunden, zur Störungsbehebung an ausgelieferten Anlagen, zur Optimierung im laufenden Betrieb. Wie viel das ist, unterscheidet sich stark — von der reinen Hausanlage über Tagesreisen bis zu längeren Auslandseinsätzen bei Sondermaschinenbauern. Das ist der Punkt, den wir vor jeder Vorstellung klären.",
    ],
    aspects: [
      { title: "Siemens S7 und TIA Portal", text: "Der verbreitetste Stack im deutschen Maschinenbau. Erfahrung damit öffnet die meisten Türen; wer aus einer anderen Welt kommt, wird meist eingearbeitet." },
      { title: "Von der Simulation zur Anlage", text: "Fehler, die in der Simulation nicht auftreten, zeigen sich erst an der realen Anlage: Timing, Sensorprellen, mechanische Toleranzen. Systematisches Vorgehen ist hier wichtiger als Programmiergeschwindigkeit." },
      { title: "Störungsbehebung im laufenden Betrieb", text: "An einer produzierenden Anlage wird unter Zeitdruck gesucht. Wer Diagnosebausteine und Anlagendokumentation zu nutzen weiß, spart dem Kunden Stunden." },
      { title: "Reiseanteil und Auslöse", text: "Von der festen Hausanlage bis zu Auslandsinbetriebnahmen ist alles vertreten. Umfang, Auslöse und Heimfahrtregelung stehen in der jeweiligen Stelle." },
    ],
  },

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
    relatedProfessions: ["elektroniker", "mechatroniker"], // nur published Ziele
  },

  // Matching-Begründung: In der Job-Datenquelle liegt die SPS-Stelle strukturiert
  // in Kategorie "it" (aktuell 1 Treffer) – daher category als primäres Signal,
  // zusätzlich eindeutige Titelbegriffe (SPS, Automatisierung, Inbetriebnahme).
  // Ausschluss unspezifischer Softwareentwickler-Stellen, damit keine fachfremden
  // Entwickler-Rollen mitmatchen.
  jobMatch: {
    category: ["it"],
    tags: ["SPS", "Siemens TIA Portal"],
    excludeKeywords: ["Softwareentwickler", "Applikationsentwickler", "Embedded"],
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
