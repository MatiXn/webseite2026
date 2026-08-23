import type { LandingpageConfig } from "../typen";

// Kältetechniker / Mechatroniker für Kältetechnik (m/w/d), Raum Köln.
//
// Alle Angaben stammen aus der Stellenzusage des Kunden und decken sich mit
// Job 34 in `src/app/jobs/data.ts`. Ändert sich dort etwas, muss es hier
// mitgeführt werden — der Test `kampagnen.test.ts` prüft den Abgleich.

export const kaeltetechnikerKoeln: LandingpageConfig = {
  slug: "kaeltetechniker-koeln",

  position: "Kältetechniker / Mechatroniker für Kältetechnik (m/w/d)",
  einsatzgebiet: "Raum Köln",

  augenbrauentext: "Festanstellung im Raum Köln",
  ueberschrift: {
    zeile1: "Du kannst Kälte.",
    zeile2: "Wir haben den passenden Job.",
  },
  unterzeile:
    "Keine Privatkunden, kein Einsatzchaos und keine wochenlangen Montagen. Dafür ein sicherer Arbeitsplatz mit planbaren B2B-Einsätzen.",

  vorteile: [
    { titel: "45.000–55.000 €", zusatz: "Jahresgehalt brutto" },
    { titel: "Dienstwagen", zusatz: "inklusive Privatnutzung" },
    { titel: "30 Tage Urlaub", zusatz: "Zeit für das, was zählt" },
    { titel: "Unbefristet", zusatz: "Festanstellung beim Kunden" },
  ],

  cta: {
    primaer: "In 60 Sekunden Interesse zeigen",
    zusatz: "Kein Anschreiben · Kein Lebenslauf erforderlich",
  },

  // Kein Foto hinterlegt: Der Hero fällt automatisch auf die typografische
  // Variante zurück. Sobald ein passendes Bild in `public/landingpages/`
  // liegt, hier `heroBild` ergänzen.

  gegenueberstellung: {
    ueberschrift: "Feierabend sollte auch wirklich Feierabend sein.",
    einleitung:
      "Wer Anlagen am Laufen hält, braucht selbst einen Arbeitgeber, auf den Verlass ist.",
    negativ: {
      titel: "Was du nicht mehr brauchst",
      punkte: [
        "Ungeplante Dauereinsätze",
        "Nervige Privatkundentermine",
        "Wochenlange Montagefahrten",
        "Unklare Entwicklungsperspektiven",
      ],
    },
    positiv: {
      titel: "Was dich hier erwartet",
      punkte: [
        "Planbare Tagesreisen",
        "Ausschließlich B2B-Kunden",
        "Sehr gute Einarbeitung",
        "Weiterbildung zum Techniker oder Meister",
      ],
    },
  },

  ablauf: {
    augenbrauentext: "So einfach geht es",
    ueberschrift: "Kein Bewerbungstheater.",
    schritte: [
      {
        titel: "Kurz antworten",
        text: "Drei kurze Angaben statt eines langen Anschreibens.",
      },
      {
        titel: "Vertraulich sprechen",
        text: "Wir melden uns persönlich und klären deine offenen Fragen.",
      },
      {
        titel: "In Ruhe entscheiden",
        text: "Du entscheidest erst danach, ob du den Arbeitgeber kennenlernen möchtest.",
      },
    ],
  },

  funnel: {
    ueberschrift: "Passt die Position zu dir?",
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
        art: "einzelauswahl",
        feld: "location_match",
        frage: "Wohnst du in Köln oder in gut erreichbarer Umgebung?",
        optionen: [
          { wert: "ja", label: "Ja" },
          { wert: "umzug_moeglich", label: "Umzug wäre möglich" },
          { wert: "nein", label: "Nein" },
        ],
        zusatzfeld: {
          feld: "postal_code",
          label: "Postleitzahl (optional)",
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
          "Wir melden uns persönlich und besprechen die Position unverbindlich mit dir.",
      },
    ],
  },

  seo: {
    titel: "Kältetechniker im Raum Köln | PHE Perm Engineering",
    beschreibung:
      "Unbefristete Festanstellung für Kältetechniker im Raum Köln: 45.000–55.000 Euro, Dienstwagen mit Privatnutzung, 30 Tage Urlaub und planbare B2B-Einsätze.",
  },

  organischeStelle: "/jobs/kaeltetechniker-koeln-34",

  benachrichtigungsBetreff: "Neue Bewerbung: Kältetechniker Köln",
};
