import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KAMPAGNEN, findeKampagne, kampagnenPfad } from "../../../landingpages/registry";
import {
  Kopfbereich,
  Hero,
  Vorteilsleiste,
  Gegenueberstellung,
  Ablauf,
  LandingFooter,
} from "../../../landingpages/komponenten/Abschnitte";
import Funnel from "../../../landingpages/komponenten/Funnel";
import PixelLader from "../../../landingpages/komponenten/PixelLader";

// Eine Route für alle Recruiting-Landingpages. Eine neue Kampagne braucht nur
// eine Datei in `landingpages/kampagnen/` und einen Eintrag in der Registry.

const BASIS_URL = "https://www.phe-perm.de";

export function generateStaticParams() {
  return KAMPAGNEN.map((k) => ({ kampagne: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kampagne: string }>;
}): Promise<Metadata> {
  const { kampagne } = await params;
  const config = findeKampagne(kampagne);
  if (!config) return {};

  const url = `${BASIS_URL}${kampagnenPfad(config)}`;
  const bild = config.heroBild
    ? `${BASIS_URL}${config.heroBild.pfad}`
    : `${BASIS_URL}/jobs/opengraph-image`;

  return {
    // `absolute` umgeht die Vorlage aus dem Root-Layout ("%s | PHE-Perm
    // Engineering"). Der Kampagnentitel trägt die Marke bereits selbst —
    // ohne das hier stünde sie zweimal im Tab.
    title: { absolute: config.seo.titel },
    description: config.seo.beschreibung,

    // Anzeigenseite, kein Suchmaschinenziel: Die Stelle ist unter ihrer
    // organischen Adresse indexiert. Zwei indexierte Seiten zur selben
    // Position würden gegeneinander ranken. `follow` bleibt erlaubt, damit
    // die Verlinkung auf Impressum und Datenschutz zählt.
    robots: { index: false, follow: true },

    alternates: { canonical: url },

    openGraph: {
      type: "website",
      locale: "de_DE",
      url,
      siteName: "PHE-Perm Engineering",
      title: config.seo.titel,
      description: config.seo.beschreibung,
      images: [{ url: bild, width: 1200, height: 630, alt: config.position }],
    },

    twitter: {
      card: "summary_large_image",
      title: config.seo.titel,
      description: config.seo.beschreibung,
      images: [bild],
    },
  };
}

export default async function StellenLandingpage({
  params,
}: {
  params: Promise<{ kampagne: string }>;
}) {
  const { kampagne } = await params;
  const config = findeKampagne(kampagne);
  if (!config) notFound();

  return (
    <>
      <PixelLader />
      <Kopfbereich />

      <main>
        <Hero config={config} />
        <Vorteilsleiste config={config} />
        <Gegenueberstellung config={config} />
        <Ablauf config={config} />

        <section className="lp-abschnitt">
          <div className="lp-abschnitt-innen">
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 className="lp-h2">{config.funnel.ueberschrift}</h2>
              <p className="lp-einleitung" style={{ margin: "0 auto" }}>
                {config.funnel.einleitung}
              </p>
            </div>

            <Funnel config={config} />
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
