// Reiner, deterministischer Validator für eine einzelne Branche (EPIC 008A).
// Eigene Domäne mit eigenen Codes; nur die triviale Severity wird geteilt.
// Keine Mutation, keine Seiteneffekte, kein any, kein Cross-Registry-Check
// (relatedProfessions verweisen auf die separate Profession-Registry).
import type { IndustryContent } from "../../content/industries/types";
import type { SearchIntent } from "../../content/professions/types";
import type { Severity } from "./types";

const VALID_INTENTS: readonly SearchIntent[] = ["transactional", "commercial", "informational", "mixed"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 170;

const FORBIDDEN_PATTERNS: readonly { readonly re: RegExp; readonly label: string }[] = [
  { re: /marktführer/i, label: "Marktführer" },
  { re: /\bnummer\s*1\b/i, label: "Nummer 1" },
  { re: /\bnr\.?\s*1\b/i, label: "Nr. 1" },
  { re: /garantiert/i, label: "garantiert" },
  { re: /100\s*%/, label: "100 %" },
  { re: /erfolgsquote/i, label: "Erfolgsquote" },
];

const isBlank = (s: string | undefined): boolean => !s || s.trim().length === 0;
const isValidHref = (href: string): boolean =>
  href.startsWith("/") || href.startsWith("#") || href.startsWith("https://");

function duplicatesOf(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const v of values) {
    const key = v.trim().toLowerCase();
    if (seen.has(key)) dups.add(key);
    else seen.add(key);
  }
  return [...dups];
}

export type IndustryValidationCode =
  // Identität
  | "INDUSTRY_SLUG_EMPTY"
  | "INDUSTRY_SLUG_INVALID"
  | "INDUSTRY_NAME_EMPTY"
  | "INDUSTRY_SHORTNAME_EMPTY"
  | "INDUSTRY_PARENT_EMPTY"
  | "INDUSTRY_CANONICAL_INVALID"
  | "INDUSTRY_CANONICAL_MISMATCH"
  // Status / Veröffentlichung
  | "INDUSTRY_PUBLISHED_FLAG_FALSE"
  | "INDUSTRY_PUBLISHED_NOT_INDEXABLE"
  | "INDUSTRY_PUBLISHED_NOT_IN_SITEMAP"
  | "INDUSTRY_PUBLISHED_NOT_IN_HUB"
  | "INDUSTRY_DRAFT_INDEXABLE"
  | "INDUSTRY_DRAFT_IN_SITEMAP"
  | "INDUSTRY_DRAFT_IN_HUB"
  // Metadata
  | "INDUSTRY_METADATA_TITLE_EMPTY"
  | "INDUSTRY_METADATA_DESCRIPTION_EMPTY"
  | "INDUSTRY_METADATA_TITLE_TOO_LONG"
  | "INDUSTRY_METADATA_DESCRIPTION_TOO_LONG"
  | "INDUSTRY_PRIMARY_KEYWORD_EMPTY"
  | "INDUSTRY_SEARCH_INTENT_INVALID"
  // Inhalt
  | "INDUSTRY_HERO_HEADLINE_EMPTY"
  | "INDUSTRY_HERO_INTRO_EMPTY"
  | "INDUSTRY_OVERVIEW_EMPTY"
  | "INDUSTRY_FOCUS_EMPTY"
  | "INDUSTRY_FAQ_EMPTY"
  | "INDUSTRY_FAQ_QUESTION_EMPTY"
  | "INDUSTRY_FAQ_ANSWER_EMPTY"
  | "INDUSTRY_FAQ_DUPLICATE_QUESTION"
  // CTA / Links
  | "INDUSTRY_CTA_INCOMPLETE"
  | "INDUSTRY_LINK_INVALID"
  | "INDUSTRY_RELATED_SELF_REFERENCE"
  | "INDUSTRY_RELATED_DUPLICATE"
  // Job-Matching
  | "INDUSTRY_JOB_MATCH_MAXJOBS_INVALID"
  | "INDUSTRY_JOB_MATCH_EMPTY"
  | "INDUSTRY_JOB_MATCH_INCLUDE_EXCLUDE_OVERLAP"
  // Verbotene Inhalte
  | "INDUSTRY_FORBIDDEN_CLAIM"
  // Registry
  | "REGISTRY_INDUSTRY_DUPLICATE_SLUG"
  | "REGISTRY_INDUSTRY_DUPLICATE_CANONICAL"
  | "REGISTRY_INDUSTRY_PUBLISHED_ARRAY_MISMATCH"
  | "REGISTRY_INDUSTRY_DRAFT_ARRAY_MISMATCH"
  | "REGISTRY_INDUSTRY_MISSING_IN_SUBARRAYS"
  | "REGISTRY_INDUSTRY_IN_BOTH_SUBARRAYS"
  | "REGISTRY_INDUSTRY_BYSLUG_MISSING"
  | "REGISTRY_INDUSTRY_BYSLUG_MISMATCH"
  | "REGISTRY_INDUSTRY_PUBLISHED_HAS_ERRORS";

