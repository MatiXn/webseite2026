// Kontaktkanäle. Reine Daten. Öffnungszeiten referenzieren company (DRY).
import { company, type OpeningHours } from "./company";

export type ContactChannels = {
  readonly phone: string; // Festnetz, E.164 (primär)
  readonly email: string; // allgemein
  readonly whatsappNumber: string; // Ziffern ohne "+" für wa.me
  readonly whatsappLink: string;
  readonly recruiting: string; // Recruiting/Unternehmensanfragen
  readonly applications: string; // Bewerbungen
  readonly sales: string; // kein eigenes Postfach – Sammeladresse
  readonly support: string; // kein eigenes Postfach – Sammeladresse
  readonly openingHours: OpeningHours;
};

export const contact = {
  phone: company.phone, // Haupttelefon nur in company.ts gepflegt
  email: company.email, // Haupt-E-Mail nur in company.ts gepflegt
  whatsappNumber: "491739980100",
  whatsappLink: "https://wa.me/491739980100",
  recruiting: "recruiting@phe-perm.de",
  applications: "bewerbung@phe-perm.de",
  sales: company.email, // kein eigenes Postfach – Sammeladresse (company)
  support: company.email, // kein eigenes Postfach – Sammeladresse (company)
  openingHours: company.openingHours,
} as const satisfies ContactChannels;
