-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 002: Tabellen-Schema
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── ENUM Types ────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('admin', 'team_lead', 'recruiter', 'candidate');
CREATE TYPE candidate_status AS ENUM ('active', 'placed', 'inactive', 'rejected');
CREATE TYPE job_type AS ENUM ('fulltime', 'parttime', 'contract');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'SELECT_SENSITIVE');

-- ── Hilfsfunktion: updated_at automatisch setzen ──────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── users ─────────────────────────────────────────────────────────────────────
-- Erweitert Supabase auth.users mit App-Metadaten.
-- Kein Passwort hier — Auth läuft über auth.users.

CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,              -- Kopie aus auth.users für JOINs
  role        user_role NOT NULL DEFAULT 'candidate',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.users          IS 'App-Profil zu jedem Supabase-Auth-User';
COMMENT ON COLUMN public.users.role     IS 'App-Rolle — wird in JWT als app_metadata.role gespiegelt';
COMMENT ON COLUMN public.users.email    IS 'Kopie aus auth.users — NICHT als Auth-Quelle nutzen';

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_users_role ON public.users(role) WHERE is_active = true;

-- ── candidates ────────────────────────────────────────────────────────────────
-- Sensible Felder (Telefon) werden mit pgsodium verschlüsselt.
-- Der Schlüssel kommt aus dem Supabase Vault (nie im Code).

CREATE TABLE public.candidates (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifikation
  first_name       TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 100),
  last_name        TEXT NOT NULL CHECK (length(last_name) BETWEEN 1 AND 100),
  email            TEXT NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),

  -- Verschlüsselte sensible Daten (bytea, AES-256-GCM via pgsodium)
  -- Lesen/Schreiben nur über die Funktionen decrypt_phone() / encrypt_phone()
  phone_encrypted  BYTEA,                 -- Verschlüsselte Telefonnummer
  cv_url_encrypted BYTEA,                 -- Verschlüsselte Storage-URL

  -- Klartext-Felder (nicht sensitiv)
  job_title        TEXT CHECK (length(job_title) <= 200),
  salary_min       INTEGER CHECK (salary_min >= 0 AND salary_min <= 500000),
  salary_max       INTEGER CHECK (salary_max >= 0 AND salary_max <= 500000),
  skills           TEXT[] DEFAULT '{}',
  status           candidate_status NOT NULL DEFAULT 'active',
  notes            TEXT CHECK (length(notes) <= 5000),

  -- Beziehungen
  created_by       UUID NOT NULL REFERENCES public.users(id),
  assigned_to      UUID REFERENCES public.users(id),  -- Zugewiesener Recruiter

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT salary_range_check CHECK (
    salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max
  ),
  CONSTRAINT email_lowercase CHECK (email = lower(email))
);

COMMENT ON TABLE  public.candidates                   IS 'Kandidaten-Profil (sensible Felder verschlüsselt)';
COMMENT ON COLUMN public.candidates.phone_encrypted   IS 'AES-256-GCM via pgsodium — Key in Supabase Vault';
COMMENT ON COLUMN public.candidates.cv_url_encrypted  IS 'Storage-URL verschlüsselt — verhindert direkten URL-Zugriff';
COMMENT ON COLUMN public.candidates.assigned_to       IS 'Recruiter-Zuweisung — steuert RLS für Recruiter-Rolle';

CREATE TRIGGER candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_candidates_created_by  ON public.candidates(created_by);
CREATE INDEX idx_candidates_assigned_to ON public.candidates(assigned_to);
CREATE INDEX idx_candidates_status      ON public.candidates(status);
CREATE INDEX idx_candidates_email       ON public.candidates(email);

-- ── interview_notes ───────────────────────────────────────────────────────────
-- Nur für HR sichtbar (nie für Kandidaten).
-- notes ebenfalls verschlüsselt (können vertrauliche Einschätzungen enthalten).

CREATE TABLE public.interview_notes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id     UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,

  -- Verschlüsselt: Inhalt darf Kandidat nie sehen
  notes_encrypted  BYTEA NOT NULL,

  -- Metadaten (Klartext, für Suche/Sortierung)
  interview_date   DATE,
  rating           SMALLINT CHECK (rating BETWEEN 1 AND 5),

  created_by       UUID NOT NULL REFERENCES public.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.interview_notes                 IS 'Interview-Notizen — nur für HR (RLS blockiert Kandidaten)';
