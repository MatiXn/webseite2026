import sharp from "sharp";
import { JOBS } from "../../data";
import { jobIdFromParam } from "../../../../lib/slug";

// JPEG-Fassung der Social-Bilder für die Instagram Content Publishing API.
//
// Hintergrund: Die API akzeptiert ausschließlich JPEG — "JPEG is the only
// image format supported". Die bestehenden Routen `feed-image`, `story-image`
// und `square-image` liefern PNG, weil `ImageResponse` nichts anderes kann.
//
// Statt die Gestaltung ein zweites Mal zu bauen, holt diese Route das fertige
// PNG von der jeweiligen Route und wandelt es um. Ändert sich das Aussehen der
// Social-Bilder, zieht diese Route automatisch mit.
//
// Node-Runtime statt Edge, weil sharp nativen Code braucht.

export const runtime = "nodejs";

// Täglich neu erzeugen, wie die Stellenseiten selbst.
export const revalidate = 86400;

const FORMATE = {
  feed: "feed-image",     // 1080 × 1350 (4:5) — Instagram-Feed
  story: "story-image",   // 1080 × 1920 (9:16) — Story und Reels-Titelbild
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

  const antwort = await fetch(quelle);
  if (!antwort.ok) {
    return new Response("Quellbild konnte nicht erzeugt werden", { status: 502 });
  }

  const png = Buffer.from(await antwort.arrayBuffer());
  // Qualität 90: sichtbar verlustfrei, aber deutlich kleiner als PNG.
  // `chromaSubsampling 4:4:4` hält Text und Kanten scharf — bei Bildern mit
  // Schrift ist die Voreinstellung 4:2:0 sonst erkennbar unsauber.
  const jpeg = await sharp(png)
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
