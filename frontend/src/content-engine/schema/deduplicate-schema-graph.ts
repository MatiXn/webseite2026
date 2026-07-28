// Dedupliziert einen Schema-Graph ausschließlich über @id.
//   gleiche @id + gleicher Inhalt  -> genau ein Knoten
//   gleiche @id + anderer Inhalt   -> ContentSchemaError
// Keine Mutation, keine automatische Zusammenführung, stabile Reihenfolge
// (erstes Auftreten je @id).
import type { SchemaNode } from "./types";
import { ContentSchemaError } from "./content-schema-error";

// Schlüssel-sortierte Serialisierung -> Vergleich unabhängig von Property-Reihenfolge.
function stableStringify(value: SchemaNode[string]): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as { readonly [key: string]: SchemaNode[string] };
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export function deduplicateSchemaGraph(
  nodes: readonly SchemaNode[],
  professionSlug: string = "-",
): readonly SchemaNode[] {
  const fingerprints = new Map<string, string>(); // @id -> Fingerprint
  const result: SchemaNode[] = [];

  for (const node of nodes) {
    const id = node["@id"];
    if (typeof id !== "string" || id.length === 0) {
      // Knoten ohne @id: kein Dedup möglich, unverändert behalten.
      result.push(node);
      continue;
    }

    const fingerprint = stableStringify(node);
    const previous = fingerprints.get(id);

    if (previous === undefined) {
      fingerprints.set(id, fingerprint);
      result.push(node);
    } else if (previous !== fingerprint) {
      const type = node["@type"];
      throw new ContentSchemaError(
        professionSlug,
        typeof type === "string" ? type : "Graph",
        ["SCHEMA_DUPLICATE_ID_CONFLICT"],
        `Doppelte @id "${id}" mit abweichendem Inhalt — keine automatische Zusammenführung.`,
      );
    }
    // gleiche @id + gleicher Inhalt: Duplikat verwerfen.
  }

  return result;
}
