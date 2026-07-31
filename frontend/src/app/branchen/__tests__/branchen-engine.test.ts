import { describe, it, expect } from "vitest";
import sitemap from "../../sitemap";
import { buildIndustryMetadata } from "../../../content-engine/metadata";
import { buildIndustrySchema } from "../../../content-engine/schema";
import { buildIndustryInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { automatisierungstechnik } from "../../../content/industries/automatisierungstechnik";
import { publishedIndustries, industryBySlug } from "../../../content/industries";
import { professionBySlug } from "../../../content/professions";
import { JOBS } from "../../jobs/data";

const matches = matchJobsForConfig(JOBS, automatisierungstechnik.jobMatch, automatisierungstechnik.slug).matches;
const visibleJobs = matches.map((m) => m.job);

describe("Branchen – Detailseite (Engine-Integration)", () => {
  it("1 – Metadata: Canonical + OG-URL exakt, index/follow, kein Doppel-Suffix", () => {
    const m = buildIndustryMetadata(automatisierungstechnik);
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/branchen/automatisierungstechnik");
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
  it("2 – Job-Matching: exakt Job 7 (einziger Treffer)", () => {
    expect(visibleJobs.map((j) => j.id)).toEqual(["7"]);
  });
  it("3 – Schema: Graph mit ItemList(1), kein JobPosting/Organization-Duplikat, eindeutige @ids", () => {
    const g = buildIndustrySchema(automatisierungstechnik, visibleJobs);
    const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
    expect(nodes.map((n) => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
    const list = nodes.find((n) => n["@type"] === "ItemList") as { numberOfItems: number; itemListElement: { name: string }[] };
    expect(list.numberOfItems).toBe(1);
    expect(list.itemListElement[0].name).toBe(visibleJobs[0].title);
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("4 – Breadcrumb: Startseite → Branchen → Automatisierungstechnik; Related published; keine numerischen/Draft-Links", () => {
    const r = buildIndustryInternalLinks({ industry: automatisierungstechnik, professionRegistry: { professionBySlug }, jobMatches: matches });
    expect(r.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Branchen", "Automatisierungstechnik"]);
    for (const l of r.relevantProfessionLinks) expect(professionBySlug[l.professionSlug ?? ""]?.publication.published).toBe(true);
    for (const l of r.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
    expect(r.warnings).toHaveLength(0);
  });
});

describe("Branchen – Sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => String(e.url));
  it("1 – /branchen enthalten", () => {
    expect(urls).toContain("https://www.phe-perm.de/branchen");
  });
  it("2 – /branchen/automatisierungstechnik enthalten (aus publishedIndustries)", () => {
    expect(urls).toContain("https://www.phe-perm.de/branchen/automatisierungstechnik");
    expect(publishedIndustries.length).toBe(1);
  });
  it("3 – keine Duplikate", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
  it("4 – nur published Branchen (Draft-Slug nicht in Sitemap)", () => {
    expect(urls).not.toContain("https://www.phe-perm.de/branchen/gibtsnicht");
    expect(industryBySlug["gibtsnicht"]).toBeUndefined();
  });
});
