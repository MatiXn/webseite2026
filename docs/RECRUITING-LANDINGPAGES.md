# Recruiting-Landingpages für Meta-Ads

Landingpages unter `/stellen/<slug>`, die Bewerber aus Facebook- und
Instagram-Anzeigen über einen mehrstufigen Funnel zu einem Lead führen.

Stand: 23.08.2026. Erste Kampagne: Kältetechniker Köln.

## Grundgedanke

Die Seiten sind **konfigurationsgetrieben**. Eine neue Landingpage ist eine
Datendatei, kein neues Feature:

```
frontend/src/landingpages/kampagnen/<slug>.ts   ← hier wird gearbeitet
frontend/src/landingpages/registry.ts           ← eine Zeile ergänzen
```

Alles andere — Route, Funnel, Validierung, Rate-Limit, Honeypot, Speicherung,
E-Mail, Salesforce, Consent, Pixel, SEO — ist generisch und wird nicht
angefasst. Der Test `kampagnen.test.ts` prüft jede eingetragene Kampagne
automatisch gegen die Regeln.

Für Claude gibt es dazu den Skill `phe-recruiting-landingpage`
(`~/.claude/skills/`).

## Neue Landingpage anlegen

1. `frontend/src/landingpages/kampagnen/kaeltetechniker-koeln.ts` kopieren,
   umbenennen, Inhalte ersetzen. Der Typ in `../typen.ts` führt durch alle
   Felder.
2. In `registry.ts` importieren und in `KAMPAGNEN` eintragen.
3. Prüfen:
   ```bash
   cd frontend && npm test && npm run build && npm run lint
   ```

Fertig. Die Seite ist unter `/stellen/<slug>` erreichbar, wird statisch
vorgerendert und nutzt denselben API-Endpunkt wie alle anderen.

## Neue und geänderte Dateien

### Neu

| Datei | Zweck |
|---|---|
| `frontend/src/landingpages/typen.ts` | Konfigurationstyp einer Landingpage |
| `frontend/src/landingpages/registry.ts` | alle Kampagnen, Pfadbildung |
| `frontend/src/landingpages/kampagnen/kaeltetechniker-koeln.ts` | erste Kampagne |
| `frontend/src/landingpages/funnel-logik.ts` | Prüfregeln, Browser und Server identisch |
| `frontend/src/landingpages/kampagnen-parameter.ts` | UTM- und Meta-Parameter |
| `frontend/src/landingpages/einwilligung.ts` | Einwilligungstext und Version |
| `frontend/src/landingpages/komponenten/Abschnitte.tsx` | Hero, Vorteile, Gegenüberstellung, Ablauf, Footer (Server) |
| `frontend/src/landingpages/komponenten/Funnel.tsx` | mehrstufiges Formular (Client) |
| `frontend/src/landingpages/komponenten/PixelLader.tsx` | Pixel nach Einwilligung |
| `frontend/src/landingpages/server/lead-speicher.ts` | Supabase-Anbindung |
| `frontend/src/landingpages/server/lead-mail.ts` | Benachrichtigung via Resend |
| `frontend/src/landingpages/server/salesforce.ts` | Adapter hinter Feature-Flag |
| `frontend/src/app/stellen/[kampagne]/page.tsx` | eine Route für alle Kampagnen |
| `frontend/src/app/api/recruiting-lead/route.ts` | ein Endpunkt für alle Kampagnen |
| `frontend/src/lib/consent.ts` | Einwilligung site-weit |
| `frontend/src/lib/meta-pixel.ts` | Meta-Pixel, nur mit Einwilligung |
| `frontend/supabase/migrations/001_recruiting_leads.sql` | Datenbanktabelle |
| `frontend/src/landingpages/__tests__/*` | 116 Tests |

### Geändert

| Datei | Änderung |
|---|---|
| `frontend/src/app/components/CookieBanner.tsx` | echter Consent mit Ablehnen-Option und Marketing-Kategorie |
| `frontend/src/app/datenschutz/page.tsx` | Ziffer 7 überarbeitet, 7b (Meta-Pixel) und 7c (Landingpage-Anfragen) neu |
| `frontend/src/app/globals.css` | Stilblock `lp-*` für die Landingpages |
| `frontend/next.config.ts` | CSP um `connect.facebook.net` und `www.facebook.com` erweitert |
| `frontend/vitest.config.ts` | zweite Umgebung (jsdom) für Komponententests |
| `frontend/package.json` | `server-only`; dev: `jsdom`, `@testing-library/react`, `@testing-library/user-event` |
| `frontend/.env.example` | neue Umgebungsvariablen dokumentiert |

## Datenbank

Die Migration `frontend/supabase/migrations/001_recruiting_leads.sql` wurde am
23.08.2026 im Supabase-Projekt **`lkmrsvvgisdthvlqjhdk`** (CRM-Datenbank)
ausgeführt.

> Ein eigenes Supabase-Projekt hätte 10 USD/Monat gekostet. Die Tabelle ist
> eigenständig, berührt keine bestehende CRM-Tabelle und ist später umziehbar.

