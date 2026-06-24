-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 003: Row Level Security Policies
--
-- Design-Prinzipien:
-- 1. DEFAULT DENY: RLS aktiviert → kein Zugriff bis explizit gewährt
-- 2. Least Privilege: Jede Rolle bekommt nur was sie braucht
-- 3. Policy-Funktionen: Helfer-Funktionen für wiederverwendbare Checks
-- 4. SECURITY DEFINER: Helfer laufen mit definer-Rechten, nicht caller-Rechten
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── RLS aktivieren (DEFAULT DENY) ─────────────────────────────────────────────

ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.log             ENABLE ROW LEVEL SECURITY;

-- FORCE RLS auch für Tabellen-Eigentümer (verhindert Policy-Bypass durch postgres-User)
ALTER TABLE public.users          FORCE ROW LEVEL SECURITY;
ALTER TABLE public.candidates     FORCE ROW LEVEL SECURITY;
ALTER TABLE public.interview_notes FORCE ROW LEVEL SECURITY;
ALTER TABLE public.assignments    FORCE ROW LEVEL SECURITY;
ALTER TABLE audit.log             FORCE ROW LEVEL SECURITY;

-- ── Policy-Hilfsfunktionen ─────────────────────────────────────────────────────
-- SECURITY DEFINER + search_path-Fix verhindert SQL Injection über search_path.
-- STABLE: Ergebnis ist innerhalb einer Transaktion konstant (Performance).

CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT auth.user_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION auth.is_hr()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT auth.user_role() IN ('admin', 'team_lead', 'recruiter');
$$;

CREATE OR REPLACE FUNCTION auth.is_recruiter_or_above()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT auth.user_role() IN ('admin', 'team_lead', 'recruiter');
$$;

-- Prüft ob der aktuelle User einem Kandidaten zugewiesen ist
CREATE OR REPLACE FUNCTION auth.has_candidate_access(candidate_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.assignments
    WHERE candidate_id = candidate_uuid
      AND recruiter_id  = auth.uid()
      AND revoked_at IS NULL      -- Nur aktive Zuweisungen
  );
$$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: public.users
-- ═══════════════════════════════════════════════════════════════════════════════

-- User sieht nur sein eigenes Profil
CREATE POLICY "users: eigenes Profil lesen"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admin sieht alle User
CREATE POLICY "users: admin sieht alles"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.is_admin());

-- HR sieht andere HR-User (für Zuweisung)
CREATE POLICY "users: HR sieht HR-User"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    auth.is_hr()
    AND role IN ('admin', 'team_lead', 'recruiter')
  );

-- User kann eigenes Profil updaten (nur name/preferences, nicht role)
CREATE POLICY "users: eigenes Profil updaten"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Role darf User nicht selbst ändern (nur Admin)
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

-- Admin kann alle User verwalten
CREATE POLICY "users: admin verwaltet alle"
  ON public.users FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: public.candidates
-- ═══════════════════════════════════════════════════════════════════════════════

-- Admin sieht alle Kandidaten
CREATE POLICY "candidates: admin sieht alles"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (auth.is_admin());

-- Recruiter sieht NUR zugewiesene Kandidaten (nicht alle)
CREATE POLICY "candidates: recruiter sieht zugewiesene"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (
    auth.user_role() IN ('recruiter', 'team_lead')
    AND (
      -- Direkt zugewiesen über assignments-Tabelle
      auth.has_candidate_access(id)
      -- ODER selbst angelegt
      OR created_by = auth.uid()
    )
  );

-- Kandidat sieht NUR sein eigenes Profil
-- (candidates.email verknüpft mit auth-Email)
CREATE POLICY "candidates: kandidat sieht sich selbst"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (
    auth.user_role() = 'candidate'
    AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- HR kann Kandidaten anlegen
CREATE POLICY "candidates: HR kann anlegen"
  ON public.candidates FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.is_hr()
    AND created_by = auth.uid()   -- created_by muss eigene ID sein (kein Spoofing)
  );

