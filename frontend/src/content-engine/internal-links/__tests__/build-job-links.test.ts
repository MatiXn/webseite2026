import { describe, it, expect } from "vitest";
import { buildJobLinks } from "../build-job-links";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { elektroniker } from "../../../content/professions/elektroniker";
import { jobPath } from "../../../lib/slug";

const matches = matchJobsForProfession(JOBS, elektroniker).matches;

describe("buildJobLinks", () => {
  it("1 – nur matched Jobs werden ausgegeben", () => {
    const links = buildJobLinks(matches);
    expect(links.length).toBe(matches.filter((m) => m.matched && !m.excluded).length);
    expect(links.every((l) => l.type === "job-detail")).toBe(true);
  });

  it("2 – ausgeschlossene/nicht gematchte Ergebnisse fehlen", () => {
    const withExcluded = [...matches, { ...matches[0], matched: false, excluded: true }];
    const links = buildJobLinks(withExcluded);
    expect(links.length).toBe(matches.filter((m) => m.matched && !m.excluded).length);
  });

  it("3 – kanonische Slug-URLs, keine numerischen URLs", () => {
    const links = buildJobLinks(matches);
    links.forEach((l, i) => expect(l.href).toBe(jobPath(matches[i].job)));
    for (const l of links) expect(/^\/jobs\/\d+$/.test(l.href)).toBe(false);
  });

  it("4 – Label = echter Jobtitel, jobId als Datenfeld", () => {
    const links = buildJobLinks(matches);
    links.forEach((l, i) => {
      expect(l.label).toBe(matches[i].job.title);
      expect(l.jobId).toBe(matches[i].job.id);
    });
  });

  it("5 – Reihenfolge des Matchers bleibt erhalten", () => {
    const links = buildJobLinks(matches);
    expect(links.map((l) => l.jobId)).toEqual(matches.map((m) => m.job.id));
  });

  it("6 – Duplikate werden entfernt", () => {
    const links = buildJobLinks([...matches, matches[0]]);
    const hrefs = links.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("7 – mutiert die Eingabe nicht", () => {
    const snapshot = JSON.parse(JSON.stringify(matches));
    buildJobLinks(matches);
    expect(JSON.parse(JSON.stringify(matches))).toEqual(snapshot);
  });
});
