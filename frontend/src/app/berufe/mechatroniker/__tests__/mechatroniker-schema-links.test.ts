import { describe, it, expect } from "vitest";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { buildProfessionSchema } from "../../../../content-engine/schema";
import { buildProfessionInternalLinks } from "../../../../content-engine/internal-links";
import { mechatroniker } from "../../../../content/professions/mechatroniker";
import { professionBySlug } from "../../../../content/professions";
import { JOBS } from "../../../jobs/data";
import { jobPath } from "../../../../lib/slug";

const matches = matchJobsForProfession(JOBS, mechatroniker).matches;
const visibleJobs = matches.map(x => x.job);
const graph = buildProfessionSchema(mechatroniker, visibleJobs);
const nodes = graph["@graph"] as ReadonlyArray<Record<string, unknown>>;
const typeOf = (t: string) => nodes.find(n => n["@type"] === t);
const links = buildProfessionInternalLinks({ profession: mechatroniker, professionRegistry: { professionBySlug }, jobMatches: matches });

describe("Mechatroniker – Schema", () => {
  it("1–4 – CollectionPage, BreadcrumbList, FAQPage, ItemList", () => {
    expect(nodes.map(n => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
  });
  it("5–6 – kein JobPosting, keine Organization-Duplikation", () => {
    const json = JSON.stringify(graph);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
  });
  it("7 – keine doppelten @ids", () => {
    const ids = nodes.map(n => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("8 – FAQ sichtbar = Schema", () => {
    const faq = typeOf("FAQPage") as { mainEntity: { name: string }[] };
    expect(faq.mainEntity.map(q => q.name)).toEqual(mechatroniker.faq.map(f => f.q));
  });
  it("9 – Jobs sichtbar = ItemList", () => {
    const list = typeOf("ItemList") as { numberOfItems: number; itemListElement: { url: string; name: string }[] };
    expect(list.numberOfItems).toBe(visibleJobs.length);
    expect(list.itemListElement.map(e => e.name)).toEqual(visibleJobs.map(j => j.title));
    expect(list.itemListElement.map(e => e.url)).toEqual(visibleJobs.map(j => `https://www.phe-perm.de${jobPath(j)}`));
  });
});

describe("Mechatroniker – interne Links", () => {
  it("1 – Breadcrumb Startseite → Berufe → Mechatroniker", () => {
    expect(links.breadcrumbs.map(b => b.label)).toEqual(["Startseite", "Berufe", "Mechatroniker"]);
    expect(links.breadcrumbs.map(b => b.href)).toEqual(["/", "/berufe", "/berufe/mechatroniker"]);
  });
  it("2 – Related Link auf Elektroniker", () => {
    expect(links.relatedProfessionLinks.map(l => l.href)).toEqual(["/berufe/elektroniker"]);
  });
  it("3 – keine Draft-Links", () => {
    for (const l of links.allLinks) {
      if (l.professionSlug) expect(professionBySlug[l.professionSlug]?.publication.published).toBe(true);
    }
  });
  it("4 – keine numerischen Job-URLs", () => {
    for (const l of links.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
  });
  it("5 – keine /talente-finden-Links", () => {
    for (const l of [...links.breadcrumbs, ...links.allLinks]) expect(l.href.startsWith("/talente-finden")).toBe(false);
  });
  it("6 – Core Links korrekt (5 Kernziele)", () => {
    expect(links.coreLinks.map(l => l.type).sort()).toEqual(["contact", "jobs", "parent", "resume", "service"]);
  });
  it("7 – Job Links = sichtbare Jobs", () => {
    expect(links.jobLinks.map(l => l.jobId)).toEqual(visibleJobs.map(j => j.id));
  });
});
