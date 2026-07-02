import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const TO = "info@phe-perm.de";
const FROM = "Website <noreply@phe-perm.de>";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { company, contact, email, phone, category, count, message, type } = body;

    let subject = "";
    let html = "";

    if (type === "talent") {
      subject = `Talentanfrage – ${company}`;
      html = `
        <h2>Neue Talentanfrage über phe-perm.de</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%">
          <tr><td><strong>Unternehmen</strong></td><td>${company}</td></tr>
          <tr><td><strong>Ansprechpartner</strong></td><td>${contact}</td></tr>
          <tr><td><strong>E-Mail</strong></td><td>${email}</td></tr>
          <tr><td><strong>Telefon</strong></td><td>${phone || "–"}</td></tr>
          <tr><td><strong>Gesuchte Fachkräfte</strong></td><td>${category}</td></tr>
          <tr><td><strong>Anzahl</strong></td><td>${count || "–"}</td></tr>
          <tr><td><strong>Anfrage</strong></td><td style="white-space:pre-wrap">${message || "–"}</td></tr>
        </table>
      `;
    } else {
      subject = `Kontaktanfrage – ${contact || company || email}`;
      html = `
        <h2>Neue Kontaktanfrage über phe-perm.de</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%">
          <tr><td><strong>Name</strong></td><td>${contact || "–"}</td></tr>
          <tr><td><strong>E-Mail</strong></td><td>${email}</td></tr>
          <tr><td><strong>Telefon</strong></td><td>${phone || "–"}</td></tr>
          <tr><td><strong>Nachricht</strong></td><td style="white-space:pre-wrap">${message || "–"}</td></tr>
        </table>
      `;
    }

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false, error: "Versand fehlgeschlagen" }, { status: 500 });
  }
}
