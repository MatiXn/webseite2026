import { describe, it, expect } from "vitest";
import { slugify, jobSlug, jobPath, jobIdFromParam } from "./slug";

describe("slugify", () => {
  it("transliteriert Umlaute und ß", () => {
    expect(slugify("Kältetechnik München Straße")).toBe("kaeltetechnik-muenchen-strasse");
  });
  it("entfernt den (m/w/d)-Zusatz", () => {
    expect(slugify("Servicetechniker Kältetechnik (m/w/d)")).toBe("servicetechniker-kaeltetechnik");
  });
  it("macht klein, trennt mit Bindestrich, ohne Rand-/Doppelbindestriche", () => {
    expect(slugify("  SPS-Programmierer / Automatisierung  ")).toBe("sps-programmierer-automatisierung");
  });
});

describe("jobSlug / jobPath", () => {
  const job = { id: "2", title: "Servicetechniker Kältetechnik (m/w/d)", city: "München" };
  it("baut den Slug aus Titel + Stadt", () => {
    expect(jobSlug(job)).toBe("servicetechniker-kaeltetechnik-muenchen");
  });
  it("hängt die ID als stabilen Suffix an", () => {
    expect(jobPath(job)).toBe("/jobs/servicetechniker-kaeltetechnik-muenchen-2");
  });
});

describe("jobIdFromParam", () => {
  it("liest die ID aus dem Slug-Suffix", () => {
    expect(jobIdFromParam("servicetechniker-kaeltetechnik-muenchen-2")).toBe("2");
  });
  it("akzeptiert eine reine numerische Alt-URL", () => {
    expect(jobIdFromParam("1")).toBe("1");
  });
  it("gibt null bei fehlender ID zurück", () => {
    expect(jobIdFromParam("nur-text-ohne-id")).toBeNull();
  });
});
