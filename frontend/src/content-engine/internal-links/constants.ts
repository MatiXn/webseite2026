// Zentrale, kuratierte Labels und Sicherheitsmuster. Keine Marketingprosa,
// keine automatisch erfundenen Texte.

// Standardlabels der Kernziele (die Configs enthalten keine eigenen Link-Labels).
export const CORE_LINK_LABELS = {
  parent: "Alle technischen Berufe",
  jobs: "Aktuelle Jobs ansehen",
  lebenslauf: "Lebenslauf kostenlos erstellen",
  personalvermittlung: "Technische Fachkraft anfragen",
  kontakt: "Kontakt aufnehmen",
} as const;

// Breadcrumb-Beschriftungen für Startseite und Hub (Profession-Label kommt aus der Config).
export const BREADCRUMB_LABELS = {
  home: "Startseite",
  hub: "Berufe",
} as const;

// Branchen-Kernziel-Labels (Industry hat keinen Lebenslauf-Kernlink; Parent ist der Branchen-Hub).
export const INDUSTRY_CORE_LINK_LABELS = {
  parent: "Alle Branchen",
  jobs: "Aktuelle Jobs ansehen",
  personalvermittlung: "Technische Fachkräfte anfragen",
  kontakt: "Kontakt aufnehmen",
} as const;

// Branchen-Breadcrumb-Hub-Label (Startseite kommt aus BREADCRUMB_LABELS.home).
export const INDUSTRY_HUB_LABEL = "Branchen";

export const HOME_PATH = "/";

// Zusätzlich zur strukturellen Prüfung verbotene Zielpräfixe.
export const FORBIDDEN_PATH_PREFIXES: readonly string[] = [
  "/talente-finden",
  "/admin",
  "/login",
  "/preview",
  "/vorschau",
];

// Alte, numerische Job-URL (z. B. /jobs/1) — nie erzeugen.
export const NUMERIC_JOB_URL = /^\/jobs\/\d+\/?$/;
