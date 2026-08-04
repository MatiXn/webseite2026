# Changelog

## Candidate Sprint 01A – Kältetechniker-Landingpage

- **Added:** kandidatenorientierte Profession-Seite `/berufe/kaeltetechniker` über die **bestehende** Profession Engine + `ProfessionPageTemplate` (keine neue Engine, kein Template-Sonderfall). Config `content/professions/kaeltetechniker.ts` (published), dünne Route, Registry + `/berufe`-Hub-Karte + Sitemap ergänzt.
- **Job-Matching:** strukturierter Tag `Kältetechnik` — exklusiv auf den 4 echten Kälte-Stellen (Jobs **2, 15, 20, 25**), **0 False Positives** (kein category-Filter, keine breiten Keywords; allgemeine Mechatroniker 10/14/21, SHK 19, allg. Servicetechniker 3/18 matchen nicht).
- **Kandidatenfokus:** Hero „Kältetechniker (m/w/d) gesucht – Jobs in Festanstellung", WhatsApp-CTA über die zentrale `contact.whatsappLink` (keine hartcodierte Nummer), „keine Zeitarbeit" prominent sichtbar, Jobs per `#stellen`-Anker direkt erreichbar. FAQ deckt die 7 Kandidatenfragen sachlich ab; Reise/Bereitschaft/Wochenende nur jobbezogen, keine Pauschalversprechen.
- **Note:** keine erfundenen Gehälter/Benefits, keine neue dynamische Route, keine Städte-Kombinationen; bestehende Professionen/Branchen/Städte/Jobdaten unverändert.

## EPIC 010C – Köln als Draft-Stadt vorbereitet

- **Added:** vollständige `CityContent`-Config `content/cities/koeln.ts` als **Draft** (`status:"draft"`, alle publication-Flags false, `local.verifiedExperience: true`). Inhaltlich eigenständig (kein umbenanntes Düsseldorf): eigene Hero/Overview/localExperience/candidateValue/relevantProfessions/-Industries; **kein NAP, keine Adresse/Geo/Öffnungszeiten, kein LocalBusiness** (Köln = reale Vermittlung ohne Büro). FAQ stellt den Nicht-Standort klar.
- **Changed (Registry):** `cities = [duesseldorf, koeln]`, `publishedCities = [duesseldorf]`, `draftCities = [koeln]`. Düsseldorf unverändert. Da es keine dynamische City-Route gibt und die Sitemap nur Düsseldorf hartcodiert, bleibt Köln **vollständig unsichtbar** (keine Route, kein Sitemap-Eintrag, kein Hub/Footer/Nav-Link).
- **Changed (Template, rein additiv):** `CityPageTemplate` um zwei optionale Abschnitte (`localExperience`, `candidateValue`) ergänzt — rendern nur bei Vorhandensein. Düsseldorf byte-identisch (nutzt beide Felder nicht).
- **Job-Matching:** konservative 0-Treffer-Config. Der Matcher kennt keine Location-Felder; ein Freitext-„Köln" würde Nicht-Köln-Stellen (Langenfeld/Kerpen) falsch einziehen. Echte Köln-Jobs (13, 21) werden bewusst nicht gezeigt statt False Positives (7, 9) zu riskieren. **0 Treffer, 0 False Positives.**
- **Note:** keine neue Route/Sitemap/Nav/Footer, keine neue Matcher-Logik, keine zweite LocalBusiness-Entität (Düsseldorf bleibt einzige Stadt mit LocalBusiness); Profession-/Industry-Engine + Jobdaten unverändert.

## EPIC 010B – Düsseldorf auf die City Content Engine migriert

