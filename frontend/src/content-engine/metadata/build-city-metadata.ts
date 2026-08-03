// Stadt-spezifischer Metadata Builder (EPIC 010A).
// Dünner Wrapper: validiert die Stadt, baut das generische PageMetadataInput und
// delegiert an buildPageMetadata. Keine City-Sonderlogik, keine Route.
import type { Metadata } from "next";
import type { CityContent } from "../../content/cities/types";
import { validateCity } from "../validation";
import { buildPageMetadata } from "./build-page-metadata";
import { ContentMetadataError } from "./content-metadata-error";
import type { PageMetadataInput } from "./types";

export function buildCityMetadata(city: CityContent): Metadata {
  const result = validateCity(city);
  if (!result.valid) {
    throw new ContentMetadataError(
      city.slug,
      result.errors.map((e) => e.code),
      `Metadata für Stadt "${city.slug}" nicht erzeugbar: ${result.errors.length} Validierungsfehler (${result.errors.map((e) => e.code).join(", ")}).`,
    );
  }

  // index/follow ausschließlich aus dem Publication-/Indexable-Status.
  const indexable = city.publication.published && city.publication.indexable;

  const input: PageMetadataInput = {
    title: city.metadataTitle,
    description: city.metadataDescription,
    canonicalPath: city.canonicalPath,
    type: "website",
    robots: { index: indexable, follow: indexable },
    keywords: [city.primaryKeyword, ...city.secondaryKeywords],
    ...(city.openGraphTitle ? { openGraphTitle: city.openGraphTitle } : {}),
    ...(city.openGraphDescription ? { openGraphDescription: city.openGraphDescription } : {}),
  };

  return buildPageMetadata(input);
}
