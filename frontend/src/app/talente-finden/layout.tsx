import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talente finden – Fachkräfte für Ihr Unternehmen",
  description: "Sie suchen Elektroniker, SPS-Programmierer oder Bauleiter? PHE-Perm Engineering vermittelt geprüfte Fachkräfte in Festanstellung – schnell und passgenau.",
  alternates: { canonical: "/talente-finden" },
  openGraph: {
    title: "Talente finden – Fachkräfte für Ihr Unternehmen | PHE-Perm Engineering",
    description: "Personalvermittlung für Technik-Fachkräfte: Elektroniker, SPS-Programmierer, Mechatroniker & mehr. Erfolgsbasiert, nur Festanstellung, deutschlandweit.",
    url: "https://www.phe-perm.de/talente-finden",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talente finden – Fachkräfte für Ihr Unternehmen",
    description: "Personalvermittlung für Technik-Fachkräfte: erfolgsbasiert, nur Festanstellung, deutschlandweit.",
  },
};

export default function TalenteFindenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
