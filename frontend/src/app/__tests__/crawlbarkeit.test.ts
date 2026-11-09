import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import robots from "../robots";

const lies = (pfad: string) => readFileSync(join(process.cwd(), pfad), "utf8");
const DUESSELDORF = 'href="/personalvermittlung/duesseldorf"';

describe("Crawlbarkeit", () => {
  it("sperrt die Dateien nicht, die Google zum Rendern braucht", () => {
    const regeln = [robots().rules].flat();
    expect(regeln.flatMap((r) => r.disallow ?? [])).not.toContain("/_next/");
    expect(regeln.flatMap((r) => r.disallow ?? [])).toContain("/api/");
  });

  it("führt die Fußzeile auf jeder Seite zur Düsseldorf-Seite", () => {
    expect(lies("src/app/components/Footer.tsx")).toContain('"/personalvermittlung/duesseldorf"');
  });

  it.each([
    "src/app/technische-personalvermittlung/page.tsx",
    "src/app/ueber-uns/page.tsx",
    "src/app/kontakt/page.tsx",
  ])("verlinkt die Düsseldorf-Seite im Text: %s", (pfad) => {
    expect(lies(pfad)).toContain(DUESSELDORF);
  });
});
