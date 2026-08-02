import { describe, it, expect } from "vitest";
import { validateIndustry, validateIndustryRegistry } from "../../../content-engine/validation";
import { matchJobsForConfig } from "../../../content-engine/job-matching";
import { buildIndustryMetadata } from "../../../content-engine/metadata";
import { buildIndustrySchema } from "../../../content-engine/schema";
import { buildIndustryInternalLinks } from "../../../content-engine/internal-links";
import { elektrotechnik } from "../elektrotechnik";
import { automatisierungstechnik } from "../automatisierungstechnik";
import { industries, publishedIndustries, draftIndustries, industryBySlug } from "../index";
import { professionBySlug } from "../../professions";
import { company } from "../../company";
import sitemap from "../../../app/sitemap";
import { generateStaticParams } from "../../../app/branchen/[slug]/page";
import { JOBS } from "../../../app/jobs/data";

// Erwartete Elektrotechnik-Treffer = exakt die 15 Jobs der Kategorie "elektro".
const EXPECTED_ELEKTRO_IDS = ["1", "3", "4", "5", "6", "8", "9", "11", "12", "13", "16", "17", "22", "23", "24"];
// Bewusst NICHT Elektrotechnik (Kälte/Mechatronik, reine SPS-Stelle, SHK).
const EXPECTED_NON_MATCH_IDS = ["2", "7", "10", "14", "15", "18", "19", "20", "21", "25"];
// Deterministische sichtbare Reihenfolge bei maxJobs=8 (dokumentiert, EPIC 009B).
const EXPECTED_VISIBLE_IDS = ["1", "11", "12", "13", "16", "17", "22", "23"];

const capped = matchJobsForConfig(JOBS, elektrotechnik.jobMatch, elektrotechnik.slug);
const visibleJobs = capped.matches.map((m) => m.job);

describe("Elektrotechnik – Config (published, EPIC 009B)", () => {
  it("1 – validiert ohne Errors/Warnings", () => {
    const r = validateIndustry(elektrotechnik);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
  });
  it("2 – status published + alle publication-Flags true", () => {
    expect(elektrotechnik.status).toBe("published");
    expect(elektrotechnik.publication).toEqual({
      published: true,
      indexable: true,
      includeInSitemap: true,
      showInIndustryHub: true,
      showRelatedLinks: true,
    });
  });
  it("3 – slug + eindeutiger canonicalPath korrekt", () => {
    expect(elektrotechnik.slug).toBe("elektrotechnik");
    expect(elektrotechnik.canonicalPath).toBe("/branchen/elektrotechnik");
    expect(elektrotechnik.canonicalPath).not.toBe(automatisierungstechnik.canonicalPath);
    expect(elektrotechnik.slug).not.toBe(automatisierungstechnik.slug);
  });
  it("4 – Pflichtinhalte gefüllt (Hero, Überblick, Fokusbereiche, FAQ)", () => {
    expect(elektrotechnik.hero.headline.length).toBeGreaterThan(0);
    expect(elektrotechnik.overview.paragraphs.length).toBeGreaterThan(0);
    expect(elektrotechnik.focusAreas.length).toBeGreaterThanOrEqual(4);
    expect(elektrotechnik.faq.length).toBeGreaterThanOrEqual(5);
  });
  it("5 – relatedProfessions exakt [elektroniker, servicetechniker, sps-automatisierung], alle published", () => {
    expect(elektrotechnik.internalLinks.relatedProfessions).toEqual(["elektroniker", "servicetechniker", "sps-automatisierung"]);
    for (const slug of elektrotechnik.internalLinks.relatedProfessions) {
      expect(professionBySlug[slug]?.publication.published, slug).toBe(true);
    }
  });
  it("6 – keine verbotenen Claims, keine erfundenen NAP-/Firmenstammdaten", () => {
    const lower = JSON.stringify(elektrotechnik).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "100 %", "100%", "nummer 1", "€", "gehalt"]) {
      expect(lower.includes(bad), bad).toBe(false);
    }
    const raw = JSON.stringify(elektrotechnik);
    for (const nap of [company.email, company.phone, company.street, company.postalCode]) {
      expect(raw.includes(nap)).toBe(false);
    }
  });
});

