"use client";
import { useState } from "react";
import Nav from "@/app/components/Nav";

const MAIL_EMPLOYER = "recruiting@phe-perm.de";

const CATEGORIES = [
  "Elektrotechnik / Instandhaltung",
  "Automatisierung / SPS / IT",
  "Mechatronik / Kältetechnik",
  "Bau / Haustechnik / SHK",
  "Mehrere Bereiche",
  "Sonstiges",
];

const VOLUMES = [
  "1 – 3 Fachkräfte",
  "4 – 10 Fachkräfte",
  "10 – 25 Fachkräfte",
  "25+ Fachkräfte",
];

function ContactForm() {
  const [form, setForm] = useState({
    company: "", contact: "", email: "", phone: "",
    category: "", volume: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const canSubmit = !!(form.company && form.contact && form.email && form.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Unternehmen: ${form.company}`,
      `Ansprechpartner: ${form.contact}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone}`,
      `Bereich: ${form.category}`,
      `Umfang: ${form.volume}`,
      `\nNachricht:\n${form.message}`,
    ].join("\n");
    window.location.href = `mailto:${MAIL_EMPLOYER}?subject=Talentanfrage%20–%20${encodeURIComponent(form.company)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(0,113,227,0.12)", border: "2px solid rgba(0,113,227,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: 22, color: "#0071e3",
        }}>&#10003;</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1d1d1f", marginBottom: 8 }}>
          Anfrage abgeschickt!
        </h3>
        <p style={{ color: "#707070", fontSize: 15, lineHeight: 1.6 }}>
          Ihr E-Mail-Programm öffnet sich. Ein Berater meldet sich innerhalb von 24 Stunden.
        </p>
        <button onClick={() => setSent(false)} style={{
          marginTop: 20, fontSize: 14, color: "#0071e3",
          background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
        }}>
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", fontSize: 15, borderRadius: 10,
    border: "1px solid #d2d2d7", background: "#fff",
    outline: "none", boxSizing: "border-box", color: "#1d1d1f", fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "#707070",
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: 6, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="form-grid">
        <div><label style={lbl}>Unternehmen *</label>
          <input style={inp} placeholder="Musterfirma GmbH" value={form.company} onChange={set("company")} required/>
        </div>
        <div><label style={lbl}>Ansprechpartner *</label>
          <input style={inp} placeholder="Max Mustermann" value={form.contact} onChange={set("contact")} required/>
        </div>
        <div><label style={lbl}>E-Mail *</label>
          <input style={inp} type="email" placeholder="max@firma.de" value={form.email} onChange={set("email")} required/>
        </div>
        <div><label style={lbl}>Telefon</label>
          <input style={inp} type="tel" placeholder="+49 211 ..." value={form.phone} onChange={set("phone")}/>
        </div>
        <div><label style={lbl}>Gesuchte Fachkräfte *</label>
          <select style={inp} value={form.category} onChange={set("category")} required>
            <option value="">Bitte wählen ...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={lbl}>Anzahl</label>
          <select style={inp} value={form.volume} onChange={set("volume")}>
            <option value="">Bitte wählen ...</option>
            {VOLUMES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div><label style={lbl}>Ihre Anfrage</label>
        <textarea style={{ ...inp, minHeight: 96, resize: "vertical" }}
          placeholder="Kurz beschreiben: Anforderungen, Qualifikationen, Einsatzort ..."
          value={form.message} onChange={set("message")}/>
      </div>
      <button type="submit" disabled={!canSubmit} style={{
        background: canSubmit ? "#0071e3" : "#d2d2d7",
        color: canSubmit ? "#fff" : "#707070", fontSize: 17, fontWeight: 600,
        padding: "16px 28px", borderRadius: 999,
        border: "none",
        cursor: canSubmit ? "pointer" : "not-allowed", transition: "opacity 0.2s",
      }}>
        Anfrage senden
      </button>
      <p style={{ fontSize: 12, color: "#707070", marginTop: -4 }}>
        * Pflichtfelder. Ein Berater meldet sich innerhalb von 24 Stunden.
      </p>
    </form>
  );
}

export default function TalenteFindPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav/>
      <main>

        {/* HERO — on Fog */}
        <section style={{ background: "#f5f5f7", padding: "80px 24px 64px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <span style={{
                display: "inline-block", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#0071e3",
                marginBottom: 24,
              }}>Für Unternehmen in Deutschland</span>

              <h1 style={{
                fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, lineHeight: 1.1,
                color: "#1d1d1f", marginBottom: 20, letterSpacing: "-0.015em",
              }}>
                Finden Sie Ihre<br/>
                Technik-Fachkräfte<br/>
                in Deutschland
              </h1>

              <p style={{ fontSize: 19, color: "#707070", lineHeight: 1.6, marginBottom: 32, maxWidth: 440 }}>
                PHE Perm Engineering vermittelt qualifizierte Elektro- &amp;
                Technik-Fachkräfte in Festanstellung, schnell, persönlich, ohne Risiko.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
                {["Kostenlose Erstberatung","Nur Festanstellung","Deutschlandweit","48h Reaktionszeit"].map(t => (
                  <span key={t} style={{
                    fontSize: 13, fontWeight: 500, color: "#1d1d1f",
                    background: "#fff",
                    borderRadius: 999, padding: "6px 14px",
                  }}>{t}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 40 }}>
                {[
                  { n: "5.000+", l: "Kandidaten" },
                  { n: "Ø 4 Wo.", l: "bis Einstellung" },
                  { n: "100%",   l: "Festanstellung" },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{s.n}</div>
                    <div style={{ fontSize: 13, color: "#707070", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card — on Fog bg, so card is white */}
            <div style={{
              background: "#fff",
              borderRadius: 28,
              padding: "36px 32px",
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 6 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 15, color: "#707070", marginBottom: 24, lineHeight: 1.6 }}>
                Ein Berater meldet sich innerhalb von 24 Stunden.
              </p>
              <ContactForm/>
            </div>
          </div>
        </section>

        {/* PROCESS — on White */}
        <section style={{ background: "#fff", padding: "80px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 12 }}>
              So einfach funktioniert es
            </h2>
            <p style={{ color: "#707070", fontSize: 17, marginBottom: 48 }}>Von der Anfrage zur besetzten Stelle, in 4 Schritten</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { s: "01", t: "Anfrage stellen",  d: "Per Formular, Telefon oder WhatsApp, Ihr Bedarf in wenigen Minuten übermittelt." },
                { s: "02", t: "Matching",          d: "Wir analysieren Ihre Anforderungen und matchen Kandidaten aus unserem Pool." },
                { s: "03", t: "Profile erhalten",  d: "Geprüfte Profile mit Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { s: "04", t: "Einstellung",       d: "Wir koordinieren Interviews und begleiten bis zum Vertragsabschluss." },
              ].map(item => (
                <div key={item.s} style={{
                  background: "#f5f5f7",
                  borderRadius: 28, padding: "28px 24px", textAlign: "left",
                }}>
                  <div style={{ fontSize: 40, fontWeight: 700, color: "#d2d2d7", letterSpacing: "-0.04em", marginBottom: 16 }}>{item.s}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>{item.t}</h3>
                  <p style={{ fontSize: 15, color: "#707070", lineHeight: 1.6 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS — on Fog */}
        <section style={{ background: "#f5f5f7", padding: "80px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 12, textAlign: "center" }}>
              Warum PHE?
            </h2>
            <p style={{ color: "#707070", fontSize: 17, marginBottom: 48, textAlign: "center" }}>
              Ihr Partner für Fachkräfte in Elektro, Mechatronik &amp; Bau
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { t: "Schnelle Besetzung",    d: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                { t: "Qualifizierte Profile",  d: "Nur geprüfte Fachkräfte mit passendem Background" },
                { t: "Persönliche Betreuung", d: "Fester Ansprechpartner, kein Callcenter" },
                { t: "Erfolgsbasiert",         d: "Sie zahlen nur bei erfolgreicher Vermittlung" },
              ].map(b => (
                <div key={b.t} style={{
                  background: "#fff",
                  borderRadius: 28, padding: "28px 24px",
                }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>{b.t}</div>
                  <div style={{ fontSize: 15, color: "#707070", lineHeight: 1.6 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — on White */}
        <section style={{ background: "#fff", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 16 }}>
              Lieber direkt sprechen?
            </h2>
            <p style={{ color: "#707070", fontSize: 17, lineHeight: 1.6, marginBottom: 40 }}>
              Rufen Sie uns an oder schreiben Sie uns auf WhatsApp, kostenlos und unverbindlich.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#0071e3", color: "#fff", fontSize: 17, fontWeight: 600,
                padding: "16px 32px", borderRadius: 999, textDecoration: "none",
              }}>0211 158 63 100</a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte." style={{
                background: "#f5f5f7", color: "#1d1d1f", fontSize: 17, fontWeight: 600,
                padding: "16px 32px", borderRadius: 999, textDecoration: "none",
              }}>WhatsApp anfragen</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
