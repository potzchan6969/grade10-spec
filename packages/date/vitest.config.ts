import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "date",
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Pinned away from UTC on purpose. Everything this package renders is
    // stated on a clock the caller names or on UTC, so a mistake that follows
    // the machine is invisible on a UTC machine - which is what CI would
    // otherwise be.
    env: { TZ: "Asia/Hong_Kong" },
  },
});
