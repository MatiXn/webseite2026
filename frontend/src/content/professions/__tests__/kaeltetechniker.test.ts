import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { validateProfession } from "../../../content-engine/validation";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { buildProfessionSchema } from "../../../content-engine/schema";
import { buildProfessionInternalLinks } from "../../../content-engine/internal-links";
import { matchJobsForProfession } from "../../../content-engine/job-matching";
import { kaeltetechniker } from "../kaeltetechniker";
import { professions, publishedProfessions, professionBySlug } from "../index";
import { contact } from "../../contact";
import { JOBS } from "../../../app/jobs/data";

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const routeSrc = read("../../../app/berufe/kaeltetechniker/page.tsx");
const hubSrc = read("../../../app/berufe/page.tsx");
const sitemapMod = await import("../../../app/sitemap");

const EXPECTED_MATCH_IDS = ["2", "15", "20", "25"];
const MUST_NOT_MATCH = ["10", "14", "21", "19", "3", "18"]; // allg. Mechatroniker, SHK, allg. Servicetechniker

describe("Kältetechniker – Config", () => {
  it("1 – validiert ohne Errors/Warnings, published + indexable", () => {
    const r = validateProfession(kaeltetechniker);
    expect(r.valid, r.errors.map((e) => e.code).join(", ")).toBe(true);
    expect(r.warnings.map((w) => w.code).join(", ")).toBe("");
    expect(kaeltetechniker.status).toBe("published");
    expect(kaeltetechniker.publication).toMatchObject({ published: true, indexable: true, includeInSitemap: true, showInProfessionHub: true });
  });
  it("2 – slug/canonical korrekt", () => {
    expect(kaeltetechniker.slug).toBe("kaeltetechniker");
    expect(kaeltetechniker.canonicalPath).toBe("/berufe/kaeltetechniker");
  });
  it("3 – FAQ deckt die geforderten 7 Kandidatenfragen ab", () => {
    expect(kaeltetechniker.faq.length).toBeGreaterThanOrEqual(7);
    const joined = kaeltetechniker.faq.map((f) => f.q).join(" | ");
    for (const needle of ["Festanstellung", "vertraulich", "reisen", "Wochenend", "nicht aktiv suche", "Kosten", "Zustimmung"]) {
      expect(joined, needle).toContain(needle);
    }
  });
  it("4 – CTAs nutzen zentrale Pfade (WhatsApp = contact.whatsappLink), keine hartcodierte Nummer in der Quelle", () => {
    expect(kaeltetechniker.hero.primaryCta.href).toBe(contact.whatsappLink);
    expect(kaeltetechniker.applicantCta.primaryCta.href).toBe(contact.whatsappLink);
    expect(kaeltetechniker.hero.secondaryCta.href).toBe("#stellen");
    const src = read("../kaeltetechniker.ts");
    expect(src).toContain("contact.whatsappLink"); // referenziert die zentrale Konstante
    expect(src.includes("wa.me/")).toBe(false); // keine hartcodierte WhatsApp-URL/Nummer im Quelltext
    expect(/tel:|491739980100/.test(src)).toBe(false);
  });
  it("5 – keine verbotenen/erfundenen Pauschalversprechen", () => {
    const raw = JSON.stringify(kaeltetechniker).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "immer firmenwagen", "keine bereitschaft", "60 sekunden", "mehr gehalt"]) {
      expect(raw.includes(bad), bad).toBe(false);
    }
  });
});

describe("Kältetechniker – Matching (nur echte Kälte-Stellen)", () => {
  const r = matchJobsForProfession(JOBS, kaeltetechniker);
  it("1 – exakt Jobs 2, 15, 20, 25 (deterministisch), 0 Ausschlüsse", () => {
    expect(r.matches.map((m) => m.job.id).sort((a, b) => Number(a) - Number(b))).toEqual(EXPECTED_MATCH_IDS);
    expect(r.totalMatched).toBe(4);
    expect(r.excludedCount).toBe(0);
  });
  it("2 – jeder Treffer hat Tag Kältetechnik", () => {
    for (const m of r.matches) expect(m.job.tags).toContain("Kältetechnik");
  });
  it("3 – keine fachfremden Mechatroniker/SHK/allg. Servicetechniker", () => {
    for (const id of MUST_NOT_MATCH) {
      const j = JOBS.find((x) => x.id === id);
      if (j) expect(matchJobsForProfession([j] as never, kaeltetechniker).totalMatched, id).toBe(0);
    }
  });
  it("4 – deterministisch", () => {
    const again = matchJobsForProfession(JOBS, kaeltetechniker);
    expect(again.matches.map((m) => m.job.id)).toEqual(r.matches.map((m) => m.job.id));
  });
});

