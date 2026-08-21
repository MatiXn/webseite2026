import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import Breadcrumbs from "../components/Breadcrumbs";
import FaqSection from "../components/FaqSection";
import { JOBS } from "../jobs/data";

const BASE = "https://www.phe-perm.de";

export const metadata: Metadata = {
  title: "Technische Berufe und Jobs",
  description:
    "Entdecken Sie technische Berufe und offene Stellen in Elektrotechnik, Automatisierung, Servicetechnik, Mechatronik, Kältetechnik, TGA und Engineering.",
  alternates: { canonical: "/berufe" },
  openGraph: {
    title: "Technische Berufe und Jobs | PHE-Perm Engineering",
    description:
      "Technische Berufsfelder und offene Stellen: Elektrotechnik, Automatisierung, Servicetechnik, Mechatronik, Kältetechnik, TGA und Engineering.",
    url: `${BASE}/berufe`,
    type: "website",
  },
};

// Berufsfelder — sachliche Beschreibungen, keine Zahlen/Marktbehauptungen.
// `match` dient nur der serverseitigen Prüfung, ob real passende Stellen existieren.
type Berufsfeld = {
  name: string;
  einordnung: string;
  aufgaben: string;
  stellen: string;
  match: string[];
  detailHref?: string; // gesetzt, sobald eine Berufsdetailseite existiert
};

