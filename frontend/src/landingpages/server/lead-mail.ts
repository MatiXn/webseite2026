import "server-only";

// Benachrichtigung an PHE über einen neuen Lead.
//
// Nutzt dieselbe Resend-Infrastruktur wie das Kontaktformular
// (`src/app/api/contact/route.ts`), damit es nur einen Absender und einen
// API-Schlüssel gibt.
//
// Schlägt der Versand fehl, darf das den Lead nicht gefährden: Der Aufrufer
// vermerkt den Fehlerstatus am Datensatz, damit die Benachrichtigung
// nachgeholt werden kann.

import { Resend } from "resend";
import { escapeHtml } from "../../lib/contact-validation";
import type { LandingpageConfig } from "../typen";
import type { LeadDatensatz } from "./lead-speicher";

const ABSENDER = "PHE-Perm Engineering <noreply@phe-perm.de>";

export type MailErgebnis =
  | { ok: true }
  | { ok: false; grund: "nicht_konfiguriert" | "fehler"; meldung?: string };

/** Übersetzt gespeicherte Werte zurück in die Beschriftung aus der Kampagne. */
function beschriftung(
  config: LandingpageConfig,
  feld: string,
  wert: string | string[] | null,
): string {
  if (wert === null || wert === "" || (Array.isArray(wert) && wert.length === 0)) {
    return "–";
  }

  const schritt = config.funnel.schritte.find(
    (s) => s.art !== "kontakt" && s.feld === feld,
  );
  if (!schritt || schritt.art === "kontakt") {
    return Array.isArray(wert) ? wert.join(", ") : wert;
  }

  const werte = Array.isArray(wert) ? wert : [wert];
  return werte
    .map((w) => schritt.optionen.find((o) => o.wert === w)?.label ?? w)
    .join(", ");
}

function zeile(titel: string, inhalt: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#707070;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(titel)}</td>
    <td style="padding:6px 0;color:#1d1d1f;font-size:14px">${escapeHtml(inhalt)}</td>
  </tr>`;
}

export async function sendeBenachrichtigung(
  config: LandingpageConfig,
  lead: LeadDatensatz,
  leadId: string,
): Promise<MailErgebnis> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const empfaenger = process.env.RECRUITING_NOTIFICATION_EMAIL?.trim();

  if (!apiKey || !empfaenger) {
    return { ok: false, grund: "nicht_konfiguriert" };
  }

  const eingegangen = new Date().toLocaleString("de-DE", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  });

  const herkunft =
    [lead.utm_source, lead.utm_campaign, lead.campaign_name].filter(Boolean).join(" · ") ||
    (lead.fbclid ? "Meta-Anzeige (ohne UTM-Parameter)" : "Direktaufruf");

  const zeilen = [
    zeile("Name", `${lead.first_name} ${lead.last_name}`),
    zeile("Telefon", lead.phone),
    zeile("E-Mail", lead.email),
    zeile("Erreichbar", lead.preferred_contact_time || "–"),
    zeile("Aktuelle Position", lead.current_job_title || "–"),
    zeile("Qualifikation", beschriftung(config, "qualification", lead.qualification)),
    zeile("Berufserfahrung", beschriftung(config, "experience_level", lead.experience_level)),
    zeile("Wohnort passt", beschriftung(config, "location_match", lead.location_match)),
    zeile("Postleitzahl", lead.postal_code || "–"),
    zeile("Führerschein B", beschriftung(config, "driving_license", lead.driving_license)),
    zeile("Wichtig im nächsten Job", beschriftung(config, "job_preferences", lead.job_preferences)),
    zeile("Herkunft", herkunft),
    zeile("Anzeigen-ID", lead.ad_id || "–"),
    zeile("Landingpage", lead.landing_page_url || "–"),
    zeile("Eingegangen", eingegangen),
    zeile("Datensatz-ID", leadId),
  ].join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;margin:0 auto;padding:32px 24px">
      <h2 style="color:#1d1d1f;font-size:20px;margin-bottom:4px">${escapeHtml(config.benachrichtigungsBetreff)}</h2>
      <p style="color:#707070;font-size:14px;margin-bottom:24px">
        ${escapeHtml(config.position)} — ${escapeHtml(config.einsatzgebiet)}
      </p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${zeilen}</table>
      <hr style="border:none;border-top:1px solid #e5e5ea;margin:24px 0" />
      <p style="color:#707070;font-size:12px;line-height:1.6">
        Einwilligung zur Kontaktaufnahme erteilt am
        ${escapeHtml(new Date(lead.consent_timestamp).toLocaleString("de-DE", { timeZone: "Europe/Berlin" }))}
        (Fassung ${escapeHtml(lead.consent_version)}).
        Talentpool-Einwilligung: ${lead.talent_pool_consent ? "ja" : "nein"}.
      </p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: ABSENDER,
      to: empfaenger,
      replyTo: lead.email,
      subject: `${config.benachrichtigungsBetreff} — ${lead.first_name} ${lead.last_name}`,
      html,
    });

    if (error) {
      return { ok: false, grund: "fehler", meldung: error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      grund: "fehler",
      meldung: err instanceof Error ? err.message : "unbekannt",
    };
  }
}
