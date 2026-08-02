// Stadt-spezifischer Internal-Link-Composer (EPIC 010A).
// Dünner Wrapper über die generischen Primitive (validateInternalLink,
// deduplicateInternalLinks, buildJobLinks, buildRelatedProfessionLinksFromSlugs).
// Branchen- und Related-City-Auflösung als city-lokale Resolver (analog zum
// generischen Related-Profession-Resolver). Keine Route/Navigation/Backlinks.
// Draft standardmäßig abgelehnt.
import type { CityContent } from "../../content/cities/types";
import type { IndustryContent } from "../../content/industries/types";
import type { JobMatchResult } from "../job-matching";
import { validateCity } from "../validation";
import type { InternalLink, CityLinkRegistries, CityInternalLinksResult, InternalLinkWarning } from "./types";
import { ContentInternalLinkError } from "./content-internal-link-error";
import { CITY_CORE_LINK_LABELS, CITY_BREADCRUMB_HUB_LABEL, BREADCRUMB_LABELS, HOME_PATH } from "./constants";
import { buildRelatedProfessionLinksFromSlugs } from "./build-related-profession-links";
import { buildJobLinks } from "./build-job-links";
import { deduplicateInternalLinks } from "./deduplicate-internal-links";
import { validateInternalLink } from "./validate-internal-link";

export type CityInternalLinksInput = {
  readonly city: CityContent;
  readonly registries: CityLinkRegistries;
  readonly jobMatches: readonly JobMatchResult[];
  readonly allowDraft?: boolean;
};

function buildBreadcrumbLinks(city: CityContent): readonly InternalLink[] {
  return [
    { label: BREADCRUMB_LABELS.home, href: HOME_PATH, type: "breadcrumb", audience: "both", priority: "contextual", source: "system" },
    { label: CITY_BREADCRUMB_HUB_LABEL, href: city.internalLinks.parent, type: "breadcrumb", audience: "both", priority: "contextual", source: "system" },
    { label: city.name, href: city.canonicalPath, type: "breadcrumb", audience: "both", priority: "contextual", source: "city-config" },
  ];
}

function buildCoreLinks(city: CityContent): readonly InternalLink[] {
  const il = city.internalLinks;
  return [
    { label: CITY_CORE_LINK_LABELS.personalvermittlung, href: il.personalvermittlung, type: "service", audience: "company", priority: "primary", source: "city-config" },
    { label: CITY_CORE_LINK_LABELS.jobs, href: il.jobs, type: "jobs", audience: "candidate", priority: "primary", source: "city-config" },
    { label: CITY_CORE_LINK_LABELS.professions, href: il.professions, type: "parent", audience: "candidate", priority: "secondary", source: "city-config" },
    { label: CITY_CORE_LINK_LABELS.industries, href: il.industries, type: "parent", audience: "both", priority: "secondary", source: "city-config" },
    { label: CITY_CORE_LINK_LABELS.contact, href: il.contact, type: "contact", audience: "both", priority: "secondary", source: "city-config" },
  ];
}

// City-lokaler Resolver für relevante Branchen: nur published + showRelatedLinks,
// Reihenfolge erhalten, Duplikate/unbekannte Slugs entfernt.
function resolveIndustryLinks(
  slugs: readonly string[],
  registry: Readonly<Record<string, IndustryContent | undefined>>,
): readonly InternalLink[] {
  const out: InternalLink[] = [];
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const target = registry[slug];
    if (!target || !target.publication.published || !target.publication.showRelatedLinks) continue;
    seen.add(slug);
    out.push({
      label: target.shortName.length > 0 ? target.shortName : target.name,
      href: target.canonicalPath,
      type: "industry",
      audience: "both",
      priority: "contextual",
      source: "industry-registry",
    });
  }
  return out;
}

// City-lokaler Resolver für Related Cities: nur published + showRelatedLinks,
// kein Self-Link, Duplikate/unbekannte Slugs entfernt.
function resolveRelatedCityLinks(
  slugs: readonly string[],
  selfSlug: string,
  registry: Readonly<Record<string, CityContent | undefined>>,
): readonly InternalLink[] {
  const out: InternalLink[] = [];
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (slug === selfSlug) continue;
    if (seen.has(slug)) continue;
    const target = registry[slug];
    if (!target || !target.publication.published || !target.publication.showRelatedLinks) continue;
    seen.add(slug);
    out.push({
      label: target.shortName.length > 0 ? target.shortName : target.name,
      href: target.canonicalPath,
      type: "city",
      audience: "both",
      priority: "contextual",
      source: "city-registry",
    });
  }
  return out;
}

export function buildCityInternalLinks(input: CityInternalLinksInput): CityInternalLinksResult {
  const { city, registries, jobMatches, allowDraft = false } = input;

  const validation = validateCity(city);
  if (!validation.valid) {
    throw new ContentInternalLinkError(
      city.slug,
      validation.errors.map((e) => e.code),
      `Interne Links für Stadt "${city.slug}" nicht erzeugbar: ${validation.errors.length} Validierungsfehler.`,
    );
  }

  if (!city.publication.published && !allowDraft) {
    throw new ContentInternalLinkError(
      city.slug,
      ["INTERNAL_LINK_DRAFT_NOT_PUBLIC"],
      `Draft-Stadt "${city.slug}" darf nicht öffentlich verlinkt werden (allowDraft erforderlich).`,
    );
  }

  const breadcrumbs = buildBreadcrumbLinks(city);
  const coreLinks = buildCoreLinks(city);
  const relevantProfessionLinks = buildRelatedProfessionLinksFromSlugs(city.relevantProfessions, city.slug, { professionBySlug: registries.professionBySlug });
  const relevantIndustryLinks = resolveIndustryLinks(city.relevantIndustries, registries.industryBySlug);
  const jobLinks = buildJobLinks(jobMatches);
  const relatedCityLinks = resolveRelatedCityLinks(city.internalLinks.relatedCities, city.slug, registries.cityBySlug);

  const { links: allLinks, warnings: dedupeWarnings } = deduplicateInternalLinks([
    ...coreLinks,
    ...relevantProfessionLinks,
    ...relevantIndustryLinks,
    ...jobLinks,
    ...relatedCityLinks,
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

  return { breadcrumbs, coreLinks, relevantProfessionLinks, relevantIndustryLinks, jobLinks, relatedCityLinks, candidateLinks, companyLinks, allLinks, warnings };
}
