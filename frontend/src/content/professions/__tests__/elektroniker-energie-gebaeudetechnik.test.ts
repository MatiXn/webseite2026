import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { validateProfession } from "../../../content-engine/validation";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { buildProfessionSchema } from "../../../content-engine/schema";
import { buildProfessionInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForProfession } from "../../../content-engine/job-matching";
import { elektronikerEnergieGebaeudetechnik } from "../elektroniker-energie-gebaeudetechnik";
import { elektroniker } from "../elektroniker";
import { professions, publishedProfessions, professionBySlug } from "../index";
import { contact } from "../../contact";
import { JOBS } from "../../../app/jobs/data";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const routeSrc = read("../../../app/berufe/elektroniker-energie-gebaeudetechnik/page.tsx");
const hubSrc = read("../../../app/berufe/page.tsx");
const sitemapMod = await import("../../../app/sitemap");
const configSrc = read("../elektroniker-energie-gebaeudetechnik.ts");

const EXPECTED = ["13", "22"];
// Bewusst abgegrenzt (dürfen NICHT matchen): Betriebstechnik/-elektroniker, SPS, Service,
// Photovoltaik, Mechatronik, Kältetechnik, SHK, sowie Jobs mit nur alt. Ausbildung im Profil.
const EXCLUDED = ["1", "4", "16", "6", "8", "9", "24", "7", "3", "18", "21", "23", "2", "15", "25", "10", "14", "20", "5", "11", "12", "17", "19"];

describe("Elektroniker Energie- und Gebäudetechnik – Config", () => {
  it("1 – validiert ohne Errors/Warnings, published + indexable", () => {
    const r = validateProfession(elektronikerEnergieGebaeudetechnik);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
    expect(elektronikerEnergieGebaeudetechnik.status).toBe("published");
    expect(elektronikerEnergieGebaeudetechnik.publication).toMatchObject({ published: true, indexable: true, includeInSitemap: true, showInProfessionHub: true });
  });
  it("2 – slug/canonical korrekt", () => {
    expect(elektronikerEnergieGebaeudetechnik.slug).toBe("elektroniker-energie-gebaeudetechnik");
    expect(elektronikerEnergieGebaeudetechnik.canonicalPath).toBe("/berufe/elektroniker-energie-gebaeudetechnik");
  });
  it("3 – FAQ rein kandidatenseitig (keine B2B-Frage), inkl. Wenige-Stellen-/Initiativ-Frage", () => {
    for (const f of elektronikerEnergieGebaeudetechnik.faq) {
      expect(/unternehmen können|können unternehmen|für ihr unternehmen|arbeitgeber/i.test(f.q), f.q).toBe(false);
    }
    const joined = elektronikerEnergieGebaeudetechnik.faq.map((f) => f.q).join(" | ").toLowerCase();
    for (const t of ["festanstellung", "kostenlos", "wenige stellen", "vertraulich", "zustimmung", "initiativ", "ausbildung"]) {
      expect(joined, t).toContain(t);
    }
  });
  it("4 – CTAs nutzen contact.whatsappLink, keine hartcodierte Nummer im Quelltext", () => {
    expect(elektronikerEnergieGebaeudetechnik.hero.primaryCta.href).toBe(contact.whatsappLink);
    expect(elektronikerEnergieGebaeudetechnik.hero.secondaryCta.href).toBe("#stellen");
    expect(elektronikerEnergieGebaeudetechnik.applicantCta.primaryCta.href).toBe(contact.whatsappLink);
    expect(configSrc).toContain("contact.whatsappLink");
    expect(configSrc.includes("wa.me/")).toBe(false);
    expect(/491739980100|tel:/.test(configSrc)).toBe(false);
  });
  it("5 – keine verbotenen/erfundenen Pauschalversprechen, keine künstliche Jobfülle", () => {
    const raw = JSON.stringify(elektronikerEnergieGebaeudetechnik).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "mehr gehalt", "60 sekunden", "viele offene stellen", "zahlreiche stellen"]) {
      expect(raw.includes(bad), bad).toBe(false);
    }
  });
  it("6 – fachlich abgegrenzt: IN-Begriffe vorhanden, OUT-Berufe nicht als Fokus", () => {
    const raw = JSON.stringify(elektronikerEnergieGebaeudetechnik).toLowerCase();
    for (const inTerm of ["gebäudeautomation", "knx", "msr"]) expect(raw.includes(inTerm), inTerm).toBe(true);
    for (const out of ["betriebstechnik", "photovoltaik", "kältetechnik", "sps-programm"]) expect(raw.includes(out), out).toBe(false);
  });
});

