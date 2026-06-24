-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 006: Supabase Auth Integration
--
-- Wenn ein User sich registriert → automatisch users-Zeile erstellen.
-- Wenn Admin eine Rolle ändert → JWT app_metadata aktualisieren (für RLS-Checks).
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Trigger: Neuer User → public.users eintragen ──────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Standard-Rolle: candidate (Recruiter werden manuell durch Admin hochgestuft)
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_app_meta_data->>'role')::user_role,  -- Falls Admin pre-assigned hat
      'candidate'
    )
  )
  ON CONFLICT (id) DO NOTHING;  -- Idempotent (bei Re-Registrierung)

  -- app_metadata setzen damit JWT die Rolle enthält
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('role', 'candidate')
  WHERE id = NEW.id
    AND (raw_app_meta_data->>'role') IS NULL;

  RETURN NEW;
END;
$$;

-- Auf auth.users triggern (Supabase-intern)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Funktion: Rolle ändern (Admin-only) ───────────────────────────────────────
-- Ändert Rolle in public.users UND in auth.users.raw_app_meta_data.
-- JWT enthält app_metadata → wird bei nächstem Token-Refresh wirksam.

CREATE OR REPLACE FUNCTION public.set_user_role(
  target_user_id UUID,
  new_role user_role
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_caller_role user_role;
BEGIN
  -- Sicherheitscheck: nur Admin darf Rollen ändern
  SELECT role INTO v_caller_role FROM public.users WHERE id = auth.uid();

  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'Nur Admins dürfen Rollen ändern. Aktuelle Rolle: %', v_caller_role;
  END IF;

  -- Verhindert Privilege-Escalation auf sich selbst
  IF target_user_id = auth.uid() AND new_role != 'admin' THEN
    RAISE EXCEPTION 'Admins können sich selbst nicht downgraden — anderer Admin nötig';
  END IF;

  -- 1. public.users aktualisieren
  UPDATE public.users
  SET role = new_role
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % nicht gefunden', target_user_id;
  END IF;

  -- 2. auth.users.raw_app_meta_data aktualisieren → JWT trägt neue Rolle
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('role', new_role::text)
  WHERE id = target_user_id;

  -- 3. Aktive Sessions invalidieren (erzwingt Token-Refresh)
  -- Supabase: DELETE aus auth.sessions erzwingt Re-Auth
  DELETE FROM auth.sessions WHERE user_id = target_user_id;

  RAISE NOTICE 'User % Rolle geändert zu % — Sessions invalidiert', target_user_id, new_role;
END;
$$;

-- Zugriff einschränken
REVOKE ALL ON FUNCTION public.set_user_role FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_user_role TO authenticated;  -- intern: Admin-Check

-- ── Funktion: User deaktivieren ───────────────────────────────────────────────
-- Setzt is_active = false + sperrt Supabase-Auth-Zugang.

CREATE OR REPLACE FUNCTION public.deactivate_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_caller_role user_role;
BEGIN
  SELECT role INTO v_caller_role FROM public.users WHERE id = auth.uid();
  IF v_caller_role != 'admin' THEN
    RAISE EXCEPTION 'Nur Admins dürfen User deaktivieren';
  END IF;

  -- Deaktivieren in public.users
  UPDATE public.users SET is_active = false WHERE id = target_user_id;

  -- Supabase-Auth: User sperren (banned_until = Zukunft)
  UPDATE auth.users
  SET banned_until = 'infinity'::TIMESTAMPTZ
  WHERE id = target_user_id;

  -- Alle aktiven Sessions beenden
  DELETE FROM auth.sessions WHERE user_id = target_user_id;
  DELETE FROM auth.refresh_tokens WHERE user_id = target_user_id;

  RAISE NOTICE 'User % deaktiviert und ausgeloggt', target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.deactivate_user FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deactivate_user TO authenticated;

-- ── Grants auf Tabellen ───────────────────────────────────────────────────────
-- authenticated: nur explizit benötigte Operationen (kein TRUNCATE, kein REFERENCES)

GRANT SELECT, INSERT, UPDATE        ON public.users            TO authenticated;
GRANT SELECT, INSERT, UPDATE        ON public.candidates       TO authenticated;
GRANT SELECT, INSERT, UPDATE        ON public.interview_notes  TO authenticated;
GRANT SELECT, INSERT, UPDATE        ON public.assignments      TO authenticated;
GRANT SELECT                        ON audit.log               TO authenticated;
GRANT SELECT                        ON public.candidates_decrypted       TO authenticated;
GRANT SELECT                        ON public.interview_notes_decrypted  TO authenticated;

-- Encrypt/Decrypt-Funktionen: nur authenticated, nicht anon
GRANT EXECUTE ON FUNCTION public.encrypt_pii(TEXT)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrypt_pii(BYTEA)  TO authenticated;
GRANT EXECUTE ON FUNCTION public.encrypt_notes(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrypt_notes(BYTEA) TO authenticated;

-- anon: nichts (DEFAULT DENY)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA audit  FROM anon;
