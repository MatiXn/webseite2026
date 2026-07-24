// Zentrale Slug-Logik für sprechende, stabile Job-URLs.
// Kanonische URL-Form: /jobs/<beruf-ort>-<id>

const UMLAUTS: Record<string, string> = {
  ä: "ae", ö: "oe", ü: "ue", ß: "ss",
  Ä: "ae", Ö: "oe", Ü: "ue",
};

/** Wandelt beliebigen Text in einen URL-sicheren Slug (Kleinbuchstaben, Bindestriche, keine Umlaute). */
export function slugify(input: string): string {
  return input
    // (m/w/d)-Varianten entfernen, bevor Klammern zu Bindestrichen werden
    .replace(/\((?:m\/w\/d|w\/m\/d|d\/m\/w|m\/w\/x)\)/gi, " ")
    .replace(/[äöüßÄÖÜ]/g, (ch) => UMLAUTS[ch] ?? ch)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // verbleibende Akzente
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Beruf-Ort-Slug ohne ID. */
export function jobSlug(job: { title: string; city: string }): string {
  return slugify(`${job.title} ${job.city}`);
}

/** Kanonische Job-URL inkl. stabiler ID. */
export function jobPath(job: { id: string; title: string; city: string }): string {
  return `/jobs/${jobSlug(job)}-${job.id}`;
}

/** Extrahiert die Job-ID aus einem Routen-Parameter (Slug mit ID-Suffix ODER reine Alt-ID). */
export function jobIdFromParam(param: string): string | null {
  const suffix = param.match(/-(\d+)$/);
  if (suffix) return suffix[1];
  const pure = param.match(/^(\d+)$/);
  return pure ? pure[1] : null;
}
