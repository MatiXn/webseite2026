// Ortsseiten für die Bewerbersuche: /jobs/in/<stadt>.
//
// Hintergrund (Search Console, 12-Monats-Export 20.08.2026): Anfragen wie
// "jobs mosbach" oder "stellenangebote frankenthal" erzeugten über 500
// Impressionen bei nahezu null Klicks. Google lieferte dafür einzelne
// Stellenanzeigen aus — gesucht wird aber eine Übersicht. Diese Seite schließt
// die Lücke: alle Stellen im Umkreis, nach Entfernung sortiert, plus lokaler
// Kontext, den eine Einzelanzeige nicht liefern kann.
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { JOBS, distanceKm, CATEGORY_LABELS } from "../../data";
import { jobPath } from "../../../../lib/slug";
import { jobCities, jobCityBySlug, type JobCity } from "../../../../content/job-cities";
import JsonLd from "../../../components/JsonLd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";

const SITE = "https://www.phe-perm.de";

// Täglich neu bauen, damit die Stellenliste dem Sheet-Stand folgt.
export const revalidate = 86400;

type JobWithDistance = { job: (typeof JOBS)[number]; distance: number };

/** Stellen im Umkreis, nach Entfernung sortiert. Bundesweite Stellen laufen mit. */
function jobsNear(city: JobCity): JobWithDistance[] {
  const local = JOBS
    .filter(j => !j.nationwide)
    .map(job => ({ job, distance: Math.round(distanceKm(city.lat, city.lng, job.lat, job.lng)) }))
    .filter(({ distance }) => distance <= city.radiusKm)
    .sort((a, b) => a.distance - b.distance);

  const nationwide = JOBS.filter(j => j.nationwide).map(job => ({ job, distance: -1 }));
  return [...local, ...nationwide];
}

function distanceLabel(distance: number, cityName: string): string {
  if (distance < 0) return "bundesweit";
  if (distance === 0) return `in ${cityName}`;
  return `${distance} km von ${cityName}`;
}

