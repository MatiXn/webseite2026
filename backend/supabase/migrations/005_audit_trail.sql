-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 005: Automatischer Audit Trail
--
-- Trigger auf candidates, interview_notes, assignments.
-- Audit-Log ist immutable: kein UPDATE/DELETE möglich (RLS + separate Rolle).
-- Sensible Felder werden MASKIERT bevor sie in den Log gehen.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Sensible Felder maskieren ─────────────────────────────────────────────────
-- phone_encrypted, cv_url_encrypted etc. werden nicht in den Log geschrieben.
-- Nur Metadaten (Feld geändert: ja/nein) werden geloggt.

CREATE OR REPLACE FUNCTION internal.mask_sensitive_fields(data JSONB)
RETURNS JSONB
LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
SET search_path = public, internal
AS $$
DECLARE
  SENSITIVE_KEYS CONSTANT TEXT[] := ARRAY[
    'phone_encrypted', 'cv_url_encrypted', 'notes_encrypted',
    'phone', 'cv_url', 'notes'   -- Für den Fall dass Views geloggt werden
  ];
  key TEXT;
BEGIN
  IF data IS NULL THEN
    RETURN NULL;
  END IF;

  FOREACH key IN ARRAY SENSITIVE_KEYS LOOP
    IF data ? key THEN
      -- Nicht den Wert loggen, nur dass das Feld vorhanden war
      data := jsonb_set(data, ARRAY[key], '"[ENCRYPTED]"'::jsonb);
    END IF;
  END LOOP;

  RETURN data;
END;
$$;

-- ── Haupt-Audit-Trigger-Funktion ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION internal.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, audit, internal, auth
AS $$
DECLARE
  v_old_data       JSONB;
  v_new_data       JSONB;
  v_changed_fields TEXT[];
  v_user_id        UUID;
  v_user_email     TEXT;
  v_user_role      TEXT;
  v_action         audit_action;
  v_record_id      UUID;
  v_ip             INET;
  v_request_id     TEXT;
BEGIN
  -- ── Aktion bestimmen ──────────────────────────────────────────────────
  v_action := TG_OP::audit_action;

  -- ── User-Kontext aus Supabase-JWT ─────────────────────────────────────
  v_user_id := auth.uid();

  -- User-Details zum Zeitpunkt des Events (Snapshot — nicht JOIN auf users)
  SELECT email, role::TEXT INTO v_user_email, v_user_role
  FROM public.users
  WHERE id = v_user_id;

  -- IP und Request-ID aus PostgREST-Headers (werden als Setting übergeben)
  v_ip         := current_setting('request.headers', true)::jsonb->>'x-real-ip';
  v_request_id := current_setting('request.headers', true)::jsonb->>'x-request-id';

  -- ── Record-ID bestimmen ───────────────────────────────────────────────
  IF TG_OP = 'DELETE' THEN
    v_record_id := OLD.id;
  ELSE
    v_record_id := NEW.id;
  END IF;

  -- ── Daten aufbereiten (sensible Felder maskieren) ─────────────────────
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    v_old_data := internal.mask_sensitive_fields(to_jsonb(OLD));
  END IF;

  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    v_new_data := internal.mask_sensitive_fields(to_jsonb(NEW));
  END IF;

  -- ── Nur geänderte Felder bei UPDATE tracken (effizienter) ────────────
  IF TG_OP = 'UPDATE' THEN
    SELECT array_agg(key) INTO v_changed_fields
    FROM jsonb_each(v_old_data) old_row
    FULL OUTER JOIN jsonb_each(v_new_data) new_row USING (key)
    WHERE old_row.value IS DISTINCT FROM new_row.value;
  END IF;

  -- ── In audit.log einfügen ─────────────────────────────────────────────
  -- clock_timestamp() statt now() für präzisen Timestamp auch bei Bulk-Ops
  INSERT INTO audit.log (
    event_time,
    user_id,
    user_email,
    user_role,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    request_id,
    changed_fields
  ) VALUES (
    clock_timestamp(),
    v_user_id,
    v_user_email,
    v_user_role,
    v_action,
    TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
    v_record_id,
    v_old_data,
    v_new_data,
    v_ip,
    v_request_id,
    v_changed_fields
  );

  -- Trigger gibt nichts zurück bei AFTER TRIGGER
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;

