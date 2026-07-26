// Datenmodell der Profession Registry. Reine Typen + geteilte statische Daten.
// Keine Funktionen, kein JSX, kein React, kein any.
//
// DRY: FAQ nutzt den readonly FaqEntry-Typ der globalen Registry.
// Unternehmensstammdaten (Telefon/E-Mail/Adresse/Geo/Öffnungszeiten/@id) werden
// NICHT hier gepflegt, sondern in company.ts/contact.ts.
// Das Vermittlungsmodell (Festanstellung, keine Zeitarbeit, kostenlos …) ist
// unternehmensweit und liegt in trust.ts (trust.model) – bewusst NICHT je Beruf.
import type { FaqEntry } from "../faq";

export type ProfessionStatus = "published" | "draft";
export type SearchIntent = "transactional" | "commercial" | "informational" | "mixed";

// Job-Kategorien aus der zentralen Job-Datenquelle (src/app/jobs/data.ts).
export type JobCategory = "elektro" | "mechatronik" | "it" | "bau";

// Verhalten, wenn keine passenden Stellen gefunden werden.
export type JobMatchFallback = "hint-and-joblist" | "hide";

export type Cta = {
  readonly label: string;
  readonly href: string;
};

export type ProfessionSpecialization = {
  readonly title: string;
  readonly description?: string;
  readonly focus: readonly string[]; // typische Schwerpunkte
};

export type ProfessionIndustry = {
  readonly name: string; // Branche/Einsatzbereich
  readonly note: string; // kurze sachliche Einordnung
};

export type ProfessionRequirement = {
  readonly label: string;
  readonly hint?: string; // weiche Einschränkung, z. B. "je nach Stelle"
};

export type ProfessionProcessStep = {
  readonly title: string;
  readonly description: string;
};

export type JobMatchConfig = {
  readonly category?: readonly JobCategory[]; // strukturiertes Signal (höchste Priorität)
  readonly tags?: readonly string[]; // strukturierte Job-Tags
  readonly keywords?: readonly string[]; // Titel-Begriffe
  readonly excludeKeywords?: readonly string[]; // Ausschluss
  readonly maxJobs: number; // maximal sichtbare Stellen
  readonly fallback: JobMatchFallback;
};

export type ProfessionInternalLinks = {
  readonly parent: string; // Hub, z. B. "/berufe"
  readonly jobs: string;
  readonly lebenslauf: string;
  readonly personalvermittlung: string;
  readonly kontakt: string;
  readonly relatedProfessions: readonly string[]; // NUR published Slugs (keine toten Links)
};

export type ProfessionHero = {
  readonly eyebrow?: string;
  readonly headline: string;
  readonly intro: string;
  readonly primaryCta: Cta;
  readonly secondaryCta: Cta;
};

export type ProfessionOverview = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

export type ProfessionAudienceCta = {
  readonly title: string;
  readonly text: string;
  readonly primaryCta: Cta;
  readonly secondaryCta?: Cta;
};

export type ProfessionPublication = {
  readonly published: boolean;
  readonly indexable: boolean;
  readonly includeInSitemap: boolean;
  readonly showInProfessionHub: boolean;
  readonly showRelatedLinks: boolean;
};

export type ProfessionContent = {
  // Identität
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly status: ProfessionStatus;
  readonly parentSlug: string;
  readonly jobCategory: JobCategory | null; // primäre Kategorie (Matching-Details in jobMatch)
  // SEO
  readonly metadataTitle: string;
  readonly metadataDescription: string;
  readonly canonicalPath: string;
  readonly primaryKeyword: string;
  readonly secondaryKeywords: readonly string[];
  readonly searchIntent: SearchIntent;
  // Hero
  readonly hero: ProfessionHero;
  // Berufsbild
  readonly overview: ProfessionOverview;
  // Fachrichtungen/Spezialisierungen
  readonly specializations: readonly ProfessionSpecialization[];
  // Aufgaben
  readonly tasks: readonly string[];
  // Einsatzbereiche
  readonly industries: readonly ProfessionIndustry[];
  // Anforderungen
  readonly requirements: readonly ProfessionRequirement[];
  // Bewerbungsprozess (i. d. R. DEFAULT_PROCESS)
  readonly process: readonly ProfessionProcessStep[];
  // Bewerber-/Unternehmens-CTA
  readonly applicantCta: ProfessionAudienceCta;
  readonly employerCta: ProfessionAudienceCta;
  // FAQ (globaler readonly FaqEntry-Typ, DRY)
  readonly faq: readonly FaqEntry[];
  // Interne Verlinkung
  readonly internalLinks: ProfessionInternalLinks;
  // Job-Matching
  readonly jobMatch: JobMatchConfig;
  // Veröffentlichung
  readonly publication: ProfessionPublication;
};

// Geteilter, beruf-agnostischer Vermittlungsprozess (DRY statt Duplizierung je Beruf).
export const DEFAULT_PROCESS = [
  { title: "Interesse oder Bewerbung übermitteln", description: "Per Formular, E-Mail oder WhatsApp – ohne Anschreiben." },
  { title: "Persönliches Gespräch", description: "Wir sprechen über Ihre Erfahrung, Ihren Wunschstandort und Ihre Ziele." },
  { title: "Qualifikation und Wünsche klären", description: "Wir ordnen Ihr Profil den passenden Fachrichtungen zu." },
  { title: "Passende Positionen abstimmen", description: "Sie entscheiden, welche Stellen für Sie in Frage kommen." },
  { title: "Vorstellung beim Unternehmen", description: "Wir stellen den Kontakt her und bereiten das Gespräch vor." },
  { title: "Begleitung bis zur Entscheidung", description: "Wir begleiten Sie bis zur Vertragsentscheidung." },
] as const satisfies readonly ProfessionProcessStep[];

// HINWEIS für EPIC 006C (Validator): Rein typseitig ist die Konsistenz
// "published ⇒ indexable && includeInSitemap && showInProfessionHub" nicht
// erzwingbar. Ebenso muss ein Runtime-Validator prüfen, dass relatedProfessions
// ausschließlich auf published Slugs zeigen. Bis dahin: manuelle Disziplin.
