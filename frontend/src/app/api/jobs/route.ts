import { NextResponse } from "next/server";
import { JOBS, type Job } from "@/app/jobs/data";

const SHEET_ID = "1fhf2zuWDuNeHoxgjZ-Ovp_lVDuuX2USRRMUx7Qu4o3A";

// Approximate coordinates for common German cities (fallback when sheet has no lat/lng)
const CITY_COORDS: Record<string, [number, number]> = {
  "frankfurt": [50.111, 8.682],
  "münchen": [48.137, 11.576],
  "berlin": [52.520, 13.405],
  "hamburg": [53.551, 10.000],
  "köln": [50.938, 6.960],
  "düsseldorf": [51.227, 6.773],
  "stuttgart": [48.783, 9.182],
  "dortmund": [51.514, 7.468],
  "hannover": [52.376, 9.732],
  "bremen": [53.079, 8.801],
  "leipzig": [51.340, 12.375],
  "nürnberg": [49.453, 11.078],
  "dresden": [51.050, 13.737],
  "mannheim": [49.487, 8.466],
  "heidelberg": [49.399, 8.673],
  "karlsruhe": [49.006, 8.404],
  "freiburg": [47.997, 7.842],
  "münster": [51.960, 7.626],
  "bielefeld": [52.021, 8.534],
  "wuppertal": [51.264, 7.178],
  "bochum": [51.482, 7.216],
  "duisburg": [51.435, 6.762],
  "essen": [51.457, 7.012],
  "bonn": [50.735, 7.099],
  "aachen": [50.776, 6.084],
  "koblenz": [50.359, 7.590],
  "mainz": [49.999, 8.271],
  "wiesbaden": [50.083, 8.239],
  "heilbronn": [49.142, 9.220],
  "ulm": [48.401, 9.991],
  "augsburg": [48.371, 10.898],
  "regensburg": [49.017, 12.097],
  "offenbach": [50.099, 8.762],
  "langenfeld": [51.107, 6.949],
  "kerpen": [50.869, 6.695],
  "erding": [48.306, 11.907],
  "mosbach": [49.353, 9.149],
  "frankenthal": [49.537, 8.353],
  "bad oeynhausen": [52.198, 8.800],
  "düren": [50.804, 6.491],
};

function getCityCoords(city: string): [number, number] {
  const key = city.toLowerCase().split(",")[0].trim();
  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (key.includes(name) || name.includes(key)) return coords;
  }
  return [51.165, 10.451]; // Germany center as default
}

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(JOBS);
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A2:H1000?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.error("Sheets API error:", res.status, await res.text());
      return NextResponse.json(JOBS);
    }

    const data = await res.json();

    if (!data.values?.length) {
      return NextResponse.json(JOBS);
    }

    const validCategories = new Set(["elektro", "mechatronik", "it", "bau"]);

    const jobs: Job[] = data.values
      .filter((row: string[]) => {
        const aktiv = (row[7] ?? "").toLowerCase().trim();
        return aktiv !== "nein" && aktiv !== "false" && aktiv !== "0" && row[0];
      })
      .map((row: string[], i: number) => {
        const city = (row[1] ?? "").trim();
        const category = (row[4] ?? "elektro").toLowerCase().trim();
        const [lat, lng] = getCityCoords(city);
        return {
          id: String(i + 1),
          title: (row[0] ?? "").trim(),
          city,
          region: (row[2] ?? "").trim(),
          salary: (row[3] ?? "").trim(),
          category: validCategories.has(category) ? category : "elektro",
          description: (row[5] ?? "").trim(),
          tags: (row[6] ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
          posted: "Aktuell",
          type: "Festanstellung",
          lat,
          lng,
        } as Job;
      });

    return NextResponse.json(jobs.length > 0 ? jobs : JOBS);
  } catch (err) {
    console.error("Sheets fetch failed:", err);
    return NextResponse.json(JOBS);
  }
}
