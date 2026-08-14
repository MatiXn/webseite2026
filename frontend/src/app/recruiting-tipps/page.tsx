// Recruiting-Tipps – kandidatenorientierte, sachliche Ratgeberseite (statisch, CDN-schnell).
// Nur belegbare Aussagen aus dem realen PHE-Perm-Modell (Direktvermittlung, Festanstellung,
// keine Zeitarbeit, kostenlos für Bewerber, WhatsApp, Lebenslauf-Tool, kein Anschreiben).
// Keine erfundenen Zahlen/Garantien. Ziel: funktionierende Sitelink-Landingpage + SEO-Inhalt.
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import Breadcrumbs from "../components/Breadcrumbs";
import FaqSection from "../components/FaqSection";
import { contact } from "../../content/contact";

const wrap: React.CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "48px 24px" };
const h2: React.CSSProperties = { fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 14 };
const body: React.CSSProperties = { fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 };
const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };

const TIPPS = [
  {
    title: "Kein Anschreiben nötig – Ihr Lebenslauf reicht",
    text: "Bei uns bewerben Sie sich ohne aufwändiges Anschreiben. Entscheidend ist ein klarer Lebenslauf mit Ihren technischen Qualifikationen. Kostenlos erstellen können Sie ihn direkt hier.",
    href: "/lebenslauf-erstellen",
    linkLabel: "Lebenslauf kostenlos erstellen",
  },
  {
    title: "Zeigen Sie Ihre technische Substanz",
    text: "Nennen Sie konkrete Qualifikationen: Ausbildung/Weiterbildung, eingesetzte Technologien und Anlagen, relevante Zertifikate (z. B. Schaltberechtigung, Sachkunde) sowie Ihre Einsatzbereiche. Konkrete Beispiele wirken stärker als allgemeine Floskeln.",
  },
  {
    title: "Direktvermittlung verstehen – keine Zeitarbeit",
    text: "Wir vermitteln Sie direkt in Festanstellung an das einstellende Unternehmen. Keine Zeitarbeit, keine Arbeitnehmerüberlassung. Für Bewerber ist die Vermittlung kostenlos und vertraulich – wir stellen Sie erst nach Ihrer Zustimmung vor.",
    href: "/technische-personalvermittlung",
    linkLabel: "Wie wir vermitteln",
  },
  {
    title: "Nur passende Stellen – kein Massenversand",
    text: "Wir gleichen Ihr Profil gezielt mit passenden Positionen ab, statt Ihre Unterlagen breit zu streuen. Sie entscheiden, welche Stellen für Sie in Frage kommen.",
    href: "/jobs",
    linkLabel: "Aktuelle Stellen ansehen",
  },
  {
    title: "Der schnellste Weg: kurze Nachricht über WhatsApp",
    text: "Sie müssen nicht warten, bis die perfekte Anzeige online ist. Melden Sie sich unverbindlich – auch initiativ. Wir melden uns persönlich und besprechen Ihre Ziele und Ihr Wunsch-Einsatzgebiet.",
    href: contact.whatsappLink,
    linkLabel: "Unverbindlich über WhatsApp anfragen",
    external: true,
  },
  {
    title: "So läuft es nach Ihrer Bewerbung",
    text: "Persönliches Gespräch, Abgleich Ihres Profils mit passenden Positionen, Vorstellung nur nach Absprache und Begleitung bis zur Vertragsentscheidung. Ihre Unterlagen geben wir ausschließlich nach Ihrer ausdrücklichen Zustimmung weiter.",
  },
];

const FAQ = [
  { q: "Ist die Vermittlung für Bewerber kostenlos?", a: "Ja. Für Bewerber ist die Vermittlung kostenlos." },
  { q: "Brauche ich ein Anschreiben?", a: "Nein. Ein aussagekräftiger Lebenslauf genügt; ein Anschreiben ist nicht erforderlich." },
  { q: "Ist meine Bewerbung vertraulich?", a: "Ja. Ihre Angaben behandeln wir vertraulich und stellen Sie erst nach Ihrer ausdrücklichen Zustimmung bei einem Unternehmen vor." },
  { q: "Vermittelt PHE-Perm ausschließlich in Festanstellung?", a: "Ja. Die Vermittlung erfolgt direkt an das einstellende Unternehmen – keine Zeitarbeit und keine Arbeitnehmerüberlassung." },
  { q: "Kann ich mich melden, obwohl aktuell keine passende Stelle ausgeschrieben ist?", a: "Ja. Sie können sich jederzeit initiativ melden; wir gleichen Ihr Profil laufend mit passenden Positionen ab und melden uns persönlich." },
];

export default function RecruitingTippsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={faqSchema} />
      <Nav />
      <Breadcrumbs items={[
        { name: "Home", href: "/" },
        { name: "Recruiting-Tipps", href: "/recruiting-tipps" },
      ]} />

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 8px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Für Bewerber · Recruiting-Tipps</p>
        <h1 style={{ fontSize: "clamp(28px,4.2vw,44px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18, textWrap: "balance" }}>
          Recruiting-Tipps für technische Fachkräfte
        </h1>
        <p style={{ ...body, fontSize: 18, color: "#586170", maxWidth: 680, marginBottom: 24 }}>
          So bewerben Sie sich als technische Fachkraft mit wenig Aufwand und guten Chancen – direkt in Festanstellung, kostenlos und vertraulich.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="pathswitch-cta pathswitch-cta--primary">Unverbindlich über WhatsApp anfragen</a>
          <Link href="/jobs" className="pathswitch-cta pathswitch-cta--secondary">Aktuelle Stellen ansehen</Link>
        </div>
      </section>

      {/* Tipps */}
      <section style={wrap}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {TIPPS.map((t, i) => (
            <div key={t.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: "#1e3a5f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{i + 1}</span>
              <div>
                <h2 style={{ ...h2, fontSize: 20, marginBottom: 8 }}>{t.title}</h2>
                <p style={{ ...body, marginBottom: t.href ? 8 : 0 }}>{t.text}</p>
                {t.href && (
                  t.external
                    ? <a href={t.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{t.linkLabel} →</a>
                    : <Link href={t.href} style={linkStyle}>{t.linkLabel} →</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title="Häufige Fragen zur Bewerbung" items={FAQ} />
      </div>

      {/* CTA */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ ...h2, marginBottom: 20 }}>Bereit für den nächsten Schritt?</h2>
        <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="pathswitch-cta pathswitch-cta--primary">Unverbindlich über WhatsApp anfragen</a>
        <p style={{ fontSize: 15, lineHeight: 1.9, marginTop: 24, color: "#586170" }}>
          <Link href="/lebenslauf-erstellen" style={linkStyle}>Lebenslauf kostenlos erstellen</Link>
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