- **Changed:** `/personalvermittlung/duesseldorf` läuft jetzt vollständig über `CityContent` + City-Composer + `CityPageTemplate`. Gleiche URL, gleiche sichtbare Inhalte (H1, alle 8 H2 in gleicher Reihenfolge, 6 FAQ, CTAs, NAP), gleicher Canonical. Route ist dünn (Metadata via `buildCityMetadata`, Schema via Composer, kein lokaler Content/FAQ/Job-Code).
- **Added:** Config `content/cities/duesseldorf.ts` (published, `local.verifiedExperience: true`), eigenständiges `CityPageTemplate`, Düsseldorf-Sonderfall `buildDuesseldorfLocalBusinessSchema()` (LocalBusiness, `@id` = globale Organization, NAP/Öffnungszeiten aus `company`, **kein geo**, keine zweite Organisation). Registry: `publishedCities = [duesseldorf]`.
- **Changed (Modell, additiv/abwärtskompatibel):** `CityContent` um optionale generische Blöcke erweitert (`hero.supportingParagraphs`, `differentiators`, `specializations`, `employerProcess`, `servedIndustryTags`, `boundaries`, `finalCta`, OG-Passthrough); `overview`/`localExperience`/`candidateValue`/`employerValue` optional; `verifiedExperience` als city-weites `local`-Flag. Validator + `buildCityMetadata` entsprechend erweitert.
- **Schema:** City-Graph = `CollectionPage + BreadcrumbList + Service (+ FAQPage)` (genau **ein** Service); Profession-Graphen weiterhin **ohne** Service; Industry-Graph unverändert; globale Organization bleibt **eine** Entität.
- **Note:** dokumentierte, nicht-negative Deltas: Breadcrumb-Labels „Startseite → Personalvermittlung → Düsseldorf" (spec-vorgegeben); Twitter-Card + OG-Image + Keywords werden ergänzt (Angleichung an alle anderen Engine-Seiten). Keine neue Stadt, keine dynamische Route, Sitemap-URL unverändert, Profession-/Industry-Engine + Jobdaten unverändert.

## EPIC 010A – City Content Engine: Fundament

- **Added:** eigenständige City-Domäne (lokaler Vermittlungsmarkt, `/personalvermittlung/<stadt>`) – Datenmodell `content/cities/types.ts`, **leere** Registry `content/cities/index.ts`, Validator + Registry-Validator (`validate-city.ts` / `validate-city-registry.ts`), Composer `build-city-metadata.ts` / `build-city-schema.ts` / `build-city-internal-links.ts`. Siehe [CITY-CONTENT-ENGINE.md](CITY-CONTENT-ENGINE.md).
- **Schema:** `buildCitySchema` = `CollectionPage + BreadcrumbList + Service (+ FAQPage) (+ ItemList)`. Organization nur als `@id`-Referenz, **kein LocalBusiness / keine zweite Organization / keine erfundene Adresse** für Städte ohne Büro. `Service.areaServed` aus der Config. Kein JobPosting.
- **Validator:** `verifiedExperience`-Gate (verbietet unbelegte lokale Vermittlungsaussagen bei `false`), verbietet erfundene Aktivitätszahlen und Marktführer-/Garantie-/Erfolgsquoten-Claims; strenge Identitäts-/Publication-/Link-/Registry-Regeln.
- **Changed (additiv, kein Verhaltenswechsel):** `InternalLinkType` (+`industry`,`city`), `InternalLinkSource` (+`industry-registry`,`city-config`,`city-registry`), neue City-Link-Konstanten; Composer/Validator in die jeweiligen Engine-Index-Exports aufgenommen.
- **Note:** keine sichtbare Änderung – keine Route, keine Sitemap-URL, kein Template, keine Nav/Footer-Änderung, keine produktive Stadt. Düsseldorf-Seite byte-identisch; Profession-/Industry-Engine unverändert; Jobdaten unverändert. Düsseldorf bleibt Referenz (Migrationsanalyse dokumentiert), wird aber NICHT migriert.

## EPIC 009B – Elektrotechnik kontrolliert veröffentlichen

