// Strikt typisiertes Eingabemodell für den generischen Metadata Builder.
// Kein Record<string, unknown>, kein any. Nur projekt- und Next.js-sinnvolle Felder.

export type PageMetadataType = "website" | "article";

export type PageRobots = {
  readonly index: boolean;
  readonly follow: boolean;
};

export type PageMetadataInput = {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: string; // interner Pfad, wird zur absoluten Canonical-URL
  readonly openGraphTitle?: string; // Standard: title
  readonly openGraphDescription?: string; // Standard: description
  readonly image?: string; // Standard: globales OG-Bild
  readonly type?: PageMetadataType; // Standard: "website"
  readonly robots?: PageRobots; // gewinnt vor noIndex
  readonly keywords?: readonly string[]; // wird dedupliziert
  readonly noIndex?: boolean; // Kurzform: index/follow = false
  readonly publishedTime?: string; // nur bei type "article" wirksam
  readonly modifiedTime?: string; // nur bei type "article" wirksam
};
