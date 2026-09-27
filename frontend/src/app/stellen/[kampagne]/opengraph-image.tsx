import { ImageResponse } from "next/og";
import { KAMPAGNEN, findeKampagne } from "../../../landingpages/registry";

// Vorschaubild beim Teilen einer Landingpage auf LinkedIn, Xing, WhatsApp
// oder in Meta-Anzeigen.
//
// Aufbau bewusst wie `jobs/[slug]/opengraph-image.tsx`, damit geteilte Links
// aus beiden Bereichen zusammengehörig wirken. Farbe ist das Blau des
// Designsystems statt der Kategoriefarben — Landingpages haben keine Kategorie.
//
// Inhalt kommt vollständig aus der Kampagnen-Konfiguration: Eine neue
// Landingpage bekommt ihr Vorschaubild damit automatisch, ohne dass hier
// etwas ergänzt werden muss.

// Kein `generateStaticParams` hier: Next.js laesst das zusammen mit der
// Edge-Runtime nicht zu. Das Bild wird bei der ersten Anfrage erzeugt und
// danach von den Plattformen zwischengespeichert — wie beim Pendant unter
// `jobs/[slug]/opengraph-image.tsx`.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const AKZENT = "#0071e3";

export default async function Image({
  params,
}: {
  params: Promise<{ kampagne: string }>;
}) {
  const { kampagne } = await params;
  const config = findeKampagne(kampagne) ?? KAMPAGNEN[0];

  // Die ersten drei Vorteile tragen die Aussage; der vierte bräuchte eine
  // zweite Zeile und würde das Bild überladen.
  const fakten = config.vorteile.slice(0, 3);

  // Im Vorschaubild ohne "(m/w/d)": Der Zusatz gehört auf die Seite selbst,
  // im Bild bricht er nur die letzte Zeile mitten im Wort um.
  const titel = config.position
    .replace(/\s*\((?:m\/w\/d|w\/m\/d|d\/m\/w|m\/w\/x)\)/gi, "")
    .trim();

  // Lange Bezeichnungen brauchen eine kleinere Schrift, sonst laufen sie
  // aus dem Bild.
  const titelGroesse = titel.length > 52 ? 42 : titel.length > 38 ? 48 : 56;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#0f2144",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `${AKZENT}22`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `${AKZENT}11`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", padding: "60px 80px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: AKZENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              PHE
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.05em",
              }}
            >
              PHE-Perm Engineering · Direktvermittlung
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: `${AKZENT}33`,
              borderRadius: 999,
              padding: "6px 18px",
              width: "fit-content",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#8ec2f5",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {config.einsatzgebiet}
            </span>
          </div>

          <div
            style={{
              fontSize: titelGroesse,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 28,
            }}
          >
            {titel}
          </div>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {fakten.map((v) => (
              <div key={v.titel} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{v.titel}</span>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.55)" }}>{v.zusatz}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 80px",
            background: "rgba(255,255,255,0.05)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            phe-perm.de
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: AKZENT,
              borderRadius: 999,
              padding: "10px 24px",
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
              {config.cta.primaer} →
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
