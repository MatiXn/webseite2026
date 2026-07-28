// Related-Profession-Links: nur veröffentlichte, freigegebene Ziele.
// Reihenfolge aus der Config erhalten; Self-Links, Drafts, Duplikate und
// unbekannte Slugs werden entfernt (keine toten Links).
import type { ProfessionContent } from "../../content/professions/types";
import type { InternalLink, InternalLinkRegistry } from "./types";

export function buildRelatedProfessionLinks(
  profession: ProfessionContent,
  registry: InternalLinkRegistry,
): readonly InternalLink[] {
  const out: InternalLink[] = [];
  const seen = new Set<string>();

  for (const slug of profession.internalLinks.relatedProfessions) {
    if (slug === profession.slug) continue; // kein Self-Link
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
