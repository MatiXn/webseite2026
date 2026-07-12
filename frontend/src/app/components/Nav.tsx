"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  ["Kontakt", "/kontakt"],
];

const WhatsAppIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(245,245,247,0.82)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        padding: isMobile ? "0 18px" : "0 32px",
        height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo — Padding vergrößert die Tap-Fläche auf min. 44px */}
        <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "8px 8px 8px 0", minHeight: 44 }}>
          <Image src="/phe-logo.svg" alt="PHE-Perm Engineering" height={38} width={42}
            style={{ height: isMobile ? 28 : 34, width: "auto" }} priority />
        </Link>

        {/* Desktop center links */}
        {!isMobile && (
          <ul style={{
            display: "flex", gap: 2, listStyle: "none", margin: 0, padding: 0,
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}>
            {NAV_LINKS.filter(([, href]) => href !== "/kontakt").map(([label, href]) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href.split("#")[0]) && !href.startsWith("/#")) || (href.startsWith("/#") && hash === href.slice(1));
              return (
                <li key={label}>
                  <Link href={href} style={{
                    display: "inline-flex", alignItems: "center",
                    fontSize: 14, fontWeight: 400,
                    color: active ? "#0071e3" : "#1d1d1f",
                    letterSpacing: "-0.01em",
                    textDecoration: "none",
                    padding: "6px 10px", borderRadius: 8,
                    background: "transparent",
                    transition: "color 0.15s ease",
                  }}>{label}</Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Desktop right */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Link href="/kontakt" style={{
              fontSize: 14, fontWeight: 400,
              color: pathname === "/kontakt" ? "#0071e3" : "#1d1d1f",
              letterSpacing: "-0.01em",
              textDecoration: "none", padding: "6px 10px", borderRadius: 8,
            }}>Kontakt</Link>
            <Link href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
              background: "#22c55e", color: "#fff", fontSize: 14, fontWeight: 400,
              padding: "8px 16px", borderRadius: 999, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <WhatsAppIcon size={14} /> Jetzt bewerben
            </Link>
          </div>
        )}

        {/* Mobile right: WA button + hamburger */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
              background: "#22c55e", color: "#fff",
              width: 44, height: 44, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <WhatsAppIcon size={20} />
            </Link>
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Menü"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px", display: "flex", flexDirection: "column",
                gap: 5, alignItems: "center", justifyContent: "center",
                width: 44, height: 44,
              }}
            >
              <span style={{
                display: "block", width: 22, height: 2, background: "#1d1d1f",
                borderRadius: 2, transition: "transform 0.2s, opacity 0.2s",
                transform: open ? "translateY(7px) rotate(45deg)" : "none",
              }}/>
              <span style={{
                display: "block", width: 22, height: 2, background: "#1d1d1f",
                borderRadius: 2, transition: "opacity 0.2s",
                opacity: open ? 0 : 1,
              }}/>
              <span style={{
                display: "block", width: 22, height: 2, background: "#1d1d1f",
                borderRadius: 2, transition: "transform 0.2s, opacity 0.2s",
                transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
              }}/>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 58, left: 0, right: 0, bottom: 0, zIndex: 99,
          // Vollflächig opak, damit Seiteninhalt hinter dem offenen Menü nicht durchscheint
          background: "#f5f5f7",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          overflow: "hidden auto",
          maxHeight: open ? "calc(100vh - 58px)" : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.2s ease",
          pointerEvents: open ? "auto" : "none",
        }}>
          <ul style={{ listStyle: "none", padding: "12px 0 20px", margin: 0 }}>
            {NAV_LINKS.map(([label, href]) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href.split("#")[0]) && !href.startsWith("/#")) || (href.startsWith("/#") && hash === href.slice(1));
              return (
                <li key={label}>
                  <Link href={href} style={{
                    display: "block", padding: "14px 24px",
                    fontSize: 17, fontWeight: 400,
                    color: active ? "#0071e3" : "#1d1d1f",
                    textDecoration: "none",
                  }}>{label}</Link>
                </li>
              );
            })}
            <li style={{ padding: "12px 24px 0" }}>
              <Link href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#22c55e", color: "#fff",
                fontSize: 14, fontWeight: 400, padding: "8px 16px",
                borderRadius: 999, textDecoration: "none",
              }}>
                <WhatsAppIcon size={16} /> Jetzt bewerben
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
