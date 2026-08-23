// Kampagnenparameter aus der Anzeigen-URL.
//
// Meta hängt beim Klick auf eine Anzeige Parameter an die Ziel-URL. Sie müssen
// den gesamten Funnel überleben, damit später nachvollziehbar ist, welche
// Anzeige einen Lead gebracht hat. Deshalb werden sie einmal beim Laden
// gelesen und im State gehalten — nicht bei jedem Schritt neu aus der URL,
// die sich durch Navigation ändern kann.

/** Erlaubte Parameter. Alles andere wird verworfen. */
export const KAMPAGNEN_PARAMETER = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "fbclid",
  "campaign_id",
  "adset_id",
  "ad_id",
  "campaign_name",
  "campaign_source",
] as const;

export type KampagnenParameterName = (typeof KAMPAGNEN_PARAMETER)[number];
export type KampagnenParameter = Partial<Record<KampagnenParameterName, string>>;

/** Längenbegrenzung je Wert — schützt die Datenbank vor aufgeblähten URLs. */
const MAX_LAENGE = 300;

/**
 * Liest die bekannten Parameter aus einem Query-String.
 * Leere und überlange Werte werden weggelassen, nicht abgeschnitten:
 * ein halber Kampagnenname ist irreführender als gar keiner.
 */
export function leseKampagnenParameter(queryString: string): KampagnenParameter {
  const params = new URLSearchParams(queryString);
  const ergebnis: KampagnenParameter = {};

  for (const name of KAMPAGNEN_PARAMETER) {
    const wert = params.get(name)?.trim();
    if (wert && wert.length <= MAX_LAENGE) {
      ergebnis[name] = wert;
    }
  }

  return ergebnis;
}

/**
 * Nimmt nur die bekannten Parameter aus einem beliebigen Objekt an.
 * Wird serverseitig genutzt: Der Client darf nicht bestimmen, welche Spalten
 * beschrieben werden.
 */
export function filtereKampagnenParameter(eingabe: unknown): KampagnenParameter {
  if (typeof eingabe !== "object" || eingabe === null) return {};

  const quelle = eingabe as Record<string, unknown>;
  const ergebnis: KampagnenParameter = {};

  for (const name of KAMPAGNEN_PARAMETER) {
    const wert = quelle[name];
    if (typeof wert === "string" && wert.trim() && wert.length <= MAX_LAENGE) {
      ergebnis[name] = wert.trim();
    }
  }

  return ergebnis;
}
