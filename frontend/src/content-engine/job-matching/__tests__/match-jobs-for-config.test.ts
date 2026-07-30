import { describe, it, expect } from "vitest";
import { matchJobsForConfig, matchJobsForProfession, matchJobToConfig, matchJobToProfession } from "../index";
import { JOBS } from "../../../app/jobs/data";
import { elektroniker } from "../../../content/professions/elektroniker";
import { mechatroniker } from "../../../content/professions/mechatroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";

const professions = [elektroniker, mechatroniker, servicetechniker, spsAutomatisierung];

describe("generischer Matcher-Kern (matchJobsForConfig / matchJobToConfig)", () => {
  it("1 – matchJobsForConfig == matchJobsForProfession (alle vier Professionen, tief gleich)", () => {
    for (const p of professions) {
      const viaConfig = matchJobsForConfig(JOBS, p.jobMatch, p.slug);
      const viaProfession = matchJobsForProfession(JOBS, p);
      expect(viaConfig).toEqual(viaProfession);
    }
  });

  it("2 – matchJobToConfig == matchJobToProfession (je Job, tief gleich)", () => {
    for (const job of JOBS) {
      expect(matchJobToConfig(job, elektroniker.jobMatch, elektroniker.slug)).toEqual(matchJobToProfession(job, elektroniker));
    }
  });

  it("3 – Context-ID landet in professionSlug", () => {
    const job = JOBS[0];
    expect(matchJobToConfig(job, elektroniker.jobMatch, "beliebige-context-id").professionSlug).toBe("beliebige-context-id");
  });

  it("4 – Kern ist deterministisch", () => {
    const a = matchJobsForConfig(JOBS, spsAutomatisierung.jobMatch, "sps");
    const b = matchJobsForConfig(JOBS, spsAutomatisierung.jobMatch, "sps");
    expect(a).toEqual(b);
  });
});
