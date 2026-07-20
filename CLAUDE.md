# CLAUDE.md

## Was das ist

`phe-2026` ist das Repository für die Website und das Kandidaten-Verwaltungssystem (ATS) von PHE Perm Engineering, einem Personalvermittler für technische Berufe. Laut `DATENSCHUTZ-INTERN.md` verarbeitet das System Bewerber-Stammdaten, Bewerbungsunterlagen, Gehaltsdaten und Matching-Historie zu offenen Stellen (siehe Kategorien in `backend/app/models/candidate.py`: Elektrotechnik, Mechatronik, IT/Automation, Bau/TGA).

Das Frontend (`frontend/`) ist die öffentliche Website mit Job-Landingpages, Kontaktformular, Lebenslauf-Tool. Das Backend (`backend/`) ist eine separate FastAPI-API für Kandidaten-CRUD und Dokumenten-Upload, abgesichert über Supabase-JWTs und RBAC.

> **[OFFEN]** Wer das System nutzt (nur interne Recruiter, oder auch Kandidaten-Self-Service über das Frontend) ist aus dem Code nicht vollständig ableitbar — das Frontend hat keine sichtbare Login-Route in `frontend/src/app`, das Backend erwartet aber Rollen bis hinunter zu `candidate` (`backend/app/core/security.py`).

## Stack

- **Frontend:** Next.js 16.2.9 (App Router), React 19.2.4, TypeScript, Tailwind CSS 4, `@supabase/ssr` + `@supabase/supabase-js`, `resend` (E-Mail-Versand), `dompurify` (Sanitizing) — siehe `frontend/package.json`
- **Backend:** FastAPI 0.115.6, Uvicorn, Pydantic 2.10 / pydantic-settings, `supabase`-Python-Client 2.10.0, `python-jose` (JWT), `slowapi` (Rate-Limiting), `structlog` + `python-json-logger`, `sentry-sdk[fastapi]`, `python-magic` (MIME-Erkennung bei Uploads), `phonenumbers` — siehe `backend/requirements.txt`
- **DB/Auth/Storage:** Supabase (Postgres + RLS + Storage-Bucket `candidate-documents`), Migrationen in `backend/supabase/migrations/001`–`006`
- **Fehler-Tracking:** Sentry (Frontend + Backend, DSN optional über Env)

## Struktur

```
phe-2026/
├── DATENSCHUTZ-INTERN.md   # interne Datenschutz-Doku (Art. 30 DSGVO) — nicht anfassen
├── jobs_import.csv         # Job-Stellen-Importdaten (Titel, Ort, Gehalt, Kategorie …)
├── vercel.json             # Vercel-Build-Config: baut frontend/ via @vercel/next
│
├── backend/                # FastAPI-API, getrennt vom Frontend gestartet
│   ├── app/
│   │   ├── main.py         # App-Setup, Middleware-Stack, alle Routen (Health, /api/v1/me, Candidates-CRUD, Upload)
│   │   ├── core/
│   │   │   ├── config.py       # Settings via pydantic-settings, liest .env
│   │   │   ├── security.py     # JWT-Verifikation (Supabase HS256), Rollen-Hierarchie (candidate<recruiter<team_lead<admin)
│   │   │   ├── supabase.py     # Supabase-Client-Factory
│   │   │   ├── file_validation.py  # MIME-Check aus Datei-Bytes für Uploads
│   │   │   ├── middleware.py   # HTTPS-Redirect, Security-Headers, Request-ID, Access-Log
│   │   │   └── logging.py      # structlog-Setup + audit_log()
│   │   ├── models/
│   │   │   └── candidate.py    # Pydantic-Modelle: Candidate-Enums, strikte Feld-Validierung
│   │   ├── api/routes/     # leer (keine Dateien) — Routen liegen aktuell direkt in main.py
│   │   └── services/       # leer (keine Dateien)
│   ├── supabase/
│   │   ├── migrations/     # 001 Extensions/Roles … 006 Auth-Integration
│   │   ├── monitoring/monitoring_queries.sql
│   │   ├── policies/       # leer
│   │   ├── functions/      # leer
│   │   └── BACKUP_STRATEGY.md
│   ├── requirements.txt
│   ├── Dockerfile          # Multi-Stage-Build, non-root User, für Cloud Run vorbereitet (PORT-Env, uvicorn mit --workers 2)
│   └── .env.example
│
└── frontend/                # Next.js-Website, getrennt vom Backend gestartet
    ├── src/app/             # App Router: jobs, kontakt, ueber-uns, talente-finden, lebenslauf-erstellen, impressum, agb, datenschutz
    │   └── api/             # Next.js Route Handler: contact, contact/confirm, jobs, geocode
    ├── src/components/forms/
    ├── src/hooks/           # useAuth.ts, useFileUpload.ts
    ├── src/lib/             # apiClient.ts, sanitize.ts, contact-validation.ts, confirm-token.ts
    ├── public/llms.txt      # AI-Crawler-Hinweise
    ├── .env.example
    └── AGENTS.md / CLAUDE.md (verweist per @-Import auf AGENTS.md)
```

