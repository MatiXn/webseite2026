# EPIC 003 — IA Phase 1 (Fundament) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Fundament der neuen Informationsarchitektur (EPIC-002) umsetzen: sprechende Job-URLs mit 301-Weiterleitung, B2B-Pillar-URL, neue Navigation mit Zielgruppen-Weiche, sichtbare Breadcrumbs sowie die Bereinigung von NAP-/Trust-/H1-Inkonsistenzen — ohne bestehende Rankings zu zerstören.

**Architecture:** Reine Slug-/Redirect-Logik wird in eine testbare Utility (`src/lib/slug.ts`) gekapselt und per Vitest TDD abgesichert. Die dynamische Job-Route wird von `[id]` auf `[slug]` umgestellt; die Detailseite löst die Job-ID aus dem Slug-Suffix auf und erzwingt per `permanentRedirect` die kanonische URL (fängt damit automatisch die alten `/jobs/1..25` ab). Die B2B-Seite `talente-finden` wird per Ordner-Umbenennung auf `technische-personalvermittlung` gehoben, alte URL per `next.config`-Redirect (301) umgeleitet. UI-Änderungen (Nav, Weiche, Breadcrumbs, Textkorrekturen) werden über `next build` + gezielte HTTP-/DOM-Prüfungen verifiziert.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19, TypeScript, Vitest (neu, nur für Unit-Tests der reinen Funktionen).

---

## Wichtige Vorentscheidungen (vor Umsetzung bestätigen)

Diese Werte sind im Plan fest verdrahtet. Weichen sie von der GF-Entscheidung ab, an genannter Stelle austauschen:

1. **Kanonische Telefonnummer (NAP):** sichtbares Festnetz `0211 158 63 100` / `+4921115863100` wird kanonisch — auch im Schema. Die Mobil-/WhatsApp-Nummer `+491739980100` wandert im Org-Schema in einen separaten `contactPoint`. → *Falls Mobil kanonisch sein soll: in Task 8 die `telephone`-Werte tauschen.*
2. **Kanonische Reaktionszeit:** überall **„24 Stunden"** (deckt sich mit der wiederholten Garantie). Die beiden Marketing-Stats „12 Std." werden auf „24 Std." vereinheitlicht. → *Falls „12 Std." bevorzugt: in Task 9 Richtung umkehren und die 24-h-Prosa anpassen — dann aber konsequent überall.*
3. **Kanonische Vermittlungsdauer:** Prosa **„3–6 Wochen"**, Stat **„Ø 4 Wo."** (liegt innerhalb der Spanne, konsistent). Home-FAQ „2–6 Wochen" → „3–6 Wochen".
4. **Job-ID bleibt** die bestehende numerische ID (`"1"`…`"25"`) als stabiler Anker. Kein ID-Wechsel in Phase 1 (minimiert Risiko).
5. **Nav verlinkt nur existierende Seiten.** „Berufe"/„Karrierewissen" kommen erst in Phase 2/3, wenn die Seiten existieren — jetzt noch nicht in die Nav.
6. **`talente-finden` wird per Ordner umbenannt** (Inhalt zieht mit auf die Keyword-URL); Phase 2 reichert die Pillar inhaltlich an.

---

## Dateistruktur (Überblick der berührten Dateien)

**Neu:**
- `src/lib/slug.ts` — reine Slug-/ID-Funktionen (Transliteration, `jobSlug`, `jobPath`, `jobIdFromParam`).
- `src/lib/slug.test.ts` — Vitest-Unit-Tests dazu.
- `src/app/components/PathSwitch.tsx` — Zielgruppen-Weiche (Startseite).
- `src/app/components/Breadcrumbs.tsx` — sichtbare Breadcrumbs + `BreadcrumbList`-Schema.
- `vitest.config.ts` — Vitest-Konfiguration.

**Umbenannt (Ordner):**
- `src/app/jobs/[id]/` → `src/app/jobs/[slug]/` (inkl. aller Kind-Dateien).
- `src/app/talente-finden/` → `src/app/technische-personalvermittlung/`.

