import { describe, it, expect } from "vitest";
import { validateIndustry, type IndustryValidationCode, type IndustryValidationResult } from "../validate-industry";
import type { IndustryContent } from "../../../content/industries/types";

// Synthetisches, gültiges Branchen-Fixture (noch keine reale Branche in EPIC 008A).
function makeIndustry(overrides: Partial<IndustryContent> = {}): IndustryContent {
  return {
    slug: "automatisierungstechnik",
    name: "Automatisierungstechnik",
    shortName: "Automatisierung",
    status: "published",
    parentSlug: "branchen",
    metadataTitle: "Automatisierungstechnik | PHE-Perm",
    metadataDescription: "Sachliche Beschreibung der Branche Automatisierungstechnik und passender technischer Fachkräfte.",
    canonicalPath: "/branchen/automatisierungstechnik",
    primaryKeyword: "Automatisierungstechnik Personal",
    secondaryKeywords: ["SPS Fachkräfte", "Automatisierungstechniker"],
    searchIntent: "commercial",
    hero: {
      eyebrow: "Branche",
      headline: "Fachkräfte für Automatisierungstechnik",
      intro: "Sachliche Einleitung ohne erfundene Zahlen.",
      primaryCta: { label: "Fachkräfte anfragen", href: "/technische-personalvermittlung" },
      secondaryCta: { label: "Kontakt", href: "/kontakt" },
    },
    overview: { title: "Automatisierungstechnik", paragraphs: ["Absatz eins.", "Absatz zwei."] },
    focusAreas: [{ title: "Steuerungstechnik", note: "Sachliche Einordnung." }],
    faq: [
      { q: "Welche Fachkräfte vermittelt PHE-Perm in der Automatisierungstechnik?", a: "Technische Fachkräfte in Festanstellung." },
      { q: "Ist die Vermittlung für Bewerber kostenlos?", a: "Ja." },
    ],
    applicantCta: {
      title: "Stelle in der Automatisierungstechnik gesucht?",
      text: "Sieh dir passende Positionen an.",
      primaryCta: { label: "Jobs ansehen", href: "/jobs" },
      secondaryCta: { label: "Lebenslauf erstellen", href: "/lebenslauf-erstellen" },
    },
    employerCta: {
      title: "Fachkräfte für Automatisierungstechnik gesucht?",
      text: "Wir übernehmen Suche und Vorauswahl.",
      primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" },
      secondaryCta: { label: "Kontakt", href: "/kontakt" },
    },
    internalLinks: {
      parent: "/branchen",
      jobs: "/jobs",
      personalvermittlung: "/technische-personalvermittlung",
      kontakt: "/kontakt",
      relatedProfessions: ["elektroniker", "mechatroniker"],
    },
    jobMatch: { category: ["it"], tags: ["SPS", "Siemens TIA Portal"], maxJobs: 6, fallback: "hint-and-joblist" },
    publication: { published: true, indexable: true, includeInSitemap: true, showInIndustryHub: true, showRelatedLinks: true },
    ...overrides,
  };
}

const draftPublication = { published: false, indexable: false, includeInSitemap: false, showInIndustryHub: false, showRelatedLinks: false } as const;
const has = (r: IndustryValidationResult, c: IndustryValidationCode) => r.errors.some((e) => e.code === c);

