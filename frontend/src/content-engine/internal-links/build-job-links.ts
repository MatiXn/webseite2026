// Job-Links aus bereits gematchten Ergebnissen des JobMatchers (kein eigenes Matching).
// Nur matched:true, keine ausgeschlossenen; kanonische Slug-URL über jobPath.
import type { JobMatchResult } from "../job-matching";
import type { InternalLink } from "./types";
import { jobPath } from "../../lib/slug";

export function buildJobLinks(matchResults: readonly JobMatchResult[]): readonly InternalLink[] {
  const out: InternalLink[] = [];
  const seen = new Set<string>();

  for (const result of matchResults) {
    if (!result.matched || result.excluded) continue;
    const href = jobPath(result.job);
    if (seen.has(href)) continue; // Duplikat
    seen.add(href);
    out.push({
      label: result.job.title,
      href,
      type: "job-detail",
      audience: "candidate",
      priority: "contextual",
      source: "job-matcher",
      jobId: result.job.id,
    });
  }

  return out;
}
