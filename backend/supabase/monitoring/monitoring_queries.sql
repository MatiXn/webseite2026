-- ═══════════════════════════════════════════════════════════════════════════════
-- Monitoring Queries — PHE ATS Database Security
-- Ausführen als: service_role oder admin-User
-- Empfohlene Frequenz: täglich via pg_cron oder externem Monitoring-Tool
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── 1. Sicherheitsübersicht: RLS-Status aller Tabellen ────────────────────────
-- Alarm: wenn rowsecurity = false für irgendeine Produktionstabelle

SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled,
  CASE WHEN rowsecurity THEN '✅ RLS aktiv' ELSE '🚨 RLS DEAKTIVIERT' END AS status
FROM pg_tables
WHERE schemaname IN ('public', 'audit', 'internal')
ORDER BY schemaname, tablename;

-- ── 2. Alle aktiven RLS-Policies ─────────────────────────────────────────────

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd AS operation,
  qual AS using_expression
FROM pg_policies
WHERE schemaname IN ('public', 'audit')
ORDER BY tablename, cmd, policyname;

-- ── 3. Failed Login Versuche (letzte 24h) ────────────────────────────────────
-- Supabase Auth schreibt Failed-Attempts in auth.audit_log_entries

SELECT
  date_trunc('hour', created_at) AS stunde,
  payload->>'action' AS aktion,
  count(*) AS anzahl,
  CASE WHEN count(*) > 10 THEN '🚨 Brute-Force Verdacht' ELSE '✅ Normal' END AS bewertung
FROM auth.audit_log_entries
WHERE created_at > now() - INTERVAL '24 hours'
  AND payload->>'action' IN ('user_signedup', 'user_failed_sign_in', 'token_refreshed')
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;

-- ── 4. Suspicious Activity: Massenabfragen ────────────────────────────────────
-- Alarm: wenn ein User >100 Kandidaten in 1h liest

SELECT
  user_id,
  user_email,
  user_role,
  count(*) AS select_count,
  min(event_time) AS first_event,
  max(event_time) AS last_event,
  CASE WHEN count(*) > 100 THEN '🚨 Massen-Export Verdacht' ELSE '✅ Normal' END AS status
FROM audit.log
WHERE action = 'SELECT_SENSITIVE'
  AND event_time > now() - INTERVAL '1 hour'
GROUP BY user_id, user_email, user_role
HAVING count(*) > 10
ORDER BY select_count DESC;

-- ── 5. Audit-Log: Letzte Änderungen (letzte 7 Tage) ─────────────────────────

SELECT
  event_time,
  user_email,
  user_role,
  action,
  table_name,
  record_id,
  changed_fields,
  ip_address
FROM audit.log
WHERE event_time > now() - INTERVAL '7 days'
ORDER BY event_time DESC
LIMIT 100;

-- ── 6. Audit-Log: DELETE-Aktionen (besonders sensibel) ───────────────────────

SELECT
  event_time,
  user_email,
  user_role,
  table_name,
  record_id,
  old_values,
  ip_address,
  request_id
FROM audit.log
WHERE action = 'DELETE'
  AND event_time > now() - INTERVAL '30 days'
ORDER BY event_time DESC;

-- ── 7. Datenbankgröße und Tabellen-Statistiken ───────────────────────────────

SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)
    - pg_relation_size(schemaname||'.'||tablename)) AS index_size,
  (SELECT count(*) FROM information_schema.table_constraints
   WHERE table_schema = pg_tables.schemaname
     AND table_name = pg_tables.tablename
     AND constraint_type = 'FOREIGN KEY') AS fk_count
FROM pg_tables
WHERE schemaname IN ('public', 'audit', 'internal')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ── 8. Lange laufende Queries (Performance/DoS-Erkennung) ────────────────────

SELECT
  pid,
  now() - query_start AS duration,
  state,
  left(query, 100) AS query_preview,
  application_name,
  client_addr,
  CASE
    WHEN now() - query_start > INTERVAL '30 seconds' THEN '🚨 Lang laufend'
    WHEN now() - query_start > INTERVAL '5 seconds'  THEN '⚠️ Langsam'
    ELSE '✅ Normal'
  END AS status
FROM pg_stat_activity
WHERE state = 'active'
  AND query_start IS NOT NULL
  AND pid <> pg_backend_pid()
ORDER BY duration DESC;

-- ── 9. Offene Verbindungen nach Rolle ────────────────────────────────────────

