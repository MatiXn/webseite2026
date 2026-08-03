// Stadt Düsseldorf – published (EPIC 010B).
// Verlustfreie Migration der bisher handgebauten Seite /personalvermittlung/duesseldorf
// auf die City Content Engine. Inhalte 1:1 aus der bestehenden Seite übernommen.
// NAP/Geo/Öffnungszeiten stehen NICHT hier, sondern kommen zentral aus company
// (Düsseldorf-LocalBusiness-Sonderfall in der Route). Keine erfundenen Zahlen.
import type { CityContent } from "./types";

export const duesseldorf = {
  slug: "duesseldorf",
  name: "Düsseldorf",
  shortName: "Düsseldorf",
  type: "city",
  status: "published",
  parentSlug: "personalvermittlung",
  canonicalPath: "/personalvermittlung/duesseldorf",

  local: {
    cityName: "Düsseldorf",
    federalState: "Nordrhein-Westfalen",
    country: "DE",
    areaServed: "Düsseldorf",
    // PHE-Perm hat hier den Bürostandort und ist real aktiv.
    verifiedExperience: true,
  },

  metadataTitle: "Personalvermittlung Düsseldorf | Technische Fachkräfte | PHE-Perm",
  metadataDescription:
    "PHE-Perm unterstützt Unternehmen in Düsseldorf bei der Besetzung technischer Positionen durch persönliche Direktvermittlung. Qualität statt Massenvermittlung.",
  openGraphTitle: "Personalvermittlung Düsseldorf für technische Fachkräfte | PHE-Perm",
  openGraphDescription:
    "Persönliche Direktvermittlung technischer Fachkräfte für Unternehmen in Düsseldorf – Qualität statt Massenvermittlung.",
  primaryKeyword: "Personalvermittlung Düsseldorf",
  secondaryKeywords: ["Technische Personalvermittlung Düsseldorf", "Fachkräfte Düsseldorf"],
  searchIntent: "commercial",

  hero: {
    eyebrow: "Für Unternehmen · Düsseldorf",
    headline: "Personalvermittlung Düsseldorf für technische Fachkräfte",
    intro:
      "Gute Personalvermittlung beginnt nicht mit einer Stellenanzeige. Sie beginnt mit dem Verständnis für den Menschen dahinter.",
    supportingParagraphs: [
      "Viele Vermittlungen scheitern nicht an fehlenden Bewerbern, sondern daran, dass Unternehmen und Kandidaten nie wirklich zueinander passen.",
      "Deshalb lernen wir zuerst Menschen und Unternehmen kennen.",
      "Erst danach beginnt die Vermittlung.",
    ],
    primaryCta: { label: "Technische Fachkraft finden", href: "/technische-personalvermittlung" },
    secondaryCta: { label: "Unverbindliches Erstgespräch", href: "/kontakt" },
  },

  employerValue: {
    title: "Warum Unternehmen mit uns arbeiten",
    bulletPoints: [
      "Wir hören zuerst zu.",
      "Wir verstehen die Position.",
      "Wir verstehen den Kandidaten.",
      "Erst dann stellen wir jemanden vor.",
    ],
  },

  differentiators: {
    title: "Warum wir anders arbeiten",
    items: [
      "Der Bewerber ist kein Produkt.",
      "Wir stellen nur passende Positionen vor.",
      "Qualität vor Quantität.",
      "Ehrliche Kommunikation.",
      "Wir übernehmen nur Positionen, bei denen wir echten Mehrwert liefern können.",
      "Wir lernen Unternehmen langfristig kennen.",
    ],
  },

  specializations: {
    title: "Unsere Spezialisierung",
    items: [
      { label: "Elektrotechnik", href: "/berufe/elektroniker" },
      { label: "Automatisierung", href: "/berufe" },
      { label: "SPS", href: "/berufe" },
      { label: "Mechatronik", href: "/berufe" },
      { label: "Servicetechnik", href: "/berufe" },
      { label: "Kälte", href: "/berufe" },
      { label: "TGA", href: "/berufe" },
      { label: "Engineering", href: "/berufe" },
    ],
  },

  employerProcess: {
    title: "So läuft unsere Zusammenarbeit",
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
    title: "Für welche Unternehmen wir arbeiten",
    tags: ["Industrie", "Maschinenbau", "Automatisierung", "Anlagenbau", "Service", "Gebäudetechnik", "Produktion"],
  },

  boundaries: {
    title: "Wann wir auch Nein sagen",
    paragraphs: [
      "Nicht jede Vakanz passt zu unserer Spezialisierung.",
      "Wenn wir überzeugt sind, dass wir eine Position nicht mit der Qualität besetzen können, die wir selbst erwarten, lehnen wir den Auftrag lieber ab.",
      "Denn eine ehrliche Absage ist besser als falsche Versprechen.",
    ],
  },

  // Fachbereiche: die sichtbare Verlinkung erfolgt über specializations (Parität zur
  // bisherigen Seite). Keine zusätzlichen Related-Sektionen -> Arrays leer.
  relevantProfessions: [],
  relevantIndustries: [],

  // Kein lokales Job-Matching: keine unscharfe Stadt-Keyword-Suche. Düsseldorf-Jobs sind
  // nicht strukturiert als "Düsseldorf-Stellen" erfasst -> 0-Treffer-Fallback (keine Jobsektion).
  jobMatch: { category: [], tags: [], keywords: [], excludeKeywords: [], maxJobs: 6, fallback: "hint-and-joblist" },

  faq: [
    { q: "Warum PHE-Perm statt einer großen Personalberatung?", a: "Wir sind auf technische Berufe spezialisiert und arbeiten persönlich statt über anonyme Prozesse. Wir übernehmen nur Positionen, bei denen wir mit unserer Spezialisierung einen echten Mehrwert liefern können." },
    { q: "Welche Positionen vermittelt PHE-Perm?", a: "Technische Fachkräfte aus Elektrotechnik, Automatisierung und SPS, Mechatronik, Servicetechnik, Kälte- und Klimatechnik, TGA sowie Engineering – ausschließlich in Festanstellung." },
    { q: "Arbeitet PHE-Perm auch außerhalb Düsseldorfs?", a: "Ja. Unser Sitz ist in Düsseldorf; wir vermitteln jedoch deutschlandweit. Für Unternehmen in Düsseldorf und im Rheinland sind wir persönlich vor Ort erreichbar." },
    { q: "Wie läuft die Zusammenarbeit ab?", a: "In sechs Schritten: Analyse, Suchprofil, Active Sourcing, persönliche Qualifizierung, Vorstellung und Begleitung bis zur Einstellung." },
    { q: "Wann beginnt die Personalsuche?", a: "Nachdem wir die Position und Ihr Unternehmen im Detail verstanden haben. Erst wenn das Suchprofil steht, beginnt die aktive Suche." },
    { q: "Was kostet die Zusammenarbeit?", a: "Die Konditionen werden transparent vor Beginn der Zusammenarbeit vereinbart." },
  ],

  finalCta: {
    title: "Lassen Sie uns über Ihre Vakanz sprechen.",
    cta: { label: "Erstgespräch vereinbaren", href: "/kontakt" },
  },

  internalLinks: {
    parent: "/technische-personalvermittlung",
    jobs: "/jobs",
    professions: "/berufe",
    industries: "/branchen",
    personalvermittlung: "/technische-personalvermittlung",
    contact: "/kontakt",
    relatedCities: [],
  },

  publication: {
    published: true,
    indexable: true,
    includeInSitemap: true,
    showInCityHub: true,
    showRelatedLinks: true,
  },
} as const satisfies CityContent;
