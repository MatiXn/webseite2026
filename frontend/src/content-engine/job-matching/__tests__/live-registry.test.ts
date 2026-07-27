import { describe, it, expect } from "vitest";
import { matchJobsForProfession } from "../match-jobs-for-profession";
import { JOBS } from "../../../app/jobs/data";
import { professions } from "../../../content/professions";
import { elektroniker } from "../../../content/professions/elektroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";

describe("Job-Matching gegen die Live-Registry", () => {
  it("1 – veröffentlichte Profession Elektroniker liefert Treffer, keiner ausgeschlossen", () => {
    const r = matchJobsForProfession(JOBS, elektroniker);
    expect(r.totalMatched).toBeGreaterThan(0);
    for (const m of r.matches) {
      expect(m.matched).toBe(true);
      expect(m.excluded).toBe(false);
    }
  });

  it("2 – für jede Profession ist kein Treffer zugleich ausgeschlossen, rankingIndex ist lückenlos", () => {
    for (const p of professions) {
      const r = matchJobsForProfession(JOBS, p);
      expect(r.matches.length).toBeLessThanOrEqual(p.jobMatch.maxJobs);
      r.matches.forEach((m, i) => {
        expect(m.excluded).toBe(false);
        expect(m.matched).toBe(true);
        expect(m.rankingIndex).toBe(i);
      });
    }
  });

  it("3 – Zählung ist konsistent: matched + excluded + unmatched === Gesamtzahl", () => {
    for (const p of professions) {
      const r = matchJobsForProfession(JOBS, p);
      expect(r.totalMatched + r.excludedCount + r.unmatchedCount).toBe(JOBS.length);
    }
  });

  it("4 – SPS-Draft findet den SPS-Job mit hoher Konfidenz", () => {
    const r = matchJobsForProfession(JOBS, spsAutomatisierung);
    const sps = r.matches.find((m) => m.job.id === "7");
    expect(sps?.confidence).toBe("high");
  });

  it("5 – Servicetechniker-Draft matcht mindestens die Service-getaggten Stellen", () => {
    const r = matchJobsForProfession(JOBS, servicetechniker);
    expect(r.totalMatched).toBeGreaterThanOrEqual(3);
    expect(
      r.matches.some(
        (m) => m.matchedSignals.includes("tag") && m.matchedSignals.includes("title"),
      ),
    ).toBe(true);
  });

  it("6 – über alle Professionen: maxJobs eingehalten, matchedSignals ohne Duplikate", () => {
    for (const p of professions) {
      const r = matchJobsForProfession(JOBS, p);
      expect(r.matches.length).toBeLessThanOrEqual(p.jobMatch.maxJobs);
      for (const m of r.matches) {
        expect(new Set(m.matchedSignals).size).toBe(m.matchedSignals.length);
      }
    }
  });
});
