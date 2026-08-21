// Welche Beruf-x-Ort-Kombinationen bekommen eine Seite?
//
// Die Schwelle ist der eigentliche Schutz gegen Doorway Pages: Eine Seite
// entsteht nur, wenn dahinter echte Stellen stehen. Sie wächst damit
// automatisch mit dem Stellenbestand mit — und verschwindet wieder, wenn
// Stellen besetzt werden.

import { JOBS, distanceKm, type Job } from "../app/jobs/data";
import { matchJobsForConfig } from "../content-engine/job-matching";
import { allCities, jobCities, type CityBase } from "./job-cities";
import { jobRoles, type JobRole } from "./job-roles";
import { roleCityNote } from "./role-city-notes";

/** Mindestens so viele passende Stellen im Umkreis der Stadt. */
export const MIN_JOBS_IN_RADIUS = 3;
/** Davon mindestens eine in dieser Entfernung — sonst nur Fernstellen. */
export const LOCAL_RADIUS_KM = 30;

export type RoleCityJob = { job: Job; distance: number };

/** Passende Stellen einer Rolle im Umkreis einer Stadt, nach Entfernung sortiert. */
export function jobsForRoleInCity(role: JobRole, city: CityBase): RoleCityJob[] {
  const matched = matchJobsForConfig(JOBS, role.jobMatch, role.slug).matches.map(m => m.job);
  return matched
    .filter(j => !j.nationwide)
    .map(job => ({ job, distance: Math.round(distanceKm(city.lat, city.lng, job.lat, job.lng)) }))
    .filter(({ distance }) => distance <= city.radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

export function isViable(role: JobRole, city: CityBase): boolean {
  // Ohne eigenen Absatz zu dieser Kombination entsteht keine Seite: Berufsbild
  // und Stadttext allein sind über Nachbarseiten hinweg zu ähnlich.
  if (!roleCityNote(role.slug, city.slug)) return false;

  const hits = jobsForRoleInCity(role, city);
  return (
    hits.length >= MIN_JOBS_IN_RADIUS &&
    hits.some(h => h.distance <= LOCAL_RADIUS_KM)
  );
}

export type RoleCityPage = { role: JobRole; city: CityBase };

/**
 * Ab dieser Überschneidung der Stellenmengen gelten zwei Städte derselben Rolle
 * als dieselbe Seite. Essen und Bochum etwa listen denselben Bestand — zwei
 * Seiten, die sich nur im Ortsnamen unterscheiden, sind für Google ein Duplikat.
 */
export const MAX_JOB_SET_OVERLAP = 0.8;

function jaccard(a: Set<string>, b: Set<string>): number {
  const schnitt = [...a].filter(x => b.has(x)).length;
  const vereinigung = new Set([...a, ...b]).size;
  return vereinigung === 0 ? 0 : schnitt / vereinigung;
}

/**
 * Wer bei gleicher Stellenmenge die Seite bekommt: zuerst die Stadt mit dem
 * stärksten echten Ortsbezug (Stellen direkt vor Ort), dann die mit belegter
 * Suchnachfrage, zuletzt alphabetisch für ein stabiles Ergebnis.
 */
function priority(role: JobRole, city: CityBase): [number, number, string] {
  const local = jobsForRoleInCity(role, city).filter(h => h.distance <= LOCAL_RADIUS_KM).length;
  const hasCityPage = jobCities.some(c => c.slug === city.slug) ? 0 : 1;
  return [-local, hasCityPage, city.slug];
}

/**
 * Alle Kombinationen, die die Schwelle erreichen — entdoppelt: Zeigt eine Stadt
 * im Wesentlichen dieselben Stellen wie eine bereits aufgenommene Stadt
 * derselben Rolle, entsteht dafür keine zweite Seite.
 */
export function viableRoleCityPages(): RoleCityPage[] {
  const out: RoleCityPage[] = [];

  for (const role of jobRoles) {
    const candidates = allCities
      .filter(city => isViable(role, city))
      .sort((a, b) => {
        const [la, pa, sa] = priority(role, a);
        const [lb, pb, sb] = priority(role, b);
        return la - lb || pa - pb || sa.localeCompare(sb);
      });

    const accepted: { city: CityBase; ids: Set<string> }[] = [];
    for (const city of candidates) {
      const ids = new Set(jobsForRoleInCity(role, city).map(h => h.job.id));
      if (accepted.some(a => jaccard(a.ids, ids) > MAX_JOB_SET_OVERLAP)) continue;
      accepted.push({ city, ids });
      out.push({ role, city });
    }
  }

  return out;
}

/** Gehaltsspanne der tatsächlich gelisteten Stellen — echte Zahl je Seite. */
export function salaryRangeOf(hits: RoleCityJob[]): { min: number; max: number } | null {
  const values: number[] = [];
  for (const { job } of hits) {
    const nums = job.salary.match(/\d{1,3}(?:\.\d{3})+/g) ?? [];
    for (const n of nums) {
      const v = parseInt(n.replace(/\./g, ""), 10);
      if (v >= 10000) values.push(v);
    }
  }
  if (!values.length) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
}
