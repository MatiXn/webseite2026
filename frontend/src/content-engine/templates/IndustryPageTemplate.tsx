// Branchen-Seite (EPIC 008D). Eigenständiges Template für das Branchen-/Markt­umfeld
// (NICHT das Berufsprofil). Nutzt dieselben UI-Primitiven wie die Profession-Seite
// (Nav/Footer/JsonLd/BreadcrumbsView/FaqSection, Design-Tokens) und die Industry-Composer.
// Route bleibt dünn; Matching/Schema/Links laufen genau einmal hier.
import Link from "next/link";
import Nav from "../../app/components/Nav";
import Footer from "../../app/components/Footer";
import JsonLd from "../../app/components/JsonLd";
import BreadcrumbsView from "../../app/components/BreadcrumbsView";
import FaqSection from "../../app/components/FaqSection";
import { JOBS } from "../../app/jobs/data";
import { jobPath } from "../../lib/slug";
import type { IndustryContent } from "../../content/industries/types";
import { professionBySlug } from "../../content/professions";
import { matchJobsForConfig } from "../job-matching";
import { buildIndustrySchema } from "../schema";
import { buildIndustryInternalLinks } from "../internal-links";

// Generische Vermittlungs-Erklärung (Template-Chrome, kein berufs-/branchenspezifischer Text).
const COMMITMENT = {
  title: "Direktvermittlung statt Zeitarbeit",
  text: "PHE-Perm vermittelt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung. Der Arbeitsvertrag entsteht zwischen Fachkraft und Unternehmen; wir begleiten den Prozess persönlich.",
} as const;

function teaser(s: string): string {
  if (s.length <= 150) return s;
  const cut = s.slice(0, 150);
  return `${cut.slice(0, cut.lastIndexOf(" "))} …`;
}

