# Changelog

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
