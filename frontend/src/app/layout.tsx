import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "PHE-Perm Engineering – Jobs in IT, Elektro & Bau", template: "%s | PHE-Perm Engineering" },
  description: "PHE-Perm Engineering vermittelt Fachkräfte in Festanstellung in IT, Elektrotechnik und Bau. Kostenlos für Bewerber. Bundesweit. Jetzt via WhatsApp bewerben.",
  keywords: ["Personalvermittlung", "Elektrotechnik Jobs", "IT Jobs Deutschland", "Bauleiter Stellenangebote", "SPS Programmierer Jobs", "Elektroniker Festanstellung", "Jobvermittlung kostenlos", "PHE-Perm Engineering", "Düsseldorf Personalvermittlung"],
  authors: [{ name: "PHE-Perm Engineering Ingenieure & Techniker GmbH" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://phe-perm.de",
    siteName: "PHE-Perm Engineering",
    title: "PHE-Perm Engineering – Jobs in IT, Elektro & Bau",
    description: "Kostenlose Personalvermittlung für Festanstellungen in IT, Elektrotechnik und Bau. Jetzt via WhatsApp bewerben.",
    images: [{ url: "https://phe-perm.de/phe-logo.png", width: 1000, height: 203, alt: "PHE-Perm Engineering Logo" }],
  },
  twitter: { card: "summary", title: "PHE-Perm Engineering", description: "Kostenlose Jobvermittlung für IT, Elektro & Bau, bundesweit." },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://phe-perm.de" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
