// Baut ein BreadcrumbList-Schema aus denselben Crumb-Daten, die die UI rendert.
// Absolute URLs über den zentralen Canonical-Builder (DRY). Rein & deterministisch.
import type { BreadcrumbInputItem, SchemaNode } from "./types";
import { buildCanonicalUrl } from "../metadata";

export function buildBreadcrumbSchema(items: readonly BreadcrumbInputItem[], id: string): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}
