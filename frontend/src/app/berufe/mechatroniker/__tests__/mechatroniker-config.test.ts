import { describe, it, expect } from "vitest";
import { validateProfession } from "../../../../content-engine/validation";
import { mechatroniker } from "../../../../content/professions/mechatroniker";
import { company } from "../../../../content/company";

describe("Mechatroniker – Config", () => {
  it("1 – validiert ohne Errors", () => {
    const r = validateProfession(mechatroniker);
    expect(r.valid, r.errors.map(e => e.code).join(", ")).toBe(true);
  });

  it("2 – Published-Flags konsistent", () => {
    expect(mechatroniker.status).toBe("published");
    expect(mechatroniker.publication).toMatchObject({
      published: true, indexable: true, includeInSitemap: true, showInProfessionHub: true, showRelatedLinks: true,
    });
  });

  it("3 – Canonical korrekt", () => {
    expect(mechatroniker.canonicalPath).toBe("/berufe/mechatroniker");
  });

  it("4 – zehn vollständige FAQ ohne Duplikate", () => {
    expect(mechatroniker.faq.length).toBe(10);
    for (const f of mechatroniker.faq) {
      expect(f.q.trim().length).toBeGreaterThan(0);
      expect(f.a.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(mechatroniker.faq.map(f => f.q)).size).toBe(10);
  });

  it("5 – keine verbotenen Claims", () => {
    const text = JSON.stringify(mechatroniker).toLowerCase();
    for (const bad of ["marktführer", "garantiert", "erfolgsquote", "100 %", "100%", "nummer 1"]) {
      expect(text.includes(bad)).toBe(false);
    }
  });

  it("6 – keine Unternehmensstammdaten dupliziert", () => {
    const text = JSON.stringify(mechatroniker);
    for (const nap of [company.email, company.phone, company.street, company.postalCode]) {
      expect(text.includes(nap)).toBe(false);
    }
  });
});
