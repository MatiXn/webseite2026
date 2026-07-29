import { describe, it, expect } from "vitest";
import { validateProfessionRegistry } from "../validate-profession-registry";
import type { ValidationCode, ValidationResult } from "../types";
import { professions, publishedProfessions, draftProfessions, professionBySlug } from "../../../content/professions";
import { elektroniker } from "../../../content/professions/elektroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import type { ProfessionContent } from "../../../content/professions/types";

const hasError = (r: ValidationResult, code: ValidationCode) => r.errors.some(e => e.code === code);
const liveRegistry = { professions, publishedProfessions, draftProfessions, professionBySlug };

// Synthetisches Draft-Fixture (seit EPIC 007D gibt es keine echte Draft-Profession mehr).
const draftProf: ProfessionContent = {
  ...elektroniker,
  slug: "draft-ziel",
  canonicalPath: "/berufe/draft-ziel",
  metadataTitle: "Draft Ziel Jobs | PHE-Perm",
  primaryKeyword: "Draft Ziel Jobs",
  status: "draft",
  internalLinks: { ...elektroniker.internalLinks, relatedProfessions: [] },
  publication: { published: false, indexable: false, includeInSitemap: false, showInProfessionHub: false, showRelatedLinks: false },
};

describe("validateProfessionRegistry", () => {
  it("1 – aktuelle Live-Registry ist gültig", () => {
    const r = validateProfessionRegistry(liveRegistry);
    expect(r.valid, r.errors.map(e => `${e.professionSlug ?? "-"}:${e.code}`).join(", ")).toBe(true);
  });

  it("2 – doppelter Slug wird erkannt", () => {
    const dup: ProfessionContent = { ...elektroniker };
    const r = validateProfessionRegistry({
      professions: [elektroniker, dup],
      publishedProfessions: [elektroniker, dup],
      draftProfessions: [],
      professionBySlug: { elektroniker },
    });
    expect(hasError(r, "REGISTRY_DUPLICATE_SLUG")).toBe(true);
  });

  it("3 – doppelter Canonical wird erkannt", () => {
    const p2: ProfessionContent = { ...servicetechniker, canonicalPath: elektroniker.canonicalPath };
    const r = validateProfessionRegistry({
      professions: [elektroniker, p2],
      publishedProfessions: [elektroniker],
      draftProfessions: [p2],
      professionBySlug: { elektroniker, servicetechniker: p2 },
    });
    expect(hasError(r, "REGISTRY_DUPLICATE_CANONICAL")).toBe(true);
  });

  it("4 – Published-Array enthält Draft", () => {
    const r = validateProfessionRegistry({
      professions: [elektroniker, draftProf],
      publishedProfessions: [elektroniker, draftProf], // draftProf ist draft
      draftProfessions: [],
      professionBySlug: { elektroniker, "draft-ziel": draftProf },
    });
    expect(hasError(r, "REGISTRY_PUBLISHED_ARRAY_MISMATCH")).toBe(true);
  });

  it("5 – Profession fehlt in Teilarrays", () => {
    const r = validateProfessionRegistry({
      professions: [elektroniker, servicetechniker],
      publishedProfessions: [elektroniker],
      draftProfessions: [], // servicetechniker fehlt
      professionBySlug: { elektroniker, servicetechniker },
    });
    expect(hasError(r, "REGISTRY_PROFESSION_MISSING_IN_SUBARRAYS")).toBe(true);
  });

  it("6 – Related Slug existiert nicht", () => {
    const p: ProfessionContent = { ...elektroniker, internalLinks: { ...elektroniker.internalLinks, relatedProfessions: ["gibtsnicht"] } };
    const r = validateProfessionRegistry({
      professions: [p],
      publishedProfessions: [p],
      draftProfessions: [],
      professionBySlug: { elektroniker: p },
    });
    expect(hasError(r, "REGISTRY_RELATED_NOT_FOUND")).toBe(true);
  });

  it("7 – Published Profession verweist auf Draft", () => {
    const pubWithDraftRel: ProfessionContent = { ...elektroniker, internalLinks: { ...elektroniker.internalLinks, relatedProfessions: ["draft-ziel"] } };
    const r = validateProfessionRegistry({
      professions: [pubWithDraftRel, draftProf],
      publishedProfessions: [pubWithDraftRel],
      draftProfessions: [draftProf],
      professionBySlug: { elektroniker: pubWithDraftRel, "draft-ziel": draftProf },
    });
    expect(hasError(r, "REGISTRY_RELATED_NOT_PUBLISHED")).toBe(true);
  });

  it("8 – professionBySlug ist inkonsistent (Eintrag fehlt)", () => {
    const r = validateProfessionRegistry({
      professions: [elektroniker],
      publishedProfessions: [elektroniker],
      draftProfessions: [],
      professionBySlug: {}, // kein Eintrag
    });
    expect(hasError(r, "REGISTRY_BYSLUG_MISSING")).toBe(true);
  });
});
