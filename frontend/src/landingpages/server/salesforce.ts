import "server-only";

// Salesforce-Anbindung für Recruiting-Leads.
//
// Stand 23.08.2026 gibt es in diesem Repository keine Salesforce-Integration.
// Diese Datei ist deshalb ein vorbereiteter Adapter, kein fertiger Anschluss:
//
// - Standardmäßig abgeschaltet (`SALESFORCE_SYNC_ENABLED` ungleich "true").
// - Ein Fehler hier darf die Speicherung in Supabase nie verhindern. Der
//   Aufrufer ruft diese Funktion erst NACH dem erfolgreichen Insert auf und
//   vermerkt das Ergebnis am Datensatz.
// - Die Feldzuordnung steht in `FELD_ZUORDNUNG` und ist bewusst als
//   Konfiguration ausgeführt. Die Standard-Lead-Felder von Salesforce sind
//   belegt; alles Recruiting-Spezifische braucht benutzerdefinierte Felder,
//   deren tatsächliche API-Namen aus der PHE-Instanz kommen müssen.
//
// > [OFFEN] Die API-Namen der benutzerdefinierten Felder (unten mit __c
// > markiert) sind nicht verifiziert. Vor dem Scharfschalten in Salesforce
// > unter Setup → Objekt-Manager → Lead → Felder abgleichen.

import type { LeadDatensatz } from "./lead-speicher";

export type SalesforceErgebnis =
  | { ok: true; id: string }
  | { ok: false; grund: "deaktiviert" | "nicht_konfiguriert" | "fehler"; meldung?: string };

/**
 * Zuordnung unserer Felder auf Salesforce-Feldnamen.
 * Links unser Feld, rechts der API-Name in Salesforce.
 */
export const FELD_ZUORDNUNG: Record<string, string> = {
  first_name: "FirstName",
  last_name: "LastName",
  email: "Email",
  phone: "Phone",
  postal_code: "PostalCode",
  current_job_title: "Title",
  job_title: "Recruiting_Position__c",
  job_slug: "Recruiting_Kampagne__c",
  qualification: "Recruiting_Qualifikation__c",
  experience_level: "Recruiting_Berufserfahrung__c",
  location_match: "Recruiting_Wohnort_Passend__c",
  driving_license: "Recruiting_Fuehrerschein__c",
  preferred_contact_time: "Recruiting_Kontaktzeit__c",
  utm_campaign: "Recruiting_UTM_Campaign__c",
  utm_source: "Recruiting_UTM_Source__c",
  ad_id: "Recruiting_Ad_Id__c",
};

export function salesforceAktiv(): boolean {
  return process.env.SALESFORCE_SYNC_ENABLED?.trim() === "true";
}

type Zugangsdaten = {
  instanzUrl: string;
  clientId: string;
  clientSecret: string;
  apiVersion: string;
};

function leseZugangsdaten(): Zugangsdaten | null {
  const instanzUrl = process.env.SALESFORCE_INSTANCE_URL?.trim();
  const clientId = process.env.SALESFORCE_CLIENT_ID?.trim();
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET?.trim();
  if (!instanzUrl || !clientId || !clientSecret) return null;

  return {
    instanzUrl: instanzUrl.replace(/\/+$/, ""),
    clientId,
    clientSecret,
    apiVersion: process.env.SALESFORCE_API_VERSION?.trim() || "v62.0",
  };
}

/**
 * OAuth 2.0 Client Credentials Flow. Setzt voraus, dass die Connected App in
 * Salesforce dafür freigeschaltet und einem Integrationsnutzer zugeordnet ist.
 */
