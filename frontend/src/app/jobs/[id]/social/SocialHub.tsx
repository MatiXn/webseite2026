"use client";
import { useState } from "react";

export default function SocialHub({ caption, jobId }: { caption: string; jobId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <textarea
        readOnly
        value={caption}
        style={{
          width: "100%", minHeight: 320, padding: "18px 20px",
          borderRadius: 14, border: "1.5px solid #d2d2d7",
          fontSize: 15, lineHeight: 1.6, color: "#1d1d1f",
          background: "#fff", resize: "vertical", fontFamily: "inherit",
        }}
      />
      <button
        onClick={copy}
        style={{
          background: copied ? "#22c55e" : "#1e3a5f", color: "#fff",
          border: "none", borderRadius: 12, padding: "14px 24px",
          fontSize: 15, fontWeight: 700, cursor: "pointer", width: "fit-content",
        }}
      >
        {copied ? "✓ Kopiert!" : "Caption kopieren"}
      </button>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        <a
          href={`/jobs/${jobId}/story-image`} download={`phe-job-${jobId}-story.png`}
          style={{
            background: "#f59e0b", color: "#1a1a1a", borderRadius: 12,
            padding: "14px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}
        >
          ⬇ Story-Bild (1080×1920)
        </a>
        <a
          href={`/jobs/${jobId}/feed-image`} download={`phe-job-${jobId}-feed.png`}
          style={{
            background: "#f59e0b", color: "#1a1a1a", borderRadius: 12,
            padding: "14px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}
        >
          ⬇ Feed-Bild (1080×1350)
        </a>
      </div>
    </div>
  );
}
