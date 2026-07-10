import { ImageResponse } from "next/og";
import { JOBS } from "../data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
  elektro: "#3d7cc9",
  mechatronik: "#8b5cf6",
  it: "#06b6d4",
  bau: "#f59e0b",
};

const CATEGORY_LABELS: Record<string, string> = {
  elektro: "Elektrotechnik",
  mechatronik: "Mechatronik",
  it: "IT",
  bau: "Bau",
};

export default function Image({ params }: { params: { id: string } }) {
  const job = JOBS.find(j => j.id === params.id) ?? JOBS[0];
  const accent = CATEGORY_COLORS[job.category] ?? "#3d7cc9";

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
        {/* Accent glow top-right */}
        <div style={{
          position: "absolute", right: -100, top: -100,
          width: 480, height: 480, borderRadius: "50%",
          background: `${accent}22`, display: "flex",
        }} />
        <div style={{
          position: "absolute", left: -60, bottom: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: `${accent}11`, display: "flex",
        }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", padding: "60px 80px", flex: 1 }}>
          {/* PHE Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: accent, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 900, color: "#fff",
            }}>
              PHE
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>
              PHE-Perm Engineering · Recruiting
            </span>
          </div>

          {/* Category badge */}
          <div style={{
            display: "flex", alignItems: "center",
            background: `${accent}33`, borderRadius: 999,
            padding: "6px 18px", width: "fit-content", marginBottom: 20,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {CATEGORY_LABELS[job.category]}
            </span>
          </div>

          {/* Job title */}
          <div style={{
            fontSize: job.title.length > 40 ? 46 : 54,
            fontWeight: 800, color: "#fff",
            lineHeight: 1.15, letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            {job.title}
          </div>

          {/* Meta row */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
              📍 {job.city}
            </span>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
              💰 {job.salary}
            </span>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
              {job.type}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 80px",
          background: "rgba(255,255,255,0.05)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <span style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            phe-perm.de/jobs
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: accent, borderRadius: 999,
            padding: "10px 24px",
          }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Jetzt kostenlos bewerben →</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
