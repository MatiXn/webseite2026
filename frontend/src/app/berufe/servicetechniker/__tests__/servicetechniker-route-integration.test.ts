import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { matchJobToProfession } from "../../../../content-engine/job-matching";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { servicetechniker } from "../../../../content/professions/servicetechniker";
import { elektroniker } from "../../../../content/professions/elektroniker";
import { mechatroniker } from "../../../../content/professions/mechatroniker";
import { JOBS } from "../../../jobs/data";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const route = read("../page.tsx");
const template = read("../../../../content-engine/templates/ProfessionPageTemplate.tsx");
const hub = read("../../page.tsx");
const sitemap = read("../../../sitemap.ts");
const jobDetail = read("../../../jobs/[slug]/page.tsx");
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const getJob = (id: string) => {
  const j = JOBS.find(x => x.id === id);
  if (!j) throw new Error("job fehlt");
  return j;
};

describe("Servicetechniker – Route & Template", () => {
  it("1–2 – Route dünn, nutzt ProfessionPageTemplate", () => {
    expect(route).toContain("ProfessionPageTemplate profession={servicetechniker}");
    expect(route).toContain("buildProfessionMetadata(servicetechniker)");
  });
  it("3 – keine lokale Content-/Schema-Logik", () => {
    expect(route.includes("matchJobsForProfession")).toBe(false);
    expect(route.includes("buildProfessionSchema")).toBe(false);
    expect(count(route, /<h1/g)).toBe(0);
  });
  it("4 – Template unverändert (keine Servicetechniker-Sonderlogik)", () => {
    expect(template.includes("Servicetechniker")).toBe(false);
    expect(template.includes("slug ===")).toBe(false);
  });
  it("5 – Elektroniker & Mechatroniker unverändert (Metadata stabil)", () => {
    expect(buildProfessionMetadata(elektroniker).title).toEqual({ absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" });
    expect(buildProfessionMetadata(mechatroniker).title).toEqual({ absolute: "Mechatroniker Jobs in Festanstellung | PHE-Perm" });
  });
});

describe("Servicetechniker – Hub, Sitemap, Backlinks", () => {
  it("1 – Hub verlinkt auf /berufe/servicetechniker", () => {
    expect(hub).toContain('detailHref: "/berufe/servicetechniker"');
  });
  it("2 – Sitemap enthält die URL genau einmal", () => {
    expect(count(sitemap, /\/berufe\/servicetechniker/g)).toBe(1);
  });
  it("3 – Backlink matcher-basiert; Elektroniker/Mechatroniker-Backlinks intakt", () => {
    expect(jobDetail).toContain("matchJobToProfession(job, servicetechniker).matched");
    expect(jobDetail).toContain("Mehr zum Berufsbild Servicetechniker →");
    expect(jobDetail).toContain('job.category === "elektro"');
    expect(jobDetail).toContain('job.category === "mechatronik"');
  });
  it("4 – passende Jobseite matcht (id 2), fachfremde nicht (id 1)", () => {
    expect(matchJobToProfession(getJob("2"), servicetechniker).matched).toBe(true);
    expect(matchJobToProfession(getJob("1"), servicetechniker).matched).toBe(false);
  });
});
