import type { Metadata } from "next";
import { elektronikerEnergieGebaeudetechnik } from "../../../content/professions/elektroniker-energie-gebaeudetechnik";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(elektronikerEnergieGebaeudetechnik);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function ElektronikerEnergieGebaeudetechnikPage() {
  return <ProfessionPageTemplate profession={elektronikerEnergieGebaeudetechnik} />;
}
