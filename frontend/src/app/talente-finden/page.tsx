"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import FaqSection from "@/app/components/FaqSection";
import Footer from "@/app/components/Footer";
import JsonLd from "@/app/components/JsonLd";

const MAIL_EMPLOYER = "recruiting@phe-perm.de";

// Eine Quelle für sichtbares FAQ und FAQPage-Schema
const TALENTE_FAQ = [
  { q: "Was kostet die Vermittlung für Unternehmen?", a: "Die Vergütung ist erfolgsbasiert – Sie zahlen nur bei erfolgreicher Besetzung. Es gibt keine Vorabkosten oder Bearbeitungsgebühren. Die Konditionen besprechen wir individuell in der kostenlosen Erstberatung." },
  { q: "Wie schnell erhalten wir erste Kandidatenprofile?", a: "In der Regel erhalten Sie innerhalb von 3–5 Werktagen erste geprüfte Profile passend zu Ihren Anforderungen." },
  { q: "Welche Fachkräfte vermittelt PHE?", a: "Wir sind spezialisiert auf Elektrotechnik und Instandhaltung (Elektroniker, Betriebselektriker, Elektromonteure), Automatisierung und SPS (SPS-Programmierer, Steuerungstechniker), Mechatronik und Kältetechnik (Mechatroniker, Kältetechniker, Servicetechniker) sowie Bau, Haustechnik und SHK (Anlagenmechaniker, Bauleiter, Projektleiter TGA) – ausschließlich in Festanstellung." },
  { q: "Wie läuft der Prozess ab?", a: "Nach Ihrer Anfrage analysieren wir Ihren Bedarf, matchen passende Kandidaten aus unserem Pool, liefern Ihnen geprüfte Profile mit Qualifikation, Gehaltsrahmen und Verfügbarkeit und begleiten Interviews bis zum Vertragsabschluss." },
  { q: "Wie werden die Kandidaten geprüft?", a: "Vor der Vorstellung führen wir mit jedem Kandidaten ein persönliches Gespräch: Wir prüfen Qualifikationen und Berufserfahrung, klären Wechselmotivation, Gehaltsvorstellung, Verfügbarkeit und regionale Flexibilität. Sie erhalten nur Profile, die zu Ihrer Anforderung passen." },
  { q: "In welchen Regionen ist PHE tätig?", a: "Wir vermitteln deutschlandweit – mit Schwerpunkten in Nordrhein-Westfalen, Bayern, Hessen und Baden-Württemberg. Auch Positionen mit bundesweitem Einsatz oder in kleineren Städten besetzen wir regelmäßig." },
  { q: "Können auch mehrere Stellen gleichzeitig besetzt werden?", a: "Ja. Ob eine einzelne Fachkraft oder ein größerer Bedarf von 25+ Positionen – wir skalieren die Kandidatensuche entsprechend und priorisieren gemeinsam mit Ihnen." },
  { q: "Vermittelt PHE auch Zeitarbeitnehmer?", a: "Nein. PHE-Perm Engineering vermittelt ausschließlich Festanstellungen direkt bei Ihrem Unternehmen – keine Zeitarbeit, keine Leiharbeit, keine Arbeitnehmerüberlassung." },
];

