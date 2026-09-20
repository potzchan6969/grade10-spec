/*
 * `pnpm run tcs:automated <case-id…>` flips a case's Automation status to
 * `automated`, in place, in the suite file that holds it — refusing an id no
 * suite holds, and pushing nothing (`shared-planning-agent-rounds-SC-59`).
 *
 * The flip and the `**Decided by:**` line that names what decided it are one
 * edit, so a case of an in-flight change cannot be flipped without naming it
 * (`shared-planning-agent-rounds-SC-78`).
 *
 * A throwaway store with a `--root` override, the same way the round scripts
 * are tested: this script's own `findSuites(ROOT)` would otherwise always
 * read this repository.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(SCRIPTS, "tcs-automated.mjs");

const CASE = (id, automation = "manual", decidedBy = null) =>
  [
    `### ${id}: A case`,
    "",
    "**Classification:**",
    "",
    "* **Severity:** major",
    "* **Priority:** high",
    "* **Status:** actual",
    "* **Behaviour:** positive",
    "* **Type:** functional",
    "* **Suites:** regression",
    "* **Layer:** e2e",
    `* **Automation status:** ${automation}`,
    "* **Testability:** automation",
    "* **Trace:** demo-thing-widget-US-01",
    "",
    ...(decidedBy === null ? [] : [`**Decided by:** \`${decidedBy}\``, ""]),
    "**Pre-conditions:** None.",
    "",
    "**Steps:**",
    "",
    "1. Do the thing.",
    "",
    "**Expected Results:**",
    "",
    "* It happens.",
    "",
  ].join("\n");

const SUITE = (...cases) =>
  [
    "# demo/thing/widget Test Cases",
    "",
    "**Status:** approved",
    "",
    "## demo-thing-widget-US1: Somebody does a thing",
    "",
    "**As a** collector,",
    "**I want** a thing,",
    "**so that** it is done.",
    "",
    ...cases,
  ].join("\n");

const SUITE_PATH = "openspec/specs/demo/thing/widget/feature-tcs.md";
/** The same suite under a change still in flight, whose automated cases owe
 *  the line (Q69 of `run-a-round-on-every-artifact`). */
const CHANGE_PATH =
  "openspec/changes/demo-change/specs/demo/thing/widget/feature-tcs.md";
const DECIDER = "scripts/openspec/demo.test.mjs";

function sandbox(files) {
  const root = mkdtempSync(join(tmpdir(), "tcs-automated-"));
  for (const [path, text] of Object.entries(files)) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  return root;
}

const run = (root, ids, ...args) =>
  spawnSync(process.execPath, [SCRIPT, ...ids, "--root", root, ...args], {
    encoding: "utf8",
  });

