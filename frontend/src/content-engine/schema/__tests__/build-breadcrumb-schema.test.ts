import { describe, it, expect } from "vitest";
import { buildBreadcrumbSchema } from "../build-breadcrumb-schema";
import type { BreadcrumbInputItem } from "../types";
import { buildCanonicalUrl } from "../../metadata";

type ListItem = { "@type": string; position: number; name: string; item: string };

const items: readonly BreadcrumbInputItem[] = [
  { name: "Startseite", path: "/" },
  { name: "Berufe", path: "/berufe" },
  { name: "Elektroniker", path: "/berufe/elektroniker" },
];
const ID = `${buildCanonicalUrl("/berufe/elektroniker")}#breadcrumb`;

describe("buildBreadcrumbSchema", () => {
  it("1 – drei Elemente mit eigener @id und Typ BreadcrumbList", () => {
    const b = buildBreadcrumbSchema(items, ID);
    expect(b["@type"]).toBe("BreadcrumbList");
    expect(b["@id"]).toBe(ID);
    expect((b.itemListElement as ListItem[]).length).toBe(3);
  });

  it("2 – Positionen beginnen bei 1, keine Lücken", () => {
    const list = buildBreadcrumbSchema(items, ID).itemListElement as ListItem[];
    expect(list.map((el) => el.position)).toEqual([1, 2, 3]);
  });

  it("3 – letzte URL entspricht der Canonical", () => {
    const list = buildBreadcrumbSchema(items, ID).itemListElement as ListItem[];
    expect(list[list.length - 1].item).toBe(buildCanonicalUrl("/berufe/elektroniker"));
  });

  it("4 – keine leeren Namen", () => {
    const list = buildBreadcrumbSchema(items, ID).itemListElement as ListItem[];
    for (const el of list) expect(el.name.length).toBeGreaterThan(0);
  });

  it("5 – keine doppelten URLs", () => {
    const list = buildBreadcrumbSchema(items, ID).itemListElement as ListItem[];
    const urls = list.map((el) => el.item);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("6 – alle item-URLs sind absolut (https)", () => {
    const list = buildBreadcrumbSchema(items, ID).itemListElement as ListItem[];
    for (const el of list) expect(el.item.startsWith("https://")).toBe(true);
  });
});
