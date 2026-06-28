"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const WA_NUMBER = "491739980100";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;
export const MAIL_APPLY = "bewerbung@phe-perm.de";

const NAV_LINKS: [string, string][] = [
  ["Startseite", "/"],
  ["Stellenangebote", "/jobs"],
  ["Lebenslauf erstellen", "/lebenslauf-erstellen"],
  ["Talente finden", "/talente-finden"],
  ["So funktioniert's", "/#how"],
  ["Über uns", "/ueber-uns"],
];

const WhatsAppIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
      padding: "0 32px",
      height: 58,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Image src="/phe-logo.png" alt="PHE Perm Engineering" height={36} width={180}
          style={{ height: 36, width: "auto" }} priority />
      </Link>

      {/* Center links */}
      <ul style={{
        display: "flex", gap: 4, listStyle: "none", margin: 0, padding: 0,
        position: "absolute", left: "50%", transform: "translateX(-50%)",
      }}>
        {NAV_LINKS.map(([label, href]) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href.split("#")[0]) && !href.startsWith("/#"));
          const isTalente = href === "/talente-finden";
          return (
            <li key={label}>
              <Link href={href} style={{
                display: "inline-flex", alignItems: "center",
                fontSize: 13, fontWeight: active ? 600 : 400,
                letterSpacing: "0.005em",
                color: isTalente
                  ? (active ? "#1a4ec8" : "#1d57e0")
                  : active ? "#1a4ec8" : "rgba(20,30,60,0.75)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                background: isTalente && !active
                  ? "rgba(29,87,224,0.07)"
                  : active ? "rgba(29,87,224,0.08)" : "transparent",
                transition: "all 0.15s ease",
                position: "relative",
              }}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right: Kontakt + WhatsApp */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <Link href="/kontakt" style={{
          fontSize: 13, fontWeight: 400,
          color: "rgba(20,30,60,0.6)",
          textDecoration: "none", padding: "6px 10px", borderRadius: 8,
        }}>
          Kontakt
        </Link>
        <Link href={WA_LINK} style={{
          background: "#22c55e",
          color: "#fff", fontSize: 13, fontWeight: 600,
          padding: "8px 16px", borderRadius: 20,
          textDecoration: "none",
          display: "flex", alignItems: "center", gap: 5,
          letterSpacing: "0.01em",
          boxShadow: "0 1px 4px rgba(34,197,94,0.35)",
        }}>
          <WhatsAppIcon size={14} /> Jetzt bewerben
        </Link>
      </div>
    </nav>
  );
}
