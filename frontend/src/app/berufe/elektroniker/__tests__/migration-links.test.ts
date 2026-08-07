import { describe, it, expect } from "vitest";
import { JOBS } from "../../../jobs/data";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { buildProfessionInternalLinks } from "../../../../content-engine/internal-links";
import { elektroniker } from "../../../../content/professions/elektroniker";
import { professionBySlug } from "../../../../content/professions";

const matches = matchJobsForProfession(JOBS, elektroniker).matches;
const links = buildProfessionInternalLinks({
  profession: elektroniker,
  professionRegistry: { professionBySlug },
  jobMatches: matches,
});

describe("Elektroniker-Migration – interne Links", () => {
  it("1 – sichtbare Breadcrumbs aus dem Builder (Startseite, Berufe, Elektroniker)", () => {
    expect(links.breadcrumbs.map(b => b.label)).toEqual(["Startseite", "Berufe", "Elektroniker"]);
    expect(links.breadcrumbs.map(b => b.href)).toEqual(["/", "/berufe", "/berufe/elektroniker"]);
  });

  it("2 – Core Links aus dem Builder (5 Kernziele)", () => {
    expect(links.coreLinks.map(l => l.type).sort()).toEqual(["contact", "jobs", "parent", "resume", "service"]);
  });

  it("3 – keine Draft-Links", () => {
    for (const l of links.allLinks) {
      if (l.professionSlug) expect(professionBySlug[l.professionSlug]?.publication.published).toBe(true);
    }
  });

  it("4 – keine /talente-finden-Links", () => {
    for (const l of [...links.breadcrumbs, ...links.allLinks]) expect(l.href.startsWith("/talente-finden")).toBe(false);
  });

  it("5 – keine numerischen Job-Links", () => {
    for (const l of links.allLinks) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
  });

  it("6 – Related-Sektion: Cross-Links zu den spezialisierten Elektroniker-Seiten (Sprint 04/05)", () => {
    expect(links.relatedProfessionLinks.map(l => l.href)).toEqual([
      "/berufe/elektroniker-betriebstechnik",
      "/berufe/elektroniker-energie-gebaeudetechnik",
    ]);
  });
});
