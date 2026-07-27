// Deterministisches Job-Matching: Typen + zentrale Gewichte/Schwellen/Synonyme.
// Reine Daten & Typen — kein any, keine Seiteneffekte, keine Browser-APIs.
//
// Feld-Mapping (WICHTIG): src/app/jobs/data.ts hat KEIN dediziertes "skills"-Feld.
// Die abstrakte Signalquelle "skills" wird deshalb auf das reale Anforderungsprofil
// (job.profil) abgebildet, "description" auf den beschreibenden Freitext
// (job.description + job.intro + job.aufgaben). Siehe score-job.ts.
import type { Job } from "../../app/jobs/data";

export type Confidence = "high" | "medium" | "low" | "none";

// Fundstelle eines Signals. "skills" = Anforderungsprofil (job.profil).
export type MatchSource = "category" | "tag" | "title" | "skills" | "description" | "exclude";

export type MatchReason = {
  readonly signal: string; // Art des Signals: "category" | "tag" | "keyword" | "exclude"
  readonly value: string; // konkret getroffener Wert (Kategorie, Tag, Keyword)
  readonly weight: number; // Punktbeitrag (negativ bei Ausschluss)
  readonly source: MatchSource; // wo der Treffer entstand
  readonly message: string; // menschenlesbare Begründung (deutsch)
};

export type JobScore = {
  readonly score: number; // positive Beiträge + Ausschlussabzug
  readonly positiveScore: number; // nur positive Beiträge (ohne Ausschluss)
  readonly excluded: boolean; // true, sobald ein Ausschluss-Keyword greift
  readonly reasons: readonly MatchReason[];
  readonly exclusionReasons: readonly MatchReason[];
};

export type JobMatchResult = {
  readonly job: Job;
  readonly professionSlug: string;
  readonly score: number;
  readonly confidence: Confidence;
  readonly matched: boolean; // true ab Konfidenz "medium" und nicht ausgeschlossen
  readonly excluded: boolean;
  readonly reasons: readonly MatchReason[];
  readonly exclusionReasons: readonly MatchReason[];
  readonly matchedSignals: readonly MatchSource[]; // deduplizierte Fundstellen (stabile Reihenfolge)
  readonly rankingIndex?: number; // Position in der sortierten Trefferliste (erst nach Sortierung gesetzt)
};

export type ProfessionMatchList = {
  readonly matches: readonly JobMatchResult[]; // sortiert + auf maxJobs begrenzt
  readonly totalMatched: number; // alle matched:true (vor Begrenzung)
  readonly excludedCount: number;
  readonly unmatchedCount: number; // weder matched noch ausgeschlossen
};

// Zentrale Gewichte — einzige Quelle der Wahrheit, keine Magic Numbers in anderen Dateien.
export const MATCH_WEIGHTS = {
  category: 100,
  tag: 60,
  title: 45,
  skills: 35,
  description: 20,
} as const;

// Ausschluss-Gewichte: bewusst so hoch, dass kein positives Signal sie überstimmt.
export const EXCLUDE_WEIGHTS = {
  title: -1000,
  skills: -800,
  description: -500,
} as const;

// Konfidenz-Schwellen (score-basiert). Ausschluss erzwingt immer "none".
export const CONFIDENCE_THRESHOLDS = {
  high: 100,
  medium: 60,
  low: 1,
} as const;

// Kleine, explizite Synonymtabelle (normalisierte Schlüssel -> normalisierte Alternativen).
// Bewusst kurz und kuratiert. KEIN Stemming, KEINE automatische Ableitung, KEINE KI.
// Morphologische Varianten (z. B. "Automatisierung" -> "Automatisierungstechniker")
// deckt bereits der Wortanfang-Präfix-Match in normalize.ts ab und stehen daher NICHT hier.
export const KEYWORD_SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  sps: ["speicherprogrammierbare steuerung"],
  servicetechniker: ["kundendiensttechniker"],
  kundendienst: ["kundenservice"],
};
