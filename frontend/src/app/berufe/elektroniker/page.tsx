import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import Breadcrumbs from "../../components/Breadcrumbs";
import FaqSection from "../../components/FaqSection";
import { JOBS } from "../../jobs/data";
import { jobPath } from "../../../lib/slug";

const BASE = "https://www.phe-perm.de";

export const metadata: Metadata = {
  // absolute umgeht das globale Template "%s | PHE-Perm Engineering"
  title: { absolute: "Elektroniker Jobs in Festanstellung | PHE-Perm" },
  description:
    "Finde passende Elektroniker Jobs in Betriebstechnik, Automatisierung, Instandhaltung, Service und Industrie – persönlich begleitet und direkt in Festanstellung.",
  alternates: { canonical: "/berufe/elektroniker" },
  openGraph: {
    title: "Elektroniker Jobs in Festanstellung | PHE-Perm Engineering",
    description:
      "Passende Elektroniker Jobs in Betriebstechnik, Automatisierung, Instandhaltung und Service – direkt in Festanstellung, persönlich begleitet.",
    url: `${BASE}/berufe/elektroniker`,
    type: "website",
  },
};

// Strukturiertes Matching über die Job-Kategorie (keine unsaubere Volltextsuche).
const ELEKTRONIKER_JOBS = JOBS.filter(j => j.category === "elektro");
const FEATURED = ELEKTRONIKER_JOBS.slice(0, 6);

// Eine Quelle für sichtbares FAQ und FAQPage-Schema.
const ELEKTRONIKER_FAQ = [
  { q: "Welche Elektroniker Jobs vermittelt PHE-Perm?", a: "Wir vermitteln Positionen für Elektroniker aus Betriebstechnik, Automatisierungstechnik sowie Energie- und Gebäudetechnik und für Betriebs- und Industrieelektriker – in Instandhaltung, Service und Produktion, ausschließlich in Festanstellung." },
  { q: "Vermittelt PHE-Perm Elektroniker direkt in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung. Ihren Arbeitsvertrag schließen Sie mit dem Unternehmen." },
  { q: "Kostet die Vermittlung Bewerber etwas?", a: "Nein. Für Bewerber ist die Vermittlung kostenlos." },
  { q: "Welche Ausbildung wird für Elektroniker-Stellen benötigt?", a: "In der Regel eine abgeschlossene elektrotechnische Ausbildung, etwa als Elektroniker für Betriebstechnik, Automatisierungstechnik oder Energie- und Gebäudetechnik. Die konkreten Anforderungen hängen von der jeweiligen Stelle ab." },
  { q: "Gibt es Jobs für Elektroniker in der Instandhaltung?", a: "Ja. Ein Teil der Positionen liegt in Wartung und Instandhaltung von Maschinen, Anlagen und elektrischen Betriebsmitteln. Aktuelle Stellen finden Sie im Stellenbereich dieser Seite." },
  { q: "Vermittelt PHE-Perm auch Servicestellen für Elektroniker?", a: "Ja. Neben Instandhaltung und Produktion vermitteln wir auch Servicepositionen mit elektrotechnischem Schwerpunkt, teils mit Kundeneinsatz vor Ort." },
  { q: "Kann ich mich ohne Anschreiben bewerben?", a: "Ja. Für eine erste Kontaktaufnahme genügen Ihr Name, Ihre Erreichbarkeit und die gewünschte Richtung. Ein Anschreiben ist nicht erforderlich." },
  { q: "Was passiert nach meiner Bewerbung?", a: "Wir melden uns persönlich, klären Ihre Qualifikationen und Wünsche und stimmen passende Positionen mit Ihnen ab, bevor wir Sie einem Unternehmen vorstellen." },
  { q: "Gibt es auch Stellen außerhalb von Düsseldorf?", a: "Ja. PHE-Perm vermittelt deutschlandweit; den Standort der einzelnen Stelle finden Sie jeweils in der Stellenbeschreibung." },
  { q: "Können Unternehmen über PHE-Perm Elektroniker suchen?", a: "Ja. Unternehmen können ihren Bedarf über unsere technische Personalvermittlung anfragen; wir übernehmen die Suche und die persönliche Vorauswahl." },
];

