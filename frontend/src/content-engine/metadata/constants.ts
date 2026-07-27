// Zentrale Metadata-Konstanten. Alle markenbezogenen Werte werden aus der
// Company Registry abgeleitet — kein doppelt gepflegter String (Domain, Marke, Bild).
import { company } from "../../content/company";

// Absolute HTTPS-Basis für Canonicals und Open-Graph-URLs.
// Entspricht metadataBase in src/app/layout.tsx (ebenfalls company.website).
export const SITE_URL: string = company.website; // "https://www.phe-perm.de"

// Anzeigename der Marke für openGraph.siteName.
export const SITE_NAME: string = company.name; // "PHE-Perm Engineering"

// Globales OG-Bild: bereits zentral genutzter, verifizierter Wert
// (src/app/layout.tsx, root openGraph.images + twitter.images).
// Aus SITE_URL abgeleitet — keine neue Domain, kein neues Bildsystem.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/jobs/opengraph-image`;

// Locale + Defaults, konsistent mit dem Root-Layout.
export const DEFAULT_LOCALE = "de_DE";
export const DEFAULT_OG_TYPE = "website" as const;
export const DEFAULT_TWITTER_CARD = "summary_large_image" as const;
