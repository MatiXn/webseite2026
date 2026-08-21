// Berufe für die Beruf-x-Ort-Seiten unter /berufe/<beruf>/<stadt>.
//
// Aufgenommen wird ein Beruf nur, wenn der Stellenbestand ein Ortsraster
// überhaupt trägt: mindestens drei passende Stellen im 100-km-Umkreis einer
// Stadt, davon mindestens eine ortsnah (<= 30 km). Sonst listet die Seite nur
// Fernstellen und ist gegenüber der Nachbarstadt nicht unterscheidbar — genau
// das Muster, das Google als Doorway Page bewertet.
//
// Stand 21.08.2026 tragen vier der zwölf angefragten Positionen dieses Raster.
// Für Kältetechniker, Servicetechniker, Anlagenmechaniker SHK, Monteure und
// Applikations Engineer reicht der Bestand nicht; sie werden weiterhin über die
// bundesweiten Berufsseiten unter /berufe abgedeckt.

import type { JobMatchConfig } from "./professions/types";

export type JobRole = {
  readonly slug: string;
  /** Name im Fließtext, z. B. "Elektroniker für Betriebstechnik". */
  readonly name: string;
  /** Kurzform für Titel und Breadcrumb. */
  readonly shortName: string;
  /** Pfad der bundesweiten Berufsseite (Hub dieser Spokes). */
  readonly hubPath: string;
  readonly jobMatch: JobMatchConfig;
  /** Was der Beruf ausmacht — zwei bis drei Sätze. */
  readonly profile: string;
  /** Typische Aufgaben im Beruf. */
  readonly tasks: readonly string[];
  /** Übliche Voraussetzungen. */
  readonly requirements: readonly string[];
  /** Berufsbezogene Fragen; Ortsbezug ergänzt die Seite selbst. */
  readonly faq: readonly { q: string; a: string }[];
};

