import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import BreadcrumbsView from "../components/BreadcrumbsView";
import { publishedIndustries } from "../../content/industries";
import { buildPageMetadata, buildCanonicalUrl } from "../../content-engine/metadata";
import { SCHEMA_CONTEXT, BREADCRUMB_HOME, INDUSTRY_HUB_NAME, buildBreadcrumbSchema, buildCollectionPageSchema, deduplicateSchemaGraph } from "../../content-engine/schema";

// Metadata über den generischen Page-Metadata-Builder (keine Duplizierung).
export const metadata: Metadata = buildPageMetadata({
  title: "Branchen der technischen Personalvermittlung | PHE-Perm",
  description:
    "PHE-Perm vermittelt technische Fach- und Führungskräfte für spezialisierte Branchen – direkt in Festanstellung, ohne Zeitarbeit.",
  canonicalPath: "/branchen",
  type: "website",
});

const linkStyle: React.CSSProperties = { color: "#0071e3", fontWeight: 700, textDecoration: "none" };

export default function BranchenHub() {
  const canonical = buildCanonicalUrl("/branchen");
  const breadcrumbId = `${canonical}#breadcrumb`;
  const collectionId = `${canonical}#collectionpage`;
  const breadcrumb = buildBreadcrumbSchema([BREADCRUMB_HOME, { name: INDUSTRY_HUB_NAME, path: "/branchen" }], breadcrumbId);
  const collectionPage = buildCollectionPageSchema({
    id: collectionId,
    canonical,
    title: "Branchen der technischen Personalvermittlung",
    description: "Übersicht der Branchen, in denen PHE-Perm technische Fachkräfte in Festanstellung vermittelt.",
    breadcrumbId,
    itemListId: null,
  });
  const schema = { "@context": SCHEMA_CONTEXT, "@graph": deduplicateSchemaGraph([collectionPage, breadcrumb], "branchen") };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <JsonLd data={schema} />
      <Nav />
      <BreadcrumbsView items={[{ name: "Startseite", href: "/" }, { name: "Branchen", href: "/branchen" }]} />

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 24px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Branchen</p>
        <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 18, textWrap: "balance" }}>
          Branchen der technischen Personalvermittlung
        </h1>
        <p style={{ fontSize: 18, color: "#586170", lineHeight: 1.7, maxWidth: 720, marginBottom: 28 }}>
          PHE-Perm ist auf die Vermittlung technischer Fach- und Führungskräfte spezialisiert. Auf den
          Branchenseiten finden Unternehmen und Kandidaten das jeweilige Markt- und Einsatzumfeld – direkt in
          Festanstellung, ohne Zeitarbeit.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/technische-personalvermittlung" className="pathswitch-cta pathswitch-cta--primary">Technische Fachkräfte anfragen</Link>
          <Link href="/jobs" className="pathswitch-cta pathswitch-cta--secondary">Offene Stellen ansehen</Link>
        </div>
      </section>

      {/* Branchen-Karten (aus publishedIndustries) */}
      <section style={{ background: "#f5f7fa", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 40 }}>
            Spezialisierte Branchen
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {publishedIndustries.map((ind) => (
              <article key={ind.slug} style={{ background: "#fff", border: "1px solid #e2e6ee", borderRadius: 16, padding: "24px 22px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 10, lineHeight: 1.3 }}>{ind.name}</h3>
                <p style={{ fontSize: 14.5, color: "#586170", lineHeight: 1.6, marginBottom: 16 }}>{ind.metadataDescription}</p>
                <Link href={ind.canonicalPath} style={{ ...linkStyle, marginTop: "auto", fontSize: 14 }}>Zur Branche {ind.name} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