const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };
const sectionWrap: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "56px 24px" };
const h2Style: React.CSSProperties = { fontSize: "clamp(23px,3vw,32px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 };
const bodyStyle: React.CSSProperties = { fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 };

export function IndustryPageTemplate({ industry }: { industry: IndustryContent }) {
  const p = industry;

  const matchResult = matchJobsForConfig(JOBS, p.jobMatch, p.slug);
  const matches = matchResult.matches;
  const visibleJobs = matches.map((m) => m.job);
  const hasMoreJobs = matchResult.totalMatched > matches.length;

  const links = buildIndustryInternalLinks({ industry: p, professionRegistry: { professionBySlug }, jobMatches: matches });
  const breadcrumbItems = links.breadcrumbs.map((b) => ({ name: b.label, href: b.href }));
  const hubLink = links.coreLinks.find((l) => l.type === "parent");
  const jobsHref = links.coreLinks.find((l) => l.type === "jobs")?.href ?? "/jobs";

  const schema = buildIndustrySchema(p, visibleJobs);

  const jobsHeading = visibleJobs.length === 1 ? "Aktuell passende Stelle" : "Aktuell passende Stellen";

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={schema} />
      <Nav />
      <BreadcrumbsView items={breadcrumbItems} />

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 8px" }}>
        {p.hero.eyebrow && (
          <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{p.hero.eyebrow}</p>
        )}
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18, textWrap: "balance" }}>
          {p.hero.headline}
        </h1>
        <p style={{ ...bodyStyle, fontSize: 18, color: "#586170", maxWidth: 720, marginBottom: 28 }}>{p.hero.intro}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={p.hero.primaryCta.href} className="pathswitch-cta pathswitch-cta--primary">{p.hero.primaryCta.label}</Link>
          <Link href={p.hero.secondaryCta.href} className="pathswitch-cta pathswitch-cta--secondary">{p.hero.secondaryCta.label}</Link>
        </div>
      </section>

      {/* Branchenüberblick */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>{p.overview.title}</h2>
        {p.overview.paragraphs.map((para, i) => (
          <p key={i} style={{ ...bodyStyle, marginBottom: i < p.overview.paragraphs.length - 1 ? 14 : 0 }}>{para}</p>
        ))}
      </section>

      {/* Fokus- und Einsatzbereiche */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={h2Style}>Schwerpunkte und Einsatzfelder</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 20 }}>
            {p.focusAreas.map((f) => (
              <div key={f.title} style={{ borderLeft: "3px solid #3b72b8", padding: "4px 0 4px 14px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1d1d1f", marginBottom: 3 }}>{f.title}</p>
                <p style={{ fontSize: 14, color: "#586170", lineHeight: 1.55 }}>{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direktvermittlung (Template-Chrome) */}
      <section style={{ background: "#0f2035", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 16 }}>{COMMITMENT.title}</h2>
          <p style={{ ...bodyStyle, color: "rgba(255,255,255,0.7)", maxWidth: 720 }}>{COMMITMENT.text}</p>
        </div>
      </section>

      {/* Passende Stellen */}
      <section id="stellen" style={{ ...sectionWrap, scrollMarginTop: 72 }}>
        <h2 style={h2Style}>{jobsHeading}</h2>
        {visibleJobs.length > 0 ? (
          <>
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
            {hasMoreJobs && (
              <Link href={jobsHref} style={{ ...linkStyle, display: "inline-block", marginTop: 20 }}>Alle offenen Stellen ansehen →</Link>
            )}
          </>
        ) : (
          <div style={{ background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 14, padding: "24px 22px" }}>
            <p style={{ ...bodyStyle, fontSize: 15, marginBottom: 12 }}>
              Aktuell ist für diese Branche keine passende Stelle ausgeschrieben. Sehen Sie in die gesamte
              Jobübersicht oder sprechen Sie uns für eine Initiativbewerbung an.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9 }}>
              <Link href={jobsHref} style={linkStyle}>Alle offenen Stellen ansehen</Link><br />
              <Link href="/kontakt" style={linkStyle}>Initiativ Kontakt aufnehmen</Link>
            </p>
          </div>
        )}
      </section>

      {/* Relevante Berufe */}
      {links.relevantProfessionLinks.length > 0 && (
        <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={h2Style}>Relevante Berufe in der {p.name}</h2>
            <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 12 }}>
              {links.relevantProfessionLinks.map((rel) => (
                <li key={rel.href}>
                  <Link href={rel.href} style={{ ...linkStyle, display: "inline-block", background: "#fff", border: "1px solid #e2e6ee", borderRadius: 999, padding: "8px 16px", fontSize: 14 }}>{rel.label} →</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Nutzen für Unternehmen */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>{p.employerCta.title}</h2>
        <p style={{ ...bodyStyle, fontSize: 16, color: "#586170", marginBottom: 20 }}>{p.employerCta.text}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={p.employerCta.primaryCta.href} className="pathswitch-cta pathswitch-cta--primary">{p.employerCta.primaryCta.label}</Link>
          {p.employerCta.secondaryCta && (
            <Link href={p.employerCta.secondaryCta.href} className="pathswitch-cta pathswitch-cta--secondary">{p.employerCta.secondaryCta.label}</Link>
          )}
        </div>
      </section>

      {/* Nutzen für Kandidaten */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...h2Style, marginBottom: 12 }}>{p.applicantCta.title}</h2>
          <p style={{ ...bodyStyle, fontSize: 16, color: "#586170", marginBottom: 28 }}>{p.applicantCta.text}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href={p.applicantCta.primaryCta.href} className="pathswitch-cta pathswitch-cta--primary">{p.applicantCta.primaryCta.label}</Link>
            {p.applicantCta.secondaryCta && (
              <Link href={p.applicantCta.secondaryCta.href} className="pathswitch-cta pathswitch-cta--secondary">{p.applicantCta.secondaryCta.label}</Link>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title={`Häufige Fragen zur Personalvermittlung ${p.name}`} items={[...p.faq]} />
      </div>

      {/* Zurück zum Hub */}
      {hubLink && (
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 24px 48px" }}>
          <Link href={hubLink.href} style={linkStyle}>← {hubLink.label}</Link>
        </section>
      )}

      <Footer />
    </div>
  );
}
