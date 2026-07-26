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
  phone: "+4921115863100",
  email: "info@phe-perm.de",
  whatsappNumber: "491739980100",
  whatsappLink: "https://wa.me/491739980100",
  recruiting: "recruiting@phe-perm.de",
  applications: "bewerbung@phe-perm.de",
  sales: "info@phe-perm.de",
  support: "info@phe-perm.de",
  openingHours: company.openingHours,
} as const satisfies ContactChannels;
