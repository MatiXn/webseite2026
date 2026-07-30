// Branchen-Datenmodell (EPIC 008A). Eigenständige Domäne — KEIN Shared-Type-Layer.
// Generische Content-Primitive werden aus bestehenden Modulen importiert (kein Copy):
//   Cta, JobMatchConfig, SearchIntent (professions/types), FaqEntry (faq).
// Branchen-spezifische Strukturen sind hier lokal definiert.
import type { Cta, JobMatchConfig, SearchIntent } from "../professions/types";
import type { FaqEntry } from "../faq";

export type IndustryStatus = "published" | "draft";

export type IndustryPublication = {
  readonly published: boolean;
  readonly indexable: boolean;
  readonly includeInSitemap: boolean;
  readonly showInIndustryHub: boolean;
  readonly showRelatedLinks: boolean;
};

export type IndustryHero = {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly intro: string;
  readonly primaryCta: Cta;
  readonly secondaryCta: Cta;
};

export type IndustryOverview = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

export type IndustryFocusArea = {
  readonly title: string;
  readonly note: string; // sachliche Einordnung, keine Marktzahlen
};

export type IndustryAudienceCta = {
  readonly title: string;
  readonly text: string;
  readonly primaryCta: Cta;
  readonly secondaryCta?: Cta;
};

export type IndustryInternalLinks = {
  readonly parent: string; // Hub, z. B. "/branchen"
  readonly jobs: string;
  readonly personalvermittlung: string;
  readonly kontakt: string;
  readonly relatedProfessions: readonly string[]; // NUR published Profession-Slugs
};

export type IndustryContent = {
  // Identität
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly status: IndustryStatus;
  readonly parentSlug: string; // "branchen"
  // SEO
  readonly metadataTitle: string;
  readonly metadataDescription: string;
  readonly canonicalPath: string; // "/branchen/<slug>"
  readonly primaryKeyword: string;
  readonly secondaryKeywords: readonly string[];
  readonly searchIntent: SearchIntent;
  // Inhalt
  readonly hero: IndustryHero;
  readonly overview: IndustryOverview;
  readonly focusAreas: readonly IndustryFocusArea[];
  readonly faq: readonly FaqEntry[];
  // Zielgruppen-CTAs
  readonly applicantCta: IndustryAudienceCta;
  readonly employerCta: IndustryAudienceCta;
  // Interne Links
  readonly internalLinks: IndustryInternalLinks;
  // Job-Matching (dieselbe generische Config wie bei Professionen)
  readonly jobMatch: JobMatchConfig;
  // Veröffentlichung
  readonly publication: IndustryPublication;
};

// Eingabeform für die Registry-Validierung.
export type IndustryRegistryInput = {
  readonly industries: readonly IndustryContent[];
  readonly publishedIndustries: readonly IndustryContent[];
  readonly draftIndustries: readonly IndustryContent[];
  readonly industryBySlug: Readonly<Record<string, IndustryContent>>;
};
