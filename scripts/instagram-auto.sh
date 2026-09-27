#!/bin/zsh

# Postet die naechste faellige Stellenanzeige auf Instagram.
#
# Wird von launchd zweimal taeglich aufgerufen (siehe docs/instagram-posting.md).
# Bewusst ein Wrapper statt eines direkten launchd-Aufrufs von node: launchd
# startet ohne die uebliche Shell-Umgebung, node liegt dort nicht im Pfad.

REPO="$HOME/Desktop/Projekte/phe-2026"
LOG="$HOME/.instagram-auto.log"
TOKEN="$HOME/.instagram-token"

# node finden — launchd kennt weder nvm noch Homebrew-Pfade
for p in /opt/homebrew/bin /usr/local/bin /usr/bin "$HOME/.nvm/versions/node/*/bin"; do
  for kandidat in ${~p}/node(N); do
    [[ -x "$kandidat" ]] && NODE="$kandidat" && break 2
  done
done

protokoll() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG"
}

if [[ -z "$NODE" ]]; then
  protokoll "FEHLER: node nicht gefunden"
  exit 1
fi

if [[ ! -f "$TOKEN" ]]; then
  protokoll "FEHLER: kein Token in $TOKEN"
  exit 1
fi

# Vor dem Posten pruefen, wie lange der Token noch gilt. Laeuft er bald ab,
# steht die Warnung im Protokoll, bevor die Automatik unbemerkt stehenbleibt.
GUELTIG=$("$NODE" -e '
const t = require("fs").readFileSync(process.env.HOME + "/.instagram-token", "utf8").trim();
fetch("https://graph.instagram.com/v21.0/me?fields=id&access_token=" + encodeURIComponent(t))
  .then(r => r.json())
  .then(d => console.log(d.error ? "UNGUELTIG: " + d.error.message : "ok"))
  .catch(e => console.log("UNGUELTIG: " + e.message));
' 2>/dev/null)

if [[ "$GUELTIG" != "ok" ]]; then
  protokoll "ABBRUCH: Token $GUELTIG"
  protokoll "  Erneuern mit: node scripts/ig-token.mjs --refresh"
  exit 1
fi

cd "$REPO" || { protokoll "FEHLER: $REPO nicht gefunden"; exit 1; }

AUSGABE=$("$NODE" scripts/instagram-post.mjs --next 2>&1)
ERGEBNIS=$?

if [[ $ERGEBNIS -eq 0 ]]; then
  protokoll "OK — $(echo "$AUSGABE" | grep -E 'Stelle:|Beitrags-ID' | tr '\n' ' ' | tr -s ' ')"
else
  protokoll "FEHLGESCHLAGEN:"
  echo "$AUSGABE" | sed 's/^/    /' >> "$LOG"
fi

exit $ERGEBNIS
