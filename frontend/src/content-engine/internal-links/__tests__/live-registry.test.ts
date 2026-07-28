import { describe, it, expect } from "vitest";
import { buildProfessionInternalLinks } from "../build-profession-internal-links";
import { validateInternalLink } from "../validate-internal-link";
import type { InternalLinkRegistry } from "../types";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { professions, publishedProfessions, draftProfessions, professionBySlug } from "../../../content/professions";
import type { ProfessionContent } from "../../../content/professions/types";

const registry: InternalLinkRegistry = { professionBySlug };
function linksFor(p: ProfessionContent, allowDraft: boolean) {
  return buildProfessionInternalLinks({
    profession: p,
    professionRegistry: registry,
    jobMatches: matchJobsForProfession(JOBS, p).matches,
    allowDraft,
  });
}

describe("Internal-Link-Builder gegen die Live-Registry", () => {
  it("1 – veröffentlichte Professionen erzeugen gültige Links", () => {
    for (const p of publishedProfessions) {
      const r = linksFor(p, false);
      for (const link of [...r.breadcrumbs, ...r.allLinks]) {
        expect(validateInternalLink(link).valid).toBe(true);
      }
    }
  });

  it("2 – Draft-Professionen werden öffentlich (ohne allowDraft) abgelehnt", () => {
    for (const p of draftProfessions) {
      expect(() => linksFor(p, false)).toThrow();
    }
  });

  it("3 – keine toten Related-Links (nur published Ziele)", () => {
    for (const p of professions) {
      const r = linksFor(p, true);
      for (const link of r.relatedProfessionLinks) {
        const target = professionBySlug[link.professionSlug ?? ""];
        expect(target?.publication.published).toBe(true);
      }
    }
  });

  it("4 – keine numerischen Job-Links", () => {
    for (const p of professions) {
      const r = linksFor(p, true);
      for (const link of r.allLinks) expect(/^\/jobs\/\d+$/.test(link.href)).toBe(false);
    }
  });

  it("5 – keine /talente-finden-Links", () => {
    for (const p of professions) {
      const r = linksFor(p, true);
      for (const link of [...r.breadcrumbs, ...r.allLinks]) {
        expect(link.href.startsWith("/talente-finden")).toBe(false);
      }
    }
  });

  it("6 – alle Links validieren erfolgreich, keine Warnings", () => {
    for (const p of professions) {
      const r = linksFor(p, true);
      expect(r.warnings).toHaveLength(0);
      for (const link of [...r.breadcrumbs, ...r.allLinks]) {
        expect(validateInternalLink(link).valid).toBe(true);
      }
    }
  });
});
