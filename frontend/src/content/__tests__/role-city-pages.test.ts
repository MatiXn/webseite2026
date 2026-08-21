import { describe, it, expect } from "vitest";
import {
  viableRoleCityPages, isViable, jobsForRoleInCity, salaryRangeOf,
  MIN_JOBS_IN_RADIUS, LOCAL_RADIUS_KM, MAX_JOB_SET_OVERLAP,
} from "../role-city-pages";
import { jobRoles } from "../job-roles";
import { allCities, jobCities, rasterCities } from "../job-cities";

describe("Beruf-x-Ort-Seiten: Schwelle gegen dünne Seiten", () => {
  const pages = viableRoleCityPages();

  it("1 – jede Seite erfüllt beide Kriterien", () => {
    for (const { role, city } of pages) {
      const hits = jobsForRoleInCity(role, city);
      expect(hits.length, `${role.slug}/${city.slug}`).toBeGreaterThanOrEqual(MIN_JOBS_IN_RADIUS);
      expect(hits.some(h => h.distance <= LOCAL_RADIUS_KM), `${role.slug}/${city.slug}`).toBe(true);
    }
  });

  it("2 – jede Seite ist tragfähig; nicht jede tragfähige Kombination wird eine Seite", () => {
    for (const { role, city } of pages) expect(isViable(role, city), `${role.slug}/${city.slug}`).toBe(true);
    const viableCount = jobRoles.flatMap(r => allCities.filter(c => isViable(r, c))).length;
    expect(pages.length).toBeLessThanOrEqual(viableCount);
  });

  it("2b – keine zwei Seiten einer Rolle zeigen dieselbe Stellenmenge", () => {
    const byRole: Record<string, Set<string>[]> = {};
    for (const { role, city } of pages) {
      const ids = new Set(jobsForRoleInCity(role, city).map(h => h.job.id));
      for (const other of byRole[role.slug] ?? []) {
        const schnitt = [...ids].filter(x => other.has(x)).length;
        const vereinigung = new Set([...ids, ...other]).size;
        expect(schnitt / vereinigung, `${role.slug}/${city.slug}`).toBeLessThanOrEqual(MAX_JOB_SET_OVERLAP);
      }
      (byRole[role.slug] ??= []).push(ids);
    }
  });

  it("3 – Stadt-Slugs sind eindeutig", () => {
    const slugs = allCities.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("4 – Raster-Städte überschneiden sich nicht mit Ortsseiten-Städten", () => {
    const withPage = new Set(jobCities.map(c => c.slug));
    for (const c of rasterCities) expect(withPage.has(c.slug), c.slug).toBe(false);
  });

  it("5 – nearby verweist nur auf existierende Städte", () => {
    const known = new Set(allCities.map(c => c.slug));
    for (const c of allCities) {
      for (const n of c.nearby) expect(known.has(n), `${c.slug} -> ${n}`).toBe(true);
    }
  });

  it("6 – Gehaltsspanne stammt aus den gelisteten Stellen", () => {
    for (const { role, city } of pages) {
      const range = salaryRangeOf(jobsForRoleInCity(role, city));
      expect(range, `${role.slug}/${city.slug}`).not.toBeNull();
      expect(range!.min).toBeLessThanOrEqual(range!.max);
      expect(range!.min).toBeGreaterThanOrEqual(10000);
    }
  });

  it("7 – jede Rolle verweist auf eine existierende Hub-Seite", () => {
    const hubs = new Set([
      "/berufe/elektroniker", "/berufe/elektroniker-betriebstechnik",
      "/berufe/elektroniker-energie-gebaeudetechnik", "/berufe/mechatroniker",
      "/berufe/servicetechniker", "/berufe/sps-automatisierung", "/berufe/kaeltetechniker",
    ]);
    for (const r of jobRoles) expect(hubs.has(r.hubPath), r.slug).toBe(true);
  });

  it("8 – Bestandsaufnahme (dokumentiert den aktuellen Umfang)", () => {
    const byRole: Record<string, string[]> = {};
    for (const { role, city } of pages) (byRole[role.slug] ??= []).push(city.name);
    process.stdout.write(`\n  Seiten gesamt: ${pages.length}\n`);
    for (const [r, cities] of Object.entries(byRole)) {
      process.stdout.write(`    ${r}: ${cities.length} — ${cities.join(", ")}\n`);
    }
    expect(pages.length).toBeGreaterThan(0);
  });
});
