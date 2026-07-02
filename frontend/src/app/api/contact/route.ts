import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const FROM = "PHE-Perm Engineering <noreply@phe-perm.de>";
const TO = "info@phe-perm.de";
const BASE_URL = "https://www.phe-perm.de";

function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", process.env.CONFIRM_SECRET ?? "fallback")
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): Record<string, string> | null {
  try {
    const [data, sig] = token.split(".");
    const expected = createHmac("sha256", process.env.CONFIRM_SECRET ?? "fallback")
      .update(data)
      .digest("base64url");
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { company, contact, email, phone, category, count, message, type } = body;

    if (type === "talent") {
      // Create signed token valid for 24h
      const token = signToken({
        type, company, contact, email, phone, category, count, message,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      });

      const confirmUrl = `${BASE_URL}/api/contact/confirm?token=${token}`;

      // Send confirmation email to the user
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Bitte bestätigen Sie Ihre Anfrage – PHE-Perm Engineering",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
            <img src="${BASE_URL}/phe-logo.png" alt="PHE-Perm Engineering" style="height:32px;margin-bottom:32px" />
            <h2 style="color:#1d1d1f;font-size:22px;margin-bottom:12px">Anfrage bestätigen</h2>
            <p style="color:#3d3d3f;line-height:1.6;margin-bottom:8px">Hallo ${contact},</p>
            <p style="color:#3d3d3f;line-height:1.6;margin-bottom:24px">
              vielen Dank für Ihre Talentanfrage. Bitte bestätigen Sie Ihre E-Mail-Adresse,
              damit Ihre Anfrage bei uns eingeht.
            </p>
            <a href="${confirmUrl}" style="display:inline-block;background:#0071e3;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;margin-bottom:24px">
              Anfrage jetzt bestätigen →
            </a>
            <p style="color:#707070;font-size:13px;line-height:1.6;margin-bottom:4px">
              Dieser Link ist 24 Stunden gültig. Falls Sie keine Anfrage gestellt haben, können Sie diese E-Mail ignorieren.
            </p>
            <hr style="border:none;border-top:1px solid #e5e5ea;margin:24px 0" />
            <p style="color:#ababab;font-size:12px">PHE-Perm Engineering Ingenieure &amp; Techniker GmbH · Hüttenstraße 30 · 40215 Düsseldorf</p>
          </div>
        `,
      });

      return NextResponse.json({ ok: true, pending: true });
    }

    // Contact page form — send directly (no confirmation needed)
    const { contact: name, email: mail, phone: tel, message: msg } = body;
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: mail,
      subject: `Kontaktanfrage – ${name || mail}`,
      html: `
        <h2>Neue Kontaktanfrage über phe-perm.de</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%">
          <tr><td><strong>Name</strong></td><td>${name || "–"}</td></tr>
          <tr><td><strong>E-Mail</strong></td><td>${mail}</td></tr>
          <tr><td><strong>Telefon</strong></td><td>${tel || "–"}</td></tr>
          <tr><td><strong>Nachricht</strong></td><td style="white-space:pre-wrap">${msg || "–"}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false, error: "Versand fehlgeschlagen" }, { status: 500 });
  }
}
