// Bildunterschrift für Social-Media-Posts zu einer Stellenanzeige.
//
// Lag bis 27.09.2026 direkt in `app/jobs/[slug]/social/page.tsx`. Ausgelagert,
// damit das Veröffentlichungsskript (`scripts/instagram-post.mjs`) exakt
// denselben Text verwendet wie die Vorschau im Social-Kit — sonst laufen
// angezeigte und tatsächlich gepostete Fassung auseinander.

import type { Job } from "../app/jobs/data";
import { jobPath } from "../lib/slug";

/** Instagram schneidet Bildunterschriften bei 2.200 Zeichen ab. */
export const MAX_CAPTION_LAENGE = 2200;

export function buildCaption(job: Job): string {
  const benefits = job.benefits
    .slice(0, 4)
    .map((b) => `✅ ${b}`)
    .join("\n");

  const ortsTag = job.city
    .split(",")[0]
    .replace(/[^a-zA-ZäöüÄÖÜß]/g, "")
    .toLowerCase();

  return `💰 ${job.salary} – ${job.title} in ${job.city} gesucht!

📍 ${job.city}, ${job.region}
📃 ${job.type} – direkt beim Unternehmen, keine Zeitarbeit

Das erwartet dich:
${benefits}

Bewerbung dauert 60 Sekunden – ohne Anschreiben, ohne Lebenslauf.
100 % kostenlos & unverbindlich. Wir melden uns innerhalb von 24 h. 👇

🔗 Link in Bio oder direkt: phe-perm.de${jobPath(job)}

#job #jobs #karriere #stellenangebot #${job.category} #${ortsTag} #handwerk #techniker #festanstellung #jobsuche #neuerjob #phePerm`;
}
