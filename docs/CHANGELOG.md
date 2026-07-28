# Changelog

## EPIC 007B – Mechatroniker-Seite mit Profession Template

- **Added:** veröffentlichte Profession `mechatroniker` (`src/content/professions/mechatroniker.ts`) — sachliche Berufsbild-Inhalte, geerdet an den 8 realen Mechatronik-Stellen (Montage/Inbetriebnahme, Kälte-/Klimatechnik, Service, Instandhaltung); 10 FAQ mit etablierten PHE-Service-Fakten, keine erfundenen Claims. In die Registry aufgenommen (`publishedProfessions`, `professionBySlug`).
- **Added:** neue Route `/berufe/mechatroniker` — dünn, komplett über `ProfessionPageTemplate` (Metadata + `<ProfessionPageTemplate profession={mechatroniker} />`).
- **Changed:** Berufe-Hub verlinkt die Mechatroniker-Karte auf `/berufe/mechatroniker`; Sitemap-Eintrag ergänzt; konditionaler Job-Backlink „Mehr zum Berufsbild Mechatroniker →" auf Mechatronik-Jobseiten (Kategorie-Match, Elektroniker-Backlink unberührt).
- **Note:** `ProfessionPageTemplate` **unverändert** (keine berufsspezifische Sonderlogik nötig). jobMatch = `category:["mechatronik"]`, sichtbar 6 von 8 Treffern; Related-Link auf Elektroniker.
- **Fixed:** keine.

## EPIC 007A – Profession Page Template

- **Added:** berufsneutrales `ProfessionPageTemplate` (`src/content-engine/templates/`) — Server Component, rendert eine vollständige Profession-Seite aus einer Config + der Content Engine (Job-Matching, Schema, interne Links, Breadcrumbs, alle Abschnitte, Related-Sektion nur bei vorhandenen Links).
- **Changed:** `src/app/berufe/elektroniker/page.tsx` auf 12 Zeilen reduziert (nur Imports, Metadata, `<ProfessionPageTemplate profession={elektroniker} />`).
- **Note:** Template importiert die zentrale `JOBS`-Quelle + `professionBySlug` selbst (dünnste Route-API `{ profession }`); Builder laufen genau einmal. Keine berufsspezifische Prosa im Template — Begriffe kommen aus `profession.name`/`shortName`.
- **Note:** einzige sichtbare Textabweichung: Anforderungs-Überschrift „bei Elektroniker**n**" → „bei Elektroniker" (Dativ-Plural, Folge der Berufsneutralität ohne Config-Änderung). Metadata, Schema, Jobauswahl, Breadcrumbs unverändert.
- **Added:** Route-/Template-Paritätstests. `templates` bleibt bewusst aus dem `content-engine`-Barrel heraus (reine Engine ohne React importierbar).
- **Fixed:** keine.

## EPIC 006D – Migration Elektroniker-Seite auf die Content Engine

- **Changed:** `/berufe/elektroniker` bezieht Metadata, Schema, Job-Matching und interne Links jetzt zentral aus der Content Engine (`buildProfessionMetadata`, `matchJobsForProfession`, `buildProfessionSchema`, `buildProfessionInternalLinks`); alle Profession-Inhalte kommen aus der Registry (`elektroniker`), keine lokalen Datenkopien mehr.
- **Removed:** lokale Konstanten (Fachrichtungen, Einsatzbereiche, Anforderungen, Prozess, FAQ), lokale `category`-Filterlogik, lokale Metadata- und Schema-Blöcke.
- **Added:** schemafreie `BreadcrumbsView`-Präsentationskomponente (das BreadcrumbList-Schema liefert die Engine → genau eine Breadcrumb-Quelle, keine doppelten @ids).
- **Added:** Migrations-Tests (Metadata, Jobs, Schema, interne Links, Content-Parität).
- **Note:** sichtbare Jobauswahl ändert sich durch das zentrale Scoring (dokumentiert im PR); Breadcrumb-Label „Home" → „Startseite"; OG-Title/Description folgen jetzt der Registry. URL, Redirects, Sitemap-Eintrag und Job-Backlinks unverändert.
- **Fixed:** keine.

## EPIC 006C.5 – Internal-Link-Builder

- **Added:** Profession-Internal-Link-Builder (`src/content-engine/internal-links/**`) — reine, deterministische Funktionen, erzeugen sichere interne Links (Breadcrumbs, Core, Related, Jobs) gruppiert nach Zielgruppe.
- **Added:** Breadcrumb-, Related-Profession- und Job-Link-Builder; Core-Link-Builder mit kuratierten Labels.
- **Added:** Link-Validierung (`validateInternalLink`, typisiertes Ergebnis) und href-basierte Deduplikation (`deduplicateInternalLinks`).
- **Added:** typisierter Fehler `ContentInternalLinkError`; Draft standardmäßig abgelehnt, `allowDraft` nur für Tests/Analyse.
- **Added:** 57 Unit-Tests, optionales Skript `npm run analyze:internal-links`.
- **Note:** nur veröffentlichte Ziele werden verlinkt; keine toten/numerischen Job-URLs, keine `/talente-finden`-Links, keine Draft-Ziele.
- **Changed:** keine Produktivseiten, Komponenten, Routen, Job-Daten oder Profession-Configs; keine Live-Integration.
- **Fixed:** keine.

