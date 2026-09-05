# Google Indexing API einrichten

Die Indexing API meldet Stellenanzeigen direkt bei Google an, statt auf den
nächsten Crawl zu warten. Neue Stellen sind dann in Stunden statt Tagen in der
Jobsuche, besetzte verschwinden sofort.

Google gibt die API ausdrücklich nur für zwei Seitentypen frei: `JobPosting`
und `BroadcastEvent`. Unsere Stellenseiten fallen darunter. Für alle anderen
Seiten der Domain bleibt die Sitemap zuständig — dort hätte die API keine
Wirkung.

> **[OFFEN]** Noch nicht eingerichtet. Die Schritte 1 bis 5 erfordern einen
> Browser-Login und müssen von einer Person mit Zugriff auf das Google-Konto
> ausgeführt werden.

## Einmalige Einrichtung

### 1. Cloud-Projekt anlegen

<https://console.cloud.google.com/projectcreate> — Name zum Beispiel
`phe-perm-indexing`. Ein bestehendes Projekt geht auch.

### 2. Indexing API aktivieren

<https://console.cloud.google.com/apis/library/indexing.googleapis.com> →
**Aktivieren**. Ohne diesen Schritt schlägt schon der Token-Abruf fehl.

### 3. Service-Account erstellen

<https://console.cloud.google.com/iam-admin/serviceaccounts> → **Dienstkonto
erstellen**. Name frei wählbar, zum Beispiel `indexing-bot`. Eine Rolle im
Cloud-Projekt braucht das Konto **nicht** — die Berechtigung kommt aus der
Search Console.

Nach dem Anlegen die E-Mail-Adresse des Kontos notieren, sie sieht so aus:

```
indexing-bot@phe-perm-indexing.iam.gserviceaccount.com
```

### 4. Schlüssel herunterladen

Im Dienstkonto → Reiter **Schlüssel** → **Schlüssel hinzufügen** → **Neuen
Schlüssel erstellen** → **JSON**. Die Datei wird einmalig heruntergeladen.

Sie außerhalb des Repositories ablegen, etwa unter `~/phe-indexing-key.json`.
Der Schlüssel erlaubt, im Namen der Domain mit Google zu sprechen — er gehört
nicht in die Versionskontrolle und nicht in einen geteilten Ordner.

### 5. Service-Account in der Search Console freischalten

Das ist der Schritt, an dem es am häufigsten scheitert.

<https://search.google.com/search-console> → Property `phe-perm.de` →
**Einstellungen** → **Nutzer und Berechtigungen** → **Nutzer hinzufügen**:

- E-Mail: die Adresse aus Schritt 3
- Berechtigung: **Inhaber** (nicht „Vollständig", nicht „Eingeschränkt")

Die API akzeptiert ausschließlich Inhaber. Mit jeder anderen Stufe kommt für
jede URL ein `Permission denied`.

## Anwendung

Alle Stellenanzeigen aus der Sitemap melden:

```bash
cd ~/Desktop/Projekte/phe-2026
GOOGLE_INDEXING_KEY=~/phe-indexing-key.json node scripts/google-indexing.mjs
```

Vorher ansehen, welche URLs gemeldet würden, ohne etwas zu senden:

```bash
node scripts/google-indexing.mjs --dry-run
```

Eine besetzte Stelle austragen:

```bash
GOOGLE_INDEXING_KEY=~/phe-indexing-key.json \
  node scripts/google-indexing.mjs --delete /jobs/kaeltetechniker-koeln-34
```

`--delete` nimmt mehrere Pfade entgegen. Die Stelle sollte zusätzlich in
`data.ts` auf `active: false` gesetzt oder im Google Sheet abgeschaltet werden —
sonst meldet der nächste Lauf sie wieder als aktuell.

## Grenzen

- **200 Meldungen pro Tag.** Bei aktuell 43 Stellen reichlich; eine Erhöhung
  lässt sich bei Google beantragen.
- Die API beschleunigt das Crawlen, sie erzwingt keine Aufnahme. Ob eine
  Anzeige in der Jobsuche erscheint, entscheidet Google weiterhin selbst.
- Der Aufruf ersetzt die Sitemap nicht, er ergänzt sie.

## Sinnvoller Rhythmus

Nach jedem Deploy mit neuen oder geänderten Stellen einmal laufen lassen. Ein
täglicher Lauf ohne Änderungen bringt nichts und verbraucht nur Kontingent.
