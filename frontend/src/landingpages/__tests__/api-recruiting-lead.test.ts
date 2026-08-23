import { describe, it, expect, vi, beforeEach } from "vitest";

// Alle Nebenwirkungen werden ersetzt: Der Test prüft das Zusammenspiel,
// nicht Supabase, Resend oder Salesforce selbst.

const speichereLead = vi.fn();
const aktualisiereStatus = vi.fn();
const speicherIstKonfiguriert = vi.fn(() => true);

vi.mock("../server/lead-speicher", () => ({
  speichereLead: (...a: unknown[]) => speichereLead(...a),
  aktualisiereStatus: (...a: unknown[]) => aktualisiereStatus(...a),
  speicherIstKonfiguriert: () => speicherIstKonfiguriert(),
}));

const sendeBenachrichtigung = vi.fn();
vi.mock("../server/lead-mail", () => ({
  sendeBenachrichtigung: (...a: unknown[]) => sendeBenachrichtigung(...a),
}));

const synchronisiereLead = vi.fn();
const salesforceAktiv = vi.fn(() => false);
vi.mock("../server/salesforce", () => ({
  synchronisiereLead: (...a: unknown[]) => synchronisiereLead(...a),
  salesforceAktiv: () => salesforceAktiv(),
}));

// Das In-Memory-Rate-Limit ist über alle Tests hinweg dasselbe Modul.
// Für die Fachtests wird es abgeschaltet und nur im eigenen Block geprüft.
const rateLimit = vi.fn<(...args: unknown[]) => boolean>(() => true);
vi.mock("../../lib/contact-validation", async (original) => {
  const echt = await original<typeof import("../../lib/contact-validation")>();
  return { ...echt, rateLimit: (...a: unknown[]) => rateLimit(...a) };
});

import { POST } from "../../app/api/recruiting-lead/route";
import { EINWILLIGUNG_VERSION } from "../einwilligung";

const GUELTIGE_ANFRAGE = {
  kampagne: "kaeltetechniker-koeln",
  antworten: {
    qualification: "kaeltetechnik",
    experience_level: "2_bis_5",
    location_match: "ja",
    postal_code: "50667",
    driving_license: "ja",
    job_preferences: ["gehalt", "dienstwagen"],
  },
  kontakt: {
    first_name: "Thomas",
    last_name: "Berger",
    phone: "0173 9980100",
    email: "Thomas.Berger@Example.de",
    preferred_contact_time: "vormittags",
    current_job_title: "Servicetechniker",
  },
  einwilligung: true,
  einwilligung_version: EINWILLIGUNG_VERSION,
  website: "",
  landing_page_url: "https://www.phe-perm.de/stellen/kaeltetechniker-koeln?utm_source=facebook",
  referrer: "https://l.facebook.com/",
  utm_source: "facebook",
  utm_medium: "paid_social",
  utm_campaign: "kaelte_koeln_q3",
  fbclid: "IwAR0abc",
  ad_id: "120212",
};

function anfrage(rumpf: unknown) {
  return new Request("https://www.phe-perm.de/api/recruiting-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.7" },
    body: JSON.stringify(rumpf),
    // Der Handler nutzt von NextRequest nur `json()` und `headers` — beides
    // bietet ein einfaches Request. Die Umwandlung ist deshalb unbedenklich.
  }) as unknown as import("next/server").NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  rateLimit.mockReturnValue(true);
  speicherIstKonfiguriert.mockReturnValue(true);
  salesforceAktiv.mockReturnValue(false);
  speichereLead.mockResolvedValue({ ok: true, id: "lead-1", duplikat: false });
  sendeBenachrichtigung.mockResolvedValue({ ok: true });
});

