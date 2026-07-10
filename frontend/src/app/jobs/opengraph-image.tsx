import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PHE-Perm Engineering – Aktuelle Stellenangebote";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        {/* Background accent circles */}
        <div style={{
          position: "absolute", right: -120, top: -120,
          width: 500, height: 500, borderRadius: "50%",
          background: "rgba(61,124,201,0.18)", display: "flex",
        }} />
        <div style={{
          position: "absolute", right: 80, bottom: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "rgba(61,124,201,0.12)", display: "flex",
        }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", flex: 1 }}>
          {/* Logo text */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#3d7cc9", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 800, color: "#fff",
            }}>P</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
              PHE-Perm Engineering
            </span>
          </div>

          {/* Main headline */}
          <div style={{ fontSize: 62, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}>
            Wir haben die<br />
            <span style={{ color: "#3d7cc9" }}>richtige Stelle</span><br />
            für dich.
          </div>

          {/* Subtext */}
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
            Elektrotechnik · IT · Mechatronik · Bau · Bundesweit
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 80px", background: "rgba(255,255,255,0.06)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            phe-perm.de/jobs
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#3d7cc9", borderRadius: 999,
            padding: "10px 24px",
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Jetzt bewerben →</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