**Modifiziert:**
- `package.json` (Vitest-Devdeps + Test-Script).
- `next.config.ts` (`redirects()` für `/talente-finden`).
- `src/app/sitemap.ts` (Job-URLs via `jobPath`, talente-URL → pillar).
- `src/app/jobs/[slug]/page.tsx` (ID-Auflösung, Canonical-Redirect, Breadcrumbs).
- `src/app/jobs/[slug]/opengraph-image.tsx`, `social/page.tsx`, `social/{feed,square,story}-image/route.tsx` (Param `id`→`slug`).
- `src/app/jobs/page.tsx` (interne Job-Links via `jobPath`).
- `src/app/components/Nav.tsx` (neue Navigation, `aria-expanded`).
- `src/app/components/Footer.tsx` (Links auf neue URLs).
- `src/app/page.tsx` (Weiche einbinden, B2B-Link, Trust-Zahl).
- `src/app/technische-personalvermittlung/{layout,page}.tsx` (Metadaten, tel-Fix, Schema-URL).
- `src/app/layout.tsx` (NAP-Telefon im Schema + `contactPoint`).
- `src/app/lebenslauf-erstellen/page.tsx` (CV-Template-H1 → Nicht-Heading).

---

## Task-Gruppen (in dieser Reihenfolge; jede Gruppe ist eigenständig committbar)

- **A** — Test-Setup (Vitest)
- **B** — Slug-Utility (TDD)
- **C** — Job-Route auf Slug umstellen + 301
- **D** — talente-finden → technische-personalvermittlung + 301
- **E** — Navigation + Zielgruppen-Weiche
- **F** — Breadcrumbs
- **G** — Konsistenz-Fixes (NAP, Trust-Zahlen, CV-H1)

---

## Task A: Vitest-Test-Setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Vitest als Dev-Dependency installieren**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm install -D vitest@^2
```
Expected: `vitest` erscheint unter `devDependencies`, Installation ohne Fehler.

- [ ] **Step 2: Test-Script in `package.json` ergänzen**

In `package.json` den `scripts`-Block erweitern (neue Zeile nach `"lint"`):

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 3: `vitest.config.ts` anlegen**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Leerlauf prüfen (noch keine Tests)**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npx vitest run
```
Expected: „No test files found" (Exit 0 oder 1) — bestätigt, dass Vitest startet.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: Vitest für Unit-Tests der reinen Funktionen einrichten"
```

---

## Task B: Slug-Utility (TDD)

**Files:**
- Create: `src/lib/slug.ts`
- Test: `src/lib/slug.test.ts`

- [ ] **Step 1: Failing Test schreiben**

Create `src/lib/slug.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { slugify, jobSlug, jobPath, jobIdFromParam } from "./slug";

describe("slugify", () => {
  it("transliteriert Umlaute und ß", () => {
    expect(slugify("Kältetechnik München Straße")).toBe("kaeltetechnik-muenchen-strasse");
  });
  it("entfernt den (m/w/d)-Zusatz", () => {
    expect(slugify("Servicetechniker Kältetechnik (m/w/d)")).toBe("servicetechniker-kaeltetechnik");
  });
  it("macht klein, trennt mit Bindestrich, ohne Rand-/Doppelbindestriche", () => {
    expect(slugify("  SPS-Programmierer / Automatisierung  ")).toBe("sps-programmierer-automatisierung");
  });
});

describe("jobSlug / jobPath", () => {
  const job = { id: "2", title: "Servicetechniker Kältetechnik (m/w/d)", city: "München" };
  it("baut den Slug aus Titel + Stadt", () => {
    expect(jobSlug(job)).toBe("servicetechniker-kaeltetechnik-muenchen");
  });
  it("hängt die ID als stabilen Suffix an", () => {
    expect(jobPath(job)).toBe("/jobs/servicetechniker-kaeltetechnik-muenchen-2");
  });
});

describe("jobIdFromParam", () => {
  it("liest die ID aus dem Slug-Suffix", () => {
    expect(jobIdFromParam("servicetechniker-kaeltetechnik-muenchen-2")).toBe("2");
  });
  it("akzeptiert eine reine numerische Alt-URL", () => {
    expect(jobIdFromParam("1")).toBe("1");
  });
  it("gibt null bei fehlender ID zurück", () => {
    expect(jobIdFromParam("nur-text-ohne-id")).toBeNull();
  });
});
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npx vitest run src/lib/slug.test.ts
```
Expected: FAIL — „Failed to resolve import './slug'" bzw. „slugify is not a function".

- [ ] **Step 3: Minimale Implementierung schreiben**

Create `src/lib/slug.ts`:

```ts
// Zentrale Slug-Logik für sprechende, stabile Job-URLs.
// Kanonische URL-Form: /jobs/<beruf-ort>-<id>

const UMLAUTS: Record<string, string> = {
  ä: "ae", ö: "oe", ü: "ue", ß: "ss",
  Ä: "ae", Ö: "oe", Ü: "ue",
};

