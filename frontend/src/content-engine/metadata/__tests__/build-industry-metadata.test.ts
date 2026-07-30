import { describe, it, expect } from "vitest";
import { buildIndustryMetadata } from "../build-industry-metadata";
import { buildProfessionMetadata } from "../build-profession-metadata";
import { ContentMetadataError } from "../content-metadata-error";
import { SITE_URL } from "../constants";
import type { IndustryContent } from "../../../content/industries/types";
import { elektroniker } from "../../../content/professions/elektroniker";

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
    secondaryKeywords: ["SPS Fachkräfte"],
    searchIntent: "commercial",
    hero: { headline: "Fachkräfte für Automatisierungstechnik", intro: "Sachliche Einleitung.", primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" }, secondaryCta: { label: "Kontakt", href: "/kontakt" } },
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
const draftPub = { published: false, indexable: false, includeInSitemap: false, showInIndustryHub: false, showRelatedLinks: false } as const;

describe("buildIndustryMetadata", () => {
  it("1 – published/indexable → index/follow", () => {
    expect(buildIndustryMetadata(makeIndustry()).robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });
  it("2 – draft → noindex/nofollow", () => {
    const m = buildIndustryMetadata(makeIndustry({ status: "draft", publication: draftPub }));
    expect(m.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
  });
  it("3 – exakter Canonical", () => {
    expect(buildIndustryMetadata(makeIndustry()).alternates?.canonical).toBe(`${SITE_URL}/branchen/automatisierungstechnik`);
  });
  it("4 – OG-URL = Canonical", () => {
    const m = buildIndustryMetadata(makeIndustry());
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });
  it("5 – kein doppeltes Marken-Suffix", () => {
    const t = (buildIndustryMetadata(makeIndustry()).title as { absolute: string }).absolute;
    expect(t).toEqual("Automatisierungstechnik | PHE-Perm");
  });
  it("6 – invalide Branche wirft ContentMetadataError", () => {
    try {
      buildIndustryMetadata(makeIndustry({ metadataTitle: "" }));
      throw new Error("kein Fehler");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentMetadataError);
      expect((e as ContentMetadataError).validationCodes).toContain("INDUSTRY_METADATA_TITLE_EMPTY");
    }
  });
  it("7 – Profession-Metadata unverändert (Regression)", () => {
    expect(buildProfessionMetadata(elektroniker).title).toEqual({ absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" });
  });
});
