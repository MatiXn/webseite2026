import { describe, it, expect } from "vitest";
import { buildProfessionSchema } from "../build-profession-schema";
import { FORBIDDEN_SCHEMA_TYPES } from "../constants";
import { JOBS } from "../../../app/jobs/data";
import { matchJobsForProfession } from "../../job-matching";
import { professions } from "../../../content/professions";
import type { ProfessionContent } from "../../../content/professions/types";

function matchedJobs(p: ProfessionContent) {
  return matchJobsForProfession(JOBS, p).matches.map((m) => m.job);
}

// Sammelt alle @type-Werte rekursiv aus einem Schema-Graph.
function collectTypes(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectTypes);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const own = typeof obj["@type"] === "string" ? [obj["@type"] as string] : [];
    return [...own, ...Object.values(obj).flatMap(collectTypes)];
  }
  return [];
}
function collectIds(graph: { "@graph": readonly Record<string, unknown>[] }): string[] {
  return graph["@graph"].map((n) => String(n["@id"]));
}

describe("Schema Builder gegen die Live-Registry", () => {
  it("1 – alle Professionen erzeugen einen Graph mit @context", () => {
    for (const p of professions) {
      const graph = buildProfessionSchema(p, matchedJobs(p));
      expect(graph["@context"]).toBe("https://schema.org");
      expect(graph["@graph"].length).toBeGreaterThan(0);
    }
  });

  it("2 – keine doppelten @ids je Graph", () => {
    for (const p of professions) {
      const ids = collectIds(buildProfessionSchema(p, matchedJobs(p)));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("3 – keine verbotenen Schema-Typen", () => {
    for (const p of professions) {
      const foundTypes = collectTypes(buildProfessionSchema(p, matchedJobs(p)));
      for (const forbidden of FORBIDDEN_SCHEMA_TYPES) {
        expect(foundTypes).not.toContain(forbidden);
      }
    }
  });

  it("4 – wiederholter Lauf ist tief identisch", () => {
    for (const p of professions) {
      const jobs = matchedJobs(p);
      expect(buildProfessionSchema(p, jobs)).toEqual(buildProfessionSchema(p, jobs));
    }
  });
});
