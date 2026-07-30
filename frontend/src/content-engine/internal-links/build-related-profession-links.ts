// Related-Profession-Links: nur veröffentlichte, freigegebene Ziele.
// Reihenfolge aus der Config erhalten; Self-Links, Drafts, Duplikate und
// unbekannte Slugs werden entfernt (keine toten Links).
import type { ProfessionContent } from "../../content/professions/types";
import type { InternalLink, InternalLinkRegistry } from "./types";

// Generischer Kern: löst eine Liste von Profession-Slugs gegen die Registry auf.
// Nutzbar für Professionen UND Branchen (relevante Professionen). Nur veröffentlichte,
// freigegebene Ziele; Self-Link, Drafts, Duplikate und unbekannte Slugs werden entfernt.
export function buildRelatedProfessionLinksFromSlugs(
  relatedSlugs: readonly string[],
  selfSlug: string,
  registry: InternalLinkRegistry,
): readonly InternalLink[] {
  const out: InternalLink[] = [];
  const seen = new Set<string>();

  for (const slug of relatedSlugs) {
    if (slug === selfSlug) continue; // kein Self-Link
    if (seen.has(slug)) continue; // Duplikat
    const target = registry.professionBySlug[slug];
    if (!target) continue; // existiert nicht in der Registry
    if (!target.publication.published) continue; // niemals Draft-Ziele
    if (!target.publication.showRelatedLinks) continue; // Ziel erlaubt Related-Links nicht

    seen.add(slug);
    out.push({
      label: target.shortName.length > 0 ? target.shortName : target.name,
      href: target.canonicalPath,
      type: "profession",
      audience: "candidate",
      priority: "contextual",
      source: "profession-registry",
      professionSlug: target.slug,
    });
  }

  return out;
}

// Profession-Wrapper: unveränderte öffentliche API, delegiert an den generischen Kern.
export function buildRelatedProfessionLinks(
  profession: ProfessionContent,
  registry: InternalLinkRegistry,
): readonly InternalLink[] {
  return buildRelatedProfessionLinksFromSlugs(profession.internalLinks.relatedProfessions, profession.slug, registry);
}
