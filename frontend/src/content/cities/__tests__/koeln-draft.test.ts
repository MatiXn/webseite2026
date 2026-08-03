import { describe, it, expect } from "vitest";
import { validateCity, validateCityRegistry } from "../../../content-engine/validation";
import { buildCityMetadata } from "../../../content-engine/metadata";
import { buildCitySchema } from "../../../content-engine/schema";
import { buildCityInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { koeln } from "../koeln";
import { duesseldorf } from "../duesseldorf";
import { cities, publishedCities, draftCities, cityBySlug } from "../index";
import { professionBySlug } from "../../professions";
import { industryBySlug } from "../../industries";
import { company } from "../../company";
import sitemap from "../../../app/sitemap";
import { JOBS } from "../../../app/jobs/data";

const registries = { professionBySlug, industryBySlug, cityBySlug };

describe("Köln – Config (Draft)", () => {
  it("1 – status draft, alle publication-Flags false, verifiedExperience true", () => {
    expect(koeln.status).toBe("draft");
    expect(koeln.publication).toEqual({ published: false, indexable: false, includeInSitemap: false, showInCityHub: false, showRelatedLinks: false });
    expect(koeln.local.verifiedExperience).toBe(true);
  });
  it("2 – slug/canonical korrekt", () => {
    expect(koeln.slug).toBe("koeln");
    expect(koeln.canonicalPath).toBe("/personalvermittlung/koeln");
  });
  it("3 – validiert ohne Errors/Warnings", () => {
    const r = validateCity(koeln);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
  });
  it("4 – keine Adresse/Geo/Öffnungszeiten/NAP, kein LocalBusiness, keine verbotenen Claims/Zahlen", () => {
    const raw = JSON.stringify(koeln);
    for (const nap of [company.phone, company.email, company.street, company.postalCode]) expect(raw.includes(nap), nap).toBe(false);
    for (const bad of ["LocalBusiness", "geo", "openingHours", "Marktführer", "garantiert", "Erfolgsquote"]) expect(raw.includes(bad), bad).toBe(false);
    expect(/\b\d+\s*(Kunden|Kandidaten|Vermittlungen|Unternehmen)/i.test(raw)).toBe(false);
  });
  it("5 – relevantProfessions nur published + kuratiert (ohne sps-automatisierung)", () => {
    expect(koeln.relevantProfessions).toEqual(["elektroniker", "mechatroniker", "servicetechniker"]);
    for (const s of koeln.relevantProfessions) expect(professionBySlug[s]?.publication.published, s).toBe(true);
    expect(koeln.relevantProfessions).not.toContain("sps-automatisierung");
  });
  it("6 – relevantIndustries nur published", () => {
    expect(koeln.relevantIndustries).toEqual(["elektrotechnik", "automatisierungstechnik"]);
    for (const s of koeln.relevantIndustries) expect(industryBySlug[s]?.publication.published, s).toBe(true);
  });
  it("7 – FAQ stellt Nicht-Standort in Köln klar", () => {
    const buero = koeln.faq.find((f) => f.q.includes("Büro"));
    expect(buero?.a).toContain("Düsseldorf");
    expect(buero?.a).toContain("Standort");
    expect(buero?.a).toContain("nicht");
  });
});

describe("Köln – Registry (Draft-Staging)", () => {
  it("cities=2, publishedCities=[duesseldorf], draftCities=[koeln], Lookup korrekt, valide", () => {
    expect(cities.map((c) => c.slug).sort()).toEqual(["duesseldorf", "koeln"]);
    expect(publishedCities.map((c) => c.slug)).toEqual(["duesseldorf"]);
    expect(draftCities.map((c) => c.slug)).toEqual(["koeln"]);
    expect(cityBySlug["koeln"]).toBe(koeln);
    expect(cityBySlug["duesseldorf"]).toBe(duesseldorf);
    const r = validateCityRegistry({ cities, publishedCities, draftCities, cityBySlug });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });
  it("Düsseldorf bleibt published + unverändert am Status", () => {
    expect(duesseldorf.status).toBe("published");
    expect(duesseldorf.publication.published).toBe(true);
  });
});

describe("Köln – Metadata (draft → noindex)", () => {
  const m = buildCityMetadata(koeln);
  it("noindex/nofollow, Canonical + OG korrekt, kein Doppelbranding, keine Adresse", () => {
    expect(m.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/personalvermittlung/koeln");
    expect(m.openGraph?.url).toBe("https://www.phe-perm.de/personalvermittlung/koeln");
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
    expect(JSON.stringify(m).includes(company.street)).toBe(false);
  });
});

describe("Köln – Schema", () => {
  const g = buildCitySchema(koeln, []);
  const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
  it("CollectionPage/BreadcrumbList/Service/FAQPage; kein LocalBusiness/Organization/Adresse/Geo/Öffnungszeiten/JobPosting/ItemList", () => {
    expect(nodes.map((n) => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "Service", "FAQPage"]);
    const json = JSON.stringify(g);
    for (const forbidden of ["LocalBusiness", '"@type":"Organization"', "PostalAddress", "geo", "OpeningHoursSpecification", "JobPosting", "ItemList"]) {
      expect(json.includes(forbidden), forbidden).toBe(false);
    }
    const service = nodes.find((n) => n["@type"] === "Service") as Record<string, unknown>;
    expect(service.areaServed).toEqual({ "@type": "City", name: "Köln" });
    expect(service.provider).toEqual({ "@id": company.organizationId });
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Köln – Internal Links", () => {
  it("Draft-Guard: ohne allowDraft wirft, mit allowDraft nicht", () => {
    expect(() => buildCityInternalLinks({ city: koeln, registries, jobMatches: [] })).toThrow();
    expect(() => buildCityInternalLinks({ city: koeln, registries, jobMatches: [], allowDraft: true })).not.toThrow();
  });
  it("Breadcrumb + nur published Prof/Ind + relatedCity Düsseldorf; keine numerischen/Self-/Doppel-Links", () => {
    const links = buildCityInternalLinks({ city: koeln, registries, jobMatches: [], allowDraft: true });
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Personalvermittlung", "Köln"]);
    expect(links.relevantProfessionLinks.map((l) => l.professionSlug)).toEqual(["elektroniker", "mechatroniker", "servicetechniker"]);
    expect(links.relevantIndustryLinks.map((l) => l.href)).toEqual(["/branchen/elektrotechnik", "/branchen/automatisierungstechnik"]);
    expect(links.relatedCityLinks.map((l) => l.href)).toEqual(["/personalvermittlung/duesseldorf"]);
    for (const l of links.allLinks) {
      expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
      expect(l.href).not.toBe(koeln.canonicalPath);
    }
    const hrefs = links.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(links.warnings).toHaveLength(0);
  });
});

describe("Köln – Matching (0 Treffer, keine False Positives)", () => {
  const r = matchJobsForConfig(JOBS, koeln.jobMatch, koeln.slug);
  it("0 Treffer, 0 Ausschlüsse (echte Köln-Jobs 13/21 + FP-Risiko 7/9 alle NICHT gematcht)", () => {
    expect(r.totalMatched).toBe(0);
    expect(r.matches).toHaveLength(0);
    expect(r.excludedCount).toBe(0);
    for (const id of ["13", "21", "7", "9"]) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForConfig([j], koeln.jobMatch, "x").totalMatched, id).toBe(0);
    }
  });
});

describe("Köln – Unsichtbarkeit", () => {
  it("nicht in publishedCities → keine Route/Generierung", () => {
    expect(publishedCities).not.toContain(koeln);
    expect(publishedCities.some((c) => c.slug === "koeln")).toBe(false);
  });
  it("nicht in der Sitemap", () => {
    const urls = sitemap().map((e) => String(e.url));
    expect(urls).not.toContain("https://www.phe-perm.de/personalvermittlung/koeln");
    expect(urls).toContain("https://www.phe-perm.de/personalvermittlung/duesseldorf");
  });
});
