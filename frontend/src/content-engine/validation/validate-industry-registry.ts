// Reiner, deterministischer Validator für die gesamte Branchen-Registry (EPIC 008A).
// Aggregiert die Einzelvalidierung + registryweite Konsistenzprüfungen.
// Kein Cross-Registry-Check zu Professionen (separate Domäne).
import type { IndustryRegistryInput } from "../../content/industries/types";
import type { Severity } from "./types";
import {
  validateIndustry,
  type IndustryValidationCode,
  type IndustryValidationIssue,
  type IndustryValidationResult,
} from "./validate-industry";

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

export function validateIndustryRegistry(registry: IndustryRegistryInput): IndustryValidationResult {
  const issues: IndustryValidationIssue[] = [];
  const add = (severity: Severity, code: IndustryValidationCode, path: string, message: string, industrySlug?: string): void => {
    issues.push({ code, message, path, severity, industrySlug });
  };
  const err = (code: IndustryValidationCode, path: string, message: string, slug?: string) => add("error", code, path, message, slug);

  const all = registry.industries;
  const bySlug = registry.industryBySlug;

  // Einzelvalidierung aggregieren
  for (const ind of all) {
    const r = validateIndustry(ind);
    for (const i of r.errors) issues.push(i);
    for (const i of r.warnings) issues.push(i);
    if (ind.status === "published" && r.errors.length > 0) {
      err("REGISTRY_INDUSTRY_PUBLISHED_HAS_ERRORS", `industries.${ind.slug}`, `Published-Branche "${ind.slug}" hat ${r.errors.length} Validierungsfehler.`, ind.slug);
    }
  }

  // 1. Eindeutigkeit
  for (const dup of duplicatesOf(all.map((p) => p.slug))) err("REGISTRY_INDUSTRY_DUPLICATE_SLUG", "industries", `Doppelter slug: "${dup}".`);
  for (const dup of duplicatesOf(all.map((p) => p.canonicalPath))) err("REGISTRY_INDUSTRY_DUPLICATE_CANONICAL", "industries", `Doppelter canonicalPath: "${dup}".`);

  // 2. Published/Draft-Arrays
  for (const p of registry.publishedIndustries) {
    if (p.status !== "published") err("REGISTRY_INDUSTRY_PUBLISHED_ARRAY_MISMATCH", "publishedIndustries", `"${p.slug}" steht in publishedIndustries, ist aber status="${p.status}".`, p.slug);
  }
  for (const p of registry.draftIndustries) {
    if (p.status !== "draft") err("REGISTRY_INDUSTRY_DRAFT_ARRAY_MISMATCH", "draftIndustries", `"${p.slug}" steht in draftIndustries, ist aber status="${p.status}".`, p.slug);
  }
  const inPublished = new Set(registry.publishedIndustries.map((p) => p.slug));
  const inDraft = new Set(registry.draftIndustries.map((p) => p.slug));
  for (const p of all) {
    const isPub = inPublished.has(p.slug);
    const isDraft = inDraft.has(p.slug);
    if (!isPub && !isDraft) err("REGISTRY_INDUSTRY_MISSING_IN_SUBARRAYS", "publishedIndustries/draftIndustries", `"${p.slug}" fehlt in beiden Teilarrays.`, p.slug);
    if (isPub && isDraft) err("REGISTRY_INDUSTRY_IN_BOTH_SUBARRAYS", "publishedIndustries/draftIndustries", `"${p.slug}" steht in beiden Teilarrays.`, p.slug);
  }

  // 3. industryBySlug
  for (const p of all) {
    const entry = bySlug[p.slug];
    if (entry === undefined) err("REGISTRY_INDUSTRY_BYSLUG_MISSING", "industryBySlug", `industryBySlug enthält keinen Eintrag für "${p.slug}".`, p.slug);
    else if (entry !== p) err("REGISTRY_INDUSTRY_BYSLUG_MISMATCH", "industryBySlug", `industryBySlug["${p.slug}"] verweist nicht auf dasselbe Objekt.`, p.slug);
  }
  for (const key of Object.keys(bySlug)) {
    const entry = bySlug[key];
    if (entry.slug !== key) err("REGISTRY_INDUSTRY_BYSLUG_MISMATCH", "industryBySlug", `industryBySlug-Key "${key}" passt nicht zum slug "${entry.slug}".`, key);
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}
