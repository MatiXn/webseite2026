# Stellenanzeigen auf Instagram veröffentlichen

`scripts/instagram-post.mjs` postet eine Stellenanzeige auf das
Instagram-Konto von PHE — mit dem Bild und der Bildunterschrift aus dem
Social-Kit.

**Eingerichtet am 28.09.2026.**

| | |
|---|---|
| Meta-App | „PHE Stellenanzeigen", Instagram-App-ID `1625151512739038` |
| Instagram-Konto | `@phe_perm_engineering`, Typ BUSINESS |
| Token | `~/.instagram-token`, 60 Tage gültig |
| App-Geheimcode | `~/.instagram-app-secret` |

Beide Dateien liegen außerhalb des Repositories mit Rechten 600.

## Warum ein Skript und kein Knopf im Social-Kit

`/jobs/social-kit` ist **öffentlich erreichbar** — `noindex, nofollow` hält nur
Suchmaschinen fern, nicht Menschen. Ein Post-Knopf dort wäre für jeden
Besucher bedienbar, der die URL kennt. Beim Skript bleibt der Zugangstoken auf
dem eigenen Rechner.

## Einmalige Einrichtung

### 1. Instagram-Konto prüfen

`@phe_perm_engineering` muss ein **Business- oder Creator-Konto** sein und mit
einer Facebook-Seite verknüpft. In der Instagram-App: Einstellungen →
Kontotyp und Tools. Bei einem privaten Konto verweigert die API den Dienst.

### 2. Meta-App anlegen

<https://developers.facebook.com/apps> → **App erstellen** → Anwendungsfall
**„Andere"** → Typ **„Business"**.

Danach im Dashboard das Produkt **Instagram** hinzufügen.

### 3. Berechtigungen und Token

Im Produkt Instagram → **API-Setup mit Instagram-Login**:

- Instagram-Konto verknüpfen
- Berechtigungen: `instagram_business_basic` und
  `instagram_business_content_publish`
- Token generieren und kopieren

Für das eigene Konto genügt **Standard Access** — es ist **kein App Review**
nötig. Der ist nur erforderlich, wenn die App fremde Instagram-Konten bespielt.

### 4. Token verlängern

Der erzeugte Token hält nur eine Stunde. Gegen einen langlebigen tauschen:

```bash
curl -s "https://graph.instagram.com/access_token\
?grant_type=ig_exchange_token\
&client_secret=DEIN_APP_SECRET\
&access_token=DER_KURZE_TOKEN"
```

Das Ergebnis ist **60 Tage** gültig.

## Anwendung

Alle online stehenden Stellen mit ihren IDs anzeigen:

```bash
node scripts/instagram-post.mjs --list
```

Ansehen, was gepostet würde — ohne zu posten:

```bash
node scripts/instagram-post.mjs --job 34 --dry-run
```

Veröffentlichen:

```bash
node scripts/instagram-post.mjs --job 34
```

Der Token wird aus `~/.instagram-token` gelesen; `IG_ACCESS_TOKEN` in der
Umgebung hat Vorrang, falls gesetzt.

Format wählen:

| Wert | Größe | Wofür |
|---|---|---|
| `feed` (Voreinstellung) | 1080 × 1350 | Instagram-Feed |
| `story` | 1080 × 1920 | Story |
| `square` | 1080 × 1080 | Feed, Explore |

```bash
… node scripts/instagram-post.mjs --job 34 --format story
```

## Umgebungsvariablen

| Variable | Woher |
|---|---|
| `IG_ACCESS_TOKEN` | optional — sonst aus `~/.instagram-token` |
| `PHE_BASIS_URL` | optional, für lokale Tests: `http://localhost:3000` |

Eine Konto-ID wird **nicht** gebraucht: Das Skript spricht `/me` an. Das
Dashboard zeigt eine andere Kennung (`17841409221592746`) als die API selbst
(`28513357231625561`) — mit `/me` kann man sie nicht verwechseln.

Den Token **nicht** ins Repository legen.

## Token erneuern

Der Token gilt 60 Tage. Ab dem zweiten Tag lässt er sich verlängern, ohne im
Dashboard einen neuen zu erzeugen:

```bash
node scripts/ig-token.mjs --refresh
```

Setz dir eine Erinnerung auf etwa 50 Tage. Ein **abgelaufener** Token lässt
sich nicht mehr verlängern — dann im Dashboard unter
Anwendungsfälle → Instagram API → API-Einrichtung mit Instagram-Login einen
neuen erzeugen, kopieren und tauschen:

```bash
node scripts/ig-token.mjs
```

Das Skript nimmt den Token aus der Zwischenablage und den Geheimcode aus
`~/.instagram-app-secret`. Es prüft vorher, ob der Token überhaupt gültig ist —
die Meldung „Session key invalid" kommt sonst sowohl bei einem abgelaufenen
Token als auch dann, wenn in der Zwischenablage etwas ganz anderes steht.

## Wie das Bild entsteht

Instagram akzeptiert **ausschließlich JPEG** — „JPEG is the only image format
supported". Die vorhandenen Social-Bilder sind PNG, weil `ImageResponse`
nichts anderes erzeugt.

Deshalb gibt es `frontend/src/app/jobs/[slug]/instagram-image/route.ts`: Sie
holt das fertige PNG der jeweiligen Route und wandelt es um. Ändert sich die
Gestaltung der Social-Bilder, zieht diese Route automatisch mit — es gibt kein
zweites Layout zu pflegen.

