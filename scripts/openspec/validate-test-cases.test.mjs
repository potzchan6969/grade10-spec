/*
 * `validate-test-cases.mjs` over a throwaway store, the way `decided-by.test.mjs`
 * reads it: the checks a suite's Manual table owes where it is written.
 *
 * A Manual row credits a test through the legend above it - `- <name> -
 * `<path>`, in this store` - and a test in this store that carries no such
 * case id is refused, naming the path and the id; a legend path this store
 * does not hold (the application repository's walk) is skipped
 * (`shared-planning-agent-rounds-SC-106`).
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
const CHANGE = "openspec/changes/demo/specs/demo/alpha";
const STORY = "packages/ui/src/blocks/alpha/alpha.stories.tsx";

const CASE = (n) =>
  [
    `### demo-alpha-US1-TC${n}-1: The thing happens, ${n}`,
    "",
    "**Classification:**",
    "",
    "* **Severity:** major",
    "* **Priority:** high",
    "* **Status:** draft",
    "* **Behaviour:** positive",
    "* **Type:** functional",
    "* **Suites:** regression",
    "* **Layer:** e2e",
    "* **Automation status:** manual",
    "* **Testability:** manual",
    "* **Trace:** demo-alpha-US-01",
    "",
    "**Pre-conditions:**",
    "None.",
    "",
    "**Steps:**",
    "",
    "1. Do the thing.",
    "",
    "**Expected Results:**",
    "",
    "* The thing happened.",
    "",
  ].join("\n");

const SUITE = (manual) =>
  [
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
    CASE(1),
    CASE(2),
    CASE(3),
    "## Reconciliation",
    "",
    "**Run:** 2026-09-01, blind feature pass.",
    "",
    ...manual,
    "",
  ].join("\n");

const MANUAL = [
  "### Manual",
  "",
  "Each row names the test that proves part of the case:",
  "",
  `- the story - \`${STORY}\`, in this store`,
  "- the walk - `apps/site/e2e/alpha.spec.ts`, in the application repository",
  "",
  "| Manual | Why |",
  "| --- | --- |",
  "| `demo-alpha-US1-TC1-1` | the story proves the tile; a person reads it |",
  "| `demo-alpha-US1-TC2-1` | the walk proves the page; a person reads it |",
  "| `demo-alpha-US1-TC3-1` | the story proves the words; a person reads them |",
];

const SPEC = {
  [`${CHANGE}/spec.md`]: [
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
  [`${CHANGE}/user-journeys.md`]: [
    "## User journeys",
    "",
    "### demo-alpha-US-01: Collector does the thing",
    "",
    "**As a** collector,",
    "**I want** the thing,",
    "**so that** it is done.",
    "",
  ].join("\n"),
  "openspec/changes/demo/decisions.md": "## Decisions\n\n| Id | Question | Decision | Instead of |\n| --- | --- | --- | --- |\n",
};

function store(story, manual = MANUAL) {
  const root = mkdtempSync(join(tmpdir(), "manual-rows-"));
  const files = { ...SPEC, [STORY]: story, [`${CHANGE}/feature-tcs.md`]: SUITE(manual) };
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

const run = (root) =>
  spawnSync(process.execPath, [SCRIPT, "--root", root], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

test("shared-planning-agent-rounds-SC-106 - a Manual row whose store test carries no such case id is refused, and a row naming the application repository's walk is skipped", () => {
  const result = run(
    store("// the story: demo-alpha-US1-TC3-1 is drawn here\n"),
  );
  const out = result.stdout + result.stderr;
  assert.notEqual(result.status, 0, out);
  // TC1 names the story, which cites TC3 alone.
  assert.match(out, /demo-alpha-US1-TC1-1/);
  assert.match(out, new RegExp(STORY.replace(/[./]/g, "\\$&")));
  // TC2 names the walk, which this store does not hold: nothing said of it.
  assert.doesNotMatch(out, /demo-alpha-US1-TC2-1/);
  // TC3's story cites it.
  assert.doesNotMatch(out, /demo-alpha-US1-TC3-1.*cites no/);
});

test("shared-planning-agent-rounds-SC-106 - a Manual row whose store test cites its case passes", () => {
  const result = run(
    store(
      "// demo-alpha-US1-TC1-1 and demo-alpha-US1-TC3-1 are drawn here\n",
    ),
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
