import type { NextConfig } from "next";

// ── Content Security Policy ────────────────────────────────────────────────────
// Alle externen Quellen explizit erlaubt — kein Wildcard.
const CSP = [
  "default-src 'self'",
  // Next.js App Router benötigt 'unsafe-inline' für Hydration-Inline-Scripts;
  // challenges.cloudflare.com für das Turnstile-Bot-Schutz-Widget
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  // Next.js CSS-in-JS + Styles braucht unsafe-inline
  "style-src 'self' 'unsafe-inline'",
  // data: für Base64-Previews, blob: für File-Viewer
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  // API-Calls: eigene Domain + Supabase + Backend + Nominatim (Standortsuche)
  `connect-src 'self' https://nominatim.openstreetmap.org ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://*.supabase.co"} ${process.env.NEXT_PUBLIC_API_URL ?? ""}`,
  "worker-src 'self' blob:",
  // Turnstile rendert sein Widget in einem iframe
  "frame-src https://challenges.cloudflare.com",
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

  async redirects() {
    return [
      { source: "/talente-finden", destination: "/technische-personalvermittlung", permanent: true },
    ];
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
