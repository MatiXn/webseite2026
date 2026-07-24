import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technische Personalvermittlung – Fachkräfte in Festanstellung",
  description: "PHE-Perm ist die spezialisierte technische Personalvermittlung: Elektroniker, SPS-Programmierer, Mechatroniker & Servicetechniker in Festanstellung. Erfolgsbasiert, deutschlandweit.",
  alternates: { canonical: "/technische-personalvermittlung" },
  openGraph: {
    title: "Technische Personalvermittlung – Fachkräfte in Festanstellung | PHE-Perm Engineering",
    description: "Spezialisierte Personalvermittlung für Technik-Fachkräfte: erfolgsbasiert, nur Festanstellung, deutschlandweit.",
    url: "https://www.phe-perm.de/technische-personalvermittlung",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technische Personalvermittlung – Fachkräfte in Festanstellung",
    description: "Spezialisierte Personalvermittlung für Technik-Fachkräfte: erfolgsbasiert, nur Festanstellung, deutschlandweit.",
  },
};

export default function TalenteFindenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
