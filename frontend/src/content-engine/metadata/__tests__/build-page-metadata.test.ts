import { describe, it, expect } from "vitest";
import { buildPageMetadata } from "../build-page-metadata";
import type { PageMetadataInput } from "../types";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../constants";

const base: PageMetadataInput = {
  title: "Testtitel | PHE-Perm",
  description: "Eine Testbeschreibung.",
  canonicalPath: "/berufe/test",
};

describe("buildPageMetadata", () => {
  it("1 – Title wird exakt (absolute) gesetzt", () => {
    const m = buildPageMetadata(base);
    expect(m.title).toEqual({ absolute: "Testtitel | PHE-Perm" });
  });

  it("2 – Description wird exakt gesetzt (nur Whitespace normalisiert)", () => {
    const m = buildPageMetadata({ ...base, description: "  Eine   Testbeschreibung.  " });
    expect(m.description).toBe("Eine Testbeschreibung.");
  });

  it("3 – Canonical ist die absolute URL des Pfads", () => {
    const m = buildPageMetadata(base);
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/berufe/test`);
  });

  it("4 – Open-Graph-URL entspricht der Canonical", () => {
    const m = buildPageMetadata(base);
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });

  it("5 – Open-Graph Title/Description/siteName konsistent", () => {
    const m = buildPageMetadata(base);
    expect(m.openGraph?.title).toBe("Testtitel | PHE-Perm");
    expect(m.openGraph?.description).toBe("Eine Testbeschreibung.");
    expect(m.openGraph && "siteName" in m.openGraph ? m.openGraph.siteName : undefined).toBe(SITE_NAME);
  });

  it("6 – Robots index/follow korrekt aus robots-Angabe", () => {
    const m = buildPageMetadata({ ...base, robots: { index: true, follow: true } });
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });

  it("7 – noIndex setzt sichere Robots", () => {
    const m = buildPageMetadata({ ...base, noIndex: true });
    expect(m.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
  });

  it("8 – Eingabe wird nicht mutiert", () => {
    const input: PageMetadataInput = { ...base, keywords: ["A", "a", "B"] };
    const snapshot = JSON.parse(JSON.stringify(input));
    buildPageMetadata(input);
    expect(JSON.parse(JSON.stringify(input))).toEqual(snapshot);
  });

  it("9 – gleiche Eingabe liefert tief gleiche Ausgabe", () => {
    const a = buildPageMetadata(base);
    const b = buildPageMetadata(base);
    expect(a).toEqual(b);
  });

  it("10 – optionales Bild wird übernommen, sonst globales OG-Bild", () => {
    const withImage = buildPageMetadata({ ...base, image: `${SITE_URL}/custom.png` });
    expect(withImage.openGraph && "images" in withImage.openGraph ? withImage.openGraph.images : undefined).toEqual([
      `${SITE_URL}/custom.png`,
    ]);
    const withoutImage = buildPageMetadata(base);
    expect(withoutImage.openGraph && "images" in withoutImage.openGraph ? withoutImage.openGraph.images : undefined).toEqual([
      DEFAULT_OG_IMAGE,
    ]);
  });

  it("11 – keine Twitter-Handles werden erfunden", () => {
    const m = buildPageMetadata(base);
    expect(m.twitter).toBeDefined();
    expect(m.twitter && "creator" in m.twitter ? m.twitter.creator : undefined).toBeUndefined();
    expect(m.twitter && "site" in m.twitter ? m.twitter.site : undefined).toBeUndefined();
    expect(m.twitter?.card).toBe("summary_large_image");
  });

  it("12 – Keywords werden dedupliziert übernommen", () => {
    const m = buildPageMetadata({ ...base, keywords: ["Elektroniker", "elektroniker", "SPS", "SPS"] });
    expect(m.keywords).toEqual(["Elektroniker", "SPS"]);
  });
});
