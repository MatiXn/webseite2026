import { notFound } from "next/navigation";
import { JOBS } from "../data";
import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";
import JobRedirect from "./JobRedirect";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = JOBS.find(j => j.id === params.id);
  if (!job) return {};

  const title = `${job.title} in ${job.city} – Festanstellung | PHE-Perm Engineering`;
  const description = job.description
    ? `${job.title} in ${job.city}: ${job.description.slice(0, 120)}… Festanstellung, ${job.salary}. Kostenlos bewerben.`
    : `Jetzt als ${job.title} in ${job.city} bewerben. ${job.salary}. Festanstellung, kostenlos – PHE-Perm Engineering.`;

  const ogImageUrl = `https://www.phe-perm.de/jobs/${params.id}/opengraph-image`;

  return {
    title,
    description,
    keywords: [job.title, job.city, "Festanstellung", "Job", "PHE-Perm Engineering", ...job.tags],
    openGraph: {
      title,
      description,
      url: `https://www.phe-perm.de/jobs/${params.id}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${job.title} – ${job.city}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
    alternates: { canonical: `/jobs/${params.id}` },
  };
}

export function generateStaticParams() {
  return JOBS.map(j => ({ id: j.id }));
}

export default function JobPage({ params }: { params: { id: string } }) {
  const job = JOBS.find(j => j.id === params.id);
  if (!job) notFound();

  const validThrough = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || `${job.title} in ${job.city}. Festanstellung, kostenlos für Bewerber.`,
    "datePosted": "2026-01-01",
    "validThrough": validThrough,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "PHE-Perm Engineering Ingenieure & Techniker GmbH",
      "sameAs": "https://www.phe-perm.de",
      "logo": "https://www.phe-perm.de/phe-logo.png",
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city.split(",")[0].trim(),
        "addressCountry": "DE",
      },
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": { "@type": "QuantitativeValue", "unitText": "YEAR", "description": job.salary },
    },
    "skills": job.tags.join(", "),
    "benefits": job.benefits?.join(", ") || "Festanstellung, Vollzeit",
    "url": `https://www.phe-perm.de/jobs/${job.id}`,
    "applicantLocationRequirements": { "@type": "Country", "name": "Deutschland" },
    "directApply": true,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phe-perm.de" },
      { "@type": "ListItem", "position": 2, "name": "Stellenangebote", "item": "https://www.phe-perm.de/jobs" },
      { "@type": "ListItem", "position": 3, "name": job.title, "item": `https://www.phe-perm.de/jobs/${job.id}` },
    ],
  };

  return (
    <>
      <JsonLd data={jobPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Client-side redirect so users land on /jobs with the modal open */}
      <JobRedirect jobId={job.id} />
    </>
  );
}
