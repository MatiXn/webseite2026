import { describe, it, expect } from "vitest";
import {
  leseKampagnenParameter,
  filtereKampagnenParameter,
  KAMPAGNEN_PARAMETER,
} from "../kampagnen-parameter";

// So sieht eine typische Ziel-URL aus einer Meta-Anzeige aus.
const META_QUERY =
  "?utm_source=facebook&utm_medium=paid_social&utm_campaign=kaelte_koeln_q3" +
  "&utm_content=video_a&fbclid=IwAR0abcdef&campaign_id=120210&adset_id=120211&ad_id=120212";

describe("Kampagnenparameter aus der URL", () => {
  it("liest alle Parameter einer Meta-Anzeige", () => {
    const p = leseKampagnenParameter(META_QUERY);

    expect(p.utm_source).toBe("facebook");
    expect(p.utm_medium).toBe("paid_social");
    expect(p.utm_campaign).toBe("kaelte_koeln_q3");
    expect(p.utm_content).toBe("video_a");
    expect(p.fbclid).toBe("IwAR0abcdef");
    expect(p.campaign_id).toBe("120210");
    expect(p.adset_id).toBe("120211");
    expect(p.ad_id).toBe("120212");
  });

  it("kommt mit einer URL ganz ohne Parameter zurecht", () => {
    expect(leseKampagnenParameter("")).toEqual({});
    expect(leseKampagnenParameter("?")).toEqual({});
  });

  it("übernimmt nur bekannte Parameter", () => {
    const p = leseKampagnenParameter("?utm_source=facebook&redirect=https://fremd.example");
    expect(p.utm_source).toBe("facebook");
    expect(p).not.toHaveProperty("redirect");
  });

  it("lässt leere Werte weg", () => {
    expect(leseKampagnenParameter("?utm_source=&utm_campaign=aktiv")).toEqual({
      utm_campaign: "aktiv",
    });
  });

  it("verwirft überlange Werte, statt sie halb zu speichern", () => {
    const p = leseKampagnenParameter(`?utm_campaign=${"x".repeat(400)}`);
    expect(p.utm_campaign).toBeUndefined();
  });
});

describe("Serverseitige Filterung", () => {
  it("nimmt genau die erlaubten Parameter aus dem Anfragerumpf", () => {
    const p = filtereKampagnenParameter({
      utm_source: "instagram",
      ad_id: "120212",
      // Diese dürfen niemals durchkommen:
      consent_version: "gefälscht",
      lead_status: "placed",
      salesforce_id: "00Q000000000000",
      event_id: "beliebig",
    });

    expect(p).toEqual({ utm_source: "instagram", ad_id: "120212" });
  });

  it("ignoriert Werte, die keine Zeichenketten sind", () => {
    const p = filtereKampagnenParameter({
      utm_source: { toString: () => "böse" },
      utm_campaign: 42,
      ad_id: ["a", "b"],
      utm_medium: "paid_social",
    });

    expect(p).toEqual({ utm_medium: "paid_social" });
  });

  it("kommt mit unbrauchbarer Eingabe zurecht", () => {
    expect(filtereKampagnenParameter(null)).toEqual({});
    expect(filtereKampagnenParameter("text")).toEqual({});
    expect(filtereKampagnenParameter(undefined)).toEqual({});
  });

  it("kennt dieselben Parameter wie das Lesen aus der URL", () => {
    const eingabe = Object.fromEntries(KAMPAGNEN_PARAMETER.map((n) => [n, `wert-${n}`]));
    expect(Object.keys(filtereKampagnenParameter(eingabe)).sort()).toEqual(
      [...KAMPAGNEN_PARAMETER].sort(),
    );
  });
});
