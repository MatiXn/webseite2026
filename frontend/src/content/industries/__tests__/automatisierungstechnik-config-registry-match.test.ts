import { describe, it, expect } from "vitest";
import { validateIndustry, validateIndustryRegistry } from "../../../content-engine/validation";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { automatisierungstechnik } from "../automatisierungstechnik";
import { industries, publishedIndustries, draftIndustries, industryBySlug } from "../index";
import { professionBySlug } from "../../professions";
import { company } from "../../company";
import { JOBS } from "../../../app/jobs/data";

describe("Automatisierungstechnik – Config", () => {
  it("1 – validiert ohne Errors/Warnings", () => {
    const r = validateIndustry(automatisierungstechnik);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings).toHaveLength(0);
  });
  it("2 – slug + canonicalPath korrekt", () => {
    expect(automatisierungstechnik.slug).toBe("automatisierungstechnik");
    expect(automatisierungstechnik.canonicalPath).toBe("/branchen/automatisierungstechnik");
  });
  it("3 – published + indexable", () => {
    expect(automatisierungstechnik.status).toBe("published");
    expect(automatisierungstechnik.publication).toMatchObject({ published: true, indexable: true, includeInSitemap: true, showInIndustryHub: true, showRelatedLinks: true });
  });
  it("4 – Pflichtfelder gefüllt, FAQ nicht leer", () => {
    expect(automatisierungstechnik.hero.headline.length).toBeGreaterThan(0);
    expect(automatisierungstechnik.overview.paragraphs.length).toBeGreaterThan(0);
    expect(automatisierungstechnik.focusAreas.length).toBeGreaterThan(0);
    expect(automatisierungstechnik.faq.length).toBeGreaterThanOrEqual(5);
  });
  it("5 – relatedProfessions nur bekannte published Professionen", () => {
    for (const slug of automatisierungstechnik.internalLinks.relatedProfessions) {
      expect(professionBySlug[slug]?.publication.published, slug).toBe(true);
    }
  });
  it("6 – keine verbotenen Claims / keine Unternehmensstammdaten", () => {
    const lower = JSON.stringify(automatisierungstechnik).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "100 %", "100%", "nummer 1"]) expect(lower.includes(bad)).toBe(false);
    const raw = JSON.stringify(automatisierungstechnik);
    for (const nap of [company.email, company.phone, company.street, company.postalCode]) expect(raw.includes(nap)).toBe(false);
  });
});

describe("Automatisierungstechnik – Registry", () => {
  it("1 – Registry ab EPIC 009B: 2 Branchen, beide published, keine Drafts; automatisierungstechnik enthalten", () => {
    expect(industries.length).toBe(2);
    expect(publishedIndustries.length).toBe(2);
    expect(publishedIndustries.map((i) => i.slug)).toContain("automatisierungstechnik");
    expect(draftIndustries.length).toBe(0);
  });
  it("2 – Registry valide", () => {
    const r = validateIndustryRegistry({ industries, publishedIndustries, draftIndustries, industryBySlug });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });
  it("3 – Lookup per Slug funktioniert, unbekannter Slug ist undefined", () => {
    expect(industryBySlug["automatisierungstechnik"]).toBe(automatisierungstechnik);
    expect(industryBySlug["gibtsnicht"]).toBeUndefined();
  });
});

describe("Automatisierungstechnik – Matching (konservativ)", () => {
  const result = matchJobsForConfig(JOBS, automatisierungstechnik.jobMatch, automatisierungstechnik.slug);
  it("1 – exakt gematchte Job-IDs = [7], 0 ausgeschlossen", () => {
    expect(result.matches.map((m) => m.job.id)).toEqual(["7"]);
    expect(result.excludedCount).toBe(0);
    expect(result.totalMatched).toBe(1);
  });
  it("2 – keine bekannten False Positives (id 12/24 nicht gematcht)", () => {
    for (const id of ["12", "24"]) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForConfig([j], automatisierungstechnik.jobMatch, "x").totalMatched).toBe(0);
    }
  });
  it("3 – id 7 stabil über category + Tags (nicht nur Textvorkommen)", () => {
    const only = result.matches[0];
    expect(only.matchedSignals).toEqual(expect.arrayContaining(["category", "tag"]));
    expect(only.confidence).toBe("high");
  });
  it("4 – deterministisch", () => {
    const again = matchJobsForConfig(JOBS, automatisierungstechnik.jobMatch, automatisierungstechnik.slug);
    expect(again.matches.map((m) => m.job.id)).toEqual(result.matches.map((m) => m.job.id));
  });
  it("5 – leerer Input ist robust", () => {
    expect(matchJobsForConfig([], automatisierungstechnik.jobMatch, "x").totalMatched).toBe(0);
  });
});
