import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lebenslauf erstellen – kostenloser CV-Generator",
  description: "Erstellen Sie in wenigen Minuten einen professionellen Lebenslauf nach DIN 5008 – kostenlos, ohne Anmeldung, als PDF. Mit Foto-Upload und mehreren Designs.",
  alternates: { canonical: "/lebenslauf-erstellen" },
  openGraph: {
    title: "Lebenslauf erstellen – kostenloser CV-Generator | PHE-Perm Engineering",
    description: "Professioneller Lebenslauf in 5 Minuten: 4 Vorlagen, Foto-Upload, PDF-Export – kostenlos und ohne Registrierung.",
    url: "https://www.phe-perm.de/lebenslauf-erstellen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lebenslauf erstellen – kostenloser CV-Generator",
    description: "Professioneller Lebenslauf in 5 Minuten: 4 Vorlagen, Foto-Upload, PDF-Export – kostenlos.",
  },
};

export default function LebenslaufLayout({ children }: { children: React.ReactNode }) {
  return children;
}
