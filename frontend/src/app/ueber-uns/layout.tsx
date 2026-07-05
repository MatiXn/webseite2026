import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "PHE-Perm Engineering Ingenieure & Techniker GmbH aus Düsseldorf: spezialisierte Personalvermittlung für Elektrotechnik, IT und Bau – ausschließlich Festanstellungen.",
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
