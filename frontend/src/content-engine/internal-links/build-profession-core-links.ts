// Kernziele einer Profession: Parent, Jobs, Lebenslauf, Personalvermittlung, Kontakt.
// hrefs stammen aus profession.internalLinks (Config), Labels aus zentralen Konstanten.
import type { ProfessionContent } from "../../content/professions/types";
import type { InternalLink } from "./types";
import { CORE_LINK_LABELS } from "./constants";

export function buildProfessionCoreLinks(profession: ProfessionContent): readonly InternalLink[] {
  const il = profession.internalLinks;
  return [
    { label: CORE_LINK_LABELS.parent, href: il.parent, type: "parent", audience: "both", priority: "secondary", source: "profession-config" },
    { label: CORE_LINK_LABELS.jobs, href: il.jobs, type: "jobs", audience: "candidate", priority: "primary", source: "profession-config" },
    { label: CORE_LINK_LABELS.lebenslauf, href: il.lebenslauf, type: "resume", audience: "candidate", priority: "secondary", source: "profession-config" },
    { label: CORE_LINK_LABELS.personalvermittlung, href: il.personalvermittlung, type: "service", audience: "company", priority: "primary", source: "profession-config" },
    { label: CORE_LINK_LABELS.kontakt, href: il.kontakt, type: "contact", audience: "both", priority: "secondary", source: "profession-config" },
  ];
}
