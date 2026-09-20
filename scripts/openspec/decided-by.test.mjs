/*
 * Q49 of `run-a-round-on-every-artifact`: a case a store unit or script test
 * decides flips to `automated` in the commit that lands the test, with the
 * suite naming the deciding test per case. Nothing named it before this -
 * this file pins the line's grammar (`lib/suites.mjs`) and the validator's
 * three verdicts plus the date gate that keeps an existing change from
 * gaining an error it was never asked to answer.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { parseSuite } from "./lib/suites.mjs";

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));

// --- parser: `lib/suites.mjs` reads the line -------------------------------

/** One case, its classification block always ten properties long, an
 *  optional `**Decided by:**` line inserted where the grammar puts it - after
 *  the block, before `**Pre-conditions:**` - and nothing else about the case
 *  varying between tests. */
const caseText = (decidedBy) =>
  [
    "### demo-alpha-US1-TC1-1: The thing happens",
    "",
    "**Classification:**",
    "",
    "* **Severity:** blocker",
    "* **Priority:** high",
    "* **Status:** draft",
    "* **Behaviour:** positive",
    "* **Type:** functional",
    "* **Suites:** smoke",
    "* **Layer:** e2e",
    "* **Automation status:** automated",
    "* **Testability:** automation",
    "* **Trace:** demo-alpha-US-01",
    "",
    ...(decidedBy === null ? [] : [`**Decided by:** ${decidedBy}`, ""]),
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

const suiteText = (decidedBy) =>
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
    caseText(decidedBy),
  ].join("\n");

test("parseSuite reads a **Decided by:** line into decidedBy", () => {
  const suite = parseSuite(
    suiteText("scripts/openspec/round-scripts.test.mjs"),
  );
  assert.deepEqual(suite.journeys[0].cases[0].decidedBy, [
    "scripts/openspec/round-scripts.test.mjs",
  ]);
});

test("decidedBy is empty when the case carries no such line", () => {
  const suite = parseSuite(suiteText(null));
  assert.deepEqual(suite.journeys[0].cases[0].decidedBy, []);
});

test("reads more than one path, comma-separated, backticks stripped", () => {
  const suite = parseSuite(
    suiteText("`scripts/a.test.mjs`, tools/manual/test/b.test.ts"),
  );
  assert.deepEqual(suite.journeys[0].cases[0].decidedBy, [
    "scripts/a.test.mjs",
    "tools/manual/test/b.test.ts",
  ]);
});

// --- validator: the three verdicts and the date gate ------------------------

/** `spec.md` and `user-journeys.md`, the two files a suite is a reading of -
 *  one journey, one scenario, nothing this suite's checks would otherwise
 *  complain about. */
function specFiles(base) {
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

/** A throwaway store: a copy of the two files under test, so a suite fixture
 *  is checked by the real reader and the real validator rather than a
 *  restatement of either. `git` supplies the history the date gate's
 *  fallback reads. */
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "decided-by-"));
  const scripts = join(root, "scripts", "openspec");
  mkdirSync(join(scripts, "lib"), { recursive: true });
  copyFileSync(
    join(SCRIPTS, "validate-test-cases.mjs"),
    join(scripts, "validate-test-cases.mjs"),
  );
  copyFileSync(
    join(SCRIPTS, "lib", "suites.mjs"),
    join(scripts, "lib", "suites.mjs"),
  );
  const env = {
    GIT_AUTHOR_NAME: "t",
    GIT_AUTHOR_EMAIL: "t@test",
    GIT_COMMITTER_NAME: "t",
    GIT_COMMITTER_EMAIL: "t@test",
  };
  const git = (args, dateEnv = {}) =>
    execFileSync("git", args, {
      cwd: root,
      stdio: "pipe",
      env: { ...process.env, ...env, ...dateEnv },
    });
  git(["init", "--quiet", "."]);
  return { root, git };
}

function write(root, files) {
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}

function run(root, args = []) {
  return spawnSync(
    process.execPath,
    [join(root, "scripts", "openspec", "validate-test-cases.mjs"), ...args],
    { cwd: root, encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } },
  );
}

/** One case under one in-flight change, `.openspec.yaml` naming when it was
 *  opened - the date the gate reads first. */
function changeSandbox({
  created,
  automation = "automated",
  decidedBy = null,
}) {
  const { root, git } = sandbox();
  write(root, {
    "openspec/changes/demo-change/.openspec.yaml": created
      ? `schema: grade10-planning\ncreated: ${created}\n`
      : "schema: grade10-planning\n",
    ...specFiles("openspec/changes/demo-change/specs/demo/alpha"),
    "openspec/changes/demo-change/specs/demo/alpha/feature-tcs.md": caseSuite({
      automation,
      decidedBy,
    }),
  });
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "seed"]);
  return root;
}

