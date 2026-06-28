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

// ─────────────────────────────────────────────────────────────────
// Germany outline — clockwise, SVG coords in viewBox 0 0 760 640
// Approximated from real border coordinates, scaled to fill space.
// ─────────────────────────────────────────────────────────────────
const DE_PATH = `
  M 290  10
  L 340  12
  L 370   5
  L 430  25
  L 470  15
  L 510  28
  L 560  40
  L 590  62
  L 620  65
  L 640  80
  L 700  90
  L 720 105
  L 740 130
  L 745 165
  L 748 220
  L 750 265
  L 748 310
  L 750 340
  L 745 375
  L 720 400
  L 690 410
  L 680 430
  L 660 445
  L 640 445
  L 620 460
  L 610 490
  L 590 510
  L 575 530
  L 555 545
  L 530 550
  L 510 555
  L 490 565
  L 470 580
  L 450 600
  L 430 610
  L 400 615
  L 380 610
  L 360 605
  L 335 615
  L 310 625
  L 290 620
  L 270 610
  L 250 600
  L 230 580
  L 210 575
  L 200 555
  L 195 530
  L 165 520
  L 140 510
  L 115 515
  L 100 505
  L  90 490
  L  65 478
  L  45 465
  L  35 445
  L  30 420
  L  15 400
  L  10 378
  L  12 355
  L  22 330
  L  18 305
  L  25 280
  L  40 258
  L  55 242
  L  50 218
  L  62 198
  L  80 182
  L  75 160
  L  90 148
  L 100 128
  L 105 105
  L  98  88
  L 110  72
  L 130  60
  L 160  52
  L 185  48
  L 210  38
  L 240  30
  L 265  15
  Z
`;

// Centroid for scale transforms
const CX = 390;
const CY = 320;
function ct(s: number) {
  return `translate(${CX * (1 - s)} ${CY * (1 - s)}) scale(${s})`;
}

// Major German cities
const CITIES = [
  { x: 545, y: 120, label: "Berlin",      r: 5.5, delay: "0s",   lx:  7, ly: 4, pulse: true  },
  { x: 310, y:  65, label: "Hamburg",     r: 4.5, delay: "0.6s", lx:  7, ly: 4, pulse: false },
  { x: 220, y: 280, label: "Köln",        r: 4,   delay: "1.2s", lx:-40, ly: 4, pulse: false },
  { x: 208, y: 258, label: "Düsseldorf",  r: 4,   delay: "0.3s", lx:-68, ly: 4, pulse: false },
  { x: 268, y: 310, label: "Dortmund",    r: 3.5, delay: "0.4s", lx:-58, ly: 4, pulse: false },
  { x: 285, y: 355, label: "Frankfurt",   r: 5,   delay: "0.9s", lx:  7, ly: 4, pulse: true  },
  { x: 380, y: 440, label: "Nürnberg",   r: 3.5, delay: "1.8s", lx:  7, ly: 4, pulse: false },
  { x: 320, y: 500, label: "Stuttgart",   r: 4,   delay: "2.2s", lx:-60, ly: 4, pulse: false },
  { x: 415, y: 540, label: "München",     r: 4.5, delay: "1.5s", lx:  7, ly: 4, pulse: true  },
  { x: 455, y: 300, label: "Leipzig",     r: 3.5, delay: "0.3s", lx:  7, ly: 4, pulse: false },
  { x: 530, y: 285, label: "Dresden",     r: 3.5, delay: "2.5s", lx:  7, ly: 4, pulse: false },
  { x: 290, y: 170, label: "Bremen",      r: 3,   delay: "1.9s", lx:  7, ly: 4, pulse: false },
  { x: 390, y: 170, label: "Hannover",    r: 3.5, delay: "0.7s", lx:  7, ly: 4, pulse: false },
  { x: 490, y: 205, label: "Magdeburg",   r: 3,   delay: "3.1s", lx:  7, ly: 4, pulse: false },
  { x: 590, y: 370, label: "Erfurt",      r: 3,   delay: "2.8s", lx:  7, ly: 4, pulse: false },
];

