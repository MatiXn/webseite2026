"use client";
import Link from "next/link";
import Nav, { WA_LINK } from "../components/Nav";
import FaqSection from "../components/FaqSection";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";

const TEAM = [
  { name: "Matin Askaryar", role: "Geschäftsführer & Gründer" },
  { name: "Mobin Askaryar", role: "Co-Founder & Operations" },
  { name: "Thanan Indirasenan", role: "Senior Recruiter" },
  { name: "Alexandros Selemidis", role: "Recruiter" },
  { name: "Milo", role: "Business Development" },
];

const STATS = [
  { value: "3.000+", label: "betreute Bewerber" },
  { value: "80+", label: "Städte bundesweit" },
  { value: "100%", label: "Festanstellung" },
  { value: "0 €", label: "Kosten für Bewerber" },
];

const VALUES = [
  {
    num: "01",
    title: "Branchenfokus",
    text: "Wir sind ausschließlich in Elektrotechnik, IT und Bau aktiv, keine Kompromisse, keine Ablenkung. Diese Spezialisierung macht uns zum besten Ansprechpartner für Fachkräfte und Unternehmen in diesen Bereichen.",
  },
  {
    num: "02",
    title: "Effizienter Prozess",
    text: "Klare Abläufe, vordefinierte Pakete und direkte Kommunikation. Wir verschwenden keine Zeit, weder Ihre noch unsere. Von der ersten Anfrage bis zur erfolgreichen Einstellung in wenigen Wochen.",
  },
  {
    num: "03",
    title: "Persönliche Betreuung",
    text: "Ein fester Ansprechpartner vom Erstkontakt bis zum ersten Arbeitstag. Wir kennen unsere Kandidaten und unsere Kunden, das ist der Unterschied zu anonymen Jobbörsen.",
  },
];

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function UeberUnsPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />

      {/* HERO — on Fog (#f5f5f7) */}
      <section style={{ background: "#f5f5f7", padding: "80px 24px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Über uns
          </p>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, maxWidth: 700, marginBottom: 24 }}>
            Menschen verbinden.<br />
            Karrieren gestalten.
          </h1>
          <p style={{ fontSize: 19, color: "#707070", lineHeight: 1.6, maxWidth: 620 }}>
            PHE-Perm Engineering Ingenieure &amp; Techniker GmbH ist eine spezialisierte Personalvermittlung für IT-, Elektro- und Baufachkräfte, mit Sitz in Düsseldorf und bundesweiter Reichweite.
          </p>
        </div>
      </section>

      {/* STATS — on White */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: "#f5f5f7", borderRadius: 28, padding: "36px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 44, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 8 }}>{s.value}</p>
              <p style={{ fontSize: 15, color: "#707070", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION — on Fog */}
      <section style={{ background: "#f5f5f7", padding: "80px 24px" }}>
        <div className="grid-2col" style={{ maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Unsere Mission
            </p>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 24 }}>
              Passgenaue Vermittlung ohne Umwege
            </h2>
            <p style={{ fontSize: 17, color: "#707070", lineHeight: 1.6, marginBottom: 20 }}>
              Wir glauben, dass der richtige Job das Leben verändert. Deshalb setzen wir alles daran, Fachkräfte und Unternehmen zusammenzubringen, schnell, effizient und menschlich.
            </p>
            <p style={{ fontSize: 17, color: "#707070", lineHeight: 1.6 }}>
              Keine Zeitarbeit. Keine Leiharbeit. Nur direkte Festanstellungen, bei Unternehmen, die wirklich zu Ihnen passen.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {VALUES.map(v => (
              <div key={v.num} style={{ display: "flex", gap: 20, padding: 28, borderRadius: 28, background: "#fff" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0071e3", opacity: 0.5, flexShrink: 0, paddingTop: 2 }}>{v.num}</span>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>{v.title}</p>
                  <p style={{ fontSize: 15, color: "#707070", lineHeight: 1.6 }}>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — on White */}
      <section style={{ background: "#fff", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 16 }}>
            Bereit für den nächsten Schritt?
          </h2>
          <p style={{ fontSize: 17, color: "#707070", lineHeight: 1.6, marginBottom: 40 }}>
            Kontaktieren Sie uns per WhatsApp oder E-Mail, kostenlos, unverbindlich und direkt.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#0071e3", color: "#fff", fontWeight: 600, fontSize: 17,
              padding: "16px 32px", borderRadius: 999, textDecoration: "none",
            }}>
              <WhatsAppIcon /> Jetzt bewerben
            </a>
            <Link href="/kontakt" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f5f5f7", color: "#1d1d1f", fontWeight: 600, fontSize: 17,
              padding: "16px 32px", borderRadius: 999, textDecoration: "none",
            }}>
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      <div style={{ background: "#f5f5f7" }}>
        <FaqSection title="Häufige Fragen über PHE-Perm Engineering" items={[
          { q: "Was ist PHE-Perm Engineering?", a: "PHE-Perm Engineering Ingenieure & Techniker GmbH ist eine spezialisierte Personalvermittlung mit Sitz in Düsseldorf. Wir vermitteln Fachkräfte aus den Bereichen Elektrotechnik, IT & Automation und Bau in Festanstellungen bei deutschen Unternehmen." },
          { q: "Wo ist PHE-Perm Engineering ansässig?", a: "Unser Hauptsitz befindet sich in der Hüttenstraße 30, 40215 Düsseldorf. Wir sind jedoch bundesweit tätig und vermitteln Stellen in über 80 deutschen Städten." },
          { q: "Was unterscheidet PHE von anderen Personalvermittlungen?", a: "Wir sind ausschließlich auf IT, Elektro und Bau spezialisiert, keine Generalagentur. Das bedeutet: tiefes Branchenwissen, gezielte Kandidatenauswahl und echte Kontakte zu den richtigen Unternehmen. Dazu persönliche Betreuung statt anonymer Prozesse." },
          { q: "Ist PHE eine Zeitarbeitsfirma?", a: "Nein. PHE-Perm Engineering vermittelt ausschließlich Direktanstellungen, Sie werden direkt und unbefristet beim Unternehmen angestellt. Keine Zeitarbeit, keine Leiharbeit, keine befristeten Verträge." },
          { q: "Mit wie vielen Bewerbern hat PHE bereits gearbeitet?", a: "Wir haben bis heute mit rund 3.000 Bewerbern zusammengearbeitet und vermitteln laufend Fachkräfte aus Elektrotechnik, Mechatronik, IT und Bau in Festanstellungen – deutschlandweit." },
          { q: "Wer kann sich bei PHE bewerben?", a: "Alle Fachkräfte mit Qualifikationen in IT, Elektrotechnik oder Bau. Ob Berufseinsteiger oder erfahrene Führungskraft, wir finden die passende Stelle für Ihr Profil." },
        ]} />
      </div>

      {/* Referenziert die globale Organization aus layout.tsx per @id statt sie zu duplizieren */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Über PHE-Perm Engineering",
        "url": "https://www.phe-perm.de/ueber-uns",
        "about": { "@id": "https://www.phe-perm.de/#organization" },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phe-perm.de" },
          { "@type": "ListItem", "position": 2, "name": "Über uns", "item": "https://www.phe-perm.de/ueber-uns" },
        ],
      }} />

      <Footer />
    </div>
  );
}
