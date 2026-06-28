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

// Continent paths (1000×560 SVG space)
// Each continent is defined as an outer path; inner contour rings are
// generated via SVG transform: translate(cx*(1-s), cy*(1-s)) scale(s)
const CONTINENTS: { id: string; d: string; cx: number; cy: number }[] = [
  {
    id: "na",
    cx: 148, cy: 195,
    d: "M 32 75 L 96 55 L 168 50 L 218 63 L 248 80 L 262 110 L 264 140 L 254 170 L 237 200 L 216 225 L 196 240 L 180 260 L 173 286 L 162 312 L 150 330 L 138 314 L 118 298 L 98 272 L 78 250 L 62 224 L 46 196 L 32 164 L 26 135 L 24 108 Z",
  },
  {
    id: "ca", // Central America bridge
    cx: 180, cy: 338,
    d: "M 150 330 L 180 318 L 198 322 L 203 338 L 190 348 L 166 344 Z",
  },
  {
    id: "sa",
    cx: 194, cy: 415,
    d: "M 170 344 L 200 327 L 220 334 L 235 360 L 238 392 L 232 425 L 216 460 L 195 484 L 173 496 L 154 488 L 145 463 L 144 432 L 148 400 L 155 372 L 162 352 Z",
  },
  {
    id: "greenland",
    cx: 242, cy: 47,
    d: "M 206 30 L 240 24 L 268 34 L 278 55 L 267 70 L 245 76 L 216 68 L 205 50 Z",
  },
  {
    id: "europe",
    cx: 478, cy: 152,
    d: "M 390 174 L 416 163 L 438 169 L 448 184 L 444 202 L 431 214 L 414 220 L 396 214 L 386 199 Z M 430 147 L 458 141 L 479 144 L 486 158 L 483 173 L 470 183 L 450 186 L 431 181 L 423 166 Z M 419 116 L 437 109 L 451 111 L 456 126 L 451 140 L 435 144 L 420 139 L 414 128 Z M 404 119 L 415 114 L 418 124 L 413 131 L 403 129 Z M 467 126 L 479 123 L 487 130 L 484 141 L 474 143 L 464 138 Z M 466 74 L 492 64 L 519 68 L 529 82 L 523 101 L 511 114 L 494 116 L 478 109 L 468 96 Z M 484 113 L 495 109 L 499 117 L 495 123 L 486 123 Z M 508 117 L 541 111 L 561 118 L 563 132 L 552 143 L 530 146 L 508 141 L 503 129 Z M 470 154 L 491 147 L 508 154 L 512 169 L 507 190 L 496 213 L 485 228 L 477 221 L 479 201 L 477 181 L 470 168 Z M 505 147 L 529 144 L 547 152 L 550 168 L 540 182 L 524 186 L 508 181 L 502 165 Z M 538 111 L 583 107 L 614 116 L 618 140 L 608 159 L 582 166 L 553 163 L 539 149 Z",
  },
  {
    id: "africa",
    cx: 480, cy: 320,
    d: "M 448 183 L 476 173 L 499 173 L 523 183 L 533 210 L 531 242 L 521 273 L 511 304 L 499 334 L 488 366 L 478 396 L 468 422 L 456 442 L 443 441 L 433 422 L 426 396 L 420 366 L 419 330 L 419 296 L 423 259 L 428 229 L 434 205 Z M 446 179 L 473 169 L 481 161 L 478 149 L 468 149 L 456 159 L 445 169 Z",
  },
  {
    id: "asia",
    cx: 752, cy: 162,
    d: "M 540 53 L 607 43 L 687 49 L 758 54 L 830 59 L 887 64 L 937 79 L 974 95 L 982 120 L 977 150 L 961 176 L 939 190 L 909 200 L 879 205 L 839 209 L 799 214 L 758 219 L 718 214 L 678 209 L 638 199 L 598 184 L 568 169 L 553 149 L 543 124 L 536 99 Z M 659 199 L 683 209 L 699 235 L 703 261 L 698 287 L 681 303 L 663 297 L 652 275 L 648 249 L 651 224 Z M 759 219 L 803 229 L 843 239 L 873 255 L 873 271 L 846 265 L 808 255 L 773 248 L 754 239 Z M 839 109 L 873 101 L 900 109 L 907 125 L 901 143 L 879 149 L 852 144 L 836 131 Z M 870 111 L 883 105 L 891 113 L 887 125 L 876 127 L 868 119 Z",
  },
  {
    id: "australia",
    cx: 840, cy: 368,
    d: "M 748 320 L 803 308 L 860 312 L 906 328 L 930 356 L 924 386 L 903 410 L 871 422 L 837 422 L 803 414 L 772 396 L 751 370 L 742 346 Z M 891 410 L 912 417 L 920 432 L 912 442 L 896 439 L 887 426 Z",
  },
];

