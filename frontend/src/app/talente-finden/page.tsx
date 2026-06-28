"use client";
import { useState } from "react";
import Link from "next/link";
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

function DACHMap() {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, #0f1729 0%, #1a2744 100%)", borderRadius: 20, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1000 560"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="glowDE" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d7cc9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3d7cc9" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ocean background */}
        <rect width="1000" height="560" fill="#0f1729" />

        {/* === SIMPLIFIED WORLD CONTINENTS === */}
        {/* North America */}
        <path d="M 30 80 L 90 60 L 160 55 L 210 65 L 240 80 L 255 110 L 260 140 L 250 170 L 235 200 L 215 225 L 195 240 L 180 260 L 175 285 L 165 310 L 155 330 L 145 310 L 125 295 L 105 270 L 85 250 L 70 225 L 55 200 L 40 170 L 30 145 L 28 115 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />
        {/* Greenland */}
        <path d="M 210 30 L 240 25 L 265 35 L 275 55 L 265 70 L 245 75 L 220 68 L 208 50 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />
        {/* South America */}
        <path d="M 170 335 L 195 320 L 215 330 L 230 355 L 235 385 L 230 420 L 215 455 L 195 480 L 175 495 L 160 488 L 150 465 L 148 435 L 152 405 L 158 375 L 162 348 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />

        {/* Africa */}
        <path d="M 450 185 L 475 175 L 498 175 L 520 185 L 530 210 L 528 240 L 520 270 L 510 300 L 500 330 L 490 365 L 480 395 L 470 420 L 460 440 L 448 440 L 438 420 L 430 395 L 425 365 L 422 330 L 422 295 L 425 260 L 428 230 L 432 205 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />

        {/* Asia (simplified) */}
        <path d="M 540 55 L 600 45 L 680 50 L 750 55 L 820 60 L 880 65 L 930 80 L 970 95 L 980 120 L 975 150 L 960 175 L 940 190 L 910 200 L 880 205 L 840 210 L 800 215 L 760 220 L 720 215 L 680 210 L 640 200 L 600 185 L 570 170 L 555 150 L 545 125 L 538 100 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />
        {/* India */}
        <path d="M 660 200 L 680 210 L 695 235 L 700 260 L 695 285 L 680 300 L 665 295 L 655 275 L 650 250 L 652 225 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />
        {/* Southeast Asia / Indonesia */}
        <path d="M 760 220 L 800 230 L 840 240 L 870 255 L 870 270 L 845 265 L 810 255 L 775 248 L 755 240 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />
        {/* Australia */}
        <path d="M 750 320 L 800 308 L 855 312 L 900 328 L 925 355 L 920 385 L 900 408 L 870 420 L 838 420 L 805 412 L 775 395 L 755 370 L 745 345 Z"
          fill="#1e2d4a" stroke="#253659" strokeWidth="0.8" />

        {/* === EUROPE (more detail) === */}
        {/* Iberia */}
        <path d="M 390 175 L 415 165 L 435 170 L 445 183 L 442 200 L 432 212 L 415 218 L 398 213 L 388 198 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* France */}
        <path d="M 430 148 L 455 142 L 475 145 L 482 158 L 480 172 L 468 182 L 450 185 L 432 180 L 424 167 L 424 155 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* UK */}
        <path d="M 420 118 L 435 110 L 448 112 L 453 125 L 448 138 L 435 142 L 422 138 L 416 128 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Ireland */}
        <path d="M 405 120 L 415 115 L 418 125 L 413 132 L 404 130 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Benelux */}
        <path d="M 468 128 L 478 124 L 484 130 L 482 140 L 474 142 L 466 138 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Scandinavia */}
        <path d="M 468 75 L 490 65 L 515 68 L 525 82 L 520 100 L 508 112 L 494 115 L 480 108 L 470 96 L 466 84 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Denmark */}
        <path d="M 485 112 L 494 108 L 498 115 L 495 122 L 486 122 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Poland / Czech */}
        <path d="M 508 118 L 538 112 L 558 118 L 560 132 L 550 142 L 530 145 L 510 140 L 504 130 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Italy */}
        <path d="M 470 155 L 490 148 L 505 155 L 510 170 L 505 188 L 495 210 L 485 225 L 478 220 L 480 200 L 478 182 L 470 168 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Balkans / Greece */}
        <path d="M 505 148 L 528 145 L 545 152 L 548 168 L 540 180 L 525 185 L 510 180 L 504 165 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />
        {/* Eastern Europe */}
        <path d="M 538 112 L 580 108 L 610 118 L 615 140 L 605 158 L 580 165 L 555 162 L 540 150 L 536 132 Z"
          fill="#263a5e" stroke="#2e4470" strokeWidth="0.8" />

        {/* === DACH HIGHLIGHT GLOW === */}
        {/* Germany glow aura */}
        <ellipse cx="503" cy="128" rx="45" ry="35" fill="url(#glowDE)" />

        {/* === GERMANY === */}
        <path
          d="M 483 109 L 493 106 L 502 105 L 512 106 L 520 110 L 524 116 L 524 124 L 520 130 L 514 137 L 505 142 L 496 143 L 488 140 L 483 134 L 480 127 L 479 120 L 480 114 Z"
          fill="#3d7cc9"
          stroke="#60a0e8"
          strokeWidth="1.2"
          filter="url(#glow)"
        />
        {/* === AUSTRIA === */}
        <path
          d="M 497 143 L 512 140 L 524 140 L 532 143 L 534 149 L 528 154 L 514 156 L 500 155 L 494 150 Z"
          fill="#2d6ab5"
          stroke="#60a0e8"
          strokeWidth="1"
          filter="url(#glow)"
        />
        {/* === SWITZERLAND === */}
        <path
          d="M 479 133 L 490 131 L 498 133 L 498 140 L 490 143 L 480 141 L 476 137 Z"
          fill="#2d6ab5"
          stroke="#60a0e8"
          strokeWidth="1"
          filter="url(#glow)"
        />

        {/* === CITY DOTS (DACH cities) === */}
        {/* Berlin */}
        <circle cx="514" cy="112" r="3.5" fill="#fff" filter="url(#glow)" />
        <circle cx="514" cy="112" r="1.5" fill="#3d7cc9" />
        {/* Hamburg */}
        <circle cx="490" cy="107" r="3" fill="#fff" filter="url(#glow)" />
        <circle cx="490" cy="107" r="1.3" fill="#3d7cc9" />
        {/* München */}
        <circle cx="502" cy="138" r="3" fill="#fff" filter="url(#glow)" />
        <circle cx="502" cy="138" r="1.3" fill="#3d7cc9" />
        {/* Köln */}
        <circle cx="483" cy="122" r="3" fill="#fff" filter="url(#glow)" />
        <circle cx="483" cy="122" r="1.3" fill="#3d7cc9" />
        {/* Frankfurt */}
        <circle cx="492" cy="128" r="3" fill="#fff" filter="url(#glow)" />
        <circle cx="492" cy="128" r="1.3" fill="#3d7cc9" />
        {/* Düsseldorf */}
        <circle cx="480" cy="119" r="2.5" fill="#fff" filter="url(#glow)" />
        <circle cx="480" cy="119" r="1.2" fill="#3d7cc9" />
        {/* Wien */}
        <circle cx="524" cy="145" r="3" fill="#fff" filter="url(#glow)" />
        <circle cx="524" cy="145" r="1.3" fill="#3d7cc9" />
        {/* Zürich */}
        <circle cx="487" cy="137" r="2.5" fill="#fff" filter="url(#glow)" />
        <circle cx="487" cy="137" r="1.2" fill="#3d7cc9" />

        {/* === PULSE ANIMATION at Germany center === */}
        <circle cx="503" cy="125" r="8" fill="none" stroke="#3d7cc9" strokeWidth="1.5" opacity="0.9">
          <animate attributeName="r" values="8;28;8" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="503" cy="125" r="4" fill="#3d7cc9" opacity="0.8">
          <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* === CITY LABELS === */}
        <text x="517" y="110" fill="#a8c8f0" fontSize="6" fontFamily="sans-serif" fontWeight="600">Berlin</text>
        <text x="493" y="105" fill="#a8c8f0" fontSize="5.5" fontFamily="sans-serif">Hamburg</text>
        <text x="504" y="143" fill="#a8c8f0" fontSize="5.5" fontFamily="sans-serif">München</text>
        <text x="466" y="122" fill="#a8c8f0" fontSize="5.5" fontFamily="sans-serif">Köln</text>
        <text x="493" y="133" fill="#a8c8f0" fontSize="5.5" fontFamily="sans-serif">Frankfurt</text>
        <text x="527" y="143" fill="#a8c8f0" fontSize="5.5" fontFamily="sans-serif">Wien</text>
        <text x="476" y="143" fill="#a8c8f0" fontSize="5.5" fontFamily="sans-serif">Zürich</text>

        {/* === DACH LABEL === */}
        <text x="503" y="170" fill="#60a0e8" fontSize="8" fontFamily="sans-serif" fontWeight="700" textAnchor="middle" letterSpacing="3">DACH-REGION</text>

        {/* Decorative grid lines (subtle) */}
        <line x1="0" y1="280" x2="1000" y2="280" stroke="#1e2d4a" strokeWidth="0.5" strokeDasharray="4,8" />
        <line x1="500" y1="0" x2="500" y2="560" stroke="#1e2d4a" strokeWidth="0.5" strokeDasharray="4,8" />
      </svg>

      {/* Stats overlay */}
      <div style={{
        position: "absolute", bottom: 20, right: 20,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {[
          { num: "5.000+", label: "Kandidaten" },
          { num: "48h", label: "Reaktionszeit" },
          { num: "DACH", label: "Abdeckung" },
        ].map(s => (
          <div key={s.num} style={{
            background: "rgba(61,124,201,0.2)", border: "1px solid rgba(61,124,201,0.4)",
            borderRadius: 8, padding: "6px 12px", textAlign: "right", backdropFilter: "blur(8px)",
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#60a0e8" }}>{s.num}</div>
            <div style={{ fontSize: 10, color: "#7090b0", marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    company: "", contact: "", email: "", phone: "",
    category: "", volume: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const canSubmit = form.company && form.contact && form.email && form.category;

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
    window.location.href = `mailto:${MAIL_EMPLOYER}?subject=Talentanfrage – ${form.company}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>Anfrage abgeschickt!</h3>
        <p style={{ color: "var(--gray)", fontSize: 15 }}>Ihr E-Mail-Programm öffnet sich. Wir melden uns in der Regel innerhalb von 24 Stunden.</p>
        <button onClick={() => setSent(false)} style={{ marginTop: 20, fontSize: 14, color: "var(--blue)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 10,
    border: "1.5px solid var(--border)", background: "#fafafa",
    outline: "none", boxSizing: "border-box", color: "var(--navy)",
    fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "var(--gray)", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: 6, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Unternehmen *</label>
          <input style={inputStyle} placeholder="Musterfirma GmbH" value={form.company} onChange={set("company")} required />
        </div>
        <div>
          <label style={labelStyle}>Ansprechpartner *</label>
          <input style={inputStyle} placeholder="Max Mustermann" value={form.contact} onChange={set("contact")} required />
        </div>
        <div>
          <label style={labelStyle}>E-Mail *</label>
          <input style={inputStyle} type="email" placeholder="max@musterfirma.de" value={form.email} onChange={set("email")} required />
        </div>
        <div>
          <label style={labelStyle}>Telefon</label>
          <input style={inputStyle} type="tel" placeholder="+49 211 ..." value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <label style={labelStyle}>Gesuchte Fachkräfte *</label>
          <select style={inputStyle} value={form.category} onChange={set("category")} required>
            <option value="">Bitte wählen …</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Anzahl</label>
          <select style={inputStyle} value={form.volume} onChange={set("volume")}>
            <option value="">Bitte wählen …</option>
            {VOLUMES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Ihre Anfrage</label>
        <textarea
          style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
          placeholder="Beschreiben Sie kurz Ihre Anforderungen, gewünschten Qualifikationen oder den Einsatzort …"
          value={form.message}
          onChange={set("message")}
        />
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          background: canSubmit ? "var(--blue)" : "#c0ccda",
          color: "#fff", fontSize: 15, fontWeight: 700,
          padding: "14px 28px", borderRadius: 10, border: "none",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "background 0.2s",
        }}
      >
        Anfrage senden →
      </button>
      <p style={{ fontSize: 12, color: "var(--gray)", marginTop: -8 }}>
        * Pflichtfelder. Ihre Anfrage wird per E-Mail übermittelt. Wir melden uns innerhalb von 24 Stunden.
      </p>
    </form>
  );
}

export default function TalenteFindPage() {
  return (
    <>
      <Nav />
      <main>
        {/* ── HERO ── */}
        <section style={{
          background: "linear-gradient(135deg, #0f1729 0%, #1a2a50 60%, #0d3060 100%)",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <span style={{
              display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#60a0e8", background: "rgba(61,124,201,0.15)",
              border: "1px solid rgba(61,124,201,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24,
            }}>
              Für Unternehmen
            </span>
            <h1 style={{
              fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, lineHeight: 1.1,
              color: "#fff", marginBottom: 20, letterSpacing: "-0.03em",
            }}>
              Finden Sie Ihre nächste<br />
              <span style={{ color: "#60a0e8" }}>Elektro- & Technik-Fachkraft</span>
            </h1>
            <p style={{ fontSize: 18, color: "#7090b0", lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" }}>
              PHE Perm Engineering vermittelt qualifizierte Fachkräfte in Festanstellung — schnell, persönlich und ohne Risiko für Ihr Unternehmen.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {["Kostenlose Erstberatung", "Festanstellung", "DACH-weit verfügbar", "48h Reaktionszeit"].map(tag => (
                <span key={tag} style={{
                  fontSize: 13, fontWeight: 600, color: "#a8c8f0",
                  background: "rgba(61,124,201,0.12)", border: "1px solid rgba(61,124,201,0.25)",
                  borderRadius: 20, padding: "6px 14px",
                }}>
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section style={{ padding: "64px 24px", background: "var(--bg)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

            {/* LEFT: Form */}
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 15, color: "var(--gray)", marginBottom: 28, lineHeight: 1.6 }}>
                Teilen Sie uns Ihren Bedarf mit — wir melden uns innerhalb von 24 Stunden mit passenden Kandidatenprofilen.
              </p>
              <ContactForm />
            </div>

            {/* RIGHT: Map + Benefits */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 12 }}>
                  Unser Tätigkeitsgebiet
                </h2>
                <DACHMap />
              </div>

              {/* Benefits */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: "⚡", title: "Schnelle Besetzung", desc: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                  { icon: "🎯", title: "Qualifizierte Profile", desc: "Nur geprüfte Fachkräfte mit passendem Background" },
                  { icon: "🤝", title: "Persönliche Betreuung", desc: "Fester Ansprechpartner — kein Callcenter" },
                  { icon: "€", title: "Erfolgsbasiert", desc: "Sie zahlen nur bei erfolgreicher Vermittlung" },
                ].map(b => (
                  <div key={b.title} style={{
                    background: "#fff", border: "1.5px solid var(--border)", borderRadius: 12,
                    padding: "16px 18px",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{b.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section style={{ padding: "64px 24px", background: "#fff", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>So einfach funktioniert es</h2>
            <p style={{ color: "var(--gray)", fontSize: 15, marginBottom: 48 }}>Von der Anfrage zur besetzten Stelle — in 4 Schritten</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "left" }}>
              {[
                { step: "01", title: "Anfrage stellen", desc: "Sie beschreiben Ihren Bedarf — per Formular, Telefon oder WhatsApp." },
                { step: "02", title: "Analyse & Matching", desc: "Wir analysieren Ihre Anforderungen und matchen passende Kandidaten aus unserem Pool." },
                { step: "03", title: "Profile vorstellen", desc: "Sie erhalten geprüfte Kandidatenprofile inkl. Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { step: "04", title: "Einstellung", desc: "Nach Ihrem Feedback koordinieren wir Vorstellungsgespräche und begleiten bis zum Vertragsabschluss." },
              ].map(s => (
                <div key={s.step} style={{ position: "relative", paddingLeft: 0 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#e8f0fb", letterSpacing: "-0.04em", marginBottom: 8 }}>{s.step}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--navy)", marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section style={{
          background: "linear-gradient(90deg, #1a3060 0%, #0d4a9e 100%)",
          padding: "48px 24px", textAlign: "center",
        }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              Lieber direkt sprechen?
            </h2>
            <p style={{ color: "#a8c8f0", fontSize: 15, marginBottom: 28 }}>
              Rufen Sie uns an oder schreiben Sie uns auf WhatsApp — wir beraten Sie kostenlos.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#fff", color: "var(--navy)", fontSize: 14, fontWeight: 700,
                padding: "12px 24px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                📞 0211 158 63 100
              </a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte%20für%20mein%20Unternehmen." style={{
                background: "var(--wa)", color: "#fff", fontSize: 14, fontWeight: 700,
                padding: "12px 24px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                💬 Via WhatsApp anfragen
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
