# Architektur

## Überblick

Das Repository enthält zwei getrennt lauffähige Teile:

- **`frontend/`** — Next.js 16 App-Router-Anwendung. Öffentliche Website (Jobs, Kontakt, Über uns, Lebenslauf-Tool, rechtliche Seiten) plus eigene Next.js-Route-Handler unter `frontend/src/app/api/` (`contact`, `contact/confirm`, `jobs`, `geocode`).
- **`backend/`** — FastAPI-Anwendung (`backend/app/main.py`) mit Endpunkten für Kandidaten-CRUD (`/api/v1/candidates`), Dokumenten-Upload und einen Auth-Check (`/api/v1/me`). Zugriff auf die Datenbank läuft über den Supabase-Python-Client (`backend/app/core/supabase.py`), der sowohl einen Service-Role-Client (volle Rechte, serverseitig) als auch einen Anon-Client (im Namen des eingeloggten Users) bereitstellt.

Beide Teile sprechen dieselbe Supabase-Instanz an: das Frontend über `@supabase/ssr`/`@supabase/supabase-js` mit dem öffentlichen Anon-Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), das Backend zusätzlich über den Service-Role-Key, der laut `backend/.env.example` "niemals ans Frontend" darf.

Autorisierung läuft über Supabase-JWTs: Ein Token trägt eine Rolle (`candidate`, `recruiter`, `team_lead`, `admin`) in `app_metadata.role`, die das Backend in `backend/app/core/security.py` gegen eine feste Rollen-Hierarchie prüft (`ROLE_LEVELS`). Auf Datenbankebene setzt zusätzlich Row-Level-Security (RLS) an (`backend/supabase/migrations/003_rls_policies.sql`, Prinzip "Default Deny").

> **[OFFEN]** Ob das Frontend das Backend für Kandidaten-Operationen tatsächlich aufruft (z.B. für ein Recruiter-Login/-Dashboard) ist aus den vorhandenen Next.js-Routen nicht ersichtlich — die gefundenen Frontend-API-Routen (`contact`, `jobs`, `geocode`) betreffen öffentliche Formular-/Job-Funktionen, keine Kandidaten-CRUD-Aufrufe ans FastAPI-Backend. `frontend/src/lib/apiClient.ts` existiert und deutet auf eine Anbindung hin, der genaue Verwendungsort wurde nicht geprüft.

## Datenfluss

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  frontend/ (Next.js)     │        │  backend/ (FastAPI)       │
│  öffentliche Website     │        │  Kandidaten-API           │
│                          │        │                          │
│  src/app/*               │        │  main.py                 │
│  ├─ jobs, kontakt,       │        │  ├─ GET  /health          │
│  │  talente-finden, …    │        │  ├─ GET  /api/v1/me       │
│  └─ api/                 │        │  ├─ POST /api/v1/candidates
│     ├─ contact           │        │  ├─ PATCH .../{id}        │
│     ├─ contact/confirm   │        │  ├─ DELETE .../{id}       │
│     ├─ jobs              │        │  └─ POST .../{id}/documents
│     └─ geocode           │        │                          │
└───────────┬──────────────┘        └────────────┬─────────────┘
            │  Anon-Key (NEXT_PUBLIC_*)           │  Service-Role-Key +
            │  eigene Route-Handler                │  Anon-Key
            ▼                                      ▼
┌──────────────────────────────────────────────────────────────┐
│                     Supabase (Postgres)                       │
│  - RLS-Policies (Default Deny) — migrations/003               │
│  - Rollen: candidate < recruiter < team_lead < admin           │
│  - Verschlüsselung via pgsodium/Vault — migrations/004         │
│  - Audit-Trail-Trigger (immutable) — migrations/005            │
│  - Auth-Integration (JWT app_metadata) — migrations/006        │
│  - Storage-Bucket "candidate-documents" für CV-Uploads          │
└──────────────────────────────────────────────────────────────┘
```

Beide Anwendungen haben eigene `.env`/`.env.example`-Dateien und werden unabhängig gestartet (siehe [README](../README.md#loslegen)); es gibt keinen gemeinsamen Prozess-Orchestrator im Repository.

## Auslieferung

- **Frontend:** `vercel.json` im Root konfiguriert einen Vercel-Build, der `frontend/package.json` über `@vercel/next` baut und alle Routen dorthin durchreicht (`"src": "frontend/package.json"`, `"routes": [{"src": "/(.*)", "dest": "frontend/$1"}]`).
- **Backend:** `backend/Dockerfile` baut ein Multi-Stage-Image (Python 3.12-slim, non-root User `appuser`) und startet `uvicorn` mit `$PORT` — ein Kommentar im Dockerfile und in `backend/.env.example` verweist auf Cloud Run ("Cloud Run setzt PORT automatisch"), und `TrustedHostMiddleware` in `main.py` erlaubt explizit `*.run.app` als Host in Production.

> **[OFFEN]** Ein konkreter Deploy-Mechanismus fürs Backend (CI/CD-Pipeline, `cloudbuild.yaml`, GitHub-Action) wurde im Repository nicht gefunden — nur der einzige CI-Workflow `frontend/.github/workflows/security.yml` existiert, und der deckt ausschließlich Frontend-Security-Scans (npm audit, CodeQL, Gitleaks, Dependency Review, Typecheck, Build) ab, kein Deployment.

> **[OFFEN]** Ob es eine Staging-Umgebung neben Production gibt, ist aus dem Code nicht ableitbar — `APP_ENV`/`is_production` unterscheiden nur zwischen den beiden Werten `development` und `production`.
