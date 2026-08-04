import { describe, it, expect } from "vitest";
import { validateProfession } from "../../../../content-engine/validation";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { servicetechniker } from "../../../../content/professions/servicetechniker";
import { company } from "../../../../content/company";
import { JOBS } from "../../../jobs/data";
import { jobPath } from "../../../../lib/slug";

describe("Servicetechniker – Config", () => {
  it("1 – validiert ohne Errors", () => {
    const r = validateProfession(servicetechniker);
    expect(r.valid, r.errors.map(e => e.code).join(", ")).toBe(true);
  });
  it("2 – Published-Flags konsistent", () => {
    expect(servicetechniker.status).toBe("published");
    expect(servicetechniker.publication).toMatchObject({
      published: true, indexable: true, includeInSitemap: true, showInProfessionHub: true, showRelatedLinks: true,
    });
  });
  it("3 – Canonical korrekt", () => {
    expect(servicetechniker.canonicalPath).toBe("/berufe/servicetechniker");
  });
  it("4 – vollständige FAQ ohne Duplikate", () => {
    expect(servicetechniker.faq.length).toBeGreaterThanOrEqual(6);
    for (const f of servicetechniker.faq) {
      expect(f.q.trim().length).toBeGreaterThan(0);
      expect(f.a.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(servicetechniker.faq.map(f => f.q)).size).toBe(servicetechniker.faq.length);
  });
  it("5 – keine verbotenen Claims", () => {
    const text = JSON.stringify(servicetechniker).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "100 %", "100%", "nummer 1"]) {
      expect(text.includes(bad)).toBe(false);
    }
  });
  it("6 – keine Unternehmensstammdaten dupliziert", () => {
    const text = JSON.stringify(servicetechniker);
    for (const nap of [company.email, company.phone, company.street, company.postalCode]) {
      expect(text.includes(nap)).toBe(false);
    }
  });
  it("7 – jobMatch konservativ (Sprint 02: maxJobs 8, Strategie unverändert)", () => {
    expect(servicetechniker.jobMatch).toEqual({
      tags: ["Service"], keywords: ["Servicetechniker", "Kundendienst"], maxJobs: 8, fallback: "hint-and-joblist",
    });
  });
});

const m = buildProfessionMetadata(servicetechniker);
const result = matchJobsForProfession(JOBS, servicetechniker);

describe("Servicetechniker – Metadata", () => {
  it("1 – Title exakt", () => {
    expect(m.title).toEqual({ absolute: "Servicetechniker Jobs in Festanstellung | PHE-Perm" });
  });
  it("2 – Canonical exakt", () => {
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/servicetechniker");
  });
  it("3 – Open-Graph-URL = Canonical", () => {
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });
  it("4 – index/follow (jetzt published)", () => {
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });
  it("5 – kein doppeltes Markensuffix", () => {
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
});

describe("Servicetechniker – Jobs (Matching-Analyse)", () => {
  it("1 – 7 Treffer, alle 7 sichtbar (Sprint 02: maxJobs 8), 0 ausgeschlossen", () => {
    expect(result.totalMatched).toBe(7);
    expect(result.matches.length).toBe(7);
    expect(result.excludedCount).toBe(0);
  });
  it("2 – sichtbare Reihenfolge stabil (Score desc)", () => {
    expect(result.matches.map(x => x.job.id)).toEqual(["14", "18", "2", "21", "16", "23", "3"]);
  });
  it("3 – nur matched, alle high/medium, echte Servicetechniker-Rollen", () => {
    expect(result.matches.every(x => x.matched && !x.excluded)).toBe(true);
    expect(result.matches.every(x => x.confidence === "high" || x.confidence === "medium")).toBe(true);
  });
  it("4 – kanonische Slug-URLs, keine numerischen", () => {
    for (const x of result.matches) {
      expect(jobPath(x.job)).toMatch(/^\/jobs\/.+-\w+$/);
      expect(/^\/jobs\/\d+$/.test(jobPath(x.job))).toBe(false);
    }
  });
  it("5 – Grenzfall id 19 (Anlagenmechaniker SHK) bleibt unter der Schwelle, NICHT gematcht", () => {
    const j19 = JOBS.find(j => j.id === "19");
    expect(j19).toBeTruthy();
    if (j19) {
      const r = matchJobsForProfession([j19], servicetechniker);
      expect(r.totalMatched).toBe(0);
    }
  });
});
