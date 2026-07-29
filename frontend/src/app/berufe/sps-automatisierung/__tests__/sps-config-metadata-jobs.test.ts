import { describe, it, expect } from "vitest";
import { validateProfession } from "../../../../content-engine/validation";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { spsAutomatisierung } from "../../../../content/professions/sps-automatisierung";
import { company } from "../../../../content/company";
import { JOBS } from "../../../jobs/data";
import { jobPath } from "../../../../lib/slug";

describe("SPS/Automatisierung – Config", () => {
  it("1 – validiert ohne Errors", () => {
    const r = validateProfession(spsAutomatisierung);
    expect(r.valid, r.errors.map(e => e.code).join(", ")).toBe(true);
  });
  it("2 – Published-Flags konsistent", () => {
    expect(spsAutomatisierung.status).toBe("published");
    expect(spsAutomatisierung.publication).toMatchObject({
      published: true, indexable: true, includeInSitemap: true, showInProfessionHub: true, showRelatedLinks: true,
    });
  });
  it("3 – Canonical korrekt", () => {
    expect(spsAutomatisierung.canonicalPath).toBe("/berufe/sps-automatisierung");
  });
  it("4 – FAQ vollständig, ohne Duplikate", () => {
    expect(spsAutomatisierung.faq.length).toBeGreaterThanOrEqual(6);
    for (const f of spsAutomatisierung.faq) {
      expect(f.q.trim().length).toBeGreaterThan(0);
      expect(f.a.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(spsAutomatisierung.faq.map(f => f.q)).size).toBe(spsAutomatisierung.faq.length);
  });
  it("5 – keine verbotenen Claims / keine Unternehmensstammdaten", () => {
    const lower = JSON.stringify(spsAutomatisierung).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "100 %", "100%", "nummer 1"]) {
      expect(lower.includes(bad)).toBe(false);
    }
    const raw = JSON.stringify(spsAutomatisierung);
    for (const nap of [company.email, company.phone, company.street, company.postalCode]) {
      expect(raw.includes(nap)).toBe(false);
    }
  });
  it("6 – jobMatch = Variante B (keine freien keywords)", () => {
    expect(spsAutomatisierung.jobMatch).toEqual({
      category: ["it"],
      tags: ["SPS", "Siemens TIA Portal"],
      excludeKeywords: ["Softwareentwickler", "Applikationsentwickler", "Embedded"],
      maxJobs: 6,
      fallback: "hint-and-joblist",
    });
    expect("keywords" in spsAutomatisierung.jobMatch).toBe(false);
  });
});

const m = buildProfessionMetadata(spsAutomatisierung);
const result = matchJobsForProfession(JOBS, spsAutomatisierung);

describe("SPS/Automatisierung – Metadata", () => {
  it("1 – Title exakt", () => {
    expect(m.title).toEqual({ absolute: "SPS-Programmierer Jobs in Festanstellung | PHE-Perm" });
  });
  it("2 – Canonical exakt / OG-URL = Canonical", () => {
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/sps-automatisierung");
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });
  it("3 – index/follow (published)", () => {
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });
  it("4 – kein doppeltes Markensuffix", () => {
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
});

describe("SPS/Automatisierung – Jobs (konservativ, Variante B)", () => {
  it("1 – genau ein Treffer (id 7), 0 ausgeschlossen", () => {
    expect(result.totalMatched).toBe(1);
    expect(result.matches.length).toBe(1);
    expect(result.excludedCount).toBe(0);
    expect(result.matches[0].job.id).toBe("7");
  });
  it("2 – id 7: hoher Score, kanonische Slug-URL, keine numerische URL", () => {
    const only = result.matches[0];
    expect(only.confidence).toBe("high");
    expect(only.score).toBe(220);
    expect(/^\/jobs\/\d+$/.test(jobPath(only.job))).toBe(false);
  });
  it("3 – fachlich fragliche Elektro-/Mechatronik-Stellen (12/24/10) sind NICHT gematcht", () => {
    for (const id of ["12", "24", "10"]) {
      const j = JOBS.find(x => x.id === id);
      expect(j).toBeTruthy();
      if (j) expect(matchJobsForProfession([j], spsAutomatisierung).totalMatched).toBe(0);
    }
  });
});
