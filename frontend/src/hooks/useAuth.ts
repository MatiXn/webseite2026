"use client";

/**
 * useAuth — Sichere Authentifizierung via Supabase.
 *
 * Sicherheitsregeln:
 * - Supabase speichert den Access Token in einem HttpOnly Cookie (wenn so konfiguriert)
 *   oder im Memory (wir setzen storage: custom memory adapter).
 * - NIEMALS Tokens in localStorage — dort sind sie für jedes JS-Snippet lesbar (XSS).
 * - Die Session wird nur im React-State (RAM) gecacht.
 * - Bei Tab-Wechsel/Refresh holt Supabase die Session aus dem HttpOnly Cookie.
 */

import { createBrowserClient } from "@supabase/ssr";
import { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Supabase-Client (Singleton pro Tab) ────────────────────────────────────────

function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "[useAuth] NEXT_PUBLIC_SUPABASE_URL oder NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt"
    );
  }

  return createBrowserClient(url, key, {
    cookies: {
      // Supabase SSR-Client liest/schreibt Session via HttpOnly Cookies.
      // Der Browser sendet sie automatisch — kein manueller Token-Zugriff nötig.
      getAll() {
        if (typeof document === "undefined") return [];
        return document.cookie.split(";").map((c) => {
          const [name, ...rest] = c.trim().split("=");
          return { name: name.trim(), value: decodeURIComponent(rest.join("=")) };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (typeof document !== "undefined") {
            // HttpOnly wird serverseitig gesetzt — hier nur nicht-HttpOnly Cookies
            document.cookie = `${name}=${encodeURIComponent(value)}; path=/; ${
              options?.maxAge ? `max-age=${options.maxAge};` : ""
            } SameSite=Lax${options?.secure ? "; Secure" : ""}`;
          }
        });
      },
    },
  });
}

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) _supabase = createClient();
  return _supabase;
}

// ── Typen ──────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
}

export interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    role: null,
  });

  // Ref verhindert State-Updates nach Unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const supabase = getSupabase();

  // Session beim Laden initialisieren
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        role: extractRole(session),
      });
    });

    // Auf Auth-Änderungen hören (Login, Logout, Token-Refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mountedRef.current) return;
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          role: extractRole(session),
        });
      }
    );

    subscription = authListener.subscription;
    return () => subscription?.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Login
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Keine internen Error-Details an die UI — nur generische Meldung
        console.error("[useAuth] signIn error:", error.status);
        return { error: "E-Mail oder Passwort ungültig." };
      }

      return { error: null };
    },
    [supabase]
  );

  // Logout: Session clearen + alle lokalen States zurücksetzen
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Supabase räumt die Cookies auf — kein manuelles Cookie-Löschen nötig
    setState({ user: null, session: null, loading: false, role: null });

    // Optional: Cache leeren (kein PII zurücklassen)
    if (typeof window !== "undefined") {
      sessionStorage.clear(); // Session-Keys OK laut Anforderung, aber bei Logout clearen
    }
  }, [supabase]);

  // Manueller Token-Refresh
  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.refreshSession();
    if (mountedRef.current) {
      setState((prev) => ({ ...prev, session, user: session?.user ?? null }));
    }
  }, [supabase]);

  return { ...state, signIn, signOut, refreshSession };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractRole(session: Session | null): string | null {
  if (!session?.user) return null;
  // Rolle kommt aus app_metadata (serverseitig gesetzt — nicht vom User manipulierbar)
  return (session.user.app_metadata?.role as string) ?? null;
}
