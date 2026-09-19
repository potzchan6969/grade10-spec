/*
 * `pnpm run tcs:automated <case-id…>` flips a case's Automation status to
 * `automated`, in place, in the suite file that holds it — refusing an id no
 * suite holds, and pushing nothing (`shared-planning-agent-rounds-SC-59`).
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

const CASE = (id, automation = "manual") =>
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

function sandbox(files) {
  const root = mkdtempSync(join(tmpdir(), "tcs-automated-"));
  for (const [path, text] of Object.entries(files)) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  return root;
}

const run = (root, ids) =>
  spawnSync(process.execPath, [SCRIPT, ...ids, "--root", root], {
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
