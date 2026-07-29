import type { Metadata } from "next";
import { spsAutomatisierung } from "../../../content/professions/sps-automatisierung";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(spsAutomatisierung);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function SpsAutomatisierungPage() {
  return <ProfessionPageTemplate profession={spsAutomatisierung} />;
}
