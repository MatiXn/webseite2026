import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";
import JsonLd from "./components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.phe-perm.de"),
  title: {
    default: "PHE-Perm Engineering – Personalvermittlung IT, Elektro & Bau",
    template: "%s | PHE-Perm Engineering",
  },
  description:
    "PHE-Perm Engineering vermittelt Fachkräfte kostenlos in Festanstellungen: Elektroniker, SPS-Programmierer, Mechatroniker, Bauleiter & IT-Spezialisten. Bundesweit. Antwort in 24 Stunden.",
  keywords: [
    "Personalvermittlung", "Festanstellung", "Elektrotechnik Jobs", "IT Jobs Deutschland",
    "SPS Programmierer Stelle", "Elektroniker Job", "Mechatroniker Stellenangebote",
    "Bauleiter Jobs", "Jobvermittlung kostenlos", "PHE-Perm Engineering",
    "Personalvermittlung Düsseldorf", "Job ohne Zeitarbeit", "Personalvermittler Elektro",
    "Jobs Elektrotechnik Bundesweit", "Stellenangebote IT Industrie",
  ],
  authors: [{ name: "PHE-Perm Engineering Ingenieure & Techniker GmbH" }],
  creator: "PHE-Perm Engineering",
  publisher: "PHE-Perm Engineering",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.phe-perm.de",
    siteName: "PHE-Perm Engineering",
    title: "PHE-Perm Engineering – Personalvermittlung IT, Elektro & Bau",
    description:
      "Kostenlose Personalvermittlung für Festanstellungen in IT, Elektrotechnik und Bau. Bundesweit. Antwort in 24 Stunden.",
    images: [
      {
        url: "https://www.phe-perm.de/jobs/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PHE-Perm Engineering – Stellenangebote",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PHE-Perm Engineering – Jobs in IT, Elektro & Bau",
    description: "Kostenlose Jobvermittlung für IT, Elektro & Bau, bundesweit.",
    images: ["https://www.phe-perm.de/jobs/opengraph-image"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  verification: {},
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PHE-Perm Engineering",
  "url": "https://www.phe-perm.de",
  "description": "Kostenlose Personalvermittlung für Festanstellungen in IT, Elektrotechnik und Bau.",
  "inLanguage": "de-DE",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://www.phe-perm.de/jobs?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "EmploymentAgency"],
  "@id": "https://www.phe-perm.de/#organization",
  "name": "PHE-Perm Engineering Ingenieure & Techniker GmbH",
  "alternateName": "PHE-Perm Engineering",
  "url": "https://www.phe-perm.de",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.phe-perm.de/phe-logo.png",
    "width": 1000,
    "height": 203,
  },
  "image": "https://www.phe-perm.de/jobs/opengraph-image",
  "telephone": "+491739980100",
  "email": "info@phe-perm.de",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hüttenstraße 30",
    "addressLocality": "Düsseldorf",
    "postalCode": "40215",
    "addressCountry": "DE",
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 51.2217, "longitude": 6.7762 },
  "description":
    "PHE-Perm Engineering ist eine spezialisierte Personalvermittlung für Festanstellungen in den Bereichen IT, Elektrotechnik, Mechatronik und Bau. Kostenlos für Bewerber, bundesweit.",
  "areaServed": {
    "@type": "Country",
    "name": "Deutschland",
  },
  "serviceType": "Personalvermittlung",
  "priceRange": "Kostenlos für Bewerber",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00",
  },
  "sameAs": [
    "https://www.instagram.com/phe_perm_engineering",
    "https://www.linkedin.com/company/phe-perm-engineering",
    "https://www.wikidata.org/wiki/Q140572942",
  ],
  "knowsAbout": [
    "Elektrotechnik", "SPS-Programmierung", "Mechatronik",
    "IT-Personalvermittlung", "Bauleitung", "Festanstellung", "Recruiting",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <JsonLd data={websiteSchema} />
        <JsonLd data={orgSchema} />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
