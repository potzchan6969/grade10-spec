import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/** The round's reply to the hand a held row waits on, as the script prints
 * it for the change's thread. */

const SCRIPT = fileURLToPath(new URL("./held-row.mjs", import.meta.url));

function run(args) {
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [SCRIPT, ...args],
    { encoding: "utf8" },
  );
  return { status, stdout, stderr };
}

/** A change whose decisions hold one row held on QA, a page carrying the
 * sentence the row would put on it, and a record naming QA's handle. */
function rowRoot() {
  const root = mkdtempSync(join(tmpdir(), "held-row-"));
  const change = join(root, "openspec", "changes", "demo-change");
  mkdirSync(change, { recursive: true });
  writeFileSync(
    join(change, ".openspec.yaml"),
    'schema: grade10-planning\ncreated: 2026-09-22\nhands:\n  pm: "@ecchochan"\n  qa: "@chloe"\n',
  );
  writeFileSync(
    join(change, "decisions.md"),
    [
      "## Decisions",
      "",
      "| Id | Question | Decision | Instead of |",
      "| --- | --- | --- | --- |",
      "| Q1 | How many tiles? | Six - the owner's word | Eight |",
      "| Q3 | Does a sold-out pick stay in the rail? | ❓ qa - recommended: yes, with its badge, as Q1 counts it | Dropped |",
      "",
    ].join("\n"),
  );
  return root;
}

// Proves part of shared-planning-agent-rounds-US13-TC2-1.
test("shared-planning-agent-rounds-SC-86 - a held row is said as a reply mentioning its hand, with the row, the page sentence and the rows it touches quoted", () => {
  const root = rowRoot();
  const result = run(["Q3", "--change", "demo-change", "--root", root]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /@chloe/);
  assert.match(result.stdout, /Q3/);
  assert.match(result.stdout, /Does a sold-out pick stay in the rail\?/);
  assert.match(result.stdout, /recommended: yes, with its badge/);
  assert.match(
    result.stdout,
    /The sentence it would put on the page:\n> yes, with its badge/,
  );
  // The decision rows the held row touches, quoted.
  assert.match(result.stdout, /Q1 \| How many tiles\?/);
  assert.doesNotMatch(result.stdout, /@ecchochan/);
});

// Proves part of shared-planning-agent-rounds-US13-TC3-1.
test("shared-planning-agent-rounds-SC-86 - a held row is said once: a re-run with the row unchanged says nothing again", () => {
  const root = rowRoot();
  const first = run(["Q3", "--change", "demo-change", "--root", root]);
  assert.equal(first.status, 0, first.stderr);
  const again = run(["Q3", "--change", "demo-change", "--root", root]);
  assert.equal(again.status, 0, again.stderr);
  assert.match(again.stdout, /already said/);
  assert.doesNotMatch(again.stdout, /@chloe/);
});

test("shared-planning-agent-rounds-SC-86 - a held row names a role the record names no hand for as open, never as a mention", () => {
  const root = rowRoot();
  writeFileSync(
    join(root, "openspec", "changes", "demo-change", ".openspec.yaml"),
    'schema: grade10-planning\ncreated: 2026-09-22\nhands:\n  pm: "@ecchochan"\n',
  );
  const result = run(["Q3", "--change", "demo-change", "--root", root]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^QA \(open\) — Q3 waits on you\./m);
  assert.doesNotMatch(result.stdout, /@qa\b/);
});

test("shared-planning-agent-rounds-SC-86 - refuses a row that is not held", () => {
  const root = rowRoot();
  const result = run(["Q1", "--change", "demo-change", "--root", root]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Q1/);
  assert.match(result.stderr, /not held|decided/i);
});
