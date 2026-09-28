# Recruiting-App: Landingpages vom Handy aus anlegen und verteilen

**Stand:** 29.09.2026
**Status:** Entwurf, noch nicht umgesetzt

## Worum es geht

**Das Ziel ist eine App auf dem Handy.** Von unterwegs eine Landingpage
anlegen, veröffentlichen und verteilen — ohne Rechner.

Heute geht davon nichts. Eine Landingpage entsteht als TypeScript-Datei im
Repository: Code schreiben, committen, deployen. Das Posten auf Instagram
läuft über ein Skript im Terminal. Bewerbungen sind nur über SQL oder das
Supabase-Dashboard sichtbar; Recruiter erfahren von ihnen ausschließlich über
die Benachrichtigungsmail.

Jeder dieser Schritte setzt einen Rechner und Kenntnis des Projekts voraus.
Genau das soll wegfallen.

## Abgrenzung

**Dies ist ein internes Werkzeug für PHE, kein Produkt.** Die Überlegung, daraus
eine verkaufbare App zu machen, wurde am 29.09.2026 bewusst zurückgestellt: Erst
soll das Werkzeug im eigenen Alltag funktionieren, danach lässt sich beurteilen,
was ein anderer Personalvermittler daran bezahlen würde.

Daraus folgt für diesen Entwurf:

- keine Mandantentrennung zwischen fremden Konten, keine Tarife, keine
  Abrechnung, keine Selbstregistrierung
- kein Auftragsverarbeitungsverhältnis — PHE verarbeitet eigene Daten

**Was trotzdem bleibt**, weil es PHEs Geschäft ist: die Arbeitgeber-Ebene und
die Vertraulichkeit. PHE sucht für Kunden, und keine der 44 Stellenanzeigen
nennt den Arbeitgeber.

Die Entscheidung, wo die App liegt, folgt daraus: **im bestehenden Repository
`phe-2026`**, nicht in einem eigenen Projekt. Dort liegen bereits die
Landingpage-Engine, die Stellendaten und der Lead-Endpunkt.

## Was „App" hier bedeutet

Eine Web-App, die sich auf den Startbildschirm legen lässt: eigenes Symbol,
Vollbild, kein Browser-Rahmen. Kein App Store, keine Freigabeverfahren,
Aktualisierungen sofort wirksam. Derselbe Code läuft auf iPhone, Android und
am Rechner.

Technisch: ein Web-App-Manifest, Symbole in den nötigen Größen, ein
Service Worker für den Start ohne Verzögerung.

**Die Oberfläche wird für den Daumen gebaut, nicht für die Maus.** Das ist kein
Desktop-Formular in schmal: Eine Landingpage anzulegen läuft in Schritten,
ähnlich dem Bewerber-Funnel — wenige Angaben je Bildschirm, große Flächen,
Fortschritt sichtbar. Lange Formulare tippt niemand unterwegs.

## Der eine Klick

Beim Veröffentlichen passiert alles zusammen:

| Schritt | Was geschieht |
|---|---|
| Landingpage | wird unter `/stellen/<slug>` erreichbar |
| Instagram | Bild wird erzeugt und auf dem Konto veröffentlicht |
| Google | Stellenseite wird über die Indexing API gemeldet |
| Teilen | Link wird über die Teilen-Funktion des Handys angeboten |

Für WhatsApp, LinkedIn und Xing braucht es keine Schnittstelle. Die App reicht
den fertigen Link an die Teilen-Funktion des Geräts weiter — dort wählt man das
Ziel und schreibt die Nachricht im gewohnten Umfeld.

**Meta-Anzeigen bleiben bewusst außen vor.** Dort fließt Geld, und eine
Kampagne mit falschem Budget oder fehlender Sonderkategorie ist teuer.
Das gehört auf einen eigenen, bewussten Schritt — nicht auf denselben Knopf
wie ein Instagram-Post.

## Benachrichtigungen

Bei einer neuen Bewerbung erscheint eine Mitteilung auf dem Sperrbildschirm.
Web-Push funktioniert auf Android seit Langem und auf iOS ab Version 16.4 —
dort allerdings nur, wenn die App auf dem Startbildschirm liegt.

Die E-Mail an `bewerbung@phe-perm.de` bleibt zusätzlich bestehen: Sie ist der
verlässliche Weg und erreicht auch Kollegen ohne App.

## Datenmodell

```
Arbeitgeber (Kunde von PHE)
 └─ Landingpage
     └─ Bewerbung
```

### Arbeitgeber

Ein Kunde von PHE. Trägt das Erscheinungsbild, das für alle seine Landingpages
gilt — einmal eingerichtet, dann genutzt.

| Feld | Zweck |
|---|---|
| `name` | „Mustermann GmbH" |
| `slug` | URL-Bestandteil |
| `logo_url` | Datei in Supabase Storage |
| `farbe` | Hausfarbe als Hex-Wert |
| `umschreibung` | für vertrauliche Suchen: „ein Gebäudetechnik-Dienstleister" |
| `notiz` | intern, für Recruiter |