-- Recruiter kann zugewiesene Kandidaten updaten
CREATE POLICY "candidates: recruiter kann zugewiesene updaten"
  ON public.candidates FOR UPDATE
  TO authenticated
  USING (
    auth.is_hr()
    AND (auth.is_admin() OR auth.has_candidate_access(id) OR created_by = auth.uid())
  )
  WITH CHECK (
    auth.is_hr()
    AND (auth.is_admin() OR auth.has_candidate_access(id) OR created_by = auth.uid())
  );

-- Nur Admin kann Kandidaten löschen (soft delete bevorzugen → status = 'inactive')
CREATE POLICY "candidates: nur admin darf löschen"
  ON public.candidates FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: public.interview_notes
-- WICHTIG: Kandidaten sehen NIEMALS Notizen über sich selbst.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Admin sieht alle Notizen
CREATE POLICY "notes: admin sieht alles"
  ON public.interview_notes FOR SELECT
  TO authenticated
  USING (auth.is_admin());

-- Recruiter sieht Notizen NUR für zugewiesene Kandidaten
CREATE POLICY "notes: recruiter sieht zugewiesene"
  ON public.interview_notes FOR SELECT
  TO authenticated
  USING (
    auth.user_role() IN ('recruiter', 'team_lead')
    AND auth.has_candidate_access(candidate_id)
  );

-- HR kann Notizen anlegen (nur für zugewiesene Kandidaten)
CREATE POLICY "notes: HR kann anlegen"
  ON public.interview_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.is_hr()
    AND created_by = auth.uid()
    AND (
      auth.is_admin()
      OR auth.has_candidate_access(candidate_id)
    )
  );

-- Nur Ersteller oder Admin kann Notizen ändern
CREATE POLICY "notes: ersteller oder admin kann updaten"
  ON public.interview_notes FOR UPDATE
  TO authenticated
  USING (
    auth.is_hr()
    AND (created_by = auth.uid() OR auth.is_admin())
  )
  WITH CHECK (
    auth.is_hr()
    AND (created_by = auth.uid() OR auth.is_admin())
  );

-- Nur Admin löscht Notizen
CREATE POLICY "notes: nur admin darf löschen"
  ON public.interview_notes FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: public.assignments
-- ═══════════════════════════════════════════════════════════════════════════════

-- HR sieht Zuweisungen für eigene Kandidaten
CREATE POLICY "assignments: recruiter sieht eigene"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (
    auth.is_hr()
    AND (
      recruiter_id = auth.uid()
      OR auth.is_admin()
    )
  );

-- Nur Admin und Team Lead können Zuweisungen erstellen
CREATE POLICY "assignments: team_lead und admin können zuweisen"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.user_role() IN ('admin', 'team_lead')
    AND assigned_by = auth.uid()
  );

-- Nur Admin und Team Lead können Zuweisungen widerrufen
CREATE POLICY "assignments: team_lead und admin können widerrufen"
  ON public.assignments FOR UPDATE
  TO authenticated
  USING (auth.user_role() IN ('admin', 'team_lead'))
  WITH CHECK (auth.user_role() IN ('admin', 'team_lead'));

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: audit.log
-- Immutable: SELECT nur für Admin, INSERT nur via Trigger, kein UPDATE/DELETE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Audit-Log: nur Admin darf lesen
CREATE POLICY "audit: nur admin liest"
  ON audit.log FOR SELECT
  TO authenticated
  USING (auth.is_admin());

-- INSERT: nur via Trigger (service_role) — kein direkter API-Zugang
-- authenticated darf NICHT direkt in audit.log schreiben
-- service_role ist exempt von RLS → Trigger-Inserts funktionieren

-- Kein UPDATE oder DELETE Policy → kein UPDATE/DELETE möglich (DEFAULT DENY)

-- ═══════════════════════════════════════════════════════════════════════════════
-- anon: explizit alles verbieten
-- ═══════════════════════════════════════════════════════════════════════════════
-- Keine Policy für anon → DEFAULT DENY greift
-- Anon Key hat nur Zugang zu explizit freigegebenen Public-Daten

-- Beispiel: Wenn Job-Listings public sein sollen:
-- CREATE POLICY "jobs: public lesen" ON public.jobs FOR SELECT TO anon USING (is_published = true);
