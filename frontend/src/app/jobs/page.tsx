"use client";
import { useState, useCallback, useEffect } from "react";
import Nav, { WA_LINK, MAIL_APPLY } from "../components/Nav";
import FaqSection from "../components/FaqSection";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import { JOBS as FALLBACK_JOBS, CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS, distanceKm, type Job } from "./data";

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MailIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const JOBS_URL = "https://www.phe-perm.de/jobs";

type SearchResult =
  | { type: "exact"; jobs: Job[] }
  | { type: "radius"; jobs: (Job & { distance: number })[]; locationName: string }
  | { type: "none" }
  | null;

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [form, setForm] = useState({ vorname: "", nachname: "", telefon: "", position: job.title });

  const handleSubmit = () => {
    const body = `Hallo PHE-Team,

ich möchte mich auf folgende Stelle bewerben:

Position: ${form.position}
Vorname: ${form.vorname}
Nachname: ${form.nachname}
Telefonnummer: ${form.telefon}

Ich freue mich auf Ihre Rückmeldung.

Mit freundlichen Grüßen
${form.vorname} ${form.nachname}`;

    window.location.href = `mailto:${MAIL_APPLY}?subject=${encodeURIComponent(`Bewerbung: ${form.position}`)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid var(--border)", fontSize: 14,
    color: "var(--navy)", fontFamily: "inherit", outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 28, padding: 32,
          width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>Jetzt bewerben</h2>
            <p style={{ fontSize: 13, color: "var(--gray)" }}>{job.city}</p>
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
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 999, border: "1.5px solid var(--border)",
              background: "#fff", color: "var(--gray)", fontWeight: 600, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.vorname || !form.nachname || !form.telefon}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 999, border: "none",
              background: (!form.vorname || !form.nachname || !form.telefon) ? "var(--border)" : "#0071e3",
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: (!form.vorname || !form.nachname || !form.telefon) ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            E-Mail öffnen & absenden
          </button>
        </div>

        <p style={{ fontSize: 11, color: "var(--gray-light)", textAlign: "center", marginTop: 12 }}>
          Ihr E-Mail-Programm öffnet sich mit den ausgefüllten Daten.
        </p>
      </div>
    </div>
  );
}

async function geocodeCity(city: string): Promise<{ lat: number; lng: number; display: string } | null> {
  try {
    // Geocoding läuft über unseren Server-Proxy — keine Besucherdaten an Dritte
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(city)}`);
    const data = await res.json();
    return data?.ok ? data.result : null;
  } catch {
    return null;
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(FALLBACK_JOBS);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [category, setCategory] = useState("all");
  const [result, setResult] = useState<SearchResult>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then(r => r.json())
      .then((data: Job[]) => { if (data?.length) setJobs(data); })
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, []);

  // Der Standort-Snapshot (result) basiert immer auf ALLEN Jobs —
  // Keyword und Kategorie werden live darübergefiltert (siehe unten).
  // So bleiben Änderungen an Suchwort/Kategorie nach einer Standortsuche wirksam.
  const handleSearch = useCallback(async () => {
    const loc = locationInput.trim();

    if (!loc) {
      setResult(null); // Keyword-Filter läuft live, kein Snapshot nötig
      return;
    }

    setLoading(true);
    try {
      // Try exact city match first
      const exactCity = jobs.filter(j => j.city.toLowerCase().includes(loc.toLowerCase()) || j.region.toLowerCase().includes(loc.toLowerCase()));

      if (exactCity.length > 0) {
        setResult({ type: "exact", jobs: exactCity });
        return;
      }

      // Geocode the input location
      const geo = await geocodeCity(loc);
      if (!geo) {
        setResult({ type: "none" });
        return;
      }

      // Find jobs within 50km
      const nearby = jobs
        .map(j => ({ ...j, distance: Math.round(distanceKm(geo.lat, geo.lng, j.lat, j.lng)) }))
        .filter(j => j.distance <= 50)
        .sort((a, b) => a.distance - b.distance);

      if (nearby.length > 0) {
        setResult({ type: "radius", jobs: nearby, locationName: geo.display });
      } else {
        setResult({ type: "none" });
      }
    } finally {
      setLoading(false);
    }
  }, [locationInput, jobs]);

  const handleReset = () => {
    setQuery("");
    setLocationInput("");
    setCategory("all");
    setResult(null);
  };

  // ── Suchlogik ────────────────────────────────────────────────────────────────
  // Keyword-Filter läuft IMMER sofort beim Tippen (kein useEffect, direkt im Render)
  // Standort-Geocoding nur beim Button-Klick
  const q = query.trim().toLowerCase();

  const matchesKeyword = (j: Job) =>
    !q ||
    j.title.toLowerCase().includes(q) ||
    j.tags.some(t => t.toLowerCase().includes(q)) ||
    CATEGORY_LABELS[j.category].toLowerCase().includes(q);

  const matchesCategory = (j: Job) => category === "all" || j.category === category;

  // Basis-Pool: entweder Standort-Suchergebnis oder alle Jobs
  const basePool: (Job & { distance?: number })[] =
    result === null ? jobs
    : result.type === "exact" ? result.jobs
    : result.type === "radius" ? result.jobs
    : [];

  // Angezeigte Jobs: Basis-Pool gefiltert nach Keyword + Kategorie
  const showJobs = result?.type === "none"
    ? []
    : basePool.filter(j => matchesKeyword(j) && matchesCategory(j));

  const isFiltering = q !== "" || result !== null || category !== "all";

  return (
    <>
      <Nav />

      {/* HEADER + SEARCH */}
      <div className="section-pad" style={{ background: "#f5f5f7", borderBottom: "1px solid var(--border)", paddingBottom: 32 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            {jobsLoading ? "..." : jobs.length} offene Stellen
          </p>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.015em", lineHeight: 1.1, marginBottom: 32 }}>
            Stellenangebote
          </h1>

          {/* SEARCH BAR */}
          <div className="jobs-search" style={{ marginBottom: 24 }}>
            {/* Job title */}
            <div className="jobs-search-field jobs-search-field--main">
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-light)", display: "flex" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Berufsbezeichnung, z.B. Elektroniker"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", paddingLeft: 44, paddingRight: 16, height: 52,
                  border: "1.5px solid var(--border)", borderRadius: 28,
                  fontSize: 15, color: "var(--navy)", outline: "none",
                  background: "#fff", fontFamily: "inherit",
                  transition: "border-color .15s",
                }}
              />
            </div>
            {/* Location */}
            <div className="jobs-search-field jobs-search-field--city">
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-light)", display: "flex" }}>
                <LocationIcon />
              </span>
              <input
                type="text"
                placeholder="Stadt, z.B. Berlin"
                value={locationInput}
                onChange={e => {
                  setLocationInput(e.target.value);
                  if (!e.target.value.trim()) setResult(null); // Ort gelöscht → Standortfilter aufheben
                }}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", paddingLeft: 40, paddingRight: 16, height: 52,
                  border: "1.5px solid var(--border)", borderRadius: 28,
                  fontSize: 15, color: "var(--navy)", outline: "none",
                  background: "#fff", fontFamily: "inherit",
                }}
              />
            </div>
            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="jobs-search-btn"
              style={{
                background: loading ? "var(--gray-light)" : "#0071e3",
                color: "#fff", fontWeight: 700, fontSize: 15,
                padding: "0 32px", height: 52, borderRadius: 999, border: "none",
                cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {loading ? "Suche..." : "Suchen"}
            </button>
            {/* Reset */}
            {isFiltering && (
              <button
                onClick={handleReset}
                style={{
                  background: "#fff", color: "var(--gray)", fontWeight: 600, fontSize: 13,
                  padding: "0 16px", height: 52, borderRadius: 999,
                  border: "1.5px solid var(--border)", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <CloseIcon /> Zurücksetzen
              </button>
            )}
          </div>

          {/* CATEGORY FILTER */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                  border: "1.5px solid",
                  borderColor: category === cat.id ? "var(--blue)" : "var(--border)",
                  background: category === cat.id ? "#f0f7ff" : "#fff",
                  color: category === cat.id ? "var(--blue)" : "var(--gray)",
                  cursor: "pointer", transition: "all .15s",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS BANNER */}
      <div className="px-section" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {result?.type === "radius" && (
          <div style={{
            marginTop: 24, padding: "14px 20px", background: "#fff8e1",
            border: "1.5px solid #fbbf24", borderRadius: 16,
            fontSize: 14, color: "#92400e", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Keine exakten Treffer für <strong>&quot;{locationInput}&quot;</strong>, zeige {showJobs.length} Job{showJobs.length !== 1 ? "s" : ""} im Umkreis von 50 km.
          </div>
        )}
        {result?.type === "none" && (
          <div style={{
            marginTop: 24, padding: "32px",
            borderRadius: 28, textAlign: "center", background: "#fff",
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Keine Stellen gefunden</p>
            <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 20 }}>
              Für Ihre Suche sind aktuell keine offenen Stellen verfügbar, auch nicht im 50-km-Umkreis.<br />
              Senden Sie uns dennoch eine Initiativbewerbung via WhatsApp oder E-Mail.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--wa)", color: "#fff", fontWeight: 700, fontSize: 14,
                  padding: "12px 24px", borderRadius: 999, textDecoration: "none",
                }}
              >
                <WhatsAppIcon size={16} /> Via WhatsApp bewerben
              </a>
              <a
                href={`mailto:${MAIL_APPLY}?subject=Initiativbewerbung&body=Hallo PHE-Team,%0A%0Amein Name:%0ATelefonnummer:%0A%0AIch bewerbe mich initiativ und freue mich auf Ihre Rückmeldung.`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "var(--navy)", fontWeight: 700, fontSize: 14,
                  padding: "12px 24px", borderRadius: 999, textDecoration: "none",
                  border: "1.5px solid var(--border)",
                }}
              >
                <MailIcon size={16} /> Per E-Mail bewerben
              </a>
            </div>
          </div>
        )}
      </div>

      {/* JOB GRID */}
      <main className="px-section" style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 32, paddingBottom: 80, background: "#f5f5f7" }}>
        {result?.type !== "none" && (
          <>
            <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 20 }}>
              {showJobs.length} {showJobs.length === 1 ? "Stelle" : "Stellen"} gefunden
              {result?.type === "radius" ? ` im Umkreis von 50 km` : ""}
            </p>
            <div className="grid-3col" style={{ gap: 20 }}>
              {showJobs.map(job => (
                <JobCard key={job.id} job={job} distance={"distance" in job ? (job.distance as number) : undefined} />
              ))}
            </div>
          </>
        )}

        {/* CTA bottom */}
        {showJobs.length > 0 && (
          <div style={{
            marginTop: 64, background: "#f5f5f7", border: "none",
            borderRadius: 28, padding: "40px", textAlign: "center",
          }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>
              Nichts Passendes dabei?
            </p>
            <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 24 }}>
              Wir haben noch mehr Stellen die nicht online sind, schick uns eine WhatsApp und wir finden gemeinsam die richtige Position.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--wa)", color: "#fff", fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 999, textDecoration: "none",
                }}
              >
                <WhatsAppIcon size={16} /> Via WhatsApp bewerben
              </a>
              <a
                href={`mailto:${MAIL_APPLY}?subject=Initiativbewerbung&body=Hallo PHE-Team,%0A%0Amein Name:%0ATelefonnummer:%0A%0AIch bewerbe mich initiativ und freue mich auf Ihre Rückmeldung.`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "var(--navy)", fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 999, textDecoration: "none",
                  border: "1.5px solid var(--border)",
                }}
              >
                <MailIcon size={16} /> Per E-Mail bewerben
              </a>
            </div>
          </div>
        )}
      </main>

      <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <FaqSection title="Häufige Fragen zu Stellenangeboten" items={[
          { q: "Wie finde ich Jobs in meiner Nähe?", a: "Geben Sie Ihren Wohnort in das Suchfeld ein. Wenn keine Stelle direkt in Ihrer Stadt verfügbar ist, zeigen wir automatisch alle offenen Positionen im Umkreis von 50 km an, sortiert nach Entfernung." },
          { q: "Was verdiene ich als Elektroniker in Deutschland?", a: "Das Gehalt variiert je nach Spezialisierung und Region. Elektroniker für Betriebstechnik verdienen typischerweise 40.000–56.000 €/Jahr, SPS-Programmierer und Automatisierungstechniker 55.000–75.000 €/Jahr. Wir verhandeln für Sie das bestmögliche Gehalt." },
          { q: "Wie kann ich mich auf eine Stelle bewerben?", a: "Sie haben zwei Möglichkeiten: Klicken Sie auf 'WhatsApp' für eine schnelle Bewerbung, oder wählen Sie 'E-Mail' und senden Sie Ihre Unterlagen (Lebenslauf, Zeugnisse) an bewerbung@phe-perm.de. Unser Team meldet sich innerhalb von 24 Stunden." },
          { q: "Gibt es Stellen, die nicht online gelistet sind?", a: "Ja. Wir führen zahlreiche exklusive Positionen, die wir nicht öffentlich ausschreiben. Kontaktieren Sie uns per WhatsApp und beschreiben Sie, was Sie suchen, wir finden auch unveröffentlichte Stellen für Sie." },
          { q: "Welche Qualifikationen brauche ich für Elektrotechnik-Jobs?", a: "Für die meisten Stellen wird eine abgeschlossene Berufsausbildung oder ein Studium im jeweiligen Bereich vorausgesetzt. Berufserfahrung ist von Vorteil, aber keine Voraussetzung, wir haben auch Einstiegspositionen für Berufsanfänger." },
          { q: "Wie weit ist der Umkreis bei der Standortsuche?", a: "Wir suchen automatisch im Umkreis von 50 km um Ihren eingegebenen Ort. Falls Sie einen anderen Radius bevorzugen, kontaktieren Sie uns, wir suchen gezielt für Sie." },
        ]} />
      </div>

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Wie finde ich Jobs in meiner Nähe?", "acceptedAnswer": { "@type": "Answer", "text": "Geben Sie Ihren Wohnort in das Suchfeld ein. Wir zeigen automatisch Jobs im Umkreis von 50 km an." } },
          { "@type": "Question", "name": "Was verdiene ich als Elektroniker in Deutschland?", "acceptedAnswer": { "@type": "Answer", "text": "Elektroniker verdienen typischerweise 40.000–56.000 €/Jahr, SPS-Programmierer 55.000–75.000 €/Jahr." } },
          { "@type": "Question", "name": "Wie kann ich mich auf eine Stelle bewerben?", "acceptedAnswer": { "@type": "Answer", "text": "Klicke auf den Bewerben-Button. WhatsApp öffnet sich mit einer vorausgefüllten Nachricht." } },
          { "@type": "Question", "name": "Gibt es Stellen, die nicht online gelistet sind?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, wir haben zahlreiche exklusive, nicht öffentlich ausgeschriebene Positionen. Schreib uns auf WhatsApp." } },
        ]
      }} />
      <Footer />
    </>
  );
}

