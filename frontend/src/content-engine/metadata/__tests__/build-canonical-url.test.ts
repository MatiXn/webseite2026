import { describe, it, expect } from "vitest";
import { buildCanonicalUrl } from "../build-canonical-url";
import { SITE_URL } from "../constants";

describe("buildCanonicalUrl", () => {
  it("1 – Pfad mit führendem Slash", () => {
    expect(buildCanonicalUrl("/berufe/elektroniker")).toBe(`${SITE_URL}/berufe/elektroniker`);
  });

  it("2 – Pfad ohne führenden Slash", () => {
    expect(buildCanonicalUrl("berufe/elektroniker")).toBe(`${SITE_URL}/berufe/elektroniker`);
  });

  it("3 – Query wird entfernt", () => {
    expect(buildCanonicalUrl("/berufe/elektroniker?x=1&y=2")).toBe(`${SITE_URL}/berufe/elektroniker`);
  });

  it("4 – Hash wird entfernt", () => {
    expect(buildCanonicalUrl("/berufe/elektroniker#stellen")).toBe(`${SITE_URL}/berufe/elektroniker`);
  });

  it("5 – interne doppelte Slashes werden normalisiert", () => {
    expect(buildCanonicalUrl("/berufe//elektroniker")).toBe(`${SITE_URL}/berufe/elektroniker`);
  });

  it("6 – Root-Pfad bleibt korrekt", () => {
    expect(buildCanonicalUrl("/")).toBe(`${SITE_URL}/`);
  });

  it("7 – externe URL wird abgelehnt", () => {
    expect(() => buildCanonicalUrl("https://evil.example.com/x")).toThrow();
    expect(() => buildCanonicalUrl("//evil.example.com")).toThrow();
    expect(() => buildCanonicalUrl("mailto:info@phe-perm.de")).toThrow();
  });

  it("8 – Ergebnis nutzt die HTTPS-Basis", () => {
    const url = buildCanonicalUrl("/berufe/servicetechniker");
    expect(url.startsWith("https://")).toBe(true);
    expect(url.startsWith(SITE_URL)).toBe(true);
  });

  it("9 – alle Varianten desselben Pfads ergeben dieselbe Canonical", () => {
    const expected = `${SITE_URL}/berufe/elektroniker`;
    for (const p of [
      "/berufe/elektroniker",
      "berufe/elektroniker",
      "/berufe/elektroniker?x=1",
      "/berufe/elektroniker#stellen",
      "/berufe/elektroniker/",
    ]) {
      expect(buildCanonicalUrl(p)).toBe(expected);
    }
  });
});
