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

// Lines from world cities → DACH center (≈ 500, 128 in 1000×560 SVG space)
const FLOW_LINES = [
  // New York → DACH
  { id: "ny", x1: 148, y1: 148, cx: 300, cy: 80, dur: "4s", delay: "0s", color: "#4a9eff" },
  // London → DACH
  { id: "ldn", x1: 437, y1: 130, cx: 465, cy: 110, dur: "3.2s", delay: "0.8s", color: "#60b4ff" },
  // Dubai → DACH
  { id: "dxb", x1: 648, y1: 195, cx: 580, cy: 140, dur: "3.8s", delay: "1.5s", color: "#4a9eff" },
  // Tokyo → DACH
  { id: "tky", x1: 868, y1: 128, cx: 720, cy: 80, dur: "5s", delay: "0.3s", color: "#60b4ff" },
  // São Paulo → DACH
  { id: "sao", x1: 190, y1: 400, cx: 300, cy: 250, dur: "5.5s", delay: "2s", color: "#3d8ee8" },
  // Cape Town → DACH
  { id: "cpt", x1: 480, y1: 435, cx: 490, cy: 290, dur: "4.5s", delay: "1s", color: "#3d8ee8" },
  // Mumbai → DACH
  { id: "bom", x1: 660, y1: 225, cx: 590, cy: 160, dur: "4.2s", delay: "2.5s", color: "#4a9eff" },
  // Singapore → DACH
  { id: "sin", x1: 795, y1: 260, cx: 680, cy: 160, dur: "4.8s", delay: "1.8s", color: "#60b4ff" },
];

