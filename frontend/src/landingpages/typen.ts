// Datenmodell einer Recruiting-Landingpage für Meta-Ads.
//
// Eine neue Landingpage entsteht ausschließlich durch eine neue Datei in
// `kampagnen/` plus einen Eintrag in `registry.ts`. Route, Funnel, API,
// Validierung, Speicherung, E-Mail und Tracking sind generisch und werden
// dafür nicht angefasst.
//
// Grundregel für den Inhalt: Es darf nur stehen, was der Kunde zugesagt hat.
// Keine Leistung ergänzen, die nicht ausdrücklich genannt wurde.

/** Eine Antwortmöglichkeit auf eine Funnel-Frage. */
export type Antwortoption = {
  /** Wird so in der Datenbank abgelegt — stabil halten, sonst brechen Auswertungen. */
  wert: string;
  /** Angezeigter Text. */
  label: string;
};

/** Optionales Freitextfeld unter einer Auswahlfrage (z. B. Postleitzahl). */
export type Zusatzfeld = {
  feld: string;
  label: string;
  /** `plz` erzwingt numerische Tastatur und fünfstellige Prüfung. */
  art: "text" | "plz";
  maxLaenge: number;
};

export type FunnelSchritt =
  | {
      art: "einzelauswahl";
      /** Spaltenname bzw. Schlüssel in `answers`. */
      feld: string;
      frage: string;
      optionen: Antwortoption[];
      zusatzfeld?: Zusatzfeld;
      /** Kleiner beruhigender Hinweis unter den Optionen. */
      fussnote?: string;
    }
  | {
      art: "mehrfachauswahl";
      feld: string;
      frage: string;
      optionen: Antwortoption[];
      /** Mindestanzahl Auswahlen; 0 erlaubt das Überspringen. */
      minAuswahl: number;
      fussnote?: string;
    }
  | {
      art: "kontakt";
      frage: string;
      /** Erklärender Satz über den Feldern. */
      hinweis?: string;
    };

/** Zwei Spalten der Gegenüberstellung. */
export type Gegenueberstellung = {
  ueberschrift: string;
  einleitung?: string;
  negativ: { titel: string; punkte: string[] };
  positiv: { titel: string; punkte: string[] };
};

export type Ablaufschritt = {
  titel: string;
  text: string;
};

export type Vorteil = {
  /** Kurz und konkret — erscheint auch im Hero. */
  titel: string;
  zusatz: string;
};

export type HeroBild = {
  /** Pfad unter `public/`, z. B. "/landingpages/kaeltetechniker-koeln.jpg". */
  pfad: string;
  /** Beschreibt, was zu sehen ist — kein Marketingtext. */
  alt: string;
  breite: number;
  hoehe: number;
};

export type LandingpageConfig = {
  /** URL-Segment unter /stellen/ — nur Kleinbuchstaben und Bindestriche. */
  slug: string;

  /** Vollständige Positionsbezeichnung inklusive (m/w/d). */
  position: string;
  /** Anzeigetext des Einsatzgebiets, z. B. "Raum Köln". */
  einsatzgebiet: string;

  /** Kleiner Text über der Hauptüberschrift. */
  augenbrauentext: string;
  /** Zweite Zeile wird farblich abgesetzt. Fehlt sie, bleibt die Überschrift einzeilig. */
  ueberschrift: { zeile1: string; zeile2?: string };
  unterzeile: string;

  /** Drei bis vier Vorteile — erscheinen im Hero und in der Vorteilsleiste. */
  vorteile: Vorteil[];

  cta: {
    primaer: string;
    zusatz: string;
  };

  heroBild?: HeroBild;

  gegenueberstellung: Gegenueberstellung;

  ablauf: {
    ueberschrift: string;
    augenbrauentext: string;
    schritte: Ablaufschritt[];
  };

  funnel: {
    ueberschrift: string;
    einleitung: string;
    schritte: FunnelSchritt[];
  };

  seo: {
    titel: string;
    beschreibung: string;
  };

  /**
   * Kanonischer Pfad der organisch indexierten Stellenanzeige, falls es eine
   * gibt. Die Landingpage selbst bleibt `noindex` — sie ist eine Anzeigenseite
   * und würde sonst mit der Stellenanzeige um dasselbe Suchwort konkurrieren.
   */
  organischeStelle?: string;

  /** Betreffzeile und Überschrift der Benachrichtigungsmail an PHE. */
  benachrichtigungsBetreff: string;
};
