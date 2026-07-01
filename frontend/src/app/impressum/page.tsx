import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Impressum – PHE-Perm Engineering",
  robots: "noindex",
};

export default function ImpressumPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />
      <main style={{ padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 28, padding: "48px 56px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Rechtliches
          </p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 48 }}>
            Impressum
          </h1>

          <Block title="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)">
            <p><strong>PHE-Perm Engineering Ingenieure &amp; Techniker GmbH</strong></p>
            <p>Hüttenstraße 30<br />40215 Düsseldorf<br />Deutschland</p>
          </Block>

          <Block title="Vertreten durch">
            <p>Geschäftsführer: Matin Askaryar</p>
          </Block>

          <Block title="Kontakt">
            <p>Telefon: +49 211 158 63 100</p>
            <p>E-Mail: <a href="mailto:info@phe-perm.de" style={{ color: "#0071e3", textDecoration: "none" }}>info@phe-perm.de</a></p>
            <p>Website: <a href="https://www.phe-perm.de" style={{ color: "#0071e3", textDecoration: "none" }}>www.phe-perm.de</a></p>
          </Block>

          <Block title="Handelsregister">
            <p>Registergericht: Amtsgericht Düsseldorf</p>
            <p>Handelsregisternummer: HRB 99512</p>
          </Block>

          <Block title="Umsatzsteuer-Identifikationsnummer">
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:</p>
            <p><strong>DE361209243</strong></p>
          </Block>

          <Block title="Unternehmensgegenstand">
            <p>Die PHE-Perm Engineering Ingenieure &amp; Techniker GmbH ist im Bereich der Personalvermittlung tätig und vermittelt ausschließlich Direktanstellungen zwischen Bewerbern und Unternehmen.</p>
            <p>Eine Arbeitnehmerüberlassung, Leiharbeit oder Zeitarbeit wird nicht angeboten.</p>
          </Block>

          <Block title="Verantwortlich für den Inhalt gemäß § 18 Abs. 2 Medienstaatsvertrag (MStV)">
            <p>Matin Askaryar</p>
            <p>PHE-Perm Engineering Ingenieure &amp; Techniker GmbH<br />Hüttenstraße 30<br />40215 Düsseldorf<br />Deutschland</p>
          </Block>

          <Block title="Verbraucherstreitbeilegung">
            <p>Die PHE-Perm Engineering Ingenieure &amp; Techniker GmbH ist weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </Block>

          <Block title="Haftung für Inhalte">
            <p>Als Diensteanbieter sind wir nach den allgemeinen gesetzlichen Vorschriften für eigene Inhalte auf diesen Webseiten verantwortlich.</p>
            <p>Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>
            <p>Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir die betreffenden Inhalte unverzüglich entfernen.</p>
          </Block>

          <Block title="Haftung für Links">
            <p>Unsere Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.</p>
            <p>Deshalb übernehmen wir für diese fremden Inhalte keine Gewähr. Für die Inhalte der verlinkten Seiten ist ausschließlich deren jeweiliger Betreiber oder Anbieter verantwortlich.</p>
            <p>Zum Zeitpunkt der Verlinkung wurden die verlinkten Seiten auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar.</p>
            <p>Eine dauerhafte inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden entsprechende Links unverzüglich entfernt.</p>
          </Block>

          <Block title="Urheberrecht">
            <p>Die auf dieser Website veröffentlichten Inhalte, Texte, Grafiken, Bilder, Logos sowie sonstigen Werke unterliegen dem deutschen Urheberrecht und anderen gesetzlichen Schutzvorschriften.</p>
            <p>Jede Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Verwertung außerhalb der gesetzlichen Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung der PHE-Perm Engineering Ingenieure &amp; Techniker GmbH oder des jeweiligen Rechteinhabers.</p>
            <p>Soweit Inhalte auf dieser Website nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet und entsprechend gekennzeichnet. Sollten Sie dennoch auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir die betreffenden Inhalte unverzüglich entfernen.</p>
          </Block>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #e5e5ea" }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 15, color: "#3d3d3f", lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
}
