import { describe, it, expect } from "vitest";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { mechatroniker } from "../../../../content/professions/mechatroniker";
import { JOBS } from "../../../jobs/data";
import { jobPath } from "../../../../lib/slug";

const m = buildProfessionMetadata(mechatroniker);
const result = matchJobsForProfession(JOBS, mechatroniker);
const matches = result.matches;

describe("Mechatroniker – Metadata", () => {
  it("1 – Title exakt", () => {
    expect(m.title).toEqual({ absolute: "Mechatroniker Jobs in Festanstellung | PHE-Perm" });
  });
  it("2 – Canonical exakt", () => {
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/mechatroniker");
  });
  it("3 – Open-Graph-URL = Canonical", () => {
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });
  it("4 – index/follow", () => {
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });
  it("5 – kein doppeltes Markensuffix", () => {
    expect(((m.title as { absolute: string }).absolute.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
});

describe("Mechatroniker – Jobs", () => {
  it("1 – echte Treffer vorhanden", () => {
    expect(result.totalMatched).toBe(13);
  });
  it("2 – maximal sechs sichtbar", () => {
    expect(matches.length).toBe(6);
  });
  it("3 – nur matched Jobs", () => {
    expect(matches.every(x => x.matched)).toBe(true);
  });
  it("4 – keine ausgeschlossenen Jobs", () => {
    expect(matches.every(x => !x.excluded)).toBe(true);
    expect(result.excludedCount).toBe(0);
  });
  it("5 – keine fachfremden Treffer (alle Kategorie mechatronik)", () => {
    expect(matches.every(x => x.job.category === "mechatronik")).toBe(true);
  });
  it("6 – kanonische Slug-URLs, keine numerischen", () => {
    for (const x of matches) {
      expect(jobPath(x.job)).toMatch(/^\/jobs\/.+-\w+$/);
      expect(/^\/jobs\/\d+$/.test(jobPath(x.job))).toBe(false);
    }
  });
  it("7 – stabile, reproduzierbare Reihenfolge + Scores", () => {
    const again = matchJobsForProfession(JOBS, mechatroniker).matches;
    expect(again.map(x => x.job.id)).toEqual(matches.map(x => x.job.id));
    expect(matches.map(x => x.job.id)).toEqual(["26", "27", "29", "31", "32", "10"]);
    expect(matches.every(x => x.score === 100 && x.confidence === "high")).toBe(true);
  });
});
