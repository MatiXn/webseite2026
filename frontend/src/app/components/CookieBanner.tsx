"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { leseConsent, setzeConsent } from "../../lib/consent";

// Einwilligungsbanner.
//
// Bis August 2026 war das hier ein reiner Hinweis ohne Wahlmöglichkeit — die
// Website setzte kein Tracking ein. Mit dem Meta-Pixel auf den
// Recruiting-Landingpages gibt es erstmals eine echte Entscheidung.
//
// Beide Schaltflächen sind bewusst gleich gestaltet und gleich groß:
// Ablehnen darf nicht schwerer fallen als Zustimmen.

export default function CookieBanner() {
  const [sichtbar, setSichtbar] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (!leseConsent()) setSichtbar(true);
  }, []);

  function entscheiden(marketing: boolean) {
    setzeConsent(marketing);
    setSichtbar(false);
  }

  if (!sichtbar) return null;

  return (
    <div
      role="dialog"
      aria-label="Einwilligung zu Cookies und Tracking"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "14px 16px",
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid #e0e0e5",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <p style={{ flex: 1, minWidth: 240, fontSize: 13, color: "#3d3d3f", lineHeight: 1.55 }}>
            Wir nutzen technisch notwendige Speicherung. Um den Erfolg unserer Anzeigen
            zu messen, setzen wir zusätzlich das Google-Tag (Google Ads) und auf unseren
            Stellen-Landingpages den Meta-Pixel ein — aber nur mit Ihrer Einwilligung.{" "}
            <Link href="/datenschutz" style={{ color: "#0071e3", textDecoration: "none" }}>
              Datenschutz
            </Link>
            {" · "}
            <button
              onClick={() => setDetails((d) => !d)}
              aria-expanded={details}
              style={{
                background: "none",
                border: "none",
                color: "#0071e3",
                fontSize: 13,
                fontFamily: "inherit",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              {details ? "Weniger" : "Details"}
            </button>
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => entscheiden(false)} style={knopfStil(false)}>
              Nur notwendige
            </button>
            <button onClick={() => entscheiden(true)} style={knopfStil(true)}>
              Alle akzeptieren
            </button>
          </div>
        </div>

        {details && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <Kategorie
              titel="Technisch notwendige Speicherung"
              text="Erforderlich für den Grundbetrieb der Website, zum Beispiel um Ihre Auswahl in diesem Hinweis zu merken. Es werden keine Daten an Dritte übertragen."
              immerAktiv
            />
            <Kategorie
              titel="Marketing (Google Ads, Meta-Pixel)"
              text="Google-Tag auf der gesamten Website: misst, welche Google-Anzeige zu einer Anfrage, Bewerbung oder einem Anruf geführt hat; überträgt Daten an Google Ireland Ltd. Meta-Pixel nur auf unseren Stellen-Landingpages: misst dasselbe für Facebook- und Instagram-Anzeigen; überträgt Daten an Meta Platforms Ireland Ltd. Ohne Ihre Zustimmung wird keines der beiden Skripte geladen."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function knopfStil(betont: boolean): React.CSSProperties {
  return {
    background: betont ? "#0071e3" : "#fff",
    color: betont ? "#fff" : "#0071e3",
    border: betont ? "1.5px solid #0071e3" : "1.5px solid #c7d9ec",
    borderRadius: 999,
    padding: "12px 22px",
    minHeight: 44,
    fontSize: 13.5,
    fontFamily: "inherit",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    minWidth: 150,
  };
}

function Kategorie({
  titel,
  text,
  immerAktiv,
}: {
  titel: string;
  text: string;
  immerAktiv?: boolean;
}) {
  return (
    <div
      style={{
        background: "#f5f5f7",
        borderRadius: 12,
        padding: "10px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: immerAktiv ? "#e0f0ff" : "#f0f0f0",
            border: `1.5px solid ${immerAktiv ? "#0071e3" : "#ccc"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {immerAktiv && (
            <span style={{ color: "#0071e3", fontSize: 11, fontWeight: 800 }}>✓</span>
          )}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f", marginBottom: 2 }}>
          {titel}
          {immerAktiv && (
            <span style={{ fontSize: 11, color: "#0071e3", marginLeft: 6, fontWeight: 500 }}>
              Immer aktiv
            </span>
          )}
        </p>
        <p style={{ fontSize: 12, color: "#707070", lineHeight: 1.5 }}>{text}</p>
      </div>
    </div>
  );
}
