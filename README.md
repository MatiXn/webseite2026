# phe-2026

Website und Kandidaten-Verwaltung (ATS) für PHE Perm Engineering, einen Personalvermittler für technische Berufe (Elektrotechnik, Mechatronik, IT/Automation, Bau/TGA). Das Repository enthält ein Next.js-Frontend (öffentliche Website, Job-Landingpages, Kontaktformulare) und ein FastAPI-Backend zur Verwaltung von Kandidatendaten über Supabase.

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 — `frontend/`
- **Backend:** FastAPI (Python 3.12), Pydantic, Supabase-Client, JWT-Auth (Supabase-Tokens) — `backend/`
- **Datenbank/Auth/Storage:** Supabase (Postgres, RLS, Storage für Dokumenten-Uploads)
- **Deployment Frontend:** Vercel (`vercel.json`)
- **Deployment Backend:** Dockerfile für Cloud Run vorhanden (`backend/Dockerfile`)

> **[OFFEN]** Ob das Backend tatsächlich produktiv auf Cloud Run läuft, ist aus dem Repository nicht belegbar — es gibt kein Deploy-Skript oder CI-Workflow dafür, nur den Dockerfile-Kommentar "Cloud Run setzt PORT automatisch".

## Loslegen

Backend und Frontend werden getrennt gestartet, es gibt kein gemeinsames Root-Setup-Skript.

```bash
# Backend (FastAPI)
cd backend
cp .env.example .env      # Werte eintragen (Supabase, Secrets)
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (Next.js), in einem zweiten Terminal
cd frontend
cp .env.example .env      # Supabase-Public-Keys, API-URL
npm install
npm run dev
```

## Befehle

| Ort | Befehl | Zweck |
|---|---|---|
| `frontend/` | `npm run dev` | Next.js Dev-Server |
| `frontend/` | `npm run build` | Production-Build |
| `frontend/` | `npm run start` | Production-Server starten |
| `frontend/` | `npm run lint` | ESLint |
| `backend/` | `uvicorn app.main:app --reload` | Dev-Server |
| `backend/` | `pytest` | Tests (pytest ist in `requirements.txt` gelistet) |

> **[OFFEN]** Ob unter `backend/` bereits Testdateien existieren, wurde nicht geprüft/ist nicht belegt — `pytest`/`pytest-asyncio` stehen in `requirements.txt`, ein `tests/`-Verzeichnis wurde bei der Bestandsaufnahme nicht gefunden.

## Dokumentation

- [Architektur](docs/architektur.md)
- [Entscheidungen](docs/entscheidungen.md)
- [Status](docs/status.md)

Zusätzlich liegt im Root `DATENSCHUTZ-INTERN.md` mit internen Datenschutz-Vorgaben (Art. 30 DSGVO-Verzeichnis u.a.) — nicht öffentlich.
