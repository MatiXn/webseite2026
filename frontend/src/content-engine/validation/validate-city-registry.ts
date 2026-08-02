// Reiner, deterministischer Validator für die gesamte City-Registry (EPIC 010A).
// Aggregiert die Einzelvalidierung + registryweite Konsistenzprüfungen.
// Cross-Registry-Check nur innerhalb der City-Domäne (relatedCities → published).
import type { CityRegistryInput } from "../../content/cities/types";
import type { Severity } from "./types";
import {
  validateCity,
  type CityValidationCode,
  type CityValidationIssue,
  type CityValidationResult,
} from "./validate-city";

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

export function validateCityRegistry(registry: CityRegistryInput): CityValidationResult {
  const issues: CityValidationIssue[] = [];
  const add = (severity: Severity, code: CityValidationCode, path: string, message: string, citySlug?: string): void => {
    issues.push({ code, message, path, severity, citySlug });
  };
  const err = (code: CityValidationCode, path: string, message: string, slug?: string) => add("error", code, path, message, slug);

  const all = registry.cities;
  const bySlug = registry.cityBySlug;

  // Einzelvalidierung aggregieren
  for (const c of all) {
    const r = validateCity(c);
    for (const i of r.errors) issues.push(i);
    for (const i of r.warnings) issues.push(i);
    if (c.status === "published" && r.errors.length > 0) {
      err("REGISTRY_CITY_PUBLISHED_HAS_ERRORS", `cities.${c.slug}`, `Published-Stadt "${c.slug}" hat ${r.errors.length} Validierungsfehler.`, c.slug);
    }
  }

  // 1. Eindeutigkeit
  for (const dup of duplicatesOf(all.map((c) => c.slug))) err("REGISTRY_CITY_DUPLICATE_SLUG", "cities", `Doppelter slug: "${dup}".`);
  for (const dup of duplicatesOf(all.map((c) => c.canonicalPath))) err("REGISTRY_CITY_DUPLICATE_CANONICAL", "cities", `Doppelter canonicalPath: "${dup}".`);

  // 2. Published/Draft-Arrays
  for (const c of registry.publishedCities) {
    if (c.status !== "published") err("REGISTRY_CITY_PUBLISHED_ARRAY_MISMATCH", "publishedCities", `"${c.slug}" steht in publishedCities, ist aber status="${c.status}".`, c.slug);
  }
  for (const c of registry.draftCities) {
    if (c.status !== "draft") err("REGISTRY_CITY_DRAFT_ARRAY_MISMATCH", "draftCities", `"${c.slug}" steht in draftCities, ist aber status="${c.status}".`, c.slug);
  }
  const inPublished = new Set(registry.publishedCities.map((c) => c.slug));
  const inDraft = new Set(registry.draftCities.map((c) => c.slug));
  for (const c of all) {
    const isPub = inPublished.has(c.slug);
    const isDraft = inDraft.has(c.slug);
    if (!isPub && !isDraft) err("REGISTRY_CITY_MISSING_IN_SUBARRAYS", "publishedCities/draftCities", `"${c.slug}" fehlt in beiden Teilarrays.`, c.slug);
    if (isPub && isDraft) err("REGISTRY_CITY_IN_BOTH_SUBARRAYS", "publishedCities/draftCities", `"${c.slug}" steht in beiden Teilarrays.`, c.slug);
  }

  // 3. cityBySlug
  for (const c of all) {
    const entry = bySlug[c.slug];
    if (entry === undefined) err("REGISTRY_CITY_BYSLUG_MISSING", "cityBySlug", `cityBySlug enthält keinen Eintrag für "${c.slug}".`, c.slug);
    else if (entry !== c) err("REGISTRY_CITY_BYSLUG_MISMATCH", "cityBySlug", `cityBySlug["${c.slug}"] verweist nicht auf dasselbe Objekt.`, c.slug);
  }
  for (const key of Object.keys(bySlug)) {
    const entry = bySlug[key];
    if (entry.slug !== key) err("REGISTRY_CITY_BYSLUG_MISMATCH", "cityBySlug", `cityBySlug-Key "${key}" passt nicht zum slug "${entry.slug}".`, key);
  }

  // 4. relatedCities einer published Stadt dürfen nur auf published Städte zeigen.
  for (const c of registry.publishedCities) {
    for (const relSlug of c.internalLinks.relatedCities) {
      const target = bySlug[relSlug];
      if (!target || !target.publication.published) {
        err("REGISTRY_CITY_RELATED_NOT_PUBLISHED", `cities.${c.slug}.relatedCities`, `Published-Stadt "${c.slug}" verweist auf nicht-published/unbekannte Stadt "${relSlug}".`, c.slug);
      }
    }
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  return { valid: errors.length === 0, errors, warnings };
}
