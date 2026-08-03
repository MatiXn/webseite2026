// Reiner, deterministischer Validator für eine einzelne Stadt (EPIC 010A).
// Eigene Domäne mit eigenen Codes; nur die triviale Severity wird geteilt.
// Keine Mutation, keine Seiteneffekte, kein any, kein Cross-Registry-Check
// (relevantProfessions/relevantIndustries/relatedCities verweisen auf separate
// Registries; deren Auflösung passiert in den Composern/Registry-Validator).
import type { CityContent } from "../../content/cities/types";
import type { SearchIntent } from "../../content/professions/types";
import type { Severity } from "./types";

const VALID_INTENTS: readonly SearchIntent[] = ["transactional", "commercial", "informational", "mixed"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 170;
const CANONICAL_PREFIX = "/personalvermittlung/";
const NUMERIC_JOB_URL = /^\/jobs\/\d+\/?$/;

// Marketing-/Vertrauens-Claims, die nicht belegbar sind.
const FORBIDDEN_PATTERNS: readonly { readonly re: RegExp; readonly label: string }[] = [
  { re: /marktführer/i, label: "Marktführer" },
  { re: /\bnummer\s*1\b/i, label: "Nummer 1" },
  { re: /\bnr\.?\s*1\b/i, label: "Nr. 1" },
  { re: /garantiert/i, label: "garantiert" },
  { re: /100\s*%/, label: "100 %" },
  { re: /erfolgsquote/i, label: "Erfolgsquote" },
];

// Erfundene Aktivitätszahlen (Kunden-/Kandidaten-/Vermittlungszahlen) sind unabhängig
// von verifiedExperience verboten. "Jahre" bewusst NICHT erfasst.
const FORBIDDEN_NUMBER = /\b(?:\d+|über\s+\d+|mehr\s+als\s+\d+)\s*(?:kunden|kandidaten|vermittlungen|unternehmen|fachkräfte|platzierungen|besetzungen)\b/i;

// Formulierungen, die reale lokale Vermittlung/Betreuung behaupten. Nur zulässig,
// wenn verifiedExperience === true.
const REALIZED_LOCAL_PATTERNS: readonly RegExp[] = [
  /erfolgreich vermittelt/i,
  /bereits vermittelt/i,
  /haben wir[^.]*(?:vermittelt|besetzt)/i,
  /betreuen wir[^.]*(?:kunden|kandidaten|unternehmen)/i,
  /langjährige\s+(?:lokale\s+)?erfahrung/i,
  /vor ort\s+(?:betreut|vermittelt|aktiv)/i,
];

const isBlank = (s: string | undefined): boolean => !s || s.trim().length === 0;
const isValidHref = (href: string): boolean => href.startsWith("/") || href.startsWith("#") || href.startsWith("https://");

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

export type CityValidationCode =
  // Identität
  | "CITY_SLUG_EMPTY"
  | "CITY_SLUG_INVALID"
  | "CITY_NAME_EMPTY"
  | "CITY_SHORTNAME_EMPTY"
  | "CITY_TYPE_INVALID"
  | "CITY_PARENT_INVALID"
  | "CITY_CANONICAL_INVALID"
  | "CITY_CANONICAL_MISMATCH"
  // Status / Veröffentlichung
  | "CITY_PUBLISHED_FLAG_FALSE"
  | "CITY_PUBLISHED_NOT_INDEXABLE"
  | "CITY_PUBLISHED_NOT_IN_SITEMAP"
  | "CITY_PUBLISHED_NOT_IN_HUB"
  | "CITY_DRAFT_PUBLISHED"
  | "CITY_DRAFT_INDEXABLE"
  | "CITY_DRAFT_IN_SITEMAP"
  | "CITY_DRAFT_IN_HUB"
  // Metadata
  | "CITY_METADATA_TITLE_EMPTY"
  | "CITY_METADATA_DESCRIPTION_EMPTY"
  | "CITY_METADATA_TITLE_TOO_LONG"
  | "CITY_METADATA_DESCRIPTION_TOO_LONG"
  | "CITY_METADATA_DOUBLE_BRANDING"
  | "CITY_PRIMARY_KEYWORD_EMPTY"
  | "CITY_SEARCH_INTENT_INVALID"
  // Lokalität
  | "CITY_CITYNAME_EMPTY"
  | "CITY_FEDERALSTATE_EMPTY"
  | "CITY_AREASERVED_EMPTY"
  | "CITY_NEARBY_EMPTY_ENTRY"
  | "CITY_NEARBY_SELF_REFERENCE"
  // Inhalt
  | "CITY_HERO_HEADLINE_EMPTY"
  | "CITY_HERO_INTRO_EMPTY"
  | "CITY_OVERVIEW_EMPTY"
  | "CITY_LOCAL_EXPERIENCE_EMPTY"
  | "CITY_EMPLOYER_VALUE_EMPTY"
  | "CITY_CANDIDATE_VALUE_EMPTY"
  | "CITY_FAQ_EMPTY"
  | "CITY_FAQ_QUESTION_EMPTY"
  | "CITY_FAQ_ANSWER_EMPTY"
  | "CITY_FAQ_DUPLICATE_QUESTION"
  // Erfahrung / verbotene Inhalte
  | "CITY_UNVERIFIED_LOCAL_CLAIM"
  | "CITY_FORBIDDEN_NUMBER"
  | "CITY_FORBIDDEN_CLAIM"
  // Optionale Inhaltsblöcke (EPIC 010B)
  | "CITY_BLOCK_EMPTY"
  | "CITY_SPECIALIZATION_LINK_INVALID"
  | "CITY_FINAL_CTA_INCOMPLETE"
  // CTA / Links
  | "CITY_CTA_INCOMPLETE"
  | "CITY_LINK_INVALID"
  | "CITY_LINK_NUMERIC_JOB"
  | "CITY_RELATED_SELF_REFERENCE"
  | "CITY_RELATED_DUPLICATE"
  // Registry
  | "REGISTRY_CITY_DUPLICATE_SLUG"
  | "REGISTRY_CITY_DUPLICATE_CANONICAL"
  | "REGISTRY_CITY_PUBLISHED_ARRAY_MISMATCH"
  | "REGISTRY_CITY_DRAFT_ARRAY_MISMATCH"
  | "REGISTRY_CITY_MISSING_IN_SUBARRAYS"
  | "REGISTRY_CITY_IN_BOTH_SUBARRAYS"
  | "REGISTRY_CITY_BYSLUG_MISSING"
  | "REGISTRY_CITY_BYSLUG_MISMATCH"
  | "REGISTRY_CITY_PUBLISHED_HAS_ERRORS"
  | "REGISTRY_CITY_RELATED_NOT_PUBLISHED";

export type CityValidationIssue = {
  readonly code: CityValidationCode;
  readonly message: string;
  readonly path: string;
  readonly severity: Severity;
  readonly citySlug?: string;
};

export type CityValidationResult = {
  readonly valid: boolean;
  readonly errors: readonly CityValidationIssue[];
  readonly warnings: readonly CityValidationIssue[];
};

function collectText(c: CityContent): readonly string[] {
  const audience = (v: CityContent["employerValue"]): string[] =>
    v ? [v.title, v.text ?? "", ...v.bulletPoints] : [];
  return [
    c.metadataTitle,
    c.metadataDescription,
    c.openGraphTitle ?? "",
    c.openGraphDescription ?? "",
    c.hero.headline,
    c.hero.intro,
    ...(c.hero.supportingParagraphs ?? []),
    ...(c.overview ? [c.overview.title, ...c.overview.paragraphs] : []),
    ...(c.localExperience ? [c.localExperience.title, ...c.localExperience.paragraphs] : []),
    ...(c.differentiators ? [c.differentiators.title, ...c.differentiators.items] : []),
    ...(c.employerProcess ? [c.employerProcess.title, ...c.employerProcess.steps.flatMap((s) => [s.title, s.description])] : []),
    ...(c.servedIndustryTags ? [c.servedIndustryTags.title, ...c.servedIndustryTags.tags] : []),
    ...(c.boundaries ? [c.boundaries.title, ...c.boundaries.paragraphs] : []),
    ...(c.finalCta ? [c.finalCta.title] : []),
    ...audience(c.employerValue),
    ...audience(c.candidateValue),
    ...c.faq.flatMap((f) => [f.q, f.a]),
  ];
}

export function validateCity(c: CityContent): CityValidationResult {
  const issues: CityValidationIssue[] = [];
  const slug = c.slug;
  const add = (severity: Severity, code: CityValidationCode, path: string, message: string): void => {
    issues.push({ code, message, path, severity, citySlug: slug || undefined });
  };
  const err = (code: CityValidationCode, path: string, message: string) => add("error", code, path, message);
  const warn = (code: CityValidationCode, path: string, message: string) => add("warning", code, path, message);

  // 1. Identität
  if (isBlank(slug)) err("CITY_SLUG_EMPTY", "slug", "slug ist leer.");
  else if (!SLUG_PATTERN.test(slug)) err("CITY_SLUG_INVALID", "slug", `slug "${slug}" ist ungültig.`);
  if (isBlank(c.name)) err("CITY_NAME_EMPTY", "name", "name ist leer.");
  if (isBlank(c.shortName)) err("CITY_SHORTNAME_EMPTY", "shortName", "shortName ist leer.");
  if (c.type !== "city") err("CITY_TYPE_INVALID", "type", `type muss "city" sein (ist "${c.type}").`);
  if (c.parentSlug !== "personalvermittlung") err("CITY_PARENT_INVALID", "parentSlug", `parentSlug muss "personalvermittlung" sein (ist "${c.parentSlug}").`);

  // Canonical
  if (!c.canonicalPath.startsWith(CANONICAL_PREFIX)) {
    err("CITY_CANONICAL_INVALID", "canonicalPath", `canonicalPath "${c.canonicalPath}" muss mit "${CANONICAL_PREFIX}" beginnen.`);
  } else if (c.canonicalPath !== `/${c.parentSlug}/${slug}`) {
    err("CITY_CANONICAL_MISMATCH", "canonicalPath", `canonicalPath "${c.canonicalPath}" passt nicht zu "/${c.parentSlug}/${slug}".`);
  }

  // 2. Status / Veröffentlichung
  const pub = c.publication;
  if (c.status === "published") {
    if (!pub.published) err("CITY_PUBLISHED_FLAG_FALSE", "publication.published", "status=published, aber publication.published=false.");
    if (!pub.indexable) err("CITY_PUBLISHED_NOT_INDEXABLE", "publication.indexable", "published muss indexierbar sein.");
    if (!pub.includeInSitemap) err("CITY_PUBLISHED_NOT_IN_SITEMAP", "publication.includeInSitemap", "published muss in der Sitemap sein.");
    if (!pub.showInCityHub) err("CITY_PUBLISHED_NOT_IN_HUB", "publication.showInCityHub", "published muss im City-Hub sichtbar sein.");
  } else {
    if (pub.published) err("CITY_DRAFT_PUBLISHED", "publication.published", "Draft darf publication.published nicht true haben.");
    if (pub.indexable) err("CITY_DRAFT_INDEXABLE", "publication.indexable", "Draft darf nicht indexierbar sein.");
    if (pub.includeInSitemap) err("CITY_DRAFT_IN_SITEMAP", "publication.includeInSitemap", "Draft gehört nicht in die Sitemap.");
    if (pub.showInCityHub) err("CITY_DRAFT_IN_HUB", "publication.showInCityHub", "Draft gehört nicht in den City-Hub.");
  }

  // 3. Metadata
  if (isBlank(c.metadataTitle)) err("CITY_METADATA_TITLE_EMPTY", "metadataTitle", "metadataTitle ist leer.");
  else {
    if (c.metadataTitle.length > TITLE_MAX) warn("CITY_METADATA_TITLE_TOO_LONG", "metadataTitle", `metadataTitle ist ${c.metadataTitle.length} Zeichen (> ${TITLE_MAX}).`);
    if ((c.metadataTitle.match(/phe-perm/gi) ?? []).length > 1) err("CITY_METADATA_DOUBLE_BRANDING", "metadataTitle", "metadataTitle enthält das Branding \"PHE-Perm\" mehr als einmal.");
  }
  if (isBlank(c.metadataDescription)) err("CITY_METADATA_DESCRIPTION_EMPTY", "metadataDescription", "metadataDescription ist leer.");
  else if (c.metadataDescription.length > DESCRIPTION_MAX) warn("CITY_METADATA_DESCRIPTION_TOO_LONG", "metadataDescription", `metadataDescription ist ${c.metadataDescription.length} Zeichen (> ${DESCRIPTION_MAX}).`);
  if (isBlank(c.primaryKeyword)) err("CITY_PRIMARY_KEYWORD_EMPTY", "primaryKeyword", "primaryKeyword ist leer.");
  if (!VALID_INTENTS.includes(c.searchIntent)) err("CITY_SEARCH_INTENT_INVALID", "searchIntent", `searchIntent "${c.searchIntent}" ist ungültig.`);

  // 4. Lokalität
  const loc = c.local;
  if (isBlank(loc.cityName)) err("CITY_CITYNAME_EMPTY", "local.cityName", "cityName ist leer.");
  if (isBlank(loc.federalState)) err("CITY_FEDERALSTATE_EMPTY", "local.federalState", "federalState ist leer.");
  if (isBlank(loc.areaServed)) err("CITY_AREASERVED_EMPTY", "local.areaServed", "areaServed ist leer.");
  const nearby = [...(loc.nearbyCities ?? []), ...(loc.nearbyRegions ?? [])];
  if (nearby.some(isBlank)) err("CITY_NEARBY_EMPTY_ENTRY", "local.nearbyCities", "nearbyCities/nearbyRegions enthält einen leeren Eintrag.");
  const selfNames = new Set([loc.cityName, c.name, slug].map((s) => s.trim().toLowerCase()));
  if ((loc.nearbyCities ?? []).some((n) => selfNames.has(n.trim().toLowerCase()))) {
    err("CITY_NEARBY_SELF_REFERENCE", "local.nearbyCities", "nearbyCities referenziert die Stadt selbst.");
  }

  // 5. Inhalt (overview/localExperience/employerValue/candidateValue optional – nur prüfen, wenn vorhanden)
  if (isBlank(c.hero.headline)) err("CITY_HERO_HEADLINE_EMPTY", "hero.headline", "hero.headline ist leer.");
  if (isBlank(c.hero.intro)) err("CITY_HERO_INTRO_EMPTY", "hero.intro", "hero.intro ist leer.");
  if (c.overview && (c.overview.paragraphs.length === 0 || c.overview.paragraphs.every(isBlank))) err("CITY_OVERVIEW_EMPTY", "overview.paragraphs", "overview ist vorhanden, aber leer.");
  if (c.localExperience && (c.localExperience.paragraphs.length === 0 || c.localExperience.paragraphs.every(isBlank))) err("CITY_LOCAL_EXPERIENCE_EMPTY", "localExperience.paragraphs", "localExperience ist vorhanden, aber leer.");
  if (c.employerValue && (isBlank(c.employerValue.title) || c.employerValue.bulletPoints.length === 0)) err("CITY_EMPLOYER_VALUE_EMPTY", "employerValue", "employerValue ist unvollständig (title/bulletPoints).");
  if (c.candidateValue && (isBlank(c.candidateValue.title) || c.candidateValue.bulletPoints.length === 0)) err("CITY_CANDIDATE_VALUE_EMPTY", "candidateValue", "candidateValue ist unvollständig (title/bulletPoints).");

  // Optionale generische Blöcke (nur prüfen, wenn vorhanden)
  if (c.differentiators && (isBlank(c.differentiators.title) || c.differentiators.items.length === 0 || c.differentiators.items.some(isBlank))) err("CITY_BLOCK_EMPTY", "differentiators", "differentiators ist vorhanden, aber unvollständig.");
  if (c.employerProcess && (isBlank(c.employerProcess.title) || c.employerProcess.steps.length === 0 || c.employerProcess.steps.some((s) => isBlank(s.title) || isBlank(s.description)))) err("CITY_BLOCK_EMPTY", "employerProcess", "employerProcess ist vorhanden, aber unvollständig.");
  if (c.servedIndustryTags && (isBlank(c.servedIndustryTags.title) || c.servedIndustryTags.tags.length === 0 || c.servedIndustryTags.tags.some(isBlank))) err("CITY_BLOCK_EMPTY", "servedIndustryTags", "servedIndustryTags ist vorhanden, aber unvollständig.");
  if (c.boundaries && (isBlank(c.boundaries.title) || c.boundaries.paragraphs.length === 0 || c.boundaries.paragraphs.every(isBlank))) err("CITY_BLOCK_EMPTY", "boundaries", "boundaries ist vorhanden, aber unvollständig.");
  if (c.specializations) {
    if (isBlank(c.specializations.title) || c.specializations.items.length === 0) err("CITY_BLOCK_EMPTY", "specializations", "specializations ist vorhanden, aber unvollständig.");
    for (const [i, s] of c.specializations.items.entries()) {
      if (isBlank(s.label)) err("CITY_BLOCK_EMPTY", `specializations.items[${i}]`, "Spezialisierung hat leeres label.");
      if (isBlank(s.href) || !isValidHref(s.href)) err("CITY_SPECIALIZATION_LINK_INVALID", `specializations.items[${i}].href`, `Spezialisierungs-Link "${s.href}" ist ungültig.`);
      else if (NUMERIC_JOB_URL.test(s.href)) err("CITY_SPECIALIZATION_LINK_INVALID", `specializations.items[${i}].href`, `Spezialisierungs-Link "${s.href}" ist eine numerische Job-URL.`);
    }
  }
  if (c.finalCta && (isBlank(c.finalCta.title) || isBlank(c.finalCta.cta.label) || isBlank(c.finalCta.cta.href) || !isValidHref(c.finalCta.cta.href))) err("CITY_FINAL_CTA_INCOMPLETE", "finalCta", "finalCta ist unvollständig oder hat ungültigen href.");

  // FAQ
  if (c.faq.length === 0) err("CITY_FAQ_EMPTY", "faq", "faq ist leer.");
  c.faq.forEach((f, idx) => {
    if (isBlank(f.q)) err("CITY_FAQ_QUESTION_EMPTY", `faq[${idx}].q`, "FAQ-Frage ist leer.");
    if (isBlank(f.a)) err("CITY_FAQ_ANSWER_EMPTY", `faq[${idx}].a`, "FAQ-Antwort ist leer.");
  });
  for (const dup of duplicatesOf(c.faq.map((f) => f.q))) err("CITY_FAQ_DUPLICATE_QUESTION", "faq", `Doppelte FAQ-Frage: "${dup}".`);

  // 6. Erfahrung / verbotene Inhalte
  const allText = collectText(c);
  // Ohne verifizierte Erfahrung dürfen (optionale) lokale Erfahrungstexte keine reale
  // lokale Vermittlung/Betreuung behaupten.
  if (!c.local.verifiedExperience && c.localExperience) {
    const expText = [c.localExperience.title, ...c.localExperience.paragraphs];
    for (const re of REALIZED_LOCAL_PATTERNS) {
      if (expText.some((t) => re.test(t))) {
        err("CITY_UNVERIFIED_LOCAL_CLAIM", "localExperience", "local.verifiedExperience=false, aber der Text behauptet reale lokale Vermittlung/Betreuung.");
        break;
      }
    }
  }
  for (const text of allText) {
    if (FORBIDDEN_NUMBER.test(text)) { err("CITY_FORBIDDEN_NUMBER", "text", "Erfundene Aktivitätszahl (Kunden/Kandidaten/Vermittlungen) gefunden."); break; }
  }
  for (const text of allText) {
    for (const f of FORBIDDEN_PATTERNS) {
      if (f.re.test(text)) { err("CITY_FORBIDDEN_CLAIM", "text", `Verbotenes Muster "${f.label}" gefunden.`); break; }
    }
  }

  // 7. CTA / Links
  const checkCta = (cta: { label: string; href: string } | undefined, path: string): void => {
    if (!cta || isBlank(cta.label) || isBlank(cta.href)) { err("CITY_CTA_INCOMPLETE", path, "CTA fehlt oder hat leeres label/href."); return; }
    if (!isValidHref(cta.href)) err("CITY_LINK_INVALID", `${path}.href`, `CTA-href "${cta.href}" ist ungültig.`);
  };
  checkCta(c.hero.primaryCta, "hero.primaryCta");
  checkCta(c.hero.secondaryCta, "hero.secondaryCta");

  const il = c.internalLinks;
  for (const [key, href] of [
    ["parent", il.parent], ["jobs", il.jobs], ["professions", il.professions],
    ["industries", il.industries], ["personalvermittlung", il.personalvermittlung], ["contact", il.contact],
  ] as const) {
    if (isBlank(href) || !isValidHref(href)) err("CITY_LINK_INVALID", `internalLinks.${key}`, `interner Link "${href}" ist ungültig.`);
    else if (NUMERIC_JOB_URL.test(href)) err("CITY_LINK_NUMERIC_JOB", `internalLinks.${key}`, `interner Link "${href}" ist eine numerische Job-URL.`);
  }
  if (il.relatedCities.includes(slug)) err("CITY_RELATED_SELF_REFERENCE", "internalLinks.relatedCities", "Stadt referenziert sich selbst in relatedCities.");
  for (const dup of duplicatesOf(il.relatedCities)) err("CITY_RELATED_DUPLICATE", "internalLinks.relatedCities", `Doppelter relatedCity-Slug: "${dup}".`);
  for (const dup of duplicatesOf(c.relevantProfessions)) err("CITY_RELATED_DUPLICATE", "relevantProfessions", `Doppelter relevantProfession-Slug: "${dup}".`);
  for (const dup of duplicatesOf(c.relevantIndustries)) err("CITY_RELATED_DUPLICATE", "relevantIndustries", `Doppelter relevantIndustry-Slug: "${dup}".`);

  const errors = issues.filter((x) => x.severity === "error");
  const warnings = issues.filter((x) => x.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}
