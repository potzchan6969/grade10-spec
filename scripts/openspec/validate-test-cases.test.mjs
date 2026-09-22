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
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { runValidator, specFiles } from "./test/suite-store.mjs";

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
  ...specFiles(CHANGE),
  "openspec/changes/demo/decisions.md":
    "## Decisions\n\n| Id | Question | Decision | Instead of |\n| --- | --- | --- | --- |\n",
};

function store(story, manual = MANUAL) {
  const root = mkdtempSync(join(tmpdir(), "manual-rows-"));
  const files = {
    ...SPEC,
    [STORY]: story,
    [`${CHANGE}/feature-tcs.md`]: SUITE(manual),
  };
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

const run = runValidator;

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

test("shared-planning-agent-rounds-SC-103 - a Manual table under a journey, on a suite carrying a reconciliation, is refused naming where it belongs", () => {
  const root = mkdtempSync(join(tmpdir(), "manual-place-"));
  const suite = [
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
    "### Manual",
    "",
    "| Manual | Why |",
    "| --- | --- |",
    "| `demo-alpha-US1-TC1-1` | a person reads it |",
    "",
    "## Reconciliation",
    "",
    "**Run:** 2026-09-01, blind feature pass.",
    "",
  ].join("\n");
  const files = {
    ...SPEC,
    [STORY]: "// demo-alpha-US1-TC1-1\n",
    [`${CHANGE}/feature-tcs.md`]: suite,
  };
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  const result = run(root);
  const out = result.stdout + result.stderr;
  assert.notEqual(result.status, 0, out);
  assert.match(out, /### Manual/);
  assert.match(out, /## Reconciliation/);
});

test("shared-planning-agent-rounds-SC-106 - a Manual row whose store test cites its case passes", () => {
  const result = run(
    store("// demo-alpha-US1-TC1-1 and demo-alpha-US1-TC3-1 are drawn here\n"),
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
