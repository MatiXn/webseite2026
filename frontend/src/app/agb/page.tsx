import Nav from "../components/Nav";
import Link from "next/link";

export const metadata = {
  title: "AGB – PHE Perm Engineering",
  robots: "noindex",
};

export default function AgbPage() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 120px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          Rechtliches
        </p>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "var(--navy)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Allgemeine Geschäftsbedingungen
        </h1>
        <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 48 }}>Stand: Juni 2026</p>

        <Section title="§ 1 Geltungsbereich">
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen der
            PHE-Perm Engineering Ingenieure &amp; Techniker GmbH, Hüttenstraße 30, 40215 Düsseldorf
            (nachfolgend „PHE"), gegenüber Bewerbern (Kandidaten) und Unternehmen (Auftraggeber).
          </p>
        </Section>

        <Section title="§ 2 Leistungsgegenstand">
          <p>
            PHE erbringt Dienstleistungen der Personalvermittlung. PHE vermittelt ausschließlich
            Direktanstellungen (Festanstellungen) — keine Zeitarbeit, keine Leiharbeit. PHE ist
            kein Arbeitgeber der vermittelten Kandidaten.
          </p>
          <p style={{ marginTop: 8 }}>
            Die Nutzung der Website sowie des Lebenslauf-Generators ist für Bewerber kostenlos.
          </p>
        </Section>

        <Section title="§ 3 Für Kandidaten (Bewerber)">
          <p>
            3.1 Die Registrierung und Vermittlung durch PHE ist für Kandidaten vollständig kostenlos.
            PHE wird ausschließlich vom Auftraggeber (Unternehmen) vergütet.
          </p>
          <p style={{ marginTop: 8 }}>
            3.2 Der Kandidat versichert, dass alle von ihm angegebenen Informationen der Wahrheit entsprechen
            und keine gefälschten Qualifikationen oder Dokumente eingereicht werden.
          </p>
          <p style={{ marginTop: 8 }}>
            3.3 Der Kandidat willigt ein, dass PHE sein anonymisiertes Profil an geeignete Unternehmen
            weitergibt. Die Weitergabe von Name und Kontaktdaten erfolgt erst nach ausdrücklicher Zustimmung
            des Kandidaten im Einzelfall.
          </p>
          <p style={{ marginTop: 8 }}>
            3.4 Der Kandidat kann seine Einwilligung jederzeit widerrufen und die Löschung seiner Daten
            verlangen (siehe Datenschutzerklärung).
          </p>
        </Section>

        <Section title="§ 4 Für Unternehmen (Auftraggeber)">
          <p>
            4.1 Die Vergütung von PHE durch den Auftraggeber richtet sich nach dem individuell vereinbarten
            Vermittlungsvertrag. In der Regel wird eine erfolgsabhängige Vergütung (Provision) vereinbart,
            die bei Abschluss eines Arbeitsvertrags zwischen Kandidat und Auftraggeber fällig wird.
          </p>
          <p style={{ marginTop: 8 }}>
            4.2 Übermittelte Kandidatenprofile dürfen ausschließlich für die beschriebene offene Stelle
            verwendet und nicht an Dritte weitergegeben werden.
          </p>
          <p style={{ marginTop: 8 }}>
            4.3 Der Auftraggeber verpflichtet sich, eine etwaige Einstellung eines Kandidaten unverzüglich
            an PHE zu melden.
          </p>
        </Section>

        <Section title="§ 5 Lebenslauf-Generator">
          <p>
            5.1 Der Lebenslauf-Generator wird kostenlos und ohne Gewähr zur Verfügung gestellt.
            PHE übernimmt keine Haftung für die Richtigkeit, Vollständigkeit oder Eignung der
            erstellten Dokumente für konkrete Bewerbungsverfahren.
          </p>
          <p style={{ marginTop: 8 }}>
            5.2 Die eingegebenen Daten werden ausschließlich im Browser des Nutzers verarbeitet und
            nicht auf Servern von PHE gespeichert (soweit der Nutzer sie nicht aktiv versendet).
          </p>
        </Section>

        <Section title="§ 6 Haftungsbeschränkung">
          <p>
            PHE haftet für Schäden aus der Verletzung von Leben, Körper oder Gesundheit unbeschränkt.
            Im Übrigen haftet PHE nur für Vorsatz und grobe Fahrlässigkeit. Die Haftung für leichte
            Fahrlässigkeit ist — soweit gesetzlich zulässig — ausgeschlossen.
          </p>
          <p style={{ marginTop: 8 }}>
            PHE übernimmt keine Garantie dafür, dass eine Vermittlung innerhalb eines bestimmten
            Zeitraums erfolgreich abgeschlossen wird.
          </p>
        </Section>

        <Section title="§ 7 Anwendbares Recht und Gerichtsstand">
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            Gerichtsstand für alle Streitigkeiten ist Düsseldorf, sofern der Vertragspartner
            Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
            Sondervermögen ist.
          </p>
        </Section>

        <Section title="§ 8 Salvatorische Klausel">
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
            Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame Bestimmung gilt als durch
            eine wirksame Regelung ersetzt, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung
            am nächsten kommt.
          </p>
        </Section>

        <div style={{ marginTop: 48, padding: 20, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 13, color: "var(--gray)" }}>
          Stand: Juni 2026 ·{" "}
          <Link href="/impressum" style={linkStyle}>Impressum</Link> ·{" "}
          <Link href="/datenschutz" style={linkStyle}>Datenschutz</Link>
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
      <div style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = { color: "var(--blue)", textDecoration: "none" };
