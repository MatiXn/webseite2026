// Elektroniker – published. Inhalte 1:1 aus der bestehenden, freigegebenen Seite
// /berufe/elektroniker übertragen (keine neuen Formulierungen erfunden).
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";

export const elektroniker = {
  slug: "elektroniker",
  name: "Elektroniker",
  shortName: "Elektroniker",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "elektro",

  metadataTitle: "Elektroniker Jobs in Festanstellung | PHE-Perm",
  metadataDescription:
    "Finde passende Elektroniker Jobs in Betriebstechnik, Automatisierung, Instandhaltung, Service und Industrie – persönlich begleitet und direkt in Festanstellung.",
  canonicalPath: "/berufe/elektroniker",
  primaryKeyword: "Elektroniker Jobs",
  secondaryKeywords: [
    "Elektroniker Stellenangebote",
    "Elektroniker Festanstellung",
    "Elektroniker Betriebstechnik Jobs",
    "Betriebselektriker Jobs",
    "Industrieelektriker Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Berufsbild · Elektrotechnik",
    headline: "Elektroniker Jobs in Festanstellung",
    intro:
      "Elektroniker werden in Industrie, Service, Instandhaltung, Automatisierung und Gebäudetechnik gebraucht. PHE-Perm vermittelt passende Positionen direkt in Festanstellung und begleitet Bewerber persönlich vom ersten Gespräch bis zur Vertragsentscheidung.",
    primaryCta: { label: "Aktuelle Elektroniker Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Persönlich beraten lassen", href: "/kontakt" },
  },

  overview: {
    title: "Was macht ein Elektroniker?",
    paragraphs: [
      "Elektroniker installieren, warten und reparieren elektrische Anlagen und Betriebsmittel. Sie suchen Störungen strukturiert ein, setzen Anlagen instand, prüfen sie nach den geltenden Vorschriften und dokumentieren ihre Arbeit. Je nach Einsatz arbeiten sie an Maschinen, Produktionsanlagen, Schaltschränken oder an der Gebäudetechnik – im Team mit Produktion, Service oder Projektleitung.",
      "Nicht jeder Elektroniker hat dieselben Aufgaben: In der Betriebstechnik steht die Instandhaltung von Produktionsanlagen im Vordergrund, in der Automatisierungstechnik die Steuerungstechnik und Inbetriebnahme, in der Energie- und Gebäudetechnik die Installation gebäudetechnischer Anlagen. Die konkreten Schwerpunkte hängen von Fachrichtung und Stelle ab.",
    ],
  },

  specializations: [
    { title: "Elektroniker für Betriebstechnik", focus: ["Produktionsanlagen", "Energieversorgung", "Wartung und Instandhaltung", "Fehlersuche", "elektrische Betriebsmittel"] },
    { title: "Elektroniker für Automatisierungstechnik", focus: ["automatisierte Anlagen", "Sensorik", "Steuerungs- und Regelungstechnik", "SPS-nahe Tätigkeiten", "Inbetriebnahme und Fehlersuche"] },
    { title: "Elektroniker für Energie- und Gebäudetechnik", focus: ["elektrische Gebäudeanlagen", "Verteilungen", "Beleuchtung", "Sicherheits- und Gebäudetechnik", "Wartung und Installation"] },
    { title: "Industrie- und Betriebselektriker", focus: ["operative Instandhaltung", "Maschinen und Anlagen", "Störungsbeseitigung", "Prüfungen", "Produktionsunterstützung"] },
  ],

  tasks: [
    "Installation elektrischer Anlagen und Betriebsmittel",
    "Wartung und Instandhaltung",
    "Strukturierte Störungs- und Fehlersuche",
    "Reparatur",
    "Prüfung elektrischer Anlagen nach geltenden Vorschriften",
    "Arbeit an Maschinen, Produktionsanlagen, Schaltschränken und Gebäudetechnik",
    "Dokumentation",
    "Zusammenarbeit mit Produktion, Service und Projektleitung",
  ],

  industries: [
    { name: "Maschinen- und Anlagenbau", note: "Aufbau, Verdrahtung und Inbetriebnahme von Maschinen und Anlagen." },
    { name: "Produktion", note: "Betrieb und Instandhaltung elektrischer Betriebsmittel in der Fertigung." },
    { name: "Automatisierung", note: "Steuerungs- und Regelungstechnik automatisierter Anlagen." },
    { name: "Logistiktechnik", note: "Wartung von Förder-, Sortier- und Verpackungsanlagen." },
    { name: "Energie- und Gebäudetechnik", note: "Verteilungen, Installationen und Sicherheitstechnik in Gebäuden." },
    { name: "Kälte- und Klimatechnik", note: "Elektrik und Steuerung von Kälte-, Klima- und Lüftungsanlagen." },
    { name: "Technischer Service", note: "Fehlersuche, Reparatur und Inbetriebnahme beim Kunden vor Ort." },
    { name: "Instandhaltung", note: "Vorbeugende Wartung und Störungsbeseitigung an Anlagen." },
    { name: "Schaltanlagenbau", note: "Aufbau und Verdrahtung von Schaltschränken und -anlagen." },
  ],

  requirements: [
    { label: "abgeschlossene elektrotechnische Ausbildung" },
    { label: "Berufserfahrung", hint: "je nach Position" },
    { label: "Kenntnisse in Wartung, Instandhaltung oder Montage" },
    { label: "sicheres Lesen von Schaltplänen" },
    { label: "strukturierte Fehlersuche" },
    { label: "Sicherheitsbewusstsein im Umgang mit elektrischen Anlagen" },
    { label: "selbstständige und sorgfältige Arbeitsweise" },
    { label: "Teamfähigkeit" },
    { label: "Führerschein", hint: "falls die Position Fahrten erfordert" },
    { label: "Reisebereitschaft", hint: "nur bei passenden Servicestellen" },
    { label: "Deutschkenntnisse", hint: "abhängig vom Einsatzbereich" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Du suchst eine neue Stelle als Elektroniker?",
    text: "Sieh dir die aktuellen Positionen an oder sprich direkt mit uns über deine Erfahrung, deinen gewünschten Arbeitsort und deine beruflichen Ziele.",
    primaryCta: { label: "Elektroniker Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Lebenslauf kostenlos erstellen", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Elektroniker für Ihr Unternehmen?",
    text: "PHE-Perm unterstützt Industrieunternehmen bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Elektroniker anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Welche Elektroniker Jobs vermittelt PHE-Perm?", a: "Wir vermitteln Positionen für Elektroniker aus Betriebstechnik, Automatisierungstechnik sowie Energie- und Gebäudetechnik und für Betriebs- und Industrieelektriker – in Instandhaltung, Service und Produktion, ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm Elektroniker direkt in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung. Ihren Arbeitsvertrag schließen Sie mit dem Unternehmen." },
    { q: "Kostet die Vermittlung Bewerber etwas?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Welche Ausbildung wird für Elektroniker-Stellen benötigt?", a: "In der Regel eine abgeschlossene elektrotechnische Ausbildung, etwa als Elektroniker für Betriebstechnik, Automatisierungstechnik oder Energie- und Gebäudetechnik. Die konkreten Anforderungen hängen von der jeweiligen Stelle ab." },
    { q: "Gibt es Jobs für Elektroniker in der Instandhaltung?", a: "Ja. Ein Teil der Positionen liegt in Wartung und Instandhaltung von Maschinen, Anlagen und elektrischen Betriebsmitteln. Aktuelle Stellen finden Sie im Stellenbereich dieser Seite." },
    { q: "Vermittelt PHE-Perm auch Servicestellen für Elektroniker?", a: "Ja. Neben Instandhaltung und Produktion vermitteln wir auch Servicepositionen mit elektrotechnischem Schwerpunkt, teils mit Kundeneinsatz vor Ort." },
    { q: "Kann ich mich ohne Anschreiben bewerben?", a: "Ja. Für eine erste Kontaktaufnahme genügen Ihr Name, Ihre Erreichbarkeit und die gewünschte Richtung. Ein Anschreiben ist nicht erforderlich." },
    { q: "Was passiert nach meiner Bewerbung?", a: "Wir melden uns persönlich, klären Ihre Qualifikationen und Wünsche und stimmen passende Positionen mit Ihnen ab, bevor wir Sie einem Unternehmen vorstellen." },
    { q: "Gibt es auch Stellen außerhalb von Düsseldorf?", a: "Ja. PHE-Perm vermittelt deutschlandweit; den Standort der einzelnen Stelle finden Sie jeweils in der Stellenbeschreibung." },
    { q: "Können Unternehmen über PHE-Perm Elektroniker suchen?", a: "Ja. Unternehmen können ihren Bedarf über unsere technische Personalvermittlung anfragen; wir übernehmen die Suche und die persönliche Vorauswahl." },
  ],

  internalLinks: {
    parent: "/berufe",
    jobs: "/jobs",
    lebenslauf: "/lebenslauf-erstellen",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    relatedProfessions: [], // aktuell nur Elektroniker published → keine toten Related-Links
  },

  // Strukturiertes Matching über die Job-Kategorie "elektro" (16 echte Stellen),
  // wie auf der bestehenden Seite – keine unsaubere Volltextsuche.
  jobMatch: {
    category: ["elektro"],
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
