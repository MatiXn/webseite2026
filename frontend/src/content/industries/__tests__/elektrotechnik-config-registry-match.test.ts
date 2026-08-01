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
import { JOBS } from "../../../app/jobs/data";

// Erwartete Elektrotechnik-Treffer = exakt die 15 Jobs der Kategorie "elektro".
const EXPECTED_ELEKTRO_IDS = ["1", "3", "4", "5", "6", "8", "9", "11", "12", "13", "16", "17", "22", "23", "24"];
// Bewusst NICHT Elektrotechnik (Kälte/Mechatronik, reine SPS-Stelle, SHK).
const EXPECTED_NON_MATCH_IDS = ["2", "7", "10", "14", "15", "18", "19", "20", "21", "25"];

describe("Elektrotechnik – Config", () => {
  it("1 – validiert ohne Errors/Warnings", () => {
    const r = validateIndustry(elektrotechnik);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
  });
  it("2 – slug + eindeutiger canonicalPath korrekt", () => {
    expect(elektrotechnik.slug).toBe("elektrotechnik");
    expect(elektrotechnik.canonicalPath).toBe("/branchen/elektrotechnik");
    // eindeutig gegenüber der anderen Branche
    expect(elektrotechnik.canonicalPath).not.toBe(automatisierungstechnik.canonicalPath);
    expect(elektrotechnik.slug).not.toBe(automatisierungstechnik.slug);
  });
  it("3 – Draft-Staging: status=draft, alle Sichtbarkeits-Flags aus", () => {
    expect(elektrotechnik.status).toBe("draft");
    expect(elektrotechnik.publication).toMatchObject({
      published: false,
      indexable: false,
      includeInSitemap: false,
      showInIndustryHub: false,
    });
  });
  it("4 – Pflichtinhalte gefüllt (Hero, Überblick, Fokusbereiche, FAQ)", () => {
    expect(elektrotechnik.hero.headline.length).toBeGreaterThan(0);
    expect(elektrotechnik.overview.paragraphs.length).toBeGreaterThan(0);
    expect(elektrotechnik.focusAreas.length).toBeGreaterThanOrEqual(4);
    expect(elektrotechnik.faq.length).toBeGreaterThanOrEqual(5);
  });
  it("5 – relatedProfessions ausschließlich bekannte published Professionen", () => {
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

describe("Elektrotechnik – Registry (Draft-Staging)", () => {
  it("1 – industries + industryBySlug enthalten beide Branchen", () => {
    expect(industries.map((i) => i.slug).sort()).toEqual(["automatisierungstechnik", "elektrotechnik"]);
    expect(industryBySlug["elektrotechnik"]).toBe(elektrotechnik);
    expect(industryBySlug["automatisierungstechnik"]).toBe(automatisierungstechnik);
  });
  it("2 – elektrotechnik ist DRAFT, NICHT published (bleibt unsichtbar)", () => {
    expect(draftIndustries.map((i) => i.slug)).toEqual(["elektrotechnik"]);
    expect(publishedIndustries.map((i) => i.slug)).toEqual(["automatisierungstechnik"]);
    expect(publishedIndustries).not.toContain(elektrotechnik);
  });
  it("3 – Registry valide, eindeutige Slugs + Canonicals", () => {
    const r = validateIndustryRegistry({ industries, publishedIndustries, draftIndustries, industryBySlug });
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(new Set(industries.map((i) => i.slug)).size).toBe(industries.length);
    expect(new Set(industries.map((i) => i.canonicalPath)).size).toBe(industries.length);
  });
});

describe("Elektrotechnik – Unsichtbarkeit (kein Live-Effekt)", () => {
  it("1 – nicht in der Sitemap", () => {
    const urls = sitemap().map((e) => String(e.url));
    expect(urls).not.toContain("https://www.phe-perm.de/branchen/elektrotechnik");
    // die bestehende, published Branche bleibt in der Sitemap
    expect(urls).toContain("https://www.phe-perm.de/branchen/automatisierungstechnik");
  });
});

describe("Elektrotechnik – Matching (konservativ, category=elektro)", () => {
  // Cap angehoben, um die vollständige Treffermenge unabhängig vom Anzeige-Limit zu prüfen.
  const full = matchJobsForConfig(JOBS, { ...elektrotechnik.jobMatch, maxJobs: 99 }, elektrotechnik.slug);
  it("1 – exakt die 15 elektro-Jobs, 0 ausgeschlossen, 0 False Positives", () => {
    expect(full.matches.map((m) => m.job.id).sort((a, b) => Number(a) - Number(b))).toEqual(EXPECTED_ELEKTRO_IDS.slice().sort((a, b) => Number(a) - Number(b)));
    expect(full.totalMatched).toBe(15);
    expect(full.excludedCount).toBe(0);
  });
  it("2 – jeder Treffer ist Kategorie 'elektro' (strukturelles Signal, kein Textzufall)", () => {
    for (const m of full.matches) {
      expect(m.job.category).toBe("elektro");
      expect(m.matchedSignals).toContain("category");
      expect(m.confidence).toBe("high");
    }
  });
  it("3 – Nicht-Elektrotechnik-Stellen matchen nicht (Kälte/Mechatronik, SPS-Job 7, SHK)", () => {
    for (const id of EXPECTED_NON_MATCH_IDS) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForConfig([j], elektrotechnik.jobMatch, "x").totalMatched, `Job ${id}`).toBe(0);
    }
  });
  it("4 – Anzeige-Cap (maxJobs=8) begrenzt die sichtbare Liste, ohne Ausschlüsse", () => {
    const capped = matchJobsForConfig(JOBS, elektrotechnik.jobMatch, elektrotechnik.slug);
    expect(capped.matches.length).toBe(8);
    expect(capped.totalMatched).toBe(15);
    for (const m of capped.matches) expect(m.job.category).toBe("elektro");
  });
  it("5 – deterministisch + robust bei leerem Input", () => {
    const again = matchJobsForConfig(JOBS, { ...elektrotechnik.jobMatch, maxJobs: 99 }, elektrotechnik.slug);
    expect(again.matches.map((m) => m.job.id)).toEqual(full.matches.map((m) => m.job.id));
    expect(matchJobsForConfig([], elektrotechnik.jobMatch, "x").totalMatched).toBe(0);
  });
});

describe("Elektrotechnik – Composer grün", () => {
  const cap = matchJobsForConfig(JOBS, elektrotechnik.jobMatch, elektrotechnik.slug);
  const jobs = cap.matches.map((m) => m.job);
  it("1 – Metadata-Composer: eindeutiger Canonical, index/follow-Objekt vorhanden", () => {
    const m = buildIndustryMetadata(elektrotechnik);
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/branchen/elektrotechnik");
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });
  it("2 – Schema-Composer: nicht-leerer Graph, kein JobPosting", () => {
    const g = buildIndustrySchema(elektrotechnik, jobs);
    const nodes = g["@graph"] as unknown[];
    expect(nodes.length).toBeGreaterThan(0);
    expect(JSON.stringify(g)).not.toContain("JobPosting");
  });
  it("3 – Internal-Link-Composer verweigert Draft ohne allowDraft (Draft-Schutz)", () => {
    expect(() => buildIndustryInternalLinks({ industry: elektrotechnik, professionRegistry: { professionBySlug }, jobMatches: cap.matches })).toThrow();
  });
  it("4 – Internal-Link-Composer mit allowDraft: Breadcrumb korrekt, related published, 0 Warnings", () => {
    const links = buildIndustryInternalLinks({ industry: elektrotechnik, professionRegistry: { professionBySlug }, jobMatches: cap.matches, allowDraft: true });
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Branchen", "Elektrotechnik"]);
    for (const l of links.relevantProfessionLinks) expect(professionBySlug[l.professionSlug ?? ""]?.publication.published).toBe(true);
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
