import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { validateProfession } from "../../../content-engine/validation";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { buildProfessionSchema } from "../../../content-engine/schema";
import { buildProfessionInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForProfession } from "../../../content-engine/job-matching";
import { elektronikerBetriebstechnik } from "../elektroniker-betriebstechnik";
import { elektroniker } from "../elektroniker";
import { professions, publishedProfessions, professionBySlug } from "../index";
import { contact } from "../../contact";
import { JOBS } from "../../../app/jobs/data";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const routeSrc = read("../../../app/berufe/elektroniker-betriebstechnik/page.tsx");
const hubSrc = read("../../../app/berufe/page.tsx");
const sitemapMod = await import("../../../app/sitemap");
const configSrc = read("../elektroniker-betriebstechnik.ts");

const EXPECTED = ["1", "6", "8", "9", "11", "12", "24"];
// Bewusst abgegrenzt (dürfen NICHT matchen):
const EXCLUDED = ["5", "22", "13", "4", "3", "16", "23", "7", "10", "14", "20", "21", "17", "18", "19", "2", "15", "25"];

describe("Elektroniker für Betriebstechnik – Config", () => {
  it("1 – validiert ohne Errors/Warnings, published + indexable", () => {
    const r = validateProfession(elektronikerBetriebstechnik);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
    expect(elektronikerBetriebstechnik.status).toBe("published");
    expect(elektronikerBetriebstechnik.publication).toMatchObject({ published: true, indexable: true, includeInSitemap: true, showInProfessionHub: true });
  });
  it("2 – slug/canonical korrekt", () => {
    expect(elektronikerBetriebstechnik.slug).toBe("elektroniker-betriebstechnik");
    expect(elektronikerBetriebstechnik.canonicalPath).toBe("/berufe/elektroniker-betriebstechnik");
  });
  it("3 – FAQ rein kandidatenseitig (8 Fragen, keine B2B-Frage)", () => {
    expect(elektronikerBetriebstechnik.faq.length).toBe(8);
    for (const f of elektronikerBetriebstechnik.faq) {
      expect(/unternehmen können|können unternehmen|für ihr unternehmen|arbeitgeber/i.test(f.q), f.q).toBe(false);
    }
    const joined = elektronikerBetriebstechnik.faq.map((f) => f.q).join(" | ").toLowerCase();
    for (const t of ["festanstellung", "kostenlos", "schicht", "vollkonti", "vertraulich", "zustimmung", "initiativ", "ausbildung"]) {
      expect(joined, t).toContain(t);
    }
  });
  it("4 – CTAs nutzen contact.whatsappLink, keine hartcodierte Nummer im Quelltext", () => {
    expect(elektronikerBetriebstechnik.hero.primaryCta.href).toBe(contact.whatsappLink);
    expect(elektronikerBetriebstechnik.hero.secondaryCta.href).toBe("#stellen");
    expect(elektronikerBetriebstechnik.applicantCta.primaryCta.href).toBe(contact.whatsappLink);
    expect(configSrc).toContain("contact.whatsappLink");
    expect(configSrc.includes("wa.me/")).toBe(false);
    expect(/491739980100|tel:/.test(configSrc)).toBe(false);
  });
  it("5 – keine verbotenen/erfundenen Pauschalversprechen", () => {
    const raw = JSON.stringify(elektronikerBetriebstechnik).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "immer firmenwagen", "mehr gehalt", "60 sekunden", "schichtfrei garantiert"]) {
      expect(raw.includes(bad), bad).toBe(false);
    }
  });
  it("6 – inhaltlich abgegrenzt (Betriebstechnik), keine fachfremden Felder", () => {
    const raw = JSON.stringify(elektronikerBetriebstechnik).toLowerCase();
    expect(raw).toContain("betriebstechnik");
    for (const forbidden of ["gebäudeautomation", "photovoltaik", "msr-technik", "eib/knx"]) {
      expect(raw.includes(forbidden), forbidden).toBe(false);
    }
  });
});

describe("Elektroniker für Betriebstechnik – Matching", () => {
  const r = matchJobsForProfession(JOBS, elektronikerBetriebstechnik);
  it("1 – exakt 7 Treffer (1,6,8,9,11,12,24), 0 ausgeschlossen", () => {
    expect(r.matches.map((m) => m.job.id).sort((a, b) => Number(a) - Number(b))).toEqual(EXPECTED);
    expect(r.totalMatched).toBe(7);
    expect(r.excludedCount).toBe(0);
  });
  it("2 – keine abgegrenzten Berufe (Energie-/Gebäude, MSR, Service, PV, SPS, Mechatronik, Instandhaltung-only, SHK)", () => {
    for (const id of EXCLUDED) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForProfession([j] as never, elektronikerBetriebstechnik).totalMatched, id).toBe(0);
    }
  });
  it("3 – deterministische Reihenfolge", () => {
    const again = matchJobsForProfession(JOBS, elektronikerBetriebstechnik);
    expect(again.matches.map((m) => m.job.id)).toEqual(r.matches.map((m) => m.job.id));
  });
});

