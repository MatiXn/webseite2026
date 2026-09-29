# Interner Bereich — Fundament (Anmeldung, Gerüst, Landingpages aus der Datenbank)

> **Für Umsetzende:** ERFORDERLICHE UNTER-SKILL: `superpowers:subagent-driven-development`
> (empfohlen) oder `superpowers:executing-plans`, um diesen Plan Aufgabe für
> Aufgabe abzuarbeiten. Die Schritte nutzen Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Ein angemeldeter Bereich unter `/intern`, der sich als App auf den
Startbildschirm legen lässt, und öffentliche Landingpages, die ihren Inhalt
aus der Datenbank beziehen statt aus TypeScript-Dateien.

**Aufbau:** Die bestehende Landingpage-Engine bleibt unangetastet. Geändert
wird nur die *Quelle* der Konfiguration: Statt `registry.ts` liest die Route
`/stellen/[kampagne]` aus der Tabelle `landingpages`, in der die vollständige
`LandingpageConfig` als `jsonb` liegt. Findet sie dort nichts, greift die
Registry als Rückfall — so bleiben die beiden Bestandskampagnen erreichbar,
bis die Datenbankfassung nachweislich dasselbe liefert. Die Anmeldung läuft
über Supabase Auth im CRM-Projekt (`lkmrsvvgisdthvlqjhdk`), in dem auch die
Bewerbungen liegen.

**Technik:** Next.js 16.2.9 (App Router), React 19.2.4, TypeScript,
`@supabase/ssr` 0.12, Supabase (Postgres + Auth + RLS), Vitest 2.

---

## Umfang dieses Plans

Die Spezifikation `docs/superpowers/specs/2026-09-29-interner-bereich-design.md`
beschreibt fünf Umsetzungsschritte. **Dieser Plan deckt Schritt 1 und 2 ab.**

| Spec-Schritt | In diesem Plan |
|---|---|
| 1. Anmeldung und Gerüst | ja — Aufgaben 1–5 |
| 2. Landingpages aus der Datenbank | ja — Aufgaben 6–12 |
| 3. Anlegen und Veröffentlichen | nein — eigener Plan |
| 4. Bewerbungen | nein — eigener Plan |
| 5. Verteilen | nein — eigener Plan |

Warum der Schnitt hier liegt: Schritt 2 stellt die öffentlichen Seiten von
Code auf Datenbank um, **ohne dass sich an ihnen etwas ändern darf**. Das ist
der riskanteste Teil des ganzen Vorhabens und verdient eigene Aufmerksamkeit
samt Gleichheitsnachweis. Schritt 3 baut darauf auf und ist ohne dieses
Fundament nicht sinnvoll umsetzbar.

**Nach diesem Plan:** Du meldest dich vom Handy an, siehst deine Landingpages
und die öffentlichen Seiten kommen aus der Datenbank. Anlegen geht noch nicht.

### Zwei Klarstellungen gegenüber der Spezifikation

1. **Der Pfad heißt `/intern`, nicht `/app`.** Die Spec verwendet beide
   Bezeichnungen (Überschrift „Die App — `/app`", Abschnitt Anmeldung: „Alle
   Routen unter `/intern` sind geschützt"). `/intern` gewinnt: `src/app/app/`
   wäre ein verwirrender Pfad, und der Dateiname der Spec heißt selbst
   „interner-bereich".

2. **Die Navigationsleiste hat in diesem Plan zwei Einträge**, nicht vier.
   „Bewerbungen" und „Arbeitgeber" entstehen in den Plänen zu Schritt 3 und 4.
   Eine Leiste mit zwei toten Knöpfen wäre eine Lüge über den Stand.

---

## Dateistruktur

### Neu

| Datei | Verantwortung |
|---|---|
| `frontend/src/intern/supabase-browser.ts` | Supabase-Client im Browser — Anmeldung, Abmeldung |
| `frontend/src/intern/supabase-server.ts` | Supabase-Client auf dem Server — Session lesen |
| `frontend/src/proxy.ts` | Zugriffsschutz: leitet Unangemeldete von `/intern` zur Anmeldung |
| `frontend/src/app/intern/anmelden/page.tsx` | Anmeldeseite (Server) |
| `frontend/src/app/intern/anmelden/AnmeldeFormular.tsx` | Eingabe und Anmeldung (Client) |
| `frontend/src/app/intern/abmelden/route.ts` | Abmelden per POST |
| `frontend/src/app/intern/(geschuetzt)/layout.tsx` | Gerüst: prüft Anmeldung, trägt Navigationsleiste |
| `frontend/src/app/intern/(geschuetzt)/Navigationsleiste.tsx` | untere Leiste (Client — kennt den aktiven Pfad) |
| `frontend/src/app/intern/(geschuetzt)/page.tsx` | Startansicht |
| `frontend/src/app/intern/(geschuetzt)/landingpages/page.tsx` | Übersicht der Landingpages |
| `frontend/src/app/intern/manifest.webmanifest/route.ts` | Web-App-Manifest |
| `frontend/src/app/intern/symbol/[groesse]/route.tsx` | App-Symbol in 192 und 512 Pixeln |
| `frontend/src/app/intern/intern.css` | Oberfläche des internen Bereichs |
| `frontend/src/landingpages/pruefung.ts` | Prüfregeln für eine Konfiguration — von Test und Formular genutzt |
| `frontend/src/landingpages/server/landingpage-zeile.ts` | Umwandlung Konfiguration ↔ Datenbankzeile |
| `frontend/src/landingpages/server/landingpage-quelle.ts` | Lesen aus der Datenbank |
| `frontend/src/app/api/intern/kampagnen-uebernehmen/route.ts` | überträgt die Registry-Kampagnen in die Datenbank |
| `frontend/supabase/migrations/002_landingpages.sql` | Tabellen `arbeitgeber` und `landingpages` |
| `frontend/src/landingpages/__tests__/pruefung.test.ts` | Tests der Prüfregeln |
| `frontend/src/landingpages/__tests__/landingpage-zeile.test.ts` | Rundlauf-Test der Umwandlung |
| `frontend/src/app/intern/__tests__/zugriffsschutz.test.ts` | Test des Zugriffsschutzes |

### Geändert

| Datei | Änderung |
|---|---|
| `frontend/src/app/stellen/[kampagne]/page.tsx` | liest aus der Datenbank, Registry als Rückfall |
| `frontend/src/landingpages/__tests__/kampagnen.test.ts` | nutzt das gemeinsame Prüfmodul |
| `frontend/.env.example` | zwei neue Variablen |
| `frontend/src/app/globals.css` | Import der `intern.css` |

### Bewusst nicht angefasst

`funnel-logik.ts`, `einwilligung.ts`, `komponenten/`, `server/lead-speicher.ts`,
`api/recruiting-lead/route.ts`, die Kampagnendateien. Sie laufen seit dem
23.09.2026 in Produktion und sind durch 116 Tests abgedeckt.

---

## Vorbedingungen

Am 29.09.2026 im Projekt `lkmrsvvgisdthvlqjhdk` („Occtaai") nachgesehen:

**Konten müssen nicht angelegt werden.** Es gibt sie schon —
`matin.askaryar@phe-perm.de` (seit 18.10.2025) und
`alexandros.selemidis@phe-perm.de` (seit 10.12.2025), beide bestätigt, beide
zuletzt am 07.07.2026 angemeldet.

Es gibt ein **drittes** Konto: `ti@phe-perm.de`, angelegt am 15.10.2025, noch
nie angemeldet. Es gehört zum CRM, nicht zu dieser App, und bekommt keinen
Zugang — siehe Aufgabe 7, wo die Policies das durchsetzen. Das Konto selbst
wird nicht angetastet; es hängt möglicherweise am CRM.

Vor Aufgabe 1 zu erledigen:

- [ ] **Selbstregistrierung abschalten.** Im Dashboard unter *Authentication →
      Sign In / Providers → Email* die Option „Allow new users to sign up"
      **ausschalten**. Sonst kann sich jeder, der die Adresse
      `/intern/anmelden` kennt, selbst ein Konto anlegen.

- [ ] **Anon-Key notieren.** *Project Settings → API → Project API keys →
      `anon` `public`*. Dieser Schlüssel darf im Browser landen; der
      `service_role`-Schlüssel niemals.

## Aufgabe 1: Supabase-Clients für den internen Bereich

Der interne Bereich meldet sich am **CRM-Projekt** an — dort liegen die
Bewerbungen. Die vorhandenen Variablen `NEXT_PUBLIC_SUPABASE_URL` und
`NEXT_PUBLIC_SUPABASE_ANON_KEY` zeigen auf die ATS-Datenbank des FastAPI-
Backends und werden **nicht** wiederverwendet. Eigene Namen verhindern, dass
später jemand die beiden Projekte verwechselt.

**Dateien:**
- Anlegen: `frontend/src/intern/supabase-browser.ts`
- Anlegen: `frontend/src/intern/supabase-server.ts`
- Ändern: `frontend/.env.example`

- [ ] **Schritt 1: Die beiden Variablen in `.env.example` eintragen**

Ans Ende von `frontend/.env.example` anfügen:

```bash
# ── Interner Bereich (/intern) ────────────────────────────────────────────
# Anmeldung läuft über das CRM-Supabase-Projekt, in dem auch die Bewerbungen
# liegen (dasselbe Projekt wie RECRUITING_SUPABASE_URL weiter oben).
#
# Achtung: NICHT NEXT_PUBLIC_SUPABASE_URL wiederverwenden — die zeigt auf die
# ATS-Datenbank des FastAPI-Backends. Zwei verschiedene Projekte.
#
# Der anon-Schlüssel darf im Browser landen. Der service_role-Schlüssel nie.
NEXT_PUBLIC_RECRUITING_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY=eyJhbGciOi...
```

- [ ] **Schritt 2: Werte lokal eintragen**

In `frontend/.env.local` dieselben zwei Zeilen mit den echten Werten
eintragen. URL und Anon-Key stehen im Supabase-Dashboard unter
*Project Settings → API*.

- [ ] **Schritt 3: Browser-Client anlegen**

`frontend/src/intern/supabase-browser.ts`:

```ts
"use client";

// Supabase-Client für den internen Bereich, Browser-Seite.
//
// Bewusst getrennt von `hooks/useAuth.ts`: Der Hook spricht mit der
// ATS-Datenbank des FastAPI-Backends, dieser Client mit dem CRM-Projekt, in
// dem Bewerbungen und Landingpages liegen. Zwei verschiedene Supabase-
// Projekte — ein gemeinsamer Client würde früher oder später am falschen
// Ende landen.

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function internSupabaseBrowser() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_RECRUITING_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_RECRUITING_SUPABASE_URL oder " +
        "NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY fehlt. " +
        "Siehe .env.example, Abschnitt „Interner Bereich“.",
    );
  }

  client = createBrowserClient(url, key);
  return client;
}
```

- [ ] **Schritt 4: Server-Client anlegen**

`frontend/src/intern/supabase-server.ts`:

```ts
import "server-only";

// Supabase-Client für den internen Bereich, Server-Seite.
//
// Liest und schreibt die Session-Cookies über `next/headers`. In Next.js 16
// ist `cookies()` asynchron — deshalb ist auch diese Funktion asynchron.
//
// `setAll` kann in Server-Komponenten fehlschlagen (dort sind Cookies nur
// lesbar). Das ist kein Fehler: Der Proxy erneuert die Session bereits bei
// jedem Aufruf, hier genügt stilles Übergehen.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function internSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_RECRUITING_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_RECRUITING_SUPABASE_URL oder " +
        "NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY fehlt.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(zuSetzen) {
        try {
          for (const { name, value, options } of zuSetzen) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server-Komponente: Cookies sind hier nur lesbar. Der Proxy hat
          // die Session bereits erneuert.
        }
      },
    },
  });
}

/**
 * Der angemeldete Mensch — oder `null`.
 *
 * Bewusst `getUser()` und nicht `getSession()`: `getSession()` liest das
 * Cookie, ohne es prüfen zu lassen. Ein gefälschtes Cookie käme damit durch.
 * `getUser()` fragt bei Supabase nach und ist deshalb die einzige Auskunft,
 * auf die sich ein Zugriffsschutz stützen darf.
 */
export async function angemeldeterNutzer() {
  const supabase = await internSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
```

- [ ] **Schritt 5: Übersetzen lassen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx tsc --noEmit 2>&1 | grep -c "error TS"
```

Erwartet: dieselbe Zahl wie vorher. Der Bestand meldet Fehler in 11 alten
Testdateien — die Zahl vorher merken und vergleichen, **nicht** aufräumen.
Erscheint ein Fehler mit `src/intern/` im Pfad, gehört er zu dieser Aufgabe.

- [ ] **Schritt 6: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/intern/supabase-browser.ts frontend/src/intern/supabase-server.ts frontend/.env.example && git commit -m "Supabase-Clients für den internen Bereich

Eigene Umgebungsvariablen statt der vorhandenen NEXT_PUBLIC_SUPABASE_*:
Die zeigen auf die ATS-Datenbank, der interne Bereich braucht das
CRM-Projekt mit Bewerbungen und Landingpages."
```

---

## Aufgabe 2: Zugriffsschutz

In Next.js 16 heißt die Datei **`proxy.ts`**, nicht mehr `middleware.ts`
(nachgeschlagen in `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`).
Sie liegt neben `app/`, also unter `src/`.

Der Proxy erledigt zwei Dinge: Er erneuert die Session bei jedem Aufruf
(sonst läuft sie nach einer Stunde ab, während man tippt) und leitet
Unangemeldete zur Anmeldung.

**Wichtig:** Der Proxy ist die *erste*, nicht die *einzige* Prüfung. Das
geschützte Layout prüft in Aufgabe 4 erneut. Grund: Der Proxy läuft vor dem
Rendern und sieht nur Cookies — wer einen anderen Weg zur Seite findet,
käme sonst an den Daten vorbei.

**Dateien:**
- Anlegen: `frontend/src/proxy.ts`
- Test: `frontend/src/app/intern/__tests__/zugriffsschutz.test.ts`

- [ ] **Schritt 1: Den fehlschlagenden Test schreiben**

`frontend/src/app/intern/__tests__/zugriffsschutz.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { istGeschuetzt, anmeldeZiel } from "../../../proxy";

describe("Welche Pfade der Proxy schützt", () => {
  it("schützt den internen Bereich", () => {
    expect(istGeschuetzt("/intern")).toBe(true);
    expect(istGeschuetzt("/intern/landingpages")).toBe(true);
    expect(istGeschuetzt("/api/intern/kampagnen-uebernehmen")).toBe(true);
  });

  it("lässt die Anmeldung selbst frei", () => {
    // Sonst leitet die Anmeldeseite auf sich selbst um — endlos.
    expect(istGeschuetzt("/intern/anmelden")).toBe(false);
  });

  it("lässt Manifest und Symbol frei", () => {
    // Beide holt das Betriebssystem beim Ablegen auf dem Startbildschirm —
    // teils ohne Cookies.
    expect(istGeschuetzt("/intern/manifest.webmanifest")).toBe(false);
    expect(istGeschuetzt("/intern/symbol/192")).toBe(false);
  });

  it("fasst die öffentliche Website nicht an", () => {
    expect(istGeschuetzt("/")).toBe(false);
    expect(istGeschuetzt("/jobs")).toBe(false);
    expect(istGeschuetzt("/stellen/kaeltetechniker-koeln")).toBe(false);
    expect(istGeschuetzt("/api/recruiting-lead")).toBe(false);
  });

  it("lässt sich nicht durch einen ähnlichen Pfad täuschen", () => {
    // "/internes" fängt mit "/intern" an, ist aber etwas anderes.
    expect(istGeschuetzt("/internes")).toBe(false);
    expect(istGeschuetzt("/interna/geheim")).toBe(false);
  });

  it("merkt sich das Ziel für die Weiterleitung nach der Anmeldung", () => {
    expect(anmeldeZiel("/intern/landingpages")).toBe(
      "/intern/anmelden?weiter=%2Fintern%2Flandingpages",
    );
  });

  it("nimmt nur Ziele im internen Bereich entgegen", () => {
    // Sonst ließe sich über ?weiter= auf eine fremde Seite umleiten.
    expect(anmeldeZiel("https://beispiel.de/phishing")).toBe("/intern/anmelden");
    expect(anmeldeZiel("//beispiel.de")).toBe("/intern/anmelden");
    expect(anmeldeZiel("/jobs")).toBe("/intern/anmelden");
  });
});
```

- [ ] **Schritt 2: Test laufen lassen — er muss fehlschlagen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run src/app/intern/__tests__/zugriffsschutz.test.ts
```

Erwartet: FAIL mit „Failed to resolve import "../../../proxy"".

- [ ] **Schritt 3: Den Proxy schreiben**

`frontend/src/proxy.ts`:

```ts
// Zugriffsschutz für den internen Bereich.
//
// In Next.js 16 heißt diese Datei `proxy.ts` — `middleware.ts` gibt es nicht
// mehr. Sie liegt auf derselben Ebene wie `app/`.
//
// Zwei Aufgaben:
//   1. Session erneuern. Supabase-Token halten eine Stunde. Ohne Erneuerung
//      fliegt man mitten im Tippen heraus.
//   2. Unangemeldete zur Anmeldung leiten.
//
// Das ist die erste Prüfung, nicht die einzige: Das geschützte Layout fragt
// erneut nach. Der Proxy sieht nur Cookies, und ein Cookie ist kein Beweis.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ANMELDEN = "/intern/anmelden";

/** Pfade unter /intern, die ohne Anmeldung erreichbar bleiben müssen. */
const FREI = [
  ANMELDEN,
  "/intern/manifest.webmanifest",
  "/intern/symbol",
];

function beginntMitSegment(pfad: string, praefix: string): boolean {
  // "/intern" trifft auf "/intern" und "/intern/…", aber nicht auf "/internes".
  return pfad === praefix || pfad.startsWith(praefix + "/");
}

export function istGeschuetzt(pfad: string): boolean {
  if (FREI.some((frei) => beginntMitSegment(pfad, frei))) return false;
  return beginntMitSegment(pfad, "/intern") || beginntMitSegment(pfad, "/api/intern");
}

/**
 * Adresse der Anmeldeseite, mit dem ursprünglichen Ziel im Gepäck.
 *
 * Nur Ziele innerhalb von /intern werden übernommen. Ohne diese Prüfung
 * ließe sich über `?weiter=` auf eine fremde Seite umleiten — ein
 * Einfallstor für Phishing-Links, die echt aussehen, weil sie auf der
 * eigenen Domain beginnen.
 */
export function anmeldeZiel(ziel: string): string {
  const erlaubt = ziel.startsWith("/intern/") && !ziel.startsWith("//");
  if (!erlaubt) return ANMELDEN;
  return `${ANMELDEN}?weiter=${encodeURIComponent(ziel)}`;
}

export async function proxy(request: NextRequest) {
  let antwort = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_RECRUITING_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY;
  if (!url || !key) return antwort;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(zuSetzen) {
        for (const { name, value } of zuSetzen) {
          request.cookies.set(name, value);
        }
        antwort = NextResponse.next({ request });
        for (const { name, value, options } of zuSetzen) {
          antwort.cookies.set(name, value, options);
        }
      },
    },
  });

  // Erneuert nebenbei die Session. Muss vor jeder Entscheidung stehen.
  const { data } = await supabase.auth.getUser();

  const pfad = request.nextUrl.pathname;

  if (!data.user && istGeschuetzt(pfad)) {
    const ziel = request.nextUrl.clone();
    const mitParameter = new URL(anmeldeZiel(pfad), request.url);
    ziel.pathname = mitParameter.pathname;
    ziel.search = mitParameter.search;
    return NextResponse.redirect(ziel);
  }

  // Wer angemeldet ist, hat auf der Anmeldeseite nichts zu suchen.
  if (data.user && beginntMitSegment(pfad, ANMELDEN)) {
    const ziel = request.nextUrl.clone();
    ziel.pathname = "/intern";
    ziel.search = "";
    return NextResponse.redirect(ziel);
  }

  return antwort;
}

