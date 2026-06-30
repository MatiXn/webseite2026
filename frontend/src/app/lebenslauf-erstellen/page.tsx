"use client";
import { useState, useRef, useEffect } from "react";
import Nav, { MAIL_APPLY, WA_LINK } from "../components/Nav";
import FaqSection from "../components/FaqSection";
import JsonLd from "../components/JsonLd";

// ── Icons ───────────────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const DownloadIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const MailIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>;

// ── Types ────────────────────────────────────────────────────────────────────
type Station = { id: number; firma: string; position: string; von: string; bis: string; beschreibung: string };
type Ausbildung = { id: number; schule: string; abschluss: string; von: string; bis: string };
type CVData = {
  vorname: string; nachname: string; beruf: string; email: string; telefon: string;
  adresse: string; geburtsort: string; geburtsdatum: string; nationalitaet: string;
  zusammenfassung: string; stationen: Station[]; ausbildung: Ausbildung[];
  faehigkeiten: string; sprachen: string; foto: string;
};
type TemplateId = "A" | "B" | "C" | "D";

const EMPTY: CVData = {
  vorname: "", nachname: "", beruf: "", email: "", telefon: "",
  adresse: "", geburtsort: "", geburtsdatum: "", nationalitaet: "",
  zusammenfassung: "",
  stationen: [{ id: 1, firma: "", position: "", von: "", bis: "", beschreibung: "" }],
  ausbildung: [{ id: 1, schule: "", abschluss: "", von: "", bis: "" }],
  faehigkeiten: "", sprachen: "", foto: "",
};

// ── Input Component (Apple style) ────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, type = "text", multiline = false }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean }) {
  const base: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1px solid #e8e8ed", borderRadius: 10,
    fontSize: 14, fontFamily: "inherit", color: "#1d1d1f", outline: "none",
    background: "#f5f5f7", boxSizing: "border-box",
  };
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#707070", display: "block", marginBottom: 5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

// ── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ data, onClose }: { data: CVData; onClose: () => void }) {
  const [form, setForm] = useState({
    vorname: data.vorname,
    nachname: data.nachname,
    telefon: data.telefon,
    position: data.beruf,
  });

  const handleSubmit = () => {
    const body = `Hallo PHE-Team,

ich möchte mich bei Ihnen bewerben und habe meinen Lebenslauf mit Ihrem Generator erstellt.

Name: ${form.vorname} ${form.nachname}
Telefonnummer: ${form.telefon}
Gewünschte Position: ${form.position || "–"}

Meinen Lebenslauf habe ich als PDF angehängt.

Ich freue mich auf Ihre Rückmeldung.

Mit freundlichen Grüßen
${form.vorname} ${form.nachname}`;

    window.location.href = `mailto:${MAIL_APPLY}?subject=${encodeURIComponent(`Bewerbung: ${form.vorname} ${form.nachname}${form.position ? ` – ${form.position}` : ""}`)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid #e8e8ed", fontSize: 14, background: "#f5f5f7",
    color: "#1d1d1f", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1d1d1f", marginBottom: 4, letterSpacing: "-0.01em" }}>Bei PHE bewerben</h2>
            <p style={{ fontSize: 13, color: "#707070" }}>Wir finden passende Stellen für Sie, kostenlos.</p>
          </div>
          <button onClick={onClose} style={{ background: "#f5f5f7", border: "none", cursor: "pointer", color: "#707070", fontSize: 16, lineHeight: 1, padding: "6px 10px", borderRadius: 999 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#707070", display: "block", marginBottom: 6 }}>Vorname *</label>
              <input style={inputStyle} value={form.vorname} onChange={e => setForm(f => ({ ...f, vorname: e.target.value }))} placeholder="Max" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#707070", display: "block", marginBottom: 6 }}>Nachname *</label>
              <input style={inputStyle} value={form.nachname} onChange={e => setForm(f => ({ ...f, nachname: e.target.value }))} placeholder="Mustermann" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#707070", display: "block", marginBottom: 6 }}>Telefonnummer *</label>
            <input style={inputStyle} type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+49 123 456789" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#707070", display: "block", marginBottom: 6 }}>Gewünschte Position / Berufsfeld</label>
            <input style={inputStyle} value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="z.B. Elektroniker, Mechatroniker..." />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 999, border: "1px solid #e8e8ed", background: "#fff", color: "#707070", fontWeight: 400, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          <button
            onClick={handleSubmit}
            disabled={!form.vorname || !form.nachname || !form.telefon}
            style={{ flex: 2, padding: "12px 0", borderRadius: 999, border: "none", background: (!form.vorname || !form.nachname || !form.telefon) ? "#e8e8ed" : "#0071e3", color: "#fff", fontWeight: 400, fontSize: 14, cursor: (!form.vorname || !form.nachname || !form.telefon) ? "not-allowed" : "pointer", fontFamily: "inherit" }}
          >
            E-Mail öffnen & senden
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#aeaeb2", textAlign: "center", marginTop: 12 }}>Ihr E-Mail-Programm öffnet sich, bitte PDF anhängen.</p>
      </div>
    </div>
  );
}

// ── CV TEMPLATES ─────────────────────────────────────────────────────────────

// Shared section heading
function SecHeading({ label, color }: { label: string; color: string }) {
  return (
    <h2 style={{ fontSize: "13pt", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${color}44` }}>
      {label}
    </h2>
  );
}

