// Breadcrumb-Links: Startseite -> Berufe -> aktuelle Profession.
// Dieselbe Datenquelle, die später für sichtbare Breadcrumbs UND Schema dient.
// Draft standardmäßig abgelehnt (nur mit allowDraft für Tests/Analyse).
import type { ProfessionContent } from "../../content/professions/types";
import type { InternalLink } from "./types";
import { BREADCRUMB_LABELS, HOME_PATH } from "./constants";
import { ContentInternalLinkError } from "./content-internal-link-error";

export function buildProfessionBreadcrumbLinks(
  profession: ProfessionContent,
  options?: { readonly allowDraft?: boolean },
): readonly InternalLink[] {
  if (!profession.publication.published && options?.allowDraft !== true) {
    throw new ContentInternalLinkError(
      profession.slug,
      ["INTERNAL_LINK_DRAFT_NOT_PUBLIC"],
      `Breadcrumbs für Draft-Profession "${profession.slug}" nur mit allowDraft erzeugbar.`,
    );
  }

  return [
    { label: BREADCRUMB_LABELS.home, href: HOME_PATH, type: "breadcrumb", audience: "both", priority: "contextual", source: "system" },
    { label: BREADCRUMB_LABELS.hub, href: profession.internalLinks.parent, type: "breadcrumb", audience: "both", priority: "contextual", source: "system" },
    { label: profession.name, href: profession.canonicalPath, type: "breadcrumb", audience: "both", priority: "contextual", source: "profession-config", professionSlug: profession.slug },
  ];
}
