import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "AGB – PHE-Perm Engineering",
  robots: "noindex",
};

export default function AgbPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />
      <main style={{ padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 28, padding: "48px 56px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Rechtliches
          </p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 8 }}>
            Allgemeine Geschäftsbedingungen
          </h1>
          <p style={{ fontSize: 15, color: "#707070", marginBottom: 48 }}>Stand: Juli 2026</p>

          <Section title="§ 1 Geltungsbereich">
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Website sowie der von der PHE-Perm Engineering Ingenieure &amp; Techniker GmbH, Hüttenstraße 30, 40215 Düsseldorf (nachfolgend „PHE") angebotenen Dienstleistungen gegenüber Bewerbern (Kandidaten) und Unternehmen (Auftraggeber).</p>
            <p>Abweichende Allgemeine Geschäftsbedingungen des Vertragspartners finden keine Anwendung, sofern PHE ihrer Geltung nicht ausdrücklich in Textform zugestimmt hat.</p>
            <p>Diese AGB regeln ausschließlich die Nutzung der Website und der angebotenen Online-Dienste. Für Vermittlungsleistungen gegenüber Unternehmen gelten ergänzend die jeweils individuell abgeschlossenen Vermittlungsverträge.</p>
          </Section>

          <Section title="§ 2 Leistungsgegenstand">
            <p>PHE erbringt Dienstleistungen im Bereich der Personalvermittlung und vermittelt ausschließlich Direktanstellungen (Festanstellungen).</p>
            <p>PHE betreibt keine Arbeitnehmerüberlassung, Zeitarbeit oder Leiharbeit und wird nicht Arbeitgeber der vermittelten Kandidaten.</p>
            <p>Die Nutzung der Website sowie des Lebenslauf-Generators ist für Bewerber kostenlos.</p>
            <p>Ein Anspruch auf Registrierung, Vermittlung oder den Abschluss eines Arbeitsvertrages besteht nicht.</p>
          </Section>

          <Section title="§ 3 Für Kandidaten (Bewerber)">
            <SubSection title="3.1 Kostenfreiheit">
              <p>Die Registrierung sowie die Vermittlung durch PHE sind für Bewerber kostenlos. Eine Vergütung erhält PHE ausschließlich von den jeweiligen Auftraggebern.</p>
            </SubSection>
            <SubSection title="3.2 Richtigkeit der Angaben">
              <p>Der Bewerber verpflichtet sich, sämtliche Angaben vollständig, aktuell und wahrheitsgemäß zu machen.</p>
              <p>Insbesondere dürfen keine unrichtigen oder gefälschten Angaben, Zeugnisse, Zertifikate oder sonstigen Unterlagen übermittelt werden.</p>
            </SubSection>
            <SubSection title="3.3 Weitergabe von Bewerberprofilen">
              <p>PHE übermittelt zunächst ausschließlich anonymisierte Bewerberprofile an geeignete Unternehmen.</p>
              <p>Personenbezogene Daten, insbesondere Name, Anschrift, Telefonnummer, E-Mail-Adresse oder sonstige identifizierende Informationen, werden ausschließlich nach vorheriger ausdrücklicher Zustimmung des Bewerbers für den jeweiligen Vermittlungsvorgang weitergegeben.</p>
            </SubSection>
            <SubSection title="3.4 Widerruf und Löschung">
              <p>Der Bewerber kann seine datenschutzrechtliche Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.</p>
              <p>Die Löschung personenbezogener Daten erfolgt im Rahmen der gesetzlichen Vorschriften, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
              <p>Weitere Informationen ergeben sich aus der Datenschutzerklärung.</p>
            </SubSection>
          </Section>

          <Section title="§ 4 Für Unternehmen (Auftraggeber)">
            <SubSection title="4.1 Vermittlungsvertrag">
              <p>Die Vergütung von PHE richtet sich ausschließlich nach dem individuell abgeschlossenen Vermittlungsvertrag zwischen PHE und dem Auftraggeber.</p>
            </SubSection>
            <SubSection title="4.2 Vertraulichkeit">
              <p>Alle übermittelten Kandidatenprofile sowie sämtliche daraus gewonnenen Informationen sind vertraulich zu behandeln.</p>
              <p>Sie dürfen ausschließlich zum Zweck der Besetzung der konkret vorgesehenen Stelle verwendet werden.</p>
              <p>Eine Weitergabe an Dritte oder eine Nutzung zu anderen Zwecken ist ohne vorherige Zustimmung von PHE unzulässig.</p>
            </SubSection>
            <SubSection title="4.3 Mitteilungspflicht">
              <p>Der Auftraggeber verpflichtet sich, PHE unverzüglich über den Abschluss eines Arbeitsvertrages mit einem von PHE vorgestellten Kandidaten zu informieren.</p>
            </SubSection>
          </Section>

          <Section title="§ 5 Lebenslauf-Generator">
            <SubSection title="5.1 Nutzung">
              <p>Der Lebenslauf-Generator wird kostenlos und ohne Gewähr zur Verfügung gestellt.</p>
              <p>PHE übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Eignung der erstellten Dokumente für konkrete Bewerbungsverfahren.</p>
              <p>Der Nutzer ist verpflichtet, die erzeugten Dokumente vor ihrer Verwendung eigenständig auf Richtigkeit und Vollständigkeit zu prüfen.</p>
            </SubSection>
            <SubSection title="5.2 Verarbeitung der Daten">
              <p>Die im Lebenslauf-Generator eingegebenen Daten werden ausschließlich lokal im Browser des Nutzers verarbeitet und nicht auf Servern von PHE gespeichert, sofern der Nutzer diese nicht selbst aktiv an PHE übermittelt.</p>
            </SubSection>
          </Section>

          <Section title="§ 6 Datenschutz">
            <p>Die Verarbeitung personenbezogener Daten erfolgt ausschließlich nach Maßgabe der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO) sowie des Bundesdatenschutzgesetzes (BDSG).</p>
            <p>Einzelheiten zur Verarbeitung personenbezogener Daten ergeben sich aus der Datenschutzerklärung.</p>
          </Section>

          <Section title="§ 7 Haftung">
            <p>PHE haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen.</p>
            <p>Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten haftet PHE ausschließlich für den vertragstypischen und vorhersehbaren Schaden.</p>
            <p>Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen, soweit gesetzlich zulässig.</p>
            <p>PHE übernimmt keine Gewähr dafür, dass eine Vermittlung innerhalb eines bestimmten Zeitraums oder überhaupt erfolgreich zustande kommt.</p>
          </Section>

          <Section title="§ 8 Verfügbarkeit der Website">
            <p>PHE ist bemüht, die Website und ihre Online-Dienste möglichst unterbrechungsfrei bereitzustellen.</p>
            <p>Ein Anspruch auf eine jederzeitige und ununterbrochene Verfügbarkeit besteht jedoch nicht.</p>
            <p>Insbesondere können Wartungsarbeiten, technische Störungen oder Ereignisse außerhalb des Einflussbereichs von PHE zu vorübergehenden Einschränkungen führen.</p>
          </Section>

          <Section title="§ 9 Änderungen dieser AGB">
            <p>PHE behält sich vor, diese Allgemeinen Geschäftsbedingungen bei Bedarf anzupassen, insbesondere aufgrund gesetzlicher Änderungen, technischer Weiterentwicklungen oder der Erweiterung des Leistungsangebots.</p>
            <p>Die jeweils aktuelle Fassung wird auf der Website veröffentlicht.</p>
          </Section>

          <Section title="§ 10 Anwendbares Recht und Gerichtsstand">
            <p>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
            <p>Ist der Vertragspartner Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand Düsseldorf.</p>
          </Section>

          <Section title="§ 11 Salvatorische Klausel">
            <p>Sollten einzelne Bestimmungen dieser Allgemeinen Geschäftsbedingungen ganz oder teilweise unwirksam oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.</p>
            <p>An die Stelle der unwirksamen oder undurchführbaren Bestimmung treten die gesetzlichen Vorschriften. Soweit eine solche Regelung nicht besteht, gilt eine rechtlich zulässige Regelung als vereinbart, die dem wirtschaftlichen Zweck der unwirksamen oder undurchführbaren Bestimmung möglichst nahekommt.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1d1d1f", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #e5e5ea" }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15, color: "#3d3d3f", lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 15, color: "#3d3d3f", lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
