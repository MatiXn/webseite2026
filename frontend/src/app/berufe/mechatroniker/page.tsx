import type { Metadata } from "next";
import { mechatroniker } from "../../../content/professions/mechatroniker";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(mechatroniker);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function MechatronikerPage() {
  return <ProfessionPageTemplate profession={mechatroniker} />;
}
