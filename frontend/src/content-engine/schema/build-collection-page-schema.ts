// Baut das CollectionPage-Schema. Verknüpft nur per @id-Referenzen:
// publisher -> Organization-Referenz, breadcrumb -> BreadcrumbList, mainEntity -> ItemList.
// Keine vollständige Organization, keine Reviews, keine AggregateRating.
import type { SchemaNode } from "./types";
import { buildOrganizationReference } from "./build-organization-reference";

export type CollectionPageInput = {
  readonly id: string;
  readonly canonical: string;
  readonly title: string; // Metadata Title
  readonly description: string; // Metadata Description
  readonly breadcrumbId: string;
  readonly itemListId: string | null; // nur referenziert, wenn ItemList existiert
};

export function buildCollectionPageSchema(input: CollectionPageInput): SchemaNode {
  return {
    "@type": "CollectionPage",
    "@id": input.id,
    url: input.canonical,
    name: input.title,
    description: input.description,
    inLanguage: "de-DE",
    publisher: buildOrganizationReference(),
    breadcrumb: { "@id": input.breadcrumbId },
    ...(input.itemListId ? { mainEntity: { "@id": input.itemListId } } : {}),
  };
}
