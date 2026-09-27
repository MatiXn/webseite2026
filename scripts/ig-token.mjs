#!/usr/bin/env node

// Tauscht einen kurzlebigen Instagram-Token gegen einen langlebigen.
//
// Der Token aus dem Meta-Dashboard haelt nur eine Stunde. Dieses Skript holt
// ihn aus der Zwischenablage, tauscht ihn gegen einen 60-Tage-Token und legt
// diesen in ~/.instagram-token ab.
//
// Bewusst ueber die Zwischenablage statt ueber ein Eingabefeld: Der Token ist
// knapp 200 Zeichen lang, abtippen ist keine Option, und beim Kopieren eines
// laengeren Befehls faellt er wieder heraus. Der Aufruf hier ist kurz genug
// zum Abtippen.
//
// Aufruf — Token vorher im Meta-Dashboard kopieren:
//   node scripts/ig-token.mjs <app-geheimcode>
//
// Verlaengern eines noch gueltigen Tokens (ab dem 2. Tag moeglich):
//   node scripts/ig-token.mjs --refresh

import { execFileSync } from "node:child_process";
import { writeFileSync, chmodSync, readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ZIEL = join(homedir(), ".instagram-token");
const GEHEIM_DATEI = join(homedir(), ".instagram-app-secret");

function abbruch(text) {
  console.error(`\n  ${text}\n`);
  process.exit(1);
}

function speichern(token, gueltigBis) {
  writeFileSync(ZIEL, token, "utf8");
  chmodSync(ZIEL, 0o600);
  console.log(`\n  ✓ Token gespeichert in ${ZIEL}`);
  console.log(`    Laenge:  ${token.length} Zeichen`);
  console.log(`    Gueltig: ${gueltigBis}`);
  console.log(`\n  Verwendung:`);
  console.log(`    IG_ACCESS_TOKEN=$(cat ~/.instagram-token) \\`);
  console.log(`    IG_USER_ID=17841409221592746 \\`);
  console.log(`    node scripts/instagram-post.mjs --job 34\n`);
}

function alsDatum(sekunden) {
  const tage = Math.floor(sekunden / 86400);
  const bis = new Date(Date.now() + sekunden * 1000);
  return `${tage} Tage, bis ${bis.toLocaleDateString("de-DE")}`;
}

async function main() {
  const arg = process.argv[2];

  // ── Verlaengern eines vorhandenen langlebigen Tokens ────────────────────
  if (arg === "--refresh") {
    if (!existsSync(ZIEL)) abbruch(`Keine Datei ${ZIEL}. Erst einen Token tauschen.`);
    const alt = readFileSync(ZIEL, "utf8").trim();

    const antwort = await fetch(
      `https://graph.instagram.com/refresh_access_token` +
        `?grant_type=ig_refresh_token&access_token=${encodeURIComponent(alt)}`,
    ).then((r) => r.json());

    if (antwort.error) {
      abbruch(
        `Instagram: ${antwort.error.message}\n` +
          `  Ein abgelaufener Token laesst sich nicht verlaengern — dann im\n` +
          `  Meta-Dashboard einen neuen erzeugen und ohne --refresh tauschen.`,
      );
    }
    speichern(antwort.access_token, alsDatum(antwort.expires_in));
    return;
  }

  // ── Kurzlebigen Token aus der Zwischenablage tauschen ───────────────────
  // Der Geheimcode kommt bevorzugt aus ~/.instagram-app-secret. Ihn in die
  // Befehlszeile zu tippen ist fehleranfaellig, und beim Einfuegen bricht das
  // Terminal lange Zeilen gelegentlich um.
  let geheim = arg && !arg.startsWith("--") ? arg : undefined;

  if (!geheim && existsSync(GEHEIM_DATEI)) {
    geheim = readFileSync(GEHEIM_DATEI, "utf8").trim();
    console.log(`\n  Geheimcode aus ${GEHEIM_DATEI} (${geheim.length} Zeichen)`);
  }

  if (!geheim) {
    abbruch(
      "Kein App-Geheimcode gefunden.\n\n" +
        "  Einmalig ablegen:\n" +
        `    Geheimcode kopieren, dann:  pbpaste > ${GEHEIM_DATEI}\n\n` +
        "  Oder direkt uebergeben:\n" +
        "    node ~/igtoken.mjs <geheimcode>\n\n" +
        "  Zum Verlaengern eines gueltigen Tokens: --refresh",
    );
  }

  if (/\s/.test(geheim)) {
    abbruch(
      `Der Geheimcode enthaelt Leerzeichen oder Zeilenumbrueche (${geheim.length} Zeichen).\n` +
        "  Vermutlich wurde beim Kopieren etwas mitgenommen.",
    );
  }

  let kurz;
  try {
    // execFileSync statt execSync: kein Shell-Aufruf, nichts zu maskieren
    kurz = execFileSync("pbpaste", { encoding: "utf8" }).trim();
  } catch {
    abbruch("Zwischenablage nicht lesbar (pbpaste fehlt — nur unter macOS).");
  }

  if (kurz.length < 50) {
    abbruch(
      `In der Zwischenablage stehen nur ${kurz.length} Zeichen.\n` +
        `  Erwartet wird ein Token mit rund 200 Zeichen.\n` +
        `  Wahrscheinlich wurde zuletzt etwas anderes kopiert — im\n` +
        `  Meta-Dashboard den Token erneut kopieren und den Aufruf wiederholen.`,
    );
  }
  if (/\s/.test(kurz)) {
    abbruch("Die Zwischenablage enthaelt Leerzeichen oder Zeilenumbrueche — das ist kein Token.");
  }

  console.log(`\n  Token aus der Zwischenablage: ${kurz.length} Zeichen, beginnt mit ${kurz.slice(0, 3)}…`);

  // Erst pruefen, ob der Token ueberhaupt gueltig ist. Das erspart die
  // Raterei bei "Session key invalid": Die Meldung kommt sowohl bei einem
  // abgelaufenen Token als auch bei einem, der gar keiner ist.
  const wer = await fetch(
    `https://graph.instagram.com/v21.0/me?fields=id,username&access_token=${encodeURIComponent(kurz)}`,
  ).then((r) => r.json());

  if (wer.error) {
    abbruch(
      `Der Token ist nicht gueltig: ${wer.error.message}\n\n` +
        "  Haeufigste Ursache: In der Zwischenablage stand etwas anderes —\n" +
        "  etwa eine kopierte Fehlermeldung. Im Meta-Dashboard auf\n" +
        "  „Token generieren“ klicken, kopieren, dann sofort hier wiederholen\n" +
        "  (Pfeiltaste hoch, Enter).",
    );
  }

  console.log(`  Gehoert zu: @${wer.username} (${wer.id})`);

  // Laeuft der Token noch lange, ist er bereits langlebig — dann waere ein
  // Austausch weder noetig noch moeglich.
  const pruef = await fetch(
    `https://graph.instagram.com/refresh_access_token` +
      `?grant_type=ig_refresh_token&access_token=${encodeURIComponent(kurz)}`,
  ).then((r) => r.json());

  if (!pruef.error && pruef.access_token) {
    console.log("  Der Token war bereits langlebig — direkt verlaengert.");
    speichern(pruef.access_token, alsDatum(pruef.expires_in));
    return;
  }

  const antwort = await fetch(
    `https://graph.instagram.com/access_token` +
      `?grant_type=ig_exchange_token` +
      `&client_secret=${encodeURIComponent(geheim)}` +
      `&access_token=${encodeURIComponent(kurz)}`,
  ).then((r) => r.json());

  if (antwort.error) {
    const m = antwort.error.message ?? "";
    let hinweis = "";
    if (m.includes("Session key invalid")) {
      hinweis =
        "\n  Der kurzlebige Token ist abgelaufen — er haelt nur eine Stunde.\n" +
        "  Im Meta-Dashboard einen neuen erzeugen und sofort hier tauschen.";
    } else if (m.includes("client_secret")) {
      hinweis =
        "\n  Der App-Geheimcode stimmt nicht.\n" +
        `  Verwendet wurden ${geheim.length} Zeichen, beginnend mit ${geheim.slice(0, 4)}…\n` +
        "  Gebraucht wird der INSTAGRAM-App-Geheimcode (neben der Instagram-App-ID),\n" +
        "  nicht der Facebook-App-Geheimcode aus App-Einstellungen → Allgemein.";
    }
    abbruch(`Instagram: ${m}${hinweis}`);
  }

  speichern(antwort.access_token, alsDatum(antwort.expires_in));
}

main().catch((e) => abbruch(e.message));
