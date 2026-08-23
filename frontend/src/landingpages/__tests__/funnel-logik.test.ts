import { describe, it, expect } from "vitest";
import {
  istGueltigeEmail,
  istGueltigeTelefonnummer,
  istGueltigePlz,
  normalisiereTelefonnummer,
  pruefeKontaktdaten,
  schrittIstBeantwortet,
  schalteMehrfachauswahl,
  pruefeAntwortenGegenConfig,
  LEERE_KONTAKTDATEN,
} from "../funnel-logik";
import { kaeltetechnikerKoeln } from "../kampagnen/kaeltetechniker-koeln";

const GUELTIGER_KONTAKT = {
  first_name: "Thomas",
  last_name: "Berger",
  phone: "0173 9980100",
  email: "thomas.berger@example.de",
  preferred_contact_time: "",
  current_job_title: "",
};

/** Alle Auswahlfragen der Kampagne korrekt beantwortet. */
const VOLLSTAENDIGE_ANTWORTEN = {
  qualification: "kaeltetechnik",
  experience_level: "2_bis_5",
  location_match: "ja",
  postal_code: "50667",
  driving_license: "ja",
  job_preferences: ["gehalt", "dienstwagen"],
};

describe("E-Mail-Prüfung", () => {
  it("nimmt übliche Adressen an", () => {
    expect(istGueltigeEmail("thomas.berger@example.de")).toBe(true);
    expect(istGueltigeEmail("t.berger+job@firma.co.uk")).toBe(true);
  });

  it("weist unvollständige Adressen ab", () => {
    expect(istGueltigeEmail("thomas.berger")).toBe(false);
    expect(istGueltigeEmail("thomas@")).toBe(false);
    expect(istGueltigeEmail("@example.de")).toBe(false);
    expect(istGueltigeEmail("thomas@example")).toBe(false);
    expect(istGueltigeEmail("thomas berger@example.de")).toBe(false);
    expect(istGueltigeEmail("")).toBe(false);
  });

  it("weist überlange Adressen ab", () => {
    expect(istGueltigeEmail(`${"a".repeat(250)}@example.de`)).toBe(false);
  });
});

describe("Telefonnummern-Prüfung", () => {
  it("nimmt deutsche Schreibweisen an", () => {
    for (const nummer of [
      "0173 9980100",
      "+49 173 9980100",
      "0049 173 9980100",
      "0211/1586310",
      "0211-158 63 100",
      "(0211) 1586310",
    ]) {
      expect(istGueltigeTelefonnummer(nummer), nummer).toBe(true);
    }
  });

  it("weist leere und unvollständige Nummern ab", () => {
    for (const nummer of ["", "   ", "12345", "0173", "abcdefghij", "+1 555 0100"]) {
      expect(istGueltigeTelefonnummer(nummer), nummer).toBe(false);
    }
  });

  it("führt Schreibweisen für den Dublettenabgleich zusammen", () => {
    const erwartet = "01739980100";
    expect(normalisiereTelefonnummer("0173 9980100")).toBe(erwartet);
    expect(normalisiereTelefonnummer("+49 173 9980100")).toBe(erwartet);
    expect(normalisiereTelefonnummer("0049-173-9980100")).toBe(erwartet);
  });
});

describe("Postleitzahl", () => {
  it("lässt das Feld leer zu, weil es optional ist", () => {
    expect(istGueltigePlz("")).toBe(true);
  });

  it("verlangt genau fünf Ziffern", () => {
    expect(istGueltigePlz("50667")).toBe(true);
    expect(istGueltigePlz("5066")).toBe(false);
    expect(istGueltigePlz("506677")).toBe(false);
    expect(istGueltigePlz("5066a")).toBe(false);
  });
});

describe("Pflichtfelder im Kontaktschritt", () => {
  it("meldet jedes leere Pflichtfeld", () => {
    const fehler = pruefeKontaktdaten(LEERE_KONTAKTDATEN);
    expect(Object.keys(fehler).sort()).toEqual([
      "email",
      "first_name",
      "last_name",
      "phone",
    ]);
  });

  it("nimmt vollständige Angaben ohne Beanstandung an", () => {
    expect(pruefeKontaktdaten(GUELTIGER_KONTAKT)).toEqual({});
  });

  it("weist eine ungültige E-Mail-Adresse ab", () => {
    const fehler = pruefeKontaktdaten({ ...GUELTIGER_KONTAKT, email: "keine-adresse" });
    expect(fehler.email).toBeTruthy();
    expect(fehler.phone).toBeUndefined();
  });

  it("weist eine leere Telefonnummer ab", () => {
    const fehler = pruefeKontaktdaten({ ...GUELTIGER_KONTAKT, phone: "" });
    expect(fehler.phone).toBeTruthy();
  });

  it("weist eine unvollständige Telefonnummer ab", () => {
    const fehler = pruefeKontaktdaten({ ...GUELTIGER_KONTAKT, phone: "0173" });
    expect(fehler.phone).toBeTruthy();
  });

  it("beanstandet einen einzelnen Buchstaben als Namen", () => {
    const fehler = pruefeKontaktdaten({ ...GUELTIGER_KONTAKT, first_name: "T" });
    expect(fehler.first_name).toBeTruthy();
  });
});

