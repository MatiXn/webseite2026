// Branchen-spezifischer Schema Builder (EPIC 008B).
// Dünner Wrapper über die generischen Schema-Sub-Builder — identische Komposition
// wie buildProfessionSchema, aber aus IndustryContent. Kein JobPosting, keine
// Organization-Duplikation. Rein & deterministisch, keine Mutation.
import type { IndustryContent } from "../../content/industries/types";
import type { Job } from "../../app/jobs/data";
import type { SchemaGraph, SchemaNode } from "./types";
import { SCHEMA_CONTEXT, SCHEMA_FRAGMENTS, BREADCRUMB_HOME, INDUSTRY_HUB_NAME } from "./constants";
import { validateIndustry } from "../validation";
import { buildCanonicalUrl } from "../metadata";
import { ContentSchemaError } from "./content-schema-error";
import { buildBreadcrumbSchema } from "./build-breadcrumb-schema";
import { buildFaqSchema } from "./build-faq-schema";
import { buildItemListSchema } from "./build-item-list-schema";
import { buildCollectionPageSchema } from "./build-collection-page-schema";
import { deduplicateSchemaGraph } from "./deduplicate-schema-graph";

export function buildIndustrySchema(industry: IndustryContent, matchedJobs: readonly Job[]): SchemaGraph {
  const result = validateIndustry(industry);
  if (!result.valid) {
    throw new ContentSchemaError(
      industry.slug,
      "IndustryGraph",
      result.errors.map((e) => e.code),
      `Schema für Branche "${industry.slug}" nicht erzeugbar: ${result.errors.length} Validierungsfehler.`,
    );
  }

  const canonical = buildCanonicalUrl(industry.canonicalPath);
  const collectionId = `${canonical}${SCHEMA_FRAGMENTS.collectionPage}`;
  const breadcrumbId = `${canonical}${SCHEMA_FRAGMENTS.breadcrumb}`;
  const faqId = `${canonical}${SCHEMA_FRAGMENTS.faq}`;
  const itemListId = `${canonical}${SCHEMA_FRAGMENTS.itemList}`;

  const faq = buildFaqSchema(industry.faq, faqId);
  const itemList = buildItemListSchema(matchedJobs, itemListId); // null ohne Jobs -> keine leere ItemList

  const collectionPage = buildCollectionPageSchema({
    id: collectionId,
    canonical,
    title: industry.metadataTitle,
    description: industry.metadataDescription,
    breadcrumbId,
    itemListId: itemList ? itemListId : null,
  });

  const breadcrumb = buildBreadcrumbSchema(
    [
      BREADCRUMB_HOME,
      { name: INDUSTRY_HUB_NAME, path: industry.internalLinks.parent },
      { name: industry.name, path: industry.canonicalPath },
    ],
    breadcrumbId,
  );

  const nodes: SchemaNode[] = [collectionPage, breadcrumb];
  if (faq) nodes.push(faq);
  if (itemList) nodes.push(itemList);

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": deduplicateSchemaGraph(nodes, industry.slug),
  };
}
