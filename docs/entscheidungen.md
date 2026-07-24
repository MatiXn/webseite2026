# Entscheidungen

Jeder Abschnitt trennt, was im Code belegt ist, von der offenen Frage nach dem Warum.

## Getrennte Frontend- und Backend-Ordner statt Next.js-API-Routen für alles

**Belegt:** Es gibt zwei unabhängige Anwendungen mit eigenen Dependency-Manifesten (`frontend/package.json`, `backend/requirements.txt`), eigenen `.env.example`-Dateien und eigenem Start-Kommando. Das Frontend hat zusätzlich eigene, einfache API-Routen (`frontend/src/app/api/contact`, `.../jobs`, `.../geocode`), während Kandidaten-CRUD und Dokumenten-Upload ausschließlich im FastAPI-Backend liegen (`backend/app/main.py`).

> **[OFFEN]** Warum Kandidaten-Logik in ein separates Python/FastAPI-Backend ausgelagert wurde statt vollständig in Next.js-Route-Handlern zu bleiben (wie es bei `contact`/`jobs`/`geocode` gemacht wurde) — aus dem Code nicht ableitbar.

## FastAPI + Supabase-Python-Client statt Supabase direkt vom Frontend aus

**Belegt:** `backend/app/core/supabase.py` stellt einen Service-Role-Client bereit, der laut Kommentar "volle DB-Rechte" hat und "nur server-side" verwendet werden darf. Das Frontend erhält laut `frontend/.env.example` nur den öffentlichen Anon-Key. Zusätzlich implementiert das Backend eigene Rate-Limits (`slowapi`, unterschiedliche Limits je Endpoint in `main.py`), Audit-Logging (`audit_log(...)` bei jedem Create/Update/Delete/Upload) und MIME-Validierung aus Datei-Bytes (`backend/app/core/file_validation.py`).

> **[OFFEN]** Warum diese Schutzmaßnahmen im Backend statt z.B. vollständig über Supabase RLS + Storage-Policies umgesetzt wurden — aus dem Code nicht ableitbar (beides ist vorhanden: RLS in `backend/supabase/migrations/003_rls_policies.sql` UND Backend-seitige RBAC-Prüfung in `security.py`).

## Rollen-Hierarchie candidate < recruiter < team_lead < admin

**Belegt:** `backend/app/core/security.py` definiert `ROLE_LEVELS = {"candidate": 0, "recruiter": 1, "team_lead": 2, "admin": 3}` und liest die Rolle aus `app_metadata.role` im Supabase-JWT. `DATENSCHUTZ-INTERN.md` beschreibt dieselben Rollen fachlich (Berater/Recruiter nur eigene Kandidaten, Senior-Berater/TL zusätzlich Team-Übersicht, Geschäftsführung Vollzugriff).

> **[OFFEN]** Wie und wo genau Rollen den einzelnen Supabase-Usern zugewiesen werden (Admin-UI, manueller Dashboard-Eintrag, Migration) ist aus dem vorhandenen Code nicht ersichtlich — `backend/supabase/migrations/006_auth_integration.sql` aktualisiert laut Kommentar die JWT `app_metadata` bei Rollenänderung, der Auslöser dafür wurde nicht geprüft.

## Verschlüsselung über pgsodium/Supabase Vault statt Anwendungs-Verschlüsselung

**Belegt:** `backend/supabase/migrations/004_encryption.sql` beschreibt laut Kopfkommentar eine Architektur, bei der Keys "NUR im Supabase Vault (Hardware-gesichert, nie im Code)" liegen.

> **[OFFEN]** Welche Felder konkret verschlüsselt werden und warum diese Auswahl getroffen wurde, wurde aus dem Migrationsinhalt im Detail nicht ausgewertet — nur der Architektur-Kommentar wurde geprüft.

## Vercel für Frontend, Dockerfile/Cloud-Run-Vorbereitung für Backend

**Belegt:** `vercel.json` baut ausschließlich `frontend/package.json`. `backend/Dockerfile` und `backend/.env.example` enthalten mehrere Cloud-Run-spezifische Kommentare und Defaults (`PORT`, `TrustedHostMiddleware` mit `*.run.app`).

> **[OFFEN]** Warum zwei unterschiedliche Hosting-Plattformen für Frontend und Backend gewählt wurden (statt z.B. beides auf Vercel oder beides auf GCP) — aus dem Code nicht ableitbar. Siehe auch `docs/architektur.md` für den fehlenden Deploy-Beleg fürs Backend.

## Structlog + JSON-Logging statt Standard-Logging

**Belegt:** `backend/requirements.txt` listet `structlog` und `python-json-logger`; `backend/app/main.py` ruft `setup_logging(json_logs=settings.is_production)` auf — JSON-Logs nur in Production, Konsolen-Logs sonst.

> **[OFFEN]** Warum JSON-Logging nur in Production aktiv ist und nicht durchgängig — aus dem Code nicht ableitbar (denkbar wäre Log-Aggregation in Cloud Run, aber nicht belegt).
