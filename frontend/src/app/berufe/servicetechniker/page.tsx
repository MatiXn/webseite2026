import type { Metadata } from "next";
import { servicetechniker } from "../../../content/professions/servicetechniker";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(servicetechniker);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function ServicetechnikerPage() {
  return <ProfessionPageTemplate profession={servicetechniker} />;
}
