// Regeln des mehrstufigen Funnels — bewusst ohne React und ohne DOM.
//
// Dieselben Funktionen laufen im Browser (sofortige Rückmeldung beim Tippen)
// und im Route Handler (verbindliche Prüfung). Damit kann die Prüfung nicht
// auseinanderlaufen, und sie ist ohne Browser-Testumgebung prüfbar.

import type { FunnelSchritt, LandingpageConfig } from "./typen";

/** Antworten auf die Auswahlfragen: Feldname → Wert bzw. Werte. */
export type Antworten = Record<string, string | string[]>;

export type Kontaktdaten = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  preferred_contact_time: string;
  current_job_title: string;
};

export const LEERE_KONTAKTDATEN: Kontaktdaten = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  preferred_contact_time: "",
  current_job_title: "",
};

/** Längengrenzen — gelten im Browser und auf dem Server. */
export const FELD_GRENZEN = {
  first_name: 80,
  last_name: 80,
  phone: 40,
  email: 254,
  preferred_contact_time: 60,
  current_job_title: 120,
  postal_code: 5,
} as const;

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Telefonnummern: deutsche Schreibweisen mit und ohne Ländervorwahl, dazu
 * Leerzeichen, Bindestriche, Schrägstriche und Klammern. Bewusst großzügig —
 * eine abgewiesene echte Nummer kostet mehr als eine unsaubere in der Liste.
 */
export function istGueltigeTelefonnummer(eingabe: string): boolean {
  const bereinigt = eingabe.replace(/[\s\-/().]/g, "");
  return /^(\+49|0049|0)[1-9]\d{6,14}$/.test(bereinigt);
}

export function istGueltigeEmail(eingabe: string): boolean {
  return eingabe.length <= FELD_GRENZEN.email && EMAIL_MUSTER.test(eingabe);
}

/** Deutsche Postleitzahl; leer ist zulässig, weil das Feld optional ist. */
export function istGueltigePlz(eingabe: string): boolean {
  return eingabe === "" || /^\d{5}$/.test(eingabe);
}

/** Normalisiert eine Telefonnummer für den Dublettenabgleich. */
export function normalisiereTelefonnummer(eingabe: string): string {
  const bereinigt = eingabe.replace(/[\s\-/().]/g, "");
  if (bereinigt.startsWith("+49")) return `0${bereinigt.slice(3)}`;
  if (bereinigt.startsWith("0049")) return `0${bereinigt.slice(4)}`;
  return bereinigt;
}

export type Feldfehler = Partial<Record<keyof Kontaktdaten | "postal_code" | "einwilligung", string>>;

/** Prüft die Kontaktdaten. Ein leeres Ergebnis bedeutet: alles in Ordnung. */
export function pruefeKontaktdaten(daten: Kontaktdaten): Feldfehler {
  const fehler: Feldfehler = {};

  if (daten.first_name.trim().length < 2) {
    fehler.first_name = "Bitte gib deinen Vornamen an.";
  } else if (daten.first_name.length > FELD_GRENZEN.first_name) {
    fehler.first_name = "Der Vorname ist zu lang.";
  }

  if (daten.last_name.trim().length < 2) {
    fehler.last_name = "Bitte gib deinen Nachnamen an.";
  } else if (daten.last_name.length > FELD_GRENZEN.last_name) {
    fehler.last_name = "Der Nachname ist zu lang.";
  }

  if (!daten.phone.trim()) {
    fehler.phone = "Bitte gib deine Telefonnummer an.";
  } else if (!istGueltigeTelefonnummer(daten.phone)) {
    fehler.phone = "Diese Telefonnummer sieht nicht vollständig aus. Beispiel: 0173 9980100";
  }

  if (!daten.email.trim()) {
    fehler.email = "Bitte gib deine E-Mail-Adresse an.";
  } else if (!istGueltigeEmail(daten.email.trim())) {
    fehler.email = "Diese E-Mail-Adresse scheint einen Tippfehler zu enthalten.";
  }

  if (daten.preferred_contact_time.length > FELD_GRENZEN.preferred_contact_time) {
    fehler.preferred_contact_time = "Bitte kürzer fassen.";
  }

  if (daten.current_job_title.length > FELD_GRENZEN.current_job_title) {
    fehler.current_job_title = "Bitte kürzer fassen.";
  }

  return fehler;
}