describe("Elektroniker Energie- und Gebäudetechnik – Matching", () => {
  const r = matchJobsForProfession(JOBS, elektronikerEnergieGebaeudetechnik);
  it("1 – exakt Jobs 13, 22, 0 ausgeschlossen", () => {
    expect(r.matches.map((m) => m.job.id).sort((a, b) => Number(a) - Number(b))).toEqual(EXPECTED);
    expect(r.totalMatched).toBe(2);
    expect(r.excludedCount).toBe(0);
  });
  it("2 – keine abgegrenzten Berufe (0 False Positives)", () => {
    for (const id of EXCLUDED) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForProfession([j] as never, elektronikerEnergieGebaeudetechnik).totalMatched, id).toBe(0);
    }
  });
  it("3 – deterministisch", () => {
    const again = matchJobsForProfession(JOBS, elektronikerEnergieGebaeudetechnik);
    expect(again.matches.map((m) => m.job.id)).toEqual(r.matches.map((m) => m.job.id));
  });
});

describe("Elektroniker Energie- und Gebäudetechnik – Metadata", () => {
  const m = buildProfessionMetadata(elektronikerEnergieGebaeudetechnik);
  it("Title/Canonical/OG/index-follow, kein Doppelbranding, eigener Canonical", () => {
    expect((m.title as { absolute: string }).absolute).toBe("Elektroniker Energie- und Gebäudetechnik Jobs | PHE-Perm");
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/elektroniker-energie-gebaeudetechnik");
    expect(m.openGraph?.url).toBe("https://www.phe-perm.de/berufe/elektroniker-energie-gebaeudetechnik");
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
    expect(m.alternates?.canonical).not.toBe(buildProfessionMetadata(elektroniker).alternates?.canonical);
  });
});

describe("Elektroniker Energie- und Gebäudetechnik – Schema", () => {
  const jobs = matchJobsForProfession(JOBS, elektronikerEnergieGebaeudetechnik).matches.map((m) => m.job);
  const g = buildProfessionSchema(elektronikerEnergieGebaeudetechnik, jobs);
  const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
  it("CollectionPage/BreadcrumbList/FAQPage/ItemList(2); kein JobPosting/Organization; eindeutige @ids", () => {
    expect(nodes.map((n) => n["@type"])).toEqual(expect.arrayContaining(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]));
    const list = nodes.find((n) => n["@type"] === "ItemList") as { numberOfItems: number };
    expect(list.numberOfItems).toBe(2);
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Elektroniker Energie- und Gebäudetechnik – Internal Links + Cross-Link", () => {
  const matches = matchJobsForProfession(JOBS, elektronikerEnergieGebaeudetechnik).matches;
  const links = buildProfessionInternalLinks({ profession: elektronikerEnergieGebaeudetechnik, professionRegistry: { professionBySlug }, jobMatches: matches });
  it("Breadcrumb + Cross-Link zu /berufe/elektroniker; kanonische Joblinks (2), keine numerischen/Doppel-Links", () => {
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Berufe", "Elektroniker Energie- und Gebäudetechnik"]);
    expect(links.relatedProfessionLinks.map((l) => l.href)).toEqual(["/berufe/elektroniker"]);
    expect(links.jobLinks.length).toBe(2);
    for (const l of links.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
    expect(new Set(links.allLinks.map((l) => l.href)).size).toBe(links.allLinks.length);
    expect(links.warnings).toHaveLength(0);
  });
  it("Cross-Link zurück: elektroniker verlinkt auf Betriebstechnik + Gebäudetechnik", () => {
    const back = buildProfessionInternalLinks({ profession: elektroniker, professionRegistry: { professionBySlug }, jobMatches: [] });
    expect(back.relatedProfessionLinks.map((l) => l.href)).toEqual([
      "/berufe/elektroniker-betriebstechnik",
      "/berufe/elektroniker-energie-gebaeudetechnik",
    ]);
  });
});

describe("Elektroniker Energie- und Gebäudetechnik – Route/Hub/Sitemap/Registry", () => {
  it("Route dünn (Metadata + Template, keine lokale Logik)", () => {
    expect(routeSrc).toContain("buildProfessionMetadata(elektronikerEnergieGebaeudetechnik)");
    expect(routeSrc).toContain("<ProfessionPageTemplate profession={elektronikerEnergieGebaeudetechnik} />");
    expect(routeSrc.includes("const FAQ")).toBe(false);
  });
  it("Hub verlinkt eigene Karte", () => {
    expect(hubSrc).toContain('detailHref: "/berufe/elektroniker-energie-gebaeudetechnik"');
  });
  it("Sitemap enthält die Seite genau einmal (kein Duplicate-Canonical)", () => {
    const urls = sitemapMod.default().map((e: { url: string | URL }) => String(e.url));
    expect(urls.filter((u) => u === "https://www.phe-perm.de/berufe/elektroniker-energie-gebaeudetechnik")).toHaveLength(1);
    expect(new Set(urls).size).toBe(urls.length);
  });
  it("Registry: in professions + publishedProfessions + professionBySlug", () => {
    expect(professions.some((p) => p.slug === "elektroniker-energie-gebaeudetechnik")).toBe(true);
    expect(publishedProfessions.some((p) => p.slug === "elektroniker-energie-gebaeudetechnik")).toBe(true);
    expect(professionBySlug["elektroniker-energie-gebaeudetechnik"]).toBe(elektronikerEnergieGebaeudetechnik);
  });
});
