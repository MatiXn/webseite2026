import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/confirm-token";
import { escapeHtml } from "@/lib/contact-validation";

const FROM = "PHE-Perm Engineering <noreply@phe-perm.de>";
const TO = "info@phe-perm.de";

// Rücksprungseite je nach Anfrage-Typ
const returnPage = (payload: Record<string, string> | null) =>
  payload?.type === "contact" ? "/kontakt" : "/technische-personalvermittlung";

// GET zeigt nur eine Zwischenseite mit Button. E-Mail-Sicherheits-Scanner rufen
// Links per GET automatisch auf — würde GET die Anfrage auslösen, wäre das
// Double-Opt-In wirkungslos (so kamen Bot-Anfragen als „bestätigt" durch).
// Erst der explizite Button-Klick (POST) löst die Anfrage aus.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/technische-personalvermittlung?confirm=invalid", req.url)
    );
  }

  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Anfrage bestätigen – PHE-Perm Engineering</title>
</head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f7;display:flex;align-items:center;justify-content:center;min-height:100vh">
  <div style="background:#fff;border-radius:20px;padding:44px 36px;max-width:440px;margin:24px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
    <img src="/phe-logo.png" alt="PHE-Perm Engineering" style="height:32px;margin-bottom:28px" />
    <h1 style="color:#1d1d1f;font-size:22px;margin:0 0 12px">Bestätigung abschließen</h1>
    <p style="color:#3d3d3f;line-height:1.6;margin:0 0 28px">
      Bitte klicken Sie auf den Button, um Ihre Anfrage endgültig zu bestätigen.
      Erst danach geht sie bei uns ein.
    </p>
    <form method="POST" action="/api/contact/confirm">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <button type="submit" style="background:#0071e3;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;border:none;cursor:pointer">
        Anfrage jetzt bestätigen &rarr;
      </button>
    </form>
    <p style="color:#ababab;font-size:12px;margin-top:28px">PHE-Perm Engineering Ingenieure &amp; Techniker GmbH · Hüttenstraße 30 · 40215 Düsseldorf</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const token = String(formData?.get("token") ?? "");
  const payload = verifyToken(token);

  const page = returnPage(payload);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/technische-personalvermittlung?confirm=invalid", req.url),
      303
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    if (payload.type === "contact") {
      const { contact, email, phone, message } = payload;
      const isBewerbung = typeof message === "string" && message.startsWith("[Bewerbung:");
      await resend.emails.send({
        from: FROM,
        to: isBewerbung ? "bewerbung@phe-perm.de" : TO,
        replyTo: email,
        subject: isBewerbung
          ? `Bewerbung – ${contact || email}`
          : `Kontaktanfrage – ${contact || email}`,
        html: `
          <h2>${isBewerbung ? "Neue Bewerbung" : "Neue Kontaktanfrage"} über phe-perm.de</h2>
          <p style="color:#22c55e;font-weight:700">&#10003; E-Mail-Adresse bestätigt (Button-Klick)</p>
          <table cellpadding="8" style="border-collapse:collapse;width:100%">
            <tr><td><strong>Name</strong></td><td>${escapeHtml(contact) || "–"}</td></tr>
            <tr><td><strong>E-Mail</strong></td><td>${escapeHtml(email)}</td></tr>
            <tr><td><strong>Telefon</strong></td><td>${escapeHtml(phone) || "–"}</td></tr>
            <tr><td><strong>Nachricht</strong></td><td style="white-space:pre-wrap">${escapeHtml(message) || "–"}</td></tr>
          </table>
        `,
      });
    } else {
      const { company, contact, email, phone, category, count, message } = payload;
      await resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `Talentanfrage – ${company}`,
        html: `
          <h2>Neue Talentanfrage über phe-perm.de</h2>
          <p style="color:#22c55e;font-weight:700">&#10003; E-Mail-Adresse bestätigt (Button-Klick)</p>
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
    }

    return NextResponse.redirect(new URL(`${page}?confirm=success`, req.url), 303);
  } catch {
    return NextResponse.redirect(new URL(`${page}?confirm=error`, req.url), 303);
  }
}