// Sichtbare Fachbereichs-Beschreibungen (Content-Tiefe für die B2B-Servicepage)
const FACHBEREICHE = [
  {
    t: "Elektrotechnik & Instandhaltung",
    d: "Elektroniker für Betriebstechnik, Betriebselektriker und Elektromonteure für Produktion, Instandhaltung und Anlagenbau. Unsere Kandidaten bringen abgeschlossene Berufsausbildungen, Erfahrung mit Störungsanalyse und Wartung sowie Kenntnisse der einschlägigen Normen (u. a. DGUV V3-Prüfungen) mit.",
  },
  {
    t: "Automatisierung, SPS & IT",
    d: "SPS-Programmierer und Automatisierungstechniker mit Praxis in Siemens TIA Portal, Steuerungstechnik und Inbetriebnahme. Gefragte Profile für Maschinenbau, Produktionsautomatisierung und Prozessindustrie – vom Programmierer bis zum Inbetriebnehmer.",
  },
  {
    t: "Mechatronik & Kältetechnik",
    d: "Mechatroniker, Kältetechniker und Servicetechniker für Wartung, Instandhaltung und Kundendienst – von Industriekälte und Klimatechnik bis zu mechatronischen Produktionsanlagen. Auch Außendienst-Profile mit Reisebereitschaft und Führerschein.",
  },
  {
    t: "Bau, Haustechnik & SHK",
    d: "Anlagenmechaniker SHK, Fachkräfte für MSR-Technik und Gebäudeautomation sowie Bau- und Projektleiter TGA. Für Handwerksbetriebe, Gebäudetechnik-Dienstleister und Generalunternehmer, die langfristig einstellen wollen.",
  },
];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});

  const PRIVATE_DOMAINS = [
    "gmail", "googlemail", "yahoo", "hotmail", "outlook", "live", "msn",
    "web", "gmx", "t-online", "freenet", "arcor", "aol", "icloud",
    "me", "mac", "proton", "protonmail", "mailbox", "tutanota",
  ];

  const isBusinessEmail = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    const sld = domain.split(".")[0];
    return !PRIVATE_DOMAINS.includes(sld);
  };

  const isGermanPhone = (phone: string) => {
    if (!phone) return true; // optional field
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return /^(\+49|0049|0)[1-9]\d{6,14}$/.test(cleaned);
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      if (k === "email") setFieldErrors(fe => ({ ...fe, email: undefined }));
      if (k === "phone") setFieldErrors(fe => ({ ...fe, phone: undefined }));
    };

  const validateFields = () => {
    const errors: { email?: string; phone?: string } = {};
    if (form.email && !isBusinessEmail(form.email))
      errors.email = "Bitte geben Sie Ihre geschäftliche E-Mail-Adresse an (keine privaten Anbieter wie Gmail, GMX etc.).";
    if (form.phone && !isGermanPhone(form.phone))
      errors.phone = "Bitte geben Sie eine gültige deutsche Telefonnummer ein (z. B. +49 211 …).";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canSubmit = !!(form.company && form.contact && form.email && form.category && isBusinessEmail(form.email)) && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "talent",
          company: form.company,
          contact: form.contact,
          email: form.email,
          phone: form.phone,
          category: form.category,
          count: form.volume,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Versand fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@phe-perm.de.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(59,114,184,0.2)", border: "2px solid rgba(59,114,184,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 26, color: "#7eb3f0",
        }}>✉</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
          Bitte bestätigen Sie Ihre E-Mail!
        </h3>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 8px" }}>
          Wir haben eine Bestätigungs-E-Mail an <strong style={{ color: "#7eb3f0" }}>{form.email}</strong> gesendet.
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
          Bitte klicken Sie auf den Link in der E-Mail – erst dann geht Ihre Anfrage bei uns ein.
        </p>
        <button onClick={() => { setSent(false); setForm({ company: "", contact: "", email: "", phone: "", category: "", volume: "", message: "" }); }} style={{
          marginTop: 24, fontSize: 14, color: "#7eb3f0",
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
          <label style={lbl}>E-Mail * <span style={{ fontWeight: 400, opacity: 0.6 }}>(geschäftlich)</span></label>
          <input
            style={{ ...inp, borderColor: fieldErrors.email ? "#ff6b6b" : undefined }}
            type="email" placeholder="max@firma.de" value={form.email} onChange={set("email")} required
          />
          {fieldErrors.email && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>{fieldErrors.email}</p>}
        </div>
        <div>
          <label style={lbl}>Telefon <span style={{ fontWeight: 400, opacity: 0.6 }}>(DE)</span></label>
          <input
            style={{ ...inp, borderColor: fieldErrors.phone ? "#ff6b6b" : undefined }}
            type="tel" placeholder="+49 211 ..." value={form.phone} onChange={set("phone")}
          />
          {fieldErrors.phone && <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 4 }}>{fieldErrors.phone}</p>}
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
      {error && <p style={{ fontSize: 13, color: "#ff6b6b", marginBottom: -4 }}>{error}</p>}
      <button type="submit" disabled={!canSubmit} style={{
        background: canSubmit ? "#3b72b8" : "rgba(255,255,255,0.1)",
        color: canSubmit ? "#fff" : "rgba(255,255,255,0.35)",
        fontSize: 16, fontWeight: 600,
        padding: "14px 28px", borderRadius: 999,
        border: "none",
        cursor: canSubmit ? "pointer" : "not-allowed",
        transition: "background 0.2s",
      }}>
        {loading ? "Wird gesendet …" : "Anfrage senden →"}
      </button>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: -4, lineHeight: 1.6 }}>
        * Pflichtfelder. Nach dem Absenden erhalten Sie eine Bestätigungs-E-Mail — erst nach dem Klick auf den Link geht Ihre Anfrage bei uns ein.
      </p>
    </form>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

