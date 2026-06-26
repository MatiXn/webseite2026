"use client";
import { useState, useCallback } from "react";
import Nav, { WA_LINK, MAIL_APPLY } from "../components/Nav";
import FaqSection from "../components/FaqSection";
import JsonLd from "../components/JsonLd";
import { JOBS, CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS, distanceKm, type Job } from "./data";

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

type SearchResult =
  | { type: "exact"; jobs: Job[] }
  | { type: "radius"; jobs: (Job & { distance: number })[]; locationName: string }
  | { type: "none" }
  | null;

async function geocodeCity(city: string): Promise<{ lat: number; lng: number; display: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", Deutschland")}&format=json&limit=1&countrycodes=de`,
      { headers: { "Accept-Language": "de" } }
    );
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name.split(",")[0] };
  } catch {
    return null;
  }
}

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [category, setCategory] = useState("all");
  const [result, setResult] = useState<SearchResult>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    const q = query.trim().toLowerCase();
    const loc = locationInput.trim();

    // Filter by category first
    let pool = category === "all" ? JOBS : JOBS.filter(j => j.category === category);

    // Filter by title keyword
    if (q) {
      pool = pool.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q)) ||
        CATEGORY_LABELS[j.category].toLowerCase().includes(q)
      );
    }

    // No location — return title matches directly
    if (!loc) {
      setResult(q ? { type: "exact", jobs: pool } : null);
      return;
    }

    setLoading(true);
    try {
      // Try exact city match first
      const exactCity = pool.filter(j => j.city.toLowerCase().includes(loc.toLowerCase()) || j.region.toLowerCase().includes(loc.toLowerCase()));

      if (exactCity.length > 0) {
        setResult({ type: "exact", jobs: exactCity });
        setLoading(false);
        return;
      }

      // Geocode the input location
      const geo = await geocodeCity(loc);
      if (!geo) {
        setResult({ type: "none" });
        setLoading(false);
        return;
      }

      // Find jobs within 50km
      const nearby = pool
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
  }, [query, locationInput, category]);

  const handleReset = () => {
    setQuery("");
    setLocationInput("");
    setCategory("all");
    setResult(null);
  };

  // Live-Filterung: direkt aus query abgeleitet, kein useEffect nötig
  const q = query.trim().toLowerCase();
  const hasLiveFilter = q && !locationInput.trim() && result === null;
  const livePool = hasLiveFilter
    ? (category === "all" ? JOBS : JOBS.filter(j => j.category === category)).filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q)) ||
        CATEGORY_LABELS[j.category].toLowerCase().includes(q)
      )
    : null;

  const displayJobs: (Job & { distance?: number })[] =
    result === null
      ? JOBS
      : result.type === "exact"
      ? result.jobs
      : result.type === "radius"
      ? result.jobs
      : [];

  const filteredDisplay = category === "all"
    ? displayJobs
    : displayJobs.filter(j => j.category === category);

  const showJobs = livePool !== null
    ? livePool
    : result === null
    ? (category === "all" ? JOBS : JOBS.filter(j => j.category === category))
    : filteredDisplay;

  const isFiltering = livePool !== null || result !== null;

  return (
    <>
      <Nav />

      {/* HEADER + SEARCH */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "48px 48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            {JOBS.length} offene Stellen
          </p>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: "var(--navy)", letterSpacing: "-0.025em", marginBottom: 32 }}>
            Stellenangebote
          </h1>

          {/* SEARCH BAR */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {/* Job title */}
            <div style={{ flex: 2, position: "relative" }}>
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
                  border: "1.5px solid var(--border)", borderRadius: 10,
                  fontSize: 15, color: "var(--navy)", outline: "none",
                  background: "#fff", fontFamily: "inherit",
                  transition: "border-color .15s",
                }}
              />
            </div>
            {/* Location */}
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--gray-light)", display: "flex" }}>
                <LocationIcon />
              </span>
              <input
                type="text"
                placeholder="Stadt, z.B. Berlin"
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%", paddingLeft: 40, paddingRight: 16, height: 52,
                  border: "1.5px solid var(--border)", borderRadius: 10,
                  fontSize: 15, color: "var(--navy)", outline: "none",
                  background: "#fff", fontFamily: "inherit",
                }}
              />
            </div>
            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                background: loading ? "var(--gray-light)" : "linear-gradient(135deg,var(--blue),var(--violet))",
                color: "#fff", fontWeight: 700, fontSize: 15,
                padding: "0 32px", height: 52, borderRadius: 10, border: "none",
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
                  padding: "0 16px", height: 52, borderRadius: 10,
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
                  padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
        {result?.type === "radius" && (
          <div style={{
            marginTop: 24, padding: "14px 20px", background: "#fff8e1",
            border: "1.5px solid #fbbf24", borderRadius: 10,
            fontSize: 14, color: "#92400e", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Keine exakten Treffer für <strong>&quot;{locationInput}&quot;</strong> — zeige {result.jobs.length} Job{result.jobs.length !== 1 ? "s" : ""} im Umkreis von 50 km.
          </div>
        )}
        {result?.type === "none" && (
          <div style={{
            marginTop: 24, padding: "32px", background: "var(--bg)",
            border: "1.5px solid var(--border)", borderRadius: 14, textAlign: "center",
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>Keine Stellen gefunden</p>
            <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 20 }}>
              Für Ihre Suche sind aktuell keine offenen Stellen verfügbar — auch nicht im 50-km-Umkreis.<br />
              Senden Sie uns dennoch eine Initiativbewerbung via WhatsApp oder E-Mail.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={WA_LINK}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--wa)", color: "#fff", fontWeight: 700, fontSize: 14,
                  padding: "12px 24px", borderRadius: 10, textDecoration: "none",
                }}
              >
                <WhatsAppIcon size={16} /> Via WhatsApp bewerben
              </a>
              <a
                href={`mailto:${MAIL_APPLY}?subject=Initiativbewerbung&body=Hallo PHE-Team,%0A%0Amein Name:%0ATelefonnummer:%0A%0AIch bewerbe mich initiativ und freue mich auf Ihre Rückmeldung.`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "var(--navy)", fontWeight: 700, fontSize: 14,
                  padding: "12px 24px", borderRadius: 10, textDecoration: "none",
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
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 48px 80px" }}>
        {result?.type !== "none" && (
          <>
            <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 20 }}>
              {showJobs.length} {showJobs.length === 1 ? "Stelle" : "Stellen"} gefunden
              {result?.type === "radius" ? ` im Umkreis von 50 km` : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {showJobs.map(job => (
                <JobCard key={job.id} job={job} distance={"distance" in job ? (job.distance as number) : undefined} />
              ))}
            </div>
          </>
        )}

        {/* CTA bottom */}
        {showJobs.length > 0 && (
          <div style={{
            marginTop: 64, background: "var(--bg)", border: "1.5px solid var(--border)",
            borderRadius: 16, padding: "40px", textAlign: "center",
          }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)", marginBottom: 8 }}>
              Nichts Passendes dabei?
            </p>
            <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 24 }}>
              Wir haben noch mehr Stellen die nicht online sind — schick uns eine WhatsApp und wir finden gemeinsam die richtige Position.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={WA_LINK}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--wa)", color: "#fff", fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 10, textDecoration: "none",
                }}
              >
                <WhatsAppIcon size={16} /> Via WhatsApp bewerben
              </a>
              <a
                href={`mailto:${MAIL_APPLY}?subject=Initiativbewerbung&body=Hallo PHE-Team,%0A%0Amein Name:%0ATelefonnummer:%0A%0AIch bewerbe mich initiativ und freue mich auf Ihre Rückmeldung.`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "var(--navy)", fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 10, textDecoration: "none",
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
          { q: "Wie finde ich Jobs in meiner Nähe?", a: "Geben Sie Ihren Wohnort in das Suchfeld ein. Wenn keine Stelle direkt in Ihrer Stadt verfügbar ist, zeigen wir automatisch alle offenen Positionen im Umkreis von 50 km an — sortiert nach Entfernung." },
          { q: "Was verdiene ich als Elektroniker in Deutschland?", a: "Das Gehalt variiert je nach Spezialisierung und Region. Elektroniker für Betriebstechnik verdienen typischerweise 40.000–56.000 €/Jahr, SPS-Programmierer und Automatisierungstechniker 55.000–75.000 €/Jahr. Wir verhandeln für Sie das bestmögliche Gehalt." },
          { q: "Wie kann ich mich auf eine Stelle bewerben?", a: "Sie haben zwei Möglichkeiten: Klicken Sie auf 'WhatsApp' für eine schnelle Bewerbung, oder wählen Sie 'E-Mail' und senden Sie Ihre Unterlagen (Lebenslauf, Zeugnisse) an bewerbung@phe-perm.de. Unser Team meldet sich innerhalb von 24 Stunden." },
          { q: "Gibt es Stellen, die nicht online gelistet sind?", a: "Ja. Wir führen zahlreiche exklusive Positionen, die wir nicht öffentlich ausschreiben. Kontaktieren Sie uns per WhatsApp und beschreiben Sie, was Sie suchen — wir finden auch unveröffentlichte Stellen für Sie." },
          { q: "Welche Qualifikationen brauche ich für Elektrotechnik-Jobs?", a: "Für die meisten Stellen wird eine abgeschlossene Berufsausbildung oder ein Studium im jeweiligen Bereich vorausgesetzt. Berufserfahrung ist von Vorteil, aber keine Voraussetzung — wir haben auch Einstiegspositionen für Berufsanfänger." },
          { q: "Wie weit ist der Umkreis bei der Standortsuche?", a: "Wir suchen automatisch im Umkreis von 50 km um Ihren eingegebenen Ort. Falls Sie einen anderen Radius bevorzugen, kontaktieren Sie uns — wir suchen gezielt für Sie." },
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
    </>
  );
}

function JobCard({ job, distance }: { job: Job; distance?: number }) {
  const color = CATEGORY_COLORS[job.category];
  return (
    <div style={{
      border: "1.5px solid var(--border)", borderRadius: 14, padding: 24,
      background: "#fff", display: "flex", flexDirection: "column",
      transition: "box-shadow .2s, border-color .2s",
    }}>
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
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", lineHeight: 1.3, marginBottom: 10, flex: 1 }}>
        {job.title}
      </h3>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--gray)", marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <LocationIcon /> {job.city}
        </span>
        <span>{job.salary}</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {job.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {job.tags.map(t => (
          <span key={t} style={{ fontSize: 11, fontWeight: 600, background: "var(--bg)", color: "var(--gray)", padding: "4px 10px", borderRadius: 6 }}>
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "var(--gray-light)" }}>{job.posted}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={`${WA_LINK}?text=${encodeURIComponent(`Hallo, ich interessiere mich für die Stelle: ${job.title} in ${job.city}`)}`}
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "var(--wa)", color: "#fff", fontSize: 12, fontWeight: 700,
              padding: "9px 12px", borderRadius: 8, textDecoration: "none",
            }}
          >
            <WhatsAppIcon size={13} /> WhatsApp
          </a>
          <a
            href={`mailto:${MAIL_APPLY}?subject=${encodeURIComponent(`Bewerbung: ${job.title}`)}&body=${encodeURIComponent(`Hallo PHE-Team,\n\nich interessiere mich für die Stelle: ${job.title} in ${job.city}\n\nMein Name:\nTelefonnummer:\n\nIch freue mich auf Ihre Rückmeldung.\n\nMit freundlichen Grüßen`)}`}
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "var(--bg)", color: "var(--navy)", fontSize: 12, fontWeight: 700,
              padding: "9px 12px", borderRadius: 8, textDecoration: "none",
              border: "1.5px solid var(--border)",
            }}
          >
            <MailIcon size={13} /> E-Mail
          </a>
        </div>
      </div>
    </div>
  );
}
