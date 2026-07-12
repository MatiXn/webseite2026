type FaqItem = { q: string; a: string };

// Server-gerendert mit nativem <details>/<summary>: Die Antworten stehen im
// HTML (wichtig für Google & AI-Crawler), das Auf-/Zuklappen braucht kein JS.
export default function FaqSection({ items, title = "Häufige Fragen" }: { items: FaqItem[]; title?: string }) {
  return (
    <section style={{ padding: "64px 48px", maxWidth: 860, margin: "0 auto" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, textAlign: "center" }}>FAQ</p>
      <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.025em", marginBottom: 36, textAlign: "center" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <details key={i} className="faq-item" style={{ border: "1.5px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <summary
              style={{
                listStyle: "none", padding: "18px 22px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", lineHeight: 1.4 }}>{item.q}</span>
              <span className="faq-icon" aria-hidden="true" style={{ fontSize: 18, color: "var(--blue)", flexShrink: 0, transition: "transform .2s" }}>+</span>
            </summary>
            <div style={{ padding: "0 22px 18px", fontSize: 14, color: "var(--gray)", lineHeight: 1.75 }}>
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
