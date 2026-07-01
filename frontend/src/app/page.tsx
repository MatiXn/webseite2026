"use client";
import Image from "next/image";
import Link from "next/link";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";

const WA_LINK = "https://wa.me/491739980100";
const MAIL_APPLY = "bewerbung@phe-perm.de";

type Job = { title: string; category: string; location: string; salary: string; tags: string[]; color: string };

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [form, setForm] = useState({ vorname: "", nachname: "", telefon: "", position: job.title });
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid var(--border)", fontSize: 14,
    color: "var(--navy)", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };
  const handleSubmit = () => {
    const body = `Hallo PHE-Team,\n\nich möchte mich auf folgende Stelle bewerben:\n\nPosition: ${form.position}\nVorname: ${form.vorname}\nNachname: ${form.nachname}\nTelefonnummer: ${form.telefon}\n\nIch freue mich auf Ihre Rückmeldung.\n\nMit freundlichen Grüßen\n${form.vorname} ${form.nachname}`;
    window.location.href = `mailto:${MAIL_APPLY}?subject=${encodeURIComponent(`Bewerbung: ${form.position}`)}&body=${encodeURIComponent(body)}`;
    onClose();
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 28, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>Jetzt bewerben</h2>
            <p style={{ fontSize: 13, color: "var(--gray)" }}>{form.position}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray)", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray)", display: "block", marginBottom: 6 }}>Vorname *</label>
              <input style={inputStyle} value={form.vorname} onChange={e => setForm(f => ({ ...f, vorname: e.target.value }))} placeholder="Max" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray)", display: "block", marginBottom: 6 }}>Nachname *</label>
              <input style={inputStyle} value={form.nachname} onChange={e => setForm(f => ({ ...f, nachname: e.target.value }))} placeholder="Mustermann" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray)", display: "block", marginBottom: 6 }}>Telefonnummer *</label>
            <input style={inputStyle} type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+49 123 456789" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--gray)", display: "block", marginBottom: 6 }}>Gewünschte Position</label>
            <input style={inputStyle} value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1.5px solid var(--border)", background: "#fff", color: "var(--gray)", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          <button onClick={handleSubmit} disabled={!form.vorname || !form.nachname || !form.telefon} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: (!form.vorname || !form.nachname || !form.telefon) ? "var(--border)" : "linear-gradient(135deg,var(--blue),var(--violet))", color: "#fff", fontWeight: 700, fontSize: 14, cursor: (!form.vorname || !form.nachname || !form.telefon) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>E-Mail öffnen & absenden</button>
        </div>
        <p style={{ fontSize: 11, color: "var(--gray-light)", textAlign: "center", marginTop: 12 }}>Ihr E-Mail-Programm öffnet sich mit den ausgefüllten Daten.</p>
      </div>
    </div>
  );
}

const MailIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
  </svg>
);

