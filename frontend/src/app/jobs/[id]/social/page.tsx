import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { JOBS } from "../../data";
import SocialHub from "./SocialHub";

export const metadata: Metadata = {
  title: "Social-Media-Kit",
  robots: { index: false, follow: false },
};

function buildCaption(job: (typeof JOBS)[number]): string {
  const benefits = job.benefits.slice(0, 4).map(b => `✅ ${b}`).join("\n");
  return `🔍 Wir suchen: ${job.title} in ${job.city}!

💰 ${job.salary}
📍 ${job.city}, ${job.region}
📃 ${job.type} – direkt beim Unternehmen

Das erwartet dich:
${benefits}

Die Vermittlung ist für dich zu 100 % kostenlos. Kein Anschreiben nötig – Bewerbung dauert nur 60 Sekunden. 👇

🔗 Link in Bio oder direkt: phe-perm.de/jobs/${job.id}

#job #jobs #karriere #stellenangebot #${job.category} #${job.city.split(",")[0].replace(/[^a-zA-ZäöüÄÖÜß]/g, "").toLowerCase()} #handwerk #techniker #festanstellung #jobsuche #neuerjob #phePerm`;
}

export function generateStaticParams() {
  return JOBS.map(j => ({ id: j.id }));
}

export default async function SocialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = JOBS.find(j => j.id === id);
  if (!job) notFound();

  const caption = buildCaption(job);

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Link href={`/jobs/${job.id}`} style={{ fontSize: 14, fontWeight: 600, color: "#2d6a9f", textDecoration: "none" }}>
          ← Zur Stellenanzeige
        </Link>
        <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "#1d1d1f", margin: "16px 0 8px" }}>
          Social-Media-Kit
        </h1>
        <p style={{ fontSize: 16, color: "#86868b", marginBottom: 40 }}>
          {job.title} · {job.city} — Bilder herunterladen, Caption kopieren, posten.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, marginBottom: 48 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>
              Story / TikTok (9:16)
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/jobs/${job.id}/story-image`} alt="Story-Vorschau"
              style={{ width: "100%", maxWidth: 320, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>
              Instagram-Feed / Meta-Ad (4:5)
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/jobs/${job.id}/feed-image`} alt="Feed-Vorschau"
              style={{ width: "100%", maxWidth: 380, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
            />
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1d1d1f", marginBottom: 16 }}>
          Caption für Instagram & TikTok
        </h2>
        <SocialHub caption={caption} jobId={job.id} />
      </div>
    </div>
  );
}
