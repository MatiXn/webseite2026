import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/confirm-token";
import { escapeHtml } from "@/lib/contact-validation";

const FROM = "PHE-Perm Engineering <noreply@phe-perm.de>";
const TO = "info@phe-perm.de";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/talente-finden?confirm=invalid", req.url)
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { company, contact, email, phone, category, count, message } = payload;

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Talentanfrage – ${company}`,
      html: `
        <h2>Neue Talentanfrage über phe-perm.de</h2>
        <p style="color:#22c55e;font-weight:700">&#10003; E-Mail-Adresse bestätigt</p>
        <table cellpadding="8" style="border-collapse:collapse;width:100%">
          <tr><td><strong>Unternehmen</strong></td><td>${escapeHtml(company)}</td></tr>
          <tr><td><strong>Ansprechpartner</strong></td><td>${escapeHtml(contact)}</td></tr>
          <tr><td><strong>E-Mail</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Telefon</strong></td><td>${escapeHtml(phone) || "–"}</td></tr>
          <tr><td><strong>Gesuchte Fachkräfte</strong></td><td>${escapeHtml(category) || "–"}</td></tr>
          <tr><td><strong>Anzahl</strong></td><td>${escapeHtml(count) || "–"}</td></tr>
          <tr><td><strong>Anfrage</strong></td><td style="white-space:pre-wrap">${escapeHtml(message) || "–"}</td></tr>
        </table>
      `,
    });

    return NextResponse.redirect(
      new URL("/talente-finden?confirm=success", req.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/talente-finden?confirm=error", req.url)
    );
  }
}