export const jobRoles: readonly JobRole[] = [
  {
    slug: "elektroniker",
    name: "Elektroniker",
    shortName: "Elektroniker",
    hubPath: "/berufe/elektroniker",
    jobMatch: { category: ["elektro"], maxJobs: 99, fallback: "hide" },
    profile:
      "Elektroniker installieren, warten und reparieren elektrische Anlagen und Betriebsmittel. Je nach Betrieb liegt der Schwerpunkt auf der Instandhaltung laufender Produktionsanlagen, auf Montage und Inbetriebnahme oder auf der Gebäude- und Infrastrukturtechnik. Gemeinsam ist allen Stellen: Es geht um Anlagen, die zuverlässig laufen müssen.",
    tasks: [
      "Installation und Inbetriebnahme elektrischer Anlagen und Betriebsmittel",
      "Fehlersuche und Störungsbehebung an Steuerungen und Antrieben",
      "Wartung und Instandhaltung nach Wartungsplan",
      "Prüfungen elektrischer Anlagen nach DGUV Vorschrift 3 und DIN VDE",
      "Dokumentation der Arbeiten und Pflege der Schaltpläne",
    ],
    requirements: [
      "Abgeschlossene Ausbildung im Elektrohandwerk oder in der Elektrotechnik",
      "Sicheres Lesen von Stromlaufplänen und technischen Zeichnungen",
      "Gute Deutschkenntnisse in Wort und Schrift",
    ],
    faq: [
      {
        q: "Welche Ausbildung brauche ich als Elektroniker?",
        a: "In der Regel eine abgeschlossene Ausbildung als Elektroniker, Elektroinstallateur, Elektriker oder eine vergleichbare Qualifikation. Berufserfahrung ist bei vielen Stellen von Vorteil, aber selten Bedingung.",
      },
      {
        q: "Was verdient ein Elektroniker?",
        a: "Das hängt von Region, Branche und Arbeitszeitmodell ab. Die konkreten Gehaltsspannen der aktuell offenen Stellen stehen weiter oben in der Liste — Schicht- und Bereitschaftszulagen kommen dort meist noch hinzu.",
      },
    ],
  },
  {
    slug: "elektroniker-betriebstechnik",
    name: "Elektroniker für Betriebstechnik",
    shortName: "Elektroniker Betriebstechnik",
    hubPath: "/berufe/elektroniker-betriebstechnik",
    jobMatch: {
      keywords: ["betriebstechnik", "betriebselektr"],
      maxJobs: 99,
      fallback: "hide",
    },
    profile:
      "Elektroniker für Betriebstechnik halten die elektrische Seite der Produktion am Laufen. Sie arbeiten an Schaltanlagen, Antrieben und Steuerungen im laufenden Betrieb — Störungen müssen schnell gefunden und behoben werden, weil sonst die Fertigung steht. Viele Stellen sind im Schichtbetrieb, mit entsprechenden Zulagen.",
    tasks: [
      "Instandhaltung elektrischer Betriebsmittel und Produktionsanlagen",
      "Störungsdiagnose an Steuerungen, Sensorik und Antriebstechnik",
      "Verdrahtung und Aufbau von Schaltschränken nach Stromlaufplan",
      "Wiederkehrende Prüfungen nach DGUV Vorschrift 3",
      "Mitwirkung bei Umbauten und Erweiterungen der Anlagen",
    ],
    requirements: [
      "Ausbildung als Elektroniker für Betriebstechnik, Betriebselektriker oder vergleichbar",
      "Erfahrung in der industriellen Instandhaltung von Vorteil",
      "Bereitschaft zur Schichtarbeit, je nach Stelle",
    ],
    faq: [
      {
        q: "Was unterscheidet Betriebstechnik von Energie- und Gebäudetechnik?",
        a: "Betriebstechnik dreht sich um Produktionsanlagen und industrielle Betriebsmittel, Energie- und Gebäudetechnik um die Elektroinstallation in Gebäuden. Wer aus dem einen Bereich kommt, wird für den anderen meist trotzdem genommen.",
      },
      {
        q: "Muss ich Schicht arbeiten?",
        a: "Nicht zwingend. Wir haben sowohl Stellen im Tagdienst als auch im 3-Schicht- und Vollkonti-Betrieb. Die Arbeitszeitform steht in jeder Anzeige — Schichtzulagen sind dort bereits eingepreist.",
      },
    ],
  },
  {
    slug: "elektroniker-energie-gebaeudetechnik",
    name: "Elektroniker für Energie- und Gebäudetechnik",
    shortName: "Elektroniker Gebäudetechnik",
    hubPath: "/berufe/elektroniker-energie-gebaeudetechnik",
    jobMatch: {
      keywords: ["gebäudetechnik", "gebäudeautomation", "energie- und gebäude", "msr"],
      maxJobs: 99,
      fallback: "hide",
    },
    profile:
      "Elektroniker für Energie- und Gebäudetechnik verantworten die elektrische Infrastruktur von Gebäuden: Energieverteilung, Beleuchtung, Sicherheitstechnik und zunehmend Gebäudeautomation. In Rechenzentren, Kliniken und Bürokomplexen kommt Mess-, Steuer- und Regelungstechnik dazu — ein Feld, in dem Fachkräfte dauerhaft knapp sind.",
    tasks: [
      "Installation und Instandhaltung der Energieverteilung im Gebäude",
      "Arbeiten an MSR- und Gebäudeleittechnik",
      "Störungsbehebung an Beleuchtungs-, Sicherheits- und Klimatechnik",
      "Prüfung ortsfester elektrischer Anlagen",
      "Einweisung von Nutzern und Dokumentation der Anlagen",
    ],
    requirements: [
      "Ausbildung als Elektroniker für Energie- und Gebäudetechnik oder vergleichbar",
      "Kenntnisse in Gebäudeautomation oder MSR-Technik von Vorteil",
      "Bereitschaft zum Bereitschaftsdienst bei manchen Stellen",
    ],
    faq: [
      {
        q: "Brauche ich Erfahrung mit Gebäudeautomation?",
        a: "Für einen Teil der Stellen ja, für viele reicht eine solide Elektroausbildung — die Automationsseite lernen Sie im Betrieb dazu. Welche Kenntnisse gefordert sind, steht im Profil der jeweiligen Anzeige.",
      },
      {
        q: "Arbeite ich auf Baustellen oder im Bestand?",
        a: "Überwiegend im Bestand: Betrieb und Instandhaltung bestehender Gebäudetechnik. Reine Baustellenmontage vermitteln wir nur in Ausnahmefällen.",
      },
    ],
  },
  {
    slug: "mechatroniker",
    name: "Mechatroniker",
    shortName: "Mechatroniker",
    hubPath: "/berufe/mechatroniker",
    jobMatch: {
      category: ["mechatronik"],
      keywords: ["mechatroniker"],
      maxJobs: 99,
      fallback: "hide",
    },
    profile:
      "Mechatroniker arbeiten an der Schnittstelle von Mechanik, Elektrik und Steuerungstechnik. Sie bauen, warten und reparieren komplexe Baugruppen, in denen alle drei Disziplinen zusammenkommen — von der Produktionsanlage über Kälte- und Klimatechnik bis zum Servicegerät beim Kunden.",
    tasks: [
      "Montage und Inbetriebnahme mechatronischer Systeme",
      "Fehlersuche über Mechanik, Elektrik und Steuerung hinweg",
      "Wartung und Reparatur von Antrieben, Pneumatik und Hydraulik",
      "Austausch von Baugruppen und Verschleißteilen",
      "Technische Dokumentation der Einsätze",
    ],
    requirements: [
      "Abgeschlossene Ausbildung als Mechatroniker oder vergleichbare Qualifikation",
      "Verständnis für Mechanik und Elektrotechnik gleichermaßen",
      "Führerschein Klasse B bei Stellen mit Kundeneinsatz",
    ],
    faq: [
      {
        q: "Ist Mechatroniker eher Mechanik oder Elektrik?",
        a: "Beides — und genau das macht den Beruf aus. Welche Seite überwiegt, hängt von der Stelle ab: In der Instandhaltung dominiert oft die Mechanik, im Anlagenservice die Steuerungstechnik.",
      },
      {
        q: "Kann ich als Industriemechaniker auf Mechatroniker-Stellen wechseln?",
        a: "Häufig ja. Viele Betriebe nehmen Industriemechaniker mit Elektro-Grundkenntnissen und qualifizieren intern nach. Sprechen Sie uns an, wir schätzen das für die konkrete Stelle ein.",
      },
    ],
  },
];

export function jobRoleBySlug(slug: string): JobRole | undefined {
  return jobRoles.find(r => r.slug === slug);
}
