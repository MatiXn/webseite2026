// Listen-Match: bewertet alle Jobs gegen eine Profession, sortiert deterministisch
// und begrenzt auf maxJobs. Rein und ohne Mutation der Eingabe.
import type { Job } from "../../app/jobs/data";
import type { ProfessionContent, JobMatchConfig } from "../../content/professions/types";
import type { JobMatchResult, ProfessionMatchList } from "./types";
import { matchJobToConfig } from "./match-job";

// Sortierung: Score absteigend, dann Veröffentlichungsdatum (ISO-String) absteigend,
// dann stabiler Tiebreak über die Job-id. Vollständig deterministisch.
function compareResults(a: JobMatchResult, b: JobMatchResult): number {
  if (b.score !== a.score) return b.score - a.score;
  const da = a.job.datePosted ?? "";
  const db = b.job.datePosted ?? "";
  if (da !== db) return db < da ? -1 : 1; // neueres Datum zuerst
  return a.job.id.localeCompare(b.job.id);
}

// Wird dieselbe Position an mehreren Standorten ausgeschrieben, tragen alle
// Stellen denselben Titel, denselben Score und dasselbe Veröffentlichungsdatum —
// und füllen damit die sichtbare Liste komplett aus. Sechs Servicetechniker-
// Stellen verdrängten so sämtliche anderen Treffer von einer Berufsseite.
//
// Deshalb: höchstens MAX_JE_TITEL Stellen desselben Titels vorn, der Rest
// rutscht ans Ende der Liste statt aus ihr heraus. Die Reihenfolge innerhalb
// beider Gruppen bleibt die sortierte — das Ergebnis ist weiterhin
// deterministisch.
const MAX_JE_TITEL = 2;

function diversifyByTitle(
  sorted: readonly JobMatchResult[],
  limit: number,
): readonly JobMatchResult[] {
  const gesehen = new Map<string, number>();
  const vorn: JobMatchResult[] = [];
  const hinten: JobMatchResult[] = [];

  for (const r of sorted) {
    const titel = r.job.title.trim().toLowerCase();
    const bisher = gesehen.get(titel) ?? 0;
    gesehen.set(titel, bisher + 1);
    (bisher < MAX_JE_TITEL ? vorn : hinten).push(r);
  }

  return [...vorn, ...hinten].slice(0, limit);
}

// Generischer Kern: Listen-Match gegen eine JobMatchConfig + stabile Context-ID.
// Domänenneutral (Profession ODER Industry). Sortierung/Begrenzung unverändert.
export function matchJobsForConfig(
  jobs: readonly Job[],
  jobMatch: JobMatchConfig,
  contextSlug: string,
): ProfessionMatchList {
  const all = jobs.map((job) => matchJobToConfig(job, jobMatch, contextSlug));

  const excludedCount = all.filter((r) => r.excluded).length;
  const matchedResults = all.filter((r) => r.matched);
  const unmatchedCount = all.length - matchedResults.length - excludedCount;

  const sorted = [...matchedResults].sort(compareResults);
  const limit = Math.max(0, jobMatch.maxJobs);
  const matches = diversifyByTitle(sorted, limit).map((r, i) => ({ ...r, rankingIndex: i }));

  return {
    matches,
    totalMatched: matchedResults.length,
    excludedCount,
    unmatchedCount,
  };
}

// Profession-Wrapper: unveränderte öffentliche API, delegiert an den generischen Kern.
export function matchJobsForProfession(
  jobs: readonly Job[],
  profession: ProfessionContent,
): ProfessionMatchList {
  return matchJobsForConfig(jobs, profession.jobMatch, profession.slug);
}
