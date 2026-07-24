# EPIC 002 — Informationsarchitektur, URL-Struktur & Seitenhierarchie

**Projekt:** phe-perm.de (phe-2026 / frontend, Next.js 16 App Router)
**Rollen:** Senior SEO Strategist · Information Architect · UX Consultant · Next.js App-Router Architect · CRO Specialist
**Charakter:** reines Konzept — kein Code, keine Seiten, keine Komponenten, keine Refactorings
**Stand:** 24.07.2026

> **Positionierung (Leitplanke):** PHE-Perm vermittelt technische Fachkräfte in Festanstellung — persönlich geprüft, fachlich passend, langfristig gedacht.
> **Strategische Kategorie:** Technische Direktvermittlung.
> **YAFTO** ist eine eigenständige Marke und **nicht** Teil dieser SEO-Architektur.

---

## 1. Executive Summary

Die heutige Website ist technisch solide (JobPosting-Schema, Sitemap, statische Detailseiten), aber **architektonisch flach und zielgruppen-unscharf**: Alle Inhalte hängen an 6 indexierbaren Seiten, die B2B-Seite ist der bewerberzentrierten Startseite untergeordnet, Job-URLs sind numerisch (`/jobs/1`), und es fehlen sämtliche skalierbaren SEO-Ebenen (Berufe, Standorte, Branchen, Ratgeber).

Das Zielbild dreht die Architektur auf **zwei gleichwertige Nutzerpfade** (Unternehmen / Bewerber) mit je eigener Pillar-Page, darunter drei skalierbare, aber **qualitätsgesicherte** Hub-Systeme:

1. **B2B-Pillar** `technische-personalvermittlung` + lokale Landingpages `/personalvermittlung/[stadt]` (Kern: Düsseldorf/NRW).
2. **Berufe-Hub** `/berufe/[beruf]` als Bindeglied zwischen Suchintention „[Beruf] Job" und konkreten Stellen.
3. **Job-System** mit sprechenden, stabilen Slugs (`/jobs/[beruf-ort]-[id]`) und Google-for-Jobs-Konformität.

Leitprinzip gegen die größte Gefahr (Doorway/Thin Content): **keine kombinatorische Massenerzeugung.** Jede indexierbare Seite braucht einen belegten Grund (echte Stellen, echte fachliche Substanz, echtes Suchvolumen). Beruf×Region-Kombinationen werden **inventarabhängig** freigeschaltet, nicht generiert.

Ergebnis: jede strategisch wichtige Seite ≤ 3 Klicks von der Startseite, klare Keyword-Zuständigkeit ohne Kannibalisierung, verlustfreie Migration der bestehenden URLs.

---

## 2. Analyse der aktuellen Architektur

### 2.1 Bestehende öffentliche Routen — Vollbewertung

| Bestehende URL | Titel/Zweck | Typ | Zielgruppe | Suchintention | Hauptkeyword (vermutet) | Content-Qualität | Conversion-Ziel | Index | Interne Links | Problem / Risiko | Empfehlung |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Startseite „Ihr nächster Job … Schnell. Direkt. Kostenlos." | Home | überw. Bewerber | mixed (Navigational/Brand) | „Personalvermittlung … IT Elektro Bau" | gut, aber bewerberlastig | Bewerbung (WA/E-Mail) | index | Nav, Footer, /jobs, /talente-finden, /lebenslauf | B2B nur als Nebensatz; „IT/Bau" ohne Substanz; Jobkarten ohne Link auf Detail | **optimieren** (Zielgruppen-Weiche, Fokus Technik) |
| `/jobs` | Stellenliste + Filter | Job-Liste (Hub) | Bewerber | transactional | „Elektroniker Jobs" / „Technik Jobs" | gut | Bewerbung | index | Nav, Detailseiten | Client-Fetch-Waterfall; keine Beruf/Region-Facetten als URL | **optimieren** (Facetten-Hubs, RSC) |
| `/jobs/[id]` (25×) | Einzelstelle, JobPosting-Schema | Job-Detail | Bewerber | transactional | „[Beruf] [Ort] Job" | gut (Aufgaben/Profil/Benefits) | Bewerbung | index | Ähnliche Jobs, /jobs | **numerische URL** ohne Keyword; nicht von Home verlinkt | **umbenennen** (sprechender Slug + 301) |
| `/talente-finden` | B2B: „nur bei Erfolg zahlen", geprüfte Profile | B2B-Landing | Unternehmen | commercial | „technische Personalvermittlung" | mittel (dünn für Money-Page) | Talente-Anfrage | index | Home-Nebensatz, Footer | untergeordnet; defekter tel-Link; kein Ablauf/Kosten-Tiefgang | **umbenennen/verschieben** → Pillar `technische-personalvermittlung` (301) |
| `/ueber-uns` | Unternehmen, Werte, FAQ | About | beide | informational/trust | „PHE-Perm Engineering" | mittel | Vertrauen → Kontakt | index | Footer, 1× /kontakt | wenig interne Links; kein Autor/E-E-A-T | **optimieren** (Team/Autor-Entitäten, Trust) |
| `/kontakt` | Kontaktformular, NAP, FAQ | Kontakt | beide | navigational/local | „PHE-Perm Kontakt / Düsseldorf" | mittel | Kontakt/Anfrage | index | Nav, Footer | NAP-Telefon inkonsistent zu Schema; keine echte Karte/Öffnungszeiten sichtbar | **optimieren** (Local-Signale) |
| `/lebenslauf-erstellen` | Kostenloser CV-Generator | Tool | Bewerber | tool/transactional | „Lebenslauf erstellen kostenlos" | gut (echtes Tool) | Tool-Nutzung → Job | index | Home-Teaser | Mehrfach-H1; kaum Verlinkung in Ratgeber/Jobs | **optimieren** (Hub-Anbindung, H1-Fix) |
| `/impressum` | Pflichtangaben | Legal | — | — | — | dünn (korrekt) | — | **noindex** | Footer | ok | **behalten (noindex)** |
| `/datenschutz` | Datenschutzerklärung | Legal | — | — | — | dünn (korrekt) | — | **noindex** | Footer | ok | **behalten (noindex)** |
| `/agb` | AGB | Legal | — | — | — | dünn (korrekt) | — | **noindex** | Footer | ok | **behalten (noindex)** |
| `/jobs/social-kit` | internes Social-Media-Tool | Tool (intern) | intern | — | — | n/a | — | **noindex** | keine | interne Route öffentlich erreichbar | **behalten (noindex)**, ggf. auth |
| `/jobs/[id]/social` | Social-Vorschau je Job | Tool (intern) | intern | — | — | n/a | — | **noindex** | keine | s. o. | **behalten (noindex)** |

**Nicht-Seiten (Assets/API, kein Index nötig):** `/api/contact`, `/api/contact/confirm`, `/api/jobs`, `/api/geocode`, `/jobs/opengraph-image`, `/jobs/[id]/opengraph-image`, `/jobs/[id]/{feed,square,story}-image` → durch `robots` (`/api/`) bzw. Asset-Charakter abgedeckt; keine Änderung.

### 2.2 Strukturelle Befunde