EXCEPTION WHEN OTHERS THEN
  -- Audit-Fehler dürfen NICHT die eigentliche Transaktion stoppen
  -- Stattdessen: Minimal-Log mit Fehlerinfo
  INSERT INTO audit.log (event_time, action, table_name, new_values)
  VALUES (
    clock_timestamp(),
    TG_OP::audit_action,
    TG_TABLE_NAME,
    jsonb_build_object('audit_error', SQLERRM, 'user_id', v_user_id::text)
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- ── Trigger auf alle relevanten Tabellen ─────────────────────────────────────

CREATE TRIGGER audit_candidates
  AFTER INSERT OR UPDATE OR DELETE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION internal.audit_trigger();

CREATE TRIGGER audit_interview_notes
  AFTER INSERT OR UPDATE OR DELETE ON public.interview_notes
  FOR EACH ROW EXECUTE FUNCTION internal.audit_trigger();

CREATE TRIGGER audit_assignments
  AFTER INSERT OR UPDATE OR DELETE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION internal.audit_trigger();

CREATE TRIGGER audit_users
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION internal.audit_trigger();

-- ── Audit-Log schützen: kein UPDATE/DELETE ────────────────────────────────────

CREATE OR REPLACE FUNCTION audit.prevent_modification()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = audit
AS $$
BEGIN
  RAISE EXCEPTION
    'Audit-Log ist unveränderlich — UPDATE/DELETE auf audit.log sind verboten. '
    'Anfragen an Security-Team richten. (DSGVO Art. 5 Abs. 2)';
END;
$$;

CREATE TRIGGER audit_log_immutable
  BEFORE UPDATE OR DELETE ON audit.log
  FOR EACH ROW EXECUTE FUNCTION audit.prevent_modification();

-- ── DSGVO-konforme Löschroutine ───────────────────────────────────────────────
-- Wenn ein Kandidat gelöscht wird (Right to be forgotten, Art. 17 DSGVO):
-- Echte Daten anonymisieren, Audit-Trail bleibt aber erhalten (Nachweis-Pflicht)

CREATE OR REPLACE FUNCTION public.anonymize_candidate(candidate_uuid UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, audit, internal
AS $$
DECLARE
  v_caller_role user_role;
BEGIN
  -- Nur Admin darf anonymisieren
  SELECT role INTO v_caller_role FROM public.users WHERE id = auth.uid();
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'Nur Admins dürfen Kandidaten anonymisieren (DSGVO Art. 17)';
  END IF;

  -- Daten anonymisieren (nicht löschen — Audit-Trail bleibt)
  UPDATE public.candidates SET
    first_name       = '[Anonymisiert]',
    last_name        = '[Anonymisiert]',
    email            = 'anonymized-' || candidate_uuid || '@deleted.invalid',
    phone_encrypted  = NULL,
    cv_url_encrypted = NULL,
    notes            = '[Anonymisiert per DSGVO Art. 17 — ' || now()::date || ']',
    skills           = '{}',
    status           = 'inactive'
  WHERE id = candidate_uuid;

  -- Interview-Notizen ebenfalls anonymisieren
  UPDATE public.interview_notes SET
    notes_encrypted = public.encrypt_notes('[Anonymisiert per DSGVO Art. 17 — ' || now()::date || ']')
  WHERE candidate_id = candidate_uuid;

  -- Audit-Log-Eintrag für die Anonymisierung
  INSERT INTO audit.log (event_time, user_id, action, table_name, record_id, new_values)
  VALUES (
    clock_timestamp(),
    auth.uid(),
    'DELETE',
    'public.candidates (anonymized)',
    candidate_uuid,
    jsonb_build_object(
      'action', 'DSGVO_ANONYMIZATION',
      'article', 'Art. 17 DSGVO',
      'requested_by', auth.uid()
    )
  );

  RAISE NOTICE 'Kandidat % anonymisiert (DSGVO Art. 17)', candidate_uuid;
END;
$$;

-- Zugriff einschränken
REVOKE ALL ON FUNCTION public.anonymize_candidate FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.anonymize_candidate TO authenticated;  -- RLS prüft Admin-Rolle intern

-- ── Audit-Log Archivierung ────────────────────────────────────────────────────
-- Logs älter als 2 Jahre in Archive-Tabelle verschieben (DSGVO: so lange wie nötig)

CREATE TABLE IF NOT EXISTS audit.log_archive (
  LIKE audit.log INCLUDING ALL
);
COMMENT ON TABLE audit.log_archive IS 'Archiv: Audit-Logs älter als 2 Jahre';

CREATE OR REPLACE FUNCTION audit.archive_old_logs()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = audit
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Logs älter als 2 Jahre archivieren
  WITH moved AS (
    DELETE FROM audit.log
    WHERE event_time < now() - INTERVAL '2 years'
    RETURNING *
  )
  INSERT INTO audit.log_archive SELECT * FROM moved;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RAISE NOTICE '% Audit-Log-Einträge archiviert', v_count;
  RETURN v_count;
END;
$$;
