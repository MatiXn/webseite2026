import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { matchJobsForProfession, matchJobToProfession } from "../../../../content-engine/job-matching";
import { buildProfessionSchema } from "../../../../content-engine/schema";
import { buildProfessionInternalLinks } from "../../../../content-engine/internal-links";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { spsAutomatisierung } from "../../../../content/professions/sps-automatisierung";
import { elektroniker } from "../../../../content/professions/elektroniker";
import { mechatroniker } from "../../../../content/professions/mechatroniker";
import { servicetechniker } from "../../../../content/professions/servicetechniker";
import { professionBySlug } from "../../../../content/professions";
import { JOBS } from "../../../jobs/data";

const matches = matchJobsForProfession(JOBS, spsAutomatisierung).matches;
const visibleJobs = matches.map(x => x.job);
const graph = buildProfessionSchema(spsAutomatisierung, visibleJobs);
const nodes = graph["@graph"] as ReadonlyArray<Record<string, unknown>>;
const typeOf = (t: string) => nodes.find(n => n["@type"] === t);
const links = buildProfessionInternalLinks({ profession: spsAutomatisierung, professionRegistry: { professionBySlug }, jobMatches: matches });

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");
const route = read("../page.tsx");
const template = read("../../../../content-engine/templates/ProfessionPageTemplate.tsx");
const hub = read("../../page.tsx");
const sitemap = read("../../../sitemap.ts");
const jobDetail = read("../../../jobs/[slug]/page.tsx");
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const getJob = (id: string) => { const j = JOBS.find(x => x.id === id); if (!j) throw new Error("job fehlt"); return j; };

describe("SPS/Automatisierung – Schema", () => {
  it("1 – CollectionPage, BreadcrumbList, FAQPage, ItemList", () => {
    expect(nodes.map(n => n["@type"])).toEqual(["CollectionPage", "BreadcrumbList", "FAQPage", "ItemList"]);
  });
  it("2 – kein JobPosting, keine Organization-Duplikation, keine doppelten @ids", () => {
    const json = JSON.stringify(graph);
    expect(json).not.toContain("JobPosting");
    expect(json).not.toContain('"@type":"Organization"');
    const ids = nodes.map(n => String(n["@id"]));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("3 – FAQ sichtbar = Schema; ItemList = sichtbare Jobs", () => {
    const faq = typeOf("FAQPage") as { mainEntity: { name: string }[] };
    expect(faq.mainEntity.map(q => q.name)).toEqual(spsAutomatisierung.faq.map(f => f.q));
    const list = typeOf("ItemList") as { numberOfItems: number; itemListElement: { name: string }[] };
    expect(list.numberOfItems).toBe(visibleJobs.length);
    expect(list.itemListElement.map(e => e.name)).toEqual(visibleJobs.map(j => j.title));
  });
});

describe("SPS/Automatisierung – interne Links", () => {
  it("1 – Breadcrumb Startseite → Berufe → SPS", () => {
    expect(links.breadcrumbs.map(b => b.label)).toEqual(["Startseite", "Berufe", "SPS-Programmierer und Automatisierungstechniker"]);
  });
  it("2 – Related nur auf published Ziele (Elektroniker, Mechatroniker)", () => {
    expect(links.relatedProfessionLinks.map(l => l.href)).toEqual(["/berufe/elektroniker", "/berufe/mechatroniker"]);
    for (const l of links.relatedProfessionLinks) {
      expect(professionBySlug[l.professionSlug ?? ""]?.publication.published).toBe(true);
    }
  });
  it("3 – keine Draft-/numerischen-/talente-Links; Core + Job Links korrekt", () => {
    for (const l of [...links.breadcrumbs, ...links.allLinks]) {
      expect(l.href.startsWith("/talente-finden")).toBe(false);
      expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
    }
    expect(links.coreLinks.map(l => l.type).sort()).toEqual(["contact", "jobs", "parent", "resume", "service"]);
    expect(links.jobLinks.map(l => l.jobId)).toEqual(visibleJobs.map(j => j.id));
  });
});

describe("SPS/Automatisierung – Route, Template, Hub, Sitemap, Backlinks", () => {
  it("1 – Route dünn, nutzt Template, keine lokale Logik", () => {
    expect(route).toContain("ProfessionPageTemplate profession={spsAutomatisierung}");
    expect(route).toContain("buildProfessionMetadata(spsAutomatisierung)");
    expect(route.includes("matchJobsForProfession")).toBe(false);
    expect(count(route, /<h1/g)).toBe(0);
  });
  it("2 – Template unverändert (keine SPS-Sonderlogik)", () => {
    expect(template.includes("sps-automatisierung")).toBe(false);
    expect(template.includes("SPS")).toBe(false);
    expect(template.includes("slug ===")).toBe(false);
  });
  it("3 – Hub verlinkt, Sitemap genau einmal", () => {
    expect(hub).toContain('detailHref: "/berufe/sps-automatisierung"');
    expect(count(sitemap, /\/berufe\/sps-automatisierung/g)).toBe(1);
  });
  it("4 – Backlink matcher-basiert; nur id 7 matcht, fachfremde nicht; andere Backlinks intakt", () => {
    expect(jobDetail).toContain("matchJobToProfession(job, spsAutomatisierung).matched");
    expect(jobDetail).toContain("Mehr zum Berufsbild SPS-/Automatisierung →");
    expect(jobDetail).toContain('job.category === "elektro"');
    expect(jobDetail).toContain('job.category === "mechatronik"');
    expect(matchJobToProfession(getJob("7"), spsAutomatisierung).matched).toBe(true);
    expect(matchJobToProfession(getJob("12"), spsAutomatisierung).matched).toBe(false);
  });
  it("5 – Elektroniker/Mechatroniker/Servicetechniker ohne Metadata-Regression", () => {
    expect(buildProfessionMetadata(elektroniker).title).toEqual({ absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" });
    expect(buildProfessionMetadata(mechatroniker).title).toEqual({ absolute: "Mechatroniker Jobs in Festanstellung | PHE-Perm" });
    expect(buildProfessionMetadata(servicetechniker).title).toEqual({ absolute: "Servicetechniker Jobs in Festanstellung | PHE-Perm" });
  });
});
