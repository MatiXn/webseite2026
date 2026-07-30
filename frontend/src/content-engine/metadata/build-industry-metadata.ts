// Branchen-spezifischer Metadata Builder (EPIC 008B).
// Dünner Wrapper: validiert die Branche, baut das generische PageMetadataInput
// und delegiert an buildPageMetadata. Keine Branchen-Sonderlogik, keine Route.
import type { Metadata } from "next";
import type { IndustryContent } from "../../content/industries/types";
import { validateIndustry } from "../validation";
import { buildPageMetadata } from "./build-page-metadata";
import { ContentMetadataError } from "./content-metadata-error";
import type { PageMetadataInput } from "./types";

export function buildIndustryMetadata(industry: IndustryContent): Metadata {
  const result = validateIndustry(industry);
  if (!result.valid) {
    throw new ContentMetadataError(
      industry.slug,
      result.errors.map((e) => e.code),
      `Metadata für Branche "${industry.slug}" nicht erzeugbar: ${result.errors.length} Validierungsfehler (${result.errors.map((e) => e.code).join(", ")}).`,
    );
  }

  // index/follow ausschließlich aus dem Publication-/Indexable-Status.
  const indexable = industry.publication.published && industry.publication.indexable;

  const input: PageMetadataInput = {
    title: industry.metadataTitle,
    description: industry.metadataDescription,
    canonicalPath: industry.canonicalPath,
    type: "website",
    robots: { index: indexable, follow: indexable },
    keywords: [industry.primaryKeyword, ...industry.secondaryKeywords],
  };

  return buildPageMetadata(input);
}
