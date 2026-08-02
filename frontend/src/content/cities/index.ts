// City-Registry (EPIC 010A – Fundament). Statische Sammlung, keine Funktionen,
// kein Laufzeit-Builder. In 010A bewusst LEER: keine produktive Stadt, keine
// Düsseldorf-/Köln-Config, keine sichtbare Wirkung. Die leere Registry ist
// vollständig typisiert und valide (validateCityRegistry).
import type { CityContent } from "./types";

export * from "./types";

// Alle Städte (published + draft).
export const cities: readonly CityContent[] = [];

// Nach Veröffentlichungsstatus getrennt.
export const publishedCities: readonly CityContent[] = [];
export const draftCities: readonly CityContent[] = [];

// Statische Slug→Stadt-Zuordnung.
export const cityBySlug: Readonly<Record<string, CityContent>> = {};
