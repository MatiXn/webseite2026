import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { validateCity, validateCityRegistry } from "../../../content-engine/validation";
import { buildCityMetadata } from "../../../content-engine/metadata";
import { buildCitySchema, buildProfessionSchema, buildIndustrySchema } from "../../../content-engine/schema";
import { buildCityInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { duesseldorf } from "../duesseldorf";
import { cities, publishedCities, draftCities, cityBySlug } from "../index";
import { buildDuesseldorfLocalBusinessSchema } from "../../../app/personalvermittlung/duesseldorf/duesseldorf-localbusiness";
import { professionBySlug, professions } from "../../professions";
import { industryBySlug, automatisierungstechnik } from "../../industries";
import { company } from "../../company";
import { JOBS } from "../../../app/jobs/data";

const routeSrc = readFileSync(new URL("../../../app/personalvermittlung/duesseldorf/page.tsx", import.meta.url), "utf8");

describe("Düsseldorf – Config", () => {
  it("1 – published, alle publication-Flags true, verifiedExperience true", () => {
    expect(duesseldorf.status).toBe("published");
    expect(duesseldorf.publication).toEqual({ published: true, indexable: true, includeInSitemap: true, showInCityHub: true, showRelatedLinks: true });
    expect(duesseldorf.local.verifiedExperience).toBe(true);
  });
  it("2 – slug + canonicalPath korrekt", () => {
    expect(duesseldorf.slug).toBe("duesseldorf");
    expect(duesseldorf.canonicalPath).toBe("/personalvermittlung/duesseldorf");
    expect(duesseldorf.parentSlug).toBe("personalvermittlung");
    expect(duesseldorf.type).toBe("city");
  });
  it("3 – validiert ohne Errors/Warnings", () => {
    const r = validateCity(duesseldorf);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
  });
  it("4 – keine verbotenen Claims, keine duplizierten NAP-Stammdaten in der Config", () => {
    const raw = JSON.stringify(duesseldorf);
    for (const bad of ["Marktführer", "garantiert", "Erfolgsquote", "100 %", "100%"]) expect(raw.includes(bad)).toBe(false);
    for (const nap of [company.phone, company.email, company.street, company.postalCode]) expect(raw.includes(nap), nap).toBe(false);
  });
});

describe("Düsseldorf – Registry", () => {
  it("publishedCities = [duesseldorf] (Düsseldorf einzige published Stadt), Lookup korrekt, Registry valide", () => {
    expect(publishedCities.map((c) => c.slug)).toEqual(["duesseldorf"]);
    expect(cities.some((c) => c.slug === "duesseldorf")).toBe(true);
    expect(cityBySlug["duesseldorf"]).toBe(duesseldorf);
    const r = validateCityRegistry({ cities, publishedCities, draftCities, cityBySlug });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
  });
});

describe("Düsseldorf – Metadata-Parität", () => {
  const m = buildCityMetadata(duesseldorf);
  it("Title/Description exakt", () => {
    expect((m.title as { absolute: string }).absolute).toBe("Personalvermittlung Düsseldorf | Technische Fachkräfte | PHE-Perm");
    expect(m.description).toBe("PHE-Perm unterstützt Unternehmen in Düsseldorf bei der Besetzung technischer Positionen durch persönliche Direktvermittlung. Qualität statt Massenvermittlung.");
  });
  it("Canonical + OG exakt, OG-Texte abweichend erhalten, kein Doppelbranding", () => {
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/personalvermittlung/duesseldorf");
    expect(m.openGraph?.url).toBe("https://www.phe-perm.de/personalvermittlung/duesseldorf");
    expect(m.openGraph?.title).toBe("Personalvermittlung Düsseldorf für technische Fachkräfte | PHE-Perm");
    expect(m.openGraph?.description).toBe("Persönliche Direktvermittlung technischer Fachkräfte für Unternehmen in Düsseldorf – Qualität statt Massenvermittlung.");
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
  it("index/follow", () => {
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });
});

describe("Düsseldorf – Schema-Parität", () => {
  const matches = matchJobsForConfig(JOBS, duesseldorf.jobMatch, duesseldorf.slug).matches;
  const visibleJobs = matches.map((mm) => mm.job);
  it("0 lokale Job-Treffer (kein unscharfes Stadt-Matching)", () => {
    expect(visibleJobs).toHaveLength(0);
  });
  it("City-Graph: CollectionPage/BreadcrumbList/Service/FAQPage; genau ein Service; kein JobPosting; kein LocalBusiness; eindeutige @ids", () => {
    const g = buildCitySchema(duesseldorf, visibleJobs);
    const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
    const types = nodes.map((n) => n["@type"]);
    expect(types).toEqual(["CollectionPage", "BreadcrumbList", "Service", "FAQPage"]);
    expect(types.filter((t) => t === "Service")).toHaveLength(1);
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain("LocalBusiness");
    expect(json).not.toContain("ItemList");
    const service = nodes.find((n) => n["@type"] === "Service") as Record<string, unknown>;
    expect(service.areaServed).toEqual({ "@type": "City", name: "Düsseldorf" });
    expect(service.provider).toEqual({ "@id": company.organizationId });
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("Düsseldorf-LocalBusiness: @id = globale Organization, NAP/Öffnungszeiten aus company, kein geo, keine Reviews/Rating", () => {
    const lb = buildDuesseldorfLocalBusinessSchema();
    expect(lb["@type"]).toBe("LocalBusiness");
    expect(lb["@id"]).toBe(company.organizationId);
    expect(lb.name).toBe(company.legalName);
    expect(lb.telephone).toBe(company.phone);
    expect(lb.email).toBe(company.email);
    expect(lb.address).toEqual({ "@type": "PostalAddress", streetAddress: company.street, addressLocality: company.city, postalCode: company.postalCode, addressCountry: company.country });
    expect(lb.areaServed).toEqual({ "@type": "City", name: "Düsseldorf" });
    expect(lb.openingHoursSpecification).toEqual({ "@type": "OpeningHoursSpecification", dayOfWeek: [...company.openingHours.days], opens: company.openingHours.opens, closes: company.openingHours.closes });
    expect(lb.geo).toBeUndefined();
    const json = JSON.stringify(lb);
    expect(json).not.toContain("AggregateRating");
    expect(json).not.toContain("Review");
  });
  it("Regression: Profession-Schema weiterhin ohne Service; Industry-Schema ohne Service", () => {
    for (const p of professions) {
      expect(JSON.stringify(buildProfessionSchema(p, []))).not.toContain('"@type":"Service"');
    }
    expect(JSON.stringify(buildIndustrySchema(automatisierungstechnik, []))).not.toContain('"@type":"Service"');
  });
});

describe("Düsseldorf – Internal Links", () => {
  const links = buildCityInternalLinks({ city: duesseldorf, registries: { professionBySlug, industryBySlug, cityBySlug }, jobMatches: [] });
  it("Breadcrumb Startseite → Personalvermittlung → Düsseldorf", () => {
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Personalvermittlung", "Düsseldorf"]);
    expect(links.breadcrumbs[1].href).toBe("/technische-personalvermittlung");
    expect(links.breadcrumbs[2].href).toBe("/personalvermittlung/duesseldorf");
  });
  it("relatedCities leer; keine numerischen/Draft-/Self-/Doppel-Links; 0 Warnings", () => {
    expect(links.relatedCityLinks).toEqual([]);
    for (const l of links.allLinks) {
      expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
      expect(l.href).not.toBe(duesseldorf.canonicalPath);
    }
    const hrefs = links.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(links.warnings).toHaveLength(0);
  });
});

describe("Düsseldorf – Route dünn (Quellinspektion)", () => {
  it("nutzt buildCityMetadata + CityPageTemplate + LocalBusiness-Sonderfall", () => {
    expect(routeSrc).toContain("buildCityMetadata(duesseldorf)");
    expect(routeSrc).toContain("<CityPageTemplate city={duesseldorf}");
    expect(routeSrc).toContain("buildDuesseldorfLocalBusinessSchema()");
  });
  it("keine lokale Content-/FAQ-/Job-/Metadata-Duplizierung in der Route", () => {
    expect(routeSrc.includes("const FAQ")).toBe(false);
    expect(routeSrc.includes("faqSchema")).toBe(false);
    expect(routeSrc.includes("serviceSchema")).toBe(false);
    expect(routeSrc.includes("mainEntity")).toBe(false);
    expect(routeSrc.includes("export const metadata: Metadata = buildCityMetadata")).toBe(true);
  });
});
