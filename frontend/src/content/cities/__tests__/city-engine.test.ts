import { describe, it, expect } from "vitest";
import {
  validateCity,
  validateCityRegistry,
} from "../../../content-engine/validation";
import { buildCityMetadata } from "../../../content-engine/metadata";
import { buildCitySchema } from "../../../content-engine/schema";
import { buildCityInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { cities, publishedCities, draftCities, cityBySlug } from "../index";
import type { CityContent } from "../types";
import { professionBySlug } from "../../professions";
import { industryBySlug } from "../../industries";
import { company } from "../../company";
import { JOBS } from "../../../app/jobs/data";

// ---------- Synthetische Fixtures ----------

function makeValidCity(overrides: Partial<CityContent> = {}): CityContent {
  const base: CityContent = {
    slug: "musterstadt",
    name: "Musterstadt",
    shortName: "Musterstadt",
    type: "city",
    status: "published",
    parentSlug: "personalvermittlung",
    canonicalPath: "/personalvermittlung/musterstadt",
    local: {
      cityName: "Musterstadt",
      federalState: "Nordrhein-Westfalen",
      country: "DE",
      areaServed: "Musterstadt und Umgebung",
      nearbyCities: ["Nachbarstadt"],
      nearbyRegions: ["Musterland"],
      serviceRadiusText: "im regionalen Umkreis",
    },
    metadataTitle: "Personalvermittlung Musterstadt | PHE-Perm",
    metadataDescription: "PHE-Perm vermittelt technische Fach- und Führungskräfte für Unternehmen in Musterstadt – direkt in Festanstellung.",
    primaryKeyword: "Personalvermittlung Musterstadt",
    secondaryKeywords: ["Technische Fachkräfte Musterstadt"],
    searchIntent: "commercial",
    hero: {
      eyebrow: "Für Unternehmen · Musterstadt",
      headline: "Personalvermittlung Musterstadt für technische Fachkräfte",
      intro: "Wir vermitteln technische Fach- und Führungskräfte für Unternehmen in Musterstadt – persönlich und in Festanstellung.",
      primaryCta: { label: "Fachkraft anfragen", href: "/technische-personalvermittlung" },
      secondaryCta: { label: "Kontakt", href: "/kontakt" },
    },
    overview: {
      title: "Personalvermittlung in Musterstadt",
      paragraphs: ["Musterstadt ist ein technisch geprägter Wirtschaftsstandort mit Bedarf an qualifizierten Fachkräften."],
    },
    localExperience: {
      title: "Der Markt in Musterstadt",
      // verifiedExperience=false → Text darf KEINE realisierte lokale Vermittlung behaupten.
      paragraphs: ["Der regionale Arbeitsmarkt fragt technische Qualifikationen nach; wir unterstützen Unternehmen bei der Besetzung."],
      verifiedExperience: false,
    },
    relevantProfessions: ["elektroniker"],
    relevantIndustries: ["automatisierungstechnik", "elektrotechnik"],
    jobMatch: { category: ["elektro"], maxJobs: 8, fallback: "hint-and-joblist" },
    employerValue: {
      title: "Vorteile für Unternehmen",
      text: "Persönliche Direktvermittlung statt Massenprozess.",
      bulletPoints: ["Spezialisierung auf technische Berufe", "Vorqualifizierte Kandidaten"],
    },
    candidateValue: {
      title: "Vorteile für Kandidaten",
      text: "Passende Positionen statt anonymer Bewerbungsflut.",
      bulletPoints: ["Persönliche Beratung", "Festanstellung ohne Zeitarbeit"],
    },
    faq: [
      { q: "Vermittelt PHE-Perm in Musterstadt?", a: "Wir unterstützen Unternehmen in Musterstadt und der Region bei technischen Besetzungen." },
      { q: "Ausschließlich Festanstellung?", a: "Ja, keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
    ],
    internalLinks: {
      parent: "/technische-personalvermittlung",
      jobs: "/jobs",
      professions: "/berufe",
      industries: "/branchen",
      personalvermittlung: "/technische-personalvermittlung",
      contact: "/kontakt",
      relatedCities: [],
    },
    publication: { published: true, indexable: true, includeInSitemap: true, showInCityHub: true, showRelatedLinks: true },
  };
  return { ...base, ...overrides };
}

const DRAFT_PUBLICATION = { published: false, indexable: false, includeInSitemap: false, showInCityHub: false, showRelatedLinks: false } as const;

function makeValidDraftCity(overrides: Partial<CityContent> = {}): CityContent {
  return makeValidCity({ slug: "entwurfstadt", name: "Entwurfstadt", shortName: "Entwurfstadt", canonicalPath: "/personalvermittlung/entwurfstadt", status: "draft", publication: { ...DRAFT_PUBLICATION }, local: { cityName: "Entwurfstadt", federalState: "Bayern", country: "DE", areaServed: "Entwurfstadt" }, ...overrides });
}

const matches = matchJobsForConfig(JOBS, makeValidCity().jobMatch, "musterstadt").matches;
const visibleJobs = matches.map((m) => m.job);
const registries = { professionBySlug, industryBySlug, cityBySlug: {} as Record<string, CityContent | undefined> };

// ---------- Registry (leer, 010A) ----------

describe("City-Registry (leer in 010A)", () => {
  it("1 – Arrays leer, valide typisiert", () => {
    expect(cities).toEqual([]);
    expect(publishedCities).toEqual([]);
    expect(draftCities).toEqual([]);
  });
  it("2 – leere Registry validiert ohne Fehler", () => {
    const r = validateCityRegistry({ cities, publishedCities, draftCities, cityBySlug });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });
  it("3 – Lookup unbekannt ist undefined", () => {
    expect(cityBySlug["gibtsnicht"]).toBeUndefined();
  });
});

// ---------- Validator ----------

describe("City-Validator (synthetische Fixtures)", () => {
  it("gültige published City ist valide, 0 Warnings", () => {
    const r = validateCity(makeValidCity());
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings).toHaveLength(0);
  });
  it("gültige draft City ist valide", () => {
    const r = validateCity(makeValidDraftCity());
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });
  const cases: [string, Partial<CityContent>, string][] = [
    ["ungültiger Slug", { slug: "Muster Stadt", canonicalPath: "/personalvermittlung/Muster Stadt" }, "CITY_SLUG_INVALID"],
    ["falscher canonicalPath (Prefix)", { canonicalPath: "/branchen/musterstadt" }, "CITY_CANONICAL_INVALID"],
    ["canonicalPath passt nicht zum Slug", { canonicalPath: "/personalvermittlung/andere" }, "CITY_CANONICAL_MISMATCH"],
    ["inkonsistente Publication (published, nicht indexable)", { publication: { published: true, indexable: false, includeInSitemap: true, showInCityHub: true, showRelatedLinks: true } }, "CITY_PUBLISHED_NOT_INDEXABLE"],
    ["draft aber indexable", { status: "draft", publication: { published: false, indexable: true, includeInSitemap: false, showInCityHub: false, showRelatedLinks: false } }, "CITY_DRAFT_INDEXABLE"],
    ["fehlendes cityName", { local: { cityName: "", federalState: "NRW", country: "DE", areaServed: "X" } }, "CITY_CITYNAME_EMPTY"],
    ["fehlendes federalState", { local: { cityName: "Musterstadt", federalState: "", country: "DE", areaServed: "X" } }, "CITY_FEDERALSTATE_EMPTY"],
    ["Self-Related-City", { internalLinks: { parent: "/technische-personalvermittlung", jobs: "/jobs", professions: "/berufe", industries: "/branchen", personalvermittlung: "/technische-personalvermittlung", contact: "/kontakt", relatedCities: ["musterstadt"] } }, "CITY_RELATED_SELF_REFERENCE"],
    ["Doppelbranding im Title", { metadataTitle: "PHE-Perm Personalvermittlung Musterstadt | PHE-Perm" }, "CITY_METADATA_DOUBLE_BRANDING"],
    ["verbotener Claim", { overview: { title: "Wir sind Marktführer", paragraphs: ["Text"] } }, "CITY_FORBIDDEN_CLAIM"],
    ["erfundene Zahl", { overview: { title: "Überblick", paragraphs: ["Wir haben über 100 Kandidaten vermittelt."] } }, "CITY_FORBIDDEN_NUMBER"],
    ["numerische Job-URL im Link", { internalLinks: { parent: "/technische-personalvermittlung", jobs: "/jobs/7", professions: "/berufe", industries: "/branchen", personalvermittlung: "/technische-personalvermittlung", contact: "/kontakt", relatedCities: [] } }, "CITY_LINK_NUMERIC_JOB"],
    ["unverifizierte lokale Behauptung", { localExperience: { title: "Erfahrung", paragraphs: ["In Musterstadt haben wir bereits erfolgreich vermittelt."], verifiedExperience: false } }, "CITY_UNVERIFIED_LOCAL_CLAIM"],
  ];
  for (const [label, override, expectedCode] of cases) {
    it(`erkennt: ${label} → ${expectedCode}`, () => {
      const r = validateCity(makeValidCity(override));
      expect(r.valid).toBe(false);
      expect(r.errors.map((e) => e.code)).toContain(expectedCode);
    });
  }
  it("verifiedExperience=true erlaubt lokale Vermittlungsaussage", () => {
    const r = validateCity(makeValidCity({ localExperience: { title: "Erfahrung", paragraphs: ["In Musterstadt haben wir bereits erfolgreich vermittelt."], verifiedExperience: true } }));
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });
});

describe("City-Registry-Validator (synthetisch)", () => {
  it("Duplicate Slug + Duplicate Canonical erkannt", () => {
    const a = makeValidCity();
    const b = makeValidCity({ name: "Andere" }); // gleicher Slug + Canonical
    const r = validateCityRegistry({ cities: [a, b], publishedCities: [a, b], draftCities: [], cityBySlug: { musterstadt: a } });
    expect(r.errors.map((e) => e.code)).toEqual(expect.arrayContaining(["REGISTRY_CITY_DUPLICATE_SLUG", "REGISTRY_CITY_DUPLICATE_CANONICAL"]));
  });
  it("falscher Registry-Eintrag (bySlug mismatch) erkannt", () => {
    const a = makeValidCity();
    const r = validateCityRegistry({ cities: [a], publishedCities: [a], draftCities: [], cityBySlug: { musterstadt: makeValidCity() } });
    expect(r.errors.map((e) => e.code)).toContain("REGISTRY_CITY_BYSLUG_MISMATCH");
  });
  it("published City mit Draft-Related-City erkannt", () => {
    const draft = makeValidDraftCity();
    const pub = makeValidCity({ internalLinks: { parent: "/technische-personalvermittlung", jobs: "/jobs", professions: "/berufe", industries: "/branchen", personalvermittlung: "/technische-personalvermittlung", contact: "/kontakt", relatedCities: ["entwurfstadt"] } });
    const r = validateCityRegistry({ cities: [pub, draft], publishedCities: [pub], draftCities: [draft], cityBySlug: { musterstadt: pub, entwurfstadt: draft } });
    expect(r.errors.map((e) => e.code)).toContain("REGISTRY_CITY_RELATED_NOT_PUBLISHED");
  });
});

// ---------- Metadata ----------

describe("City-Metadata-Composer", () => {
  it("published → index/follow, Canonical + OG korrekt, kein Doppelbranding", () => {
    const m = buildCityMetadata(makeValidCity());
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/personalvermittlung/musterstadt");
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
  it("draft → noindex/nofollow", () => {
    const m = buildCityMetadata(makeValidDraftCity());
    expect(m.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
  });
});

// ---------- Schema ----------

describe("City-Schema-Composer", () => {
  it("erwartete Knoten inkl. Service; ItemList bei Jobs; kein JobPosting; eindeutige @ids", () => {
    const g = buildCitySchema(makeValidCity(), visibleJobs);
    const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
    const types = nodes.map((n) => n["@type"]);
    expect(types).toEqual(expect.arrayContaining(["CollectionPage", "BreadcrumbList", "Service", "FAQPage", "ItemList"]));
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain("LocalBusiness");
    expect(json).not.toContain("AggregateRating");
    expect(json).not.toContain("Review");
    // Organization nur als @id-Referenz, kein voller Organization-Knoten
    expect(json).not.toContain('"@type":"Organization"');
    expect(json).toContain(company.organizationId);
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("Service trägt areaServed aus der Config + provider-Referenz", () => {
    const g = buildCitySchema(makeValidCity(), visibleJobs);
    const service = (g["@graph"] as Record<string, unknown>[]).find((n) => n["@type"] === "Service") as Record<string, unknown>;
    expect(service.areaServed).toEqual({ "@type": "City", name: "Musterstadt" });
    expect(service.provider).toEqual({ "@id": company.organizationId });
  });
  it("ItemList = exakt die sichtbaren Jobs", () => {
    const g = buildCitySchema(makeValidCity(), visibleJobs);
    const list = (g["@graph"] as Record<string, unknown>[]).find((n) => n["@type"] === "ItemList") as { numberOfItems: number };
    expect(list.numberOfItems).toBe(visibleJobs.length);
  });
  it("ohne Jobs: keine ItemList, kein mainEntity", () => {
    const g = buildCitySchema(makeValidCity(), []);
    const types = (g["@graph"] as Record<string, unknown>[]).map((n) => n["@type"]);
    expect(types).not.toContain("ItemList");
    const collection = (g["@graph"] as Record<string, unknown>[]).find((n) => n["@type"] === "CollectionPage") as Record<string, unknown>;
    expect(collection.mainEntity).toBeUndefined();
  });
});

// ---------- Internal Links ----------

describe("City-Internal-Links-Composer", () => {
  it("Breadcrumb Startseite → Personalvermittlung → Stadt", () => {
    const r = buildCityInternalLinks({ city: makeValidCity(), registries, jobMatches: matches });
    expect(r.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Personalvermittlung", "Musterstadt"]);
    expect(r.breadcrumbs[1].href).toBe("/technische-personalvermittlung");
  });
  it("relevante Professionen/Branchen nur published; Job-Links kanonisch; keine numerischen URLs; keine Duplikate; 0 Warnings", () => {
    const r = buildCityInternalLinks({ city: makeValidCity(), registries, jobMatches: matches });
    expect(r.relevantProfessionLinks.map((l) => l.professionSlug)).toEqual(["elektroniker"]);
    expect(r.relevantIndustryLinks.map((l) => l.href)).toEqual(["/branchen/automatisierungstechnik", "/branchen/elektrotechnik"]);
    for (const l of r.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
    const hrefs = r.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(r.warnings).toHaveLength(0);
  });
  it("Related Cities nur published; Draft-Ziel entfernt (Self ist bereits Validator-verboten)", () => {
    const other = makeValidCity({ slug: "nachbarstadt", name: "Nachbarstadt", canonicalPath: "/personalvermittlung/nachbarstadt" });
    const draft = makeValidDraftCity();
    const reg = { professionBySlug, industryBySlug, cityBySlug: { nachbarstadt: other, entwurfstadt: draft } as Record<string, CityContent | undefined> };
    const city = makeValidCity({ internalLinks: { parent: "/technische-personalvermittlung", jobs: "/jobs", professions: "/berufe", industries: "/branchen", personalvermittlung: "/technische-personalvermittlung", contact: "/kontakt", relatedCities: ["nachbarstadt", "entwurfstadt"] } });
    const r = buildCityInternalLinks({ city, registries: reg, jobMatches: [] });
    expect(r.relatedCityLinks.map((l) => l.href)).toEqual(["/personalvermittlung/nachbarstadt"]);
  });
  it("Draft-Stadt ohne allowDraft wirft; mit allowDraft nicht", () => {
    expect(() => buildCityInternalLinks({ city: makeValidDraftCity(), registries, jobMatches: [] })).toThrow();
    expect(() => buildCityInternalLinks({ city: makeValidDraftCity(), registries, jobMatches: [], allowDraft: true })).not.toThrow();
  });
  it("deterministisch", () => {
    const a = buildCityInternalLinks({ city: makeValidCity(), registries, jobMatches: matches });
    const b = buildCityInternalLinks({ city: makeValidCity(), registries, jobMatches: matches });
    expect(a.allLinks.map((l) => l.href)).toEqual(b.allLinks.map((l) => l.href));
  });
});
