// Mechatroniker – published. Sachliche Berufsbild-Inhalte, geerdet an den realen
// Mechatronik-Stellen (Montage/Inbetriebnahme, Kälte-/Klimatechnik, Service, Instandhaltung).
// Keine erfundenen Zahlen, Garantien oder Superlative; PHE-Service-Fakten wie bei Elektroniker.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";

export const mechatroniker = {
  slug: "mechatroniker",
  name: "Mechatroniker",
  shortName: "Mechatroniker",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "mechatronik",

  metadataTitle: "Mechatroniker Jobs in Festanstellung | PHE-Perm",
  metadataDescription:
    "Finde passende Mechatroniker Jobs in Montage, Inbetriebnahme, Kälte- und Klimatechnik, Service und Instandhaltung – direkt in Festanstellung, persönlich begleitet.",
  canonicalPath: "/berufe/mechatroniker",
  primaryKeyword: "Mechatroniker Jobs",
  secondaryKeywords: [
    "Mechatroniker Stellenangebote",
    "Mechatroniker Festanstellung",
    "Mechatroniker Kältetechnik Jobs",
    "Servicetechniker Mechatronik Jobs",
    "Mechatroniker Inbetriebnahme Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Berufsbild · Mechatronik",
    headline: "Mechatroniker Jobs in Festanstellung",
    intro:
      "Mechatroniker verbinden Mechanik, Elektronik und Steuerungstechnik. Sie werden in Montage, Inbetriebnahme, Service, Kälte- und Klimatechnik sowie Instandhaltung gebraucht. PHE-Perm vermittelt passende Positionen direkt in Festanstellung und begleitet Bewerber persönlich vom ersten Gespräch bis zur Vertragsentscheidung.",
    primaryCta: { label: "Aktuelle Mechatroniker Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Persönlich beraten lassen", href: "/kontakt" },
  },

  overview: {
    title: "Was macht ein Mechatroniker?",
    paragraphs: [
      "Mechatroniker bauen, montieren und warten Maschinen und Anlagen, in denen Mechanik, Elektronik und Steuerungstechnik zusammenwirken. Sie nehmen Anlagen in Betrieb, suchen Störungen strukturiert ein, tauschen mechanische und elektronische Komponenten und dokumentieren ihre Arbeit. Je nach Einsatz arbeiten sie in der Fertigung, im Anlagenbau oder im technischen Service beim Kunden vor Ort.",
      "Nicht jeder Mechatroniker hat dieselben Aufgaben: In der Montage und Inbetriebnahme steht der Aufbau neuer Anlagen im Vordergrund, in der Kälte- und Klimatechnik die Wartung und Störungsbeseitigung, im Service der Einsatz beim Kunden. Die konkreten Schwerpunkte hängen von Fachrichtung und Stelle ab.",
    ],
  },

  specializations: [
    { title: "Mechatroniker Montage & Inbetriebnahme", focus: ["Baugruppenmontage", "Verdrahtung", "Inbetriebnahme", "Funktionsprüfung", "Fehlersuche"] },
    { title: "Mechatroniker Kälte- und Klimatechnik", focus: ["Kälteanlagen", "Klimaanlagen", "HKLS", "Wartung", "Störungsbeseitigung"] },
    { title: "Servicetechniker Mechatronik", focus: ["Außendienst", "Kundeneinsatz", "Wartung und Reparatur", "Inbetriebnahme vor Ort", "Fehlersuche"] },
    { title: "Mechatroniker Instandhaltung", focus: ["vorbeugende Wartung", "Störungsbeseitigung", "Maschinen und Anlagen", "Ersatzteile", "Anlagenverfügbarkeit"] },
  ],

  tasks: [
    "Montage von Baugruppen, Maschinen und Anlagen",
    "Verdrahtung und elektrische Installation",
    "Inbetriebnahme von Maschinen und Anlagen",
    "Strukturierte Störungs- und Fehlersuche",
    "Wartung und Instandhaltung",
    "Austausch mechanischer und elektronischer Komponenten",
    "Prüfung und Funktionskontrolle",
    "Dokumentation der durchgeführten Arbeiten",
  ],

  industries: [
    { name: "Maschinen- und Anlagenbau", note: "Montage, Verdrahtung und Inbetriebnahme von Maschinen und Anlagen." },
    { name: "Kälte- und Klimatechnik", note: "Wartung, Service und Störungsbeseitigung an Kälte- und Klimaanlagen." },
    { name: "Produktion und Fertigung", note: "Betrieb und Instandhaltung mechatronischer Anlagen in der Fertigung." },
    { name: "Automatisierung", note: "Mechanik, Elektronik und Steuerungstechnik automatisierter Anlagen." },
    { name: "Technischer Service", note: "Fehlersuche, Reparatur und Inbetriebnahme beim Kunden vor Ort." },
    { name: "Instandhaltung", note: "Vorbeugende Wartung und Störungsbeseitigung an Anlagen." },
    { name: "Anlagentechnik", note: "Aufbau und Wartung technischer Anlagen und Baugruppen." },
    { name: "Gebäude- und Versorgungstechnik", note: "Mechatronische Komponenten in HKLS- und Gebäudetechnik." },
    { name: "Montage und Inbetriebnahme", note: "Aufbau, Funktionsprüfung und Übergabe neuer Anlagen." },
  ],

  requirements: [
    { label: "abgeschlossene mechatronische oder vergleichbare technische Ausbildung" },
    { label: "Berufserfahrung", hint: "je nach Position" },
    { label: "Kenntnisse in Montage, Wartung oder Inbetriebnahme" },
    { label: "Verständnis von Mechanik, Elektronik und Steuerungstechnik" },
    { label: "sicheres Lesen technischer Zeichnungen und Schaltpläne" },
    { label: "strukturierte Fehlersuche" },
    { label: "Sicherheitsbewusstsein im Umgang mit Maschinen und elektrischen Anlagen" },
    { label: "selbstständige und sorgfältige Arbeitsweise" },
    { label: "Teamfähigkeit" },
    { label: "Führerschein", hint: "falls die Position Außendienst erfordert" },
    { label: "Reisebereitschaft", hint: "nur bei passenden Servicestellen" },
    { label: "Deutschkenntnisse", hint: "abhängig vom Einsatzbereich" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Du suchst eine neue Stelle als Mechatroniker?",
    text: "Sieh dir die aktuellen Positionen an oder sprich direkt mit uns über deine Erfahrung, deinen gewünschten Arbeitsort und deine beruflichen Ziele.",
    primaryCta: { label: "Mechatroniker Jobs ansehen", href: "#stellen" },
    secondaryCta: { label: "Lebenslauf kostenlos erstellen", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Mechatroniker für Ihr Unternehmen?",
    text: "PHE-Perm unterstützt Industrieunternehmen bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Mechatroniker anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Welche Mechatroniker Jobs vermittelt PHE-Perm?", a: "Wir vermitteln Positionen für Mechatroniker aus Montage und Inbetriebnahme, Kälte- und Klimatechnik, technischem Service sowie Instandhaltung – in Industrie, Anlagenbau und Gebäudetechnik, ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm Mechatroniker direkt in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung. Ihren Arbeitsvertrag schließen Sie mit dem Unternehmen." },
    { q: "Kostet die Vermittlung Bewerber etwas?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Welche Ausbildung wird für Mechatroniker-Stellen benötigt?", a: "In der Regel eine abgeschlossene mechatronische oder vergleichbare technische Ausbildung. Die konkreten Anforderungen hängen von der jeweiligen Stelle ab." },
    { q: "Gibt es Mechatroniker-Jobs in der Kälte- und Klimatechnik?", a: "Ja. Ein Teil der Positionen liegt in der Kälte-, Klima- und Anlagentechnik, etwa in Wartung, Service und Inbetriebnahme. Aktuelle Stellen finden Sie im Stellenbereich dieser Seite." },
    { q: "Vermittelt PHE-Perm auch Servicestellen für Mechatroniker?", a: "Ja. Neben Montage und Instandhaltung vermitteln wir auch Servicepositionen mit Kundeneinsatz vor Ort, teils im Außendienst." },
    { q: "Kann ich mich ohne Anschreiben bewerben?", a: "Ja. Für eine erste Kontaktaufnahme genügen Ihr Name, Ihre Erreichbarkeit und die gewünschte Richtung. Ein Anschreiben ist nicht erforderlich." },
    { q: "Was passiert nach meiner Bewerbung?", a: "Wir melden uns persönlich, klären Ihre Qualifikationen und Wünsche und stimmen passende Positionen mit Ihnen ab, bevor wir Sie einem Unternehmen vorstellen." },
    { q: "Gibt es auch Stellen außerhalb von Düsseldorf?", a: "Ja. PHE-Perm vermittelt deutschlandweit; den Standort der einzelnen Stelle finden Sie jeweils in der Stellenbeschreibung." },
    { q: "Können Unternehmen über PHE-Perm Mechatroniker suchen?", a: "Ja. Unternehmen können ihren Bedarf über unsere technische Personalvermittlung anfragen; wir übernehmen die Suche und die persönliche Vorauswahl." },
  ],

  internalLinks: {
    parent: "/berufe",
    jobs: "/jobs",
    lebenslauf: "/lebenslauf-erstellen",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    relatedProfessions: ["elektroniker"], // published + showRelatedLinks
  },

  // Strukturiertes Matching über die Job-Kategorie "mechatronik" (8 echte Stellen),
  // wie bei Elektroniker – keine unsaubere Volltextsuche.
  jobMatch: {
    category: ["mechatronik"],
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