describe("Erfolgsfall", () => {
  it("speichert den Lead und meldet Erfolg", async () => {
    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));
    const daten = await antwort.json();

    expect(antwort.status).toBe(200);
    expect(daten.ok).toBe(true);
    expect(daten.event_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(speichereLead).toHaveBeenCalledTimes(1);
  });

  it("normalisiert E-Mail und Telefonnummer", async () => {
    await POST(anfrage(GUELTIGE_ANFRAGE));
    const datensatz = speichereLead.mock.calls[0][0];

    expect(datensatz.email).toBe("thomas.berger@example.de");
    expect(datensatz.phone).toBe("0173 9980100");
    expect(datensatz.phone_normalized).toBe("01739980100");
  });

  it("übernimmt die Kampagnenparameter", async () => {
    await POST(anfrage(GUELTIGE_ANFRAGE));
    const d = speichereLead.mock.calls[0][0];

    expect(d.utm_source).toBe("facebook");
    expect(d.utm_medium).toBe("paid_social");
    expect(d.utm_campaign).toBe("kaelte_koeln_q3");
    expect(d.fbclid).toBe("IwAR0abc");
    expect(d.ad_id).toBe("120212");
    // Ohne eigenen Wert werden UTM-Angaben als Kampagnenherkunft übernommen
    expect(d.campaign_source).toBe("facebook");
    expect(d.campaign_name).toBe("kaelte_koeln_q3");
    expect(d.referrer).toBe("https://l.facebook.com/");
  });

  it("hält Antworten sowohl in den Spalten als auch vollständig fest", async () => {
    await POST(anfrage(GUELTIGE_ANFRAGE));
    const d = speichereLead.mock.calls[0][0];

    expect(d.qualification).toBe("kaeltetechnik");
    expect(d.experience_level).toBe("2_bis_5");
    expect(d.location_match).toBe("ja");
    expect(d.driving_license).toBe("ja");
    expect(d.postal_code).toBe("50667");
    expect(d.job_preferences).toEqual(["gehalt", "dienstwagen"]);
    expect(d.answers.qualification).toBe("kaeltetechnik");
  });

  it("hält Stelle und Einwilligung fest", async () => {
    await POST(anfrage(GUELTIGE_ANFRAGE));
    const d = speichereLead.mock.calls[0][0];

    expect(d.job_slug).toBe("kaeltetechniker-koeln");
    expect(d.job_title).toContain("Kältetechniker");
    expect(d.consent_given).toBe(true);
    expect(d.consent_version).toBe(EINWILLIGUNG_VERSION);
    expect(Date.parse(d.consent_timestamp)).not.toBeNaN();
    expect(d.talent_pool_consent).toBe(false);
  });

  it("setzt die Einwilligungsfassung serverseitig und glaubt dem Client nicht", async () => {
    await POST(anfrage({ ...GUELTIGE_ANFRAGE, einwilligung_version: "1999-01-01" }));
    expect(speichereLead.mock.calls[0][0].consent_version).toBe(EINWILLIGUNG_VERSION);
  });

  it("verwendet dieselbe Ereignis-ID im Datensatz wie in der Antwort", async () => {
    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));
    const daten = await antwort.json();
    expect(speichereLead.mock.calls[0][0].event_id).toBe(daten.event_id);
  });
});

describe("Abwehr", () => {
  it("erkennt den Honeypot und speichert nichts", async () => {
    const antwort = await POST(anfrage({ ...GUELTIGE_ANFRAGE, website: "http://spam.example" }));
    const daten = await antwort.json();

    // Nach außen Erfolg, damit das Skript die Abwehr nicht bemerkt
    expect(daten.ok).toBe(true);
    expect(speichereLead).not.toHaveBeenCalled();
    expect(sendeBenachrichtigung).not.toHaveBeenCalled();
  });

  it("greift bei zu vielen Anfragen", async () => {
    rateLimit.mockReturnValue(false);
    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));

    expect(antwort.status).toBe(429);
    expect(speichereLead).not.toHaveBeenCalled();
  });

  it("nimmt nur Felder an, die in der Kampagne definiert sind", async () => {
    await POST(
      anfrage({
        ...GUELTIGE_ANFRAGE,
        antworten: {
          ...GUELTIGE_ANFRAGE.antworten,
          lead_status: "placed",
          salesforce_id: "00Q000000000000",
        },
        lead_status: "placed",
        salesforce_id: "00Q000000000000",
        talent_pool_consent: true,
        consent_given: false,
      }),
    );

    const d = speichereLead.mock.calls[0][0];
    expect(d.lead_status).toBeUndefined();
    expect(d.salesforce_id).toBeUndefined();
    expect(d.talent_pool_consent).toBe(false);
    expect(d.consent_given).toBe(true);
    expect(d.answers).not.toHaveProperty("lead_status");
  });

  it("weist eine unbekannte Kampagne ab", async () => {
    const antwort = await POST(anfrage({ ...GUELTIGE_ANFRAGE, kampagne: "gibt-es-nicht" }));
    expect(antwort.status).toBe(404);
    expect(speichereLead).not.toHaveBeenCalled();
  });

  it("weist eine ungültige E-Mail-Adresse ab", async () => {
    const antwort = await POST(
      anfrage({ ...GUELTIGE_ANFRAGE, kontakt: { ...GUELTIGE_ANFRAGE.kontakt, email: "kaputt" } }),
    );
    expect(antwort.status).toBe(400);
    expect(speichereLead).not.toHaveBeenCalled();
  });

  it("weist eine leere Telefonnummer ab", async () => {
    const antwort = await POST(
      anfrage({ ...GUELTIGE_ANFRAGE, kontakt: { ...GUELTIGE_ANFRAGE.kontakt, phone: "" } }),
    );
    expect(antwort.status).toBe(400);
    expect(speichereLead).not.toHaveBeenCalled();
  });

  it("weist eine fehlende Einwilligung ab", async () => {
    const antwort = await POST(anfrage({ ...GUELTIGE_ANFRAGE, einwilligung: false }));
    expect(antwort.status).toBe(400);
    expect(speichereLead).not.toHaveBeenCalled();
  });

  it("weist einen erfundenen Antwortwert ab", async () => {
    const antwort = await POST(
      anfrage({
        ...GUELTIGE_ANFRAGE,
        antworten: { ...GUELTIGE_ANFRAGE.antworten, qualification: "professor" },
      }),
    );
    expect(antwort.status).toBe(400);
    expect(speichereLead).not.toHaveBeenCalled();
  });
});

