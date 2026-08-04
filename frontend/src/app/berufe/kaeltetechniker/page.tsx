import type { Metadata } from "next";
import { kaeltetechniker } from "../../../content/professions/kaeltetechniker";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(kaeltetechniker);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function KaeltetechnikerPage() {
  return <ProfessionPageTemplate profession={kaeltetechniker} />;
}
