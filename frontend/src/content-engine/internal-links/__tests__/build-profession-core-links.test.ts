import { describe, it, expect } from "vitest";
import { buildProfessionCoreLinks } from "../build-profession-core-links";
import { validateInternalLink } from "../validate-internal-link";
import { elektroniker } from "../../../content/professions/elektroniker";

describe("buildProfessionCoreLinks", () => {
  it("1 – alle fünf Kernziele vorhanden", () => {
    const links = buildProfessionCoreLinks(elektroniker);
    expect(links.map((l) => l.type).sort()).toEqual(["contact", "jobs", "parent", "resume", "service"]);
  });

  it("2 – nur existierende Routen (hrefs aus der Config)", () => {
    const links = buildProfessionCoreLinks(elektroniker);
    expect(links.map((l) => l.href)).toEqual([
      elektroniker.internalLinks.parent,
      elektroniker.internalLinks.jobs,
      elektroniker.internalLinks.lebenslauf,
      elektroniker.internalLinks.personalvermittlung,
      elektroniker.internalLinks.kontakt,
    ]);
  });

  it("3 – korrekte Zielgruppen", () => {
    const byType = Object.fromEntries(buildProfessionCoreLinks(elektroniker).map((l) => [l.type, l.audience]));
    expect(byType.jobs).toBe("candidate");
    expect(byType.resume).toBe("candidate");
    expect(byType.service).toBe("company");
    expect(byType.parent).toBe("both");
    expect(byType.contact).toBe("both");
  });

  it("4 – keine toten/ungültigen Links", () => {
    for (const link of buildProfessionCoreLinks(elektroniker)) {
      expect(validateInternalLink(link).valid).toBe(true);
    }
  });

  it("5 – stabile Reihenfolge", () => {
    const a = buildProfessionCoreLinks(elektroniker).map((l) => l.type);
    const b = buildProfessionCoreLinks(elektroniker).map((l) => l.type);
    expect(a).toEqual(b);
    expect(a).toEqual(["parent", "jobs", "resume", "service", "contact"]);
  });
});
