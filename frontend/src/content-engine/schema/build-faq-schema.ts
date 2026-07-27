// Baut ein FAQPage-Schema ausschließlich aus profession.faq (sichtbare Inhalte).
// Keine Ergänzung, keine Umformulierung. Leeres FAQ -> kein Knoten (null).
import type { ProfessionContent } from "../../content/professions/types";
import type { SchemaNode } from "./types";

export function buildFaqSchema(profession: ProfessionContent, id: string): SchemaNode | null {
  if (profession.faq.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: profession.faq.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}
