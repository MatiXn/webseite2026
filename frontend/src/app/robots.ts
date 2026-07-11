import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: "https://phe-perm.de/sitemap.xml",
    host: "https://phe-perm.de",
  };
}
