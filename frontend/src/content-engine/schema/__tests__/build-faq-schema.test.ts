import { describe, it, expect } from "vitest";
import { buildFaqSchema } from "../build-faq-schema";
import { elektroniker } from "../../../content/professions/elektroniker";

type Question = { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } };
const ID = "https://www.phe-perm.de/berufe/elektroniker#faq";

describe("buildFaqSchema", () => {
  it("1 – FAQPage mit @id, Reihenfolge exakt aus faq[]", () => {
    const faq = buildFaqSchema(elektroniker.faq, ID);
    expect(faq).not.toBeNull();
    const node = faq as NonNullable<typeof faq>;
    expect(node["@type"]).toBe("FAQPage");
    expect(node["@id"]).toBe(ID);
    const questions = node.mainEntity as Question[];
    expect(questions.length).toBe(elektroniker.faq.length);
    questions.forEach((q, i) => {
      expect(q.name).toBe(elektroniker.faq[i].q);
      expect(q.acceptedAnswer.text).toBe(elektroniker.faq[i].a);
    });
  });

  it("2 – keine Umformulierung (Fragen/Antworten wörtlich)", () => {
    const node = buildFaqSchema(elektroniker.faq, ID) as { mainEntity: Question[] };
    const names = node.mainEntity.map((q) => q.name);
    expect(names).toEqual(elektroniker.faq.map((f) => f.q));
  });

  it("3 – leeres FAQ ergibt keinen Knoten (null)", () => {
    expect(buildFaqSchema([], ID)).toBeNull();
  });

  it("4 – mutiert die Eingabe nicht", () => {
    const snapshot = JSON.parse(JSON.stringify(elektroniker.faq));
    buildFaqSchema(elektroniker.faq, ID);
    expect(JSON.parse(JSON.stringify(elektroniker.faq))).toEqual(snapshot);
  });
});
