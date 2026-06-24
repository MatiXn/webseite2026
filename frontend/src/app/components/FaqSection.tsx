"use client";
import { useState } from "react";

type FaqItem = { q: string; a: string };

export default function FaqSection({ items, title = "Häufige Fragen" }: { items: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ padding: "64px 48px", maxWidth: 860, margin: "0 auto" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, textAlign: "center" }}>FAQ</p>
      <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.025em", marginBottom: 36, textAlign: "center" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "18px 22px",
                background: "none", border: "none", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", lineHeight: 1.4 }}>{item.q}</span>
              <span style={{ fontSize: 18, color: "var(--blue)", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 22px 18px", fontSize: 14, color: "var(--gray)", lineHeight: 1.75 }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
