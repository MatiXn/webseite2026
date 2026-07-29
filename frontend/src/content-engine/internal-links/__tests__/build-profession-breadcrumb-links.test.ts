import { describe, it, expect } from "vitest";
import { buildProfessionBreadcrumbLinks } from "../build-profession-breadcrumb-links";
import { ContentInternalLinkError } from "../content-internal-link-error";
import { elektroniker } from "../../../content/professions/elektroniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";
import type { ProfessionContent } from "../../../content/professions/types";

// Synthetisches Draft-Fixture (seit EPIC 007D sind alle realen Professionen published).
const draftSps: ProfessionContent = {
  ...spsAutomatisierung,
  status: "draft",
  publication: { published: false, indexable: false, includeInSitemap: false, showInProfessionHub: false, showRelatedLinks: false },
};

describe("buildProfessionBreadcrumbLinks", () => {
  it("1 – genau drei Links", () => {
    expect(buildProfessionBreadcrumbLinks(elektroniker).length).toBe(3);
  });

  it("2 – Reihenfolge Startseite -> Berufe -> Profession", () => {
    const b = buildProfessionBreadcrumbLinks(elektroniker);
    expect(b.map((l) => l.href)).toEqual(["/", "/berufe", "/berufe/elektroniker"]);
  });

  it("3 – letzte URL = Canonical der Profession", () => {
    const b = buildProfessionBreadcrumbLinks(elektroniker);
    expect(b[b.length - 1].href).toBe(elektroniker.canonicalPath);
  });

  it("4 – Published Elektroniker ist gültig (kein Fehler)", () => {
    expect(() => buildProfessionBreadcrumbLinks(elektroniker)).not.toThrow();
  });

  it("5 – Draft standardmäßig abgelehnt", () => {
    expect(() => buildProfessionBreadcrumbLinks(draftSps)).toThrow(ContentInternalLinkError);
  });

  it("6 – keine doppelten URLs", () => {
    const urls = buildProfessionBreadcrumbLinks(elektroniker).map((l) => l.href);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("7 – mutiert die Profession nicht (auch mit allowDraft)", () => {
    const snapshot = JSON.parse(JSON.stringify(draftSps));
    buildProfessionBreadcrumbLinks(draftSps, { allowDraft: true });
    expect(JSON.parse(JSON.stringify(draftSps))).toEqual(snapshot);
  });
});
