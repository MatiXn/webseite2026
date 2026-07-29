import { describe, it, expect } from "vitest";
import { matchJobToProfession } from "../match-job";
import { JOBS, type Job } from "../../../app/jobs/data";
import { elektroniker } from "../../../content/professions/elektroniker";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";
import type { ProfessionContent } from "../../../content/professions/types";

// Keyword-tragendes Test-Fixture: prüft die Keyword-/Synonym-/Dedup-Fähigkeit des
// Matchers unabhängig von der Produktions-Config (die seit EPIC 007D bewusst
// KEINE freien keywords mehr hat, Variante B). Entspricht der früheren SPS-jobMatch.
const spsLike: ProfessionContent = {
  ...spsAutomatisierung,
  jobMatch: {
    category: ["it"],
    tags: ["SPS", "Siemens TIA Portal"],
    keywords: ["SPS", "Automatisierung", "Steuerungstechnik", "Inbetriebnahme"],
    excludeKeywords: ["Softwareentwickler", "Applikationsentwickler", "Embedded"],
    maxJobs: 6,
    fallback: "hint-and-joblist",
  },
};

function getJob(predicate: (j: Job) => boolean): Job {
  const job = JOBS.find(predicate);
  if (!job) throw new Error("Erwarteter Testjob nicht in JOBS gefunden.");
  return job;
}

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "test-1",
    title: "Testjob",
    category: "elektro",
    city: "Düsseldorf",
    region: "Nordrhein-Westfalen",
    lat: 51.2,
    lng: 6.78,
    salary: "40.000 €/Jahr",
    type: "Festanstellung",
    tags: [],
    description: "",
    posted: "vor 1 Tag",
    benefits: [],
    datePosted: "2026-06-01",
    ...overrides,
  };
}

describe("matchJobToProfession", () => {
  it("1 – realer Elektro-Job trifft Elektroniker über die Kategorie (high)", () => {
    const job = getJob((j) => j.id === "1");
    const r = matchJobToProfession(job, elektroniker);
    expect(r.confidence).toBe("high");
    expect(r.matched).toBe(true);
    expect(r.matchedSignals).toContain("category");
  });

  it("2 – IT-Job trifft Elektroniker NICHT (Kategorie passt nicht, kein Signal)", () => {
    const job = getJob((j) => j.id === "7");
    const r = matchJobToProfession(job, elektroniker);
    expect(r.score).toBe(0);
    expect(r.confidence).toBe("none");
    expect(r.matched).toBe(false);
    expect(r.reasons).toHaveLength(0);
  });

  it("3 – SPS-Job (id 7) trifft SPS-Profession stark (high, mehrere Signale)", () => {
    const job = getJob((j) => j.id === "7");
    const r = matchJobToProfession(job, spsLike);
    expect(r.confidence).toBe("high");
    expect(r.matched).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(100);
    expect(r.matchedSignals).toEqual(expect.arrayContaining(["category", "tag", "title"]));
  });

  it("4 – Ausschluss-Keyword im Titel schließt aus (none, nicht matched)", () => {
    const job = makeJob({ category: "it", title: "Softwareentwickler C++ (m/w/d)" });
    const r = matchJobToProfession(job, spsLike);
    expect(r.excluded).toBe(true);
    expect(r.matched).toBe(false);
    expect(r.confidence).toBe("none");
    expect(r.exclusionReasons.length).toBeGreaterThan(0);
  });

  it("5 – Ausschluss hat Vorrang vor starken positiven Signalen", () => {
    const job = makeJob({
      category: "it",
      title: "SPS-Softwareentwickler (m/w/d)",
      tags: ["SPS", "Siemens TIA Portal"],
    });
    const r = matchJobToProfession(job, spsLike);
    expect(r.reasons.length).toBeGreaterThan(0); // positive Signale existieren
    expect(r.excluded).toBe(true);
    expect(r.matched).toBe(false);
    expect(r.score).toBeLessThan(0); // Ausschluss überstimmt alle Pluspunkte
  });

  it("6 – Tag allein ergibt medium und matched", () => {
    const job = makeJob({ category: "bau", tags: ["SPS"], title: "Allrounder", description: "" });
    const r = matchJobToProfession(job, spsLike);
    expect(r.confidence).toBe("medium");
    expect(r.matched).toBe(true);
    expect(r.matchedSignals).toEqual(["tag"]);
  });

  it("7 – ein Titel-Keyword allein ergibt low und NICHT matched", () => {
    const job = makeJob({ category: "bau", tags: [], title: "Inbetriebnahme Spezialist", description: "" });
    const r = matchJobToProfession(job, spsLike);
    expect(r.confidence).toBe("low");
    expect(r.matched).toBe(false);
  });

  it("8 – ein Keyword zählt pro Quelle nur einmal (Mehrfachvorkommen)", () => {
    const job = makeJob({
      category: "bau",
      tags: [],
      title: "SPS SPS Anlage",
      description: "sps und sps und sps im Einsatz",
    });
    const r = matchJobToProfession(job, spsLike);
    const spsTitle = r.reasons.filter((x) => x.value === "SPS" && x.source === "title");
    const spsDesc = r.reasons.filter((x) => x.value === "SPS" && x.source === "description");
    expect(spsTitle).toHaveLength(1);
    expect(spsDesc).toHaveLength(1);
  });

  it("9 – dasselbe Keyword in Titel UND Beschreibung zählt getrennt", () => {
    const job = makeJob({
      category: "bau",
      tags: [],
      title: "SPS Anlage",
      description: "sps im Einsatz",
    });
    const r = matchJobToProfession(job, spsLike);
    const sps = r.reasons.filter((x) => x.value === "SPS");
    expect(sps.map((x) => x.source).sort()).toEqual(["description", "title"]);
    expect(r.score).toBe(45 + 20);
  });

  it("10 – ungültiger Job (leerer Titel) ergibt kein Match", () => {
    const job = makeJob({ title: "   " });
    const r = matchJobToProfession(job, spsLike);
    expect(r.matched).toBe(false);
    expect(r.confidence).toBe("none");
    expect(r.reasons).toHaveLength(0);
  });

  it("11 – Synonym greift (SPS ↔ speicherprogrammierbare Steuerung)", () => {
    const job = makeJob({
      category: "bau",
      tags: [],
      title: "Fachkraft",
      description: "Wir programmieren eine speicherprogrammierbare Steuerung für die Anlage.",
    });
    const r = matchJobToProfession(job, spsLike);
    expect(r.reasons.some((x) => x.value === "SPS" && x.source === "description")).toBe(true);
  });

  it("12 – Service-getaggter Servicetechniker-Job trifft stark (Tag + Titel)", () => {
    const job = getJob((j) => j.title.startsWith("Mechatroniker als Servicetechniker"));
    const r = matchJobToProfession(job, servicetechniker);
    expect(r.confidence).toBe("high");
    expect(r.matched).toBe(true);
    expect(r.matchedSignals).toEqual(expect.arrayContaining(["tag", "title"]));
  });

  it("13 – matchedSignals sind dedupliziert und stabil sortiert", () => {
    const job = getJob((j) => j.id === "7");
    const r = matchJobToProfession(job, spsLike);
    expect(r.matchedSignals[0]).toBe("category");
    expect(r.matchedSignals).toEqual(expect.arrayContaining(["tag", "title"]));
    expect(new Set(r.matchedSignals).size).toBe(r.matchedSignals.length);
  });
});
