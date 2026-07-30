// Baut ein FAQPage-Schema aus sichtbaren FAQ-Einträgen (domänenneutral: Profession ODER Industry).
// Keine Ergänzung, keine Umformulierung. Leeres FAQ -> kein Knoten (null).
import type { FaqEntry } from "../../content/faq";
import type { SchemaNode } from "./types";

export function buildFaqSchema(faq: readonly FaqEntry[], id: string): SchemaNode | null {
  if (faq.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}
