import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie PHE-Perm Engineering in Düsseldorf – per Formular, E-Mail, Telefon oder WhatsApp. Wir melden uns innerhalb von 24 Stunden.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
