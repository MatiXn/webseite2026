// Branche Automatisierungstechnik – published (EPIC 008C).
// Branchen-/Marktumfeld (Unternehmen, gesuchte Profile), NICHT das Berufsprofil
// (das liegt in der Profession "sps-automatisierung"). Sachlich, ohne erfundene
// Zahlen/Garantien. jobMatch bewusst konservativ: category "it" + Tags SPS/Siemens TIA
// Portal (+ excludeKeywords) trifft ausschließlich die eine echte Automatisierungs-Stelle;
// breitere Signale (Tag/Keyword "Automatisierung") würden allgemeine Elektro-Stellen
// falsch einziehen (Match-Analyse EPIC 008C).
import type { IndustryContent } from "./types";

export const automatisierungstechnik = {
  slug: "automatisierungstechnik",
  name: "Automatisierungstechnik",
  shortName: "Automatisierungstechnik",
  status: "published",
  parentSlug: "branchen",

  metadataTitle: "Personalvermittlung Automatisierungstechnik | PHE-Perm",
  metadataDescription:
    "PHE-Perm vermittelt Fach- und Führungskräfte für die Automatisierungstechnik – SPS, Steuerungs- und Leittechnik sowie Inbetriebnahme – direkt in Festanstellung.",
  canonicalPath: "/branchen/automatisierungstechnik",
  primaryKeyword: "Personalvermittlung Automatisierungstechnik",
  secondaryKeywords: [
    "Automatisierungstechnik Jobs",
    "SPS Personalvermittlung",
    "Fachkräfte Automatisierung",
    "Automatisierungsingenieur Vermittlung",
  ],
  searchIntent: "commercial",

  hero: {
    eyebrow: "Branche · Automatisierungstechnik",
    headline: "Personalvermittlung für die Automatisierungstechnik",
    intro:
      "PHE-Perm ist auf die Vermittlung technischer Fach- und Führungskräfte spezialisiert – auch für die Automatisierungstechnik. Wir vermitteln direkt in Festanstellung an das einstellende Unternehmen, ohne Zeitarbeit und ohne Arbeitnehmerüberlassung.",
    primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Passende Jobs ansehen", href: "/jobs" },
  },

  overview: {
    title: "Automatisierungstechnik als Branche",
    paragraphs: [
      "Die Automatisierungstechnik umfasst die industrielle Automatisierung von Fertigungs- und Prozessanlagen: SPS- und Steuerungstechnik, Prozess- und Produktionsautomation, Mess-, Steuer- und Regelungstechnik, Leittechnik, Robotik sowie die Inbetriebnahme automatisierter Anlagen. Auftraggeber sind typischerweise Unternehmen des Anlagen- und Maschinenbaus, der Produktion und der Prozessindustrie.",
      "Als spezialisierte Personalvermittlung unterstützt PHE-Perm Unternehmen dieser Branche bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte. Typischerweise gesucht werden unter anderem SPS-Programmierer, Automatisierungs- und Elektroingenieure, Inbetriebnehmer sowie MSR- und Leittechnik-Spezialisten. Ob eine konkrete Stelle offen ist, hängt vom jeweiligen Bedarf ab.",
    ],
  },

  focusAreas: [
    { title: "SPS- und Steuerungstechnik", note: "Programmierung, Anpassung und Inbetriebnahme von SPS-Steuerungen." },
    { title: "Prozess- und Produktionsautomation", note: "Automatisierung von Fertigungs-, Prozess- und Produktionsanlagen." },
    { title: "MSR- und Leittechnik", note: "Mess-, Steuer- und Regelungstechnik sowie Prozessleitsysteme." },
    { title: "Robotik und automatisierte Systeme", note: "Robotergestützte und automatisierte Produktionssysteme." },
    { title: "Inbetriebnahme automatisierter Anlagen", note: "Aufbau, Inbetriebnahme und Optimierung automatisierter Anlagen." },
  ],

  faq: [
    { q: "Welche Fachkräfte vermittelt PHE-Perm in der Automatisierungstechnik?", a: "Wir vermitteln technische Fach- und Führungskräfte mit Automatisierungsbezug, etwa SPS-Programmierer, Automatisierungs- und Elektroingenieure, Inbetriebnehmer sowie MSR- und Leittechnik-Spezialisten – ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Für welche Unternehmen ist die Personalvermittlung geeignet?", a: "Für Unternehmen der industriellen Automatisierung, des Anlagen- und Maschinenbaus sowie der Prozess- und Produktionsautomation, die technische Fachkräfte in Festanstellung suchen." },
    { q: "Welche Qualifikationen sind in der Automatisierungstechnik besonders relevant?", a: "Häufig gefragt sind Kenntnisse in SPS- und Steuerungstechnik, Inbetriebnahme sowie MSR- und Leittechnik und Erfahrung mit automatisierten Anlagen. Die konkreten Anforderungen hängen von der jeweiligen Position ab." },
    { q: "Können sich Kandidaten auch ohne konkrete Stellenausschreibung melden?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil mit passenden Positionen ab und melden uns persönlich." },
  ],

  applicantCta: {
    title: "Sie arbeiten in der Automatisierungstechnik?",
    text: "Sehen Sie sich passende Positionen an oder melden Sie sich initiativ – wir stimmen passende Stellen persönlich mit Ihnen ab.",
    primaryCta: { label: "Passende Jobs ansehen", href: "/jobs" },
    secondaryCta: { label: "Lebenslauf kostenlos erstellen", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Fachkräfte für die Automatisierungstechnik?",
    text: "PHE-Perm unterstützt Unternehmen der Automatisierungstechnik bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  internalLinks: {
    parent: "/branchen",
    jobs: "/jobs",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    // Fachlich belastbare, veröffentlichte Berufe mit Automatisierungsbezug:
    // SPS/Automatisierung (Kern), Elektroniker (Fachrichtung Automatisierungstechnik),
    // Mechatroniker (Steuerungstechnik). Servicetechniker bewusst NICHT (zu allgemein).
    relatedProfessions: ["sps-automatisierung", "elektroniker", "mechatroniker"],
  },

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
    showInIndustryHub: true,
    showRelatedLinks: true,
  },
} as const satisfies IndustryContent;
