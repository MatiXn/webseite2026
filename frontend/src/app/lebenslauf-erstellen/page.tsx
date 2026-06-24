"use client";
import { useState, useRef } from "react";
import Nav, { MAIL_APPLY, WA_LINK } from "../components/Nav";
import FaqSection from "../components/FaqSection";
import JsonLd from "../components/JsonLd";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

type Station = { id: number; firma: string; position: string; von: string; bis: string; beschreibung: string };
type Ausbildung = { id: number; schule: string; abschluss: string; von: string; bis: string };

type CVData = {
  vorname: string; nachname: string; beruf: string; email: string; telefon: string;
  adresse: string; geburtsort: string; geburtsdatum: string;
  zusammenfassung: string;
  stationen: Station[];
  ausbildung: Ausbildung[];
  faehigkeiten: string;
  sprachen: string;
  foto: string;
};

const EMPTY: CVData = {
  vorname: "", nachname: "", beruf: "", email: "", telefon: "",
  adresse: "", geburtsort: "", geburtsdatum: "",
  zusammenfassung: "",
  stationen: [{ id: 1, firma: "", position: "", von: "", bis: "", beschreibung: "" }],
  ausbildung: [{ id: 1, schule: "", abschluss: "", von: "", bis: "" }],
  faehigkeiten: "",
  sprachen: "",
  foto: "",
};