async function holeToken(zugang: Zugangsdaten): Promise<string | null> {
  const antwort = await fetch(`${zugang.instanzUrl}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: zugang.clientId,
      client_secret: zugang.clientSecret,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!antwort.ok) return null;
  const daten = (await antwort.json()) as { access_token?: string };
  return daten.access_token ?? null;
}

/**
 * Sucht einen bestehenden Lead über E-Mail oder Telefonnummer.
 * Verhindert, dass dieselbe Person bei mehreren Anzeigen doppelt anlegt wird.
 */
async function findeDublette(
  zugang: Zugangsdaten,
  token: string,
  lead: LeadDatensatz,
): Promise<string | null> {
  // SOQL-Zeichenkette: einfache Anführungszeichen und Backslashes maskieren
  const q = (wert: string) => wert.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  const soql =
    `SELECT Id FROM Lead WHERE Email = '${q(lead.email)}' ` +
    `OR Phone = '${q(lead.phone_normalized)}' LIMIT 1`;

  const antwort = await fetch(
    `${zugang.instanzUrl}/services/data/${zugang.apiVersion}/query?q=${encodeURIComponent(soql)}`,
    { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) },
  );

  if (!antwort.ok) return null;
  const daten = (await antwort.json()) as { records?: { Id: string }[] };
  return daten.records?.[0]?.Id ?? null;
}

function baueNutzlast(lead: LeadDatensatz, jobTitel: string): Record<string, unknown> {
  const quelle: Record<string, unknown> = {
    ...lead,
    job_title: jobTitel,
    phone: lead.phone_normalized,
  };

  const nutzlast: Record<string, unknown> = {};
  for (const [unser, ihres] of Object.entries(FELD_ZUORDNUNG)) {
    const wert = quelle[unser];
    if (wert !== null && wert !== undefined && wert !== "") {
      nutzlast[ihres] = wert;
    }
  }

  // Company ist bei Salesforce-Leads ein Pflichtfeld. Bewerber haben keine
  // Firma im Sinne des Objekts — der Wert markiert die Herkunft.
  nutzlast.Company = "Bewerbung über Recruiting-Landingpage";
  nutzlast.LeadSource = "Meta Ads";

  return nutzlast;
}

export async function synchronisiereLead(
  lead: LeadDatensatz,
  jobTitel: string,
): Promise<SalesforceErgebnis> {
  if (!salesforceAktiv()) return { ok: false, grund: "deaktiviert" };

  const zugang = leseZugangsdaten();
  if (!zugang) return { ok: false, grund: "nicht_konfiguriert" };

  try {
    const token = await holeToken(zugang);
    if (!token) {
      return { ok: false, grund: "fehler", meldung: "Anmeldung an Salesforce fehlgeschlagen" };
    }

    const vorhandeneId = await findeDublette(zugang, token, lead);
    const nutzlast = baueNutzlast(lead, jobTitel);

    const url = vorhandeneId
      ? `${zugang.instanzUrl}/services/data/${zugang.apiVersion}/sobjects/Lead/${vorhandeneId}`
      : `${zugang.instanzUrl}/services/data/${zugang.apiVersion}/sobjects/Lead`;

    const antwort = await fetch(url, {
      method: vorhandeneId ? "PATCH" : "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(nutzlast),
      signal: AbortSignal.timeout(10000),
    });

    // PATCH auf einen bestehenden Datensatz antwortet mit 204 ohne Inhalt
    if (vorhandeneId && antwort.status === 204) {
      return { ok: true, id: vorhandeneId };
    }

    if (!antwort.ok) {
      const text = await antwort.text().catch(() => "");
      return {
        ok: false,
        grund: "fehler",
        meldung: `HTTP ${antwort.status}: ${text.slice(0, 300)}`,
      };
    }

    const daten = (await antwort.json()) as { id?: string };
    if (!daten.id) {
      return { ok: false, grund: "fehler", meldung: "Salesforce lieferte keine Datensatz-ID" };
    }

    return { ok: true, id: daten.id };
  } catch (err) {
    return {
      ok: false,
      grund: "fehler",
      meldung: err instanceof Error ? err.message : "unbekannt",
    };
  }
}
