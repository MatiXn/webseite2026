import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import Breadcrumbs from "../../components/Breadcrumbs";
import FaqSection from "../../components/FaqSection";

const BASE = "https://www.phe-perm.de";

export const metadata: Metadata = {
  title: { absolute: "Personalvermittlung Düsseldorf | Technische Fachkräfte | PHE-Perm" },
  description:
    "PHE-Perm unterstützt Unternehmen in Düsseldorf bei der Besetzung technischer Positionen durch persönliche Direktvermittlung. Qualität statt Massenvermittlung.",
  alternates: { canonical: "/personalvermittlung/duesseldorf" },
  openGraph: {
    title: "Personalvermittlung Düsseldorf für technische Fachkräfte | PHE-Perm",
    description:
      "Persönliche Direktvermittlung technischer Fachkräfte für Unternehmen in Düsseldorf – Qualität statt Massenvermittlung.",
    url: `${BASE}/personalvermittlung/duesseldorf`,
    type: "website",
  },
};

// Eine Quelle für sichtbares FAQ und FAQPage-Schema.
const FAQ = [
  { q: "Warum PHE-Perm statt einer großen Personalberatung?", a: "Wir sind auf technische Berufe spezialisiert und arbeiten persönlich statt über anonyme Prozesse. Wir übernehmen nur Positionen, bei denen wir mit unserer Spezialisierung einen echten Mehrwert liefern können." },
  { q: "Welche Positionen vermittelt PHE-Perm?", a: "Technische Fachkräfte aus Elektrotechnik, Automatisierung und SPS, Mechatronik, Servicetechnik, Kälte- und Klimatechnik, TGA sowie Engineering – ausschließlich in Festanstellung." },
  { q: "Arbeitet PHE-Perm auch außerhalb Düsseldorfs?", a: "Ja. Unser Sitz ist in Düsseldorf; wir vermitteln jedoch deutschlandweit. Für Unternehmen in Düsseldorf und im Rheinland sind wir persönlich vor Ort erreichbar." },
  { q: "Wie läuft die Zusammenarbeit ab?", a: "In sechs Schritten: Analyse, Suchprofil, Active Sourcing, persönliche Qualifizierung, Vorstellung und Begleitung bis zur Einstellung." },
  { q: "Wann beginnt die Personalsuche?", a: "Nachdem wir die Position und Ihr Unternehmen im Detail verstanden haben. Erst wenn das Suchprofil steht, beginnt die aktive Suche." },
  { q: "Was kostet die Zusammenarbeit?", a: "Die Konditionen werden transparent vor Beginn der Zusammenarbeit vereinbart." },
];

const GRUNDSAETZE = [
  "Der Bewerber ist kein Produkt.",
  "Wir stellen nur passende Positionen vor.",
  "Qualität vor Quantität.",
  "Ehrliche Kommunikation.",
  "Wir übernehmen nur Positionen, bei denen wir echten Mehrwert liefern können.",
  "Wir lernen Unternehmen langfristig kennen.",
];

const SPEZIALISIERUNG: { name: string; href: string }[] = [
  { name: "Elektrotechnik", href: "/berufe/elektroniker" },
  { name: "Automatisierung", href: "/berufe" },
  { name: "SPS", href: "/berufe" },
  { name: "Mechatronik", href: "/berufe" },
  { name: "Servicetechnik", href: "/berufe" },
  { name: "Kälte", href: "/berufe" },
  { name: "TGA", href: "/berufe" },
  { name: "Engineering", href: "/berufe" },
];

const ABLAUF = [
  { t: "Analyse", d: "Wir verstehen Position, Team und Anforderungen im Detail." },
  { t: "Suchprofil", d: "Gemeinsam definieren wir, wen wir wirklich suchen." },
  { t: "Active Sourcing", d: "Wir sprechen passende Fachkräfte gezielt und direkt an." },
  { t: "Persönliche Qualifizierung", d: "Wir prüfen Eignung, Motivation und Rahmenbedingungen." },
  { t: "Vorstellung", d: "Sie erhalten eine kleine Auswahl wirklich passender Profile." },
  { t: "Begleitung bis Einstellung", d: "Wir begleiten den Prozess bis zur Unterschrift." },
];

const BRANCHEN = ["Industrie", "Maschinenbau", "Automatisierung", "Anlagenbau", "Service", "Gebäudetechnik", "Produktion"];

