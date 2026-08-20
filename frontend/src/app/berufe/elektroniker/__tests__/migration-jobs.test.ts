import { describe, it, expect } from "vitest";
import { JOBS } from "../../../jobs/data";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { elektroniker } from "../../../../content/professions/elektroniker";
import { jobPath } from "../../../../lib/slug";

const result = matchJobsForProfession(JOBS, elektroniker);
const matches = result.matches;

describe("Elektroniker-Migration – Jobs", () => {
  it("1 – Matcher wird verwendet (Ergebnisse vorhanden)", () => {
    expect(result.totalMatched).toBeGreaterThan(0);
  });

  it("2 – maximal sechs sichtbar", () => {
    expect(matches.length).toBeLessThanOrEqual(6);
    expect(matches.length).toBe(6);
  });

  it("3 – nur matched Jobs", () => {
    expect(matches.every(m => m.matched)).toBe(true);
  });

  it("4 – keine excluded Jobs", () => {
    expect(matches.every(m => !m.excluded)).toBe(true);
  });

  it("5 – kanonische Slug-URLs", () => {
    for (const m of matches) expect(jobPath(m.job)).toMatch(/^\/jobs\/.+-\w+$/);
  });

  it("6 – keine numerischen Job-URLs", () => {
    for (const m of matches) expect(/^\/jobs\/\d+$/.test(jobPath(m.job))).toBe(false);
  });

  it("7 – sichtbare Reihenfolge ist deterministisch (Matcher-Reihenfolge)", () => {
    const a = matchJobsForProfession(JOBS, elektroniker).matches.map(m => m.job.id);
    expect(a).toEqual(matches.map(m => m.job.id));
    expect(a).toEqual(["28", "30", "1", "11", "12", "13"]);
  });
});