COMMENT ON COLUMN public.interview_notes.notes_encrypted IS 'Verschlüsselt — Kandidat darf Inhalt nie sehen';

CREATE TRIGGER interview_notes_updated_at
  BEFORE UPDATE ON public.interview_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_notes_candidate ON public.interview_notes(candidate_id);
CREATE INDEX idx_notes_created_by ON public.interview_notes(created_by);

-- ── assignments ───────────────────────────────────────────────────────────────
-- Explizite Tabelle für Recruiter↔Kandidat Zuweisungen (statt nur assigned_to).
-- Ermöglicht Multi-Recruiter-Zugang und History.

CREATE TABLE public.assignments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id   UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  recruiter_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_by    UUID NOT NULL REFERENCES public.users(id),
  assigned_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at     TIMESTAMPTZ,           -- NULL = aktiv, Timestamp = widerrufen

  UNIQUE (candidate_id, recruiter_id, revoked_at)  -- Verhindert Duplikate
);

COMMENT ON TABLE public.assignments IS 'Recruiter↔Kandidat Zuweisungen — steuert RLS-Sichtbarkeit';

CREATE INDEX idx_assignments_recruiter ON public.assignments(recruiter_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_assignments_candidate ON public.assignments(candidate_id) WHERE revoked_at IS NULL;

-- ── audit.log ────────────────────────────────────────────────────────────────
-- IMMUTABLE: kein UPDATE, kein DELETE erlaubt (erzwungen via RLS + Trigger).
-- Wird ausschließlich via Trigger befüllt — kein direkter INSERT von Anwendung.

CREATE TABLE audit.log (
  id           BIGSERIAL PRIMARY KEY,   -- Sequential für chronologische Reihenfolge
  event_time   TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),  -- Echte Uhrzeit, nicht transaction_timestamp()
  user_id      UUID,                    -- NULL bei anonymen Aktionen
  user_email   TEXT,                    -- Snapshot zum Zeitpunkt (Email könnte sich ändern)
  user_role    TEXT,                    -- Snapshot der Rolle
  action       audit_action NOT NULL,
  table_name   TEXT NOT NULL,
  record_id    UUID,                    -- PK des betroffenen Datensatzes
  old_values   JSONB,                   -- Vorher-Werte bei UPDATE/DELETE
  new_values   JSONB,                   -- Nachher-Werte bei INSERT/UPDATE
  ip_address   INET,                    -- Client-IP (aus request.headers via PostgREST)
  request_id   TEXT,                    -- X-Request-ID für End-to-End-Tracing
  changed_fields TEXT[]                 -- Nur geänderte Spalten (effizienter als alles zu speichern)
);

COMMENT ON TABLE  audit.log IS 'Immutable Audit-Trail — kein UPDATE/DELETE erlaubt';
COMMENT ON COLUMN audit.log.old_values IS 'Sensible Felder werden vor Speicherung maskiert';
COMMENT ON COLUMN audit.log.event_time IS 'clock_timestamp() statt now() für Sub-Transaction-Präzision';

-- Partitionierung nach Monat (für effizientes Archivieren alter Logs)
-- Für Produktion: Partition pro Monat erstellen
-- CREATE TABLE audit.log_2026_01 PARTITION OF audit.log FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE INDEX idx_audit_user_id    ON audit.log(user_id, event_time DESC);
CREATE INDEX idx_audit_record_id  ON audit.log(record_id, event_time DESC);
CREATE INDEX idx_audit_table_time ON audit.log(table_name, event_time DESC);
CREATE INDEX idx_audit_time       ON audit.log(event_time DESC);

-- internal.key_metadata ───────────────────────────────────────────────────────
-- Verwaltet Vault-Key-IDs (nie die Keys selbst!).

CREATE TABLE internal.key_metadata (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name    TEXT NOT NULL UNIQUE,           -- 'candidate_pii', 'interview_notes'
  vault_key_id UUID NOT NULL,                 -- Referenz auf pgsodium.valid_key
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  rotated_at  TIMESTAMPTZ,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

COMMENT ON TABLE internal.key_metadata IS 'Vault-Key-IDs — nur service_role Zugriff';