describe("Elektrotechnik – Registry (beide published)", () => {
  it("1 – industries = 2, publishedIndustries = 2, draftIndustries = 0", () => {
    expect(industries.length).toBe(2);
    expect(publishedIndustries.length).toBe(2);
    expect(draftIndustries.length).toBe(0);
  });
  it("2 – Reihenfolge in publishedIndustries = [automatisierungstechnik, elektrotechnik]", () => {
    expect(publishedIndustries.map((i) => i.slug)).toEqual(["automatisierungstechnik", "elektrotechnik"]);
  });
  it("3 – Lookups korrekt, unbekannter Slug undefined", () => {
    expect(industryBySlug["elektrotechnik"]).toBe(elektrotechnik);
    expect(industryBySlug["automatisierungstechnik"]).toBe(automatisierungstechnik);
    expect(industryBySlug["gibtsnicht"]).toBeUndefined();
  });
  it("4 – Registry valide, eindeutige Slugs + Canonicals", () => {
    const r = validateIndustryRegistry({ industries, publishedIndustries, draftIndustries, industryBySlug });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(new Set(industries.map((i) => i.slug)).size).toBe(industries.length);
    expect(new Set(industries.map((i) => i.canonicalPath)).size).toBe(industries.length);
  });
});

describe("Elektrotechnik – Route (datengetrieben, keine Hardcodes)", () => {
  const params = generateStaticParams();
  it("1 – generateStaticParams enthält beide published Slugs (aus publishedIndustries)", () => {
    expect(params.map((p) => p.slug).sort()).toEqual(["automatisierungstechnik", "elektrotechnik"]);
  });
  it("2 – kein Draft-Slug (draftIndustries leer)", () => {
    expect(params.length).toBe(publishedIndustries.length);
    expect(draftIndustries.length).toBe(0);
  });
});

describe("Elektrotechnik – Sitemap + Hub (automatisch, published)", () => {
  const urls = sitemap().map((e) => String(e.url));
  it("1 – Sitemap enthält /branchen, beide Branchen-Detailseiten, keine Duplikate", () => {
    expect(urls).toContain("https://www.phe-perm.de/branchen");
    expect(urls).toContain("https://www.phe-perm.de/branchen/automatisierungstechnik");
    expect(urls).toContain("https://www.phe-perm.de/branchen/elektrotechnik");
    expect(new Set(urls).size).toBe(urls.length);
  });
  it("2 – Hub-Quelle: zwei Karten aus publishedIndustries in Registry-Reihenfolge, keine Drafts", () => {
    // Der Hub rendert publishedIndustries.map(...) (siehe branchen/page.tsx). Damit sind
    // genau die zwei published Branchen als Karten sichtbar, in Registry-Reihenfolge.
    expect(publishedIndustries.map((i) => i.name)).toEqual(["Automatisierungstechnik", "Elektrotechnik"]);
    for (const i of publishedIndustries) expect(i.status).toBe("published");
  });
});

