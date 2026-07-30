import { describe, it, expect } from "vitest";
import { buildIndustryInternalLinks } from "../build-industry-internal-links";
import { buildProfessionInternalLinks } from "../build-profession-internal-links";
import { ContentInternalLinkError } from "../content-internal-link-error";
import { validateInternalLink } from "../validate-internal-link";
import type { InternalLinkRegistry } from "../types";
import type { IndustryContent } from "../../../content/industries/types";
import type { ProfessionContent } from "../../../content/professions/types";
import { elektroniker } from "../../../content/professions/elektroniker";
import { professionBySlug } from "../../../content/professions";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";

// synthetisches Draft-Profession-Ziel (alle realen Professionen sind published)
const draftProf: ProfessionContent = {
  ...elektroniker,
  slug: "draft-prof",
  canonicalPath: "/berufe/draft-prof",
  status: "draft",
  publication: { published: false, indexable: false, includeInSitemap: false, showInProfessionHub: false, showRelatedLinks: false },
};
const registry: InternalLinkRegistry = { professionBySlug: { ...professionBySlug, "draft-prof": draftProf } };
const jobMatches = matchJobsForProfession(JOBS, elektroniker).matches;

function makeIndustry(overrides: Partial<IndustryContent> = {}): IndustryContent {
  return {
    slug: "automatisierungstechnik",
    name: "Automatisierungstechnik",
    shortName: "Automatisierung",
    status: "published",
    parentSlug: "branchen",
    metadataTitle: "Automatisierungstechnik | PHE-Perm",
    metadataDescription: "Sachliche Beschreibung.",
    canonicalPath: "/branchen/automatisierungstechnik",
    primaryKeyword: "Automatisierungstechnik Personal",
    secondaryKeywords: [],
    searchIntent: "commercial",
    hero: { headline: "Fachkräfte für Automatisierungstechnik", intro: "Einleitung.", primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" }, secondaryCta: { label: "Kontakt", href: "/kontakt" } },
    overview: { title: "Automatisierungstechnik", paragraphs: ["Absatz."] },
    focusAreas: [{ title: "Steuerungstechnik", note: "Einordnung." }],
    faq: [{ q: "Frage?", a: "Antwort." }],
    applicantCta: { title: "Bewerber", text: "Text.", primaryCta: { label: "Jobs", href: "/jobs" } },
    employerCta: { title: "Unternehmen", text: "Text.", primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" } },
    internalLinks: { parent: "/branchen", jobs: "/jobs", personalvermittlung: "/technische-personalvermittlung", kontakt: "/kontakt", relatedProfessions: ["elektroniker", "mechatroniker"] },
    jobMatch: { category: ["it"], maxJobs: 6, fallback: "hint-and-joblist" },
    publication: { published: true, indexable: true, includeInSitemap: true, showInIndustryHub: true, showRelatedLinks: true },
    ...overrides,
  };
}

const build = (industry: IndustryContent, allowDraft = false) =>
  buildIndustryInternalLinks({ industry, professionRegistry: registry, jobMatches, allowDraft });

describe("buildIndustryInternalLinks", () => {
  it("1 – Breadcrumb Startseite → Branchen → Branche", () => {
    const r = build(makeIndustry());
    expect(r.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Branchen", "Automatisierungstechnik"]);
    expect(r.breadcrumbs.map((b) => b.href)).toEqual(["/", "/branchen", "/branchen/automatisierungstechnik"]);
  });

  it("2 – Core Links (Parent, Jobs, Service, Kontakt)", () => {
    const r = build(makeIndustry());
    expect(r.coreLinks.map((l) => l.type)).toEqual(["parent", "jobs", "service", "contact"]);
    expect(r.coreLinks.find((l) => l.type === "parent")?.href).toBe("/branchen");
  });

  it("3 – relevante published Professionen werden ausgegeben", () => {
    const r = build(makeIndustry());
    expect(r.relevantProfessionLinks.map((l) => l.href)).toEqual(["/berufe/elektroniker", "/berufe/mechatroniker"]);
  });

  it("4 – Draft-Profession wird entfernt", () => {
    const r = build(makeIndustry({ internalLinks: { parent: "/branchen", jobs: "/jobs", personalvermittlung: "/technische-personalvermittlung", kontakt: "/kontakt", relatedProfessions: ["elektroniker", "draft-prof"] } }));
    expect(r.relevantProfessionLinks.map((l) => l.professionSlug)).toEqual(["elektroniker"]);
  });

  it("5 – Job Links nur aus MatchResults (matched)", () => {
    const r = build(makeIndustry());
    expect(r.jobLinks.length).toBe(jobMatches.filter((m) => m.matched && !m.excluded).length);
    expect(r.jobLinks.every((l) => l.type === "job-detail")).toBe(true);
  });

  it("6 – keine ungültigen/numerischen/talente-Links, keine Duplikate", () => {
    const r = build(makeIndustry());
    const all = [...r.breadcrumbs, ...r.allLinks];
    for (const l of all) {
      expect(validateInternalLink(l).valid).toBe(true);
      expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
      expect(l.href.startsWith("/talente-finden")).toBe(false);
    }
    const hrefs = r.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(r.warnings).toHaveLength(0);
  });

  it("7 – Draft-Branche ohne allowDraft wird abgelehnt; mit allowDraft verarbeitbar", () => {
    const draft = makeIndustry({ status: "draft", publication: { published: false, indexable: false, includeInSitemap: false, showInIndustryHub: false, showRelatedLinks: false } });
    expect(() => build(draft)).toThrow(ContentInternalLinkError);
    const r = build(draft, true);
    expect(r.breadcrumbs.length).toBe(3);
    expect(r.coreLinks.length).toBe(4);
  });

  it("8 – invalide Branche wirft typisierten Fehler", () => {
    try {
      build(makeIndustry({ metadataTitle: "" }));
      throw new Error("kein Fehler");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentInternalLinkError);
      expect((e as ContentInternalLinkError).validationCodes).toContain("INDUSTRY_METADATA_TITLE_EMPTY");
    }
  });

  it("9 – Profession-Internal-Links unverändert (Regression)", () => {
    const r = buildProfessionInternalLinks({ profession: elektroniker, professionRegistry: registry, jobMatches });
    expect(r.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Berufe", "Elektroniker"]);
    expect(r.coreLinks.length).toBe(5);
  });
});