- **Doppelte Suchintention:** keine echten Duplikate heute — aber `/talente-finden` und eine künftige `technische-personalvermittlung` **würden** kollidieren → deshalb Zusammenführung per 301 (Kap. 12/17).
- **Dünne Inhalte:** `/talente-finden` ist für eine umsatztragende B2B-Money-Page zu dünn; Rechtsseiten dünn (korrekt noindex).
- **Verwaiste Seiten:** 25 Job-Detailseiten sind faktisch **Quasi-Orphans** (nur über `/jobs` + „ähnliche Jobs" erreichbar, nicht von der Home). Interne Tools korrekt orphan+noindex.
- **Kein klarer Conversion-Pfad B2B:** Unternehmen landen bewerberzentriert auf der Home; der B2B-Pfad ist ein Fließtext-Link.
- **Konkurrierende Keywords:** aktuell gering (wenige Seiten), aber der Metatitel streut „IT/Elektro/Bau" ohne Substanz.
- **Unklare Zielgruppe:** die Startseite bedient beide Publika mit einer (bewerberdominierten) Botschaft.

---

## 3. Empfohlene Zielarchitektur

### 3.1 Grundprinzipien

1. **Zwei Nutzerpfade, zwei Pillars.** Unternehmen → `technische-personalvermittlung`. Bewerber → `/jobs`. Beide ab Startseite gleichwertig.
2. **Hub-and-Spoke.** Jede Pillar speist thematische Hubs (Berufe, Standorte, Branchen, Karrierewissen), die wiederum konkrete Stellen und Ratgeber verlinken.
3. **Inventar- und Substanzgate.** Skalierende Seiten (Beruf, Standort, Beruf×Region) werden nur indexiert, wenn echte Stellen/echte fachliche Inhalte existieren. Kein programmatisches Doorway-Feld.
4. **Eindeutige Keyword-Zuständigkeit.** Genau eine Hauptseite je Money-Keyword; alle anderen sind unterstützend mit anderer Intention/Anchor.
5. **Klicktiefe ≤ 3** für jede strategische Seite.

### 3.2 Bereich A — Startseite

- **Aufgabe:** PHE-Perm als *technische Direktvermittlung* positionieren und Besucher in **einen von zwei** Pfaden leiten.
- **Hauptkeyword:** „technische Personalvermittlung" (+ Brand „PHE-Perm").
- **Sekundär:** „Personalvermittlung Festanstellung", „Techniker Festanstellung", „Fachkräftevermittlung Technik".
- **Zielgruppe:** beide (mit sichtbarer Weiche).
- **Suchintention:** navigational/brand + kommerziell (Einstieg).
- **Wichtigste Inhaltsbereiche:** (1) Positionierungs-Hero + Zielgruppen-Weiche „Ich suche Fachkräfte / Ich suche einen Job", (2) Kurz-Nutzen je Pfad, (3) Fachbereiche-Teaser (Elektro/Automation/Kälte/SHK …), (4) aktuelle Stellen (verlinkt auf Detail!), (5) Trust (5,0/Google, 3.000+ Bewerber), (6) So funktioniert's, (7) CV-Tool-Teaser, (8) FAQ (Schema = sichtbar).
- **Wichtigste interne Links:** `technische-personalvermittlung`, `/jobs`, `/berufe`, `/personalvermittlung/duesseldorf`, `/lebenslauf-erstellen`, `/ueber-uns`, `/kontakt`.
- **Primäre Conversion:** Talente-Anfrage (B2B) **und** Bewerbung (B2C) — je Pfad. **Sekundär:** CV-Tool, Kontakt.

### 3.3 Bereich B — Unternehmensbereich (B2B)

