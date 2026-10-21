/// <reference types="vitest/config" />

import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { manualStorePlugin } from "./src/store/vite-plugin.mts";

/**
 * The three libraries that dwarf the app: the framework, the markdown pipeline
 * behind every prose block, and the search engine behind ⌘K. Each takes its own
 * chunk, with the tree it pulls, so an edit to the manual ships without
 * re-sending any of them — and no single chunk trips the size reporter.
 * Order is precedence: the framework claims React before markdown asks for it.
 */
const VENDOR_CHUNKS = [
  { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
  { name: "router", test: /node_modules[\\/]react-router[\\/]/ },
  {
    name: "markdown",
    test: /node_modules[\\/](react-markdown|remark-gfm)[\\/]/,
  },
  { name: "search", test: /node_modules[\\/]minisearch[\\/]/ },
];

/**
 * A test file imports a second of modules or more, and a fresh graph per file
 * spends most of the run there. Files that replace a module with `vi.mock`
 * keep their own graph; every other file shares one per worker. Files that
 * read the real store run last, once everything else has run beside the read.
 */
const TEST_DIR = fileURLToPath(new URL("test/", import.meta.url));
const TESTS = "test/**/*.test.{ts,tsx,mts}";
const testsMatching = (source: RegExp) =>
  readdirSync(TEST_DIR, { recursive: true, encoding: "utf8" })
    .filter((f) => /\.test\.(?:tsx?|mts)$/.test(f))
    .filter((f) => source.test(readFileSync(TEST_DIR + f, "utf8")))
    .map((f) => `test/${f}`);
const ISOLATED = testsMatching(/\bvi\.(?:do)?[mM]ock\(/);
const REAL_STORE = testsMatching(/from "(?:\.\.?\/)+real-store"/);
const both = ISOLATED.filter((f) => REAL_STORE.includes(f));
if (both.length > 0)
  throw new Error(
    `${both.join(", ")}: a file that mocks cannot read the real store`,
  );

export default defineConfig({
  plugins: [react(), tailwindcss(), manualStorePlugin()],
  // Fixed port so links into the manual are stable; 6006/6010 are the workbenches.
  server: { port: 6017, strictPort: true },
  preview: { port: 6017, strictPort: true },
  build: {
    rolldownOptions: { output: { codeSplitting: { groups: VENDOR_CHUNKS } } },
  },
  test: {
    // Most files share a module graph, so nothing one stubs may outlive it.
    unstubEnvs: true,
    unstubGlobals: true,
    deps: {
      optimizer: { ssr: { enabled: true, include: ["@phosphor-icons/react"] } },
    },
    projects: [
      { extends: true, test: { name: "isolated", include: ISOLATED } },
      {
        extends: true,
        test: {
          name: "shared",
          include: [TESTS],
          exclude: [...ISOLATED, ...REAL_STORE],
          isolate: false,
        },
      },
      {
        extends: true,
        test: {
          name: "real-store",
          include: REAL_STORE,
          isolate: false,
          globalSetup: ["test/real-store.setup.ts"],
          sequence: { groupOrder: 1 },
        },
      },
    ],
  },
});
