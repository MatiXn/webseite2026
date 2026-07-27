import { describe, it, expect } from "vitest";
import { normalizeText, normalizeTokens, containsAtWordStart } from "../normalize";

describe("normalize", () => {
  it("1 – Kleinschreibung, Trim und Mehrfach-Leerzeichen", () => {
    expect(normalizeText("  SPS   Programmierer ")).toBe("sps programmierer");
  });

  it("2 – Umlaute und ß werden aufgelöst", () => {
    expect(normalizeText("Kältetechnik Süd Groß Öl")).toBe("kaeltetechnik sued gross oel");
  });

  it("3 – Bindestriche, Schrägstriche und Interpunktion werden zu Leerzeichen", () => {
    expect(normalizeText("SPS-Programmierer / Automatisierung, (m/w/d)")).toBe(
      "sps programmierer automatisierung m w d",
    );
  });

  it("4 – Wortanfang-Präfix trifft Komposita, aber nicht mitten im Wort", () => {
    expect(containsAtWordStart(normalizeText("Automatisierungstechniker"), normalizeText("Automatisierung"))).toBe(true);
    expect(containsAtWordStart(normalizeText("Servicetechniker Kältetechnik"), "service")).toBe(true);
    expect(containsAtWordStart("gips programmierer", "sps")).toBe(false);
    expect(containsAtWordStart("automatisierung", "")).toBe(false);
  });

  it("5 – normalizeTokens normalisiert Liste und verwirft Leeres; Mehrwort-Needle am Wortanfang", () => {
    expect(normalizeTokens(["Siemens TIA Portal", "   ", "SPS"])).toEqual(["siemens tia portal", "sps"]);
    expect(containsAtWordStart("wir nutzen siemens tia portal taeglich", "siemens tia portal")).toBe(true);
  });
});
