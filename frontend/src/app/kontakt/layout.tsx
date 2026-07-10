import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt – PHE-Perm Engineering Düsseldorf",
  description:
    "Kontaktieren Sie PHE-Perm Engineering in Düsseldorf – per WhatsApp, E-Mail oder Telefon. Wir antworten innerhalb von 24 Stunden. Hüttenstraße 30, 40215 Düsseldorf.",
  keywords: [
    "PHE-Perm Engineering Kontakt", "Personalvermittlung Düsseldorf Telefon",
    "Job anfragen WhatsApp", "Bewerbung einreichen", "Personalberater Düsseldorf",
  ],
  openGraph: {
    title: "Kontakt – PHE-Perm Engineering",
    description: "Jetzt Kontakt aufnehmen – WhatsApp, E-Mail oder Telefon. Antwort in 24 h.",
    url: "https://www.phe-perm.de/kontakt",
  },
  alternates: { canonical: "/kontakt" },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
