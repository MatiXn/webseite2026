// Stadt-spezifischer Schema Builder (EPIC 010A).
// Wiederverwendung der generischen Sub-Builder (CollectionPage, BreadcrumbList,
// FAQPage, ItemList) PLUS eines city-lokalen Service-Knotens mit areaServed.
//
// Bewusste Entscheidungen:
//   - KEIN LocalBusiness und KEINE zweite Organization: das Büro liegt nur in
//     Düsseldorf; für andere Städte wird keine Adresse/kein Standort-Knoten erfunden.
//   - Organization erscheint ausschließlich als @id-Referenz (provider/publisher)
//     auf die eine globale Entität aus layout.tsx.
//   - Service.areaServed kommt aus der City-Config (local.cityName).
//   - kein JobPosting, keine Reviews/AggregateRating, keine Gehalts-/Preisdaten.
//   - ItemList nur bei sichtbaren Jobs; keine leere Liste.
import type { CityContent } from "../../content/cities/types";
import type { Job } from "../../app/jobs/data";
import type { SchemaGraph, SchemaNode } from "./types";
import { SCHEMA_CONTEXT, SCHEMA_FRAGMENTS, BREADCRUMB_HOME } from "./constants";
import { validateCity } from "../validation";
import { buildCanonicalUrl } from "../metadata";
import { ContentSchemaError } from "./content-schema-error";
import { buildBreadcrumbSchema } from "./build-breadcrumb-schema";
import { buildFaqSchema } from "./build-faq-schema";
import { buildItemListSchema } from "./build-item-list-schema";
import { buildCollectionPageSchema } from "./build-collection-page-schema";
import { buildOrganizationReference } from "./build-organization-reference";
import { deduplicateSchemaGraph } from "./deduplicate-schema-graph";

// Breadcrumb-Hub-Label der City-Domäne (Startseite → Personalvermittlung → Stadt).
const CITY_BREADCRUMB_HUB_NAME = "Personalvermittlung";
const SERVICE_FRAGMENT = "#service";

export function buildCitySchema(city: CityContent, matchedJobs: readonly Job[]): SchemaGraph {
  const result = validateCity(city);
  if (!result.valid) {
    throw new ContentSchemaError(
      city.slug,
      "CityGraph",
      result.errors.map((e) => e.code),
      `Schema für Stadt "${city.slug}" nicht erzeugbar: ${result.errors.length} Validierungsfehler.`,
    );
  }

  const canonical = buildCanonicalUrl(city.canonicalPath);
  const collectionId = `${canonical}${SCHEMA_FRAGMENTS.collectionPage}`;
  const breadcrumbId = `${canonical}${SCHEMA_FRAGMENTS.breadcrumb}`;
  const faqId = `${canonical}${SCHEMA_FRAGMENTS.faq}`;
  const itemListId = `${canonical}${SCHEMA_FRAGMENTS.itemList}`;
  const serviceId = `${canonical}${SERVICE_FRAGMENT}`;

  const faq = buildFaqSchema(city.faq, faqId);
  const itemList = buildItemListSchema(matchedJobs, itemListId); // null ohne Jobs -> keine leere ItemList

  const collectionPage = buildCollectionPageSchema({
    id: collectionId,
    canonical,
    title: city.metadataTitle,
    description: city.metadataDescription,
    breadcrumbId,
    itemListId: itemList ? itemListId : null,
  });

  const breadcrumb = buildBreadcrumbSchema(
    [
      BREADCRUMB_HOME,
      { name: CITY_BREADCRUMB_HUB_NAME, path: city.internalLinks.parent },
      { name: city.name, path: city.canonicalPath },
    ],
    breadcrumbId,
  );

  // City-lokaler Service-Knoten: referenziert die globale Organization nur per @id,
  // areaServed aus der Config. Kein LocalBusiness, keine erfundene Adresse.
  const service: SchemaNode = {
    "@type": "Service",
    "@id": serviceId,
    name: `Personalvermittlung ${city.local.cityName} – technische Fachkräfte`,
    serviceType: "Technische Personalvermittlung",
    areaServed: { "@type": "City", name: city.local.cityName },
    provider: buildOrganizationReference(),
    description: city.metadataDescription,
  };

  const nodes: SchemaNode[] = [collectionPage, breadcrumb, service];
  if (faq) nodes.push(faq);
  if (itemList) nodes.push(itemList);

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": deduplicateSchemaGraph(nodes, city.slug),
  };
}
