import { MetadataRoute } from "next";
import { JOBS } from "./jobs/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.phe-perm.de";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/jobs`,                lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/talente-finden`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ueber-uns`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kontakt`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/lebenslauf-erstellen`,lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/impressum`,           lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/datenschutz`,         lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/agb`,                 lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const jobPages: MetadataRoute.Sitemap = JOBS.map(job => ({
    url: `${base}/jobs/${job.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...jobPages];
}
