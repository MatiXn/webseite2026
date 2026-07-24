import Link from "next/link";

// Zielgruppen-Weiche: zwei gleichwertige Einstiegspfade (B2B / B2C).
export default function PathSwitch() {
  const cards: { title: string; sub: string; href: string; cta: string }[] = [
    {
      title: "Ich suche Fachkräfte",
      sub: "Technische Personalvermittlung in Festanstellung – geprüfte Profile, erfolgsbasiert.",
      href: "/technische-personalvermittlung",
      cta: "Für Unternehmen →",
    },
    {
      title: "Ich suche einen Job",
      sub: "Feste Stellen für technische Fachkräfte – kostenlos, ohne Zeitarbeit, Antwort in 24 Stunden.",
      href: "/jobs",
      cta: "Zu den Stellen →",
    },
  ];
  return (
    <section aria-label="Zielgruppenauswahl" style={{ padding: "48px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} style={{
            display: "block", textDecoration: "none",
            background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 16,
            padding: "28px 26px",
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{c.title}</h2>
            <p style={{ fontSize: 15, color: "#586170", lineHeight: 1.6, margin: "0 0 16px" }}>{c.sub}</p>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0071e3" }}>{c.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