SELECT
  usename AS database_user,
  application_name,
  count(*) AS connection_count,
  max(now() - state_change) AS oldest_connection
FROM pg_stat_activity
WHERE state IS NOT NULL
GROUP BY usename, application_name
ORDER BY connection_count DESC;

-- ── 10. Encryption-Key Status ─────────────────────────────────────────────────

SELECT
  km.key_name,
  km.created_at,
  km.rotated_at,
  km.is_active,
  vk.status AS vault_key_status,
  CASE
    WHEN km.rotated_at IS NULL THEN '⚠️ Noch nie rotiert'
    WHEN km.rotated_at < now() - INTERVAL '90 days' THEN '🚨 Rotation überfällig (>90 Tage)'
    WHEN km.rotated_at < now() - INTERVAL '30 days' THEN '⚠️ Rotation empfohlen (>30 Tage)'
    ELSE '✅ Aktuell'
  END AS rotation_status
FROM internal.key_metadata km
LEFT JOIN pgsodium.valid_key vk ON km.vault_key_id = vk.id
ORDER BY km.key_name;

-- ── 11. DSGVO: Kandidaten ohne Aktivität (Löschfrist-Kandidaten) ─────────────
-- Kandidaten die seit >2 Jahren inaktiv sind → Löschfrist DSGVO

SELECT
  c.id,
  c.first_name || ' ' || c.last_name AS name,   -- Nur für Admin-Anzeige
  c.status,
  c.created_at,
  c.updated_at,
  now() - c.updated_at AS seit_letzter_aenderung,
  CASE
    WHEN c.updated_at < now() - INTERVAL '2 years' AND c.status = 'inactive'
      THEN '🚨 Anonymisierung erforderlich (DSGVO Art. 17)'
    WHEN c.updated_at < now() - INTERVAL '1 year'
      THEN '⚠️ Inaktivitätsprüfung empfohlen'
    ELSE '✅ Innerhalb Aufbewahrungsfrist'
  END AS dsgvo_status
FROM public.candidates c
WHERE c.status IN ('inactive', 'rejected')
   OR c.updated_at < now() - INTERVAL '1 year'
ORDER BY c.updated_at ASC
LIMIT 50;

-- ── 12. Vault-Secrets Integrität ──────────────────────────────────────────────

SELECT
  name,
  key_type,
  status,
  created         AS erstellt_am,
  expires         AS laeuft_ab,
  CASE
    WHEN status != 'valid'  THEN '🚨 Key ungültig'
    WHEN expires < now()    THEN '🚨 Key abgelaufen'
    WHEN expires < now() + INTERVAL '30 days' THEN '⚠️ Key läuft bald ab'
    ELSE '✅ Gültig'
  END AS key_status
FROM pgsodium.valid_key
ORDER BY name;

-- ── 13. Täglicher Security-Report (kombiniert, für pg_cron) ──────────────────
-- Kann via pg_cron täglich ausgeführt und an Monitoring-System gesendet werden

CREATE OR REPLACE FUNCTION internal.daily_security_report()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, audit, internal, auth, pgsodium
AS $$
DECLARE
  v_report JSONB;
BEGIN
  SELECT jsonb_build_object(
    'report_time', now(),
    'audit_events_24h', (
      SELECT count(*) FROM audit.log WHERE event_time > now() - INTERVAL '24 hours'
    ),
    'delete_events_24h', (
      SELECT count(*) FROM audit.log WHERE action = 'DELETE' AND event_time > now() - INTERVAL '24 hours'
    ),
    'failed_logins_24h', (
      SELECT count(*) FROM auth.audit_log_entries
      WHERE payload->>'action' = 'user_failed_sign_in'
        AND created_at > now() - INTERVAL '24 hours'
    ),
    'active_candidates', (
      SELECT count(*) FROM public.candidates WHERE status = 'active'
    ),
    'candidates_pending_deletion', (
      SELECT count(*) FROM public.candidates
      WHERE status = 'inactive' AND updated_at < now() - INTERVAL '2 years'
    ),
    'keys_needing_rotation', (
      SELECT count(*) FROM internal.key_metadata
      WHERE rotated_at IS NULL OR rotated_at < now() - INTERVAL '90 days'
    ),
    'rls_tables_without_policy', (
      SELECT count(*) FROM pg_tables t
      WHERE t.schemaname = 'public'
        AND t.rowsecurity = false
    )
  ) INTO v_report;

  RETURN v_report;
END;
$$;

REVOKE ALL ON FUNCTION internal.daily_security_report FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.daily_security_report TO service_role;
