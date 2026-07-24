# Design: Verifizierte E-Mail-Bewerbung (Double-Opt-In)

**Datum:** 2026-07-23
**Status:** vom Auftraggeber freigegeben

## Problem

Die E-Mail-Bewerbungsbuttons auf den Jobkarten (Homepage und /jobs-Übersicht)
sowie die Initiativbewerbungs-Links öffnen nur einen `mailto:`-Link. Damit gibt
es keine Prüfung der Absenderadresse, die Bewerbung kommt unstrukturiert oder —
bei Geräten ohne eingerichtetes Mailprogramm — gar nicht an. Ziel: Jede
E-Mail-Bewerbung läuft über die bestehende Bestätigungsstrecke (Double-Opt-In),
sodass nur verifizierte Adressen bei `bewerbung@phe-perm.de` eingehen.

Die Job-Detailseiten (`/jobs/[id]`, `ApplyForm.tsx`) nutzen diese Strecke
bereits; die Jobkarten und Initiativ-Links umgehen sie.

## Lösung (Ansatz A — gewählt)

Bestehende API unverändert wiederverwenden, ein gemeinsames Modal für alle
Einstiegspunkte.

### 1. Neue geteilte Komponente `frontend/src/app/components/ApplyModal.tsx`

- **Props:** `{ position: string; onClose: () => void }`
- **Felder:** Vorname\*, Nachname\*, E-Mail\* (neu, `type="email"`),
  Telefon\*, Position (vorbefüllt mit `position`, editierbar)
- **Absenden:** `fetch POST /api/contact` mit
  ```json
  {
    "type": "contact",
    "contact": "<Vorname> <Nachname>",
    "email": "<E-Mail>",
    "phone": "<Telefon>",
    "message": "[Bewerbung: <Position>]"
  }
  ```
  Das `[Bewerbung:`-Präfix routet die bestätigte Nachricht in
  `api/contact/confirm/route.ts` an `bewerbung@phe-perm.de`.
- **Zustände:**
  - Laden: Button deaktiviert, Text „Wird gesendet…"
  - Fehler: API-Fehlertext anzeigen, falls vorhanden (z. B. Rate-Limit 429,
    ungültige E-Mail 400); sonst generisch mit Ausweich-Hinweis auf
    `info@phe-perm.de`
  - Erfolg: Modal bleibt offen und zeigt „Fast geschafft! Wir haben Ihnen eine
    E-Mail geschickt. Bitte bestätigen Sie Ihre Adresse…" (Wortlaut wie
    `ApplyForm.tsx`), dazu Schließen-Möglichkeit
- **Optik:** übernimmt das bisherige Modal-Design (Overlay, weiße Karte,
  Eingabefelder-Stil). Datenschutz-Hinweiszeile wie im `ApplyForm`
  („🔒 100 % unverbindlich & vertraulich…").

### 2. Umbau der vier Einstiegspunkte

| Stelle | Vorher | Nachher |
|---|---|---|
| Homepage Jobkarten (`src/app/page.tsx`) | lokales mailto-Modal | geteiltes Modal, `position = job.title` |
| Homepage Hero „Per E-Mail bewerben" (`src/app/page.tsx`, ca. Z. 446) | mailto-Link | Button, öffnet Modal mit `position = "Initiativbewerbung"` |
| /jobs Jobkarten (`src/app/jobs/page.tsx`) | lokales mailto-Modal (Duplikat) | geteiltes Modal, `position = job.title` |
| /jobs Initiativ-Links (`src/app/jobs/page.tsx`, ca. Z. 452 und 509) | mailto-Links | Buttons, öffnen Modal mit `position = "Initiativbewerbung"` |

- Die beiden lokalen `ApplyModal`-Definitionen in `page.tsx` und
  `jobs/page.tsx` werden gelöscht (beseitigt Code-Duplikation).
- `MAIL_APPLY` und alle Bewerbungs-`mailto:`-Links entfallen; danach existiert
  kein unbestätigter E-Mail-Bewerbungsweg mehr.
- WhatsApp-Buttons bleiben unverändert.

### 3. Backend/API

Keine Änderung. `/api/contact` (Bestätigungsmail via Resend, HMAC-signierter
Token, 24 h gültig, Rate-Limiting) und `/api/contact/confirm` (Weiterleitung
an `bewerbung@phe-perm.de` bei `[Bewerbung:`-Präfix) bleiben unangetastet.

## Verworfene Alternativen

- **Ansatz B — Verlinkung auf `/jobs/[id]#bewerben`:** UX-Bruch (Navigation
  statt Modal), Initiativbewerbung hat keine Detailseite, Homepage-Karten
  müssten auf Job-IDs gemappt werden.
- **Ansatz C — eigener API-Typ `application`:** strukturierteres E-Mail-Format,
  aber Mehraufwand in API-, Confirm-Route und Validierung für rein
  kosmetischen Gewinn.

## Fehlerfälle

- Ungültige E-Mail → 400 der API, Fehlertext im Modal
- Rate-Limit überschritten → 429, Fehlertext im Modal
- Netzwerk-/Versandfehler → generische Meldung mit Ausweich-Adresse
- Bestätigungslink abgelaufen (24 h) → bestehendes Verhalten der Confirm-Route
  (Redirect mit `confirm=invalid`), unverändert

## Tests / Abnahme

1. `npm run build` läuft fehlerfrei durch.
2. Manueller End-to-End-Test nach Deployment: Bewerbung über eine Jobkarte und
   über einen Initiativ-Button mit eigener Adresse absenden →
   Bestätigungsmail kommt an → Link klicken → Bewerbung geht bei
   `bewerbung@phe-perm.de` mit „E-Mail-Adresse bestätigt"-Vermerk ein.
3. Negativtest: erfundene Adresse eintragen → keine Bestätigung möglich →
   keine Bewerbung im Postfach.

Automatisierte Frontend-Tests existieren im Projekt nicht; dabei bleibt es im
Rahmen dieser Änderung.
