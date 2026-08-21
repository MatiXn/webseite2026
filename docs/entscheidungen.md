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

## Ortsseiten unter /jobs/in/<stadt> nur für Städte mit belegter Suchnachfrage

**Belegt:** `frontend/src/content/job-cities.ts` führt sieben Städte, jede mit einem
Feld `searchDemand` aus dem Search-Console-Export vom 20.08.2026 (Mosbach 202,
Frankenthal 181, Offenbach 132, Düsseldorf 43, Bad Oeynhausen 17, Dortmund 17,
Langenfeld 16 Impressionen). Anfragen dieser Form ("jobs mosbach",
"stellenangebote frankenthal") erzeugten zusammen über 500 Impressionen bei einem
einzigen Klick — Google lieferte dafür einzelne Stellenanzeigen aus, gesucht wird
aber eine Ortsübersicht.

Bewusst **nicht** für jede Stadt im Jobbestand eine Seite: Ohne belegte Nachfrage
und ohne genügend Stellen im Umkreis entstünde dünner Inhalt. Der Radius je Stadt
steht in `radiusKm`; Bad Oeynhausen liegt bei 120 km statt 100 km, weil das
Stellenangebot in Ostwestfalen weiter gestreut ist.

Abgrenzung zur City Content Engine (`content/cities`): Die dortigen Seiten unter
`/personalvermittlung/<stadt>` sprechen Arbeitgeber an. Die Jobs-Ortsseiten
sprechen Bewerber an und brauchen Geo-Umkreis und Stellenliste — deshalb ein
eigener, schlanker Seitentyp statt einer Erweiterung der B2B-Engine.

## Google Sheet steuert Aktivität, data.ts hält Inhalt und ID

**Belegt:** `frontend/src/app/jobs/job-source.ts` führt beide Quellen zusammen.
Vorher vergab `api/jobs/route.ts` die Job-ID aus der Zeilennummer des Sheets
(`String(i + 1)`), während Detailseiten, Sitemap und JobPosting-Schema aus
`app/jobs/data.ts` kamen. Folge: Acht der 33 gelisteten Stellen hatten keine
Detailseite und verlinkten auf einen 404; beim Umsortieren einer Sheet-Zeile
hätten sich zudem alle nachfolgenden IDs verschoben und der kanonische
`permanentRedirect` (301) hätte falsche Weiterleitungen festgeschrieben.

Jetzt gilt: Der Abgleich läuft über Titel + Ort (`slugify`), abweichende
Schreibweisen im Sheet werden über das Feld `sheetAliases` aufgelöst. Eine
Sheet-Zeile ohne Gegenstück in `data.ts` wird nicht ausgeliefert, sondern
protokolliert — sie braucht redaktionelle Pflege, bevor sie sichtbar wird.

> **[OFFEN]** Eine ID-Spalte im Sheet wäre der robustere Weg als der Abgleich
> über Titel + Ort. Sie erfordert Schreibzugriff auf das Sheet und wurde deshalb
> nicht umgesetzt.

## validThrough wandert mit dem heutigen Datum mit

**Belegt:** `frontend/src/app/jobs/data.ts` berechnet `validThroughOf` als
Maximum aus `datePosted + 90 Tage` und `heute + 45 Tage`; die Jobseiten
revalidieren täglich (`export const revalidate = 86400`). Vorher trugen alle 25
Anzeigen `datePosted: "2026-06-26"` und liefen damit am 24.09.2026 gleichzeitig
ab — Google hätte sie am selben Tag geschlossen aus der Jobsuche entfernt.

> **[OFFEN]** `datePosted` bleibt für die ursprünglichen 25 Stellen auf dem
> gemeinsamen Sammeldatum. Ein echtes Veröffentlichungsdatum je Stelle würde eine
> zusätzliche Spalte im Sheet erfordern.

## Redirects gehören in vercel.json, nicht in next.config.ts

