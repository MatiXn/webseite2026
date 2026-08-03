// Stadt Köln – DRAFT (EPIC 010C). Vollständige City-Config, bewusst NICHT veröffentlicht.
//
// Lokale Wahrheit: PHE-Perm vermittelt real im Kölner Raum, hat dort aber KEIN Büro.
// Daher: kein NAP, keine Kölner Adresse/Telefon/Öffnungszeiten, keine Geo-Daten,
// KEIN LocalBusiness-Knoten (den erzeugt nur der Düsseldorf-Sonderfall in der Route).
// Die Organization erscheint ausschließlich als zentrale @id-Referenz; Service.areaServed
// ist Köln. verifiedExperience=true: reale Vermittlungserfahrung vor Ort (ohne Standort).
// Keine erfundenen Zahlen, keine Aussage über einen Kölner Standort.
//
// Läuft vollständig über das generische CityPageTemplate (keine Köln-Sonderlogik).
import type { CityContent } from "./types";

export const koeln = {
  slug: "koeln",
  name: "Köln",
  shortName: "Köln",
  type: "city",
  status: "draft",
  parentSlug: "personalvermittlung",
  canonicalPath: "/personalvermittlung/koeln",

  local: {
    cityName: "Köln",
    federalState: "Nordrhein-Westfalen",
    country: "DE",
    areaServed: "Köln und Rheinland",
    verifiedExperience: true,
    nearbyCities: ["Düsseldorf", "Leverkusen", "Bonn", "Bergisch Gladbach"],
    nearbyRegions: ["Rheinland"],
  },

  metadataTitle: "Personalvermittlung Köln | Technische Fachkräfte | PHE-Perm",
  metadataDescription:
    "PHE-Perm vermittelt technische Fach- und Führungskräfte für Unternehmen in Köln und im Rheinland – direkt in Festanstellung, ohne Zeitarbeit.",
  openGraphTitle: "Personalvermittlung Köln für technische Fachkräfte | PHE-Perm",
  openGraphDescription:
    "Direktvermittlung technischer Fachkräfte für Unternehmen in Köln und im Rheinland – persönlich und in Festanstellung.",
  primaryKeyword: "Personalvermittlung Köln",
  secondaryKeywords: ["Technische Personalvermittlung Köln", "Fachkräfte Köln"],
  searchIntent: "commercial",

  hero: {
    eyebrow: "Für Unternehmen · Köln",
    headline: "Personalvermittlung Köln für technische Fachkräfte",
    intro: "Technische Positionen im Kölner Raum besetzen sich nicht über Masse, sondern über das passende Profil.",
    supportingParagraphs: [
      "Wir vermitteln technische Fach- und Führungskräfte an Unternehmen in Köln und im Rheinland.",
      "Für uns zählt, dass Anforderung und Kandidat wirklich zusammenpassen – nicht die Zahl der Zuschriften.",
      "Unser Sitz ist in Düsseldorf; Unternehmen und Kandidaten in Köln betreuen wir persönlich.",
    ],
    primaryCta: { label: "Technische Fachkraft finden", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Unverbindliches Erstgespräch", href: "/kontakt" },
  },

  overview: {
    title: "Personalvermittlung in Köln und im Rheinland",
    paragraphs: [
      "Köln und das Rheinland sind ein dichter Industrie- und Technikstandort. Unternehmen aus Produktion, Anlagen- und Maschinenbau, Gebäude- und Automatisierungstechnik suchen laufend qualifizierte technische Fachkräfte.",
      "Als spezialisierte Personalvermittlung unterstützen wir Unternehmen in Köln bei der direkten Besetzung technischer Positionen in Festanstellung – persönlich vorqualifiziert statt anonym vermittelt.",
    ],
  },

  localExperience: {
    title: "Unsere Erfahrung im Kölner Raum",
    paragraphs: [
      "Wir haben in Köln bereits technische Fach- und Führungskräfte vermittelt und betreuen Unternehmen sowie Kandidaten in der Region.",
      "Die technischen Anforderungsprofile im Rheinland sind uns aus der Praxis vertraut – von der Instandhaltung über die Gebäudetechnik bis zur Automatisierung.",
    ],
  },

  employerValue: {
    title: "Was Unternehmen in Köln von uns erwarten können",
    bulletPoints: [
      "Spezialisierung auf technische Berufe statt Bauchladen",
      "Persönliche Vorqualifizierung jedes vorgestellten Profils",
      "Direktvermittlung in Festanstellung – keine Zeitarbeit",
      "Ehrliche Rückmeldung, auch wenn wir eine Position nicht besetzen können",
    ],
  },

  candidateValue: {
    title: "Was Kandidaten in Köln von uns erwarten können",
    bulletPoints: [
      "Passgenaue Positionen statt Massenbewerbung",
      "Vertrauliche und persönliche Beratung",
      "Feste Anstellung direkt beim Unternehmen",
      "Kurze, ehrliche Kommunikation",
    ],
  },

  specializations: {
    title: "Unsere technischen Schwerpunkte",
    items: [
      { label: "Elektrotechnik", href: "/branchen/elektrotechnik" },
      { label: "Automatisierungstechnik", href: "/branchen/automatisierungstechnik" },
      { label: "SPS-Programmierung", href: "/berufe/sps-automatisierung" },
      { label: "Mechatronik", href: "/berufe/mechatroniker" },
      { label: "Servicetechnik", href: "/berufe/servicetechniker" },
      { label: "Betriebstechnik", href: "/berufe/elektroniker" },
    ],
  },

  employerProcess: {
    title: "So besetzen wir Positionen in Köln",
    steps: [
      { title: "Analyse", description: "Wir verstehen Position, Team und Anforderungen im Detail." },
      { title: "Suchprofil", description: "Gemeinsam definieren wir, wen wir wirklich suchen." },
      { title: "Active Sourcing", description: "Wir sprechen passende Fachkräfte gezielt und direkt an." },
      { title: "Persönliche Qualifizierung", description: "Wir prüfen Eignung, Motivation und Rahmenbedingungen." },
      { title: "Vorstellung", description: "Sie erhalten eine kleine Auswahl wirklich passender Profile." },
      { title: "Begleitung bis Einstellung", description: "Wir begleiten den Prozess bis zur Unterschrift." },
    ],
  },

  servedIndustryTags: {
    title: "Für welche Unternehmen wir in Köln arbeiten",
    tags: ["Industrie", "Maschinenbau", "Anlagenbau", "Automatisierung", "Gebäudetechnik", "Produktion", "Service"],
  },

  boundaries: {
    title: "Wann wir auch in Köln Nein sagen",
    paragraphs: [
      "Nicht jede Vakanz passt zu unserer technischen Spezialisierung.",
      "Wenn wir eine Position nicht mit der Qualität besetzen können, die wir selbst erwarten, sagen wir das offen.",
      "Eine ehrliche Absage ist besser als ein unpassender Vorschlag.",
    ],
  },

  // Fachlich zur realen Köln-Erfahrung passend (published): Elektroniker, Mechatroniker,
  // Servicetechniker. SPS/Automatisierung bewusst NICHT (keine belegte Köln-SPS-Erfahrung).
  relevantProfessions: ["elektroniker", "mechatroniker", "servicetechniker"],
  // Published Industries mit realem Bezug: Elektrotechnik + Automatisierungstechnik.
  relevantIndustries: ["elektrotechnik", "automatisierungstechnik"],

  // Kein lokales Job-Matching: Der Matcher kennt keine Location-Felder; ein Freitext-"Köln"
  // würde Nicht-Köln-Stellen (z. B. Langenfeld/Kerpen) falsch einziehen. Daher 0-Treffer-
  // Config (keine falschen lokalen Jobs). Analyse siehe EPIC-010C-Bericht.
  jobMatch: { category: [], tags: [], keywords: [], excludeKeywords: [], maxJobs: 6, fallback: "hint-and-joblist" },

  faq: [
    { q: "Vermittelt PHE-Perm auch in Köln?", a: "Ja. Wir vermitteln technische Fach- und Führungskräfte an Unternehmen in Köln und im Rheinland – ausschließlich in Festanstellung." },
    { q: "Hat PHE-Perm ein Büro in Köln?", a: "Unser Sitz ist in Düsseldorf. Unternehmen und Kandidaten in Köln betreuen wir persönlich; einen eigenen Standort in Köln unterhalten wir nicht." },
    { q: "Welche technischen Positionen vermittelt PHE-Perm in Köln?", a: "Vor allem Fachkräfte aus Elektrotechnik, Automatisierung, Mechatronik und Servicetechnik. Die konkreten Anforderungen hängen von der jeweiligen Position ab." },
    { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    { q: "Können sich Kandidaten aus Köln initiativ melden?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil mit passenden Positionen ab und melden uns persönlich." },
  ],

  finalCta: {
    title: "Sprechen wir über Ihre Vakanz in Köln.",
    cta: { label: "Erstgespräch vereinbaren", href: "/kontakt" },
  },

  internalLinks: {
    parent: "/technische-personalvermittlung",
    jobs: "/jobs",
    professions: "/berufe",
    industries: "/branchen",
    personalvermittlung: "/technische-personalvermittlung",
    contact: "/kontakt",
    // Nachbarstadt mit realem Bürostandort (published) – fachlich sinnvoll.
    relatedCities: ["duesseldorf"],
  },

  publication: {
    published: false,
    indexable: false,
    includeInSitemap: false,
    showInCityHub: false,
    showRelatedLinks: false,
  },
} as const satisfies CityContent;