**Achtung:** `frontend/supabase/` ist nicht dasselbe wie `backend/supabase/`.
Letzteres gehört zur ATS-Datenbank des FastAPI-Backends.

### Absicherung

Nachgewiesen am 23.08.2026:

- RLS aktiv, **keine** Policy → Zugriff mit `anon`- oder `authenticated`-Key
  läuft ins Leere
- `revoke all` für `anon` und `authenticated`
- Testweiser Insert als `anon` erzeugte keine Zeile
- Trigger-Funktion auf `SECURITY INVOKER` mit entzogenem `EXECUTE`-Recht
  (war zunächst `SECURITY DEFINER` und damit über `/rest/v1/rpc/` aufrufbar —
  vom Supabase-Linter zu Recht beanstandet)

Der Linter meldet weiterhin „RLS Enabled No Policy" (Regel 0008, Stufe INFO).
Das ist die Absicht: Geschrieben wird ausschließlich serverseitig mit dem
Service-Role-Key.

### Auswertung

```sql
-- Neue Leads
select created_at, first_name, last_name, phone, email, job_slug,
       qualification, experience_level, location_match, utm_campaign
from recruiting_leads
where lead_status = 'new'
order by created_at desc;

-- Nacharbeit: Benachrichtigung oder Salesforce fehlgeschlagen
select id, created_at, email, notification_status, notification_error,
       salesforce_sync_status, salesforce_error
from recruiting_leads
where notification_status = 'failed' or salesforce_sync_status = 'failed'
order by created_at desc;
```

## Umgebungsvariablen

In Vercel (Projekt `webseite2026-zqvz`) zu hinterlegen:

| Variable | Pflicht | Wirkung, wenn sie fehlt |
|---|---|---|
| `RECRUITING_SUPABASE_URL` | **ja** | Formular antwortet mit 503, kein Lead |
| `RECRUITING_SUPABASE_SERVICE_ROLE_KEY` | **ja** | dito |
| `RECRUITING_NOTIFICATION_EMAIL` | ja | Lead wird gespeichert, aber niemand informiert |
| `RESEND_API_KEY` | vorhanden | — |
| `NEXT_PUBLIC_META_PIXEL_ID` | nein | kein Tracking; Seite funktioniert vollständig |
| `SALESFORCE_SYNC_ENABLED` | nein | Abgleich abgeschaltet (Standard) |
| `SALESFORCE_INSTANCE_URL` / `_CLIENT_ID` / `_CLIENT_SECRET` | nur bei aktivem Flag | — |
| `META_CONVERSIONS_API_TOKEN` / `META_DATASET_ID` | nein | vorbereitet, nicht angeschlossen |

Niemals mit `NEXT_PUBLIC_` prefixen außer `NEXT_PUBLIC_META_PIXEL_ID`.

Stand 23.08.2026: Die drei Pflichtvariablen sind in Vercel für Production
und Preview gesetzt. `RECRUITING_NOTIFICATION_EMAIL` zeigt auf
`bewerbung@phe-perm.de` — dieselbe Adresse, an die auch das Kontaktformular
Bewerbungen schickt.

### Supabase-Zugangsdaten holen

Supabase-Dashboard → Projekt `lkmrsvvgisdthvlqjhdk` → Project Settings →
API Keys. `RECRUITING_SUPABASE_URL` ist die Project-URL, der
Service-Role-Key steht unter „service_role" (geheim).

```bash
cd ~/Desktop/Projekte/phe-2026
npx vercel env add RECRUITING_SUPABASE_URL production
npx vercel env add RECRUITING_SUPABASE_SERVICE_ROLE_KEY production
npx vercel env add RECRUITING_NOTIFICATION_EMAIL production
```

## E-Mail

Nutzt die vorhandene Resend-Anbindung des Kontaktformulars, Absender
`noreply@phe-perm.de`. Die Nachricht enthält Name, Telefon, E-Mail, alle
Funnel-Antworten in Klartext-Beschriftung, Herkunft und Kampagne, Zeitpunkt
sowie die Datensatz-ID.

Schlägt der Versand fehl, bleibt der Lead erhalten und der Datensatz bekommt
`notification_status = 'failed'` samt Fehlergrund. Nachholen: Abfrage oben
ausführen und die betroffenen Leads manuell abarbeiten.

## Meta-Pixel

1. Im Meta Events Manager die Pixel-ID kopieren.
2. `NEXT_PUBLIC_META_PIXEL_ID` in Vercel setzen.
3. Deployen.

Ereignisse:

| Ereignis | Wann |
|---|---|
| `PageView` | beim Laden — nur nach erteilter Einwilligung |
| `Lead` | **erst nach bestätigter Speicherung**, nie beim Öffnen des Formulars |

Übertragen werden ausschließlich Kampagnen-Slug und eine Ereignis-ID. Keine
Namen, keine Telefonnummern, keine E-Mail-Adressen.

Die `event_id` liegt am Datensatz und ist so gewählt, dass eine spätere
serverseitige Meldung über die Conversions API dasselbe Ereignis meldet und
Meta beides als eine Conversion zählt.