**Pillar (= „Für Unternehmen"):** `technische-personalvermittlung`
Darunter (nur wo substanziell):

| Seite | Zweck |
|---|---|
| `/technische-personalvermittlung` | Pillar: Kernleistung, Modell (Direktvermittlung), Fachbereiche, Ablauf-Kurz, Kosten-Kurz, Anfrage-CTA |
| `/technische-personalvermittlung/ablauf` | Prozess im Detail (Anfrage → geprüfte Profile in 3–5 Tagen → Vertrag) |
| `/technische-personalvermittlung/kosten` | Preis-/Erfolgsmodell (nur bei Vermittlung), Kostentransparenz |
| `/personalvermittlung/[stadt]` | Lokale B2B-Landingpages (Kern: Düsseldorf) |
| `/branchen` + `/branchen/[branche]` | Branchen-Hub (nur substanzstarke Branchen) |
| `/referenzen` | Erfolgsgeschichten/Referenzen (sobald belastbar) |

**Entscheidung zu den geprüften Kandidaten-URLs:**

| Geprüfte URL | Entscheidung | Begründung |
|---|---|---|
| `/unternehmen` | **verwerfen** (→ `technische-personalvermittlung`) | generisch, kein Keyword; Nav-Label „Für Unternehmen" zeigt auf die Pillar |
| `/talente-finden` | **301 → Pillar** | bestehende Seite wird zur Pillar zusammengeführt (Anfrageformular als Sektion/`#anfrage`) |
| `/personalvermittlung` | **verwerfen als Bundesseite** (Kannibalisierung) | Head-Term unrealistisch; regionalisieren via `/personalvermittlung/[stadt]` |
| `/direktvermittlung` | **Sektion + FAQ** auf Pillar, keine eigene Seite | „Direktvermittlung" = Modellname, gleiche Intention wie Pillar → Kannibalisierung |
| `/personalberatung` | **nicht gezielt** (FAQ-Erwähnung) | andere Konnotation (Beratung/Executive); kein Portfolio-Fit |
| `/technische-personalvermittlung` | **Pillar (eigene Seite)** | Money-Keyword mit realistischer Nische |
| `/recruiting-technische-fachkraefte` | **verwerfen** (→ Pillar-Sektion) | Synonym der Pillar; als H2/Anchor abbilden |
| `/ablauf` | **als Kind der Pillar** (`…/ablauf`) | Kontext-Bindung statt generischer Flach-URL |
| `/kosten` | **als Kind der Pillar** (`…/kosten`) | s. o. |
| `/branchen` | **Hub-Seite** | echter Nutzen, wenn Branchen-Substanz vorhanden |
| `/referenzen` | **eine Seite** (nicht zusätzlich `/erfolgsgeschichten`) | Zusammenlegen — gleiche Intention |
| `/erfolgsgeschichten` | **zusammenführen mit `/referenzen`** | Kannibalisierung vermeiden |
| `/faq-unternehmen` | **keine eigene Seite** — FAQ-Blöcke auf B2B-Seiten | FAQ gehört kontextuell auf die jeweilige Seite (FAQPage-Schema dort) |
| `/kontakt` | **behalten** (geteilt B2B/B2C) | zentrale Kontakt-/NAP-Seite |

### 3.4 Bereich C — Bewerberbereich (B2C)

**Hub (= „Für Bewerber / Jobs"):** `/jobs`

| Seite | Zweck |
|---|---|
| `/jobs` | Stellenliste + Filter (Beruf, Ort, Kategorie); Applicant-Pillar |
| `/jobs/[slug]-[id]` | Einzelstelle (JobPosting) |
| `/berufe` + `/berufe/[beruf]` | Berufs-Hubs (Berufsbild + passende Stellen + Gehalt + Ratgeber) |
| `/karrierewissen` + `/karrierewissen/[artikel]` | Ratgeber-Hub (Bewerbung, Weiterbildung …) |
| `/gehalt/[beruf]` | Gehaltsseiten je Kernberuf (Top-of-Funnel) |
| `/lebenslauf-erstellen` | CV-Generator (Tool) |

**Entscheidung zu den geprüften Kandidaten-URLs:**

| Geprüfte URL | Entscheidung | Begründung |
|---|---|---|
| `/jobs`, `/jobs/[slug]` | **behalten/umbauen** | Kern des Bewerberpfads; Slug statt ID |
| `/fuer-bewerber` | **optional P2 als Prozessseite**, sonst Nav-Label → `/jobs` | Doppelung mit `/jobs` vermeiden; nur bauen, wenn eigener Prozess-Content existiert |
| `/bewerbung` | **Ratgeber unter `/karrierewissen/bewerbung`** | informational; kein eigener Top-Level nötig |
| `/lebenslauf-erstellen` | **behalten** | starkes Tool-Asset |
| `/karriere` | **= `/karrierewissen`** (ein Hub) | „Karriere" mehrdeutig; Wissens-Hub klarer benennen |
| `/gehalt` | **Hub `/gehalt` + `/gehalt/[beruf]`** | hohes TOFU-Volumen; nur je Kernberuf mit echten Spannen |
| `/berufe`, `/berufe/[beruf]` | **Hub + Detailseiten** | zentrales Bindeglied Suchintention→Stellen |
| `/standorte` | **B2C-Standorte verwerfen als eigene Seiten** | Applicant-Regionalität via `/jobs`-Facetten + Beruf×Region-Gate; B2B-Local über `/personalvermittlung/[stadt]` |
| `/faq-bewerber` | **keine eigene Seite** — FAQ kontextuell | s. o. |

### 3.5 Geteilte Seiten

`/ueber-uns` (Trust/E-E-A-T, Autoren), `/kontakt` (NAP/Local), `/impressum`·`/datenschutz`·`/agb` (noindex).

---

## 4. Visueller Seitenbaum (Zielarchitektur)

```
PHE-Perm (/)
│  [Startseite: technische Direktvermittlung, Zielgruppen-Weiche]
│
├── Für Unternehmen  →  /technische-personalvermittlung        [B2B-Pillar]
│   ├── /technische-personalvermittlung/ablauf
│   ├── /technische-personalvermittlung/kosten
│   ├── /branchen                                              [Branchen-Hub]
│   │   ├── /branchen/maschinenbau
│   │   ├── /branchen/anlagenbau
│   │   ├── /branchen/gebaeudetechnik-tga
│   │   ├── /branchen/kaelte-klimatechnik
│   │   ├── /branchen/automotive
│   │   └── /branchen/medizintechnik            (nur substanzstarke)
│   ├── /personalvermittlung/duesseldorf                       [Local B2B, PRIMÄR]
│   │   ├── /personalvermittlung/koeln
│   │   ├── /personalvermittlung/essen
│   │   ├── /personalvermittlung/dortmund
│   │   └── … (gated, s. Kap. 6)
│   └── /referenzen                                            (P2/P3)
│
├── Für Bewerber  →  /jobs                                     [B2C-Hub/Pillar]
│   ├── /jobs/[slug]-[id]                                      [Job-Detail]
│   ├── /berufe                                                [Berufe-Hub]
│   │   ├── /berufe/elektroniker
│   │   ├── /berufe/elektroniker-betriebstechnik
│   │   ├── /berufe/sps-programmierer
│   │   ├── /berufe/mechatroniker
│   │   ├── /berufe/servicetechniker
│   │   ├── /berufe/kaeltetechniker
│   │   └── … (gated)
│   ├── /gehalt                                                [Gehalts-Hub]
│   │   └── /gehalt/[beruf]
│   ├── /karrierewissen                                        [Ratgeber-Hub]
│   │   ├── /karrierewissen/bewerbung
│   │   ├── /karrierewissen/festanstellung-vs-zeitarbeit
│   │   └── /karrierewissen/[artikel]
│   └── /lebenslauf-erstellen                                  [Tool]
│
├── Über uns  →  /ueber-uns
├── Kontakt   →  /kontakt
└── Rechtliches (Footer, noindex): /impressum · /datenschutz · /agb

Intern/noindex (nicht in Nav/Sitemap): /jobs/social-kit · /jobs/[id]/social
Ausgeschlossen aus PHE-SEO: YAFTO (eigene Marke/Domain)
```

---

## 5. URL-Regelwerk (verbindlich)

**Schreibweise**
- ausschließlich Kleinbuchstaben; Wörter mit Bindestrich getrennt.
- **keine Umlaute/ß:** `ä→ae, ö→oe, ü→ue, ß→ss` (`kaeltetechniker`, `koeln`, `duesseldorf`, `gebaeudetechnik`).
- kurze, sprechende Slugs; **keine Stoppwörter** (`für`, `und`, `der`).
- **keine Jahreszahlen** in Evergreen-URLs; **keine Kampagnenparameter** in Canonical-URLs.
- **Singular** für Entitäts-Detailseiten (`/berufe/elektroniker`), **Plural** für Hubs (`/berufe`, `/jobs`, `/branchen`). Einmal festgelegt, nie gemischt.
- **keine numerische Job-URL als alleinige URL** (ID nur als stabiler Suffix, s. Kap. 8).
- keine doppelten Pfade für dieselbe Intention (Kannibalisierung, Kap. 11/17).

**Technische Regeln**
- **Trailing Slash:** ohne (Next.js-Default `trailingSlash:false`); die jeweils andere Variante 301 auf die kanonische.
- **Canonical:** selbstreferenzierend, **absolut**, Host `https://www.phe-perm.de`. Facetten/Filter → Canonical auf die indexierbare Elternseite.
- **HTTPS + www:** kanonischer Host `www`; `http→https` und `non-www→www` je 301 (bereits via `robots.host`).
- **Redirects:** immer **301** für dauerhaft, **eine** Sprungebene, keine Ketten; keine Sammel-301 auf die Startseite.
- **Parameter:** UTM & Filter erzeugen **nie** eigene Indexseiten; `?q=`, `?ort=`, `?kategorie=` bleiben Client-Filter mit Canonical auf `/jobs`.
- **Filter-URLs:** nur explizit freigeschaltete Facetten werden zu echten (indexierbaren) Pfaden (Kap. 7); alle übrigen bleiben Query-Parameter, `noindex,follow`.
- **Pagination:** `/jobs?page=n` → `noindex,follow`, Canonical auf `/jobs`; Inhalte der Seite 1 bleiben index. (Kein `rel=prev/next` als Indexsignal — von Google abgekündigt.)

---

## 6. Regionale Architektur (Local SEO)

### 6.1 Muster-Vergleich

| Variante | Für | Vorteil | Nachteil | Empfehlung |
|---|---|---|---|---|
| `/standorte/[stadt]` | Applicant-Regionen | neutral, hub-artig | trägt **kein** B2B-Money-Keyword; Applicant-Regionalität besser über Beruf×Region/Filter | **nein** |
| `/personalvermittlung/[stadt]` | B2B lokal | exaktes Suchmuster „Personalvermittlung [Stadt]"; hohe kommerzielle Intention | Doorway-Gefahr bei Massenanlage | **JA** (für B2B-Local) |

**Empfehlung:** **`/personalvermittlung/[stadt]`** als kanonisches Local-Muster (B2B). Die Bewerber-Regionalität wird **nicht** über eigene dünne Stadtseiten abgebildet, sondern über `/jobs`-Filter und (inventarabhängige) Beruf×Region-Hubs (Kap. 7). `/personalvermittlung/duesseldorf` ist die **primäre lokale Landingpage**.

### 6.2 Regeln für regionale Seiten (Doorway-Schutz)

Eine eigene Stadt-Seite ist **nur gerechtfertigt**, wenn mindestens **drei** zutreffen:
1. reales Vermittlungsgeschäft/Nachfrage in der Region,
2. ≥ ~3 belegbare lokale Inhalte (regionale Branchencluster, lokale Gehaltsrealität, Anfahrt/Einzugsgebiet),
3. lokaler Ansprechpartner oder echte lokale Referenz,
4. eigenes Suchvolumen für „Personalvermittlung [Stadt]".

**Notwendige lokale Inhalte je Stadt-Seite:** eigene H1/Intro mit echtem Ortsbezug, regionaltypische Fachbereiche/Arbeitgeberlandschaft, lokale Gehalts-/Marktnotiz, sichtbare NAP + Einzugsgebiet, lokale/branchennahe Referenz, Link zu passenden aktuellen Stellen der Region.
**Nicht dupliziert werden dürfen:** Einleitung, Ablauf, Kostentext (diese bleiben auf der Pillar; Stadt-Seite verlinkt sie).

**Ausbaustufen (gated):**
- **P1:** Düsseldorf (Sitz) — vollwertig.
- **P2:** Köln, Essen, Dortmund (Ruhrgebiet), sobald Substanz/Stellen vorhanden.
- **P3:** Duisburg, Bochum, Wuppertal, Aachen, Mönchengladbach, Neuss, Krefeld — **nur** bei erfüllten Regeln; sonst gar nicht.
- **NRW-Ebene:** `/personalvermittlung/nordrhein-westfalen` als regionale Klammer-Seite (P2), die die Städte bündelt.
- Überregional (Frankfurt, Hamburg, Hannover, München …): erst wenn echtes Geschäft dort existiert — sonst Doorway.

---

## 7. Beruf × Region — Bewertung & Entscheidung

| Kombination | SEO-Potenzial | Intention | Skalierbarkeit | Thin/Doorway-Risiko | Pflege | Entscheidung |
|---|---|---|---|---|---|---|
| `/personalvermittlung/[beruf]/[stadt]` (B2B) | mittel | commercial | hoch (Explosion!) | **sehr hoch** | hoch | **nicht als eigene Seiten** — als Sektion auf `/personalvermittlung/[stadt]` + `/berufe/[beruf]` |
| `/jobs/[beruf]-[stadt]` (Applicant-Facette) | hoch (Kaufabsicht) | transactional | hoch | mittel (nur bei leerem Inventar) | mittel | **indexierbar nur mit Inventar-Gate** |
| `/berufe/[beruf]/[region]` | mittel | informational/trans. | hoch | hoch | hoch | **nur NRW-Ebene** für Kernberufe, sonst noindex-Filter |

**Verbindliche Regel — Inventar-Gate für indexierbare Beruf×Region-Hubs:**
- **≥ 5 aktive Stellen** der Kombination → indexierbare Facettenseite mit eigener H1, Intro, Stellenliste, verlinktem Beruf-Hub und Stadt-Bezug.
- **1–4 Stellen** → Seite existiert als Filter, aber `noindex,follow`, Canonical auf `/berufe/[beruf]` bzw. `/jobs`.
- **0 Stellen** → keine eigene URL; Filter zeigt Leerzustand + Alternativen; niemals indexieren (Soft-404-Gefahr).
- Fällt eine indexierte Kombination unter 5 Stellen → automatisch `noindex` (kein 404, Seite bleibt als Filter).

**Fazit:** Kein massenhaftes Anlegen. Applicant-Beruf×Region ist der einzige Kandidat für kontrollierte Skalierung — inventarabhängig. B2B-Beruf×Stadt bleibt Content-Sektion, keine URL-Fläche.

---

## 8. Job-URL-Struktur

**Standard:** `/jobs/[beruf-spezialisierung-stadt]-[id]`
Beispiel: `/jobs/servicetechniker-kaeltetechnik-muenchen-1234`

**Regeln**
- **Slug-Aufbau:** `beruf(-spezialisierung)-stadt`, transliteriert, kleingeschrieben, Bindestriche; auf ~60 Zeichen begrenzt.
- **Interne Job-ID:** stabiler, unveränderlicher Suffix (nicht die alte 1..25; neue kollisionsfreie ID). Die ID am Slug-Ende macht die URL **eindeutig** und routbar unabhängig vom Titeltext.
- **Gleiche Stellenbezeichnungen:** die ID unterscheidet identische Slugs (`…-muenchen-1234` vs `…-muenchen-1377`).
- **Titel/Ort ändert sich:** neuer Slug wird generiert; **Auflösung erfolgt über die ID** → alte Slug-Variante 301 auf die aktuelle. Canonical = aktuelle Slug+ID-URL.
- **Stabilität:** solange die ID lebt, ist die Stelle unter jeder ihrer Slug-Historien per 301 erreichbar; Canonical stets aktuell.
- **Abgelaufene Stellen (validThrough < heute):** Seite bleibt zunächst online mit deutlichem „Stelle nicht mehr aktiv"-Hinweis + Alternativen (ähnliche Jobs/Beruf-Hub); JobPosting-Schema entfernen/als geschlossen markieren; aus der Job-Sitemap nehmen; nach Karenz (z. B. 30–60 Tage) `410 Gone` **oder** 301 auf den passenden Beruf-Hub, wenn dauerhaft weg.
- **Entfernte Stellen:** dauerhaft → `410` (kein Signalrauschen) oder 301 auf Beruf-Hub, nie auf Startseite.
- **Wieder veröffentlichte Stellen:** neue ID nur, wenn inhaltlich neu; identische Wiederkehr → alte ID reaktivieren (kein Duplikat).
- **301 von alten numerischen URLs:** `/jobs/1 … /jobs/25` → jeweils neue Slug-URL der gleichen Stelle (Mapping in Kap. 12).
- **Canonical:** jede Job-Detailseite kanonisiert auf ihre Slug+ID-URL (kein Query, kein Tracking).
- **Indexierung:** aktive Stelle `index,follow`; abgelaufen `noindex,follow` bis Entfernung.
- **Sitemap:** nur **aktive** Stellen in `sitemap-jobs.xml`, `lastmod` = Änderungsdatum; abgelaufene sofort raus.
- **Google for Jobs:** vollständiges `JobPosting` (title, description, datePosted, validThrough, employmentType, hiringOrganization, jobLocation, baseSalary, applicantLocationRequirements, `directApply`) — bereits vorhanden; bei Ablauf `validThrough` respektieren und Schema entfernen, damit keine „abgelaufen"-Warnungen in der Search Console entstehen.

---

## 9. Navigation & Footer

### 9.1 Hauptnavigation (Desktop)

Maximal 6 Punkte + Header-CTA, Zielgruppen-Weiche als erstes Element.

| Nav-Punkt | Ziel-URL | Zweck | Zielgruppe | SEO-Bedeutung | Conversion-Bedeutung |
|---|---|---|---|---|---|
| **Für Unternehmen** | `/technische-personalvermittlung` | B2B-Pillar-Einstieg | Unternehmen | hoch (Money-Pillar) | hoch (Talente-Anfrage) |
| **Jobs** | `/jobs` | Stellensuche | Bewerber | hoch (transactional) | hoch (Bewerbung) |
| **Berufe** | `/berufe` | Berufs-Hubs | Bewerber | hoch (Longtail-Verteiler) | mittel |
| **Karrierewissen** | `/karrierewissen` | Ratgeber/Gehalt | Bewerber | mittel (TOFU/Autorität) | niedrig–mittel |
| **Über uns** | `/ueber-uns` | Trust/E-E-A-T | beide | mittel | mittel |
| **Kontakt** | `/kontakt` | Kontakt/Local | beide | mittel (Local) | hoch |
| **Header-CTA** | `#anfrage` / `/technische-personalvermittlung#anfrage` (B2B) · „Jetzt bewerben" auf Job-Kontext | primäre Aktion | kontextabhängig | — | sehr hoch |

- **Fachbereiche/Standorte** landen **nicht** als eigene Top-Level-Punkte in der Hauptnav (Überladung), sondern (a) als Mega-Menü-Spalten unter „Für Unternehmen"/„Berufe" **oder** (b) prominent im Footer + auf den Pillars. Empfehlung: **leichtes Mega-Menü** (s. u.), kein flaches Dauer-Menü.

### 9.2 Mega-Menü (optional, ab genügend Hubs)

- **Für Unternehmen ▸** Leistung (Pillar, Ablauf, Kosten) · Branchen (Top 5) · Standorte (Düsseldorf, Köln, Essen, NRW) · CTA „Fachkräfte anfragen".
- **Berufe ▸** Elektrotechnik (Elektroniker, Betriebstechnik, Automatisierung) · Mechatronik/Kälte (Mechatroniker, Kältetechniker, Servicetechniker) · SPS/Automation · CTA „Alle Stellen".

### 9.3 Mobile-Navigation

Akkordeon: **Für Unternehmen / Jobs / Berufe / Karrierewissen / Über uns / Kontakt**; persistenter Doppel-CTA am unteren Rand („Job finden" / „Fachkräfte anfragen"). WhatsApp als sekundäre Aktion. `aria-expanded`/Fokus-Management (vgl. Audit).

### 9.4 Zielgruppen-Weiche

Auf der Startseite oben und als wiederkehrendes Modul: zwei gleichwertige Karten „Ich suche Fachkräfte → B2B-Pillar" / „Ich suche einen Job → /jobs".

### 9.5 Breadcrumbs

Sichtbar **und** als `BreadcrumbList`-Schema, konsistent:
- `Start › Berufe › Elektroniker`
- `Start › Für Unternehmen › Standorte › Düsseldorf` (bzw. `Start › Personalvermittlung › Düsseldorf`)
- `Start › Jobs › [Stellentitel]`

### 9.6 Footer-Navigation

4 Spalten:
- **Für Bewerber:** Jobs, Berufe, Gehalt, Karrierewissen, Lebenslauf erstellen.
- **Für Unternehmen:** Technische Personalvermittlung, Ablauf, Kosten, Branchen, Fachkräfte anfragen.
- **Standorte:** Düsseldorf, Köln, Essen, Dortmund, NRW.
- **Unternehmen/Recht:** Über uns, Kontakt, Impressum, Datenschutz, AGB.

---

## 10. Interne Linkarchitektur

### 10.1 Verbindliche Linkbeziehungen

| Von | Nach | Zweck |
|---|---|---|
| Startseite | beide Pillars, `/berufe`, `/personalvermittlung/duesseldorf`, CV-Tool | Pfad-Verteilung, Link-Equity |
| B2B-Pillar | `/ablauf`, `/kosten`, `/branchen/*`, `/personalvermittlung/[stadt]`, `/kontakt#anfrage` | Leistungstiefe + Conversion |
| Berufs-Hub `/berufe/[beruf]` | passende **aktive Stellen**, `/gehalt/[beruf]`, passende Ratgeber, verwandte Berufe | Suchintention→Stelle, Autorität |
| Job-Detail | passender Beruf-Hub, passende Region (`/personalvermittlung/[stadt]` bzw. Region-Facette), ähnliche Jobs, CV-Tool | Kontext + Bewerbungshilfe |
| Branchen `/branchen/[branche]` | relevante Berufe + Stellen der Branche | thematische Bündelung |
| Region/Stadt-Seite | aktuelle regionale Stellen, relevante Berufe, `/kontakt` | Local-Relevanz |
| Ratgeber/Gehalt | Leistungs-/Beruf-Seiten, CV-Tool | Funnel-Führung |
| CV-Generator | Bewerbungs-Ratgeber, passende Stellen/Berufe | Reichweite→Conversion |
| Unternehmensseiten | `/kontakt#anfrage` bzw. Talente-Anfrage | B2B-Conversion |

### 10.2 Regeln

- **Mindest-Interne-Links je Seitentyp:** Hub ≥ 8 kontextuelle Links; Beruf-/Branchen-/Stadtseite ≥ 5; Job-Detail ≥ 4 (Beruf, Region, 2–3 ähnliche); Ratgeber ≥ 3.
- **Max. Klicktiefe:** 3 ab Startseite für jede strategische Seite; Job-Detail ≤ 3 (Home → /jobs oder /berufe → Detail).
- **Anchor-Texte:** variieren (Exact / Partial / Brand / generisch), nie 100 % Exact-Match; je Ziel-Keyword definierte Zuständigkeit (Kap. 17).
- **Kontextuelle Links** im Fließtext bevorzugt gegenüber reinen Modul-Links.
- **Related-Content-Blöcke** verpflichtend auf Beruf-, Branchen-, Job-, Ratgeberseiten.
- **Breadcrumbs** auf allen Seiten ab Ebene 2.
- **Orphan-Verbot:** jede indexierbare Seite ist von mindestens einem Hub **und** der Sitemap erreichbar; Startseite verlinkt (direkt oder via Hub) alle Pillars und Kern-Hubs.

---

## 11. Kannibalisierung — Grundlogik

Jedes Money-Keyword hat **genau eine** zuständige Hauptseite; unterstützende Seiten bedienen abweichende Intention (informational vs. commercial vs. transactional) und verlinken die Hauptseite mit variierendem, nicht identischem Anchor. Detailmatrix in Kap. 17. Kernkonflikte präventiv aufgelöst:
- „technische Personalvermittlung" → **nur** Pillar `technische-personalvermittlung`.
- „Personalvermittlung [Stadt]" → **nur** `/personalvermittlung/[stadt]`.
- „[Beruf] Jobs" (transactional) → `/jobs`-Facette / Job-Detail; „[Beruf]" (informational) → `/berufe/[beruf]`. Getrennte Intention, kein Konflikt.
- „Direktvermittlung", „Recruiting technischer Fachkräfte" → Sektionen/FAQ der Pillar, **keine** eigenen Seiten.

---

## 12. Redirect- & Migrationsplan

**Grundsätze:** dauerhaft verschobene indexierbare Inhalte → **301**; keine Ketten; keine Sammelweiterleitung auf die Startseite; gelöschte Stellen → `410` oder 301 auf Beruf-Hub.

### 12.1 Statische Seiten

| Alt | Neu | Typ | Canonical | Interne Links anpassen | Sitemap | Schema | Risiko | Test |
|---|---|---|---|---|---|---|---|---|
| `/talente-finden` | `/technische-personalvermittlung` | 301 | neu | Home-Weiche, Footer, Nav | ersetzen | Service/FAQ übernehmen | temporärer Ranking-Dip | GSC-Coverage, Rankings „technische Personalvermittlung" |
| `/jobs/1..25` | `/jobs/[slug]-[id]` (je Stelle) | 301 | neu Slug+ID | Home-Karten, „ähnliche Jobs", Sitemap | ersetzen | JobPosting-URL aktualisieren | Google-for-Jobs-Reindex | Rich-Results-Test, GSC-JobPosting |
| `/ueber-uns`, `/kontakt`, `/jobs`, `/lebenslauf-erstellen` | unverändert | — | self | Autor/Trust-Links ergänzen | behalten | ergänzen (FAQ/Rating) | gering | — |
| `/impressum`,`/datenschutz`,`/agb` | unverändert | — | — | — | ausgeschlossen | — | — | — |

### 12.2 Neue Seiten
Alle Berufe-/Standort-/Branchen-/Ratgeber-/Gehaltsseiten sind **Neuanlagen** (keine Redirects nötig), werden erst mit fertigem Content live + in Sitemap aufgenommen (kein Vorab-Index leerer Seiten).

### 12.3 Migrations-Reihenfolge (verlustarm)
1. 301-Map + neue Slug-Logik bereitstellen, **bevor** alte URLs entfernt werden.
2. Interne Links auf neue Ziele umstellen (keine Links auf 301).
3. Sitemaps aktualisieren, in GSC einreichen.
4. Monitoring 4–8 Wochen (Coverage, JobPosting, Rankings der migrierten Terme).

---

## 13. Indexierungsstrategie

| Seitentyp | Regel | Bemerkung |
|---|---|---|
| Startseite, Pillars, Hubs (`/jobs`,`/berufe`,`/branchen`,`/gehalt`,`/karrierewissen`) | `index,follow` | Kern |
| B2B-Unterseiten (`ablauf`,`kosten`), `/personalvermittlung/[stadt]` (gated) | `index,follow` | nur mit Substanz (Kap. 6) |
| Berufsseiten (gated), Branchenseiten (gated), Ratgeber, Gehalt | `index,follow` | nur mit echtem Content |
| Job-Detail aktiv | `index,follow` | JobPosting |
| Job-Detail abgelaufen | `noindex,follow` → später `410`/301 | s. Kap. 8 |
| Beruf×Region ≥ 5 Stellen | `index,follow` | Inventar-Gate |
| Beruf×Region 1–4 Stellen | `noindex,follow` + Canonical auf Beruf-Hub | Filter |
| Beruf×Region 0 Stellen | keine URL / Leerzustand | Soft-404 vermeiden |
| `/jobs?…` Filter/Suche/Parameter | `noindex,follow`, Canonical `/jobs` | keine Parameter-Indexseiten |
| Pagination `?page=n` | `noindex,follow`, Canonical `/jobs` | — |
| Impressum/Datenschutz/AGB | `noindex,follow` | Footer-Links |
| Social-Tools (`/jobs/social-kit`, `/jobs/[id]/social`) | `noindex,nofollow` | intern; idealerweise auth |
| Bewerbungs-/Anfragebestätigung (Confirm-Landing) | `noindex,nofollow` | Transaktionszustand |
| CV-Vorschau/Druckansicht (falls je eigene URL) | `noindex,nofollow` | Nutzerdaten |
| API-Routen (`/api/*`) | via robots disallow | keine Seiten |
| OG-/Feed-Image-Routen | Asset | kein Index nötig |

---

## 14. Sitemap-Konzept

**Sitemap-Index** (`/sitemap.xml`) mit Kind-Sitemaps (ab Wachstum sinnvoll, Next kann mehrere generieren):
- `sitemap-static.xml` — Start, Pillars, Hubs, About, Kontakt, CV-Tool.
- `sitemap-jobs.xml` — **nur aktive** Stellen, `lastmod` = Änderungsdatum, Ablauf → sofort raus.
- `sitemap-berufe.xml` — live Berufsseiten.
- `sitemap-standorte.xml` — live `/personalvermittlung/[stadt]`.
- `sitemap-branchen.xml` — live Branchenseiten.
- `sitemap-ratgeber.xml` — Karrierewissen + Gehalt.
- (optional) `sitemap-autoren.xml`, `sitemap-referenzen.xml` — sobald vorhanden.

**Aufnahmebedingungen:** nur `index,follow`-Seiten mit fertigem Content. **Ausschluss:** noindex, Filter/Parameter, abgelaufene Jobs, Beruf×Region unter Gate, Tools, Rechtsseiten. **`lastmod`** nur bei echtem Änderungsdatum (keine gefälschten Build-Timestamps — heutige Praxis der `sitemap.ts` beibehalten). **Aktualisierung:** bei Publish/Ablauf ereignisbasiert; abgelaufene Inhalte umgehend entfernen.

---

## 15. Seiten- & Keyword-Mapping (Auszug, vollständige Liste Kap. 16)

| Seitentyp | Beispiel-URL | Hauptkeyword | Intention | Zielgruppe |
|---|---|---|---|---|
| Startseite | `/` | technische Personalvermittlung / Brand | brand/commercial | beide |
| B2B-Pillar | `/technische-personalvermittlung` | technische personalvermittlung | commercial | Unternehmen |
| Local B2B | `/personalvermittlung/duesseldorf` | personalvermittlung düsseldorf | commercial/local | Unternehmen |
| Berufs-Hub | `/berufe/sps-programmierer` | sps-programmierer (berufsbild/job) | informational/trans. | Bewerber |
| Job-Liste | `/jobs` | technik jobs / stellenangebote elektrotechnik | transactional | Bewerber |
| Job-Detail | `/jobs/servicetechniker-kaeltetechnik-muenchen-1234` | servicetechniker kältetechnik münchen | transactional | Bewerber |
| Gehalt | `/gehalt/elektroniker` | elektroniker gehalt | informational | Bewerber |
| Branche | `/branchen/maschinenbau` | personalvermittlung maschinenbau | commercial | Unternehmen |
| Ratgeber | `/karrierewissen/festanstellung-vs-zeitarbeit` | festanstellung vs zeitarbeit | informational | Bewerber |

---

## 16. Priorisierte Seitenliste (vollständig)

Prioritäten: **P0** Fundament/kritische Kernseiten · **P1** hoher Umsatz-/SEO-Hebel · **P2** thematische Autorität · **P3** spätere Skalierung.

| Prio | Typ | Empf. URL | Titel | Zielgruppe | Intention | Hauptkeyword | Sekundär-Keywords | Conversion | Parent | Wichtigste interne Links | Schema | Index | Bestand/Neu | Aufwand | Abhängigkeiten |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P0 | Home | `/` | technische Direktvermittlung | beide | brand/comm. | technische personalvermittlung | festanstellung, techniker | Anfrage/Bewerbung | — | Pillars, /berufe, /jobs, CV | WebSite, Org, FAQ | index | Bestand (optimieren) | M | URL-Regeln, Nav |
| P0 | B2B-Pillar | `/technische-personalvermittlung` | Technische Personalvermittlung | Unternehmen | commercial | technische personalvermittlung | direktvermittlung, recruiting technische fachkräfte | Talente-Anfrage | Home | ablauf, kosten, branchen, /personalvermittlung/duesseldorf | Service, FAQ, Breadcrumb | index | aus `/talente-finden` (301) | M | Redirect |
| P0 | Job-System | `/jobs` + `/jobs/[slug]-[id]` | Stellen / Job-Detail | Bewerber | transactional | technik jobs / [beruf] [ort] | festanstellung [beruf] | Bewerbung | Home | /berufe, Region, ähnliche | JobPosting, Breadcrumb, FAQ | index | Bestand (Slug-Umbau) | L | Slug+Redirect, RSC |
| P0 | Nav/Footer/Breadcrumb | — | Zielgruppen-Weiche | beide | — | — | — | Pfad-Führung | — | alle Hubs | Breadcrumb | — | Umbau | M | URL-Regeln |
| P1 | Local B2B | `/personalvermittlung/duesseldorf` | Personalvermittlung Düsseldorf | Unternehmen | comm./local | personalvermittlung düsseldorf | technische personalvermittlung nrw | Anfrage | Pillar | Pillar, Stellen DUS, Kontakt | LocalBusiness, Breadcrumb, FAQ | index | Neu | M | Pillar, NAP-Fix |
| P1 | Berufe-Hub | `/berufe` | Technische Berufe | Bewerber | informational | technische berufe | berufsbilder technik | Job/CV | Home | Berufsseiten | CollectionPage, Breadcrumb | index | Neu | S | — |
| P1 | Berufsseiten (Kern) | `/berufe/{elektroniker, elektroniker-betriebstechnik, sps-programmierer, mechatroniker, servicetechniker, kaeltetechniker}` | je Berufsbild | Bewerber | inform./trans. | z. B. „sps-programmierer" | gehalt, aufgaben, jobs | Job/CV | /berufe | Stellen, /gehalt/[beruf], Ratgeber | Breadcrumb, FAQ | index (gated) | Neu | M | Berufe-Hub, Job-Daten |
| P1 | Gehalt (Kern) | `/gehalt` + `/gehalt/{elektroniker,mechatroniker,sps-programmierer,servicetechniker}` | Gehalt je Beruf | Bewerber | informational | „[beruf] gehalt" | gehaltsspanne, nrw | Job/CV | /karrierewissen | Berufsseite, Stellen | FAQ, Breadcrumb | index | Neu | M | echte Gehaltsdaten |
| P1 | B2B-Unterseiten | `/technische-personalvermittlung/{ablauf,kosten}` | Ablauf / Kosten | Unternehmen | commercial | „personalvermittlung ablauf/kosten" | erfolgsprovision | Anfrage | Pillar | Pillar, Kontakt | FAQ, Breadcrumb | index | Neu | S | Pillar |
| P2 | Ratgeber-Hub | `/karrierewissen` + Artikel | Karrierewissen | Bewerber | informational | „bewerbung techniker" u. a. | weiterbildung, wechsel | CV/Job | Home | Berufe, CV, Gehalt | Article, Breadcrumb, FAQ | index | Neu | M | Redaktion |
| P2 | Branchen | `/branchen` + Kern-Branchen | Branchen-Personalvermittlung | Unternehmen | commercial | „personalvermittlung [branche]" | fachkräfte [branche] | Anfrage | Pillar | Berufe, Stellen | Breadcrumb, FAQ | index (gated) | Neu | M | Branchen-Substanz |
| P2 | Local B2B (Ausbau) | `/personalvermittlung/{koeln,essen,dortmund,nordrhein-westfalen}` | je Stadt/Region | Unternehmen | comm./local | „personalvermittlung [stadt]" | technik [stadt] | Anfrage | Pillar | Pillar, Stellen | LocalBusiness, Breadcrumb | index (gated) | Neu | M | Regel Kap. 6 |
| P2 | About/Autoren | `/ueber-uns` (+ Team/Autor) | Über uns | beide | trust | brand | team, werte | Kontakt | Home | Kontakt, Ratgeber | AboutPage, Person | index | Bestand (optimieren) | S | — |
| P3 | Beruf×Region | `/jobs/[beruf]-[stadt]` | Facetten-Hubs | Bewerber | transactional | „[beruf] jobs [stadt]" | festanstellung | Bewerbung | /jobs | Beruf-Hub, Stadt | Breadcrumb | index nur ≥5 Stellen | Neu | L | Inventar-Gate |
| P3 | Referenzen | `/referenzen` | Erfolgsgeschichten | Unternehmen | trust | „personalvermittlung erfahrungen" | referenzen | Anfrage | Pillar | Pillar, Branchen | Review, Breadcrumb | index | Neu | M | echte Fälle |
| P3 | weitere Berufe/Städte/Branchen | gated | — | — | — | — | — | — | jeweils Hub | — | — | index (gated) | Neu | L | Content/Inventar |

---

## 17. Kannibalisierungsmatrix

| Keyword | Zuständige Hauptseite | Unterstützende Seiten | Nicht optimieren auf | Anchor-Text-Regel | Zusammenlegung |
|---|---|---|---|---|---|
| technische Personalvermittlung | `/technische-personalvermittlung` | Startseite (Teaser), `/branchen/*` | Stadtseiten (nur „…in [Stadt]") | Exact nur von Home/Nav; sonst partial | — |
| Personalvermittlung Düsseldorf | `/personalvermittlung/duesseldorf` | Pillar, `/kontakt`, NRW-Seite | andere Stadtseiten, Pillar (bundesweit) | Exact lokal, sonst „Personalvermittlung in Düsseldorf" | — |
| Personalberatung Düsseldorf | **keine** eigene Seite (FAQ-Erwähnung auf DUS-Seite) | DUS-Seite | eigene Landingpage | — | in DUS-Seite integrieren |
| Direktvermittlung (Düsseldorf) | Pillar-Sektion / DUS-Seite-Sektion | — | eigene `/direktvermittlung` | partial | Sektion, keine Seite |
| technische Personalvermittlung (bundesweit) | Pillar | — | Stadtseiten | — | — |
| Personalvermittlung Engineering | Pillar-Sektion (H2 „Engineering") | `/berufe/elektroingenieur`, `/berufe/maschinenbauingenieur` (falls Portfolio) | eigene Seite (bis Substanz) | partial | Sektion |
| Fachkräftevermittlung | Startseite/Pillar (sekundär) | Berufe-Hub | Stadtseiten | generisch | — |
| Recruiting technischer Fachkräfte | Pillar-Sektion/FAQ | Branchenseiten | eigene Seite | partial | Sektion |
| Servicetechniker Jobs | `/jobs` (Facette `/jobs/servicetechniker-…`) | `/berufe/servicetechniker` | `/berufe/servicetechniker` als „Jobs"-Seite | „Servicetechniker Stellen" (Job), „Berufsbild Servicetechniker" (Hub) | — |
| Servicetechniker Personalvermittlung | `/berufe/servicetechniker` (B2C) bzw. Pillar-Bezug (B2B) | Pillar | vermischen von B2B/B2C auf einer Seite | intentionsklar trennen | — |
| Elektroniker Jobs | `/jobs` (Facette `/jobs/elektroniker-…`) | `/berufe/elektroniker` | Berufs-Hub als „Jobs" | „Elektroniker Stellen" vs „Berufsbild Elektroniker" | — |
| Personalvermittlung Elektroniker | `/berufe/elektroniker` (informational) + Pillar (B2B) | Stellen | eigene B2B-Elektroniker-Seite (bis Volumen) | partial | Sektion auf Pillar |

**Grundregel:** *Job-Suche (transactional)* → `/jobs`-Facetten; *Berufsbild/Info* → `/berufe/[beruf]`; *B2B-Leistung* → Pillar/Stadt/Branche. Nie dieselbe Intention auf zwei Seiten.

---

## 18. Content-Templates je Seitentyp

Länge richtet sich nach Suchintention/Informationsbedarf — **keine** pauschale Wortvorgabe.

**Startseite** — H1 (Positionierung „technische Direktvermittlung") · Zielgruppen-Weiche · je Pfad Nutzenblock · Fachbereiche-Teaser · aktuelle Stellen (verlinkt) · Trust (Rating/Zahlen, konsistent) · So-funktioniert's · CV-Teaser · FAQ (Schema=sichtbar) · Doppel-CTA · **Schema:** WebSite+Organization+FAQPage · Update: bei Portfolio-/Kennzahlenänderung.

**Leistungsseite / B2B-Pillar** — H1 „Technische Personalvermittlung" · Einleitung (Kategorie) · Nutzerproblem (Fachkräftemangel Technik) · Nutzenversprechen (nur-bei-Erfolg, geprüfte Profile, Tempo) · Kernablauf (kurz, verlinkt auf `/ablauf`) · Fachbereiche · Kosten-Kurz (verlinkt) · Trust/Referenzen · interne Links (Branchen, Städte, Berufe) · FAQ · CTA „Fachkräfte anfragen" · **Schema:** Service+FAQPage+Breadcrumb · Umfang: mittel-hoch · Update: quartalsweise.

**Berufsseite `/berufe/[beruf]`** — H1 „[Beruf] – Berufsbild & Stellen" · Einleitung · Aufgaben/Anforderungen · Gehaltsspanne (→ `/gehalt/[beruf]`) · Weiterbildung/Perspektive · **aktuelle Stellen (dynamisch, ≥1)** · verwandte Berufe · Ratgeber-Links · FAQ · CTA „Passende Stellen/60-Sek-Bewerbung" · **Schema:** Breadcrumb+FAQPage (+ItemList Stellen) · Umfang: mittel · Update: bei Stellen-/Gehaltsänderung. **Doorway-Schutz:** darf nicht nur ein ausgetauschter Berufsbegriff sein — jede Seite braucht berufsspezifische Aufgaben, Gehalt, Weiterbildung.

**Branchenseite `/branchen/[branche]`** — H1 „Personalvermittlung [Branche]" · Branchenkontext/Bedarf · typische Rollen (→ Berufe) · warum PHE (Fach-Nähe) · Referenz/Beispiel · Stellen der Branche · FAQ · CTA Anfrage · **Schema:** Breadcrumb+FAQPage · Umfang: mittel · nur bei echter Branchen-Substanz.

**Standort-/Stadtseite `/personalvermittlung/[stadt]`** — H1 „Personalvermittlung [Stadt]" · lokaler Kontext (Wirtschaft/Arbeitgeberlandschaft) · Fachbereiche vor Ort · lokale Gehalts-/Marktnotiz · Einzugsgebiet + NAP · lokale Referenz · aktuelle regionale Stellen · FAQ · CTA · **Schema:** LocalBusiness+Breadcrumb+FAQPage · Umfang: mittel · Regeln Kap. 6.

**Jobseite `/jobs/[slug]-[id]`** — H1 Stellentitel · Kurzfakten (Ort, Gehalt, Anstellung) · Aufgaben/Profil/Benefits · warum PHE (kostenlos, Festanstellung) · Prozess · Bewerbungsformular (verifiziert) · Google-Reviews · ähnliche Stellen · Beruf-/Region-Link · **Schema:** JobPosting+Breadcrumb · Umfang: bedarfsgerecht · Update: bis Ablauf; danach Kap. 8.

**Ratgeberartikel `/karrierewissen/[artikel]`** — H1 (Frage/Thema) · Einleitung/Problem · fachliche Antwort (strukturiert, Zwischen-H2) · Praxisbezug/Beispiele · interne Links (Berufe, Leistung, CV) · FAQ · CTA · Autor/Datum · **Schema:** Article+FAQPage+Person(author) · Umfang: nach Thema · Update: jährlich/anlassbezogen.

**Gehaltsseite `/gehalt/[beruf]`** — H1 „[Beruf] Gehalt" · Gehaltsspanne (Region/Erfahrung) · Einflussfaktoren · Vergleich verwandte Berufe · Stellen-CTA · FAQ · **Schema:** FAQPage+Breadcrumb · Umfang: mittel · Update: bei Datenänderung; **echte Daten**, kein Fake.

**Erfolgsgeschichte/Referenz `/referenzen`** — H1 · Ausgangslage Kunde · Aufgabe/Beruf · Lösung/Prozess · Ergebnis (Zeit/Qualität) · Zitat · verwandte Branche/Beruf · CTA Anfrage · **Schema:** Review/CaseStudy+Breadcrumb · nur mit Einwilligung/echten Fällen.

**Unternehmensseite `/ueber-uns`** — H1 · Mission/Positionierung · Werte · Team/Ansprechpartner (Autor-Entitäten) · Historie/Zahlen · Trust (Bewertungen) · CTA Kontakt · **Schema:** AboutPage+Organization+Person+Breadcrumb.

**Bewerberseite `/jobs` (Hub)** — H1 „Technik-Jobs in Festanstellung" · Filter (Beruf/Ort/Kategorie) · Stellenliste (verlinkt) · Nutzen (60-Sek-Bewerbung) · Einstieg Berufe/Gehalt/CV · FAQ · **Schema:** CollectionPage/ItemList+FAQPage+Breadcrumb.

---

## 19. Empfohlene Umsetzungsreihenfolge

**Phase 1 – Fundament** (niedriges Risiko, hoher Hebel): URL-Regelwerk fixieren · neue Navigation + Zielgruppen-Weiche · Bestandsseiten-Bereinigung (talente-finden→Pillar-Entscheid, H1-Fix CV, NAP/Trust-Konsistenz) · interne Verlinkungslogik + Breadcrumbs · Job-Slug-Schema + 301-Map vorbereiten.

**Phase 2 – Kernseiten** (P0/P1): Startseite-Umbau · B2B-Pillar (aus talente-finden) + Ablauf/Kosten · Bewerber-Hub `/jobs` (Slug-Migration, RSC) · `/personalvermittlung/duesseldorf` · Berufe-Hub + 6 Kernberufe · Gehalt-Kernberufe.

**Phase 3 – Skalierung** (P2): weitere Berufsseiten (gated) · Standort-Ausbau Köln/Essen/Dortmund/NRW (gated) · Branchen (substanzstark) · Karrierewissen-Ratgeber · Referenzen.

**Phase 4 – Longtail** (P3): Beruf×Region-Facetten (Inventar-Gate) · weitere Gehaltsseiten · Vergleichs-/Aufklärungsseiten · weitere Fachcluster.

**Reihenfolge-Logik:** Fundament vor Content (sonst Rework); Redirect-Map vor URL-Umstellung (Ranking-Schutz); Hubs vor Detailseiten (Verlinkungsziele existieren); gated-Seiten erst mit Content/Inventar (Doorway-Schutz).

---

## 20. Offene Entscheidungen & Risiken

**Größte SEO-Risiken**
1. **Doorway/Thin Content** durch Beruf-/Stadt-/Beruf×Region-Explosion → strikt über Substanz-/Inventar-Gate (Kap. 6/7/13) begrenzen.
2. **Ranking-Verlust bei Job-Slug-Migration & talente-finden-301** → saubere 1:1-301, keine Ketten, Monitoring (Kap. 12).
3. **Google-for-Jobs-Regressionen** durch URL-Wechsel/Ablauf-Handling → validThrough + Schema-Entfernung + Job-Sitemap-Disziplin (Kap. 8).
4. **Kannibalisierung** B2B-Pillar vs. Stadt-/Branchenseiten und `/jobs` vs. `/berufe` → Intentions-Trennung + Anchor-Regeln (Kap. 11/17).
5. **„IT/Bau"-Streuung ohne Substanz** → Fokus auf belegte Fachbereiche; IT-Seiten erst mit echtem Portfolio.

**Für den Geschäftsführer zu entscheiden**
- **NAP-Telefon:** eine kanonische Nummer (Festnetz vs. Mobil/WhatsApp) für Schema **und** sichtbar (blockiert Local-Seiten).
- **B2B-Realität je Region/Branche:** In welchen Städten/Branchen gibt es echtes Geschäft/Referenzen? (entscheidet, welche Stadt-/Branchenseiten überhaupt entstehen dürfen).
- **Kostentransparenz:** Dürfen Konditionen/Provisionsmodell auf `/kosten` konkret genannt werden?
- **Referenzen/Erfolgsgeschichten:** Einwilligung von Kunden/Kandidaten vorhanden? (Voraussetzung für `/referenzen`).
- **Autoren/Team-Sichtbarkeit:** Namentliche Experten (E-E-A-T) öffentlich führen?
- **„Engineering/IT/Softwareentwicklung":** aktiv besetzen (Portfolio aufbauen) oder aus der Architektur vorerst weglassen?
- **YAFTO:** eigene Domain/Trennung bestätigen (kein PHE-SEO-Bezug).
- **Ressourcen/Redaktion:** Wer liefert die berufs-/gehalts-/branchenspezifischen Inhalte (Voraussetzung gegen Thin Content)?

---

## Abschluss

### Die fünf wichtigsten Architekturentscheidungen
1. **Zwei gleichwertige Nutzerpfade** mit je eigener Pillar: B2B `technische-personalvermittlung`, B2C `/jobs` — Zielgruppen-Weiche ab Startseite.
2. **`/talente-finden` → `technische-personalvermittlung` (301)** als keyword-tragende B2B-Pillar; B2B ist kein Anhängsel mehr.
3. **Sprechende, stabile Job-URLs** `/jobs/[beruf-ort]-[id]` mit ID-Anker, Canonical und 301 der numerischen Alt-URLs (Google-for-Jobs-konform).
4. **Berufe-Hub `/berufe/[beruf]`** als zentrales Bindeglied Suchintention→Stelle; klare Trennung Info (`/berufe`) vs. Transaktion (`/jobs`).
5. **Local-B2B über `/personalvermittlung/[stadt]`** (Düsseldorf primär) mit striktem Substanz-Gate statt flächiger Stadt-Doorways.

### Die fünf größten SEO-Risiken
1. Doorway/Thin Content durch unkontrollierte Skalierung.
2. Ranking-Dip durch Slug-/Pillar-Migration (Redirect-Disziplin).
3. Google-for-Jobs-Fehler bei URL-Wechsel/Ablauf.
4. Keyword-Kannibalisierung Pillar↔Stadt↔Branche und Jobs↔Berufe.
5. Substanzlose „IT/Bau/Engineering"-Streuung.

### Die zehn zuerst umzusetzenden Seiten
1. Startseite (Positionierung + Zielgruppen-Weiche) — P0
2. `/technische-personalvermittlung` (B2B-Pillar, aus talente-finden) — P0
3. `/jobs` (Hub, Slug-Migration/RSC) — P0
4. `/jobs/[slug]-[id]` (Job-Detail neu) — P0
5. `/personalvermittlung/duesseldorf` (Local-B2B primär) — P1
6. `/berufe` (Berufe-Hub) — P1
7. `/berufe/elektroniker` — P1
8. `/berufe/sps-programmierer` — P1
9. `/berufe/servicetechniker` — P1
10. `/technische-personalvermittlung/ablauf` (+ `/kosten`) — P1

### Für den Geschäftsführer erforderliche Entscheidungen
NAP-Telefonnummer · reale B2B-Regionen/Branchen · Kostentransparenz auf `/kosten` · Referenz-Einwilligungen · Autoren-Sichtbarkeit (E-E-A-T) · Umgang mit „IT/Engineering/Software" · YAFTO-Trennung · Redaktionsressourcen für Fach-Content.

---

*Erstellt als reines Architektur- und Umsetzungskonzept. Keine bestehende Datei verändert, kein Code geschrieben, keine Seite/Komponente erstellt.*
