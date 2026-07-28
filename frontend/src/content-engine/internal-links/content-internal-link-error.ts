// Typisierter Fehler des Internal-Link-Builders (Slug + Codes). Kein any.

export class ContentInternalLinkError extends Error {
  readonly professionSlug: string;
  readonly validationCodes: readonly string[];

  constructor(professionSlug: string, validationCodes: readonly string[], message: string) {
    super(message);
    this.name = "ContentInternalLinkError";
    this.professionSlug = professionSlug;
    this.validationCodes = validationCodes;
    Object.setPrototypeOf(this, ContentInternalLinkError.prototype);
  }
}
