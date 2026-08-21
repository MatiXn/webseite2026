// Ein eigener Absatz je Beruf-x-Ort-Kombination.
//
// Ohne diesen Text bestünde eine Seite fast nur aus geteilten Bausteinen: das
// Berufsbild ist über alle Städte gleich, der Stadtabsatz über alle Berufe.
// Zwei Nachbarseiten kamen damit auf über 80 Prozent Textgleichheit — für
// Google praktisch dasselbe Dokument.
//
// Deshalb ist dieser Eintrag Voraussetzung dafür, dass eine Seite überhaupt
// entsteht (siehe role-city-pages.ts). Eine neue Kombination erscheint erst,
// wenn jemand den passenden Absatz geschrieben hat — bewusst redaktionell
// statt automatisch generiert.

/** Schlüssel: "<beruf-slug>/<stadt-slug>". */
export const roleCityNotes: Record<string, string> = {
  "elektroniker/langenfeld":
    "Zwischen Düsseldorf und Köln treffen zwei Arbeitsmärkte aufeinander, die für Elektroniker unterschiedlich ticken: In Langenfeld selbst und im angrenzenden Monheim dominieren Automatisierung und Sondermaschinenbau, in Köln und Leverkusen die Chemie- und Gebäudetechnik. Wer sich nicht festlegen will, hat von hier aus beide Richtungen im Zugriff — und kann bei einem Wechsel den Wohnort behalten.",

  "elektroniker/mosbach":
    "Im Neckar-Odenwald-Kreis arbeiten Elektroniker fast immer direkt in der Produktion: Die Betriebe hier haben eigene Instandhaltungsmannschaften statt ausgelagerter Dienstleister. Das bedeutet feste Kollegen, bekannte Anlagen und selten Reisetätigkeit. Wer aus dem Montagegeschäft kommt und die Auswärtstage satt hat, findet in dieser Region typischerweise den Wechsel, den er sucht.",

  "elektroniker/bad-oeynhausen":
    "Ostwestfalen-Lippe ist Mittelstandsland: Maschinenbau, Kunststoff und Nahrungsmittel, meist familiengeführt und über die Fläche verteilt. Für Elektroniker heißt das planbare Schichtmodelle und Arbeitgeber, die auf lange Betriebszugehörigkeit setzen statt auf schnelle Wechsel. Weil die Betriebe gestreut liegen, lohnt sich hier der Blick über die Stadtgrenze — die Fahrzeit bleibt trotzdem meist unter einer halben Stunde.",

  "elektroniker/dortmund":
    "Im östlichen Ruhrgebiet stehen Elektroniker heute vor moderneren Anlagen, als der Ruf der Region vermuten lässt: Der Strukturwandel hat viel automatisierte Fertigung und Logistiktechnik gebracht. Gefragt sind entsprechend Leute, die neben klassischer Elektrotechnik auch mit Steuerungen und Sensorik umgehen. Bochum, Hagen und Wuppertal liegen im selben Pendelradius.",

  "elektroniker/frankenthal":
    "Rhein-Neckar ist für Elektroniker ungewöhnlich dicht besetzt: Chemieindustrie, Pumpen- und Armaturenbau und deren Zulieferer liegen hier auf wenigen Kilometern beieinander. Das drückt sich in den Gehältern aus und gibt Bewerbern Verhandlungsspielraum. Wer im Schaltschrankbau oder in der Anlageninstandhaltung zuhause ist, findet zwischen Frankenthal, Ludwigshafen und Mannheim meist mehrere Optionen gleichzeitig.",

  "elektroniker/offenbach":
    "Direkt an Frankfurt gelegen, profitieren Elektroniker in Offenbach vom Rhein-Main-Gehaltsniveau, ohne die Frankfurter Mieten zahlen zu müssen. Der Bedarf kommt weniger aus der klassischen Fertigung als aus technischer Gebäudeinfrastruktur: Rechenzentren, Logistikzentren und Verwaltungsbauten brauchen Elektrofachkräfte für Betrieb und Instandhaltung.",

  "elektroniker/muenster":
    "Das Münsterland ist für Elektroniker ein ruhigerer, aber verlässlicher Markt: Nahrungsmittelproduktion, Maschinenbau und Kunststoffverarbeitung, überwiegend familiengeführt. Die Anlagen laufen im Dauerbetrieb, entsprechend wichtig ist die Instandhaltung. Wer Wert auf ein stabiles Umfeld ohne Konzernstrukturen legt, ist hier richtig — die Wege zu den Betrieben in der Fläche gehören allerdings dazu.",

  "elektroniker/stuttgart":
    "Im Großraum Stuttgart konkurrieren Fahrzeugbau, Sondermaschinenbau und Zulieferer um dieselben Elektrofachkräfte — mit spürbarer Wirkung auf Gehälter und Zusatzleistungen. Für Elektroniker bedeutet das gute Verhandlungsposition, aber auch höhere Erwartungen an Steuerungs- und Antriebstechnik. Viele Betriebe qualifizieren gezielt nach, wenn die Grundausbildung stimmt.",

  "elektroniker-betriebstechnik/mosbach":
    "Betriebselektroniker sind in der Region rund um Mosbach und Heilbronn gesucht, weil die Produktionsbetriebe ihre Instandhaltung im Haus behalten. Die Stellen sind meist im Schichtbetrieb ausgeschrieben — dafür mit Zulagen, festen Plänen und ohne Reisetätigkeit. Für Wechsler aus dem Handwerk ist das oft der Schritt zu planbarer Arbeitszeit.",

  "elektroniker-betriebstechnik/bochum":
    "Im mittleren Ruhrgebiet läuft ein großer Teil der Produktion rund um die Uhr. Betriebselektroniker arbeiten hier entsprechend häufig im Drei-Schicht- oder Vollkonti-Modell, mit deutlichen Zuschlägen auf das Grundgehalt. Wer Schicht gewohnt ist, verdient in dieser Region merklich mehr als im Tagdienst — Essen, Dortmund und Wuppertal liegen alle in Pendelnähe.",

  "elektroniker-betriebstechnik/muenster":
    "In den Produktionsbetrieben des Münsterlands ist der Betriebselektroniker oft die einzige Elektrofachkraft in der Schicht — mit entsprechender Eigenverantwortung von der Störungsdiagnose bis zur Freigabe. Das setzt Erfahrung voraus, bietet aber auch Gestaltungsspielraum, den man in großen Instandhaltungsabteilungen selten hat.",

  "elektroniker-energie-gebaeudetechnik/langenfeld":
    "Die Rheinschiene zwischen Düsseldorf und Köln hat eine der höchsten Dichten an Rechenzentren, Kliniken und Bürokomplexen in Deutschland — alles Gebäude, deren Technik nie ausfallen darf. Für Elektroniker der Energie- und Gebäudetechnik heißt das: unterbrechungsfreie Stromversorgung, Gebäudeleittechnik und MSR statt Baustellenmontage. Bereitschaftsdienste gehören meist dazu und werden separat vergütet.",

  "mechatroniker/hamburg":
    "Hamburgs Mechatroniker-Stellen hängen überwiegend an Hafen, Lebensmittelwirtschaft und Kältetechnik: Kühlhäuser, Prozesskälte und Klimaanlagen brauchen ganzjährig Service, unabhängig von der Konjunktur. Wer Erfahrung mit Kälteanlagen oder eine Sachkundebescheinigung mitbringt, hat in dieser Region eine deutlich bessere Auswahl als anderswo.",

  "mechatroniker/bremen":
    "In Bremen prägen Luft- und Raumfahrt, Fahrzeugbau und Hafenwirtschaft den Bedarf an Mechatronikern. Die Anlagen sind groß und komplex, die Arbeitgeber häufig tarifgebunden — das zeigt sich bei Urlaubstagen, Zulagen und Altersvorsorge. Für Servicetechniker mit Kundeneinsatz ist das Einsatzgebiet meist regional zugeschnitten, Übernachtungen bleiben die Ausnahme.",
};

export function roleCityNote(roleSlug: string, citySlug: string): string | undefined {
  return roleCityNotes[`${roleSlug}/${citySlug}`];
}
