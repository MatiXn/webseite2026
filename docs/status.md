**Stand:** 2026-08-23

## Versionskontrolle

- **Anzahl Commits:** 130 (Branch `main`)
- **Letzter Commit:** `e66d448` — "feat: Wikidata-Item Q140572942 in Organization-sameAs verlinken" (2026-07-16)
- **Unversionierte Änderungen:** `git status --short` zeigt ein untracked Verzeichnis: `.superpowers/brainstorm/96793-1783759471/` mit den Dateien `content/layout.html`, `content/landing-style.html`, `state/server.pid`, `state/server.log`, `state/server-stopped`. Das ist ein Arbeitsverzeichnis eines Tooling-Skills (Brainstorm-Session), kein Anwendungscode.

## Offene Punkte

### Recruiting-Landingpages (seit 23.08.2026)

- [x] Umgebungsvariablen gesetzt (23.08.2026): `RECRUITING_SUPABASE_URL`,
      `RECRUITING_SUPABASE_SERVICE_ROLE_KEY` und `RECRUITING_NOTIFICATION_EMAIL`
      (→ `bewerbung@phe-perm.de`) für Production und Preview;
      `NEXT_PUBLIC_META_PIXEL_ID` = `1721750638380257` nur für Production.
- [x] End-to-End gegen die Preview-Umgebung geprüft (23.08.2026): Lead landet
      vollständig in Supabase, Telefonnummer normalisiert, UTM-Parameter
      übernommen, Benachrichtigung versendet (`notification_status: sent`),
      Dublettenschutz greift. Testdaten wurden wieder gelöscht.
- [ ] Erste echte Bewerbung abwarten und prüfen, ob Mail und Datensatz im
      Alltag taugen.
- [ ] Mobile Darstellung noch nicht mit echtem Viewport geprüft: In der
      Testumgebung ließ sich der Browser-Viewport nicht unter 1440 px bringen.
      Struktur ist mobile-first, Touchflächen ab 44 px, kein horizontaler
      Überlauf — eine Sichtprüfung auf einem echten Gerät steht aus.
- [ ] Kein Löschkonzept für `recruiting_leads`. Üblich sind sechs Monate nach
      Abschluss des Besetzungsverfahrens; derzeit keine automatische Löschung.
- [ ] Salesforce-Feldzuordnung (`Recruiting_*__c` in
      `frontend/src/landingpages/server/salesforce.ts`) ist nicht gegen die
      echte PHE-Instanz verifiziert. Flag `SALESFORCE_SYNC_ENABLED` steht auf
      `false`, bis das geschehen ist.
- [ ] Meta Conversions API vorbereitet (`event_id` je Lead), aber nicht
      angeschlossen.

### Rechtlich prüfen zu lassen

- [ ] Wortlaut der Einwilligung (`frontend/src/landingpages/einwilligung.ts`)
- [ ] Ziffern 7, 7b und 7c der Datenschutzerklärung
- [ ] Vereinbarung über gemeinsame Verantwortlichkeit mit Meta (Art. 26 DSGVO)

### Bestand


- [ ] Kein CI/CD-Workflow für das Backend-Deployment gefunden (nur `frontend/.github/workflows/security.yml`, ausschließlich Frontend-Scans).
- [ ] `backend/app/api/routes/` und `backend/app/services/` sind angelegt, aber leer — alle Endpunkte liegen aktuell in `backend/app/main.py`.
- [ ] `backend/supabase/policies/` und `backend/supabase/functions/` sind angelegt, aber leer.
- [ ] Kein `tests/`-Verzeichnis im Backend gefunden, obwohl `pytest`/`pytest-asyncio` in `backend/requirements.txt` stehen.
- [ ] Unklar, ob und wie `jobs_import.csv` im Root tatsächlich verarbeitet wird (kein Referenzcode dazu gefunden).

## Weiteres

`DATENSCHUTZ-INTERN.md` existiert im Root und enthält interne Datenschutz-Vorgaben (u.a. ein Verarbeitungsverzeichnis nach Art. 30 DSGVO, Zugriffsrollen, Aufbewahrungsfristen). Die Datei ist als "intern — nicht öffentlich zugänglich" gekennzeichnet und wurde für diese Dokumentation nur zum Verständnis des Projektzwecks gelesen, ihr Inhalt wurde nicht in die übrige Doku übernommen.

> **[OFFEN]** Ob die Website/API aktuell live und öffentlich erreichbar ist, ist aus dem Repository nicht belegbar — es gibt Produktions-Konfiguration (`ALLOWED_ORIGINS=https://phe-perm.de,...`, `TrustedHostMiddleware` mit `api.phe-perm.de`), aber keinen Nachweis (z.B. Monitoring-Log, Statusseite) im Code, dass diese Domains aktuell bedient werden.

> **[OFFEN]** Ob aktuell aktiv am Projekt weitergearbeitet wird, lässt sich aus dem Commit-Datum (2026-07-16, vor dem heutigen Stand) und dem einen untracked Tooling-Verzeichnis nicht zuverlässig ableiten.
