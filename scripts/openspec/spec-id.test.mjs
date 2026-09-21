/*
 * `spec:id` reads every file the store may cite an id in, and the two things
 * a read can say that are not text are asserted here: a file gone since the
 * walk listed it issues no id, and a file that is there and cannot be read
 * stops the run and names the file — the ids it holds are what the query is
 * asking for, so answering "nowhere" would be wrong rather than empty.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { scan } from "./spec-id.mjs";

test("a file that is there and cannot be read stops the run, naming the file", () => {
  const dir = mkdtempSync(join(tmpdir(), "spec-id-"));
  // A directory where a file was expected: the read refuses it as it refuses
  // a file the run may not open, and the walk's own filter never lists one.
  const unreadable = join(dir, "spec.md");
  mkdirSync(unreadable);

  assert.throws(
    () => scan([unreadable]),
    (error) => {
      assert.match(error.message, /cannot be read/);
      assert.ok(
        error.message.includes(unreadable),
        `the refusal names the file it could not read: ${error.message}`,
      );
      return true;
    },
  );
});

test("a file gone since the walk listed it issues no id, and the rest are read", () => {
  const dir = mkdtempSync(join(tmpdir(), "spec-id-"));
  const kept = join(dir, "spec.md");
  writeFileSync(
    kept,
    "#### Scenario: demo-thing-SC-01 - It holds\n\nCites demo-thing-SC-02.\n",
  );

  const { definitions, mentions } = scan([join(dir, "gone.md"), kept]);

  assert.deepEqual([...definitions.keys()], ["demo-thing-SC-01"]);
  assert.deepEqual([...mentions.keys()], ["demo-thing-SC-02"]);
});
