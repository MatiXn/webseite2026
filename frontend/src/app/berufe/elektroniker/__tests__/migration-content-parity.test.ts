import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { elektroniker } from "../../../../content/professions/elektroniker";

const src = readFileSync(new URL("../page.tsx", import.meta.url), "utf8");
const count = (re: RegExp) => (src.match(re) ?? []).length;

describe("Elektroniker-Migration – Content-Parität (Quellinspektion)", () => {
  it("1 – genau eine H1", () => {
    expect(count(/<h1/g)).toBe(1);
  });

  it("2 – H1 kommt aus der Registry und ist unverändert", () => {
    expect(elektroniker.hero.headline).toBe("Elektroniker Jobs in Festanstellung");
    expect(src).toContain("{p.hero.headline}");
  });

  it("3 – alle bisherigen Hauptabschnitte vorhanden", () => {
    for (const marker of [
      "{p.hero.headline}", "{p.overview.title}", "{SECTION.specializations}", "{SECTION.industries}",
      "{SECTION.requirements}", 'id="stellen"', "{COMMITMENT.title}", "{SECTION.process}",
      "{p.applicantCta.title}", "{p.employerCta.title}", "FaqSection", "hubLink",
    ]) {
      expect(src.includes(marker)).toBe(true);
    }
  });

  it("4 – zehn FAQ-Fragen, gerendert aus der Registry", () => {
    expect(elektroniker.faq.length).toBe(10);
    expect(src).toContain("items={[...p.faq]}");
  });

  it("5 – keine lokalen Kopien zentraler Profession-Texte", () => {
    for (const local of ["const FACHRICHTUNGEN", "const EINSATZBEREICHE", "const ANFORDERUNGEN", "const PROZESS", "const ELEKTRONIKER_FAQ"]) {
      expect(src.includes(local)).toBe(false);
    }
  });

  it("6 – keine lokale Job-Filterlogik", () => {
    expect(src.includes('category === "elektro"')).toBe(false);
    expect(src).toContain("matchJobsForProfession(JOBS, p)");
  });

  it("7 – keine lokale Metadata-Definition", () => {
    expect(src).toContain("buildProfessionMetadata(elektroniker)");
    expect(src.includes("alternates: { canonical")).toBe(false);
  });

  it("8 – keine lokale Schema-Zusammenstellung, genau ein JSON-LD-Graph", () => {
    expect(src).toContain("buildProfessionSchema(p, visibleJobs)");
    expect(src.includes('"@type": "CollectionPage"')).toBe(false);
    expect(src.includes('"@type": "FAQPage"')).toBe(false);
    expect(count(/<JsonLd/g)).toBe(1);
  });
});