function WorldMapBg() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      background: "#060d1f",
      overflow: "hidden",
    }}>
      <svg
        viewBox="0 0 1000 560"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* DACH glow */}
          <radialGradient id="glowDE2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2f7fe8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2f7fe8" stopOpacity="0" />
          </radialGradient>
          {/* Line gradient → fades at source */}
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3d7cc9" stopOpacity="0" />
            <stop offset="100%" stopColor="#3d7cc9" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow2" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {FLOW_LINES.map(l => (
            <linearGradient key={l.id} id={`lg-${l.id}`} gradientUnits="userSpaceOnUse"
              x1={l.x1} y1={l.y1} x2="500" y2="128">
              <stop offset="0%" stopColor={l.color} stopOpacity="0" />
              <stop offset="60%" stopColor={l.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={l.color} stopOpacity="1" />
            </linearGradient>
          ))}

          <style>{`
            #world-map-group {
              transform-origin: 500px 128px;
              animation: dachZoom 18s cubic-bezier(0.45,0,0.55,1) infinite;
            }
            @keyframes dachZoom {
              0%   { transform: scale(1) translate(0px, 0px); }
              18%  { transform: scale(2.6) translate(0px, 0px); }
              70%  { transform: scale(2.6) translate(0px, 0px); }
              88%  { transform: scale(1) translate(0px, 0px); }
              100% { transform: scale(1) translate(0px, 0px); }
            }
            .dach-label {
              animation: labelFade 18s ease-in-out infinite;
            }
            @keyframes labelFade {
              0%,15%  { opacity: 0; }
              25%,65% { opacity: 1; }
              80%,100%{ opacity: 0; }
            }
          `}</style>
        </defs>

        {/* ── BACKGROUND ── */}
        <rect width="1000" height="560" fill="#060d1f" />

        {/* Subtle latitude / longitude grid */}
        {[100,200,300,400,460].map(y => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y}
            stroke="#0e1a35" strokeWidth="0.6" strokeDasharray="4,10" />
        ))}
        {[100,200,300,400,500,600,700,800,900].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="560"
            stroke="#0e1a35" strokeWidth="0.6" strokeDasharray="4,10" />
        ))}

        {/* ── ZOOMABLE WORLD GROUP ── */}
        <g id="world-map-group">

          {/* ── CONTINENTS ── */}
          {/* North America */}
          <path d="M 30 75 L 95 55 L 165 50 L 215 62 L 245 78 L 258 108 L 262 138 L 252 168 L 236 198 L 215 224 L 195 238 L 180 258 L 173 284 L 163 310 L 152 330 L 142 312 L 122 296 L 102 270 L 82 248 L 66 223 L 50 196 L 36 165 L 28 138 L 26 108 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          <path d="M 205 28 L 238 22 L 265 32 L 276 52 L 265 68 L 244 73 L 217 65 L 204 48 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          {/* Central America */}
          <path d="M 155 330 L 178 318 L 195 320 L 200 335 L 188 345 L 168 342 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          {/* South America */}
          <path d="M 170 342 L 198 325 L 218 332 L 232 358 L 236 388 L 230 420 L 213 455 L 193 480 L 173 493 L 156 486 L 147 462 L 146 432 L 150 400 L 156 372 L 162 350 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />

          {/* Africa */}
          <path d="M 448 182 L 475 172 L 498 172 L 522 182 L 532 208 L 530 240 L 520 272 L 510 302 L 498 332 L 488 364 L 478 394 L 468 420 L 456 440 L 444 440 L 434 420 L 427 394 L 421 364 L 420 328 L 420 295 L 424 258 L 428 228 L 434 204 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          <path d="M 448 178 L 472 168 L 480 160 L 478 148 L 468 148 L 456 158 L 446 168 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          {/* Madagascar */}
          <path d="M 540 350 L 552 342 L 558 358 L 555 375 L 544 380 L 536 368 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />

          {/* Europe */}
          <path d="M 388 172 L 415 162 L 437 168 L 447 182 L 444 200 L 432 212 L 415 218 L 396 212 L 386 197 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 428 145 L 456 140 L 477 143 L 484 157 L 482 172 L 469 182 L 450 185 L 430 180 L 422 165 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 418 115 L 436 108 L 450 110 L 455 124 L 450 138 L 435 142 L 420 138 L 414 127 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 403 118 L 414 113 L 418 123 L 412 130 L 402 128 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 466 125 L 478 122 L 486 128 L 484 140 L 474 142 L 464 137 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 466 72 L 492 63 L 518 67 L 528 80 L 522 100 L 510 113 L 494 115 L 478 108 L 468 95 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 484 112 L 494 108 L 498 116 L 494 122 L 485 122 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 507 116 L 540 110 L 560 116 L 562 130 L 552 142 L 530 145 L 508 140 L 503 128 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 469 153 L 490 146 L 508 153 L 512 168 L 507 188 L 496 212 L 485 226 L 477 220 L 479 200 L 477 180 L 469 167 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 504 146 L 528 143 L 546 150 L 549 166 L 540 180 L 523 185 L 508 180 L 502 164 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />
          <path d="M 537 110 L 582 106 L 613 115 L 617 138 L 607 158 L 582 165 L 553 162 L 539 148 Z"
            fill="#1a2d4e" stroke="#1f3660" strokeWidth="0.6" />

          {/* Asia */}
          <path d="M 538 52 L 605 42 L 685 48 L 755 53 L 828 58 L 885 63 L 935 78 L 972 94 L 980 118 L 975 148 L 960 174 L 938 188 L 908 198 L 878 204 L 838 208 L 798 213 L 758 218 L 718 213 L 678 208 L 638 198 L 598 183 L 568 168 L 553 148 L 543 123 L 536 98 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          <path d="M 658 198 L 682 208 L 698 234 L 702 260 L 697 286 L 681 302 L 664 296 L 653 274 L 649 248 L 652 223 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          <path d="M 758 218 L 802 228 L 842 238 L 872 254 L 872 270 L 845 264 L 808 254 L 773 247 L 754 238 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          <path d="M 838 108 L 872 100 L 898 108 L 906 124 L 900 142 L 878 148 L 852 143 L 836 130 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          {/* Japan */}
          <path d="M 870 110 L 882 104 L 890 112 L 886 124 L 875 126 L 868 118 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />

          {/* Australia */}
          <path d="M 748 318 L 802 306 L 858 310 L 904 326 L 928 353 L 923 384 L 902 408 L 870 420 L 836 420 L 803 412 L 772 394 L 751 368 L 743 344 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />
          <path d="M 890 408 L 910 415 L 918 430 L 910 440 L 895 438 L 886 424 Z"
            fill="#0e1d38" stroke="#152847" strokeWidth="0.7" />

          {/* ── DACH REGION (highlighted) ── */}
          {/* Glow aura */}
          <ellipse cx="503" cy="130" rx="60" ry="44" fill="url(#glowDE2)" />

          {/* Germany */}
          <path
            d="M 480 107 L 492 103 L 504 102 L 516 104 L 524 109 L 528 117 L 527 126 L 522 133 L 514 140 L 504 143 L 494 143 L 485 139 L 480 132 L 477 124 L 477 115 Z"
            fill="#2060c8"
            stroke="#5090e8"
            strokeWidth="1.5"
            filter="url(#glow2)"
          />
          {/* Austria */}
          <path
            d="M 497 144 L 514 141 L 526 141 L 534 144 L 536 150 L 528 156 L 512 158 L 498 156 L 492 151 Z"
            fill="#1a52b8"
            stroke="#5090e8"
            strokeWidth="1.2"
            filter="url(#glow2)"
          />
          {/* Switzerland */}
          <path
            d="M 478 132 L 492 130 L 500 133 L 499 141 L 490 144 L 479 142 L 475 137 Z"
            fill="#1a52b8"
            stroke="#5090e8"
            strokeWidth="1.2"
            filter="url(#glow2)"
          />

          {/* ── ANIMATED FLOW LINES ── */}
          {FLOW_LINES.map(l => {
            const d = `M ${l.x1} ${l.y1} Q ${l.cx} ${l.cy} 500 128`;
            const len = 350;
            return (
              <g key={l.id}>
                <path d={d} fill="none" stroke={`url(#lg-${l.id})`}
                  strokeWidth="1.2" opacity="0.8">
                  <animate attributeName="stroke-dashoffset"
                    from={len} to="0" dur={l.dur} begin={l.delay}
                    repeatCount="indefinite" />
                  <animate attributeName="stroke-dasharray"
                    values={`0,${len};${len},0`} dur={l.dur} begin={l.delay}
                    repeatCount="indefinite" />
                </path>
                {/* Traveling dot */}
                <circle r="2.5" fill={l.color} filter="url(#glow2)">
                  <animateMotion dur={l.dur} begin={l.delay} repeatCount="indefinite"
                    path={d} />
                </circle>
              </g>
            );
          })}

          {/* ── CITY DOTS (source cities) ── */}
          {[
            { x: 148, y: 148, label: "New York" },
            { x: 437, y: 130, label: "London" },
            { x: 648, y: 195, label: "Dubai" },
            { x: 868, y: 128, label: "Tokyo" },
            { x: 190, y: 400, label: "São Paulo" },
            { x: 660, y: 225, label: "Mumbai" },
          ].map(c => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.y} r="3.5" fill="#1e3060" stroke="#3060a0" strokeWidth="1" />
              <circle cx={c.x} cy={c.y} r="1.5" fill="#6090d0" />
            </g>
          ))}

          {/* ── DACH CITY DOTS ── */}
          {[
            { x: 516, y: 112, label: "Berlin" },
            { x: 490, y: 107, label: "Hamburg" },
            { x: 502, y: 139, label: "München" },
            { x: 482, y: 121, label: "Köln" },
            { x: 492, y: 128, label: "Frankfurt" },
            { x: 525, y: 145, label: "Wien" },
            { x: 486, y: 137, label: "Zürich" },
          ].map(c => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.y} r="4" fill="#fff" filter="url(#glow2)" />
              <circle cx={c.x} cy={c.y} r="1.8" fill="#3d7cc9" />
            </g>
          ))}

          {/* ── PULSE RINGS at Frankfurt ── */}
          {[0, 1.2, 2.4].map(delay => (
            <circle key={delay} cx="500" cy="128" r="6" fill="none" stroke="#3d7cc9" strokeWidth="1.2">
              <animate attributeName="r" values="6;32;6" dur="4s" begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="4s" begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <circle cx="500" cy="128" r="5" fill="#3d7cc9" filter="url(#softglow2)">
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* ── DACH CITY LABELS (appear when zoomed) ── */}
          <text x="518" y="110" fill="#a8d0ff" fontSize="5.5" fontFamily="sans-serif" fontWeight="700" className="dach-label">Berlin</text>
          <text x="492" y="105" fill="#a8d0ff" fontSize="5" fontFamily="sans-serif" className="dach-label">Hamburg</text>
          <text x="504" y="145" fill="#a8d0ff" fontSize="5" fontFamily="sans-serif" className="dach-label">München</text>
          <text x="465" y="122" fill="#a8d0ff" fontSize="5" fontFamily="sans-serif" className="dach-label">Köln</text>
          <text x="492" y="134" fill="#a8d0ff" fontSize="5" fontFamily="sans-serif" className="dach-label">Frankfurt</text>
          <text x="527" y="144" fill="#a8d0ff" fontSize="5" fontFamily="sans-serif" className="dach-label">Wien</text>
          <text x="474" y="143" fill="#a8d0ff" fontSize="5" fontFamily="sans-serif" className="dach-label">Zürich</text>
          <text x="500" y="170" fill="#60a0e8" fontSize="8" fontFamily="sans-serif" fontWeight="800"
            textAnchor="middle" letterSpacing="3" className="dach-label">DACH-REGION</text>

        </g>{/* end #world-map-group */}
      </svg>

      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,10,28,0.72)" }} />
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
        <div style={{ fontSize: 48, marginBottom: 16, color: "#60a0e8" }}>✓</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Anfrage abgeschickt!</h3>
        <p style={{ color: "#7090b0", fontSize: 15 }}>Ihr E-Mail-Programm öffnet sich. Wir melden uns in der Regel innerhalb von 24 Stunden.</p>
        <button onClick={() => setSent(false)} style={{ marginTop: 20, fontSize: 14, color: "#60a0e8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 13px", fontSize: 14, borderRadius: 9,
    border: "1.5px solid rgba(80,120,200,0.35)", background: "rgba(10,20,50,0.7)",
    outline: "none", boxSizing: "border-box", color: "#e8f0ff",
    fontFamily: "inherit", backdropFilter: "blur(4px)",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "#5080b0", textTransform: "uppercase",
    letterSpacing: "0.07em", marginBottom: 5, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
          <input style={inputStyle} type="tel" placeholder="+49 211 …" value={form.phone} onChange={set("phone")} />
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
          style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
          placeholder="Beschreiben Sie kurz Ihre Anforderungen, Qualifikationen oder den Einsatzort …"
          value={form.message}
          onChange={set("message")}
        />
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          background: canSubmit ? "linear-gradient(90deg, #1e5cd4, #3d8ee8)" : "rgba(40,60,100,0.5)",
          color: canSubmit ? "#fff" : "#4060a0", fontSize: 15, fontWeight: 700,
          padding: "14px 28px", borderRadius: 10, border: "1.5px solid rgba(80,140,230,0.4)",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "all 0.2s", letterSpacing: "0.02em",
        }}
      >
        Anfrage senden →
      </button>
      <p style={{ fontSize: 12, color: "#3a5a80", marginTop: -6 }}>
        * Pflichtfelder. Wir melden uns innerhalb von 24 Stunden.
      </p>
    </form>
  );
}

