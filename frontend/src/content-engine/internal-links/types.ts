// Typen des Internal-Link-Builders. Kein any, alle Felder readonly.
import type { ProfessionContent } from "../../content/professions/types";

export type InternalLinkType =
  | "parent"
  | "jobs"
  | "job-detail"
  | "profession"
  | "resume"
  | "contact"
  | "service"
  | "breadcrumb"
  | "cta";

export type InternalLinkAudience = "candidate" | "company" | "both";

export type InternalLinkPriority = "primary" | "secondary" | "contextual";

export type InternalLinkSource =
  | "profession-config"
  | "profession-registry"
  | "industry-config"
  | "job-matcher"
  | "system";

export type InternalLink = {
  readonly label: string;
  readonly href: string;
  readonly type: InternalLinkType;
  readonly audience: InternalLinkAudience;
  readonly priority: InternalLinkPriority;
  readonly source: InternalLinkSource;
  readonly professionSlug?: string;
  readonly jobId?: string;
  readonly external?: boolean;
};

// Registry-Ausschnitt für die Related-Profession-Auflösung (O(1)-Lookup).
export type InternalLinkRegistry = {
  readonly professionBySlug: Readonly<Record<string, ProfessionContent | undefined>>;
};

export type LinkValidationCode =
  | "LINK_LABEL_EMPTY"
  | "LINK_HREF_EMPTY"
  | "LINK_HREF_HAS_SPACE"
  | "LINK_HREF_JAVASCRIPT"
  | "LINK_HREF_EXTERNAL_NOT_HTTPS"
  | "LINK_HREF_INVALID_INTERNAL"
  | "LINK_HREF_DOUBLE_SLASH"
  | "LINK_HREF_NUMERIC_JOB"
  | "LINK_HREF_FORBIDDEN"
  | "LINK_HREF_EMPTY_QUERY";

export type LinkValidationResult = {
  readonly valid: boolean;
  readonly codes: readonly LinkValidationCode[];
};

export type InternalLinkWarning = {
  readonly code: string;
  readonly href: string;
  readonly message: string;
};

export type DeduplicationResult = {
  readonly links: readonly InternalLink[];
  readonly warnings: readonly InternalLinkWarning[];
};

export type ProfessionInternalLinksResult = {
  readonly breadcrumbs: readonly InternalLink[];
  readonly coreLinks: readonly InternalLink[];
  readonly relatedProfessionLinks: readonly InternalLink[];
  readonly jobLinks: readonly InternalLink[];
  readonly candidateLinks: readonly InternalLink[];
  readonly companyLinks: readonly InternalLink[];
  readonly allLinks: readonly InternalLink[];
  readonly warnings: readonly InternalLinkWarning[];
};

export type IndustryInternalLinksResult = {
  readonly breadcrumbs: readonly InternalLink[];
  readonly coreLinks: readonly InternalLink[];
  readonly relevantProfessionLinks: readonly InternalLink[];
  readonly jobLinks: readonly InternalLink[];
  readonly candidateLinks: readonly InternalLink[];
  readonly companyLinks: readonly InternalLink[];
  readonly allLinks: readonly InternalLink[];
  readonly warnings: readonly InternalLinkWarning[];
};
