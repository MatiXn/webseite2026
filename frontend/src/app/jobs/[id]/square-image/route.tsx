import { ImageResponse } from "next/og";
import { JOBS } from "../../data";

export const runtime = "edge";

const CATEGORY_COLORS: Record<string, string> = {
  elektro: "#3d7cc9",
  mechatronik: "#8b5cf6",
  it: "#06b6d4",
  bau: "#f59e0b",
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = JOBS.find(j => j.id === id) ?? JOBS[0];
  const accent = CATEGORY_COLORS[job.category] ?? "#3d7cc9";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #0f2144 0%, #1e3a5f 55%, #2d6a9f 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glows */}
        <div style={{
          position: "absolute", right: -140, top: -140,
          width: 480, height: 480, borderRadius: "50%",
          background: `${accent}26`, display: "flex",
        }} />
        <div style={{
          position: "absolute", left: -100, bottom: 120,
          width: 340, height: 340, borderRadius: "50%",
          background: `${accent}14`, display: "flex",
        }} />

        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px 56px", flex: 1 }}>
          {/* PHE Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: accent, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "#fff",
            }}>
              PHE
            </div>
            <span style={{ fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
              PHE-Perm Engineering
            </span>
          </div>

          {/* Badge */}
          <div style={{
            display: "flex", alignItems: "center",
            background: `${accent}33`, borderRadius: 999,
            padding: "10px 26px", width: "fit-content", marginBottom: 26,
          }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Wir suchen dich
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: job.title.length > 35 ? 52 : 62,
            fontWeight: 800, color: "#fff",
            lineHeight: 1.1, letterSpacing: "-0.02em",
            marginBottom: 22, display: "flex",
          }}>
            {job.title}
          </div>

          {/* Location */}
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)", fontWeight: 600, marginBottom: 30, display: "flex" }}>
            📍 {job.city}, {job.region}
          </div>

          {/* Salary box */}
          <div style={{
            display: "flex", flexDirection: "column",
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: 22, padding: "24px 32px", marginBottom: 30,
            width: "fit-content",
          }}>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Gehalt</span>
            <span style={{ fontSize: 42, fontWeight: 900, color: "#fbbf24" }}>{job.salary}</span>
          </div>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {job.benefits.slice(0, 3).map(benefit => (
              <div key={benefit} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: "#22c55e", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 27, fontWeight: 600, color: "#fff" }}>{benefit}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          {/* CTA */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#f59e0b", borderRadius: 18,
            padding: "24px 36px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#1a1a1a" }}>Jetzt bewerben →</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
              phe-perm.de/jobs/{job.id}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
