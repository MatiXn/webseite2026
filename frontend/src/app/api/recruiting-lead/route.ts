import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { findeKampagne } from "../../../landingpages/registry";
import {
  pruefeAntwortenGegenConfig,
  pruefeKontaktdaten,
  normalisiereTelefonnummer,
  FELD_GRENZEN,
  type Kontaktdaten,
} from "../../../landingpages/funnel-logik";
import { filtereKampagnenParameter } from "../../../landingpages/kampagnen-parameter";
import { EINWILLIGUNG_VERSION } from "../../../landingpages/einwilligung";
import {
  speichereLead,
  aktualisiereStatus,
  speicherIstKonfiguriert,
  type LeadDatensatz,
} from "../../../landingpages/server/lead-speicher";
import { sendeBenachrichtigung } from "../../../landingpages/server/lead-mail";
import { synchronisiereLead, salesforceAktiv } from "../../../landingpages/server/salesforce";
import { rateLimit } from "../../../lib/contact-validation";

// Nimmt Bewerber-Leads von allen Recruiting-Landingpages entgegen.
//
// Ablauf, bewusst in dieser Reihenfolge:
//   1. Rate-Limit und Honeypot
//   2. Prüfung gegen die Kampagnen-Konfiguration (nur definierte Felder/Werte)
//   3. Speichern in Supabase — nur dieser Schritt entscheidet über Erfolg
//   4. E-Mail an PHE, danach Salesforce; beide dürfen scheitern, ohne dass
//      der Lead verloren geht oder der Person ein Fehler angezeigt wird
//
// Die Erfolgsmeldung im Browser erscheint ausschließlich, wenn Schritt 3
// geklappt hat.

const ALLGEMEINER_FEHLER =
  "Deine Angaben konnten gerade nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns direkt.";

function fehler(meldung: string, status: number) {
  return NextResponse.json({ ok: false, fehler: meldung }, { status });
}

