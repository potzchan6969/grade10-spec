/*
 * `--quiet` prints the failures a caller needs and nothing a human reads for
 * hygiene: no per-suite tally, no cross-level trace notice, no warning list.
 * The fixture below carries one of each - a case with no pre-conditions line
 * (error) and a journey with no case under it (warning) - so a run without
 * `--quiet` is the control this test diffs against.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(SCRIPTS, "validate-test-cases.mjs");

const CLASSIFICATION = [
  "* **Severity:** blocker",
  "* **Priority:** high",
  "* **Status:** draft",
  "* **Behaviour:** positive",
  "* **Type:** functional",
  "* **Suites:** smoke",
  "* **Layer:** e2e",
  "* **Automation status:** manual",
  "* **Testability:** manual",
  "* **Trace:** demo-alpha-US-01",
];

/** One journey with an error under it (a case missing its pre-conditions
 *  line), and a second journey with no case at all - a warning. */
const SUITE = [
  "# demo/alpha Test Cases",
  "",
  "**Status:** pending-review",
  "**Drafts styled:** 2026-09-01, tcs-rules r3.0",
  "",
  "## demo-alpha-US1: Collector does the thing",
  "",
  "**As a** collector,",
  "**I want** the thing,",
  "**so that** it is done.",
  "",
  "### demo-alpha-US1-TC1-1: The thing happens",
  "",
  "**Classification:**",
  "",
  ...CLASSIFICATION,
  "",
  "**Steps:**",
  "",
  "1. Do the thing.",
  "",
  "**Expected Results:**",
  "",
  "* The thing happened.",
  "",
  "## demo-alpha-US2: Collector does another thing",
  "",
  "**As a** collector,",
  "**I want** another thing,",
  "**so that** it is also done.",
  "",
].join("\n");

const SPEC = [
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
  "### Requirement: Another thing happens",
  "",
  "#### Scenario: demo-alpha-SC-02 - Another thing happens",
  "**Serves:** demo-alpha-US-02 - collector does another thing",
  "",
  "**WHEN** another thing is asked for",
  "**THEN** it happens",
  "",
].join("\n");

const JOURNEYS = [
  "## User journeys",
  "",
  "### demo-alpha-US-01: Collector does the thing",
  "",
  "**As a** collector,",
  "**I want** the thing,",
  "**so that** it is done.",
  "",
  "### demo-alpha-US-02: Collector does another thing",
  "",
  "**As a** collector,",
  "**I want** another thing,",
  "**so that** it is also done.",
  "",
].join("\n");

/** A durable fixture store, so an automated-decides check never applies -
 *  the error and the warning below come from the shape of the suite alone. */
function store() {
  const root = mkdtempSync(join(tmpdir(), "validate-tcs-quiet-"));
  const files = {
    "openspec/specs/demo/alpha/spec.md": SPEC,
    "openspec/specs/demo/alpha/user-journeys.md": JOURNEYS,
    "openspec/specs/demo/alpha/feature-tcs.md": SUITE,
  };
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

const run = (root, extra = []) =>
  spawnSync(process.execPath, [SCRIPT, "--root", root, ...extra], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

test("the fixture carries one error and one warning by default", () => {
  const result = run(store());
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /has no pre-conditions line/);
  assert.match(result.stdout, /holds no test case/);
  assert.match(result.stdout, /^1 error$/m);
  assert.match(result.stdout, /^1 warning$/m);
});

test("--quiet prints the failure and the count, and nothing a human reads for hygiene", () => {
  const root = store();
  const result = run(root, ["--quiet"]);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /has no pre-conditions line/);
  assert.match(result.stdout, /^1 error$/m);
  assert.doesNotMatch(result.stdout, /holds no test case/);
  assert.doesNotMatch(result.stdout, /^1 warning$/m);
  assert.doesNotMatch(result.stdout, /Test-case suites/);
  // The closing verdict line is not hygiene - it stays under --quiet too.
  assert.match(result.stdout, /suites do not match/);
});

test("--quiet --strict prints the warnings too, since --strict fails on them", () => {
  const root = store();
  const result = run(root, ["--quiet", "--strict"]);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /has no pre-conditions line/);
  assert.match(result.stdout, /holds no test case/);
  assert.match(result.stdout, /^1 warning$/m);
  assert.doesNotMatch(result.stdout, /Test-case suites/);
});

test("--quiet keeps only lines the default report already prints, in the same order", () => {
  const root = store();
  const loud = run(root).stdout;
  const quiet = run(root, ["--quiet"]).stdout;
  assert.notEqual(loud, quiet);
  // Everything --quiet keeps is verbatim in the default run, in the same order.
  const kept = quiet
    .split("\n")
    .filter((line) => line.length > 0 && !/^\d+ errors?$/.test(line));
  for (const line of kept) assert.ok(loud.includes(line), line);
});
