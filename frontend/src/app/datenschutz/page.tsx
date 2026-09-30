import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Datenschutzerklärung – PHE-Perm Engineering",
  robots: "noindex",
};

export default function DatenschutzPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />
      <main style={{ padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 28, padding: "48px 56px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Rechtliches
          </p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 8 }}>
            Datenschutzerklärung
          </h1>
          <p style={{ fontSize: 15, color: "#707070", marginBottom: 32 }}>Stand: September 2026</p>

          <p style={{ fontSize: 15, color: "#3d3d3f", lineHeight: 1.7, marginBottom: 48 }}>
            Wir freuen uns über Ihren Besuch auf unserer Website und Ihr Interesse an unserem Unternehmen. Der Schutz Ihrer personenbezogenen Daten hat für uns einen hohen Stellenwert. Die Verarbeitung Ihrer personenbezogenen Daten erfolgt ausschließlich im Rahmen der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO), des Bundesdatenschutzgesetzes (BDSG), des Digitale-Dienste-Gesetzes (DDG) sowie des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes (TDDDG).
          </p>

          <Block title="1. Verantwortlicher">
            <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
            <p>
              <strong>PHE-Perm Engineering Ingenieure &amp; Techniker GmbH</strong><br />
              Hüttenstraße 30<br />
              40215 Düsseldorf<br />
              Deutschland
            </p>
            <p>Telefon: +49 211 158 63 100</p>
            <p>E-Mail: <a href="mailto:info@phe-perm.de" style={{ color: "#0071e3", textDecoration: "none" }}>info@phe-perm.de</a></p>
            <p>Website: <a href="https://www.phe-perm.de" style={{ color: "#0071e3", textDecoration: "none" }}>www.phe-perm.de</a></p>
            <p>Vertreten durch den Geschäftsführer: Matin Askaryar</p>
          </Block>

          <Block title="2. Kontakt in Datenschutzangelegenheiten">
            <p>Bei Fragen zum Datenschutz oder zur Verarbeitung Ihrer personenbezogenen Daten können Sie sich jederzeit an uns wenden:</p>
            <p>E-Mail: <a href="mailto:info@phe-perm.de" style={{ color: "#0071e3", textDecoration: "none" }}>info@phe-perm.de</a></p>
          </Block>

          <Block title="3. Zwecke und Rechtsgrundlagen der Datenverarbeitung">
            <p>Wir verarbeiten personenbezogene Daten ausschließlich, soweit dies zur Bereitstellung unserer Website, zur Bearbeitung Ihrer Anfragen, zur Durchführung von Bewerbungs- und Vermittlungsverfahren oder aufgrund gesetzlicher Verpflichtungen erforderlich ist.</p>
            <p>Die Verarbeitung erfolgt insbesondere auf Grundlage folgender Rechtsgrundlagen:</p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertrag oder vorvertragliche Maßnahmen)</li>
              <li>Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Verpflichtung)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
              <li>§ 26 BDSG, soweit personenbezogene Daten im Zusammenhang mit der Anbahnung eines Beschäftigungsverhältnisses verarbeitet werden.</li>
            </ul>
          </Block>

          <Block title="4. Verarbeitung personenbezogener Daten von Bewerbern">
            <p>Im Rahmen unserer Personalvermittlung verarbeiten wir personenbezogene Daten von Bewerbern und Kandidaten. Hierzu gehören insbesondere:</p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Vor- und Nachname</li>
              <li>Anschrift</li>
              <li>Telefonnummer</li>
              <li>E-Mail-Adresse</li>
              <li>Bewerbungsunterlagen (Lebenslauf, Zeugnisse, Zertifikate und vergleichbare Dokumente)</li>
              <li>freiwillig übermittelte Bewerbungsfotos</li>
              <li>Angaben zu Qualifikationen, Berufserfahrung, Gehaltsvorstellungen, gewünschtem Arbeitsort, Verfügbarkeit und Umzugsbereitschaft</li>
              <li>Gesprächsnotizen und Kommunikationsverläufe per E-Mail oder WhatsApp</li>
            </ul>
            <p>Die Verarbeitung erfolgt ausschließlich zum Zweck der Prüfung Ihrer Bewerbung sowie der Durchführung geeigneter Vermittlungsverfahren.</p>
            <p>Eine Weitergabe Ihrer personenbezogenen Daten an Unternehmen erfolgt grundsätzlich erst nach Ihrer vorherigen ausdrücklichen Zustimmung.</p>
          </Block>

          <Block title="5. Lebenslauf-Generator">
            <p>Auf unserer Website stellen wir einen kostenlosen Lebenslauf-Generator zur Verfügung.</p>
            <p>Die von Ihnen eingegebenen Daten werden ausschließlich lokal auf Ihrem Endgerät im Browser verarbeitet. Eine Speicherung oder Übermittlung an unsere Server erfolgt erst dann, wenn Sie Ihren Lebenslauf aktiv an uns per E-Mail oder WhatsApp übermitteln.</p>
            <p>Vor der Verwendung sollten Sie die erzeugten Unterlagen eigenständig auf Richtigkeit und Vollständigkeit überprüfen.</p>
          </Block>

          <Block title="6. Hosting">
            <p>Unsere Website wird über die Vercel Inc. bereitgestellt. Zusätzlich nutzen wir Dienstleistungen der IONOS SE für die Verwaltung unserer Domain und weiterer technischer Infrastruktur.</p>
            <p>Beim Besuch unserer Website werden automatisch technisch erforderliche Informationen verarbeitet. Hierzu gehören insbesondere:</p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Browsertyp und Browserversion</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>aufgerufene Seiten</li>
              <li>übertragene Datenmenge</li>
            </ul>
            <p>Diese Daten werden ausschließlich verarbeitet, um die Sicherheit, Stabilität und Funktionsfähigkeit unserer Website sicherzustellen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
          </Block>

          <Block title="7. Cookies und vergleichbare Technologien">
            <p>Für den Betrieb unserer Website verwenden wir technisch notwendige Speicherung, insbesondere für Ihre Auswahl im Einwilligungsbanner. Diese ist ohne Ihre Einwilligung zulässig.</p>
            <p>Darüber hinaus setzen wir auf der gesamten Website das Google-Tag für Google Ads ein (siehe Ziffer 7d) und auf unseren Stellen-Landingpages den Meta-Pixel (siehe Ziffer 7b). Beide werden ausschließlich geladen, wenn Sie im Einwilligungsbanner ausdrücklich zugestimmt haben. Lehnen Sie ab oder treffen Sie keine Auswahl, findet keine Übertragung an Google oder Meta statt.</p>
            <p>Sie können Ihre Entscheidung jederzeit ändern, indem Sie die in Ihrem Browser für diese Website gespeicherten Daten löschen. Beim nächsten Aufruf erscheint das Banner erneut.</p>
            <p>Rechtsgrundlagen: Art. 6 Abs. 1 lit. f DSGVO und § 25 Abs. 2 TDDDG für die notwendige Speicherung; Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG für das Google-Tag und den Meta-Pixel.</p>
          </Block>

          <Block title="7b. Meta-Pixel auf unseren Stellen-Landingpages">
            <p>Auf unseren Landingpages zu einzelnen Stellenangeboten (erreichbar unter /stellen/) setzen wir den Meta-Pixel der Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland ein. Wir nutzen ihn, um zu messen, welche unserer Anzeigen auf Facebook und Instagram tatsächlich zu einer Anfrage führen.</p>
            <p><strong>Nur mit Ihrer Einwilligung:</strong> Das Skript wird erst nach Ihrer ausdrücklichen Zustimmung im Einwilligungsbanner geladen. Ohne Zustimmung wird es nicht angefordert, und es werden keine Daten an Meta übermittelt. Die Landingpages sind ohne Einwilligung uneingeschränkt nutzbar.</p>
            <p>Erfasst werden dabei der Aufruf der Seite sowie das Absenden des Formulars. Wir übermitteln dabei keine Namen, Telefonnummern oder E-Mail-Adressen an Meta, sondern ausschließlich die Bezeichnung der Kampagne und eine technische Ereigniskennung.</p>
            <p>Meta kann diese Informationen Ihrem Nutzerkonto zuordnen, sofern Sie bei Facebook oder Instagram angemeldet sind, und für eigene Zwecke verarbeiten. Auf diese Verarbeitung haben wir keinen Einfluss. Wir und Meta sind insoweit gemeinsam Verantwortliche im Sinne des Art. 26 DSGVO.</p>
            <p>Eine Übermittlung in die USA ist nicht ausgeschlossen. Meta stützt sich hierfür auf das EU-US Data Privacy Framework sowie auf Standardvertragsklauseln.</p>
            <p>Weitere Informationen finden Sie in der Datenschutzrichtlinie von Meta unter <span style={{ wordBreak: "break-all" }}>https://www.facebook.com/privacy/policy</span>.</p>
            <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Ihre Einwilligung ist freiwillig und jederzeit mit Wirkung für die Zukunft widerrufbar.</p>
          </Block>

          <Block title="7c. Anfragen über unsere Stellen-Landingpages">
            <p>Wenn Sie über eine unserer Stellen-Landingpages Interesse an einer Position bekunden, verarbeiten wir die von Ihnen angegebenen Daten: Vor- und Nachname, Telefonnummer, E-Mail-Adresse, Ihre Antworten zu Qualifikation, Berufserfahrung, Wohnort und Führerschein sowie freiwillige Angaben zu Postleitzahl, Erreichbarkeit und aktueller Tätigkeit.</p>
            <p>Wir verarbeiten diese Daten ausschließlich, um mit Ihnen über die konkret ausgeschriebene Position zu sprechen. Eine Aufnahme in einen Talentpool, die Ansprache zu anderen Stellen oder die Zusendung von Werbung erfolgt auf dieser Grundlage nicht.</p>
            <p>Zusätzlich speichern wir den Zeitpunkt Ihrer Einwilligung, die Fassung des Einwilligungstextes sowie die Kampagnenparameter der aufgerufenen Anzeige. Dies dient dem Nachweis der Einwilligung.</p>
            <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung) sowie Art. 6 Abs. 1 lit. b DSGVO und § 26 Abs. 1 BDSG für die Anbahnung eines Beschäftigungsverhältnisses.</p>
            <p>Die Daten werden auf Servern innerhalb der Europäischen Union gespeichert. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen; schreiben Sie uns dazu an info@phe-perm.de.</p>
          </Block>

          <Block title="7d. Google Ads Conversion-Tracking (Google-Tag)">
            <p>Auf unserer Website setzen wir das Google-Tag (gtag.js) der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland ein. Wir nutzen es, um zu messen, welche unserer Anzeigen bei Google tatsächlich zu einer Anfrage, Bewerbung oder Kontaktaufnahme führen.</p>
            <p><strong>Nur mit Ihrer Einwilligung:</strong> Das Skript wird erst nach Ihrer ausdrücklichen Zustimmung im Einwilligungsbanner geladen. Ohne Zustimmung wird es nicht angefordert, und es werden keine Daten an Google übermittelt. Die Website ist ohne Einwilligung uneingeschränkt nutzbar.</p>
            <p>Erfasst werden der Aufruf der Seiten, das erfolgreiche Absenden unserer Kontakt-, Bewerbungs- und Anfrageformulare sowie Klicks auf Telefon- und WhatsApp-Links. Wir übermitteln dabei keine Namen, Telefonnummern oder E-Mail-Adressen an Google, sondern ausschließlich die Art des Ereignisses und das betroffene Formular. Google setzt hierfür Cookies und vergleichbare Kennungen, um einen Klick auf eine Anzeige einer späteren Handlung zuordnen zu können.</p>
            <p>Google kann diese Informationen Ihrem Google-Konto zuordnen, sofern Sie angemeldet sind, und für eigene Zwecke verarbeiten. Eine Übermittlung in die USA ist nicht ausgeschlossen. Google stützt sich hierfür auf das EU-US Data Privacy Framework sowie auf Standardvertragsklauseln.</p>
            <p>Weitere Informationen finden Sie in der Datenschutzerklärung von Google unter <span style={{ wordBreak: "break-all" }}>https://policies.google.com/privacy</span>.</p>
            <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Ihre Einwilligung ist freiwillig und jederzeit mit Wirkung für die Zukunft widerrufbar.</p>
          </Block>

          <Block title="7a. Umkreissuche in der Jobbörse (OpenStreetMap / Nominatim)">
            <p>Wenn Sie in unserer Jobbörse einen Ort für die Umkreissuche eingeben, wird dieser Ortsname über unseren eigenen Server an den Geocoding-Dienst Nominatim der OpenStreetMap Foundation übermittelt, um die zugehörigen Koordinaten zu ermitteln.</p>
            <p>Die Anfrage erfolgt ausschließlich serverseitig: Ihre IP-Adresse und sonstige Geräteinformationen werden dabei nicht an OpenStreetMap übertragen. Es wird lediglich der von Ihnen eingegebene Ortsname übermittelt.</p>
            <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Umkreissuche).</p>
          </Block>

          <Block title="8. Externe Links">
            <p>Unsere Website enthält Verlinkungen zu externen Websites und sozialen Netzwerken, insbesondere Google Maps, Google Bewertungen, Facebook, Instagram und LinkedIn.</p>
            <p>Erst durch das Anklicken eines Links wird eine Verbindung zum jeweiligen Anbieter hergestellt. Für die Verarbeitung personenbezogener Daten auf den jeweiligen Webseiten sind ausschließlich deren Betreiber verantwortlich.</p>
          </Block>

          <Block title="9. Datenübermittlung in Drittländer">
            <p>Soweit personenbezogene Daten an Empfänger außerhalb der Europäischen Union oder des Europäischen Wirtschaftsraums übermittelt werden, erfolgt dies ausschließlich im Rahmen der gesetzlichen Vorgaben der Art. 44 ff. DSGVO.</p>
            <p>Soweit erforderlich, erfolgt eine Datenübermittlung auf Grundlage eines Angemessenheitsbeschlusses der Europäischen Kommission oder geeigneter Garantien, insbesondere der EU-Standardvertragsklauseln.</p>
          </Block>

          <Block title="10. Ihre Rechte">
            <p>Sie haben nach den gesetzlichen Bestimmungen insbesondere folgende Rechte:</p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Auskunft gemäß Art. 15 DSGVO</li>
              <li>Berichtigung gemäß Art. 16 DSGVO</li>
              <li>Löschung gemäß Art. 17 DSGVO</li>
              <li>Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</li>
              <li>Datenübertragbarkeit gemäß Art. 20 DSGVO</li>
              <li>Widerspruch gegen die Verarbeitung gemäß Art. 21 DSGVO</li>
              <li>Widerruf einer erteilten Einwilligung gemäß Art. 7 Abs. 3 DSGVO</li>
            </ul>
            <p>Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an: <a href="mailto:info@phe-perm.de" style={{ color: "#0071e3", textDecoration: "none" }}>info@phe-perm.de</a></p>
            <p>Wir bearbeiten Ihr Anliegen innerhalb der gesetzlichen Fristen.</p>
            <p>Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Zuständige Aufsichtsbehörde ist:</p>
            <p>
              Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen<br />
              Kavalleriestraße 2–4<br />
              40213 Düsseldorf<br />
              E-Mail: <a href="mailto:poststelle@ldi.nrw.de" style={{ color: "#0071e3", textDecoration: "none" }}>poststelle@ldi.nrw.de</a><br />
              Website: <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer" style={{ color: "#0071e3", textDecoration: "none" }}>www.ldi.nrw.de</a>
            </p>
          </Block>

          <Block title="11. Datensicherheit">
            <p>Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten gegen Verlust, Manipulation, unbefugten Zugriff sowie sonstige unberechtigte Verarbeitungen zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend angepasst.</p>
            <p>Die Übertragung personenbezogener Daten zwischen Ihrem Browser und unserer Website erfolgt verschlüsselt mittels aktueller TLS-Verschlüsselung.</p>
          </Block>

          <Block title="12. Automatisierte Entscheidungsfindung">
            <p>Eine ausschließlich automatisierte Entscheidungsfindung einschließlich Profiling gemäß Art. 22 DSGVO findet nicht statt.</p>
            <p>Die Entscheidung über die Auswahl geeigneter Bewerber sowie über eine Vermittlung erfolgt ausschließlich durch Mitarbeiter der PHE-Perm Engineering Ingenieure &amp; Techniker GmbH.</p>
          </Block>

          <Block title="13. Änderungen dieser Datenschutzerklärung">
            <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, sofern dies aufgrund geänderter gesetzlicher Vorgaben, technischer Entwicklungen oder Änderungen unserer Dienstleistungen erforderlich wird.</p>
            <p>Es gilt jeweils die auf unserer Website veröffentlichte aktuelle Fassung.</p>
            <p style={{ color: "#707070", fontSize: 14 }}>Stand: September 2026</p>
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
