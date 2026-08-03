// Stadt-Seite (EPIC 010B). Eigenständiges Template für den lokalen Vermittlungsmarkt
// (NICHT Beruf/Branche). Nutzt dieselben UI-Primitiven (Nav/Footer/JsonLd/
// BreadcrumbsView/FaqSection) und die City-Composer. Rendert Inhaltsblöcke NUR, wenn
// sie in der Config vorhanden sind. KEINE Düsseldorf-Hardcodes, kein if slug===…,
// keine Adresse/LocalBusiness-Logik hier — Standortdaten kommen als optionaler Slot
// aus der Route. Route bleibt dünn.
import Link from "next/link";
import Nav from "../../app/components/Nav";
import Footer from "../../app/components/Footer";
import JsonLd from "../../app/components/JsonLd";
import BreadcrumbsView from "../../app/components/BreadcrumbsView";
import FaqSection from "../../app/components/FaqSection";
import { JOBS } from "../../app/jobs/data";
import { jobPath } from "../../lib/slug";
import type { CityContent } from "../../content/cities/types";
import { professionBySlug } from "../../content/professions";
import { industryBySlug } from "../../content/industries";
import { cityBySlug } from "../../content/cities";
import { matchJobsForConfig } from "../job-matching";
import { buildCitySchema } from "../schema";
import { buildCityInternalLinks } from "../internal-links";

