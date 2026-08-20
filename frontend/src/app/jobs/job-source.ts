// Zusammenführung der beiden Job-Quellen.
//
// Das Google Sheet steuert, welche Stellen aktiv ausgeschrieben sind, und hält
// die schnell veränderlichen Felder (Gehalt, Kurzbeschreibung, Tags, Benefits).
// `data.ts` hält die redaktionelle Tiefe (Einleitung, Aufgaben, Profil) und
// vergibt die stabile ID, aus der die URL entsteht.
//
// Entscheidend: Es dürfen nur Stellen ausgeliefert werden, für die auch eine
// Detailseite existiert. Vorher erzeugte das Sheet Listeneinträge mit
// laufender Zeilennummer als ID — jede Zeile ohne Gegenstück in `data.ts`
// verlinkte damit auf einen 404.

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
};

export function mergeSheetJobs(rows: SheetRow[]): MergeResult {
  const jobs: Job[] = [];
  const unmatched: { title: string; city: string }[] = [];

  for (const row of rows) {
    if (!row.aktiv || !row.title) continue;

    const base = findJobForSheetRow(row);
    if (!base) {
      unmatched.push({ title: row.title, city: row.city });
      continue;
    }

    // Sheet-Werte übernehmen, wo sie gepflegt sind; sonst den Stand aus data.ts.
    jobs.push({
      ...base,
      salary: row.salary?.trim() || base.salary,
      description: row.description?.trim() || base.description,
      tags: row.tags?.length ? row.tags : base.tags,
      benefits: row.benefits?.length ? row.benefits : base.benefits,
    });
  }

  return { jobs, unmatched };
}
