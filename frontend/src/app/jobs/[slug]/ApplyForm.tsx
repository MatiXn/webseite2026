"use client";
import { useState } from "react";

export default function ApplyForm({ jobTitle, jobCity }: { jobTitle: string; jobCity: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          contact: form.name,
          email: form.email,
          phone: form.phone,
          message: `[Bewerbung: ${jobTitle} – ${jobCity}]\n\n${form.message || "Keine Nachricht angegeben."}`,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Versand fehlgeschlagen. Bitte schreiben Sie uns direkt an info@phe-perm.de.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 16,
        padding: "32px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
          Fast geschafft!
        </h3>
        <p style={{ fontSize: 15, color: "#15803d", lineHeight: 1.6, marginBottom: 12 }}>
          Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie Ihre Adresse,
          damit Ihre Bewerbung bei uns eingeht.
        </p>
        <p style={{ fontSize: 14, color: "#166534", lineHeight: 1.6, fontWeight: 600 }}>
          Danach melden wir uns innerhalb von 24 Stunden telefonisch oder per E-Mail bei Ihnen.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "1.5px solid #d2d2d7", fontSize: 15, background: "#fff",
    outline: "none", color: "#1d1d1f",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <input
        style={inputStyle} placeholder="Ihr Name *" required maxLength={200}
        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        style={inputStyle} placeholder="E-Mail-Adresse *" type="email" required maxLength={254}
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        style={inputStyle} placeholder="Telefonnummer" type="tel" maxLength={40}
        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      <textarea
        style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
        placeholder="Kurze Nachricht (optional) – z. B. Ihre Erfahrung oder Verfügbarkeit"
        maxLength={5000}
        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
      />
      {error && (
        <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 600 }}>{error}</p>
      )}
      <button
        type="submit" disabled={loading}
        style={{
          background: "#f59e0b", color: "#1a1a1a", border: "none", borderRadius: 12,
          padding: "16px 24px", fontSize: 16, fontWeight: 800, cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Wird gesendet…" : "Jetzt bewerben →"}
      </button>
      <p style={{ fontSize: 12, color: "#86868b", textAlign: "center", lineHeight: 1.5 }}>
        🔒 100 % unverbindlich & vertraulich. Ihre Daten werden nur zur Bearbeitung
        Ihrer Bewerbung verwendet – keine Weitergabe ohne Ihre Zustimmung.
      </p>
    </form>
  );
}
