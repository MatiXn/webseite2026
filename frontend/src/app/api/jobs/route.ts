import { NextResponse } from "next/server";
import { JOBS } from "@/app/jobs/data";
import { mergeSheetJobs, type SheetRow } from "@/app/jobs/job-source";

const SHEET_ID = "1fhf2zuWDuNeHoxgjZ-Ovp_lVDuuX2USRRMUx7Qu4o3A";

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(JOBS);
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A2:I1000?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.error("Sheets API error:", res.status, await res.text());
      return NextResponse.json(JOBS);
    }

    const data = await res.json();

    if (!data.values?.length) {
      return NextResponse.json(JOBS);
    }

    const rows: SheetRow[] = data.values.map((row: string[]) => {
      const aktiv = (row[7] ?? "").toLowerCase().trim();
      return {
        title: (row[0] ?? "").trim(),
        city: (row[1] ?? "").trim(),
        region: (row[2] ?? "").trim(),
        salary: (row[3] ?? "").trim(),
        category: (row[4] ?? "").toLowerCase().trim(),
        description: (row[5] ?? "").trim(),
        tags: (row[6] ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
        benefits: (row[8] ?? "").split(",").map((b: string) => b.trim()).filter(Boolean),
        aktiv: aktiv !== "nein" && aktiv !== "false" && aktiv !== "0",
      };
    });

    const { jobs, unmatched } = mergeSheetJobs(rows);

    // Eine Sheet-Zeile ohne Gegenstück in data.ts darf nicht in die Liste:
    // ihre Detailseite existiert nicht und der Link liefe auf einen 404.
    if (unmatched.length) {
      console.warn(
        `[jobs] ${unmatched.length} Sheet-Zeile(n) ohne Detailseite — in src/app/jobs/data.ts ergänzen: ` +
        unmatched.map(u => `"${u.title}" (${u.city})`).join(", ")
      );
    }

    return NextResponse.json(jobs.length > 0 ? jobs : JOBS);
  } catch (err) {
    console.error("Sheets fetch failed:", err);
    return NextResponse.json(JOBS);
  }
}