function Input({ label, value, onChange, placeholder, type = "text", multiline = false }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean }) {
  const base = {
    width: "100%", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 8,
    fontSize: 14, fontFamily: "inherit", color: "var(--navy)", outline: "none", background: "#fff",
  };
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

// ── CV PREVIEW ─────────────────────────────────────────────────────────────
function CVPreview({ data }: { data: CVData }) {
  const fullName = [data.vorname, data.nachname].filter(Boolean).join(" ") || "Dein Name";
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "297mm", width: "210mm", fontSize: "9pt", color: "#1a1a2e" }}>
      {/* Header */}
      <div style={{ background: "#1a2744", color: "#fff", padding: "32px 36px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "22pt", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>{fullName}</h1>
          <p style={{ fontSize: "11pt", color: "#93c5fd", fontWeight: 600, marginBottom: 16 }}>{data.beruf || "Berufsbezeichnung"}</p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: "8pt", color: "#cbd5e1" }}>
            {data.email && <span>{data.email}</span>}
            {data.telefon && <span>{data.telefon}</span>}
            {data.adresse && <span>{data.adresse}</span>}
          </div>
        </div>
        {data.foto && (
          <img src={data.foto} alt="Foto" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)", marginLeft: 24, flexShrink: 0 }} />
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr", gap: 0 }}>
        {/* Left column */}
        <div style={{ padding: "24px 28px 32px" }}>
          {/* Zusammenfassung */}
          {data.zusammenfassung && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: "9pt", fontWeight: 800, color: "#3d7cc9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e5eaf0" }}>Profil</h2>
              <p style={{ lineHeight: 1.7, color: "#374151" }}>{data.zusammenfassung}</p>
            </div>
          )}

          {/* Berufserfahrung */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: "9pt", fontWeight: 800, color: "#3d7cc9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e5eaf0" }}>Berufserfahrung</h2>
            {data.stationen.filter(s => s.firma || s.position).map(s => (
              <div key={s.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontWeight: 700, fontSize: "10pt", color: "#111827" }}>{s.position || "Position"}</p>
                  <span style={{ fontSize: "7.5pt", color: "#6b7280" }}>{[s.von, s.bis].filter(Boolean).join(" – ")}</span>
                </div>
                <p style={{ color: "#3d7cc9", fontWeight: 600, marginBottom: 4 }}>{s.firma}</p>
                {s.beschreibung && <p style={{ color: "#4b5563", lineHeight: 1.6 }}>{s.beschreibung}</p>}
              </div>
            ))}
            {!data.stationen.some(s => s.firma || s.position) && (
              <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Berufserfahrung hinzufügen...</p>
            )}
          </div>

          {/* Ausbildung */}
          <div>
            <h2 style={{ fontSize: "9pt", fontWeight: 800, color: "#3d7cc9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e5eaf0" }}>Ausbildung</h2>
            {data.ausbildung.filter(a => a.schule || a.abschluss).map(a => (
              <div key={a.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontWeight: 700, color: "#111827" }}>{a.abschluss || "Abschluss"}</p>
                  <span style={{ fontSize: "7.5pt", color: "#6b7280" }}>{[a.von, a.bis].filter(Boolean).join(" – ")}</span>
                </div>
                <p style={{ color: "#3d7cc9", fontWeight: 600 }}>{a.schule}</p>
              </div>
            ))}
            {!data.ausbildung.some(a => a.schule || a.abschluss) && (
              <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Ausbildung hinzufügen...</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ background: "#f8fafc", padding: "24px 20px 32px", borderLeft: "1px solid #e5eaf0" }}>
          {/* Persönliche Daten */}
          {(data.geburtsdatum || data.geburtsort) && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: "9pt", fontWeight: 800, color: "#3d7cc9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e5eaf0" }}>Persönliches</h2>
              {data.geburtsdatum && (
                <div style={{ marginBottom: 6 }}>
                  <p style={{ fontSize: "8pt", fontWeight: 700, color: "#6b7280" }}>Geburtsdatum</p>
                  <p>{data.geburtsdatum}</p>
                </div>
              )}
              {data.geburtsort && (
                <div>
                  <p style={{ fontSize: "8pt", fontWeight: 700, color: "#6b7280" }}>Geburtsort</p>
                  <p>{data.geburtsort}</p>
                </div>
              )}
            </div>
          )}

          {/* Fähigkeiten */}
          {data.faehigkeiten && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: "9pt", fontWeight: 800, color: "#3d7cc9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e5eaf0" }}>Fähigkeiten</h2>
              {data.faehigkeiten.split(",").map(f => f.trim()).filter(Boolean).map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3d7cc9", flexShrink: 0 }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sprachen */}
          {data.sprachen && (
            <div>
              <h2 style={{ fontSize: "9pt", fontWeight: 800, color: "#3d7cc9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #e5eaf0" }}>Sprachen</h2>
              {data.sprachen.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function LebenslaufPage() {
  const [data, setData] = useState<CVData>(EMPTY);
  const [step, setStep] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof CVData, val: string) => setData(d => ({ ...d, [key]: val }));

  const addStation = () => setData(d => ({
    ...d, stationen: [...d.stationen, { id: Date.now(), firma: "", position: "", von: "", bis: "", beschreibung: "" }]
  }));
  const removeStation = (id: number) => setData(d => ({ ...d, stationen: d.stationen.filter(s => s.id !== id) }));
  const setStation = (id: number, key: keyof Station, val: string) => setData(d => ({
    ...d, stationen: d.stationen.map(s => s.id === id ? { ...s, [key]: val } : s)
  }));

  const addAusbildung = () => setData(d => ({
    ...d, ausbildung: [...d.ausbildung, { id: Date.now(), schule: "", abschluss: "", von: "", bis: "" }]
  }));
  const removeAusbildung = (id: number) => setData(d => ({ ...d, ausbildung: d.ausbildung.filter(a => a.id !== id) }));
  const setAusbildung = (id: number, key: keyof Ausbildung, val: string) => setData(d => ({
    ...d, ausbildung: d.ausbildung.map(a => a.id === id ? { ...a, [key]: val } : a)
  }));

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

  const STEPS = [
    "Persönliche Daten",
    "Berufserfahrung",
    "Ausbildung",
    "Fähigkeiten & Sprachen",
  ];

  const sectionStyle = { display: "flex", flexDirection: "column" as const, gap: 14 };

  return (
    <>
      <Nav />

      {/* HEADER */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "40px 48px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Kostenlos & ohne Anmeldung</p>
          <h1 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900, color: "var(--navy)", letterSpacing: "-0.025em", marginBottom: 8 }}>
            Lebenslauf erstellen
          </h1>
          <p style={{ fontSize: 15, color: "var(--gray)" }}>Füllen Sie das Formular aus — Ihr Lebenslauf wird live als Vorschau angezeigt und kann als PDF gespeichert werden.</p>
        </div>
      </div>

      {/* MAIN: FORM + PREVIEW */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 48px 80px", display: "grid", gridTemplateColumns: "420px 1fr", gap: 40, alignItems: "start" }}>

        {/* LEFT: FORM */}
        <div>
          {/* Step nav */}
          <div style={{ display: "flex", marginBottom: 24, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 12, padding: 4, gap: 4 }}>
            {STEPS.map((s, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, textAlign: "center",
                background: step === i ? "linear-gradient(135deg,var(--blue),var(--violet))" : "transparent",
                color: step === i ? "#fff" : "var(--gray)",
                transition: "all .15s",
              }}>
                {i + 1}. {s.split(" ")[0]}
              </button>
            ))}
          </div>

          <div style={{ border: "1.5px solid var(--border)", borderRadius: 14, padding: 24, background: "#fff" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", marginBottom: 20 }}>{STEPS[step]}</h2>

            {/* STEP 0: Persönliche Daten */}
            {step === 0 && (
              <div style={sectionStyle}>
                {/* Foto Upload */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Bewerbungsfoto (optional)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {data.foto ? (
                      <img src={data.foto} alt="Foto" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg)", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "var(--gray-light)" }}>?</div>
                    )}
                    <label style={{ cursor: "pointer", padding: "8px 16px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "var(--gray)" }}>
                      Foto wählen
                      <input type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />
                    </label>
                    {data.foto && <button onClick={() => set("foto", "")} style={{ fontSize: 12, color: "var(--gray-light)", background: "none", border: "none", cursor: "pointer" }}>Entfernen</button>}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="Vorname" value={data.vorname} onChange={v => set("vorname", v)} placeholder="Max" />
                  <Input label="Nachname" value={data.nachname} onChange={v => set("nachname", v)} placeholder="Mustermann" />
                </div>
                <Input label="Berufsbezeichnung" value={data.beruf} onChange={v => set("beruf", v)} placeholder="z.B. Elektroniker" />
                <Input label="E-Mail" value={data.email} onChange={v => set("email", v)} placeholder="max@email.de" type="email" />
                <Input label="Telefon" value={data.telefon} onChange={v => set("telefon", v)} placeholder="+49 ..." />
                <Input label="Adresse" value={data.adresse} onChange={v => set("adresse", v)} placeholder="Stadt, PLZ" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="Geburtsdatum" value={data.geburtsdatum} onChange={v => set("geburtsdatum", v)} placeholder="01.01.1990" />
                  <Input label="Geburtsort" value={data.geburtsort} onChange={v => set("geburtsort", v)} placeholder="Berlin" />
                </div>
                <Input label="Profil / Zusammenfassung" value={data.zusammenfassung} onChange={v => set("zusammenfassung", v)} placeholder="2-3 Sätze über Ihre Person und Ihre Stärken..." multiline />
              </div>
            )}

            {/* STEP 1: Berufserfahrung */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {data.stationen.map((s, i) => (
                  <div key={s.id} style={{ padding: 16, border: "1.5px solid var(--border)", borderRadius: 10, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)" }}>Station {i + 1}</span>
                      {data.stationen.length > 1 && (
                        <button onClick={() => removeStation(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-light)" }}><TrashIcon /></button>
                      )}
                    </div>
                    <div style={sectionStyle}>
                      <Input label="Firma" value={s.firma} onChange={v => setStation(s.id, "firma", v)} placeholder="Firma GmbH" />
                      <Input label="Position" value={s.position} onChange={v => setStation(s.id, "position", v)} placeholder="z.B. Elektroniker" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Input label="Von" value={s.von} onChange={v => setStation(s.id, "von", v)} placeholder="03/2020" />
                        <Input label="Bis" value={s.bis} onChange={v => setStation(s.id, "bis", v)} placeholder="heute" />
                      </div>
                      <Input label="Tätigkeiten (kurz)" value={s.beschreibung} onChange={v => setStation(s.id, "beschreibung", v)} placeholder="Welche Tätigkeiten haben Sie ausgeführt?" multiline />
                    </div>
                  </div>
                ))}
                <button onClick={addStation} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px", border: "1.5px dashed var(--border)", borderRadius: 10,
                  background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--blue)",
                }}>
                  <PlusIcon /> Station hinzufügen
                </button>
              </div>
            )}

            {/* STEP 2: Ausbildung */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {data.ausbildung.map((a, i) => (
                  <div key={a.id} style={{ padding: 16, border: "1.5px solid var(--border)", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)" }}>Ausbildung {i + 1}</span>
                      {data.ausbildung.length > 1 && (
                        <button onClick={() => removeAusbildung(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-light)" }}><TrashIcon /></button>
                      )}
                    </div>
                    <div style={sectionStyle}>
                      <Input label="Schule / Universität / Betrieb" value={a.schule} onChange={v => setAusbildung(a.id, "schule", v)} placeholder="Berufsschule XY" />
                      <Input label="Abschluss / Ausbildungsberuf" value={a.abschluss} onChange={v => setAusbildung(a.id, "abschluss", v)} placeholder="z.B. Elektroniker für Betriebstechnik" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Input label="Von" value={a.von} onChange={v => setAusbildung(a.id, "von", v)} placeholder="09/2015" />
                        <Input label="Bis" value={a.bis} onChange={v => setAusbildung(a.id, "bis", v)} placeholder="07/2018" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addAusbildung} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px", border: "1.5px dashed var(--border)", borderRadius: 10,
                  background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--blue)",
                }}>
                  <PlusIcon /> Ausbildung hinzufügen
                </button>
              </div>
            )}

            {/* STEP 3: Skills */}
            {step === 3 && (
              <div style={sectionStyle}>
                <Input
                  label="Fähigkeiten (kommagetrennt)"
                  value={data.faehigkeiten}
                  onChange={v => set("faehigkeiten", v)}
                  placeholder="SPS-Programmierung, EPLAN, Schaltschrankbau, ..."
                  multiline
                />
                <Input
                  label="Sprachen (kommagetrennt)"
                  value={data.sprachen}
                  onChange={v => set("sprachen", v)}
                  placeholder="Deutsch (Muttersprache), Englisch (B2), ..."
                  multiline
                />
                <div style={{ marginTop: 8, padding: 16, background: "#f0f7ff", borderRadius: 10, border: "1.5px solid #c7dff7" }}>
                  <p style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, marginBottom: 4 }}>Tipp</p>
                  <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6 }}>
                    Trennen Sie Fähigkeiten und Sprachen mit einem Komma — sie erscheinen automatisch als Liste in Ihrem Lebenslauf.
                  </p>
                </div>
              </div>
            )}

            {/* Step nav buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                style={{ padding: "9px 20px", border: "1.5px solid var(--border)", borderRadius: 8, background: "none", cursor: step === 0 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, color: step === 0 ? "var(--gray-light)" : "var(--navy)" }}>
                Zurück
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)}
                  style={{ padding: "9px 24px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,var(--blue),var(--violet))", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  Weiter
                </button>
              ) : (
                <button onClick={handlePrint}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 24px", border: "none", borderRadius: 8, background: "var(--navy)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  <DownloadIcon /> Als PDF speichern
                </button>
              )}
            </div>
          </div>

          {/* Always visible PDF + Send buttons */}
          {step > 0 && (
            <>
              <button onClick={handlePrint}
                style={{ marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", border: "1.5px solid var(--border)", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>
                <DownloadIcon /> Lebenslauf als PDF drucken / speichern
              </button>

              {/* Info banner + send to PHE */}
              <div style={{ marginTop: 16, background: "linear-gradient(135deg,#f0f7ff,#f5f0ff)", border: "1.5px solid #c7dff7", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>
                  📩 Lebenslauf direkt an PHE senden
                </p>
                <p style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.6, marginBottom: 12 }}>
                  Speichern Sie zuerst Ihr PDF und senden Sie es direkt an unser Team — wir finden passende Stellen für Sie. <strong>Kostenlos & unverbindlich.</strong>
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={`mailto:${MAIL_APPLY}?subject=${encodeURIComponent(`Bewerbung von ${data.vorname} ${data.nachname}${data.beruf ? ` – ${data.beruf}` : ""}`)}&body=${encodeURIComponent(`Hallo PHE-Team,\n\nhiermit bewerbe ich mich bei Ihnen.\n\nMein Name: ${data.vorname} ${data.nachname}\nBeruf: ${data.beruf || "–"}\nTelefon: ${data.telefon || "–"}\nE-Mail: ${data.email || "–"}\n\nMeinen Lebenslauf habe ich als PDF angehängt.\n\nMit freundlichen Grüßen\n${data.vorname} ${data.nachname}`)}`}
                    style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 8, background: "var(--blue)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                  >
                    ✉️ Per E-Mail bewerben
                  </a>
                  <a
                    href={`${WA_LINK}?text=${encodeURIComponent(`Hallo PHE-Team, ich habe meinen Lebenslauf mit Ihrem Generator erstellt und bewerbe mich hiermit.\n\nName: ${data.vorname} ${data.nachname}\nBeruf: ${data.beruf || "–"}\nTelefon: ${data.telefon || "–"}`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 8, background: "var(--wa)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                  >
                    <WhatsAppIcon size={13} /> Via WhatsApp
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--gray)" }}>Live-Vorschau</p>
            <button onClick={handlePrint} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", border: "none", borderRadius: 8,
              background: "var(--navy)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
            }}>
              <DownloadIcon /> Als PDF speichern
            </button>
          </div>
          <div style={{ border: "1.5px solid var(--border)", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            <div ref={printRef} style={{ transform: "scale(0.75)", transformOrigin: "top left", width: "133.33%", height: "auto" }}>
              <CVPreview data={data} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <FaqSection title="Häufige Fragen zum Lebenslauf-Generator" items={[
          { q: "Was kostet der Lebenslauf-Generator?", a: "Der Lebenslauf-Generator ist vollständig kostenlos — kein Konto, keine versteckten Kosten, keine Wasserzeichen. Sie können ihn unbegrenzt nutzen und beliebig viele PDFs erstellen." },
          { q: "Wie lange dauert die Erstellung eines Lebenslaufs?", a: "Mit unserem Generator sind Sie in ca. 5 Minuten fertig. Füllen Sie die vier Schritte aus: persönliche Daten, Berufserfahrung, Ausbildung und Fähigkeiten — die Vorschau aktualisiert sich in Echtzeit." },
          { q: "Kann ich meinen Lebenslauf als PDF herunterladen?", a: "Ja. Klicken Sie auf 'Als PDF speichern' und der Druckdialog Ihres Browsers öffnet sich. Wählen Sie 'Als PDF speichern' als Drucker — das PDF wird im professionellen A4-Format erstellt." },
          { q: "Ist ein Bewerbungsfoto im Lebenslauf Pflicht?", a: "In Deutschland ist ein Foto üblich, aber nicht gesetzlich vorgeschrieben. Sie können in unserem Generator optional ein Foto hochladen. Es erscheint professionell im Header des Lebenslaufs." },
          { q: "Welche Informationen gehören in einen deutschen Lebenslauf?", a: "Ein deutscher Lebenslauf enthält typischerweise: persönliche Daten (Name, Kontakt, Geburtsdatum), ein Profil/Zusammenfassung, Berufserfahrung (chronologisch rückwärts), Ausbildung, Fähigkeiten und Sprachen." },
          { q: "Kann ich den Lebenslauf auch für andere Bewerbungen nutzen?", a: "Ja, der erstellte Lebenslauf kann für beliebige Bewerbungen genutzt werden — nicht nur für PHE. Es gibt keine Einschränkungen. Wir empfehlen Ihnen außerdem, Ihren fertigen Lebenslauf direkt via WhatsApp oder E-Mail an uns zu senden, damit wir Sie optimal vermitteln können." },
          { q: "Sind die Templates ATS-optimiert?", a: "Ja. Unsere Templates sind so aufgebaut, dass moderne Bewerbermanagementsysteme (ATS) sie korrekt auslesen können. Klare Struktur, keine Tabellen, lesbare Schriftarten — alles was ein ATS bevorzugt." },
        ]} />
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "PHE Lebenslauf-Generator",
        "url": "https://phe-perm.de/lebenslauf-erstellen",
        "description": "Kostenloser Lebenslauf-Generator für IT-, Elektro- und Baufachkräfte. Live-Vorschau, PDF-Export, ATS-optimiert, kein Konto nötig.",
        "applicationCategory": "BusinessApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "featureList": ["Kostenlos", "Kein Konto erforderlich", "Live-Vorschau", "PDF-Export", "ATS-optimiert", "Foto-Upload"],
        "inLanguage": "de"
      }} />
    </>
  );
}