describe("Fehler in nachgelagerten Schritten gefährden den Lead nicht", () => {
  it("meldet Erfolg, obwohl die Benachrichtigungsmail scheitert", async () => {
    sendeBenachrichtigung.mockResolvedValue({ ok: false, grund: "fehler", meldung: "SMTP" });

    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));
    const daten = await antwort.json();

    expect(daten.ok).toBe(true);
    expect(speichereLead).toHaveBeenCalledTimes(1);

    // Der Fehler wird am Datensatz vermerkt, damit er nachgeholt werden kann
    expect(aktualisiereStatus).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ notification_status: "failed" }),
    );
  });

  it("meldet Erfolg, obwohl der Salesforce-Abgleich scheitert", async () => {
    salesforceAktiv.mockReturnValue(true);
    synchronisiereLead.mockResolvedValue({ ok: false, grund: "fehler", meldung: "HTTP 401" });

    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));
    const daten = await antwort.json();

    expect(daten.ok).toBe(true);
    expect(speichereLead).toHaveBeenCalledTimes(1);
    expect(aktualisiereStatus).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ salesforce_sync_status: "failed" }),
    );
  });

  it("vermerkt den Salesforce-Abgleich als abgeschaltet, wenn das Flag aus ist", async () => {
    await POST(anfrage(GUELTIGE_ANFRAGE));

    expect(synchronisiereLead).not.toHaveBeenCalled();
    expect(aktualisiereStatus).toHaveBeenCalledWith("lead-1", {
      salesforce_sync_status: "disabled",
    });
  });

  it("vermerkt die erfolgreiche Salesforce-ID", async () => {
    salesforceAktiv.mockReturnValue(true);
    synchronisiereLead.mockResolvedValue({ ok: true, id: "00Q5g00000ABCDE" });

    await POST(anfrage(GUELTIGE_ANFRAGE));

    expect(aktualisiereStatus).toHaveBeenCalledWith(
      "lead-1",
      expect.objectContaining({ salesforce_id: "00Q5g00000ABCDE", salesforce_sync_status: "synced" }),
    );
  });
});

describe("Speicherung schlägt fehl", () => {
  it("meldet einen Fehler statt Erfolg, wenn der Datensatz nicht angelegt wurde", async () => {
    speichereLead.mockResolvedValue({ ok: false, grund: "fehler" });

    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));
    const daten = await antwort.json();

    expect(antwort.status).toBe(500);
    expect(daten.ok).toBe(false);
    // Ohne gespeicherten Lead darf auch niemand benachrichtigt werden
    expect(sendeBenachrichtigung).not.toHaveBeenCalled();
  });

  it("meldet einen Fehler, wenn die Zugangsdaten fehlen", async () => {
    speicherIstKonfiguriert.mockReturnValue(false);

    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));

    expect(antwort.status).toBe(503);
    expect(speichereLead).not.toHaveBeenCalled();
  });

  it("benachrichtigt bei einer doppelten Übermittlung kein zweites Mal", async () => {
    speichereLead.mockResolvedValue({ ok: true, id: "lead-1", duplikat: true });

    const antwort = await POST(anfrage(GUELTIGE_ANFRAGE));
    const daten = await antwort.json();

    // Für die bewerbende Person ist das ein Erfolg
    expect(daten.ok).toBe(true);
    expect(sendeBenachrichtigung).not.toHaveBeenCalled();
  });
});
