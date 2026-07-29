import { describe, it, expect } from "vitest";
import { buildProfessionInternalLinks } from "../build-profession-internal-links";
import { ContentInternalLinkError } from "../content-internal-link-error";
import type { InternalLinkRegistry } from "../types";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { professionBySlug } from "../../../content/professions";
import { elektroniker } from "../../../content/professions/elektroniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";
import type { ProfessionContent } from "../../../content/professions/types";

const registry: InternalLinkRegistry = { professionBySlug };
const elektroMatches = matchJobsForProfession(JOBS, elektroniker).matches;
const matchedCount = elektroMatches.filter((m) => m.matched && !m.excluded).length;

function buildElektroniker() {
  return buildProfessionInternalLinks({ profession: elektroniker, professionRegistry: registry, jobMatches: elektroMatches });
}

describe("buildProfessionInternalLinks", () => {
  it("1 – Elektroniker erzeugt vollständige Struktur", () => {
    const r = buildElektroniker();
    expect(r.breadcrumbs.length).toBe(3);
    expect(r.coreLinks.length).toBe(5);
    expect(r.jobLinks.length).toBe(matchedCount);
    expect(r.allLinks.length).toBeGreaterThan(0);
  });

  it("2 – Elektroniker enthält maximal die Matcher-Jobs", () => {
    const r = buildElektroniker();
    expect(r.jobLinks.length).toBeLessThanOrEqual(elektroMatches.length);
    expect(r.jobLinks.length).toBe(matchedCount);
  });

  it("3 – keine verbotenen Ziele", () => {
    const r = buildElektroniker();
    for (const link of [...r.breadcrumbs, ...r.allLinks]) {
      expect(link.href.startsWith("/talente-finden")).toBe(false);
      expect(/^\/jobs\/\d+$/.test(link.href)).toBe(false);
    }
  });

  it("4 – Candidate Links korrekt (candidate|both, inkl. Jobs)", () => {
    const r = buildElektroniker();
    expect(r.candidateLinks.every((l) => l.audience === "candidate" || l.audience === "both")).toBe(true);
    expect(r.candidateLinks.some((l) => l.type === "jobs")).toBe(true);
  });

  it("5 – Company Links korrekt (company|both, ohne Bewerber-Pfade)", () => {
    const r = buildElektroniker();
    expect(r.companyLinks.every((l) => l.audience === "company" || l.audience === "both")).toBe(true);
    expect(r.companyLinks.some((l) => l.type === "service")).toBe(true);
    expect(r.companyLinks.some((l) => l.type === "jobs" || l.type === "resume" || l.type === "job-detail")).toBe(false);
  });

  it("6 – Draft ohne allowDraft wird abgelehnt", () => {
    expect(() =>
      buildProfessionInternalLinks({ profession: spsAutomatisierung, professionRegistry: registry, jobMatches: [] }),
    ).toThrow(ContentInternalLinkError);
  });

  it("7 – Draft mit allowDraft ist technisch verarbeitbar", () => {
    const r = buildProfessionInternalLinks({ profession: spsAutomatisierung, professionRegistry: registry, jobMatches: [], allowDraft: true });
    expect(r.breadcrumbs.length).toBe(3);
    expect(r.coreLinks.length).toBe(5);
  });

  it("8 – invalides Profession-Objekt wirft typisierten Fehler", () => {
    const invalid: ProfessionContent = { ...elektroniker, metadataTitle: "" };
    try {
      buildProfessionInternalLinks({ profession: invalid, professionRegistry: registry, jobMatches: [] });
      throw new Error("kein Fehler geworfen");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentInternalLinkError);
      expect((e as ContentInternalLinkError).professionSlug).toBe("elektroniker");
      expect((e as ContentInternalLinkError).validationCodes).toContain("PROFESSION_METADATA_TITLE_EMPTY");
    }
  });

  it("9 – wiederholter Lauf ist tief identisch", () => {
    expect(buildElektroniker()).toEqual(buildElektroniker());
  });

  it("10 – Profession- und Match-Eingaben werden nicht mutiert", () => {
    const snap = JSON.parse(JSON.stringify({ elektroniker, elektroMatches }));
    buildElektroniker();
    expect(JSON.parse(JSON.stringify({ elektroniker, elektroMatches }))).toEqual(snap);
  });
});