test("shared-planning-agent-rounds-SC-59 - flips a case's Automation status to `automated`, in place", () => {
  const root = sandbox({
    [SUITE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
  });

  const result = run(root, ["demo-thing-widget-US1-TC1-1"]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    readFileSync(join(root, SUITE_PATH), "utf8"),
    /\*\*Automation status:\*\* automated/,
  );
  assert.match(result.stdout, /manual → automated/);
});

test("leaves an already-automated case alone, and says so", () => {
  const root = sandbox({
    [SUITE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1", "automated")),
  });
  const before = readFileSync(join(root, SUITE_PATH), "utf8");

  const result = run(root, ["demo-thing-widget-US1-TC1-1"]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(join(root, SUITE_PATH), "utf8"), before);
  assert.match(result.stdout, /already automated/);
});

test("refuses a case with no `**Automation status:**` line, distinct from a name nobody issued", () => {
  const root = sandbox({
    [SUITE_PATH]: SUITE(
      [
        "### demo-thing-widget-US1-TC1-1: A case",
        "",
        "**Classification:**",
        "",
        "* **Severity:** major",
        "* **Priority:** high",
        "* **Status:** actual",
        "* **Behaviour:** positive",
        "* **Type:** functional",
        "* **Suites:** regression",
        "* **Layer:** e2e",
        "* **Testability:** automation",
        "* **Trace:** demo-thing-widget-US-01",
        "",
        "**Pre-conditions:** None.",
        "",
        "**Steps:**",
        "",
        "1. Do the thing.",
        "",
        "**Expected Results:**",
        "",
        "* It happens.",
        "",
      ].join("\n"),
    ),
  });
  const before = readFileSync(join(root, SUITE_PATH), "utf8");

  const result = run(root, ["demo-thing-widget-US1-TC1-1"]);

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /`demo-thing-widget-US1-TC1-1` has no `\*\*Automation status:\*\*` line/,
  );
  assert.equal(readFileSync(join(root, SUITE_PATH), "utf8"), before);
});

test("refuses an id no suite holds, and pushes nothing", () => {
  const root = sandbox({
    [SUITE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
  });
  const before = readFileSync(join(root, SUITE_PATH), "utf8");

  const result = run(root, ["demo-thing-widget-US9-TC9-1"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /demo-thing-widget-US9-TC9-1/);
  assert.equal(readFileSync(join(root, SUITE_PATH), "utf8"), before);
});

test("refuses the whole call when one of several ids is unknown, flipping none", () => {
  const root = sandbox({
    [SUITE_PATH]: SUITE(
      CASE("demo-thing-widget-US1-TC1-1"),
      "",
      CASE("demo-thing-widget-US1-TC2-1"),
    ),
  });
  const before = readFileSync(join(root, SUITE_PATH), "utf8");

  const result = run(root, [
    "demo-thing-widget-US1-TC1-1",
    "demo-thing-widget-US9-TC9-1",
  ]);

  assert.notEqual(result.status, 0);
  assert.equal(readFileSync(join(root, SUITE_PATH), "utf8"), before);
});

test("flips every case named across suite files in one call", () => {
  const otherPath = "openspec/specs/demo/thing/second/feature-tcs.md";
  const root = sandbox({
    [SUITE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
    [otherPath]: SUITE(CASE("demo-thing-second-US1-TC1-1")).replace(
      "demo/thing/widget",
      "demo/thing/second",
    ),
  });

  const result = run(root, [
    "demo-thing-widget-US1-TC1-1",
    "demo-thing-second-US1-TC1-1",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    readFileSync(join(root, SUITE_PATH), "utf8"),
    /\*\*Automation status:\*\* automated/,
  );
  assert.match(
    readFileSync(join(root, otherPath), "utf8"),
    /\*\*Automation status:\*\* automated/,
  );
});

test("shared-planning-agent-rounds-SC-78 - writes the status and the `**Decided by:**` line in its place, in one edit", () => {
  const root = sandbox({
    [CHANGE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
  });

  const result = run(
    root,
    ["demo-thing-widget-US1-TC1-1"],
    "--decided-by",
    DECIDER,
  );

  assert.equal(result.status, 0, result.stderr);
  const lines = readFileSync(join(root, CHANGE_PATH), "utf8").split("\n");
  const status = lines.findIndex((one) =>
    one.startsWith("* **Automation status:**"),
  );
  const trace = lines.findIndex((one) => one.startsWith("* **Trace:**"));
  assert.equal(lines[status], "* **Automation status:** automated");
  // Directly after the classification block, which is the one place a
  // scanning reader looks for it.
  assert.equal(lines[trace + 1], "");
  assert.equal(lines[trace + 2], `**Decided by:** \`${DECIDER}\``);
  assert.equal(lines[trace + 3], "");
  assert.equal(lines[trace + 4], "**Pre-conditions:** None.");
  assert.match(result.stdout, new RegExp(`decided by ${DECIDER}`));
});

test("shared-planning-agent-rounds-SC-78 - refuses a flip of an in-flight change's case that names no path", () => {
  const root = sandbox({
    [CHANGE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
  });
  const before = readFileSync(join(root, CHANGE_PATH), "utf8");

  const result = run(root, ["demo-thing-widget-US1-TC1-1"]);

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /demo-thing-widget-US1-TC1-1 — a case of an in-flight change owes `--decided-by <path>`/,
  );
  assert.equal(readFileSync(join(root, CHANGE_PATH), "utf8"), before);
});

test("shared-planning-agent-rounds-SC-78 - a case already carrying the line, flipped again with no flag, keeps it", () => {
  const root = sandbox({
    [CHANGE_PATH]: SUITE(
      CASE("demo-thing-widget-US1-TC1-1", "automated", DECIDER),
    ),
  });
  const before = readFileSync(join(root, CHANGE_PATH), "utf8");

  const result = run(root, ["demo-thing-widget-US1-TC1-1"]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(join(root, CHANGE_PATH), "utf8"), before);
  assert.match(result.stdout, /already automated/);
});

test("shared-planning-agent-rounds-SC-78 - a durable case is flipped without naming anything", () => {
  const root = sandbox({
    [SUITE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
  });

  const result = run(root, ["demo-thing-widget-US1-TC1-1"]);

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(
    readFileSync(join(root, SUITE_PATH), "utf8"),
    /\*\*Decided by:\*\*/,
  );
});

test("shared-planning-agent-rounds-SC-78 - names the deciding paths on every case of one call", () => {
  const second =
    "openspec/changes/demo-change/specs/demo/thing/second/feature-tcs.md";
  const root = sandbox({
    [CHANGE_PATH]: SUITE(
      CASE("demo-thing-widget-US1-TC1-1"),
      "",
      CASE("demo-thing-widget-US1-TC2-1"),
    ),
    [second]: SUITE(CASE("demo-thing-second-US1-TC1-1")).replace(
      "demo/thing/widget",
      "demo/thing/second",
    ),
  });

  const result = run(
    root,
    [
      "demo-thing-widget-US1-TC1-1",
      "demo-thing-widget-US1-TC2-1",
      "demo-thing-second-US1-TC1-1",
    ],
    "--decided-by",
    `${DECIDER},tools/manual/test/demo.test.ts`,
  );

  assert.equal(result.status, 0, result.stderr);
  const written = readFileSync(join(root, CHANGE_PATH), "utf8");
  // Both cases in the one file, and the second's line not pushed onto the
  // first's: a file is written bottom up so the lines above keep their place.
  assert.equal(written.match(/\*\*Decided by:\*\* `.+`, `.+`\n/g)?.length, 2);
  assert.match(readFileSync(join(root, second), "utf8"), /\*\*Decided by:\*\*/);
  assert.equal(
    written.split("\n").filter((one) => one.startsWith("**Pre-conditions:**"))
      .length,
    2,
  );
});

test("shared-planning-agent-rounds-SC-78 - refuses `--decided-by` with an empty path", () => {
  const root = sandbox({
    [CHANGE_PATH]: SUITE(CASE("demo-thing-widget-US1-TC1-1")),
  });
  const before = readFileSync(join(root, CHANGE_PATH), "utf8");

  const result = run(
    root,
    ["demo-thing-widget-US1-TC1-1"],
    "--decided-by",
    `${DECIDER},`,
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--decided-by names an empty path/);
  assert.equal(readFileSync(join(root, CHANGE_PATH), "utf8"), before);
});
