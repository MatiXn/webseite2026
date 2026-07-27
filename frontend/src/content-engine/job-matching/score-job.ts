// Reine, deterministische Bewertung eines Jobs gegen eine JobMatchConfig.
// Erzeugt Punktzahl, Match-Begründungen und Ausschlussgründe — ohne Mutation.
//
// Feld-Mapping (jobs/data.ts hat KEIN "skills"-Feld):
//   category    -> job.category
//   tag         -> job.tags (exakte, normalisierte Übereinstimmung + Synonyme)
//   title       -> job.title
//   skills      -> job.profil  (Anforderungsprofil = geforderte Qualifikationen)
//   description -> job.description + job.intro + job.aufgaben (beschreibender Freitext)
import type { Job } from "../../app/jobs/data";
import type { JobMatchConfig } from "../../content/professions/types";
import type { JobScore, MatchReason } from "./types";
import { EXCLUDE_WEIGHTS, KEYWORD_SYNONYMS, MATCH_WEIGHTS } from "./types";
import { containsAtWordStart, normalizeText, normalizeTokens } from "./normalize";

// Erweitert ein bereits normalisiertes Keyword um seine expliziten Synonyme.
function expandKeyword(keywordNorm: string): readonly string[] {
  const syn = KEYWORD_SYNONYMS[keywordNorm];
  return syn ? [keywordNorm, ...syn] : [keywordNorm];
}

type KeywordSource = {
  readonly source: "title" | "skills" | "description";
  readonly text: string;
  readonly weight: number;
};

export function scoreJob(job: Job, config: JobMatchConfig): JobScore {
  const reasons: MatchReason[] = [];
  const exclusionReasons: MatchReason[] = [];

  const titleNorm = normalizeText(job.title);
  const skillsNorm = normalizeText((job.profil ?? []).join(" "));
  const descNorm = normalizeText(
    [job.description, job.intro ?? "", ...(job.aufgaben ?? [])].join(" "),
  );
  const jobTagsNorm = new Set(normalizeTokens(job.tags));

  // 1. Kategorie (höchste, aber bewusst genau eine mögliche Fundstelle je Job).
  for (const cat of config.category ?? []) {
    if (job.category === cat) {
      reasons.push({
        signal: "category",
        value: cat,
        weight: MATCH_WEIGHTS.category,
        source: "category",
        message: `Kategorie "${cat}" stimmt überein.`,
      });
    }
  }

  // 2. Tags: exakte, normalisierte Übereinstimmung (inkl. Synonyme), je Config-Tag höchstens einmal.
  for (const tag of config.tags ?? []) {
    const forms = expandKeyword(normalizeText(tag));
    if (forms.some((f) => jobTagsNorm.has(f))) {
      reasons.push({
        signal: "tag",
        value: tag,
        weight: MATCH_WEIGHTS.tag,
        source: "tag",
        message: `Tag "${tag}" ist am Job vorhanden.`,
      });
    }
  }

  // 3. Keywords: je Keyword pro Quelle höchstens einmal (Titel, Skills/Profil, Beschreibung
  //    zählen unabhängig voneinander — dasselbe Keyword im Titel UND in der Beschreibung
  //    ergibt zwei Beiträge, mehrfaches Vorkommen in derselben Quelle nur einen).
  const keywordSources: readonly KeywordSource[] = [
    { source: "title", text: titleNorm, weight: MATCH_WEIGHTS.title },
    { source: "skills", text: skillsNorm, weight: MATCH_WEIGHTS.skills },
    { source: "description", text: descNorm, weight: MATCH_WEIGHTS.description },
  ];
  for (const kw of config.keywords ?? []) {
    const forms = expandKeyword(normalizeText(kw));
    for (const src of keywordSources) {
      if (forms.some((f) => containsAtWordStart(src.text, f))) {
        reasons.push({
          signal: "keyword",
          value: kw,
          weight: src.weight,
          source: src.source,
          message: `Keyword "${kw}" gefunden in ${src.source}.`,
        });
      }
    }
  }

  // 4. Ausschluss-Keywords: haben Vorrang. Sobald eines greift, gilt der Job als ausgeschlossen —
  //    unabhängig davon, wie viele positive Signale zusammenkamen.
  const excludeSources: readonly KeywordSource[] = [
    { source: "title", text: titleNorm, weight: EXCLUDE_WEIGHTS.title },
    { source: "skills", text: skillsNorm, weight: EXCLUDE_WEIGHTS.skills },
    { source: "description", text: descNorm, weight: EXCLUDE_WEIGHTS.description },
  ];
  for (const kw of config.excludeKeywords ?? []) {
    const forms = expandKeyword(normalizeText(kw));
    for (const src of excludeSources) {
      if (forms.some((f) => containsAtWordStart(src.text, f))) {
        exclusionReasons.push({
          signal: "exclude",
          value: kw,
          weight: src.weight,
          source: "exclude",
          message: `Ausschluss-Keyword "${kw}" gefunden in ${src.source}.`,
        });
      }
    }
  }

  const positiveScore = reasons.reduce((sum, r) => sum + r.weight, 0);
  const excludeScore = exclusionReasons.reduce((sum, r) => sum + r.weight, 0);

  return {
    score: positiveScore + excludeScore,
    positiveScore,
    excluded: exclusionReasons.length > 0,
    reasons,
    exclusionReasons,
  };
}
