import { defineConfig } from "vitest/config";

export default defineConfig({
  // JSX ohne @vitejs/plugin-react übersetzen: Das Plugin verlangt Vite 8,
  // Vitest 2 bringt aber Vite 5 mit. Für Tests genügt die esbuild-Transformation —
  // Fast Refresh braucht hier niemand.
  esbuild: { jsx: "automatic" },

  test: {
    // Voreinstellung bleibt Node: Die bestehenden Logiktests brauchen kein DOM
    // und laufen so deutlich schneller.
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Komponententests (.test.tsx) bekommen ein DOM.
    environmentMatchGlobs: [["**/*.test.tsx", "jsdom"]],
  },
});
