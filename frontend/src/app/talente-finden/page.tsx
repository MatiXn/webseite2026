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

// ─────────────────────────────────────────────────────────────────────
// Coordinate mapping: SVG viewBox 0 0 1000 800
//   x = (lon - 5.5) * 85
//   y = (55.5 - lat) * 82
// ─────────────────────────────────────────────────────────────────────

// Germany border (clockwise)
const DE = `M 50 384 L 64 298 L 63 288 L 79 265
  L 141 155 L 160 135 L 210 115 L 253 90
  L 301 84 L 335 59 L 394 97 L 488 90
  L 562 115 L 640 82 L 673 115 L 740 134
  L 770 200 L 767 258 L 780 340 L 808 380
  L 760 430 L 720 470 L 668 568
  L 637 632 L 560 635 L 480 655 L 398 669
  L 358 653 L 315 643 L 295 630 L 178 651
  L 199 615 L 165 565 L 148 545
  L 125 518 L 97 470 L 66 430 L 50 384 Z`;

// Switzerland border (clockwise)
const CH = `M 178 651 L 266 640 L 315 643 L 364 656
  L 382 697 L 423 709 L 386 722 L 297 783
  L 212 772 L 117 791 L 55 764
  L 75 716 L 109 702 L 127 654
  L 157 667 L 178 651 Z`;

// Austria border (clockwise from Bregenz)
const AT = `M 364 656 L 500 656 L 637 632
  L 671 568 L 747 591 L 808 558
  L 924 599 L 938 628 L 936 697
  L 850 738 L 711 729 L 680 738
  L 518 713 L 511 697 L 423 709
  L 382 697 L 364 656 Z`;

// Very faint neighbours for geographic context
const DENMARK = `M 335 59 L 370 35 L 440 18 L 500 8 L 530 24 L 528 58 L 490 75 L 425 65 L 394 97 Z`;
const NETHERLANDS = `M 64 298 L 45 268 L 30 232 L 36 188 L 48 153 L 80 130 L 102 152 L 141 155 L 79 265 Z`;
const CZECH = `M 808 380 L 830 360 L 870 348 L 910 370 L 920 410 L 890 450 L 840 480 L 790 490 L 760 430 Z`;
const POLAND = `M 740 134 L 800 110 L 860 105 L 900 140 L 910 200 L 880 280 L 840 340 L 808 380 L 780 340 L 767 258 L 770 200 Z`;
const FRANCE = `M 50 384 L 20 400 L 5 460 L 10 530 L 50 590 L 100 640 L 140 680 L 160 730 L 117 791 L 55 764 L 10 720 L -10 650 L -20 560 L 0 480 L 20 420 Z`;
const ITALY = `M 178 651 L 140 680 L 110 720 L 130 780 L 160 800 L 200 800 L 220 780 L 212 772 L 297 783 L 280 800 L 340 800 L 380 780 L 400 760 L 370 730 L 380 710 L 518 713 L 500 760 L 480 800 L 420 800 L 380 800 Z`;
const SLOVENIA = `M 680 738 L 711 729 L 730 760 L 720 800 L 680 800 Z`;

// Centroid-based contour transform: scale s around point (cx, cy)
function ct(cx: number, cy: number, s: number) {
  return `translate(${cx * (1 - s)} ${cy * (1 - s)}) scale(${s})`;
}