### Landingpage

Löst die heutigen Dateien in `src/landingpages/kampagnen/` ab. Die Felder
entsprechen dem bestehenden Typ `LandingpageConfig`, ergänzt um:

| Feld | Zweck |
|---|---|
| `arbeitgeber_id` | Zuordnung |
| `vertraulich` | offen oder anonym |
| `status` | Entwurf oder veröffentlicht |
| `veroeffentlicht_am` | für die Übersicht |

### Bewerbung

Entspricht der heutigen Tabelle `recruiting_leads`, erweitert um die
Zuordnung zur Landingpage. Die bestehenden Datensätze werden übernommen.

## Vertraulichkeit

Der Schalter steht **pro Landingpage**, nicht pro Arbeitgeber — derselbe Kunde
kann bei einer Position genannt werden wollen und bei einer anderen nicht.

| | offen | vertraulich |
|---|---|---|
| Logo und Farben | des Arbeitgebers | von PHE |
| Bezeichnung | „Mustermann GmbH" | die Umschreibung |
| Vorschaubild | Arbeitgeber-Logo | PHE-Logo |

Der Arbeitgebername darf bei vertraulichen Seiten an **keiner** Stelle
erscheinen: nicht im Text, nicht im Bild, nicht in den Metadaten, nicht in der
Bildunterschrift für Social Media.

## Die beiden Bereiche

### Öffentlich — `/stellen/<slug>`

Die bestehende Route, aber gespeist aus der Datenbank statt aus der Registry.
Aufbau, Funnel und Lead-Endpunkt bleiben unverändert; sie laufen seit dem
23.09.2026 in Produktion und sind durch 116 Tests abgedeckt.

Veröffentlichte Seiten werden weiterhin statisch vorgerendert. Da die Inhalte
nicht mehr zur Bauzeit feststehen, braucht es eine Neuvalidierung beim
Veröffentlichen (`revalidatePath`).

### Die App — `/app`

Hinter Anmeldung, für das Handy gebaut. Vier Ansichten, unten eine Leiste zum
Wechseln:

**Start** — neue Bewerbungen, zuletzt veröffentlichte Seiten, Hinweise auf
fehlgeschlagene Benachrichtigungen. Dazu der Knopf für eine neue Landingpage.

**Anlegen** — in Schritten geführt: Arbeitgeber wählen, Position und Ort,
Gehalt und Vorteile, Funnel-Fragen, offen oder vertraulich. Am Ende die
Vorschau und der Knopf zum Veröffentlichen.

**Bewerbungen** — Liste, nach Landingpage filterbar. Antippen zeigt alle
Angaben; Anrufen und Mailen direkt aus der Ansicht. Export für den Rechner.

**Arbeitgeber** — anlegen, Logo aus der Fotobibliothek oder Kamera, Farbe,
Umschreibung.

Am Rechner funktioniert dieselbe Oberfläche — breiter, aber nicht anders.

## Anmeldung

Supabase Auth mit E-Mail und Passwort. Konten legt PHE selbst an, keine
Selbstregistrierung. `@supabase/ssr` ist im Projekt vorhanden.

Alle Routen unter `/intern` sind geschützt; Unangemeldete werden zur
Anmeldeseite geleitet.

**Keine Rollen.** Die App nutzen zwei Personen, Matin und Alex, mit denselben
Rechten. Eine Rechteverwaltung für zwei Menschen ist Aufwand ohne Nutzen —
sollte das Team wachsen, lässt sie sich nachrüsten.

## Farben je Arbeitgeber

Günstiger als zunächst angenommen: Die Hausfarbe ist im `lp-*`-Block von
`globals.css` bereits eine Variable. `var(--blue)` wird 17 Mal verwendet und
muss nur pro Seite überschrieben werden — nicht 40 Stellen umgeschrieben.

Die eigentliche Arbeit sind die **abgeleiteten Töne**, die heute fest
eingetragen sind:

| Wert | Verwendung |
|---|---|
| `#1e3a5f` | dunkler Verlauf im Hero |
| `#9fc4f0`, `#c3d8f0` | helle Schrift auf dunklem Grund |
| `#f2f8ff` | Hintergrund ausgewählter Antworten |
| `#bcd9f7` | Rahmen der positiven Spalte |

Sie müssen aus der Hausfarbe berechnet werden, damit ein Kunde mit grüner oder
roter Hausfarbe nicht blaue Sprenkel auf seiner Seite hat. Rechnung im
HSL-Raum: Farbton übernehmen, Helligkeit und Sättigung nach festen Regeln
ableiten.

Davon unberührt bleiben die neutralen Töne (`--ink`, `--gray`, `--border`,
`--fog`) und die Fokusfarbe `#f59e0b` — Letztere muss sich bewusst von jeder
Hausfarbe abheben und bleibt deshalb fest.

