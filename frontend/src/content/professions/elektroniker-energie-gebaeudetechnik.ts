// Elektroniker Energie- und Gebäudetechnik – published (Candidate Sprint 05).
// Spezialisierte, kandidatenorientierte Landingpage über die BESTEHENDE Profession
// Engine + ProfessionPageTemplate (keine neue Engine, kein Template-Sonderfall).
// Fokus: Energie- und Gebäudetechnik, Elektroinstallation im Gebäude, EIB/KNX,
// Smart Home, Gebäudeautomation, MSR im Gebäudekontext. NICHT: Betriebstechnik,
// SPS, allgemeine Servicetechnik, Photovoltaik ohne Gebäudebezug, Mechatronik,
// Kältetechnik, SHK.
//
// Matching präzise über strukturierte Tags (Gebäudetechnik/Gebäudeautomation),
// KEIN category-Filter: trifft exakt die 2 echten Stellen (Jobs 13, 22),
// 0 False Positives. Aktuell wenige Stellen -> ehrliche Initiativ-Einladung, keine
// künstliche Jobfülle, keine erfundenen Gehälter/Benefits.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";
import { contact } from "../contact";

export const elektronikerEnergieGebaeudetechnik = {
  slug: "elektroniker-energie-gebaeudetechnik",
  name: "Elektroniker Energie- und Gebäudetechnik",
  shortName: "Gebäudetechnik",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "elektro",

  metadataTitle: "Elektroniker Energie- und Gebäudetechnik Jobs | PHE-Perm",
  metadataDescription:
    "Finde passende Jobs als Elektroniker für Energie- und Gebäudetechnik – Gebäudeautomation, KNX/EIB, MSR und Elektroinstallation im Gebäude, direkt in Festanstellung.",
  canonicalPath: "/berufe/elektroniker-energie-gebaeudetechnik",
  primaryKeyword: "Elektroniker Energie- und Gebäudetechnik Jobs",
  secondaryKeywords: [
    "Elektroniker Gebäudetechnik Jobs",
    "Gebäudeautomation Jobs",
    "KNX Elektroniker Jobs",
    "Elektroniker Energie- und Gebäudetechnik Festanstellung",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Für Elektroniker Energie- und Gebäudetechnik · Direktvermittlung",
    headline: "Elektroniker Energie- und Gebäudetechnik (m/w/d) – passende Festanstellung finden",
    intro:
      "Sie arbeiten in der Gebäude- und Energietechnik – Gebäudeautomation, KNX/EIB, MSR oder Elektroinstallation – und suchen etwas Passendes? Wir vermitteln direkt in Festanstellung, keine Zeitarbeit. Für Bewerber kostenfrei, vertraulich und nur bei Stellen, die wirklich zu Ihnen passen.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Aktuelle Stellen ansehen", href: "#stellen" },
  },

  overview: {
    title: "Elektroniker Energie- und Gebäudetechnik: Aufgaben und Wechselgründe",
    paragraphs: [
      "Elektroniker für Energie- und Gebäudetechnik planen, installieren und automatisieren die elektrische Ausrüstung von Gebäuden: Energieverteilung und Elektroinstallation, Gebäudeautomation mit KNX/EIB, Smart-Home-Technik sowie Mess-, Steuer- und Regelungstechnik (MSR).",
      "Viele wechseln, weil sie eine feste Anstellung ohne Zeitarbeit, moderne Gebäude- und Automationsprojekte oder ein passenderes Einsatzgebiet suchen. Aktuell sind nur wenige Positionen ausgeschrieben – melden Sie sich gern auch initiativ, wir gleichen Ihr Profil laufend mit passenden Stellen ab.",
    ],
  },

  specializations: [
    { title: "Gebäudeautomation & KNX/EIB", focus: ["KNX/EIB-Programmierung mit der ETS", "Parametrierung und Inbetriebnahme", "Smart-Home-Funktionen"] },
    { title: "MSR- und Regelungstechnik", focus: ["Mess-, Steuer- und Regelungstechnik", "DDC/GLT-Systeme", "Aufschaltung von Feldgeräten"] },
    { title: "Energieverteilung & Elektroinstallation", focus: ["Installation von Energieverteilungen", "Zählerplätze und Unterverteilungen", "Prüfung nach DIN VDE 0100"] },
  ],

  tasks: [
    "Installation von Gebäudeautomation (KNX/EIB)",
    "Parametrierung und Inbetriebnahme",
    "MSR- und Regelungstechnik",
    "Energieverteilung und Zählerplätze",
    "Umsetzung von Smart-Home-Funktionen",
    "Prüfung und Messung nach DIN VDE",
    "Dokumentation",
  ],

  industries: [
    { name: "Technische Gebäudeausrüstung (TGA)", note: "Elektro- und Automationstechnik in Gebäuden." },
    { name: "Gebäudeautomation", note: "KNX/EIB, DDC/GLT und Smart-Home-Systeme." },
    { name: "Elektroinstallation im Gebäude", note: "Energieverteilung und Installation in Neubau und Bestand." },
    { name: "Facility- und Objekttechnik", note: "Betrieb und Wartung gebäudetechnischer Anlagen." },
    { name: "Energie- und Versorgungstechnik", note: "Elektrische Versorgung von Gebäuden." },
  ],

  requirements: [
    { label: "abgeschlossene Ausbildung als Elektroniker für Energie- und Gebäudetechnik", hint: "oder vergleichbar" },
    { label: "Erfahrung mit KNX/EIB oder Gebäudeautomation", hint: "je nach Stelle" },
    { label: "Kenntnisse in MSR- und Regelungstechnik", hint: "je nach Stelle" },
    { label: "Führerschein", hint: "bei Objekteinsätzen" },
    { label: "selbstständige Arbeitsweise" },
    { label: "Deutschkenntnisse", hint: "je nach Kundenkontakt" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Sie sind Elektroniker für Energie- und Gebäudetechnik und suchen etwas Passendes?",
    text: "Melden Sie sich unverbindlich – gern per WhatsApp und auch initiativ. Wir besprechen vertraulich Ihre Erfahrung, Ihr Wunsch-Einsatzgebiet und Ihre Ziele und stellen Sie nur bei passenden Stellen vor.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Lebenslauf senden", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Elektroniker für Energie- und Gebäudetechnik?",
    text: "PHE-Perm unterstützt Unternehmen der Gebäude- und Energietechnik bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Ist die Vermittlung für Bewerber kostenlos?", a: "Ja. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Aktuell sind nur wenige Stellen ausgeschrieben – lohnt sich eine Bewerbung trotzdem?", a: "Ja. Es sind nicht durchgehend Positionen ausgeschrieben. Melden Sie sich gern initiativ – wir gleichen Ihr Profil laufend mit passenden Stellen ab und melden uns persönlich." },
    { q: "Ist die Kontaktaufnahme vertraulich?", a: "Ja. Ihre Angaben behandeln wir vertraulich; wir stellen Sie erst nach Ihrer ausdrücklichen Zustimmung bei einem Unternehmen vor." },
    { q: "Werden meine Unterlagen nur nach Zustimmung weitergegeben?", a: "Ja, ausschließlich. Wir geben Ihre Unterlagen nur nach ausdrücklicher Absprache an ein Unternehmen weiter." },
    { q: "Kann ich mich initiativ melden?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil mit passenden Positionen ab und melden uns persönlich." },
    { q: "Welche Ausbildung wird typischerweise erwartet?", a: "In der Regel eine abgeschlossene Ausbildung als Elektroniker für Energie- und Gebäudetechnik oder eine vergleichbare elektrotechnische Qualifikation. Die konkreten Anforderungen hängen von der jeweiligen Stelle ab." },
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

  // Präzise Gebäudetechnik-Strategie (Sprint 05, freigegeben): strukturierte Tags,
  // KEIN category-Filter. Trifft exakt Jobs 13, 22 – 0 False Positives.
  jobMatch: {
    tags: ["Gebäudetechnik", "Gebäudeautomation"],
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
