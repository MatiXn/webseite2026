// Generischer, seitentyp-agnostischer Metadata Builder.
// Eine Quelle für Title, Description, Canonical, Open Graph, Twitter und Robots.
// Rein & deterministisch: keine Zeit-, Zufalls-, Netzwerk- oder Browser-APIs,
// keine Mutation der Eingabe.
import type { Metadata } from "next";
import type { PageMetadataInput } from "./types";
import { buildCanonicalUrl } from "./build-canonical-url";
import {
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_TYPE,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
} from "./constants";

// Trim + Mehrfach-Leerzeichen zusammenfassen. Kein inhaltliches Umschreiben.
function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

// Reihenfolgestabile Deduplizierung (case-insensitiv), ohne die Eingabe zu mutieren.
function dedupe(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (trimmed.length > 0 && !seen.has(key)) {
      seen.add(key);
      out.push(trimmed);
    }
  }
  return out;
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title = normalizeWhitespace(input.title);
  const description = normalizeWhitespace(input.description);
  const canonical = buildCanonicalUrl(input.canonicalPath);

  const ogTitle = normalizeWhitespace(input.openGraphTitle ?? input.title);
  const ogDescription = normalizeWhitespace(input.openGraphDescription ?? input.description);
  const ogType = input.type ?? DEFAULT_OG_TYPE;
  const image = input.image ?? DEFAULT_OG_IMAGE;

  // Robots: explizite robots-Angabe gewinnt; sonst leitet noIndex sichere Defaults ab.
  const index = input.robots ? input.robots.index : input.noIndex !== true;
  const follow = input.robots ? input.robots.follow : input.noIndex !== true;

  // Literaler openGraph.type je Zweig, damit die Next.js-Union sauber getroffen wird.
  const openGraph: Metadata["openGraph"] =
    ogType === "article"
      ? {
          type: "article",
          title: ogTitle,
          description: ogDescription,
          url: canonical,
          siteName: SITE_NAME,
          locale: DEFAULT_LOCALE,
          images: [image],
          ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
          ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
        }
      : {
          type: "website",
          title: ogTitle,
          description: ogDescription,
          url: canonical,
          siteName: SITE_NAME,
          locale: DEFAULT_LOCALE,
          images: [image],
        };

  const keywords = input.keywords ? dedupe(input.keywords) : undefined;

  const metadata: Metadata = {
    // absolute umgeht das globale Root-Template "%s | PHE-Perm Engineering"
    // und verhindert doppelte Marken-Suffixe.
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: DEFAULT_TWITTER_CARD,
      title: ogTitle,
      description: ogDescription,
      images: [image],
      // bewusst kein creator/site — kein verifiziertes Twitter-/X-Konto vorhanden.
    },
    robots: { index, follow, googleBot: { index, follow } },
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
  };

  return metadata;
}