/**
 * Kann von diesem Schritt aus weitergegangen werden?
 * Der Kontaktschritt wird hier nicht behandelt — er wird abgeschickt, nicht
 * weitergeblättert, und dafür ist `pruefeKontaktdaten` zuständig.
 */
export function schrittIstBeantwortet(
  schritt: FunnelSchritt,
  antworten: Antworten,
): boolean {
  if (schritt.art === "einzelauswahl") {
    return typeof antworten[schritt.feld] === "string" && antworten[schritt.feld] !== "";
  }
  if (schritt.art === "mehrfachauswahl") {
    const wert = antworten[schritt.feld];
    const anzahl = Array.isArray(wert) ? wert.length : 0;
    return anzahl >= schritt.minAuswahl;
  }
  return true;
}

/** Schaltet einen Wert in einer Mehrfachauswahl an oder aus. */
export function schalteMehrfachauswahl(bisher: string[] | undefined, wert: string): string[] {
  const liste = bisher ?? [];
  return liste.includes(wert) ? liste.filter((w) => w !== wert) : [...liste, wert];
}

/**
 * Prüft eine eingehende Antwort gegen die Konfiguration.
 * Kernstück der Server-Prüfung: Nur Felder und Werte, die in der Kampagne
 * definiert sind, dürfen gespeichert werden. Ein manipulierter Client kann so
 * weder fremde Spalten beschreiben noch beliebige Werte einschleusen.
 */
export function pruefeAntwortenGegenConfig(
  config: LandingpageConfig,
  eingabe: unknown,
): { ok: true; antworten: Antworten } | { ok: false; fehler: string } {
  if (typeof eingabe !== "object" || eingabe === null) {
    return { ok: false, fehler: "Antworten fehlen." };
  }

  const quelle = eingabe as Record<string, unknown>;
  const antworten: Antworten = {};

  for (const schritt of config.funnel.schritte) {
    if (schritt.art === "kontakt") continue;

    const erlaubteWerte = schritt.optionen.map((o) => o.wert);
    const roh = quelle[schritt.feld];

    if (schritt.art === "einzelauswahl") {
      if (roh === undefined || roh === "") {
        return { ok: false, fehler: `Bitte beantworte alle Fragen.` };
      }
      if (typeof roh !== "string" || !erlaubteWerte.includes(roh)) {
        return { ok: false, fehler: `Ungültige Antwort auf eine Frage.` };
      }
      antworten[schritt.feld] = roh;

      if (schritt.zusatzfeld) {
        const zusatz = quelle[schritt.zusatzfeld.feld];
        if (typeof zusatz === "string" && zusatz.trim()) {
          const wert = zusatz.trim();
          if (wert.length > schritt.zusatzfeld.maxLaenge) {
            return { ok: false, fehler: "Eine Eingabe ist zu lang." };
          }
          if (schritt.zusatzfeld.art === "plz" && !istGueltigePlz(wert)) {
            return { ok: false, fehler: "Die Postleitzahl muss aus fünf Ziffern bestehen." };
          }
          antworten[schritt.zusatzfeld.feld] = wert;
        }
      }
      continue;
    }

    // Mehrfachauswahl
    const liste = Array.isArray(roh) ? roh : [];
    if (liste.length < schritt.minAuswahl) {
      return { ok: false, fehler: "Bitte beantworte alle Fragen." };
    }
    if (liste.some((w) => typeof w !== "string" || !erlaubteWerte.includes(w))) {
      return { ok: false, fehler: "Ungültige Antwort auf eine Frage." };
    }
    // Duplikate entfernen — ein manipulierter Client könnte sonst dieselbe
    // Auswahl hundertfach schicken.
    antworten[schritt.feld] = [...new Set(liste as string[])];
  }

  return { ok: true, antworten };
}
