import { describe, it, expect } from "vitest";
import { buildProfessionMetadata } from "../build-profession-metadata";
import { ContentMetadataError } from "../content-metadata-error";
import { SITE_URL } from "../constants";
import type { ProfessionContent } from "../../../content/professions/types";
import { elektroniker } from "../../../content/professions/elektroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";

describe("buildProfessionMetadata", () => {
  it("1 – Elektroniker erzeugt exakten Title und Canonical", () => {
    const m = buildProfessionMetadata(elektroniker);
    expect(m.title).toEqual({ absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" });
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/berufe/elektroniker`);
  });

  it("2 – Published Elektroniker ist index/follow", () => {
    const m = buildProfessionMetadata(elektroniker);
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });

  it("3 – Published Servicetechniker ist index/follow (seit EPIC 007C)", () => {
    const m = buildProfessionMetadata(servicetechniker);
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });

  it("4 – Draft SPS/Automatisierung ist noindex", () => {
    const m = buildProfessionMetadata(spsAutomatisierung);
    expect(m.robots).toEqual({ index: false, follow: false, googleBot: { index: false, follow: false } });
  });

  it("5 – invalides Profession-Objekt wirft ContentMetadataError mit Slug und Codes", () => {
    const invalid: ProfessionContent = { ...elektroniker, metadataTitle: "" };
    try {
      buildProfessionMetadata(invalid);
      throw new Error("Es wurde kein Fehler geworfen.");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentMetadataError);
      const err = e as ContentMetadataError;
      expect(err.professionSlug).toBe("elektroniker");
      expect(err.validationCodes).toContain("PROFESSION_METADATA_TITLE_EMPTY");
    }
  });

  it("6 – Warnungen blockieren die Erzeugung nicht", () => {
    // überlanger metadataTitle -> Warnung (PROFESSION_METADATA_TITLE_TOO_LONG), kein Error
    const longTitle = "Elektroniker Jobs in Festanstellung fuer Betriebstechnik Automatisierung Instandhaltung und Service | PHE-Perm";
    const withWarning: ProfessionContent = { ...elektroniker, metadataTitle: longTitle };
    const m = buildProfessionMetadata(withWarning);
    expect(m.title).toEqual({ absolute: longTitle }); // keine Kürzung
  });

  it("7 – kein doppeltes Marken-Suffix", () => {
    const m = buildProfessionMetadata(elektroniker);
    const title = (m.title as { absolute: string }).absolute;
    expect((title.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });

  it("8 – Metadata-Description wird nicht umgeschrieben", () => {
    const m = buildProfessionMetadata(elektroniker);
    expect(m.description).toBe(elektroniker.metadataDescription.replace(/\s+/g, " ").trim());
  });

  it("9 – Keywords sind dedupliziert, Primary zuerst", () => {
    const m = buildProfessionMetadata(elektroniker);
    const keywords = m.keywords as string[];
    expect(Array.isArray(keywords)).toBe(true);
    expect(new Set(keywords.map((k) => k.toLowerCase())).size).toBe(keywords.length);
    expect(keywords[0]).toBe(elektroniker.primaryKeyword);
  });

  it("10 – Profession-Input wird nicht mutiert", () => {
    const snapshot = JSON.parse(JSON.stringify(elektroniker));
    buildProfessionMetadata(elektroniker);
    expect(JSON.parse(JSON.stringify(elektroniker))).toEqual(snapshot);
  });
});