describe("Elektroniker für Betriebstechnik – Metadata", () => {
  const m = buildProfessionMetadata(elektronikerBetriebstechnik);
  it("Title/Canonical/OG/index-follow, kein Doppelbranding", () => {
    expect((m.title as { absolute: string }).absolute).toBe("Elektroniker für Betriebstechnik Jobs | PHE-Perm");
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/elektroniker-betriebstechnik");
    expect(m.openGraph?.url).toBe("https://www.phe-perm.de/berufe/elektroniker-betriebstechnik");
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
    // eindeutiger Canonical gegenüber der breiten Elektroniker-Seite
    expect(m.alternates?.canonical).not.toBe(buildProfessionMetadata(elektroniker).alternates?.canonical);
  });
});

describe("Elektroniker für Betriebstechnik – Schema", () => {
  const jobs = matchJobsForProfession(JOBS, elektronikerBetriebstechnik).matches.map((m) => m.job);
  const g = buildProfessionSchema(elektronikerBetriebstechnik, jobs);
  const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
  it("CollectionPage/BreadcrumbList/FAQPage/ItemList(7); kein JobPosting/Organization; eindeutige @ids", () => {
    expect(nodes.map((n) => n["@type"])).toEqual(expect.arrayContaining(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]));
    const list = nodes.find((n) => n["@type"] === "ItemList") as { numberOfItems: number };
    expect(list.numberOfItems).toBe(7);
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Elektroniker für Betriebstechnik – Internal Links + Cross-Link", () => {
  const matches = matchJobsForProfession(JOBS, elektronikerBetriebstechnik).matches;
  const links = buildProfessionInternalLinks({ profession: elektronikerBetriebstechnik, professionRegistry: { professionBySlug }, jobMatches: matches });
  it("Breadcrumb + Cross-Link zu /berufe/elektroniker; kanonische Joblinks, keine numerischen/Doppel-Links", () => {
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Berufe", "Elektroniker für Betriebstechnik"]);
    expect(links.relatedProfessionLinks.map((l) => l.href)).toEqual(["/berufe/elektroniker"]);
    expect(links.jobLinks.length).toBe(7);
    for (const l of links.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
    const hrefs = links.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(links.warnings).toHaveLength(0);
  });
  it("Cross-Link zurück: elektroniker verlinkt auf die Betriebstechnik-Seite", () => {
    const back = buildProfessionInternalLinks({ profession: elektroniker, professionRegistry: { professionBySlug }, jobMatches: [] });
    expect(back.relatedProfessionLinks.map((l) => l.href)).toEqual(["/berufe/elektroniker-betriebstechnik"]);
  });
});

describe("Elektroniker für Betriebstechnik – Route/Hub/Sitemap/Registry", () => {
  it("Route dünn (Metadata + Template, keine lokale Logik)", () => {
    expect(routeSrc).toContain("buildProfessionMetadata(elektronikerBetriebstechnik)");
    expect(routeSrc).toContain("<ProfessionPageTemplate profession={elektronikerBetriebstechnik} />");
    expect(routeSrc.includes("const FAQ")).toBe(false);
  });
  it("Hub verlinkt eigene Karte", () => {
    expect(hubSrc).toContain('detailHref: "/berufe/elektroniker-betriebstechnik"');
  });
  it("Sitemap enthält /berufe/elektroniker-betriebstechnik genau einmal (kein Duplicate-Canonical)", () => {
    const urls = sitemapMod.default().map((e: { url: string | URL }) => String(e.url));
    expect(urls.filter((u) => u === "https://www.phe-perm.de/berufe/elektroniker-betriebstechnik")).toHaveLength(1);
    expect(new Set(urls).size).toBe(urls.length);
  });
  it("Registry: in professions + publishedProfessions + professionBySlug", () => {
    expect(professions.some((p) => p.slug === "elektroniker-betriebstechnik")).toBe(true);
    expect(publishedProfessions.some((p) => p.slug === "elektroniker-betriebstechnik")).toBe(true);
    expect(professionBySlug["elektroniker-betriebstechnik"]).toBe(elektronikerBetriebstechnik);
  });
});
