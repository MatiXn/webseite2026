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
  readonly nearbyCities?: readonly string[];
  readonly nearbyRegions?: readonly string[];
  readonly serviceRadiusText?: string; // sprachliche Umschreibung, keine Zahl
};

export type CityHero = {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly intro: string;
  readonly primaryCta: Cta;
  readonly secondaryCta: Cta;
};

export type CityOverview = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

// Lokale Erfahrung. verifiedExperience=true bedeutet ausschließlich: PHE-Perm hat
// dort tatsächlich vermittelt oder Kunden/Kandidaten betreut. Keine Zahlen erfinden.
export type CityLocalExperience = {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly verifiedExperience: boolean;
  readonly servedProfiles?: readonly string[];
  readonly servedIndustries?: readonly string[];
};

// Nutzenblock (Unternehmen bzw. Bewerber). bulletPoints als readonly-Struktur.
export type CityAudienceValue = {
  readonly title: string;
  readonly text: string;
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
  readonly primaryKeyword: string;
  readonly secondaryKeywords: readonly string[];
  readonly searchIntent: SearchIntent;
  // Inhalt
  readonly hero: CityHero;
  readonly overview: CityOverview;
  readonly localExperience: CityLocalExperience;
  // Fachbereiche (nur published Slugs; Composer/Registry validieren)
  readonly relevantProfessions: readonly string[];
  readonly relevantIndustries: readonly string[];
  // Job-Matching (dieselbe generische Config wie Profession/Industry). Keine lokale Jobliste.
  readonly jobMatch: JobMatchConfig;
  // Nutzen
  readonly employerValue: CityAudienceValue;
  readonly candidateValue: CityAudienceValue;
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
