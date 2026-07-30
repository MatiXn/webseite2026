// Baut den vollständigen, deduplizierten Schema-Graph einer Profession.
// Reihenfolge: CollectionPage, BreadcrumbList, FAQPage (optional), ItemList (optional).
// Nimmt bereits gematchte Jobs entgegen (Matching passiert hier NICHT).
// Rein & deterministisch, keine Mutation.
import type { ProfessionContent } from "../../content/professions/types";
import type { Job } from "../../app/jobs/data";
import type { SchemaGraph, SchemaNode } from "./types";
import { SCHEMA_CONTEXT, SCHEMA_FRAGMENTS, BREADCRUMB_HOME, PROFESSION_HUB_NAME } from "./constants";
import { validateProfession } from "../validation";
import { buildCanonicalUrl } from "../metadata";
import { ContentSchemaError } from "./content-schema-error";
import { buildBreadcrumbSchema } from "./build-breadcrumb-schema";
import { buildFaqSchema } from "./build-faq-schema";
import { buildItemListSchema } from "./build-item-list-schema";
import { buildCollectionPageSchema } from "./build-collection-page-schema";
import { deduplicateSchemaGraph } from "./deduplicate-schema-graph";

export function buildProfessionSchema(
  profession: ProfessionContent,
  matchedJobs: readonly Job[],
): SchemaGraph {
  // Einzelvalidierung: ungültige Config darf niemals Schema erzeugen.
  const result = validateProfession(profession);
  if (!result.valid) {
    throw new ContentSchemaError(
      profession.slug,
      "ProfessionGraph",
      result.errors.map((e) => e.code),
      `Schema für Profession "${profession.slug}" nicht erzeugbar: ${result.errors.length} Validierungsfehler.`,
    );
  }

  const canonical = buildCanonicalUrl(profession.canonicalPath);
  const collectionId = `${canonical}${SCHEMA_FRAGMENTS.collectionPage}`;
  const breadcrumbId = `${canonical}${SCHEMA_FRAGMENTS.breadcrumb}`;
  const faqId = `${canonical}${SCHEMA_FRAGMENTS.faq}`;
  const itemListId = `${canonical}${SCHEMA_FRAGMENTS.itemList}`;

  const faq = buildFaqSchema(profession.faq, faqId);
  const itemList = buildItemListSchema(matchedJobs, itemListId);

  const collectionPage = buildCollectionPageSchema({
    id: collectionId,
    canonical,
    title: profession.metadataTitle,
    description: profession.metadataDescription,
    breadcrumbId,
    itemListId: itemList ? itemListId : null,
  });

  const breadcrumb = buildBreadcrumbSchema(
    [
      BREADCRUMB_HOME,
      { name: PROFESSION_HUB_NAME, path: profession.internalLinks.parent },
      { name: profession.name, path: profession.canonicalPath },
    ],
    breadcrumbId,
  );

  const nodes: SchemaNode[] = [collectionPage, breadcrumb];
  if (faq) nodes.push(faq);
  if (itemList) nodes.push(itemList);

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": deduplicateSchemaGraph(nodes, profession.slug),
  };
}
