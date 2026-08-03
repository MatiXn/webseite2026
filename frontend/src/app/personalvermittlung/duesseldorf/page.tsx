// Personalvermittlung Düsseldorf (EPIC 010B – auf City Content Engine migriert).
// Dünne Route: Metadata + Schema über die City-Composer, Rendering über
// CityPageTemplate. Düsseldorf-Sonderfall (Bürostandort): sichtbarer Standort-Block
// + LocalBusiness-Schema. Keine lokale Content-/FAQ-/Job-/Metadata-Logik hier.
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "../../components/JsonLd";
import { CityPageTemplate } from "../../../content-engine/templates";
import { buildCityMetadata } from "../../../content-engine/metadata";
import { company } from "../../../content/company";
import { duesseldorf } from "../../../content/cities";
import { buildDuesseldorfLocalBusinessSchema } from "./duesseldorf-localbusiness";

export const metadata: Metadata = buildCityMetadata(duesseldorf);

// Düsseldorf-spezifischer, sichtbarer Standort-/NAP-Block (nur echter Bürostandort).
// Werte aus der zentralen company-Registry; Telefon-Anzeigeformat lokal.
function DuesseldorfStandort() {
  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 24px 24px" }}>
      <div style={{ background: "#f5f7fa", border: "1px solid #e2e6ee", borderRadius: 16, padding: "24px 24px", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#3b72b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Standort Düsseldorf</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", marginBottom: 2 }}>{company.name}</p>
          <p style={{ fontSize: 15, color: "#586170", lineHeight: 1.6 }}>{company.street} · {company.postalCode} {company.city}</p>
          <p style={{ fontSize: 15, color: "#586170" }}>Mo–Fr {company.openingHours.opens}–{company.openingHours.closes} Uhr</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
          <a href={`tel:${company.phone}`} style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", textDecoration: "none" }}>0211 158 63 100</a>
          <Link href="/kontakt" className="pathswitch-cta pathswitch-cta--secondary">Kontakt aufnehmen</Link>
        </div>
      </div>
    </section>
  );
}

export default function PersonalvermittlungDuesseldorfPage() {
  return (
    <>
      <JsonLd data={buildDuesseldorfLocalBusinessSchema()} />
      <CityPageTemplate city={duesseldorf} localBusinessSlot={<DuesseldorfStandort />} />
    </>
  );
}
