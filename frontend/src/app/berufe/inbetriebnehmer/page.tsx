import type { Metadata } from "next";
import { inbetriebnehmer } from "../../../content/professions/inbetriebnehmer";
import { buildProfessionMetadata } from "../../../content-engine/metadata";
import { ProfessionPageTemplate } from "../../../content-engine/templates";

// Metadata zentral aus der Registry (wirft bei ungültiger Config -> Build schlägt fehl).
export const metadata: Metadata = buildProfessionMetadata(inbetriebnehmer);

// Dünne Route: reicht die Profession-Config an das berufsneutrale Template durch.
export default function InbetriebnehmerPage() {
  return <ProfessionPageTemplate profession={inbetriebnehmer} />;
}
