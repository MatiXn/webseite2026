import { describe, it, expect } from "vitest";
import { deduplicateSchemaGraph } from "../deduplicate-schema-graph";
import { ContentSchemaError } from "../content-schema-error";
import type { SchemaNode } from "../types";

const nodeA: SchemaNode = { "@type": "CollectionPage", "@id": "urn:a", name: "A" };
const nodeAClone: SchemaNode = { "@id": "urn:a", "@type": "CollectionPage", name: "A" }; // andere Key-Reihenfolge
const nodeB: SchemaNode = { "@type": "ItemList", "@id": "urn:b", numberOfItems: 2 };
const nodeAConflict: SchemaNode = { "@type": "CollectionPage", "@id": "urn:a", name: "ANDERS" };

describe("deduplicateSchemaGraph", () => {
  it("1 – identische @id + identischer Inhalt -> ein Knoten (Key-Reihenfolge egal)", () => {
    const out = deduplicateSchemaGraph([nodeA, nodeAClone]);
    expect(out.length).toBe(1);
    expect(out[0]).toBe(nodeA);
  });

  it("2 – identische @id + abweichender Inhalt -> ContentSchemaError", () => {
    expect(() => deduplicateSchemaGraph([nodeA, nodeAConflict])).toThrow(ContentSchemaError);
  });

  it("3 – Reihenfolge bleibt stabil (erstes Auftreten)", () => {
    const out = deduplicateSchemaGraph([nodeA, nodeB, nodeAClone]);
    expect(out.map((n) => n["@id"])).toEqual(["urn:a", "urn:b"]);
  });

  it("4 – mutiert die Eingabe nicht", () => {
    const input = [nodeA, nodeB, nodeAClone];
    const snapshot = JSON.parse(JSON.stringify(input));
    deduplicateSchemaGraph(input);
    expect(JSON.parse(JSON.stringify(input))).toEqual(snapshot);
  });

  it("5 – Fehler trägt Slug-Kontext und Code", () => {
    try {
      deduplicateSchemaGraph([nodeA, nodeAConflict], "elektroniker");
      throw new Error("kein Fehler geworfen");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentSchemaError);
      const err = e as ContentSchemaError;
      expect(err.professionSlug).toBe("elektroniker");
      expect(err.validationCodes).toContain("SCHEMA_DUPLICATE_ID_CONFLICT");
    }
  });
});
