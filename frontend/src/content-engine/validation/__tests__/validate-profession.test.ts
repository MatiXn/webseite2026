import { describe, it, expect } from "vitest";
import { validateProfession } from "../validate-profession";
import type { ValidationCode, ValidationResult } from "../types";
import { elektroniker } from "../../../content/professions/elektroniker";
import { draftProfessions } from "../../../content/professions";
import type { ProfessionContent } from "../../../content/professions/types";

const base: ProfessionContent = elektroniker;
const hasError = (r: ValidationResult, code: ValidationCode) => r.errors.some(e => e.code === code);
const hasWarning = (r: ValidationResult, code: ValidationCode) => r.warnings.some(w => w.code === code);

describe("validateProfession", () => {
  it("1 – gültiger Elektroniker-Datensatz ist valid", () => {
    const r = validateProfession(base);
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("2 – Published mit indexable:false ergibt Error", () => {
    const r = validateProfession({ ...base, publication: { ...base.publication, indexable: false } });
    expect(r.valid).toBe(false);
    expect(hasError(r, "PROFESSION_PUBLISHED_NOT_INDEXABLE")).toBe(true);
  });

  it("3 – Draft mit includeInSitemap:true ergibt Error", () => {
    const r = validateProfession({
      ...base,
      status: "draft",
      publication: { published: false, indexable: false, includeInSitemap: true, showInProfessionHub: false, showRelatedLinks: false },
    });
    expect(hasError(r, "PROFESSION_DRAFT_IN_SITEMAP")).toBe(true);
  });

  it("4 – Canonical passt nicht zum Slug", () => {
    const r = validateProfession({ ...base, canonicalPath: "/berufe/anders" });
    expect(hasError(r, "PROFESSION_CANONICAL_MISMATCH")).toBe(true);
  });

  it("5 – FAQ ohne Antwort", () => {
    const r = validateProfession({ ...base, faq: [{ q: "Eine Frage?", a: "" }] });
    expect(hasError(r, "PROFESSION_FAQ_ANSWER_EMPTY")).toBe(true);
  });

  it("6 – doppeltes Secondary Keyword", () => {
    const r = validateProfession({ ...base, secondaryKeywords: ["gleich", "gleich"] });
    expect(hasError(r, "PROFESSION_SECONDARY_KEYWORD_DUPLICATE")).toBe(true);
  });

  it("7 – CTA ohne href", () => {
    const r = validateProfession({ ...base, hero: { ...base.hero, primaryCta: { label: "Los", href: "" } } });
    expect(hasError(r, "PROFESSION_CTA_HREF_EMPTY")).toBe(true);
  });

  it("8 – maxJobs:0", () => {
    const r = validateProfession({ ...base, jobMatch: { ...base.jobMatch, maxJobs: 0 } });
    expect(hasError(r, "PROFESSION_JOB_MATCH_MAXJOBS_INVALID")).toBe(true);
  });

  it("9 – Include- und Exclude-Keyword identisch", () => {
    const r = validateProfession({
      ...base,
      jobMatch: { category: ["elektro"], keywords: ["sps"], excludeKeywords: ["sps"], maxJobs: 6, fallback: "hint-and-joblist" },
    });
    expect(hasError(r, "PROFESSION_JOB_MATCH_INCLUDE_EXCLUDE_OVERLAP")).toBe(true);
  });

  it("10 – Self-Reference in Related Professions", () => {
    const r = validateProfession({
      ...base,
      internalLinks: { ...base.internalLinks, relatedProfessions: ["elektroniker"] },
    });
    expect(hasError(r, "PROFESSION_RELATED_SELF_REFERENCE")).toBe(true);
  });

  it("11 – verbotener Claim wird erkannt", () => {
    const r = validateProfession({ ...base, hero: { ...base.hero, intro: "Wir sind Marktführer und garantiert die Nr. 1." } });
    expect(hasError(r, "PROFESSION_FORBIDDEN_CLAIM")).toBe(true);
  });

  it("12 – zu langer Title erzeugt (nur) Warning", () => {
    const r = validateProfession({ ...base, metadataTitle: "x".repeat(80) });
    expect(hasWarning(r, "PROFESSION_METADATA_TITLE_TOO_LONG")).toBe(true);
    expect(hasError(r, "PROFESSION_METADATA_TITLE_TOO_LONG")).toBe(false);
    expect(r.valid).toBe(true); // Warning macht nicht invalid
  });

  it("Live-Drafts (servicetechniker, sps-automatisierung) haben keine Errors", () => {
    for (const draft of draftProfessions) {
      const r = validateProfession(draft);
      expect(r.errors, `${draft.slug}: ${r.errors.map(e => e.code).join(", ")}`).toHaveLength(0);
    }
  });
});
