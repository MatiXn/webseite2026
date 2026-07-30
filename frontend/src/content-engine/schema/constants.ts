// Zentrale Schema-Konstanten. Markenwerte stammen aus der Company Registry
// (kein doppelter String); Fragmente definieren die @id-Strategie je Knotentyp.

export const SCHEMA_CONTEXT = "https://schema.org";

// @id-Fragmente, angehängt an die Canonical der Seite -> stabile, eindeutige @ids.
export const SCHEMA_FRAGMENTS = {
  collectionPage: "#collectionpage",
  breadcrumb: "#breadcrumb",
  faq: "#faq",
  itemList: "#joblist",
} as const;

// Sichtbare Breadcrumb-Beschriftungen (dieselbe Quelle, die die UI später rendert):
// Startseite -> Berufe -> Profession. Der Hub-Pfad kommt aus profession.internalLinks.parent.
export const BREADCRUMB_HOME = { name: "Startseite", path: "/" } as const;
export const PROFESSION_HUB_NAME = "Berufe";
export const INDUSTRY_HUB_NAME = "Branchen";

// Schema-Typen, die dieser Builder bewusst NIE erzeugt (Prüfgrundlage für Analyse/Tests).
export const FORBIDDEN_SCHEMA_TYPES: readonly string[] = [
  "Organization",
  "LocalBusiness",
  "EmploymentAgency",
  "JobPosting",
  "Service",
  "Review",
  "AggregateRating",
  "Offer",
];
