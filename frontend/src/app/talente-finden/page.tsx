"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import FaqSection from "@/app/components/FaqSection";

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

/* ── Germany map data ─────────────────────────────────────────────────── */

// Simplified Germany outline, clockwise from Flensburg/NW
const DE_OUTLINE =
  "M218,22 L248,14 L288,18 L325,32 L345,68 L352,108 " +
  "L368,150 L374,192 L370,232 L355,268 L338,300 L315,338 " +
  "L292,372 L265,395 L238,408 L205,408 L175,388 L152,365 " +
  "L130,335 L108,305 L95,270 L82,238 L78,205 L82,178 " +
  "L78,152 L90,125 L112,108 L148,88 L178,65 L198,38 Z";

const CITIES = [
  { id: "hh", name: "Hamburg",   x: 220, y: 80  },
  { id: "ha", name: "Hannover",  x: 200, y: 148 },
  { id: "be", name: "Berlin",    x: 325, y: 158 },
  { id: "br", name: "Bremen",    x: 188, y: 108 },
  { id: "do", name: "Dortmund",  x: 120, y: 190 },
  { id: "ko", name: "Köln",      x: 110, y: 210 },
  { id: "ff", name: "Frankfurt", x: 182, y: 258 },
  { id: "le", name: "Leipzig",   x: 280, y: 198 },
  { id: "dr", name: "Dresden",   x: 318, y: 220 },
  { id: "nu", name: "Nürnberg",  x: 270, y: 308 },
  { id: "st", name: "Stuttgart", x: 172, y: 322 },
  { id: "mu", name: "München",   x: 260, y: 368 },
];

const CONNECTIONS: [string, string][] = [
  ["hh", "br"], ["hh", "ha"], ["hh", "be"],
  ["br", "do"], ["ha", "do"], ["ha", "le"], ["ha", "be"],
  ["do", "ko"], ["ko", "ff"],
  ["ff", "le"], ["ff", "st"], ["ff", "nu"],
  ["le", "be"], ["le", "dr"],
  ["dr", "be"], ["nu", "mu"], ["st", "mu"],
];

