import Link from "next/link";
import type { Metadata } from "next";
import { JOBS } from "../data";

export const metadata: Metadata = {
  title: "Social-Media-Kits – Übersicht",
  robots: { index: false, follow: false },
};

const CATEGORY_LABELS: Record<string, string> = {
  elektro: "Elektrotechnik",
  mechatronik: "Mechatronik",
  it: "IT & Software",
  bau: "Bau & Infrastruktur",
};

const CATEGORY_COLORS: Record<string, string> = {
  elektro: "#3d7cc9",
  mechatronik: "#8b5cf6",
  it: "#06b6d4",
  bau: "#f59e0b",
};

export default function SocialKitOverview() {
  const byCategory = Object.keys(CATEGORY_LABELS).map(cat => ({
    category: cat,
    jobs: JOBS.filter(j => j.category === cat),
  })).filter(g => g.jobs.length > 0);

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh", padding: "48px 24px 80px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#1d1d1f", marginBottom: 8 }}>
          Social-Media-Kits
        </h1>
        <p style={{ fontSize: 16, color: "#86868b", marginBottom: 12 }}>
          Alle {JOBS.length} Stellenanzeigen — pro Job: Story-Bild, Feed-Bild und fertige Caption.
        </p>
        <p style={{
          fontSize: 14, color: "#92400e", background: "#fffbeb",
          border: "1px solid #fde68a", borderRadius: 12,
          padding: "12px 16px", marginBottom: 40, lineHeight: 1.6,
        }}>
          💡 <strong>Welches Bild wofür?</strong> Story 9:16 → nur Instagram-Story & TikTok ·
          Feed 1:1 → Instagram-/Facebook-Feed-Posts · Ad 4:5 → Meta-Anzeigen.
          Das falsche Format wird von der Plattform abgeschnitten!
        </p>

        {byCategory.map(group => (
          <section key={group.category} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 14, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", color: CATEGORY_COLORS[group.category],
              marginBottom: 16,
            }}>
              {CATEGORY_LABELS[group.category]} ({group.jobs.length})
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {group.jobs.map(job => (
                <div key={job.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 16, flexWrap: "wrap",
                  background: "#fff", borderRadius: 14, padding: "18px 22px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ minWidth: 240 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 2 }}>
                      {job.title}
                    </p>
                    <p style={{ fontSize: 13, color: "#86868b" }}>
                      {job.city} · {job.salary}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/jobs/${job.id}/social`} style={{
                      background: "#1e3a5f", color: "#fff", borderRadius: 10,
                      padding: "10px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}>
                      Kit öffnen →
                    </Link>
                    <a href={`/jobs/${job.id}/story-image`} download={`phe-job-${job.id}-story.png`} style={{
                      background: "#eef4fb", color: "#1e3a5f", borderRadius: 10,
                      padding: "10px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}>
                      ⬇ Story 9:16
                    </a>
                    <a href={`/jobs/${job.id}/square-image`} download={`phe-job-${job.id}-quadrat.png`} style={{
                      background: "#eef4fb", color: "#1e3a5f", borderRadius: 10,
                      padding: "10px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}>
                      ⬇ Feed 1:1
                    </a>
                    <a href={`/jobs/${job.id}/feed-image`} download={`phe-job-${job.id}-hochformat.png`} style={{
                      background: "#eef4fb", color: "#1e3a5f", borderRadius: 10,
                      padding: "10px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}>
                      ⬇ Ad 4:5
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