export function generateStaticParams() {
  return jobCities.map(c => ({ stadt: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ stadt: string }> }): Promise<Metadata> {
  const { stadt } = await params;
  const city = jobCityBySlug(stadt);
  if (!city) return {};

  const count = jobsNear(city).length;
  const title = `Stellenangebote ${city.name} – Jobs in Festanstellung | PHE-Perm`;
  const description =
    `${count} technische Stellenangebote in ${city.name} und Umgebung: Elektroniker, Mechatroniker, ` +
    `Servicetechniker. Unbefristete Festanstellung, keine Zeitarbeit, kostenlos für Bewerber.`;

  return {
    title,
    description,
    keywords: [
      `Stellenangebote ${city.name}`,
      `Jobs ${city.name}`,
      `Elektroniker ${city.name}`,
      `Festanstellung ${city.name}`,
      `Vollzeit Jobs ${city.name}`,
    ],
    openGraph: {
      title,
      description,
      url: `${SITE}/jobs/in/${city.slug}`,
      images: [{ url: `${SITE}/jobs/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/jobs/in/${city.slug}` },
  };
}

export default async function JobCityPage({ params }: { params: Promise<{ stadt: string }> }) {
  const { stadt } = await params;
  const city = jobCityBySlug(stadt);
  if (!city) notFound();

  const nearby = jobsNear(city);
  const categories = [...new Set(nearby.map(n => n.job.category))];

  // ItemList statt JobPosting: Die Einzelanzeigen tragen ihr eigenes
  // JobPosting-Schema. Es hier zu wiederholen würde dieselbe Stelle doppelt
  // in die Jobsuche einliefern.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Stellenangebote in ${city.name}`,
    "numberOfItems": nearby.length,
    "itemListElement": nearby.map(({ job }, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${job.title} in ${job.city}`,
      "url": `${SITE}${jobPath(job)}`,
    })),
  };

  const card = {
    background: "#fff",
    borderRadius: 16,
    padding: "32px 28px",
    marginBottom: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  } as const;

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <JsonLd data={itemListSchema} />
      <Nav />
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Stellenangebote", href: "/jobs" },
        { name: city.name, href: `/jobs/in/${city.slug}` },
      ]} />

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)", padding: "64px 24px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14,
          }}>
            {city.federalState} · Festanstellung
          </p>
          <h1 style={{
            fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 18,
          }}>
            Stellenangebote in {city.name}
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.88)", lineHeight: 1.7, maxWidth: 700 }}>
            {city.intro}
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 24 }}>
            {["100 % kostenlos für Bewerber", "Keine Zeitarbeit", "Antwort innerhalb von 24 h"].map(t => (
              <span key={t} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>✓ {t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* STELLENLISTE */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>
            {nearby.length} offene Stellen für {city.name} und Umgebung
          </h2>
          <p style={{ fontSize: 15, color: "#86868b", marginBottom: 22 }}>
            Sortiert nach Entfernung zu {city.name}. Jede Stelle ist eine unbefristete Festanstellung
            direkt beim Unternehmen.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {nearby.map(({ job, distance }) => (
              <Link key={job.id} href={jobPath(job)} style={{
                display: "block", background: "#fafbfc", border: "1px solid #eceef2",
                borderRadius: 14, padding: "18px 22px", textDecoration: "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f" }}>{job.title}</p>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#2d6a9f",
                    background: "#eef4fb", borderRadius: 999, padding: "4px 12px", whiteSpace: "nowrap",
                  }}>
                    {distanceLabel(distance, city.name)}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  {job.city} · {job.salary} · {CATEGORY_LABELS[job.category]}
                </p>
              </Link>
            ))}
          </div>
          <Link href="/jobs" style={{
            display: "inline-block", marginTop: 20, fontSize: 15, fontWeight: 700,
            color: "#2d6a9f", textDecoration: "none",
          }}>
            Alle Stellenangebote bundesweit ansehen →
          </Link>
        </section>

        {/* LOKALER KONTEXT */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 14 }}>
            Der Arbeitsmarkt für Technik in {city.name}
          </h2>
          <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75, marginBottom: 16 }}>{city.market}</p>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 8 }}>
            Pendelraum und Umland
          </h3>
          <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 }}>{city.commute}</p>
        </section>

        {/* BERUFSBILDER */}
        {categories.length > 0 && (
          <section style={card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 14 }}>
              Berufe, die wir in {city.name} vermitteln
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { href: "/berufe/elektroniker", label: "Elektroniker" },
                { href: "/berufe/elektroniker-betriebstechnik", label: "Elektroniker Betriebstechnik" },
                { href: "/berufe/mechatroniker", label: "Mechatroniker" },
                { href: "/berufe/servicetechniker", label: "Servicetechniker" },
                { href: "/berufe/sps-automatisierung", label: "SPS / Automatisierung" },
                { href: "/berufe/kaeltetechniker", label: "Kältetechniker" },
              ].map(b => (
                <Link key={b.href} href={b.href} style={{
                  background: "#eef4fb", color: "#1e3a5f", borderRadius: 20,
                  padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none",
                }}>
                  {b.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section style={card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 18 }}>
            Häufige Fragen zu Stellen in {city.name}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {city.faq.map(f => (
              <div key={f.q}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: "#3d3d3f", lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ ...card, background: "#1e3a5f" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
            Nichts Passendes in {city.name} dabei?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 20 }}>
            Melden Sie sich trotzdem — wir nehmen Sie in die Vormerkung auf und melden uns, sobald
            eine passende Stelle in Ihrer Region frei wird.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/kontakt" style={{
              display: "inline-block", background: "#f59e0b", color: "#1a1a1a",
              borderRadius: 12, padding: "14px 26px", fontSize: 15, fontWeight: 800, textDecoration: "none",
            }}>
              Kontakt aufnehmen →
            </Link>
            <Link href="/lebenslauf-erstellen" style={{
              display: "inline-block", background: "rgba(255,255,255,0.12)", color: "#fff",
              borderRadius: 12, padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>
              Lebenslauf kostenlos erstellen
            </Link>
          </div>
        </section>

        {/* NACHBARSTÄDTE */}
        <section style={{ marginTop: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>
            Stellenangebote in anderen Städten
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {jobCities.filter(c => c.slug !== city.slug).map(c => (
              <Link key={c.slug} href={`/jobs/in/${c.slug}`} style={{
                background: "#fff", border: "1px solid #e6e8ec", color: "#1e3a5f",
                borderRadius: 20, padding: "8px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
