# Stellenanzeigen auf Instagram veröffentlichen

`scripts/instagram-post.mjs` postet eine Stellenanzeige auf das
Instagram-Konto von PHE — mit dem Bild und der Bildunterschrift aus dem
Social-Kit.

> **[OFFEN]** Noch nicht eingerichtet. Die Schritte 1 bis 4 erfordern einen
> Browser-Login bei Meta und müssen von einer Person mit Zugriff auf das
> Instagram-Konto ausgeführt werden.

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
IG_ACCESS_TOKEN=… IG_USER_ID=… node scripts/instagram-post.mjs --job 34
```

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
| `IG_ACCESS_TOKEN` | langlebiger Token aus Schritt 4 |
| `IG_USER_ID` | Instagram-Konto-ID, steht im API-Setup der Meta-App |
| `PHE_BASIS_URL` | optional, für lokale Tests: `http://localhost:3000` |

Den Token **nicht** ins Repository legen. Entweder bei jedem Aufruf voranstellen
oder in einer Datei außerhalb des Repos ablegen und vor dem Aufruf laden.

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

## Was noch fehlen könnte

> **[OFFEN]** Es wird nicht festgehalten, welche Stelle bereits gepostet wurde.
> Bei 44 Stellen und gelegentlichem Posten ist das verschmerzbar; wer
> regelmäßig postet, will irgendwann eine Liste.
