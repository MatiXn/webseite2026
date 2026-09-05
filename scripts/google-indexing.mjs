#!/usr/bin/env node
/**
 * Meldet die Stellenanzeigen an die Google Indexing API.
 *
 * Die API ist von Google ausdrücklich für JobPosting-Seiten vorgesehen: Neue
 * Stellen landen in Stunden statt Tagen in der Jobsuche, entfernte werden
 * sofort ausgetragen. Für andere Seitentypen funktioniert sie nicht — die
 * Sitemap bleibt dafür zuständig.
 *
 * Voraussetzungen (einmalig, siehe docs/google-indexing-api.md):
 *   - Google-Cloud-Projekt mit aktivierter Indexing API
 *   - Service-Account samt JSON-Schlüssel
 *   - Service-Account-Adresse in der Search Console als Inhaber eingetragen
 *
 * Aufruf:
 *   GOOGLE_INDEXING_KEY=~/pfad/key.json node scripts/google-indexing.mjs
 *   GOOGLE_INDEXING_KEY=... node scripts/google-indexing.mjs --dry-run
 *   GOOGLE_INDEXING_KEY=... node scripts/google-indexing.mjs --delete /jobs/alte-stelle-12
 *
 * Ohne Abhängigkeiten: Das JWT wird mit dem eingebauten crypto-Modul signiert.
 */
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const SITEMAP = "https://www.phe-perm.de/sitemap.xml";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const SCOPE = "https://www.googleapis.com/auth/indexing";

// Google erlaubt standardmäßig 200 Meldungen pro Tag.
const TAGESLIMIT = 200;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const deleteIdx = args.indexOf("--delete");
const zuLoeschen = deleteIdx >= 0 ? args.slice(deleteIdx + 1).filter(a => !a.startsWith("--")) : [];

function keyLaden() {
  const pfad = process.env.GOOGLE_INDEXING_KEY;
  if (!pfad) {
    console.error(
      "GOOGLE_INDEXING_KEY fehlt.\n" +
      "  Pfad zur JSON-Schlüsseldatei des Service-Accounts setzen:\n" +
      "  GOOGLE_INDEXING_KEY=~/phe-indexing-key.json node scripts/google-indexing.mjs",
    );
    process.exit(1);
  }
  const aufgeloest = pfad.startsWith("~") ? pfad.replace("~", homedir()) : pfad;
  try {
    return JSON.parse(readFileSync(aufgeloest, "utf8"));
  } catch (err) {
    console.error(`Schlüsseldatei nicht lesbar: ${aufgeloest}\n  ${err.message}`);
    process.exit(1);
  }
}

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Signiertes JWT gegen ein Access-Token tauschen (OAuth2 Service Account Flow). */
async function accessToken(key) {
  const jetzt = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({
    iss: key.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: jetzt + 3600,
    iat: jetzt,
  }));

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  const signatur = b64url(signer.sign(key.private_key));
  const jwt = `${header}.${payload}.${signatur}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const daten = await res.json();
  if (!res.ok) {
    console.error("Token-Abruf fehlgeschlagen:", JSON.stringify(daten, null, 2));
    console.error(
      "\nHäufigste Ursache: Die Indexing API ist im Cloud-Projekt nicht aktiviert.",
    );
    process.exit(1);
  }
  return daten.access_token;
}

/** Stellen-URLs aus der Sitemap — eine Quelle, kein zweiter Pflegeort. */
async function stellenUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Sitemap nicht erreichbar: HTTP ${res.status}`);
  const xml = await res.text();
  const alle = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  return alle.filter(u => /\/jobs\/[a-z0-9-]+-\d+$/.test(u));
}

async function melden(token, url, typ) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, type: typ }),
  });
  const daten = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, daten };
}

async function main() {
  const urls = zuLoeschen.length
    ? zuLoeschen.map(p => (p.startsWith("http") ? p : `https://www.phe-perm.de${p}`))
    : await stellenUrls();
  const typ = zuLoeschen.length ? "URL_DELETED" : "URL_UPDATED";

  console.log(`${urls.length} URL(s), Meldung als ${typ}`);

  if (urls.length > TAGESLIMIT) {
    console.warn(
      `Achtung: ${urls.length} URLs überschreiten das Tageslimit von ${TAGESLIMIT}. ` +
      "Der Rest wird von Google abgelehnt.",
    );
  }

  if (dryRun) {
    urls.forEach(u => console.log("  [dry-run]", u));
    return;
  }

  const token = await accessToken(keyLaden());
  let erfolg = 0;
  const fehler = [];

  for (const url of urls) {
    const r = await melden(token, url, typ);
    if (r.ok) {
      erfolg++;
      console.log("  ok  ", url);
    } else {
      const grund = r.daten?.error?.message ?? `HTTP ${r.status}`;
      fehler.push({ url, grund });
      console.log("  FEHL", url, "—", grund);
    }
  }

  console.log(`\n${erfolg} von ${urls.length} gemeldet.`);
  if (fehler.length) {
    console.log("\nFehlgeschlagen:");
    for (const f of fehler) console.log(`  ${f.url}\n    ${f.grund}`);
    if (fehler.some(f => /permission|Forbidden|403/i.test(f.grund))) {
      console.log(
        "\nBei Berechtigungsfehlern: Die Service-Account-Adresse muss in der\n" +
        "Search Console als Inhaber der Property eingetragen sein — nicht als\n" +
        "Nutzer mit eingeschränkten Rechten.",
      );
    }
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
