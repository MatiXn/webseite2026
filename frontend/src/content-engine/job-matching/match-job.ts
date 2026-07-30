// Einzel-Match: bewertet einen Job gegen eine Profession und leitet Konfidenz + Match-Flag ab.
// Rein und deterministisch. Nimmt eine bereits strukturell validierte Profession an
// (siehe content-engine/validation, EPIC 006C.1) und validiert die Config NICHT erneut —
// geprüft wird nur die minimale Job-Integrität (id + title vorhanden).
import type { Job } from "../../app/jobs/data";
import type { ProfessionContent, JobMatchConfig } from "../../content/professions/types";
import type { Confidence, JobMatchResult, MatchSource } from "./types";
import { CONFIDENCE_THRESHOLDS } from "./types";
import { scoreJob } from "./score-job";

function confidenceFromScore(score: number, excluded: boolean): Confidence {
  if (excluded) return "none";
  if (score >= CONFIDENCE_THRESHOLDS.high) return "high";
  if (score >= CONFIDENCE_THRESHOLDS.medium) return "medium";
  if (score >= CONFIDENCE_THRESHOLDS.low) return "low";
  return "none";
}

function isValidJob(job: Job): boolean {
  return (
    typeof job?.id === "string" &&
    job.id.trim().length > 0 &&
    typeof job?.title === "string" &&
    job.title.trim().length > 0
  );
}

// Deduplizierte Fundstellen in stabiler Reihenfolge (Reihenfolge des ersten Auftretens).
function uniqueSignals(sources: readonly MatchSource[]): readonly MatchSource[] {
  const seen = new Set<MatchSource>();
  const out: MatchSource[] = [];
  for (const s of sources) {
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

// Generischer Kern: bewertet einen Job gegen eine JobMatchConfig + stabile Context-ID.
// Domänenneutral (Profession ODER Industry); die Context-ID landet in JobMatchResult.professionSlug.
export function matchJobToConfig(job: Job, jobMatch: JobMatchConfig, contextSlug: string): JobMatchResult {
  if (!isValidJob(job)) {
    return {
      job,
      professionSlug: contextSlug,
      score: 0,
      confidence: "none",
      matched: false,
      excluded: false,
      reasons: [],
      exclusionReasons: [],
      matchedSignals: [],
    };
  }

  const scored = scoreJob(job, jobMatch);
  const confidence = confidenceFromScore(scored.score, scored.excluded);
  const matched = !scored.excluded && (confidence === "high" || confidence === "medium");

  return {
    job,
    professionSlug: contextSlug,
    score: scored.score,
    confidence,
    matched,
    excluded: scored.excluded,
    reasons: scored.reasons,
    exclusionReasons: scored.exclusionReasons,
    matchedSignals: uniqueSignals(scored.reasons.map((r) => r.source)),
  };
}

// Profession-Wrapper: unveränderte öffentliche API, delegiert an den generischen Kern.
export function matchJobToProfession(job: Job, profession: ProfessionContent): JobMatchResult {
  return matchJobToConfig(job, profession.jobMatch, profession.slug);
}
