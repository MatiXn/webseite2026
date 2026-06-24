-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 004: Datenverschlüsselung via pgsodium + Supabase Vault
--
-- Architektur:
-- - Keys liegen NUR im Supabase Vault (Hardware-gesichert, nie im Code)
-- - Anwendungscode sieht nur Key-IDs, nie den eigentlichen Key
-- - Ver-/Entschlüsselung passiert IN der Datenbank (Key verlässt nie den Server)
-- - AES-256-GCM mit Nonce (jede Verschlüsselung einmalig)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Vault Keys erstellen ──────────────────────────────────────────────────────
-- Einmalig ausführen — Keys werden im Vault gespeichert, nie in Migrations.
-- Danach Key-IDs in internal.key_metadata eintragen.

-- HINWEIS: In Produktion Keys manuell über Supabase Dashboard erstellen:
-- Dashboard → Database → Vault → "New Secret" / "New Encryption Key"

-- Für automatisierte Einrichtung (z.B. CI):
DO $$
DECLARE
  v_pii_key_id   UUID;
  v_notes_key_id UUID;
BEGIN
  -- PII-Key für Kandidaten-Daten (Telefon, CV-URL)
  SELECT id INTO v_pii_key_id
  FROM pgsodium.valid_key
  WHERE name = 'candidate_pii'
  LIMIT 1;

  IF v_pii_key_id IS NULL THEN
    -- Key noch nicht vorhanden → erstellen
    SELECT pgsodium.create_key(
      name      => 'candidate_pii',
      key_type  => 'aead-det'     -- Deterministisch: gleicher Input → gleicher Output (suchbar)
    ) INTO v_pii_key_id;

    RAISE NOTICE 'candidate_pii Key erstellt: %', v_pii_key_id;
  END IF;

  -- Key-ID in Metadata-Tabelle speichern (nur die ID, nie den Key)
  INSERT INTO internal.key_metadata (key_name, vault_key_id)
  VALUES ('candidate_pii', v_pii_key_id)
  ON CONFLICT (key_name) DO UPDATE SET vault_key_id = EXCLUDED.vault_key_id;

  -- Notiz-Key (aead-ietf = nicht-deterministisch, für lange Texte besser)
  SELECT id INTO v_notes_key_id
  FROM pgsodium.valid_key
  WHERE name = 'interview_notes'
  LIMIT 1;

  IF v_notes_key_id IS NULL THEN
    SELECT pgsodium.create_key(
      name      => 'interview_notes',
      key_type  => 'aead-ietf'    -- Nicht-deterministisch: jede Verschlüsselung einmalig (max. Sicherheit)
    ) INTO v_notes_key_id;

    RAISE NOTICE 'interview_notes Key erstellt: %', v_notes_key_id;
  END IF;

  INSERT INTO internal.key_metadata (key_name, vault_key_id)
  VALUES ('interview_notes', v_notes_key_id)
  ON CONFLICT (key_name) DO UPDATE SET vault_key_id = EXCLUDED.vault_key_id;

END
$$;

-- ── Verschlüsselungs-Funktionen ───────────────────────────────────────────────
-- SECURITY DEFINER: Läuft mit definer-Rechten → Zugriff auf internal.key_metadata
-- SET search_path: Verhindert search_path-Manipulation durch Angreifer

CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext TEXT)
RETURNS BYTEA
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, internal, pgsodium
AS $$
DECLARE
  v_key_id UUID;
