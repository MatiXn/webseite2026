// Reiner, deterministischer Validator für eine einzelne Profession.
// Keine Mutation der Eingabe, keine Seiteneffekte, kein any, kein JSX/React.
import type {
  ProfessionContent,
  JobCategory,
  JobMatchFallback,
  SearchIntent,
} from "../../content/professions/types";
import type { Severity, ValidationCode, ValidationIssue, ValidationResult } from "./types";

const VALID_CATEGORIES: readonly JobCategory[] = ["elektro", "mechatronik", "it", "bau"];
const VALID_FALLBACKS: readonly JobMatchFallback[] = ["hint-and-joblist", "hide"];
const VALID_INTENTS: readonly SearchIntent[] = ["transactional", "commercial", "informational", "mixed"];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // klein, ohne Umlaut/Space, keine Rand-/Doppelbindestriche
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 170;

// Klar definierte, verbotene Muster (keine übertriebene Zensur).
const FORBIDDEN_PATTERNS: readonly { readonly re: RegExp; readonly label: string }[] = [
  { re: /marktführer/i, label: "Marktführer" },
  { re: /\bnummer\s*1\b/i, label: "Nummer 1" },
  { re: /\bnr\.?\s*1\b/i, label: "Nr. 1" },
  { re: /garantiert/i, label: "garantiert" },
  { re: /garantierte einstellung/i, label: "garantierte Einstellung" },
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

export function validateProfession(p: ProfessionContent): ValidationResult {
  const issues: ValidationIssue[] = [];
  const slug = p.slug;
  const add = (severity: Severity, code: ValidationCode, path: string, message: string): void => {
    issues.push({ code, message, path, severity, professionSlug: slug || undefined });
  };
  const err = (code: ValidationCode, path: string, message: string) => add("error", code, path, message);
  const warn = (code: ValidationCode, path: string, message: string) => add("warning", code, path, message);
  const contentSeverity: Severity = p.status === "published" ? "error" : "warning";

  // 1. Identität
  if (isBlank(slug)) err("PROFESSION_SLUG_EMPTY", "slug", "slug ist leer.");
  else if (!SLUG_PATTERN.test(slug)) err("PROFESSION_SLUG_INVALID", "slug", `slug "${slug}" ist ungültig (nur Kleinbuchstaben, Ziffern, einfache Bindestriche).`);
  if (isBlank(p.name)) err("PROFESSION_NAME_EMPTY", "name", "name ist leer.");
  if (isBlank(p.shortName)) err("PROFESSION_SHORTNAME_EMPTY", "shortName", "shortName ist leer.");
  if (isBlank(p.parentSlug)) err("PROFESSION_PARENT_EMPTY", "parentSlug", "parentSlug ist leer.");
  if (!p.canonicalPath.startsWith("/berufe/")) {
    err("PROFESSION_CANONICAL_INVALID", "canonicalPath", `canonicalPath "${p.canonicalPath}" beginnt nicht mit "/berufe/".`);
  } else if (slug && p.canonicalPath !== `/berufe/${slug}`) {
    err("PROFESSION_CANONICAL_MISMATCH", "canonicalPath", `canonicalPath "${p.canonicalPath}" passt nicht zum slug "${slug}" (erwartet "/berufe/${slug}").`);
  }

  // 2. Status / Veröffentlichungsflags
  const pub = p.publication;
  if (p.status === "published") {
    if (!pub.published) err("PROFESSION_PUBLISHED_FLAG_FALSE", "publication.published", "status=published, aber publication.published ist false.");
    if (!pub.indexable) err("PROFESSION_PUBLISHED_NOT_INDEXABLE", "publication.indexable", "Published-Profession muss indexable=true haben.");
    if (!pub.includeInSitemap) err("PROFESSION_PUBLISHED_NOT_IN_SITEMAP", "publication.includeInSitemap", "Published-Profession muss includeInSitemap=true haben.");
    if (!pub.showInProfessionHub) err("PROFESSION_PUBLISHED_NOT_IN_HUB", "publication.showInProfessionHub", "Published-Profession muss showInProfessionHub=true haben.");
  } else {
    if (pub.indexable) err("PROFESSION_DRAFT_INDEXABLE", "publication.indexable", "Draft-Profession darf nicht indexable sein.");
    if (pub.includeInSitemap) err("PROFESSION_DRAFT_IN_SITEMAP", "publication.includeInSitemap", "Draft-Profession darf nicht in der Sitemap stehen.");
    if (pub.showInProfessionHub) err("PROFESSION_DRAFT_IN_HUB", "publication.showInProfessionHub", "Draft-Profession darf nicht im Hub sichtbar sein.");
  }

  // 3. Metadata
  if (isBlank(p.metadataTitle)) err("PROFESSION_METADATA_TITLE_EMPTY", "metadataTitle", "metadataTitle ist leer.");
  else if (p.metadataTitle.length > TITLE_MAX) warn("PROFESSION_METADATA_TITLE_TOO_LONG", "metadataTitle", `metadataTitle ist ${p.metadataTitle.length} Zeichen (> ${TITLE_MAX}).`);
  if (isBlank(p.metadataDescription)) err("PROFESSION_METADATA_DESCRIPTION_EMPTY", "metadataDescription", "metadataDescription ist leer.");
  else if (p.metadataDescription.length > DESCRIPTION_MAX) warn("PROFESSION_METADATA_DESCRIPTION_TOO_LONG", "metadataDescription", `metadataDescription ist ${p.metadataDescription.length} Zeichen (> ${DESCRIPTION_MAX}).`);
  if (isBlank(p.primaryKeyword)) err("PROFESSION_PRIMARY_KEYWORD_EMPTY", "primaryKeyword", "primaryKeyword ist leer.");
  for (const dup of duplicatesOf(p.secondaryKeywords)) err("PROFESSION_SECONDARY_KEYWORD_DUPLICATE", "secondaryKeywords", `Doppeltes secondaryKeyword: "${dup}".`);
  if (p.secondaryKeywords.some(k => k.trim().toLowerCase() === p.primaryKeyword.trim().toLowerCase())) {
    err("PROFESSION_SECONDARY_DUPLICATES_PRIMARY", "secondaryKeywords", "secondaryKeywords dupliziert das primaryKeyword.");
  }
  if (!VALID_INTENTS.includes(p.searchIntent)) err("PROFESSION_SEARCH_INTENT_INVALID", "searchIntent", `Ungültige searchIntent "${p.searchIntent}".`);

  // 4. Hero / CTA / Links
  if (isBlank(p.hero.headline)) err("PROFESSION_HERO_HEADLINE_EMPTY", "hero.headline", "hero.headline ist leer.");
  if (isBlank(p.hero.intro)) err("PROFESSION_HERO_INTRO_EMPTY", "hero.intro", "hero.intro ist leer.");
  const checkCta = (label: string | undefined, href: string | undefined, path: string, optionalPresent = false): void => {
    if (optionalPresent && isBlank(label) && isBlank(href)) return; // gar nicht vorhanden → ok
    if (isBlank(label)) err(optionalPresent ? "PROFESSION_CTA_INCOMPLETE" : "PROFESSION_CTA_LABEL_EMPTY", `${path}.label`, `CTA-Label fehlt (${path}).`);
    if (isBlank(href)) err(optionalPresent ? "PROFESSION_CTA_INCOMPLETE" : "PROFESSION_CTA_HREF_EMPTY", `${path}.href`, `CTA-href fehlt (${path}).`);
    else if (!isValidHref(href!)) err("PROFESSION_LINK_INVALID", `${path}.href`, `CTA-href "${href}" ist ungültig (erwartet "/", "#" oder "https://").`);
  };
  checkCta(p.hero.primaryCta.label, p.hero.primaryCta.href, "hero.primaryCta");
  if (p.hero.secondaryCta) checkCta(p.hero.secondaryCta.label, p.hero.secondaryCta.href, "hero.secondaryCta", true);
  checkCta(p.applicantCta.primaryCta.label, p.applicantCta.primaryCta.href, "applicantCta.primaryCta");
  if (p.applicantCta.secondaryCta) checkCta(p.applicantCta.secondaryCta.label, p.applicantCta.secondaryCta.href, "applicantCta.secondaryCta", true);
  checkCta(p.employerCta.primaryCta.label, p.employerCta.primaryCta.href, "employerCta.primaryCta");
  if (p.employerCta.secondaryCta) checkCta(p.employerCta.secondaryCta.label, p.employerCta.secondaryCta.href, "employerCta.secondaryCta", true);

  // 5. Berufsinhalt
  if (p.overview.paragraphs.length === 0) add(contentSeverity, "PROFESSION_OVERVIEW_EMPTY", "overview.paragraphs", "Keine Overview-Absätze.");
  if (p.tasks.length === 0) add(contentSeverity, "PROFESSION_TASKS_EMPTY", "tasks", "Keine Aufgaben.");
  if (p.industries.length === 0) add(contentSeverity, "PROFESSION_INDUSTRIES_EMPTY", "industries", "Keine Einsatzbereiche.");
  if (p.requirements.length === 0) add(contentSeverity, "PROFESSION_REQUIREMENTS_EMPTY", "requirements", "Keine Anforderungen.");
  if (p.faq.length === 0) add(contentSeverity, "PROFESSION_FAQ_EMPTY", "faq", "Keine FAQ.");
  p.faq.forEach((f, i) => {
    if (isBlank(f.q)) err("PROFESSION_FAQ_QUESTION_EMPTY", `faq[${i}].q`, "FAQ-Frage ist leer.");
    if (isBlank(f.a)) err("PROFESSION_FAQ_ANSWER_EMPTY", `faq[${i}].a`, "FAQ-Antwort ist leer.");
  });
  for (const dup of duplicatesOf(p.faq.map(f => f.q))) err("PROFESSION_FAQ_DUPLICATE_QUESTION", "faq", `Doppelte FAQ-Frage: "${dup}".`);
  for (const dup of duplicatesOf(p.specializations.map(s => s.title))) err("PROFESSION_SPECIALIZATION_DUPLICATE_TITLE", "specializations", `Doppelter Spezialisierungs-Titel: "${dup}".`);
  for (const dup of duplicatesOf(p.industries.map(x => x.name))) err("PROFESSION_INDUSTRY_DUPLICATE_NAME", "industries", `Doppelter Einsatzbereich: "${dup}".`);

  // 6. Job-Matching
  const jm = p.jobMatch;
  const cats = jm.category ?? [];
  const tags = jm.tags ?? [];
  const keywords = jm.keywords ?? [];
  const excludes = jm.excludeKeywords ?? [];
  if (jm.maxJobs < 1) err("PROFESSION_JOB_MATCH_MAXJOBS_INVALID", "jobMatch.maxJobs", `maxJobs muss >= 1 sein (ist ${jm.maxJobs}).`);
  if (cats.length === 0 && tags.length === 0 && keywords.length === 0) err("PROFESSION_JOB_MATCH_EMPTY", "jobMatch", "Weder category noch tags noch keywords gesetzt.");
  for (const c of cats) if (!VALID_CATEGORIES.includes(c)) err("PROFESSION_JOB_MATCH_CATEGORY_INVALID", "jobMatch.category", `Ungültige Kategorie "${c}".`);
  if (!VALID_FALLBACKS.includes(jm.fallback)) err("PROFESSION_JOB_MATCH_FALLBACK_INVALID", "jobMatch.fallback", `Ungültiger fallback "${jm.fallback}".`);
  if (tags.some(t => isBlank(t))) err("PROFESSION_JOB_MATCH_TAG_EMPTY", "jobMatch.tags", "Leerer Tag.");
  if (keywords.some(k => isBlank(k))) err("PROFESSION_JOB_MATCH_KEYWORD_EMPTY", "jobMatch.keywords", "Leeres Keyword.");
  for (const dup of duplicatesOf(tags)) err("PROFESSION_JOB_MATCH_TAG_DUPLICATE", "jobMatch.tags", `Doppelter Tag: "${dup}".`);
  for (const dup of duplicatesOf(keywords)) err("PROFESSION_JOB_MATCH_KEYWORD_DUPLICATE", "jobMatch.keywords", `Doppeltes Keyword: "${dup}".`);
  const excludeSet = new Set(excludes.map(e => e.trim().toLowerCase()));
  for (const k of keywords) if (excludeSet.has(k.trim().toLowerCase())) err("PROFESSION_JOB_MATCH_INCLUDE_EXCLUDE_OVERLAP", "jobMatch", `Keyword und excludeKeyword identisch: "${k}".`);
  if (cats.length === 0 && tags.length === 0 && keywords.length > 0) warn("PROFESSION_JOB_MATCH_KEYWORDS_ONLY", "jobMatch", "Matching basiert nur auf Keywords (kein strukturiertes Signal).");
  if (cats.length === 0 && tags.length === 0 && keywords.length <= 1) warn("PROFESSION_JOB_MATCH_TOO_BROAD", "jobMatch", "Matching wirkt sehr breit (nur ein unspezifisches Signal).");
  if (cats.length > 1 && excludes.length === 0) warn("PROFESSION_JOB_MATCH_NO_EXCLUDE", "jobMatch", "Mehrere Kategorien, aber keine excludeKeywords.");

  // 7. Interne Links
  const il = p.internalLinks;
  const required: readonly { readonly value: string; readonly code: ValidationCode; readonly key: string }[] = [
    { value: il.parent, code: "PROFESSION_INTERNAL_PARENT_MISSING", key: "parent" },
    { value: il.jobs, code: "PROFESSION_INTERNAL_JOBS_MISSING", key: "jobs" },
    { value: il.lebenslauf, code: "PROFESSION_INTERNAL_LEBENSLAUF_MISSING", key: "lebenslauf" },
    { value: il.personalvermittlung, code: "PROFESSION_INTERNAL_PERSONALVERMITTLUNG_MISSING", key: "personalvermittlung" },
    { value: il.kontakt, code: "PROFESSION_INTERNAL_KONTAKT_MISSING", key: "kontakt" },
  ];
  for (const r of required) {
    if (isBlank(r.value)) err(r.code, `internalLinks.${r.key}`, `internalLinks.${r.key} fehlt.`);
    else if (!r.value.startsWith("/")) err("PROFESSION_INTERNAL_LINK_INVALID", `internalLinks.${r.key}`, `internalLinks.${r.key} "${r.value}" beginnt nicht mit "/".`);
  }
  if (il.relatedProfessions.includes(slug)) err("PROFESSION_RELATED_SELF_REFERENCE", "internalLinks.relatedProfessions", "relatedProfessions enthält den eigenen slug.");
  for (const dup of duplicatesOf(il.relatedProfessions)) err("PROFESSION_RELATED_DUPLICATE", "internalLinks.relatedProfessions", `Doppelter related-slug: "${dup}".`);

  // 8. Verbotene Inhalte (deterministische Muster in Textfeldern)
  for (const { text, path } of collectTextFields(p)) {
    for (const f of FORBIDDEN_PATTERNS) {
      if (f.re.test(text)) err("PROFESSION_FORBIDDEN_CLAIM", path, `Verbotenes Muster "${f.label}" gefunden.`);
    }
  }

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}

// Sammelt alle prüfbaren Textfelder mit Pfad (für die Muster-Prüfung).
function collectTextFields(p: ProfessionContent): readonly { readonly text: string; readonly path: string }[] {
  const out: { text: string; path: string }[] = [];
  const push = (text: string | undefined, path: string) => { if (text) out.push({ text, path }); };
  push(p.metadataTitle, "metadataTitle");
  push(p.metadataDescription, "metadataDescription");
  push(p.hero.eyebrow, "hero.eyebrow");
  push(p.hero.headline, "hero.headline");
  push(p.hero.intro, "hero.intro");
  push(p.overview.title, "overview.title");
  p.overview.paragraphs.forEach((t, i) => push(t, `overview.paragraphs[${i}]`));
  p.specializations.forEach((s, i) => { push(s.title, `specializations[${i}].title`); push(s.description, `specializations[${i}].description`); s.focus.forEach((x, j) => push(x, `specializations[${i}].focus[${j}]`)); });
  p.tasks.forEach((t, i) => push(t, `tasks[${i}]`));
  p.industries.forEach((x, i) => { push(x.name, `industries[${i}].name`); push(x.note, `industries[${i}].note`); });
  p.requirements.forEach((r, i) => { push(r.label, `requirements[${i}].label`); push(r.hint, `requirements[${i}].hint`); });
  push(p.applicantCta.title, "applicantCta.title");
  push(p.applicantCta.text, "applicantCta.text");
  push(p.employerCta.title, "employerCta.title");
  push(p.employerCta.text, "employerCta.text");
  p.faq.forEach((f, i) => { push(f.q, `faq[${i}].q`); push(f.a, `faq[${i}].a`); });
  return out;
}