const FACHRICHTUNGEN = [
  { t: "Elektroniker für Betriebstechnik", p: ["Produktionsanlagen", "Energieversorgung", "Wartung und Instandhaltung", "Fehlersuche", "elektrische Betriebsmittel"] },
  { t: "Elektroniker für Automatisierungstechnik", p: ["automatisierte Anlagen", "Sensorik", "Steuerungs- und Regelungstechnik", "SPS-nahe Tätigkeiten", "Inbetriebnahme und Fehlersuche"] },
  { t: "Elektroniker für Energie- und Gebäudetechnik", p: ["elektrische Gebäudeanlagen", "Verteilungen", "Beleuchtung", "Sicherheits- und Gebäudetechnik", "Wartung und Installation"] },
  { t: "Industrie- und Betriebselektriker", p: ["operative Instandhaltung", "Maschinen und Anlagen", "Störungsbeseitigung", "Prüfungen", "Produktionsunterstützung"] },
];

const EINSATZBEREICHE = [
  ["Maschinen- und Anlagenbau", "Aufbau, Verdrahtung und Inbetriebnahme von Maschinen und Anlagen."],
  ["Produktion", "Betrieb und Instandhaltung elektrischer Betriebsmittel in der Fertigung."],
  ["Automatisierung", "Steuerungs- und Regelungstechnik automatisierter Anlagen."],
  ["Logistiktechnik", "Wartung von Förder-, Sortier- und Verpackungsanlagen."],
  ["Energie- und Gebäudetechnik", "Verteilungen, Installationen und Sicherheitstechnik in Gebäuden."],
  ["Kälte- und Klimatechnik", "Elektrik und Steuerung von Kälte-, Klima- und Lüftungsanlagen."],
  ["Technischer Service", "Fehlersuche, Reparatur und Inbetriebnahme beim Kunden vor Ort."],
  ["Instandhaltung", "Vorbeugende Wartung und Störungsbeseitigung an Anlagen."],
  ["Schaltanlagenbau", "Aufbau und Verdrahtung von Schaltschränken und -anlagen."],
];

const ANFORDERUNGEN = [
  "abgeschlossene elektrotechnische Ausbildung",
  "Berufserfahrung je nach Position",
  "Kenntnisse in Wartung, Instandhaltung oder Montage",
  "sicheres Lesen von Schaltplänen",
  "strukturierte Fehlersuche",
  "Sicherheitsbewusstsein im Umgang mit elektrischen Anlagen",
  "selbstständige und sorgfältige Arbeitsweise",
  "Teamfähigkeit",
  "Führerschein, falls die Position Fahrten erfordert",
  "Reisebereitschaft nur bei passenden Servicestellen",
  "Deutschkenntnisse abhängig vom Einsatzbereich",
];

const PROZESS = [
  { t: "Interesse oder Bewerbung übermitteln", d: "Per Formular, E-Mail oder WhatsApp – ohne Anschreiben." },
  { t: "Persönliches Gespräch", d: "Wir sprechen über Ihre Erfahrung, Ihren Wunschstandort und Ihre Ziele." },
  { t: "Qualifikation und Wünsche klären", d: "Wir ordnen Ihr Profil den passenden Fachrichtungen zu." },
  { t: "Passende Positionen abstimmen", d: "Sie entscheiden, welche Stellen für Sie in Frage kommen." },
  { t: "Vorstellung beim Unternehmen", d: "Wir stellen den Kontakt her und bereiten das Gespräch vor." },
  { t: "Begleitung bis zur Entscheidung", d: "Wir begleiten Sie bis zur Vertragsentscheidung." },
];

function teaser(s: string): string {
  if (s.length <= 150) return s;
  const cut = s.slice(0, 150);
  return `${cut.slice(0, cut.lastIndexOf(" "))} …`;
}

