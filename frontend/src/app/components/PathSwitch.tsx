import Link from "next/link";

// Zielgruppen-Weiche: klar getrennte Pfade für Bewerber (/jobs) und Unternehmen
// (/technische-personalvermittlung). Reine Präsentation → Server Component.
export default function PathSwitch() {
  const cardStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column",
    background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 16,
    padding: "28px 26px",
  };
  const eyebrow: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.08em", margin: "0 0 10px",
  };
  const titleStyle: React.CSSProperties = {
    fontSize: 22, fontWeight: 800, color: "#1d1d1f",
    margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.2,
  };
  const textStyle: React.CSSProperties = {
    fontSize: 15, color: "#586170", lineHeight: 1.6, margin: "0 0 20px",
  };

  return (
    <section aria-label="Für Bewerber und Unternehmen" style={{ padding: "48px 24px", background: "#fff" }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto", display: "grid", gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}>
        {/* Bewerber-Pfad — informelle Ansprache, primärer CTA */}
        <article style={cardStyle}>
          <p style={{ ...eyebrow, color: "#0071e3" }}>Für Bewerber</p>
          <h2 style={titleStyle}>Deine nächste Festanstellung in der Technik</h2>
          <p style={textStyle}>
            Entdecke passende Stellen in Elektrotechnik, Service, Automatisierung,
            Mechatronik, Kälte, TGA und Engineering.
          </p>
          <Link href="/jobs" className="pathswitch-cta pathswitch-cta--primary" style={{ marginTop: "auto" }}>
            Passende Jobs ansehen →
          </Link>
        </article>

        {/* Unternehmen-Pfad — formelle Ansprache, sekundärer CTA */}
        <article style={cardStyle}>
          <p style={{ ...eyebrow, color: "#1e3a5f" }}>Für Unternehmen</p>
          <h2 style={titleStyle}>Technische Fachkräfte für Ihr Unternehmen</h2>
          <p style={textStyle}>
            Wir identifizieren und qualifizieren Fachkräfte, die fachlich, persönlich
            und langfristig zu Ihrer Vakanz passen.
          </p>
          <Link href="/technische-personalvermittlung" className="pathswitch-cta pathswitch-cta--secondary" style={{ marginTop: "auto" }}>
            Fachkraft anfragen →
          </Link>
        </article>
      </div>
    </section>
  );
}