// DACH detail paths (Germany, Austria, Switzerland)
const DACH_DE = "M 480 108 L 492 104 L 505 103 L 517 105 L 525 111 L 529 119 L 528 128 L 522 135 L 514 141 L 504 144 L 494 144 L 485 140 L 480 133 L 477 125 L 477 116 Z";
const DACH_AT = "M 497 145 L 515 142 L 527 142 L 535 145 L 537 151 L 529 157 L 513 159 L 498 157 L 492 152 Z";
const DACH_CH = "M 478 133 L 492 131 L 500 134 L 499 142 L 490 145 L 479 143 L 475 138 Z";

// Flow lines: world city → DACH center (~500, 128)
const FLOWS = [
  { id: "ny",  x1: 145, y1: 148, qx: 290, qy:  72, dur: "5s",   del: "0s"   },
  { id: "ldn", x1: 437, y1: 130, qx: 462, qy: 108, dur: "3.8s", del: "1.2s" },
  { id: "dxb", x1: 650, y1: 196, qx: 580, qy: 142, dur: "4.4s", del: "0.6s" },
  { id: "tky", x1: 870, y1: 127, qx: 720, qy:  75, dur: "5.5s", del: "2.0s" },
  { id: "sao", x1: 192, y1: 402, qx: 295, qy: 248, dur: "6s",   del: "1.8s" },
  { id: "bom", x1: 661, y1: 227, qx: 592, qy: 162, dur: "4.8s", del: "3.0s" },
  { id: "sin", x1: 797, y1: 262, qx: 682, qy: 162, dur: "5.2s", del: "0.4s" },
  { id: "cpt", x1: 481, y1: 436, qx: 490, qy: 295, dur: "5s",   del: "2.5s" },
];

const SOURCE_CITIES = [
  { x: 145, y: 148, label: "New York" },
  { x: 437, y: 130, label: "London" },
  { x: 650, y: 196, label: "Dubai" },
  { x: 870, y: 127, label: "Tokyo" },
  { x: 192, y: 402, label: "São Paulo" },
  { x: 661, y: 227, label: "Mumbai" },
  { x: 797, y: 262, label: "Singapore" },
  { x: 481, y: 436, label: "Cape Town" },
];

const DACH_CITIES = [
  { x: 516, y: 112, label: "Berlin" },
  { x: 490, y: 107, label: "Hamburg" },
  { x: 502, y: 140, label: "München" },
  { x: 482, y: 122, label: "Köln" },
  { x: 492, y: 129, label: "Frankfurt" },
  { x: 525, y: 146, label: "Wien" },
  { x: 486, y: 138, label: "Zürich" },
];

// Contour ring transform: scale s around centroid (cx,cy)
function contourTransform(cx: number, cy: number, s: number) {
  return `translate(${cx * (1 - s)} ${cy * (1 - s)}) scale(${s})`;
}

