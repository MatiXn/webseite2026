"use client";
import Link from "next/link";
import { useState } from "react";
import Nav, { WA_LINK } from "../components/Nav";
import FaqSection from "../components/FaqSection";
import JsonLd from "../components/JsonLd";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", type: "bewerber" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hallo PHE-Team,%0A%0AName: ${form.name}%0AE-Mail: ${form.email}%0ATelefon: ${form.phone}%0AArt: ${form.type === "bewerber" ? "Bewerber" : "Unternehmen"}%0A%0ANachricht:%0A${form.message}`;
    window.open(`${WA_LINK}?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />

      <div className="section-pad px-section" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Kontakt
          </p>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 16 }}>
            Wir sind für Sie da.
          </h1>
          <p style={{ fontSize: 17, color: "var(--gray)", lineHeight: 1.7, maxWidth: 520 }}>
            Ob Sie als Bewerber eine neue Stelle suchen oder als Unternehmen Fachkräfte benötigen, sprechen Sie uns an. Schnell, direkt, persönlich.
          </p>
        </div>

        <div className="kontakt-grid" style={{ alignItems: "start" }}>
          {/* LEFT, CONTACT INFO */}
          <div>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", marginBottom: 24 }}>Direktkontakt</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: <PhoneIcon />, label: "Telefon", value: "0211 158 63 100", href: "tel:+4921115863100" },
                  { icon: <MailIcon />, label: "E-Mail", value: "info@phe-perm.de", href: "mailto:info@phe-perm.de" },
                  { icon: <LocationIcon />, label: "Adresse", value: "Hüttenstraße 30\n40215 Düsseldorf", href: "https://maps.google.com/?q=Hüttenstraße+30+40215+Düsseldorf" },
                ].map(item => (
                  <a key={item.label} href={item.href} target={item.label === "Adresse" ? "_blank" : undefined} rel="noreferrer" style={{
                    display: "flex", gap: 14, padding: "16px 20px",
                    borderRadius: 16, textDecoration: "none",
                    background: "#fff",
                  }}>
                    <span style={{ color: "var(--blue)", flexShrink: 0, paddingTop: 1 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-light)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", whiteSpace: "pre-line" }}>{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div style={{ background: "#fff", borderRadius: 28, padding: "20px 24px", marginBottom: 40 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>Lieber per WhatsApp?</p>
              <p style={{ fontSize: 13, color: "#707070", marginBottom: 14, lineHeight: 1.5 }}>
                Die schnellste Art uns zu erreichen, wir antworten in der Regel innerhalb weniger Stunden.
              </p>
              <a href={WA_LINK} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 14,
                padding: "10px 20px", borderRadius: 999, textDecoration: "none",
              }}>
                <WhatsAppIcon /> WhatsApp öffnen
              </a>
            </div>

            {/* Social */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--gray)", marginBottom: 12 }}>Auch erreichbar auf</p>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { icon: <InstagramIcon />, label: "Instagram", href: "https://instagram.com/phe_perm_engineering" },
                  { icon: <LinkedInIcon />, label: "LinkedIn", href: "https://linkedin.com/company/phe-perm-engineering" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#fff", borderRadius: 999,
                    padding: "9px 16px", textDecoration: "none",
                    fontSize: 13, fontWeight: 600, color: "var(--navy)",
                  }}>
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT, FORM */}
          <div style={{ background: "#fff", borderRadius: 28, padding: "32px 28px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--wa)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <p style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>WhatsApp geöffnet</p>
                <p style={{ fontSize: 14, color: "var(--gray)" }}>Ihre Nachricht ist vorbereitet, senden Sie diese jetzt ab.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 24, background: "none", border: "1.5px solid var(--border)", borderRadius: 999, padding: "10px 20px", fontSize: 14, cursor: "pointer", color: "var(--gray)" }}>
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", marginBottom: 24 }}>Nachricht senden</h2>

                {/* Type toggle */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#f5f5f7", borderRadius: 999, padding: 4 }}>
                  {[["bewerber", "Ich suche einen Job"], ["unternehmen", "Ich suche Fachkräfte"]].map(([val, lab]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, type: val }))} style={{
                      flex: 1, padding: "9px 0", borderRadius: 999, border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: 700,
                      background: form.type === val ? "#0071e3" : "transparent",
                      color: form.type === val ? "#fff" : "var(--gray)",
                      transition: "all .15s",
                    }}>
                      {lab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="grid-2col" style={{ gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--gray)", display: "block", marginBottom: 6 }}>Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ihr Name"
                        style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1d1d1f", outline: "none", background: "#fff" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--gray)", display: "block", marginBottom: 6 }}>Telefon</label>
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+49 ..."
                        style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1d1d1f", outline: "none", background: "#fff" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--gray)", display: "block", marginBottom: 6 }}>E-Mail *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="deine@email.de"
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1d1d1f", outline: "none", background: "#fff" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--gray)", display: "block", marginBottom: 6 }}>Nachricht *</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={form.type === "bewerber" ? "Welche Stelle suchen Sie? In welcher Region möchten Sie tätig sein?" : "Welche Fachkraft suchen Sie? Standort, Erfahrung etc."}
                      rows={5}
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1d1d1f", outline: "none", resize: "vertical", background: "#fff" }} />
                  </div>
                  <button type="submit" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "var(--wa)", color: "#fff", fontWeight: 700, fontSize: 15,
                    padding: "14px", borderRadius: 999, border: "none", cursor: "pointer",
                  }}>
                    <WhatsAppIcon /> Via WhatsApp senden
                  </button>
                  <p style={{ fontSize: 12, color: "var(--gray-light)", textAlign: "center" }}>
                    Ihre Nachricht wird via WhatsApp an unser Team weitergeleitet.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <FaqSection title="Häufige Fragen zum Kontakt" items={[
          { q: "Wie kann ich PHE Perm Engineering am schnellsten erreichen?", a: "Am schnellsten erreichen Sie uns telefonisch unter 0211 158 63 100 oder via WhatsApp. Wir sind für Sie da und antworten in der Regel innerhalb weniger Stunden." },
          { q: "Kann ich PHE auch telefonisch kontaktieren?", a: "Ja, Sie erreichen uns direkt unter 0211 158 63 100. Für schnelle Rückfragen stehen wir Ihnen auch gerne per WhatsApp oder telefonisch zur Verfügung, ganz wie es Ihnen am liebsten ist." },
          { q: "Auf welchen Wegen kann ich Fragen stellen?", a: "Sie können uns jederzeit per WhatsApp oder telefonisch kontaktieren. Beide Wege sind schnell und direkt, wir antworten zeitnah auf Ihre Anfrage." },
          { q: "Wo befindet sich das Büro von PHE Perm Engineering?", a: "Unser Büro befindet sich in der Hüttenstraße 30, 40215 Düsseldorf. Gerne können Sie uns persönlich besuchen, vereinbaren Sie vorab telefonisch oder per WhatsApp einen Termin." },
          { q: "Auf welchen sozialen Netzwerken ist PHE aktiv?", a: "Sie finden uns auf Instagram und LinkedIn. Dort teilen wir regelmäßig neue Stellenangebote und Karrieretipps, folgen Sie uns, um immer auf dem Laufenden zu bleiben." },
          { q: "Kann ich auch als Unternehmen Fachkräfte anfragen?", a: "Ja. Wählen Sie im Kontaktformular 'Ich suche Fachkräfte' und beschreiben Sie Ihre Anforderungen. Wir melden uns zeitnah mit passenden Kandidatenprofilen." },
        ]} />
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Kontakt – PHE Perm Engineering",
        "description": "Kontaktiere PHE Perm Engineering per WhatsApp, Telefon oder E-Mail. Wir antworten innerhalb weniger Stunden.",
        "url": "https://phe-perm.de/kontakt",
        "mainEntity": {
          "@type": "LocalBusiness",
          "name": "PHE-Perm Engineering Ingenieure & Techniker GmbH",
          "telephone": "+491739980100",
          "email": "info@phe-perm.de",
          "address": { "@type": "PostalAddress", "streetAddress": "Hüttenstraße 30", "addressLocality": "Düsseldorf", "postalCode": "40215", "addressCountry": "DE" },
          "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" }
        }
      }} />

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 48px", background: "var(--bg)", marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "var(--gray-light)" }}>
            © 2025 PHE-Perm Engineering Ingenieure & Techniker GmbH · Hüttenstraße 30, 40215 Düsseldorf
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/ueber-uns" style={{ fontSize: 13, color: "var(--gray)", textDecoration: "none" }}>Über uns</Link>
            <Link href="/jobs" style={{ fontSize: 13, color: "var(--gray)", textDecoration: "none" }}>Stellenangebote</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
