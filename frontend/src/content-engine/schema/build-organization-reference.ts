// Erzeugt ausschließlich eine Referenz auf die zentrale Organization-Entität.
// Niemals eine vollständige Organization (die lebt global in layout.tsx).
import { company } from "../../content/company";
import type { OrganizationReference } from "./types";

export function buildOrganizationReference(): OrganizationReference {
  return { "@id": company.organizationId };
}
