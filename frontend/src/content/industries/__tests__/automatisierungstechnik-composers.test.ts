import { describe, it, expect } from "vitest";
import { buildIndustryMetadata } from "../../../content-engine/metadata";
import { buildIndustrySchema } from "../../../content-engine/schema";
import { buildIndustryInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { validateInternalLink } from "../../../content-engine/internal-links";
import { automatisierungstechnik } from "../automatisierungstechnik";
import { professionBySlug } from "../../professions";
import { JOBS } from "../../../app/jobs/data";

const matches = matchJobsForConfig(JOBS, automatisierungstechnik.jobMatch, automatisierungstechnik.slug).matches;
const visibleJobs = matches.map((m) => m.job);

describe("Automatisierungstechnik – Composer-Integration", () => {
  it("1 – buildIndustryMetadata: Title/Canonical/index-follow", () => {
    const m = buildIndustryMetadata(automatisierungstechnik);
    expect(m.title).toEqual({ absolute: "Personalvermittlung Automatisierungstechnik | PHE-Perm" });
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/branchen/automatisierungstechnik");
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });

  it("2 – buildIndustrySchema: Graph mit ItemList (1 Job), kein JobPosting, eindeutige @ids", () => {
    const g = buildIndustrySchema(automatisierungstechnik, visibleJobs);
    const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
    expect(nodes.map((n) => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
    const list = nodes.find((n) => n["@type"] === "ItemList") as { numberOfItems: number };
    expect(list.numberOfItems).toBe(1);
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("3 – buildIndustrySchema ohne Jobs: keine ItemList", () => {
    const g = buildIndustrySchema(automatisierungstechnik, []);
    const types = (g["@graph"] as ReadonlyArray<Record<string, unknown>>).map((n) => n["@type"]);
    expect(types).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage"]);
  });

  it("4 – buildIndustryInternalLinks: Breadcrumb, relevante published Berufe, Job Links, keine Draft-/ungültigen Links", () => {
    const r = buildIndustryInternalLinks({ industry: automatisierungstechnik, professionRegistry: { professionBySlug }, jobMatches: matches });
    expect(r.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Branchen", "Automatisierungstechnik"]);
    expect(r.relevantProfessionLinks.map((l) => l.href)).toEqual(["/berufe/sps-automatisierung", "/berufe/elektroniker", "/berufe/mechatroniker"]);
    for (const l of r.relevantProfessionLinks) expect(professionBySlug[l.professionSlug ?? ""]?.publication.published).toBe(true);
    expect(r.jobLinks.length).toBe(1);
    for (const l of [...r.breadcrumbs, ...r.allLinks]) {
      expect(validateInternalLink(l).valid).toBe(true);
      expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
      expect(l.href.startsWith("/talente-finden")).toBe(false);
    }
    expect(r.warnings).toHaveLength(0);
  });
});