const REVIEWS = [
  { name: "Romze", rating: 5, time: "vor einem Jahr", text: "Ich bin begeistert von meiner Erfahrung mit PHE. Das Team war äußerst professionell, freundlich und engagiert. Vom ersten Kontakt bis zur erfolgreichen Vermittlung fühlte ich mich hervorragend betreut. Sie haben meine Wünsche und Bedürfnisse stets in den Vordergrund gestellt." },
  { name: "Francis Dorman", rating: 5, time: "vor einem Jahr", text: "Top Betreuung und klasse Service! Von Anfang an habe ich mich super aufgehoben gefühlt. Sehr empfehlenswert!" },
  { name: "Mas Mozsavi", rating: 5, time: "vor einem Jahr", text: "Ich hatte das große Glück, Herrn Alexandros Selemidis von der PHE-Perm Engineering Ingenieure & Techniker GmbH kennenzulernen. Seine unermüdliche Unterstützung und sein tiefes Verständnis für meine beruflichen Ziele haben ihn für mich zu einem unverzichtbaren Partner gemacht." },
  { name: "Birk Burmeister", rating: 5, time: "vor einem Jahr", text: "Mobin Askaryar von PHE-Perm Engineering hat mich bei meiner Jobsuche exzellent unterstützt. Seine Beratung war durchweg professionell und auf meine individuellen Bedürfnisse zugeschnitten. Ich kann PHE-Perm Engineering für die Jobsuche absolut weiterempfehlen." },
  { name: "Romeo", rating: 5, time: "vor einem Jahr", text: "Ich möchte die außergewöhnliche und prompte Unterstützung von Alexandros Selemidis würdigen. Durch sein engagiertes Engagement gelang es mir, in kürzester Zeit eine passende Arbeitsstelle zu finden." },
  { name: "Benedikt Pilz", rating: 5, time: "vor einem Jahr", text: "Bester Service den ich seit langem erlebt habe. Alexandros hat sich voll auf mich als Person eingestellt um meine aktuelle persönliche Situation zu verstehen und voll umfänglich auf meine Wünsche einzugehen." },
  { name: "Milian Wuerges", rating: 5, time: "vor einem Jahr", text: "Kompetent, schnell und achtet sehr auf die Bedürfnisse der Kunden. Ich wurde direkt gefragt, was ich mir vorstelle, und mir wurden umfangreiche Fragen gestellt um einen für mich angenehmen Job zu finden." },
  { name: "Norbert Lach", rating: 5, time: "vor einem Jahr", text: "Ich habe von Alex sofort eine Rückmeldung auf meine Bewerbung bekommen und wir haben über meine Qualifikationen gesprochen. In einer Woche hatte ich schon mein erstes Vorstellungsgespräch bei einem Unternehmen, wo alles gepasst hat." },
];

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC04">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const JOB_TITLES = [
  "Elektroniker",
  "Mechatroniker",
  "SPS'ler",
  "Bauleiter",
  "Elektroplaner",
  "Projektleiter",
];

function SlideTitle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % JOB_TITLES.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        background: "linear-gradient(135deg,#3d7cc9,#7c3aed)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
      }}
    >
      {JOB_TITLES[index]}
    </span>
  );
}

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const JOBS = [
  { category: "Elektrotechnik", color: "#f59e0b", title: "Elektroniker für Betriebstechnik (m/w/d)", location: "Köln", salary: "45.000 – 54.000 €/Jahr", tags: ["Festanstellung", "Instandhaltung", "Keine Schicht"] },
  { category: "IT / Automation", color: "#7c3aed", title: "SPS-Programmierer / Automatisierungstechniker (m/w/d)", location: "München", salary: "50.000 – 72.000 €/Jahr", tags: ["Festanstellung", "Siemens TIA Portal", "SCADA"] },
  { category: "Mechatronik", color: "#3d7cc9", title: "Servicetechniker Kältetechnik (m/w/d)", location: "Hamburg", salary: "48.000 – 62.000 €/Jahr", tags: ["Festanstellung", "Kältetechnik", "Dienstwagen"] },
  { category: "Elektrotechnik", color: "#f59e0b", title: "Servicetechniker Photovoltaik (m/w/d)", location: "Düsseldorf", salary: "44.000 – 54.000 €/Jahr", tags: ["Festanstellung", "Photovoltaik", "Außendienst"] },
  { category: "Mechatronik", color: "#3d7cc9", title: "Mechatroniker als Servicetechniker (m/w/d)", location: "Berlin", salary: "45.000 – 58.000 €/Jahr", tags: ["Festanstellung", "Wartung", "Instandhaltung"] },
  { category: "Elektrotechnik", color: "#f59e0b", title: "Elektroniker MSR / Gebäudeautomation (m/w/d)", location: "Frankfurt", salary: "48.000 – 60.000 €/Jahr", tags: ["Festanstellung", "MSR", "KNX"] },
];

const FAN_JOBS = [
  { category: "Elektrotechnik", color: "#f59e0b", title: "Elektroniker für Betriebstechnik (m/w/d)", location: "Köln", salary: "45.000 – 54.000 €/Jahr", tags: ["Instandhaltung", "Keine Schicht"] },
  { category: "IT / Automation", color: "#7c3aed", title: "SPS-Programmierer / Automatisierungstechniker (m/w/d)", location: "München", salary: "50.000 – 72.000 €/Jahr", tags: ["Siemens TIA Portal", "SCADA"] },
  { category: "Mechatronik", color: "#3d7cc9", title: "Servicetechniker Kältetechnik (m/w/d)", location: "Hamburg", salary: "48.000 – 62.000 €/Jahr", tags: ["Kältetechnik", "Dienstwagen"] },
  { category: "Elektrotechnik", color: "#f59e0b", title: "Servicetechniker Photovoltaik (m/w/d)", location: "Düsseldorf", salary: "44.000 – 54.000 €/Jahr", tags: ["Photovoltaik", "Außendienst"] },
];

