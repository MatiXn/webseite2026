// Baut aus einem internen Pfad eine absolute, kanonische HTTPS-URL.
// Rein und deterministisch. Externe/absolute Eingaben werden klar abgelehnt.
import { SITE_URL } from "./constants";

export function buildCanonicalUrl(path: string): string {
  if (typeof path !== "string") {
    throw new TypeError("buildCanonicalUrl erwartet einen String-Pfad.");
  }

  const trimmed = path.trim();

  // Externe URLs (mit Schema wie https:, mailto:, javascript:) und
  // protokoll-relative Eingaben (//host) werden nicht stillschweigend übernommen.
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith("//")) {
    throw new Error(`buildCanonicalUrl akzeptiert nur interne Pfade, nicht: "${path}".`);
  }

  // Hash und Query entfernen.
  const withoutHash = trimmed.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];

  // Genau ein führender Slash, interne Doppel-Slashes kollabieren.
  let clean = ("/" + withoutQuery.replace(/^\/+/, "")).replace(/\/{2,}/g, "/");

  // Trailing-Slash entfernen — außer beim Root-Pfad.
  if (clean.length > 1) clean = clean.replace(/\/+$/, "");

  return clean === "/" ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
}
