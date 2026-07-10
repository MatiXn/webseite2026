import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stellenangebote – Elektrotechnik, SPS, IT & Bau | Festanstellung",
  description:
    "Aktuelle Jobs in Festanstellung bundesweit: Elektroniker, SPS-Programmierer, Mechatroniker, Bauleiter & IT-Spezialisten. Kostenlos bewerben, Antwort in 24 Stunden. Mit PLZ-Umkreissuche.",
  keywords: [
    "Elektroniker Job", "SPS Programmierer Stelle", "Mechatroniker Stellenangebote",
    "Bauleiter Job", "IT Jobs Festanstellung", "Elektrotechnik Jobs bundesweit",
    "Jobs ohne Zeitarbeit", "Stellenangebote Industrie", "Personalvermittlung kostenlos",
    "Jobs Elektro NRW", "Elektriker Festanstellung", "Automatisierungstechniker Stelle",
  ],
  openGraph: {
    title: "Stellenangebote – Festanstellung IT, Elektro & Bau",
    description: "Bundesweite Jobs in Festanstellung. Elektroniker, SPS, Mechatronik, Bau, IT. Kostenlos bewerben.",
    url: "https://www.phe-perm.de/jobs",
    images: [{ url: "https://www.phe-perm.de/jobs/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.phe-perm.de/jobs/opengraph-image"] },
  alternates: { canonical: "/jobs" },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