// Flowing contour rings — each flows at a different speed/dash length
const RINGS = [
  { scale: 1.00, dash: 22,  gap: 8,  dur: 22, stroke: "#1b3575", width: 1.2, opacity: 0.65 },
  { scale: 0.91, dash: 16,  gap: 9,  dur: 16, stroke: "#20408e", width: 1.0, opacity: 0.72 },
  { scale: 0.82, dash: 11,  gap: 8,  dur: 12, stroke: "#2850a8", width: 0.9, opacity: 0.78 },
  { scale: 0.73, dash:  8,  gap: 7,  dur:  9, stroke: "#3462be", width: 0.8, opacity: 0.84 },
  { scale: 0.63, dash:  5,  gap: 5,  dur:  7, stroke: "#3e72d8", width: 0.7, opacity: 0.90 },
];

// Traveling particles along the border — animateMotion on the DE_PATH
const PARTICLES = [
  { dur: "18s", begin: "0s",   r: 2.8, color: "#6aacff" },
  { dur: "14s", begin: "4.5s", r: 2.2, color: "#90c8ff" },
  { dur: "22s", begin: "9s",   r: 1.8, color: "#4888f0" },
  { dur: "11s", begin: "2s",   r: 2.0, color: "#80d0ff" },
  { dur: "28s", begin: "6s",   r: 1.5, color: "#3860d0" },
];

function GermanyMapBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#050b1c" }}>
      <svg
        viewBox="0 0 760 640"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="deGlow" cx="50%" cy="52%" r="50%">
            <stop offset="0%" stopColor="#1e52d4" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#1e52d4" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <rect width="760" height="640" fill="#050b1c"/>

        {/* Subtle grid */}
        {[80,160,240,320,400,480,560].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="760" y2={y} stroke="#080f20" strokeWidth="0.5"/>
        ))}
        {[100,200,300,400,500,600,700].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="640" stroke="#080f20" strokeWidth="0.5"/>
        ))}

        {/* Ambient centre glow */}
        <ellipse cx="390" cy="330" rx="340" ry="280" fill="url(#deGlow)"/>

        {/* Very faint country fill */}
        <path d={DE_PATH} fill="rgba(20,52,140,0.06)" stroke="none"/>

        {/* ── FLOWING CONTOUR LINES ──
            stroke-dashoffset counts down → dashes travel forward along path */}
        {RINGS.map((r, i) => {
          const total = r.dash + r.gap;
          return (
            <path key={i} d={DE_PATH} fill="none"
              stroke={r.stroke} strokeWidth={r.width}
              strokeDasharray={`${r.dash} ${r.gap}`}
              opacity={r.opacity}
              transform={r.scale < 1 ? ct(r.scale) : undefined}
            >
              <animate attributeName="stroke-dashoffset"
                from="0" to={`-${total}`}
                dur={`${r.dur}s`} repeatCount="indefinite" calcMode="linear"/>
            </path>
          );
        })}

        {/* ── TRAVELING GLOW PARTICLES along the outline ── */}
        {PARTICLES.map((p, i) => (
          <circle key={`p${i}`} r={p.r} fill={p.color} filter="url(#particleGlow)" opacity="0.9">
            <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" calcMode="linear">
              <mpath href={`#de-outline`}/>
            </animateMotion>
            <animate attributeName="opacity" values="0.2;1;1;0.2"
              dur={p.dur} begin={p.begin} repeatCount="indefinite"/>
          </circle>
        ))}

        {/* Invisible reference path for animateMotion particles */}
        <path id="de-outline" d={DE_PATH} fill="none" stroke="none"/>

        {/* ── PULSE RINGS at major cities ── */}
        {CITIES.filter(c => c.pulse).map(c =>
          ["0s","2s","4s"].map(delay => (
            <circle key={`pulse-${c.label}-${delay}`} cx={c.x} cy={c.y} r="5"
              fill="none" stroke="#4080f0" strokeWidth="0.8">
              <animate attributeName="r" values="5;42;5" dur="6s"
                begin={delay} repeatCount="indefinite"
                calcMode="spline" keySplines="0.15 0 0.85 1;0.15 0 0.85 1"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="6s"
                begin={delay} repeatCount="indefinite"
                calcMode="spline" keySplines="0.15 0 0.85 1;0.15 0 0.85 1"/>
            </circle>
          ))
        )}

        {/* ── CITY DOTS ── */}
        {CITIES.map(c => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r={c.r + 5}
              fill="none" stroke="#2a52b8" strokeWidth="0.5" opacity="0.18"/>
            <circle cx={c.x} cy={c.y} r={c.r} fill="#cce4ff" filter="url(#glow)">
              <animate attributeName="r"
                values={`${c.r};${c.r * 1.35};${c.r}`}
                dur="4.5s" begin={c.delay} repeatCount="indefinite"
                calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
              <animate attributeName="opacity" values="0.6;1;0.6"
                dur="4.5s" begin={c.delay} repeatCount="indefinite"
                calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
            </circle>
            <circle cx={c.x} cy={c.y} r="1.8" fill="#5090ff"/>
            <text x={c.x + c.lx} y={c.y + c.ly}
              fill="#4a78cc" fontSize="9" fontFamily="system-ui,sans-serif"
              fontWeight="700" opacity="0.85">
              {c.label}
            </text>
          </g>
        ))}

        <text x="390" y="350" fill="#1a3268" fontSize="22"
          fontFamily="system-ui,sans-serif" fontWeight="900"
          textAnchor="middle" letterSpacing="8" opacity="0.12">
          DEUTSCHLAND
        </text>
      </svg>

      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 65% at 50% 52%, rgba(5,11,28,0.22) 0%, rgba(5,11,28,0.68) 100%)",
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

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 13px", fontSize: 13.5, borderRadius: 9,
    border: "1px solid rgba(70,110,200,0.3)", background: "rgba(8,18,50,0.6)",
    outline: "none", boxSizing: "border-box", color: "#d8e8ff", fontFamily: "inherit",
    backdropFilter: "blur(4px)",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "#4a6898",
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: 5, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
        background: canSubmit ? "linear-gradient(135deg,#1a4ed8,#3a80f0)" : "rgba(30,50,90,0.4)",
        color: canSubmit ? "#fff" : "#304060", fontSize: 14, fontWeight: 700,
        padding: "13px 24px", borderRadius: 10,
        border: "1px solid rgba(70,130,240,0.35)",
        cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.2s",
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
      <GermanyMapBg/>
      <div style={{ position: "relative", zIndex: 10 }}>
        <Nav/>
      </div>
      <main style={{ position: "relative", zIndex: 5 }}>

        {/* HERO */}
        <section style={{
          minHeight: "calc(100vh - 58px)",
          display: "flex", alignItems: "center",
          padding: "64px 48px 72px",
        }}>
          <div style={{
            maxWidth: 1140, margin: "0 auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
          }}>
            <div>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.13em", textTransform: "uppercase",
                color: "#5a9aff", background: "rgba(50,100,220,0.14)",
                border: "1px solid rgba(60,110,230,0.28)", borderRadius: 20,
                padding: "5px 14px", marginBottom: 24,
              }}>Für Unternehmen in Deutschland</span>

              <h1 style={{
                fontSize: "clamp(30px,4vw,54px)", fontWeight: 900, lineHeight: 1.1,
                color: "#fff", marginBottom: 18, letterSpacing: "-0.03em",
              }}>
                Finden Sie Ihre<br/>
                <span style={{
                  background: "linear-gradient(90deg,#5aadff,#80d4ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Technik-Fachkräfte</span><br/>
                in Deutschland
              </h1>

              <p style={{ fontSize: 16, color: "#6888aa", lineHeight: 1.72, marginBottom: 28, maxWidth: 440 }}>
                PHE Perm Engineering vermittelt qualifizierte Elektro- &amp;
                Technik-Fachkräfte in Festanstellung — schnell, persönlich, ohne Risiko.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                {["Kostenlose Erstberatung","Nur Festanstellung","Deutschlandweit","48h Reaktionszeit"].map(t => (
                  <span key={t} style={{
                    fontSize: 12, fontWeight: 600, color: "#7ab0e8",
                    background: "rgba(60,100,220,0.14)",
                    border: "1px solid rgba(60,110,230,0.24)",
                    borderRadius: 20, padding: "5px 12px",
                  }}>{t}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 28 }}>
                {[
                  { n: "5.000+", l: "Kandidaten" },
                  { n: "Ø 4 Wo.", l: "bis Einstellung" },
                  { n: "100%",   l: "Festanstellung" },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#5aadff", letterSpacing: "-0.02em" }}>{s.n}</div>
                    <div style={{ fontSize: 11.5, color: "#3a5878", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div style={{
              background: "rgba(5,13,36,0.84)", backdropFilter: "blur(22px)",
              border: "1px solid rgba(60,110,230,0.22)", borderRadius: 18,
              padding: "30px 30px", boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e8f0ff", marginBottom: 4 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 13, color: "#3d5a7a", marginBottom: 20, lineHeight: 1.6 }}>
                Ein Berater meldet sich innerhalb von 24 Stunden mit passenden Kandidatenprofilen.
              </p>
              <ContactForm/>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section style={{
          background: "rgba(4,10,26,0.96)", backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(60,100,220,0.12)", padding: "64px 48px",
        }}>
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#e8f0ff", marginBottom: 8 }}>So einfach funktioniert es</h2>
            <p style={{ color: "#3a5070", fontSize: 14, marginBottom: 44 }}>Von der Anfrage zur besetzten Stelle — in 4 Schritten</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, textAlign: "left" }}>
              {[
                { s: "01", t: "Anfrage stellen",  d: "Per Formular, Telefon oder WhatsApp — Ihr Bedarf in wenigen Minuten übermittelt." },
                { s: "02", t: "Matching",          d: "Wir analysieren Ihre Anforderungen und matchen Kandidaten aus unserem Pool." },
                { s: "03", t: "Profile erhalten",  d: "Geprüfte Profile mit Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { s: "04", t: "Einstellung",       d: "Wir koordinieren Interviews und begleiten bis zum Vertragsabschluss." },
              ].map(item => (
                <div key={item.s} style={{
                  background: "rgba(18,30,65,0.6)", border: "1px solid rgba(60,100,220,0.18)",
                  borderRadius: 12, padding: "20px 16px",
                }}>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "rgba(60,110,230,0.18)", letterSpacing: "-0.04em", marginBottom: 10 }}>{item.s}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#c0d8ff", marginBottom: 6 }}>{item.t}</h3>
                  <p style={{ fontSize: 12.5, color: "#3a5070", lineHeight: 1.65 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section style={{
          background: "rgba(3,8,22,0.97)", padding: "64px 48px",
          borderTop: "1px solid rgba(60,100,220,0.1)",
        }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8f0ff", marginBottom: 6, textAlign: "center" }}>Warum PHE?</h2>
            <p style={{ color: "#3a5070", fontSize: 14, marginBottom: 36, textAlign: "center" }}>Ihr Partner für Fachkräfte in Elektro, Mechatronik &amp; Bau</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { t: "Schnelle Besetzung",    d: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                { t: "Qualifizierte Profile",  d: "Nur geprüfte Fachkräfte mit passendem Background" },
                { t: "Persönliche Betreuung", d: "Fester Ansprechpartner — kein Callcenter" },
                { t: "Erfolgsbasiert",         d: "Sie zahlen nur bei erfolgreicher Vermittlung" },
              ].map(b => (
                <div key={b.t} style={{
                  background: "rgba(18,30,65,0.5)", border: "1px solid rgba(60,100,220,0.18)",
                  borderRadius: 12, padding: "18px 20px",
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#c0d8ff", marginBottom: 4 }}>{b.t}</div>
                  <div style={{ fontSize: 12.5, color: "#3a5070", lineHeight: 1.55 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: "linear-gradient(90deg,rgba(16,42,100,0.97),rgba(8,52,124,0.97))",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(60,110,230,0.2)", padding: "48px 48px", textAlign: "center",
        }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Lieber direkt sprechen?</h2>
            <p style={{ color: "#6090b8", fontSize: 14, marginBottom: 24 }}>Rufen Sie uns an oder schreiben Sie uns auf WhatsApp — kostenlos und unverbindlich.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#fff", color: "#0d1e42", fontSize: 13.5, fontWeight: 700,
                padding: "11px 22px", borderRadius: 10, textDecoration: "none",
              }}>0211 158 63 100</a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte." style={{
                background: "#22c55e", color: "#fff", fontSize: 13.5, fontWeight: 700,
                padding: "11px 22px", borderRadius: 10, textDecoration: "none",
              }}>WhatsApp anfragen</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
