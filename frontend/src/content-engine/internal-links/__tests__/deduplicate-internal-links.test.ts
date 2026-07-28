import { describe, it, expect } from "vitest";
import { deduplicateInternalLinks } from "../deduplicate-internal-links";
import type { InternalLink } from "../types";

function link(href: string, label: string): InternalLink {
  return { label, href, type: "jobs", audience: "candidate", priority: "primary", source: "system" };
}

describe("deduplicateInternalLinks", () => {
  it("1 – identische href werden einmal ausgegeben", () => {
    const out = deduplicateInternalLinks([link("/jobs", "Jobs"), link("/jobs", "Jobs")]);
    expect(out.links.length).toBe(1);
    expect(out.warnings).toHaveLength(0);
  });

  it("2 – Reihenfolge bleibt stabil (erstes Auftreten)", () => {
    const out = deduplicateInternalLinks([link("/a", "A"), link("/b", "B"), link("/a", "A")]);
    expect(out.links.map((l) => l.href)).toEqual(["/a", "/b"]);
  });

  it("3 – abweichende Labels werden dokumentiert (erster gewinnt)", () => {
    const out = deduplicateInternalLinks([link("/jobs", "Jobs"), link("/jobs", "Alle Jobs")]);
    expect(out.links.length).toBe(1);
    expect(out.links[0].label).toBe("Jobs");
    expect(out.warnings.length).toBe(1);
    expect(out.warnings[0].href).toBe("/jobs");
  });

  it("4 – Eingabe wird nicht mutiert", () => {
    const input = [link("/a", "A"), link("/a", "A2")];
    const snapshot = JSON.parse(JSON.stringify(input));
    deduplicateInternalLinks(input);
    expect(JSON.parse(JSON.stringify(input))).toEqual(snapshot);
  });
});
