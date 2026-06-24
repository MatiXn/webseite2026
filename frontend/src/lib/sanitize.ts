/**
 * sanitize.ts — Einzige erlaubte Stelle für dangerouslySetInnerHTML im Projekt.
 *
 * Regel: dangerouslySetInnerHTML ist VERBOTEN außer über diese Funktion.
 * Sie verwendet DOMPurify, das alle gefährlichen Tags/Attribute entfernt.
 *
 * Anwendungsfall: CMS-Inhalte oder Markdown-gerenderte Texte die HTML enthalten.
 * Niemals für User-Input aus Formularen verwenden — dort immer React-Text-Rendering.
 */

// DOMPurify läuft nur im Browser (kein SSR) — serverseitig Leer-String zurückgeben.
// Import erfolgt lazy damit Next.js Server-Components nicht crashen.
let purify: typeof import("dompurify") | null = null;

async function getPurify() {
  if (typeof window === "undefined") return null;
  if (!purify) {
    purify = (await import("dompurify")).default;
  }
  return purify;
}

// Erlaubte HTML-Tags — minimale Whitelist (kein script, iframe, form etc.)
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "u",
  "ul", "ol", "li",
  "h2", "h3", "h4",
  "a",              // Links: nur mit Protokoll-Check (s.u.)
  "blockquote",
];

const ALLOWED_ATTR = [
  "href",           // Nur für <a>
  "target",         // Nur _blank mit rel="noopener" (DOMPurify erzwingt das)
  "rel",
];

/**
 * Sanitiert HTML-String für dangerouslySetInnerHTML.
 * Gibt { __html: sanitizedString } zurück — direkt verwendbar.
 *
 * Verwendung:
 *   <div dangerouslySetInnerHTML={await sanitizeHtml(cmsContent)} />
 *
 * NIEMALS verwenden für:
 *   - User-Input aus Formularen
 *   - URL-Parameter
 *   - Daten aus nicht-vertrauenswürdigen APIs
 */
export async function sanitizeHtml(dirty: string): Promise<{ __html: string }> {
  const dompurify = await getPurify();

  if (!dompurify) {
    // SSR: kein HTML rendern — leerer String ist sicherer als ungefiltert
    return { __html: "" };
  }

  const clean = dompurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Links: nur http/https erlaubt (kein javascript:, data:, vbscript: etc.)
    ALLOWED_URI_REGEXP: /^https?:/i,
    // rel="noopener noreferrer" auf alle target="_blank" Links erzwingen
    ADD_ATTR: ["target"],
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });

  return { __html: clean };
}

/**
 * Synchrone Version für Fälle wo kein await möglich ist.
 * Nur verwenden wenn DOMPurify bereits geladen wurde (nach erstem await sanitizeHtml()).
 */
export function sanitizeHtmlSync(dirty: string): { __html: string } {
  if (!purify || typeof window === "undefined") {
    return { __html: "" };
  }

  const clean = purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^https?:/i,
  });

  return { __html: clean };
}
