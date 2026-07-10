import { redirect } from "next/navigation";
import { JOBS } from "../data";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = JOBS.find(j => j.id === params.id);
  if (!job) return {};

  const title = `${job.title} – PHE-Perm Engineering`;
  const description = job.description
    ? job.description.slice(0, 155)
    : `Jetzt bewerben: ${job.title} in ${job.city}. ${job.salary}. Festanstellung, kostenlos für Bewerber.`;

  const ogImageUrl = `https://www.phe-perm.de/jobs/${params.id}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.phe-perm.de/jobs/${params.id}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: job.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export function generateStaticParams() {
  return JOBS.map(j => ({ id: j.id }));
}

export default function JobRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/jobs?job=${params.id}`);
}
