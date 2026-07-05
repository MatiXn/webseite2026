import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talente finden – Fachkräfte für Ihr Unternehmen",
  description: "Sie suchen Elektroniker, SPS-Programmierer oder Bauleiter? PHE-Perm Engineering vermittelt geprüfte Fachkräfte in Festanstellung – schnell und passgenau.",
  alternates: { canonical: "/talente-finden" },
};

export default function TalenteFindenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
