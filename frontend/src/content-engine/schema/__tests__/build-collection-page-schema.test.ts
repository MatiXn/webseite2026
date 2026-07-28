import { describe, it, expect } from "vitest";
import { buildCollectionPageSchema } from "../build-collection-page-schema";
import { company } from "../../../content/company";

const baseInput = {
  id: "https://www.phe-perm.de/berufe/elektroniker#collectionpage",
  canonical: "https://www.phe-perm.de/berufe/elektroniker",
  title: "Elektroniker Jobs in Festanstellung | PHE-Perm",
  description: "Passende Elektroniker Jobs in Festanstellung.",
  breadcrumbId: "https://www.phe-perm.de/berufe/elektroniker#breadcrumb",
  itemListId: "https://www.phe-perm.de/berufe/elektroniker#joblist",
};

describe("buildCollectionPageSchema", () => {
  it("1 – publisher verweist nur per @id auf die Organization", () => {
    const page = buildCollectionPageSchema(baseInput);
    expect(page.publisher).toEqual({ "@id": company.organizationId });
  });

  it("2 – breadcrumb verweist per @id", () => {
    const page = buildCollectionPageSchema(baseInput);
    expect(page.breadcrumb).toEqual({ "@id": baseInput.breadcrumbId });
  });

  it("3 – mainEntity verweist auf die ItemList-@id, wenn vorhanden", () => {
    const page = buildCollectionPageSchema(baseInput);
    expect(page.mainEntity).toEqual({ "@id": baseInput.itemListId });
  });

  it("4 – ohne ItemList kein mainEntity", () => {
    const page = buildCollectionPageSchema({ ...baseInput, itemListId: null });
    expect("mainEntity" in page).toBe(false);
  });

  it("5 – Title und Description werden exakt übernommen", () => {
    const page = buildCollectionPageSchema(baseInput);
    expect(page.name).toBe(baseInput.title);
    expect(page.description).toBe(baseInput.description);
    expect(page["@type"]).toBe("CollectionPage");
    expect(page.url).toBe(baseInput.canonical);
  });

  it("6 – keine vollständige Organization, keine Reviews/Ratings", () => {
    const json = JSON.stringify(buildCollectionPageSchema(baseInput));
    expect(json).not.toContain("AggregateRating");
    expect(json).not.toContain("Review");
    expect(json).not.toContain('"@type":"Organization"');
  });
});
