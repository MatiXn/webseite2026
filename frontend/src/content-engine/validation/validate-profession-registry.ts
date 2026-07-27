// Reiner, deterministischer Validator für die gesamte Profession Registry.
// Aggregiert die Einzelvalidierung + registryweite Konsistenzprüfungen.
import type { Severity, ValidationCode, ValidationIssue, ValidationResult, ProfessionRegistryInput } from "./types";
import { validateProfession } from "./validate-profession";

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

export function validateProfessionRegistry(registry: ProfessionRegistryInput): ValidationResult {
  const issues: ValidationIssue[] = [];
  const add = (severity: Severity, code: ValidationCode, path: string, message: string, professionSlug?: string): void => {
    issues.push({ code, message, path, severity, professionSlug });
  };
  const err = (code: ValidationCode, path: string, message: string, slug?: string) => add("error", code, path, message, slug);
  const warn = (code: ValidationCode, path: string, message: string, slug?: string) => add("warning", code, path, message, slug);

  const all = registry.professions;
  const bySlug = registry.professionBySlug;
  const existingSlugs = new Set(all.map(p => p.slug));
  const publishedSlugs = new Set(all.filter(p => p.status === "published").map(p => p.slug));

  // Einzelvalidierung aggregieren
  for (const p of all) {
    const r = validateProfession(p);
    for (const i of r.errors) issues.push(i);
    for (const i of r.warnings) issues.push(i);
    if (p.status === "published" && r.errors.length > 0) {
      err("REGISTRY_PUBLISHED_HAS_ERRORS", `professions.${p.slug}`, `Published-Profession "${p.slug}" hat ${r.errors.length} Validierungsfehler.`, p.slug);
    }
  }

  // 1. Eindeutigkeit
  for (const dup of duplicatesOf(all.map(p => p.slug))) err("REGISTRY_DUPLICATE_SLUG", "professions", `Doppelter slug: "${dup}".`);
  for (const dup of duplicatesOf(all.map(p => p.canonicalPath))) err("REGISTRY_DUPLICATE_CANONICAL", "professions", `Doppelter canonicalPath: "${dup}".`);
  for (const dup of duplicatesOf(all.map(p => p.metadataTitle))) err("REGISTRY_DUPLICATE_TITLE", "professions", `Doppelter metadataTitle: "${dup}".`);
  for (const dup of duplicatesOf(all.map(p => p.primaryKeyword))) warn("REGISTRY_DUPLICATE_PRIMARY_KEYWORD", "professions", `Identisches primaryKeyword bei mehreren Professionen: "${dup}".`);

  // 2. Published/Draft-Arrays
  for (const p of registry.publishedProfessions) {
    if (p.status !== "published") err("REGISTRY_PUBLISHED_ARRAY_MISMATCH", "publishedProfessions", `"${p.slug}" steht in publishedProfessions, ist aber status="${p.status}".`, p.slug);
  }
  for (const p of registry.draftProfessions) {
    if (p.status !== "draft") err("REGISTRY_DRAFT_ARRAY_MISMATCH", "draftProfessions", `"${p.slug}" steht in draftProfessions, ist aber status="${p.status}".`, p.slug);
  }
  const inPublished = new Set(registry.publishedProfessions.map(p => p.slug));
  const inDraft = new Set(registry.draftProfessions.map(p => p.slug));
  for (const p of all) {
    const isPub = inPublished.has(p.slug);
    const isDraft = inDraft.has(p.slug);
    if (!isPub && !isDraft) err("REGISTRY_PROFESSION_MISSING_IN_SUBARRAYS", "publishedProfessions/draftProfessions", `"${p.slug}" fehlt in beiden Teilarrays.`, p.slug);
    if (isPub && isDraft) err("REGISTRY_PROFESSION_IN_BOTH_SUBARRAYS", "publishedProfessions/draftProfessions", `"${p.slug}" steht in beiden Teilarrays.`, p.slug);
  }

  // 3. professionBySlug
  for (const p of all) {
    const entry = bySlug[p.slug];
    if (entry === undefined) err("REGISTRY_BYSLUG_MISSING", "professionBySlug", `professionBySlug enthält keinen Eintrag für "${p.slug}".`, p.slug);
    else if (entry !== p) err("REGISTRY_BYSLUG_MISMATCH", "professionBySlug", `professionBySlug["${p.slug}"] verweist nicht auf dasselbe Objekt wie im Gesamtarray.`, p.slug);
  }
  for (const key of Object.keys(bySlug)) {
    const entry = bySlug[key];
    if (entry.slug !== key) err("REGISTRY_BYSLUG_MISMATCH", "professionBySlug", `professionBySlug-Key "${key}" passt nicht zum slug "${entry.slug}".`, key);
  }

  // 4. Related Professions
  for (const p of all) {
    for (const rel of p.internalLinks.relatedProfessions) {
      if (!existingSlugs.has(rel)) {
        err("REGISTRY_RELATED_NOT_FOUND", "internalLinks.relatedProfessions", `related "${rel}" existiert nicht in der Registry.`, p.slug);
        continue;
      }
      const relPublished = publishedSlugs.has(rel);
      if (p.status === "published" && !relPublished) {
        err("REGISTRY_RELATED_NOT_PUBLISHED", "internalLinks.relatedProfessions", `Published "${p.slug}" verweist auf nicht-veröffentlichtes "${rel}".`, p.slug);
      } else if (p.status === "draft" && !relPublished) {
        warn("REGISTRY_DRAFT_RELATED_DRAFT", "internalLinks.relatedProfessions", `Draft "${p.slug}" verweist auf Draft "${rel}" (später potenziell toter Link).`, p.slug);
      }
    }
  }

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}
