import type { Metadata } from "next";
import { servicetechnikerElektrotechnik } from "../../../content/professions/servicetechniker-elektrotechnik";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(servicetechnikerElektrotechnik);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function ServicetechnikerElektrotechnikPage() {
  return <ProfessionPageTemplate profession={servicetechnikerElektrotechnik} />;
}