export default function TalenteFindPage() {
  return (
    <>
      {/* Fixed animated world map background */}
      <WorldMapBg />

      {/* Nav sits above the map */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Nav />
      </div>

      <main style={{ position: "relative", zIndex: 5 }}>

        {/* ── HERO ── fills first viewport so map is visible ── */}
        <section style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex", alignItems: "center",
          padding: "80px 48px 80px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* LEFT: Headline + tags */}
            <div>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#60a0e8",
                background: "rgba(61,124,201,0.15)", border: "1px solid rgba(61,124,201,0.3)",
                borderRadius: 20, padding: "6px 16px", marginBottom: 28,
              }}>
                Für Unternehmen im DACH-Raum
              </span>

              <h1 style={{
                fontSize: "clamp(34px, 4.5vw, 62px)", fontWeight: 900, lineHeight: 1.08,
                color: "#ffffff", marginBottom: 22, letterSpacing: "-0.035em",
              }}>
                Finden Sie Ihre<br />
                <span style={{
                  background: "linear-gradient(90deg, #4a9eff, #60d8ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Elektro- &amp; Technik-
                </span><br />
                Fachkräfte
              </h1>

              <p style={{ fontSize: 17, color: "#7a9fc8", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                PHE Perm Engineering vermittelt qualifizierte Fachkräfte in Festanstellung — schnell, persönlich und ohne Risiko für Ihr Unternehmen.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
                {["Kostenlose Erstberatung", "Nur Festanstellung", "DACH-weit", "48h Reaktionszeit"].map(tag => (
                  <span key={tag} style={{
                    fontSize: 12, fontWeight: 600, color: "#a8c8f0",
                    background: "rgba(61,124,201,0.15)", border: "1px solid rgba(61,124,201,0.3)",
                    borderRadius: 20, padding: "6px 13px",
                  }}>✓ {tag}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 32 }}>
                {[
                  { num: "5.000+", label: "Kandidaten" },
                  { num: "Ø 4 Wo.", label: "bis Einstellung" },
                  { num: "100%", label: "Festanstellung" },
                ].map(s => (
                  <div key={s.num}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#4a9eff", letterSpacing: "-0.02em" }}>{s.num}</div>
                    <div style={{ fontSize: 12, color: "#4a6888", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Contact form card */}
            <div style={{
              background: "rgba(8,18,45,0.85)", backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(61,124,201,0.25)", borderRadius: 20,
              padding: "36px 36px",
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 13, color: "#5080a8", marginBottom: 26, lineHeight: 1.6 }}>
                Teilen Sie uns Ihren Bedarf mit — wir melden uns innerhalb von 24 Stunden mit passenden Kandidatenprofilen.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── PROCESS SECTION ── has solid bg so map doesn't interfere ── */}
        <section style={{
          background: "rgba(6,12,30,0.95)", backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(61,124,201,0.15)", padding: "72px 48px",
        }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 8 }}>So einfach funktioniert es</h2>
            <p style={{ color: "#5080a8", fontSize: 15, marginBottom: 52 }}>Von der Anfrage zur besetzten Stelle — in 4 Schritten</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, textAlign: "left" }}>
              {[
                { step: "01", title: "Anfrage stellen", desc: "Per Formular, Telefon oder WhatsApp — Ihr Bedarf in wenigen Minuten übermittelt." },
                { step: "02", title: "Matching", desc: "Wir analysieren Ihre Anforderungen und matchen Kandidaten aus unserem DACH-Pool." },
                { step: "03", title: "Profile erhalten", desc: "Geprüfte Kandidatenprofile mit Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { step: "04", title: "Einstellung", desc: "Wir koordinieren Interviews und begleiten bis zum erfolgreichen Vertragsabschluss." },
              ].map(s => (
                <div key={s.step} style={{
                  background: "rgba(20,35,70,0.6)", border: "1px solid rgba(61,124,201,0.2)",
                  borderRadius: 14, padding: "24px 20px",
                }}>
                  <div style={{ fontSize: 38, fontWeight: 900, color: "rgba(61,124,201,0.2)", letterSpacing: "-0.04em", marginBottom: 10 }}>{s.step}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#d0e4ff", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "#4a6888", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{
          background: "rgba(4,9,25,0.97)", padding: "72px 48px",
          borderTop: "1px solid rgba(61,124,201,0.1)",
        }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" }}>Warum PHE?</h2>
            <p style={{ color: "#5080a8", fontSize: 15, marginBottom: 44, textAlign: "center" }}>Ihr Partner für Fachkräfte in Elektro, Mechatronik &amp; Bau</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
              {[
                { icon: "⚡", title: "Schnelle Besetzung", desc: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                { icon: "🎯", title: "Qualifizierte Profile", desc: "Nur geprüfte Fachkräfte mit passendem Background" },
                { icon: "🤝", title: "Persönliche Betreuung", desc: "Fester Ansprechpartner — kein Callcenter" },
                { icon: "€", title: "Erfolgsbasiert", desc: "Sie zahlen nur bei erfolgreicher Vermittlung" },
              ].map(b => (
                <div key={b.title} style={{
                  background: "rgba(20,35,70,0.5)", border: "1px solid rgba(61,124,201,0.2)",
                  borderRadius: 14, padding: "22px 24px", display: "flex", gap: 16, alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{b.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#d0e4ff", marginBottom: 5 }}>{b.title}</div>
                    <div style={{ fontSize: 13, color: "#4a6888", lineHeight: 1.55 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section style={{
          background: "linear-gradient(90deg, rgba(20,50,110,0.97) 0%, rgba(10,60,140,0.97) 100%)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(61,124,201,0.2)", padding: "56px 48px", textAlign: "center",
        }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              Lieber direkt sprechen?
            </h2>
            <p style={{ color: "#7aa8d0", fontSize: 15, marginBottom: 28 }}>
              Rufen Sie uns an oder schreiben Sie uns auf WhatsApp — wir beraten Sie kostenlos.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#fff", color: "#0d1e42", fontSize: 14, fontWeight: 700,
                padding: "13px 26px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                📞 0211 158 63 100
              </a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte%20für%20mein%20Unternehmen." style={{
                background: "#25D366", color: "#fff", fontSize: 14, fontWeight: 700,
                padding: "13px 26px", borderRadius: 10, textDecoration: "none",
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
