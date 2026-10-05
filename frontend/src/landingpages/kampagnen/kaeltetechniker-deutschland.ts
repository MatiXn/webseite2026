import type { LandingpageConfig } from "../typen";

// Kältetechniker (m/w/d), deutschlandweit — Sammel-Landingpage.
//
// Anders als `kaeltetechniker-koeln.ts` bewirbt diese Seite KEINE einzelne
// Stelle, sondern den gesamten Kältetechnik-Bestand. Stand 26.09.2026 sind das
// 19 Stellen in Köln, Essen, Koblenz, Hamburg (2x), Berlin (2x), Leipzig, Zerbst,
// Hannover, Visbek, Offenburg,
// Stuttgart, München (4x), Regensburg und Würzburg (Stand 06.10.2026).
//
// Daraus folgt für die Inhalte: Es darf nur stehen, was bei ALLEN Stellen gilt.
// Geprüft am 26.09.2026 gegen `app/jobs/data.ts`:
//
//   - Gehaltsspanne über alle Stellen: 45.000 (Köln) bis 65.000 (München u. a.)
//   - 30 Tage Urlaub: in allen 14 Datensätzen hinterlegt
//   - Unbefristeter Vertrag: laut Auskunft vom 26.09.2026 bei allen Stellen;
//     am 27.09.2026 in data.ts für alle 44 Stellen nachgetragen
//   - Fahrzeug mit Privatnutzung: 13 der 14 Stellen. Einzige Ausnahme ist der
//     Qualitätssicherer Hamburg (29) — laut Beschreibung reiner Innendienst und
//     damit keine Position, die über eine Kältetechniker-Anzeige gesucht wird.
//     Stand 27.09.2026 nach Klärung der Würzburger Stelle (44): Das dortige
//     Fahrzeug ist entgegen der früheren Datenpflege privat nutzbar.
//
// Bewusst NICHT übernommen aus der Köln-Seite: „ausschließlich B2B-Kunden"
// (nur 1 von 14) und „nur Tagesreisen" (10 von 14). Beides wäre hier falsch.

