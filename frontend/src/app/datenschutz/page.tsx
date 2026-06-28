import Nav from "../components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Datenschutzerklärung – PHE Perm Engineering",
  robots: "noindex",
};

export default function DatenschutzPage() {
  return (
    <>
      <Nav />
      <main className="legal-page">
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          Rechtliches
        </p>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "var(--navy)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Datenschutzerklärung
        </h1>
        <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 48 }}>Stand: Juni 2026 · Gemäß DSGVO, BDSG und TMG</p>

        <Section title="1. Verantwortlicher (Art. 13 Abs. 1 lit. a DSGVO)">
          <p>
            <strong>PHE-Perm Engineering Ingenieure &amp; Techniker GmbH</strong><br />
            Hüttenstraße 30, 40215 Düsseldorf<br />
            E-Mail: <a href="mailto:datenschutz@phe-perm.de" style={linkStyle}>datenschutz@phe-perm.de</a><br />
            Telefon: +49 173 9980100
          </p>
          <p style={{ marginTop: 12 }}>
            <strong>Datenschutzbeauftragter:</strong><br />
            Da PHE Perm Engineering regelmäßig personenbezogene Daten von Bewerbern und Kandidaten in großem
            Umfang verarbeitet, wurde gemäß Art. 37 DSGVO i.V.m. § 38 BDSG ein betrieblicher
            Datenschutzbeauftragter bestellt:<br />
            <span style={{ marginTop: 4, display: "block" }}>
              Matin Askaryar · <a href="mailto:datenschutz@phe-perm.de" style={linkStyle}>datenschutz@phe-perm.de</a> · Tel. 0211 158 63 100
            </span>
          </p>
        </Section>

        <Section title="2. Welche Daten wir verarbeiten und warum">
          <Subsection title="2.1 Kandidaten und Bewerber">
            <p>Im Rahmen unserer Personalvermittlungstätigkeit verarbeiten wir folgende Datenkategorien:</p>
            <ul style={ulStyle}>
              <li><strong>Stammdaten:</strong> Vor- und Nachname, Geburtsdatum, Nationalität, Adresse</li>
              <li><strong>Kontaktdaten:</strong> E-Mail-Adresse, Telefonnummer, WhatsApp-Nummer</li>
              <li><strong>Bewerbungsunterlagen:</strong> Lebenslauf, Zeugnisse, Zertifikate, Foto (optional)</li>
              <li><strong>Berufsqualifikation:</strong> Berufsabschluss, Fachrichtung, Berufserfahrung in Jahren, Spezialisierungen (z.B. SPS, EPLAN, TGA)</li>
              <li><strong>Gehaltsvorstellungen:</strong> Gewünschtes Jahresgehalt, Verhandlungsbasis</li>
              <li><strong>Präferenzen:</strong> Bevorzugter Arbeitsort, Umzugsbereitschaft, Verfügbarkeit</li>
              <li><strong>Kommunikationsdaten:</strong> Gesprächsnotizen aus Beratungsgesprächen, WhatsApp-Verläufe, E-Mail-Korrespondenz</li>
              <li><strong>Matching-Daten:</strong> Welche Stellen vorgeschlagen wurden, Rückmeldungen, Absagen</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung bzw. Durchführung eines Vertrags),
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, insbesondere für die Weitergabe des Profils an Unternehmen)
              sowie § 26 BDSG (Datenverarbeitung im Beschäftigungskontext).
            </p>
          </Subsection>

          <Subsection title="2.2 Lebenslauf-Generator">
            <p>
              Der kostenlose Lebenslauf-Generator auf dieser Website verarbeitet die von Ihnen eingetragenen
              Daten (Name, Adresse, Berufserfahrung, Foto etc.) <strong>ausschließlich lokal in Ihrem Browser</strong>.
              Diese Daten werden nicht an unsere Server übermittelt und nicht gespeichert, solange Sie nicht
              aktiv auf „Per E-Mail bewerben" oder „Via WhatsApp" klicken.
            </p>
            <p style={{ marginTop: 8 }}>
              Wenn Sie uns Ihren Lebenslauf zusenden, gilt Abschnitt 2.1.
            </p>
          </Subsection>

          <Subsection title="2.3 Kontaktformular und WhatsApp">
            <p>
              Wenn Sie uns über das Kontaktformular, per E-Mail oder WhatsApp kontaktieren, verarbeiten wir:
              Name, E-Mail-Adresse bzw. Telefonnummer sowie den Inhalt Ihrer Nachricht.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie
              Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen).
            </p>
          </Subsection>

          <Subsection title="2.4 Website-Nutzungsdaten">
            <p>
              Beim Besuch unserer Website erfasst der Webserver technische Daten: IP-Adresse (anonymisiert),
              Browsertyp, Betriebssystem, aufgerufene Seiten, Uhrzeit des Zugriffs.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              technisch fehlerfreien Bereitstellung der Website). Wir verwenden kein Google Analytics
              oder vergleichbare Tracking-Tools ohne Ihre Einwilligung.
            </p>
          </Subsection>

          <Subsection title="2.5 YAFTO-Plattform (in Vorbereitung)">
            <p>
              Die YAFTO-Funktion befindet sich in der Entwicklung. Sobald diese aktiviert wird, werden Sie
              gesondert über die Datenverarbeitung informiert und um Ihre Einwilligung gebeten.
            </p>
          </Subsection>
        </Section>

        <Section title="3. Weitergabe von Daten an Dritte">
          <p>Wir geben Ihre Daten nur in folgenden Fällen weiter:</p>
          <ul style={ulStyle}>
            <li>
              <strong>An Unternehmen (Arbeitgeber):</strong> Nur mit Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
              Vor jeder Profilweitergabe fragen wir Sie, ob wir Ihr Profil an ein konkretes Unternehmen senden dürfen.
            </li>
            <li>
              <strong>Technische Dienstleister:</strong> Supabase Inc. (Datenbankhosting, EU-Server), Vercel Inc.
              (Webhosting). Alle Auftragsverarbeitungsverträge (AVV) gemäß Art. 28 DSGVO liegen vor.
            </li>
            <li>
              <strong>Gesetzliche Verpflichtung:</strong> An Behörden, wenn wir gesetzlich dazu verpflichtet sind
              (Art. 6 Abs. 1 lit. c DSGVO).
            </li>
          </ul>
          <p style={{ marginTop: 12 }}>
            <strong>Kein Datenverkauf.</strong> Wir verkaufen Ihre Daten nicht und geben sie nicht ohne
            Ihren Auftrag an Headhunter oder andere Personalvermittler weiter.
          </p>
        </Section>

        <Section title="4. Speicherdauer (Art. 13 Abs. 2 lit. a DSGVO)">
          <div style={{ overflowX: "auto" }}><table style={tableStyle}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                <th style={thStyle}>Datenkategorie</th>
                <th style={thStyle}>Speicherdauer</th>
                <th style={thStyle}>Rechtsgrundlage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Aktive Kandidatenprofile</td>
                <td style={tdStyle}>Solange aktive Vermittlung läuft + 6 Monate nach Abschluss</td>
                <td style={tdStyle}>Art. 6 Abs. 1 lit. b DSGVO</td>
              </tr>
              <tr style={{ background: "var(--bg)" }}>
                <td style={tdStyle}>Inaktive Kandidaten (kein Kontakt)</td>
                <td style={tdStyle}>2 Jahre, dann automatische Löschung oder erneute Einwilligungsanfrage</td>
                <td style={tdStyle}>Art. 6 Abs. 1 lit. a DSGVO</td>
              </tr>
              <tr>
                <td style={tdStyle}>Vermittlungsverträge, Rechnungen</td>
                <td style={tdStyle}>10 Jahre (steuerrechtliche Aufbewahrungspflicht)</td>
                <td style={tdStyle}>§ 147 AO, Art. 6 Abs. 1 lit. c DSGVO</td>
              </tr>
              <tr style={{ background: "var(--bg)" }}>
                <td style={tdStyle}>E-Mail-Korrespondenz (geschäftlich)</td>
                <td style={tdStyle}>6 Jahre (handelsrechtliche Aufbewahrungspflicht)</td>
                <td style={tdStyle}>§ 257 HGB, Art. 6 Abs. 1 lit. c DSGVO</td>
              </tr>
              <tr>
                <td style={tdStyle}>Website-Logs (IP-Adressen)</td>
                <td style={tdStyle}>7 Tage, dann automatische Löschung</td>
                <td style={tdStyle}>Art. 6 Abs. 1 lit. f DSGVO</td>
              </tr>
              <tr style={{ background: "var(--bg)" }}>
                <td style={tdStyle}>Bewerbungsunterlagen (abgelehnt)</td>
                <td style={tdStyle}>3 Monate nach Ablehnung (AGG-Frist), dann Löschung</td>
                <td style={tdStyle}>§ 15 AGG</td>
              </tr>
            </tbody>
          </table></div>
        </Section>

        <Section title="5. Ihre Rechte als betroffene Person (Art. 15–22 DSGVO)">
          <p>Sie haben jederzeit folgende Rechte — kostenlos und ohne Begründung:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Auskunft (Art. 15 DSGVO):</strong> Sie können jederzeit eine vollständige Kopie aller
              über Sie gespeicherten Daten anfordern.
            </li>
            <li>
              <strong>Berichtigung (Art. 16 DSGVO):</strong> Falsche Daten werden auf Ihren Hinweis sofort korrigiert.
            </li>
            <li>
              <strong>Löschung (Art. 17 DSGVO, „Recht auf Vergessenwerden"):</strong> Sie können die vollständige
              Löschung Ihrer Daten verlangen. Wir löschen innerhalb von 30 Tagen, sofern keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen.
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können verlangen, dass wir
              Ihre Daten nur noch speichern, aber nicht mehr aktiv nutzen.
            </li>
            <li>
              <strong>Datenportabilität (Art. 20 DSGVO):</strong> Sie erhalten Ihre Daten in einem
              maschinenlesbaren Format (JSON oder CSV) zum Übertragen an andere Dienste.
            </li>
            <li>
              <strong>Widerspruch (Art. 21 DSGVO):</strong> Sie können der Verarbeitung auf Basis berechtigter
              Interessen jederzeit widersprechen.
            </li>
            <li>
              <strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Eine erteilte Einwilligung
              (z.B. zur Profilweitergabe) können Sie jederzeit widerrufen — ohne Nachteile für Sie.
            </li>
          </ul>
          <div style={{ marginTop: 16, padding: 16, background: "#f0f7ff", borderRadius: 10, border: "1.5px solid #c7dff7" }}>
            <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>So stellen Sie einen Antrag:</p>
            <p>
              Per E-Mail an{" "}
              <a href="mailto:datenschutz@phe-perm.de" style={linkStyle}>datenschutz@phe-perm.de</a>{" "}
              mit dem Betreff „Datenschutzanfrage – [Ihr Name]". Wir antworten innerhalb von 30 Tagen
              (Art. 12 Abs. 3 DSGVO). Bei komplexen Anfragen können wir die Frist einmalig um weitere
              2 Monate verlängern — wir informieren Sie darüber.
            </p>
          </div>
          <p style={{ marginTop: 12 }}>
            <strong>Beschwerderecht:</strong> Wenn Sie der Ansicht sind, dass wir Ihre Daten unrechtmäßig
            verarbeiten, können Sie Beschwerde bei der zuständigen Aufsichtsbehörde einlegen:
          </p>
          <p style={{ marginTop: 8 }}>
            Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)<br />
            Postfach 20 04 44, 40102 Düsseldorf<br />
            <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.ldi.nrw.de</a>
          </p>
        </Section>

        <Section title="6. Datensicherheit (Art. 32 DSGVO)">
          <p>Wir setzen folgende technische und organisatorische Maßnahmen (TOMs) ein:</p>
          <ul style={ulStyle}>
            <li><strong>Verschlüsselung in Transit:</strong> Alle Datenübertragungen erfolgen ausschließlich über HTTPS/TLS 1.3</li>
            <li><strong>Verschlüsselung at Rest:</strong> Alle Datenbankdaten sind AES-256-verschlüsselt (Supabase)</li>
            <li><strong>Zugriffskontrolle:</strong> Row-Level Security (RLS) in der Datenbank — jeder Mitarbeiter sieht nur die Kandidaten, die ihm zugewiesen sind</li>
            <li><strong>Authentifizierung:</strong> Zwei-Faktor-Authentifizierung (2FA/TOTP) für alle Mitarbeiter-Accounts</li>
            <li><strong>Rechtemanagement:</strong> Minimalprinzip — Mitarbeiter erhalten nur die Zugriffsrechte, die für ihre Aufgabe erforderlich sind</li>
            <li><strong>Datensicherung:</strong> Tägliche automatische Backups mit 30-tägiger Aufbewahrung</li>
            <li><strong>Auftragsverarbeitung:</strong> AVV-Verträge mit allen externen Dienstleistern (Supabase, Vercel)</li>
            <li><strong>Pseudonymisierung:</strong> Kandidatenprofile werden bei der Weitergabe an Unternehmen pseudonymisiert (Name und Kontaktdaten werden erst nach Einwilligung übermittelt)</li>
          </ul>
        </Section>

        <Section title="7. Cookies und Tracking">
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Cookies (Session-Verwaltung, Sicherheit).
            Es werden keine Tracking- oder Werbe-Cookies ohne Ihre ausdrückliche Einwilligung gesetzt.
          </p>
          <p style={{ marginTop: 8 }}>
            <strong>Rechtsgrundlage für technisch notwendige Cookies:</strong> Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse am Betrieb der Website) sowie § 25 Abs. 2 TTDSG.
          </p>
        </Section>

        <Section title="8. Drittlandtransfers (Art. 44 ff. DSGVO)">
          <p>
            Supabase und Vercel sind US-amerikanische Unternehmen. Die Datenverarbeitung erfolgt jedoch
            auf Servern in der EU (Frankfurt). Für eventuelle Transfers in die USA gelten die
            EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO sowie das
            EU-U.S. Data Privacy Framework.
          </p>
        </Section>

        <Section title="9. Automatisierte Entscheidungsfindung (Art. 22 DSGVO)">
          <p>
            Unser System schlägt auf Basis von Qualifikation, Standort und Präferenzen passende Stellen vor
            (Matching). Diese Vorschläge dienen der Unterstützung unserer Berater — die endgültige
            Entscheidung über die Vermittlung trifft immer ein Mensch. Es findet keine automatisierte
            Entscheidungsfindung mit rechtlicher Wirkung statt.
          </p>
        </Section>

        <div style={{ marginTop: 48, padding: 20, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 13, color: "var(--gray)" }}>
          Stand: Juni 2026 · Wir aktualisieren diese Erklärung bei wesentlichen Änderungen unserer Datenverarbeitung. ·{" "}
          <Link href="/impressum" style={linkStyle}>Impressum</Link>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", marginBottom: 14, paddingBottom: 8, borderBottom: "1.5px solid var(--border)" }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  );
}

const linkStyle: React.CSSProperties = { color: "var(--blue)", textDecoration: "none" };
const ulStyle: React.CSSProperties = { paddingLeft: 20, marginTop: 8, lineHeight: 1.9 };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 12 };
const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "var(--navy)", border: "1px solid var(--border)" };
const tdStyle: React.CSSProperties = { padding: "10px 12px", border: "1px solid var(--border)", verticalAlign: "top" };