// Fan positions: offset 0 = active center, 1 = right, 2 = far-right, 3 = left
const FAN_POS = [
  { ry:   0, tx:    0, tz:   0, scale: 1,    opacity: 1,    zIndex: 4 },
  { ry: -32, tx:  225, tz: -80, scale: 0.84, opacity: 0.95, zIndex: 3 },
  { ry: -52, tx:  375, tz: -180, scale: 0.68, opacity: 0.80, zIndex: 2 },
  { ry:  32, tx: -225, tz: -80, scale: 0.84, opacity: 0.95, zIndex: 3 },
];

function JobFan({ onApply }: { onApply: (job: Job) => void }) {
  const [active, setActive] = useState(0);
  const total = FAN_JOBS.length;

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % total), 3400);
    return () => clearInterval(t);
  }, [total]);

  const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );

  return (
    <div style={{ userSelect: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 3-D fan container */}
      <div style={{ perspective: "1100px", perspectiveOrigin: "50% 40%", width: "100%", height: 380, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          {FAN_JOBS.map((job, i) => {
            const offset = (i - active + total) % total;
            const pos = FAN_POS[offset] ?? FAN_POS[0];
            const isCenter = offset === 0;

            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: 295,
                  marginLeft: -147,
                  marginTop: -165,
                  height: 330,
                  transform: `translateX(${pos.tx}px) translateZ(${pos.tz}px) rotateY(${pos.ry}deg) scale(${pos.scale})`,
                  transformOrigin: "center bottom",
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                  transition: "transform 0.55s cubic-bezier(.22,1,.36,1), opacity 0.4s ease",
                  cursor: isCenter ? "default" : "pointer",
                }}
              >
                <div style={{
                  background: "#fff",
                  border: "1.5px solid var(--border)",
                  borderRadius: 18,
                  padding: 22,
                  height: "100%",
                  boxSizing: "border-box",
                  boxShadow: isCenter
                    ? "0 24px 64px rgba(0,0,0,0.14)"
                    : "0 8px 24px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.4s ease",
                }}>
                  {/* Category */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: job.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: job.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{job.category}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, background: "#f0f7ff", color: "var(--blue)", padding: "2px 7px", borderRadius: 5 }}>Festanstellung</span>
                  </div>
                  {/* Title */}
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--navy)", lineHeight: 1.35, marginBottom: 10, flex: 1 }}>{job.title}</h3>
                  {/* Location + Salary */}
                  <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}><LocationIcon /> {job.location}</div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 13 }}>{job.salary}</div>
                  </div>
                  {/* Tags */}
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                    {job.tags.map(t => (
                      <span key={t} style={{ fontSize: 10, fontWeight: 600, background: "var(--bg)", color: "var(--gray)", padding: "3px 8px", borderRadius: 5 }}>{t}</span>
                    ))}
                  </div>
                  {/* CTA, only on active card */}
                  {isCenter && (
                    <button
                      onClick={e => { e.stopPropagation(); onApply(job); }}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: "var(--blue)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "9px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      <MailIcon size={12} /> Jetzt bewerben
                    </button>
                  )}
                  {!isCenter && (
                    <div style={{ fontSize: 11, color: "var(--gray-light)", textAlign: "center" }}>Klicken zum Ansehen</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        {FAN_JOBS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? 20 : 7, height: 7, borderRadius: 4, border: "none",
            background: i === active ? "var(--blue)" : "var(--border)",
            cursor: "pointer", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Kontaktaufnahme",
    desc: "Nehmen Sie per WhatsApp oder E-Mail Kontakt auf, ohne Formulare, ohne Aufwand. Wir melden uns innerhalb von 24 Stunden.",
  },
  {
    n: "2",
    title: "Persönliches Beratungsgespräch",
    desc: "In einem persönlichen Gespräch ermitteln wir Ihre Wünsche, Qualifikationen und passende Stellenangebote.",
  },
  {
    n: "3",
    title: "Begleitung bis zur Einstellung",
    desc: "Wir bereiten Sie auf Vorstellungsgespräche vor und unterstützen bei der Gehaltsverhandlung, vollständig kostenlos.",
  },
  {
    n: "4",
    title: "Festanstellung & Einstieg",
    desc: "Vertragsunterzeichnung direkt beim Unternehmen, Ihr neuer Karriereabschnitt beginnt.",
  },
];

function YaftoForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const a = document.createElement("a");
    a.href = `mailto:warteliste@yafto.de?subject=${encodeURIComponent("Warteliste: " + email)}&body=${encodeURIComponent(`Hallo YAFTO-Team,\n\nbitte tragt mich in die Warteliste ein:\n\nE-Mail: ${email}\n\nMit freundlichen Grüßen`)}`;
    a.click();
    setSent(true);
  };

  return (
    <>
      {sent && (
        <div onClick={() => setSent(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: "40px 36px",
            width: "100%", maxWidth: 440, textAlign: "center",
            boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--blue),var(--violet))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--navy)", marginBottom: 10 }}>
              Sie sind auf der Warteliste!
            </h2>
            <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.6, marginBottom: 8 }}>
              Ihr E-Mail-Programm öffnet sich gleich. Bitte senden Sie die E-Mail ab, um Ihren Platz zu sichern.
            </p>
            <p style={{ fontSize: 13, color: "var(--gray-light)", marginBottom: 28 }}>
              Wir informieren Sie, sobald YAFTO startet.
            </p>
            <button onClick={() => setSent(false)} style={{
              background: "linear-gradient(135deg,var(--blue),var(--violet))",
              color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 32px",
              borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
            }}>
              Alles klar!
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="yafto-form">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Ihre E-Mail-Adresse"
          style={{
            flex: 1, background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.2)",
            color: "#fff", fontSize: 14, padding: "12px 16px", borderRadius: 8, outline: "none"
          }}
        />
        <button type="submit" style={{
          background: "linear-gradient(135deg,var(--blue),var(--violet))",
          color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 20px",
          borderRadius: 8, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit"
        }}>
          Zur Warteliste anmelden
        </button>
      </form>
    </>
  );
}