> **[OFFEN]** Warum `api/routes/` und `services/` als leere Verzeichnisse angelegt, aber ungenutzt sind (geplante Struktur vs. Restbestand einer Umstrukturierung) — aus dem Code nicht ableitbar.

## Befehle

Siehe [README.md](README.md#befehle) für die vollständige Tabelle. Kurzfassung:

```bash
cd backend && uvicorn app.main:app --reload   # Backend
cd frontend && npm run dev                     # Frontend
```

## Fallstricke

- **Getrennte Prozesse:** Backend und Frontend haben je ein eigenes `.env` / `.env.example` und müssen einzeln gestartet werden — kein Root-Skript, das beides orchestriert.
- **CORS ist strikt:** `backend/app/main.py` erlaubt nur explizit gelistete Origins (`ALLOWED_ORIGINS` in `backend/.env.example`, default `https://phe-perm.de,https://www.phe-perm.de`), kein Wildcard.
- **Production-Härtung schaltet sich über `APP_ENV` frei:** In `is_production` werden `/docs`, `/redoc`, `/openapi.json` deaktiviert und `TrustedHostMiddleware` mit `allowed_hosts=["api.phe-perm.de", "*.run.app"]` aktiviert (`backend/app/main.py`) — bei lokalem Testen mit `APP_ENV=production` sind diese Endpunkte also absichtlich nicht erreichbar.
- **Service-Role-Key niemals ins Frontend:** `backend/.env.example` warnt explizit, dass `SUPABASE_SERVICE_ROLE_KEY` volle DB-Rechte hat; das Frontend darf laut `frontend/.env.example` nur `NEXT_PUBLIC_`-Variablen und den `ANON_KEY` verwenden.
- **Rate-Limiting ist in-memory ohne `REDIS_URL`:** funktioniert laut Kommentar in `.env.example` nur für eine einzelne Instanz; für Multi-Instance-Betrieb wäre Redis nötig.
- **`api/routes/` und `services/` sind leer:** neue Endpunkte aktuell alle direkt in `backend/app/main.py`, nicht in separate Router-Module ausgelagert.
- **`jobs_import.csv` liegt im Root** und enthält Stellenanzeigen-Rohdaten (Titel, Ort, Gehalt, Kategorie, Beschreibung) — kein direkt ersichtlicher Bezug im Code geprüft, ob/wie sie importiert wird.

> **[OFFEN]** Wie `jobs_import.csv` tatsächlich verarbeitet wird (Import-Skript, manueller Prozess, Supabase-Seed) ist aus dem vorhandenen Code nicht belegbar — es wurde kein Referenzierungscode dazu gefunden.
