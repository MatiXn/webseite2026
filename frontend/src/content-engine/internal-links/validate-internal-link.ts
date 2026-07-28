// Strukturelle Link-Sicherheitsprüfung. Liefert ein typisiertes Ergebnis
// (keine Exception). Relationale Regeln (Draft-Ziel, Self-Link) prüfen die
// jeweiligen Builder, da sie Registry-Kontext brauchen.
import type { InternalLink, LinkValidationCode, LinkValidationResult } from "./types";
import { FORBIDDEN_PATH_PREFIXES, NUMERIC_JOB_URL } from "./constants";

function toResult(codes: readonly LinkValidationCode[]): LinkValidationResult {
  return { valid: codes.length === 0, codes };
}

export function validateInternalLink(link: InternalLink): LinkValidationResult {
  const codes: LinkValidationCode[] = [];
  if (link.label.trim().length === 0) codes.push("LINK_LABEL_EMPTY");

  const href = link.href;
  if (href.trim().length === 0) {
    codes.push("LINK_HREF_EMPTY");
    return toResult(codes);
  }

  if (/\s/.test(href)) codes.push("LINK_HREF_HAS_SPACE");

  if (/^javascript:/i.test(href)) {
    codes.push("LINK_HREF_JAVASCRIPT");
    return toResult(codes);
  }

  // Externe Links: ausschließlich https://
  if (/^https:\/\//.test(href)) return toResult(codes);
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    codes.push("LINK_HREF_EXTERNAL_NOT_HTTPS");
    return toResult(codes);
  }

  // Hashlink erlaubt.
  if (href.startsWith("#")) return toResult(codes);

  // Ab hier muss es ein interner Pfad sein.
  if (!href.startsWith("/")) {
    codes.push("LINK_HREF_INVALID_INTERNAL");
    return toResult(codes);
  }

  if (href.includes("//")) codes.push("LINK_HREF_DOUBLE_SLASH");
  if (NUMERIC_JOB_URL.test(href)) codes.push("LINK_HREF_NUMERIC_JOB");
  if (FORBIDDEN_PATH_PREFIXES.some((p) => href === p || href.startsWith(`${p}/`) || href.startsWith(p))) {
    codes.push("LINK_HREF_FORBIDDEN");
  }
  if (/\?($|=|&)/.test(href)) codes.push("LINK_HREF_EMPTY_QUERY");

  return toResult(codes);
}
