import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { waitingOnSpecs } from "./validate-changes.mjs";

/** Which changes the CLI is not asked about: the ones that have said what
 * they are waiting for, and nothing else. */

function change(files) {
  const dir = mkdtempSync(join(tmpdir(), "validate-changes-"));
  for (const [name, content] of Object.entries(files)) {
    const file = join(dir, name);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, content);
  }
  return dir;
}

const manifest = (body) =>
  `schema: grade10-planning\ncreated: 2026-09-15\n${body}`;

test("a change waiting on an input is excused, in its author's words", () => {
  const dir = change({
    ".openspec.yaml": manifest(
      "awaiting:\n  specs: the window nobody decided\n",
    ),
  });
  assert.equal(waitingOnSpecs(dir), "the window nobody decided");
});

test("a change that has started its deltas is past the wait", () => {
  const dir = change({
    ".openspec.yaml": manifest(
      "awaiting:\n  specs: the window nobody decided\n",
    ),
    "specs/demo/alpha/spec.md": "## ADDED Requirements\n",
  });
  assert.equal(waitingOnSpecs(dir), undefined);
});

test("a wait on another artifact does not excuse the requirements", () => {
  const dir = change({
    ".openspec.yaml": manifest("awaiting:\n  ui-design: nothing draws it\n"),
  });
  assert.equal(waitingOnSpecs(dir), undefined);
});

test("a wait with no reason is not a wait", () => {
  const dir = change({
    ".openspec.yaml": manifest("awaiting:\n  specs: ''\n"),
  });
  assert.equal(waitingOnSpecs(dir), undefined);
});

test("a change with no manifest, and one the reader refuses, excuse nothing", () => {
  assert.equal(waitingOnSpecs(change({ "proposal.md": "# x\n" })), undefined);
  assert.equal(
    waitingOnSpecs(change({ ".openspec.yaml": "awaiting: [\n" })),
    undefined,
  );
});