// City data
const CITIES: { x: number; y: number; label: string; r?: number; country: "de" | "at" | "ch" }[] = [
  { x: 669, y: 244, label: "Berlin",     r: 5,   country: "de" },
  { x: 382, y: 160, label: "Hamburg",    r: 4.5, country: "de" },
  { x: 269, y: 441, label: "Frankfurt",  r: 4.5, country: "de" },
  { x: 512, y: 606, label: "München",    r: 4.5, country: "de" },
  { x: 124, y: 373, label: "Köln",       r: 4,   country: "de" },
  { x: 165, y: 327, label: "Dortmund",   r: 3.5, country: "de" },
  { x: 316, y: 550, label: "Stuttgart",  r: 3.5, country: "de" },
  { x: 587, y: 342, label: "Leipzig",    r: 3.5, country: "de" },
  { x: 700, y: 365, label: "Dresden",    r: 3.5, country: "de" },
  { x: 924, y: 599, label: "Wien",       r: 4.5, country: "at" },
  { x: 643, y: 631, label: "Salzburg",   r: 3.5, country: "at" },
  { x: 499, y: 676, label: "Innsbruck",  r: 3.5, country: "at" },
  { x: 749, y: 590, label: "Linz",       r: 3,   country: "at" },
  { x: 259, y: 665, label: "Zürich",     r: 4,   country: "ch" },
  { x: 165, y: 701, label: "Bern",       r: 3.5, country: "ch" },
  { x:  55, y: 764, label: "Genf",       r: 3.5, country: "ch" },
];

function DACHMapBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#050b1c" }}>
      <svg
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft glow filter */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow2" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* DACH glow aura */}
          <radialGradient id="deGlow" cx="42%" cy="48%" r="45%">
            <stop offset="0%" stopColor="#1e50c8" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#1e50c8" stopOpacity="0"/>
          </radialGradient>
          <style>{`
            @keyframes cityPulse {
              0%,100% { r: 2.5; opacity: 0.8; }
              50%      { r: 4;   opacity: 1;   }
            }
            @keyframes ringOut {
              0%   { r: 6;  opacity: 0.7; }
              100% { r: 32; opacity: 0;   }
            }
            @keyframes countryBreathe {
              0%,100% { opacity: 0.55; }
              50%      { opacity: 0.85; }
            }
            @keyframes countryInner {
              0%,100% { opacity: 0.4; }
              50%      { opacity: 0.7; }
            }
          `}</style>
        </defs>

        {/* Ocean background */}
        <rect width="1000" height="800" fill="#050b1c"/>

        {/* Very subtle graticule lines */}
        {[100, 200, 300, 400, 500, 600, 700].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#0a1428" strokeWidth="0.5"/>
        ))}
        {[200, 400, 600, 800].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="800" stroke="#0a1428" strokeWidth="0.5"/>
        ))}

        {/* ── NEIGHBOUR COUNTRIES (very faint, context only) ── */}
        {[DENMARK, NETHERLANDS, CZECH, POLAND, FRANCE, ITALY, SLOVENIA].map((d, i) => (
          <path key={i} d={d} fill="#0a1830" stroke="#101e38" strokeWidth="0.7" opacity="0.6"/>
        ))}

        {/* ── DACH AURA GLOW ── */}
        <ellipse cx="450" cy="530" rx="420" ry="260" fill="url(#deGlow)"/>

        {/* ── GERMANY — 4 concentric contour rings ── */}
        {/* Outer: very faint fill */}
        <path d={DE} fill="rgba(30,80,200,0.06)" stroke="none"/>
        {/* Ring 1 — outermost */}
        <path d={DE} fill="none" stroke="#1a3872" strokeWidth="1.0"
          style={{ animation: "countryBreathe 6s ease-in-out infinite" }}/>
        {/* Ring 2 */}
        <path d={DE} fill="none" stroke="#1e4080" strokeWidth="0.9"
          transform={ct(420, 380, 0.93)}
          style={{ animation: "countryInner 6s ease-in-out 0.5s infinite" }}/>
        {/* Ring 3 */}
        <path d={DE} fill="none" stroke="#22488e" strokeWidth="0.85"
          transform={ct(420, 380, 0.85)}
          style={{ animation: "countryBreathe 6s ease-in-out 1s infinite" }}/>
        {/* Ring 4 — innermost, brightest */}
        <path d={DE} fill="none" stroke="#2a5498" strokeWidth="0.8"
          transform={ct(420, 380, 0.76)}
          filter="url(#glow)"
          style={{ animation: "countryInner 6s ease-in-out 1.5s infinite" }}/>

        {/* ── SWITZERLAND — 3 rings ── */}
        <path d={CH} fill="rgba(30,80,200,0.05)" stroke="none"/>
        <path d={CH} fill="none" stroke="#1a3872" strokeWidth="1.0"
          style={{ animation: "countryBreathe 7s ease-in-out 0.8s infinite" }}/>
        <path d={CH} fill="none" stroke="#1e4080" strokeWidth="0.9"
          transform={ct(230, 715, 0.88)}
          style={{ animation: "countryInner 7s ease-in-out 1.3s infinite" }}/>
        <path d={CH} fill="none" stroke="#2a5498" strokeWidth="0.8"
          transform={ct(230, 715, 0.76)}
          filter="url(#glow)"
          style={{ animation: "countryBreathe 7s ease-in-out 1.8s infinite" }}/>

        {/* ── AUSTRIA — 3 rings ── */}
        <path d={AT} fill="rgba(30,80,200,0.05)" stroke="none"/>
        <path d={AT} fill="none" stroke="#1a3872" strokeWidth="1.0"
          style={{ animation: "countryBreathe 8s ease-in-out 1.2s infinite" }}/>
        <path d={AT} fill="none" stroke="#1e4080" strokeWidth="0.9"
          transform={ct(650, 660, 0.90)}
          style={{ animation: "countryInner 8s ease-in-out 1.7s infinite" }}/>
        <path d={AT} fill="none" stroke="#2a5498" strokeWidth="0.8"
          transform={ct(650, 660, 0.80)}
          filter="url(#glow)"
          style={{ animation: "countryBreathe 8s ease-in-out 2.2s infinite" }}/>

        {/* ── CITY DOTS ── */}
        {CITIES.map((c, i) => (
          <g key={c.label}>
            {/* Outer ring */}
            <circle cx={c.x} cy={c.y} r={(c.r ?? 4) + 3}
              fill="none" stroke="#3060c8" strokeWidth="0.6" opacity="0.3"/>
            {/* Main dot */}
            <circle cx={c.x} cy={c.y} r={c.r ?? 4}
              fill="#fff" filter="url(#glow)" opacity="0.85"
              style={{ animation: `cityPulse ${3.5 + i * 0.18}s ease-in-out infinite` }}/>
            <circle cx={c.x} cy={c.y} r={1.6} fill="#3870e8"/>
          </g>
        ))}

        {/* City labels (only major ones, positioned to not overlap) */}
        {[
          { x: 669, y: 244, label: "Berlin",    dx: 8,   dy: 0    },
          { x: 382, y: 160, label: "Hamburg",   dx: 8,   dy: 0    },
          { x: 269, y: 441, label: "Frankfurt", dx: 8,   dy: 0    },
          { x: 512, y: 606, label: "München",   dx: 8,   dy: 0    },
          { x: 924, y: 599, label: "Wien",      dx: 8,   dy: 0    },
          { x: 259, y: 665, label: "Zürich",    dx: 8,   dy: 0    },
        ].map(c => (
          <text key={c.label}
            x={c.x + c.dx} y={c.y + c.dy + 4}
            fill="#5a8acc" fontSize="9" fontFamily="system-ui,sans-serif"
            fontWeight="600" opacity="0.8">
            {c.label}
          </text>
        ))}

        {/* ── PULSE RINGS at Frankfurt (wirtschaftliches Zentrum) ── */}
        {[0, 1.8, 3.6].map(delay => (
          <circle key={delay} cx="269" cy="441" r="6" fill="none"
            stroke="#3870e8" strokeWidth="0.8">
            <animate attributeName="r" from="6" to="36" dur="5s"
              begin={`${delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.2 0 0.8 1"/>
            <animate attributeName="opacity" from="0.6" to="0" dur="5s"
              begin={`${delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.2 0 0.8 1"/>
          </circle>
        ))}

        {/* Small pulse rings at Berlin and Wien */}
        {[{ cx: 669, cy: 244 }, { cx: 924, cy: 599 }].map((pt, pi) =>
          [0, 2.5].map(delay => (
            <circle key={`${pi}-${delay}`} cx={pt.cx} cy={pt.cy} r="5" fill="none"
              stroke="#2a5898" strokeWidth="0.7">
              <animate attributeName="r" from="5" to="26" dur="5.5s"
                begin={`${delay}s`} repeatCount="indefinite"
                calcMode="spline" keySplines="0.2 0 0.8 1"/>
              <animate attributeName="opacity" from="0.5" to="0" dur="5.5s"
                begin={`${delay}s`} repeatCount="indefinite"
                calcMode="spline" keySplines="0.2 0 0.8 1"/>
            </circle>
          ))
        )}

        {/* Country name labels */}
        <text x="360" y="395" fill="#2a5090" fontSize="13" fontFamily="system-ui,sans-serif"
          fontWeight="800" textAnchor="middle" letterSpacing="4" opacity="0.5">
          DEUTSCHLAND
        </text>
        <text x="230" y="725" fill="#2a5090" fontSize="9" fontFamily="system-ui,sans-serif"
          fontWeight="700" textAnchor="middle" letterSpacing="3" opacity="0.45">
          SCHWEIZ
        </text>
        <text x="660" y="686" fill="#2a5090" fontSize="9" fontFamily="system-ui,sans-serif"
          fontWeight="700" textAnchor="middle" letterSpacing="3" opacity="0.45">
          ÖSTERREICH
        </text>
      </svg>

      {/* Gradient overlay — darker at edges, lighter in center */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 65% at 45% 60%, rgba(5,11,28,0.35) 0%, rgba(5,11,28,0.72) 100%)",
      }}/>
    </div>
  );
}

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
          background: "rgba(56,112,232,0.2)", border: "2px solid rgba(56,112,232,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: 22, color: "#5aadff",
        }}>&#10003;</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ff", marginBottom: 8 }}>
          Anfrage abgeschickt!
        </h3>
        <p style={{ color: "#5a7898", fontSize: 14, lineHeight: 1.6 }}>
          Ihr E-Mail-Programm öffnet sich. Ein Berater meldet sich innerhalb von 24 Stunden.
        </p>
        <button onClick={() => setSent(false)} style={{
          marginTop: 20, fontSize: 13, color: "#4a8ef5",
          background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
        }}>
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px", fontSize: 13.5, borderRadius: 9,
    border: "1px solid rgba(70,110,200,0.3)",
    background: "rgba(8,18,50,0.6)",
    outline: "none", boxSizing: "border-box", color: "#d8e8ff",
    fontFamily: "inherit", backdropFilter: "blur(4px)",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "#4a6898",
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: 5, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Unternehmen *</label>
          <input style={inputStyle} placeholder="Musterfirma GmbH"
            value={form.company} onChange={set("company")} required/>
        </div>
        <div>
          <label style={labelStyle}>Ansprechpartner *</label>
          <input style={inputStyle} placeholder="Max Mustermann"
            value={form.contact} onChange={set("contact")} required/>
        </div>
        <div>
          <label style={labelStyle}>E-Mail *</label>
          <input style={inputStyle} type="email" placeholder="max@firma.de"
            value={form.email} onChange={set("email")} required/>
        </div>
        <div>
          <label style={labelStyle}>Telefon</label>
          <input style={inputStyle} type="tel" placeholder="+49 211 ..."
            value={form.phone} onChange={set("phone")}/>
        </div>
        <div>
          <label style={labelStyle}>Gesuchte Fachkräfte *</label>
          <select style={inputStyle} value={form.category}
            onChange={set("category")} required>
            <option value="">Bitte wählen ...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Anzahl</label>
          <select style={inputStyle} value={form.volume} onChange={set("volume")}>
            <option value="">Bitte wählen ...</option>
            {VOLUMES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Ihre Anfrage</label>
        <textarea style={{ ...inputStyle, minHeight: 96, resize: "vertical" }}
          placeholder="Kurz beschreiben: Anforderungen, Qualifikationen, Einsatzort ..."
          value={form.message} onChange={set("message")}/>
      </div>
      <button type="submit" disabled={!canSubmit} style={{
        background: canSubmit ? "linear-gradient(135deg,#1a4ed8,#3a80f0)" : "rgba(30,50,90,0.4)",
        color: canSubmit ? "#fff" : "#304060",
        fontSize: 14, fontWeight: 700,
        padding: "13px 24px", borderRadius: 10,
        border: "1px solid rgba(70,130,240,0.35)",
        cursor: canSubmit ? "pointer" : "not-allowed",
        transition: "all 0.2s",
        boxShadow: canSubmit ? "0 4px 20px rgba(60,120,240,0.3)" : "none",
      }}>
        Anfrage senden
      </button>
      <p style={{ fontSize: 11.5, color: "#2e4460", marginTop: -2 }}>
        * Pflichtfelder. Ein Berater meldet sich innerhalb von 24 Stunden.
      </p>
    </form>
  );
}