const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };
const wrap: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "56px 24px" };
const h2: React.CSSProperties = { fontSize: "clamp(23px,3vw,32px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 };
const body: React.CSSProperties = { fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 };

export default function PersonalvermittlungDuesseldorfPage() {
  // Gleiche @id wie das globale Org-Schema (layout.tsx): Google merged beide
  // Knoten zu EINER Entität und ergänzt nur den lokalen Bezug (areaServed
  // Düsseldorf) – kein konkurrierendes zweites Local-Business.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE}/#organization`,
    "name": "PHE-Perm Engineering Ingenieure & Techniker GmbH",
    "url": `${BASE}/personalvermittlung/duesseldorf`,
    "telephone": "+4921115863100",
    "email": "info@phe-perm.de",
    "image": `${BASE}/phe-logo.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Hüttenstraße 30",
      "addressLocality": "Düsseldorf",
      "postalCode": "40215",
      "addressCountry": "DE",
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 51.2217, "longitude": 6.7762 },
    "areaServed": { "@type": "City", "name": "Düsseldorf" },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00",
    },
    "description": "Persönliche Direktvermittlung technischer Fachkräfte für Unternehmen in Düsseldorf.",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Personalvermittlung Düsseldorf – technische Fachkräfte",
    "serviceType": "Technische Personalvermittlung",
    "areaServed": { "@type": "City", "name": "Düsseldorf" },
    "provider": { "@id": `${BASE}/#organization` },
    "description": "Direktvermittlung technischer Fachkräfte in Festanstellung für Unternehmen in Düsseldorf – persönlich, spezialisiert, Qualität statt Massenvermittlung.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <Nav />
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Technische Personalvermittlung", href: "/technische-personalvermittlung" },
        { name: "Personalvermittlung Düsseldorf", href: "/personalvermittlung/duesseldorf" },
      ]} />

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 8px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
          Für Unternehmen · Düsseldorf
        </p>
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 20, textWrap: "balance" }}>
          Personalvermittlung Düsseldorf für technische Fachkräfte
        </h1>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", lineHeight: 1.4, marginBottom: 18, maxWidth: 720 }}>
          Gute Personalvermittlung beginnt nicht mit einer Stellenanzeige. Sie beginnt mit dem
          Verständnis für den Menschen dahinter.
        </p>
        <div style={{ ...body, color: "#586170", maxWidth: 680, marginBottom: 28 }}>
          <p style={{ marginBottom: 12 }}>
            Viele Vermittlungen scheitern nicht an fehlenden Bewerbern, sondern daran, dass Unternehmen
            und Kandidaten nie wirklich zueinander passen.
          </p>
          <p style={{ marginBottom: 12 }}>Deshalb lernen wir zuerst Menschen und Unternehmen kennen.</p>
          <p>Erst danach beginnt die Vermittlung.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/technische-personalvermittlung" className="pathswitch-cta pathswitch-cta--primary">Technische Fachkraft finden</Link>
          <Link href="/kontakt" className="pathswitch-cta pathswitch-cta--secondary">Unverbindliches Erstgespräch</Link>
        </div>
      </section>

      {/* WARUM UNTERNEHMEN MIT UNS ARBEITEN */}
      <section style={wrap}>
        <h2 style={h2}>Warum Unternehmen mit uns arbeiten</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {["Wir hören zuerst zu.", "Wir verstehen die Position.", "Wir verstehen den Kandidaten.", "Erst dann stellen wir jemanden vor."].map(t => (
            <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", ...body }}>
              <span aria-hidden="true" style={{ color: "#3b72b8", fontWeight: 800, flexShrink: 0 }}>—</span>{t}
            </li>
          ))}
        </ul>
      </section>

      {/* WARUM WIR ANDERS ARBEITEN */}
      <section style={{ background: "#f5f7fa", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={h2}>Warum wir anders arbeiten</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
            {GRUNDSAETZE.map(g => (
              <li key={g} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", border: "1px solid #e2e6ee", borderRadius: 12, padding: "16px 18px", fontSize: 15.5, color: "#1d1d1f", lineHeight: 1.5 }}>
                <span aria-hidden="true" style={{ color: "#1f7a4d", fontWeight: 800, flexShrink: 0 }}>✓</span>{g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* UNSERE SPEZIALISIERUNG */}
      <section style={wrap}>
        <h2 style={h2}>Unsere Spezialisierung</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {SPEZIALISIERUNG.map(s => (
            <Link key={s.name} href={s.href} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
              background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 12,
              padding: "18px 18px", textDecoration: "none",
              fontSize: 16, fontWeight: 700, color: "#1e3a5f",
            }}>
              {s.name}<span aria-hidden="true" style={{ color: "#3b72b8" }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SO LÄUFT UNSERE ZUSAMMENARBEIT */}
      <section style={{ background: "#0f2035", padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2, color: "#fff" }}>So läuft unsere Zusammenarbeit</h2>
          <ol style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {ABLAUF.map((s, i) => (
              <li key={s.t} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 20px" }}>
                <div aria-hidden="true" style={{ fontSize: 24, fontWeight: 800, color: "rgba(126,179,240,0.6)", marginBottom: 8 }}>{i + 1}</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.t}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FÜR WELCHE UNTERNEHMEN */}
      <section style={wrap}>
        <h2 style={h2}>Für welche Unternehmen wir arbeiten</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {BRANCHEN.map(b => (
            <span key={b} style={{ fontSize: 15, fontWeight: 600, background: "#eef4fb", color: "#1e3a5f", borderRadius: 999, padding: "8px 18px" }}>{b}</span>
          ))}
        </div>
      </section>

      {/* WANN WIR AUCH NEIN SAGEN */}
      <section style={{ background: "#f5f5f7", padding: "56px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={h2}>Wann wir auch Nein sagen</h2>
          <p style={{ ...body, marginBottom: 14 }}>Nicht jede Vakanz passt zu unserer Spezialisierung.</p>
          <p style={{ ...body, marginBottom: 14 }}>
            Wenn wir überzeugt sind, dass wir eine Position nicht mit der Qualität besetzen können, die
            wir selbst erwarten, lehnen wir den Auftrag lieber ab.
          </p>
          <p style={{ ...body, fontWeight: 700, color: "#1d1d1f" }}>
            Denn eine ehrliche Absage ist besser als falsche Versprechen.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title="Häufige Fragen zur Personalvermittlung in Düsseldorf" items={FAQ} />
      </div>

      {/* FINAL CTA */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ ...h2, marginBottom: 24 }}>Lassen Sie uns über Ihre Vakanz sprechen.</h2>
        <Link href="/kontakt" className="pathswitch-cta pathswitch-cta--primary">Erstgespräch vereinbaren</Link>
        <p style={{ fontSize: 15, lineHeight: 1.9, marginTop: 28, color: "#586170" }}>
          <Link href="/technische-personalvermittlung" style={linkStyle}>Technische Personalvermittlung</Link>
          {"  ·  "}
          <Link href="/jobs" style={linkStyle}>Offene Stellen</Link>
          {"  ·  "}
          <Link href="/berufe" style={linkStyle}>Technische Berufe</Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}
