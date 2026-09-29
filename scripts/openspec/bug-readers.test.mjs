/*
 * A bug fix is read in two rounds, and who reads each is data in the schema's
 * `bug:` block. These tests hold `bug-readers.mjs` and the lib's lookup to
 * that: the floor on every round, design summoned by a symptom a reader sees
 * in both rounds, the build's readings only where the fix lands code, and a
 * refusal where the schema names nobody.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  bugRound,
  perspectivesOf,
  planningSchema,
} from "./lib/perspectives.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CLI = join(HERE, "bug-readers.mjs");
const SCHEMA = "openspec/schemas/grade10-planning/schema.yaml";

const scratch = () => mkdtempSync(join(tmpdir(), "bug-readers-"));
const file = (dir, name, text) => {
  const path = join(dir, name);
  writeFileSync(path, text);
  return path;
};
const run = (args, root = ROOT) =>
  spawnSync(process.execPath, [CLI, ...args, "--root", root], {
    encoding: "utf8",
  });
const readersOf = (args, root) => {
  const result = run(args, root);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
};
const names = ({ readers }) => readers.map(({ name }) => name).sort();

const DIAGNOSIS = `# Diagnosis

## Lane

Bug fix - the design draws the focus ring whole.

## Root Cause

The dialog body clips at its own edge.
`;

const CODE_DIFF = `diff --git a/packages/design-system/src/components/overlays/dialog.tsx b/packages/design-system/src/components/overlays/dialog.tsx
@@ -1,1 +1,1 @@
-const body = "flex";
+const body = "-m-1 flex p-1";
`;

test("a bug round is named bug:diagnosis or bug:fix, and nothing else is", () => {
  assert.equal(bugRound("bug:diagnosis"), "diagnosis");
  assert.equal(bugRound(" bug:fix "), "fix");
  assert.equal(bugRound("bug:review"), undefined);
  assert.equal(bugRound("tasks"), undefined);
});

test("the schema's bug block names a reader file for every perspective", () => {
  const { bug } = planningSchema(ROOT);
  for (const round of ["diagnosis", "fix"]) {
    assert.ok(bug[round].length > 0, `${round} lists no readers`);
    for (const { agent } of bug[round])
      assert.ok(readFileSync(join(ROOT, agent), "utf8").length > 0, agent);
  }
});

test("the diagnosis round reads the lane, the root cause, the test and the smaller fix", () => {
  const dir = scratch();
  const said = readersOf([
    "diagnosis",
    "--diagnosis",
    file(dir, "d.md", DIAGNOSIS),
  ]);
  assert.deepEqual(names(said), ["lane", "qa", "root-cause", "simpler"]);
  assert.equal(said.verifier, true);
});

test("a symptom a reader sees summons design in both rounds", () => {
  const dir = scratch();
  const seen = file(
    dir,
    "d.md",
    `${DIAGNOSIS}\n## Screens\n\n- Sign-in dialog at 1280px wide\n`,
  );
  const diff = file(dir, "fix.diff", CODE_DIFF);
  assert.ok(
    names(readersOf(["diagnosis", "--diagnosis", seen])).includes("surface"),
  );
  assert.ok(
    names(readersOf(["fix", "--diff", diff, "--diagnosis", seen])).includes(
      "surface",
    ),
  );
  assert.ok(
    !names(
      readersOf([
        "fix",
        "--diff",
        diff,
        "--diagnosis",
        file(dir, "plain.md", DIAGNOSIS),
      ]),
    ).includes("surface"),
  );
});

test("a fix that lands code is read by the build's three readings", () => {
  const dir = scratch();
  const said = readersOf([
    "fix",
    "--diff",
    file(dir, "fix.diff", CODE_DIFF),
    "--diagnosis",
    file(dir, "d.md", DIAGNOSIS),
  ]);
  assert.deepEqual(names(said), [
    "code-smell",
    "conventions",
    "missing-pieces",
    "qa",
    "simpler",
  ]);
});

test("a fix round refuses to run without its diff", () => {
  const dir = scratch();
  const result = run(["fix", "--diagnosis", file(dir, "d.md", DIAGNOSIS)]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--diff/);
});

test("a schema whose bug block names nobody refuses the round rather than dispatching nobody", () => {
  const root = scratch();
  mkdirSync(join(root, dirname(SCHEMA)), { recursive: true });
  copyFileSync(join(ROOT, SCHEMA), join(root, SCHEMA));
  const text = readFileSync(join(root, SCHEMA), "utf8");
  writeFileSync(join(root, SCHEMA), text.slice(0, text.indexOf("\nbug:\n")));
  assert.throws(
    () => perspectivesOf(planningSchema(root), "bug:fix"),
    /names no readers for fix/,
  );
  const result = run(
    ["diagnosis", "--diagnosis", file(root, "d.md", DIAGNOSIS)],
    root,
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /names no readers for diagnosis/);
});
