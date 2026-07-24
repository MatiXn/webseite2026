import Link from "next/link";
import JsonLd from "./JsonLd";

export type Crumb = { name: string; href: string };

// Sichtbare Breadcrumb-Leiste inkl. BreadcrumbList-Schema aus EINER Quelle.
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const base = "https://www.phe-perm.de";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.href}`,
    })),
  };
  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 800, margin: "0 auto", padding: "12px 24px" }}>
      <JsonLd data={schema} />
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "#586170" }}>
        {items.map((c, i) => (
          <li key={c.href} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i < items.length - 1 ? (
              <><Link href={c.href} style={{ color: "#2d6a9f", textDecoration: "none" }}>{c.name}</Link><span aria-hidden>›</span></>
            ) : (
              <span aria-current="page">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