export const kaeltetechnikerDeutschland: LandingpageConfig = {
  slug: "kaeltetechniker-deutschland",

  position: "Kältetechniker / Mechatroniker für Kältetechnik (m/w/d)",
  einsatzgebiet: "Deutschlandweit",

  augenbrauentext: "Festanstellung deutschlandweit",
  ueberschrift: {
    zeile1: "Du kannst Kälte.",
    zeile2: "Wir haben den Job in deiner Region.",
  },
  unterzeile:
    "Feste Stellen bei Arbeitgebern in ganz Deutschland — von Hamburg bis München. Du sagst uns, wo du arbeiten willst. Wir sagen dir, was dort frei ist.",

  vorteile: [
    { titel: "45.000–65.000 €", zusatz: "Jahresgehalt je nach Region" },
    { titel: "Dienstwagen", zusatz: "inklusive Privatnutzung" },
    { titel: "30 Tage Urlaub", zusatz: "Zeit für das, was zählt" },
    { titel: "Unbefristet", zusatz: "Festanstellung beim Arbeitgeber" },
  ],

  cta: {
    primaer: "In 60 Sekunden Interesse zeigen",
    zusatz: "Kein Anschreiben · Kein Lebenslauf erforderlich",
  },

  gegenueberstellung: {
    ueberschrift: "Suchen sollte nicht anstrengender sein als arbeiten.",
    einleitung:
      "Wer Anlagen am Laufen hält, hat Besseres zu tun, als Stellenportale zu durchforsten und auf Antworten zu warten.",
    negativ: {
      titel: "Was du nicht mehr brauchst",
      punkte: [
        "Zeitarbeit und wechselnde Entleiher",
        "Bewerbungen, auf die nie jemand antwortet",
        "Inserate ohne Gehaltsangabe",
        "Stellen, die schon lange besetzt sind",
      ],
    },
    positiv: {
      titel: "Was dich hier erwartet",
      punkte: [
        "Festanstellung direkt beim Arbeitgeber",
        "Persönliche Rückmeldung auf jede Anfrage",
        "Konditionen kennst du vor dem Gespräch",
        "Stellen in allen großen Ballungsräumen",
      ],
    },
  },

  ablauf: {
    augenbrauentext: "So einfach geht es",
    ueberschrift: "Kein Bewerbungstheater.",
    schritte: [
      {
        titel: "Kurz antworten",
        text: "Vier kurze Angaben statt eines langen Anschreibens.",
      },
      {
        titel: "Passende Stellen hören",
        text: "Wir melden uns persönlich und nennen dir, was in deiner Region frei ist.",
      },
      {
        titel: "In Ruhe entscheiden",
        text: "Du entscheidest erst danach, welchen Arbeitgeber du kennenlernen möchtest.",
      },
    ],
  },

  funnel: {
    ueberschrift: "Wo soll dein nächster Job sein?",
    einleitung:
      "Finde es in 60 Sekunden heraus. Deine Angaben behandeln wir vertraulich — dein aktueller Arbeitgeber erfährt nichts davon.",
    schritte: [
      {
        art: "einzelauswahl",
        feld: "qualification",
        frage:
          "Hast du eine abgeschlossene Ausbildung als Mechatroniker für Kältetechnik oder eine vergleichbare Qualifikation?",
        optionen: [
          { wert: "kaeltetechnik", label: "Ja, habe ich" },
          { wert: "andere_technische", label: "Andere technische Ausbildung" },
          { wert: "keine_technische", label: "Keine abgeschlossene technische Ausbildung" },
        ],
        fussnote: "Deine Antwort ist noch keine Bewerbung.",
      },
      {
        art: "einzelauswahl",
        feld: "experience_level",
        frage: "Wie viel Berufserfahrung hast du in der Kälte- oder Klimatechnik?",
        optionen: [
          { wert: "keine", label: "Noch keine Berufserfahrung" },
          { wert: "unter_2", label: "Weniger als 2 Jahre" },
          { wert: "2_bis_5", label: "2 bis 5 Jahre" },
          { wert: "ueber_5", label: "Mehr als 5 Jahre" },
        ],
      },
      {
        // Kernfrage dieser Seite. Die Gruppen bündeln die Regionen, in denen
        // tatsächlich Stellen offen sind — die genaue Stadt ergibt sich aus
        // der Postleitzahl.
        art: "einzelauswahl",
        feld: "region",
        frage: "In welcher Region suchst du?",
        optionen: [
          { wert: "west", label: "Westen — Köln, Essen, Koblenz" },
          { wert: "sued", label: "Süden — München, Stuttgart, Offenburg, Regensburg, Würzburg" },
          { wert: "nord", label: "Norden — Hamburg, Hannover, Visbek" },
          { wert: "ost", label: "Osten — Berlin, Leipzig, Zerbst" },
          { wert: "flexibel", label: "Bin flexibel, zeigt mir alles" },
        ],
        zusatzfeld: {
          feld: "postal_code",
          label: "Postleitzahl (optional) — damit wir Stellen in deiner Nähe finden",
          art: "plz",
          maxLaenge: 5,
        },
      },
      {
        art: "einzelauswahl",
        feld: "driving_license",
        frage: "Besitzt du einen Führerschein der Klasse B?",
        optionen: [
          { wert: "ja", label: "Ja" },
          { wert: "nein", label: "Nein" },
        ],
      },
      {
        art: "mehrfachauswahl",
        feld: "job_preferences",
        frage: "Was ist dir bei deinem nächsten Job besonders wichtig?",
        minAuswahl: 0,
        optionen: [
          { wert: "gehalt", label: "Mehr Gehalt" },
          { wert: "planbare_einsaetze", label: "Planbare Einsätze" },
          { wert: "dienstwagen", label: "Dienstwagen" },
          { wert: "weiterbildung", label: "Weiterbildung" },
          { wert: "weniger_uebernachtungen", label: "Weniger Übernachtungen" },
          { wert: "sicherheit", label: "Langfristige Sicherheit" },
        ],
        fussnote: "Mehrfachauswahl möglich.",
      },
      {
        art: "kontakt",
        frage: "Wie können wir dich erreichen?",
        hinweis:
          "Wir melden uns persönlich und besprechen die passenden Stellen unverbindlich mit dir.",
      },
    ],
  },

  seo: {
    titel: "Kältetechniker Jobs deutschlandweit | PHE Perm Engineering",
    beschreibung:
      "Feste Stellen für Kältetechniker in Köln, Hamburg, Berlin, München, Stuttgart und Leipzig: 45.000–65.000 Euro, Dienstwagen und 30 Tage Urlaub.",
  },

  // Bewusst kein `organischeStelle`: Diese Seite bündelt 14 Stellen, es gibt
  // also keine einzelne Anzeige, auf die sie verweisen könnte.

  benachrichtigungsBetreff: "Neue Bewerbung: Kältetechniker (deutschlandweit)",
};
