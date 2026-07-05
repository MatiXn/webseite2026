import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lebenslauf erstellen – kostenloser CV-Generator",
  description: "Erstellen Sie in wenigen Minuten einen professionellen Lebenslauf nach DIN 5008 – kostenlos, ohne Anmeldung, als PDF. Mit Foto-Upload und mehreren Designs.",
  alternates: { canonical: "/lebenslauf-erstellen" },
};

export default function LebenslaufLayout({ children }: { children: React.ReactNode }) {
  return children;
}