Umgewandelt wird mit `pngjs` und `jpeg-js`, nicht mit `sharp`. Das hat einen
Grund: sharp lädt seine nativen Bibliotheken erst zur Laufzeit per `dlopen`.
Der Datei-Tracer von Next.js erkennt sie deshalb nicht und liefert sie nicht
mit — in Produktion scheiterte der Import an
`libvips-cpp.so.8.18.6: cannot open shared object file`, obwohl alle
Linux-Binärdateien samt Prüfsumme im Lockfile standen. Weder ein Build ohne
Cache noch `outputFileTracingIncludes` halfen. Die beiden reinen
JavaScript-Bibliotheken haben keine eigenen Abhängigkeiten und laufen überall
gleich; sie sind langsamer, aber das Ergebnis wird einen Tag zwischengespeichert.

Der interne Abruf des Quellbilds schickt den Automatisierungs-Bypass mit
(`VERCEL_AUTOMATION_BYPASS_SECRET`, in jedem Deployment als Systemvariable
vorhanden). Ohne ihn landet die Route in geschützten Preview-Deployments auf
der Anmeldeseite statt beim Bild und kann nichts umwandeln. In Produktion gibt
es keinen Schutz — dort ist die Kopfzeile wirkungslos.

Das Skript prüft vor dem Posten per HEAD-Anfrage, dass wirklich `image/jpeg`
ausgeliefert wird. Sonst bricht es mit klarer Meldung ab, statt in den
unspezifischen Fehler der Instagram-API zu laufen.

Die Bildunterschrift kommt aus `frontend/src/content/social-caption.ts` —
dasselbe Modul, das die Vorschau im Social-Kit rendert. Angezeigte und
gepostete Fassung können damit nicht auseinanderlaufen.

## Grenzen

- **100 Posts je 24 Stunden** pro Instagram-Konto.
- **Reels brauchen Video.** Das Skript postet Bilder; für Reels fehlt
  bewegtes Material.
- **Der Token läuft nach 60 Tagen ab.** Dann Schritt 4 wiederholen. Ein
  abgelaufener Token meldet sich mit „Error validating access token".
- Die API veröffentlicht sofort. Einen Terminplaner gibt es hier nicht — dafür
  ist die Meta Business Suite gedacht.

## Automatischer Zeitplan

Seit 28.09.2026 laeuft der Zeitplan als **GitHub Action**, nicht mehr auf
einem Rechner: `.github/workflows/instagram-post.yml`. Zweimal taeglich wird
die am laengsten nicht veroeffentlichte Stelle gepostet.

| | |
|---|---|
| Zeiten | 7:00 und 16:00 UTC (9:00 und 18:00 MESZ) |
| Secret | `INSTAGRAM_ACCESS_TOKEN` in den Repository-Einstellungen |
| Von Hand ausloesbar | Actions → „Stellenanzeige auf Instagram posten" → Run workflow |

GitHub rechnet in UTC. Zur Zeitumstellung verschieben sich die Posts um eine
Stunde — fuer Stellenanzeigen unerheblich.

### Woher der Workflow weiss, was schon dran war

Gar nicht aus eigenem Speicher: Das Skript liest die letzten Beitraege vom
Instagram-Konto und zieht die Stellen-ID aus der Bildunterschrift, wo die
Job-URL steht. GitHub Actions haben zwischen zwei Laeufen keinen Zustand —
so ist auch keiner noetig. Nebeneffekt: Von Hand abgesetzte Posts zaehlen
ebenfalls.

Stories tauchen in `/me/media` nicht auf und zaehlen deshalb nicht als
„gepostet". Das passt, denn sie verschwinden nach 24 Stunden ohnehin.

### Secret einrichten

```
https://github.com/MatiXn/webseite2026/settings/secrets/actions
```

**New repository secret** → Name `INSTAGRAM_ACCESS_TOKEN`, Wert aus
`~/.instagram-token`. **Nach jeder Token-Erneuerung muss auch das Secret
aktualisiert werden** — sonst laeuft der Workflow ins Leere, waehrend lokal
alles funktioniert.

### Nachsehen, was passiert ist

```
https://github.com/MatiXn/webseite2026/actions
```

Jeder Lauf zeigt am Ende den Stand: welche Stellen schon dran waren und wie
viele noch offen sind. Der Workflow prueft ausserdem vor jedem Post, ob der
Token noch gilt, und bricht mit klarer Fehlermeldung ab, statt unbemerkt
stehenzubleiben.

### Anhalten

Actions → „Stellenanzeige auf Instagram posten" → **Disable workflow**.
Wieder einschalten ueber denselben Weg.

### Uhrzeiten aendern

Die `cron`-Zeilen in `.github/workflows/instagram-post.yml` anpassen — in UTC,
also zwei Stunden vor der gewuenschten Sommerzeit.

### Was nach 22 Tagen passiert

Bei 44 Stellen und zwei Posts taeglich ist der Bestand nach gut drei Wochen
einmal durch. Danach beginnt die Automatik von vorn, immer mit der Stelle, die
am laengsten nicht dran war. Neue Stellen aus dem Google Sheet ruecken
automatisch nach vorn, weil sie noch nie gepostet wurden.

### Der lokale Zeitplan

Bis zum 28.09.2026 lief das ueber `launchd` auf einem Mac
(`scripts/instagram-auto.sh` und zwei `.plist`-Dateien). Das haengt daran, dass
der Rechner laeuft, und wurde deshalb abgeloest. Die Dateien liegen unter
`~/.phe-backup/`, das Skript bleibt im Repo — beides funktioniert weiterhin,
falls der Weg ueber GitHub einmal nicht geht.

**Nicht beide gleichzeitig laufen lassen**, sonst werden zwei Stellen pro
Zeitfenster gepostet.