export default function TalenteFindPage() {
  return (
    <>
      <DACHMapBg/>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Nav/>
      </div>

      <main style={{ position: "relative", zIndex: 5 }}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: "calc(100vh - 58px)",
          display: "flex", alignItems: "center",
          padding: "64px 48px 72px",
        }}>
          <div style={{
            maxWidth: 1140, margin: "0 auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
          }}>

            {/* LEFT */}
            <div>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.13em", textTransform: "uppercase",
                color: "#5a9aff", background: "rgba(50,100,220,0.14)",
                border: "1px solid rgba(60,110,230,0.28)", borderRadius: 20,
                padding: "5px 14px", marginBottom: 24,
              }}>
                Für Unternehmen im DACH-Raum
              </span>

              <h1 style={{
                fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 900, lineHeight: 1.1,
                color: "#ffffff", marginBottom: 18, letterSpacing: "-0.03em",
              }}>
                Finden Sie Ihre<br/>
                <span style={{
                  background: "linear-gradient(90deg,#5aadff,#80d4ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Technik-Fachkräfte
                </span><br/>
                im DACH-Raum
              </h1>

              <p style={{
                fontSize: 16, color: "#6888aa", lineHeight: 1.72,
                marginBottom: 28, maxWidth: 440,
              }}>
                PHE Perm Engineering vermittelt qualifizierte Elektro- &amp;
                Technik-Fachkräfte in Festanstellung — schnell, persönlich, ohne Risiko.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                {[
                  "Kostenlose Erstberatung",
                  "Nur Festanstellung",
                  "DACH-weit",
                  "48h Reaktionszeit",
                ].map(t => (
                  <span key={t} style={{
                    fontSize: 12, fontWeight: 600, color: "#7ab0e8",
                    background: "rgba(60,100,220,0.14)",
                    border: "1px solid rgba(60,110,230,0.24)",
                    borderRadius: 20, padding: "5px 12px",
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 28 }}>
                {[
                  { n: "5.000+", l: "Kandidaten" },
                  { n: "Ø 4 Wo.", l: "bis Einstellung" },
                  { n: "100%", l: "Festanstellung" },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#5aadff", letterSpacing: "-0.02em" }}>
                      {s.n}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#3a5878", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: form */}
            <div style={{
              background: "rgba(5,13,36,0.84)",
              backdropFilter: "blur(22px)",
              border: "1px solid rgba(60,110,230,0.22)",
              borderRadius: 18, padding: "30px 30px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e8f0ff", marginBottom: 4 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 13, color: "#3d5a7a", marginBottom: 20, lineHeight: 1.6 }}>
                Ein Berater meldet sich innerhalb von 24 Stunden mit
                passenden Kandidatenprofilen.
              </p>
              <ContactForm/>
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section style={{
          background: "rgba(4,10,26,0.96)", backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(60,100,220,0.12)", padding: "64px 48px",
        }}>
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#e8f0ff", marginBottom: 8 }}>
              So einfach funktioniert es
            </h2>
            <p style={{ color: "#3a5070", fontSize: 14, marginBottom: 44 }}>
              Von der Anfrage zur besetzten Stelle — in 4 Schritten
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, textAlign: "left" }}>
              {[
                { s: "01", t: "Anfrage stellen",  d: "Per Formular, Telefon oder WhatsApp — Ihr Bedarf in wenigen Minuten übermittelt." },
                { s: "02", t: "Matching",          d: "Wir analysieren Ihre Anforderungen und matchen Kandidaten aus unserem DACH-Pool." },
                { s: "03", t: "Profile erhalten",  d: "Geprüfte Kandidatenprofile mit Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { s: "04", t: "Einstellung",       d: "Wir koordinieren Interviews und begleiten bis zum Vertragsabschluss." },
              ].map(item => (
                <div key={item.s} style={{
                  background: "rgba(18,30,65,0.6)",
                  border: "1px solid rgba(60,100,220,0.18)",
                  borderRadius: 12, padding: "20px 16px",
                }}>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "rgba(60,110,230,0.18)", letterSpacing: "-0.04em", marginBottom: 10 }}>
                    {item.s}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#c0d8ff", marginBottom: 6 }}>{item.t}</h3>
                  <p style={{ fontSize: 12.5, color: "#3a5070", lineHeight: 1.65 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{
          background: "rgba(3,8,22,0.97)", padding: "64px 48px",
          borderTop: "1px solid rgba(60,100,220,0.1)",
        }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8f0ff", marginBottom: 6, textAlign: "center" }}>
              Warum PHE?
            </h2>
            <p style={{ color: "#3a5070", fontSize: 14, marginBottom: 36, textAlign: "center" }}>
              Ihr Partner für Fachkräfte in Elektro, Mechatronik &amp; Bau
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { t: "Schnelle Besetzung",   d: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                { t: "Qualifizierte Profile", d: "Nur geprüfte Fachkräfte mit passendem Background" },
                { t: "Persönliche Betreuung", d: "Fester Ansprechpartner — kein Callcenter" },
                { t: "Erfolgsbasiert",        d: "Sie zahlen nur bei erfolgreicher Vermittlung" },
              ].map(b => (
                <div key={b.t} style={{
                  background: "rgba(18,30,65,0.5)",
                  border: "1px solid rgba(60,100,220,0.18)",
                  borderRadius: 12, padding: "18px 20px",
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#c0d8ff", marginBottom: 4 }}>{b.t}</div>
                  <div style={{ fontSize: 12.5, color: "#3a5070", lineHeight: 1.55 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          background: "linear-gradient(90deg,rgba(16,42,100,0.97),rgba(8,52,124,0.97))",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(60,110,230,0.2)", padding: "48px 48px", textAlign: "center",
        }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
              Lieber direkt sprechen?
            </h2>
            <p style={{ color: "#6090b8", fontSize: 14, marginBottom: 24 }}>
              Rufen Sie uns an oder schreiben Sie uns auf WhatsApp — kostenlos und unverbindlich.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#fff", color: "#0d1e42", fontSize: 13.5, fontWeight: 700,
                padding: "11px 22px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                0211 158 63 100
              </a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte%20für%20mein%20Unternehmen." style={{
                background: "#22c55e", color: "#fff", fontSize: 13.5, fontWeight: 700,
                padding: "11px 22px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                WhatsApp anfragen
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
