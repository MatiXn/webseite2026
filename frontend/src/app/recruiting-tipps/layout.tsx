import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiting-Tipps für technische Fachkräfte | PHE-Perm",
  description:
    "Praktische Tipps für Ihre Bewerbung als technische Fachkraft: Lebenslauf ohne Anschreiben, Direktvermittlung in Festanstellung, kostenlose und vertrauliche Betreuung – von PHE-Perm.",
  keywords: [
    "Recruiting-Tipps", "Bewerbungstipps technische Fachkräfte", "Lebenslauf Elektrotechnik",
    "Bewerbung ohne Anschreiben", "Direktvermittlung Festanstellung", "PHE-Perm",
  ],
  alternates: { canonical: "/recruiting-tipps" },
  openGraph: {
    title: "Recruiting-Tipps für technische Fachkräfte | PHE-Perm",
    description:
      "So bewerben Sie sich als technische Fachkraft erfolgreich – ohne Anschreiben, direkt in Festanstellung, kostenlos und vertraulich.",
    url: "https://www.phe-perm.de/recruiting-tipps",
    type: "website",
  },
};

export default function RecruitingTippsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