/** Wandelt beliebigen Text in einen URL-sicheren Slug (Kleinbuchstaben, Bindestriche, keine Umlaute). */
export function slugify(input: string): string {
  return input
    // (m/w/d)-Varianten entfernen, bevor Klammern zu Bindestrichen werden
    .replace(/\((?:m\/w\/d|w\/m\/d|d\/m\/w|m\/w\/x)\)/gi, " ")
    .replace(/[äöüßÄÖÜ]/g, (ch) => UMLAUTS[ch] ?? ch)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // verbleibende Akzente
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Beruf-Ort-Slug ohne ID. */
export function jobSlug(job: { title: string; city: string }): string {
  return slugify(`${job.title} ${job.city}`);
}

/** Kanonische Job-URL inkl. stabiler ID. */
export function jobPath(job: { id: string; title: string; city: string }): string {
  return `/jobs/${jobSlug(job)}-${job.id}`;
}

/** Extrahiert die Job-ID aus einem Routen-Parameter (Slug mit ID-Suffix ODER reine Alt-ID). */
export function jobIdFromParam(param: string): string | null {
  const suffix = param.match(/-(\d+)$/);
  if (suffix) return suffix[1];
  const pure = param.match(/^(\d+)$/);
  return pure ? pure[1] : null;
}
```

- [ ] **Step 4: Test ausführen, Erfolg bestätigen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npx vitest run src/lib/slug.test.ts
```
Expected: PASS — alle 8 Assertions grün.

- [ ] **Step 5: Commit**

```bash
git add src/lib/slug.ts src/lib/slug.test.ts
git commit -m "feat: Slug-Utility für sprechende Job-URLs (TDD)"
```

---

## Task C: Job-Route auf Slug umstellen + 301

**Files:**
- Rename: `src/app/jobs/[id]/` → `src/app/jobs/[slug]/` (mit allen Kind-Dateien)
- Modify: `src/app/jobs/[slug]/page.tsx`
- Modify: `src/app/jobs/[slug]/opengraph-image.tsx`
- Modify: `src/app/jobs/[slug]/social/page.tsx`
- Modify: `src/app/jobs/[slug]/social/{feed-image,square-image,story-image}/route.tsx` (soweit vorhanden)
- Modify: `src/app/jobs/page.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Ordner per Git umbenennen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && git mv "src/app/jobs/[id]" "src/app/jobs/[slug]"
```
Expected: Ordner heißt jetzt `[slug]`, Git verfolgt die Umbenennung. Prüfen:
```bash
ls "src/app/jobs/[slug]"
```

- [ ] **Step 2: `sitemap.ts` auf `jobPath` umstellen**

In `src/app/sitemap.ts`:
- Import ergänzen (oben, neben dem bestehenden JOBS-Import):
```ts
import { jobPath } from "../lib/slug";
```
- Die `jobPages`-Map (aktuell `url: \`${base}/jobs/${job.id}\``) ersetzen durch:
```ts
  const jobPages: MetadataRoute.Sitemap = JOBS.map((job) => ({
    url: `${base}${jobPath(job)}`,
    lastModified: new Date(job.datePosted),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
```

- [ ] **Step 3: `jobs/page.tsx` interne Links auf `jobPath` umstellen**

In `src/app/jobs/page.tsx`:
- Import ergänzen:
```ts
import { jobPath } from "../../lib/slug";
```
- Jede interne Verlinkung auf die Detailseite (Job-Titel-`<Link>` bei ~Zeile 709 und Modal-„Zur Stelle"-Link bei ~Zeile 582) von `href={\`/jobs/${job.id}\`}` bzw. `href={\`/jobs/${jobId}\`}` auf `href={jobPath(job)}` ändern. Vorher per Grep alle Stellen finden:
```bash
grep -n "/jobs/\${" src/app/jobs/page.tsx
```
Für jede Fundstelle den String-Link durch `jobPath(<job-objekt>)` ersetzen. Wo nur eine ID vorliegt, das zugehörige Job-Objekt aus der Liste verwenden (`jobPath(job)`).

- [ ] **Step 4: `jobs/[slug]/page.tsx` — Param, ID-Auflösung und Canonical-Redirect**

In `src/app/jobs/[slug]/page.tsx`:
- Imports ergänzen:
```ts
import { permanentRedirect } from "next/navigation";
import { jobSlug, jobPath, jobIdFromParam } from "../../../lib/slug";
```
- `generateMetadata`-Signatur/Body: Param heißt jetzt `slug`, ID daraus ableiten:
```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const id = jobIdFromParam(slug);
  const job = id ? JOBS.find((j) => j.id === id) : undefined;
  if (!job) return {};
  // ... unveränderter Title/Description-Block ...
```
  Und im zurückgegebenen Objekt die Canonical/URL auf die Slug-Form setzen:
```ts
    openGraph: { /* … */ url: `https://www.phe-perm.de${jobPath(job)}` },
    alternates: { canonical: jobPath(job) },
```
  Die OG-Image-URL bleibt ID-basiert (`/jobs/${id}/opengraph-image`) — der Slug-Ordner löst über den Param auf; siehe Step 5.
- `generateStaticParams` auf Slug-Form umstellen:
```ts
export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: `${jobSlug(j)}-${j.id}` }));
}
```
- Die Page-Komponente: Param `slug`, ID auflösen, Canonical erzwingen:
```ts
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = jobIdFromParam(slug);
  const job = id ? JOBS.find((j) => j.id === id) : undefined;
  if (!job) notFound();

  // Kanonische URL erzwingen: alte /jobs/1 oder abweichende Slugs → 308 auf die kanonische Form
  const canonicalSlug = `${jobSlug(job)}-${job.id}`;
  if (slug !== canonicalSlug) permanentRedirect(jobPath(job));

  // … restlicher Body unverändert, weiterhin job.* verwenden …