export const config = {
  // Nur dort laufen, wo es nötig ist. Jeder Aufruf kostet eine Rückfrage bei
  // Supabase — die öffentliche Website soll das nicht bezahlen.
  matcher: ["/intern/:path*", "/api/intern/:path*"],
};
```

- [ ] **Schritt 4: Test laufen lassen — er muss bestehen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run src/app/intern/__tests__/zugriffsschutz.test.ts
```

Erwartet: PASS, 7 Tests.

- [ ] **Schritt 5: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/proxy.ts frontend/src/app/intern/__tests__/zugriffsschutz.test.ts && git commit -m "Zugriffsschutz für /intern

In Next.js 16 heißt die Datei proxy.ts, nicht middleware.ts.
Das Weiterleitungsziel wird geprüft — sonst ließe sich über ?weiter=
auf eine fremde Seite umleiten."
```

---

## Aufgabe 3: Anmeldeseite

**Dateien:**
- Anlegen: `frontend/src/app/intern/intern.css`
- Anlegen: `frontend/src/app/intern/anmelden/page.tsx`
- Anlegen: `frontend/src/app/intern/anmelden/AnmeldeFormular.tsx`
- Anlegen: `frontend/src/app/intern/abmelden/route.ts`
- Ändern: `frontend/src/app/globals.css`

- [ ] **Schritt 1: Gestaltung des internen Bereichs anlegen**

`frontend/src/app/intern/intern.css`:

```css
/* Oberfläche des internen Bereichs.
 *
 * Für den Daumen gebaut: Alles, was sich antippen lässt, ist mindestens
 * 44 px hoch. Eingabefelder tragen 16 px Schrift — darunter zoomt iOS beim
 * Antippen automatisch hinein, und die Seite steht schief.
 *
 * `env(safe-area-inset-bottom)` hält die untere Leiste über dem Balken des
 * iPhones. Ohne das liegt der erste Knopf unter dem Home-Indikator. */

.in-seite {
  min-height: 100dvh;
  background: var(--fog);
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
}

