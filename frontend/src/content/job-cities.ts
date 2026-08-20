// Bewerberseitige Ortsseiten unter /jobs/in/<stadt>.
//
// Abgrenzung zur City Content Engine (content/cities): Die dortigen Seiten
// sprechen Arbeitgeber an ("Personalvermittlung in Düsseldorf"). Diese hier
// beantworten die Bewerbersuche "jobs <stadt>" / "stellenangebote <stadt>" —
// laut Search Console die stärkste ungenutzte Nachfrage der Domain.
//
// Aufgenommen wird eine Stadt nur, wenn dafür in der Search Console echte
// Impressionen belegt sind. Keine Seite auf Verdacht: eine Ortsseite ohne
// Nachfrage und ohne Stellen im Umkreis ist dünner Inhalt.

export type JobCity = {
  readonly slug: string;
  readonly name: string;
  /** Ortsname im Genitiv/Dativ-Kontext, z. B. "in Bad Oeynhausen". */
  readonly federalState: string;
  readonly lat: number;
  readonly lng: number;
  /** Radius in km, in dem Stellen dieser Seite zugeordnet werden. */
  readonly radiusKm: number;
  /** Belegte Impressionen in der Search Console (12-Monats-Export 20.08.2026). */
  readonly searchDemand: { impressions: number; avgPosition: number };
  /** Einleitung — pro Stadt eigenständig, kein Textbaustein mit Platzhalter. */
  readonly intro: string;
  /** Absatz zum lokalen Arbeitsmarkt. */
  readonly market: string;
  /** Absatz zu Pendelraum und Umland. */
  readonly commute: string;
  readonly faq: readonly { q: string; a: string }[];
  /** Benachbarte Ortsseiten für die Querverlinkung. */
  readonly nearby: readonly string[];
};

