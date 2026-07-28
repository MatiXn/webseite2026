import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { elektroniker } from "../../../../content/professions/elektroniker";

const route = readFileSync(new URL("../page.tsx", import.meta.url), "utf8");
const template = readFileSync(new URL("../../../../content-engine/templates/ProfessionPageTemplate.tsx", import.meta.url), "utf8");
const count = (src: string, re: RegExp) => (src.match(re) ?? []).length;

describe("EPIC 007A – Route- und Template-Parität (Quellinspektion)", () => {
  // --- Route ist dünn ---
  it("1 – Route nutzt das ProfessionPageTemplate", () => {
    expect(route).toContain("ProfessionPageTemplate profession={elektroniker}");
    expect(route).toContain("buildProfessionMetadata(elektroniker)");
  });

  it("2 – Route enthält keine lokale Job-Matching-Logik", () => {
    expect(route.includes("matchJobsForProfession")).toBe(false);
    expect(route.includes('category === "elektro"')).toBe(false);
  });

  it("3 – Route enthält keine lokale Schema-Erzeugung", () => {
    expect(route.includes("buildProfessionSchema")).toBe(false);
    expect(count(route, /<JsonLd/g)).toBe(0);
  });

  it("4 – Route enthält keine lokalen Profession-Inhalte", () => {
    for (const local of ["const SECTION", "const COMMITMENT", "FACHRICHTUNGEN", "ELEKTRONIKER_FAQ", "<h1"]) {
      expect(route.includes(local)).toBe(false);
    }
  });

  // --- Template ist berufsneutral ---
  it("5 – Template enthält keine hartcodierte berufsspezifische Prosa", () => {
    for (const term of ["Elektroniker", "Elektrotechnik", "Betriebstechnik"]) {
      expect(template.includes(term)).toBe(false);
    }
  });

  // --- Template rendert die vollständige Struktur ---
  it("12 – genau eine H1, aus der Registry", () => {
    expect(count(template, /<h1/g)).toBe(1);
    expect(template).toContain("{p.hero.headline}");
  });

  it("13 – alle Hauptabschnitte im Template vorhanden", () => {
    for (const marker of [
      "<Nav", "BreadcrumbsView", "{p.hero.headline}", "{p.overview.title}", "{headings.specializations}",
      "{headings.industries}", "{headings.requirements}", 'id="stellen"', "{COMMITMENT.title}",
      "{headings.process}", "{p.applicantCta.title}", "{p.employerCta.title}", "FaqSection", "hubLink", "<Footer",
    ]) {
      expect(template.includes(marker)).toBe(true);
    }
  });

  it("14 – FAQ aus der Registry (10 Fragen), Related-Sektion nur bedingt", () => {
    expect(elektroniker.faq.length).toBe(10);
    expect(template).toContain("items={[...p.faq]}");
    expect(template).toContain("links.relatedProfessionLinks.length > 0 &&");
  });

  it("8 – genau ein JSON-LD-Graph im Template", () => {
    expect(count(template, /<JsonLd/g)).toBe(1);
    expect(template).toContain("buildProfessionSchema(p, visibleJobs)");
  });
});
