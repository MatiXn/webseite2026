import { describe, it, expect } from "vitest";
import { buildProfessionMetadata } from "../../../../content-engine/metadata";
import { elektroniker } from "../../../../content/professions/elektroniker";

const m = buildProfessionMetadata(elektroniker);

describe("Elektroniker-Migration – Metadata", () => {
  it("1 – Title exakt", () => {
    expect(m.title).toEqual({ absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" });
  });

  it("2 – Canonical exakt", () => {
    expect(m.alternates?.canonical).toBe("https://www.phe-perm.de/berufe/elektroniker");
  });

  it("3 – Open-Graph-URL = Canonical", () => {
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });

  it("4 – index/follow für published Elektroniker", () => {
    expect(m.robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true } });
  });

  it("5 – kein doppeltes Marken-Suffix", () => {
    const title = (m.title as { absolute: string }).absolute;
    expect((title.match(/PHE-Perm/g) ?? []).length).toBe(1);
  });
});
