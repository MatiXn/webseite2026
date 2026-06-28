import Nav from "../components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Impressum – PHE Perm Engineering",
  robots: "noindex",
};

export default function ImpressumPage() {
  return (
    <>
      <Nav />
      <main className="legal-page">
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          Rechtliches
        </p>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "var(--navy)", letterSpacing: "-0.03em", marginBottom: 48 }}>
          Impressum
        </h1>

        <Section title="Angaben gemäß § 5 TMG">
          <p><strong>PHE-Perm Engineering Ingenieure &amp; Techniker GmbH</strong></p>
          <p>Hüttenstraße 30<br />40215 Düsseldorf<br />Deutschland</p>
        </Section>

        <Section title="Vertreten durch">
          <p>Geschäftsführer: <strong>Matin Askaryar</strong></p>
        </Section>

        <Section title="Kontakt">
          <p>
            Telefon: <a href="tel:+492111586300" style={linkStyle}>0211 158 63 100</a><br />
            E-Mail: <a href="mailto:info@phe-perm.de" style={linkStyle}>info@phe-perm.de</a><br />
            Website: <a href="https://phe-perm.de" style={linkStyle}>phe-perm.de</a>
          </p>
        </Section>

        <Section title="Handelsregister">
          <p>
            Registergericht: Amtsgericht Düsseldorf<br />
            Registernummer: <strong>HRB 99512</strong>
          </p>
        </Section>

        <Section title="Umsatzsteuer-Identifikationsnummer">
          <p>
            Gemäß § 27a Umsatzsteuergesetz:<br />
            <strong>DE361209243</strong>
          </p>
        </Section>

        <Section title="Berufsrechtliche Regelungen">
          <p>
            PHE-Perm Engineering Ingenieure &amp; Techniker GmbH ist als Personalvermittler tätig.
            Die Erlaubnis zur gewerbsmäßigen Arbeitnehmerüberlassung und Vermittlung wird durch die
            Bundesagentur für Arbeit erteilt.
          </p>
          <p style={{ marginTop: 8 }}>
            Erlaubnisbehörde: Bundesagentur für Arbeit, Regionaldirektion Nordrhein-Westfalen<br />
            Erlaubnisart: Personalvermittlung (Direktvermittlung, keine Zeitarbeit)
          </p>
        </Section>

        <Section title="Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV">
          <p>
            Matin Askaryar<br />
            Hüttenstraße 30, 40215 Düsseldorf
          </p>
        </Section>

        <Section title="EU-Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p style={{ marginTop: 8 }}>
            Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet,
            an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
            forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </Section>

        <div style={{ marginTop: 48, padding: 20, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 13, color: "var(--gray)" }}>
          Stand: Juni 2026 · Änderungen vorbehalten ·{" "}
          <Link href="/datenschutz" style={linkStyle}>Datenschutzerklärung</Link>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 12, paddingBottom: 8, borderBottom: "1.5px solid var(--border)" }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: "var(--blue)",
  textDecoration: "none",
};