const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };
const wrap: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "56px 24px" };
const h2Style: React.CSSProperties = { fontSize: "clamp(23px,3vw,32px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 };
const bodyStyle: React.CSSProperties = { fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 };

// Footer-Kurzlinks der Final-CTA (generische Label-Texte, keine Marketingprosa).
const FINAL_LINK_LABELS = { personalvermittlung: "Technische Personalvermittlung", jobs: "Offene Stellen", professions: "Technische Berufe" } as const;

function teaser(s: string): string {
  if (s.length <= 150) return s;
  const cut = s.slice(0, 150);
  return `${cut.slice(0, cut.lastIndexOf(" "))} …`;
}

export function CityPageTemplate({ city, localBusinessSlot }: { city: CityContent; localBusinessSlot?: React.ReactNode }) {
  const c = city;

  const matchResult = matchJobsForConfig(JOBS, c.jobMatch, c.slug);
  const matches = matchResult.matches;
  const visibleJobs = matches.map((m) => m.job);
  const hasMoreJobs = matchResult.totalMatched > matches.length;

  const links = buildCityInternalLinks({ city: c, registries: { professionBySlug, industryBySlug, cityBySlug }, jobMatches: matches });
  const breadcrumbItems = links.breadcrumbs.map((b) => ({ name: b.label, href: b.href }));
  const jobsHref = c.internalLinks.jobs;

  const schema = buildCitySchema(c, visibleJobs);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={schema} />
      <Nav />
      <BreadcrumbsView items={breadcrumbItems} />

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 8px" }}>
        {c.hero.eyebrow && (
          <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{c.hero.eyebrow}</p>
        )}
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 20, textWrap: "balance" }}>
          {c.hero.headline}
        </h1>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", lineHeight: 1.4, marginBottom: 18, maxWidth: 720 }}>{c.hero.intro}</p>
        {c.hero.supportingParagraphs && c.hero.supportingParagraphs.length > 0 && (
          <div style={{ ...bodyStyle, color: "#586170", maxWidth: 680, marginBottom: 28 }}>
            {c.hero.supportingParagraphs.map((para, i) => (
              <p key={i} style={{ marginBottom: i < c.hero.supportingParagraphs!.length - 1 ? 12 : 0 }}>{para}</p>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={c.hero.primaryCta.href} className="pathswitch-cta pathswitch-cta--primary">{c.hero.primaryCta.label}</Link>
          <Link href={c.hero.secondaryCta.href} className="pathswitch-cta pathswitch-cta--secondary">{c.hero.secondaryCta.label}</Link>
        </div>
      </section>

      {/* Optionaler Überblick */}
      {c.overview && (
        <section style={wrap}>
          <h2 style={h2Style}>{c.overview.title}</h2>
          {c.overview.paragraphs.map((para, i) => (
            <p key={i} style={{ ...bodyStyle, marginBottom: i < c.overview!.paragraphs.length - 1 ? 14 : 0 }}>{para}</p>
          ))}
        </section>
      )}

      {/* Optionale lokale Erfahrung */}
      {c.localExperience && (
        <section style={wrap}>
          <h2 style={h2Style}>{c.localExperience.title}</h2>
          {c.localExperience.paragraphs.map((para, i) => (
            <p key={i} style={{ ...bodyStyle, marginBottom: i < c.localExperience!.paragraphs.length - 1 ? 14 : 0 }}>{para}</p>
          ))}
        </section>
      )}

      {/* Unternehmensnutzen (Bullet-Liste) */}
      {c.employerValue && (
        <section style={wrap}>
          <h2 style={h2Style}>{c.employerValue.title}</h2>
          {c.employerValue.text && <p style={{ ...bodyStyle, color: "#586170", marginBottom: 16 }}>{c.employerValue.text}</p>}
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {c.employerValue.bulletPoints.map((t) => (
              <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", ...bodyStyle }}>
                <span aria-hidden="true" style={{ color: "#3b72b8", fontWeight: 800, flexShrink: 0 }}>—</span>{t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Kandidatennutzen (Bullet-Liste, helle Sektion) */}
      {c.candidateValue && (
        <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={h2Style}>{c.candidateValue.title}</h2>
            {c.candidateValue.text && <p style={{ ...bodyStyle, color: "#586170", marginBottom: 16 }}>{c.candidateValue.text}</p>}
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {c.candidateValue.bulletPoints.map((t) => (
                <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", ...bodyStyle }}>
                  <span aria-hidden="true" style={{ color: "#3b72b8", fontWeight: 800, flexShrink: 0 }}>—</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Differenzierung / Grundsätze (Karten) */}
      {c.differentiators && (
        <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={h2Style}>{c.differentiators.title}</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
              {c.differentiators.items.map((g) => (
                <li key={g} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", border: "1px solid #e2e6ee", borderRadius: 12, padding: "16px 18px", fontSize: 15.5, color: "#1d1d1f", lineHeight: 1.5 }}>
                  <span aria-hidden="true" style={{ color: "#1f7a4d", fontWeight: 800, flexShrink: 0 }}>✓</span>{g}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Spezialisierung (verlinkte Chips) */}
      {c.specializations && (
        <section style={wrap}>
          <h2 style={h2Style}>{c.specializations.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {c.specializations.items.map((s) => (
              <Link key={s.label} href={s.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 12, padding: "18px 18px", textDecoration: "none", fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>
                {s.label}<span aria-hidden="true" style={{ color: "#3b72b8" }}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Passende Stellen (nur bei echten Treffern) */}
      {visibleJobs.length > 0 && (
        <section id="stellen" style={{ ...wrap, scrollMarginTop: 72 }}>
          <h2 style={h2Style}>{visibleJobs.length === 1 ? "Aktuell passende Stelle" : "Aktuell passende Stellen"}</h2>
          <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
            {visibleJobs.map((job) => (
              <Link key={job.id} href={jobPath(job)} style={{ display: "block", background: "#fff", border: "1px solid #e2e6ee", borderRadius: 14, padding: "20px 22px", textDecoration: "none" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 4 }}>{job.title}</p>
                <p style={{ fontSize: 13.5, color: "#586170", marginBottom: 8 }}>{job.city} · {job.salary} · {job.type}</p>
                <p style={{ fontSize: 14, color: "#3d3d3f", lineHeight: 1.6 }}>{teaser(job.description)}</p>
                <span style={{ ...linkStyle, fontSize: 14, display: "inline-block", marginTop: 10 }}>Zur Stelle →</span>
              </Link>
            ))}
          </div>
          {hasMoreJobs && <Link href={jobsHref} style={{ ...linkStyle, display: "inline-block", marginTop: 20 }}>Alle offenen Stellen ansehen →</Link>}
        </section>
      )}

      {/* Relevante Berufe (nur wenn konfiguriert) */}
      {links.relevantProfessionLinks.length > 0 && (
        <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={h2Style}>Relevante Berufe</h2>
            <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 12 }}>
              {links.relevantProfessionLinks.map((rel) => (
                <li key={rel.href}><Link href={rel.href} style={{ ...linkStyle, display: "inline-block", background: "#fff", border: "1px solid #e2e6ee", borderRadius: 999, padding: "8px 16px", fontSize: 14 }}>{rel.label} →</Link></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Relevante Branchen (nur wenn konfiguriert) */}
      {links.relevantIndustryLinks.length > 0 && (
        <section style={wrap}>
          <h2 style={h2Style}>Relevante Branchen</h2>
          <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 12 }}>
            {links.relevantIndustryLinks.map((rel) => (
              <li key={rel.href}><Link href={rel.href} style={{ ...linkStyle, display: "inline-block", background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 999, padding: "8px 16px", fontSize: 14 }}>{rel.label} →</Link></li>
            ))}
          </ul>
        </section>
      )}

      {/* Prozess / Zusammenarbeit (dunkle Sektion, nummeriert) */}
      {c.employerProcess && (
        <section style={{ background: "#0f2035", padding: "56px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ ...h2Style, color: "#fff" }}>{c.employerProcess.title}</h2>
            <ol style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              {c.employerProcess.steps.map((s, i) => (
                <li key={s.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 20px" }}>
                  <div aria-hidden="true" style={{ fontSize: 24, fontWeight: 800, color: "rgba(126,179,240,0.6)", marginBottom: 8 }}>{i + 1}</div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.title}</p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Für welche Unternehmen (Branchen-Chips) */}
      {c.servedIndustryTags && (
        <section style={wrap}>
          <h2 style={h2Style}>{c.servedIndustryTags.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {c.servedIndustryTags.tags.map((b) => (
              <span key={b} style={{ fontSize: 15, fontWeight: 600, background: "#eef4fb", color: "#1e3a5f", borderRadius: 999, padding: "8px 18px" }}>{b}</span>
            ))}
          </div>
        </section>
      )}

      {/* Abgrenzung ("Wann wir Nein sagen") */}
      {c.boundaries && (
        <section style={{ background: "#f5f5f7", padding: "56px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={h2Style}>{c.boundaries.title}</h2>
            {c.boundaries.paragraphs.map((para, i) => {
              const last = i === c.boundaries!.paragraphs.length - 1;
              return <p key={i} style={{ ...bodyStyle, marginBottom: last ? 0 : 14, ...(last ? { fontWeight: 700, color: "#1d1d1f" } : {}) }}>{para}</p>;
            })}
          </div>
        </section>
      )}

      {/* Standort/NAP – Düsseldorf-Sonderfall, aus der Route injiziert */}
      {localBusinessSlot}

      {/* FAQ */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title={`Häufige Fragen zur Personalvermittlung in ${c.local.cityName}`} items={[...c.faq]} />
      </div>

      {/* Final CTA */}
      {c.finalCta && (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px", textAlign: "center" }}>
          <h2 style={{ ...h2Style, marginBottom: 24 }}>{c.finalCta.title}</h2>
          <Link href={c.finalCta.cta.href} className="pathswitch-cta pathswitch-cta--primary">{c.finalCta.cta.label}</Link>
          <p style={{ fontSize: 15, lineHeight: 1.9, marginTop: 28, color: "#586170" }}>
            <Link href={c.internalLinks.personalvermittlung} style={linkStyle}>{FINAL_LINK_LABELS.personalvermittlung}</Link>
            {"  ·  "}
            <Link href={c.internalLinks.jobs} style={linkStyle}>{FINAL_LINK_LABELS.jobs}</Link>
            {"  ·  "}
            <Link href={c.internalLinks.professions} style={linkStyle}>{FINAL_LINK_LABELS.professions}</Link>
          </p>
        </section>
      )}

      <Footer />
    </div>
  );
}