**Belegt:** Der 301 von `/talente-finden` auf `/technische-personalvermittlung`
steht seit Längerem in `frontend/next.config.ts`, live antwortete die URL
trotzdem mit 404 — bei 114 Impressionen in der Search Console. Ursache ist die
Legacy-Konfiguration der Root-`vercel.json` mit `builds` und `routes`: Sie
übernimmt das Routing und umgeht die Framework-Redirects. Der Redirect steht
deshalb jetzt als erste Regel in `vercel.json`.

> **[OFFEN]** Sauberer wäre, die Legacy-`builds`/`routes`-Konfiguration
> aufzulösen und im Vercel-Projekt stattdessen `frontend` als Root Directory zu
> setzen. Das ändert das Deployment-Verhalten und wurde deshalb nicht im Rahmen
> dieser Änderung angefasst.

## Beruf-x-Ort-Seiten nur mit Stellendeckung, Entdopplung und eigenem Absatz

**Belegt:** `frontend/src/content/role-city-pages.ts` erzeugt eine Seite unter
`/berufe/<beruf>/<stadt>` nur, wenn drei Bedingungen zugleich erfüllt sind:
mindestens `MIN_JOBS_IN_RADIUS` (3) passende Stellen im Umkreis, davon
mindestens eine innerhalb von `LOCAL_RADIUS_KM` (30) — und ein redaktioneller
Absatz zu genau dieser Kombination in `content/role-city-notes.ts`.

Angefragt waren 16 Bundesländer x 5 Städte x 12 Positionen, also 960 Seiten.
Bei 33 Stellen im Bestand hätten über 900 davon keine einzige passende Stelle
gehabt — das Muster, das Google als Doorway Pages behandelt, mit Wirkung auf
die gesamte Domain. Gemessen wurde stattdessen, was der Bestand trägt: Von den
zwölf Positionen tragen vier ein Ortsraster (Elektroniker, Elektroniker für
Betriebstechnik, Elektroniker für Energie- und Gebäudetechnik, Mechatroniker).

Zwei weitere Filter kamen aus der Messung am gebauten Ergebnis:

1. **Entdopplung nach Stellenmenge** (`MAX_JOB_SET_OVERLAP`, 0.8): Essen und
   Bochum listeten denselben Bestand und kamen auf 85 % Textgleichheit. Zeigt
   eine Stadt im Wesentlichen dieselben Stellen wie eine bereits aufgenommene,
   entsteht keine zweite Seite. Das reduzierte 33 Kandidaten auf 14.
2. **Eigener Absatz je Kombination**: Berufsbild und Stadttext allein sind über
   Nachbarseiten hinweg zu ähnlich. Mit dem kombinationsspezifischen Absatz
   sank die höchste gemessene Textähnlichkeit von 84 % auf 76 %.

Was die Seiten zusätzlich unterscheidet, sind echte Daten statt Textbausteine:
die Stellenliste, die Entfernungen und die aus diesen Stellen berechnete
Gehaltsspanne (`salaryRangeOf`).

Die Seiten sind Spokes zu den bundesweiten Berufsseiten und werden von dort
verlinkt (`ProfessionPageTemplate`, Abschnitt "Jobs nach Stadt") — ohne diese
Hub-zu-Spoke-Verlinkung wären sie nur über die Sitemap erreichbar.

> **[OFFEN]** Für Kältetechniker, Servicetechniker, Anlagenmechaniker SHK,
> Monteure und Applikations Engineer reicht der Stellenbestand für ein
> Ortsraster nicht (0 bis 8 Stellen, zu weit gestreut). Monteure und
> Applikations Engineer haben derzeit gar keine Stelle im Bestand. Sie bleiben
> über die bundesweiten Berufsseiten abgedeckt.

> **[OFFEN]** "Servicetechniker bundesweit", "für Tagesreisen" und "für
> weltweite Einsätze" sind Einsatzmodelle, keine Ortsberufe — eine Kombination
> mit Städten wäre widersprüchlich. Sie gehören als eigenständige Seiten unter
> `/berufe`, sind aber noch nicht angelegt.