```
- Im `jobPostingSchema` und `breadcrumbSchema` die `url`/`item`-Felder von `\`https://www.phe-perm.de/jobs/${job.id}\`` auf `\`https://www.phe-perm.de${jobPath(job)}\`` umstellen. Grep zur Kontrolle:
```bash
grep -n "jobs/\${job.id}" src/app/jobs/[slug]/page.tsx
```

- [ ] **Step 5: OG-/Social-Routen auf Param `slug` umstellen**

Für jede Datei unter `src/app/jobs/[slug]/` mit Param-Zugriff (`opengraph-image.tsx`, `social/page.tsx`, `social/*/route.tsx`) den Param von `id` auf `slug` + Auflösung umstellen. Betroffene Dateien finden:
```bash
grep -rln "params" "src/app/jobs/[slug]"
```
In jeder Datei das Muster ersetzen:
```ts
// vorher (Beispiel): const { id } = ... ; const job = JOBS.find(j => j.id === id);
import { jobIdFromParam } from "../../../lib/slug"; // Pfadtiefe je Datei anpassen
// ...
const { slug } = await params; // bzw. bei synchronem params (OG-Convention): const { slug } = params;
const id = jobIdFromParam(slug);
const job = id ? JOBS.find((j) => j.id === id) : undefined;
```
Wichtig: relative Importtiefe zu `src/lib/slug` je nach Verschachtelung anpassen (`social/*/route.tsx` liegt tiefer). Die Typ-Signatur des Params von `{ id: string }` auf `{ slug: string }` ändern.

- [ ] **Step 6: Build ausführen und statische Job-Seiten prüfen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run build
```
Expected: Build erfolgreich; im Output erscheinen die Job-Seiten unter `/jobs/[slug]` (25 vorgerenderte Slug-Pfade), keine TypeScript-Fehler.

- [ ] **Step 7: Redirect der Alt-URL manuell verifizieren**

Run (in einem zweiten Terminal `npm start` starten, dann):
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run start &
sleep 4
curl -sI http://localhost:3000/jobs/1 | grep -iE "HTTP/|location"
```
Expected: `308 Permanent Redirect` (bzw. 307/308) mit `location: /jobs/elektroniker-…-1`. Danach Server stoppen (`kill %1`).

- [ ] **Step 8: Commit**

```bash
git add "src/app/jobs/[slug]" src/app/jobs/page.tsx src/app/sitemap.ts
git commit -m "feat: sprechende Job-URLs mit ID-Anker + 308 der alten numerischen URLs"
```

---

## Task D: talente-finden → technische-personalvermittlung + 301

**Files:**
- Rename: `src/app/talente-finden/` → `src/app/technische-personalvermittlung/`
- Modify: `src/app/technische-personalvermittlung/layout.tsx`
- Modify: `src/app/technische-personalvermittlung/page.tsx` (tel-Fix, Schema-URL)
- Modify: `next.config.ts` (301)
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/components/Footer.tsx`, `src/app/components/Nav.tsx`, `src/app/page.tsx` (Links)

- [ ] **Step 1: Ordner umbenennen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && git mv src/app/talente-finden src/app/technische-personalvermittlung
```

- [ ] **Step 2: Layout-Metadaten auf die neue Keyword-URL setzen**