describe("Kältetechniker – Metadata", () => {
  const m = buildProfessionMetadata(kaeltetechniker);
  it("Title/Description/Canonical/OG/index-follow, kein Doppelbranding", () => {
    expect((m.title as { absolute: string }).absolute).toBe("Kältetechniker Jobs in Festanstellung | PHE-Perm");
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/kaeltetechniker");
    expect(m.openGraph?.url).toBe("https://www.phe-perm.de/berufe/kaeltetechniker");
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
});

describe("Kältetechniker – Schema", () => {
  const jobs = matchJobsForProfession(JOBS, kaeltetechniker).matches.map((m) => m.job);
  const g = buildProfessionSchema(kaeltetechniker, jobs);
  const nodes = g["@graph"] as ReadonlyArray<Record<string, unknown>>;
  it("CollectionPage/BreadcrumbList/FAQPage/ItemList(4); kein JobPosting/Organization; eindeutige @ids", () => {
    expect(nodes.map((n) => n["@type"])).toEqual(expect.arrayContaining(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]));
    const list = nodes.find((n) => n["@type"] === "ItemList") as { numberOfItems: number };
    expect(list.numberOfItems).toBe(4);
    const json = JSON.stringify(g);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map((n) => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Kältetechniker – Internal Links", () => {
  const matches = matchJobsForProfession(JOBS, kaeltetechniker).matches;
  const links = buildProfessionInternalLinks({ profession: kaeltetechniker, professionRegistry: { professionBySlug }, jobMatches: matches });
  it("Breadcrumb, kanonische Joblinks, keine numerischen/Draft-/Doppel-Links, 0 Warnings", () => {
    expect(links.breadcrumbs.map((b) => b.label)).toEqual(["Startseite", "Berufe", "Kältetechniker"]);
    for (const l of links.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
    const jobLinks = links.jobLinks;
    expect(jobLinks.length).toBe(4);
    for (const l of jobLinks) expect(l.href.startsWith("/jobs/")).toBe(true);
    const hrefs = links.allLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(links.warnings).toHaveLength(0);
  });
});

describe("Kältetechniker – Route/Hub/Sitemap", () => {
  it("Route dünn (Metadata + Template, keine lokale Content-/FAQ-/Schema-Logik)", () => {
    expect(routeSrc).toContain("buildProfessionMetadata(kaeltetechniker)");
    expect(routeSrc).toContain("<ProfessionPageTemplate profession={kaeltetechniker} />");
    expect(routeSrc.includes("const FAQ")).toBe(false);
    expect(routeSrc.includes("faqSchema")).toBe(false);
  });
  it("Hub verlinkt Kältetechniker-Karte", () => {
    expect(hubSrc).toContain('detailHref: "/berufe/kaeltetechniker"');
  });
  it("Sitemap enthält /berufe/kaeltetechniker genau einmal", () => {
    const urls = sitemapMod.default().map((e: { url: string | URL }) => String(e.url));
    expect(urls.filter((u) => u === "https://www.phe-perm.de/berufe/kaeltetechniker")).toHaveLength(1);
  });
});

describe("Kältetechniker – Registry", () => {
  it("in professions + publishedProfessions + professionBySlug", () => {
    expect(professions.some((p) => p.slug === "kaeltetechniker")).toBe(true);
    expect(publishedProfessions.some((p) => p.slug === "kaeltetechniker")).toBe(true);
    expect(professionBySlug["kaeltetechniker"]).toBe(kaeltetechniker);
  });
});
