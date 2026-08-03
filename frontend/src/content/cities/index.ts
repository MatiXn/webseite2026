// City-Registry (EPIC 010A – Fundament, EPIC 010B – Düsseldorf migriert).
// Statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
import type { CityContent } from "./types";
import { duesseldorf } from "./duesseldorf";

export * from "./types";
export { duesseldorf };

// Alle Städte (published + draft).
export const cities: readonly CityContent[] = [duesseldorf];

// Nach Veröffentlichungsstatus getrennt.
export const publishedCities: readonly CityContent[] = [duesseldorf];
export const draftCities: readonly CityContent[] = [];

// Statische Slug→Stadt-Zuordnung.
export const cityBySlug: Readonly<Record<string, CityContent>> = {
  duesseldorf,
};