In `src/app/technische-personalvermittlung/layout.tsx` ersetzen:
```ts
export const metadata: Metadata = {
  title: "Technische Personalvermittlung – Fachkräfte in Festanstellung",
  description: "PHE-Perm ist die spezialisierte technische Personalvermittlung: Elektroniker, SPS-Programmierer, Mechatroniker & Servicetechniker in Festanstellung. Erfolgsbasiert, deutschlandweit.",
  alternates: { canonical: "/technische-personalvermittlung" },
  openGraph: {
    title: "Technische Personalvermittlung – Fachkräfte in Festanstellung | PHE-Perm Engineering",
    description: "Spezialisierte Personalvermittlung für Technik-Fachkräfte: erfolgsbasiert, nur Festanstellung, deutschlandweit.",
    url: "https://www.phe-perm.de/technische-personalvermittlung",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technische Personalvermittlung – Fachkräfte in Festanstellung",
    description: "Spezialisierte Personalvermittlung für Technik-Fachkräfte: erfolgsbasiert, nur Festanstellung, deutschlandweit.",
  },
};
```

- [ ] **Step 3: Defekten tel-Link + Schema-URL in der Page korrigieren**

In `src/app/technische-personalvermittlung/page.tsx`:
- Defekten Telefonlink (aktuell `href="tel:+492111586310"`, ~Zeile 664) korrigieren zu:
```ts
href="tel:+4921115863100"
```
- Falls die Page ein Service-/FAQ-Schema mit URL `…/talente-finden` enthält, auf `…/technische-personalvermittlung` umstellen. Kontrolle:
```bash
grep -n "talente-finden\|tel:+4921" src/app/technische-personalvermittlung/page.tsx
```
Expected nach Fix: kein `talente-finden` mehr, `tel:+4921115863100` vorhanden.

- [ ] **Step 4: 301-Redirect in `next.config.ts` ergänzen**

In `src/app/../next.config.ts` (Datei `next.config.ts` im Frontend-Root) innerhalb von `nextConfig` eine `redirects`-Funktion **zusätzlich** zur bestehenden `headers`-Funktion einfügen:
```ts
  async redirects() {
    return [
      { source: "/talente-finden", destination: "/technische-personalvermittlung", permanent: true },
    ];
  },
```

- [ ] **Step 5: Sitemap + interne Links umstellen**

- `src/app/sitemap.ts`: statische Zeile `/talente-finden` → `/technische-personalvermittlung`.
- `src/app/components/Footer.tsx`: `["Fachkräfte finden", "/talente-finden"]` → `["Technische Personalvermittlung", "/technische-personalvermittlung"]`.
- `src/app/page.tsx`: den B2B-Nebensatz-Link `href="/talente-finden"` → `href="/technische-personalvermittlung"` (wird in Task E ohnehin in die Weiche überführt; hier nur URL korrigieren, falls Task E später ausgeführt wird).
- Kontrolle projektweit:
```bash
grep -rn "/talente-finden" src/app
```
Expected: **keine** Fundstelle mehr (außer dem Redirect-`source` in `next.config.ts`).

- [ ] **Step 6: Build + Redirect verifizieren**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run build && npm run start &
sleep 4
curl -sI http://localhost:3000/talente-finden | grep -iE "HTTP/|location"
curl -sI http://localhost:3000/technische-personalvermittlung | grep -iE "HTTP/"
kill %1
```
Expected: `/talente-finden` → `308/301` mit `location: /technische-personalvermittlung`; die neue URL antwortet `200`.

- [ ] **Step 7: Commit**

```bash
git add src/app/technische-personalvermittlung next.config.ts src/app/sitemap.ts src/app/components/Footer.tsx src/app/page.tsx
git commit -m "feat: B2B-Seite auf /technische-personalvermittlung heben (301) + defekten tel-Link fixen"
```

---

## Task E: Navigation + Zielgruppen-Weiche

**Files:**
- Modify: `src/app/components/Nav.tsx`
- Create: `src/app/components/PathSwitch.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: `NAV_LINKS` neu strukturieren (nur existierende Seiten)**

In `src/app/components/Nav.tsx` das `NAV_LINKS`-Array ersetzen:
```ts
const NAV_LINKS: [string, string][] = [
  ["Für Unternehmen", "/technische-personalvermittlung"],
  ["Jobs", "/jobs"],
  ["Lebenslauf erstellen", "/lebenslauf-erstellen"],
  ["Über uns", "/ueber-uns"],
  ["Kontakt", "/kontakt"],
];
```
(Die bestehende Filterlogik `href !== "/kontakt"` für die Desktop-Mitte bleibt unverändert und funktioniert weiter.)

