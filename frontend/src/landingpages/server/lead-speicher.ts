import "server-only";

// Speicherung der Recruiting-Leads in Supabase.
//
// Bewusst eigene Umgebungsvariablen statt der vorhandenen
// NEXT_PUBLIC_SUPABASE_*: Die Leads liegen in einer eigenen Datenbank, und der
// Service-Role-Key darf niemals denselben Namensraum wie eine öffentliche
// Variable teilen. `server-only` sorgt dafür, dass ein versehentlicher Import
// in eine Client-Komponente den Build bricht statt den Schlüssel auszuliefern.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const TABELLE = "recruiting_leads";

export type LeadDatensatz = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone_normalized: string;
  postal_code: string | null;
  current_job_title: string | null;
  preferred_contact_time: string | null;

  qualification: string | null;
  experience_level: string | null;
  location_match: string | null;
  driving_license: string | null;
  job_preferences: string[];
  answers: Record<string, unknown>;

  job_slug: string;
  job_title: string;

  campaign_source: string | null;
  campaign_name: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  fbclid: string | null;
  landing_page_url: string | null;
  referrer: string | null;

  consent_given: boolean;
  consent_timestamp: string;
  consent_version: string;
  talent_pool_consent: boolean;

  event_id: string;
};

export type SpeicherErgebnis =
  | { ok: true; id: string; duplikat: boolean }
  | { ok: false; grund: "nicht_konfiguriert" | "fehler" };

let client: SupabaseClient | null = null;

/** Gibt `null` zurück, solange die Zugangsdaten fehlen. */
function holeClient(): SupabaseClient | null {
  const url = process.env.RECRUITING_SUPABASE_URL?.trim();
  const key = process.env.RECRUITING_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function speicherIstKonfiguriert(): boolean {
  return holeClient() !== null;
}

/**
 * Legt einen Lead an.
 *
 * Doppelte Übermittlungen: Die Migration legt einen eindeutigen Index über
 * (job_slug, email) an. Ein zweiter Versuch derselben Person zur selben Stelle
 * wird deshalb nicht als Fehler behandelt — für die bewerbende Person ist das
 * ein Erfolg, und ein doppelter Datensatz hilft niemandem.
 */
export async function speichereLead(datensatz: LeadDatensatz): Promise<SpeicherErgebnis> {
  const supabase = holeClient();
  if (!supabase) return { ok: false, grund: "nicht_konfiguriert" };

  const { data, error } = await supabase
    .from(TABELLE)
    .insert(datensatz)
    .select("id")
    .single();

  if (!error && data) {
    return { ok: true, id: data.id as string, duplikat: false };
  }

  // 23505 = unique_violation → derselbe Mensch, dieselbe Stelle
  if (error?.code === "23505") {
    const { data: vorhanden } = await supabase
      .from(TABELLE)
      .select("id")
      .eq("job_slug", datensatz.job_slug)
      .eq("email", datensatz.email)
      .maybeSingle();

    if (vorhanden) {
      return { ok: true, id: vorhanden.id as string, duplikat: true };
    }
  }

  // Bewusst ohne Datensatzinhalt: In Logs gehören keine Bewerberdaten.
  console.error("[recruiting-lead] Speichern fehlgeschlagen", {
    code: error?.code,
    message: error?.message,
  });

  return { ok: false, grund: "fehler" };
}

/** Vermerkt das Ergebnis eines Folgeschritts (E-Mail, Salesforce). */
export async function aktualisiereStatus(
  id: string,
  felder: Partial<{
    notification_status: string;
    notification_error: string | null;
    salesforce_id: string | null;
    salesforce_sync_status: string;
    salesforce_error: string | null;
  }>,
): Promise<void> {
  const supabase = holeClient();
  if (!supabase) return;

  const { error } = await supabase
    .from(TABELLE)
    .update({ ...felder, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[recruiting-lead] Status konnte nicht aktualisiert werden", {
      code: error.code,
    });
  }
}
