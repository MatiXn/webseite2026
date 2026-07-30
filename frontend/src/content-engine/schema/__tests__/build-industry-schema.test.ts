import { describe, it, expect } from "vitest";
import { buildIndustrySchema } from "../build-industry-schema";
import { buildProfessionSchema } from "../build-profession-schema";
import type { IndustryContent } from "../../../content/industries/types";
import { elektroniker } from "../../../content/professions/elektroniker";
import { JOBS } from "../../../app/jobs/data";

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
    hero: { headline: "Fachkräfte für Automatisierungstechnik", intro: "Sachliche Einleitung.", primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" }, secondaryCta: { label: "Kontakt", href: "/kontakt" } },
    overview: { title: "Automatisierungstechnik", paragraphs: ["Absatz."] },
    focusAreas: [{ title: "Steuerungstechnik", note: "Einordnung." }],
    faq: [{ q: "Welche Fachkräfte?", a: "Technische Fachkräfte." }, { q: "Kostenlos?", a: "Ja." }],
    applicantCta: { title: "Bewerber", text: "Text.", primaryCta: { label: "Jobs", href: "/jobs" } },
    employerCta: { title: "Unternehmen", text: "Text.", primaryCta: { label: "Anfragen", href: "/technische-personalvermittlung" } },
    internalLinks: { parent: "/branchen", jobs: "/jobs", personalvermittlung: "/technische-personalvermittlung", kontakt: "/kontakt", relatedProfessions: [] },
    jobMatch: { category: ["it"], maxJobs: 6, fallback: "hint-and-joblist" },
    publication: { published: true, indexable: true, includeInSitemap: true, showInIndustryHub: true, showRelatedLinks: true },
    ...overrides,
  };
}

const visibleJobs = JOBS.slice(0, 3);
const graph = buildIndustrySchema(makeIndustry(), visibleJobs);
const nodes = graph["@graph"] as ReadonlyArray<Record<string, unknown>>;
const typeOf = (t: string) => nodes.find((n) => n["@type"] === t);

describe("buildIndustrySchema", () => {
  it("1 – @graph: CollectionPage, BreadcrumbList, FAQPage, ItemList (mit Jobs)", () => {
    expect(graph["@context"]).toBe("https://schema.org");
    expect(nodes.map((n) => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
  });

  it("2 – CollectionPage: Canonical, Title, publisher-@id, mainEntity→ItemList", () => {
    const cp = typeOf("CollectionPage") as Record<string, unknown>;
    expect(cp.url).toBe("https://www.phe-perm.de/branchen/automatisierungstechnik");
    expect(cp.name).toBe("Automatisierungstechnik | PHE-Perm");
    expect((cp.publisher as { "@id": string })["@id"]).toBe("https://www.phe-perm.de/#organization");
    expect((cp.mainEntity as { "@id": string })["@id"]).toBe("https://www.phe-perm.de/branchen/automatisierungstechnik#joblist");
  });

  it("3 – BreadcrumbList: Startseite → Branchen → Branche", () => {
    const bc = typeOf("BreadcrumbList") as { itemListElement: { name: string }[] };
    expect(bc.itemListElement.map((e) => e.name)).toEqual(["Startseite", "Branchen", "Automatisierungstechnik"]);
  });

  it("4 – FAQPage aus industry.faq", () => {
    const faq = typeOf("FAQPage") as { mainEntity: { name: string }[] };
    expect(faq.mainEntity.map((q) => q.name)).toEqual(["Welche Fachkräfte?", "Kostenlos?"]);
  });

  it("5 – ItemList aus den sichtbaren Jobs", () => {
    const list = typeOf("ItemList") as { numberOfItems: number; itemListElement: { name: string }[] };
    expect(list.numberOfItems).toBe(3);
    expect(list.itemListElement.map((e) => e.name)).toEqual(visibleJobs.map((j) => j.title));
  });

  it("6 – ohne Jobs: keine ItemList, CollectionPage ohne mainEntity", () => {
    const g = buildIndustrySchema(makeIndustry(), []);
    const ns = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
    expect(ns.map((n) => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage"]);
    const cp = ns.find((n) => n["@type"] === "CollectionPage") as Record<string, unknown>;
    expect("mainEntity" in cp).toBe(false);
  });

  it("7 – eindeutige @ids, keine Organization-Duplikation, kein JobPosting", () => {
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
    const json = JSON.stringify(graph);
    expect(json).not.toContain('"@type":"Organization"');
    expect(json).not.toContain("JobPosting");
  });

  it("8 – deterministisch (zwei Läufe tief gleich)", () => {
    expect(buildIndustrySchema(makeIndustry(), visibleJobs)).toEqual(buildIndustrySchema(makeIndustry(), visibleJobs));
  });

  it("9 – Profession-Schema unverändert (Regression)", () => {
    const pg = buildProfessionSchema(elektroniker, JOBS.slice(0, 2));
    const ptypes = (pg["@graph"] as ReadonlyArray<Record<string, unknown>>).map((n) => n["@type"]);
    expect(ptypes).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
  });
});
