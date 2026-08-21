// Servicetechniker Elektrotechnik – published. Abgrenzung zu den bestehenden
// Seiten ist inhaltlich, nicht nur begrifflich:
//   /berufe/elektroniker    → Berufsbild, überwiegend Instandhaltung im eigenen Werk
//   /berufe/servicetechniker → Service allgemein, über alle Fachrichtungen
//   diese Seite              → Elektro-Service im Außendienst: Einsatzgebiet,
//                              Anfahrt, Dienstwagen, Bereitschaft
//
// Matching über exakte Stellentitel statt category "elektro": Ein
// Kategorie-Filter zöge alle 17 Elektro-Stellen und damit die Instandhalter im
// Werk mit herein — genau die Abgrenzung, die diese Seite ausmacht.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";
import { contact } from "../contact";

export const servicetechnikerElektrotechnik = {
  slug: "servicetechniker-elektrotechnik",
  name: "Servicetechniker Elektrotechnik",
  shortName: "Elektro-Service",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "elektro",

  metadataTitle: "Servicetechniker Elektrotechnik Jobs | PHE-Perm",
  metadataDescription:
    "Servicetechniker Elektrotechnik im Außendienst: Wartung, Störungsdiagnose und Inbetriebnahme beim Kunden. Festanstellung statt Zeitarbeit, Einsatzgebiet vorab geklärt.",
  canonicalPath: "/berufe/servicetechniker-elektrotechnik",
  primaryKeyword: "Servicetechniker Elektrotechnik Jobs",
  secondaryKeywords: [
    "Servicetechniker Elektrotechnik Stellenangebote",
    "Elektroniker als Servicetechniker",
    "Servicetechniker Photovoltaik Jobs",
    "Elektro Außendienst Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Für Elektrofachkräfte im Außendienst · Direktvermittlung",
    headline: "Servicetechniker Elektrotechnik (m/w/d) – Jobs im Außendienst",
    intro:
      "Wir vermitteln Elektroniker, die beim Kunden arbeiten statt in der Werkshalle: Wartung, Störungsdiagnose und Inbetriebnahme elektrischer Anlagen im Außendienst. Direkt in Festanstellung, keine Zeitarbeit — und das Einsatzgebiet klären wir vor jeder Vorstellung.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Passende Service-Stellen ansehen", href: "#stellen" },
  },

  overview: {
    title: "Elektro-Service im Außendienst: was die Rolle ausmacht",
    paragraphs: [
      "Servicetechniker der Elektrotechnik arbeiten dort, wo die Anlage steht: beim Kunden. Der Arbeitstag beginnt selten an einem festen Arbeitsplatz, sondern mit einer Tour — Wartungstermine, Störungseinsätze, Inbetriebnahmen. Fehlersuche muss vor Ort gelingen, oft ohne Kollegen zum Rücksprechen, und das Ergebnis wird direkt an den Kunden übergeben.",
      "Genau das unterscheidet die Rolle vom Betriebselektroniker in der Instandhaltung: mehr Eigenverantwortung, mehr Kundenkontakt, mehr Abwechslung — dafür Fahrzeit und wechselnde Anlagen. Wie weit das Einsatzgebiet reicht, ob Übernachtungen anfallen und ob ein Dienstwagen zur Privatnutzung dabei ist, unterscheidet sich je Stelle. Das besprechen wir vorab, statt es offenzulassen.",
    ],
  },

  specializations: [
    { title: "Service an Industrieanlagen", focus: ["Wartung elektrischer Anlagen", "Störungsdiagnose vor Ort", "Instandsetzung beim Kunden"] },
    { title: "Photovoltaik und Erneuerbare", focus: ["Wartung von PV-Anlagen", "Wechselrichter und Messtechnik", "Ertragsprüfung"] },
    { title: "Inbetriebnahme und Übergabe", focus: ["Funktionsprüfung", "Einweisung des Kunden", "Abnahmedokumentation"] },
  ],

  tasks: [
    "Wartung elektrischer Anlagen beim Kunden",
    "Störungsdiagnose und Fehlersuche vor Ort",
    "Instandsetzung und Austausch von Komponenten",
    "Inbetriebnahme und Funktionsprüfung",
    "Prüfungen nach DGUV Vorschrift 3",
    "Einweisung und Beratung des Kunden",
    "Dokumentation der Serviceeinsätze",
  ],

  industries: [
    { name: "Maschinen- und Anlagenbau", note: "Service an ausgelieferten Maschinen und Fertigungsanlagen." },
    { name: "Erneuerbare Energien", note: "Wartung von Photovoltaik- und Speicheranlagen." },
    { name: "Energieversorgung", note: "Betrieb und Instandhaltung elektrischer Infrastruktur." },
    { name: "Gebäude- und Infrastrukturtechnik", note: "Service an technischer Gebäudeausrüstung." },
    { name: "Technischer Kundendienst", note: "Herstellerservice mit festem Einsatzgebiet." },
  ],

  requirements: [
    { label: "abgeschlossene Ausbildung in der Elektrotechnik", hint: "z. B. Elektroniker für Betriebs-, Energie- oder Anlagentechnik" },
    { label: "Führerschein Klasse B", hint: "bei Außendienststellen durchgehend" },
    { label: "Reisebereitschaft", hint: "Umfang je nach Stelle – regional bis bundesweit" },
    { label: "sicheres Auftreten beim Kunden" },
    { label: "selbstständige Fehlersuche" },
    { label: "Deutschkenntnisse", hint: "wegen des direkten Kundenkontakts" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Sie sind Elektroniker und wollen in den Service wechseln?",
    text: "Melden Sie sich unverbindlich – gern per WhatsApp. Wir klären vertraulich, wie groß Ihr Einsatzgebiet sein darf, ob Übernachtungen für Sie infrage kommen und welche Stellen dazu passen.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Lebenslauf senden", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Servicetechniker für Ihren Kundendienst?",
    text: "PHE-Perm sucht und qualifiziert Elektrofachkräfte für den technischen Außendienst vor – inklusive Abgleich von Einsatzgebiet und Reisebereitschaft, bevor wir jemanden vorstellen.",
    primaryCta: { label: "Servicetechniker anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Wie groß ist das Einsatzgebiet im Elektro-Service?", a: "Das unterscheidet sich stark je Stelle: Es gibt regionale Positionen mit täglicher Heimkehr ebenso wie bundesweite Rollen mit Übernachtungen. Wir klären Ihr Wunschgebiet vorab und stellen Sie nur bei passenden Stellen vor." },
    { q: "Bekomme ich einen Dienstwagen zur privaten Nutzung?", a: "Bei vielen Außendienststellen ja, aber nicht bei allen. Ob und in welchem Umfang, steht in der jeweiligen Stellenanzeige." },
    { q: "Brauche ich Erfahrung im Service oder reicht Instandhaltung?", a: "Erfahrung aus der Instandhaltung ist eine gute Grundlage. Viele Arbeitgeber nehmen Wechsler aus dem Werk und arbeiten sie in den Kundendienst ein — wichtig sind saubere Fehlersuche und Auftreten beim Kunden." },
    { q: "Fällt Bereitschaftsdienst an?", a: "Bei einem Teil der Stellen ja, meist im Wechsel und gesondert vergütet. Wir sagen vorher, bei welchen Positionen das der Fall ist." },
    { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Entstehen mir als Kandidat Kosten?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
    { q: "Ist die Kontaktaufnahme vertraulich?", a: "Ja. Wir stellen Sie erst nach Ihrer ausdrücklichen Zustimmung bei einem Unternehmen vor." },
  ],

  internalLinks: {
    parent: "/berufe",
    jobs: "/jobs",
    lebenslauf: "/lebenslauf-erstellen",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    // Bewusst zurück zum allgemeinen Service-Berufsbild und zum Elektroniker:
    // beide decken angrenzende Suchintentionen ab.
    relatedProfessions: ["servicetechniker", "elektroniker"],
  },

  // Exakte Stellentitel statt category-Filter — sonst kämen die Instandhalter
  // im Werk mit in die Liste und die Abgrenzung wäre hinfällig.
  jobMatch: {
    keywords: [
      "Servicetechniker Elektrotechnik",
      "Elektroniker als Servicetechniker",
      "Servicetechniker Photovoltaik",
    ],
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
