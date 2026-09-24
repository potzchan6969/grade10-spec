/*
 * Q49 of `run-a-round-on-every-artifact`: a case a store unit or script test
 * decides flips to `automated` in the commit that lands the test, with the
 * suite naming what decides it. Nothing named it before this - so this file
 * pins the line's grammar (`lib/suites.mjs`) and the validator's verdicts over
 * it: an automated case of an in-flight change names what decides it, in its
 * place, once, and nothing else may.
 *
 * Every in-flight change owes the line, whatever day it opened (Q69), so there
 * is no date to fence and no git history to read: each test writes a fixture
 * store and runs the real `validate-test-cases.mjs` against it with `--root`,
 * rather than a copy of the script beside the fixture.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { isAutomated, parseSuite, ROOT, readSuite } from "./lib/suites.mjs";

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(SCRIPTS, "validate-test-cases.mjs");
/** A file every fixture holds, for a line to name. */
const DECIDER = "scripts/openspec/demo.test.mjs";

/**
 * One case under one journey, its classification block always the ten
 * properties, with the `**Decided by:**` line where `place` puts it:
 *
 *   after    directly after the block, which is the grammar
 *   late     after `**Pre-conditions:**`, which is not
 *   twice    after the block, and again below it
 *   bullet   as an eleventh classification bullet, the older shape
 *
 * `decidedBy` is the line's value as written, backticks and all; `null`
 * leaves the line off.
 */
function caseSuite({
  automation = "automated",
  decidedBy = null,
  place = "after",
} = {}) {
  const line = `**Decided by:** ${decidedBy}`;
  const has = decidedBy !== null;
  const block = [
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
    ...(has && place === "bullet" ? [`* ${line}`] : []),
  ];
  const afterBlock = has && (place === "after" || place === "twice");
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
    ...block,
    "",
    ...(afterBlock ? [line, ""] : []),
    ...(has && place === "twice" ? [line, ""] : []),
    "**Pre-conditions:**",
    "None.",
    "",
    ...(has && place === "late" ? [line, ""] : []),
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

/** `spec.md` and `user-journeys.md`, the two files a suite is a reading of -
 *  one journey, one scenario, nothing this suite's other checks would
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

/** A throwaway store the real validator reads through `--root`: a fixture
 *  checked by the script this repository ships rather than by a restatement
 *  of it. `at` is where the suite sits - under a change, or durable. */
function store(at, options) {
  const root = mkdtempSync(join(tmpdir(), "decided-by-"));
  const files = {
    [DECIDER]: "// the test that decides the case\n",
    ...specFiles(at),
    [`${at}/feature-tcs.md`]: caseSuite(options),
  };
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

const CHANGE = "openspec/changes/demo-change/specs/demo/alpha";
const DURABLE = "openspec/specs/demo/alpha";

/** `appRoot`, when given, is the grade10 clone the run is pointed at; the
 *  variable is otherwise removed, so a developer's own shell never decides a
 *  verdict. */
const run = (root, { appRoot = null } = {}) => {
  const env = { ...process.env, NO_COLOR: "1" };
  delete env.GRADE10_ROOT;
  if (appRoot !== null) env.GRADE10_ROOT = appRoot;
  return spawnSync(process.execPath, [SCRIPT, "--root", root], {
    encoding: "utf8",
    env,
  });
};

const inChange = (options) => run(store(CHANGE, options));

// --- the parser reads the line ---------------------------------------------

test("shared-planning-agent-rounds-SC-78 - the line reaches `decidedBy` with its own line number", () => {
  const suite = parseSuite(caseSuite({ decidedBy: DECIDER }));
  const [tc] = suite.journeys[0].cases;
  assert.deepEqual(tc.decidedBy, [
    { path: DECIDER, line: 27, repo: null, file: DECIDER },
  ]);
  assert.deepEqual(tc.decidedByLines, [
    {
      line: 27,
      bullet: false,
      misplaced: false,
      empty: false,
      repeated: false,
    },
  ]);
});

test("shared-planning-agent-rounds-SC-78 - `decidedBy` is empty when the case carries no line", () => {
  const suite = parseSuite(caseSuite());
  assert.deepEqual(suite.journeys[0].cases[0].decidedBy, []);
  assert.deepEqual(suite.journeys[0].cases[0].decidedByLines, []);
});

test("shared-planning-agent-rounds-SC-78 - more than one path, comma-separated, backticks stripped", () => {
  const suite = parseSuite(
    caseSuite({
      decidedBy: "`scripts/a.test.mjs`, tools/manual/test/b.test.ts",
    }),
  );
  assert.deepEqual(
    suite.journeys[0].cases[0].decidedBy.map(({ path }) => path),
    ["scripts/a.test.mjs", "tools/manual/test/b.test.ts"],
  );
});

test("shared-planning-agent-rounds-SC-78 - a second line accumulates rather than replacing the first", () => {
  const suite = parseSuite(caseSuite({ decidedBy: DECIDER, place: "twice" }));
  const [tc] = suite.journeys[0].cases;
  assert.equal(tc.decidedBy.length, 2);
  assert.deepEqual(
    tc.decidedByLines.map((one) => one.repeated),
    [false, true],
  );
});

// --- the validator's verdicts ----------------------------------------------

test("shared-planning-agent-rounds-SC-78 - an automated case naming a path that exists draws no error", () => {
  const result = inChange({ decidedBy: `\`${DECIDER}\`` });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Decided by/);
});

test("shared-planning-agent-rounds-SC-78 - an automated case of an in-flight change naming nothing is refused", () => {
  const result = inChange({ decidedBy: null });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /automated.*but carries no `\*\*Decided by:\*\*` line/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a durable suite owes no line yet", () => {
  const result = run(store(DURABLE, { decidedBy: null }));
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Decided by/);
});