function caseSuite({ automation, decidedBy }) {
  return [
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
    "* **Severity:** blocker",
    "* **Priority:** high",
    "* **Status:** draft",
    "* **Behaviour:** positive",
    "* **Type:** functional",
    "* **Suites:** smoke",
    "* **Layer:** e2e",
    `* **Automation status:** ${automation}`,
    "* **Testability:** automation",
    "* **Trace:** demo-alpha-US-01",
    "",
    ...(decidedBy === null ? [] : [`**Decided by:** ${decidedBy}`, ""]),
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
}

const AFTER_GATE = "2026-09-25";
const BEFORE_GATE = "2026-09-01";

test("accepted: an automated case naming a path that exists draws no error", () => {
  const root = changeSandbox({
    created: AFTER_GATE,
    automation: "automated",
    decidedBy: "scripts/openspec/validate-test-cases.mjs",
  });
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Decided by/);
});

test("missing: an automated case of a change opened after the gate is refused", () => {
  const root = changeSandbox({
    created: AFTER_GATE,
    automation: "automated",
    decidedBy: null,
  });
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /automated.*but carries no `\*\*Decided by:\*\*` line/,
  );
});

test("an existing change gains no error for the same missing line", () => {
  const root = changeSandbox({
    created: BEFORE_GATE,
    automation: "automated",
    decidedBy: null,
  });
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Decided by/);
});

test("path not found: a Decided by naming a file outside the checkout is refused", () => {
  const { root, git } = sandbox();
  write(root, {
    ...specFiles("openspec/specs/demo/alpha"),
    "openspec/specs/demo/alpha/feature-tcs.md": caseSuite({
      automation: "automated",
      decidedBy: "scripts/openspec/does-not-exist.test.mjs",
    }),
  });
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "seed"]);
  const result = run(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /names `scripts\/openspec\/does-not-exist\.test\.mjs`, which does not exist in this checkout/,
  );
});

test("a Decided by on a case that is not automated is a warning, not an error", () => {
  const { root, git } = sandbox();
  write(root, {
    ...specFiles("openspec/specs/demo/alpha"),
    "openspec/specs/demo/alpha/feature-tcs.md": caseSuite({
      automation: "manual",
      decidedBy: "scripts/openspec/validate-test-cases.mjs",
    }),
  });
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "seed"]);
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /carries `\*\*Decided by:\*\*` but its \*\*Automation status\*\* is not `automated`/,
  );
});

// --- the date gate -----------------------------------------------------

test("the gate skips a change git has no history for (a shallow clone prints nothing)", () => {
  const { root, git } = sandbox();
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "seed"]);
  // Written after the seed commit and never added: git log for this path
  // prints nothing, exactly what a shallow clone would print too.
  write(root, {
    ...specFiles("openspec/changes/demo-change/specs/demo/alpha"),
    "openspec/changes/demo-change/specs/demo/alpha/feature-tcs.md": caseSuite({
      automation: "automated",
      decidedBy: null,
    }),
  });
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Decided by/);
});

test("with no `.openspec.yaml`, the gate falls back to the directory's first commit date", () => {
  const oldRoot = sandbox();
  write(oldRoot.root, {
    ...specFiles("openspec/changes/demo-change/specs/demo/alpha"),
    "openspec/changes/demo-change/specs/demo/alpha/feature-tcs.md": caseSuite({
      automation: "automated",
      decidedBy: null,
    }),
  });
  oldRoot.git(["add", "-A"]);
  oldRoot.git(["commit", "--quiet", "-m", "seed"], {
    GIT_AUTHOR_DATE: `${BEFORE_GATE}T00:00:00`,
    GIT_COMMITTER_DATE: `${BEFORE_GATE}T00:00:00`,
  });
  const before = run(oldRoot.root);
  assert.equal(before.status, 0, before.stdout + before.stderr);

  const newRoot = sandbox();
  write(newRoot.root, {
    ...specFiles("openspec/changes/demo-change/specs/demo/alpha"),
    "openspec/changes/demo-change/specs/demo/alpha/feature-tcs.md": caseSuite({
      automation: "automated",
      decidedBy: null,
    }),
  });
  newRoot.git(["add", "-A"]);
  newRoot.git(["commit", "--quiet", "-m", "seed"], {
    GIT_AUTHOR_DATE: `${AFTER_GATE}T00:00:00`,
    GIT_COMMITTER_DATE: `${AFTER_GATE}T00:00:00`,
  });
  const after = run(newRoot.root);
  assert.equal(after.status, 1, after.stdout + after.stderr);
  assert.match(after.stdout, /carries no `\*\*Decided by:\*\*` line/);
});
