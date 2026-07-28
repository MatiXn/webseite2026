import { describe, it, expect } from "vitest";
import { ProfessionPageTemplate } from "../ProfessionPageTemplate";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { buildProfessionSchema } from "../../schema";
import { elektroniker } from "../../../content/professions/elektroniker";

describe("ProfessionPageTemplate", () => {
  it("18 – rendert ohne Fehler und mutiert die Profession-Eingabe nicht", () => {
    const snapshot = JSON.parse(JSON.stringify(elektroniker));
    const element = ProfessionPageTemplate({ profession: elektroniker });
    expect(element).toBeTruthy();
    expect(JSON.parse(JSON.stringify(elektroniker))).toEqual(snapshot);
  });

  it("19 – zugrundeliegende Engine-Ausgaben sind deterministisch", () => {
    const jobsA = matchJobsForProfession(JOBS, elektroniker).matches.map(m => m.job);
    const jobsB = matchJobsForProfession(JOBS, elektroniker).matches.map(m => m.job);
    expect(jobsA.map(j => j.id)).toEqual(jobsB.map(j => j.id));
    expect(buildProfessionSchema(elektroniker, jobsA)).toEqual(buildProfessionSchema(elektroniker, jobsB));
  });
});
