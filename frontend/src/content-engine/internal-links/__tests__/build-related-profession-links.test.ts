import { describe, it, expect } from "vitest";
import { buildRelatedProfessionLinks } from "../build-related-profession-links";
import type { InternalLinkRegistry } from "../types";
import type { ProfessionContent } from "../../../content/professions/types";
import { elektroniker } from "../../../content/professions/elektroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";

function withRelated(base: ProfessionContent, related: readonly string[]): ProfessionContent {
  return { ...base, internalLinks: { ...base.internalLinks, relatedProfessions: related } };
}
// Zweite veröffentlichte Profession (Klon) für Reihenfolge-/Mehrfach-Tests.
const zweitberuf: ProfessionContent = { ...elektroniker, slug: "zweitberuf", name: "Zweitberuf", shortName: "Zweitberuf", canonicalPath: "/berufe/zweitberuf" };
// Synthetisches Draft-Ziel (seit EPIC 007D sind alle realen Professionen published).
const draftZiel: ProfessionContent = {
  ...spsAutomatisierung,
  slug: "draft-ziel",
  canonicalPath: "/berufe/draft-ziel",
  status: "draft",
  internalLinks: { ...spsAutomatisierung.internalLinks, relatedProfessions: [] },
  publication: { published: false, indexable: false, includeInSitemap: false, showInProfessionHub: false, showRelatedLinks: false },
};
const registry: InternalLinkRegistry = { professionBySlug: { elektroniker, servicetechniker, zweitberuf, "draft-ziel": draftZiel } };

describe("buildRelatedProfessionLinks", () => {
  it("1 – veröffentlichtes Ziel wird ausgegeben", () => {
    const links = buildRelatedProfessionLinks(withRelated(servicetechniker, ["elektroniker"]), registry);
    expect(links.length).toBe(1);
    expect(links[0].href).toBe("/berufe/elektroniker");
    expect(links[0].label).toBe(elektroniker.shortName);
  });

  it("2 – Draft-Ziel wird entfernt", () => {
    const links = buildRelatedProfessionLinks(withRelated(elektroniker, ["draft-ziel"]), registry);
    expect(links).toHaveLength(0);
  });

  it("3 – Self-Link wird entfernt", () => {
    const links = buildRelatedProfessionLinks(withRelated(elektroniker, ["elektroniker"]), registry);
    expect(links).toHaveLength(0);
  });

  it("4 – unbekannter Slug wird entfernt", () => {
    const links = buildRelatedProfessionLinks(withRelated(servicetechniker, ["gibtsnicht"]), registry);
    expect(links).toHaveLength(0);
  });

  it("5 – Duplikate werden entfernt", () => {
    const links = buildRelatedProfessionLinks(withRelated(servicetechniker, ["elektroniker", "elektroniker"]), registry);
    expect(links).toHaveLength(1);
  });

  it("6 – Config-Reihenfolge bleibt erhalten", () => {
    const links = buildRelatedProfessionLinks(withRelated(servicetechniker, ["elektroniker", "zweitberuf"]), registry);
    expect(links.map((l) => l.href)).toEqual(["/berufe/elektroniker", "/berufe/zweitberuf"]);
  });

  it("7 – leere Related-Liste (Elektroniker live) ergibt kein Ergebnis", () => {
    expect(buildRelatedProfessionLinks(elektroniker, registry)).toHaveLength(0);
  });
});
