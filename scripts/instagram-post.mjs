#!/usr/bin/env node

// Veröffentlicht eine Stellenanzeige auf Instagram.
//
// Bewusst ein lokales Skript und kein Knopf im Social-Kit: Diese Seite ist
// öffentlich erreichbar (nur noindex), ein Post-Knopf dort wäre für jeden
// Besucher bedienbar. So bleibt der Zugangstoken auf deinem Rechner.
//
// Einrichtung und Token-Erneuerung: docs/instagram-posting.md
//
// Der Token kommt aus ~/.instagram-token (dort legt ihn ig-token.mjs ab).
//
// Aufruf:
//   node scripts/instagram-post.mjs --list            alle Stellen mit IDs
//   node scripts/instagram-post.mjs --job 34 --dry-run
//   node scripts/instagram-post.mjs --job 34
//   node scripts/instagram-post.mjs --job 34 --format story

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Welche Stelle wann veroeffentlicht wurde, steht auf dem Instagram-Konto
// selbst: Jede Bildunterschrift enthaelt die Job-URL mit der ID am Ende.
// Damit braucht der Zeitplan keinen eigenen Speicher — wichtig fuer GitHub
// Actions, wo zwischen zwei Laeufen nichts erhalten bleibt. Nebeneffekt: Auch
// von Hand abgesetzte Posts werden beruecksichtigt.
//
// Stories tauchen in /me/media nicht auf. Sie zaehlen deshalb nicht als
// "gepostet" — was passt, denn sie verschwinden nach 24 Stunden ohnehin.

async function holeVeroeffentlichte(token) {
  const gepostet = new Map(); // Stellen-ID → Zeitpunkt der letzten Veroeffentlichung
  let url =
    `${API}/me/media?fields=id,caption,timestamp&limit=100` +
    `&access_token=${encodeURIComponent(token)}`;

  // Bis zu drei Seiten: 300 Beitraege reichen weit ueber den Stellenbestand
  for (let seite = 0; seite < 3 && url; seite++) {
    const antwort = await fetch(url).then((r) => r.json());
    if (antwort.error) {
      abbruch(`Veroeffentlichte Beitraege nicht abrufbar: ${antwort.error.message}`);
    }

    for (const m of antwort.data ?? []) {
      const treffer = /phe-perm\.de\/jobs\/[a-z0-9-]*?-(\d+)/.exec(m.caption ?? "");
      if (!treffer) continue;
      const id = treffer[1];
      // Die API liefert absteigend nach Datum — der erste Treffer ist der neueste
      if (!gepostet.has(id)) gepostet.set(id, m.timestamp);
    }

    url = antwort.paging?.next ?? null;
  }

  return gepostet;
}

/** Waehlt die Stelle, die am laengsten nicht gepostet wurde.
 *  Noch nie gepostete kommen zuerst, danach die aelteste Veroeffentlichung. */
async function naechsteStelle(stellen, token) {
  const gepostet = await holeVeroeffentlichte(token);

  const nie = stellen.filter((j) => !gepostet.has(String(j.id)));
  if (nie.length) return { job: nie[0], zuletzt: null, offen: nie.length };

  const sortiert = [...stellen].sort((a, b) =>
    gepostet.get(String(a.id)).localeCompare(gepostet.get(String(b.id))),
  );
  return { job: sortiert[0], zuletzt: gepostet.get(String(sortiert[0].id)), offen: 0 };
}

const BASIS = process.env.PHE_BASIS_URL ?? "https://www.phe-perm.de";
const API = "https://graph.instagram.com/v21.0";

const FORMATE = { feed: "4:5", story: "9:16", square: "1:1" };

function argumente() {
  const a = process.argv.slice(2);
  const wert = (name) => {
    const i = a.indexOf(name);
    return i >= 0 ? a[i + 1] : undefined;
  };
  return {
    job: wert("--job"),
    format: wert("--format") ?? "feed",
    trocken: a.includes("--dry-run"),
    liste: a.includes("--list"),
    naechste: a.includes("--next"),
    verlauf: a.includes("--history"),
  };
}

function abbruch(text) {
  console.error(`\n  ${text}\n`);
  process.exit(1);
}

/** Holt die Stellen aus der ausgelieferten Website, nicht aus data.ts —
 *  so wird nur beworben, was auch wirklich online steht. */
