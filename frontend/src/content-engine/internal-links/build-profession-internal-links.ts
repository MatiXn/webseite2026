// Gesamt-Builder: erzeugt aus Registry-Daten + Matcher-Ergebnissen die vollständige,
// deduplizierte, zielgruppengruppierte Link-Struktur einer Profession.
// Rein & deterministisch, keine Mutation. Draft standardmäßig abgelehnt.
import type { ProfessionContent } from "../../content/professions/types";
import type { JobMatchResult } from "../job-matching";
import { validateProfession } from "../validation";
import type { InternalLink, InternalLinkRegistry, InternalLinkWarning, ProfessionInternalLinksResult } from "./types";
import { ContentInternalLinkError } from "./content-internal-link-error";
import { buildProfessionBreadcrumbLinks } from "./build-profession-breadcrumb-links";
import { buildProfessionCoreLinks } from "./build-profession-core-links";
import { buildRelatedProfessionLinks } from "./build-related-profession-links";
import { buildJobLinks } from "./build-job-links";
import { deduplicateInternalLinks } from "./deduplicate-internal-links";
import { validateInternalLink } from "./validate-internal-link";

export type ProfessionInternalLinksInput = {
  readonly profession: ProfessionContent;
  readonly professionRegistry: InternalLinkRegistry;
  readonly jobMatches: readonly JobMatchResult[];
  readonly allowDraft?: boolean;
};

export function buildProfessionInternalLinks(input: ProfessionInternalLinksInput): ProfessionInternalLinksResult {
  const { profession, professionRegistry, jobMatches, allowDraft = false } = input;

  // 1. Profession strukturell validieren.
  const validation = validateProfession(profession);
  if (!validation.valid) {
    throw new ContentInternalLinkError(
      profession.slug,
      validation.errors.map((e) => e.code),
      `Interne Links für "${profession.slug}" nicht erzeugbar: ${validation.errors.length} Validierungsfehler.`,
    );
  }

  // Draft nur mit allowDraft (keine Draft-Links in öffentlicher Navigation).
  if (!profession.publication.published && !allowDraft) {
    throw new ContentInternalLinkError(
      profession.slug,
      ["INTERNAL_LINK_DRAFT_NOT_PUBLIC"],
      `Draft-Profession "${profession.slug}" darf nicht öffentlich verlinkt werden (allowDraft erforderlich).`,
    );
  }

  // 2.–5. Teil-Builder.
  const breadcrumbs = buildProfessionBreadcrumbLinks(profession, { allowDraft });
  const coreLinks = buildProfessionCoreLinks(profession);
  const relatedProfessionLinks = buildRelatedProfessionLinks(profession, professionRegistry);
  const jobLinks = buildJobLinks(jobMatches);

  // 6.–7. Navigationslinks zusammenführen + deduplizieren (Breadcrumbs bleiben separat).
  const { links: allLinks, warnings: dedupeWarnings } = deduplicateInternalLinks([
    ...coreLinks,
    ...relatedProfessionLinks,
    ...jobLinks,
  ]);

  // 6. Nach Zielgruppen gruppieren ("both" zählt zu beiden).
  const candidateLinks = allLinks.filter((l) => l.audience === "candidate" || l.audience === "both");
  const companyLinks = allLinks.filter((l) => l.audience === "company" || l.audience === "both");

  // 8. Alle Links (inkl. Breadcrumbs) strukturell validieren; Verstöße als Warning.
  const warnings: InternalLinkWarning[] = [...dedupeWarnings];
  const validate = (link: InternalLink): void => {
    const v = validateInternalLink(link);
    if (!v.valid) {
      warnings.push({ code: "INTERNAL_LINK_INVALID", href: link.href, message: `Ungültiger Link (${v.codes.join(", ")}).` });
    }
  };
  for (const link of breadcrumbs) validate(link);
  for (const link of allLinks) validate(link);

  return { breadcrumbs, coreLinks, relatedProfessionLinks, jobLinks, candidateLinks, companyLinks, allLinks, warnings };
}