const BERUFSFELDER: Berufsfeld[] = [
  {
    name: "Elektroniker",
    einordnung: "Fachkräfte der Elektrotechnik für Installation, Instandhaltung und Betrieb elektrischer Anlagen in Produktion und Industrie.",
    aufgaben: "Schaltschrankbau und Verdrahtung, Störungsanalyse, Wartung und Prüfung elektrischer Betriebsmittel.",
    stellen: "Elektroniker für Betriebstechnik, Betriebselektriker, Elektromonteur",
    match: ["elektroniker", "elektromonteur", "betriebselektriker", "elektro"],
    detailHref: "/berufe/elektroniker",
  },
  {
    name: "Elektroniker für Betriebstechnik",
    einordnung: "Elektroniker für die Instandhaltung und den Betrieb industrieller Anlagen und Produktionsmaschinen.",
    aufgaben: "Instandhaltung und Störungsbeseitigung, Schaltschrankbau, Energieversorgung und Wartung elektrischer Betriebsmittel.",
    stellen: "Elektroniker für Betriebstechnik, Betriebselektroniker, Betriebselektriker",
    match: ["betriebstechnik", "betriebselektroniker", "betriebselektriker"],
    detailHref: "/berufe/elektroniker-betriebstechnik",
  },
  {
    name: "Elektroniker Energie- und Gebäudetechnik",
    einordnung: "Fachkräfte für die elektrische Gebäudetechnik: Gebäudeautomation, KNX/EIB, Energieverteilung und MSR im Gebäude.",
    aufgaben: "Installation und Inbetriebnahme von KNX/EIB und Gebäudeautomation, Energieverteilung, MSR- und Regelungstechnik.",
    stellen: "Elektroniker Energie- und Gebäudetechnik, Gebäudeautomation, MSR-Technik",
    match: ["gebäudetechnik", "gebäudeautomation", "knx"],
    detailHref: "/berufe/elektroniker-energie-gebaeudetechnik",
  },
  {
    name: "Servicetechniker",
    einordnung: "Techniker im Kundendienst für Wartung, Instandhaltung und Inbetriebnahme technischer Anlagen beim Kunden vor Ort.",
    aufgaben: "Fehlerdiagnose, Reparatur, Wartung und Inbetriebnahme; Dokumentation und Einweisung vor Ort.",
    stellen: "Servicetechniker, Kundendiensttechniker, Inbetriebnahmetechniker",
    match: ["servicetechniker"],
    detailHref: "/berufe/servicetechniker",
  },
  {
    name: "Servicetechniker Elektrotechnik",
    einordnung: "Elektrofachkräfte im technischen Außendienst: Service an elektrischen Anlagen beim Kunden statt Instandhaltung im eigenen Werk.",
    aufgaben: "Wartung und Störungsdiagnose vor Ort, Inbetriebnahme, Prüfungen nach DGUV Vorschrift 3, Einweisung des Kunden.",
    stellen: "Servicetechniker Elektrotechnik, Elektroniker als Servicetechniker, Servicetechniker Photovoltaik",
    match: ["servicetechniker elektro", "photovoltaik", "außendienst"],
    detailHref: "/berufe/servicetechniker-elektrotechnik",
  },
  {
    name: "Inbetriebnehmer & Montagetechniker",
    einordnung: "Techniker, die neue Anlagen aufbauen, prüfen und an den Betreiber übergeben — Projektarbeit statt laufender Instandhaltung.",
    aufgaben: "Montage und Verdrahtung nach Plan, Funktionsprüfung und Probelauf, Abnahme mit dem Kunden, Einweisung des Bedienpersonals.",
    stellen: "Inbetriebnehmer, Inbetriebnahmetechniker, Montagetechniker",
    match: ["inbetriebnahme", "montage"],
    detailHref: "/berufe/inbetriebnehmer",
  },
  {
    name: "SPS-Programmierer & Automatisierungstechniker",
    einordnung: "Spezialisten für Steuerungs- und Automatisierungstechnik im Maschinenbau und in der Produktion.",
    aufgaben: "Programmierung und Inbetriebnahme von SPS-Steuerungen, Anpassung von Steuerungsprogrammen, Anlagenoptimierung.",
    stellen: "SPS-Programmierer, Automatisierungstechniker, Steuerungstechniker, Inbetriebnehmer",
    match: ["sps", "automatisierung", "steuerung"],
    detailHref: "/berufe/sps-automatisierung",
  },
  {
    name: "Mechatroniker",
    einordnung: "Fachkräfte an der Schnittstelle von Mechanik, Elektronik und Steuerungstechnik.",
    aufgaben: "Montage, Wartung und Instandhaltung mechatronischer Systeme und Produktionsanlagen.",
    stellen: "Mechatroniker, Industriemechaniker, Instandhalter",
    match: ["mechatroniker", "industriemechaniker"],
    detailHref: "/berufe/mechatroniker",
  },
  {
    name: "Kälte- & Klimatechniker",
    einordnung: "Fachkräfte für Kälte-, Klima- und Lüftungstechnik in Industrie und Gebäudetechnik.",
    aufgaben: "Installation, Wartung und Instandhaltung von Kälte- und Klimaanlagen; Störungsbeseitigung im Kundendienst.",
    stellen: "Kältetechniker, Kältemechatroniker, Servicetechniker Kältetechnik",
    match: ["kälte", "klima"],
    detailHref: "/berufe/kaeltetechniker",
  },
  {
    name: "TGA- & SHK-Fachkräfte",
    einordnung: "Fachkräfte der technischen Gebäudeausrüstung sowie der Sanitär-, Heizungs- und Klimatechnik.",
    aufgaben: "Installation und Wartung gebäudetechnischer Anlagen, MSR- und Gebäudeautomation, Anlagenbau.",
    stellen: "Anlagenmechaniker SHK, MSR-Techniker, Fachkraft Gebäudeautomation, Projektleiter TGA",
    match: ["shk", "anlagenmechaniker", "msr", "gebäudeautomation", "tga"],
  },
  {
    name: "Ingenieure & Projektleiter",
    einordnung: "Technische Fach- und Führungskräfte für Planung, Konstruktion und Projektsteuerung.",
    aufgaben: "Planung und Auslegung technischer Systeme, Projektkoordination sowie Steuerung von Gewerken und Teams.",
    stellen: "Projektleiter, Elektroplaner, Elektrokonstrukteur, Ingenieur Elektrotechnik/Maschinenbau",
    match: ["ingenieur", "projektleiter", "konstrukteur", "planer"],
  },
  {
    name: "Technische Softwareentwickler",
    einordnung: "Ergänzender Bereich: Entwickler mit technischem Bezug an der Schnittstelle von Elektrotechnik, Automatisierung und Software.",
    aufgaben: "Entwicklung von Embedded- und Steuerungssoftware sowie von Schnittstellen und Anwendungen im industriellen Umfeld.",
    stellen: "Embedded-Softwareentwickler, SPS-nahe Softwareentwickler, Applikationsentwickler",
    match: ["software", "entwickler", "embedded"],
  },
];

