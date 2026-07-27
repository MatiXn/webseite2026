import { describe, it, expect } from "vitest";
import { buildItemListSchema } from "../build-item-list-schema";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { elektroniker } from "../../../content/professions/elektroniker";
import { jobPath } from "../../../lib/slug";
import { buildCanonicalUrl } from "../../metadata";

type ListItem = { "@type": string; position: number; url: string; name: string };
const ID = "https://www.phe-perm.de/berufe/elektroniker#joblist";
const matchedJobs = matchJobsForProfession(JOBS, elektroniker).matches.map((m) => m.job);

describe("buildItemListSchema", () => {
  it("1 – ItemList mit korrekten Positionen und numberOfItems", () => {
    const list = buildItemListSchema(matchedJobs, ID);
    expect(list).not.toBeNull();
    const node = list as NonNullable<typeof list>;
    expect(node["@type"]).toBe("ItemList");
    expect(node.numberOfItems).toBe(matchedJobs.length);
    const els = node.itemListElement as ListItem[];
    expect(els.map((e) => e.position)).toEqual(matchedJobs.map((_, i) => i + 1));
  });

  it("2 – respektiert maxJobs (Anzahl = gematchte Jobs)", () => {
    const node = buildItemListSchema(matchedJobs, ID) as { numberOfItems: number };
    expect(node.numberOfItems).toBeLessThanOrEqual(elektroniker.jobMatch.maxJobs);
    expect(node.numberOfItems).toBe(matchedJobs.length);
  });

  it("3 – Elemente sind ListItems, keine JobPostings", () => {
    const els = (buildItemListSchema(matchedJobs, ID) as { itemListElement: ListItem[] }).itemListElement;
    for (const e of els) expect(e["@type"]).toBe("ListItem");
    const json = JSON.stringify(els);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain("baseSalary");
    expect(json).not.toContain("description");
  });

  it("4 – URLs sind absolute Slug-URLs", () => {
    const els = (buildItemListSchema(matchedJobs, ID) as { itemListElement: ListItem[] }).itemListElement;
    els.forEach((e, i) => {
      expect(e.url).toBe(buildCanonicalUrl(jobPath(matchedJobs[i])));
      expect(e.url.startsWith("https://")).toBe(true);
    });
  });

  it("5 – keine Jobs -> keine ItemList (null)", () => {
    expect(buildItemListSchema([], ID)).toBeNull();
  });

  it("6 – mutiert die Job-Liste nicht", () => {
    const snapshot = JSON.parse(JSON.stringify(matchedJobs));
    buildItemListSchema(matchedJobs, ID);
    expect(JSON.parse(JSON.stringify(matchedJobs))).toEqual(snapshot);
  });
});
