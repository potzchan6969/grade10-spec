/// <reference types="vitest/config" />

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

/**
 * The walk: the manual opened in a real browser, one file per journey under
 * `walk/`. A config of its own, so the node run `pnpm test` makes is untouched
 * and neither run drags the other's environment along. A walk file is named
 * `.walk.ts`, which that run's own glob does not match.
 *
 * `vite.config.ts` is not extended on purpose. Its store plugin is what serves
 * `/api/snapshot` from the working tree, and a walk that read the tree would
 * pass or fail on whatever is checked out; with nothing answering that path the
 * shell falls back to `public/fixture-snapshot.json`, the reading of
 * `demo-store/` that `pnpm fixture` builds. Tailwind is registered here because
 * `walk/setup.ts` imports the app's stylesheet: a walk decides what a reader
 * can see, so it sees what a reader sees.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    name: "walk",
    include: ["walk/**/*.walk.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: "chromium" }],
    },
  },
});
