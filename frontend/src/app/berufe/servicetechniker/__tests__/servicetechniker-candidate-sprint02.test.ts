import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { matchJobsForProfession } from "../../../../content-engine/job-matching";
import { servicetechniker } from "../../../../content/professions/servicetechniker";
import { contact } from "../../../../content/contact";
import { JOBS } from "../../../jobs/data";

const configSrc = readFileSync(new URL("../../../../content/professions/servicetechniker.ts", import.meta.url), "utf8");

describe("Servicetechniker – Candidate Sprint 02 (Conversion)", () => {
  it("1 – Hero kandidatenorientiert: WhatsApp-CTA1 (zentraler Pfad), Jobs-CTA2 (#stellen)", () => {
    expect(servicetechniker.hero.primaryCta.href).toBe(contact.whatsappLink);
    expect(servicetechniker.hero.secondaryCta.href).toBe("#stellen");
    expect(servicetechniker.hero.headline).toContain("Servicetechniker");
    // keine hartcodierte WhatsApp-URL/Nummer im Quelltext – nur über contact.whatsappLink
    expect(configSrc).toContain("contact.whatsappLink");
    expect(configSrc.includes("wa.me/")).toBe(false);
    expect(/491739980100|tel:/.test(configSrc)).toBe(false);
  });
  it("2 – Bewerber-CTA nutzt WhatsApp", () => {
    expect(servicetechniker.applicantCta.primaryCta.href).toBe(contact.whatsappLink);
  });
  it("3 – 'keine Zeitarbeit' im sichtbaren Config-Text (Hero-Intro)", () => {
    expect(servicetechniker.hero.intro.toLowerCase()).toContain("keine zeitarbeit");
  });
  it("4 – FAQ rein kandidatenseitig (keine Unternehmens-/B2B-Frage), 7 Fragen, keine Duplikate", () => {
    expect(servicetechniker.faq.length).toBe(7);
    const qs = servicetechniker.faq.map((f) => f.q);
    expect(new Set(qs).size).toBe(qs.length);
    for (const q of qs) {
      expect(/unternehmen können|können unternehmen|arbeitgeber können|für ihr unternehmen/i.test(q), q).toBe(false);
    }
    // Pflicht-Kandidatenthemen abgedeckt
    const joined = qs.join(" | ").toLowerCase();
    for (const t of ["festanstellung", "vertraulich", "reisen", "nicht aktiv suche", "kosten", "zustimmung"]) {
      expect(joined, t).toContain(t);
    }
  });
  it("5 – Matching weiterhin konservativ: 9 echte Servicetechniker, 0 False Positives, 8 sichtbar (maxJobs 8)", () => {
    const r = matchJobsForProfession(JOBS, servicetechniker);
    expect(r.totalMatched).toBe(9);
    expect(r.matches.length).toBe(8);
    expect(r.excludedCount).toBe(0);
    // jeder sichtbare Job ist echte Servicetechniker-Stelle (Titel enthält "Servicetechniker")
    for (const m of r.matches) expect(/Servicetechniker/i.test(m.job.title), m.job.id).toBe(true);
    // Grenzfall SHK (Job 19) nicht gematcht
    const j19 = JOBS.find((j) => j.id === "19");
    if (j19) expect(matchJobsForProfession([j19], servicetechniker).totalMatched).toBe(0);
  });
});