- [ ] **Step 2: `aria-expanded`/`aria-controls` am Hamburger ergänzen (A11y)**

In `src/app/components/Nav.tsx` am `<button>` mit `aria-label="Menü"` ergänzen:
```ts
              aria-label="Menü"
              aria-expanded={open}
              aria-controls="mobile-menu"
```
und am mobilen Dropdown-Container (`<div>` mit `position: "fixed", top: 58 …`) das Attribut `id="mobile-menu"` hinzufügen.

- [ ] **Step 3: `PathSwitch`-Komponente anlegen**

Create `src/app/components/PathSwitch.tsx`:
```tsx
import Link from "next/link";

// Zielgruppen-Weiche: zwei gleichwertige Einstiegspfade (B2B / B2C).
export default function PathSwitch() {
  const cards: { title: string; sub: string; href: string; cta: string }[] = [
    {
      title: "Ich suche Fachkräfte",
      sub: "Technische Personalvermittlung in Festanstellung – geprüfte Profile, erfolgsbasiert.",
      href: "/technische-personalvermittlung",
      cta: "Für Unternehmen →",
    },
    {
      title: "Ich suche einen Job",
      sub: "Feste Stellen für technische Fachkräfte – kostenlos, ohne Zeitarbeit, Antwort in 24 Stunden.",
      href: "/jobs",
      cta: "Zu den Stellen →",
    },
  ];
  return (
    <section aria-label="Zielgruppenauswahl" style={{ padding: "48px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} style={{
            display: "block", textDecoration: "none",
            background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 16,
            padding: "28px 26px",
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{c.title}</h2>
            <p style={{ fontSize: 15, color: "#586170", lineHeight: 1.6, margin: "0 0 16px" }}>{c.sub}</p>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0071e3" }}>{c.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Weiche auf der Startseite einbinden**

In `src/app/page.tsx`:
- Import ergänzen (bei den übrigen Komponenten-Imports):
```ts
import PathSwitch from "./components/PathSwitch";
```
- `<PathSwitch />` direkt nach dem Hero-Block einsetzen (vor der „Aktuelle Stellen"-Section, d. h. nach der schließenden Klammer der Hero-Section rund um die `stats-row`). Exakte Einfügestelle per Grep bestimmen:
```bash
grep -n "Aktuelle Stellen\|stats-row" src/app/page.tsx
```
`<PathSwitch />` unmittelbar vor der Section mit dem `tag`-Label „Aktuelle Stellen" platzieren.

- [ ] **Step 5: Build + Prüfung**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run build
```
Expected: Build erfolgreich, keine TS-Fehler. `PathSwitch` ist Server-Component (kein `"use client"`), daher keine Hydration-Last.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Nav.tsx src/app/components/PathSwitch.tsx src/app/page.tsx
git commit -m "feat: neue Navigation (Für Unternehmen/Jobs) + Zielgruppen-Weiche auf der Startseite"
```

---

## Task F: Breadcrumbs (sichtbar + Schema)

**Files:**
- Create: `src/app/components/Breadcrumbs.tsx`
- Modify: `src/app/jobs/[slug]/page.tsx` (Komponente einsetzen, altes inline-BreadcrumbSchema entfernen)
- Modify: `src/app/technische-personalvermittlung/page.tsx` (Breadcrumbs einsetzen)

- [ ] **Step 1: `Breadcrumbs`-Komponente anlegen (rendert sichtbaren Pfad + BreadcrumbList-JSON-LD)**

Create `src/app/components/Breadcrumbs.tsx`:
```tsx
import Link from "next/link";

export type Crumb = { name: string; href: string };

// Sichtbare Breadcrumb-Leiste inkl. BreadcrumbList-Schema aus EINER Quelle.
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const base = "https://www.phe-perm.de";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.href}`,
    })),
  };
  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 800, margin: "0 auto", padding: "12px 24px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "#586170" }}>
        {items.map((c, i) => (
          <li key={c.href} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i < items.length - 1 ? (
              <><Link href={c.href} style={{ color: "#2d6a9f", textDecoration: "none" }}>{c.name}</Link><span aria-hidden>›</span></>
            ) : (
              <span aria-current="page">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Job-Detailseite auf die Komponente umstellen (Doppel-Schema vermeiden)**

In `src/app/jobs/[slug]/page.tsx`:
- Import ergänzen:
```ts
import Breadcrumbs from "../../components/Breadcrumbs";
```
- Das bestehende inline `breadcrumbSchema`-Objekt **und** dessen `<JsonLd data={breadcrumbSchema} />`-Einbindung entfernen (Grep: `grep -n "breadcrumbSchema" src/app/jobs/[slug]/page.tsx`).
- Direkt nach `<Nav />` die sichtbare Breadcrumb einsetzen:
```tsx
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Stellenangebote", href: "/jobs" },
        { name: job.title, href: jobPath(job) },
      ]} />
