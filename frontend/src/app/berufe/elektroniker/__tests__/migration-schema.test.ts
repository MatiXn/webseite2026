import { describe, it, expect } from "vitest";
import { JOBS } from "../../../jobs/data";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { buildProfessionSchema } from "../../../../content-engine/schema";
import { elektroniker } from "../../../../content/professions/elektroniker";
import { jobPath } from "../../../../lib/slug";

const visibleJobs = matchJobsForProfession(JOBS, elektroniker).matches.map(m => m.job);
const graph = buildProfessionSchema(elektroniker, visibleJobs);
const nodes = graph["@graph"] as ReadonlyArray<Record<string, unknown>>;
const typeOf = (t: string) => nodes.find(n => n["@type"] === t);

function collectTypes(v: unknown): string[] {
  if (Array.isArray(v)) return v.flatMap(collectTypes);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const own = typeof o["@type"] === "string" ? [o["@type"] as string] : [];
    return [...own, ...Object.values(o).flatMap(collectTypes)];
  }
  return [];
}

describe("Elektroniker-Migration – Schema", () => {
  it("1 – genau ein Graph mit @context", () => {
    expect(graph["@context"]).toBe("https://schema.org");
    expect(Array.isArray(graph["@graph"])).toBe(true);
  });

  it("2–5 – CollectionPage, BreadcrumbList, FAQPage, ItemList vorhanden", () => {
    expect(nodes.map(n => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
  });

  it("6–8 – kein JobPosting, keine Organization, keine verbotenen Typen", () => {
    const json = JSON.stringify(graph);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    for (const forbidden of ["LocalBusiness", "Service", "AggregateRating", "Review", "Offer", "baseSalary"]) {
      expect(collectTypes(graph).includes(forbidden)).toBe(false);
    }
  });

  it("9 – keine doppelten @ids", () => {
    const ids = nodes.map(n => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("10 – FAQ im Schema = Registry-FAQ (Anzahl + Reihenfolge)", () => {
    const faq = typeOf("FAQPage") as { mainEntity: { name: string }[] };
    expect(faq.mainEntity.length).toBe(elektroniker.faq.length);
    expect(faq.mainEntity.map(q => q.name)).toEqual(elektroniker.faq.map(f => f.q));
  });

  it("11 – ItemList = sichtbare Jobs (Reihenfolge + Slug-URLs)", () => {
    const list = typeOf("ItemList") as { numberOfItems: number; itemListElement: { url: string; name: string }[] };
    expect(list.numberOfItems).toBe(visibleJobs.length);
    expect(list.itemListElement.map(e => e.name)).toEqual(visibleJobs.map(j => j.title));
    expect(list.itemListElement.map(e => e.url)).toEqual(visibleJobs.map(j => `https://www.phe-perm.de${jobPath(j)}`));
  });
});
