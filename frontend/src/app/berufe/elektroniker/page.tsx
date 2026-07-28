import type { Metadata } from "next";
import { elektroniker } from "../../../content/professions/elektroniker";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(elektroniker);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function ElektronikerPage() {
  return <ProfessionPageTemplate profession={elektroniker} />;
}
