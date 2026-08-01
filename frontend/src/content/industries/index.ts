// Branchen-Registry (EPIC 008C, erweitert EPIC 009A). Statische Sammlung,
// keine Funktionen, kein Laufzeit-Builder.
//
// EPIC 009A fügt die Branche "elektrotechnik" als DRAFT hinzu (vorbereitet, aber
// bewusst nicht veröffentlicht): sie steht in industries + draftIndustries +
// industryBySlug, aber NICHT in publishedIndustries. Da die 008D-Engine
// (Route/Sitemap/Hub) ausschließlich aus publishedIndustries liest, bleibt sie
// damit unsichtbar. Nur automatisierungstechnik ist produktiv sichtbar.
import type { IndustryContent } from "./types";
import { automatisierungstechnik } from "./automatisierungstechnik";
import { elektrotechnik } from "./elektrotechnik";

export * from "./types";
export { automatisierungstechnik, elektrotechnik };

// Alle Branchen (published + draft).
export const industries: readonly IndustryContent[] = [automatisierungstechnik, elektrotechnik];

// Nach Veröffentlichungsstatus getrennt.
export const publishedIndustries: readonly IndustryContent[] = [automatisierungstechnik];
export const draftIndustries: readonly IndustryContent[] = [elektrotechnik];

// Statische Slug→Branche-Zuordnung (alle Branchen, auch Drafts – für Lookup/Validierung).
export const industryBySlug: Readonly<Record<string, IndustryContent>> = {
  automatisierungstechnik,
  elektrotechnik,
};
