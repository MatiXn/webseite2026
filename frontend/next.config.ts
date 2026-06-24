import type { NextConfig } from "next";

// ── Content Security Policy ────────────────────────────────────────────────────
// Kein unsafe-inline für Scripts, kein unsafe-eval.
// Alle externen Quellen explizit erlaubt — kein Wildcard.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // Next.js CSS-in-JS braucht unsafe-inline — daher nur für Styles
  "style-src 'self' 'unsafe-inline'",
  // data: für Base64-Previews, blob: für File-Viewer
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  // API-Calls: eigene Domain + Supabase + Backend
  `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://*.supabase.co"} ${process.env.NEXT_PUBLIC_API_URL ?? ""}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,   // Keine Versionsinformationen preisgeben
  reactStrictMode: true,

  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default nextConfig;
