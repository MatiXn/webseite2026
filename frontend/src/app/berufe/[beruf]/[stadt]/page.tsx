// Beruf-x-Ort-Seiten: /berufe/<beruf>/<stadt>.
//
// Spokes zu den bundesweiten Berufsseiten (Hub). Sie beantworten Anfragen der
// Form "elektroniker jobs köln" — Berufsbild plus die echten Stellen in der
// Region, statt einer bundesweiten Liste ohne Ortsbezug.
//
// Der Schutz gegen dünne Seiten liegt in content/role-city-pages.ts: Eine Seite
// entsteht nur, wenn mindestens drei passende Stellen im Umkreis liegen und
// mindestens eine davon ortsnah ist. Was die Seiten voneinander unterscheidet,
// sind echte Daten — die Stellenliste, die Entfernungen und die aus diesen
// Stellen berechnete Gehaltsspanne — plus ein eigener Absatz je Stadt.
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_LABELS } from "../../../jobs/data";
import { jobPath } from "../../../../lib/slug";
import { jobRoleBySlug } from "../../../../content/job-roles";
import { cityBySlug, jobCities } from "../../../../content/job-cities";
import { roleCityNote } from "../../../../content/role-city-notes";
import {
  viableRoleCityPages, isViable, jobsForRoleInCity, salaryRangeOf,
} from "../../../../content/role-city-pages";
import JsonLd from "../../../components/JsonLd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";

const SITE = "https://www.phe-perm.de";

// Täglich neu bauen: Die Seite existiert nur, solange genug Stellen im Umkreis
// offen sind, und die Liste soll dem Sheet-Stand folgen.
export const revalidate = 86400;
export const dynamicParams = false;

const euro = (v: number) => `${v.toLocaleString("de-DE")} €`;

function resolve(beruf: string, stadt: string) {
  const role = jobRoleBySlug(beruf);
  const city = cityBySlug(stadt);
  if (!role || !city || !isViable(role, city)) return null;
  return { role, city };
}