test("shared-planning-agent-rounds-SC-78 - a line anywhere but after the block is refused by line number", () => {
  const result = inChange({ decidedBy: DECIDER, place: "late" });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /`demo-alpha-US1-TC1-1`'s `\*\*Decided by:\*\*` line sits at line 30, not directly after the classification block/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a second line is refused as repeated", () => {
  const result = inChange({ decidedBy: DECIDER, place: "twice" });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /`demo-alpha-US1-TC1-1` carries a second `\*\*Decided by:\*\*` line at line 29/,
  );
});

test("shared-planning-agent-rounds-SC-78 - the line as a classification bullet is a warning naming the case", () => {
  const result = inChange({ decidedBy: DECIDER, place: "bullet" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /`demo-alpha-US1-TC1-1` writes `\*\*Decided by:\*\*` as a classification bullet/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a path no checkout holds is refused", () => {
  const result = inChange({
    decidedBy: "scripts/openspec/does-not-exist.test.mjs",
  });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /names `scripts\/openspec\/does-not-exist\.test\.mjs`, which does not exist in this checkout/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a path that climbs out of the store is refused", () => {
  const result = inChange({ decidedBy: "../elsewhere/decides.test.mjs" });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /which resolves outside the store/);
});

test("shared-planning-agent-rounds-SC-78 - a directory decides nothing", () => {
  const result = inChange({ decidedBy: "scripts/openspec" });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /which is not a file — name the test/);
});

test("shared-planning-agent-rounds-SC-78 - an empty path is refused", () => {
  const result = inChange({ decidedBy: `${DECIDER},` });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /has an empty path — a doubled or trailing comma/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a line on a case that is not automated is a warning", () => {
  const result = run(
    store(DURABLE, { automation: "manual", decidedBy: DECIDER }),
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /carries `\*\*Decided by:\*\*` but its \*\*Automation status\*\* is not `automated`/,
  );
});

// --- a path in the application repository ---------------------------------

const WALK = "apps/frontend/grade10/e2e/tests/vault/offer.spec.ts";

/** A throwaway grade10 clone holding the one walk a prefixed path names. */
function appClone() {
  const root = mkdtempSync(join(tmpdir(), "decided-by-app-"));
  mkdirSync(dirname(join(root, WALK)), { recursive: true });
  writeFileSync(join(root, WALK), "// the walk that decides the case\n");
  return root;
}

