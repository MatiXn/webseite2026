// Zentrale Unternehmensdaten (NAP + Identität). Einzige Quelle der Wahrheit.
// Reine Daten – keine Funktionen, keine React-Komponenten.

export type Geo = {
  readonly latitude: number;
  readonly longitude: number;
};

export type OpeningHours = {
  readonly days: readonly string[];
  readonly opens: string; // "HH:MM"
  readonly closes: string; // "HH:MM"
};

export type Company = {
  readonly legalName: string;
  readonly name: string; // Marken-/Kurzform für Anzeige
  readonly shortName: string;
  readonly street: string;
  readonly postalCode: string;
  readonly city: string;
  readonly country: string; // ISO 3166-1 alpha-2
  readonly phone: string; // Festnetz, E.164 (primäre Telefonnummer)
  readonly email: string; // allgemeine Adresse
  readonly website: string;
  readonly logo: string; // absolute URL
  readonly geo: Geo; // verifiziert aus dem Google-Business-Profile
  readonly organizationId: string; // Schema.org @id der Organisation
  readonly openingHours: OpeningHours;
};

export const company = {
  legalName: "PHE-Perm Engineering Ingenieure & Techniker GmbH",
  name: "PHE-Perm Engineering",
  shortName: "PHE-Perm",
  street: "Hüttenstraße 30",
  postalCode: "40215",
  city: "Düsseldorf",
  country: "DE",
  phone: "+4921115863100",
  email: "info@phe-perm.de",
  website: "https://www.phe-perm.de",
  logo: "https://www.phe-perm.de/phe-logo.png",
  geo: { latitude: 51.216938, longitude: 6.7835745 },
  organizationId: "https://www.phe-perm.de/#organization",
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
} as const satisfies Company;
