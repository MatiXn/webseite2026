# City Content Engine – Fundament (EPIC 010A)

Technische Grundlage für skalierbare Stadt-/Standortseiten (`/personalvermittlung/<stadt>`).
010A ist reines Fundament: **keine sichtbare Änderung**, keine Route, keine Sitemap, kein Template,
keine produktive Stadt. Die City-Registry ist bewusst leer.

## Domänen-Abgrenzung

- **Profession** = Berufsprofil (`/berufe/...`)
- **Industry** = Branchenumfeld (`/branchen/...`)
- **City** = lokaler Vermittlungsmarkt (`/personalvermittlung/...`)

City ist eine eigene Domäne. Keine universelle `ContentPage`-Abstraktion, kein Shared-Type-Layer.

## Bausteine (neu in 010A)

| Baustein | Datei |
|---|---|
| Datenmodell | `src/content/cities/types.ts` |
| Registry (leer) | `src/content/cities/index.ts` |
| Validator | `src/content-engine/validation/validate-city.ts` |
| Registry-Validator | `src/content-engine/validation/validate-city-registry.ts` |
| Metadata-Composer | `src/content-engine/metadata/build-city-metadata.ts` |
| Schema-Composer | `src/content-engine/schema/build-city-schema.ts` |
| Internal-Links-Composer | `src/content-engine/internal-links/build-city-internal-links.ts` |

## Wiederverwendete generische Primitive (unverändert)

`buildPageMetadata`, `buildCanonicalUrl`, `buildBreadcrumbSchema`, `buildFaqSchema`,
`buildItemListSchema`, `buildCollectionPageSchema`, `buildOrganizationReference`,
`deduplicateSchemaGraph`, `matchJobsForConfig`, `buildJobLinks`,
`buildRelatedProfessionLinksFromSlugs`, `deduplicateInternalLinks`, `validateInternalLink`,
`jobPath`, `FaqEntry`, `JobMatchConfig`, `Cta`, `SearchIntent`, `Severity`, `company`.

Additiv erweitert (kein Verhaltenswechsel für Profession/Industry): `InternalLinkType`
(`"industry"`, `"city"`), `InternalLinkSource` (`"industry-registry"`, `"city-config"`,
`"city-registry"`), plus neue City-Label-Konstanten und ein City-Breadcrumb-Hub-Label.

## Schema-Entscheidung (wichtig)

- **Kein LocalBusiness / keine zweite Organization pro Stadt.** Das Büro liegt ausschließlich
  in Düsseldorf; für andere Städte wird **keine Adresse und kein Standort-Knoten erfunden**.
- Die eine globale Organization (`layout.tsx`, `@id = …/#organization`) bleibt die zentrale Entität
  und wird nur per `@id` referenziert (`provider` / `publisher`).
- City-spezifisch sind ausschließlich `Service` (mit `areaServed` aus der Config) und die
  Job-`ItemList`. Graph: `CollectionPage + BreadcrumbList + Service (+ FAQPage) (+ ItemList)`.
- Kein JobPosting, keine Reviews/AggregateRating, keine Gehalts-/Preisdaten, keine doppelten `@id`s,
  keine leere ItemList.

## `verifiedExperience`

`verifiedExperience: true` bedeutet ausschließlich: PHE-Perm hat dort tatsächlich vermittelt oder
Kunden/Kandidaten betreut. Bei `false` verbietet der Validator Formulierungen, die reale lokale
Vermittlung behaupten (`CITY_UNVERIFIED_LOCAL_CLAIM`). Erfundene Aktivitätszahlen
(Kunden/Kandidaten/Vermittlungen) sind immer verboten (`CITY_FORBIDDEN_NUMBER`), ebenso
Marktführer-/Garantie-/Erfolgsquoten-Claims (`CITY_FORBIDDEN_CLAIM`).

## Update EPIC 010B: Düsseldorf migriert

`/personalvermittlung/duesseldorf` läuft seit 010B vollständig über `CityContent` +
`CityPageTemplate` (siehe CHANGELOG 010B). Für die verlustfreie Parität wurde das Modell
additiv erweitert (optionale Blöcke `differentiators`/`specializations`/`employerProcess`/
`servedIndustryTags`/`boundaries`/`finalCta`/`hero.supportingParagraphs`, OG-Passthrough;
`overview`/`localExperience`/`candidateValue`/`employerValue` optional; `verifiedExperience`
als `local`-Flag). Der Düsseldorf-`LocalBusiness`-Knoten bleibt Sonderfall in der Route
(`buildDuesseldorfLocalBusinessSchema`), NICHT im generischen `buildCitySchema`.

## Düsseldorf-Migrationsanalyse (Referenz — Grundlage der 010B-Migration)

Analyse, die die 010B-Migration angeleitet hat:

**Später nach `CityContent` überführbar (city-spezifisch):**
- Metadata (Title/Description/Canonical/OG) → `metadataTitle`/`metadataDescription`/`canonicalPath`
- H1 „Personalvermittlung Düsseldorf für technische Fachkräfte" → `hero.headline`
- Hero-Intro/Absätze → `hero.intro` / `overview`
- FAQ (6 Einträge) → `faq`
- Spezialisierungs-/Branchen-Chips → `relevantProfessions` / `relevantIndustries` (statt freier Chips)
- `areaServed` „Düsseldorf" → `local.cityName` / `local.areaServed`
- CTAs → `hero.primaryCta` / `hero.secondaryCta`, `employerValue` / `candidateValue`

**Global (bleibt zentral, nicht pro Stadt dupliziert):**
- Grundsätze / „Warum wir anders arbeiten" / Ablauf (6 Schritte) / „Wann wir Nein sagen"
  → zentrale Vermittlungsphilosophie & `DEFAULT_PROCESS` wiederverwenden, keine zweite Kopie.
- Organization/NAP/Öffnungszeiten → globale Organization in `layout.tsx`.

**Schema-Knoten, die bei Migration entfernt/ersetzt werden:**
- Der hartcodierte `LocalBusiness`-Knoten (mit Düsseldorfer Adresse, `@id = …/#organization`) ist
  **Düsseldorf-spezifisch** (echtes Büro) und wird NICHT Teil des generischen City-Composers.
  Für Düsseldorf bleibt dieser Knoten korrekt; er ist nicht auf andere Städte übertragbar.
- Der hartcodierte `Service`-Knoten wird durch `buildCitySchema` (Service + areaServed, provider-@id) ersetzt.
- Die hartcodierte `FAQPage` wird durch `buildFaqSchema` ersetzt.

**Paritätsrisiken bei der Migration:**
- Düsseldorf besitzt reale NAP-/Öffnungszeiten-Daten und ein echtes Büro — die generische City-Seite
  darf diese lokale Adresse für andere Städte NICHT erzeugen. Düsseldorf ist damit ein Sonderfall
  (LocalBusiness zulässig), alle anderen Städte nicht.
- Aktuelle Düsseldorf-Chips verlinken teils generisch auf `/berufe`; die Registry-basierte Auflösung
  verlangt konkrete published Slugs — bei Migration sind die Links präziser (kanonische Zielseiten).
- Breadcrumb-Parität: bestehende Seite nutzt „Home → Technische Personalvermittlung → …";
  der City-Composer nutzt „Startseite → Personalvermittlung → Stadt". Vor Migration abzustimmen.
