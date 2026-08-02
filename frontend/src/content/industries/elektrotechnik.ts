// Branche Elektrotechnik – published (EPIC 009A vorbereitet, EPIC 009B veröffentlicht).
// Die Config wurde in 009A als Draft vorbereitet und analysiert; 009B schaltet sie
// kontrolliert live: status="published", in publishedIndustries. Da die 008D-Engine
// (Route/Sitemap/Hub) datengetrieben aus publishedIndustries liest, entstehen dadurch
// automatisch /branchen/elektrotechnik, der Sitemap-Eintrag und die Hub-Karte –
// ohne manuell hartcodierte Route/Karte/URL.
//
// Branchen-/Marktumfeld (Unternehmen, gesuchte Profile), NICHT das Berufsprofil
// (das liegt in der Profession "elektroniker"). Sachlich, ohne erfundene Zahlen,
// Gehälter, Garantien oder Kundenreferenzen.
//
// jobMatch bewusst über das strukturierte Kategorie-Signal statt über breite
// Keywords: category "elektro" trifft ausschließlich die real als Elektrotechnik
// erfassten Stellen. Alle 25 realen Jobs wurden ausgewertet (Match-Analyse
// EPIC 009A) – Kälte-/Mechatronik-Stellen (category "mechatronik"), die reine
// SPS-/Automatisierungs-Stelle (Job 7, category "it") und SHK (Job 19,
// category "bau") fallen strukturell heraus, es entstehen keine False Positives.
// Job 7 bleibt damit exklusiv der Branche Automatisierungstechnik zugeordnet.
import type { IndustryContent } from "./types";

