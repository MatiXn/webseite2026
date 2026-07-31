import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedIndustries, industryBySlug } from "../../../content/industries";
import { buildIndustryMetadata } from "../../../content-engine/metadata";
import { IndustryPageTemplate } from "../../../content-engine/templates";
import type { IndustryContent } from "../../../content/industries/types";

// Nur veröffentlichte Branchen sind sichtbar; Drafts werden nie generiert.
function publishedIndustryOrNull(slug: string): IndustryContent | null {
  const industry = industryBySlug[slug];
  return industry && industry.status === "published" && industry.publication.published ? industry : null;
}

export function generateStaticParams() {
  return publishedIndustries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = publishedIndustryOrNull(slug);
  if (!industry) return {};
  return buildIndustryMetadata(industry);
}

// Dünne Route: auflösen, validieren, an das berufsneutrale Industry-Template durchreichen.
export default async function BranchePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = publishedIndustryOrNull(slug);
  if (!industry) notFound();
  return <IndustryPageTemplate industry={industry} />;
}
