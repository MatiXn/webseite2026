// Klarer, typisierter Fehler beim Metadata-Building ungültiger Content-Configs.
// Enthält Slug (Profession ODER Branche) und Validierungscodes — keine sensiblen Daten.
// validationCodes ist bewusst string[] (domänenneutral: ValidationCode ODER IndustryValidationCode).

export class ContentMetadataError extends Error {
  readonly professionSlug: string;
  readonly validationCodes: readonly string[];

  constructor(professionSlug: string, validationCodes: readonly string[], message: string) {
    super(message);
    this.name = "ContentMetadataError";
    this.professionSlug = professionSlug;
    this.validationCodes = validationCodes;
    // Prototypkette für korrekte instanceof-Prüfung nach TS-Transpilierung.
    Object.setPrototypeOf(this, ContentMetadataError.prototype);
  }
}
