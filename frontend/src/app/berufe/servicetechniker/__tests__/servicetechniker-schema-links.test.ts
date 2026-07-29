import { describe, it, expect } from "vitest";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { buildProfessionSchema } from "../../../../content-engine/schema";
import { buildProfessionInternalLinks } from "../../../../content-engine/internal-links";
import { servicetechniker } from "../../../../content/professions/servicetechniker";
import { professionBySlug } from "../../../../content/professions";
import { JOBS } from "../../../jobs/data";

const matches = matchJobsForProfession(JOBS, servicetechniker).matches;
const visibleJobs = matches.map(x => x.job);
const graph = buildProfessionSchema(servicetechniker, visibleJobs);
const nodes = graph["@graph"] as ReadonlyArray<Record<string, unknown>>;
const typeOf = (t: string) => nodes.find(n => n["@type"] === t);
const links = buildProfessionInternalLinks({ profession: servicetechniker, professionRegistry: { professionBySlug }, jobMatches: matches });

describe("Servicetechniker – Schema", () => {
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
    expect(faq.mainEntity.map(q => q.name)).toEqual(servicetechniker.faq.map(f => f.q));
  });
  it("9 – Jobs sichtbar = ItemList", () => {
    const list = typeOf("ItemList") as { numberOfItems: number; itemListElement: { name: string }[] };
    expect(list.numberOfItems).toBe(visibleJobs.length);
    expect(list.itemListElement.map(e => e.name)).toEqual(visibleJobs.map(j => j.title));
  });
});

describe("Servicetechniker – interne Links", () => {
  it("1 – Breadcrumb Startseite → Berufe → Servicetechniker", () => {
    expect(links.breadcrumbs.map(b => b.label)).toEqual(["Startseite", "Berufe", "Servicetechniker"]);
  });
  it("2 – Related Links nur auf veröffentlichte Ziele (Elektroniker, Mechatroniker)", () => {
    expect(links.relatedProfessionLinks.map(l => l.href)).toEqual(["/berufe/elektroniker", "/berufe/mechatroniker"]);
    for (const l of links.relatedProfessionLinks) {
      expect(professionBySlug[l.professionSlug ?? ""]?.publication.published).toBe(true);
    }
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
  it("6 – Core Links korrekt", () => {
    expect(links.coreLinks.map(l => l.type).sort()).toEqual(["contact", "jobs", "parent", "resume", "service"]);
  });
  it("7 – Job Links = sichtbare Jobs", () => {
    expect(links.jobLinks.map(l => l.jobId)).toEqual(visibleJobs.map(j => j.id));
  });
});
