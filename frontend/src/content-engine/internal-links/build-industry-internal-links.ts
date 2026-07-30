// Branchen-spezifischer Internal-Link-Composer (EPIC 008B).
// Dünner Wrapper über die generischen Primitive (validateInternalLink,
// deduplicateInternalLinks, buildJobLinks, slug-basierter Related-Resolver).
// Keine Route/Navigation/Backlinks. Draft standardmäßig abgelehnt.
import type { IndustryContent } from "../../content/industries/types";
import type { JobMatchResult } from "../job-matching";
import { validateIndustry } from "../validation";
import type { InternalLink, InternalLinkRegistry, InternalLinkWarning, IndustryInternalLinksResult } from "./types";
import { ContentInternalLinkError } from "./content-internal-link-error";
import { INDUSTRY_CORE_LINK_LABELS, INDUSTRY_HUB_LABEL, BREADCRUMB_LABELS, HOME_PATH } from "./constants";
import { buildRelatedProfessionLinksFromSlugs } from "./build-related-profession-links";
import { buildJobLinks } from "./build-job-links";
import { deduplicateInternalLinks } from "./deduplicate-internal-links";
import { validateInternalLink } from "./validate-internal-link";

export type IndustryInternalLinksInput = {
  readonly industry: IndustryContent;
  readonly professionRegistry: InternalLinkRegistry;
  readonly jobMatches: readonly JobMatchResult[];
  readonly allowDraft?: boolean;
};

function buildBreadcrumbLinks(industry: IndustryContent): readonly InternalLink[] {
  return [
    { label: BREADCRUMB_LABELS.home, href: HOME_PATH, type: "breadcrumb", audience: "both", priority: "contextual", source: "system" },
    { label: INDUSTRY_HUB_LABEL, href: industry.internalLinks.parent, type: "breadcrumb", audience: "both", priority: "contextual", source: "system" },
    { label: industry.name, href: industry.canonicalPath, type: "breadcrumb", audience: "both", priority: "contextual", source: "industry-config" },
  ];
}

function buildCoreLinks(industry: IndustryContent): readonly InternalLink[] {
  const il = industry.internalLinks;
  return [
    { label: INDUSTRY_CORE_LINK_LABELS.parent, href: il.parent, type: "parent", audience: "both", priority: "secondary", source: "industry-config" },
    { label: INDUSTRY_CORE_LINK_LABELS.jobs, href: il.jobs, type: "jobs", audience: "candidate", priority: "primary", source: "industry-config" },
    { label: INDUSTRY_CORE_LINK_LABELS.personalvermittlung, href: il.personalvermittlung, type: "service", audience: "company", priority: "primary", source: "industry-config" },
    { label: INDUSTRY_CORE_LINK_LABELS.kontakt, href: il.kontakt, type: "contact", audience: "both", priority: "secondary", source: "industry-config" },
  ];
}

export function buildIndustryInternalLinks(input: IndustryInternalLinksInput): IndustryInternalLinksResult {
  const { industry, professionRegistry, jobMatches, allowDraft = false } = input;

  const validation = validateIndustry(industry);
  if (!validation.valid) {
    throw new ContentInternalLinkError(
      industry.slug,
      validation.errors.map((e) => e.code),
      `Interne Links für Branche "${industry.slug}" nicht erzeugbar: ${validation.errors.length} Validierungsfehler.`,
    );
  }

  if (!industry.publication.published && !allowDraft) {
    throw new ContentInternalLinkError(
      industry.slug,
      ["INTERNAL_LINK_DRAFT_NOT_PUBLIC"],
      `Draft-Branche "${industry.slug}" darf nicht öffentlich verlinkt werden (allowDraft erforderlich).`,
    );
  }

  const breadcrumbs = buildBreadcrumbLinks(industry);
  const coreLinks = buildCoreLinks(industry);
  const relevantProfessionLinks = buildRelatedProfessionLinksFromSlugs(industry.internalLinks.relatedProfessions, industry.slug, professionRegistry);
  const jobLinks = buildJobLinks(jobMatches);

  const { links: allLinks, warnings: dedupeWarnings } = deduplicateInternalLinks([
    ...coreLinks,
    ...relevantProfessionLinks,
    ...jobLinks,
  ]);

  const candidateLinks = allLinks.filter((l) => l.audience === "candidate" || l.audience === "both");
  const companyLinks = allLinks.filter((l) => l.audience === "company" || l.audience === "both");

  const warnings: InternalLinkWarning[] = [...dedupeWarnings];
  const validate = (link: InternalLink): void => {
    const v = validateInternalLink(link);
    if (!v.valid) warnings.push({ code: "INTERNAL_LINK_INVALID", href: link.href, message: `Ungültiger Link (${v.codes.join(", ")}).` });
  };
  for (const link of breadcrumbs) validate(link);
  for (const link of allLinks) validate(link);

  return { breadcrumbs, coreLinks, relevantProfessionLinks, jobLinks, candidateLinks, companyLinks, allLinks, warnings };
}
