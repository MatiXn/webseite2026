import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { automatisierungstechnik } from "../../../content/industries/automatisierungstechnik";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const template = read("../../../content-engine/templates/IndustryPageTemplate.tsx");
const hub = read("../page.tsx");
const route = read("../[slug]/page.tsx");
const footer = read("../../components/Footer.tsx");
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

describe("IndustryPageTemplate – Struktur (Quellinspektion)", () => {
  it("1 – genau eine H1, aus der Config (hero.headline)", () => {
    expect(count(template, /<h1/g)).toBe(1);
    expect(template).toContain("{p.hero.headline}");
  });
  it("2 – rendert Überblick, Fokusbereiche, Jobs, Related, FAQ, CTAs, Rücklink", () => {
    for (const marker of ["{p.overview.title}", "p.focusAreas.map", 'id="stellen"', "visibleJobs.map", "relevantProfessionLinks", "FaqSection", "{p.employerCta.title}", "{p.applicantCta.title}", "hubLink"]) {
      expect(template.includes(marker), marker).toBe(true);
    }
  });
  it("3 – Jobs nur aus Matcher, keine numerischen Job-URLs, keine lokale Config-Prosa", () => {
    expect(template).toContain("matchJobsForConfig(JOBS, p.jobMatch, p.slug)");
    expect(template).toContain("jobPath(job)");
    expect(template.includes("/jobs/7")).toBe(false);
    expect(template.includes("Automatisierungstechnik")).toBe(false); // berufsneutral
  });
  it("4 – Ein-Job-Formulierung im Singular", () => {
    expect(template).toContain('"Aktuell passende Stelle"');
  });
  it("5 – Related-/Job-Sektion bedingt (keine leeren Bereiche)", () => {
    expect(template).toContain("links.relevantProfessionLinks.length > 0 &&");
    expect(template).toContain("visibleJobs.length > 0 ?");
  });
});

describe("Branchen-Hub – Struktur (Quellinspektion)", () => {
  it("1 – genau eine H1", () => {
    expect(count(hub, /<h1/g)).toBe(1);
  });
  it("2 – Karten aus publishedIndustries (keine hartcodierte Einzelkarte)", () => {
    expect(hub).toContain("publishedIndustries.map");
    expect(hub).toContain("ind.canonicalPath");
    expect(hub).toContain("Zur Branche {ind.name}");
  });
  it("3 – Metadata über buildPageMetadata, Canonical /branchen", () => {
    expect(hub).toContain("buildPageMetadata({");
    expect(hub).toContain('canonicalPath: "/branchen"');
    expect(hub).toContain("Branchen der technischen Personalvermittlung | PHE-Perm");
  });
});

describe("Branchen-Detailroute – Struktur (Quellinspektion)", () => {
  it("1 – generateStaticParams aus publishedIndustries", () => {
    expect(route).toContain("publishedIndustries.map");
    expect(route).toContain("generateStaticParams");
  });
  it("2 – unbekannter/Draft-Slug → notFound, keine eigene Matchlogik", () => {
    expect(route).toContain("notFound()");
    expect(route).toContain('industry.status === "published"');
    expect(route.includes("matchJobsForConfig")).toBe(false);
    expect(route.includes("buildIndustrySchema")).toBe(false);
  });
  it("3 – Metadata via buildIndustryMetadata, Template via IndustryPageTemplate", () => {
    expect(route).toContain("buildIndustryMetadata(industry)");
    expect(route).toContain("<IndustryPageTemplate industry={industry} />");
  });
});

describe("Interne Verlinkung – Footer", () => {
  it("1 – Footer verlinkt /branchen (kontrollierte sichtbare Integration)", () => {
    expect(footer).toContain('"/branchen"');
    expect(footer).toContain('"Branchen"');
  });
  it("2 – Config-Canonical passt zur Route", () => {
    expect(automatisierungstechnik.canonicalPath).toBe("/branchen/automatisierungstechnik");
  });
});
