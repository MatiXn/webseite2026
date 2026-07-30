import { describe, it, expect } from "vitest";
import { validateIndustryRegistry } from "../validate-industry-registry";
import type { IndustryValidationCode, IndustryValidationResult } from "../validate-industry";
import type { IndustryContent } from "../../../content/industries/types";
import { industries, publishedIndustries, draftIndustries, industryBySlug } from "../../../content/industries";

function makeIndustry(overrides: Partial<IndustryContent> = {}): IndustryContent {
  return {
    slug: "automatisierungstechnik",
    name: "Automatisierungstechnik",
    shortName: "Automatisierung",
    status: "published",
    parentSlug: "branchen",
    metadataTitle: "Automatisierungstechnik | PHE-Perm",
    metadataDescription: "Sachliche Beschreibung der Branche Automatisierungstechnik.",
    canonicalPath: "/branchen/automatisierungstechnik",
    primaryKeyword: "Automatisierungstechnik Personal",
    secondaryKeywords: [],
    searchIntent: "commercial",
    hero: {
      headline: "Fachkräfte für Automatisierungstechnik",
      intro: "Sachliche Einleitung.",
      primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" },
      secondaryCta: { label: "Kontakt", href: "/kontakt" },
    },
    overview: { title: "Automatisierungstechnik", paragraphs: ["Absatz."] },
    focusAreas: [{ title: "Steuerungstechnik", note: "Einordnung." }],
    faq: [{ q: "Frage?", a: "Antwort." }],
    applicantCta: { title: "Bewerber", text: "Text.", primaryCta: { label: "Jobs", href: "/jobs" } },
    employerCta: { title: "Unternehmen", text: "Text.", primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" } },
    internalLinks: { parent: "/branchen", jobs: "/jobs", personalvermittlung: "/technische-personalvermittlung", kontakt: "/kontakt", relatedProfessions: [] },
    jobMatch: { category: ["it"], maxJobs: 6, fallback: "hint-and-joblist" },
    publication: { published: true, indexable: true, includeInSitemap: true, showInIndustryHub: true, showRelatedLinks: true },
    ...overrides,
  };
}
const has = (r: IndustryValidationResult, c: IndustryValidationCode) => r.errors.some((e) => e.code === c);

describe("validateIndustryRegistry", () => {
  it("1 – leere Live-Registry ist gültig", () => {
    const r = validateIndustryRegistry({ industries, publishedIndustries, draftIndustries, industryBySlug });
    expect(r.valid).toBe(true);
    expect(industries.length).toBe(0);
  });

  it("2 – einzelne gültige Branche", () => {
    const a = makeIndustry();
    const r = validateIndustryRegistry({ industries: [a], publishedIndustries: [a], draftIndustries: [], industryBySlug: { automatisierungstechnik: a } });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });

  it("3 – doppelter Slug", () => {
    const a = makeIndustry();
    const b = makeIndustry();
    const r = validateIndustryRegistry({ industries: [a, b], publishedIndustries: [a, b], draftIndustries: [], industryBySlug: { automatisierungstechnik: a } });
    expect(has(r, "REGISTRY_INDUSTRY_DUPLICATE_SLUG")).toBe(true);
  });

  it("4 – Published-Array enthält Draft", () => {
    const draft = makeIndustry({ status: "draft", publication: { published: false, indexable: false, includeInSitemap: false, showInIndustryHub: false, showRelatedLinks: false } });
    const r = validateIndustryRegistry({ industries: [draft], publishedIndustries: [draft], draftIndustries: [], industryBySlug: { automatisierungstechnik: draft } });
    expect(has(r, "REGISTRY_INDUSTRY_PUBLISHED_ARRAY_MISMATCH")).toBe(true);
  });

  it("5 – Branche fehlt in Teilarrays", () => {
    const a = makeIndustry();
    const r = validateIndustryRegistry({ industries: [a], publishedIndustries: [], draftIndustries: [], industryBySlug: { automatisierungstechnik: a } });
    expect(has(r, "REGISTRY_INDUSTRY_MISSING_IN_SUBARRAYS")).toBe(true);
  });

  it("6 – industryBySlug-Eintrag fehlt", () => {
    const a = makeIndustry();
    const r = validateIndustryRegistry({ industries: [a], publishedIndustries: [a], draftIndustries: [], industryBySlug: {} });
    expect(has(r, "REGISTRY_INDUSTRY_BYSLUG_MISSING")).toBe(true);
  });

  it("7 – Published-Branche mit Validierungsfehlern", () => {
    const broken = makeIndustry({ metadataTitle: "" });
    const r = validateIndustryRegistry({ industries: [broken], publishedIndustries: [broken], draftIndustries: [], industryBySlug: { automatisierungstechnik: broken } });
    expect(has(r, "REGISTRY_INDUSTRY_PUBLISHED_HAS_ERRORS")).toBe(true);
  });
});
