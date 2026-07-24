const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/PHE-Perm+Engineering+Ingenieure+%26+Techniker+GmbH/@51.216938,6.7835745,17z/data=!4m8!3m7!1s0x47b8cbe2d432db7f:0x53a2462c58dcf194!8m2!3d51.216938!4d6.7835745!9m1!1b1!16s%2Fg%2F11rs0cvdmv";

// Echte Google-Rezensionen (5,0 ★, 32 Bewertungen), anonymisiert auf Vorname + Initial.
// Texte wörtlich übernommen; "…" = Kürzung.
const REVIEWS: { name: string; text: string }[] = [
  { name: "Romze", text: "Ich bin begeistert von meiner Erfahrung mit PHE. Das Team war äußerst professionell, freundlich und engagiert. Vom ersten Kontakt bis zur erfolgreichen Vermittlung fühlte ich mich hervorragend betreut." },
  { name: "Norbert L.", text: "Ich habe sofort eine Rückmeldung auf meine Bewerbung bekommen. In einer Woche hatte ich schon mein erstes Vorstellungsgespräch bei einem Unternehmen, wo alles gepasst hat." },
  { name: "Birk B.", text: "Die Beratung war durchweg professionell und auf meine individuellen Bedürfnisse zugeschnitten. Ich kann PHE-Perm Engineering für die Jobsuche absolut weiterempfehlen." },
  { name: "Romeo", text: "Durch das engagierte Team gelang es mir, in kürzester Zeit eine passende Arbeitsstelle zu finden." },
  { name: "Benedikt P.", text: "Bester Service, den ich seit langem erlebt habe. Man hat sich voll auf mich als Person eingestellt, um meine aktuelle Situation zu verstehen und auf meine Wünsche einzugehen." },
  { name: "Milian W.", text: "Kompetent, schnell und achtet sehr auf die Bedürfnisse der Kunden. Ich wurde direkt gefragt, was ich mir vorstelle, um einen für mich angenehmen Job zu finden." },
  { name: "Francis D.", text: "Top Betreuung und klasse Service! Von Anfang an habe ich mich super aufgehoben gefühlt." },
  { name: "Mas M.", text: "Die unermüdliche Unterstützung und das tiefe Verständnis für meine beruflichen Ziele haben mich überzeugt." },
  { name: "Google-Rezension", text: "Absolute Empfehlung und somit 5 Sterne!" },
  { name: "Google-Rezension", text: "Hat alles reibungslos geklappt, sehr nettes und hilfsbereites Personal." },
  { name: "Google-Rezension", text: "Kompetente Beratung und unkomplizierte Abwicklung." },
];

function Stars() {
  return (
    <span style={{ color: "#fbbf24", fontSize: 15, letterSpacing: 2 }} aria-label="5 von 5 Sternen">
      ★★★★★
    </span>
  );
}

export default function GoogleReviews({ jobId }: { jobId: string }) {
  // Deterministisch 3 Reviews pro Job rotieren, damit nicht jede Seite dieselben zeigt
  const offset = (parseInt(jobId, 10) || 0) % REVIEWS.length;
  const picked = [0, 1, 2].map(i => REVIEWS[(offset + i) % REVIEWS.length]);

  return (
    <section style={{
      background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f" }}>
          ⭐ Das sagen Bewerber über uns
        </h2>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#f0f7ff", borderRadius: 999, padding: "6px 14px",
          fontSize: 13, fontWeight: 700, color: "#1e3a5f",
        }}>
          <Stars /> 5,0 auf Google · 32 Bewertungen
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {picked.map((r, i) => (
          <figure key={i} style={{
            background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 14,
            padding: "20px 18px", margin: 0, display: "flex", flexDirection: "column", gap: 10,
          }}>
            <Stars />
            <blockquote style={{ fontSize: 14, color: "#3d3d3f", lineHeight: 1.65, margin: 0 }}>
              „{r.text}“
            </blockquote>
            <figcaption style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginTop: "auto" }}>
              – {r.name}
            </figcaption>
          </figure>
        ))}
      </div>

      <a
        href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
        style={{
          display: "inline-block", marginTop: 18, fontSize: 14, fontWeight: 700,
          color: "#2d6a9f", textDecoration: "none",
        }}
      >
        Alle 32 Bewertungen auf Google ansehen →
      </a>
    </section>
  );
}
