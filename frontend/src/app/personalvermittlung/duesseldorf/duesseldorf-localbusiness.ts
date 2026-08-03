// Düsseldorf-Sonderfall (EPIC 010B): LocalBusiness-Schema-Knoten NUR für Düsseldorf –
// den einzigen bestätigten Bürostandort. Bewusst NICHT im generischen buildCitySchema.
//
// - @id identisch zur globalen Organization (company.organizationId): Google merged
//   beide Knoten zu EINER Entität und ergänzt nur den lokalen Bezug. Keine zweite
//   Organisation.
// - NAP + Öffnungszeiten ausschließlich aus der zentralen company-Registry.
// - geo bewusst NICHT ausgegeben (Parität zur bisherigen Seite; kein widersprüchlicher
//   Wert). Die Adresse genügt Google zur Geokodierung.
// - keine AggregateRating, keine Reviews, kein erfundener zusätzlicher Standort.
import { company } from "../../../content/company";

export function buildDuesseldorfLocalBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": company.organizationId,
    name: company.legalName,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.street,
      addressLocality: company.city,
      postalCode: company.postalCode,
      addressCountry: company.country,
    },
    areaServed: { "@type": "City", name: "Düsseldorf" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...company.openingHours.days],
      opens: company.openingHours.opens,
      closes: company.openingHours.closes,
    },
  };
}
