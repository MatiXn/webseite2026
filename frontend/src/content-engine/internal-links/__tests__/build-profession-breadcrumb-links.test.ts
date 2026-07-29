import { describe, it, expect } from "vitest";
import { buildProfessionBreadcrumbLinks } from "../build-profession-breadcrumb-links";
import { ContentInternalLinkError } from "../content-internal-link-error";
import { elektroniker } from "../../../content/professions/elektroniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";

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
    expect(() => buildProfessionBreadcrumbLinks(spsAutomatisierung)).toThrow(ContentInternalLinkError);
  });

  it("6 – keine doppelten URLs", () => {
    const urls = buildProfessionBreadcrumbLinks(elektroniker).map((l) => l.href);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("7 – mutiert die Profession nicht (auch mit allowDraft)", () => {
    const snapshot = JSON.parse(JSON.stringify(spsAutomatisierung));
    buildProfessionBreadcrumbLinks(spsAutomatisierung, { allowDraft: true });
    expect(JSON.parse(JSON.stringify(spsAutomatisierung))).toEqual(snapshot);
  });
});
