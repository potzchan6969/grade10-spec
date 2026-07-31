/// <reference types="vitest/config" />

import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// This package has no vite.config.ts; the Storybook Vite config (including the
// Tailwind v4 plugin registered in .storybook/main.ts viteFinal) is applied by
// storybookTest, so the primitives render with their generated utility classes.
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
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        // Source-level assertions about the component contracts. These read
        // files rather than render them, so they need no browser and stay
        // runnable when Playwright's chromium is not installed.
        test: {
          name: "contracts",
          include: ["src/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
  },
});
