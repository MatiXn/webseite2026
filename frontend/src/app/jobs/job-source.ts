// Zusammenführung der beiden Job-Quellen.
//
// `data.ts` ist die Wahrheit über den Stellenbestand: dort stehen Inhalt,
// stabile ID und die URL. Das Google Sheet ist das Steuerwerkzeug für die
// tägliche Pflege — es kann Stellen deaktivieren und die schnell
// veränderlichen Felder überschreiben (Gehalt, Kurzbeschreibung, Tags,
// Benefits).
//
// Daraus folgen zwei Regeln:
//   1. Eine Sheet-Zeile ohne Gegenstück in `data.ts` wird nicht ausgeliefert.
//      Vorher erzeugte das Sheet Listeneinträge mit laufender Zeilennummer als
//      ID — jede solche Zeile verlinkte auf einen 404.
//   2. Eine Stelle aus `data.ts` ohne Sheet-Zeile wird ausgeliefert, solange
//      sie nicht `active: false` trägt. So lassen sich Stellen vollständig im
//      Repository pflegen, ohne dass jemand das Sheet nachziehen muss.

import { JOBS, type Job } from "./data";
import { slugify } from "../../lib/slug";

export type SheetRow = {
  title: string;
  city: string;
  region?: string;
  salary?: string;
  category?: string;
  description?: string;
  tags?: string[];
  benefits?: string[];
  aktiv: boolean;
};

/** Vergleichsschlüssel aus Titel und Ort — unabhängig von der Zeilenposition. */
function matchKey(title: string, city: string): string {
  return slugify(`${title} ${city}`);
}

const BY_KEY = new Map<string, Job>();
for (const job of JOBS) {
  BY_KEY.set(matchKey(job.title, job.city), job);
  for (const alias of job.sheetAliases ?? []) {
    BY_KEY.set(matchKey(alias, job.city), job);
  }
}

export function findJobForSheetRow(row: { title: string; city: string }): Job | undefined {
  return BY_KEY.get(matchKey(row.title, row.city));
}

export type MergeResult = {
  /** Auslieferbare Stellen — jede hat garantiert eine Detailseite. */
  jobs: Job[];
  /** Sheet-Zeilen ohne Gegenstück in data.ts. Brauchen redaktionelle Pflege. */
  unmatched: { title: string; city: string }[];
  /** Stellen aus data.ts, die (noch) keine Sheet-Zeile haben. Nur Information. */
  onlyInRepo: { id: string; title: string; city: string }[];
};

export function mergeSheetJobs(rows: SheetRow[]): MergeResult {
  const jobs: Job[] = [];
  const unmatched: { title: string; city: string }[] = [];
  const ausSheet = new Set<string>();

  for (const row of rows) {
    if (!row.title) continue;

    const base = findJobForSheetRow(row);
    if (!base) {
      if (row.aktiv) unmatched.push({ title: row.title, city: row.city });
      continue;
    }

    // Die Sheet-Zeile hat das letzte Wort über die Sichtbarkeit — auch wenn sie
    // die Stelle abschaltet.
    ausSheet.add(base.id);
    if (!row.aktiv) continue;

    // Sheet-Werte übernehmen, wo sie gepflegt sind; sonst den Stand aus data.ts.
    jobs.push({
      ...base,
      salary: row.salary?.trim() || base.salary,
      description: row.description?.trim() || base.description,
      tags: row.tags?.length ? row.tags : base.tags,
      benefits: row.benefits?.length ? row.benefits : base.benefits,
    });
  }

  // Stellen, die nur im Repository gepflegt sind, laufen mit — sonst müsste
  // jede neu angelegte Stelle zusätzlich von Hand ins Sheet übertragen werden.
  const onlyInRepo: { id: string; title: string; city: string }[] = [];
  for (const job of JOBS) {
    if (ausSheet.has(job.id) || job.active === false) continue;
    onlyInRepo.push({ id: job.id, title: job.title, city: job.city });
    jobs.push(job);
  }

  return { jobs, unmatched, onlyInRepo };
}
