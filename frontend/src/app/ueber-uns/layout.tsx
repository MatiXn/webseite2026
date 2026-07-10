import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns – Wer ist PHE-Perm Engineering?",
  description:
    "PHE-Perm Engineering Ingenieure & Techniker GmbH aus Düsseldorf: Seriöse Personalvermittlung seit Jahren – ausschließlich Festanstellungen, keine Zeitarbeit. Wir vermitteln Elektrotechnik, IT und Bau-Spezialisten bundesweit.",
  keywords: [
    "PHE-Perm Engineering", "Personalvermittlung Düsseldorf", "seriöse Personalvermittlung",
    "Recruiting Elektrotechnik", "Headhunter IT", "kein Zeitarbeit", "Festanstellung Vermittler",
  ],
  openGraph: {
    title: "Über uns – PHE-Perm Engineering",
    description: "Spezialisierte Personalvermittlung für IT, Elektrotechnik & Bau. Sitz Düsseldorf, bundesweit tätig.",
    url: "https://www.phe-perm.de/ueber-uns",
  },
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