function SkillDots({ value, color }: { value: string; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {value.split(",").map(s => s.trim()).filter(Boolean).map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: "10pt", lineHeight: 1.5 }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

// ── Template A: Klassisch Blau (photo top-right in header) ──────────────────
function TemplateA({ data, zoom = 1 }: { data: CVData; zoom?: number }) {
  const name = [data.vorname, data.nachname].filter(Boolean).join(" ") || "Dein Name";
  const accent = "#1e3a5f";
  const blue = "#3d7cc9";
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "297mm", width: "210mm", fontSize: "11pt", color: "#1a1a2e", zoom, paddingLeft: "2.5cm", paddingRight: "2.0cm", paddingBottom: "2.0cm", boxSizing: "border-box" }}>
      {/* Header — läuft oben bündig, kein Top-Padding auf äußerem Wrapper */}
      <div style={{ background: accent, color: "#fff", padding: "28px 0 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginLeft: "-2.5cm", marginRight: "-2.0cm", paddingLeft: "2.5cm", paddingRight: "2.8cm" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "24pt", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>{name}</h1>
          <p style={{ fontSize: "12pt", color: "#93c5fd", fontWeight: 600, marginBottom: 14 }}>{data.beruf || "Berufsbezeichnung"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", fontSize: "10pt", color: "#cbd5e1" }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.telefon && <span>📞 {data.telefon}</span>}
            {data.adresse && <span>📍 {data.adresse}</span>}
            {data.geburtsdatum && <span>🎂 {data.geburtsdatum}</span>}
          </div>
        </div>
        {data.foto && (
          <img src={data.foto} alt="Foto" style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)", marginLeft: 24, flexShrink: 0 }} />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.62fr", marginLeft: "-2.5cm", marginRight: "-2.0cm" }}>
        {/* Left */}
        <div style={{ padding: "28px 26px 28px 2.5cm" }}>
          {data.zusammenfassung && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: "13pt", fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${blue}44` }}>Profil</h2>
              <p style={{ lineHeight: 1.5, color: "#374151" }}>{data.zusammenfassung}</p>
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: "13pt", fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${blue}44` }}>Berufserfahrung</h2>
            {data.stationen.filter(s => s.firma || s.position).slice().reverse().map(s => (
              <div key={s.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontWeight: 700, fontSize: "11pt", color: "#111827" }}>{s.position || "Position"}</p>
                  <span style={{ fontSize: "10pt", color: "#6b7280", flexShrink: 0, marginLeft: 8 }}>{[s.von, s.bis].filter(Boolean).join(" – ")}</span>
                </div>
                <p style={{ color: blue, fontWeight: 600, marginBottom: 3 }}>{s.firma}</p>
                {s.beschreibung && <p style={{ color: "#4b5563", lineHeight: 1.5 }}>{s.beschreibung}</p>}
              </div>
            ))}
            {!data.stationen.some(s => s.firma || s.position) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Berufserfahrung hinzufügen...</p>}
          </div>
          <div>
            <h2 style={{ fontSize: "13pt", fontWeight: 700, color: blue, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${blue}44` }}>Ausbildung</h2>
            {data.ausbildung.filter(a => a.schule || a.abschluss).slice().reverse().map(a => (
              <div key={a.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontWeight: 700, color: "#111827" }}>{a.abschluss || "Abschluss"}</p>
                  <span style={{ fontSize: "10pt", color: "#6b7280" }}>{[a.von, a.bis].filter(Boolean).join(" – ")}</span>
                </div>
                <p style={{ color: blue, fontWeight: 600 }}>{a.schule}</p>
              </div>
            ))}
            {!data.ausbildung.some(a => a.schule || a.abschluss) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Ausbildung hinzufügen...</p>}
          </div>
        </div>
        {/* Right */}
        <div style={{ background: "#f0f4f8", padding: "28px 2.0cm 32px 20px", borderLeft: "1px solid #e2e8f0" }}>
          {(data.geburtsdatum || data.geburtsort || data.nationalitaet) && (
            <div style={{ marginBottom: 20 }}>
              <SecHeading label="Persönliches" color={blue} />
              {data.geburtsdatum && <div style={{ marginBottom: 6 }}><p style={{ fontSize: "10pt", fontWeight: 700, color: "#6b7280" }}>Geburtsdatum</p><p style={{ lineHeight: 1.5 }}>{data.geburtsdatum}</p></div>}
              {data.geburtsort && <div style={{ marginBottom: 6 }}><p style={{ fontSize: "10pt", fontWeight: 700, color: "#6b7280" }}>Geburtsort</p><p style={{ lineHeight: 1.5 }}>{data.geburtsort}</p></div>}
              {data.nationalitaet && <div><p style={{ fontSize: "10pt", fontWeight: 700, color: "#6b7280" }}>Nationalität</p><p style={{ lineHeight: 1.5 }}>{data.nationalitaet}</p></div>}
            </div>
          )}
          {data.faehigkeiten && (
            <div style={{ marginBottom: 20 }}>
              <SecHeading label="Fähigkeiten" color={blue} />
              <SkillDots value={data.faehigkeiten} color={blue} />
            </div>
          )}
          {data.sprachen && (
            <div>
              <SecHeading label="Sprachen" color={blue} />
              <SkillDots value={data.sprachen} color="#7c3aed" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Template B: Sidebar Links mit Foto (dark sidebar left) ───────────────────
function TemplateB({ data, zoom = 1 }: { data: CVData; zoom?: number }) {
  const name = [data.vorname, data.nachname].filter(Boolean).join(" ") || "Dein Name";
  const sidebar = "#1e3a5f";
  const accent = "#60a5fa";
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "297mm", width: "210mm", fontSize: "11pt", color: "#1a1a2e", display: "flex", zoom }}>
      {/* Sidebar Left */}
      <div style={{ width: "34%", background: sidebar, color: "#fff", padding: "2.0cm 22px 2.0cm 2.5cm", display: "flex", flexDirection: "column", gap: 20, flexShrink: 0 }}>
        {/* Photo */}
        {data.foto ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={data.foto} alt="Foto" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.25)" }} />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px dashed rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24pt", color: "rgba(255,255,255,0.4)" }}>?</div>
          </div>
        )}
        {/* Name */}
        <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 20 }}>
          <h1 style={{ fontSize: "14pt", fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 4 }}>{name}</h1>
          <p style={{ fontSize: "11pt", color: accent, fontWeight: 600 }}>{data.beruf || "Berufsbezeichnung"}</p>
        </div>
        {/* Kontakt */}
        <div>
          <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, marginBottom: 8 }}>Kontakt</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: "10pt", color: "#cbd5e1", lineHeight: 1.5 }}>
            {data.telefon && <span>📞 {data.telefon}</span>}
            {data.email && <span>✉ {data.email}</span>}
            {data.adresse && <span>📍 {data.adresse}</span>}
          </div>
        </div>
        {/* Persönliches */}
        {(data.geburtsdatum || data.geburtsort || data.nationalitaet) && (
          <div>
            <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, marginBottom: 8 }}>Persönliches</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "10pt", color: "#cbd5e1", lineHeight: 1.5 }}>
              {data.geburtsdatum && <div><p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10pt" }}>Geburtsdatum</p><p>{data.geburtsdatum}</p></div>}
              {data.geburtsort && <div><p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10pt" }}>Geburtsort</p><p>{data.geburtsort}</p></div>}
              {data.nationalitaet && <div><p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10pt" }}>Nationalität</p><p>{data.nationalitaet}</p></div>}
            </div>
          </div>
        )}
        {/* Fähigkeiten */}
        {data.faehigkeiten && (
          <div>
            <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, marginBottom: 8 }}>Fähigkeiten</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {data.faehigkeiten.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10pt", color: "#cbd5e1", lineHeight: 1.5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, flexShrink: 0 }} />{s}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Sprachen */}
        {data.sprachen && (
          <div>
            <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, marginBottom: 8 }}>Sprachen</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {data.sprachen.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10pt", color: "#cbd5e1", lineHeight: 1.5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#a78bfa", flexShrink: 0 }} />{s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Main Right */}
      <div style={{ flex: 1, padding: "2.0cm 2.0cm 2.0cm 24px" }}>
        {data.zusammenfassung && (
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: "13pt", fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: "2px solid #1e3a5f44" }}>Profil</h2>
            <p style={{ lineHeight: 1.5, color: "#374151" }}>{data.zusammenfassung}</p>
          </div>
        )}
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: "13pt", fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: "2px solid #1e3a5f44" }}>Berufserfahrung</h2>
          {data.stationen.filter(s => s.firma || s.position).slice().reverse().map(s => (
            <div key={s.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ fontWeight: 700, fontSize: "11pt", color: "#111827" }}>{s.position || "Position"}</p>
                <span style={{ fontSize: "10pt", color: "#6b7280", flexShrink: 0, marginLeft: 8 }}>{[s.von, s.bis].filter(Boolean).join(" – ")}</span>
              </div>
              <p style={{ color: "#3d7cc9", fontWeight: 600, marginBottom: 3 }}>{s.firma}</p>
              {s.beschreibung && <p style={{ color: "#4b5563", lineHeight: 1.5 }}>{s.beschreibung}</p>}
            </div>
          ))}
          {!data.stationen.some(s => s.firma || s.position) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Berufserfahrung hinzufügen...</p>}
        </div>
        <div>
          <h2 style={{ fontSize: "13pt", fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingBottom: 5, borderBottom: "2px solid #1e3a5f44" }}>Ausbildung</h2>
          {data.ausbildung.filter(a => a.schule || a.abschluss).slice().reverse().map(a => (
            <div key={a.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 700, color: "#111827" }}>{a.abschluss || "Abschluss"}</p>
                <span style={{ fontSize: "10pt", color: "#6b7280" }}>{[a.von, a.bis].filter(Boolean).join(" – ")}</span>
              </div>
              <p style={{ color: "#3d7cc9", fontWeight: 600 }}>{a.schule}</p>
            </div>
          ))}
          {!data.ausbildung.some(a => a.schule || a.abschluss) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Ausbildung hinzufügen...</p>}
        </div>
      </div>
    </div>
  );
}

// ── Template C: Modern Grün, kein Foto, minimalistisch ─────────────────────
function TemplateC({ data, zoom = 1 }: { data: CVData; zoom?: number }) {
  const name = [data.vorname, data.nachname].filter(Boolean).join(" ") || "Dein Name";
  const accent = "#059669";
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "297mm", width: "210mm", fontSize: "11pt", color: "#111827", zoom }}>
      {/* Header */}
      <div style={{ borderBottom: `4px solid ${accent}`, padding: "2.0cm 2.0cm 22px 2.5cm" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "22pt", fontWeight: 900, letterSpacing: "-0.03em", color: "#111827", marginBottom: 4 }}>{name}</h1>
            <p style={{ fontSize: "12pt", color: accent, fontWeight: 700 }}>{data.beruf || "Berufsbezeichnung"}</p>
          </div>
          {data.foto && (
            <img src={data.foto} alt="Foto" style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover", border: `2px solid ${accent}33` }} />
          )}
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: "10pt", color: "#6b7280", marginTop: 12 }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.telefon && <span>📞 {data.telefon}</span>}
          {data.adresse && <span>📍 {data.adresse}</span>}
          {data.geburtsdatum && <span>🎂 {data.geburtsdatum}</span>}
          {data.geburtsort && <span>📌 {data.geburtsort}</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.55fr", padding: "0" }}>
        {/* Left */}
        <div style={{ padding: "24px 24px 2.0cm 2.5cm" }}>
          {data.zusammenfassung && (
            <div style={{ marginBottom: 24 }}>
              <SecHeading label="Über mich" color={accent} />
              <p style={{ lineHeight: 1.5, color: "#374151" }}>{data.zusammenfassung}</p>
            </div>
          )}
          <div style={{ marginBottom: 24 }}>
            <SecHeading label="Berufserfahrung" color={accent} />
            {data.stationen.filter(s => s.firma || s.position).slice().reverse().map(s => (
              <div key={s.id} style={{ marginBottom: 18, paddingLeft: 12, borderLeft: `2px solid ${accent}33` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontWeight: 700, fontSize: "11pt" }}>{s.position || "Position"}</p>
                  <span style={{ fontSize: "10pt", color: "#6b7280", flexShrink: 0, marginLeft: 8 }}>{[s.von, s.bis].filter(Boolean).join(" – ")}</span>
                </div>
                <p style={{ color: accent, fontWeight: 600, marginBottom: 3 }}>{s.firma}</p>
                {s.beschreibung && <p style={{ color: "#4b5563", lineHeight: 1.5 }}>{s.beschreibung}</p>}
              </div>
            ))}
            {!data.stationen.some(s => s.firma || s.position) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Berufserfahrung hinzufügen...</p>}
          </div>
          <div>
            <SecHeading label="Ausbildung" color={accent} />
            {data.ausbildung.filter(a => a.schule || a.abschluss).slice().reverse().map(a => (
              <div key={a.id} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${accent}33` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontWeight: 700 }}>{a.abschluss || "Abschluss"}</p>
                  <span style={{ fontSize: "10pt", color: "#6b7280" }}>{[a.von, a.bis].filter(Boolean).join(" – ")}</span>
                </div>
                <p style={{ color: accent, fontWeight: 600 }}>{a.schule}</p>
              </div>
            ))}
            {!data.ausbildung.some(a => a.schule || a.abschluss) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Ausbildung hinzufügen...</p>}
          </div>
        </div>
        {/* Right */}
        <div style={{ background: "#f0fdf4", padding: "22px 2.0cm 2.0cm 18px", borderLeft: `1px solid ${accent}22` }}>
          {(data.geburtsdatum || data.geburtsort || data.nationalitaet) && (
            <div style={{ marginBottom: 20 }}>
              <SecHeading label="Persönliches" color={accent} />
              {data.geburtsdatum && <div style={{ marginBottom: 6 }}><p style={{ fontSize: "10pt", fontWeight: 700, color: "#6b7280" }}>Geburtsdatum</p><p style={{ lineHeight: 1.5 }}>{data.geburtsdatum}</p></div>}
              {data.geburtsort && <div style={{ marginBottom: 6 }}><p style={{ fontSize: "10pt", fontWeight: 700, color: "#6b7280" }}>Geburtsort</p><p style={{ lineHeight: 1.5 }}>{data.geburtsort}</p></div>}
              {data.nationalitaet && <div><p style={{ fontSize: "10pt", fontWeight: 700, color: "#6b7280" }}>Nationalität</p><p style={{ lineHeight: 1.5 }}>{data.nationalitaet}</p></div>}
            </div>
          )}
          {data.faehigkeiten && (
            <div style={{ marginBottom: 20 }}>
              <SecHeading label="Fähigkeiten" color={accent} />
              <SkillDots value={data.faehigkeiten} color={accent} />
            </div>
          )}
          {data.sprachen && (
            <div>
              <SecHeading label="Sprachen" color={accent} />
              <SkillDots value={data.sprachen} color="#0891b2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Template D: Elegant Grau, Foto links oben, helle Sidebar ───────────────
function TemplateD({ data, zoom = 1 }: { data: CVData; zoom?: number }) {
  const name = [data.vorname, data.nachname].filter(Boolean).join(" ") || "Dein Name";
  const accent = "#7c3aed";
  const sidebar = "#1e1b4b";
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "297mm", width: "210mm", fontSize: "11pt", color: "#1a1a2e", display: "flex", zoom }}>
      {/* Sidebar Left */}
      <div style={{ width: "35%", background: sidebar, color: "#fff", padding: "2.0cm 18px 2.0cm 2.5cm", display: "flex", flexDirection: "column", gap: 18, flexShrink: 0 }}>
        {data.foto ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={data.foto} alt="Foto" style={{ width: 96, height: 96, borderRadius: 10, objectFit: "cover", border: "3px solid rgba(255,255,255,0.2)" }} />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 88, height: 88, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "2px dashed rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22pt", color: "rgba(255,255,255,0.3)" }}>?</div>
          </div>
        )}
        <div style={{ textAlign: "center", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: 800, marginBottom: 4 }}>{name}</h1>
          <p style={{ fontSize: "11pt", color: "#c4b5fd", fontWeight: 600 }}>{data.beruf || "Berufsbezeichnung"}</p>
        </div>
        <div>
          <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c4b5fd", marginBottom: 8 }}>Kontakt</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: "10pt", color: "#c7d2fe", lineHeight: 1.5 }}>
            {data.telefon && <span>📞 {data.telefon}</span>}
            {data.email && <span>✉ {data.email}</span>}
            {data.adresse && <span>📍 {data.adresse}</span>}
          </div>
        </div>
        {(data.geburtsdatum || data.geburtsort || data.nationalitaet) && (
          <div>
            <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c4b5fd", marginBottom: 8 }}>Persönliches</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "10pt", lineHeight: 1.5 }}>
              {data.geburtsdatum && <div><p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10pt" }}>Geburtsdatum</p><p style={{ color: "#c7d2fe" }}>{data.geburtsdatum}</p></div>}
              {data.geburtsort && <div><p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10pt" }}>Geburtsort</p><p style={{ color: "#c7d2fe" }}>{data.geburtsort}</p></div>}
              {data.nationalitaet && <div><p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10pt" }}>Nationalität</p><p style={{ color: "#c7d2fe" }}>{data.nationalitaet}</p></div>}
            </div>
          </div>
        )}
        {data.faehigkeiten && (
          <div>
            <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c4b5fd", marginBottom: 8 }}>Fähigkeiten</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {data.faehigkeiten.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10pt", color: "#c7d2fe", lineHeight: 1.5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c4b5fd", flexShrink: 0 }} />{s}
                </div>
              ))}
            </div>
          </div>
        )}
        {data.sprachen && (
          <div>
            <p style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c4b5fd", marginBottom: 8 }}>Sprachen</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {data.sprachen.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10pt", color: "#c7d2fe", lineHeight: 1.5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} />{s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Main Right */}
      <div style={{ flex: 1, padding: "2.0cm 2.0cm 2.0cm 22px" }}>
        {data.zusammenfassung && (
          <div style={{ marginBottom: 20 }}>
            <SecHeading label="Profil" color={accent} />
            <p style={{ lineHeight: 1.5, color: "#374151" }}>{data.zusammenfassung}</p>
          </div>
        )}
        <div style={{ marginBottom: 20 }}>
          <SecHeading label="Berufserfahrung" color={accent} />
          {data.stationen.filter(s => s.firma || s.position).slice().reverse().map(s => (
            <div key={s.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ fontWeight: 700, fontSize: "11pt", color: "#111827" }}>{s.position || "Position"}</p>
                <span style={{ fontSize: "10pt", color: "#6b7280", flexShrink: 0, marginLeft: 8 }}>{[s.von, s.bis].filter(Boolean).join(" – ")}</span>
              </div>
              <p style={{ color: accent, fontWeight: 600, marginBottom: 3 }}>{s.firma}</p>
              {s.beschreibung && <p style={{ color: "#4b5563", lineHeight: 1.5 }}>{s.beschreibung}</p>}
            </div>
          ))}
          {!data.stationen.some(s => s.firma || s.position) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Berufserfahrung hinzufügen...</p>}
        </div>
        <div>
          <SecHeading label="Ausbildung" color={accent} />
          {data.ausbildung.filter(a => a.schule || a.abschluss).slice().reverse().map(a => (
            <div key={a.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 700, color: "#111827" }}>{a.abschluss || "Abschluss"}</p>
                <span style={{ fontSize: "10pt", color: "#6b7280" }}>{[a.von, a.bis].filter(Boolean).join(" – ")}</span>
              </div>
              <p style={{ color: accent, fontWeight: 600 }}>{a.schule}</p>
            </div>
          ))}
          {!data.ausbildung.some(a => a.schule || a.abschluss) && <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Ausbildung hinzufügen...</p>}
        </div>
      </div>
    </div>
  );
}

