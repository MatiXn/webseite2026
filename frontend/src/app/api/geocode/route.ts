import { NextRequest, NextResponse } from "next/server";

// Server-seitiger Proxy für Nominatim: Die IP des Besuchers wird nicht an
// OpenStreetMap übertragen (DSGVO), und wir senden den geforderten User-Agent.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length > 100) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ", Deutschland")}&format=json&limit=1&countrycodes=de`,
      {
        headers: {
          "Accept-Language": "de",
          "User-Agent": "phe-perm.de Jobsuche (info@phe-perm.de)",
        },
        next: { revalidate: 86400 },
      }
    );
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) {
      return NextResponse.json({ ok: true, result: null });
    }
    return NextResponse.json({
      ok: true,
      result: {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display: String(data[0].display_name).split(",")[0],
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
