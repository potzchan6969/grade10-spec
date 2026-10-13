import { defineConfig } from "playwright/test";

export default defineConfig({
  outputDir: "/tmp/grade10-spec-cart-pictures",
  testDir: ".",
  testMatch: "cart-pictures.spec.ts",
  use: { baseURL: "http://localhost:6014", headless: true },
  webServer: {
    command: "pnpm run storybook --port 6014 --ci --no-open",
    url: "http://localhost:6014",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
