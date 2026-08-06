import type { Metadata } from "next";
import { elektronikerBetriebstechnik } from "../../../content/professions/elektroniker-betriebstechnik";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(elektronikerBetriebstechnik);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function ElektronikerBetriebstechnikPage() {
  return <ProfessionPageTemplate profession={elektronikerBetriebstechnik} />;
}