export default function Home() {
  const [modalJob, setModalJob] = useState<Job | null>(null);
  return (
    <>
      {modalJob && <ApplyModal job={modalJob} onClose={() => setModalJob(null)} />}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LocalBusiness",
            "name": "PHE-Perm Engineering Ingenieure & Techniker GmbH",
            "url": "https://phe-perm.de",
            "logo": "https://phe-perm.de/phe-logo.png",
            "telephone": "+491739980100",
            "email": "info@phe-perm.de",
            "address": { "@type": "PostalAddress", "streetAddress": "Hüttenstraße 30", "addressLocality": "Düsseldorf", "postalCode": "40215", "addressCountry": "DE" },
            "description": "PHE-Perm Engineering vermittelt Fachkräfte in Festanstellung in den Bereichen IT, Elektrotechnik und Bau, kostenlos für Bewerber.",
            "areaServed": "DE",
            "priceRange": "Kostenlos für Bewerber",
            "sameAs": ["https://www.instagram.com/phe_perm_engineering", "https://www.linkedin.com/company/phe-perm-engineering"]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Was kostet die Vermittlung durch PHE-Perm Engineering?", "acceptedAnswer": { "@type": "Answer", "text": "Die Vermittlung ist für Bewerber vollständig kostenlos. PHE-Perm Engineering wird ausschließlich vom Unternehmen bezahlt." } },
              { "@type": "Question", "name": "Wie funktioniert die Bewerbung bei PHE?", "acceptedAnswer": { "@type": "Answer", "text": "Nehmen Sie per WhatsApp oder E-Mail Kontakt auf. Unser Team meldet sich innerhalb von 24 Stunden und unterbreitet passende Stellenangebote." } },
              { "@type": "Question", "name": "Wie lange dauert es, bis ich einen neuen Job finde?", "acceptedAnswer": { "@type": "Answer", "text": "Viele unserer Bewerber finden innerhalb von 2–6 Wochen eine neue Stelle." } },
              { "@type": "Question", "name": "Welche Jobs vermittelt PHE-Perm Engineering?", "acceptedAnswer": { "@type": "Answer", "text": "Festanstellungen in Elektrotechnik, IT & Automation sowie Bau & TGA." } },
              { "@type": "Question", "name": "Ist PHE-Perm Engineering eine Zeitarbeitsfirma?", "acceptedAnswer": { "@type": "Answer", "text": "Nein. Wir vermitteln ausschließlich Festanstellungen direkt beim Unternehmen, keine Zeitarbeit, keine Leiharbeit." } },
            ]
          }
        ]
      }} />
      {/* ── NAV ── */}
      <Nav />

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", background: "#f5f5f7" }} className="section-pad px-section">
        <div className="hero-grid" style={{ gap: 64 }}>

          {/* LEFT: Text */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#f0f7ff", border: "1px solid #c7dff7", color: "var(--blue)",
              fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 20, marginBottom: 24
            }}>
              <span style={{ background: "var(--blue)", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>NEU</span>
              <Link href="/lebenslauf-erstellen" style={{ color: "inherit", textDecoration: "none" }}>Kostenloser CV-Generator verfügbar →</Link>
            </div>

            <h1 style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", color: "#1d1d1f", marginBottom: 20 }}>
              Ihr nächster Job als<br />
              <SlideTitle /><br />
              <em className="grad-text" style={{ fontStyle: "normal" }}>Schnell. Direkt. Kostenlos.</em>
            </h1>

            <p style={{ fontSize: 19, color: "#707070", lineHeight: 1.4, marginBottom: 32, maxWidth: 480 }}>
              PHE-Perm Engineering vermittelt Fachkräfte in Festanstellung, persönlich, schnell und ohne Gebühren für Bewerber.
            </p>

            <div className="hero-buttons">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <WhatsAppIcon size={18} /> Via WhatsApp bewerben
              </a>
              <a href={`mailto:${MAIL_APPLY}?subject=${encodeURIComponent("Bewerbung")}&body=${encodeURIComponent("Hallo PHE-Team,\n\nmein Name:\nTelefonnummer:\n\nIch bewerbe mich und freue mich auf Ihre Rückmeldung.")}`} className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <MailIcon size={16} /> Per E-Mail bewerben
              </a>
            </div>

            {/* Google rating */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 20px" }}>
              <GoogleIcon />
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>5.0</span>
              <span style={{ fontSize: 13, color: "var(--gray)" }}>· 32 Google-Bewertungen</span>
            </div>
          </div>

          {/* RIGHT: Job Cards Fan, hidden on mobile */}
          <div className="job-fan-wrapper"><JobFan onApply={setModalJob} /></div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }} className="stats-row">
          {[
            { num: "5.000+", label: "Erfolgreiche Matches" },
            { num: "12 Std.", label: "Durchschnittliche Reaktionszeit" },
            { num: "100%", label: "Kostenlos für Bewerber" },
            { num: "5.0★", label: "Bewertung unserer Kandidaten" },
          ].map((s) => (
            <div key={s.num}>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#0071e3", letterSpacing: "-0.02em" }}>{s.num}</div>
              <div style={{ fontSize: 14, color: "#707070", marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JOBS ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-header-row">
            <div>
              <span className="tag">Aktuelle Stellen</span>
              <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.015em", color: "#1d1d1f" }}>
                Offene Jobs, <em className="grad-text" style={{ fontStyle: "normal" }}>jetzt bewerben</em>
              </h2>
            </div>
            <Link href="/jobs" style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)", textDecoration: "none", whiteSpace: "nowrap" }}>Alle Stellen ansehen →</Link>
          </div>

          <div className="grid-3col">
            {JOBS.map((job) => (
              <div key={job.title} style={{
                background: "#f5f5f7", borderRadius: 28, padding: 24,
                transition: "border-color .2s", cursor: "pointer",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: job.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.color, display: "inline-block" }} />
                  {job.category}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--navy)", marginBottom: 8, lineHeight: 1.3 }}>{job.title}</h3>
                <div style={{ fontSize: 13, color: "var(--gray)", marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span>{job.location}</span>
                  <span>{job.salary}</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                  {job.tags.map((t) => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 600, background: "var(--bg)", color: "var(--gray)", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "var(--wa)", color: "#fff", fontSize: 12, fontWeight: 700,
                    padding: "9px 12px", borderRadius: 8, textDecoration: "none"
                  }}>
                    <WhatsAppIcon size={13} /> WhatsApp
                  </Link>
                  <button onClick={() => setModalJob(job)} style={{
                    flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "var(--bg)", color: "var(--navy)", fontSize: 12, fontWeight: 700,
                    padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                    border: "1.5px solid var(--border)", fontFamily: "inherit",
                  }}>
                    <MailIcon size={13} /> E-Mail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: "#f5f5f7", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }} className="hero-grid">
          <div>
            <span className="tag">So funktioniert&apos;s</span>
            <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.015em", color: "#1d1d1f", marginBottom: 16 }}>
              Von der Bewerbung<br />zum <em className="grad-text" style={{ fontStyle: "normal" }}>neuen Job</em> —<br />in 4 Schritten.
            </h2>
            <p style={{ fontSize: 17, color: "var(--gray)", lineHeight: 1.65, marginBottom: 36 }}>
              Ohne bürokratischen Aufwand, ohne lange Wartezeiten. Unser Team begleitet Sie persönlich vom Erstkontakt bis zur Vertragsunterzeichnung.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STEPS.map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 20, padding: 20, borderRadius: 28, background: "#fff" }}>
                  <div style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
                    background: "#0071e3",
                    color: "#fff", fontSize: 15, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{s.n}</div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CV GENERATOR ── */}
      <section id="lebenslauf" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span className="tag">Kostenlos</span>
          <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.015em", color: "#1d1d1f", marginBottom: 16 }}>
            Ihr <em className="grad-text" style={{ fontStyle: "normal" }}>professioneller Lebenslauf</em> in 5 Minuten.
          </h2>
          <p style={{ fontSize: 17, color: "var(--gray)", lineHeight: 1.65, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px" }}>
            Erstellen Sie Ihren Lebenslauf mit einem unserer modernen Vorlagen, und laden Sie ihn sofort als PDF herunter.
          </p>
          <div className="grid-3col" style={{ marginBottom: 48 }}>
            {[
              { title: "4 moderne Templates", desc: "Professionelle Designs für IT, Elektro und Bau, optimiert für Bewerber in Deutschland." },
              { title: "Fertig in 5 Minuten", desc: "Formular ausfüllen, Foto hochladen und als PDF herunterladen, ohne Registrierung." },
              { title: "ATS-optimiert", desc: "Unsere Templates werden von modernen Bewerbermanagement-Systemen korrekt ausgelesen." },
            ].map((f, i) => (
              <div key={f.title} style={{ background: "#f5f5f7", borderRadius: 28, padding: 28, textAlign: "left" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, marginBottom: 16,
                  background: "linear-gradient(135deg,var(--blue),var(--violet))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>0{i + 1}</span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/lebenslauf-erstellen" className="btn-primary" style={{ display: "inline-flex" }}>
            Lebenslauf kostenlos erstellen →
          </Link>
        </div>
      </section>

      {/* ── GOOGLE REVIEWS ── */}
      <section style={{ padding: "80px 24px", overflow: "hidden", background: "#f5f5f7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-header-row">
            <div>
              <span className="tag">Bewerberstimmen</span>
              <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.015em", color: "#1d1d1f" }}>
                Was unsere <em className="grad-text" style={{ fontStyle: "normal" }}>Bewerber sagen</em>
              </h2>
            </div>
            <a
              href="https://www.google.com/search?q=PHE+Perm+Engineering+Bewertungen"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 16px", textDecoration: "none" }}
            >
              <GoogleIcon />
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>{[1,2,3,4,5].map(i => <StarIcon key={i} />)}</div>
                <div style={{ fontSize: 11, color: "var(--gray)", fontWeight: 600 }}>32 Bewertungen auf Google</div>
              </div>
            </a>
          </div>

          <div className="grid-3col">
            {REVIEWS.slice(0, 3).map((r) => (
              <div key={r.name} style={{ borderRadius: 28, padding: 24, background: "#fff", boxShadow: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg,var(--blue),var(--violet))",
                    color: "#fff", fontWeight: 800, fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--gray-light)" }}>{r.time}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <GoogleIcon />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
                </div>
                <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.65 }}>{r.text}</p>
              </div>
            ))}
          </div>

          {/* zweite Reihe */}
          <div className="reviews-row-2">
            {REVIEWS.slice(3).map((r) => (
              <div key={r.name} style={{ borderRadius: 28, padding: 24, background: "#fff", boxShadow: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg,var(--blue),var(--violet))",
                    color: "#fff", fontWeight: 800, fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--gray-light)" }}>{r.time}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}><GoogleIcon /></div>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
                </div>
                <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.65 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YAFTO ── */}
      <section id="yafto" style={{ background: "var(--navy)", color: "#fff", position: "relative", overflow: "hidden", padding: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://d8j0ntlcm91z4.cloudfront.net/user_3DEnNUo30c9qxiRVMSnr83LGNJN/hf_20260621_102120_1fb16a6d-6626-477e-8870-a1e788e72cb4_min.webp')",
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", textAlign: "center", padding: "80px 24px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
            color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20, marginBottom: 28,
            letterSpacing: "0.1em", textTransform: "uppercase"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            Bald verfügbar
          </div>
          <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 16 }}>
            Willkommen bei<br />
            <em style={{ fontStyle: "normal", background: "linear-gradient(135deg,#60a5fa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>YAFTO</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.7, marginBottom: 48 }}>
            Die neue Art der Stellenvermittlung in Deutschland. Ihr Profil, anonym. Unternehmen bewerben sich bei Ihnen. Sie entscheiden.
          </p>
          <div className="grid-3col" style={{ marginBottom: 48, textAlign: "left" }}>
            {[
              { icon: "01", title: "100% Anonym", desc: "Ihr Name bleibt bis zur eigenen Freigabe vollständig anonym. Keine unerwünschten Kontaktversuche durch Dritte." },
              { icon: "02", title: "Firmen kommen zu Ihnen", desc: "Unternehmen sehen Ihr Profil und nehmen Kontakt auf, Sie entscheiden, wen Sie kennenlernen möchten." },
              { icon: "03", title: "Sie entscheiden", desc: "Kontaktanfragen annehmen oder ablehnen, Sie behalten jederzeit die Kontrolle. Kein Spam, keine Verpflichtung." },
            ].map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,.5)", marginBottom: 12, letterSpacing: "0.05em" }}>{f.icon}</div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <YaftoForm />
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection title="Häufige Fragen zur Jobvermittlung" items={[
        { q: "Was kostet die Vermittlung durch PHE-Perm Engineering?", a: "Die Vermittlung ist für Bewerber vollständig kostenlos. PHE-Perm Engineering wird ausschließlich vom Unternehmen vergütet, Ihnen entstehen keinerlei Kosten, weder für die Beratung noch für die Vermittlung." },
        { q: "Wie funktioniert die Bewerbung bei PHE?", a: "Nehmen Sie per WhatsApp oder E-Mail Kontakt auf. Unser Team meldet sich innerhalb von 24 Stunden, bespricht Ihre Wünsche und Qualifikationen und unterbreitet passende Stellenangebote." },
        { q: "Wie lange dauert es, bis ich einen neuen Job finde?", a: "Viele unserer Bewerber finden innerhalb von 2–6 Wochen eine neue Stelle. Die genaue Dauer hängt von Beruf, Region und Ihren Gehaltsvorstellungen ab." },
        { q: "Welche Jobs vermittelt PHE-Perm Engineering?", a: "Wir sind spezialisiert auf Festanstellungen in drei Bereichen: Elektrotechnik (Elektroniker, Elektriker, Elektroplaner), IT & Automation (SPS-Programmierer, Netzwerktechniker) sowie Bau & TGA (Bauleiter, Projektleiter, Oberbauleiter)." },
        { q: "Kann ich mich bewerben, wenn ich keine aktuelle Stelle suche?", a: "Ja. Sie können sich jederzeit vormerken lassen, auch bei bestehender Beschäftigung. Wir informieren Sie diskret, sobald eine passende Position verfügbar ist." },
        { q: "Ist PHE-Perm Engineering eine Zeitarbeitsfirma?", a: "Nein. Wir vermitteln ausschließlich Festanstellungen direkt beim Unternehmen. Es gibt keine Zeitarbeit, keine Leiharbeit, Sie werden von Anfang an unbefristet angestellt." },
        { q: "Was ist YAFTO?", a: "YAFTO ist unsere neue Plattform, auf der Sie Ihr Profil anonym veröffentlichen und Unternehmen sich bei Ihnen bewerben. Sie entscheiden, wen Sie kennenlernen möchten, ohne Druck und ohne Spam. Bald verfügbar." },
      ]} />

      {/* ── FOOTER ── */}
      <Footer />

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.6;transform:scale(1.3)}
        }
      `}</style>
    </>
  );
}
