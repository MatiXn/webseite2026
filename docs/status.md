**Stand:** 2026-07-21

## Versionskontrolle

- **Anzahl Commits:** 130 (Branch `main`)
- **Letzter Commit:** `e66d448` — "feat: Wikidata-Item Q140572942 in Organization-sameAs verlinken" (2026-07-16)
- **Unversionierte Änderungen:** `git status --short` zeigt ein untracked Verzeichnis: `.superpowers/brainstorm/96793-1783759471/` mit den Dateien `content/layout.html`, `content/landing-style.html`, `state/server.pid`, `state/server.log`, `state/server-stopped`. Das ist ein Arbeitsverzeichnis eines Tooling-Skills (Brainstorm-Session), kein Anwendungscode.

## Offene Punkte

- [ ] Kein CI/CD-Workflow für das Backend-Deployment gefunden (nur `frontend/.github/workflows/security.yml`, ausschließlich Frontend-Scans).
- [ ] `backend/app/api/routes/` und `backend/app/services/` sind angelegt, aber leer — alle Endpunkte liegen aktuell in `backend/app/main.py`.
- [ ] `backend/supabase/policies/` und `backend/supabase/functions/` sind angelegt, aber leer.
- [ ] Kein `tests/`-Verzeichnis im Backend gefunden, obwohl `pytest`/`pytest-asyncio` in `backend/requirements.txt` stehen.
- [ ] Unklar, ob und wie `jobs_import.csv` im Root tatsächlich verarbeitet wird (kein Referenzcode dazu gefunden).

## Weiteres

`DATENSCHUTZ-INTERN.md` existiert im Root und enthält interne Datenschutz-Vorgaben (u.a. ein Verarbeitungsverzeichnis nach Art. 30 DSGVO, Zugriffsrollen, Aufbewahrungsfristen). Die Datei ist als "intern — nicht öffentlich zugänglich" gekennzeichnet und wurde für diese Dokumentation nur zum Verständnis des Projektzwecks gelesen, ihr Inhalt wurde nicht in die übrige Doku übernommen.

> **[OFFEN]** Ob die Website/API aktuell live und öffentlich erreichbar ist, ist aus dem Repository nicht belegbar — es gibt Produktions-Konfiguration (`ALLOWED_ORIGINS=https://phe-perm.de,...`, `TrustedHostMiddleware` mit `api.phe-perm.de`), aber keinen Nachweis (z.B. Monitoring-Log, Statusseite) im Code, dass diese Domains aktuell bedient werden.

> **[OFFEN]** Ob aktuell aktiv am Projekt weitergearbeitet wird, lässt sich aus dem Commit-Datum (2026-07-16, vor dem heutigen Stand) und dem einen untracked Tooling-Verzeichnis nicht zuverlässig ableiten.
