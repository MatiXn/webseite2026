// Typen für den Schema Builder. Kein any — Schema-Werte sind ein rekursiver JSON-Typ.

export type SchemaValue =
  | string
  | number
  | boolean
  | null
  | readonly SchemaValue[]
  | { readonly [key: string]: SchemaValue };

// Ein Schema.org-Knoten: JSON-Objekt (i. d. R. mit "@type" und "@id").
export type SchemaNode = { readonly [key: string]: SchemaValue };

// Reine Referenz auf die zentrale Organization-Entität — niemals eine zweite Organization.
export type OrganizationReference = { readonly "@id": string };

// Eingabe je Breadcrumb-Stufe (interner Pfad wird zur absoluten URL normalisiert).
export type BreadcrumbInputItem = { readonly name: string; readonly path: string };

// Vollständiger Graph einer Seite.
export type SchemaGraph = {
  readonly "@context": string;
  readonly "@graph": readonly SchemaNode[];
};

export type SchemaErrorCode =
  | "SCHEMA_PROFESSION_INVALID"
  | "SCHEMA_DUPLICATE_ID_CONFLICT";
