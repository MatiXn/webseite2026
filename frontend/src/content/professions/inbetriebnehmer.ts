// Inbetriebnehmer – published. Einzige der angefragten Servicetechniker-Varianten
// ohne Überschneidung zu einer bestehenden Seite: Kein anderes Berufsprofil deckt
// die Erstinbetriebnahme ab, weder /berufe/servicetechniker (laufender Service)
// noch /berufe/elektroniker (Instandhaltung im Werk).
//
// Matching über die strukturierten Tags "Inbetriebnahme" und "Montage" — die
// Stellen mit Montage- und Inbetriebnahmeanteil. Keine breiten Keywords: "Anlage"
// oder "Prüfung" zöge halb den Bestand herein.
import { DEFAULT_PROCESS, type ProfessionContent } from "./types";
import { contact } from "../contact";

export const inbetriebnehmer = {
  slug: "inbetriebnehmer",
  name: "Inbetriebnehmer",
  shortName: "Inbetriebnahme",
  status: "published",
  parentSlug: "berufe",
  jobCategory: "elektro",

  metadataTitle: "Inbetriebnehmer Jobs in Festanstellung | PHE-Perm",
  metadataDescription:
    "Inbetriebnehmer und Montagetechniker: Anlagen aufbauen, prüfen und übergeben. Jobs in Festanstellung, keine Zeitarbeit – Reiseanteil vorab geklärt.",
  canonicalPath: "/berufe/inbetriebnehmer",
  primaryKeyword: "Inbetriebnehmer Jobs",
  secondaryKeywords: [
    "Inbetriebnehmer Stellenangebote",
    "Inbetriebnahmetechniker Jobs",
    "Montagetechniker Festanstellung",
    "Inbetriebnahme Elektrotechnik Jobs",
  ],
  searchIntent: "transactional",

  hero: {
    eyebrow: "Für Inbetriebnehmer und Montagetechniker · Direktvermittlung",
    headline: "Inbetriebnehmer (m/w/d) – Jobs in Festanstellung",
    intro:
      "Wir vermitteln Techniker, die Anlagen zum Laufen bringen: Aufbau, Verdrahtung, Funktionsprüfung und Übergabe an den Kunden. Direkt in Festanstellung, keine Zeitarbeit — und mit vorab geklärtem Reiseanteil.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Passende Stellen ansehen", href: "#stellen" },
  },

  overview: {
    title: "Was Inbetriebnehmer von Instandhaltern unterscheidet",
    paragraphs: [
      "Inbetriebnehmer kommen an die Anlage, bevor sie läuft. Sie bauen auf, verdrahten nach Plan, prüfen Funktion für Funktion durch und übergeben am Ende an den Betreiber. Wo der Instandhalter eine bekannte Anlage wieder zum Laufen bringt, arbeitet der Inbetriebnehmer jedes Mal an etwas Neuem — mit dem Druck, dass am Abnahmetermin alles stimmen muss.",
      "Der Beruf verlangt entsprechend sicheres Planlesen, systematisches Vorgehen und die Fähigkeit, vor Ort Entscheidungen zu treffen. Dafür ist die Arbeit abwechslungsreich und selten Routine. Wie viel gereist wird — Tagespendeln, Wochenmontage oder Auslandseinsätze — hängt vom Arbeitgeber ab und ist das Erste, was wir mit Ihnen klären.",
    ],
  },

  specializations: [
    { title: "Elektrische Inbetriebnahme", focus: ["Verdrahtung nach Stromlaufplan", "Funktionsprüfung", "Messung und Protokollierung"] },
    { title: "Mechanische Montage und Aufbau", focus: ["Aufbau von Baugruppen", "Ausrichtung und Justage", "Probelauf"] },
    { title: "Übergabe und Einweisung", focus: ["Abnahme mit dem Kunden", "Schulung des Bedienpersonals", "Abnahmedokumentation"] },
  ],

  tasks: [
    "Aufbau und Montage von Anlagen und Baugruppen",
    "Verdrahtung und elektrische Installation nach Plan",
    "Funktionsprüfung und Probelauf",
    "Fehlersuche während der Inbetriebnahme",
    "Abnahme und Übergabe an den Kunden",
    "Einweisung des Bedienpersonals",
    "Erstellung der Abnahmedokumentation",
  ],

  industries: [
    { name: "Maschinen- und Sondermaschinenbau", note: "Aufbau und Erstinbetriebnahme neuer Anlagen." },
    { name: "Anlagenbau", note: "Montage und Inbetriebnahme von Prozessanlagen." },
    { name: "Automatisierungstechnik", note: "Inbetriebnahme von Steuerungen und Antrieben." },
    { name: "Gebäude- und Energietechnik", note: "Errichtung und Übergabe technischer Gebäudeausrüstung." },
    { name: "Erneuerbare Energien", note: "Aufbau und Netzanschluss von Erzeugungsanlagen." },
  ],

  requirements: [
    { label: "abgeschlossene technische Ausbildung", hint: "Elektrotechnik, Mechatronik oder Mechanik" },
    { label: "sicheres Lesen von Stromlauf- und Montageplänen" },
    { label: "Reisebereitschaft", hint: "Umfang je nach Stelle – von Tagesreisen bis Wochenmontage" },
    { label: "Führerschein Klasse B" },
    { label: "systematische, sorgfältige Arbeitsweise" },
    { label: "Deutschkenntnisse", hint: "für Dokumentation und Kundenübergabe" },
  ],

  process: DEFAULT_PROCESS,

  applicantCta: {
    title: "Sie arbeiten in Montage oder Inbetriebnahme?",
    text: "Melden Sie sich unverbindlich – gern per WhatsApp. Wir besprechen vertraulich, wie viel Reisetätigkeit für Sie passt, und stellen Sie nur bei Stellen vor, die dazu passen.",
    primaryCta: { label: "Unverbindlich über WhatsApp anfragen", href: contact.whatsappLink },
    secondaryCta: { label: "Lebenslauf senden", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Inbetriebnehmer für Ihre Anlagen?",
    text: "PHE-Perm sucht technische Fachkräfte für Montage und Inbetriebnahme und gleicht Reisebereitschaft und Einsatzform vorab ab, bevor wir jemanden vorstellen.",
    primaryCta: { label: "Inbetriebnehmer anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  faq: [
    { q: "Wie viel muss ich als Inbetriebnehmer reisen?", a: "Das ist die entscheidende Frage und unterscheidet sich stark: Es gibt Stellen im Tagespendelbereich, Wochenmontage mit Heimfahrt am Freitag und Positionen mit längeren Auslandseinsätzen. Wir klären Ihren Rahmen, bevor wir Sie irgendwo vorstellen." },
    { q: "Was unterscheidet Inbetriebnahme von Instandhaltung?", a: "Der Instandhalter betreut eine bekannte Anlage im laufenden Betrieb. Der Inbetriebnehmer bringt eine neue Anlage zum ersten Mal zum Laufen und übergibt sie — jedes Projekt ist anders, dafür ist die Arbeit selten Routine." },
    { q: "Kann ich als Elektroniker in die Inbetriebnahme wechseln?", a: "Ja, das ist ein häufiger Weg. Wichtig sind sicheres Planlesen und die Bereitschaft, vor Ort selbst zu entscheiden. Viele Arbeitgeber lassen Wechsler zunächst im Team mitlaufen." },
    { q: "Wie werden Reisezeiten und Auslöse vergütet?", a: "Das regelt jeder Arbeitgeber anders – von Auslöse nach Tarif bis zu pauschalen Montagezuschlägen. Die Konditionen stehen in der jeweiligen Stelle, und wir sprechen sie vorher durch." },
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
    relatedProfessions: ["servicetechniker", "mechatroniker"],
  },

  jobMatch: {
    tags: ["Inbetriebnahme", "Montage"],
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