Dazu eine Kontrastprüfung: Wählt jemand ein helles Gelb, muss die Schrift auf
farbigen Flächen dunkel werden statt weiß. Sie läuft beim Speichern und weist
auf zu schwache Kombinationen hin.

## Absicherung

Die Tabellen bekommen Row Level Security mit Policies für angemeldete Nutzer —
anders als bei `recruiting_leads`, wo RLS bewusst ohne Policy eingerichtet
wurde, weil dort nur serverseitig geschrieben wird.

Beim Logo-Upload werden Dateityp und Größe geprüft. Erlaubt sind PNG, JPEG und
SVG bis 2 MB. Bei SVG ist Vorsicht geboten: Die Dateien können Skripte
enthalten und müssen bereinigt werden — `dompurify` ist im Projekt vorhanden.

## Fehlerbehandlung

**Beim Veröffentlichen** wird geprüft, ob die Pflichtangaben vollständig sind —
dieselben Regeln, die heute `kampagnen.test.ts` gegen die Code-Dateien prüft.
Sie wandern in ein gemeinsames Modul, das Formular und Test nutzen.

**Beim Löschen eines Arbeitgebers** mit veröffentlichten Seiten: Hinweis statt
stiller Löschung. Bewerbungen bleiben erhalten, auch wenn die zugehörige Seite
entfernt wird.

**Bei fehlgeschlagenen Benachrichtigungen** zeigt die Übersicht die betroffenen
Bewerbungen. Heute fällt das nur auf, wer die Datenbank abfragt.

## Tests

| Was | Warum |
|---|---|
| Vertraulichkeit | Erscheint der Arbeitgebername wirklich nirgends? Text, Bild, Metadaten, Social-Caption |
| Zugriffsschutz | Kommt ein Unangemeldeter an `/intern` oder an Bewerbungsdaten? |
| Pflichtangaben | Lässt sich eine unvollständige Seite veröffentlichen? |
| Farbkontrast | Wird eine unlesbare Kombination erkannt? |
| Übernahme | Ergeben die migrierten Kampagnen dieselben Seiten wie vorher? |
| Bedienung am Handy | Lässt sich der Anlegen-Ablauf mit dem Daumen bedienen? Touchflächen ab 44 px, keine Eingabefelder unter 16 px Schrift |

Die 116 bestehenden Tests werden übernommen und auf Datenbank-Kampagnen
umgestellt.

## Übernahme der bestehenden Daten

Die beiden Kampagnen `kaeltetechniker-koeln` und `kaeltetechniker-deutschland`
werden in die Datenbank überführt. Ein Test vergleicht das Ergebnis mit dem
heutigen HTML — die Seiten dürfen sich nicht verändern.

Die Code-Dateien bleiben zunächst bestehen und werden erst entfernt, wenn die
Datenbank-Fassung nachweislich dasselbe liefert.

## Was nicht dazugehört

**Meta-Anzeigen.** Sie bleiben im Werbeanzeigenmanager. Begründung oben: Dort
fließt Geld, und der Schritt gehört bewusst getan, nicht per Knopfdruck
zwischen zwei Terminen.

**Der tägliche Instagram-Zeitplan** läuft weiter als GitHub Action. Die App
postet auf Anforderung; die Automatik arbeitet unabhängig davon weiter.

**Ebenfalls nicht enthalten:** Bewerberstatus und Notizen, eigene Domains,
Rollen und Rechte.

**Bearbeiten veröffentlichter Seiten ist dagegen enthalten.** Wer vom Handy aus
arbeitet, muss einen Tippfehler im Gehalt auch unterwegs korrigieren können —
sonst bleibt der Rechner doch nötig, und das war der Ausgangspunkt.

Damit das nicht zum Problem wird: Läuft auf die Seite gerade eine
Meta-Kampagne, weist die App vor dem Speichern darauf hin. Geändert wird
trotzdem, aber bewusst. Die Bildunterschrift bereits veröffentlichter
Instagram-Beiträge lässt sich nachträglich nicht ändern — auch darauf weist
die App hin, wenn das Gehalt angefasst wird.

## Reihenfolge der Umsetzung

Die App entsteht in Schritten, jeder für sich nutzbar:

1. **Anmeldung und Gerüst** — Supabase Auth, App-Manifest, Navigation
2. **Landingpages aus der Datenbank** — Umstellung der öffentlichen Route,
   Übernahme der beiden bestehenden Kampagnen
3. **Anlegen und Veröffentlichen** — der geführte Ablauf, zunächst nur die
   Landingpage
4. **Bewerbungen** — Liste, Detailansicht, Export, Push-Mitteilungen
5. **Verteilen** — Instagram und Google an den Veröffentlichen-Knopf, Teilen
   über das Gerät

Nach Schritt 3 kannst du vom Handy aus Landingpages anlegen — das allein
ersetzt schon den heutigen Weg über Code und Deployment.
