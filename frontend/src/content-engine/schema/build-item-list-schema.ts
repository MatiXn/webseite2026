// Baut ein ItemList-Schema aus bereits gematchten Jobs (Matching passiert NICHT hier).
// Nur position, url (Slug-URL), name. Keine JobPosting-Objekte, keine Gehälter,
// keine Beschreibungen. Keine Liste ohne Jobs (null).
import type { Job } from "../../app/jobs/data";
import type { SchemaNode } from "./types";
import { jobPath } from "../../lib/slug";
import { buildCanonicalUrl } from "../metadata";

export function buildItemListSchema(jobs: readonly Job[], id: string): SchemaNode | null {
  if (jobs.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": id,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildCanonicalUrl(jobPath(job)),
      name: job.title,
    })),
  };
}
