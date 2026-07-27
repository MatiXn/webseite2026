import { describe, it, expect } from "vitest";
import { buildProfessionMetadata } from "../build-profession-metadata";
import { SITE_URL } from "../constants";
import { professions, publishedProfessions, draftProfessions } from "../../../content/professions";

describe("Metadata Builder gegen die Live-Registry", () => {
  it("1 – alle Professionen lassen sich fehlerfrei verarbeiten", () => {
    for (const p of professions) {
      const m = buildProfessionMetadata(p);
      expect(m.alternates?.canonical).toBe(`${SITE_URL}${p.canonicalPath}`);
      expect(m.title).toEqual({ absolute: p.metadataTitle });
    }
  });

  it("2 – veröffentlichte Professionen erzeugen indexierbare Metadata", () => {
    for (const p of publishedProfessions) {
      const m = buildProfessionMetadata(p);
      expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
    }
  });

  it("3 – Draft-Professionen erzeugen noindex-Metadata", () => {
    for (const p of draftProfessions) {
      const m = buildProfessionMetadata(p);
      expect(m.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
    }
  });

  it("4 – wiederholter Lauf ist tief identisch", () => {
    for (const p of professions) {
      expect(buildProfessionMetadata(p)).toEqual(buildProfessionMetadata(p));
    }
  });
});