```
(Das `JobPosting`-Schema bleibt unverändert bestehen.)

- [ ] **Step 3: B2B-Pillar mit Breadcrumb versehen**

In `src/app/technische-personalvermittlung/page.tsx`:
- Import ergänzen:
```ts
import Breadcrumbs from "../components/Breadcrumbs";
```
- Nach der Navigation/oberhalb des ersten Inhaltsblocks einsetzen:
```tsx
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Technische Personalvermittlung", href: "/technische-personalvermittlung" },
      ]} />
```
Falls die Page bereits ein inline `BreadcrumbList`-Schema besitzt, dieses entfernen (Grep: `grep -n "BreadcrumbList" src/app/technische-personalvermittlung/page.tsx`), um Doppelung zu vermeiden.

- [ ] **Step 4: Build + Rich-Results-Voraussetzung prüfen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run build && npm run start &
sleep 4
curl -s http://localhost:3000/jobs/elektroniker-fuer-betriebstechnik-frankenthal-1 | grep -c "BreadcrumbList"
kill %1
```
Expected: Ausgabe `1` (genau **ein** BreadcrumbList im HTML — kein Duplikat). Der exakte Slug ergibt sich aus Job 1; bei Abweichung vorher `curl -sI http://localhost:3000/jobs/1` für die `location` nutzen.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/Breadcrumbs.tsx "src/app/jobs/[slug]/page.tsx" src/app/technische-personalvermittlung/page.tsx
git commit -m "feat: sichtbare Breadcrumbs mit BreadcrumbList-Schema (ohne Doppelung)"
```

---

## Task G: Konsistenz-Fixes (NAP, Trust-Zahlen, CV-H1)

**Files:**
- Modify: `src/app/layout.tsx` (NAP-Telefon + contactPoint)
- Modify: `src/app/page.tsx` (Trust-Zahlen)
- Modify: `src/app/technische-personalvermittlung/page.tsx` (Trust-Zahlen)
- Modify: `src/app/lebenslauf-erstellen/page.tsx` (CV-Template-H1)

- [ ] **Step 1: NAP-Telefon im Org-Schema kanonisieren + WhatsApp als contactPoint**

In `src/app/layout.tsx` im `orgSchema` die Zeile
```ts
  "telephone": "+491739980100",
```
ersetzen durch:
```ts
  "telephone": "+4921115863100",
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+4921115863100", "contactType": "customer service", "areaServed": "DE", "availableLanguage": "German" },
    { "@type": "ContactPoint", "telephone": "+491739980100", "contactType": "recruiting", "contactOption": "TollFree", "areaServed": "DE", "availableLanguage": "German" },
  ],
```
> **GF-Entscheidung:** Falls die Mobil-/WhatsApp-Nummer kanonisch sein soll, `"telephone"` auf `+491739980100` setzen und sichtbare Nummern (Impressum/Kontakt/Datenschutz/Pillar) entsprechend angleichen.

- [ ] **Step 2: Reaktionszeit-Stat auf 24 Std. vereinheitlichen (Startseite)**

In `src/app/page.tsx` (~Zeile 482):
```ts
            { num: "24 Std.", label: "Durchschnittliche Reaktionszeit" },
```

- [ ] **Step 3: Home-FAQ-Vermittlungsdauer angleichen**

In `src/app/page.tsx` die FAQ-Antworten mit „2–6 Wochen" (~Zeilen 391 und 714) auf „3–6 Wochen" ändern. Kontrolle:
```bash
grep -n "2–6 Wochen" src/app/page.tsx
```
Expected nach Fix: keine Fundstelle mehr.

- [ ] **Step 4: Reaktionszeit-Stat auf der Pillar vereinheitlichen**

In `src/app/technische-personalvermittlung/page.tsx` (~Zeile 475):
```ts
                  "24 Std. Reaktionszeit",
