// Branchen-Registry (EPIC 008C, erweitert EPIC 009A, veröffentlicht EPIC 009B).
// Statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
//
// EPIC 009B schaltet "elektrotechnik" von Draft auf published: beide Branchen sind
// jetzt in publishedIndustries, draftIndustries ist leer. Da die 008D-Engine
// (Route/Sitemap/Hub) datengetrieben aus publishedIndustries liest, werden dadurch
// /branchen/elektrotechnik, der Sitemap-Eintrag und die Hub-Karte automatisch erzeugt.
// Reihenfolge in publishedIndustries = Anzeige-Reihenfolge im Hub.
import type { IndustryContent } from "./types";
import { automatisierungstechnik } from "./automatisierungstechnik";
import { elektrotechnik } from "./elektrotechnik";

export * from "./types";
export { automatisierungstechnik, elektrotechnik };

// Alle Branchen (published + draft).
export const industries: readonly IndustryContent[] = [automatisierungstechnik, elektrotechnik];

// Nach Veröffentlichungsstatus getrennt. Beide Branchen sind published, keine Drafts.
export const publishedIndustries: readonly IndustryContent[] = [automatisierungstechnik, elektrotechnik];
export const draftIndustries: readonly IndustryContent[] = [];

// Statische Slug→Branche-Zuordnung.
export const industryBySlug: Readonly<Record<string, IndustryContent>> = {
  automatisierungstechnik,
  elektrotechnik,
};