## EPIC 006C.4 – Schema Builder

- **Added:** Schema Builder für Professionen (`src/content-engine/schema/**`) — reine, deterministische Funktionen, erzeugen einen deduplizierten Schema.org-`@graph`.
- **Added:** Breadcrumb Builder (`buildBreadcrumbSchema`) aus derselben Crumb-Quelle wie die UI.
- **Added:** FAQ Builder (`buildFaqSchema`) ausschließlich aus `profession.faq`; leer → kein Knoten.
- **Added:** ItemList Builder (`buildItemListSchema`) aus bereits gematchten Jobs (kein Matching im Builder); nur position/url/name, keine JobPosting-Daten.
- **Added:** CollectionPage Builder (`buildCollectionPageSchema`) mit reinen @id-Referenzen auf Organization, Breadcrumb und ItemList.
- **Added:** Graph-Deduplication (`deduplicateSchemaGraph`) über @id; Konflikt (@id gleich, Inhalt verschieden) → `ContentSchemaError`.
- **Added:** Organization-Referenz (`buildOrganizationReference`) — nur `{ "@id": … }`, nie eine zweite Organization.
- **Added:** 42 Unit-Tests, optionales Skript `npm run analyze:schema`.
- **Changed:** keine Produktivseiten, Komponenten, Routen, Job-Daten oder Profession-Configs; globales Organization-Schema in `layout.tsx` unverändert; keine Live-Integration.
- **Fixed:** keine.

## EPIC 006C.3 – Metadata Builder

- **Added:** generischer Metadata Builder (`buildPageMetadata`) und Profession-Builder (`buildProfessionMetadata`) unter `src/content-engine/metadata/**` — reine, deterministische Funktionen, Rückgabe als offizieller Next.js-`Metadata`-Typ.
- **Added:** Canonical-Normalisierung (`buildCanonicalUrl`) mit Ablehnung externer/protokoll-relativer Eingaben.
- **Added:** typisierter Fehler `ContentMetadataError` (Slug + Validierungscodes) bei ungültiger Profession-Config.
- **Added:** 36 Unit-Tests (Canonical, generischer Builder, Profession-Builder, Live-Registry).
- **Added:** optionales Skript `npm run analyze:metadata`.
- **Note:** Domain, Markenname und globales OG-Bild werden aus der Company Registry abgeleitet (kein doppelter String). Keywords-Feld wird genutzt, weil das Projekt es bereits verwendet (`layout.tsx`). Keine Twitter-Handles, keine hreflang-Alternates.
- **Changed:** keine Produktivseiten, Komponenten, Routen, Job-Daten oder Profession-Configs; keine Live-Integration (keine Seite importiert den Builder).
- **Fixed:** keine.

## EPIC 006C.2 – Deterministischer JobMatcher

- **Added:** Job-Matching-Modul (`src/content-engine/job-matching/**`) — reine, deterministische Funktionen: `scoreJob`, `matchJobToProfession`, `matchJobsForProfession`, Textnormalisierung.
- **Added:** zentrale Gewichte, Konfidenz-Schwellen und eine kleine explizite Synonymtabelle (kein Stemming, keine KI).
- **Added:** 32 Unit-Tests (Normalisierung, Einzel-Match, Listen-Match, Live-Registry).
- **Added:** optionales Skript `npm run analyze:job-matching`.
- **Note:** `src/app/jobs/data.ts` hat kein `skills`-Feld — die Signalquelle „skills" bildet auf `job.profil` ab, „description" auf `job.description` + `job.intro` + `job.aufgaben`. Dokumentiert in `types.ts`/`score-job.ts`.
- **Note:** Kategorie `it` ist bei den realen Daten ausschließlich der (fachlich passende) SPS-Job — eine „Kategorie nur unterstützend"-Regel ist derzeit nicht nötig; die saubere Erweiterung wäre ein optionales Flag in `JobMatchConfig` (bewusst nicht Teil dieses EPICs).
- **Changed:** keine Produktivseiten, Komponenten, Routen, Job-Daten oder Profession-Configs.
- **Fixed:** keine.

## EPIC 006C.1 – Profession Validator

- **Added:** Profession- und Registry-Validator (`src/content-engine/validation/**`) — reine, deterministische Funktionen.
- **Added:** Unit-Tests für Einzel- und Registry-Validierung.
- **Added:** optionales Skript `npm run validate:content` (Live-Registry-Prüfung via Vitest).
- **Changed:** keine Produktivseiten, Komponenten oder Routen.
- **Fixed:** keine.