const CheckIcon = () => (
  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="5" fill="#22c55e"/>
    <path d="M3 5l1.5 1.5L7 3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function JobDetailModal({ job, onClose, onApply }: { job: Job; onClose: () => void; onApply: () => void }) {
  const color = CATEGORY_COLORS[job.category];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0 0" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 640,
        maxHeight: "90vh", overflowY: "auto", padding: "28px 28px 40px",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
      }}>
        {/* Handle + close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto" }} />
          <button onClick={onClose} style={{ background: "var(--bg)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray)" }}>
            <CloseIcon />
          </button>
        </div>

        {/* Category badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{CATEGORY_LABELS[job.category]}</span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", lineHeight: 1.2, marginBottom: 12 }}>{job.title}</h2>

        {/* Meta */}
        <div style={{ display: "flex", gap: 16, fontSize: 14, color: "var(--gray)", marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><LocationIcon /> {job.city}</span>
          <span style={{ fontWeight: 600, color: "var(--navy)" }}>{job.salary}</span>
          <span>{job.type}</span>
        </div>

        {/* Description */}
        {job.description && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Stellenbeschreibung</h4>
            <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.7 }}>{job.description}</p>
          </div>
        )}

        {/* Tags */}
        {job.tags?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Anforderungen</h4>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {job.tags.map(t => (
                <span key={t} style={{ fontSize: 12, fontWeight: 600, background: "var(--bg)", color: "var(--gray)", padding: "5px 12px", borderRadius: 8 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Benefits</h4>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {job.benefits.map(b => (
                <span key={b} style={{ fontSize: 12, fontWeight: 600, color: "#166534", background: "#dcfce7", padding: "5px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckIcon /> {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={`${WA_LINK}?text=${encodeURIComponent(`Hallo, ich interessiere mich für die Stelle: ${job.title} in ${job.city}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#22c55e", color: "#fff", fontSize: 14, fontWeight: 700, padding: "13px 16px", borderRadius: 999, textDecoration: "none" }}
          >
            <WhatsAppIcon size={16} /> Via WhatsApp bewerben
          </a>
          <button
            onClick={onApply}
            style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--navy)", color: "#fff", fontSize: 14, fontWeight: 700, padding: "13px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <MailIcon size={15} /> Per E-Mail bewerben
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(JOBS_URL)}`}
            target="_blank" rel="noopener noreferrer"
            title={`Stelle auf LinkedIn teilen: ${job.title}`}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#0077B5", color: "#fff", fontSize: 14, fontWeight: 700, padding: "13px 16px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            <LinkedInIcon size={16} /> Teilen
          </a>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, distance }: { job: Job; distance?: number }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const color = CATEGORY_COLORS[job.category];
  return (
    <>
      {showDetail && (
        <JobDetailModal
          job={job}
          onClose={() => setShowDetail(false)}
          onApply={() => { setShowDetail(false); setShowApply(true); }}
        />
      )}
      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}
      <div
        onClick={() => setShowDetail(true)}
        style={{ borderRadius: 28, padding: 24, background: "#fff", display: "flex", flexDirection: "column", cursor: "pointer" }}
      >
        {/* Category + distance */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {CATEGORY_LABELS[job.category]}
            </span>
          </div>
          {distance !== undefined && (
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-light)", background: "var(--bg)", padding: "3px 8px", borderRadius: 6 }}>
              {distance} km entfernt
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", lineHeight: 1.3, marginBottom: 10, minHeight: 44 }}>
          {job.title}
        </h3>

        {/* Meta */}
        <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--gray)", marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LocationIcon /> {job.city}</span>
          <span>{job.salary}</span>
        </div>

        {/* Description preview */}
        <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
          {job.description}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: job.benefits?.length > 0 ? 8 : 0 }}>
          {job.tags.map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 600, background: "var(--bg)", color: "var(--gray)", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
          ))}
        </div>

        {/* Benefits preview */}
        {job.benefits?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, marginBottom: 4 }}>
            {job.benefits.slice(0, 2).map(b => (
              <span key={b} style={{ fontSize: 11, fontWeight: 600, color: "#166534", background: "#dcfce7", padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckIcon /> {b}
              </span>
            ))}
            {job.benefits.length > 2 && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#166534", background: "#dcfce7", padding: "4px 10px", borderRadius: 6 }}>+{job.benefits.length - 2} weitere</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
            <a
              href={`${WA_LINK}?text=${encodeURIComponent(`Hallo, ich interessiere mich für die Stelle: ${job.title} in ${job.city}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#22c55e", color: "#fff", fontSize: 12, fontWeight: 700, padding: "9px 12px", borderRadius: 999, textDecoration: "none" }}
            >
              <WhatsAppIcon size={13} /> WhatsApp
            </a>
            <button
              onClick={() => setShowApply(true)}
              style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#f5f5f7", color: "#1d1d1f", fontSize: 12, fontWeight: 700, padding: "9px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <MailIcon size={13} /> E-Mail
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(JOBS_URL)}`}
              target="_blank" rel="noopener noreferrer"
              title={`Auf LinkedIn teilen: ${job.title}`}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#0077B5", color: "#fff", width: 36, height: 36, borderRadius: 999, textDecoration: "none", flexShrink: 0 }}
            >
              <LinkedInIcon size={15} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
