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

**Nachtrag 06.10.2026:** München aufgenommen (74 Impressionen, getragen von
„jobs kältetechnik münchen“ und „servicetechniker jobs münchen“). Geprüft und
bewusst **nicht** aufgenommen: Köln 13, Frankfurt 12 (nur eine Suchanfrage),
Hamburg 6, Hannover 3 — alle unter der bisher niedrigsten Schwelle (Langenfeld
16). Abfrage direkt über die Search Console API mit dem Indexing-Dienstkonto.

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

## Servicetechniker-Varianten: zwei neue Seiten statt fünf

**Belegt:** Angefragt waren fünf Servicetechniker-Fachrichtungen (Kältetechnik,
Elektrotechnik, Automatisierung/SPS, Inbetriebnehmer, Energie- und
Gebäudetechnik). Gemessen wurde vor dem Bauen, welche Stellen eine solche Seite
zeigen würde und wie stark sich das mit bestehenden Berufsseiten überschneidet:

| Variante | Stellen | Überschneidung mit bestehender Seite |
|---|---|---|
| Elektrotechnik | 3 | keine kritische |
| Inbetriebnehmer | 3 | keine — kein bestehendes Profil deckt Erstinbetriebnahme ab |
| Kältetechnik | 5 | **83 %** mit `/berufe/kaeltetechniker` |
| Energie-/Gebäudetechnik | 3 | **100 %** mit `/berufe/elektroniker-energie-gebaeudetechnik` |
| Automatisierung/SPS | 1 | Bestand trägt keine eigene Seite |

Gebaut sind deshalb `servicetechniker-elektrotechnik` und `inbetriebnehmer`.
Beide liegen nach dem Bauen bei höchstens 41 % Textüberschneidung zu jeder
bestehenden Berufsseite.

Die Abgrenzung ist inhaltlich, nicht nur begrifflich: `/berufe/elektroniker`
beschreibt das Berufsbild mit Schwerpunkt Instandhaltung im eigenen Werk,
`/berufe/servicetechniker-elektrotechnik` den Außendienst mit Einsatzgebiet,
Anfahrt, Dienstwagen und Bereitschaft. Entsprechend läuft das Matching über
exakte Stellentitel statt über `category: "elektro"` — ein Kategoriefilter zöge
alle 17 Elektro-Stellen und damit genau die Instandhalter herein, gegen die
abgegrenzt wird.

> **[OFFEN]** Servicetechniker Kältetechnik und Servicetechniker Energie- und
> Gebäudetechnik sind fachlich sinnvoll, hätten aber fast dieselbe Stellenliste
> wie die bestehenden Seiten gezeigt. Der wirksamere Weg wäre, den Service- und
> Außendienstaspekt auf `/berufe/kaeltetechniker` und
> `/berufe/elektroniker-energie-gebaeudetechnik` auszubauen, statt konkurrierende
> Seiten anzulegen. Noch nicht umgesetzt.

> **[OFFEN]** Eine eigene Seite für Servicetechniker Automatisierung/SPS trägt
> der Bestand derzeit nicht (eine Stelle). `/berufe/sps-automatisierung` deckt
> das Feld ab.

## Service-Aspekte als Abschnitt auf bestehenden Seiten statt eigener URL

**Belegt:** `ProfessionContent` hat ein optionales Feld `focusSection`
(`content/professions/types.ts`), das `ProfessionPageTemplate` nur rendert, wenn
es gesetzt ist. Genutzt wird es auf drei Seiten:

| Seite | Abschnitt | Zuwachs |
|---|---|---|
| `/berufe/kaeltetechniker` | Als Servicetechniker in der Kältetechnik arbeiten | +222 Wörter |
| `/berufe/elektroniker-energie-gebaeudetechnik` | MSR-Technik und Gebäudeautomation im technischen Service | +204 Wörter |
| `/berufe/sps-automatisierung` | Inbetriebnahme und Service an SPS-Anlagen | +213 Wörter |