// Eine Quelle für sichtbares FAQ und FAQPage-Schema (Google verlangt Deckung).
const BERUFE_FAQ = [
  { q: "Welche technischen Berufe vermittelt PHE-Perm?", a: "PHE-Perm vermittelt Fachkräfte aus Elektrotechnik, Automatisierung und SPS, Mechatronik, Servicetechnik, Kälte-, Klima- und Lüftungstechnik sowie TGA und SHK – ergänzend auch Ingenieure, Projektleiter und technische Softwareentwickler." },
  { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Wir vermitteln ausschließlich in unbefristete Festanstellung direkt beim Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
  { q: "Welche Berufsfelder gehören zur Elektrotechnik und Automatisierung?", a: "Dazu zählen Elektroniker für Betriebstechnik, Betriebselektriker und Elektromonteure ebenso wie SPS-Programmierer sowie Automatisierungs- und Steuerungstechniker." },
  { q: "Gibt es auch Stellen für Servicetechniker und Mechatroniker?", a: "Ja. Servicetechniker und Mechatroniker gehören zu unseren Kern-Berufsfeldern. Aktuelle Stellen finden Sie in unserer Jobübersicht." },
  { q: "Vermittelt PHE-Perm auch Ingenieure und Projektleiter?", a: "Ja, ergänzend zu den technischen Facharbeiterberufen vermitteln wir auch Ingenieure und Projektleiter, etwa in Elektrotechnik, Planung und Projektsteuerung." },
  { q: "Wie finde ich passende technische Jobs?", a: "In unserer Jobübersicht können Sie nach Berufsbezeichnung und Ort suchen und filtern. Alternativ bewerben Sie sich initiativ – wir melden uns persönlich zurück." },
  { q: "Können Unternehmen gezielt Fachkräfte aus einem bestimmten Bereich anfragen?", a: "Ja. Unternehmen können ihren Bedarf über unsere technische Personalvermittlung anfragen; wir analysieren die Anforderungen und stellen persönlich vorqualifizierte Profile vor." },
];

function hasJobsFor(feld: Berufsfeld): boolean {
  return JOBS.some(j => {
    const haystack = `${j.title} ${j.tags.join(" ")} ${j.category}`.toLowerCase();
    return feld.match.some(k => haystack.includes(k.toLowerCase()));
  });
}

const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };

