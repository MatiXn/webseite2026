// Alle ausgelieferten Recruiting-Landingpages.
//
// Eine neue Landingpage: Datei in `kampagnen/` anlegen, hier importieren und
// in `KAMPAGNEN` eintragen. Mehr ist nicht nötig — Route, Funnel, API,
// Speicherung, E-Mail und Tracking greifen automatisch.

import type { LandingpageConfig } from "./typen";
import { kaeltetechnikerKoeln } from "./kampagnen/kaeltetechniker-koeln";

export const KAMPAGNEN: LandingpageConfig[] = [kaeltetechnikerKoeln];

export function findeKampagne(slug: string): LandingpageConfig | undefined {
  return KAMPAGNEN.find((k) => k.slug === slug);
}

/** Öffentliche URL einer Kampagne. */
export function kampagnenPfad(config: Pick<LandingpageConfig, "slug">): string {
  return `/stellen/${config.slug}`;
}
