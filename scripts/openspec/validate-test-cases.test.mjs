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
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
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

// Product and platform suites have no adjacent spec.md: their traces resolve
// across every capability in the composed scope.
test("product and platform suites validate their scoped journeys and id prefixes", () => {
  const root = mkdtempSync(join(tmpdir(), "composed-suites-"));
  const capabilities = [
    ["openspec/specs/demo/alpha/item", "demo-alpha-item"],
    ["openspec/changes/demo-change/specs/demo/gamma/item", "demo-gamma-item"],
    ["openspec/specs/another/market/item", "another-market-item"],
  ];
  for (const [base, prefix] of capabilities) {
    for (const [name, content] of Object.entries(specFiles(base))) {
      const file = join(root, name);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content.replaceAll("demo-alpha", prefix));
    }
  }

  const suite = (title, prefix, trace) =>
    [
      `# ${title} Test Cases`,
      "",
      "**Status:** pending-review",
      "**Drafts styled:** 2026-09-24, tcs-rules r3.0",
      "",
      `## ${prefix}-US1: Admin completes a cross-domain path`,
      "",
      "**As an** admin,",
      "**I want** to complete the path,",
      "**so that** the composed outcome is correct.",
      "",
      `### ${prefix}-US1-TC1-1: The composed path succeeds`,
      "",
      "**Classification:**",
      "",
      "* **Severity:** critical",
      "* **Priority:** high",
      "* **Status:** draft",
      "* **Behaviour:** positive",
      "* **Type:** integration",
      "* **Suites:** smoke",
      "* **Layer:** e2e",
      "* **Automation status:** manual",
      "* **Testability:** manual",
      `* **Trace:** ${trace}`,
      "",
      "**Pre-conditions:**",
      "None.",
      "",
      "**Steps:**",
      "",
      "1. Complete the composed path.",
      "",
      "**Expected Results:**",
      "",
      "* The composed outcome is correct.",
      "",
      "## Settled",
      "",
      "- Composed suites read journeys from their full source scope.",
      "",
      "## Reconciliation",
      "",
      "**Run:** 2026-09-24; derived composed-suite fixture.",
      "",
      "| Diff | Disposition |",
      "| --- | --- |",
      "| The suite has no adjacent spec.md. | Its traces resolve across the composed scope. |",
      "",
    ].join("\n");

  const productSuite = suite(
    "demo product",
    "demo-e2e",
    "demo-alpha-item-US-01, demo-gamma-item-US-01",
  );
  const platformSuite = suite(
    "platform",
    "platform-e2e",
    "demo-alpha-item-US-01, another-market-item-US-01",
  );
  for (const [path, content] of [
    ["openspec/specs/demo/product-tcs.md", productSuite],
    ["openspec/specs/platform-tcs.md", platformSuite],
  ]) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }

  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

// Decides shared-planning-agent-rounds-US12-TC2-1.
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

// Decides shared-planning-agent-rounds-US11-TC6-1.
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

// A sweep regenerates drafts freely, and may never move a reviewed case: every
// `actual` or `deprecated` case the baseline recorded keeps its id, its trace
// and its status (docs/governance/specs-to-test-cases.md, Rules Revisions).
test("a sweep check lets drafts move and holds reviewed cases still", () => {
  const SCRIPT = fileURLToPath(
    new URL("./validate-test-cases.mjs", import.meta.url),
  );
  const sweep = (root, flag, file) =>
    spawnSync(process.execPath, [SCRIPT, "--root", root, flag, file], {
      encoding: "utf8",
      env: { ...process.env, NO_COLOR: "1" },
    });
  const root = store("export const Alpha = {};\n");
  const suite = join(root, CHANGE, "feature-tcs.md");
  const original = readFileSync(suite, "utf8");
  const reviewed = original.replace(
    /(### demo-alpha-US1-TC1-1:[\s\S]*?\* \*\*Status:\*\*) draft/,
    "$1 actual",
  );
  writeFileSync(suite, reviewed);
  const baseline = join(root, "baseline.json");
  assert.equal(sweep(root, "--capture-baseline", baseline).status, 0);

  // The drafts regenerate: TC3 is gone and TC4 is new. The reviewed TC1 stays.
  writeFileSync(
    suite,
    reviewed
      .replaceAll("demo-alpha-US1-TC3-1", "demo-alpha-US1-TC4-1")
      .replace("The thing happens, 3", "The thing happens again, 4"),
  );
  const moved = sweep(root, "--swept", baseline);
  assert.equal(moved.status, 0, moved.stdout + moved.stderr);

  // The reviewed case goes back to draft: a sweep may not do that unasked.
  writeFileSync(
    suite,
    reviewed.replace(
      /(### demo-alpha-US1-TC1-1:[\s\S]*?\* \*\*Status:\*\*) actual/,
      "$1 draft",
    ),
  );
  const reopened = sweep(root, "--swept", baseline);
  assert.equal(reopened.status, 1);
  assert.match(reopened.stdout, /demo-alpha-US1-TC1-1` was actual, now draft/);
});

// A state only a mock produces is a script's to set up: a case that needs one
// and plans no automation is raised (Step 3, Executable without asking).
test("a case needing a mocked state and planning no automation is warned", () => {
  const root = store("export const Alpha = {};\n");
  const suite = join(root, CHANGE, "feature-tcs.md");
  writeFileSync(
    suite,
    readFileSync(suite, "utf8").replace(
      "None.",
      "The catalogue endpoint is mocked to return a 500.",
    ),
  );
  const result = run(root);
  assert.match(
    result.stdout,
    /demo-alpha-US1-TC1-1` needs a mocked or manipulated state but its \*\*Testability\*\* plans no `automation`/,
  );
});