export default function BerufePage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE}/berufe`,
    "url": `${BASE}/berufe`,
    "name": "Technische Berufe und Fachkräfte",
    "description": "Übersicht der technischen Berufsfelder, in denen PHE-Perm Fachkräfte in Festanstellung vermittelt.",
    "inLanguage": "de-DE",
    "isPartOf": { "@type": "WebSite", "url": BASE },
    "publisher": { "@id": `${BASE}/#organization` },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": BERUFSFELDER.map((f, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": f.name,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": BERUFE_FAQ.map(f => ({
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
        { name: "Technische Berufe", href: "/berufe" },
      ]} />

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 24px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
          Technische Berufsfelder
        </p>
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18, textWrap: "balance" }}>
          Technische Berufe und Fachkräfte
        </h1>
        <p style={{ fontSize: 18, color: "#586170", lineHeight: 1.7, maxWidth: 720, marginBottom: 28 }}>
          PHE-Perm vermittelt technische Fachkräfte in Festanstellung. Hier finden Bewerber passende
          Berufsfelder und Unternehmen einen Überblick über die technischen Positionen, auf die wir
          spezialisiert sind.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/jobs" className="pathswitch-cta pathswitch-cta--primary">Offene Stellen ansehen</Link>
          <Link href="/technische-personalvermittlung" className="pathswitch-cta pathswitch-cta--secondary">Technische Fachkraft anfragen</Link>
        </div>
      </section>

      {/* BERUFSFELDER */}
      <section style={{ background: "#f5f7fa", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 12 }}>
            Berufsfelder im Überblick
          </h2>
          <p style={{ fontSize: 16, color: "#586170", lineHeight: 1.7, maxWidth: 680, marginBottom: 40 }}>
            Spezialisiert statt generalistisch: Diese technischen Berufsfelder besetzen wir – in
            Festanstellung, deutschlandweit.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {BERUFSFELDER.map(feld => {
              const jobsExist = hasJobsFor(feld);
              return (
                <article key={feld.name} style={{
                  background: "#fff", border: "1px solid #e2e6ee", borderRadius: 16,
                  padding: "26px 24px", display: "flex", flexDirection: "column",
                }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 10, lineHeight: 1.3 }}>{feld.name}</h3>
                  <p style={{ fontSize: 14.5, color: "#586170", lineHeight: 1.6, marginBottom: 14 }}>{feld.einordnung}</p>
                  <p style={{ fontSize: 13.5, color: "#3d3d3f", lineHeight: 1.6, marginBottom: 10 }}>
                    <strong style={{ color: "#1d1d1f" }}>Typische Aufgaben:</strong> {feld.aufgaben}
                  </p>
                  <p style={{ fontSize: 13.5, color: "#3d3d3f", lineHeight: 1.6, marginBottom: (jobsExist || feld.detailHref) ? 16 : 0 }}>
                    <strong style={{ color: "#1d1d1f" }}>Typische Positionen:</strong> {feld.stellen}
                  </p>
                  {feld.detailHref ? (
                    <Link href={feld.detailHref} style={{ ...linkStyle, marginTop: "auto", fontSize: 14 }}>
                      Zum Berufsbild {feld.name} →
                    </Link>
                  ) : jobsExist ? (
                    <Link href="/jobs" style={{ ...linkStyle, marginTop: "auto", fontSize: 14 }}>
                      Offene Stellen ansehen →
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FÜR BEWERBER / FÜR UNTERNEHMEN */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div style={{ background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 16, padding: "28px 26px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", marginBottom: 10, letterSpacing: "-0.02em" }}>Für Bewerber</h2>
            <p style={{ fontSize: 15, color: "#586170", lineHeight: 1.7, marginBottom: 16 }}>
              Finden Sie Ihre passende Festanstellung – persönlich begleitet, ohne Zeitarbeit und ohne
              unnötige Bewerbungshürden. Wir beraten Sie individuell zu Beruf, Region und Gehalt.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9 }}>
              <Link href="/jobs" style={linkStyle}>Offene technische Stellen ansehen</Link><br />
              <Link href="/lebenslauf-erstellen" style={linkStyle}>Lebenslauf kostenlos erstellen</Link>
            </p>
          </div>
          <div style={{ background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 16, padding: "28px 26px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", marginBottom: 10, letterSpacing: "-0.02em" }}>Für Unternehmen</h2>
            <p style={{ fontSize: 15, color: "#586170", lineHeight: 1.7, marginBottom: 16 }}>
              Sie suchen Fachkräfte aus einem dieser Berufsfelder? Wir übernehmen die persönliche
              Vorauswahl und vermitteln ausschließlich in Direktanstellung – passgenau zu Ihrer Vakanz.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9 }}>
              <Link href="/technische-personalvermittlung" style={linkStyle}>Technische Personalvermittlung</Link><br />
              <Link href="/kontakt" style={linkStyle}>Kontakt aufnehmen</Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — aus derselben Quelle wie das FAQPage-Schema */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title="Häufige Fragen zu technischen Berufen" items={BERUFE_FAQ} />
      </div>

      <Footer />
    </div>
  );
}
