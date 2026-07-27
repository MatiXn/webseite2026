// Analyse-Skript (via `npm run analyze:metadata`): gibt je Profession
// slug, finalen Title, Canonical, robots index/follow und Open-Graph-URL aus.
// Ändert keine Dateien; Exit-Code 0 bei gültiger Registry.
import { describe, it, expect } from "vitest";
import { buildProfessionMetadata } from "../build-profession-metadata";
import { professions } from "../../../content/professions";

describe("analyze:metadata", () => {
  it("gibt eine konsistente Metadata-Übersicht für alle Professionen aus", () => {
    const rows = professions.map((p) => {
      const m = buildProfessionMetadata(p);
      const title = (m.title as { absolute: string }).absolute;
      const robots = m.robots as { index?: boolean; follow?: boolean };
      const ogUrl = m.openGraph && "url" in m.openGraph ? String(m.openGraph.url) : "";
      return {
        slug: p.slug,
        title,
        canonical: String(m.alternates?.canonical ?? ""),
        index: robots.index === true,
        follow: robots.follow === true,
        ogUrl,
      };
    });

    // Menschlich lesbare Ausgabe (erscheint im vitest-Log).
    for (const r of rows) {
      console.log(
        `${r.slug}\n  title:     ${r.title}\n  canonical: ${r.canonical}\n  robots:    index=${r.index} follow=${r.follow}\n  og:url:    ${r.ogUrl}`,
      );
    }

    // Registry gültig => jede Zeile hat Title, Canonical und OG-URL.
    for (const r of rows) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.canonical.startsWith("https://")).toBe(true);
      expect(r.ogUrl).toBe(r.canonical);
    }
  });
});
