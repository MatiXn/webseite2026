"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "phe_cookie_consent";

export type ConsentValue = "all" | "necessary" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(STORAGE_KEY) as ConsentValue) ?? null;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  function accept(value: ConsentValue) {
    localStorage.setItem(STORAGE_KEY, value!);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    // Kompakter Hinweis-Banner: rein informativ (keine Tracking-Cookies),
    // darf mobil nicht den primären CTA der Seite verdecken
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      padding: "10px 16px",
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid #e0e0e5",
      boxShadow: "0 -4px 32px rgba(0,0,0,0.10)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <p style={{ flex: 1, minWidth: 220, fontSize: 12.5, color: "#707070", lineHeight: 1.5 }}>
            🍪 Diese Website nutzt nur technisch notwendige Speicherung — keine Analyse- oder Tracking-Cookies.{" "}
            <Link href="/datenschutz" style={{ color: "#0071e3", textDecoration: "none" }}>Datenschutz</Link>
            {" · "}
            <button
              onClick={() => setDetails(d => !d)}
              style={{ background: "none", border: "none", color: "#0071e3", fontSize: 12.5, cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              {details ? "Weniger" : "Details"}
            </button>
          </p>
          <button
            onClick={() => accept("necessary")}
            style={{
              background: "#0071e3", color: "#fff", border: "none",
              borderRadius: 999, padding: "9px 22px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Verstanden
          </button>
        </div>

        {details && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            <CookieCategory
              title="Technisch notwendige Speicherung"
              desc="Erforderlich für den Grundbetrieb der Website (z. B. Speicherung Ihrer Auswahl in diesem Hinweis). Es werden keine Daten an Dritte übertragen."
              always
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CookieCategory({ title, desc, always }: { title: string; desc: string; always?: boolean }) {
  return (
    <div style={{ background: "#f5f5f7", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: always ? "#e0f0ff" : "#f0f0f0",
          border: `1.5px solid ${always ? "#0071e3" : "#ccc"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {always && <span style={{ color: "#0071e3", fontSize: 11, fontWeight: 800 }}>✓</span>}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f", marginBottom: 2 }}>
          {title}{always && <span style={{ fontSize: 11, color: "#0071e3", marginLeft: 6, fontWeight: 500 }}>Immer aktiv</span>}
        </p>
        <p style={{ fontSize: 12, color: "#707070", lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}