Hintergrund: Für diese drei Fachrichtungen waren eigene
Servicetechniker-Seiten angefragt. Die Messung vorab ergab 83 % bzw. 100 %
Überschneidung der Stellenlisten mit der jeweils bestehenden Seite — zwei URLs
zum selben Thema hätten sich gegenseitig Ranking abgezogen. Für die
SPS-Variante trug der Bestand ohnehin keine eigene Seite (eine Stelle).

Der Abschnitt bedient dieselben Suchanfragen über eine H2 mit dem Suchbegriff,
ohne eine konkurrierende URL anzulegen. Belegte Nachfrage aus dem
Search-Console-Export: "msr technik jobs" (Position 1,5), "sps programmierer
jobs" (27 Impressionen), "servicetechniker kältetechnik", "servicemonteur
kältetechnik".

Der Validator prüft die neuen Textfelder mit (`collectTextFields` in
`validate-profession.ts`), damit auch dort keine unbelegten Werbeaussagen
durchrutschen.

## Recruiting-Landingpages als Engine statt als Einzelseiten (23.08.2026)

**Aufgabe:** Landingpage für Meta-Recruiting-Anzeigen zur Stelle Kältetechniker
Köln. Während der Umsetzung erweitert auf: „Vorlage bzw. Automation für alle
weiteren Landingpages".

Umgesetzt als konfigurationsgetriebene Engine unter
`frontend/src/landingpages/`. Eine neue Landingpage ist eine Datendatei in
`kampagnen/` plus eine Zeile in `registry.ts` — Route, Funnel, API,
Speicherung, E-Mail, Salesforce, Consent, Pixel und SEO sind generisch.

Der Test `kampagnen.test.ts` prüft mit `describe.each` **jede** eingetragene
Kampagne gegen die Regeln. Damit ist die Vorlage nicht nur Dokumentation,
sondern durchgesetzt: Wer eine Landingpage anlegt, die gegen die Konventionen
verstößt, bekommt einen roten Test.

Ergänzend der Skill `phe-recruiting-landingpage` in `~/.claude/skills/`, damit
Claude in künftigen Sessions den Weg kennt, ohne das Repo neu zu erkunden.

### URL-Schema `/stellen/<slug>` statt `/jobs/<slug>`

Ursprünglich war `/jobs/kaeltetechniker-koeln` gewünscht. Dort liegt aber
bereits die dynamische Route `[slug]` der organischen Stellenanzeigen. Ein
statisches Segment daneben hätte je Kampagne einen zusätzlichen Ordner
gebraucht — bei einer Vorlage ein Handgriff zu viel. `/stellen/[kampagne]`
bedient alle Kampagnen mit einer Route und trennt Anzeigenziele sichtbar von
organischen Seiten.

### `noindex` und kein JobPosting-Schema auf den Landingpages

Die Stelle Kältetechniker Köln ist als Job 34 bereits unter
`/jobs/kaeltetechniker-koeln-34` organisch indexiert, inklusive
JobPosting-Schema und Sitemap-Eintrag. Zwei indexierte Seiten zur selben
Position hätten gegeneinander gerankt. Google verlangt für JobPosting-Markup
zudem ausdrücklich indexierbare Seiten.

Die Landingpage trägt deshalb `robots: { index: false, follow: true }` und kein
JobPosting-Schema. Open-Graph- und Twitter-Tags sind vollständig, da sie beim
Teilen unabhängig vom Index wirken.

### Leads in der CRM-Datenbank statt in einem eigenen Supabase-Projekt

Fachlich wäre ein eigenes Projekt sauberer gewesen. Ein zusätzliches
Supabase-Projekt kostet in der Organisation `zymzwtufvapxzvvgzdwc` jedoch
10 USD im Monat. Die Tabelle `recruiting_leads` liegt deshalb im
CRM-Projekt `lkmrsvvgisdthvlqjhdk`.