test("shared-planning-agent-rounds-SC-78 - a prefixed path reaches `decidedBy` split into its repository and file", () => {
  const suite = parseSuite(caseSuite({ decidedBy: `\`grade10:${WALK}\`` }));
  assert.deepEqual(suite.journeys[0].cases[0].decidedBy, [
    { path: `grade10:${WALK}`, line: 27, repo: "grade10", file: WALK },
  ]);
});

test("shared-planning-agent-rounds-SC-78 - a prefixed path that exists in the named clone draws no error and no warning", () => {
  const result = run(store(CHANGE, { decidedBy: `grade10:${WALK}` }), {
    appRoot: appClone(),
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Decided by/);
});

test("shared-planning-agent-rounds-SC-78 - a prefixed path the named clone does not hold is refused", () => {
  const app = appClone();
  const result = run(
    store(CHANGE, {
      decidedBy: "grade10:apps/frontend/grade10/e2e/tests/vault/gone.spec.ts",
    }),
    { appRoot: app },
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    new RegExp(
      `names \`grade10:apps/frontend/grade10/e2e/tests/vault/gone\\.spec\\.ts\`, which does not exist in the grade10 clone at ${app.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    ),
  );
});

test("shared-planning-agent-rounds-SC-78 - a prefixed path with no clone named is a warning, once per suite", () => {
  const result = run(store(CHANGE, { decidedBy: `grade10:${WALK}` }));
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /1 `\*\*Decided by:\*\*` path names the grade10 repository, unchecked because `GRADE10_ROOT` names no clone: `grade10:apps\/frontend\/grade10\/e2e\/tests\/vault\/offer\.spec\.ts`/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a prefix no repository answers to is refused by name", () => {
  const result = run(store(CHANGE, { decidedBy: `grade11:${WALK}` }), {
    appRoot: appClone(),
  });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /whose prefix `grade11:` names no repository this store knows — write `grade10:`, or a bare path for the store's own/,
  );
});

test("shared-planning-agent-rounds-SC-78 - a prefixed path that climbs out of the clone is refused", () => {
  const result = run(
    store(CHANGE, { decidedBy: "grade10:../elsewhere/decides.spec.ts" }),
    { appRoot: appClone() },
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /which resolves outside the grade10 clone/);
});

test("shared-planning-agent-rounds-SC-78 - a bare path keeps its meaning with a clone named: the store's, and it must exist", () => {
  const app = appClone();
  const found = run(store(CHANGE, { decidedBy: DECIDER }), { appRoot: app });
  assert.equal(found.status, 0, found.stdout + found.stderr);
  assert.doesNotMatch(found.stdout, /Decided by/);

  // The walk is in the clone, not the store: bare, it is looked for here.
  const bare = run(store(CHANGE, { decidedBy: WALK }), { appRoot: app });
  assert.equal(bare.status, 1, bare.stdout + bare.stderr);
  assert.match(bare.stdout, /which does not exist in this checkout/);
});

test("shared-planning-agent-rounds-SC-78 - a clone variable naming no directory stops the run", () => {
  const result = run(store(CHANGE, { decidedBy: DECIDER }), {
    appRoot: join(tmpdir(), "decided-by-no-such-clone"),
  });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /GRADE10_ROOT names `.*`, which is no directory/);
});

// --- the two suites this store back-filled ---------------------------------

test("shared-planning-agent-rounds-SC-78 - every automated case of the two back-filled suites names a file that exists", () => {
  const suites = [
    "openspec/changes/run-a-round-on-every-artifact/specs/shared/planning/agent-rounds/feature-tcs.md",
    "openspec/changes/stage-changes-and-notify-hands/specs/shared/planning/change-stages/feature-tcs.md",
  ];
  let checked = 0;
  for (const rel of suites) {
    const read = readSuite(ROOT, join(ROOT, rel));
    for (const tc of read.cases.filter(isAutomated)) {
      assert.ok(
        tc.decidedBy.length > 0,
        `${tc.id} is automated and names no deciding test`,
      );
      for (const { path } of tc.decidedBy) {
        assert.ok(existsSync(join(ROOT, path)), `${tc.id} names ${path}`);
        checked += 1;
      }
    }
  }
  assert.ok(checked > 0, "neither suite holds an automated case any more");
});
