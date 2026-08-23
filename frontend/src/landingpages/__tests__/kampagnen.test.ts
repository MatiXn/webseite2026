import { describe, it, expect } from "vitest";
import { KAMPAGNEN, findeKampagne, kampagnenPfad } from "../registry";
import { EINWILLIGUNG_TEXT, EINWILLIGUNG_VERSION } from "../einwilligung";
import { JOBS } from "../../app/jobs/data";
import { jobPath } from "../../lib/slug";

// Prüft JEDE eingetragene Kampagne — auch jede künftig hinzugefügte.
// Wer eine neue Landingpage anlegt, bekommt hier sofort Rückmeldung, wenn
// etwas fehlt oder nicht zusammenpasst.

describe.each(KAMPAGNEN.map((k) => [k.slug, k] as const))("Kampagne %s", (slug, config) => {
  it("hat einen URL-tauglichen Slug", () => {
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("ist über die Registry auffindbar", () => {
    expect(findeKampagne(slug)).toBe(config);
    expect(kampagnenPfad(config)).toBe(`/stellen/${slug}`);
  });

  it("nennt Position und Einsatzgebiet", () => {
    expect(config.position.length).toBeGreaterThan(5);
    expect(config.einsatzgebiet.length).toBeGreaterThan(2);
  });

  it("führt drei bis vier Vorteile", () => {
    expect(config.vorteile.length).toBeGreaterThanOrEqual(3);
    expect(config.vorteile.length).toBeLessThanOrEqual(4);
    for (const v of config.vorteile) {
      expect(v.titel.trim()).not.toBe("");
      expect(v.zusatz.trim()).not.toBe("");
    }
  });

  it("stellt beide Seiten der Gegenüberstellung gleich stark dar", () => {
    const g = config.gegenueberstellung;
    expect(g.negativ.punkte.length).toBeGreaterThanOrEqual(3);
    expect(g.positiv.punkte.length).toBe(g.negativ.punkte.length);
  });

  it("beschreibt den Ablauf in drei Schritten", () => {
    expect(config.ablauf.schritte).toHaveLength(3);
  });

  describe("Funnel", () => {
    it("endet mit dem Kontaktschritt", () => {
      const letzter = config.funnel.schritte.at(-1);
      expect(letzter?.art).toBe("kontakt");
    });

    it("hat genau einen Kontaktschritt", () => {
      const anzahl = config.funnel.schritte.filter((s) => s.art === "kontakt").length;
      expect(anzahl).toBe(1);
    });

    it("fragt höchstens sechs Schritte ab", () => {
      // Jeder weitere Schritt kostet spürbar Abschlüsse.
      expect(config.funnel.schritte.length).toBeLessThanOrEqual(6);
    });

    it("verwendet jeden Feldnamen nur einmal", () => {
      const felder = config.funnel.schritte
        .filter((s) => s.art !== "kontakt")
        .map((s) => (s as { feld: string }).feld);
      expect(new Set(felder).size).toBe(felder.length);
    });

    it("vergibt eindeutige Antwortwerte je Frage", () => {
      for (const schritt of config.funnel.schritte) {
        if (schritt.art === "kontakt") continue;
        const werte = schritt.optionen.map((o) => o.wert);
        expect(new Set(werte).size, `Frage ${schritt.feld}`).toBe(werte.length);
      }
    });

    it("gibt jeder Antwortmöglichkeit einen technischen Wert und eine Beschriftung", () => {
      for (const schritt of config.funnel.schritte) {
        if (schritt.art === "kontakt") continue;
        for (const o of schritt.optionen) {
          expect(o.wert).toMatch(/^[a-z0-9_]+$/);
          expect(o.label.trim()).not.toBe("");
        }
      }
    });

    it("stellt jede Frage als Frage", () => {
      for (const schritt of config.funnel.schritte) {
        expect(schritt.frage.trim()).not.toBe("");
      }
    });
  });

  describe("SEO", () => {
    it("hält den Seitentitel in der von Google angezeigten Länge", () => {
      expect(config.seo.titel.length).toBeGreaterThan(20);
      expect(config.seo.titel.length).toBeLessThanOrEqual(70);
    });

    it("hält die Beschreibung in der angezeigten Länge", () => {
      expect(config.seo.beschreibung.length).toBeGreaterThan(70);
      expect(config.seo.beschreibung.length).toBeLessThanOrEqual(170);
    });

    it("nennt die Marke im Titel genau einmal", () => {
      // Das Root-Layout hängt über `title.template` automatisch
      // " | PHE-Perm Engineering" an. Die Seite umgeht das mit
      // `title: { absolute: ... }`. Trüge der Titel die Marke zweimal,
      // stünde sie doppelt im Browser-Tab und in der Suchergebnisliste.
      const treffer = config.seo.titel.match(/PHE[- ]Perm/gi) ?? [];
      expect(treffer.length).toBe(1);
    });
  });

  it("beschreibt ein hinterlegtes Hero-Bild mit einem Alt-Text", () => {
    if (!config.heroBild) return; // Ohne Bild greift der typografische Hero.
    expect(config.heroBild.alt.trim().length).toBeGreaterThan(15);
    expect(config.heroBild.pfad).toMatch(/^\/[\w/-]+\.(jpg|jpeg|png|webp|avif)$/);
    expect(config.heroBild.breite).toBeGreaterThan(0);
    expect(config.heroBild.hoehe).toBeGreaterThan(0);
  });

  it("verweist, falls angegeben, auf eine existierende Stellenanzeige", () => {
    if (!config.organischeStelle) return;
    const bekannt = JOBS.map((j) => jobPath(j));
    expect(bekannt).toContain(config.organischeStelle);
  });

  it("hat eine Betreffzeile für die Benachrichtigung", () => {
    expect(config.benachrichtigungsBetreff.trim().length).toBeGreaterThan(10);
  });
});

describe("Registry", () => {
  it("vergibt jeden Slug nur einmal", () => {
    const slugs = KAMPAGNEN.map((k) => k.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gibt für unbekannte Slugs nichts zurück", () => {
    expect(findeKampagne("gibt-es-nicht")).toBeUndefined();
    expect(findeKampagne("")).toBeUndefined();
  });
});

describe("Einwilligung", () => {
  it("ist versioniert", () => {
    expect(EINWILLIGUNG_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("nennt das Unternehmen, beide Kontaktwege und das Widerrufsrecht", () => {
    expect(EINWILLIGUNG_TEXT).toContain("PHE Perm Engineering");
    expect(EINWILLIGUNG_TEXT).toContain("E-Mail");
    expect(EINWILLIGUNG_TEXT).toContain("telefonisch");
    expect(EINWILLIGUNG_TEXT).toContain("widerrufen");
    expect(EINWILLIGUNG_TEXT).toContain("Datenschutzerklärung");
  });

  it("deckt ausdrücklich nichts über diese eine Position hinaus ab", () => {
    // Die Pflicht-Einwilligung darf Newsletter, Talentpool und Werbung nicht
    // mitabdecken — dafür braucht es eine eigene, freiwillige Zustimmung.
    const text = EINWILLIGUNG_TEXT.toLowerCase();
    for (const wort of ["newsletter", "talentpool", "werbung", "weitere stellen"]) {
      expect(text, `„${wort}" darf nicht in der Pflicht-Einwilligung stehen`).not.toContain(wort);
    }
    expect(EINWILLIGUNG_TEXT).toContain("dieser Position");
  });
});