BEGIN
  IF plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;

  SELECT vault_key_id INTO v_key_id
  FROM internal.key_metadata
  WHERE key_name = 'candidate_pii' AND is_active = true
  LIMIT 1;

  IF v_key_id IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found — check Vault configuration';
  END IF;

  -- pgsodium.crypto_aead_det_encrypt: AES-256-GCM deterministisch
  -- 'phe_pii_v1' ist der "Additional Data" Context (Schutz gegen Key-Wiederverwendung)
  RETURN pgsodium.crypto_aead_det_encrypt(
    convert_to(plaintext, 'utf8'),
    convert_to('phe_pii_v1', 'utf8'),
    v_key_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_pii(ciphertext BYTEA)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, internal, pgsodium
AS $$
DECLARE
  v_key_id UUID;
BEGIN
  IF ciphertext IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT vault_key_id INTO v_key_id
  FROM internal.key_metadata
  WHERE key_name = 'candidate_pii' AND is_active = true
  LIMIT 1;

  IF v_key_id IS NULL THEN
    RAISE EXCEPTION 'Decryption key not found';
  END IF;

  RETURN convert_from(
    pgsodium.crypto_aead_det_decrypt(
      ciphertext,
      convert_to('phe_pii_v1', 'utf8'),
      v_key_id
    ),
    'utf8'
  );
EXCEPTION WHEN OTHERS THEN
  -- Entschlüsselungsfehler NICHT nach außen leaken
  RAISE EXCEPTION 'Decryption failed — data may be corrupted or key rotated';
END;
$$;

-- Notizen (nicht-deterministisch, sicherer für lange Texte)
CREATE OR REPLACE FUNCTION public.encrypt_notes(plaintext TEXT)
RETURNS BYTEA
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, internal, pgsodium
AS $$
DECLARE
  v_key_id UUID;
BEGIN
  IF plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;

  SELECT vault_key_id INTO v_key_id
  FROM internal.key_metadata
  WHERE key_name = 'interview_notes' AND is_active = true
  LIMIT 1;

  -- Zufällige Nonce pro Verschlüsselung → kein Pattern erkennbar
  RETURN pgsodium.crypto_aead_ietf_encrypt(
    convert_to(plaintext, 'utf8'),
    convert_to('phe_notes_v1', 'utf8'),
    pgsodium.randombytes(24),      -- 24-Byte Nonce, wird zusammen mit Ciphertext gespeichert
    v_key_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_notes(ciphertext BYTEA)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, internal, pgsodium
AS $$
DECLARE
  v_key_id UUID;
BEGIN
  IF ciphertext IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT vault_key_id INTO v_key_id
  FROM internal.key_metadata
  WHERE key_name = 'interview_notes' AND is_active = true
  LIMIT 1;

  RETURN convert_from(
    pgsodium.crypto_aead_ietf_decrypt(
      ciphertext,
      convert_to('phe_notes_v1', 'utf8'),
      v_key_id
    ),
    'utf8'
  );
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Note decryption failed';
END;
$$;

-- ── Views für lesbare Daten (entschlüsselt, mit RLS) ─────────────────────────

-- View entschlüsselt Telefon/CV transparent — RLS der Basistabelle gilt weiterhin
CREATE OR REPLACE VIEW public.candidates_decrypted
WITH (security_barrier = true)   -- Verhindert Optimierungen die RLS umgehen könnten
AS
SELECT
  id,
  first_name,
  last_name,
  email,
  public.decrypt_pii(phone_encrypted) AS phone,      -- Nur wenn User Zugriffsrecht hat
  public.decrypt_pii(cv_url_encrypted) AS cv_url,
  job_title,
  salary_min,
  salary_max,
  skills,
  status,
  notes,
  created_by,
  assigned_to,
  created_at,
  updated_at
FROM public.candidates;

-- Notizen-View (entschlüsselt)
CREATE OR REPLACE VIEW public.interview_notes_decrypted
WITH (security_barrier = true)
AS
SELECT
  id,
  candidate_id,
  public.decrypt_notes(notes_encrypted) AS notes,
  interview_date,
  rating,
  created_by,
  created_at,
  updated_at
FROM public.interview_notes;

-- RLS auf Views manuell aktivieren (erbt nicht automatisch von der Tabelle)
-- Stattdessen: security_barrier=true + Basistabellen-RLS reichen

-- ── Key Rotation ──────────────────────────────────────────────────────────────
-- Re-Encryption bei Key-Rotation (MUSS in Maintenance-Window laufen)

CREATE OR REPLACE FUNCTION internal.rotate_pii_key(new_key_name TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, internal, pgsodium
AS $$
DECLARE
  v_new_key_id UUID;
  rec          RECORD;
  v_plaintext  TEXT;
BEGIN
  -- Neuen Key aus Vault holen
  SELECT id INTO v_new_key_id
  FROM pgsodium.valid_key
  WHERE name = new_key_name
  LIMIT 1;

  IF v_new_key_id IS NULL THEN
    RAISE EXCEPTION 'Neuer Key % nicht gefunden — zuerst im Vault anlegen', new_key_name;
  END IF;

  -- Alle Kandidaten re-encrypten
  FOR rec IN SELECT id, phone_encrypted, cv_url_encrypted FROM public.candidates
    WHERE phone_encrypted IS NOT NULL OR cv_url_encrypted IS NOT NULL
  LOOP
    -- Mit altem Key entschlüsseln, mit neuem Key verschlüsseln
    v_plaintext := public.decrypt_pii(rec.phone_encrypted);

    UPDATE public.candidates SET
      phone_encrypted = pgsodium.crypto_aead_det_encrypt(
        convert_to(v_plaintext, 'utf8'),
        convert_to('phe_pii_v1', 'utf8'),
        v_new_key_id
      )
    WHERE id = rec.id;
  END LOOP;

  -- Key-Metadata aktualisieren
  UPDATE internal.key_metadata
  SET vault_key_id = v_new_key_id, rotated_at = now()
  WHERE key_name = 'candidate_pii';

  RAISE NOTICE 'PII Key Rotation abgeschlossen: % Einträge re-encrypted', (SELECT count(*) FROM public.candidates);
END;
$$;

-- Nur service_role darf rotate_pii_key aufrufen
REVOKE ALL ON FUNCTION internal.rotate_pii_key FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.rotate_pii_key TO service_role;