.in-kopf {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.in-kopf h1 {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.in-innen {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}

.in-karte {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
}

.in-feld {
  display: block;
  margin-bottom: 14px;
}

.in-feld span {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}

.in-feld input {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  /* 16px ist die Grenze, unter der iOS beim Antippen hineinzoomt. */
  font-size: 16px;
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.in-feld input:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 2px;
}

.in-knopf {
  width: 100%;
  min-height: 48px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: var(--blue);
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.in-knopf:hover { background: var(--blue-dark); }
.in-knopf:focus-visible { outline: 3px solid #f59e0b; outline-offset: 3px; }
.in-knopf[disabled] { opacity: 0.55; cursor: default; }

.in-knopf--still {
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--border);
  width: auto;
  min-height: 44px;
  padding: 10px 16px;
  font-size: 14px;
}

.in-fehler {
  padding: 12px 14px;
  margin-bottom: 14px;
  font-size: 14px;
  color: #8a1c1c;
  background: #fdf0f0;
  border: 1px solid #f3c9c9;
  border-radius: 10px;
}

.in-leer {
  padding: 32px 16px;
  text-align: center;
  font-size: 15px;
  color: var(--gray);
}

/* Untere Leiste ------------------------------------------------------- */

.in-leiste {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  background: #fff;
  border-top: 1px solid var(--border);
  padding-bottom: env(safe-area-inset-bottom);
}

.in-leiste a {
  flex: 1;
  min-height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--gray);
  text-decoration: none;
}

.in-leiste a[aria-current="page"] { color: var(--blue); }
.in-leiste a:focus-visible { outline: 3px solid #f59e0b; outline-offset: -3px; }
.in-leiste svg { width: 22px; height: 22px; }

/* Liste der Landingpages ---------------------------------------------- */

.in-zeile {
  display: block;
  padding: 14px 16px;
  min-height: 44px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 10px;
  text-decoration: none;
  color: inherit;
}

.in-zeile b {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.in-zeile span {
  font-size: 13px;
  color: var(--gray);
}

.in-marke {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.in-marke--live { color: #14532d; background: #dcfce7; }
.in-marke--entwurf { color: #713f12; background: #fef3c7; }

@media (min-width: 768px) {
  .in-leiste { position: static; border-top: none; border-bottom: 1px solid var(--border); }
  .in-seite { padding-bottom: 0; }
}
```

- [ ] **Schritt 2: Die Gestaltung einbinden**

Am Anfang von `frontend/src/app/globals.css`, direkt nach den vorhandenen
`@import`-Zeilen (falls keine da sind: als allererste Zeile):

```css
@import "./intern/intern.css";
```

CSS verlangt, dass `@import` vor allen Regeln steht — sonst wird die Zeile
stillschweigend übergangen.

- [ ] **Schritt 3: Das Anmeldeformular schreiben**

`frontend/src/app/intern/anmelden/AnmeldeFormular.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { internSupabaseBrowser } from "../../../intern/supabase-browser";

export default function AnmeldeFormular({ weiter }: { weiter: string }) {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);
  const [laeuft, setLaeuft] = useState(false);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler(null);
    setLaeuft(true);

    const supabase = internSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email: mail.trim(),
      password: passwort,
    });

    if (error) {
      // Bewusst dieselbe Meldung für „Konto gibt es nicht“ und „Passwort
      // falsch“: Alles andere verrät, welche Adressen ein Konto haben.
      setFehler("E-Mail-Adresse oder Passwort stimmen nicht.");
      setLaeuft(false);
      return;
    }

    // `refresh()` vor `push()`: Der Server muss die neue Session sehen,
    // sonst schickt der Proxy sofort wieder zur Anmeldung zurück.
    router.refresh();
    router.push(weiter);
  }

  return (
    <form onSubmit={absenden} noValidate>
      {fehler && (
        <p className="in-fehler" role="alert">
          {fehler}
        </p>
      )}

      <label className="in-feld">
        <span>E-Mail-Adresse</span>
        <input
          type="email"
          name="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />
      </label>

      <label className="in-feld">
        <span>Passwort</span>
        <input
          type="password"
          name="password"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      <button type="submit" className="in-knopf" disabled={laeuft}>
        {laeuft ? "Einen Moment …" : "Anmelden"}
      </button>
    </form>
  );
}
```

- [ ] **Schritt 4: Die Anmeldeseite schreiben**

`frontend/src/app/intern/anmelden/page.tsx`:

```tsx
import type { Metadata } from "next";
import AnmeldeFormular from "./AnmeldeFormular";

export const metadata: Metadata = {
  title: { absolute: "Anmelden" },
  // Der interne Bereich hat in keiner Suchmaschine etwas verloren.
  robots: { index: false, follow: false },
};

export default async function AnmeldeSeite({
  searchParams,
}: {
  // In Next.js 16 sind `searchParams` ein Promise.
  searchParams: Promise<{ weiter?: string }>;
}) {
  const { weiter } = await searchParams;

  // Nur eigene Pfade als Ziel zulassen — derselbe Grund wie im Proxy.
  const ziel =
    weiter && weiter.startsWith("/intern/") && !weiter.startsWith("//")
      ? weiter
      : "/intern";

  return (
    <div className="in-seite">
      <div className="in-innen" style={{ paddingTop: 48, maxWidth: 420 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          PHE Recruiting
        </h1>
        <p style={{ fontSize: 15, color: "var(--gray)", marginBottom: 24 }}>
          Anmeldung für Mitarbeitende.
        </p>

        <div className="in-karte">
          <AnmeldeFormular weiter={ziel} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Schritt 5: Das Abmelden schreiben**

`frontend/src/app/intern/abmelden/route.ts`:

```ts
import { NextResponse } from "next/server";
import { internSupabaseServer } from "../../../intern/supabase-server";

// Abmelden ausschließlich per POST.
//
// Als GET wäre es über einen untergeschobenen Link oder ein vorausgeladenes
// Bild auslösbar — dann meldet einen jemand anders ab. Kein Drama, aber
// ärgerlich, und mit POST kostenlos zu vermeiden.

export async function POST(request: Request) {
  const supabase = await internSupabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/intern/anmelden", request.url), {
    status: 303,
  });
}
```

- [ ] **Schritt 6: Von Hand prüfen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run dev
```

Im Browser `http://localhost:3000/intern` aufrufen. Erwartet:

1. Weiterleitung nach `/intern/anmelden?weiter=%2Fintern` — wobei `/intern`
   selbst nicht als Ziel übernommen wird, die Adresse lautet also
   `/intern/anmelden`.
2. Falsches Passwort → „E-Mail-Adresse oder Passwort stimmen nicht."
3. Richtiges Passwort → Weiterleitung auf `/intern`. Dort steht noch ein
   404, das Gerüst entsteht in Aufgabe 4.
4. Erneuter Aufruf von `/intern/anmelden` im angemeldeten Zustand → zurück
   auf `/intern`.

- [ ] **Schritt 7: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/app/intern/ frontend/src/app/globals.css && git commit -m "Anmeldeseite für den internen Bereich

Gleiche Fehlermeldung für unbekanntes Konto und falsches Passwort —
sonst verrät die Seite, welche Adressen ein Konto haben.
Abmelden nur per POST."
```

---

## Aufgabe 4: Gerüst mit unterer Navigationsleiste

Die geschützten Ansichten liegen in der Route-Gruppe `(geschuetzt)`. Klammern
machen einen Ordner zur reinen Gliederung: Er erscheint **nicht** in der URL.
`(geschuetzt)/page.tsx` ist also `/intern`, nicht `/intern/geschuetzt`.

Der Zweck: Das Layout der Gruppe prüft die Anmeldung. `anmelden/` liegt
daneben und bleibt davon unberührt — sonst leitete die Anmeldeseite auf sich
selbst um.

**Dateien:**
- Anlegen: `frontend/src/app/intern/(geschuetzt)/layout.tsx`
- Anlegen: `frontend/src/app/intern/(geschuetzt)/Navigationsleiste.tsx`
- Anlegen: `frontend/src/app/intern/(geschuetzt)/page.tsx`

- [ ] **Schritt 1: Die Navigationsleiste schreiben**

`frontend/src/app/intern/(geschuetzt)/Navigationsleiste.tsx`:

```tsx
"use client";

// Untere Leiste. Client-Komponente, weil sie den aktuellen Pfad kennen muss,
// um den aktiven Eintrag zu markieren.
//
// Zwei Einträge, nicht vier: „Bewerbungen“ und „Arbeitgeber“ entstehen in den
// Plänen zu Schritt 3 und 4 der Spezifikation. Ein Knopf, der nirgendwohin
// führt, ist schlechter als kein Knopf.

import Link from "next/link";
import { usePathname } from "next/navigation";

const EINTRAEGE = [
  {
    pfad: "/intern",
    text: "Start",
    // Haus
    pfadDaten: "M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5",
  },
  {
    pfad: "/intern/landingpages",
    text: "Landingpages",
    // Dokument mit Zeilen
    pfadDaten: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  },
] as const;

export default function Navigationsleiste() {
  const pfad = usePathname();

  return (
    <nav className="in-leiste" aria-label="Bereiche">
      {EINTRAEGE.map((e) => {
        // "/intern" ist nur aktiv, wenn es genau der Pfad ist — sonst wäre es
        // auf jeder Unterseite mitmarkiert.
        const aktiv = e.pfad === "/intern" ? pfad === "/intern" : pfad.startsWith(e.pfad);

        return (
          <Link key={e.pfad} href={e.pfad} aria-current={aktiv ? "page" : undefined}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={e.pfadDaten} />
            </svg>
            {e.text}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Schritt 2: Das geschützte Layout schreiben**

`frontend/src/app/intern/(geschuetzt)/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { angemeldeterNutzer } from "../../../intern/supabase-server";
import Navigationsleiste from "./Navigationsleiste";

export const metadata: Metadata = {
  title: { absolute: "PHE Recruiting" },
  robots: { index: false, follow: false },
  // Das Manifest hängt bewusst hier und nicht im Wurzel-Layout: Sonst bekäme
  // jeder Besucher der öffentlichen Website ein „Zur Startseite hinzufügen“
  // angeboten, das in den internen Bereich führt.
  manifest: "/intern/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "PHE Recruiting",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // `viewport-fit=cover` ist die Voraussetzung dafür, dass
  // `env(safe-area-inset-bottom)` überhaupt einen Wert liefert. Ohne das
  // klebt die untere Leiste unter dem Home-Indikator des iPhones.
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default async function GeschuetztesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Zweite Prüfung, nach der im Proxy. Der Proxy entscheidet anhand von
  // Cookies, bevor gerendert wird; hier wird gefragt, bevor Daten geladen
  // werden. Beides ist nötig: Läuft der Proxy einmal nicht, hängt sonst der
  // ganze Schutz an einer Datei.
  const nutzer = await angemeldeterNutzer();
  if (!nutzer) redirect("/intern/anmelden");

  return (
    <div className="in-seite">
      <header className="in-kopf">
        <h1>PHE Recruiting</h1>
        <form action="/intern/abmelden" method="post">
          <button type="submit" className="in-knopf in-knopf--still">
            Abmelden
          </button>
        </form>
      </header>

      {children}

      <Navigationsleiste />
    </div>
  );
}
```

- [ ] **Schritt 3: Die Startansicht schreiben**

`frontend/src/app/intern/(geschuetzt)/page.tsx`:

```tsx
import Link from "next/link";
import { angemeldeterNutzer } from "../../../intern/supabase-server";

// Startansicht. In diesem Plan bewusst schlicht: Die Zahlen zu neuen
// Bewerbungen und fehlgeschlagenen Benachrichtigungen kommen mit Schritt 4
// der Spezifikation, wenn es eine Bewerbungsansicht gibt, auf die sie
// verweisen können.

export default async function InternStart() {
  const nutzer = await angemeldeterNutzer();

  return (
    <main className="in-innen">
      <div className="in-karte">
        <p style={{ fontSize: 15, color: "var(--gray)", margin: 0 }}>
          Angemeldet als <strong style={{ color: "var(--ink)" }}>{nutzer?.email}</strong>
        </p>
      </div>

      <Link href="/intern/landingpages" className="in-zeile">
        <b>Landingpages</b>
        <span>Welche Seiten sind online, welche sind Entwurf</span>
      </Link>
    </main>
  );
}
```

- [ ] **Schritt 4: Von Hand prüfen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run dev
```

`http://localhost:3000/intern` aufrufen und anmelden. Erwartet:

1. Kopfzeile „PHE Recruiting" mit Knopf „Abmelden"
2. Die eigene E-Mail-Adresse in der ersten Karte
3. Untere Leiste mit „Start" (blau, weil aktiv) und „Landingpages" (grau)
4. „Landingpages" führt auf ein 404 — die Ansicht entsteht in Aufgabe 12
5. „Abmelden" führt zurück zur Anmeldeseite

Im Fenster des Browsers auf Handybreite (390 px) prüfen: Alle Knöpfe sind
mindestens 44 px hoch, nichts überlappt, kein waagerechtes Rollen.

- [ ] **Schritt 5: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add "frontend/src/app/intern/(geschuetzt)" && git commit -m "Gerüst des internen Bereichs

Route-Gruppe (geschuetzt) trennt die geprüften Ansichten von der
Anmeldeseite — sonst leitete die Anmeldung auf sich selbst um.
Zwei Einträge in der Leiste, nicht vier: die übrigen Ansichten
gibt es noch nicht."
```

---

## Aufgabe 5: Web-App-Manifest und Symbol

Damit sich die App auf den Startbildschirm legen lässt, braucht es ein
Manifest und Symbole in 192 und 512 Pixeln.

Die Symbole entstehen **im Code** über `ImageResponse` aus `next/og`, nicht
als Bilddateien im Repository. Zwei Gründe: `ImageResponse` liefert PNG —
genau das Format, das ein Manifest verlangt — und es gibt keine Bilddatei, die
beim nächsten Logowechsel vergessen wird. Dass das Verfahren hier trägt, ist
belegt: `src/app/stellen/[kampagne]/opengraph-image.tsx` arbeitet seit dem
23.09.2026 damit in Produktion.

**Dateien:**
- Anlegen: `frontend/src/app/intern/manifest.webmanifest/route.ts`
- Anlegen: `frontend/src/app/intern/symbol/[groesse]/route.tsx`

- [ ] **Schritt 1: Das Manifest schreiben**

`frontend/src/app/intern/manifest.webmanifest/route.ts`:

```ts
import { NextResponse } from "next/server";

// Web-App-Manifest des internen Bereichs.
//
// Bewusst eine eigene Route unter /intern und nicht `app/manifest.ts`: Ein
// Manifest im Wurzelverzeichnis gilt für die ganze Domain, und dann bietet
// der Browser jedem Besucher der öffentlichen Website an, sich eine App
// anzulegen, die in den internen Bereich führt.

export function GET() {
  return NextResponse.json(
    {
      name: "PHE Recruiting",
      short_name: "PHE",
      description: "Landingpages anlegen, veröffentlichen und verteilen.",
      // Startet direkt im internen Bereich, nicht auf der Website.
      start_url: "/intern",
      scope: "/intern",
      // "standalone" nimmt die Adresszeile weg — die App sieht damit aus wie
      // eine App und nicht wie eine Webseite mit Lesezeichen.
      display: "standalone",
      orientation: "portrait",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      lang: "de",
      dir: "ltr",
      icons: [
        {
          src: "/intern/symbol/192",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/intern/symbol/512",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          // "maskable" erlaubt Android, das Symbol in seine eigene Form zu
          // schneiden. Ohne eine solche Angabe legt das System einen weißen
          // Kasten darunter.
          src: "/intern/symbol/512",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    {
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
```

- [ ] **Schritt 2: Das Symbol schreiben**

`frontend/src/app/intern/symbol/[groesse]/route.tsx`:

```tsx
import { ImageResponse } from "next/og";

// App-Symbol für den Startbildschirm, in der angeforderten Kantenlänge.
//
// `ImageResponse` liefert PNG — das Format, das ein Manifest braucht. Eine
// Bilddatei im Repository wäre die Alternative, würde aber beim nächsten
// Logowechsel vergessen.
//
// Die erlaubten Größen stehen fest. Beliebige Zahlen anzunehmen hieße, dass
// ein Fremder mit /intern/symbol/8000 eine teure Bildberechnung auslösen
// kann — die Route ist absichtlich ohne Anmeldung erreichbar, weil das
// Betriebssystem sie beim Ablegen auf dem Startbildschirm holt.
const ERLAUBT = new Set([192, 512]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ groesse: string }> },
) {
  // In Next.js 16 sind `params` ein Promise.
  const { groesse } = await params;
  const kante = Number(groesse);

  if (!ERLAUBT.has(kante)) {
    return new Response("Nur 192 und 512", { status: 404 });
  }

  // Maskable-Symbole werden auf Android beschnitten: Bis zu 20 Prozent am
  // Rand können wegfallen. Die Schrift bleibt deshalb in der Mitte und
  // nimmt nur die Hälfte der Fläche ein.
  const schrift = Math.round(kante * 0.34);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0071e3",
          color: "#ffffff",
          fontSize: schrift,
          fontWeight: 700,
          letterSpacing: schrift * 0.02,
        }}
      >
        PHE
      </div>
    ),
    {
      width: kante,
      height: kante,
      headers: {
        "cache-control": "public, max-age=86400",
      },
    },
  );
}
```

- [ ] **Schritt 3: Beide Routen prüfen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run dev
```

In einem zweiten Terminal:

```bash
echo "── Manifest ──"
curl -s http://localhost:3000/intern/manifest.webmanifest | head -20
echo "── Symbol 192 ──"
curl -s -o /tmp/s192.png -w "HTTP %{http_code}  %{content_type}  %{size_download} Bytes\n" http://localhost:3000/intern/symbol/192
file /tmp/s192.png
echo "── Symbol 512 ──"
curl -s -o /tmp/s512.png -w "HTTP %{http_code}  %{content_type}  %{size_download} Bytes\n" http://localhost:3000/intern/symbol/512
file /tmp/s512.png
echo "── Unerlaubte Größe ──"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/intern/symbol/8000
```

Erwartet:
- Manifest: JSON mit `"name": "PHE Recruiting"` und `"start_url": "/intern"`
- Symbol 192: `HTTP 200  image/png`, `file` meldet `PNG image data, 192 x 192`
- Symbol 512: `HTTP 200  image/png`, `file` meldet `PNG image data, 512 x 512`
- Größe 8000: `HTTP 404`

- [ ] **Schritt 4: Auf dem Handy prüfen**

Dieser Schritt ist der eigentliche Zweck der Aufgabe und lässt sich nicht
durch einen Test ersetzen.

Nach dem nächsten Deployment auf dem iPhone `https://www.phe-perm.de/intern`
in **Safari** öffnen (nicht Chrome — nur Safari kann unter iOS zum
Startbildschirm hinzufügen), anmelden, dann Teilen-Symbol → „Zum Home-
Bildschirm". Erwartet:

1. Als Name steht „PHE Recruiting" vorgeschlagen
2. Das Symbol ist blau mit weißem „PHE", kein weißer Kasten, kein
   Seitenabbild
3. Nach dem Antippen öffnet die App **ohne Adresszeile**
4. Die untere Leiste liegt über dem Home-Indikator, nicht darunter

Läuft einer der Punkte nicht, liegt es fast immer an der Zwischenspeicherung
von Safari: App vom Startbildschirm löschen, Safari-Reiter schließen, erneut
anlegen.

- [ ] **Schritt 5: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/app/intern/manifest.webmanifest frontend/src/app/intern/symbol && git commit -m "Web-App-Manifest und Symbol für den Startbildschirm

Manifest unter /intern statt im Wurzelverzeichnis: Ein Manifest dort
gilt für die ganze Domain, und dann bietet der Browser jedem Besucher
der Website eine App in den internen Bereich an.

Symbole entstehen über ImageResponse — PNG ohne Bilddatei im Repo.
Nur 192 und 512 erlaubt, sonst ließe sich über beliebige Größen eine
teure Bildberechnung auslösen."
```

**Damit ist Schritt 1 der Spezifikation abgeschlossen:** Anmeldung, Gerüst
und App auf dem Startbildschirm stehen.

---

# Schritt 2 der Spezifikation: Landingpages aus der Datenbank

Ab hier wird die Quelle der Konfiguration umgestellt. Die Reihenfolge ist mit
Absicht so gewählt, dass die öffentlichen Seiten zu **jedem** Zeitpunkt
funktionieren: Erst entstehen Prüfung, Tabellen und Umwandlung, dann liest die
Route zusätzlich aus der Datenbank, und erst zuletzt landen Daten darin.

---

## Aufgabe 6: Prüfregeln in ein gemeinsames Modul

Heute stehen die Regeln, was eine gültige Landingpage ist, als 28 Testfälle in
`kampagnen.test.ts`. Ein Formular kann damit nichts anfangen. Sie wandern
deshalb in eine Funktion, die eine Liste von Befunden zurückgibt — Test und
(im nächsten Plan) Formular nutzen dieselbe.

Was **nicht** mitwandert: die Prüfung gegen die Registry und der Abgleich von
`organischeStelle` mit `JOBS`. Beide brauchen Wissen von außerhalb der
Konfiguration und bleiben im Test.

**Dateien:**
- Anlegen: `frontend/src/landingpages/pruefung.ts`
- Test: `frontend/src/landingpages/__tests__/pruefung.test.ts`
- Ändern: `frontend/src/landingpages/__tests__/kampagnen.test.ts`

- [ ] **Schritt 1: Den fehlschlagenden Test schreiben**

`frontend/src/landingpages/__tests__/pruefung.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pruefeLandingpage } from "../pruefung";
import { kaeltetechnikerKoeln } from "../kampagnen/kaeltetechniker-koeln";
import type { LandingpageConfig } from "../typen";

// Basis ist eine echte, laufende Kampagne. Jeder Test macht davon eine Kopie
// und verletzt genau eine Regel — so wird geprüft, dass die Regel greift,
// ohne eine Konfiguration von Hand erfinden zu müssen.
function kopie(): LandingpageConfig {
  return structuredClone(kaeltetechnikerKoeln);
}

/** Alle Befundtexte als ein Text — erspart das Suchen im Array. */
function texte(config: LandingpageConfig): string {
  return pruefeLandingpage(config)
    .map((b) => `${b.feld}: ${b.text}`)
    .join("\n");
}

describe("pruefeLandingpage", () => {
  it("findet an einer laufenden Kampagne nichts zu beanstanden", () => {
    expect(pruefeLandingpage(kaeltetechnikerKoeln)).toEqual([]);
  });

  describe("Slug", () => {
    it("beanstandet Großbuchstaben und Unterstriche", () => {
      const c = kopie();
      c.slug = "Kaeltetechniker_Koeln";
      expect(texte(c)).toMatch(/slug/i);
    });

    it("beanstandet einen leeren Slug", () => {
      const c = kopie();
      c.slug = "";
      expect(texte(c)).toMatch(/slug/i);
    });
  });

  describe("Position und Einsatzgebiet", () => {
    it("beanstandet eine zu knappe Positionsbezeichnung", () => {
      const c = kopie();
      c.position = "Job";
      expect(texte(c)).toMatch(/position/i);
    });

    it("beanstandet ein fehlendes Einsatzgebiet", () => {
      const c = kopie();
      c.einsatzgebiet = "";
      expect(texte(c)).toMatch(/einsatzgebiet/i);
    });
  });

  describe("Vorteile", () => {
    it("beanstandet zwei Vorteile", () => {
      const c = kopie();
      c.vorteile = c.vorteile.slice(0, 2);
      expect(texte(c)).toMatch(/vorteile/i);
    });

    it("beanstandet fünf Vorteile", () => {
      const c = kopie();
      c.vorteile = [...c.vorteile, ...c.vorteile].slice(0, 5);
      expect(texte(c)).toMatch(/vorteile/i);
    });

    it("beanstandet einen Vorteil ohne Zusatz", () => {
      const c = kopie();
      c.vorteile[0].zusatz = "   ";
      expect(texte(c)).toMatch(/vorteile/i);
    });
  });

  describe("Gegenüberstellung", () => {
    it("beanstandet ungleich lange Spalten", () => {
      const c = kopie();
      c.gegenueberstellung.positiv.punkte.pop();
      expect(texte(c)).toMatch(/gegenueberstellung/i);
    });

    it("beanstandet zu wenige Punkte", () => {
      const c = kopie();
      c.gegenueberstellung.negativ.punkte = ["nur einer"];
      c.gegenueberstellung.positiv.punkte = ["nur einer"];
      expect(texte(c)).toMatch(/gegenueberstellung/i);
    });
  });

  describe("Ablauf", () => {
    it("beanstandet zwei Ablaufschritte", () => {
      const c = kopie();
      c.ablauf.schritte = c.ablauf.schritte.slice(0, 2);
      expect(texte(c)).toMatch(/ablauf/i);
    });
  });

  describe("Funnel", () => {
    it("beanstandet einen fehlenden Kontaktschritt am Ende", () => {
      const c = kopie();
      c.funnel.schritte = c.funnel.schritte.filter((s) => s.art !== "kontakt");
      expect(texte(c)).toMatch(/funnel/i);
    });

    it("beanstandet mehr als sechs Schritte", () => {
      const c = kopie();
      const erster = c.funnel.schritte[0];
      if (erster.art === "kontakt") throw new Error("Test setzt eine Auswahl voraus");

      // Sieben Schritte, Kontakt bleibt am Ende.
      const ohneKontakt = c.funnel.schritte.filter((s) => s.art !== "kontakt");
      const kontakt = c.funnel.schritte.find((s) => s.art === "kontakt")!;
      let nummer = 0;
      while (ohneKontakt.length < 6) {
        const zusatz = structuredClone(erster);
        // Eigener Feldname je Kopie. Ohne das schlüge auch die Regel gegen
        // doppelte Feldnamen an, und der Test bestünde, ohne dass die
        // Sechs-Schritte-Regel je gegriffen hätte.
        zusatz.feld = `fuellschritt_${nummer++}`;
        ohneKontakt.push(zusatz);
      }
      c.funnel.schritte = [...ohneKontakt, kontakt];

      const befunde = pruefeLandingpage(c);
      expect(befunde.map((b) => b.text).join("\n")).toMatch(/sechs Schritte/i);
    });

    it("beanstandet einen zweimal verwendeten Feldnamen", () => {
      const c = kopie();
      const erster = c.funnel.schritte[0];
      const zweiter = c.funnel.schritte[1];
      if (erster.art === "kontakt" || zweiter.art === "kontakt") {
        throw new Error("Test setzt zwei Auswahlschritte am Anfang voraus");
      }
      zweiter.feld = erster.feld;
      expect(texte(c)).toMatch(/feld/i);
    });

    it("beanstandet zwei gleiche Antwortwerte in einer Frage", () => {
      const c = kopie();
      const schritt = c.funnel.schritte[0];
      if (schritt.art === "kontakt") throw new Error("Test setzt eine Auswahl voraus");
      schritt.optionen[1].wert = schritt.optionen[0].wert;
      expect(texte(c)).toMatch(/wert/i);
    });

    it("beanstandet einen Antwortwert mit Großbuchstaben", () => {
      const c = kopie();
      const schritt = c.funnel.schritte[0];
      if (schritt.art === "kontakt") throw new Error("Test setzt eine Auswahl voraus");
      schritt.optionen[0].wert = "Ja-Klar";
      expect(texte(c)).toMatch(/wert/i);
    });

    it("beanstandet eine leere Frage", () => {
      const c = kopie();
      c.funnel.schritte[0].frage = "  ";
      expect(texte(c)).toMatch(/frage/i);
    });
  });

  describe("SEO", () => {
    it("beanstandet einen zu langen Titel", () => {
      const c = kopie();
      c.seo.titel = "Kältetechniker Köln PHE-Perm Engineering ".repeat(3);
      expect(texte(c)).toMatch(/titel/i);
    });

    it("beanstandet einen zu kurzen Titel", () => {
      const c = kopie();
      c.seo.titel = "PHE-Perm";
      expect(texte(c)).toMatch(/titel/i);
    });

    it("beanstandet eine zu kurze Beschreibung", () => {
      const c = kopie();
      c.seo.beschreibung = "Zu kurz.";
      expect(texte(c)).toMatch(/beschreibung/i);
    });

    it("beanstandet die zweimal genannte Marke", () => {
      const c = kopie();
      c.seo.titel = "Kältetechniker bei PHE-Perm | PHE Perm Engineering";
      expect(texte(c)).toMatch(/marke/i);
    });

    it("beanstandet die fehlende Marke", () => {
      const c = kopie();
      c.seo.titel = "Kältetechniker Köln — jetzt bewerben und durchstarten";
      expect(texte(c)).toMatch(/marke/i);
    });
  });

  describe("Hero-Bild", () => {
    it("lässt eine Kampagne ohne Bild durchgehen", () => {
      const c = kopie();
      delete c.heroBild;
      expect(pruefeLandingpage(c)).toEqual([]);
    });

    it("beanstandet ein Bild ohne aussagekräftigen Alt-Text", () => {
      const c = kopie();
      c.heroBild = { pfad: "/landingpages/test.jpg", alt: "Bild", breite: 1, hoehe: 1 };
      expect(texte(c)).toMatch(/alt/i);
    });

    it("beanstandet einen Pfad, der keine Bilddatei ist", () => {
      const c = kopie();
      c.heroBild = {
        pfad: "/landingpages/test.txt",
        alt: "Ein Monteur prüft eine Kälteanlage auf einem Flachdach",
        breite: 1200,
        hoehe: 800,
      };
      expect(texte(c)).toMatch(/pfad/i);
    });
  });

  it("beanstandet eine fehlende Betreffzeile", () => {
    const c = kopie();
    c.benachrichtigungsBetreff = "Neu";
    expect(texte(c)).toMatch(/betreff/i);
  });

  it("nennt bei mehreren Verstößen alle", () => {
    const c = kopie();
    c.slug = "NICHT GUT";
    c.einsatzgebiet = "";
    c.ablauf.schritte = [];
    expect(pruefeLandingpage(c).length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Schritt 2: Test laufen lassen — er muss fehlschlagen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run src/landingpages/__tests__/pruefung.test.ts
```

Erwartet: FAIL mit „Failed to resolve import "../pruefung"".

- [ ] **Schritt 3: Das Prüfmodul schreiben**

`frontend/src/landingpages/pruefung.ts`:

```ts
// Prüfregeln für eine Landingpage-Konfiguration.
//
// Dieselben Regeln, die bis zum 29.09.2026 als Testfälle in
// `__tests__/kampagnen.test.ts` standen. Sie liegen jetzt hier, weil nicht
// nur der Test sie braucht: Auch das Formular im internen Bereich muss vor
// dem Veröffentlichen sagen können, was noch fehlt.
//
// Alle Regeln folgen aus der Konfiguration allein. Prüfungen, die Wissen von
// außen brauchen — ob eine verlinkte Stellenanzeige existiert, ob der Slug
// schon vergeben ist — gehören nicht hierher.

import type { LandingpageConfig } from "./typen";

export type Befund = {
  /** Feldname der Konfiguration, für die Zuordnung im Formular. */
  feld: string;
  /** Was zu tun ist — wird Menschen angezeigt, also vollständiger Satz. */
  text: string;
};

const SLUG_MUSTER = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const WERT_MUSTER = /^[a-z0-9_]+$/;
const BILD_MUSTER = /^\/[\w/-]+\.(jpg|jpeg|png|webp|avif)$/;
const MARKE_MUSTER = /PHE[- ]Perm/gi;

function leer(text: unknown): boolean {
  return typeof text !== "string" || text.trim() === "";
}

export function pruefeLandingpage(config: LandingpageConfig): Befund[] {
  const befunde: Befund[] = [];
  const melde = (feld: string, text: string) => befunde.push({ feld, text });

  // ── Slug ────────────────────────────────────────────────────────────────
  if (!SLUG_MUSTER.test(config.slug)) {
    melde(
      "slug",
      "Der Slug darf nur Kleinbuchstaben, Ziffern und einzelne Bindestriche " +
        "enthalten — er wird Teil der Adresse.",
    );
  }

  // ── Position und Einsatzgebiet ──────────────────────────────────────────
  if (config.position.trim().length <= 5) {
    melde(
      "position",
      "Die Positionsbezeichnung ist zu knapp. Vollständig mit (m/w/d) angeben.",
    );
  }
  if (config.einsatzgebiet.trim().length <= 2) {
    melde("einsatzgebiet", "Das Einsatzgebiet fehlt, zum Beispiel „Raum Köln“.");
  }

  // ── Vorteile ────────────────────────────────────────────────────────────
  if (config.vorteile.length < 3 || config.vorteile.length > 4) {
    melde(
      "vorteile",
      `Drei oder vier Vorteile — aktuell ${config.vorteile.length}. ` +
        "Weniger wirkt dünn, mehr liest niemand.",
    );
  }
  for (const [i, v] of config.vorteile.entries()) {
    if (leer(v.titel) || leer(v.zusatz)) {
      melde("vorteile", `Vorteil ${i + 1} braucht Titel und Zusatz.`);
    }
  }

  // ── Gegenüberstellung ───────────────────────────────────────────────────
  const g = config.gegenueberstellung;
  if (g.negativ.punkte.length < 3) {
    melde(
      "gegenueberstellung",
      `Mindestens drei Punkte je Spalte — aktuell ${g.negativ.punkte.length}.`,
    );
  }
  if (g.positiv.punkte.length !== g.negativ.punkte.length) {
    melde(
      "gegenueberstellung",
      `Beide Spalten brauchen gleich viele Punkte — links ` +
        `${g.negativ.punkte.length}, rechts ${g.positiv.punkte.length}. ` +
        "Ungleiche Spalten sehen aus wie ein Fehler.",
    );
  }

  // ── Ablauf ──────────────────────────────────────────────────────────────
  if (config.ablauf.schritte.length !== 3) {
    melde(
      "ablauf",
      `Der Ablauf hat genau drei Schritte — aktuell ` +
        `${config.ablauf.schritte.length}.`,
    );
  }

  // ── Funnel ──────────────────────────────────────────────────────────────
  const schritte = config.funnel.schritte;

  if (schritte.at(-1)?.art !== "kontakt") {
    melde("funnel", "Der Funnel endet mit dem Kontaktschritt.");
  }
  const kontaktZahl = schritte.filter((s) => s.art === "kontakt").length;
  if (kontaktZahl !== 1) {
    melde("funnel", `Genau ein Kontaktschritt — aktuell ${kontaktZahl}.`);
  }
  if (schritte.length > 6) {
    melde(
      "funnel",
      `Höchstens sechs Schritte — aktuell ${schritte.length}. ` +
        "Jeder weitere kostet Abschlüsse.",
    );
  }

  const felder = schritte
    .filter((s) => s.art !== "kontakt")
    .map((s) => (s as { feld: string }).feld);
  const doppelt = felder.filter((f, i) => felder.indexOf(f) !== i);
  for (const f of new Set(doppelt)) {
    melde("funnel.feld", `Der Feldname „${f}“ wird zweimal verwendet.`);
  }

  for (const schritt of schritte) {
    if (leer(schritt.frage)) {
      melde("funnel.frage", "Jeder Schritt braucht eine Frage.");
    }
    if (schritt.art === "kontakt") continue;

    const werte = schritt.optionen.map((o) => o.wert);
    if (new Set(werte).size !== werte.length) {
      melde(
        "funnel.wert",
        `Die Frage „${schritt.feld}“ vergibt einen Antwortwert zweimal. ` +
          "Werte landen so in der Datenbank und müssen eindeutig sein.",
      );
    }
    for (const o of schritt.optionen) {
      if (!WERT_MUSTER.test(o.wert)) {
        melde(
          "funnel.wert",
          `Der Antwortwert „${o.wert}“ in „${schritt.feld}“ darf nur ` +
            "Kleinbuchstaben, Ziffern und Unterstriche enthalten.",
        );
      }
      if (leer(o.label)) {
        melde("funnel.wert", `Eine Antwort in „${schritt.feld}“ hat keine Beschriftung.`);
      }
    }
  }

  // ── SEO ─────────────────────────────────────────────────────────────────
  const titel = config.seo.titel;
  if (titel.length <= 20 || titel.length > 70) {
    melde(
      "seo.titel",
      `Der Seitentitel braucht 21 bis 70 Zeichen — aktuell ${titel.length}. ` +
        "Google schneidet längere ab.",
    );
  }
  const beschreibung = config.seo.beschreibung;
  if (beschreibung.length <= 70 || beschreibung.length > 170) {
    melde(
      "seo.beschreibung",
      `Die Beschreibung braucht 71 bis 170 Zeichen — aktuell ` +
        `${beschreibung.length}.`,
    );
  }
  const markenTreffer = titel.match(MARKE_MUSTER) ?? [];
  if (markenTreffer.length !== 1) {
    melde(
      "seo.titel",
      `Die Marke „PHE-Perm“ steht ${markenTreffer.length}-mal im Titel, ` +
        "gebraucht wird genau einmal. Das Wurzel-Layout hängt sie nicht an, " +
        "weil die Seite `title.absolute` verwendet.",
    );
  }

  // ── Hero-Bild (optional) ────────────────────────────────────────────────
  if (config.heroBild) {
    const b = config.heroBild;
    if (b.alt.trim().length <= 15) {
      melde(
        "heroBild.alt",
        "Der Alt-Text beschreibt, was zu sehen ist — nicht „Bild“ oder " +
          "„Kältetechniker“. Mindestens 16 Zeichen.",
      );
    }
    if (!BILD_MUSTER.test(b.pfad)) {
      melde(
        "heroBild.pfad",
        `„${b.pfad}“ ist kein Bildpfad. Erwartet wird etwas wie ` +
          "/landingpages/name.jpg (jpg, jpeg, png, webp oder avif).",
      );
    }
    if (b.breite <= 0 || b.hoehe <= 0) {
      melde("heroBild.pfad", "Breite und Höhe des Bildes fehlen.");
    }
  }

  // ── Benachrichtigung ────────────────────────────────────────────────────
  if (config.benachrichtigungsBetreff.trim().length <= 10) {
    melde(
      "benachrichtigungsBetreff",
      "Die Betreffzeile der Benachrichtigung ist zu knapp — sie muss im " +
        "Postfach erkennbar sein.",
    );
  }

  return befunde;
}
```

- [ ] **Schritt 4: Test laufen lassen — er muss bestehen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run src/landingpages/__tests__/pruefung.test.ts
```

Erwartet: PASS, 27 Tests.

Schlägt „findet an einer laufenden Kampagne nichts zu beanstanden" fehl, ist
eine Regel strenger geraten als der Bestand — dann die Regel korrigieren,
**nicht** die Kampagne.

- [ ] **Schritt 5: Den bestehenden Test auf das Modul umstellen**

In `frontend/src/landingpages/__tests__/kampagnen.test.ts` die Testfälle
ersetzen, die nur die Konfiguration selbst prüfen. Konkret: Alle `it`-Blöcke
zwischen „nennt Position und Einsatzgebiet" und „hat eine Betreffzeile für die
Benachrichtigung" entfallen, einschließlich der `describe`-Blöcke „Funnel" und
„SEO". Erhalten bleiben „hat einen URL-tauglichen Slug", „ist über die
Registry auffindbar" und „verweist, falls angegeben, auf eine existierende
Stellenanzeige".

An ihre Stelle tritt ein Block. Die neue Import-Zeile oben ergänzen:

```ts
import { pruefeLandingpage } from "../pruefung";
```

Und im `describe.each`-Block, direkt nach „ist über die Registry auffindbar":

```ts
  it("erfüllt alle Prüfregeln", () => {
    // Die Einzelregeln sind in pruefung.test.ts abgedeckt. Hier geht es
    // darum, dass JEDE ausgelieferte Kampagne sie erfüllt — auch jede
    // künftig hinzugefügte.
    const befunde = pruefeLandingpage(config);
    expect(
      befunde.map((b) => `${b.feld}: ${b.text}`).join("\n"),
    ).toBe("");
  });
```

Die Prüfung über den zusammengesetzten Text statt über `toEqual([])` ist
Absicht: Bei einem Verstoß steht im Testprotokoll, *was* fehlt, nicht nur
*dass* etwas fehlt.

- [ ] **Schritt 6: Alle Tests laufen lassen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run 2>&1 | tail -15
```

Erwartet: Alle Testdateien bestehen. Die Gesamtzahl sinkt gegenüber vorher
(116 Tests), weil aus 28 feinen Fällen je Kampagne einer geworden ist — die
abgelösten Fälle stehen jetzt in `pruefung.test.ts`. **Keine** Datei darf
fehlschlagen.

- [ ] **Schritt 7: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/landingpages/pruefung.ts frontend/src/landingpages/__tests__/pruefung.test.ts frontend/src/landingpages/__tests__/kampagnen.test.ts && git commit -m "Prüfregeln der Landingpages in ein gemeinsames Modul

Die Regeln standen als 28 Testfälle in kampagnen.test.ts — damit kann
ein Formular nichts anfangen. Als Funktion mit Befundliste nutzen sie
Test und (ab dem nächsten Plan) das Anlegen-Formular gemeinsam.

Registry-Auffindbarkeit und der Abgleich mit JOBS bleiben im Test:
Beide brauchen Wissen von außerhalb der Konfiguration."
```

---

## Aufgabe 7: Tabellen für Arbeitgeber und Landingpages

Die Migration läuft in der **CRM-Datenbank** (`lkmrsvvgisdthvlqjhdk`,
„Occtaai") — dort liegt auch `recruiting_leads`. Nicht zu verwechseln mit
`backend/supabase/migrations/`, das zur ATS-Datenbank gehört.

**Diese Entscheidung hat eine Folge, die diese Aufgabe tragen muss.** Am
29.09.2026 wurde bewusst entschieden, kein eigenes Supabase-Projekt anzulegen
(das hätte 10 $ im Monat gekostet). Damit teilen die neuen Tabellen ihr
Projekt mit dem CRM — und damit auch dessen Anmeldekonten. `authenticated`
bedeutet hier **nicht** „Matin oder Alex", sondern „irgendein Konto dieses
Projekts", heute einschließlich `ti@phe-perm.de` und künftig jedes weitere
CRM-Konto.

Eine Policy mit `using (true)` wäre deshalb falsch. Der Zugang wird über eine
Erlaubnisliste in einer zentralen Funktion geregelt. Zentral, weil eine an
jeder Tabelle wiederholte Liste genau die Stelle ist, an der man bei der
nächsten Tabelle etwas vergisst.

Ebenfalls eine Folge des geteilten Projekts: Dort liegt bereits eine
Firmen-Tabelle `companies` mit 4678 Zeilen aus Salesforce. Sie trägt nur
`id`, `tenant_id`, `name` und `website` — kein Logo, keine Farbe, keine
Umschreibung, keinen Slug. Als Arbeitgeber-Quelle für Landingpages taugt sie
deshalb nicht, aber `arbeitgeber` bekommt einen optionalen Verweis darauf,
damit die Verbindung zum CRM-Kunden herstellbar ist, ohne Namen zu doppeln.

Die Konfiguration wird als **ein `jsonb`-Feld** gespeichert, nicht auf zwanzig
Spalten verteilt. Begründung: `LandingpageConfig` ist verschachtelt, und
`funnel.schritte` ist ein Vereinigungstyp mit drei Varianten. In Spalten
zerlegt bräuchte es vier weitere Tabellen und eine Zusammensetzlogik, die bei
jeder neuen Schrittart angefasst werden muss. Die Gegenleistung — Prüfung
durch die Datenbank — liefert `pruefung.ts` bereits, und zwar mit Meldungen,
die Menschen lesen können.

**Dateien:**
- Anlegen: `frontend/supabase/migrations/002_landingpages.sql`

- [ ] **Schritt 1: Die Migration schreiben**

`frontend/supabase/migrations/002_landingpages.sql`:

```sql
-- Arbeitgeber und Landingpages für den internen Bereich.
--
-- Läuft in der CRM-Datenbank (lkmrsvvgisdthvlqjhdk), derselben, in der
-- recruiting_leads liegt. NICHT die ATS-Datenbank des FastAPI-Backends.
--
-- Anders als bei recruiting_leads gibt es hier Policies: Auf diese Tabellen
-- greift der interne Bereich mit dem angemeldeten Konto zu, nicht mit dem
-- Service-Role-Schlüssel. recruiting_leads hat bewusst RLS ohne Policy, weil
-- dort ausschließlich serverseitig geschrieben wird.

-- ── Arbeitgeber ───────────────────────────────────────────────────────────

create table if not exists public.arbeitgeber (
  id uuid primary key default gen_random_uuid(),

  name text not null check (length(trim(name)) > 1),
  -- Bestandteil künftiger Adressen, deshalb dieselbe Form wie ein Slug.
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  -- Optionaler Verweis auf den CRM-Kunden aus dem Salesforce-Import.
  -- Bewusst optional und bewusst nur ein Verweis: `companies` trägt weder
  -- Logo noch Farbe noch Umschreibung, taugt also nicht als Quelle — aber
  -- ohne diesen Verweis entstehen zwei Wahrheiten über denselben Kunden.
  -- `on delete set null`, weil eine im CRM gelöschte Firma keine laufende
  -- Landingpage mitreißen darf.
  company_id uuid references public.companies(id) on delete set null,

  logo_url text,
  -- Hausfarbe als Hex-Wert. Die abgeleiteten Töne werden daraus berechnet.
  farbe text not null default '#0071e3'
    check (farbe ~ '^#[0-9a-f]{6}$'),

  -- Für vertrauliche Suchen: „ein Gebäudetechnik-Dienstleister“. Ohne diesen
  -- Text lässt sich eine vertrauliche Landingpage nicht formulieren.
  umschreibung text,
  -- Rein intern, erscheint nirgends öffentlich.
  notiz text,

  erstellt_am timestamptz not null default now(),
  geaendert_am timestamptz not null default now()
);

comment on table public.arbeitgeber is
  'Kunden von PHE. Tragen Erscheinungsbild und Umschreibung für ihre Landingpages.';
comment on column public.arbeitgeber.umschreibung is
  'Ersetzt den Namen auf vertraulichen Landingpages. Ohne sie ist keine vertrauliche Seite möglich.';

-- ── Landingpages ──────────────────────────────────────────────────────────

create table if not exists public.landingpages (
  id uuid primary key default gen_random_uuid(),

  -- URL-Segment unter /stellen/. Eindeutig, weil es die Adresse bestimmt.
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  -- Kein Arbeitgeber bei den übernommenen Bestandskampagnen: Sie entstanden,
  -- bevor es die Arbeitgeber-Ebene gab.
  arbeitgeber_id uuid references public.arbeitgeber(id) on delete restrict,

  -- Vorgabe ist die vorsichtige Einstellung: PHE sucht für Kunden, und keine
  -- der 44 Stellenanzeigen nennt den Arbeitgeber. Wer ihn nennen will, sagt
  -- das ausdrücklich.
  vertraulich boolean not null default true,

  status text not null default 'entwurf'
    check (status in ('entwurf', 'veroeffentlicht')),
  veroeffentlicht_am timestamptz,

  -- Die vollständige LandingpageConfig. Ein jsonb-Feld statt zwanzig Spalten:
  -- Der Typ ist verschachtelt, funnel.schritte ist ein Vereinigungstyp mit
  -- drei Varianten. Geprüft wird beim Schreiben durch pruefung.ts, mit
  -- Meldungen, die Menschen lesen können.
  config jsonb not null,

  erstellt_am timestamptz not null default now(),
  geaendert_am timestamptz not null default now(),

  -- Veröffentlicht ohne Datum wäre ein Widerspruch — die Übersicht sortiert
  -- danach.
  constraint veroeffentlicht_braucht_datum check (
    status <> 'veroeffentlicht' or veroeffentlicht_am is not null
  ),

  -- Vertraulich ohne Arbeitgeber geht (Bestandskampagnen). Offen ohne
  -- Arbeitgeber nicht: Ohne Arbeitgeber gibt es kein Logo und keinen Namen,
  -- der genannt werden könnte.
  constraint offen_braucht_arbeitgeber check (
    vertraulich or arbeitgeber_id is not null
  )
);

comment on table public.landingpages is
  'Löst die Dateien in src/landingpages/kampagnen/ ab. config enthält die vollständige LandingpageConfig.';

create index if not exists landingpages_status_idx
  on public.landingpages (status, veroeffentlicht_am desc);

create index if not exists landingpages_arbeitgeber_idx
  on public.landingpages (arbeitgeber_id);

-- ── geaendert_am fortschreiben ────────────────────────────────────────────
--
-- SECURITY INVOKER, nicht DEFINER: Eine DEFINER-Funktion wäre über
-- /rest/v1/rpc/ von außen aufrufbar und liefe mit den Rechten ihres
-- Eigentümers. Dieselbe Korrektur wurde am 23.09.2026 an der Trigger-
-- Funktion von recruiting_leads vorgenommen.

create or replace function public.setze_geaendert_am()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.geaendert_am := now();
  return new;
end;
$$;

revoke execute on function public.setze_geaendert_am() from anon, authenticated;

drop trigger if exists arbeitgeber_geaendert on public.arbeitgeber;
create trigger arbeitgeber_geaendert
  before update on public.arbeitgeber
  for each row execute function public.setze_geaendert_am();

drop trigger if exists landingpages_geaendert on public.landingpages;
create trigger landingpages_geaendert
  before update on public.landingpages
  for each row execute function public.setze_geaendert_am();

-- ── Absicherung ───────────────────────────────────────────────────────────

alter table public.arbeitgeber enable row level security;
alter table public.landingpages enable row level security;

-- ── Wer darf hinein ──────────────────────────────────────────────────────
--
-- `authenticated` genügt hier NICHT: Dieses Projekt teilt seine Anmeldekonten
-- mit dem CRM. Heute hat `ti@phe-perm.de` ein Konto, morgen vielleicht weitere
-- Kolleginnen und Kollegen — die sollen an Kundendaten und Bewerbungen nicht
-- vorbeikommen, nur weil sie im CRM arbeiten.
--
-- Die Liste steht in einer Funktion und nicht in jeder Policy: Sonst ist sie
-- an vier Stellen zu pflegen, und die fünfte Tabelle bekommt sie nicht.
--
-- Geprüft wird die Kennung (`auth.uid()`), nicht die E-Mail-Adresse. Eine
-- Kennung ändert sich nie; eine Adresse schon, und dann hängt der Zugang an
-- einer Zeichenkette.
--
-- Das ist keine Rechteverwaltung: Beide Personen haben dieselben Rechte. Es
-- ist eine Türliste, und sie ist nur nötig, weil das Projekt geteilt wird.
-- In einem eigenen Projekt wäre sie überflüssig.

create or replace function public.ist_recruiting_nutzer()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select auth.uid() in (
    '40348df4-e363-4c25-8143-dcb237652e29',  -- matin.askaryar@phe-perm.de
    'e932b1ab-e382-48fa-992a-c54ff6c12f06'   -- alexandros.selemidis@phe-perm.de
  );
$$;

comment on function public.ist_recruiting_nutzer() is
  'Türliste für den internen Recruiting-Bereich. Nötig, weil das Projekt seine Anmeldekonten mit dem CRM teilt.';

-- Die Funktion darf aufgerufen werden — sie verrät nichts, sie antwortet nur
-- über den Aufrufer selbst.
grant execute on function public.ist_recruiting_nutzer() to authenticated;

drop policy if exists "angemeldete duerfen alles" on public.arbeitgeber;
drop policy if exists "recruiting-nutzer duerfen alles" on public.arbeitgeber;
create policy "recruiting-nutzer duerfen alles"
  on public.arbeitgeber for all
  to authenticated
  using (public.ist_recruiting_nutzer())
  with check (public.ist_recruiting_nutzer());

drop policy if exists "angemeldete duerfen alles" on public.landingpages;
drop policy if exists "recruiting-nutzer duerfen alles" on public.landingpages;
create policy "recruiting-nutzer duerfen alles"
  on public.landingpages for all
  to authenticated
  using (public.ist_recruiting_nutzer())
  with check (public.ist_recruiting_nutzer());

-- Unangemeldete haben hier nichts zu suchen. Die öffentliche Route liest mit
-- dem Service-Role-Schlüssel, der RLS ohnehin umgeht.
revoke all on public.arbeitgeber from anon;
revoke all on public.landingpages from anon;
```

- [ ] **Schritt 2: Die Migration ausführen**

Im Supabase-Dashboard des CRM-Projekts (`lkmrsvvgisdthvlqjhdk`) unter
*SQL Editor* den Inhalt der Datei einfügen und ausführen.

Erwartet: „Success. No rows returned."

- [ ] **Schritt 3: Absicherung nachweisen**

Dieser Schritt ist nicht optional. Ob RLS aktiv ist und ob die Türliste
greift, lässt sich nicht durch Hinsehen beantworten — und beim geteilten
Projekt hängt daran, wer an die Bewerberdaten kommt.

Im SQL Editor ausführen:

```sql
-- 1. Ist RLS an, und gibt es Policies?
select
  c.relname as tabelle,
  c.relrowsecurity as rls_aktiv,
  count(p.polname) as policies
from pg_class c
left join pg_policies p
  on p.tablename = c.relname and p.schemaname = 'public'
where c.relname in ('arbeitgeber', 'landingpages')
group by c.relname, c.relrowsecurity;

-- 2. Welche Rechte hat anon?
select table_name, privilege_type
from information_schema.role_table_grants
where grantee = 'anon' and table_name in ('arbeitgeber', 'landingpages');

-- 3. Wer steht auf der Türliste? Alle Konten dieses Projekts im Überblick.
select
  u.email,
  u.id in (
    '40348df4-e363-4c25-8143-dcb237652e29',
    'e932b1ab-e382-48fa-992a-c54ff6c12f06'
  ) as hat_zugang
from auth.users u
order by hat_zugang desc, u.email;
```

Erwartet:
- Abfrage 1: beide Tabellen `rls_aktiv = true`, `policies = 1`
- Abfrage 2: **keine Zeilen**
- Abfrage 3: `matin.askaryar@` und `alexandros.selemidis@` mit
  `hat_zugang = true`, **`ti@phe-perm.de` mit `false`**

Liefert Abfrage 2 Zeilen, greift das `revoke` nicht — dann ist die Migration
nicht vollständig durchgelaufen.

- [ ] **Schritt 3b: Die Türliste im Betrieb prüfen**

Abfrage 3 zeigt die Liste, beweist aber nicht, dass die Policy sie anwendet.
Das prüft eine vorgetäuschte Anmeldung. Die Transaktion wird am Ende
zurückgerollt und ändert nichts:

```sql
-- Als ti@phe-perm.de: darf nichts sehen.
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated"}';
  select public.ist_recruiting_nutzer() as sollte_false_sein;
  select count(*) as sollte_null_sein from public.landingpages;
rollback;

-- Als Matin: darf alles sehen.
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"40348df4-e363-4c25-8143-dcb237652e29","role":"authenticated"}';
  select public.ist_recruiting_nutzer() as sollte_true_sein;
  select count(*) as zeilen from public.landingpages;
rollback;
```

Erwartet:
- Erster Block: `sollte_false_sein = false`, `sollte_null_sein = 0`
- Zweiter Block: `sollte_true_sein = true`, `zeilen` = Anzahl der Einträge
  (unmittelbar nach der Migration 0, nach Aufgabe 12 dann 2)

Zeigt der erste Block `0` **und** der zweite nach Aufgabe 12 `2`, ist
bewiesen: Die Policy unterscheidet, und zwar in beide Richtungen. Zeigt der
erste Block Zeilen, ist die Türliste unwirksam — dann nicht weitergehen.

Die Kennung `00000000-…` im ersten Block steht für „irgendein anderes Konto".
Wer es genauer will, setzt die echte Kennung von `ti@phe-perm.de` ein; sie
steht in der Ausgabe von Abfrage 3 nicht, lässt sich aber über
`select id from auth.users where email = 'ti@phe-perm.de'` holen.

- [ ] **Schritt 4: Von außen prüfen**

Mit dem Anon-Schlüssel darf nichts lesbar sein. `<URL>` und `<ANON>` durch
die Werte aus `.env.local` ersetzen:

```bash
curl -s "<URL>/rest/v1/landingpages?select=slug" \
  -H "apikey: <ANON>" \
  -H "Authorization: Bearer <ANON>"
```

Erwartet: eine Fehlermeldung zu fehlender Berechtigung
(`permission denied for table landingpages`), **kein** `[]`.

Ein leeres Array wäre ebenfalls kein Datenleck, aber es hieße, dass das
`revoke` nicht gegriffen hat und nur die Policy schützt — eine Schicht
weniger als beabsichtigt.

- [ ] **Schritt 5: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/supabase/migrations/002_landingpages.sql && git commit -m "Tabellen arbeitgeber und landingpages

Die Konfiguration liegt als ein jsonb-Feld, nicht auf zwanzig Spalten:
LandingpageConfig ist verschachtelt, funnel.schritte ein Vereinigungstyp
mit drei Varianten. Geprüft wird beim Schreiben durch pruefung.ts.

Der Zugang haengt an einer Tuerliste in ist_recruiting_nutzer(), nicht
an `authenticated`: Das Projekt teilt seine Anmeldekonten mit dem CRM,
wo heute schon ein drittes Konto existiert. Geprueft wird die Kennung,
nicht die E-Mail-Adresse — eine Kennung aendert sich nie.

Trigger-Funktion SECURITY INVOKER, sonst waere sie ueber /rest/v1/rpc/
aufrufbar. arbeitgeber verweist optional auf companies, damit nicht
zwei Wahrheiten ueber denselben Kunden entstehen."
```

---

## Aufgabe 8: Umwandlung zwischen Konfiguration und Datenbankzeile

Diese Aufgabe trägt den Gleichheitsnachweis, auf den es in Schritt 2 ankommt:
Was aus der Datenbank kommt, muss **exakt** dasselbe sein wie das, was heute
in der Registry steht. Ist die Konfiguration identisch, ist die Seite
identisch — die Komponenten der Engine rechnen nur mit der Konfiguration und
haben keinen eigenen Zustand.

Deshalb prüft der Test den Rundlauf durch echtes JSON, nicht nur durch ein
Objekt: `JSON.parse(JSON.stringify(...))` ist genau der Weg, den die Daten
durch Postgres nehmen.

**Dateien:**
- Anlegen: `frontend/src/landingpages/server/landingpage-zeile.ts`
- Test: `frontend/src/landingpages/__tests__/landingpage-zeile.test.ts`

- [ ] **Schritt 1: Den fehlschlagenden Test schreiben**

`frontend/src/landingpages/__tests__/landingpage-zeile.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  zeileZuConfig,
  configZuSpalten,
  type LandingpageZeile,
} from "../server/landingpage-zeile";
import { KAMPAGNEN } from "../registry";
import type { LandingpageConfig } from "../typen";

/**
 * Baut aus einer Konfiguration die Zeile, die in der Datenbank landen würde —
 * inklusive des Umwegs durch JSON. Genau diesen Weg nehmen die Daten durch
 * Postgres: Was `JSON.stringify` verliert, ist auch in der Datenbank verloren.
 */
function alsZeile(config: LandingpageConfig): LandingpageZeile {
  const spalten = configZuSpalten(config, {
    vertraulich: true,
    arbeitgeberId: null,
    status: "veroeffentlicht",
  });

  return {
    id: "11111111-2222-3333-4444-555555555555",
    slug: spalten.slug,
    arbeitgeber_id: spalten.arbeitgeber_id,
    vertraulich: spalten.vertraulich,
    status: spalten.status,
    veroeffentlicht_am: "2026-09-23T10:00:00.000Z",
    config: JSON.parse(JSON.stringify(spalten.config)),
    erstellt_am: "2026-09-23T10:00:00.000Z",
    geaendert_am: "2026-09-23T10:00:00.000Z",
  };
}

describe.each(KAMPAGNEN.map((k) => [k.slug, k] as const))(
  "Rundlauf %s",
  (slug, config) => {
    it("ergibt nach dem Weg durch die Datenbank dieselbe Konfiguration", () => {
      // Der eigentliche Nachweis für Schritt 2: Ist die Konfiguration
      // identisch, ist die Seite identisch — die Komponenten haben keinen
      // eigenen Zustand.
      expect(zeileZuConfig(alsZeile(config))).toEqual(config);
    });

    it("übernimmt den Slug in die eigene Spalte", () => {
      expect(configZuSpalten(config, {
        vertraulich: true,
        arbeitgeberId: null,
        status: "entwurf",
      }).slug).toBe(slug);
    });
  },
);

describe("configZuSpalten", () => {
  const config = KAMPAGNEN[0];

  it("setzt bei einem Entwurf kein Veröffentlichungsdatum", () => {
    const s = configZuSpalten(config, {
      vertraulich: true,
      arbeitgeberId: null,
      status: "entwurf",
    });
    expect(s.status).toBe("entwurf");
    expect(s.veroeffentlicht_am).toBeNull();
  });

  it("setzt beim Veröffentlichen ein Datum", () => {
    const s = configZuSpalten(config, {
      vertraulich: true,
      arbeitgeberId: null,
      status: "veroeffentlicht",
    });
    // Die Datenbank hat eine Bedingung darauf: veröffentlicht ohne Datum
    // wird abgewiesen.
    expect(s.veroeffentlicht_am).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("übernimmt ein vorgegebenes Datum, statt es zu überschreiben", () => {
    // Beim Bearbeiten einer bereits veröffentlichten Seite darf das
    // ursprüngliche Datum nicht verrutschen — die Übersicht sortiert danach.
    const s = configZuSpalten(config, {
      vertraulich: true,
      arbeitgeberId: null,
      status: "veroeffentlicht",
      veroeffentlichtAm: "2026-09-23T10:00:00.000Z",
    });
    expect(s.veroeffentlicht_am).toBe("2026-09-23T10:00:00.000Z");
  });
});

describe("zeileZuConfig", () => {
  const gute = alsZeile(KAMPAGNEN[0]);

  it("weist eine Zeile ab, deren Slug nicht zur Konfiguration passt", () => {
    // Zwei Wahrheiten über dieselbe Adresse: Die Spalte bestimmt die Route,
    // die Konfiguration den Inhalt. Laufen sie auseinander, zeigt /stellen/a
    // den Inhalt von b.
    const zeile = { ...gute, slug: "ein-anderer-slug" };
    expect(() => zeileZuConfig(zeile)).toThrow(/slug/i);
  });

  it("weist eine Zeile ohne Konfiguration ab", () => {
    const zeile = { ...gute, config: null };
    expect(() => zeileZuConfig(zeile as unknown as LandingpageZeile)).toThrow();
  });

  it("weist eine Konfiguration ab, die die Prüfregeln verletzt", () => {
    // Sonst könnte eine von Hand in der Datenbank verunstaltete Zeile eine
    // halbe Seite ausliefern.
    const kaputt = JSON.parse(JSON.stringify(gute.config));
    kaputt.vorteile = [];
    const zeile = { ...gute, config: kaputt };
    expect(() => zeileZuConfig(zeile)).toThrow(/vorteile/i);
  });
});
```

- [ ] **Schritt 2: Test laufen lassen — er muss fehlschlagen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run src/landingpages/__tests__/landingpage-zeile.test.ts
```

Erwartet: FAIL mit „Failed to resolve import "../server/landingpage-zeile"".

- [ ] **Schritt 3: Die Umwandlung schreiben**

`frontend/src/landingpages/server/landingpage-zeile.ts`:

```ts
// Umwandlung zwischen LandingpageConfig und einer Zeile der Tabelle
// `landingpages`.
//
// Kein `server-only`: Diese Datei enthält keine Geheimnisse und wird auch vom
// Test und (im nächsten Plan) vom Anlegen-Formular gebraucht.
//
// Der Slug steht an zwei Stellen — als Spalte und in der Konfiguration. Die
// Spalte trägt den Eindeutigkeitsindex und bestimmt die Route, die
// Konfiguration den Inhalt. Beide müssen übereinstimmen; `zeileZuConfig`
// weigert sich, wenn sie das nicht tun.

import type { LandingpageConfig } from "../typen";
import { pruefeLandingpage } from "../pruefung";

export type LandingpageStatus = "entwurf" | "veroeffentlicht";

/** Eine Zeile der Tabelle `landingpages`, so wie Supabase sie liefert. */
export type LandingpageZeile = {
  id: string;
  slug: string;
  arbeitgeber_id: string | null;
  vertraulich: boolean;
  status: LandingpageStatus;
  veroeffentlicht_am: string | null;
  config: unknown;
  erstellt_am: string;
  geaendert_am: string;
};

/** Die Spalten, die beim Schreiben gesetzt werden. */
export type LandingpageSpalten = {
  slug: string;
  arbeitgeber_id: string | null;
  vertraulich: boolean;
  status: LandingpageStatus;
  veroeffentlicht_am: string | null;
  config: LandingpageConfig;
};

export type SchreibAngaben = {
  vertraulich: boolean;
  arbeitgeberId: string | null;
  status: LandingpageStatus;
  /**
   * Nur beim Bearbeiten einer bereits veröffentlichten Seite mitgeben — sonst
   * verrutscht das Datum, nach dem die Übersicht sortiert.
   */
  veroeffentlichtAm?: string;
};

export function configZuSpalten(
  config: LandingpageConfig,
  angaben: SchreibAngaben,
): LandingpageSpalten {
  const veroeffentlicht = angaben.status === "veroeffentlicht";

  return {
    slug: config.slug,
    arbeitgeber_id: angaben.arbeitgeberId,
    vertraulich: angaben.vertraulich,
    status: angaben.status,
    // Die Datenbank hat eine Bedingung darauf: veröffentlicht ohne Datum
    // wird abgewiesen.
    veroeffentlicht_am: veroeffentlicht
      ? (angaben.veroeffentlichtAm ?? new Date().toISOString())
      : null,
    config,
  };
}

/**
 * Liest die Konfiguration aus einer Zeile — und weigert sich bei jeder
 * Unstimmigkeit.
 *
 * Streng zu sein ist hier richtig: Eine halb gültige Konfiguration würde eine
 * halbe Seite ausliefern, und das fällt erst auf, wenn ein Bewerber davor
 * sitzt. Ein Fehler beim Lesen führt zu einem 404 — unschön, aber ehrlich.
 */
export function zeileZuConfig(zeile: LandingpageZeile): LandingpageConfig {
  if (!zeile.config || typeof zeile.config !== "object") {
    throw new Error(
      `Landingpage ${zeile.slug}: config ist leer oder kein Objekt.`,
    );
  }

  const config = zeile.config as LandingpageConfig;

  if (config.slug !== zeile.slug) {
    throw new Error(
      `Landingpage ${zeile.slug}: Der Slug in der Konfiguration lautet ` +
        `„${config.slug}“. Zwei Wahrheiten über dieselbe Adresse — die Seite ` +
        `würde den Inhalt einer anderen zeigen.`,
    );
  }

  const befunde = pruefeLandingpage(config);
  if (befunde.length > 0) {
    throw new Error(
      `Landingpage ${zeile.slug} ist unvollständig:\n` +
        befunde.map((b) => `  ${b.feld}: ${b.text}`).join("\n"),
    );
  }

  return config;
}
```

- [ ] **Schritt 4: Test laufen lassen — er muss bestehen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run src/landingpages/__tests__/landingpage-zeile.test.ts
```

Erwartet: PASS. Bei zwei Kampagnen sind das 4 + 3 + 3 = 10 Tests.

Der erste Test — „ergibt nach dem Weg durch die Datenbank dieselbe
Konfiguration" — ist der Gleichheitsnachweis für Schritt 2. Schlägt er fehl,
verliert die Umwandlung etwas, und die Umstellung darf nicht weitergehen.

- [ ] **Schritt 5: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/landingpages/server/landingpage-zeile.ts frontend/src/landingpages/__tests__/landingpage-zeile.test.ts && git commit -m "Umwandlung zwischen Konfiguration und Datenbankzeile

Der Rundlauf-Test führt durch echtes JSON — genau den Weg, den die
Daten durch Postgres nehmen. Ist die Konfiguration nach dem Rundlauf
identisch, ist die Seite identisch: Die Komponenten der Engine rechnen
nur mit der Konfiguration.

zeileZuConfig weigert sich bei jeder Unstimmigkeit. Eine halb gültige
Konfiguration würde eine halbe Seite ausliefern, und das fällt erst
auf, wenn ein Bewerber davor sitzt."
```

---

## Aufgabe 9: Lesen aus der Datenbank

Die öffentliche Route liest mit dem **Service-Role-Schlüssel**, nicht mit dem
Anon-Schlüssel: Sie wird zur Bauzeit und für unangemeldete Besucher gerendert,
und `anon` hat auf der Tabelle keine Rechte. Dieselben Variablen wie
`lead-speicher.ts` — `RECRUITING_SUPABASE_URL` und
`RECRUITING_SUPABASE_SERVICE_ROLE_KEY`, beide bereits in Vercel eingerichtet.

**Dateien:**
- Anlegen: `frontend/src/landingpages/server/landingpage-quelle.ts`

- [ ] **Schritt 1: Den Datenzugriff schreiben**

`frontend/src/landingpages/server/landingpage-quelle.ts`:

```ts
import "server-only";

// Lesender Zugriff auf die Tabelle `landingpages` für die öffentliche Route.
//
// Mit dem Service-Role-Schlüssel, nicht mit dem Anon-Schlüssel: Die Route
// rendert zur Bauzeit und für unangemeldete Besucher, und `anon` hat auf der
// Tabelle keine Rechte. `server-only` bricht den Build, falls diese Datei
// versehentlich in eine Client-Komponente gerät.
//
// Fehlt die Konfiguration oder ist die Datenbank nicht erreichbar, liefern
// beide Funktionen ein leeres Ergebnis statt zu werfen. Grund: Die Route
// fällt dann auf die Registry zurück, und die beiden Bestandskampagnen
// bleiben erreichbar. Eine nicht erreichbare Datenbank darf die laufenden
// Anzeigen nicht abschalten.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LandingpageConfig } from "../typen";
import { zeileZuConfig, type LandingpageZeile } from "./landingpage-zeile";

export const TABELLE = "landingpages";

const SPALTEN =
  "id, slug, arbeitgeber_id, vertraulich, status, veroeffentlicht_am, config, erstellt_am, geaendert_am";

let client: SupabaseClient | null = null;

function holeClient(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.RECRUITING_SUPABASE_URL;
  const key = process.env.RECRUITING_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/** Slugs aller veröffentlichten Landingpages — für generateStaticParams. */
export async function ladeVeroeffentlichteSlugs(): Promise<string[]> {
  const supabase = holeClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABELLE)
    .select("slug")
    .eq("status", "veroeffentlicht");

  if (error) {
    console.error("[landingpage-quelle] Slugs nicht lesbar:", error.message);
    return [];
  }

  return (data ?? []).map((z) => z.slug as string);
}

/**
 * Eine veröffentlichte Landingpage — oder `null`.
 *
 * Entwürfe liefert diese Funktion bewusst nicht: Sie ist die Quelle der
 * öffentlichen Route, und ein Entwurf hat dort nichts zu suchen.
 */
export async function ladeVeroeffentlichteLandingpage(
  slug: string,
): Promise<LandingpageConfig | null> {
  const supabase = holeClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABELLE)
    .select(SPALTEN)
    .eq("slug", slug)
    .eq("status", "veroeffentlicht")
    .maybeSingle();

  if (error) {
    console.error(`[landingpage-quelle] ${slug} nicht lesbar:`, error.message);
    return null;
  }
  if (!data) return null;

  try {
    return zeileZuConfig(data as LandingpageZeile);
  } catch (e) {
    // Eine unvollständige Zeile führt zum Rückfall auf die Registry oder zu
    // einem 404 — nicht zu einer halben Seite. Der Fehler steht im Protokoll,
    // damit er auffällt.
    console.error(
      `[landingpage-quelle] ${slug} ist unbrauchbar:`,
      e instanceof Error ? e.message : e,
    );
    return null;
  }
}
```

- [ ] **Schritt 2: Übersetzen lassen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx tsc --noEmit 2>&1 | grep "landingpage-quelle\|landingpage-zeile" || echo "Keine Fehler in den neuen Dateien"
```

Erwartet: „Keine Fehler in den neuen Dateien".

- [ ] **Schritt 3: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/landingpages/server/landingpage-quelle.ts && git commit -m "Lesender Zugriff auf die Landingpage-Tabelle

Liefert bei nicht erreichbarer Datenbank ein leeres Ergebnis statt zu
werfen: Die Route fällt dann auf die Registry zurück. Eine gestörte
Datenbank darf die laufenden Anzeigen nicht abschalten."
```

---

## Aufgabe 10: Die öffentliche Route auf die Datenbank umstellen

Die Route liest zuerst aus der Datenbank. Findet sie dort nichts, greift die
Registry. Damit sind die beiden Bestandskampagnen zu jedem Zeitpunkt
erreichbar — vor der Übernahme über die Registry, danach aus der Datenbank,
und wenn die Datenbank ausfällt, wieder über die Registry.

**Grenze dieses Plans:** Neu veröffentlichte Seiten brauchen eine
Neuvalidierung (`revalidatePath`), damit sie ohne Deployment erscheinen. Die
gehört an den Veröffentlichen-Knopf und entsteht deshalb im Plan zu Schritt 3.
Bis dahin gilt: Was nach dem letzten Deployment in die Datenbank kommt, wird
beim ersten Aufruf dynamisch gerendert (`dynamicParams` ist ab Werk `true`).

**Dateien:**
- Ändern: `frontend/src/app/stellen/[kampagne]/page.tsx`

- [ ] **Schritt 1: Die Route umstellen**

In `frontend/src/app/stellen/[kampagne]/page.tsx` die Import-Zeile der
Registry ergänzen und die drei Funktionen anpassen. Der Rest der Datei —
`BASIS_URL`, das JSX im Standard-Export — bleibt unverändert.

Die Importe oben:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KAMPAGNEN, findeKampagne, kampagnenPfad } from "../../../landingpages/registry";
import {
  ladeVeroeffentlichteSlugs,
  ladeVeroeffentlichteLandingpage,
} from "../../../landingpages/server/landingpage-quelle";
import type { LandingpageConfig } from "../../../landingpages/typen";
import {
  Kopfbereich,
  Hero,
  Vorteilsleiste,
  Gegenueberstellung,
  Ablauf,
  LandingFooter,
} from "../../../landingpages/komponenten/Abschnitte";
import Funnel from "../../../landingpages/komponenten/Funnel";
import PixelLader from "../../../landingpages/komponenten/PixelLader";
```

Direkt unter `const BASIS_URL = "https://www.phe-perm.de";` einfügen:

```tsx
/**
 * Konfiguration einer Landingpage — aus der Datenbank, sonst aus der Registry.
 *
 * Die Reihenfolge ist Absicht: Die Datenbank ist ab jetzt die Wahrheit, die
 * Registry der Rückfall für die beiden Kampagnen, die es vor der Umstellung
 * schon gab. Sie bleibt bestehen, bis die Datenbankfassung nachweislich
 * dasselbe liefert — und sie trägt außerdem, wenn die Datenbank gerade nicht
 * erreichbar ist. Laufende Anzeigen dürfen nicht an einer Datenbankstörung
 * scheitern.
 */
async function holeConfig(slug: string): Promise<LandingpageConfig | undefined> {
  const ausDatenbank = await ladeVeroeffentlichteLandingpage(slug);
  if (ausDatenbank) return ausDatenbank;
  return findeKampagne(slug);
}
```

`generateStaticParams` ersetzen:

```tsx
export async function generateStaticParams() {
  // Beide Quellen, doppelte Slugs entfernt. Nach der Übernahme stehen die
  // Bestandskampagnen in beiden — vorgerendert wird jede genau einmal.
  const ausDatenbank = await ladeVeroeffentlichteSlugs();
  const ausRegistry = KAMPAGNEN.map((k) => k.slug);
  const alle = [...new Set([...ausDatenbank, ...ausRegistry])];
  return alle.map((slug) => ({ kampagne: slug }));
}
```

In `generateMetadata` die Zeile

```tsx
  const config = findeKampagne(kampagne);
```

ersetzen durch

```tsx
  const config = await holeConfig(kampagne);
```

Und in `StellenLandingpage` dieselbe Zeile:

```tsx
  const config = await holeConfig(kampagne);
```

- [ ] **Schritt 2: Bauen — die Seiten müssen entstehen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run build 2>&1 | grep -E "stellen|Error|error" | head -20
```

Erwartet: Beide Slugs erscheinen in der Liste der Routen
(`/stellen/kaeltetechniker-koeln`, `/stellen/kaeltetechniker-deutschland`),
keine Fehler. Die Tabelle ist zu diesem Zeitpunkt noch leer — die Seiten
entstehen also über den Rückfall auf die Registry. Genau das ist der Beweis,
dass der Rückfall greift.

- [ ] **Schritt 3: Die Seiten vergleichen**

Dieser Schritt hält fest, wie die Seiten **vor** der Übernahme aussehen.
Aufgabe 11 vergleicht danach dagegen.

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run dev
```

In einem zweiten Terminal:

```bash
mkdir -p /tmp/lp-vergleich
for slug in kaeltetechniker-koeln kaeltetechniker-deutschland; do
  curl -s "http://localhost:3000/stellen/$slug" > "/tmp/lp-vergleich/$slug.vorher.html"
  echo "$slug: $(wc -c < "/tmp/lp-vergleich/$slug.vorher.html") Bytes"
done
```

Erwartet: Zwei Dateien mit jeweils deutlich über 10.000 Bytes. Die Zahlen
notieren.

- [ ] **Schritt 4: Alle Tests laufen lassen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npx vitest run 2>&1 | tail -10
```

Erwartet: Alle Dateien bestehen. Die Route selbst hat keinen Test — sie wird
in Schritt 3 und in Aufgabe 11 über das ausgelieferte HTML geprüft, was hier
mehr aussagt als ein Test der Verdrahtung.

- [ ] **Schritt 5: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add "frontend/src/app/stellen/[kampagne]/page.tsx" && git commit -m "Öffentliche Landingpage-Route liest aus der Datenbank

Datenbank zuerst, Registry als Rückfall. Damit sind die beiden
Bestandskampagnen zu jedem Zeitpunkt erreichbar: vor der Übernahme
über die Registry, danach aus der Datenbank — und bei einer
Datenbankstörung wieder über die Registry.

Noch ohne revalidatePath: Das gehört an den Veröffentlichen-Knopf
und entsteht mit Schritt 3."
```

---

## Aufgabe 11: Übersicht der Landingpages im internen Bereich

Diese Ansicht kommt **vor** der Übernahme, nicht danach: Sie ist das Fenster,
durch das die Übernahme in Aufgabe 12 überhaupt beobachtbar ist. Vorher zeigt
sie den Leerzustand — auch das will gesehen werden, denn genau den sieht man
beim ersten Öffnen der App.

Gelesen wird mit dem **angemeldeten** Konto, nicht mit dem Service-Role-
Schlüssel. Damit greift die RLS-Policy aus Aufgabe 7, und sie ist nebenbei
erwiesen: Zeigt die Liste Daten, funktioniert die Policy.

**Dateien:**
- Anlegen: `frontend/src/app/intern/(geschuetzt)/landingpages/page.tsx`

- [ ] **Schritt 1: Die Übersicht schreiben**

`frontend/src/app/intern/(geschuetzt)/landingpages/page.tsx`:

```tsx
import { internSupabaseServer } from "../../../../intern/supabase-server";

// Übersicht aller Landingpages.
//
// Liest mit dem angemeldeten Konto, nicht mit dem Service-Role-Schlüssel:
// Damit greift die RLS-Policy, und sie ist nebenbei erwiesen — zeigt die
// Liste Daten, funktioniert die Policy.

type Zeile = {
  id: string;
  slug: string;
  status: "entwurf" | "veroeffentlicht";
  vertraulich: boolean;
  veroeffentlicht_am: string | null;
  geaendert_am: string;
  config: { position?: string; einsatzgebiet?: string } | null;
};

function alsDatum(wert: string | null): string {
  if (!wert) return "—";
  return new Date(wert).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function LandingpageUebersicht() {
  const supabase = await internSupabaseServer();

  const { data, error } = await supabase
    .from("landingpages")
    .select("id, slug, status, vertraulich, veroeffentlicht_am, geaendert_am, config")
    // Veröffentlichte zuerst, innerhalb dessen die neuesten oben.
    .order("status", { ascending: true })
    .order("veroeffentlicht_am", { ascending: false, nullsFirst: false });

  if (error) {
    return (
      <main className="in-innen">
        <p className="in-fehler" role="alert">
          Die Landingpages sind nicht abrufbar: {error.message}
        </p>
      </main>
    );
  }

  const zeilen = (data ?? []) as Zeile[];

  return (
    <main className="in-innen">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
        Landingpages
      </h2>
      <p style={{ fontSize: 14, color: "var(--gray)", margin: "0 0 18px" }}>
        {zeilen.length === 0
          ? "Noch keine in der Datenbank."
          : `${zeilen.length} ${zeilen.length === 1 ? "Seite" : "Seiten"}`}
      </p>

      {zeilen.length === 0 ? (
        <div className="in-karte">
          <p className="in-leer" style={{ padding: "8px 0" }}>
            Die beiden bestehenden Kampagnen liegen noch als Dateien im
            Repository. Sie werden mit dem nächsten Schritt übernommen.
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {zeilen.map((z) => (
            <li key={z.id}>
              <a
                className="in-zeile"
                href={`/stellen/${z.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <b>{z.config?.position ?? z.slug}</b>
                <span>
                  {z.config?.einsatzgebiet ? `${z.config.einsatzgebiet} · ` : ""}
                  /stellen/{z.slug}
                </span>
                <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
                  <span
                    className={
                      z.status === "veroeffentlicht"
                        ? "in-marke in-marke--live"
                        : "in-marke in-marke--entwurf"
                    }
                  >
                    {z.status === "veroeffentlicht" ? "Online" : "Entwurf"}
                  </span>
                  {z.vertraulich && (
                    <span className="in-marke" style={{ color: "var(--gray)", background: "var(--fog)" }}>
                      Vertraulich
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "var(--gray)", marginLeft: "auto" }}>
                    {z.status === "veroeffentlicht"
                      ? `seit ${alsDatum(z.veroeffentlicht_am)}`
                      : `geändert ${alsDatum(z.geaendert_am)}`}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Schritt 2: Den Leerzustand prüfen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run dev
```

`http://localhost:3000/intern/landingpages` aufrufen (angemeldet). Erwartet:

1. Überschrift „Landingpages", darunter „Noch keine in der Datenbank."
2. Eine Karte mit dem Hinweis auf die Übernahme
3. In der unteren Leiste ist „Landingpages" blau, „Start" grau

Steht dort stattdessen eine Fehlermeldung mit `permission denied`, greift die
RLS-Policy nicht — dann Aufgabe 7, Schritt 3 wiederholen.

- [ ] **Schritt 3: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add "frontend/src/app/intern/(geschuetzt)/landingpages" && git commit -m "Übersicht der Landingpages im internen Bereich

Liest mit dem angemeldeten Konto statt mit dem Service-Role-Schlüssel:
Damit greift die RLS-Policy — und ist nebenbei erwiesen."
```

---

## Aufgabe 12: Übernahme der beiden Bestandskampagnen

Die Übernahme läuft über einen Endpunkt im internen Bereich, nicht über ein
Skript im Terminal. Zwei Gründe: Ein `.mjs`-Skript kann die Kampagnen nicht
importieren, weil sie TypeScript sind — und ein Werkzeug, dessen erklärtes Ziel
„kein Rechner mehr" ist, sollte seinen eigenen ersten Schritt nicht am
Terminal verlangen.

Der Endpunkt ist **wiederholbar**: Ein zweiter Aufruf ändert nichts, was schon
stimmt. Damit lässt er sich gefahrlos anstoßen, wenn unklar ist, ob er schon
gelaufen ist.

**Dateien:**
- Anlegen: `frontend/src/app/api/intern/kampagnen-uebernehmen/route.ts`
- Anlegen: `frontend/src/app/intern/(geschuetzt)/landingpages/UebernahmeKnopf.tsx`
- Ändern: `frontend/src/app/intern/(geschuetzt)/landingpages/page.tsx`

- [ ] **Schritt 1: Den Endpunkt schreiben**

`frontend/src/app/api/intern/kampagnen-uebernehmen/route.ts`:

```ts
import { NextResponse } from "next/server";
import { internSupabaseServer, angemeldeterNutzer } from "../../../../intern/supabase-server";
import { KAMPAGNEN } from "../../../../landingpages/registry";
import { configZuSpalten } from "../../../../landingpages/server/landingpage-zeile";
import { pruefeLandingpage } from "../../../../landingpages/pruefung";

// Überträgt die Kampagnen aus der Registry in die Tabelle `landingpages`.
//
// Wiederholbar: `upsert` auf den Slug. Ein zweiter Aufruf ändert nichts, was
// schon stimmt — der Endpunkt lässt sich also gefahrlos anstoßen, wenn unklar
// ist, ob er schon gelaufen ist.
//
// Geschrieben wird mit dem angemeldeten Konto über die RLS-Policy, nicht mit
// dem Service-Role-Schlüssel. Ein Endpunkt, der Service-Role verwendet,
// umgeht jede Absicherung — hier ist das unnötig.
//
// Die beiden Bestandskampagnen werden als `vertraulich` ohne Arbeitgeber
// übernommen: Sie entstanden, bevor es die Arbeitgeber-Ebene gab, und nennen
// keinen Arbeitgeber. Ihr Veröffentlichungsdatum ist der Tag, an dem sie
// live gingen.
const LIVE_SEIT = "2026-09-23T10:00:00.000Z";

export async function POST() {
  // Der Proxy schützt /api/intern bereits. Hier wird trotzdem gefragt: Ein
  // schreibender Endpunkt soll nicht davon abhängen, dass eine einzige Datei
  // richtig konfiguriert ist.
  const nutzer = await angemeldeterNutzer();
  if (!nutzer) {
    return NextResponse.json({ ok: false, grund: "nicht angemeldet" }, { status: 401 });
  }

  const supabase = await internSupabaseServer();
  const ergebnisse: { slug: string; ok: boolean; hinweis: string }[] = [];

  for (const config of KAMPAGNEN) {
    // Erst prüfen, dann schreiben. Eine unvollständige Konfiguration würde
    // beim Lesen ohnehin abgewiesen — dann läge sie unbrauchbar in der
    // Datenbank.
    const befunde = pruefeLandingpage(config);
    if (befunde.length > 0) {
      ergebnisse.push({
        slug: config.slug,
        ok: false,
        hinweis: befunde.map((b) => `${b.feld}: ${b.text}`).join(" | "),
      });
      continue;
    }

    const spalten = configZuSpalten(config, {
      vertraulich: true,
      arbeitgeberId: null,
      status: "veroeffentlicht",
      veroeffentlichtAm: LIVE_SEIT,
    });

    const { error } = await supabase
      .from("landingpages")
      .upsert(spalten, { onConflict: "slug" });

    ergebnisse.push({
      slug: config.slug,
      ok: !error,
      hinweis: error ? error.message : "übernommen",
    });
  }

  const alleOk = ergebnisse.every((e) => e.ok);
  return NextResponse.json(
    { ok: alleOk, anzahl: ergebnisse.filter((e) => e.ok).length, ergebnisse },
    { status: alleOk ? 200 : 500 },
  );
}
```

- [ ] **Schritt 2: Den Knopf schreiben**

`frontend/src/app/intern/(geschuetzt)/landingpages/UebernahmeKnopf.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Ergebnis = { slug: string; ok: boolean; hinweis: string };

export default function UebernahmeKnopf() {
  const router = useRouter();
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehler, setFehler] = useState(false);

  async function uebernehmen() {
    setLaeuft(true);
    setMeldung(null);
    setFehler(false);

    try {
      const antwort = await fetch("/api/intern/kampagnen-uebernehmen", {
        method: "POST",
      });
      const daten = (await antwort.json()) as {
        ok: boolean;
        anzahl?: number;
        ergebnisse?: Ergebnis[];
      };

      if (daten.ok) {
        setMeldung(
          `${daten.anzahl} ${daten.anzahl === 1 ? "Kampagne" : "Kampagnen"} übernommen.`,
        );
        // Die Liste steht in einer Server-Komponente — ohne refresh() bleibt
        // sie auf dem alten Stand.
        router.refresh();
      } else {
        setFehler(true);
        setMeldung(
          (daten.ergebnisse ?? [])
            .filter((e) => !e.ok)
            .map((e) => `${e.slug}: ${e.hinweis}`)
            .join("\n") || "Die Übernahme ist fehlgeschlagen.",
        );
      }
    } catch (e) {
      setFehler(true);
      setMeldung(e instanceof Error ? e.message : "Die Übernahme ist fehlgeschlagen.");
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="in-karte">
      <p style={{ fontSize: 14, color: "var(--gray)", margin: "0 0 12px" }}>
        Überträgt die Kampagnen aus dem Repository in die Datenbank. Mehrfaches
        Ausführen ändert nichts — bestehende Einträge werden aktualisiert.
      </p>

      {meldung && (
        <p
          className={fehler ? "in-fehler" : undefined}
          role={fehler ? "alert" : "status"}
          style={
            fehler
              ? { whiteSpace: "pre-line" }
              : { fontSize: 14, color: "#14532d", margin: "0 0 12px" }
          }
        >
          {meldung}
        </p>
      )}

      <button
        type="button"
        className="in-knopf in-knopf--still"
        onClick={uebernehmen}
        disabled={laeuft}
      >
        {laeuft ? "Läuft …" : "Bestandskampagnen übernehmen"}
      </button>
    </div>
  );
}
```

- [ ] **Schritt 3: Den Knopf in die Übersicht einbauen**

In `frontend/src/app/intern/(geschuetzt)/landingpages/page.tsx` den Import
ergänzen:

```tsx
import UebernahmeKnopf from "./UebernahmeKnopf";
```

Und im `return`, unmittelbar **vor** dem schließenden `</main>`, einfügen:

```tsx
      <UebernahmeKnopf />
```

Der Knopf bleibt dauerhaft sichtbar, nicht nur im Leerzustand: Nach einer
Änderung an einer Kampagnendatei im Repository ist er der Weg, sie in die
Datenbank nachzuziehen.

- [ ] **Schritt 4: Die Übernahme ausführen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend && npm run dev
```

`http://localhost:3000/intern/landingpages` aufrufen, „Bestandskampagnen
übernehmen" antippen. Erwartet:

1. „2 Kampagnen übernommen."
2. Die Liste zeigt zwei Einträge mit Position, Einsatzgebiet und dem Pfad
3. Beide tragen „Online" (grün) und „Vertraulich" (grau)
4. Als Datum steht bei beiden „seit 23.09.2026"

- [ ] **Schritt 5: Wiederholbarkeit prüfen**

Den Knopf ein zweites Mal antippen. Erwartet: erneut „2 Kampagnen übernommen",
und die Liste hat **weiterhin zwei** Einträge — nicht vier.

Im SQL Editor gegenprüfen:

```sql
select slug, status, vertraulich, veroeffentlicht_am,
       config->>'position' as position
from public.landingpages
order by slug;
```

Erwartet: genau zwei Zeilen.

- [ ] **Schritt 6: Der Gleichheitsnachweis**

Der wichtigste Schritt dieses Plans. Die Seiten kommen jetzt aus der
Datenbank — sie müssen Zeichen für Zeichen dieselben sein wie vorher.

Bei laufendem `npm run dev`:

```bash
for slug in kaeltetechniker-koeln kaeltetechniker-deutschland; do
  curl -s "http://localhost:3000/stellen/$slug" > "/tmp/lp-vergleich/$slug.nachher.html"
  echo "── $slug ──"
  if diff -q "/tmp/lp-vergleich/$slug.vorher.html" "/tmp/lp-vergleich/$slug.nachher.html" > /dev/null; then
    echo "  identisch"
  else
    echo "  UNTERSCHIED:"
    diff "/tmp/lp-vergleich/$slug.vorher.html" "/tmp/lp-vergleich/$slug.nachher.html" | head -30
  fi
done
```

Erwartet: beide „identisch".

Gibt es Unterschiede, sind nur zwei Erklärungen zulässig:

- **Abweichende Kennungen von React** (`$L5`, `self.__next_f`) oder ein
  Zeitstempel. Unschädlich — sie ändern sich bei jedem Aufruf. Zum Prüfen den
  Vergleich auf den sichtbaren Text beschränken:

  ```bash
  for slug in kaeltetechniker-koeln kaeltetechniker-deutschland; do
    for wann in vorher nachher; do
      sed -e 's/<[^>]*>/ /g' -e 's/  */ /g' "/tmp/lp-vergleich/$slug.$wann.html" \
        > "/tmp/lp-vergleich/$slug.$wann.txt"
    done
    echo "── $slug (nur Text) ──"
    diff "/tmp/lp-vergleich/$slug.vorher.txt" "/tmp/lp-vergleich/$slug.nachher.txt" \
      && echo "  Text identisch"
  done
  ```

  Der Textvergleich **muss** „Text identisch" ergeben.

- **Alles andere ist ein Fehler.** Dann ist die Umwandlung unvollständig:
  Aufgabe 8 erneut prüfen, die Übernahme rückgängig machen
  (`delete from public.landingpages;`) und nicht weitergehen.

- [ ] **Schritt 7: Alle Tests und Qualitätsprüfungen**

```bash
cd ~/Desktop/Projekte/phe-2026/frontend
echo "── Tests ──"; npx vitest run 2>&1 | tail -8
echo "── Übersetzung ──"; npx tsc --noEmit 2>&1 | grep -c "error TS"
echo "── Lint ──"; npm run lint 2>&1 | tail -5
echo "── Build ──"; npm run build 2>&1 | tail -8
```

Erwartet:
- Tests: alle Dateien bestehen
- Übersetzung: dieselbe Zahl wie vor diesem Plan (Bestand: 11 alte
  Testdateien). **Nicht** aufräumen.
- Lint: dieselbe Zahl wie vorher (Bestand: 25 Befunde)
- Build: ohne Fehler, beide `/stellen/`-Routen in der Liste

- [ ] **Schritt 8: Übernehmen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git add frontend/src/app/api/intern/kampagnen-uebernehmen "frontend/src/app/intern/(geschuetzt)/landingpages" && git commit -m "Übernahme der Bestandskampagnen in die Datenbank

Als Endpunkt mit Knopf, nicht als Terminal-Skript: Ein .mjs-Skript
kann die Kampagnen nicht importieren, weil sie TypeScript sind — und
ein Werkzeug gegen den Rechnerzwang sollte seinen ersten Schritt nicht
am Terminal verlangen.

Wiederholbar über upsert auf den Slug. Schreibt mit dem angemeldeten
Konto über die RLS-Policy, nicht mit Service-Role.

Nachgewiesen: Die ausgelieferten Seiten sind vor und nach der
Umstellung textgleich."
```

---

## Abschluss: Auf die Produktion bringen

- [ ] **Schritt 1: Die Migration in der Produktionsdatenbank ausführen**

Sie lief in Aufgabe 7 schon — es ist dieselbe Datenbank
(`lkmrsvvgisdthvlqjhdk`), lokal und in Produktion. Zur Sicherheit im SQL
Editor gegenprüfen:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('arbeitgeber', 'landingpages');
```

Erwartet: beide Zeilen.

- [ ] **Schritt 2: Die zwei Umgebungsvariablen in Vercel eintragen**

```bash
cd ~/Desktop/Projekte/phe-2026 && npx vercel env add NEXT_PUBLIC_RECRUITING_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY production
```

Beide auch für `preview` anlegen, sonst lässt sich der interne Bereich in
Vorschau-Deployments nicht öffnen:

```bash
npx vercel env add NEXT_PUBLIC_RECRUITING_SUPABASE_URL preview
npx vercel env add NEXT_PUBLIC_RECRUITING_SUPABASE_ANON_KEY preview
```

`NEXT_PUBLIC_`-Variablen werden beim Bauen in das Bündel geschrieben, nicht zur
Laufzeit gelesen. Wer sie nachträgt, muss neu deployen — ein Neustart genügt
nicht.

- [ ] **Schritt 3: Deployen**

```bash
cd ~/Desktop/Projekte/phe-2026 && git push
```

Vercel baut automatisch. Den Build abwarten und das Protokoll auf Fehler
durchsehen.

- [ ] **Schritt 4: In Produktion prüfen**

```bash
echo "── Öffentliche Seiten unverändert erreichbar ──"
for slug in kaeltetechniker-koeln kaeltetechniker-deutschland; do
  printf "  %-32s " "$slug"
  curl -s -o /dev/null -w "HTTP %{http_code}\n" "https://www.phe-perm.de/stellen/$slug"
done

echo "── Interner Bereich verlangt Anmeldung ──"
curl -s -o /dev/null -w "  /intern → HTTP %{http_code} nach %{redirect_url}\n" \
  "https://www.phe-perm.de/intern"

echo "── Manifest und Symbol ohne Anmeldung erreichbar ──"
curl -s -o /dev/null -w "  Manifest → HTTP %{http_code}\n" \
  "https://www.phe-perm.de/intern/manifest.webmanifest"
curl -s -o /dev/null -w "  Symbol   → HTTP %{http_code}\n" \
  "https://www.phe-perm.de/intern/symbol/192"
```

Erwartet:
- Beide Landingpages: `HTTP 200`
- `/intern`: `HTTP 307` mit Weiterleitung auf `/intern/anmelden`
- Manifest und Symbol: `HTTP 200`

- [ ] **Schritt 5: Die Übernahme in Produktion ausführen**

Auf dem Handy `https://www.phe-perm.de/intern` öffnen, anmelden, zu
„Landingpages" wechseln, „Bestandskampagnen übernehmen" antippen.

Danach beide Landingpages im Browser aufrufen und ansehen — nicht nur den
Statuscode prüfen. Hero, Vorteile, Gegenüberstellung, Ablauf und Funnel müssen
aussehen wie vorher.

- [ ] **Schritt 6: Die App auf den Startbildschirm legen**

Wie in Aufgabe 5, Schritt 4 beschrieben. Damit ist das Ziel von Schritt 1 und
2 erreicht.

- [ ] **Schritt 7: Die Dokumentation nachziehen**

In `CLAUDE.md` des Projekts unter „Fallstricke" ergänzen:

```markdown
- **Der interne Bereich liegt unter `/intern` und nutzt ein eigenes
  Supabase-Projekt.** `NEXT_PUBLIC_RECRUITING_SUPABASE_URL` zeigt auf die
  CRM-Datenbank (`lkmrsvvgisdthvlqjhdk`), `NEXT_PUBLIC_SUPABASE_URL` auf die
  ATS-Datenbank des FastAPI-Backends. Zwei verschiedene Projekte — nicht
  verwechseln, und keines der beiden durch das andere ersetzen.
- **Der Zugriffsschutz steht in `frontend/src/proxy.ts`.** In Next.js 16 heißt
  diese Datei nicht mehr `middleware.ts`. Sie prüft optimistisch anhand der
  Cookies; die verbindliche Prüfung steht im Layout der Route-Gruppe
  `(geschuetzt)`.
- **Landingpages kommen aus der Tabelle `landingpages`**, die Registry in
  `src/landingpages/registry.ts` ist nur noch Rückfall. Eine Änderung an einer
  Kampagnendatei wirkt erst, wenn sie über „Bestandskampagnen übernehmen" im
  internen Bereich in die Datenbank gezogen wurde.
- **Es gibt noch kein `revalidatePath`.** Was nach dem letzten Deployment in
  die Datenbank kommt, wird beim ersten Aufruf dynamisch gerendert. Die
  Neuvalidierung entsteht mit dem Veröffentlichen-Knopf (Schritt 3).
```

In `docs/status.md` den Stand fortschreiben.

```bash
cd ~/Desktop/Projekte/phe-2026 && git add CLAUDE.md docs/status.md && git commit -m "Doku: interner Bereich und Landingpages aus der Datenbank" && git push
```

---

## Was dieser Plan offen lässt

Bewusst und benannt, nicht vergessen:

| Punkt | Wohin es gehört |
|---|---|
| Anlegen und Veröffentlichen vom Handy | Plan zu Schritt 3 |
| `revalidatePath` beim Veröffentlichen | Plan zu Schritt 3 — gehört an den Knopf |
| Arbeitgeber anlegen, Logo-Upload, SVG-Bereinigung | Plan zu Schritt 3 |
| Farben je Arbeitgeber, Ableitung im HSL-Raum, Kontrastprüfung | Plan zu Schritt 3 — greift erst, wenn es Arbeitgeber gibt |
| Vertraulichkeits-Test (Name in Text, Bild, Metadaten, Caption) | Plan zu Schritt 3 — vorher gibt es keine offene Seite zu prüfen |
| Bewerbungen ansehen, Export, Push-Mitteilungen | Plan zu Schritt 4 |
| `landingpage_id` in `recruiting_leads` | Plan zu Schritt 4 |
| Instagram und Google am Veröffentlichen-Knopf, Teilen über das Gerät | Plan zu Schritt 5 |
| Service Worker für den Start ohne Verzögerung | Plan zu Schritt 5 — ohne ihn startet die App etwas langsamer, sonst nichts |
| Löschen der Kampagnendateien aus dem Repository | erst wenn die Datenbankfassung mehrere Wochen getragen hat |

Ebenfalls unverändert offen, unabhängig von diesem Vorhaben: das Löschkonzept
für `recruiting_leads`, die Verifikation der Salesforce-Feldnamen und die
Vereinheitlichung der acht Fahrzeug-Formulierungen in `jobs/data.ts`.

---

## Selbstprüfung des Plans

Gegen die Spezifikation abgeglichen am 29.09.2026.

**Abdeckung Schritt 1 („Anmeldung und Gerüst"):**

| Anforderung der Spec | Aufgabe |
|---|---|
| Supabase Auth, E-Mail und Passwort | 1, 3 |
| Konten legt PHE an, keine Selbstregistrierung | Vorbedingungen — Konten bestehen bereits, nur die Selbstregistrierung ist abzuschalten |
| Alle Routen unter `/intern` geschützt | 2 |
| Keine Rollen | 7 — eine Türliste, keine Rechteverwaltung: beide Personen haben dieselben Rechte. Nötig nur, weil das Projekt mit dem CRM geteilt wird |
| Web-App-Manifest, Symbole | 5 |
| Für den Daumen gebaut, 44 px, 16 px Schrift | 3 (`intern.css`), 4 (Prüfschritt) |
| Untere Leiste zum Wechseln | 4 |
| Am Rechner dieselbe Oberfläche | 3 (`@media (min-width: 768px)`) |

**Abdeckung Schritt 2 („Landingpages aus der Datenbank"):**

| Anforderung der Spec | Aufgabe |
|---|---|
| Tabellen Arbeitgeber und Landingpage | 7 |
| Felder `arbeitgeber_id`, `vertraulich`, `status`, `veroeffentlicht_am` | 7 |
| RLS mit Policies für angemeldete Nutzer | 7, nachgewiesen in 7/3, 7/3b und 7/4 |
| Öffentliche Route aus der Datenbank | 10 |
| Aufbau, Funnel, Lead-Endpunkt unverändert | nicht angefasst — siehe „Bewusst nicht angefasst" |
| Prüfregeln in ein gemeinsames Modul | 6 |
| Übernahme der beiden Kampagnen | 12 |
| Test: dieselben Seiten wie vorher | 8 (Rundlauf), 12/6 (HTML-Vergleich) |
| Code-Dateien bleiben zunächst bestehen | 10 (Registry als Rückfall) |
| Die 116 Tests werden übernommen | 6/6, 12/7 |

**Nicht abgedeckt und begründet:** `revalidatePath` (Aufgabe 10 nennt es als
Grenze), Service Worker, Vertraulichkeits-Test — alle drei brauchen den
Veröffentlichen-Knopf aus Schritt 3, um überhaupt prüfbar zu sein.

**Widerspruch in der Spec, hier entschieden:** `/app` gegen `/intern` —
entschieden für `/intern`, begründet im Abschnitt „Umfang dieses Plans".

**Durchgängigkeit der Bezeichner:** `pruefeLandingpage` (6) wird in 8 und 12
so verwendet. `configZuSpalten` und `zeileZuConfig` (8) werden in 9, 10 und 12
so verwendet. `angemeldeterNutzer` und `internSupabaseServer` (1) werden in 4,
11 und 12 so verwendet. `internSupabaseBrowser` (1) in 3.
`ladeVeroeffentlichteSlugs` und `ladeVeroeffentlichteLandingpage` (9) in 10.
`istGeschuetzt` und `anmeldeZiel` (2) im Test von 2.
