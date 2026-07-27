// Deterministische Textnormalisierung für das Job-Matching.
// Reine String-Transformation — kein Stemming, keine KI, keine Browser-APIs.

const UMLAUTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/ä/g, "ae"],
  [/ö/g, "oe"],
  [/ü/g, "ue"],
  [/ß/g, "ss"],
];

// Kleinschreibung, Umlaut-Auflösung, Bindestriche/Schrägstriche/Interpunktion -> Leerzeichen,
// Mehrfach-Leerzeichen kollabiert, getrimmt. Ergebnis ist leerzeichengetrennt.
export function normalizeText(input: string): string {
  let s = input.toLowerCase();
  for (const [re, rep] of UMLAUTS) s = s.replace(re, rep);
  s = s.replace(/[^a-z0-9]+/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

// Normalisiert eine Liste (z. B. Tags) und verwirft leere Einträge.
export function normalizeTokens(values: readonly string[]): readonly string[] {
  const out: string[] = [];
  for (const v of values) {
    const n = normalizeText(v);
    if (n.length > 0) out.push(n);
  }
  return out;
}

// Wortanfang-Präfix-Match: needle steht am Anfang eines Tokens in haystack.
// Deckt deutsche Komposita ab (Keyword "automatisierung" trifft "automatisierungstechniker"),
// verhindert aber Treffer mitten im Wort ("sps" trifft NICHT "gipssps").
// Beide Argumente müssen bereits normalisiert sein.
export function containsAtWordStart(haystackNorm: string, needleNorm: string): boolean {
  if (needleNorm.length === 0) return false;
  return (" " + haystackNorm).includes(" " + needleNorm);
}
