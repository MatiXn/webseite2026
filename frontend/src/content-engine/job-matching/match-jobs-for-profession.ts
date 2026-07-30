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
  const matches = sorted.slice(0, limit).map((r, i) => ({ ...r, rankingIndex: i }));

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
