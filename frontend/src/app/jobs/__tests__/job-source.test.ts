import { describe, it, expect } from "vitest";
import { mergeSheetJobs, findJobForSheetRow, type SheetRow } from "../job-source";
import { JOBS } from "../data";
import { jobIdFromParam, jobSlug } from "../../../lib/slug";
import sheetSnapshot from "./sheet-snapshot.json";

// Momentaufnahme des Google Sheets vom 20.08.2026 (33 aktive Zeilen).
// Sie sichert ab, dass jede ausgeschriebene Stelle eine Detailseite hat —
// vorher liefen 8 der 33 Listeneinträge auf einen 404.
const snapshotRows: SheetRow[] = (sheetSnapshot as { title: string; city: string }[]).map(j => ({
  title: j.title,
  city: j.city,
  aktiv: true,
}));

describe("job-source: Sheet und data.ts zusammenführen", () => {
  it("1 – jede Zeile des Sheet-Snapshots findet ihre Detailseite", () => {
    const { unmatched } = mergeSheetJobs(snapshotRows);
    expect(unmatched).toEqual([]);
  });

  it("2 – liefert genau so viele Stellen wie das Sheet aktive Zeilen hat", () => {
    const { jobs } = mergeSheetJobs(snapshotRows);
    expect(jobs).toHaveLength(snapshotRows.length);
  });

  it("3 – eine unbekannte Zeile wird gemeldet statt verlinkt", () => {
    const { jobs, unmatched } = mergeSheetJobs([
      ...snapshotRows,
      { title: "Fliesenleger (m/w/d)", city: "Kiel", aktiv: true },
    ]);
    expect(unmatched).toEqual([{ title: "Fliesenleger (m/w/d)", city: "Kiel" }]);
    expect(jobs.some(j => j.city === "Kiel")).toBe(false);
  });

  it("4 – inaktive Zeilen fallen raus", () => {
    const { jobs } = mergeSheetJobs([{ ...snapshotRows[0], aktiv: false }]);
    expect(jobs).toEqual([]);
  });

  it("5 – die ID hängt am Job, nicht an der Zeilenposition", () => {
    const reversed = [...snapshotRows].reverse();
    const forward = mergeSheetJobs(snapshotRows).jobs;
    const backward = mergeSheetJobs(reversed).jobs;
    for (const job of forward) {
      const same = backward.find(j => j.title === job.title && j.city === job.city);
      expect(same?.id).toBe(job.id);
    }
  });

  it("6 – Sheet-Werte überschreiben, leere Felder lassen data.ts stehen", () => {
    const row: SheetRow = { ...snapshotRows[0], salary: "99.000 € /Jahr", description: "" };
    const [job] = mergeSheetJobs([row]).jobs;
    const base = JOBS.find(j => j.id === job.id)!;
    expect(job.salary).toBe("99.000 € /Jahr");
    expect(job.description).toBe(base.description);
  });

  it("7 – abweichende Sheet-Schreibweisen werden über sheetAliases aufgelöst", () => {
    const hit = findJobForSheetRow({ title: "Servicetechniker Laser- Robotik (m/w/d)", city: "Dresden" });
    expect(hit?.id).toBe("32");
  });

  it("8 – jede gelieferte Stelle hat eine auflösbare URL", () => {
    for (const job of mergeSheetJobs(snapshotRows).jobs) {
      const slug = `${jobSlug(job)}-${job.id}`;
      expect(jobIdFromParam(slug)).toBe(job.id);
      expect(JOBS.some(j => j.id === job.id)).toBe(true);
    }
  });
});
