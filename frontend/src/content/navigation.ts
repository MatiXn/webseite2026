// Navigationsdaten – nur Daten, keine React-Komponenten.
// Spiegelt die aktuell verwendete Haupt- und Footer-Navigation wider.
import { contact } from "./contact";

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

export type FooterColumn = {
  readonly title: string;
  readonly items: readonly NavItem[];
};

export type Navigation = {
  readonly main: readonly NavItem[];
  readonly footer: readonly FooterColumn[];
  readonly legal: readonly NavItem[];
};

export const navigation = {
  main: [
    { label: "Für Unternehmen", href: "/technische-personalvermittlung" },
    { label: "Jobs", href: "/jobs" },
    { label: "Lebenslauf erstellen", href: "/lebenslauf-erstellen" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  footer: [
    {
      title: "Für Bewerber",
      items: [
        { label: "Stellenangebote", href: "/jobs" },
        { label: "Technische Berufe", href: "/berufe" },
        { label: "Lebenslauf erstellen", href: "/lebenslauf-erstellen" },
        { label: "Jetzt bewerben", href: contact.whatsappLink, external: true },
      ],
    },
    {
      title: "Unternehmen",
      items: [
        { label: "Technische Personalvermittlung", href: "/technische-personalvermittlung" },
        { label: "Über PHE", href: "/ueber-uns" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
    {
      title: "Rechtliches",
      items: [
        { label: "Impressum", href: "/impressum" },
        { label: "Datenschutz", href: "/datenschutz" },
        { label: "AGB", href: "/agb" },
      ],
    },
  ],
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
  ],
} as const satisfies Navigation;