const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };
const sectionWrap: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "56px 24px" };
const h2Style: React.CSSProperties = { fontSize: "clamp(23px,3vw,32px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 };
const bodyStyle: React.CSSProperties = { fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 };

export default function ElektronikerPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE}/berufe/elektroniker`,
    "url": `${BASE}/berufe/elektroniker`,
    "name": "Elektroniker Jobs in Festanstellung",
    "description": "Berufsbild Elektroniker und aktuelle Elektroniker-Stellen in Festanstellung, vermittelt durch PHE-Perm.",
    "inLanguage": "de-DE",
    "isPartOf": { "@type": "WebSite", "url": BASE },
    "publisher": { "@id": `${BASE}/#organization` },
    ...(FEATURED.length > 0 ? {
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": FEATURED.map((j, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `${BASE}${jobPath(j)}`,
          "name": j.title,
        })),
      },
    } : {}),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ELEKTRONIKER_FAQ.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={collectionSchema} />
      <JsonLd data={faqSchema} />
      <Nav />
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Berufe", href: "/berufe" },
        { name: "Elektroniker", href: "/berufe/elektroniker" },
      ]} />

      {/* 2. HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 8px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
          Berufsbild · Elektrotechnik
        </p>
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18, textWrap: "balance" }}>
          Elektroniker Jobs in Festanstellung
        </h1>
        <p style={{ ...bodyStyle, fontSize: 18, color: "#586170", maxWidth: 720, marginBottom: 28 }}>
          Elektroniker werden in Industrie, Service, Instandhaltung, Automatisierung und Gebäudetechnik
          gebraucht. PHE-Perm vermittelt passende Positionen direkt in Festanstellung und begleitet
          Bewerber persönlich vom ersten Gespräch bis zur Vertragsentscheidung.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="#stellen" className="pathswitch-cta pathswitch-cta--primary">Aktuelle Elektroniker Jobs ansehen</Link>
          <Link href="/kontakt" className="pathswitch-cta pathswitch-cta--secondary">Persönlich beraten lassen</Link>
        </div>
      </section>

      {/* 3. WAS MACHT EIN ELEKTRONIKER */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>Was macht ein Elektroniker?</h2>
        <p style={{ ...bodyStyle, marginBottom: 14 }}>
          Elektroniker installieren, warten und reparieren elektrische Anlagen und Betriebsmittel. Sie
          suchen Störungen strukturiert ein, setzen Anlagen instand, prüfen sie nach den geltenden
          Vorschriften und dokumentieren ihre Arbeit. Je nach Einsatz arbeiten sie an Maschinen,
          Produktionsanlagen, Schaltschränken oder an der Gebäudetechnik – im Team mit Produktion,
          Service oder Projektleitung.
        </p>
        <p style={bodyStyle}>
          Nicht jeder Elektroniker hat dieselben Aufgaben: In der Betriebstechnik steht die Instandhaltung
          von Produktionsanlagen im Vordergrund, in der Automatisierungstechnik die Steuerungstechnik und
          Inbetriebnahme, in der Energie- und Gebäudetechnik die Installation gebäudetechnischer Anlagen.
          Die konkreten Schwerpunkte hängen von Fachrichtung und Stelle ab.
        </p>
      </section>

      {/* 4. FACHRICHTUNGEN */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={h2Style}>Welche Elektroniker-Fachrichtungen sind besonders gefragt?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
            {FACHRICHTUNGEN.map(f => (
              <div key={f.t} style={{ background: "#fff", border: "1px solid #e2e6ee", borderRadius: 16, padding: "24px 22px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", marginBottom: 12, lineHeight: 1.3 }}>{f.t}</h3>
                <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                  {f.p.map(x => <li key={x} style={{ fontSize: 14, color: "#586170", lineHeight: 1.5 }}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EINSATZBEREICHE */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>Wo arbeiten Elektroniker?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 20 }}>
          {EINSATZBEREICHE.map(([t, d]) => (
            <div key={t} style={{ borderLeft: "3px solid #3b72b8", padding: "4px 0 4px 14px" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1d1d1f", marginBottom: 3 }}>{t}</p>
              <p style={{ fontSize: 14, color: "#586170", lineHeight: 1.55 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ANFORDERUNGEN */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={h2Style}>Was Arbeitgeber bei Elektronikern häufig suchen</h2>
          <p style={{ ...bodyStyle, fontSize: 15, color: "#586170", marginBottom: 20 }}>
            Nicht alle Punkte sind für jede Stelle zwingend – je nach Position wird das eine oder andere
            erwartet:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
            {ANFORDERUNGEN.map(a => (
              <li key={a} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5, color: "#3d3d3f", lineHeight: 1.5 }}>
                <span aria-hidden="true" style={{ color: "#3b72b8", fontWeight: 800, flexShrink: 0 }}>✓</span>{a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. ECHTE STELLEN */}
      <section id="stellen" style={{ ...sectionWrap, scrollMarginTop: 72 }}>
        <h2 style={h2Style}>Aktuelle Elektroniker Jobs</h2>
        {FEATURED.length > 0 ? (
          <>
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {FEATURED.map(job => (
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
            {ELEKTRONIKER_JOBS.length > FEATURED.length && (
              <Link href="/jobs" style={{ ...linkStyle, display: "inline-block", marginTop: 20 }}>
                Alle Elektroniker Jobs ansehen →
              </Link>
            )}
          </>
        ) : (
          <div style={{ background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 14, padding: "24px 22px" }}>
            <p style={{ ...bodyStyle, fontSize: 15, marginBottom: 12 }}>
              Aktuell sind keine passenden Elektroniker-Stellen ausgeschrieben. Schauen Sie in die
              gesamte Jobübersicht oder sprechen Sie uns für eine Initiativbewerbung an.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9 }}>
              <Link href="/jobs" style={linkStyle}>Alle offenen Stellen ansehen</Link><br />
              <Link href="/kontakt" style={linkStyle}>Initiativ Kontakt aufnehmen</Link>
            </p>
          </div>
        )}
      </section>

      {/* 8. FESTANSTELLUNG STATT ZEITARBEIT */}
      <section style={{ background: "#0f2035", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 16 }}>Direkt in Festanstellung</h2>
          <p style={{ ...bodyStyle, color: "rgba(255,255,255,0.7)", maxWidth: 720 }}>
            PHE-Perm vermittelt Sie direkt an den Arbeitgeber – keine Zeitarbeit und keine
            Arbeitnehmerüberlassung. Ihren Arbeitsvertrag schließen Sie mit dem einstellenden
            Unternehmen. Wir begleiten Sie persönlich durch den gesamten Prozess; für Bewerber ist die
            Vermittlung kostenlos.
          </p>
        </div>
      </section>

      {/* 9. BEWERBUNGSPROZESS */}
      <section style={sectionWrap}>
        <h2 style={h2Style}>So läuft die Vermittlung für Elektroniker ab</h2>
        <ol style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {PROZESS.map((s, i) => (
            <li key={s.t} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 999, background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{i + 1}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 2 }}>{s.t}</p>
                <p style={{ fontSize: 14, color: "#586170", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 10. BEWERBER-CTA */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...h2Style, marginBottom: 12 }}>Du suchst eine neue Stelle als Elektroniker?</h2>
          <p style={{ ...bodyStyle, fontSize: 16, color: "#586170", marginBottom: 28 }}>
            Sieh dir die aktuellen Positionen an oder sprich direkt mit uns über deine Erfahrung, deinen
            gewünschten Arbeitsort und deine beruflichen Ziele.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="#stellen" className="pathswitch-cta pathswitch-cta--primary">Elektroniker Jobs ansehen</Link>
            <Link href="/lebenslauf-erstellen" className="pathswitch-cta pathswitch-cta--secondary">Lebenslauf kostenlos erstellen</Link>
          </div>
        </div>
      </section>

      {/* 11. UNTERNEHMENSBEREICH (sekundär) */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e6ee", borderRadius: 16, padding: "28px 26px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Sie suchen Elektroniker für Ihr Unternehmen?
          </h2>
          <p style={{ ...bodyStyle, fontSize: 15, color: "#586170", marginBottom: 16 }}>
            PHE-Perm unterstützt Industrieunternehmen bei der Suche und persönlichen Vorqualifizierung
            technischer Fachkräfte für Festanstellungen.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9 }}>
            <Link href="/technische-personalvermittlung" style={linkStyle}>Elektroniker anfragen</Link>
            {"  ·  "}
            <Link href="/kontakt" style={linkStyle}>Kontakt aufnehmen</Link>
          </p>
        </div>
      </section>

      {/* 12. FAQ */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title="Häufige Fragen zu Elektroniker Jobs" items={ELEKTRONIKER_FAQ} />
      </div>

      {/* Zurück zum Hub */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 24px 48px" }}>
        <Link href="/berufe" style={linkStyle}>← Alle technischen Berufsfelder</Link>
      </section>

      <Footer />
    </div>
  );
}