> **[OFFEN]** Die Conversions API ist vorbereitet (`event_id`,
> Umgebungsvariablen dokumentiert), aber nicht angeschlossen. Sinnvoll, sobald
> die Kampagnen laufen und iOS-bedingte Messlücken sichtbar werden.

## Salesforce

Im Repo existierte keine Salesforce-Integration. `server/salesforce.ts` ist ein
vorbereiteter Adapter:

- abgeschaltet, solange `SALESFORCE_SYNC_ENABLED` nicht `true` ist
- OAuth 2.0 Client Credentials Flow
- Dublettenprüfung über E-Mail **und** normalisierte Telefonnummer
- Ergebnis landet in `salesforce_id` und `salesforce_sync_status`
- ein Fehler verhindert die Speicherung in Supabase nicht

### Einrichtung

1. Salesforce → Setup → App Manager → New Connected App
2. OAuth aktivieren, Client-Credentials-Flow erlauben, Integrationsnutzer
   zuordnen
3. Scopes: `api`
4. Client-ID und Secret in Vercel hinterlegen, `SALESFORCE_SYNC_ENABLED=true`

> **[OFFEN]** Die API-Namen der benutzerdefinierten Felder in
> `FELD_ZUORDNUNG` (`Recruiting_*__c`) sind **nicht verifiziert**. Vor dem
> Scharfschalten in Setup → Objekt-Manager → Lead → Felder abgleichen und die
> Zuordnung anpassen. Die Standardfelder (`FirstName`, `LastName`, `Email`,
> `Phone`, `PostalCode`, `Title`, `Company`, `LeadSource`) stimmen.

## Testen

```bash
cd frontend
npm test                                    # alle 699 Tests
npx vitest run src/landingpages             # nur die Landingpage-Tests (116)
npm run dev                                 # http://localhost:3000/stellen/kaeltetechniker-koeln
```

Abgedeckt: vollständiger Funnel-Durchlauf, Zurück-Navigation ohne Datenverlust,
Pflichtfeldprüfung, ungültige E-Mail und Telefonnummer, Honeypot, Rate-Limit,
Feld-Whitelist, Speicherung, Erfolgsmeldung nur bei echtem Erfolg,
Fehlerbehandlung, Mail- und Salesforce-Fehler ohne Datenverlust, Lead-Event
nur nach Speicherung, kein Pixel ohne Einwilligung, UTM-Übernahme,
Tastaturbedienung, Fokusführung.

### Mit echter Datenbank prüfen

```bash
# frontend/.env.local anlegen (steht in .gitignore)
RECRUITING_SUPABASE_URL=...
RECRUITING_SUPABASE_SERVICE_ROLE_KEY=...
RECRUITING_NOTIFICATION_EMAIL=deine@adresse.de
RESEND_API_KEY=...
```

Danach `npm run dev`, Funnel ausfüllen, in Supabase prüfen:

```sql
select * from recruiting_leads order by created_at desc limit 1;
```

Testdatensätze anschließend löschen.

## Deployment

Push auf `main` → Vercel baut automatisch. Die Landingpages werden statisch
vorgerendert, der API-Endpunkt läuft als Serverless Function.

`vercel.json` braucht **keine** Änderung: Die Catch-All-Route
`"src": "/(.*)", "dest": "frontend/$1"` deckt `/stellen/…` bereits ab.

### Subdomain jobs.phe-perm.de

Aktuell nicht eingerichtet und nicht nötig — die Seiten laufen unter
`www.phe-perm.de/stellen/…`. Falls später gewünscht:

1. Vercel → Projekt → Settings → Domains → `jobs.phe-perm.de` hinzufügen
2. Beim DNS-Anbieter CNAME auf `cname.vercel-dns.com`
3. Rewrite in `vercel.json` ergänzen, damit `jobs.phe-perm.de/<slug>` auf
   `/stellen/<slug>` zeigt
4. Canonical in `page.tsx` anpassen — sonst zeigen zwei Hosts auf dieselbe Seite

## Rechtlich zu prüfen

Die technischen und organisatorischen Anforderungen sind umgesetzt: getrennte
Einwilligung, Versionierung, Nachweis von Zeitpunkt und Wortlaut,
Datenminimierung gegenüber Meta, Zweckbindung auf die konkrete Position,
Speicherung in der EU, Zugriff nur serverseitig.

Von einer Fachperson prüfen zu lassen:

- Formulierung der Einwilligung in `einwilligung.ts`
- Ziffern 7, 7b und 7c der Datenschutzerklärung
- Vereinbarung über gemeinsame Verantwortlichkeit mit Meta (Art. 26 DSGVO)
- Löschfristen für Leads — derzeit ist **keine** automatische Löschung
  eingerichtet

> **[OFFEN]** Löschkonzept für `recruiting_leads`. Üblich sind sechs Monate
> nach Abschluss des Besetzungsverfahrens. Umsetzbar als geplanter Job in
> Supabase, bislang nicht angelegt.
