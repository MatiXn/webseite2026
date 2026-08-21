// Berufsneutrale Server-Component: rendert eine vollständige Profession-Seite aus
// einer Profession-Config + der Content Engine. KEINE berufsspezifische Prosa —
// alle beruflichen Begriffe kommen aus `profession`.
//
// Datenquellen-Entscheidung: Das Template importiert die zentrale JOBS-Datenquelle
// und die professionBySlug-Registry selbst, damit die Route ultradünn bleibt
// (<ProfessionPageTemplate profession={...} />). Die Builder laufen genau einmal.
import Link from "next/link";
import Nav from "../../app/components/Nav";
import Footer from "../../app/components/Footer";
import JsonLd from "../../app/components/JsonLd";
import BreadcrumbsView from "../../app/components/BreadcrumbsView";
import FaqSection from "../../app/components/FaqSection";
import { JOBS } from "../../app/jobs/data";
import { jobPath } from "../../lib/slug";
import type { ProfessionContent } from "../../content/professions/types";
import { professionBySlug } from "../../content/professions";
import { matchJobsForProfession } from "../job-matching";
import { viableRoleCityPages } from "../../content/role-city-pages";
import { buildProfessionSchema } from "../schema";
import { buildProfessionInternalLinks } from "../internal-links";

// Generische Festanstellungs-Erklärung (Template-Chrome, kein berufsspezifischer Text).
const COMMITMENT = {
  title: "Direkt in Festanstellung",
  text: "PHE-Perm vermittelt Sie direkt an den Arbeitgeber – keine Zeitarbeit und keine Arbeitnehmerüberlassung. Ihren Arbeitsvertrag schließen Sie mit dem einstellenden Unternehmen. Wir begleiten Sie persönlich durch den gesamten Prozess; für Bewerber ist die Vermittlung kostenlos.",
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

export function ProfessionPageTemplate({ profession }: { profession: ProfessionContent }) {
  const p = profession;

  // Abschnittsüberschriften: Template-Chrome, aber beruflicher Begriff aus der Config.
  const headings = {
    specializations: `Welche ${p.shortName}-Fachrichtungen sind besonders gefragt?`,
    industries: `Wo arbeiten ${p.name}?`,
    requirements: "Was Arbeitgeber häufig suchen",
    requirementsIntro: "Nicht alle Punkte sind für jede Stelle zwingend – je nach Position wird das eine oder andere erwartet:",
    jobs: `Aktuelle ${p.name} Jobs`,
    process: `So läuft die Vermittlung für ${p.name} ab`,
    faq: `Häufige Fragen zu ${p.name} Jobs`,
  };

  // Beruf-x-Ort-Seiten dieses Berufs (leer, wenn der Beruf kein Ortsraster trägt).
  const cityLinks = viableRoleCityPages()
    .filter(rc => rc.role.hubPath === `/berufe/${p.slug}`)
    .map(rc => ({ href: `/berufe/${rc.role.slug}/${rc.city.slug}`, label: rc.city.name }));

  // Zentrales, strukturiertes Job-Matching (Builder läuft genau einmal).
  const matchResult = matchJobsForProfession(JOBS, p);
  const matches = matchResult.matches;
  const visibleJobs = matches.map(m => m.job);
  const hasMoreJobs = matchResult.totalMatched > matches.length;

  // Sichere interne Links (Breadcrumbs + Kernziele + Related) aus dem zentralen Builder.
  const links = buildProfessionInternalLinks({
    profession: p,
    professionRegistry: { professionBySlug },
    jobMatches: matches,
  });
  const breadcrumbItems = links.breadcrumbs.map(b => ({ name: b.label, href: b.href }));
  const hubLink = links.coreLinks.find(l => l.type === "parent");
  const jobsHref = links.coreLinks.find(l => l.type === "jobs")?.href ?? "/jobs";

  // Genau ein JSON-LD-Graph (CollectionPage, BreadcrumbList, FAQPage, ItemList) —
  // ItemList = exakt die sichtbaren Jobs in derselben Reihenfolge.
  const schema = buildProfessionSchema(p, visibleJobs);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={schema} />
      <Nav />
      <BreadcrumbsView items={breadcrumbItems} />

      {/* 2. HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 8px" }}>
        {p.hero.eyebrow && (
          <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            {p.hero.eyebrow}
          </p>
        )}
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18, textWrap: "balance" }}>
          {p.hero.headline}
        </h1>
        <p style={{ ...bodyStyle, fontSize: 18, color: "#586170", maxWidth: 720, marginBottom: 28 }}>
          {p.hero.intro}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={p.hero.primaryCta.href} className="pathswitch-cta pathswitch-cta--primary">{p.hero.primaryCta.label}</Link>
          <Link href={p.hero.secondaryCta.href} className="pathswitch-cta pathswitch-cta--secondary">{p.hero.secondaryCta.label}</Link>
        </div>
      </section>

      {/* 3. BERUFSBILD */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>{p.overview.title}</h2>
        {p.overview.paragraphs.map((para, i) => (
          <p key={i} style={{ ...bodyStyle, marginBottom: i < p.overview.paragraphs.length - 1 ? 14 : 0 }}>{para}</p>
        ))}
      </section>

      {/* 4. FACHRICHTUNGEN */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={h2Style}>{headings.specializations}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
            {p.specializations.map(f => (
              <div key={f.title} style={{ background: "#fff", border: "1px solid #e2e6ee", borderRadius: 16, padding: "24px 22px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", marginBottom: 12, lineHeight: 1.3 }}>{f.title}</h3>
                <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                  {f.focus.map(x => <li key={x} style={{ fontSize: 14, color: "#586170", lineHeight: 1.5 }}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EINSATZBEREICHE */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>{headings.industries}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 20 }}>
          {p.industries.map(ind => (
            <div key={ind.name} style={{ borderLeft: "3px solid #3b72b8", padding: "4px 0 4px 14px" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1d1d1f", marginBottom: 3 }}>{ind.name}</p>
              <p style={{ fontSize: 14, color: "#586170", lineHeight: 1.55 }}>{ind.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ANFORDERUNGEN */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={h2Style}>{headings.requirements}</h2>
          <p style={{ ...bodyStyle, fontSize: 15, color: "#586170", marginBottom: 20 }}>
            {headings.requirementsIntro}
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
            {p.requirements.map(req => {
              const text = req.hint ? `${req.label} ${req.hint}` : req.label;
              return (
                <li key={text} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5, color: "#3d3d3f", lineHeight: 1.5 }}>
                  <span aria-hidden="true" style={{ color: "#3b72b8", fontWeight: 800, flexShrink: 0 }}>✓</span>{text}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 7. ECHTE STELLEN */}
      <section id="stellen" style={{ ...sectionWrap, scrollMarginTop: 72 }}>
        <h2 style={h2Style}>{headings.jobs}</h2>
        {visibleJobs.length > 0 ? (
          <>
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {visibleJobs.map(job => (
                <Link key={job.id} href={jobPath(job)} style={{
                  display: "block", background: "#fff", border: "1px solid #e2e6ee",
                  borderRadius: 14, padding: "20px 22px", textDecoration: "none",
                }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 4 }}>{job.title}</p>
                  <p style={{ fontSize: 13.5, color: "#586170", marginBottom: 8 }}>{job.city} · {job.salary} · {job.type}</p>
                  <p style={{ fontSize: 14, color: "#3d3d3f", lineHeight: 1.6 }}>{teaser(job.description)}</p>
                  <span style={{ ...linkStyle, fontSize: 14, display: "inline-block", marginTop: 10 }}>Zur Stelle →</span>
                </Link>
              ))}
            </div>
            {hasMoreJobs && (
              <Link href={jobsHref} style={{ ...linkStyle, display: "inline-block", marginTop: 20 }}>
                Alle {p.name} Jobs ansehen →
              </Link>
            )}
          </>
        ) : (
          <div style={{ background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 14, padding: "24px 22px" }}>
            <p style={{ ...bodyStyle, fontSize: 15, marginBottom: 12 }}>
              Aktuell sind keine passenden {p.name}-Stellen ausgeschrieben. Schauen Sie in die
              gesamte Jobübersicht oder sprechen Sie uns für eine Initiativbewerbung an.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9 }}>
              <Link href={jobsHref} style={linkStyle}>Alle offenen Stellen ansehen</Link><br />
              <Link href="/kontakt" style={linkStyle}>Initiativ Kontakt aufnehmen</Link>
            </p>
          </div>
        )}
      </section>

      {/* 8. FESTANSTELLUNG STATT ZEITARBEIT */}
      <section style={{ background: "#0f2035", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 16 }}>{COMMITMENT.title}</h2>
          <p style={{ ...bodyStyle, color: "rgba(255,255,255,0.7)", maxWidth: 720 }}>
            {COMMITMENT.text}
          </p>
        </div>
      </section>

      {/* 9. BEWERBUNGSPROZESS */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>{headings.process}</h2>
        <ol style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {p.process.map((s, i) => (
            <li key={s.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 999, background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{i + 1}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 2 }}>{s.title}</p>
                <p style={{ fontSize: 14, color: "#586170", lineHeight: 1.6 }}>{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 10. BEWERBER-CTA */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...h2Style, marginBottom: 12 }}>{p.applicantCta.title}</h2>
          <p style={{ ...bodyStyle, fontSize: 16, color: "#586170", marginBottom: 28 }}>
            {p.applicantCta.text}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href={p.applicantCta.primaryCta.href} className="pathswitch-cta pathswitch-cta--primary">{p.applicantCta.primaryCta.label}</Link>
            {p.applicantCta.secondaryCta && (
              <Link href={p.applicantCta.secondaryCta.href} className="pathswitch-cta pathswitch-cta--secondary">{p.applicantCta.secondaryCta.label}</Link>
            )}
          </div>
        </div>
      </section>

      {/* 11. UNTERNEHMENSBEREICH (sekundär) */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ee", borderRadius: 16, padding: "28px 26px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 10 }}>
            {p.employerCta.title}
          </h2>
          <p style={{ ...bodyStyle, fontSize: 15, color: "#586170", marginBottom: 16 }}>
            {p.employerCta.text}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9 }}>
            <Link href={p.employerCta.primaryCta.href} style={linkStyle}>{p.employerCta.primaryCta.label}</Link>
            {p.employerCta.secondaryCta && (
              <>
                {"  ·  "}
                <Link href={p.employerCta.secondaryCta.href} style={linkStyle}>{p.employerCta.secondaryCta.label}</Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* 12. FAQ */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title={headings.faq} items={[...p.faq]} />
      </div>

      {/* 13. Stellen nach Stadt – Hub-zu-Spoke-Verlinkung der Beruf-x-Ort-Seiten.
          Ohne diesen Block wären die Spokes nur über die Sitemap erreichbar;
          Google bewertet verwaiste Seiten deutlich schwächer. Gerendert wird
          nur, wenn für diesen Beruf überhaupt Ortsseiten bestehen. */}
      {cityLinks.length > 0 && (
        <section style={sectionWrap}>
          <h2 style={h2Style}>{p.name} Jobs nach Stadt</h2>
          <p style={{ ...bodyStyle, marginBottom: 18 }}>
            Alle offenen Stellen im Umkreis einer Stadt auf einen Blick – mit Entfernungsangabe
            und der Gehaltsspanne der tatsächlich ausgeschriebenen Stellen.
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 12 }}>
            {cityLinks.map(c => (
              <li key={c.href}>
                <Link href={c.href} style={linkStyle}>{p.shortName} Jobs {c.label} →</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Verwandte Berufe – nur wenn gültige Related-Links existieren (keine leere Sektion) */}
      {links.relatedProfessionLinks.length > 0 && (
        <section style={sectionWrap}>
          <h2 style={h2Style}>Verwandte Berufe</h2>
          <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 12 }}>
            {links.relatedProfessionLinks.map(rel => (
              <li key={rel.href}>
                <Link href={rel.href} style={linkStyle}>{rel.label} →</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 14. Zurück zum Hub */}
      {hubLink && (
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 24px 48px" }}>
          <Link href={hubLink.href} style={linkStyle}>← {hubLink.label}</Link>
        </section>
      )}

      <Footer />
    </div>
  );
}
