import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/confirm-token";
import {
  escapeHtml, isValidEmail, isBusinessEmail, isGermanPhone,
  looksLikeRealName, sanitizeFields, rateLimit,
} from "@/lib/contact-validation";
import {
  isDisposableEmail, hasMxRecords, passesEmailValidationApi, passesTurnstile,
} from "@/lib/email-checks";

// Vertiefte E-Mail-Prüfung für beide Anfrage-Typen:
// Wegwerf-Domain → MX-Records → optionale Validierungs-API
async function deepEmailCheck(email: string): Promise<string | null> {
  if (isDisposableEmail(email)) {
    return "Wegwerf-E-Mail-Adressen werden nicht akzeptiert. Bitte verwenden Sie Ihre reguläre E-Mail-Adresse.";
  }
  if (!(await hasMxRecords(email))) {
    return "Diese E-Mail-Domain kann keine E-Mails empfangen. Bitte prüfen Sie Ihre Eingabe auf Tippfehler.";
  }
  if (!(await passesEmailValidationApi(email))) {
    return "Diese E-Mail-Adresse konnte nicht verifiziert werden. Bitte prüfen Sie Ihre Eingabe.";
  }
  return null;
}

const FROM = "PHE-Perm Engineering <noreply@phe-perm.de>";
const TO = "info@phe-perm.de";
const BASE_URL = "https://www.phe-perm.de";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Zu viele Anfragen. Bitte später erneut versuchen." }, { status: 429 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const type = body?.type === "talent" ? "talent" : "contact";

    // Honeypot: unsichtbares Feld, das nur Bots ausfüllen → vorgetäuschter
    // Erfolg ohne Versand, damit das Skript nichts von der Abwehr merkt
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true, pending: true });
    }

    // Cloudflare Turnstile (aktiv sobald TURNSTILE_SECRET_KEY gesetzt ist)
    if (!(await passesTurnstile(String(body?.turnstileToken ?? ""), ip))) {
      return NextResponse.json(
        { ok: false, error: "Bot-Prüfung fehlgeschlagen. Bitte laden Sie die Seite neu und versuchen Sie es erneut." },
        { status: 400 }
      );
    }

    if (type === "talent") {
      const parsed = sanitizeFields(body, [
        { key: "company", required: true, max: 200 },
        { key: "contact", required: true, max: 200 },
        { key: "email", required: true, max: 254 },
        { key: "phone", required: true, max: 40 },
        { key: "category", max: 100 },
        { key: "count", max: 20 },
        { key: "message", max: 5000 },
      ]);
      if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
      const f = parsed.fields;

      if (!isBusinessEmail(f.email)) {
        return NextResponse.json({ ok: false, error: "Bitte eine geschäftliche E-Mail-Adresse verwenden." }, { status: 400 });
      }
      if (!isGermanPhone(f.phone)) {
        return NextResponse.json({ ok: false, error: "Bitte eine gültige deutsche Telefonnummer angeben." }, { status: 400 });
      }
      if (!looksLikeRealName(f.contact)) {
        return NextResponse.json({ ok: false, error: "Bitte geben Sie den vollständigen Namen des Ansprechpartners an." }, { status: 400 });
      }
      const emailIssue = await deepEmailCheck(f.email);
      if (emailIssue) {
        return NextResponse.json({ ok: false, error: emailIssue }, { status: 400 });
      }

      const token = signToken({ ...f, type, exp: Date.now() + 24 * 60 * 60 * 1000 });
      const confirmUrl = `${BASE_URL}/api/contact/confirm?token=${encodeURIComponent(token)}`;

      await resend.emails.send({
        from: FROM,
        to: f.email,
        subject: "Bitte bestätigen Sie Ihre Anfrage – PHE-Perm Engineering",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
            <img src="${BASE_URL}/phe-logo.png" alt="PHE-Perm Engineering" style="height:32px;margin-bottom:32px" />
            <h2 style="color:#1d1d1f;font-size:22px;margin-bottom:12px">Anfrage bestätigen</h2>
            <p style="color:#3d3d3f;line-height:1.6;margin-bottom:8px">Hallo ${escapeHtml(f.contact)},</p>
            <p style="color:#3d3d3f;line-height:1.6;margin-bottom:24px">
              vielen Dank für Ihre Talentanfrage. Bitte bestätigen Sie Ihre E-Mail-Adresse,
              damit Ihre Anfrage bei uns eingeht.
            </p>
            <a href="${confirmUrl}" style="display:inline-block;background:#0071e3;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;margin-bottom:24px">
              Anfrage jetzt bestätigen &rarr;
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

    // Kontaktformular — ebenfalls Double-Opt-In: erst nach E-Mail-Bestätigung
    // geht die Anfrage bei uns ein (blockt Bots und Fake-Adressen)
    const parsed = sanitizeFields(body, [
      { key: "contact", required: true, max: 200 },
      { key: "email", required: true, max: 254 },
      { key: "phone", required: true, max: 40 },
      { key: "message", max: 5000 },
    ]);
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    const f = parsed.fields;

    if (!isValidEmail(f.email)) {
      return NextResponse.json({ ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
    }
    if (!isGermanPhone(f.phone)) {
      return NextResponse.json({ ok: false, error: "Bitte eine gültige deutsche Telefonnummer angeben." }, { status: 400 });
    }
    if (!looksLikeRealName(f.contact)) {
      return NextResponse.json({ ok: false, error: "Bitte geben Sie Ihren vollständigen Namen an." }, { status: 400 });
    }
    const emailIssue = await deepEmailCheck(f.email);
    if (emailIssue) {
      return NextResponse.json({ ok: false, error: emailIssue }, { status: 400 });
    }

    // LinkedIn-verifizierte Bewerber: Identität ist bereits bestätigt →
    // Anfrage geht direkt ein, kein Double-Opt-In nötig
    const li = verifyToken(String(body?.linkedinToken ?? ""));
    if (li && typeof li.liEmail === "string" && li.liEmail.toLowerCase() === f.email.toLowerCase()) {
      const isBewerbung = f.message.startsWith("[Bewerbung:");
      await resend.emails.send({
        from: FROM,
        to: isBewerbung ? "bewerbung@phe-perm.de" : TO,
        replyTo: f.email,
        subject: isBewerbung
          ? `Bewerbung – ${f.contact || f.email}`
          : `Kontaktanfrage – ${f.contact || f.email}`,
        html: `
          <h2>${isBewerbung ? "Neue Bewerbung" : "Neue Kontaktanfrage"} über phe-perm.de</h2>
          <p style="color:#0a66c2;font-weight:700">&#10003; Identität via LinkedIn bestätigt (${escapeHtml(String(li.liName ?? ""))})</p>
          <table cellpadding="8" style="border-collapse:collapse;width:100%">
            <tr><td><strong>Name</strong></td><td>${escapeHtml(f.contact) || "–"}</td></tr>
            <tr><td><strong>E-Mail</strong></td><td>${escapeHtml(f.email)}</td></tr>
            <tr><td><strong>Telefon</strong></td><td>${escapeHtml(f.phone) || "–"}</td></tr>
            <tr><td><strong>Nachricht</strong></td><td style="white-space:pre-wrap">${escapeHtml(f.message) || "–"}</td></tr>
          </table>
        `,
      });
      return NextResponse.json({ ok: true, confirmed: true });
    }

    const token = signToken({ ...f, type, exp: Date.now() + 24 * 60 * 60 * 1000 });
    const confirmUrl = `${BASE_URL}/api/contact/confirm?token=${encodeURIComponent(token)}`;

    await resend.emails.send({
      from: FROM,
      to: f.email,
      subject: "Bitte bestätigen Sie Ihre Nachricht – PHE-Perm Engineering",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
          <img src="${BASE_URL}/phe-logo.png" alt="PHE-Perm Engineering" style="height:32px;margin-bottom:32px" />
          <h2 style="color:#1d1d1f;font-size:22px;margin-bottom:12px">Nachricht bestätigen</h2>
          <p style="color:#3d3d3f;line-height:1.6;margin-bottom:8px">Hallo${f.contact ? ` ${escapeHtml(f.contact)}` : ""},</p>
          <p style="color:#3d3d3f;line-height:1.6;margin-bottom:24px">
            vielen Dank für Ihre Nachricht. Bitte bestätigen Sie Ihre E-Mail-Adresse,
            damit Ihre Nachricht bei uns eingeht.
          </p>
          <a href="${confirmUrl}" style="display:inline-block;background:#0071e3;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;margin-bottom:24px">
            Nachricht jetzt bestätigen &rarr;
          </a>
          <p style="color:#707070;font-size:13px;line-height:1.6;margin-bottom:4px">
            Dieser Link ist 24 Stunden gültig. Falls Sie keine Nachricht gesendet haben, können Sie diese E-Mail ignorieren.
          </p>
          <hr style="border:none;border-top:1px solid #e5e5ea;margin:24px 0" />
          <p style="color:#ababab;font-size:12px">PHE-Perm Engineering Ingenieure &amp; Techniker GmbH · Hüttenstraße 30 · 40215 Düsseldorf</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, pending: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ ok: false, error: "Versand fehlgeschlagen" }, { status: 500 });
  }
}
