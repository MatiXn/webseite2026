// Analyse-Skript (via `npm run analyze:internal-links`): gibt je Profession
// Status, Link-Zahlen, Warnings und etwaige verbotene Ziele aus.
// Ändert keine Dateien; Exit-Code 0 bei gültigen Published Professionen.
import { describe, it, expect } from "vitest";
import { buildProfessionInternalLinks } from "../build-profession-internal-links";
import { validateInternalLink } from "../validate-internal-link";
import type { InternalLinkRegistry } from "../types";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { professions, professionBySlug } from "../../../content/professions";

const registry: InternalLinkRegistry = { professionBySlug };

describe("analyze:internal-links", () => {
  it("gibt eine konsistente Link-Übersicht für alle Professionen aus", () => {
    for (const p of professions) {
      // Drafts technisch mit allowDraft verarbeiten (nur Analyse, keine öffentliche Nutzung).
      const r = buildProfessionInternalLinks({
        profession: p,
        professionRegistry: registry,
        jobMatches: matchJobsForProfession(JOBS, p).matches,
        allowDraft: true,
      });
      const forbidden = [...r.breadcrumbs, ...r.allLinks].some(
        (l) => l.href.startsWith("/talente-finden") || /^\/jobs\/\d+$/.test(l.href),
      );

      console.log(
        `${p.slug}\n  status:    ${p.status}\n  breadcrumbs: ${r.breadcrumbs.length}\n  core:      ${r.coreLinks.length}\n  related:   ${r.relatedProfessionLinks.length}\n  jobs:      ${r.jobLinks.length}\n  candidate: ${r.candidateLinks.length}\n  company:   ${r.companyLinks.length}\n  warnings:  ${r.warnings.length}\n  verboten:  ${forbidden ? "ja" : "nein"}`,
      );

      expect(forbidden).toBe(false);
      for (const link of [...r.breadcrumbs, ...r.allLinks]) {
        expect(validateInternalLink(link).valid).toBe(true);
      }
    }
  });
});
