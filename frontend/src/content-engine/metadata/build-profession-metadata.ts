// Profession-spezifischer Metadata Builder.
// Validiert die einzelne Profession (nicht die ganze Registry), baut ein generisches
// Input-Modell und delegiert an buildPageMetadata. Rein & deterministisch, keine Mutation.
import type { Metadata } from "next";
import type { ProfessionContent } from "../../content/professions/types";
import { validateProfession } from "../validation";
import { buildPageMetadata } from "./build-page-metadata";
import { ContentMetadataError } from "./content-metadata-error";
import type { PageMetadataInput } from "./types";

export function buildProfessionMetadata(profession: ProfessionContent): Metadata {
  // Nur Einzelvalidierung. Fehler = harter Abbruch (ungültige Config darf nie
  // Metadata erzeugen). Warnungen blockieren die Erzeugung nicht.
  const result = validateProfession(profession);
  if (!result.valid) {
    throw new ContentMetadataError(
      profession.slug,
      result.errors.map((e) => e.code),
      `Metadata für Profession "${profession.slug}" nicht erzeugbar: ${result.errors.length} Validierungsfehler (${result.errors
        .map((e) => e.code)
        .join(", ")}).`,
    );
  }

  // Nur veröffentlichte UND indexierbare Professionen sind index/follow.
  // Drafts liefern sichere noindex-Metadata (werden durch dieses EPIC nicht geroutet).
  const indexable = profession.publication.published && profession.publication.indexable;

  const input: PageMetadataInput = {
    title: profession.metadataTitle,
    description: profession.metadataDescription,
    canonicalPath: profession.canonicalPath,
    type: "website",
    robots: { index: indexable, follow: indexable },
    // Projekt nutzt das keywords-Feld (siehe layout.tsx) — Primary + Secondary,
    // dedupliziert durch buildPageMetadata. Keine Keyword-Erweiterung.
    keywords: [profession.primaryKeyword, ...profession.secondaryKeywords],
  };

  return buildPageMetadata(input);
}
