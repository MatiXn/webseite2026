// Klarer, typisierter Fehler beim Metadata-Building ungültiger Content-Configs.
// Enthält Slug und Validierungscodes — keine sensiblen Daten.
import type { ValidationCode } from "../validation";

export class ContentMetadataError extends Error {
  readonly professionSlug: string;
  readonly validationCodes: readonly ValidationCode[];

  constructor(professionSlug: string, validationCodes: readonly ValidationCode[], message: string) {
    super(message);
    this.name = "ContentMetadataError";
    this.professionSlug = professionSlug;
    this.validationCodes = validationCodes;
    // Prototypkette für korrekte instanceof-Prüfung nach TS-Transpilierung.
    Object.setPrototypeOf(this, ContentMetadataError.prototype);
  }
}
