// City-Registry (EPIC 010A – Fundament, 010B – Düsseldorf migriert, 010C – Köln als Draft).
// Statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
//
// Köln ist DRAFT (status draft, in draftCities, NICHT in publishedCities). Da es keine
// dynamische City-Route gibt und die Sitemap nur Düsseldorf hartcodiert, bleibt Köln
// vollständig unsichtbar. Nur Düsseldorf ist produktiv (mit LocalBusiness-Sonderfall).
import type { CityContent } from "./types";
import { duesseldorf } from "./duesseldorf";
import { koeln } from "./koeln";

export * from "./types";
export { duesseldorf, koeln };

// Alle Städte (published + draft).
export const cities: readonly CityContent[] = [duesseldorf, koeln];

// Nach Veröffentlichungsstatus getrennt.
export const publishedCities: readonly CityContent[] = [duesseldorf];
export const draftCities: readonly CityContent[] = [koeln];

// Statische Slug→Stadt-Zuordnung (alle Städte, auch Drafts – für Lookup/Validierung).
export const cityBySlug: Readonly<Record<string, CityContent>> = {
  duesseldorf,
  koeln,
};