- **Changed:** `elektrotechnik` von Draft auf **published** geschaltet — `status:"published"`, alle `publication`-Flags true. Registry: `publishedIndustries = [automatisierungstechnik, elektrotechnik]`, `draftIndustries = []`.
- **Automatisch (datengetrieben, kein neuer Code):** die 008D-Engine erzeugt daraus `/branchen/elektrotechnik` (SSG), die Hub-Karte auf `/branchen` und den Sitemap-Eintrag — keine hartcodierte Route/Karte/URL. `IndustryPageTemplate`, Route, Hub, `sitemap.ts` und Footer **unverändert**.
- **Unverändert:** Matchstrategie `category:["elektro"]` (15 Treffer, 8 sichtbar, 0 Ausschlüsse, 0 False Positives); Jobdaten; Profession-Configs; Automatisierungstechnik (Match [7], published).
- **Note:** sichtbare 8 Jobs (Reihenfolge): 1, 11, 12, 13, 16, 17, 22, 23. Jobs-Überschrift „Aktuell passende Stellen" (Plural). Genau eine H1 je Seite; Schema-ItemList = die 8 sichtbaren Jobs, kein JobPosting.

## EPIC 009A – Referenz-Branche Elektrotechnik (Draft)

- **Added:** zweite `IndustryContent`-Config `elektrotechnik` (`content/industries/`) — sachlich, ohne erfundene Zahlen/Gehälter/Garantien/Referenzen. Branche Elektrotechnik = Unternehmens-/Einsatzumfeld (klar abgegrenzt von der Profession „Elektroniker").
- **Added:** konservative `jobMatch`-Strategie über das strukturierte Kategorie-Signal `category:["elektro"]` — trifft exakt die 15 real als Elektrotechnik erfassten Stellen (IDs 1, 3, 4, 5, 6, 8, 9, 11, 12, 13, 16, 17, 22, 23, 24), **0 False Positives**. Kälte-/Mechatronik-Stellen (`mechatronik`), die reine SPS-Stelle (Job 7, `it`) und SHK (Job 19, `bau`) fallen strukturell heraus; Job 7 bleibt exklusiv der Automatisierungstechnik.
- **Changed:** Branchen-Registry um `elektrotechnik` erweitert — als **Draft** (`status:"draft"`, in `draftIndustries`, **nicht** in `publishedIndustries`). Da die 008D-Engine datengetrieben aus `publishedIndustries` liest, bleibt `/branchen/elektrotechnik` unsichtbar: keine Route, kein Sitemap-Eintrag, keine Hub-Karte. Sichtbarschaltung folgt in einem späteren EPIC.
- **Note:** keine neue Matcher-Logik, keine Industry-Sonderlogik, keine Jobdaten-/Profession-Änderung; kein Route-/Sitemap-/Hub-/Template-/Nav-/Footer-Code angefasst. `automatisierungstechnik` (Match [7]) und die vier Professionen unverändert.

## EPIC 008D – Branchen-Seiten sichtbar machen

- **Added:** `IndustryPageTemplate` (`content-engine/templates/`) — eigenständiges Branchen-Template (Markt-/Unternehmensumfeld, nicht Berufsprofil); nutzt dieselben UI-Primitive wie die Profession-Seite (Nav/Footer/JsonLd/BreadcrumbsView/FaqSection, Design-Tokens) + die Industry-Composer. `ProfessionPageTemplate` **unverändert**.
- **Added:** Branchen-Hub `/branchen` (statisch) — Karten aus `publishedIndustries`, Metadata über `buildPageMetadata`, Schema (CollectionPage + BreadcrumbList) über die generischen Sub-Builder.
- **Added:** dynamische Detailroute `/branchen/[slug]` — `generateStaticParams` nur aus `publishedIndustries` (Drafts nie generiert), unbekannter Slug → `notFound()`, Metadata via `buildIndustryMetadata`, dünn (kein Match/Schema in der Route). Erzeugt genau `/branchen/automatisierungstechnik`.
- **Changed:** Sitemap um `/branchen` + iterierte `publishedIndustries` erweitert; Footer-Spalte „Unternehmen" um Link `/branchen` (kleinste sinnvolle sichtbare Integration). Bestehende Sitemap-/Footer-Einträge unverändert.
- **Note:** Jobbereich = exakt der eine Matcher-Treffer (Job 7), Ein-Job-Formulierung im Singular („Aktuell passende Stelle"); 0-Job-Fallback ohne leere Karten. Genau eine H1 je Seite, kein JobPosting, keine Draft-/numerischen Links.
- **Note:** keine neue Branche, keine Matchstrategie-Änderung, keine Profession-/Jobdaten-Änderung, fremde Security-/LinkedIn-Features + fremde `.gitignore` unangetastet.
- **Fixed:** keine.

## EPIC 008C – Referenz-Branche „Automatisierungstechnik"

- **Added:** produktive `IndustryContent`-Config `automatisierungstechnik` (`content/industries/automatisierungstechnik.ts`) — sachliches Branchen-/Marktumfeld (Personalvermittlung), klar abgegrenzt von der Profession „SPS/Automatisierung" (Berufsprofil); keine erfundenen Zahlen/Garantien.
- **Added:** Aufnahme in die Industry-Registry (`industries`/`publishedIndustries`/`industryBySlug`); `draftIndustries` bleibt leer. Validator grün (0 Errors/Warnings).
- **Note (Matching konservativ):** `jobMatch = category:["it"] + tags:["SPS","Siemens TIA Portal"] (+ excludeKeywords)` → **genau 1 Treffer (id 7)**, 0 False Positives. Breitere Signale (Tag/Keyword „Automatisierung") hätten allgemeine Elektro-Stellen (id 12/24) falsch eingezogen — bewusst ausgeschlossen. Präzision vor Reichweite.
- **Note:** relatedProfessions = `sps-automatisierung`, `elektroniker`, `mechatroniker` (published, fachlich Automatisierungsbezug); `servicetechniker` bewusst nicht (zu allgemein).
- **Added:** Config-/Registry-/Matching-/Composer-Integrationstests.
- **Note:** **keine** Route/Template/Hub/Sitemap/Navigation/Backlink — Config liegt produktiv in der Registry, bleibt aber bis 008D inert (kein Auto-Mechanismus zieht Registry-Einträge in Sitemap/Nav/Routen). Keine sichtbare Website-Änderung; vier Professionen ohne Regression.
- **Fixed:** keine.

## EPIC 008B – Branchen-Content-Engine: Composer

- **Added:** `buildIndustryMetadata(industry)`, `buildIndustrySchema(industry, matchedJobs)`, `buildIndustryInternalLinks(input)` — dünne Wrapper über die vorhandenen generischen Primitive (buildPageMetadata, Schema-Sub-Builder + Dedupe, validateInternalLink/deduplicateInternalLinks/buildJobLinks). Keine kopierte Engine, keine Branchen-Sonderlogik.
- **Changed (rückwärtskompatibel):** `buildRelatedProfessionLinks` um slug-basierten Kern `buildRelatedProfessionLinksFromSlugs` erweitert (Profession-Wrapper delegiert, Ausgabe identisch); `ContentMetadataError.validationCodes` auf `string[]` geweitet (domänenneutral); `InternalLinkSource` um `"industry-config"` ergänzt.
- **Added:** `IndustryInternalLinksResult`-Typ, Industry-Core-Link-/Hub-Konstanten.
- **Added:** Unit-Tests für alle drei Composer (inkl. 0-Job-Verhalten, Draft-Handling, Dedup, keine Organization-Duplikation/kein JobPosting) + Regressionschecks der Profession-Composer.
- **Note:** keine Route/Template/Hub/Sitemap/echte Branche; Registry weiterhin leer; keine sichtbare Website-Änderung. Vier Professionen ohne Metadata-/Schema-/Link-/Matching-Regression.
- **Fixed:** keine.

## EPIC 008A – Branchen-Content-Engine: Basis + Datenmodell

- **Added:** eigenständiges Branchen-Datenmodell `IndustryContent` (`content/industries/types.ts`) — separate Domäne, kein Shared-Type-Layer; generische Primitive (`Cta`, `JobMatchConfig`, `SearchIntent`, `FaqEntry`) werden importiert statt kopiert.
- **Added:** Branchen-Registry-Gerüst (`content/industries/index.ts`) — `industries`/`publishedIndustries`/`draftIndustries`/`industryBySlug`, zunächst leer, valide typisiert.
- **Added:** `validateIndustry` + `validateIndustryRegistry` (eigene `IndustryValidation*`-Typen/Codes) — prüfen Slug, Status, Publication-Konsistenz, Canonical, Metadata, FAQ, interne Links, Job-Match-Config und Registry-Konsistenz.
- **Changed (rückwärtskompatibel):** Job-Matcher um generischen Kern erweitert — `matchJobToConfig(job, jobMatch, contextSlug)` / `matchJobsForConfig(jobs, jobMatch, contextSlug)`; `matchJobToProfession`/`matchJobsForProfession` delegieren daran (identisches Verhalten).
- **Changed (rückwärtskompatibel):** `buildFaqSchema(faq[], id)` statt `(profession, id)` — Ausgabe unverändert; Profession-Composer + Test angepasst.
- **Added:** Unit-Tests für Industry-Validator, Industry-Registry und generischen Matcher-Kern.
- **Note:** keine Route/Hub/Template/Branchen-Inhalte/Composer/Sitemap — reine Basis. Kein Shared-Type-Layer. Keine sichtbare Website-Änderung. Vier Professionen ohne Matching-/Metadata-/Schema-Regression.
- **Fixed:** keine.

## EPIC 007D – Veröffentlichung SPS/Automatisierung

- **Changed:** Profession `sps-automatisierung` von Draft auf **published** (Flags + Registry `publishedProfessions`; `draftProfessions` jetzt leer).
- **Changed (Variante B):** freie `keywords` aus der `jobMatch`-Config entfernt — Matching nur noch über `category:["it"]` + Tags `["SPS","Siemens TIA Portal"]` (+ excludeKeywords). Grund: die Keyword-Suche erzeugte 3 fachlich fragliche Treffer (Elektro-/Mechatronikstellen mit SPS nur als Nebenkompetenz). Ergebnis: **genau 1 Treffer** (der echte SPS-Programmierer/Automatisierungstechniker), 0 False Positives.
- **Added:** neue Route `/berufe/sps-automatisierung` — dünn, über `ProfessionPageTemplate`. Hub-Karte verlinkt; Sitemap-Eintrag ergänzt.
- **Added:** matcher-basierter Job-Backlink „Mehr zum Berufsbild SPS-/Automatisierung →". Related-Ziele: Elektroniker + Mechatroniker (published).
- **Note:** `ProfessionPageTemplate` **unverändert**. Alle vier Professionen (Elektroniker, Mechatroniker, Servicetechniker, SPS) sind jetzt published.
- **Changed:** Draft-Fixture-Tests auf synthetische Draft-/Keyword-Fixtures umgestellt (keine echte Draft-Profession mehr vorhanden).
- **Fixed:** keine.

## EPIC 007C – Veröffentlichung Servicetechniker

- **Changed:** Profession `servicetechniker` von Draft auf **published** (Flags + Registry `publishedProfessions`); `jobMatch` bewusst **unverändert** (Variante A). Related-Ziele auf die jetzt veröffentlichten `elektroniker` + `mechatroniker` erweitert.
- **Added:** neue Route `/berufe/servicetechniker` — dünn, über `ProfessionPageTemplate`. Hub-Karte verlinkt die Detailseite; Sitemap-Eintrag ergänzt.
- **Added:** konditionaler Job-Backlink „Mehr zum Berufsbild Servicetechniker →" — **matcher-basiert** (`matchJobToProfession(job, servicetechniker).matched`), da Servicestellen mehrere Kategorien spannen. Elektroniker-/Mechatroniker-Backlinks unberührt.
- **Note:** `ProfessionPageTemplate` **unverändert**. Matching-Analyse: 7 Treffer (alle echte Servicetechniker-Rollen), 6 sichtbar, 0 ausgeschlossen; Grenzfall id 19 (Anlagenmechaniker SHK, Score 55) bleibt konservativ unter der Match-Schwelle.
- **Changed:** bestehende Draft-Fixture-Tests auf `spsAutomatisierung` umgestellt (Servicetechniker ist keine Draft mehr).
- **Fixed:** keine.

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
