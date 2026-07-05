import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stellenangebote – Elektrotechnik, IT & Bau",
  description: "Aktuelle Jobs in Festanstellung: Elektroniker, SPS-Programmierer, Mechatroniker, Bauleiter u.v.m. Bundesweit, kostenlos für Bewerber. Mit Umkreissuche.",
  alternates: { canonical: "/jobs" },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
