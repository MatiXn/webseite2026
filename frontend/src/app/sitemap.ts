import { MetadataRoute } from "next";
import { JOBS } from "./jobs/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.phe-perm.de";

  // Impressum/Datenschutz/AGB sind noindex und gehören deshalb NICHT in die Sitemap.
  // lastModified wird bewusst weggelassen, wo kein echtes Änderungsdatum vorliegt —
  // identische Build-Timestamps wertet Google als unglaubwürdig und ignoriert sie.
  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                           changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/jobs`,                 changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/talente-finden`,       changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ueber-uns`,            changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kontakt`,              changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/lebenslauf-erstellen`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const jobPages: MetadataRoute.Sitemap = JOBS.map(job => ({
    url: `${base}/jobs/${job.id}`,
    lastModified: new Date(job.datePosted),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...jobPages];
}
