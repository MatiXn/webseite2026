/**
 * Sicherer API-Client für PHE ATS.
 *
 * Security-Maßnahmen:
 * - Tokens werden NICHT aus localStorage gelesen — kommen aus HttpOnly Cookies
 *   (der Browser sendet sie automatisch via credentials: "include")
 * - CSRF-Token wird bei Mutations (POST/PUT/PATCH/DELETE) mitgesendet
 * - Alle Fehler werden normalisiert — keine PII/Stack-Traces an UI
 * - Kein eval(), kein new Function(), kein dangerouslySetInnerHTML
 * - Automatisches Token-Refresh bei 401
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_URL && typeof window !== "undefined") {
  console.error("[apiClient] NEXT_PUBLIC_API_URL is not set");
}

// ── CSRF Token ─────────────────────────────────────────────────────────────────
// Supabase Auth setzt einen CSRF-Token als normales Cookie (nicht HttpOnly).
// Wir lesen ihn aus dem Cookie und senden ihn als Header mit.
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ── Typen ──────────────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  message: string;
  // Niemals rohe Backend-Fehler durchreichen — nur normalisierte Messages
}

class ApiClientError extends Error {
  constructor(public readonly error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
  }
}

// ── Error-Normalisierung ───────────────────────────────────────────────────────

function normalizeError(status: number, body: unknown): ApiError {
  // Kein Stack-Trace, keine DB-Fehlermeldungen, keine internen Details an UI
  const safeMessages: Record<number, string> = {
    400: "Ungültige Eingabe. Bitte prüfen Sie Ihre Angaben.",
    401: "Sitzung abgelaufen. Bitte melden Sie sich erneut an.",
    403: "Sie haben keine Berechtigung für diese Aktion.",
    404: "Der angeforderte Datensatz wurde nicht gefunden.",
    413: "Die Datei ist zu groß (max. 10 MB).",
    415: "Dieses Dateiformat wird nicht unterstützt.",
    422: "Die Eingabe konnte nicht verarbeitet werden.",
    429: "Zu viele Anfragen. Bitte warten Sie einen Moment.",
    500: "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
  };

  return {
    status,
    message: safeMessages[status] ?? "Ein unbekannter Fehler ist aufgetreten.",
  };
}

// ── Basis-Fetch ────────────────────────────────────────────────────────────────

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const isMutation = MUTATION_METHODS.has(method);

  const headers = new Headers(options.headers);

  // JSON Content-Type für Body-Requests
  if (isMutation && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // CSRF-Schutz: Token als Header bei allen Mutations mitsenden
  if (isMutation) {
    const csrf = getCsrfToken();
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  // Request-ID für End-to-End-Tracing
  headers.set("X-Request-ID", crypto.randomUUID());

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      method,
      headers,
      // credentials: "include" → Browser sendet HttpOnly Cookies automatisch
      // NIEMALS Tokens aus localStorage lesen und als Header setzen!
      credentials: "include",
    });
  } catch {
    // Netzwerkfehler — keine internen Details an UI
    throw new ApiClientError({ status: 0, message: "Netzwerkfehler. Bitte prüfen Sie Ihre Internetverbindung." });
  }

  // Automatisches Token-Refresh bei 401
  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Einmalig wiederholen nach Refresh
      return request<T>(path, options);
    }
    // Refresh fehlgeschlagen → User zur Login-Seite
    if (typeof window !== "undefined") {
      window.location.href = "/login?reason=session_expired";
    }
    throw new ApiClientError(normalizeError(401, null));
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new ApiClientError(normalizeError(response.status, body));
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ── Token Refresh ──────────────────────────────────────────────────────────────

let _refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  // Deduplizieren: wenn Refresh bereits läuft, auf dasselbe Promise warten
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",   // HttpOnly Refresh-Cookie wird automatisch mitgesendet
        headers: { "X-CSRF-Token": getCsrfToken() ?? "" },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),

  // File-Upload: FormData (kein JSON, kein Content-Type setzen — Browser macht das)
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData }),
};

export { ApiClientError };
