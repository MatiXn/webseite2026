import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: "https://www.phe-perm.de/sitemap.xml",
    host: "https://www.phe-perm.de",
  };
}
