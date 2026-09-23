/// <reference types="vitest/config" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// This package has no vite.config.ts; the Storybook Vite config (including the
// Tailwind v4 plugin registered in .storybook/main.ts viteFinal) is applied by
// storybookTest, so the components render with their generated utility classes.
export default defineConfig({
  // pnpm resolves this package's dependencies through the parent checkout's
  // store. Browser mode serves injected Storybook setup files over Vite's
  // dev server, so that real path must be in the server allow-list.
  server: {
    fs: {
      allow: [path.resolve(dirname, "../../../..")],
    },
  },
  test: {
    projects: [
      {
        // Every plain test runs here, in node, so a new block's test needs no
        // registering. Among them is the token-free freshness check: an
        // audit.json `classes` column is a snapshot of its component's class
        // strings, and it fails when an edit lets the two diverge.
        test: {
          name: "audit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          // Storybook's generated project-annotations module is shared by all
          // browser files and is not safe to transform concurrently.
          fileParallelism: false,
          // The package scaffolding lands before its first component, so an
          // empty story set must not fail the run.
          passWithNoTests: true,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