describe("Elektrotechnik – Matching (konservativ, category=elektro, unverändert)", () => {
  const full = matchJobsForConfig(JOBS, { ...elektrotechnik.jobMatch, maxJobs: 99 }, elektrotechnik.slug);
  it("1 – jobMatch-Config unverändert gegenüber 009A", () => {
    expect(elektrotechnik.jobMatch).toEqual({ category: ["elektro"], maxJobs: 8, fallback: "hint-and-joblist" });
  });
  it("2 – exakt die 15 elektro-Jobs, 0 ausgeschlossen, 0 False Positives", () => {
    expect(full.matches.map((m) => m.job.id).sort((a, b) => Number(a) - Number(b))).toEqual(
      EXPECTED_ELEKTRO_IDS.slice().sort((a, b) => Number(a) - Number(b)),
    );
    expect(full.totalMatched).toBe(15);
    expect(full.excludedCount).toBe(0);
  });
  it("3 – jeder Treffer Kategorie 'elektro', Konfidenz high", () => {
    for (const m of full.matches) {
      expect(m.job.category).toBe("elektro");
      expect(m.matchedSignals).toContain("category");
      expect(m.confidence).toBe("high");
    }
  });
  it("4 – Nicht-Elektrotechnik-Stellen matchen nicht (Kälte/Mechatronik, SPS-Job 7, SHK)", () => {
    for (const id of EXPECTED_NON_MATCH_IDS) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForConfig([j], elektrotechnik.jobMatch, "x").totalMatched, `Job ${id}`).toBe(0);
    }
  });
  it("5 – sichtbare 8 Jobs in dokumentierter, deterministischer Reihenfolge", () => {
    expect(capped.matches.length).toBe(8);
    expect(capped.totalMatched).toBe(15);
    expect(visibleJobs.map((j) => j.id)).toEqual(EXPECTED_VISIBLE_IDS);
    // deterministisch reproduzierbar
    const again = matchJobsForConfig(JOBS, elektrotechnik.jobMatch, elektrotechnik.slug);
    expect(again.matches.map((m) => m.job.id)).toEqual(EXPECTED_VISIBLE_IDS);
  });
});

describe("Elektrotechnik – Composer grün (published)", () => {
  it("1 – Metadata: Canonical + OG-URL exakt, index/follow, kein Doppel-Branding", () => {
    const m = buildIndustryMetadata(elektrotechnik);
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/branchen/elektrotechnik");
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
  it("2 – Schema: Graph-Typen, ItemList = exakt die 8 sichtbaren Jobs, kein JobPosting, eindeutige @ids", () => {
    const g = buildIndustrySchema(elektrotechnik, visibleJobs);
    const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
    expect(nodes.map((n) => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
    const list = nodes.find((n) => n["@type"] === "ItemList") as { numberOfItems: number; itemListElement: { name: string }[] };
    expect(list.numberOfItems).toBe(8);
    expect(list.itemListElement.map((e) => e.name)).toEqual(visibleJobs.map((j) => j.title));
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
    expect(json).toContain("https://www.phe-perm.de/branchen/elektrotechnik");
  });
  it("3 – Internal Links: Breadcrumb, related published, keine Draft-/numerischen/doppelten Links, kein Self-Link, 0 Warnings", () => {
    // published → kein allowDraft nötig
    const links = buildIndustryInternalLinks({ industry: elektrotechnik, professionRegistry: { professionBySlug }, jobMatches: capped.matches });
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Branchen", "Elektrotechnik"]);
    expect(links.relevantProfessionLinks.map((l) => l.professionSlug)).toEqual(["elektroniker", "servicetechniker", "sps-automatisierung"]);
    for (const l of links.relevantProfessionLinks) expect(professionBySlug[l.professionSlug ?? ""]?.publication.published).toBe(true);
    for (const l of links.allLinks) {
      expect(/^\/jobs\/\d+$/.test(l.href), l.href).toBe(false); // keine numerischen Job-URLs
      expect(l.href).not.toBe(elektrotechnik.canonicalPath); // kein Self-Link
    }
    const hrefs = links.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length); // keine Duplikate
    expect(links.warnings).toHaveLength(0);
  });
});

describe("Elektrotechnik – Regression (Bestand unverändert)", () => {
  it("1 – Automatisierungstechnik matcht weiterhin exakt [7]", () => {
    const auto = matchJobsForConfig(JOBS, automatisierungstechnik.jobMatch, automatisierungstechnik.slug);
    expect(auto.matches.map((m) => m.job.id)).toEqual(["7"]);
    expect(auto.excludedCount).toBe(0);
  });
  it("2 – Automatisierungstechnik bleibt published + indexierbar", () => {
    expect(automatisierungstechnik.status).toBe("published");
    expect(automatisierungstechnik.publication.published).toBe(true);
  });
  it("3 – alle vier Professionen weiterhin published", () => {
    for (const slug of ["elektroniker", "mechatroniker", "servicetechniker", "sps-automatisierung"]) {
      expect(professionBySlug[slug]?.publication.published, slug).toBe(true);
    }
  });
});