function GermanyMap() {
  const cityMap = Object.fromEntries(CITIES.map(c => [c.id, c]));

  return (
    <svg
      viewBox="0 0 450 440"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b72b8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3b72b8" stopOpacity="0" />
        </radialGradient>
        <filter id="cityGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse cx="225" cy="215" rx="220" ry="200" fill="url(#mapGlow)" />

      {/* Germany outline – draws itself on load */}
      <path
        d={DE_OUTLINE}
        fill="rgba(59,114,184,0.04)"
        stroke="rgba(59,114,184,0.55)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ strokeDasharray: 2200, animation: "drawMap 4s ease-out forwards" }}
      />

      {/* Connection lines */}
      {CONNECTIONS.map(([a, b]) => {
        const ca = cityMap[a], cb = cityMap[b];
        if (!ca || !cb) return null;
        return (
          <line key={`${a}-${b}`}
            x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
            stroke="rgba(59,114,184,0.22)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        );
      })}

      {/* City nodes with SMIL pulse animations */}
      {CITIES.map((c, i) => (
        <g key={c.id} filter="url(#cityGlow)">
          {/* Expanding ring */}
          <circle cx={c.x} cy={c.y} r="3" fill="none"
            stroke="rgba(59,114,184,0.6)" strokeWidth="1">
            <animate attributeName="r" values="3;15" dur="2.4s"
              begin={`${i * 0.22}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0" dur="2.4s"
              begin={`${i * 0.22}s`} repeatCount="indefinite" />
          </circle>
          {/* Core dot */}
          <circle cx={c.x} cy={c.y} r="3.5" fill="#3b72b8">
            <animate attributeName="opacity" values="1;0.55;1" dur="3s"
              begin={`${i * 0.18}s`} repeatCount="indefinite" />
          </circle>
          {/* Label */}
          <text
            x={c.x + 7} y={c.y + 4}
            fontSize="7.5" fill="rgba(148,180,220,0.65)"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Contact form ──────────────────────────────────────────────────────── */

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
    window.location.href =
      `mailto:${MAIL_EMPLOYER}?subject=Talentanfrage%20–%20${encodeURIComponent(form.company)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(59,114,184,0.2)", border: "2px solid rgba(59,114,184,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: 22, color: "#7eb3f0",
        }}>✓</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          Anfrage abgeschickt!
        </h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6 }}>
          Ihr E-Mail-Programm öffnet sich. Ein Berater meldet sich innerhalb von 24 Stunden.
        </p>
        <button onClick={() => setSent(false)} style={{
          marginTop: 20, fontSize: 14, color: "#7eb3f0",
          background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
        }}>
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", fontSize: 15, borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    outline: "none", boxSizing: "border-box",
    color: "#fff", fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: 6, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="form-grid">
        <div>
          <label style={lbl}>Unternehmen *</label>
          <input style={inp} placeholder="Musterfirma GmbH" value={form.company} onChange={set("company")} required />
        </div>
        <div>
          <label style={lbl}>Ansprechpartner *</label>
          <input style={inp} placeholder="Max Mustermann" value={form.contact} onChange={set("contact")} required />
        </div>
        <div>
          <label style={lbl}>E-Mail *</label>
          <input style={inp} type="email" placeholder="max@firma.de" value={form.email} onChange={set("email")} required />
        </div>
        <div>
          <label style={lbl}>Telefon</label>
          <input style={inp} type="tel" placeholder="+49 211 ..." value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <label style={lbl}>Gesuchte Fachkräfte *</label>
          <select style={{ ...inp, colorScheme: "dark" }} value={form.category} onChange={set("category")} required>
            <option value="" style={{ background: "#1a2d45", color: "#fff" }}>Bitte wählen …</option>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#1a2d45", color: "#fff" }}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Anzahl</label>
          <select style={{ ...inp, colorScheme: "dark" }} value={form.volume} onChange={set("volume")}>
            <option value="" style={{ background: "#1a2d45", color: "#fff" }}>Bitte wählen …</option>
            {VOLUMES.map(v => <option key={v} value={v} style={{ background: "#1a2d45", color: "#fff" }}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={lbl}>Ihre Anfrage</label>
        <textarea style={{ ...inp, minHeight: 88, resize: "vertical" }}
          placeholder="Kurz beschreiben: Anforderungen, Qualifikationen, Einsatzort …"
          value={form.message} onChange={set("message")} />
      </div>
      <button type="submit" disabled={!canSubmit} style={{
        background: canSubmit ? "#3b72b8" : "rgba(255,255,255,0.1)",
        color: canSubmit ? "#fff" : "rgba(255,255,255,0.35)",
        fontSize: 16, fontWeight: 600,
        padding: "14px 28px", borderRadius: 999,
        border: "none",
        cursor: canSubmit ? "pointer" : "not-allowed",
        transition: "background 0.2s",
      }}>
        Anfrage senden →
      </button>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: -4 }}>
        * Pflichtfelder. Ein Berater meldet sich innerhalb von 24 Stunden.
      </p>
    </form>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function TalenteFindPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />
      <main>

        {/* ── HERO — dark navy with animated Germany map ── */}
        <section style={{
          background: "#0c1829",
          position: "relative",
          overflow: "hidden",
          padding: "80px 24px 72px",
          minHeight: "calc(100vh - 58px)",
          display: "flex",
          alignItems: "center",
        }}>

          {/* Germany map — right-side background */}
          <div style={{
            position: "absolute",
            top: "50%", right: "-2%",
            transform: "translateY(-50%)",
            width: "52%", height: "90%",
            animation: "mapFloat 8s ease-in-out infinite",
            opacity: 0.9,
            pointerEvents: "none",
          }}>
            <GermanyMap />
          </div>

          {/* Gradient vignette so map fades into background */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, #0c1829 45%, transparent 75%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #0c1829 0%, transparent 20%)",
            pointerEvents: "none",
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2 }}
            className="talente-hero-grid"
          >
            {/* Left: headline + stats */}
            <div style={{ animation: "heroFadeUp 0.7s ease-out forwards" }}>
              <span style={{
                display: "inline-block",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#7eb3f0",
                background: "rgba(59,114,184,0.15)",
                border: "1px solid rgba(59,114,184,0.3)",
                borderRadius: 999, padding: "5px 14px",
                marginBottom: 28,
              }}>
                Für Unternehmen in Deutschland
              </span>

              <h1 style={{
                fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 700, lineHeight: 1.1,
                color: "#fff", marginBottom: 20, letterSpacing: "-0.015em",
              }}>
                Finden Sie Ihre<br />
                <span style={{ color: "#7eb3f0" }}>Technik-Fachkräfte</span><br />
                in Deutschland
              </h1>

              <p style={{
                fontSize: 18, color: "rgba(255,255,255,0.6)",
                lineHeight: 1.65, marginBottom: 36, maxWidth: 420,
              }}>
                PHE-Perm Engineering vermittelt qualifizierte Elektro- &amp;
                Technik-Fachkräfte in Festanstellung — schnell, persönlich, ohne Risiko.
              </p>

              {/* Feature pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 44 }}>
                {[
                  "Kostenlose Erstberatung",
                  "Nur Festanstellung",
                  "Deutschlandweit",
                  "12 Std. Reaktionszeit",
                ].map(t => (
                  <span key={t} style={{
                    fontSize: 13, fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 999, padding: "6px 14px",
                  }}>{t}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 40 }}>
                {[
                  { n: "5.000+", l: "Kandidaten" },
                  { n: "Ø 4 Wo.", l: "bis Einstellung" },
                  { n: "100%",   l: "Festanstellung" },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{
                      fontSize: 26, fontWeight: 700, color: "#fff",
                      letterSpacing: "-0.02em",
                    }}>{s.n}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 24,
              padding: "32px 28px",
              animation: "heroFadeUp 0.7s 0.15s ease-out both",
            }}>
              <h2 style={{ fontSize: 21, fontWeight: 700, color: "#fff", marginBottom: 5 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 22, lineHeight: 1.5 }}>
                Ein Berater meldet sich innerhalb von 24 Stunden.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── PROCESS — dark (to continue the distinctive look) ── */}
        <section style={{ background: "#0f2035", padding: "80px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{
              fontSize: 38, fontWeight: 700, color: "#fff",
              letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 12,
            }}>
              So einfach funktioniert es
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, marginBottom: 48 }}>
              Von der Anfrage zur besetzten Stelle — in 4 Schritten
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { s: "01", t: "Anfrage stellen",  d: "Per Formular, Telefon oder WhatsApp — Ihr Bedarf in wenigen Minuten übermittelt." },
                { s: "02", t: "Matching",          d: "Wir analysieren Ihre Anforderungen und matchen Kandidaten aus unserem Pool." },
                { s: "03", t: "Profile erhalten",  d: "Geprüfte Profile mit Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { s: "04", t: "Einstellung",       d: "Wir koordinieren Interviews und begleiten bis zum Vertragsabschluss." },
              ].map(item => (
                <div key={item.s} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "28px 22px", textAlign: "left",
                }}>
                  <div style={{
                    fontSize: 38, fontWeight: 700,
                    color: "rgba(59,114,184,0.4)",
                    letterSpacing: "-0.04em", marginBottom: 14,
                  }}>{item.s}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{item.t}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS — light section (contrast break) ── */}
        <section style={{ background: "#f5f5f7", padding: "80px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{
              fontSize: 38, fontWeight: 700, color: "#1d1d1f",
              letterSpacing: "-0.015em", lineHeight: 1.1,
              marginBottom: 12, textAlign: "center",
            }}>
              Warum PHE?
            </h2>
            <p style={{ color: "#707070", fontSize: 17, marginBottom: 48, textAlign: "center" }}>
              Ihr Partner für Fachkräfte in Elektro, Mechatronik &amp; Bau
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
              {[
                { t: "Schnelle Besetzung",    d: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                { t: "Qualifizierte Profile",  d: "Nur geprüfte Fachkräfte mit passendem Background" },
                { t: "Persönliche Betreuung", d: "Fester Ansprechpartner, kein Callcenter" },
                { t: "Erfolgsbasiert",         d: "Sie zahlen nur bei erfolgreicher Vermittlung" },
              ].map(b => (
                <div key={b.t} style={{
                  background: "#fff",
                  borderRadius: 20, padding: "28px 22px",
                  borderTop: "3px solid #3b72b8",
                }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>{b.t}</div>
                  <div style={{ fontSize: 14, color: "#707070", lineHeight: 1.65 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA — dark again ── */}
        <section style={{ background: "#0c1829", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <h2 style={{
              fontSize: 38, fontWeight: 700, color: "#fff",
              letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 16,
            }}>
              Lieber direkt sprechen?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.65, marginBottom: 40 }}>
              Rufen Sie uns an oder schreiben Sie uns auf WhatsApp —
              kostenlos und unverbindlich.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#3b72b8", color: "#fff",
                fontSize: 17, fontWeight: 600,
                padding: "15px 32px", borderRadius: 999, textDecoration: "none",
                transition: "background 0.15s",
              }}>
                0211 158 63 100
              </a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte." target="_blank" rel="noopener noreferrer" style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: 17, fontWeight: 600,
                padding: "15px 32px", borderRadius: 999, textDecoration: "none",
              }}>
                WhatsApp anfragen
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── FAQ ── */}
      <FaqSection title="Häufige Fragen für Unternehmen" items={[
        { q: "Was kostet die Vermittlung für Unternehmen?", a: "Die Vergütung ist erfolgsbasiert – Sie zahlen nur bei erfolgreicher Besetzung. Es gibt keine Vorabkosten oder Bearbeitungsgebühren." },
        { q: "Wie schnell erhalten wir erste Kandidatenprofile?", a: "In der Regel erhalten Sie innerhalb von 3–5 Werktagen erste geprüfte Profile passend zu Ihren Anforderungen." },
        { q: "Welche Fachkräfte vermittelt PHE?", a: "Wir sind spezialisiert auf Elektrotechnik, IT & Automation, Mechatronik, Kältetechnik sowie Bau & TGA – ausschließlich in Festanstellung." },
        { q: "Wie läuft der Prozess ab?", a: "Nach Ihrer Anfrage analysieren wir Ihren Bedarf, matchen passende Kandidaten aus unserem Pool, liefern Ihnen geprüfte Profile und begleiten bis zum Vertragsabschluss." },
        { q: "Vermittelt PHE auch Zeitarbeitnehmer?", a: "Nein. PHE-Perm Engineering vermittelt ausschließlich Festanstellungen direkt beim Unternehmen – keine Zeitarbeit, keine Leiharbeit." },
      ]} />

      {/* ── FOOTER ── */}
      <footer style={{ background: "#f5f5f7", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
            <div style={{ minWidth: 180 }}>
              <Image src="/phe-logo.png" alt="PHE-Perm Engineering" height={28} width={140} style={{ height: 28, width: "auto", marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: "#707070", lineHeight: 1.6 }}>
                PHE-Perm Engineering, Ihr Partner für Festanstellungen in IT, Elektro und Bau.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1d1d1f", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>Für Bewerber</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
                {[["Stellenangebote", "/jobs"], ["Lebenslauf erstellen", "/lebenslauf-erstellen"]].map(([l, h]) => (
                  <li key={l}><Link href={h} style={{ fontSize: 13, color: "#707070", textDecoration: "none" }}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1d1d1f", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>Unternehmen</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
                {[["Talente finden", "/talente-finden"], ["Über PHE", "/ueber-uns"], ["Kontakt", "/kontakt"]].map(([l, h]) => (
                  <li key={l}><Link href={h} style={{ fontSize: 13, color: "#707070", textDecoration: "none" }}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1d1d1f", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rechtliches</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
                {[["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"], ["AGB", "/agb"]].map(([l, h]) => (
                  <li key={l}><Link href={h} style={{ fontSize: 13, color: "#707070", textDecoration: "none" }}>{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 20 }}>
            <span style={{ fontSize: 13, color: "#ababab" }}>© 2026 PHE-Perm Engineering GmbH. Alle Rechte vorbehalten.</span>
            <div>
              <Link href="/impressum" style={{ fontSize: 13, color: "#ababab", textDecoration: "none", marginLeft: 16 }}>Impressum</Link>
              <Link href="/datenschutz" style={{ fontSize: 13, color: "#ababab", textDecoration: "none", marginLeft: 16 }}>Datenschutz</Link>
              <Link href="/agb" style={{ fontSize: 13, color: "#ababab", textDecoration: "none", marginLeft: 16 }}>AGB</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