function contentZoom(data: CVData): number {
  const units =
    data.stationen.filter(s => s.firma || s.position).length * 2.5 +
    data.ausbildung.filter(a => a.schule || a.abschluss).length * 1.5 +
    (data.zusammenfassung ? 2 : 0) +
    (data.faehigkeiten ? 1 : 0) +
    (data.sprachen ? 1 : 0);
  const zoom = Math.min(1.55, Math.max(1.0, 14 / Math.max(units, 5)));
  return Math.round(zoom * 100) / 100;
}

function CVPreview({ data, template }: { data: CVData; template: TemplateId }) {
  const zoom = contentZoom(data);
  if (template === "B") return <TemplateB data={data} zoom={zoom} />;
  if (template === "C") return <TemplateC data={data} zoom={zoom} />;
  if (template === "D") return <TemplateD data={data} zoom={zoom} />;
  return <TemplateA data={data} zoom={zoom} />;
}

// ── Template Picker (Apple pill tabs in preview area) ────────────────────────
const TEMPLATES: { id: TemplateId; label: string; desc: string; colors: string[] }[] = [
  { id: "A", label: "Klassisch", desc: "Blau", colors: ["#1e3a5f", "#3d7cc9", "#f0f4f8"] },
  { id: "B", label: "Sidebar", desc: "Dunkel", colors: ["#1e3a5f", "#60a5fa", "#ffffff"] },
  { id: "C", label: "Modern", desc: "Grün", colors: ["#059669", "#f0fdf4", "#111827"] },
  { id: "D", label: "Elegant", desc: "Violett", colors: ["#1e1b4b", "#7c3aed", "#c4b5fd"] },
];

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LebenslaufPage() {
  const [data, setData] = useState<CVData>(EMPTY);
  const [template, setTemplate] = useState<TemplateId>("A");
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [isMobile, setIsMobile] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [previewHovered, setPreviewHovered] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const set = (key: keyof CVData, val: string) => setData(d => ({ ...d, [key]: val }));

  const addStation = () => setData(d => ({ ...d, stationen: [...d.stationen, { id: Date.now(), firma: "", position: "", von: "", bis: "", beschreibung: "" }] }));
  const removeStation = (id: number) => setData(d => ({ ...d, stationen: d.stationen.filter(s => s.id !== id) }));
  const setStation = (id: number, key: keyof Station, val: string) => setData(d => ({ ...d, stationen: d.stationen.map(s => s.id === id ? { ...s, [key]: val } : s) }));

  const addAusbildung = () => setData(d => ({ ...d, ausbildung: [...d.ausbildung, { id: Date.now(), schule: "", abschluss: "", von: "", bis: "" }] }));
  const removeAusbildung = (id: number) => setData(d => ({ ...d, ausbildung: d.ausbildung.filter(a => a.id !== id) }));
  const setAusbildung = (id: number, key: keyof Ausbildung, val: string) => setData(d => ({ ...d, ausbildung: d.ausbildung.map(a => a.id === id ? { ...a, [key]: val } : a) }));

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("foto", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    const style = win.document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif}@page{size:A4;margin:0}`;
    const link = win.document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    const body = win.document.createElement("div");
    body.innerHTML = content.innerHTML;
    win.document.head.appendChild(link);
    win.document.head.appendChild(style);
    win.document.body.appendChild(body);
    win.document.title = "Lebenslauf";
    setTimeout(() => { win.print(); }, 600);
  };

  const STEPS = ["Persönliche Daten", "Berufserfahrung", "Ausbildung", "Fähigkeiten & Sprachen"];
  const STEP_LABELS = ["Persönliche", "Berufserfahrung", "Ausbildung", "Fähigkeiten"];
  const sectionStyle = { display: "flex", flexDirection: "column" as const, gap: 14 };

  return (
    <>
      <Nav />
      {showModal && <ApplyModal data={data} onClose={() => setShowModal(false)} />}

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section style={{ background: "#f5f5f7", padding: isMobile ? "40px 24px 28px" : "64px 48px 40px", textAlign: "center" }}>
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8ed",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: 13,
            color: "#707070",
            display: "inline-block",
            marginBottom: 20,
          }}>
            Kostenloser Lebenslauf-Generator
          </div>
          <h1 style={{
            fontSize: isMobile ? 36 : 52,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#1d1d1f",
            lineHeight: 1.05,
            marginBottom: 16,
          }}>
            Erstelle deinen perfekten<br />Lebenslauf
          </h1>
          <p style={{
            fontSize: isMobile ? 17 : 19,
            color: "#707070",
            lineHeight: 1.5,
            marginBottom: 32,
          }}>
            Professionelle Vorlagen. Sofort als PDF. Kostenlos.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handlePrint}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 999, border: "none",
                background: "#0071e3", color: "#fff",
                fontSize: 15, fontWeight: 400, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <DownloadIcon /> Als PDF speichern
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 999,
                border: "1px solid #e8e8ed", background: "#fff",
                color: "#1d1d1f", fontSize: 15, fontWeight: 400,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <MailIcon /> Bei PHE bewerben
            </button>
          </div>
        </div>
      </section>

      {/* ── MOBILE TAB SWITCHER ──────────────────────────────────────────── */}
      {isMobile && (
        <div style={{
          display: "flex", justifyContent: "center",
          background: "#f5f5f7", padding: "12px 16px",
          position: "sticky", top: 58, zIndex: 50,
          borderBottom: "1px solid #e8e8ed",
        }}>
          <div style={{
            background: "#e8e8ed", borderRadius: 999, padding: 3,
            display: "inline-flex", gap: 2,
          }}>
            {(["form", "preview"] as const).map((tab) => (
              <button key={tab} onClick={() => setMobileTab(tab)} style={{
                padding: "8px 20px", borderRadius: 999, border: "none",
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 15, fontWeight: 400,
                background: mobileTab === tab ? "#fff" : "transparent",
                color: "#1d1d1f",
                transition: "background 0.2s ease",
              }}>
                {tab === "form" ? "Formular" : "Vorschau"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN: FORM + PREVIEW ─────────────────────────────────────────── */}
      <div
        className={isMobile ? "" : "cv-layout px-section"}
        style={{
          maxWidth: isMobile ? "100%" : 1300,
          margin: "0 auto",
          paddingTop: isMobile ? 0 : 40,
          paddingBottom: 80,
          gap: 40,
          alignItems: "start",
          display: isMobile ? "block" : undefined,
          background: "#f5f5f7",
        }}
      >

        {/* LEFT: FORM */}
        <div
          className={isMobile ? "" : "cv-sidebar"}
          style={isMobile
            ? { display: mobileTab === "form" ? "block" : "none", padding: "20px 16px" }
            : { background: "#fff", borderRadius: 28, padding: 28 }
          }
        >
          {/* Template selector — Apple pill tabs */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#707070", marginBottom: 10 }}>Vorlage wählen</p>
            <div style={{
              background: "#fff",
              border: "1px solid #e8e8ed",
              borderRadius: 28,
              padding: "6px",
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontSize: 14,
                  fontWeight: 400,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: template === t.id ? "#0071e3" : "transparent",
                  color: template === t.id ? "#fff" : "#1d1d1f",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
              {TEMPLATES.find(t => t.id === template)?.colors.map((c, i) => (
                <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
              ))}
              <span style={{ fontSize: 12, color: "#707070", marginLeft: 4 }}>
                {TEMPLATES.find(t => t.id === template)?.desc}
              </span>
            </div>
          </div>

          {/* Step nav — Apple segmented control */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8ed",
            borderRadius: 14,
            padding: "4px",
            display: "flex",
            gap: 2,
            marginBottom: 20,
          }}>
            {STEPS.map((s, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 400,
                textAlign: "center", whiteSpace: "nowrap",
                background: step === i ? "#0071e3" : "transparent",
                color: step === i ? "#fff" : "#707070",
                transition: "background 0.2s ease, color 0.2s ease",
                fontFamily: "inherit",
              }}>
                {STEP_LABELS[i]}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div style={{ borderRadius: 14, padding: 0 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 20, letterSpacing: "-0.01em" }}>{STEPS[step]}</h2>

            {/* STEP 0: Persönliche Daten */}
            {step === 0 && (
              <div style={sectionStyle}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#707070", display: "block", marginBottom: 8 }}>Bewerbungsfoto (optional)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {data.foto ? (
                      <img src={data.foto} alt="Foto" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #e8e8ed" }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f5f5f7", border: "2px dashed #e8e8ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#aeaeb2" }}>?</div>
                    )}
                    <label style={{ cursor: "pointer", padding: "8px 16px", border: "1px solid #e8e8ed", borderRadius: 999, fontSize: 13, fontWeight: 400, color: "#0071e3", background: "#f5f5f7" }}>
                      Foto wählen
                      <input type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />
                    </label>
                    {data.foto && <button onClick={() => set("foto", "")} style={{ fontSize: 12, color: "#707070", background: "none", border: "none", cursor: "pointer" }}>Entfernen</button>}
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 12 }}>
                  <Input label="Vorname" value={data.vorname} onChange={v => set("vorname", v)} placeholder="Max" />
                  <Input label="Nachname" value={data.nachname} onChange={v => set("nachname", v)} placeholder="Mustermann" />
                </div>
                <Input label="Berufsbezeichnung" value={data.beruf} onChange={v => set("beruf", v)} placeholder="z.B. Elektroniker" />
                <div className="grid-2col" style={{ gap: 12 }}>
                  <Input label="E-Mail" value={data.email} onChange={v => set("email", v)} placeholder="max@email.de" type="email" />
                  <Input label="Telefon" value={data.telefon} onChange={v => set("telefon", v)} placeholder="+49 ..." />
                </div>
                <Input label="Adresse" value={data.adresse} onChange={v => set("adresse", v)} placeholder="Stadt, PLZ" />
                <div className="grid-2col" style={{ gap: 12 }}>
                  <Input label="Geburtsdatum" value={data.geburtsdatum} onChange={v => set("geburtsdatum", v)} placeholder="01.01.1990" />
                  <Input label="Geburtsort" value={data.geburtsort} onChange={v => set("geburtsort", v)} placeholder="Berlin" />
                </div>
                <Input label="Nationalität" value={data.nationalitaet} onChange={v => set("nationalitaet", v)} placeholder="Deutsch" />
                <Input label="Profil / Zusammenfassung" value={data.zusammenfassung} onChange={v => set("zusammenfassung", v)} placeholder="2-3 Sätze über Ihre Person und Ihre Stärken..." multiline />
              </div>
            )}

            {/* STEP 1: Berufserfahrung */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {data.stationen.map((s, i) => (
                  <div key={s.id} style={{ padding: 16, border: "1px solid #e8e8ed", borderRadius: 14, background: "#f5f5f7" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f" }}>Station {i + 1}</span>
                      {data.stationen.length > 1 && <button onClick={() => removeStation(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#707070" }}><TrashIcon /></button>}
                    </div>
                    <div style={sectionStyle}>
                      <Input label="Firma" value={s.firma} onChange={v => setStation(s.id, "firma", v)} placeholder="Firma GmbH" />
                      <Input label="Position" value={s.position} onChange={v => setStation(s.id, "position", v)} placeholder="z.B. Elektroniker" />
                      <div className="grid-2col" style={{ gap: 12 }}>
                        <Input label="Von" value={s.von} onChange={v => setStation(s.id, "von", v)} placeholder="03/2020" />
                        <Input label="Bis" value={s.bis} onChange={v => setStation(s.id, "bis", v)} placeholder="heute" />
                      </div>
                      <Input label="Tätigkeiten" value={s.beschreibung} onChange={v => setStation(s.id, "beschreibung", v)} placeholder="Welche Tätigkeiten haben Sie ausgeführt?" multiline />
                    </div>
                  </div>
                ))}
                <button onClick={addStation} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px", border: "1px solid #e8e8ed", borderRadius: 999,
                  background: "#f5f5f7", cursor: "pointer", fontSize: 13,
                  fontWeight: 400, color: "#0071e3", fontFamily: "inherit",
                }}>
                  <PlusIcon /> Station hinzufügen
                </button>
              </div>
            )}

            {/* STEP 2: Ausbildung */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {data.ausbildung.map((a, i) => (
                  <div key={a.id} style={{ padding: 16, border: "1px solid #e8e8ed", borderRadius: 14, background: "#f5f5f7" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f" }}>Ausbildung {i + 1}</span>
                      {data.ausbildung.length > 1 && <button onClick={() => removeAusbildung(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#707070" }}><TrashIcon /></button>}
                    </div>
                    <div style={sectionStyle}>
                      <Input label="Schule / Universität / Betrieb" value={a.schule} onChange={v => setAusbildung(a.id, "schule", v)} placeholder="Berufsschule XY" />
                      <Input label="Abschluss / Ausbildungsberuf" value={a.abschluss} onChange={v => setAusbildung(a.id, "abschluss", v)} placeholder="z.B. Elektroniker für Betriebstechnik" />
                      <div className="grid-2col" style={{ gap: 12 }}>
                        <Input label="Von" value={a.von} onChange={v => setAusbildung(a.id, "von", v)} placeholder="09/2015" />
                        <Input label="Bis" value={a.bis} onChange={v => setAusbildung(a.id, "bis", v)} placeholder="07/2018" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addAusbildung} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px", border: "1px solid #e8e8ed", borderRadius: 999,
                  background: "#f5f5f7", cursor: "pointer", fontSize: 13,
                  fontWeight: 400, color: "#0071e3", fontFamily: "inherit",
                }}>
                  <PlusIcon /> Ausbildung hinzufügen
                </button>
              </div>
            )}

            {/* STEP 3: Skills */}
            {step === 3 && (
              <div style={sectionStyle}>
                <Input label="Fähigkeiten (kommagetrennt)" value={data.faehigkeiten} onChange={v => set("faehigkeiten", v)} placeholder="SPS-Programmierung, EPLAN, Schaltschrankbau, ..." multiline />
                <Input label="Sprachen (kommagetrennt)" value={data.sprachen} onChange={v => set("sprachen", v)} placeholder="Deutsch (Muttersprache), Englisch (B2), ..." multiline />
                <div style={{ padding: 14, background: "#f0f7ff", borderRadius: 12, border: "1px solid #c7dff7" }}>
                  <p style={{ fontSize: 13, color: "#0071e3", fontWeight: 500, marginBottom: 4 }}>Tipp</p>
                  <p style={{ fontSize: 13, color: "#707070", lineHeight: 1.6 }}>Trennen Sie Einträge mit einem Komma, sie erscheinen als Liste in Ihrem Lebenslauf.</p>
                </div>
              </div>
            )}

            {/* Step nav buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid #e8e8ed" }}>
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                style={{ padding: "9px 20px", border: "1px solid #e8e8ed", borderRadius: 999, background: "#f5f5f7", cursor: step === 0 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 400, color: step === 0 ? "#aeaeb2" : "#1d1d1f", fontFamily: "inherit" }}>
                Zurück
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)}
                  style={{ padding: "9px 24px", border: "none", borderRadius: 999, background: "#0071e3", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 400, fontFamily: "inherit" }}>
                  Weiter →
                </button>
              ) : (
                <button onClick={handlePrint}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 24px", border: "none", borderRadius: 999, background: "#0071e3", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 400, fontFamily: "inherit" }}>
                  <DownloadIcon /> Als PDF speichern
                </button>
              )}
            </div>
          </div>

          {/* PDF + Bewerben buttons */}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={handlePrint}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", border: "1px solid #e8e8ed", borderRadius: 999, background: "#f5f5f7", cursor: "pointer", fontSize: 13, fontWeight: 400, color: "#0071e3", fontFamily: "inherit" }}>
              <DownloadIcon /> Lebenslauf als PDF speichern
            </button>

            {/* PHE CTA Card */}
            <div style={{ background: "#fff", border: "1px solid #e8e8ed", borderRadius: 20, padding: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", marginBottom: 4, letterSpacing: "-0.01em" }}>Jetzt bei PHE bewerben</p>
              <p style={{ fontSize: 13, color: "#707070", lineHeight: 1.6, marginBottom: 14 }}>
                Speichern Sie Ihr PDF und senden Sie es direkt an unser Team — wir finden passende Stellen. <strong style={{ color: "#1d1d1f", fontWeight: 500 }}>Kostenlos & unverbindlich.</strong>
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowModal(true)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 999, background: "#0071e3", color: "#fff", fontSize: 13, fontWeight: 400, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  <MailIcon /> Per E-Mail
                </button>
                <a
                  href={`${WA_LINK}?text=${encodeURIComponent(`Hallo PHE-Team, ich habe meinen Lebenslauf mit Ihrem Generator erstellt und möchte mich bewerben.\n\nName: ${data.vorname} ${data.nachname}\nBeruf: ${data.beruf || "–"}\nTelefon: ${data.telefon || "–"}`)}`}
                  target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 999, background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 400, textDecoration: "none" }}
                >
                  <WhatsAppIcon size={13} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div style={{
          position: isMobile ? "static" : "sticky",
          top: 80,
          display: isMobile && mobileTab !== "preview" ? "none" : "block",
          padding: isMobile ? "16px" : undefined,
          overflow: "hidden",
          minWidth: 0,
        }}>
          {/* Template pill tabs above preview */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 400, color: "#707070", flexShrink: 0 }}>Vorlage {template}</p>
            <button onClick={handlePrint} style={{
              display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              padding: "8px 18px", border: "none", borderRadius: 999,
              background: "#0071e3", color: "#fff",
              cursor: "pointer", fontSize: 13, fontWeight: 400, fontFamily: "inherit",
            }}>
              <DownloadIcon /> PDF speichern
            </button>
          </div>

          {/* CV preview card with subtle rotation hover */}
          <div
            onMouseEnter={() => setPreviewHovered(true)}
            onMouseLeave={() => setPreviewHovered(false)}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              transform: previewHovered ? "rotate(0deg)" : "rotate(-0.5deg)",
              transition: "transform 0.3s ease",
              background: "#fff",
              maxWidth: "100%",
            }}
          >
            <div ref={printRef} style={{
              transform: isMobile ? `scale(${Math.min(1, (typeof window !== "undefined" ? window.innerWidth - 32 : 360) / 794)})` : "scale(0.72)",
              transformOrigin: "top left",
              width: isMobile ? `${Math.round(100 / Math.min(1, (typeof window !== "undefined" ? window.innerWidth - 32 : 360) / 794))}%` : "138.89%",
              height: "auto",
            }}>
              <CVPreview data={data} template={template} />
            </div>
          </div>

          {isMobile && (
            <button onClick={handlePrint} style={{
              marginTop: 16, width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px", border: "none", borderRadius: 999,
              background: "#0071e3", color: "#fff",
              cursor: "pointer", fontSize: 14, fontWeight: 400, fontFamily: "inherit",
            }}>
              <DownloadIcon /> Als PDF speichern
            </button>
          )}

          {/* Apply CTA below preview on desktop */}
          {!isMobile && (
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px", borderRadius: 999, border: "none",
                  background: "#22c55e", color: "#fff",
                  fontSize: 14, fontWeight: 400, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <MailIcon /> Bei PHE bewerben
              </button>
              <a
                href={`${WA_LINK}?text=${encodeURIComponent(`Hallo PHE-Team, ich habe meinen Lebenslauf mit Ihrem Generator erstellt und möchte mich bewerben.\n\nName: ${data.vorname} ${data.nachname}\nBeruf: ${data.beruf || "–"}`)}`}
                target="_blank" rel="noreferrer"
                style={{
                  flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px", borderRadius: 999,
                  background: "#f5f5f7", color: "#1d1d1f",
                  fontSize: 14, fontWeight: 400, textDecoration: "none",
                  border: "1px solid #e8e8ed",
                }}
              >
                <WhatsAppIcon size={14} /> Via WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8e8ed" }}>
        <FaqSection title="Häufige Fragen zum Lebenslauf-Generator" items={[
          { q: "Was kostet der Lebenslauf-Generator?", a: "Der Lebenslauf-Generator ist vollständig kostenlos, kein Konto, keine versteckten Kosten, keine Wasserzeichen." },
          { q: "Wie lange dauert die Erstellung eines Lebenslaufs?", a: "Mit unserem Generator sind Sie in ca. 5 Minuten fertig. Füllen Sie die vier Schritte aus, die Vorschau aktualisiert sich in Echtzeit." },
          { q: "Kann ich zwischen verschiedenen Vorlagen wählen?", a: "Ja, es stehen 4 professionelle Vorlagen zur Auswahl: Klassisch Blau, Sidebar Links, Modern Grün und Elegant Violett, mit und ohne Foto." },
          { q: "Ist ein Bewerbungsfoto Pflicht?", a: "Nein, das Foto ist optional. Vorlage C (Modern Grün) eignet sich besonders gut ohne Foto. Die anderen Vorlagen zeigen das Foto prominent links oder oben." },
          { q: "Wie bewerbe ich mich direkt bei PHE?", a: "Klicken Sie auf 'Per E-Mail bewerben', ein Formular öffnet sich, Sie geben Name und Telefonnummer ein und Ihr E-Mail-Programm öffnet sich mit allen Daten. Bitte hängen Sie Ihr gespeichertes PDF daran." },
          { q: "Sind die Vorlagen ATS-optimiert?", a: "Ja. Klare Struktur, lesbare Schriftarten, alles was Bewerbermanagementsysteme bevorzugen." },
        ]} />
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "PHE Lebenslauf-Generator",
        "url": "https://phe-perm.de/lebenslauf-erstellen",
        "description": "Kostenloser Lebenslauf-Generator mit 4 Vorlagen für IT-, Elektro- und Baufachkräfte.",
        "applicationCategory": "BusinessApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "featureList": ["Kostenlos", "4 Vorlagen", "Live-Vorschau", "PDF-Export", "Foto-Upload"],
        "inLanguage": "de"
      }} />
    </>
  );
}