export const jobCities: readonly JobCity[] = [
  {
    slug: "mosbach",
    name: "Mosbach",
    federalState: "Baden-Württemberg",
    lat: 49.353,
    lng: 9.149,
    radiusKm: 100,
    searchDemand: { impressions: 202, avgPosition: 10.6 },
    intro:
      "Mosbach liegt im Neckar-Odenwald-Kreis zwischen Heilbronn und dem Odenwald — einer Region, die von mittelständischer Industrie geprägt ist. Wir vermitteln hier Elektroniker, Mechatroniker und Instandhalter in unbefristete Festanstellung, direkt beim Unternehmen und ohne Zeitarbeit.",
    market:
      "Der Neckar-Odenwald-Kreis ist stark von produzierendem Mittelstand geprägt: Maschinenbau, Metallverarbeitung und Zulieferbetriebe bestimmen das Bild. Für Fachkräfte aus der Elektrotechnik und Instandhaltung bedeutet das planbare Arbeitsplätze in etablierten Betrieben statt Projektgeschäft. Viele Unternehmen suchen dauerhaft und stellen unbefristet ein.",
    commute:
      "Von Mosbach aus sind Heilbronn und der Raum Neckarsulm in gut einer halben Stunde erreichbar, Stuttgart und die Rhein-Neckar-Region in etwa einer Stunde. Deshalb zeigen wir auf dieser Seite auch Stellen im weiteren Umkreis — mit Entfernungsangabe, damit Sie selbst einschätzen können, was für Sie pendelbar ist.",
    faq: [
      {
        q: "Welche Jobs vermittelt PHE-Perm in Mosbach?",
        a: "Schwerpunkt sind technische Berufe in Festanstellung: Elektroniker für Betriebstechnik, Instandhalter, Mechatroniker und Servicetechniker. Welche Stellen aktuell offen sind, sehen Sie oben auf dieser Seite.",
      },
      {
        q: "Kostet die Vermittlung mich als Bewerber etwas?",
        a: "Nein. Die Vermittlung ist für Bewerber vollständig kostenlos und unverbindlich — unser Honorar zahlt das einstellende Unternehmen.",
      },
      {
        q: "Ist das Zeitarbeit?",
        a: "Nein. Wir vermitteln ausschließlich in direkte, unbefristete Festanstellung beim Unternehmen. Sie bekommen Ihren Arbeitsvertrag vom Betrieb selbst, nicht von uns.",
      },
    ],
    nearby: ["frankenthal", "offenbach"],
  },
  {
    slug: "frankenthal",
    name: "Frankenthal",
    federalState: "Rheinland-Pfalz",
    lat: 49.537,
    lng: 8.353,
    radiusKm: 100,
    searchDemand: { impressions: 181, avgPosition: 9.7 },
    intro:
      "Frankenthal liegt mitten in der Metropolregion Rhein-Neckar, zwischen Ludwigshafen, Mannheim und Worms. Für Elektroniker und Instandhalter ist das einer der dichtesten Industriestandorte Deutschlands — wir vermitteln hier in unbefristete Festanstellung, kostenlos für Bewerber.",
    market:
      "Die Region lebt von Chemie, Maschinen- und Anlagenbau sowie deren Zulieferern. Frankenthal selbst hat eine lange Tradition im Pumpen- und Armaturenbau. Für Fachkräfte aus der Elektrotechnik heißt das: viele Betriebe mit eigener Instandhaltung, Schaltschrankbau und Anlagentechnik — und entsprechend beständige Nachfrage nach Elektronikern für Betriebstechnik.",
    commute:
      "Ludwigshafen und Mannheim liegen unmittelbar vor der Tür, Worms und Speyer sind in kurzer Zeit erreichbar, Frankfurt und Heilbronn in gut einer Stunde. Die Stellen unten sind nach Entfernung zu Frankenthal sortiert.",
    faq: [
      {
        q: "Welche Stellen gibt es in Frankenthal?",
        a: "Wir vermitteln in Frankenthal und Umgebung vor allem Elektroniker für Betriebstechnik, Instandhalter und Mechatroniker in Festanstellung. Die aktuell offenen Stellen stehen oben auf dieser Seite.",
      },
      {
        q: "Wie schnell bekomme ich eine Rückmeldung?",
        a: "Wir melden uns innerhalb von 24 Stunden nach Ihrer Bewerbung — in der Regel per Telefon, um Ihre Wünsche zu Gehalt, Standort und Aufgaben zu klären.",
      },
      {
        q: "Brauche ich einen Lebenslauf für die Bewerbung?",
        a: "Nein. Für den ersten Kontakt reichen Name und Telefonnummer. Falls Sie später einen Lebenslauf brauchen, können Sie ihn kostenlos über unseren Lebenslauf-Generator erstellen.",
      },
    ],
    nearby: ["mosbach", "offenbach"],
  },
  {
    slug: "offenbach",
    name: "Offenbach",
    federalState: "Hessen",
    lat: 50.099,
    lng: 8.762,
    radiusKm: 100,
    searchDemand: { impressions: 132, avgPosition: 11.0 },
    intro:
      "Offenbach am Main grenzt direkt an Frankfurt und gehört zum Kern des Rhein-Main-Gebiets. Für Elektroniker, Elektromonteure und Anlagenmechaniker gibt es hier ein dichtes Feld an Arbeitgebern — wir vermitteln in unbefristete Festanstellung, ohne Kosten für Sie.",
    market:
      "Rhein-Main ist geprägt von Gebäudetechnik, Rechenzentren, Logistik und Industriedienstleistung. Elektrofachkräfte werden sowohl in der Installation und Montage gesucht als auch in der Instandhaltung technischer Infrastruktur. Die Nähe zu Frankfurt sorgt dafür, dass das Gehaltsniveau spürbar über dem ländlicher Regionen liegt.",
    commute:
      "Frankfurt ist von Offenbach aus in wenigen Minuten erreichbar, Hanau, Darmstadt und der Main-Kinzig-Kreis in unter einer Stunde. Wir zeigen deshalb auch Stellen im weiteren Rhein-Main-Raum mit Entfernungsangabe.",
    faq: [
      {
        q: "Welche technischen Jobs gibt es in Offenbach und Umgebung?",
        a: "Schwerpunkt sind Elektromonteure, Elektroniker, Anlagenmechaniker SHK und Servicetechniker — alle in direkter Festanstellung. Die offenen Stellen finden Sie oben.",
      },
      {
        q: "Vermittelt PHE-Perm auch nach Frankfurt?",
        a: "Ja. Frankfurt liegt unmittelbar neben Offenbach, entsprechende Stellen sind auf dieser Seite mit aufgeführt.",
      },
      {
        q: "Was unterscheidet Sie von einer Zeitarbeitsfirma?",
        a: "Sie werden direkt beim Unternehmen unbefristet angestellt. Es gibt keine Überlassung, keinen Einsatzwechsel und keine Abzüge — Ihr Arbeitgeber ist der Betrieb selbst.",
      },
    ],
    nearby: ["frankenthal", "mosbach"],
  },
  {
    slug: "duesseldorf",
    name: "Düsseldorf",
    federalState: "Nordrhein-Westfalen",
    lat: 51.227,
    lng: 6.773,
    radiusKm: 100,
    searchDemand: { impressions: 43, avgPosition: 11.3 },
    intro:
      "Düsseldorf ist unser Bürostandort — die Stellen an der Rheinschiene betreuen wir von hier aus persönlich. Für Elektroniker, Servicetechniker und Mechatroniker ist die Region zwischen Düsseldorf, Köln und dem Bergischen Land einer der stärksten Arbeitsmärkte Deutschlands.",
    market:
      "Die Landeshauptstadt verbindet Industrie mit technischer Dienstleistung: Energieversorgung, Gebäudeautomation, Photovoltaik und Anlagenbau prägen die Nachfrage nach Elektrofachkräften. Rund um Düsseldorf liegen zusätzlich Langenfeld, Wuppertal, Köln und der Rhein-Erft-Kreis mit ihrer eigenen Industriedichte.",
    commute:
      "Innerhalb der Rheinschiene sind Köln, Langenfeld, Wuppertal und Kerpen in unter einer Stunde erreichbar. Entsprechend groß ist die Auswahl auf dieser Seite.",
    faq: [
      {
        q: "Hat PHE-Perm ein Büro in Düsseldorf?",
        a: "Ja. Unser Standort ist in Düsseldorf — Bewerbergespräche führen wir telefonisch oder auf Wunsch persönlich vor Ort.",
      },
      {
        q: "Welche Stellen vermitteln Sie in Düsseldorf?",
        a: "Vor allem Servicetechniker, Elektroniker für Gebäude- und Betriebstechnik sowie Mechatroniker — in unbefristeter Festanstellung.",
      },
      {
        q: "Suchen Sie auch Personal für Unternehmen in Düsseldorf?",
        a: "Ja. Arbeitgeber finden die Details zu unserer Arbeitsweise auf der Seite Personalvermittlung Düsseldorf.",
      },
    ],
    nearby: ["langenfeld", "dortmund"],
  },
  {
    slug: "dortmund",
    name: "Dortmund",
    federalState: "Nordrhein-Westfalen",
    lat: 51.514,
    lng: 7.468,
    radiusKm: 100,
    searchDemand: { impressions: 17, avgPosition: 20.5 },
    intro:
      "Dortmund steht wie kaum eine andere Stadt für den Wandel vom Montanrevier zum Technologiestandort. Für Elektroniker und Instandhalter heißt das: moderne Anlagen, etablierte Industriebetriebe und dauerhaft offene Stellen — wir vermitteln in Festanstellung, kostenlos für Bewerber.",
    market:
      "Neben Logistik und IT ist im östlichen Ruhrgebiet weiterhin viel produzierende Industrie ansässig. Gesucht werden vor allem Elektroniker für Betriebstechnik und Anlagentechnik, Instandhalter und Servicetechniker. Das Ruhrgebiet bietet dabei kurze Wege: Bochum, Hagen, Wuppertal und Münster liegen im Pendelradius.",
    commute:
      "Von Dortmund aus erreichen Sie Wuppertal, Münster und Düsseldorf in rund einer Stunde. Die Liste unten ist nach Entfernung sortiert.",
    faq: [
      {
        q: "Welche Elektroniker-Jobs gibt es in Dortmund?",
        a: "Wir vermitteln in Dortmund und im östlichen Ruhrgebiet vor allem Elektroniker für Anlagen- und Betriebstechnik sowie Instandhalter in Festanstellung.",
      },
      {
        q: "Bieten Sie auch Stellen im Schichtbetrieb?",
        a: "Ja, sowohl Stellen ohne Schicht als auch im 3-Schicht- oder Vollkonti-Betrieb — mit entsprechenden Zulagen. Die Arbeitszeitform steht in jeder Anzeige.",
      },
      {
        q: "Wie läuft die Bewerbung ab?",
        a: "Sie senden uns Name und Telefonnummer, wir melden uns innerhalb von 24 Stunden. Erst wenn für Sie alles passt, stellen wir den Kontakt zum Unternehmen her.",
      },
    ],
    nearby: ["duesseldorf", "langenfeld"],
  },
  {
    slug: "bad-oeynhausen",
    name: "Bad Oeynhausen",
    federalState: "Nordrhein-Westfalen",
    lat: 52.198,
    lng: 8.8,
    radiusKm: 120,
    searchDemand: { impressions: 17, avgPosition: 11.1 },
    intro:
      "Bad Oeynhausen liegt in Ostwestfalen-Lippe, im Dreieck zwischen Minden, Herford und Hannover. Die Region ist ein klassischer Standort des industriellen Mittelstands — wir vermitteln hier Elektroniker und Instandhalter in unbefristete Festanstellung.",
    market:
      "Ostwestfalen-Lippe ist geprägt von Maschinenbau, Kunststoffverarbeitung, Möbel- und Nahrungsmittelindustrie. Diese Betriebe unterhalten eigene Instandhaltungsmannschaften und stellen Elektroniker für Betriebstechnik dauerhaft ein — häufig mit fester Schichtplanung und langfristiger Perspektive.",
    commute:
      "Minden, Herford und Bielefeld sind aus Bad Oeynhausen in kurzer Zeit erreichbar, Hannover in gut einer Stunde. Weil das Stellenangebot in dieser Region gestreut liegt, zeigen wir hier einen etwas größeren Umkreis als auf den übrigen Ortsseiten.",
    faq: [
      {
        q: "Welche Stellen vermitteln Sie in Bad Oeynhausen?",
        a: "Schwerpunkt sind Betriebselektroniker und Instandhalter in Festanstellung. Die aktuell offenen Stellen im Umkreis sehen Sie oben auf dieser Seite.",
      },
      {
        q: "Kann ich mich auch bewerben, wenn gerade keine passende Stelle dabei ist?",
        a: "Ja. Wir nehmen Sie in die Vormerkung auf und melden uns, sobald eine passende Stelle in Ihrer Region frei wird.",
      },
      {
        q: "Ist die Vermittlung wirklich kostenlos?",
        a: "Ja, für Bewerber entstehen keinerlei Kosten. Bezahlt werden wir ausschließlich vom einstellenden Unternehmen.",
      },
    ],
    nearby: ["dortmund", "duesseldorf"],
  },
  {
    slug: "langenfeld",
    name: "Langenfeld",
    federalState: "Nordrhein-Westfalen",
    lat: 51.107,
    lng: 6.949,
    radiusKm: 100,
    searchDemand: { impressions: 16, avgPosition: 9.5 },
    intro:
      "Langenfeld liegt genau zwischen Düsseldorf und Köln — mit entsprechend kurzen Wegen in beide Richtungen. Für SPS-Programmierer, Automatisierungstechniker und Elektroniker ist das eine der dichtesten Stellenlagen in ganz Nordrhein-Westfalen.",
    market:
      "Im Rheinland zwischen Düsseldorf und Köln sitzen zahlreiche Maschinen- und Anlagenbauer sowie Zulieferer der Automobil- und Chemieindustrie. Automatisierungstechnik ist hier ein eigener Schwerpunkt: SPS-Programmierung mit Siemens S7 und TIA Portal wird durchgehend gesucht, ebenso Instandhaltung und Gebäudeautomation.",
    commute:
      "Düsseldorf, Köln, Wuppertal und Kerpen liegen alle innerhalb weniger Fahrminuten bis zu einer knappen Stunde. Diese Seite zeigt deshalb das gesamte Stellenangebot der Rheinschiene, sortiert nach Entfernung zu Langenfeld.",
    faq: [
      {
        q: "Gibt es SPS-Stellen in Langenfeld?",
        a: "Ja. Automatisierungstechnik ist einer unserer Schwerpunkte in der Region — die aktuell offenen Stellen finden Sie oben auf dieser Seite.",
      },
      {
        q: "Welche Erfahrung brauche ich als SPS-Programmierer?",
        a: "Das hängt von der Stelle ab. Gefragt sind meist Kenntnisse in Siemens S7 oder TIA Portal; Berufseinsteiger mit abgeschlossener Ausbildung in Elektrotechnik oder Automatisierung sind ebenfalls willkommen.",
      },
      {
        q: "Wie weit ist Köln von Langenfeld entfernt?",
        a: "Rund 20 Kilometer. Stellen in Köln, Düsseldorf und Wuppertal sind auf dieser Seite deshalb mit aufgeführt.",
      },
    ],
    nearby: ["duesseldorf", "dortmund"],
  },
];

export function jobCityBySlug(slug: string): JobCity | undefined {
  return jobCities.find(c => c.slug === slug);
}