export const elektrotechnik = {
  slug: "elektrotechnik",
  name: "Elektrotechnik",
  shortName: "Elektrotechnik",
  status: "published",
  parentSlug: "branchen",

  metadataTitle: "Personalvermittlung Elektrotechnik | PHE-Perm",
  metadataDescription:
    "PHE-Perm vermittelt Fach- und Führungskräfte der Elektrotechnik – Betriebstechnik, Instandhaltung, Elektroinstallation und Gebäudetechnik – direkt in Festanstellung.",
  canonicalPath: "/branchen/elektrotechnik",
  primaryKeyword: "Personalvermittlung Elektrotechnik",
  secondaryKeywords: [
    "Elektrotechnik Jobs",
    "Elektroniker Personalvermittlung",
    "Fachkräfte Elektrotechnik",
    "Elektrotechnik Festanstellung",
  ],
  searchIntent: "commercial",

  hero: {
    eyebrow: "Branche · Elektrotechnik",
    headline: "Personalvermittlung für die Elektrotechnik",
    intro:
      "PHE-Perm ist auf die Vermittlung technischer Fach- und Führungskräfte spezialisiert – auch für die Elektrotechnik. Wir vermitteln direkt in Festanstellung an das einstellende Unternehmen, ohne Zeitarbeit und ohne Arbeitnehmerüberlassung.",
    primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Passende Jobs ansehen", href: "/jobs" },
  },

  overview: {
    title: "Elektrotechnik als Branche",
    paragraphs: [
      "Die Elektrotechnik umfasst die elektrische Ausrüstung, Installation und Instandhaltung von Maschinen, Anlagen und Gebäuden: Betriebstechnik und industrielle Instandhaltung, Elektroinstallation und Montage, Schaltschrank- und Anlagentechnik, Energie- und Gebäudetechnik sowie Mess-, Steuer- und Regelungstechnik (MSR). Auftraggeber sind typischerweise produzierende Unternehmen, der Anlagen- und Maschinenbau, das Elektrohandwerk sowie Betriebe der Energie- und Gebäudetechnik.",
      "Als spezialisierte Personalvermittlung unterstützt PHE-Perm Unternehmen dieser Branche bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte. Typischerweise gesucht werden unter anderem Elektroniker für Betriebstechnik, Betriebselektriker und -elektroniker, Elektromonteure, Servicetechniker der Elektrotechnik sowie Fachkräfte für Energie- und Gebäudetechnik. Ob eine konkrete Stelle offen ist, hängt vom jeweiligen Bedarf ab.",
    ],
  },

  focusAreas: [
    { title: "Betriebstechnik und Instandhaltung", note: "Elektrische Instandhaltung, Störungsbeseitigung und Wartung von Maschinen und Produktionsanlagen." },
    { title: "Elektroinstallation und Montage", note: "Installation, Verkabelung und Anschluss elektrotechnischer Anlagen beim Kunden und im Anlagenbau." },
    { title: "Schaltschrank- und Anlagentechnik", note: "Aufbau, Verdrahtung und Inbetriebnahme von Schaltschränken und elektrischen Anlagen." },
    { title: "Energie- und Gebäudetechnik", note: "Energieverteilung sowie Gebäudeautomation und KNX/EIB-Technik." },
    { title: "MSR- und Gebäudeautomation", note: "Mess-, Steuer- und Regelungstechnik in gebäude- und anlagentechnischem Umfeld." },
    { title: "Elektrotechnischer Service", note: "Wartung, Prüfung und Instandsetzung elektrischer Anlagen im Innen- und Außendienst." },
  ],

  faq: [
    { q: "Welche Fachkräfte vermittelt PHE-Perm in der Elektrotechnik?", a: "Wir vermitteln technische Fach- und Führungskräfte der Elektrotechnik, etwa Elektroniker für Betriebstechnik, Betriebselektriker und -elektroniker, Elektromonteure, Servicetechniker sowie Fachkräfte für Energie- und Gebäudetechnik – ausschließlich in Festanstellung." },
    { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Für welche Unternehmen ist die Personalvermittlung geeignet?", a: "Für produzierende Unternehmen, den Anlagen- und Maschinenbau, das Elektrohandwerk sowie Betriebe der Energie- und Gebäudetechnik, die elektrotechnische Fachkräfte in Festanstellung suchen." },
    { q: "Welche Qualifikationen sind in der Elektrotechnik besonders relevant?", a: "Häufig gefragt sind eine abgeschlossene elektrotechnische Ausbildung sowie Erfahrung in Betriebstechnik, Instandhaltung, Elektroinstallation oder Energie- und Gebäudetechnik. Die konkreten Anforderungen hängen von der jeweiligen Position ab." },
    { q: "Können sich Kandidaten auch ohne konkrete Stellenausschreibung melden?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil mit passenden Positionen ab und melden uns persönlich." },
  ],

  applicantCta: {
    title: "Sie arbeiten in der Elektrotechnik?",
    text: "Sehen Sie sich passende Positionen an oder melden Sie sich initiativ – wir stimmen passende Stellen persönlich mit Ihnen ab.",
    primaryCta: { label: "Passende Jobs ansehen", href: "/jobs" },
    secondaryCta: { label: "Lebenslauf kostenlos erstellen", href: "/lebenslauf-erstellen" },
  },
  employerCta: {
    title: "Sie suchen Fachkräfte für die Elektrotechnik?",
    text: "PHE-Perm unterstützt Unternehmen der Elektrotechnik bei der Suche und persönlichen Vorqualifizierung technischer Fachkräfte für Festanstellungen.",
    primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },

  internalLinks: {
    parent: "/branchen",
    jobs: "/jobs",
    personalvermittlung: "/technische-personalvermittlung",
    kontakt: "/kontakt",
    // Fachlich belastbare, veröffentlichte Berufe mit Elektrotechnik-Bezug:
    // Elektroniker (Kernberuf der Branche), Servicetechniker (elektrotechnischer
    // Service/Außendienst), SPS/Automatisierung (Betriebs- und Steuerungstechnik).
    // Mechatroniker bewusst NICHT (eigene Fachrichtung/Kategorie "mechatronik").
    relatedProfessions: ["elektroniker", "servicetechniker", "sps-automatisierung"],
  },

  jobMatch: {
    // Strukturiertes Kategorie-Signal statt breiter Keywords: trifft ausschließlich
    // die real als Elektrotechnik erfassten Stellen (15 Jobs), keine False Positives.
    category: ["elektro"],
    maxJobs: 8,
    fallback: "hint-and-joblist",
  },

  publication: {
    // Veröffentlicht (EPIC 009B): alle Sichtbarkeits-Flags an. Muss zu
    // status="published" passen (Validator erzwingt: indexable/includeInSitemap/
    // showInIndustryHub = true).
    published: true,
    indexable: true,
    includeInSitemap: true,
    showInIndustryHub: true,
    showRelatedLinks: true,
  },
} as const satisfies IndustryContent;
