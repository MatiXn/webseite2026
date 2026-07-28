// Dedupliziert Links nach normalisiertem href. Erster Eintrag gewinnt.
// Gleicher href + abweichendes Label -> Warning (kein automatisches Verschmelzen).
// Keine Mutation, stabile Reihenfolge.
import type { DeduplicationResult, InternalLink, InternalLinkWarning } from "./types";

function normalizeHref(href: string): string {
  const trimmed = href.trim();
  return trimmed.length > 1 ? trimmed.replace(/\/+$/, "") : trimmed;
}

export function deduplicateInternalLinks(links: readonly InternalLink[]): DeduplicationResult {
  const result: InternalLink[] = [];
  const warnings: InternalLinkWarning[] = [];
  const seenLabel = new Map<string, string>(); // normalisierter href -> gehaltenes Label

  for (const link of links) {
    const key = normalizeHref(link.href);
    const existingLabel = seenLabel.get(key);
    if (existingLabel === undefined) {
      seenLabel.set(key, link.label);
      result.push(link);
    } else if (existingLabel !== link.label) {
      warnings.push({
        code: "INTERNAL_LINK_LABEL_CONFLICT",
        href: link.href,
        message: `Gleicher href "${link.href}" mit abweichendem Label — "${existingLabel}" behalten, "${link.label}" verworfen.`,
      });
    }
    // gleicher href + gleiches Label: stilles Duplikat, verwerfen.
  }

  return { links: result, warnings };
}