export type IndustryValidationIssue = {
  readonly code: IndustryValidationCode;
  readonly message: string;
  readonly path: string;
  readonly severity: Severity;
  readonly industrySlug?: string;
};

export type IndustryValidationResult = {
  readonly valid: boolean;
  readonly errors: readonly IndustryValidationIssue[];
  readonly warnings: readonly IndustryValidationIssue[];
};

function collectText(i: IndustryContent): readonly string[] {
  return [
    i.metadataTitle,
    i.metadataDescription,
    i.hero.headline,
    i.hero.intro,
    i.overview.title,
    ...i.overview.paragraphs,
    ...i.focusAreas.flatMap((f) => [f.title, f.note]),
    ...i.faq.flatMap((f) => [f.q, f.a]),
    i.applicantCta.title,
    i.applicantCta.text,
    i.employerCta.title,
    i.employerCta.text,
  ];
}

export function validateIndustry(i: IndustryContent): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  const slug = i.slug;
  const add = (severity: Severity, code: IndustryValidationCode, path: string, message: string): void => {
    issues.push({ code, message, path, severity, industrySlug: slug || undefined });
  };
  const err = (code: IndustryValidationCode, path: string, message: string) => add("error", code, path, message);
  const warn = (code: IndustryValidationCode, path: string, message: string) => add("warning", code, path, message);

  // 1. Identität
  if (isBlank(slug)) err("INDUSTRY_SLUG_EMPTY", "slug", "slug ist leer.");
  else if (!SLUG_PATTERN.test(slug)) err("INDUSTRY_SLUG_INVALID", "slug", `slug "${slug}" ist ungültig.`);
  if (isBlank(i.name)) err("INDUSTRY_NAME_EMPTY", "name", "name ist leer.");
  if (isBlank(i.shortName)) err("INDUSTRY_SHORTNAME_EMPTY", "shortName", "shortName ist leer.");
  if (isBlank(i.parentSlug)) err("INDUSTRY_PARENT_EMPTY", "parentSlug", "parentSlug ist leer.");

  // Canonical
  if (!i.canonicalPath.startsWith("/")) {
    err("INDUSTRY_CANONICAL_INVALID", "canonicalPath", `canonicalPath "${i.canonicalPath}" muss mit "/" beginnen.`);
  } else if (i.canonicalPath !== `/${i.parentSlug}/${slug}`) {
    err("INDUSTRY_CANONICAL_MISMATCH", "canonicalPath", `canonicalPath "${i.canonicalPath}" passt nicht zu "/${i.parentSlug}/${slug}".`);
  }

  // 2. Status / Veröffentlichung
  const pub = i.publication;
  if (i.status === "published") {
    if (!pub.published) err("INDUSTRY_PUBLISHED_FLAG_FALSE", "publication.published", "status=published, aber publication.published=false.");
    if (!pub.indexable) err("INDUSTRY_PUBLISHED_NOT_INDEXABLE", "publication.indexable", "published muss indexierbar sein.");
    if (!pub.includeInSitemap) err("INDUSTRY_PUBLISHED_NOT_IN_SITEMAP", "publication.includeInSitemap", "published muss in der Sitemap sein.");
    if (!pub.showInIndustryHub) err("INDUSTRY_PUBLISHED_NOT_IN_HUB", "publication.showInIndustryHub", "published muss im Hub sichtbar sein.");
  } else {
    if (pub.indexable) err("INDUSTRY_DRAFT_INDEXABLE", "publication.indexable", "Draft darf nicht indexierbar sein.");
    if (pub.includeInSitemap) err("INDUSTRY_DRAFT_IN_SITEMAP", "publication.includeInSitemap", "Draft gehört nicht in die Sitemap.");
    if (pub.showInIndustryHub) err("INDUSTRY_DRAFT_IN_HUB", "publication.showInIndustryHub", "Draft gehört nicht in den Hub.");
  }

  // 3. Metadata
  if (isBlank(i.metadataTitle)) err("INDUSTRY_METADATA_TITLE_EMPTY", "metadataTitle", "metadataTitle ist leer.");
  else if (i.metadataTitle.length > TITLE_MAX) warn("INDUSTRY_METADATA_TITLE_TOO_LONG", "metadataTitle", `metadataTitle ist ${i.metadataTitle.length} Zeichen (> ${TITLE_MAX}).`);
  if (isBlank(i.metadataDescription)) err("INDUSTRY_METADATA_DESCRIPTION_EMPTY", "metadataDescription", "metadataDescription ist leer.");
  else if (i.metadataDescription.length > DESCRIPTION_MAX) warn("INDUSTRY_METADATA_DESCRIPTION_TOO_LONG", "metadataDescription", `metadataDescription ist ${i.metadataDescription.length} Zeichen (> ${DESCRIPTION_MAX}).`);
  if (isBlank(i.primaryKeyword)) err("INDUSTRY_PRIMARY_KEYWORD_EMPTY", "primaryKeyword", "primaryKeyword ist leer.");
  if (!VALID_INTENTS.includes(i.searchIntent)) err("INDUSTRY_SEARCH_INTENT_INVALID", "searchIntent", `searchIntent "${i.searchIntent}" ist ungültig.`);

  // 4. Inhalt
  if (isBlank(i.hero.headline)) err("INDUSTRY_HERO_HEADLINE_EMPTY", "hero.headline", "hero.headline ist leer.");
  if (isBlank(i.hero.intro)) err("INDUSTRY_HERO_INTRO_EMPTY", "hero.intro", "hero.intro ist leer.");
  if (i.overview.paragraphs.length === 0 || i.overview.paragraphs.every(isBlank)) err("INDUSTRY_OVERVIEW_EMPTY", "overview.paragraphs", "overview ist leer.");
  if (i.focusAreas.length === 0) err("INDUSTRY_FOCUS_EMPTY", "focusAreas", "focusAreas ist leer.");

  // FAQ
  if (i.faq.length === 0) err("INDUSTRY_FAQ_EMPTY", "faq", "faq ist leer.");
  i.faq.forEach((f, idx) => {
    if (isBlank(f.q)) err("INDUSTRY_FAQ_QUESTION_EMPTY", `faq[${idx}].q`, "FAQ-Frage ist leer.");
    if (isBlank(f.a)) err("INDUSTRY_FAQ_ANSWER_EMPTY", `faq[${idx}].a`, "FAQ-Antwort ist leer.");
  });
  for (const dup of duplicatesOf(i.faq.map((f) => f.q))) err("INDUSTRY_FAQ_DUPLICATE_QUESTION", "faq", `Doppelte FAQ-Frage: "${dup}".`);

  // 5. CTA / Links
  const checkCta = (cta: { label: string; href: string } | undefined, path: string, required: boolean): void => {
    if (!cta) {
      if (required) err("INDUSTRY_CTA_INCOMPLETE", path, "CTA fehlt.");
      return;
    }
    if (isBlank(cta.label) || isBlank(cta.href)) err("INDUSTRY_CTA_INCOMPLETE", path, "CTA hat leeres label oder href.");
    else if (!isValidHref(cta.href)) err("INDUSTRY_LINK_INVALID", `${path}.href`, `CTA-href "${cta.href}" ist ungültig.`);
  };
  checkCta(i.hero.primaryCta, "hero.primaryCta", true);
  checkCta(i.hero.secondaryCta, "hero.secondaryCta", true);
  checkCta(i.applicantCta.primaryCta, "applicantCta.primaryCta", true);
  checkCta(i.applicantCta.secondaryCta, "applicantCta.secondaryCta", false);
  checkCta(i.employerCta.primaryCta, "employerCta.primaryCta", true);
  checkCta(i.employerCta.secondaryCta, "employerCta.secondaryCta", false);

  const links = i.internalLinks;
  for (const [key, href] of [["parent", links.parent], ["jobs", links.jobs], ["personalvermittlung", links.personalvermittlung], ["kontakt", links.kontakt]] as const) {
    if (isBlank(href) || !isValidHref(href)) err("INDUSTRY_LINK_INVALID", `internalLinks.${key}`, `interner Link "${href}" ist ungültig.`);
  }
  if (links.relatedProfessions.includes(slug)) err("INDUSTRY_RELATED_SELF_REFERENCE", "internalLinks.relatedProfessions", "Branche referenziert sich selbst.");
  for (const dup of duplicatesOf(links.relatedProfessions)) err("INDUSTRY_RELATED_DUPLICATE", "internalLinks.relatedProfessions", `Doppelter related-Slug: "${dup}".`);

  // 6. Job-Matching
  const jm = i.jobMatch;
  if (!Number.isInteger(jm.maxJobs) || jm.maxJobs < 1) err("INDUSTRY_JOB_MATCH_MAXJOBS_INVALID", "jobMatch.maxJobs", `maxJobs "${jm.maxJobs}" muss ganzzahlig >= 1 sein.`);
  const cats = jm.category ?? [];
  const tags = jm.tags ?? [];
  const keywords = jm.keywords ?? [];
  if (cats.length === 0 && tags.length === 0 && keywords.length === 0) err("INDUSTRY_JOB_MATCH_EMPTY", "jobMatch", "jobMatch hat kein einziges Signal.");
  const excludes = new Set((jm.excludeKeywords ?? []).map((k) => k.trim().toLowerCase()));
  for (const k of keywords) {
    if (excludes.has(k.trim().toLowerCase())) err("INDUSTRY_JOB_MATCH_INCLUDE_EXCLUDE_OVERLAP", "jobMatch", `Keyword "${k}" steht auch in excludeKeywords.`);
  }

  // 7. Verbotene Muster
  for (const text of collectText(i)) {
    for (const f of FORBIDDEN_PATTERNS) {
      if (f.re.test(text)) err("INDUSTRY_FORBIDDEN_CLAIM", "text", `Verbotenes Muster "${f.label}" gefunden.`);
    }
  }

  const errors = issues.filter((x) => x.severity === "error");
  const warnings = issues.filter((x) => x.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}
