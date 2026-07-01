"use client";
import Link from "next/link";
import Image from "next/image";

const WA_LINK = "https://wa.me/491739980100";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }} className="px-section">
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 40, paddingBottom: 20 }}>
        <div className="footer-grid" style={{ marginBottom: 40 }}>
          <div>
            <Image src="/phe-logo.png" alt="PHE-Perm Engineering" height={28} width={140} style={{ height: 28, width: "auto", marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6 }}>
              PHE-Perm Engineering, Ihr Partner für Festanstellungen in IT, Elektro und Bau.
            </p>
          </div>
          {[
            { title: "Für Bewerber", links: [["Stellenangebote", "/jobs"], ["Lebenslauf erstellen", "/lebenslauf-erstellen"], ["Jetzt bewerben", WA_LINK], ["YAFTO", "/#yafto"]] },
            { title: "Unternehmen", links: [["Fachkräfte finden", "/talente-finden"], ["Über PHE", "/ueber-uns"], ["Kontakt", "/kontakt"]] },
            { title: "Rechtliches", links: [["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"], ["AGB", "/agb"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>{col.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map(([l, h]) => (
                  <li key={l}>
                    <Link
                      href={h}
                      {...(h.startsWith("https://wa.me") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{ fontSize: 13, color: "var(--gray)", textDecoration: "none" }}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 PHE-Perm Engineering GmbH. Alle Rechte vorbehalten.</span>
          <div>
            <Link href="/impressum" style={{ color: "var(--gray-light)", textDecoration: "none", marginLeft: 16 }}>Impressum</Link>
            <Link href="/datenschutz" style={{ color: "var(--gray-light)", textDecoration: "none", marginLeft: 16 }}>Datenschutz</Link>
            <Link href="/agb" style={{ color: "var(--gray-light)", textDecoration: "none", marginLeft: 16 }}>AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
