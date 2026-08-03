// City-Datenmodell (EPIC 010A). Eigenständige Domäne — KEIN Shared-Type-Layer,
// KEINE universelle ContentPage-Abstraktion. Generische Content-Primitive werden
// aus bestehenden Modulen importiert (kein Copy): Cta, JobMatchConfig, SearchIntent
// (professions/types), FaqEntry (faq). City-spezifische Strukturen sind hier lokal
// definiert.
//
// Domänen-Abgrenzung:
//   Profession = Berufsprofil, Industry = Branchenumfeld, City = lokaler
//   Vermittlungsmarkt. Eine City-Config beschreibt das lokale Einsatzumfeld,
//   NICHT ein Beruf oder eine Branche.
import type { Cta, JobMatchConfig, SearchIntent } from "../professions/types";
import type { FaqEntry } from "../faq";

export type CityStatus = "draft" | "published";

export type CityPublication = {
  readonly published: boolean;
  readonly indexable: boolean;
  readonly includeInSitemap: boolean;
  readonly showInCityHub: boolean;
  readonly showRelatedLinks: boolean;
};

// Lokaler Kontext. Keine erfundenen Kilometerwerte, keine Geo-Koordinaten,
// keine erfundene lokale Adresse (das Büro liegt ausschließlich in Düsseldorf).
export type CityLocalContext = {
  readonly cityName: string;
  readonly federalState: string;
  readonly country: string; // ISO 3166-1 alpha-2, z. B. "DE"
  readonly areaServed: string; // bedientes Gebiet (Freitext, keine km-Angabe)
  // true nur, wenn PHE-Perm dort tatsächlich vermittelt/betreut hat (z. B. Bürostandort).
  // Steuert, ob Texte reale lokale Vermittlung behaupten dürfen. Keine Zahlen erfinden.
  readonly verifiedExperience: boolean;
  readonly nearbyCities?: readonly string[];
  readonly nearbyRegions?: readonly string[];
  readonly serviceRadiusText?: string; // sprachliche Umschreibung, keine Zahl
};

export type CityHero = {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly intro: string;
  readonly supportingParagraphs?: readonly string[]; // optionale Folgeabsätze unter dem Lead
  readonly primaryCta: Cta;
  readonly secondaryCta: Cta;
};

export type CityOverview = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

// EPIC 010B: optionale, generische Inhaltsblöcke (Template rendert nur bei Vorhandensein).
// Eingeführt für die verlustfreie Düsseldorf-Migration; für andere Städte optional.
export type CityDifferentiators = {
  readonly title: string;
  readonly items: readonly string[]; // Grundsätze / Warum-anders-Punkte
};

export type CitySpecialization = {
  readonly label: string;
  readonly href: string; // interner Pfad (Validator prüft)
};

export type CitySpecializations = {
  readonly title: string;
  readonly items: readonly CitySpecialization[];
};

export type CityProcessStep = {
  readonly title: string;
  readonly description: string;
};

export type CityEmployerProcess = {
  readonly title: string;
  readonly steps: readonly CityProcessStep[];
};

export type CityServedIndustryTags = {
  readonly title: string;
  readonly tags: readonly string[]; // beschreibende Branchen-Chips (keine Engine-Slugs)
};

export type CityProseBlock = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

export type CityFinalCta = {
  readonly title: string;
  readonly cta: Cta;
};

// Optionaler Prosablock zur lokalen Erfahrung. Ob reale lokale Vermittlung behauptet
// werden darf, steuert das city-weite Flag local.verifiedExperience. Keine Zahlen erfinden.
export type CityLocalExperience = {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly servedProfiles?: readonly string[];
  readonly servedIndustries?: readonly string[];
};

// Nutzenblock (Unternehmen bzw. Bewerber). bulletPoints als readonly-Struktur.
// text ist optional (manche Abschnitte bestehen nur aus Titel + Punkten).
export type CityAudienceValue = {
  readonly title: string;
  readonly text?: string;
  readonly bulletPoints: readonly string[];
};

export type CityInternalLinks = {
  readonly parent: string; // Breadcrumb-Parent (bestehender Pillar, keine erfundene Hub-Route)
  readonly jobs: string;
  readonly professions: string; // Berufe-Hub
  readonly industries: string; // Branchen-Hub
  readonly personalvermittlung: string; // Pillar /technische-personalvermittlung
  readonly contact: string;
  readonly relatedCities: readonly string[]; // NUR published City-Slugs (Composer filtert)
};

export type CityContent = {
  // Identität
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly type: "city";
  readonly status: CityStatus;
  readonly parentSlug: "personalvermittlung";
  readonly canonicalPath: string; // "/personalvermittlung/<slug>"
  // Lokaler Kontext
  readonly local: CityLocalContext;
  // SEO
  readonly metadataTitle: string;
  readonly metadataDescription: string;
  readonly openGraphTitle?: string; // optionaler OG-Title (sonst = metadataTitle)
  readonly openGraphDescription?: string; // optionale OG-Description (sonst = metadataDescription)
  readonly primaryKeyword: string;
  readonly secondaryKeywords: readonly string[];
  readonly searchIntent: SearchIntent;
  // Inhalt (overview/localExperience optional — nicht jede Stadt hat beide Abschnitte)
  readonly hero: CityHero;
  readonly overview?: CityOverview;
  readonly localExperience?: CityLocalExperience;
  // Optionale generische Inhaltsblöcke (EPIC 010B). Template rendert nur bei Vorhandensein.
  readonly differentiators?: CityDifferentiators;
  readonly specializations?: CitySpecializations;
  readonly employerProcess?: CityEmployerProcess;
  readonly servedIndustryTags?: CityServedIndustryTags;
  readonly boundaries?: CityProseBlock;
  readonly finalCta?: CityFinalCta;
  // Fachbereiche (nur published Slugs; Composer/Registry validieren)
  readonly relevantProfessions: readonly string[];
  readonly relevantIndustries: readonly string[];
  // Job-Matching (dieselbe generische Config wie Profession/Industry). Keine lokale Jobliste.
  readonly jobMatch: JobMatchConfig;
  // Nutzen (beide optional — nicht jede Stadt hat beide Zielgruppenblöcke)
  readonly employerValue?: CityAudienceValue;
  readonly candidateValue?: CityAudienceValue;
  // FAQ
  readonly faq: readonly FaqEntry[];
  // Interne Links
  readonly internalLinks: CityInternalLinks;
  // Veröffentlichung
  readonly publication: CityPublication;
};

// Eingabeform für die Registry-Validierung (analog IndustryRegistryInput).
export type CityRegistryInput = {
  readonly cities: readonly CityContent[];
  readonly publishedCities: readonly CityContent[];
  readonly draftCities: readonly CityContent[];
  readonly cityBySlug: Readonly<Record<string, CityContent>>;
};