function ConfirmBanner() {
  const params = useSearchParams();
  const confirm = params.get("confirm");
  if (!confirm) return null;
  if (confirm === "success") return (
    <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 16, padding: "16px 20px", margin: "0 24px 24px", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
      <p style={{ color: "#15803d", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>✓ Anfrage erfolgreich bestätigt!</p>
      <p style={{ color: "#166534", fontSize: 14 }}>Vielen Dank – ein Berater meldet sich innerhalb von 24 Stunden bei Ihnen.</p>
    </div>
  );
  if (confirm === "invalid") return (
    <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 16, padding: "16px 20px", margin: "0 24px 24px", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
      <p style={{ color: "#854d0e", fontWeight: 700, fontSize: 15 }}>Link abgelaufen oder ungültig. Bitte senden Sie Ihre Anfrage erneut.</p>
    </div>
  );
  return (
    <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 16, padding: "16px 20px", margin: "0 24px 24px", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
      <p style={{ color: "#991b1b", fontWeight: 700, fontSize: 15 }}>Fehler beim Verarbeiten der Anfrage. Bitte kontaktieren Sie uns direkt unter info@phe-perm.de.</p>
    </div>
  );
}

export default function TalenteFindPage() {
  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh" }}>
      <Nav />
      <Suspense fallback={null}>
        <ConfirmBanner />
      </Suspense>
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

              {/* Mobile: Sprung-CTA zum Formular (liegt mobil weit unter dem Fold) */}
              <a href="#anfrage" className="talente-mobile-cta">
                Jetzt Fachkräfte anfragen →
              </a>

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
            <div id="anfrage" style={{
              scrollMarginTop: 80,
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

        {/* ── FACHBEREICHE — Content-Tiefe für Suchmaschinen & Entscheider ── */}
        <section style={{ background: "#fff", padding: "80px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{
              fontSize: 38, fontWeight: 700, color: "#1d1d1f",
              letterSpacing: "-0.015em", lineHeight: 1.1,
              marginBottom: 12, textAlign: "center",
            }}>
              Diese Fachkräfte vermitteln wir
            </h2>
            <p style={{ color: "#707070", fontSize: 17, marginBottom: 48, textAlign: "center", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
              Spezialisiert statt generalistisch: Wir besetzen ausschließlich technische
              Positionen – und kennen die Anforderungen dieser Berufe im Detail.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 56 }}>
              {FACHBEREICHE.map(f => (
                <div key={f.t} style={{ background: "#f5f5f7", borderRadius: 20, padding: "28px 24px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 10 }}>{f.t}</h3>
                  <p style={{ fontSize: 15, color: "#707070", lineHeight: 1.7 }}>{f.d}</p>
                </div>
              ))}
            </div>

            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", marginBottom: 14 }}>
                Warum Personalvermittlung statt eigener Stellenanzeige?
              </h3>
              <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75, marginBottom: 16 }}>
                Elektroniker, Mechatroniker und SPS-Programmierer gehören zu den am stärksten
                umworbenen Fachkräften in Deutschland. Wer eine Stellenanzeige schaltet, konkurriert
                mit hunderten Arbeitgebern um dieselben wenigen aktiven Bewerber – während die
                Mehrheit der qualifizierten Fachkräfte gar nicht aktiv sucht, aber offen für einen
                Wechsel ist. Genau diese Kandidaten erreichen wir: über unseren laufend gepflegten
                Pool und aktive Direktansprache.
              </p>
              <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75, marginBottom: 16 }}>
                Vor der Vorstellung prüfen wir jeden Kandidaten persönlich: Qualifikationen und
                Berufserfahrung, Wechselmotivation, Gehaltsvorstellung und Verfügbarkeit. Sie
                erhalten keine Bewerberflut, sondern eine kleine Auswahl passender Profile – und
                sprechen nur mit Kandidaten, bei denen die Rahmenbedingungen bereits geklärt sind.
              </p>
              <p style={{ fontSize: 16, color: "#3d3d3f", lineHeight: 1.75 }}>
                Das Risiko liegt dabei vollständig bei uns: Die Vergütung ist erfolgsbasiert und
                wird erst bei tatsächlicher Einstellung fällig. Es gibt keine Vorabkosten, keine
                Bearbeitungsgebühren und keine Mindestlaufzeiten – und da wir ausschließlich
                unbefristete Festanstellungen vermitteln, bauen Sie mit jeder Besetzung
                langfristiges Know-how im eigenen Haus auf, statt es über Leiharbeit wieder zu
                verlieren.
              </p>
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
      <FaqSection title="Häufige Fragen für Unternehmen" items={TALENTE_FAQ} />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Personalvermittlung für Technik-Fachkräfte",
        "serviceType": "Personalvermittlung",
        "url": "https://www.phe-perm.de/talente-finden",
        "description": "Erfolgsbasierte Vermittlung von Elektronikern, SPS-Programmierern, Mechatronikern, Kältetechnikern und Bau-/TGA-Fachkräften in unbefristete Festanstellungen – deutschlandweit.",
        "provider": { "@id": "https://www.phe-perm.de/#organization" },
        "areaServed": { "@type": "Country", "name": "Deutschland" },
        "audience": { "@type": "BusinessAudience", "name": "Unternehmen mit Bedarf an Technik-Fachkräften" },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": TALENTE_FAQ.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phe-perm.de" },
          { "@type": "ListItem", "position": 2, "name": "Talente finden", "item": "https://www.phe-perm.de/talente-finden" },
        ],
      }} />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
