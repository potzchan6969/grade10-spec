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
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
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
