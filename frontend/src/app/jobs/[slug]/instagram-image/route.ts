import { PNG } from "pngjs";
import jpeg from "jpeg-js";
import { JOBS } from "../../data";
import { jobIdFromParam } from "../../../../lib/slug";

// JPEG-Fassung der Social-Bilder für die Instagram Content Publishing API.
//
// Hintergrund: Die API akzeptiert ausschließlich JPEG — "JPEG is the only
// image format supported". Die Routen `feed-image`, `story-image` und
// `square-image` liefern PNG, weil `ImageResponse` nichts anderes erzeugt.
//
// Statt die Gestaltung ein zweites Mal zu bauen, holt diese Route das fertige
// PNG der jeweiligen Route und wandelt es um. Ändert sich das Aussehen der
// Social-Bilder, zieht diese Route automatisch mit.
//
// Bewusst `pngjs` + `jpeg-js` statt `sharp`: sharp lädt native Bibliotheken
// erst zur Laufzeit per dlopen. Der Datei-Tracer von Next.js erkennt sie nicht
// und liefert sie nicht mit — in Produktion scheiterte der Import an
// "libvips-cpp.so.8.18.6: cannot open shared object file", obwohl alle
// Linux-Binärdateien im Lockfile standen. Weder ein Build ohne Cache noch
// `outputFileTracingIncludes` half. Die beiden reinen
// JavaScript-Bibliotheken haben keine Abhängigkeiten und laufen überall
// gleich; sie sind langsamer, aber das Ergebnis wird ohnehin gecacht.

export const runtime = "nodejs";

// Täglich neu erzeugen, wie die Stellenseiten selbst.
export const revalidate = 86400;

const FORMATE = {
  feed: "feed-image",     // 1080 × 1350 (4:5) — Instagram-Feed
  story: "story-image",   // 1080 × 1920 (9:16) — Story
  square: "square-image", // 1080 × 1080 (1:1) — Feed und Explore
} as const;

type Format = keyof typeof FORMATE;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const id = jobIdFromParam(slug);
  if (!id || !JOBS.some((j) => j.id === id)) {
    return new Response("Stelle nicht gefunden", { status: 404 });
  }

  const gewuenscht = new URL(req.url).searchParams.get("format") ?? "feed";
  if (!(gewuenscht in FORMATE)) {
    return new Response(
      `Unbekanntes Format. Erlaubt: ${Object.keys(FORMATE).join(", ")}`,
      { status: 400 },
    );
  }

  // Gleiche Herkunft wie die Anfrage — funktioniert lokal wie in Produktion.
  const herkunft = new URL(req.url).origin;
  const quelle = `${herkunft}/jobs/${slug}/${FORMATE[gewuenscht as Format]}`;

  // Bei geschuetzten Deployments (Vercel-Preview) antwortet die eigene Domain
  // mit einer Anmeldeseite statt mit dem Bild. Der Automatisierungs-Bypass ist
  // in jedem Deployment als Systemvariable hinterlegt und hebt das auf.
  // In Produktion gibt es keinen Schutz — dort ist der Kopf wirkungslos.
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

  // `redirect: manual` macht eine Weiterleitung auf die Anmeldeseite sichtbar,
  // statt sie stillschweigend zu verfolgen und HTML zu dekodieren.
  const antwort = await fetch(quelle, {
    redirect: "manual",
    headers: bypass ? { "x-vercel-protection-bypass": bypass } : {},
  });

  if (!antwort.ok) {
    const grund =
      antwort.status === 302 || antwort.status === 307
        ? "Das Deployment ist zugriffsgeschuetzt — der interne Abruf des Quellbilds landet auf der Anmeldeseite."
        : `Quellbild antwortete mit HTTP ${antwort.status}.`;
    console.error("[instagram-image] Quellbild nicht abrufbar", { quelle, status: antwort.status });
    return new Response(grund, { status: 502 });
  }

  const inhaltstyp = antwort.headers.get("content-type") ?? "";
  if (!inhaltstyp.startsWith("image/")) {
    console.error("[instagram-image] Quelle lieferte kein Bild", { quelle, inhaltstyp });
    return new Response(`Quellbild lieferte ${inhaltstyp} statt eines Bildes.`, { status: 502 });
  }

  const pngBytes = Buffer.from(await antwort.arrayBuffer());

  let jpegBytes: Buffer;
  try {
    const bild = PNG.sync.read(pngBytes);
    // Qualität 90: sichtbar verlustfrei, aber deutlich kleiner als PNG.
    const kodiert = jpeg.encode(
      { data: bild.data, width: bild.width, height: bild.height },
      90,
    );
    jpegBytes = kodiert.data;
  } catch (fehler) {
    console.error("[instagram-image] Umwandlung fehlgeschlagen", {
      slug,
      format: gewuenscht,
      grund: fehler instanceof Error ? fehler.message : "unbekannt",
    });
    return new Response(
      `Bild konnte nicht umgewandelt werden: ${fehler instanceof Error ? fehler.message : "unbekannt"}`,
      { status: 500 },
    );
  }

  return new Response(new Uint8Array(jpegBytes), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