export function generateStaticParams() {
  return viableRoleCityPages().map(({ role, city }) => ({ beruf: role.slug, stadt: city.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ beruf: string; stadt: string }> },
): Promise<Metadata> {
  const { beruf, stadt } = await params;
  const hit = resolve(beruf, stadt);
  if (!hit) return {};
  const { role, city } = hit;

  const jobs = jobsForRoleInCity(role, city);
  const salary = salaryRangeOf(jobs);

  const BRAND = " | PHE-Perm";
  const base = `${role.shortName} Jobs ${city.name}`;
  const withFest = `${base} – Festanstellung`;
  const title = (withFest + BRAND).length <= 65 ? withFest + BRAND
    : (base + BRAND).length <= 65 ? base + BRAND
    : base;
  const description = salary
    ? `${jobs.length} Stellen als ${role.name} in ${city.name} und Umgebung, ` +
      `${euro(salary.min)}–${euro(salary.max)} pro Jahr. Unbefristete Festanstellung, keine Zeitarbeit, kostenlos für Bewerber.`
    : `${jobs.length} Stellen als ${role.name} in ${city.name} und Umgebung. ` +
      `Unbefristete Festanstellung, keine Zeitarbeit, kostenlos für Bewerber.`;

  return {
    // absolute: sonst hängt das Root-Layout noch "| PHE-Perm Engineering" an
    // und der Titel läuft über die Anzeigegrenze von Google hinaus.
    title: { absolute: title },
    description,
    keywords: [
      `${role.shortName} Jobs ${city.name}`,
      `${role.shortName} ${city.name}`,
      `${role.shortName} Stellenangebote ${city.name}`,
      `Festanstellung ${city.name}`,
    ],
    openGraph: {
      title,
      description,
      url: `${SITE}/berufe/${role.slug}/${city.slug}`,
      images: [{ url: `${SITE}/jobs/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/berufe/${role.slug}/${city.slug}` },
  };
}

export default async function RoleCityPage(
  { params }: { params: Promise<{ beruf: string; stadt: string }> },
) {
  const { beruf, stadt } = await params;
  const hit = resolve(beruf, stadt);
  if (!hit) notFound();
  const { role, city } = hit;

  const jobs = jobsForRoleInCity(role, city);
  const salary = salaryRangeOf(jobs);
  const localCount = jobs.filter(j => j.distance <= 30).length;
  const note = roleCityNote(role.slug, city.slug);

  // Dieselbe Rolle in Nachbarstädten und andere Rollen in derselben Stadt —
  // beides nur, wo die Seite tatsächlich existiert.
  const all = viableRoleCityPages();
  const sameRoleNearby = city.nearby
    .map(slug => all.find(p => p.role.slug === role.slug && p.city.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const otherRolesHere = all.filter(p => p.city.slug === city.slug && p.role.slug !== role.slug);
  const cityPage = jobCities.find(c => c.slug === city.slug);

  // ItemList, kein JobPosting: Die Einzelanzeigen tragen ihr eigenes
  // JobPosting-Schema; eine Wiederholung hier würde dieselbe Stelle doppelt in
  // die Google-Jobsuche einliefern.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${role.name} Stellen in ${city.name}`,
    "numberOfItems": jobs.length,
    "itemListElement": jobs.map(({ job }, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${job.title} in ${job.city}`,
      "url": `${SITE}${jobPath(job)}`,
    })),
  };

  const card = {
    background: "#fff", borderRadius: 16, padding: "32px 28px",
    marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  } as const;

  const pill = {
    background: "#eef4fb", color: "#1e3a5f", borderRadius: 20,
    padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none",
  } as const;

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <JsonLd data={itemListSchema} />
      <Nav />
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Berufe", href: "/berufe" },
        { name: role.shortName, href: role.hubPath },
        { name: city.name, href: `/berufe/${role.slug}/${city.slug}` },
      ]} />

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)", padding: "64px 24px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14,
          }}>
            {city.name} · {city.federalState} · Festanstellung
          </p>
          <h1 style={{
            fontSize: "clamp(28px,4.6vw,42px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 18,
          }}>
            {role.name} Jobs in {city.name}
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.88)", lineHeight: 1.7 }}>
            {jobs.length} offene {jobs.length === 1 ? "Stelle" : "Stellen"} als {role.name} in {city.name} und
            Umgebung{localCount > 0 ? `, davon ${localCount} im direkten Umkreis` : ""}
            {salary ? ` — ${euro(salary.min)} bis ${euro(salary.max)} im Jahr` : ""}.
            Vermittlung in unbefristete Festanstellung, kostenlos für Bewerber.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 24 }}>
            {["Keine Zeitarbeit", "Direkt beim Unternehmen", "Antwort innerhalb von 24 h"].map(t => (
              <span key={t} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>✓ {t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* STELLEN */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>
            Offene Stellen als {role.name} rund um {city.name}
          </h2>
          <p style={{ fontSize: 15, color: "#86868b", marginBottom: 22 }}>
            Sortiert nach Entfernung zu {city.name}.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {jobs.map(({ job, distance }) => (
              <Link key={job.id} href={jobPath(job)} style={{
                display: "block", background: "#fafbfc", border: "1px solid #eceef2",
                borderRadius: 14, padding: "18px 22px", textDecoration: "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f" }}>{job.title}</p>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#2d6a9f", background: "#eef4fb",
                    borderRadius: 999, padding: "4px 12px", whiteSpace: "nowrap",
                  }}>
                    {distance === 0 ? `in ${city.name}` : `${distance} km`}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  {job.city} · {job.salary} · {CATEGORY_LABELS[job.category]}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* GEHALT */}
        {salary && (
          <section style={card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 10 }}>
              Was verdient ein {role.name} in {city.name}?
            </h2>
            <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 }}>
              Die {jobs.length} Stellen auf dieser Seite liegen zwischen <strong>{euro(salary.min)}</strong> und{" "}
              <strong>{euro(salary.max)}</strong> Jahresgehalt. Das sind die tatsächlich ausgeschriebenen Spannen,
              keine Schätzung. Schicht-, Bereitschafts- und Montagezulagen kommen bei den entsprechenden Stellen
              noch hinzu; die genaue Spanne steht in jeder Anzeige.
            </p>
          </section>
        )}

        {/* BERUFSBILD */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 14 }}>
            Der Beruf: {role.name}
          </h2>
          <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75, marginBottom: 18 }}>{role.profile}</p>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 8 }}>Typische Aufgaben</h3>
          <ul style={{ margin: "0 0 18px", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            {role.tasks.map(t => (
              <li key={t} style={{ fontSize: 15, color: "#3d3d3f", lineHeight: 1.65 }}>{t}</li>
            ))}
          </ul>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 8 }}>Voraussetzungen</h3>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            {role.requirements.map(r => (
              <li key={r} style={{ fontSize: 15, color: "#3d3d3f", lineHeight: 1.65 }}>{r}</li>
            ))}
          </ul>

          <Link href={role.hubPath} style={{
            display: "inline-block", marginTop: 20, fontSize: 15, fontWeight: 700,
            color: "#2d6a9f", textDecoration: "none",
          }}>
            Alles zum Berufsbild {role.shortName} →
          </Link>
        </section>

        {/* ARBEITSMARKT VOR ORT */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 14 }}>
            {role.shortName} in {city.name}: der lokale Arbeitsmarkt
          </h2>
          {note && (
            <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75, marginBottom: 16 }}>{note}</p>
          )}
          <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 }}>{city.market}</p>
          {cityPage && (
            <Link href={`/jobs/in/${city.slug}`} style={{
              display: "inline-block", marginTop: 16, fontSize: 15, fontWeight: 700,
              color: "#2d6a9f", textDecoration: "none",
            }}>
              Alle Stellenangebote in {city.name} →
            </Link>
          )}
        </section>

        {/* FAQ */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 18 }}>
            Häufige Fragen
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {role.faq.map(f => (
              <div key={f.q}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: "#3d3d3f", lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>
                Vermitteln Sie auch außerhalb von {city.name}?
              </h3>
              <p style={{ fontSize: 15, color: "#3d3d3f", lineHeight: 1.7 }}>
                Ja. Die Stellen auf dieser Seite liegen im Umkreis von bis zu {city.radiusKm} Kilometern um{" "}
                {city.name} — mit Entfernungsangabe, damit Sie selbst einschätzen können, was pendelbar ist.
                Darüber hinaus vermitteln wir bundesweit.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ ...card, background: "#1e3a5f" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
            Passt keine der Stellen genau?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 20 }}>
            Melden Sie sich trotzdem. Wir kennen den Markt für {role.shortName} in der Region und melden uns,
            sobald eine passende Stelle frei wird.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/kontakt" style={{
              display: "inline-block", background: "#f59e0b", color: "#1a1a1a", borderRadius: 12,
              padding: "14px 26px", fontSize: 15, fontWeight: 800, textDecoration: "none",
            }}>
              Kontakt aufnehmen →
            </Link>
            <Link href="/lebenslauf-erstellen" style={{
              display: "inline-block", background: "rgba(255,255,255,0.12)", color: "#fff", borderRadius: 12,
              padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>
              Lebenslauf kostenlos erstellen
            </Link>
          </div>
        </section>

        {/* QUERVERLINKUNG */}
        {otherRolesHere.length > 0 && (
          <section style={{ marginTop: 12, marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>
              Andere Berufe in {city.name}
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {otherRolesHere.map(p => (
                <Link key={p.role.slug} href={`/berufe/${p.role.slug}/${p.city.slug}`} style={pill}>
                  {p.role.shortName}
                </Link>
              ))}
            </div>
          </section>
        )}

        {sameRoleNearby.length > 0 && (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>
              {role.shortName} in anderen Städten
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {sameRoleNearby.map(p => (
                <Link key={p.city.slug} href={`/berufe/${p.role.slug}/${p.city.slug}`} style={{
                  ...pill, background: "#fff", border: "1px solid #e6e8ec",
                }}>
                  {p.city.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
