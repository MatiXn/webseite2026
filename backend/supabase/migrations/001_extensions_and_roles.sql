-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 001: Extensions, Rollen, Schemas
-- Reihenfolge: Diese Migration muss als erste laufen.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────────────────────────────

-- UUID v4 für alle Primary Keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- pgsodium für serverseitige Verschlüsselung (in Supabase vorhanden)
-- Vault-Secrets werden über pgsodium.create_key() verwaltet
CREATE EXTENSION IF NOT EXISTS "pgsodium";

-- pg_audit für erweiterte Audit-Logs (optional, als Alternative zu Trigger-Logs)
-- CREATE EXTENSION IF NOT EXISTS "pgaudit";  -- Aktivierung via Supabase Support

-- ── Schemas ───────────────────────────────────────────────────────────────────

-- Öffentliche Tabellen (RLS-geschützt)
-- public schema bereits vorhanden

-- Internes Schema: nur service_role hat Zugriff
CREATE SCHEMA IF NOT EXISTS internal;

-- Audit Schema: nur append-only, kein DELETE/UPDATE
CREATE SCHEMA IF NOT EXISTS audit;

COMMENT ON SCHEMA audit   IS 'Unveränderliche Audit-Logs (nur INSERT via Trigger)';
COMMENT ON SCHEMA internal IS 'Interne Verwaltungstabellen — kein direkter API-Zugriff';

-- ── Datenbankrollen ───────────────────────────────────────────────────────────
-- Supabase erstellt automatisch: anon, authenticated, service_role
-- Wir fügen eine read-only Rolle für Monitoring hinzu

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'monitoring_readonly') THEN
    CREATE ROLE monitoring_readonly NOLOGIN;
    COMMENT ON ROLE monitoring_readonly IS 'Lesezugriff auf Monitoring-Views — kein Zugriff auf Nutzdaten';
  END IF;
END
$$;

-- ── Schema-Grants ─────────────────────────────────────────────────────────────

-- anon: NUR public schema, NUR explizit gewährte Tabellen
REVOKE ALL ON SCHEMA public FROM anon;
REVOKE ALL ON SCHEMA internal FROM anon;
REVOKE ALL ON SCHEMA audit FROM anon;

-- authenticated: public schema (RLS schränkt Zugriff pro Tabelle ein)
GRANT USAGE ON SCHEMA public TO authenticated;

-- service_role: vollen Zugriff (nur Backend verwendet diesen Key)
GRANT USAGE ON SCHEMA internal TO service_role;
GRANT USAGE ON SCHEMA audit TO service_role;

-- monitoring: nur Monitoring-Views
GRANT USAGE ON SCHEMA public TO monitoring_readonly;
