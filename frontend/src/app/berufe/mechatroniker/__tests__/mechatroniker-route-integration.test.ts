import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { elektroniker } from "../../../../content/professions/elektroniker";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const route = read("../page.tsx");
const template = read("../../../../content-engine/templates/ProfessionPageTemplate.tsx");
const hub = read("../../page.tsx");
const sitemap = read("../../../sitemap.ts");
const jobDetail = read("../../../jobs/[slug]/page.tsx");
const elektroRoute = read("../../elektroniker/page.tsx");
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

describe("Mechatroniker – Route & Template", () => {
  it("1–2 – Route ist dünn und nutzt das ProfessionPageTemplate", () => {
    expect(route).toContain("ProfessionPageTemplate profession={mechatroniker}");
    expect(route).toContain("buildProfessionMetadata(mechatroniker)");
  });
  it("3–5 – keine lokale Content-/Jobfilter-/Schema-Logik", () => {
    expect(route.includes("matchJobsForProfession")).toBe(false);
    expect(route.includes('category === "mechatronik"')).toBe(false);
    expect(route.includes("buildProfessionSchema")).toBe(false);
    expect(count(route, /<JsonLd/g)).toBe(0);
    for (const local of ["const SECTION", "const COMMITMENT", "FACHRICHTUNGEN", ".faq =", "<h1"]) {
      expect(route.includes(local)).toBe(false);
    }
  });
  it("9 – Template enthält keine Mechatroniker-Sonderlogik", () => {
    expect(template.includes("Mechatroniker")).toBe(false);
    expect(template.includes("slug ===")).toBe(false);
    expect(template.includes("if (slug")).toBe(false);
  });
  it("10 – Elektroniker-Route unverändert (nutzt Template, Metadata stabil)", () => {
    expect(elektroRoute).toContain("ProfessionPageTemplate profession={elektroniker}");
    const em = buildProfessionMetadata(elektroniker);
    expect(em.title).toEqual({ absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" });
    expect(em.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/elektroniker");
  });
});

describe("Mechatroniker – Hub, Sitemap, Backlinks", () => {
  it("1 – Hub verlinkt auf /berufe/mechatroniker", () => {
    expect(hub).toContain('detailHref: "/berufe/mechatroniker"');
  });
  it("2 – Sitemap enthält die URL genau einmal", () => {
    expect(count(sitemap, /\/berufe\/mechatroniker/g)).toBe(1);
  });
  it("3 – passende Jobseite enthält den Mechatroniker-Backlink", () => {
    expect(jobDetail).toContain('job.category === "mechatronik"');
    expect(jobDetail).toContain("/berufe/mechatroniker");
    expect(jobDetail).toContain("Mehr zum Berufsbild Mechatroniker →");
  });
  it("5 – Elektroniker-Backlink bleibt bestehen", () => {
    expect(jobDetail).toContain('job.category === "elektro"');
    expect(jobDetail).toContain("Mehr zum Berufsbild Elektroniker →");
  });
});