```
(„Ø 4 Wo." bei ~Zeile 491 und „Ø 3–6 Wochen" bei ~Zeile 579 bleiben — 4 liegt innerhalb 3–6, konsistent.)

- [ ] **Step 5: CV-Template-H1 zu Nicht-Heading ändern**

In `src/app/lebenslauf-erstellen/page.tsx` in **allen vier** Templates (TemplateA ~182, TemplateB ~281, TemplateC ~381, TemplateD ~462) das den Bewerbernamen umschließende `<h1 …>{data.name || "Dein Name"}</h1>` in ein `<div …>` mit identischem Style ändern (Rolle als Überschrift entfällt; die Seiten-`<h1>` bei ~Zeile 713 bleibt die einzige H1). Alle Fundstellen:
```bash
grep -n "<h1" src/app/lebenslauf-erstellen/page.tsx
```
Für jede Template-Fundstelle (nicht die Seiten-H1 bei ~713) `<h1`→`<div` und schließendes `</h1>`→`</div>` ersetzen.

- [ ] **Step 6: Build + H1-Zählung prüfen**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run build && npm run start &
sleep 4
curl -s http://localhost:3000/lebenslauf-erstellen | grep -oc "<h1" 
curl -s http://localhost:3000/ | grep -o "24 Std." | head -1
kill %1
```
Expected: `/lebenslauf-erstellen` liefert `1` (genau eine H1); Startseite enthält „24 Std.".

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/technische-personalvermittlung/page.tsx src/app/lebenslauf-erstellen/page.tsx
git commit -m "fix: NAP-Telefon im Schema kanonisieren, Trust-Zahlen vereinheitlichen, CV-Mehrfach-H1 beheben"
```

---

## Abschluss-Verifikation (nach allen Tasks)

- [ ] **Voller Build + Unit-Tests grün**

Run:
```bash
cd /Users/matin/Desktop/Projekte/phe-2026/frontend && npm run test && npm run build
```
Expected: Vitest grün; `next build` ohne Fehler; alle Job-Seiten unter `/jobs/[slug]` vorgerendert.

- [ ] **Redirect-Matrix stichprobenartig prüfen**

Run (mit laufendem `npm run start`):
```bash
for u in /jobs/1 /jobs/25 /talente-finden; do
  echo -n "$u -> "; curl -sI "http://localhost:3000$u" | grep -i location
done
```
Expected: `/jobs/1`, `/jobs/25` → jeweilige Slug-URL (308); `/talente-finden` → `/technische-personalvermittlung` (301). **Keine Kette** (jeweils genau ein Hop).

- [ ] **Sitemap enthält neue URLs**

Run:
```bash
curl -s http://localhost:3000/sitemap.xml | grep -oE "/jobs/[a-z0-9-]+|/technische-personalvermittlung" | head
```
Expected: Slug-Job-URLs + `/technische-personalvermittlung`; **kein** `/jobs/1` und **kein** `/talente-finden`.

---

## Selbstprüfung des Plans (Spec-Abdeckung)

- **URL-Regelwerk** → Task B (Transliteration, Kleinschreibung, Bindestriche, keine Umlaute) + Vorentscheidungen.
- **Job-Slug-Schema + 301-Map** → Task C (Slug-Route, `permanentRedirect`, generateStaticParams, Sitemap, Canonical).
- **talente-finden → Pillar 301** → Task D (Umbenennung + `next.config`-Redirect + Linkanpassung).
- **Navigation + Zielgruppen-Weiche** → Task E (NAV_LINKS, aria-expanded, PathSwitch).
- **Interne Verlinkung + Breadcrumbs** → Task C/D (Link-Umstellung auf `jobPath`/neue URLs) + Task F (Breadcrumbs).
- **NAP/Trust-Konsistenz + H1-Fix** → Task G.

**Offene Abhängigkeiten / bewusst NICHT in Phase 1:**
- Berufe-/Standort-/Branchen-/Ratgeber-Seiten (Phase 2/3) — deshalb noch nicht in der Nav.
- Startseiten-Jobkarten-Verlinkung auf Detailseiten (Audit 1.5) + hartkodiertes Home-`JOBS`-Array: Umstellung auf `jobPath` + gemeinsame Datenquelle ist ein Phase-2-Schritt (größerer Umbau der Startseite); in Phase 1 nur die Datenschicht (`jobPath`) vorbereitet.
- Server/Client-Refactor der Startseite/Jobliste (Audit 2.1) — separater Plan.

**Risiken:** (1) Slug-Route-Umbau berührt mehrere OG-/Social-Dateien mit unterschiedlicher Importtiefe — Step C5 ausdrücklich pro Datei prüfen. (2) `permanentRedirect` erzeugt 308; für SEO gleichwertig zu 301, aber in der GSC anders benannt — kein Handlungsbedarf. (3) Nach Deploy: alte `/jobs/1..25` in der GSC beobachten, bis Reindexierung abgeschlossen ist.
