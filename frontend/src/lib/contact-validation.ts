// Server-seitige Validierung + Escaping für Kontakt-/Talentanfragen

export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PRIVATE_DOMAINS = [
  "gmail", "googlemail", "gmx", "web", "yahoo", "hotmail", "outlook",
  "live", "msn", "freenet", "arcor", "aol", "icloud", "me", "mac",
  "proton", "protonmail", "mailbox", "tutanota", "t-online", "posteo",
];

export function isValidEmail(email: string): boolean {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email);
}

export function isBusinessEmail(email: string): boolean {
  if (!isValidEmail(email)) return false;
  const domain = email.split("@").pop()!.toLowerCase();
  const parts = domain.split(".");
  // Alle Labels prüfen, nicht nur die Second-Level-Domain (blockt auch x.gmail.com)
  return !parts.some(p => PRIVATE_DOMAINS.includes(p));
}

export function isGermanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-/()]/g, "");
  return /^(\+49|0049|0)[1-9]\d{6,14}$/.test(cleaned);
}

type FieldSpec = { key: string; required?: boolean; max: number };

// Gibt getrimmte, längenbegrenzte Strings zurück oder einen Fehlertext
export function sanitizeFields(
  body: Record<string, unknown>,
  specs: FieldSpec[]
): { ok: true; fields: Record<string, string> } | { ok: false; error: string } {
  const fields: Record<string, string> = {};
  for (const { key, required, max } of specs) {
    const raw = body[key];
    if (raw != null && typeof raw !== "string" && typeof raw !== "number") {
      return { ok: false, error: `Ungültiges Feld: ${key}` };
    }
    const val = String(raw ?? "").trim();
    if (required && !val) return { ok: false, error: `Pflichtfeld fehlt: ${key}` };
    if (val.length > max) return { ok: false, error: `Feld zu lang: ${key}` };
    fields[key] = val;
  }
  return { ok: true, fields };
}

// Einfaches In-Memory-Rate-Limit (pro Serverless-Instanz; bremst simple Spam-Skripte)
const hits = new Map<string, number[]>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter(t => now - t < windowMs);
  if (list.length >= limit) return false;
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 10_000) hits.clear();
  return true;
}