Risiko begrenzt: Die Tabelle ist eigenständig, verändert keine bestehende
CRM-Tabelle, hat RLS ohne Policy und entzogene Rechte für `anon` und
`authenticated`. Ein Umzug in ein eigenes Projekt ist später möglich — der
Code spricht sie über eigene Umgebungsvariablen (`RECRUITING_SUPABASE_*`) an,
nicht über die vorhandenen `NEXT_PUBLIC_SUPABASE_*`.

### Cookie-Banner site-weit umgebaut statt eigener Dialog auf den Landingpages

Der bisherige Banner war ein reiner Hinweis mit einem einzigen Knopf
(„Verstanden") und sagte zu, dass keine Tracking-Cookies eingesetzt werden —
dieselbe Zusage stand in der Datenschutzerklärung. Mit dem Meta-Pixel wurde
diese Aussage unzutreffend.

Ein zweiter Consent-Mechanismus nur für die Landingpages hätte zwei
nebeneinanderliegende Zustimmungsstände erzeugt, die in der
Datenschutzerklärung nicht sauber darstellbar sind. Deshalb ein echter Banner
für die gesamte Website: „Alle akzeptieren" / „Nur notwendige", gleich groß und
gleich gestaltet, Marketing standardmäßig aus.

Neuer Speicherschlüssel `phe_consent_v2`: Ein „Verstanden" aus der alten
Fassung war keine Marketing-Einwilligung und darf nicht als solche gewertet
werden. Wiederkehrende Besucher werden einmalig erneut gefragt.

### Antworten zusätzlich als JSONB

`recruiting_leads` hat vier feste Spalten für die Fragen, die in jeder Kampagne
vorkommen (Qualifikation, Berufserfahrung, Wohnort, Führerschein), und
zusätzlich `answers` als JSONB mit allen Antworten. Eine künftige Kampagne kann
damit beliebige weitere Fragen stellen, ohne dass die Tabelle geändert werden
muss — während die vier Standardfelder für Auswertungen indizierbar bleiben.

### Test-Setup um jsdom erweitert

Vitest lief bewusst node-only. Die geforderten Nachweise (Funnel-Durchlauf,
Zurück-Navigation ohne Datenverlust, Tastaturbedienung, Erfolgsmeldung nur bei
echtem Erfolg) sind ohne DOM nicht führbar. Ergänzt wurden `jsdom`,
`@testing-library/react` und `@testing-library/user-event`; `.test.tsx` läuft in
jsdom, `.test.ts` unverändert in Node.

`@vitejs/plugin-react` wurde **nicht** aufgenommen: Version 6 verlangt Vite 8,
Vitest 2 bringt Vite 5 mit. JSX übersetzt stattdessen esbuild
(`esbuild: { jsx: "automatic" }`) — für Tests ausreichend.

## data.ts liefert auch ohne Sheet-Zeile aus

**Belegt:** `mergeSheetJobs` in `frontend/src/app/jobs/job-source.ts` nimmt
Stellen aus `data.ts` jetzt auch dann in die Ausgabe, wenn dafür keine Zeile im
Google Sheet existiert — ausgenommen Stellen mit `active: false`. Existiert eine
Sheet-Zeile, entscheidet weiterhin das Sheet, auch wenn es die Stelle abschaltet.

Vorher war eine Sheet-Zeile Pflicht: Eine im Repository angelegte Stelle hatte
Detailseite, Sitemap-Eintrag und JobPosting-Schema, fehlte aber in der Übersicht
unter `/jobs`. Jede neu gepflegte Stelle musste zusätzlich von Hand ins Sheet
übertragen werden.

Die Rollen sind damit klar getrennt: `data.ts` ist die Wahrheit über den
Bestand, das Sheet bleibt das Werkzeug für die tägliche Pflege — Stellen
abschalten und die veränderlichen Felder (Gehalt, Kurzbeschreibung, Tags,
Benefits) überschreiben. Stellen ohne Sheet-Zeile werden beim Abruf
protokolliert.

## Sichtbare Trefferlisten diversifizieren nach Titel

**Belegt:** `matchJobsForConfig` in
`frontend/src/content-engine/job-matching/match-jobs-for-profession.ts` lässt
höchstens `MAX_JE_TITEL` (2) Stellen mit identischem Titel in den vorderen Teil
der Liste; die übrigen rutschen ans Ende statt aus ihr heraus.

Anlass: Sechs Servicetechniker-Stellen derselben Position an sechs Standorten
haben denselben Titel, denselben Score und dasselbe Veröffentlichungsdatum. Auf
`/berufe/mechatroniker` füllten sie damit die komplette sichtbare Liste und
verdrängten sämtliche anderen Treffer — die Seite zeigte sechsmal dieselbe
Position mit unterschiedlichem Ort.

Die Sortierung bleibt deterministisch: Innerhalb beider Gruppen gilt weiter
Score, dann Veröffentlichungsdatum, dann ID.

## Google-Tag nur nach Einwilligung statt fest im `<head>` (30.09.2026)

**Belegt:** Google Ads empfiehlt, den gtag.js-Schnipsel fest vor `</head>` zu setzen. Stattdessen lädt `frontend/src/lib/google-tag.ts` das Skript erst nach Marketing-Einwilligung, nach demselben Muster wie der Meta-Pixel. Grund: Schon der Abruf von googletagmanager.com überträgt die IP-Adresse an Google, und das darf nach § 25 TDDDG erst nach Zustimmung passieren.

- **Consent-Fassung v3 (`phe_consent_v3`)**: Die Zustimmung aus v2 bezog sich nur auf den Meta-Pixel unter `/stellen/`. Das Google-Tag läuft auf der ganzen Website und übermittelt an einen anderen Empfänger. Eine alte Zustimmung deckt das nicht, deshalb werden alle Besucher einmal neu gefragt.
- **Eigene Website-Conversions statt der GA4-Aktionen aus Googles Mail.** Die Ereignisnamen `ads_conversion_Kontakt_1`/`…_Termin_vereinbaren_1` aus Googles Anleitung gehören zu Aktionen, die Google Ads **aus GA4 importiert**, und zwar mit der Regel „Seitenaufbau /kontakt“, die schon einen Seitenaufruf zählt. GA4 ist auf der neuen Website nicht eingebunden, deshalb kämen diese Ereignisse nie an; seit dem Relaunch zeigen die Aktionen keine Conversions mehr. Am 30.09.2026 wurden in Google Ads zwei neue Website-Aktionen angelegt: „Kontakt (Website-Formular)“ und „Termin (Telefon/WhatsApp-Klick)“, beide primär mit Zählung „Eine“ pro Klick. Der Code meldet sie per `send_to` (`CONVERSION` in `google-tag.ts`). GA4 wieder einzubinden wurde verworfen, weil dafür ein zusätzlicher Dienst in Consent und Datenschutzerklärung nötig gewesen wäre.
- **Conversion „Kontakt“** wird erst nach erfolgreichem Versand ausgelöst. Das gilt für `/kontakt`, die Bewerbung unter `/jobs/…` (auch per LinkedIn), die Unternehmensanfrage auf `/technische-personalvermittlung` und den Funnel unter `/stellen/…`. Der Parameter `quelle` unterscheidet die Formulare.
- **Conversion „Termin vereinbaren“** zählt Klicks auf `tel:`- und WhatsApp-Links. Ein Terminformular gibt es auf der Website nicht. Ein Klick ist also nur eine Absicht, kein bestätigter Termin. Erfasst wird über einen einzigen Listener am Dokument (`GoogleTagLader`), damit auch neue Links ohne zusätzlichen Code mitzählen.
- **Consent Mode v2** wird beim Laden auf `granted` gesetzt, weil das Tag ohnehin nur nach Zustimmung existiert. `analytics_storage` bleibt `denied`, weil kein Google Analytics im Einsatz ist.