/** Nimmt genau die sechs Kontaktfelder an und kürzt sie auf ihre Grenzen. */
function leseKontaktdaten(eingabe: unknown): Kontaktdaten {
  const q = (eingabe ?? {}) as Record<string, unknown>;
  const text = (schluessel: keyof Kontaktdaten) => {
    const wert = q[schluessel];
    return typeof wert === "string" ? wert.trim().slice(0, FELD_GRENZEN[schluessel]) : "";
  };

  return {
    first_name: text("first_name"),
    last_name: text("last_name"),
    phone: text("phone"),
    email: text("email").toLowerCase(),
    preferred_contact_time: text("preferred_contact_time"),
    current_job_title: text("current_job_title"),
  };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Fünf Versuche pro Minute und IP — großzügig genug für Tippfehler,
  // eng genug gegen einfache Skripte.
  if (!rateLimit(ip)) {
    return fehler("Zu viele Anfragen. Bitte versuche es in einer Minute erneut.", 429);
  }

  let koerper: Record<string, unknown>;
  try {
    koerper = (await req.json()) as Record<string, unknown>;
  } catch {
    return fehler(ALLGEMEINER_FEHLER, 400);
  }

  // Honeypot: Nur Bots füllen dieses Feld. Vorgetäuschter Erfolg, damit das
  // Skript die Abwehr nicht bemerkt — gespeichert wird nichts.
  if (typeof koerper.website === "string" && koerper.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const config = findeKampagne(String(koerper.kampagne ?? ""));
  if (!config) {
    return fehler("Diese Stelle ist nicht mehr verfügbar.", 404);
  }

  // Die Konfiguration bestimmt, welche Felder und Werte zulässig sind.
  const geprueft = pruefeAntwortenGegenConfig(config, koerper.antworten);
  if (!geprueft.ok) {
    return fehler(geprueft.fehler, 400);
  }

  const kontakt = leseKontaktdaten(koerper.kontakt);
  const kontaktfehler = pruefeKontaktdaten(kontakt);
  if (Object.keys(kontaktfehler).length > 0) {
    return fehler(Object.values(kontaktfehler)[0] ?? ALLGEMEINER_FEHLER, 400);
  }

  if (koerper.einwilligung !== true) {
    return fehler("Ohne deine Zustimmung dürfen wir dich nicht kontaktieren.", 400);
  }

  if (!speicherIstKonfiguriert()) {
    console.error("[recruiting-lead] Supabase-Zugangsdaten fehlen — Lead nicht gespeichert");
    return fehler(ALLGEMEINER_FEHLER, 503);
  }

  const antworten = geprueft.antworten;
  const einzel = (feld: string) =>
    typeof antworten[feld] === "string" ? (antworten[feld] as string) : null;

  const parameter = filtereKampagnenParameter(koerper);
  const eventId = randomUUID();

  const datensatz: LeadDatensatz = {
    first_name: kontakt.first_name,
    last_name: kontakt.last_name,
    email: kontakt.email,
    phone: kontakt.phone,
    phone_normalized: normalisiereTelefonnummer(kontakt.phone),
    postal_code: einzel("postal_code"),
    current_job_title: kontakt.current_job_title || null,
    preferred_contact_time: kontakt.preferred_contact_time || null,

    qualification: einzel("qualification"),
    experience_level: einzel("experience_level"),
    location_match: einzel("location_match"),
    driving_license: einzel("driving_license"),
    job_preferences: Array.isArray(antworten.job_preferences)
      ? (antworten.job_preferences as string[])
      : [],
    // Vollständige Antwortmenge — trägt auch Fragen, für die es keine eigene
    // Spalte gibt. Damit kann eine künftige Kampagne beliebige Fragen stellen,
    // ohne dass die Tabelle geändert werden muss.
    answers: antworten,

    job_slug: config.slug,
    job_title: config.position,

    campaign_source: parameter.campaign_source ?? parameter.utm_source ?? null,
    campaign_name: parameter.campaign_name ?? parameter.utm_campaign ?? null,
    campaign_id: parameter.campaign_id ?? null,
    adset_id: parameter.adset_id ?? null,
    ad_id: parameter.ad_id ?? null,
    utm_source: parameter.utm_source ?? null,
    utm_medium: parameter.utm_medium ?? null,
    utm_campaign: parameter.utm_campaign ?? null,
    utm_content: parameter.utm_content ?? null,
    fbclid: parameter.fbclid ?? null,
    landing_page_url:
      typeof koerper.landing_page_url === "string"
        ? koerper.landing_page_url.slice(0, 1000)
        : null,
    referrer: typeof koerper.referrer === "string" ? koerper.referrer.slice(0, 500) : null,

    consent_given: true,
    consent_timestamp: new Date().toISOString(),
    // Die Version kommt vom Server, nicht vom Client: Sonst könnte ein
    // manipulierter Aufruf eine Zustimmung zu einem anderen Text behaupten.
    consent_version: EINWILLIGUNG_VERSION,
    talent_pool_consent: false,

    event_id: eventId,
  };

  const gespeichert = await speichereLead(datensatz);
  if (!gespeichert.ok) {
    return fehler(ALLGEMEINER_FEHLER, 500);
  }

  // Ab hier gilt der Lead als angenommen. Alles Weitere darf schiefgehen,
  // ohne dass die bewerbende Person davon etwas merkt.
  if (!gespeichert.duplikat) {
    await benachrichtigeUndSynchronisiere(config, datensatz, gespeichert.id);
  }

  return NextResponse.json({ ok: true, event_id: eventId });
}

async function benachrichtigeUndSynchronisiere(
  config: Parameters<typeof sendeBenachrichtigung>[0],
  datensatz: LeadDatensatz,
  leadId: string,
): Promise<void> {
  const mail = await sendeBenachrichtigung(config, datensatz, leadId);
  await aktualisiereStatus(leadId, {
    notification_status: mail.ok ? "sent" : "failed",
    notification_error: mail.ok ? null : (mail.grund ?? "fehler"),
  });

  if (!mail.ok) {
    console.error("[recruiting-lead] Benachrichtigung fehlgeschlagen", {
      leadId,
      grund: mail.grund,
    });
  }

  if (!salesforceAktiv()) {
    await aktualisiereStatus(leadId, { salesforce_sync_status: "disabled" });
    return;
  }

  const sf = await synchronisiereLead(datensatz, config.position);
  await aktualisiereStatus(leadId, {
    salesforce_id: sf.ok ? sf.id : null,
    salesforce_sync_status: sf.ok ? "synced" : "failed",
    salesforce_error: sf.ok ? null : (sf.meldung?.slice(0, 500) ?? sf.grund),
  });

  if (!sf.ok) {
    console.error("[recruiting-lead] Salesforce-Abgleich fehlgeschlagen", {
      leadId,
      grund: sf.grund,
    });
  }
}
