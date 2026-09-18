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
        // Token-free freshness check: an audit.json `classes` column is a
        // snapshot of its component's class strings, and this is what fails
        // when an edit lets the two diverge — see the test's header comment.
        test: {
          name: "audit",
          environment: "node",
          include: [
            "src/__tests__/audit-freshness.test.ts",
            "src/lib/format-datetime.test.ts",
            "src/lib/format-money.test.ts",
            "src/blocks/auction-listing/listing-age-verification-form.test.ts",
            "src/blocks/auction-listing/listing-bid-money.test.ts",
            "src/blocks/auth-sign-in/public-exports.test.ts",
            "src/blocks/auction-order/public-exports.test.ts",
            "src/blocks/store-order-detail/public-exports.test.ts",
          ],
        },
      },
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
