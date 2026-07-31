// Branchen-Registry (EPIC 008C). Statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
import type { IndustryContent } from "./types";
import { automatisierungstechnik } from "./automatisierungstechnik";

export * from "./types";
export { automatisierungstechnik };

// Alle Branchen (published + draft).
export const industries: readonly IndustryContent[] = [automatisierungstechnik];

// Nach Veröffentlichungsstatus getrennt.
export const publishedIndustries: readonly IndustryContent[] = [automatisierungstechnik];
export const draftIndustries: readonly IndustryContent[] = [];

// Statische Slug→Branche-Zuordnung.
export const industryBySlug: Readonly<Record<string, IndustryContent>> = {
  automatisierungstechnik,
};