describe("validateIndustry", () => {
  it("1 – gültiges Fixture ist valide", () => {
    const r = validateIndustry(makeIndustry());
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });

  it("2 – leerer slug", () => {
    expect(has(validateIndustry(makeIndustry({ slug: "" })), "INDUSTRY_SLUG_EMPTY")).toBe(true);
  });

  it("3 – ungültiger slug", () => {
    expect(has(validateIndustry(makeIndustry({ slug: "Automatisierung!" })), "INDUSTRY_SLUG_INVALID")).toBe(true);
  });

  it("4 – Canonical-Mismatch", () => {
    expect(has(validateIndustry(makeIndustry({ canonicalPath: "/branchen/falsch" })), "INDUSTRY_CANONICAL_MISMATCH")).toBe(true);
  });

  it("5 – published ohne indexable", () => {
    const r = validateIndustry(makeIndustry({ publication: { published: true, indexable: false, includeInSitemap: true, showInIndustryHub: true, showRelatedLinks: true } }));
    expect(has(r, "INDUSTRY_PUBLISHED_NOT_INDEXABLE")).toBe(true);
  });

  it("6 – Draft, aber indexierbar", () => {
    const r = validateIndustry(makeIndustry({ status: "draft", publication: { ...draftPublication, indexable: true } }));
    expect(has(r, "INDUSTRY_DRAFT_INDEXABLE")).toBe(true);
  });

  it("7 – leerer metadataTitle", () => {
    expect(has(validateIndustry(makeIndustry({ metadataTitle: "" })), "INDUSTRY_METADATA_TITLE_EMPTY")).toBe(true);
  });

  it("8 – leeres FAQ", () => {
    expect(has(validateIndustry(makeIndustry({ faq: [] })), "INDUSTRY_FAQ_EMPTY")).toBe(true);
  });

  it("9 – doppelte FAQ-Frage", () => {
    const r = validateIndustry(makeIndustry({ faq: [{ q: "Gleich?", a: "A" }, { q: "Gleich?", a: "B" }] }));
    expect(has(r, "INDUSTRY_FAQ_DUPLICATE_QUESTION")).toBe(true);
  });

  it("10 – ungültiger interner Link", () => {
    const r = validateIndustry(makeIndustry({ internalLinks: { parent: "branchen", jobs: "/jobs", personalvermittlung: "/technische-personalvermittlung", kontakt: "/kontakt", relatedProfessions: [] } }));
    expect(has(r, "INDUSTRY_LINK_INVALID")).toBe(true);
  });

  it("11 – jobMatch ohne Signal", () => {
    const r = validateIndustry(makeIndustry({ jobMatch: { maxJobs: 6, fallback: "hint-and-joblist" } }));
    expect(has(r, "INDUSTRY_JOB_MATCH_EMPTY")).toBe(true);
  });

  it("12 – ungültige maxJobs", () => {
    const r = validateIndustry(makeIndustry({ jobMatch: { category: ["it"], maxJobs: 0, fallback: "hint-and-joblist" } }));
    expect(has(r, "INDUSTRY_JOB_MATCH_MAXJOBS_INVALID")).toBe(true);
  });

  it("13 – Keyword in include UND exclude", () => {
    const r = validateIndustry(makeIndustry({ jobMatch: { category: ["it"], keywords: ["SPS"], excludeKeywords: ["SPS"], maxJobs: 6, fallback: "hint-and-joblist" } }));
    expect(has(r, "INDUSTRY_JOB_MATCH_INCLUDE_EXCLUDE_OVERLAP")).toBe(true);
  });

  it("14 – verbotener Claim", () => {
    const r = validateIndustry(makeIndustry({ metadataDescription: "Wir sind Marktführer und garantiert die Nummer 1." }));
    expect(has(r, "INDUSTRY_FORBIDDEN_CLAIM")).toBe(true);
  });

  it("15 – Self-Reference in relatedProfessions", () => {
    const r = validateIndustry(makeIndustry({ internalLinks: { parent: "/branchen", jobs: "/jobs", personalvermittlung: "/technische-personalvermittlung", kontakt: "/kontakt", relatedProfessions: ["automatisierungstechnik"] } }));
    expect(has(r, "INDUSTRY_RELATED_SELF_REFERENCE")).toBe(true);
  });

  it("16 – mutiert die Eingabe nicht", () => {
    const industry = makeIndustry();
    const snapshot = JSON.parse(JSON.stringify(industry));
    validateIndustry(industry);
    expect(JSON.parse(JSON.stringify(industry))).toEqual(snapshot);
  });
});