function WorldMapBg() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      background: "#060c1e",
    }}>
      <svg
        viewBox="0 0 1000 560"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dachGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3070e8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3070e8" stopOpacity="0" />
          </radialGradient>

          <filter id="fg" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fg2" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fg3" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Gradient for each flow line */}
          {FLOWS.map(f => (
            <linearGradient key={f.id} id={`lg-${f.id}`} gradientUnits="userSpaceOnUse"
              x1={f.x1} y1={f.y1} x2="500" y2="128">
              <stop offset="0%" stopColor="#3070e8" stopOpacity="0" />
              <stop offset="50%" stopColor="#4a90ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#70b8ff" stopOpacity="1" />
            </linearGradient>
          ))}

          <style>{`
            @keyframes dotPulse {
              0%,100% { opacity: 0.6; r: 1.8; }
              50%      { opacity: 1;   r: 2.8; }
            }
            @keyframes dachPulse {
              0%,100% { opacity: 0.7; }
              50%      { opacity: 1; }
            }
            @keyframes ringExpand {
              0%   { r: 7; opacity: 0.8; }
              100% { r: 34; opacity: 0; }
            }
            @keyframes cityGlow {
              0%,100% { opacity: 0.8; }
              50%      { opacity: 1; }
            }
          `}</style>
        </defs>

        {/* Ocean */}
        <rect width="1000" height="560" fill="#060c1e" />

        {/* Very subtle lat/lon grid */}
        {[90, 180, 270, 380, 460].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y}
            stroke="#0d1630" strokeWidth="0.5" />
        ))}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="560"
            stroke="#0d1630" strokeWidth="0.5" />
        ))}

        {/* ── CONTINENT CONTOUR LINES ── */}
        {/* Each continent: outer ring (dim) + middle ring + inner ring (brighter) */}
        {CONTINENTS.map(c => (
          <g key={c.id}>
            {/* Outer contour — faintest */}
            <path d={c.d} fill="none" stroke="#1b2e52" strokeWidth="0.9" opacity="0.5" />
            {/* Middle contour */}
            <path d={c.d} fill="none" stroke="#1e3460" strokeWidth="0.9" opacity="0.65"
              transform={contourTransform(c.cx, c.cy, 0.88)} />
            {/* Inner contour — brightest */}
            <path d={c.d} fill="none" stroke="#243f72" strokeWidth="0.8" opacity="0.8"
              transform={contourTransform(c.cx, c.cy, 0.74)} />
          </g>
        ))}

        {/* ── SOURCE CITY DOTS ── */}
        {SOURCE_CITIES.map(c => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r="2.5" fill="none" stroke="#1e3870" strokeWidth="0.8" />
            <circle cx={c.x} cy={c.y} r="1.2" fill="#2a5090" opacity="0.9" />
          </g>
        ))}

        {/* ── FLOW LINES (city → DACH) ── */}
        {FLOWS.map(f => {
          const d = `M ${f.x1} ${f.y1} Q ${f.qx} ${f.qy} 500 128`;
          const len = 500;
          return (
            <g key={f.id}>
              <path d={d} fill="none" stroke={`url(#lg-${f.id})`} strokeWidth="1.0"
                strokeLinecap="round">
                <animate attributeName="stroke-dasharray"
                  values={`0 ${len};${len} 0`} dur={f.dur} begin={f.del}
                  repeatCount="indefinite" calcMode="spline"
                  keySplines="0.4 0 0.6 1" />
              </path>
              {/* Traveling dot */}
              <circle r="2" fill="#6ab0ff" filter="url(#fg)">
                <animateMotion dur={f.dur} begin={f.del} repeatCount="indefinite"
                  calcMode="spline" keySplines="0.4 0 0.6 1"
                  path={d} />
                <animate attributeName="opacity" values="0;1;1;0" dur={f.dur}
                  begin={f.del} repeatCount="indefinite"
                  keyTimes="0;0.1;0.85;1" />
              </circle>
            </g>
          );
        })}

        {/* ── DACH REGION ── */}
        {/* Soft glow aura */}
        <ellipse cx="503" cy="130" rx="65" ry="50"
          fill="url(#dachGlow)" filter="url(#fg3)" />

        {/* Germany – 5 contour rings */}
        {[1, 0.90, 0.80, 0.70, 0.60].map((s, i) => (
          <path key={i} d={DACH_DE} fill="none"
            stroke="#4a8ef5"
            strokeWidth={0.7 + i * 0.08}
            opacity={0.3 + i * 0.14}
            transform={i === 0 ? undefined : contourTransform(503, 123, s)}
            filter={i === 4 ? "url(#fg)" : undefined}
          />
        ))}

        {/* Austria – 4 contour rings */}
        {[1, 0.88, 0.75, 0.62].map((s, i) => (
          <path key={i} d={DACH_AT} fill="none"
            stroke="#3d80e8" strokeWidth={0.7 + i * 0.07} opacity={0.3 + i * 0.18}
            transform={i === 0 ? undefined : contourTransform(513, 151, s)}
          />
        ))}

        {/* Switzerland – 4 contour rings */}
        {[1, 0.86, 0.72, 0.58].map((s, i) => (
          <path key={i} d={DACH_CH} fill="none"
            stroke="#3d80e8" strokeWidth={0.7 + i * 0.07} opacity={0.3 + i * 0.18}
            transform={i === 0 ? undefined : contourTransform(487, 138, s)}
          />
        ))}

        {/* ── DACH CITY DOTS ── */}
        {DACH_CITIES.map((c, i) => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r="4.5" fill="none" stroke="#4a8ef5"
              strokeWidth="0.7" opacity="0.4" />
            <circle cx={c.x} cy={c.y} r="2.5" fill="#fff" filter="url(#fg)"
              opacity="0.9" style={{ animation: `cityGlow ${2.5 + i * 0.3}s ease-in-out infinite` }}/>
            <circle cx={c.x} cy={c.y} r="1" fill="#3d7ce8" />
          </g>
        ))}

        {/* DACH city labels */}
        <text x="518" y="110" fill="#7ab0ff" fontSize="5.5" fontFamily="system-ui,sans-serif" fontWeight="600">Berlin</text>
        <text x="492" y="105" fill="#7ab0ff" fontSize="4.8" fontFamily="system-ui,sans-serif">Hamburg</text>
        <text x="504" y="147" fill="#7ab0ff" fontSize="4.8" fontFamily="system-ui,sans-serif">München</text>
        <text x="464" y="123" fill="#7ab0ff" fontSize="4.8" fontFamily="system-ui,sans-serif">Köln</text>
        <text x="494" y="135" fill="#7ab0ff" fontSize="4.8" fontFamily="system-ui,sans-serif">Frankfurt</text>
        <text x="528" y="145" fill="#7ab0ff" fontSize="4.8" fontFamily="system-ui,sans-serif">Wien</text>
        <text x="472" y="145" fill="#7ab0ff" fontSize="4.8" fontFamily="system-ui,sans-serif">Zürich</text>

        {/* ── PULSE RINGS at Frankfurt ── */}
        {[0, 1.5, 3.0].map(delay => (
          <circle key={delay} cx="500" cy="128" r="7" fill="none"
            stroke="#4a8ef5" strokeWidth="1">
            <animate attributeName="r" from="7" to="34" dur="4.5s"
              begin={`${delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.2 0 0.8 1" />
            <animate attributeName="opacity" from="0.7" to="0" dur="4.5s"
              begin={`${delay}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.2 0 0.8 1" />
          </circle>
        ))}

        {/* Center dot at Frankfurt */}
        <circle cx="500" cy="128" r="4" fill="#4a8ef5" filter="url(#fg2)" />
        <circle cx="500" cy="128" r="2" fill="#fff" />

        {/* DACH label */}
        <text x="500" y="172" fill="#4a8ef5" fontSize="7" fontFamily="system-ui,sans-serif"
          fontWeight="700" textAnchor="middle" letterSpacing="3" opacity="0.7">
          DACH
        </text>
      </svg>

      {/* Dark gradient overlay — stronger at top/bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(6,12,30,0.55) 0%, rgba(6,12,30,0.4) 40%, rgba(6,12,30,0.6) 100%)",
      }} />
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
        <div style={{ fontSize: 44, marginBottom: 16, color: "#4a8ef5" }}>✓</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#e8f0ff", marginBottom: 8 }}>Anfrage abgeschickt!</h3>
        <p style={{ color: "#5a7898", fontSize: 14, lineHeight: 1.6 }}>Ihr E-Mail-Programm öffnet sich. Wir melden uns innerhalb von 24 Stunden.</p>
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
    transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "#4a6898",
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: 5, display: "block",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
          <input style={inputStyle} type="email" placeholder="max@firma.de" value={form.email} onChange={set("email")} required />
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
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          placeholder="Kurz beschreiben: Anforderungen, Qualifikationen, Einsatzort …"
          value={form.message} onChange={set("message")}
        />
      </div>
      <button type="submit" disabled={!canSubmit} style={{
        background: canSubmit
          ? "linear-gradient(135deg, #1a4ed8, #3a80f0)"
          : "rgba(30,50,90,0.4)",
        color: canSubmit ? "#fff" : "#304060",
        fontSize: 14, fontWeight: 700,
        padding: "13px 24px", borderRadius: 10,
        border: "1px solid rgba(70,130,240,0.35)",
        cursor: canSubmit ? "pointer" : "not-allowed",
        transition: "all 0.2s", letterSpacing: "0.01em",
        boxShadow: canSubmit ? "0 4px 20px rgba(60,120,240,0.3)" : "none",
      }}>
        Anfrage senden →
      </button>
      <p style={{ fontSize: 11.5, color: "#2e4460", marginTop: -4 }}>
        * Pflichtfelder. Wir melden uns innerhalb von 24 Stunden.
      </p>
    </form>
  );
}

export default function TalenteFindPage() {
  return (
    <>
      <WorldMapBg />

      <div style={{ position: "relative", zIndex: 10 }}>
        <Nav />
      </div>

      <main style={{ position: "relative", zIndex: 5 }}>

        {/* ── HERO ── first viewport shows the animated map ── */}
        <section style={{
          minHeight: "calc(100vh - 58px)",
          display: "flex", alignItems: "center",
          padding: "72px 48px 80px",
        }}>
          <div style={{
            maxWidth: 1160, margin: "0 auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
          }}>

            {/* LEFT: headline */}
            <div>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.13em", textTransform: "uppercase",
                color: "#5a9aff", background: "rgba(50,100,220,0.14)",
                border: "1px solid rgba(60,110,230,0.28)", borderRadius: 20,
                padding: "5px 14px", marginBottom: 26,
              }}>
                Für Unternehmen im DACH-Raum
              </span>

              <h1 style={{
                fontSize: "clamp(32px, 4.2vw, 58px)", fontWeight: 900, lineHeight: 1.08,
                color: "#ffffff", marginBottom: 20, letterSpacing: "-0.03em",
              }}>
                Finden Sie Ihre<br />
                <span style={{
                  background: "linear-gradient(90deg, #5aadff, #80d0ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Technik-Fachkräfte
                </span><br />
                im DACH-Raum
              </h1>

              <p style={{
                fontSize: 16.5, color: "#6888aa", lineHeight: 1.72,
                marginBottom: 32, maxWidth: 460,
              }}>
                PHE Perm Engineering vermittelt qualifizierte Elektro- &amp; Technik-Fachkräfte in Festanstellung — schnell, persönlich, ohne Risiko.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
                {["Kostenlose Erstberatung", "Nur Festanstellung", "DACH-weit", "48h Reaktionszeit"].map(t => (
                  <span key={t} style={{
                    fontSize: 12, fontWeight: 600, color: "#7ab0e8",
                    background: "rgba(60,100,220,0.14)",
                    border: "1px solid rgba(60,110,230,0.24)",
                    borderRadius: 20, padding: "5px 12px",
                  }}>✓ {t}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 28 }}>
                {[
                  { n: "5.000+", l: "Kandidaten" },
                  { n: "Ø 4 Wo.", l: "bis Einstellung" },
                  { n: "100%", l: "Festanstellung" },
                ].map(s => (
                  <div key={s.n}>
                    <div style={{ fontSize: 21, fontWeight: 900, color: "#5aadff", letterSpacing: "-0.02em" }}>{s.n}</div>
                    <div style={{ fontSize: 11.5, color: "#3a5878", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: form card */}
            <div style={{
              background: "rgba(6,14,38,0.82)",
              backdropFilter: "blur(22px)",
              border: "1px solid rgba(60,110,230,0.22)",
              borderRadius: 18, padding: "32px 32px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#e8f0ff", marginBottom: 5 }}>
                Jetzt Talente anfragen
              </h2>
              <p style={{ fontSize: 13, color: "#3d5a7a", marginBottom: 22, lineHeight: 1.6 }}>
                Wir melden uns innerhalb von 24 Stunden mit passenden Kandidatenprofilen.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── PROCESS ── solid dark bg ── */}
        <section style={{
          background: "rgba(5,11,28,0.96)", backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(60,100,220,0.12)", padding: "68px 48px",
        }}>
          <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#e8f0ff", marginBottom: 8 }}>So einfach funktioniert es</h2>
            <p style={{ color: "#3a5070", fontSize: 14.5, marginBottom: 48 }}>Von der Anfrage zur besetzten Stelle — in 4 Schritten</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, textAlign: "left" }}>
              {[
                { s: "01", t: "Anfrage stellen", d: "Per Formular, Telefon oder WhatsApp — Ihr Bedarf in wenigen Minuten übermittelt." },
                { s: "02", t: "Matching", d: "Wir analysieren Ihre Anforderungen und matchen Kandidaten aus unserem DACH-Pool." },
                { s: "03", t: "Profile erhalten", d: "Geprüfte Kandidatenprofile mit Qualifikation, Gehaltswunsch und Verfügbarkeit." },
                { s: "04", t: "Einstellung", d: "Wir koordinieren Interviews und begleiten bis zum erfolgreichen Vertragsabschluss." },
              ].map(item => (
                <div key={item.s} style={{
                  background: "rgba(18,30,65,0.6)",
                  border: "1px solid rgba(60,100,220,0.18)",
                  borderRadius: 13, padding: "22px 18px",
                }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "rgba(60,110,230,0.18)", letterSpacing: "-0.04em", marginBottom: 10 }}>{item.s}</div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#c0d8ff", marginBottom: 7 }}>{item.t}</h3>
                  <p style={{ fontSize: 13, color: "#3a5070", lineHeight: 1.65 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section style={{
          background: "rgba(4,9,24,0.97)", padding: "68px 48px",
          borderTop: "1px solid rgba(60,100,220,0.1)",
        }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#e8f0ff", marginBottom: 8, textAlign: "center" }}>Warum PHE?</h2>
            <p style={{ color: "#3a5070", fontSize: 14.5, marginBottom: 40, textAlign: "center" }}>Ihr Partner für Fachkräfte in Elektro, Mechatronik &amp; Bau</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "⚡", t: "Schnelle Besetzung", d: "Ø 3–6 Wochen von Anfrage bis Vertragsabschluss" },
                { icon: "🎯", t: "Qualifizierte Profile", d: "Nur geprüfte Fachkräfte mit passendem Background" },
                { icon: "🤝", t: "Persönliche Betreuung", d: "Fester Ansprechpartner — kein Callcenter" },
                { icon: "€", t: "Erfolgsbasiert", d: "Sie zahlen nur bei erfolgreicher Vermittlung" },
              ].map(b => (
                <div key={b.t} style={{
                  background: "rgba(18,30,65,0.5)",
                  border: "1px solid rgba(60,100,220,0.18)",
                  borderRadius: 13, padding: "20px 22px",
                  display: "flex", gap: 14, alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{b.icon}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#c0d8ff", marginBottom: 5 }}>{b.t}</div>
                    <div style={{ fontSize: 13, color: "#3a5070", lineHeight: 1.55 }}>{b.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section style={{
          background: "linear-gradient(90deg, rgba(18,45,108,0.97) 0%, rgba(10,55,130,0.97) 100%)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(60,110,230,0.2)", padding: "52px 48px", textAlign: "center",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Lieber direkt sprechen?</h2>
            <p style={{ color: "#6090b8", fontSize: 14.5, marginBottom: 26 }}>
              Rufen Sie uns an oder schreiben Sie uns auf WhatsApp — kostenlos und unverbindlich.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+492111586310" style={{
                background: "#fff", color: "#0d1e42", fontSize: 13.5, fontWeight: 700,
                padding: "12px 24px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 7,
              }}>📞 0211 158 63 100</a>
              <a href="https://wa.me/491739980100?text=Hallo%20PHE-Team,%20ich%20suche%20Fachkräfte%20für%20mein%20Unternehmen." style={{
                background: "#22c55e", color: "#fff", fontSize: 13.5, fontWeight: 700,
                padding: "12px 24px", borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 7,
              }}>💬 Via WhatsApp anfragen</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
