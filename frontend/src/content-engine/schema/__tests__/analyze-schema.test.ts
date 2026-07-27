// Analyse-Skript (via `npm run analyze:schema`): gibt je Profession Schema-Typen,
// @ids, FAQ-Anzahl, ItemList-Anzahl und etwaige verbotene Typen aus.
// Ändert keine Dateien; Exit-Code 0 bei gültiger Registry.
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
function collectTypes(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectTypes);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const own = typeof obj["@type"] === "string" ? [obj["@type"] as string] : [];
    return [...own, ...Object.values(obj).flatMap(collectTypes)];
  }
  return [];
}

describe("analyze:schema", () => {
  it("gibt eine konsistente Schema-Übersicht für alle Professionen aus", () => {
    for (const p of professions) {
      const graph = buildProfessionSchema(p, matchedJobs(p));
      const nodes = graph["@graph"] as readonly Record<string, unknown>[];
      const topTypes = nodes.map((n) => String(n["@type"]));
      const ids = nodes.map((n) => String(n["@id"]));
      const faqNode = nodes.find((n) => n["@type"] === "FAQPage");
      const itemListNode = nodes.find((n) => n["@type"] === "ItemList");
      const faqCount = faqNode ? (faqNode.mainEntity as unknown[]).length : 0;
      const itemCount = itemListNode ? Number(itemListNode.numberOfItems) : 0;
      const forbidden = collectTypes(graph).filter((t) => FORBIDDEN_SCHEMA_TYPES.includes(t));

      console.log(
        `${p.slug}\n  typen:    ${topTypes.join(", ")}\n  @ids:     ${ids.join(", ")}\n  faq:      ${faqCount}\n  itemList: ${itemCount}\n  verboten: ${forbidden.length === 0 ? "keine" : forbidden.join(", ")}`,
      );

      expect(forbidden).toHaveLength(0);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
