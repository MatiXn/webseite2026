import { notFound } from "next/navigation";
import Link from "next/link";
import { JOBS } from "../data";
import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ApplyForm from "./ApplyForm";
import GoogleReviews from "./GoogleReviews";

const CATEGORY_LABELS: Record<string, string> = {
  elektro: "Elektrotechnik",
  mechatronik: "Mechatronik",
  it: "IT & Software",
  bau: "Bau & Infrastruktur",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = JOBS.find(j => j.id === id);
  if (!job) return {};

  const title = `${job.title} in ${job.city} – Festanstellung | PHE-Perm Engineering`;
  const description = job.description
    ? `${job.title} in ${job.city}: ${job.description.slice(0, 120)}… Festanstellung, ${job.salary}. Kostenlos bewerben.`
    : `Jetzt als ${job.title} in ${job.city} bewerben. ${job.salary}. Festanstellung, kostenlos – PHE-Perm Engineering.`;

  const ogImageUrl = `https://www.phe-perm.de/jobs/${id}/opengraph-image`;

  return {
    title,
    description,
    keywords: [job.title, job.city, "Festanstellung", "Job", "PHE-Perm Engineering", ...job.tags],
    openGraph: {
      title,
      description,
      url: `https://www.phe-perm.de/jobs/${id}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${job.title} – ${job.city}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
    alternates: { canonical: `/jobs/${id}` },
  };
}

export function generateStaticParams() {
  return JOBS.map(j => ({ id: j.id }));
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = JOBS.find(j => j.id === id);
  if (!job) notFound();

  const validThrough = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || `${job.title} in ${job.city}. Festanstellung, kostenlos für Bewerber.`,
    "datePosted": "2026-01-01",
    "validThrough": validThrough,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "PHE-Perm Engineering Ingenieure & Techniker GmbH",
      "sameAs": "https://www.phe-perm.de",
      "logo": "https://www.phe-perm.de/phe-logo.png",
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city.split(",")[0].trim(),
        "addressCountry": "DE",
      },
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": { "@type": "QuantitativeValue", "unitText": "YEAR", "description": job.salary },
    },
    "skills": job.tags.join(", "),
    "benefits": job.benefits?.join(", ") || "Festanstellung, Vollzeit",
    "url": `https://www.phe-perm.de/jobs/${job.id}`,
    "applicantLocationRequirements": { "@type": "Country", "name": "Deutschland" },
    "directApply": true,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phe-perm.de" },
      { "@type": "ListItem", "position": 2, "name": "Stellenangebote", "item": "https://www.phe-perm.de/jobs" },
      { "@type": "ListItem", "position": 3, "name": job.title, "item": `https://www.phe-perm.de/jobs/${job.id}` },
    ],
  };

  const similarJobs = JOBS
    .filter(j => j.id !== job.id && j.category === job.category)
    .slice(0, 3);

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <JsonLd data={jobPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
        padding: "72px 24px 56px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <p style={{
              fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>
              {CATEGORY_LABELS[job.category]} · {job.city}, {job.region}
            </p>
            <span style={{
              fontSize: 12, fontWeight: 700, color: "#86efac",
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(134,239,172,0.35)",
              borderRadius: 999, padding: "4px 12px",
            }}>
              ● Aktiv auf Bewerbersuche · {job.posted}
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20,
          }}>
            {job.title}
          </h1>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Gehalt</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>{job.salary}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Anstellung</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{job.type}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Standort</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{job.city}</p>
            </div>
          </div>
          <a
            href="#bewerben"
            style={{
              display: "inline-block", background: "#f59e0b", color: "#1a1a1a",
              borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Jetzt bewerben →
          </a>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 20 }}>
            {["★ 5,0 auf Google (32 Bewertungen)", "100 % kostenlos & unverbindlich", "Antwort innerhalb von 24 h"].map(t => (
              <span key={t} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* AUFGABEN / BESCHREIBUNG */}
        <section style={{
          background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 16 }}>
            📋 Ihre Aufgaben
          </h2>
          <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 }}>{job.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
            {job.tags.map(tag => (
              <span key={tag} style={{
                background: "#eef4fb", color: "#1e3a5f", borderRadius: 20,
                padding: "6px 14px", fontSize: 13, fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section style={{
          background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 16 }}>
            ✅ Das bieten wir Ihnen
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {job.benefits.map(benefit => (
              <div key={benefit} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#f0f7ff", borderRadius: 12, padding: "14px 16px",
              }}>
                <span style={{ color: "#2d6a9f", fontWeight: 800, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1e3a5f" }}>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* WARUM PHE */}
        <section style={{
          background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>
            🤝 100 % kostenlos für Sie
          </h2>
          <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 }}>
            PHE-Perm Engineering vermittelt Sie direkt in eine <strong>unbefristete Festanstellung</strong> beim
            Unternehmen – keine Zeitarbeit, keine Kosten für Sie. Wir begleiten Sie persönlich durch den
            gesamten Bewerbungsprozess und antworten innerhalb von 24 Stunden.
          </p>
        </section>

        {/* GOOGLE-BEWERTUNGEN */}
        <GoogleReviews jobId={job.id} />

        {/* SO GEHT'S WEITER */}
        <section style={{
          background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 20 }}>
            🚀 So geht es nach Ihrer Bewerbung weiter
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { step: "1", title: "Bewerbung absenden", text: "Dauert ca. 60 Sekunden – kein Anschreiben, kein Lebenslauf nötig." },
              { step: "2", title: "Wir melden uns innerhalb von 24 Stunden", text: "Kurzes Telefonat: Wir klären Ihre Wünsche zu Gehalt, Standort und Aufgaben." },
              { step: "3", title: "Vorstellung beim Unternehmen", text: "Passt es für Sie, stellen wir den Kontakt her – Sie entscheiden in jedem Schritt selbst." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                  background: "#1e3a5f", color: "#fff", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800,
                }}>
                  {s.step}
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BEWERBUNGSFORMULAR */}
        <section id="bewerben" style={{
          background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", scrollMarginTop: 80,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>
            📬 In 60 Sekunden bewerben
          </h2>
          <p style={{ fontSize: 15, color: "#86868b", marginBottom: 24 }}>
            Nur 2 Pflichtfelder – kein Anschreiben, kein Lebenslauf nötig.
            Wir melden uns innerhalb von 24 Stunden bei Ihnen.
          </p>
          <ApplyForm jobTitle={job.title} jobCity={job.city} />
        </section>

        {/* ÄHNLICHE JOBS */}
        {similarJobs.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 20 }}>
              Ähnliche Stellenangebote
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {similarJobs.map(sj => (
                <Link key={sj.id} href={`/jobs/${sj.id}`} style={{
                  display: "block", background: "#fff", borderRadius: 14,
                  padding: "20px 24px", textDecoration: "none",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 4 }}>
                    {sj.title}
                  </p>
                  <p style={{ fontSize: 14, color: "#86868b" }}>
                    {sj.city} · {sj.salary} · {sj.type}
                  </p>
                </Link>
              ))}
            </div>
            <Link href="/jobs" style={{
              display: "inline-block", marginTop: 20, fontSize: 15, fontWeight: 700,
              color: "#2d6a9f", textDecoration: "none",
            }}>
              Alle Stellenangebote ansehen →
            </Link>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
