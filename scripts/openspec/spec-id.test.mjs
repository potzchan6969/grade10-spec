/*
 * `spec:id`'s reader, asserted on the two things a read can say that are not
 * text — `scan`'s own comment in `spec-id.mjs` says why each is what it is —
 * and the script run as a script, so the guard that lets its test import it
 * is held to still running it.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { scan } from "./spec-id.mjs";

const SCRIPT = fileURLToPath(new URL("./spec-id.mjs", import.meta.url));

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

test("run as a script, spec:id still answers an id the store issues", () => {
  // The guard that lets this file import `scan` compares the module's url to
  // the script's path; a comparison that stopped matching would print
  // nothing and exit 0, which no import-side case would see.
  const ran = spawnSync(
    process.execPath,
    [SCRIPT, "shared-planning-change-stages-SC-77", "--path"],
    { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } },
  );

  assert.equal(ran.status, 0, ran.stderr);
  assert.match(ran.stdout, /change-stages\/spec\.md:\d+/);
});
