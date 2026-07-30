// Branchen-Registry – Gerüst (EPIC 008A). Noch KEINE produktive Branche.
// Statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
import type { IndustryContent } from "./types";

export * from "./types";

// Alle Branchen (published + draft) – aktuell leer.
export const industries: readonly IndustryContent[] = [];

// Nach Veröffentlichungsstatus getrennt – aktuell leer.
export const publishedIndustries: readonly IndustryContent[] = [];
export const draftIndustries: readonly IndustryContent[] = [];

// Statische Slug→Branche-Zuordnung – aktuell leer.
export const industryBySlug: Readonly<Record<string, IndustryContent>> = {};
