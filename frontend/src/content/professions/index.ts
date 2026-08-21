// Profession Registry – statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
import { elektroniker } from "./elektroniker";
import { mechatroniker } from "./mechatroniker";
import { servicetechniker } from "./servicetechniker";
import { spsAutomatisierung } from "./sps-automatisierung";
import { kaeltetechniker } from "./kaeltetechniker";
import { elektronikerBetriebstechnik } from "./elektroniker-betriebstechnik";
import { elektronikerEnergieGebaeudetechnik } from "./elektroniker-energie-gebaeudetechnik";
import { servicetechnikerElektrotechnik } from "./servicetechniker-elektrotechnik";
import { inbetriebnehmer } from "./inbetriebnehmer";

export * from "./types";
export { elektroniker, mechatroniker, servicetechniker, spsAutomatisierung, kaeltetechniker, elektronikerBetriebstechnik, elektronikerEnergieGebaeudetechnik, servicetechnikerElektrotechnik, inbetriebnehmer };

// Alle Professionen (published + draft).
export const professions = [elektroniker, mechatroniker, servicetechniker, spsAutomatisierung, kaeltetechniker, elektronikerBetriebstechnik, elektronikerEnergieGebaeudetechnik, servicetechnikerElektrotechnik, inbetriebnehmer] as const;

// Nach Veröffentlichungsstatus getrennt (manuell gepflegt; Konsistenz-Validator
// gegen die status/publication-Flags folgt in EPIC 006C).
export const publishedProfessions = [elektroniker, mechatroniker, servicetechniker, spsAutomatisierung, kaeltetechniker, elektronikerBetriebstechnik, elektronikerEnergieGebaeudetechnik, servicetechnikerElektrotechnik, inbetriebnehmer] as const;
export const draftProfessions = [] as const;

// Statische Slug→Profession-Zuordnung (ohne Funktion).
export const professionBySlug = {
  elektroniker: elektroniker,
  mechatroniker: mechatroniker,
  servicetechniker: servicetechniker,
  "sps-automatisierung": spsAutomatisierung,
  kaeltetechniker: kaeltetechniker,
  "elektroniker-betriebstechnik": elektronikerBetriebstechnik,
  "elektroniker-energie-gebaeudetechnik": elektronikerEnergieGebaeudetechnik,
  "servicetechniker-elektrotechnik": servicetechnikerElektrotechnik,
  inbetriebnehmer: inbetriebnehmer,
} as const;