async function ladeStellen() {
  const antwort = await fetch(`${BASIS}/api/jobs`);
  if (!antwort.ok) abbruch(`Stellen konnten nicht geladen werden (HTTP ${antwort.status}).`);
  const daten = await antwort.json();
  const stellen = Array.isArray(daten) ? daten : (daten.jobs ?? []);
  if (!stellen.length) abbruch("Die Website liefert derzeit keine Stellen aus.");
  return stellen;
}

/** Token aus der Umgebung oder aus ~/.instagram-token. */
function ladeToken() {
  const ausUmgebung = process.env.IG_ACCESS_TOKEN?.trim();
  if (ausUmgebung) return ausUmgebung;

  const datei = join(homedir(), ".instagram-token");
  if (existsSync(datei)) return readFileSync(datei, "utf8").trim();

  return undefined;
}

async function main() {
  const arg = argumente();
  const stellen = await ladeStellen();

  if (arg.liste) {
    console.log(`\n  ${stellen.length} Stellen online:\n`);
    for (const j of stellen) {
      console.log(`  ${String(j.id).padStart(3)}  ${(j.title ?? "").slice(0, 46).padEnd(48)}${j.city ?? ""}`);
    }
    console.log("\n  Posten mit:  node scripts/instagram-post.mjs --job <ID>\n");
    return;
  }

  if (arg.verlauf) {
    const token = ladeToken();
    if (!token) abbruch("Kein Zugriffstoken — siehe docs/instagram-posting.md");

    const gepostet = await holeVeroeffentlichte(token);
    const mitDatum = stellen
      .filter((j) => gepostet.has(String(j.id)))
      .sort((a, b) => gepostet.get(String(b.id)).localeCompare(gepostet.get(String(a.id))));

    console.log(`\n  ${mitDatum.length} von ${stellen.length} Stellen wurden schon gepostet:\n`);
    for (const j of mitDatum) {
      const datum = new Date(gepostet.get(String(j.id))).toLocaleString("de-DE", {
        dateStyle: "short",
        timeStyle: "short",
      });
      console.log(`  ${String(j.id).padStart(3)}  ${datum}  ${(j.title ?? "").slice(0, 44)}`);
    }
    console.log(`\n  Noch nie gepostet: ${stellen.length - mitDatum.length}\n`);
    return;
  }

  if (arg.naechste && !arg.job) {
    const token = ladeToken();
    if (!token) abbruch("Kein Zugriffstoken — siehe docs/instagram-posting.md");

    const { job: naechste, zuletzt, offen } = await naechsteStelle(stellen, token);
    arg.job = String(naechste.id);
    console.log(
      zuletzt
        ? `\n  Naechste Stelle: ${arg.job} (zuletzt ${new Date(zuletzt).toLocaleDateString("de-DE")})`
        : `\n  Naechste Stelle: ${arg.job} (noch nie gepostet, ${offen} offen)`,
    );
  }

  if (!arg.job) {
    abbruch("Bitte eine Stelle angeben: --job <ID> oder --next. Alle anzeigen: --list");
  }
  if (!(arg.format in FORMATE)) {
    abbruch(`Unbekanntes Format "${arg.format}". Erlaubt: ${Object.keys(FORMATE).join(", ")}`);
  }

  const job = stellen.find((j) => String(j.id) === String(arg.job));
  if (!job) {
    abbruch(`Stelle ${arg.job} ist nicht online. Alle anzeigen: --list`);
  }

  // Der Slug entsteht aus Titel und Ort — dieselbe Logik wie auf der Website.
  const slug = `${slugify(`${job.title} ${job.city}`)}-${job.id}`;
  const bild = `${BASIS}/jobs/${slug}/instagram-image?format=${arg.format}`;
  const caption = await ladeCaption(slug);

  console.log(`\n  Stelle:   ${job.title} — ${job.city}`);
  console.log(`  Format:   ${arg.format} (${FORMATE[arg.format]})`);
  console.log(`  Bild:     ${bild}`);
  console.log(`  Text:     ${caption.split("\n")[0]} …  (${caption.length} Zeichen)`);

  // Vorab prüfen, ob das Bild wirklich als JPEG ausgeliefert wird — die API
  // nimmt ausschließlich JPEG und meldet sonst einen wenig hilfreichen Fehler.
  const bildAntwort = await fetch(bild, { method: "HEAD" });
  const typ = bildAntwort.headers.get("content-type");
  if (!bildAntwort.ok) abbruch(`Bild nicht erreichbar (HTTP ${bildAntwort.status}).`);
  if (typ !== "image/jpeg") abbruch(`Bild ist ${typ}, Instagram verlangt image/jpeg.`);
  console.log(`  Geprüft:  ${typ}, ${bildAntwort.headers.get("content-length") ?? "?"} Bytes`);

  if (arg.trocken) {
    console.log(`\n  ── Bildunterschrift ──\n`);
    console.log(caption.split("\n").map((z) => `  ${z}`).join("\n"));
    console.log(`\n  [dry-run] Es wurde nichts veröffentlicht.\n`);
    return;
  }

  const token = ladeToken();
  if (!token) {
    abbruch(
      "Kein Zugriffstoken. Entweder IG_ACCESS_TOKEN setzen oder einen" +
        "\n  ablegen mit: node scripts/ig-token.mjs" +
        "\n  Siehe docs/instagram-posting.md",
    );
  }

  // `/me` statt einer Konto-ID: Bei der Instagram-Login-API ist das der
  // vorgesehene Weg. Das Dashboard zeigt eine andere Kennung als die API
  // selbst — mit `/me` kann man sie nicht verwechseln.
  const nutzer = "me";

  // Schritt 1: Container anlegen
  const containerFelder = new URLSearchParams({ image_url: bild, caption, access_token: token });
  if (arg.format === "story") containerFelder.set("media_type", "STORIES");

  const container = await fetch(`${API}/${nutzer}/media`, {
    method: "POST",
    body: containerFelder,
  }).then((r) => r.json());

  if (container.error) abbruch(`Instagram: ${container.error.message}`);
  console.log(`  Container: ${container.id}`);

  // Schritt 2: Verarbeitung abwarten. Instagram lädt das Bild selbst herunter,
  // das dauert einen Moment — sofortiges Veröffentlichen scheitert sonst.
  for (let versuch = 1; versuch <= 20; versuch++) {
    await new Promise((r) => setTimeout(r, 3000));
    const stand = await fetch(
      `${API}/${container.id}?fields=status_code,status&access_token=${token}`,
    ).then((r) => r.json());

    if (stand.status_code === "FINISHED") break;
    if (stand.status_code === "ERROR") abbruch(`Verarbeitung fehlgeschlagen: ${stand.status ?? "unbekannt"}`);
    if (versuch === 20) abbruch("Instagram hat das Bild nicht rechtzeitig verarbeitet.");
    process.stdout.write(".");
  }

  // Schritt 3: Veröffentlichen
  const post = await fetch(`${API}/${nutzer}/media_publish`, {
    method: "POST",
    body: new URLSearchParams({ creation_id: container.id, access_token: token }),
  }).then((r) => r.json());

  if (post.error) abbruch(`Veröffentlichen fehlgeschlagen: ${post.error.message}`);

  console.log(`\n  ✓ Veröffentlicht. Beitrags-ID: ${post.id}\n`);
}

/** Holt die Bildunterschrift aus der Social-Kit-Seite, damit gepostete und
 *  angezeigte Fassung identisch sind. */
async function ladeCaption(slug) {
  const antwort = await fetch(`${BASIS}/jobs/${slug}/social`);
  if (!antwort.ok) abbruch(`Social-Kit für ${slug} nicht erreichbar (HTTP ${antwort.status}).`);
  const html = await antwort.text();

  // Die Seite rendert den Text in einem <textarea> zum Kopieren.
  const treffer = html.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/);
  if (!treffer) abbruch("Bildunterschrift konnte im Social-Kit nicht gefunden werden.");

  return treffer[1]
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .trim();
}

const UMLAUTE = { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "Ä": "ae", "Ö": "oe", "Ü": "ue" };

function slugify(text) {
  return text
    .replace(/\((?:m\/w\/d|w\/m\/d|d\/m\/w|m\/w\/x)\)/gi, " ")
    .replace(/[äöüßÄÖÜ]/g, (c) => UMLAUTE[c] ?? c)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

main().catch((e) => abbruch(e.message));
