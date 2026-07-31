"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Turnstile from "@/components/Turnstile";

// Vom LinkedIn-Callback gesetztes Cookie mit verifizierten Profildaten lesen
function readLinkedInProfile(): { name: string; email: string; token: string } | null {
  const raw = document.cookie.split("; ").find(c => c.startsWith("li_profile="))?.split("=")[1];
  if (!raw) return null;
  try {
    const data = JSON.parse(atob(raw.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof data?.name === "string" && typeof data?.email === "string" && typeof data?.token === "string") {
      return data;
    }
  } catch { /* defektes Cookie ignorieren */ }
  return null;
}

export default function ApplyForm({ jobTitle, jobCity }: { jobTitle: string; jobCity: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [linkedin, setLinkedin] = useState<{ name: string; email: string; token: string } | null>(null);
  const [confirmedDirectly, setConfirmedDirectly] = useState(false);
  const pathname = usePathname();
  const linkedinEnabled = !!process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;

  useEffect(() => {
    const profile = readLinkedInProfile();
    if (profile) {
      setLinkedin(profile);
      setForm(f => ({ ...f, name: f.name || profile.name, email: profile.email }));
    }
  }, []);

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
          website: honeypot,
          turnstileToken,
          linkedinToken: linkedin?.token ?? "",
          message: `[Bewerbung: ${jobTitle} – ${jobCity}]\n\n${form.message || "Keine Nachricht angegeben."}`,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error);
      }
      setConfirmedDirectly(data?.confirmed === true);
      setSent(true);
    } catch (err) {
      setError(
        (err instanceof Error && err.message) ||
        "Versand fehlgeschlagen. Bitte schreiben Sie uns direkt an info@phe-perm.de."
      );
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
          {confirmedDirectly
            ? "Ihre Bewerbung ist direkt bei uns eingegangen — Ihre Identität wurde bereits über LinkedIn bestätigt."
            : "Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie Ihre Adresse, damit Ihre Bewerbung bei uns eingeht."}
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
      {linkedinEnabled && !linkedin && (
        <>
          <a
            href={`/api/auth/linkedin?return=${encodeURIComponent(pathname ?? "/jobs")}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "#0a66c2", color: "#fff", borderRadius: 12,
              padding: "14px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
            </svg>
            Mit LinkedIn bewerben
          </a>
          <p style={{ fontSize: 12, color: "#86868b", textAlign: "center", margin: 0 }}>
            oder Formular manuell ausfüllen
          </p>
        </>
      )}
      {linkedin && (
        <div style={{
          background: "#eef6ff", border: "1.5px solid #0a66c2", borderRadius: 12,
          padding: "10px 14px", fontSize: 13, color: "#0a66c2", fontWeight: 600,
        }}>
          ✓ Identität via LinkedIn bestätigt: {linkedin.name} — Ihre Bewerbung geht ohne
          zusätzliche E-Mail-Bestätigung direkt bei uns ein.
        </div>
      )}
      <input
        style={inputStyle} placeholder="Ihr Name *" required maxLength={200}
        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        style={inputStyle} placeholder="E-Mail-Adresse *" type="email" required maxLength={254}
        value={form.email} readOnly={!!linkedin}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        style={inputStyle} placeholder="Telefonnummer *" type="tel" required maxLength={40}
        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
      />
      {/* Honeypot — für Menschen unsichtbar, Bots füllen es aus */}
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={honeypot} onChange={e => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
      />
      <textarea
        style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
        placeholder="Kurze Nachricht (optional) – z. B. Ihre Erfahrung oder Verfügbarkeit"
        maxLength={5000}
        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
      />
      <Turnstile onVerify={setTurnstileToken} />
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
