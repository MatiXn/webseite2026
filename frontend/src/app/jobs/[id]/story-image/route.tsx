import { ImageResponse } from "next/og";
import { JOBS } from "../../data";

export const runtime = "edge";

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = JOBS.find(j => j.id === id) ?? JOBS[0];
  const accent = CATEGORY_COLORS[job.category] ?? "#3d7cc9";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1920,
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
          position: "absolute", right: -180, top: -180,
          width: 640, height: 640, borderRadius: "50%",
          background: `${accent}26`, display: "flex",
        }} />
        <div style={{
          position: "absolute", left: -140, bottom: 300,
          width: 460, height: 460, borderRadius: "50%",
          background: `${accent}14`, display: "flex",
        }} />

        <div style={{ display: "flex", flexDirection: "column", padding: "110px 90px 90px", flex: 1 }}>
          {/* PHE Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 90 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: accent, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 900, color: "#fff",
            }}>
              PHE
            </div>
            <span style={{ fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
              PHE-Perm Engineering
            </span>
          </div>

          {/* Badge */}
          <div style={{
            display: "flex", alignItems: "center",
            background: `${accent}33`, borderRadius: 999,
            padding: "12px 32px", width: "fit-content", marginBottom: 36,
          }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              🔍 Wir suchen dich
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: job.title.length > 35 ? 72 : 84,
            fontWeight: 800, color: "#fff",
            lineHeight: 1.1, letterSpacing: "-0.02em",
            marginBottom: 40, display: "flex",
          }}>
            {job.title}
          </div>

          {/* Location */}
          <div style={{ fontSize: 40, color: "rgba(255,255,255,0.75)", fontWeight: 600, marginBottom: 56, display: "flex" }}>
            📍 {job.city}, {job.region}
          </div>

          {/* Salary box */}
          <div style={{
            display: "flex", flexDirection: "column",
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: 28, padding: "36px 44px", marginBottom: 56,
            width: "fit-content",
          }}>
            <span style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Gehalt</span>
            <span style={{ fontSize: 58, fontWeight: 900, color: "#fbbf24" }}>{job.salary}</span>
          </div>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {job.benefits.slice(0, 4).map(benefit => (
              <div key={benefit} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 999,
                  background: "#22c55e", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 28, color: "#fff", fontWeight: 900,
                }}>
                  ✓
                </div>
                <span style={{ fontSize: 36, fontWeight: 600, color: "#fff" }}>{benefit}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          {/* CTA */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#f59e0b", borderRadius: 24,
            padding: "36px 48px", marginBottom: 36,
          }}>
            <span style={{ fontSize: 42, fontWeight: 800, color: "#1a1a1a" }}>Jetzt bewerben →</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
              phe-perm.de/jobs/{job.id}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