describe("Schrittfortschritt", () => {
  const einzel = kaeltetechnikerKoeln.funnel.schritte[0];
  const mehrfach = kaeltetechnikerKoeln.funnel.schritte[4];

  it("lässt eine unbeantwortete Einzelauswahl nicht weiter", () => {
    expect(schrittIstBeantwortet(einzel, {})).toBe(false);
  });

  it("lässt nach der Auswahl weiter", () => {
    expect(schrittIstBeantwortet(einzel, { qualification: "kaeltetechnik" })).toBe(true);
  });

  it("erlaubt das Überspringen der Mehrfachauswahl, weil sie freiwillig ist", () => {
    expect(schrittIstBeantwortet(mehrfach, {})).toBe(true);
  });

  it("schaltet Mehrfachauswahl an und wieder aus", () => {
    expect(schalteMehrfachauswahl(undefined, "gehalt")).toEqual(["gehalt"]);
    expect(schalteMehrfachauswahl(["gehalt"], "dienstwagen")).toEqual([
      "gehalt",
      "dienstwagen",
    ]);
    expect(schalteMehrfachauswahl(["gehalt", "dienstwagen"], "gehalt")).toEqual([
      "dienstwagen",
    ]);
  });
});

describe("Serverprüfung gegen die Kampagnen-Konfiguration", () => {
  it("nimmt vollständige, gültige Antworten an", () => {
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, VOLLSTAENDIGE_ANTWORTEN);
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.antworten.qualification).toBe("kaeltetechnik");
      expect(ergebnis.antworten.postal_code).toBe("50667");
    }
  });

  it("weist einen erfundenen Antwortwert ab", () => {
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, {
      ...VOLLSTAENDIGE_ANTWORTEN,
      qualification: "professor",
    });
    expect(ergebnis.ok).toBe(false);
  });

  it("übernimmt keine Felder, die in der Kampagne nicht vorkommen", () => {
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, {
      ...VOLLSTAENDIGE_ANTWORTEN,
      lead_status: "placed",
      salesforce_id: "00Q000000000000",
      consent_version: "gefälscht",
    });

    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.antworten).not.toHaveProperty("lead_status");
      expect(ergebnis.antworten).not.toHaveProperty("salesforce_id");
      expect(ergebnis.antworten).not.toHaveProperty("consent_version");
    }
  });

  it("weist eine unvollständig beantwortete Pflichtfrage ab", () => {
    const { driving_license, ...unvollstaendig } = VOLLSTAENDIGE_ANTWORTEN;
    void driving_license;
    expect(pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, unvollstaendig).ok).toBe(false);
  });

  it("weist einen ungültigen Wert in der Mehrfachauswahl ab", () => {
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, {
      ...VOLLSTAENDIGE_ANTWORTEN,
      job_preferences: ["gehalt", "dienstwagen_mit_fahrer"],
    });
    expect(ergebnis.ok).toBe(false);
  });

  it("entfernt Wiederholungen in der Mehrfachauswahl", () => {
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, {
      ...VOLLSTAENDIGE_ANTWORTEN,
      job_preferences: ["gehalt", "gehalt", "gehalt", "dienstwagen"],
    });
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.antworten.job_preferences).toEqual(["gehalt", "dienstwagen"]);
    }
  });

  it("weist eine unplausible Postleitzahl ab", () => {
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, {
      ...VOLLSTAENDIGE_ANTWORTEN,
      postal_code: "123",
    });
    expect(ergebnis.ok).toBe(false);
  });

  it("lässt die optionale Postleitzahl weg, wenn sie nicht angegeben wurde", () => {
    const { postal_code, ...ohnePlz } = VOLLSTAENDIGE_ANTWORTEN;
    void postal_code;
    const ergebnis = pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, ohnePlz);
    expect(ergebnis.ok).toBe(true);
    if (ergebnis.ok) {
      expect(ergebnis.antworten).not.toHaveProperty("postal_code");
    }
  });

  it("weist einen leeren Rumpf ab", () => {
    expect(pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, null).ok).toBe(false);
    expect(pruefeAntwortenGegenConfig(kaeltetechnikerKoeln, "text").ok).toBe(false);
  });
});
