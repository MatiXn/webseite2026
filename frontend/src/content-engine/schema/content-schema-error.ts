// Klarer, typisierter Fehler bei der Schema-Erzeugung.
// Enthält Slug, Schematyp und Codes — keine sensiblen Daten, kein any.

export class ContentSchemaError extends Error {
  readonly professionSlug: string;
  readonly schemaType: string;
  readonly validationCodes: readonly string[];

  constructor(
    professionSlug: string,
    schemaType: string,
    validationCodes: readonly string[],
    message: string,
  ) {
    super(message);
    this.name = "ContentSchemaError";
    this.professionSlug = professionSlug;
    this.schemaType = schemaType;
    this.validationCodes = validationCodes;
    Object.setPrototypeOf(this, ContentSchemaError.prototype);
  }
}
