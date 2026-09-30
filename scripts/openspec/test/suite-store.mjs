/**
 * The fixture a suite test reads `validate-test-cases.mjs` against: the two
 * files a suite is a reading of — one journey, one scenario — written under
 * one capability directory, and the script run with `--root` over a throwaway
 * store. `decided-by.test.mjs` and `validate-test-cases.test.mjs` both build
 * on it, each adding the suite its own rule reads.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(
  new URL("../validate-test-cases.mjs", import.meta.url),
);

/** `spec.md` and `user-journeys.md` for the `demo/alpha` capability at `base`. */
export function specFiles(base) {
  return {
    [`${base}/spec.md`]: [
      "# demo/alpha",
      "",
      "## Purpose",
      "",
      "Doing the thing.",
      "",
      "## Feature set",
      "",
      "- Doing the thing",
      "",
      "## Requirements",
      "",
      "### Requirement: The thing happens",
      "",
      "#### Scenario: demo-alpha-SC-01 - The thing happens",
      "**Serves:** demo-alpha-US-01 - collector does the thing",
      "",
      "**WHEN** the thing is asked for",
      "**THEN** it happens",
      "",
    ].join("\n"),
    [`${base}/user-journeys.md`]: [
      "## User journeys",
      "",
      "### demo-alpha-US-01: Collector does the thing",
      "",
      "**As a** collector,",
      "**I want** the thing,",
      "**so that** it is done.",
      "",
    ].join("\n"),
  };
}

/** The real validator over `root`, colour off. */
export function runValidator(root, args = []) {
  return spawnSync(process.execPath, [SCRIPT, "--root", root, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
}
