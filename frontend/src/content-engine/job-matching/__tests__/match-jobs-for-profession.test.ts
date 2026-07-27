import { describe, it, expect } from "vitest";
import { matchJobsForProfession } from "../match-jobs-for-profession";
import { JOBS, type Job } from "../../../app/jobs/data";
import { elektroniker } from "../../../content/professions/elektroniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";

function getJob(predicate: (j: Job) => boolean): Job {
  const job = JOBS.find(predicate);
  if (!job) throw new Error("Erwarteter Testjob nicht in JOBS gefunden.");
  return job;
}

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "test-1",
    title: "Testjob",
    category: "elektro",
    city: "Düsseldorf",
    region: "Nordrhein-Westfalen",
    lat: 51.2,
    lng: 6.78,
    salary: "40.000 €/Jahr",
    type: "Festanstellung",
    tags: [],
    description: "",
    posted: "vor 1 Tag",
    benefits: [],
    datePosted: "2026-06-01",
    ...overrides,
  };
}

const ELEKTRO_COUNT = JOBS.filter((j) => j.category === "elektro").length;

describe("matchJobsForProfession", () => {
  it("1 – Elektroniker matcht alle Elektro-Jobs, begrenzt auf maxJobs, ohne Ausschluss", () => {
    const r = matchJobsForProfession(JOBS, elektroniker);
    expect(r.totalMatched).toBe(ELEKTRO_COUNT);
    expect(r.matches.length).toBe(elektroniker.jobMatch.maxJobs);
    expect(r.excludedCount).toBe(0);
  });

  it("2 – Treffer sind nach Score absteigend sortiert mit fortlaufendem rankingIndex", () => {
    const r = matchJobsForProfession(JOBS, elektroniker);
    r.matches.forEach((m, i) => {
      expect(m.rankingIndex).toBe(i);
      expect(m.matched).toBe(true);
      if (i > 0) expect(m.score).toBeLessThanOrEqual(r.matches[i - 1].score);
    });
  });

  it("3 – SPS-Profession findet den SPS-Job (id 7), ohne Ausschluss", () => {
    const r = matchJobsForProfession(JOBS, spsAutomatisierung);
    expect(r.matches.some((m) => m.job.id === "7")).toBe(true);
    expect(r.excludedCount).toBe(0);
  });

  it("4 – der SPS-Job steht durch den höchsten Score an erster Stelle", () => {
    const r = matchJobsForProfession(JOBS, spsAutomatisierung);
    expect(r.matches[0]?.job.id).toBe("7");
  });

  it("5 – ausgeschlossene Jobs werden gezählt, nicht als Treffer geführt", () => {
    const jobs: Job[] = [
      getJob((j) => j.id === "7"),
      makeJob({ id: "x-exclude", category: "it", title: "Softwareentwickler (m/w/d)" }),
    ];
    const r = matchJobsForProfession(jobs, spsAutomatisierung);
    expect(r.excludedCount).toBe(1);
    expect(r.totalMatched).toBe(1);
    expect(r.unmatchedCount).toBe(0);
    expect(r.matches.map((m) => m.job.id)).toEqual(["7"]);
  });

  it("6 – klar unpassender Job zählt als unmatched", () => {
    const jobs: Job[] = [makeJob({ id: "u", category: "bau", title: "Gärtner", description: "Pflanzenpflege" })];
    const r = matchJobsForProfession(jobs, spsAutomatisierung);
    expect(r.totalMatched).toBe(0);
    expect(r.excludedCount).toBe(0);
    expect(r.unmatchedCount).toBe(1);
    expect(r.matches).toHaveLength(0);
  });

  it("7 – maxJobs begrenzt die Trefferliste, nicht aber totalMatched", () => {
    const r = matchJobsForProfession(JOBS, elektroniker);
    expect(r.matches.length).toBe(Math.min(ELEKTRO_COUNT, elektroniker.jobMatch.maxJobs));
    expect(r.totalMatched).toBe(ELEKTRO_COUNT);
  });

  it("8 – vollständig deterministisch (zwei Läufe identisch)", () => {
    const a = matchJobsForProfession(JOBS, spsAutomatisierung);
    const b = matchJobsForProfession(JOBS, spsAutomatisierung);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
