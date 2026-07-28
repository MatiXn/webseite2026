# Changelog

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
