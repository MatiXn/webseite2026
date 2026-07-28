import Link from "next/link";

export type Crumb = { name: string; href: string };

// Rein sichtbare Breadcrumb-Leiste OHNE eigenes Schema.
// Das BreadcrumbList-Schema liefert die Content Engine (buildProfessionSchema),
// damit es genau eine Breadcrumb-Quelle und keine doppelten @ids gibt.
// Visuell identisch zu components/Breadcrumbs.tsx.
export default function BreadcrumbsView({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 800, margin: "0 auto", padding: "12px 24px" }}>
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
