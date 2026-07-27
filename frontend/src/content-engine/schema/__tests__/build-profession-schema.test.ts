import { describe, it, expect } from "vitest";
import { buildProfessionSchema } from "../build-profession-schema";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { elektroniker } from "../../../content/professions/elektroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";
import type { ProfessionContent } from "../../../content/professions/types";
import { buildCanonicalUrl } from "../../metadata";

function matchedJobs(p: ProfessionContent) {
  return matchJobsForProfession(JOBS, p).matches.map((m) => m.job);
}
function types(graph: { "@graph": readonly { [k: string]: unknown }[] }) {
  return graph["@graph"].map((n) => n["@type"]);
}

describe("buildProfessionSchema", () => {
  it("1 – Elektroniker: CollectionPage, Breadcrumb, FAQ, ItemList in Reihenfolge", () => {
    const graph = buildProfessionSchema(elektroniker, matchedJobs(elektroniker));
    expect(graph["@context"]).toBe("https://schema.org");
    expect(types(graph)).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
  });

  it("2 – Elektroniker: keine Organization, kein JobPosting, kein LocalBusiness/Service", () => {
    const json = JSON.stringify(buildProfessionSchema(elektroniker, matchedJobs(elektroniker)));
    expect(json).not.toContain('"@type":"Organization"');
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain("LocalBusiness");
    expect(json).not.toContain('"@type":"Service"');
  });

  it("3 – CollectionPage referenziert Breadcrumb und ItemList per @id", () => {
    const canonical = buildCanonicalUrl(elektroniker.canonicalPath);
    const graph = buildProfessionSchema(elektroniker, matchedJobs(elektroniker));
    const cp = graph["@graph"][0] as Record<string, { "@id"?: string }>;
    expect((cp.breadcrumb as { "@id": string })["@id"]).toBe(`${canonical}#breadcrumb`);
    expect((cp.mainEntity as { "@id": string })["@id"]).toBe(`${canonical}#joblist`);
  });

  it("4 – Draft Servicetechniker ist technisch erzeugbar", () => {
    const graph = buildProfessionSchema(servicetechniker, matchedJobs(servicetechniker));
    expect(graph["@context"]).toBe("https://schema.org");
    expect(types(graph)).toContain("CollectionPage");
    expect(types(graph)).toContain("BreadcrumbList");
  });

  it("5 – Draft SPS/Automatisierung ist technisch erzeugbar", () => {
    const graph = buildProfessionSchema(spsAutomatisierung, matchedJobs(spsAutomatisierung));
    expect(types(graph)).toContain("CollectionPage");
  });

  it("6 – deterministisch: wiederholter Lauf ist tief identisch", () => {
    const a = buildProfessionSchema(elektroniker, matchedJobs(elektroniker));
    const b = buildProfessionSchema(elektroniker, matchedJobs(elektroniker));
    expect(a).toEqual(b);
  });

  it("7 – Profession-Input wird nicht mutiert", () => {
    const snapshot = JSON.parse(JSON.stringify(elektroniker));
    buildProfessionSchema(elektroniker, matchedJobs(elektroniker));
    expect(JSON.parse(JSON.stringify(elektroniker))).toEqual(snapshot);
  });
});
