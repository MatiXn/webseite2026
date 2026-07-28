// Profession Registry – statische Sammlung, keine Funktionen, kein Laufzeit-Builder.
import { elektroniker } from "./elektroniker";
import { mechatroniker } from "./mechatroniker";
import { servicetechniker } from "./servicetechniker";
import { spsAutomatisierung } from "./sps-automatisierung";

export * from "./types";
export { elektroniker, mechatroniker, servicetechniker, spsAutomatisierung };

// Alle Professionen (published + draft).
export const professions = [elektroniker, mechatroniker, servicetechniker, spsAutomatisierung] as const;

// Nach Veröffentlichungsstatus getrennt (manuell gepflegt; Konsistenz-Validator
// gegen die status/publication-Flags folgt in EPIC 006C).
export const publishedProfessions = [elektroniker, mechatroniker] as const;
export const draftProfessions = [servicetechniker, spsAutomatisierung] as const;

// Statische Slug→Profession-Zuordnung (ohne Funktion).
export const professionBySlug = {
  elektroniker: elektroniker,
  mechatroniker: mechatroniker,
  servicetechniker: servicetechniker,
  "sps-automatisierung": spsAutomatisierung,
} as const;
