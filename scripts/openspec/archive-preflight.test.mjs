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

const SCRIPT = fileURLToPath(
  new URL("./archive-preflight.mjs", import.meta.url),
);
const CHANGE = "build-alpha";

/** The script roots itself on its own location, so a throwaway store carries a
 * throwaway copy of it. Returns the copy to run and the manifest it writes. */
function sandbox(files) {
  const root = mkdtempSync(join(tmpdir(), "archive-preflight-"));
  const script = join(root, "scripts", "openspec", "archive-preflight.mjs");
  mkdirSync(dirname(script), { recursive: true });
  copyFileSync(SCRIPT, script);
  const dir = join(root, "openspec", "changes", CHANGE);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content);
  }
  return { script, manifest: join(dir, ".openspec.yaml") };
}

const run = (script, ...args) =>
  spawnSync(process.execPath, [script, CHANGE, ...args], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

const PROPOSAL = { "proposal.md": "# Build alpha\n\n## Why\n\nTo ship it.\n" };
const SHIPPED = ["--deployed-at", "0f1e2d3", "--deployed-env", "production"];

test("refuses a deployed sha naming no environment", () => {
  const { script } = sandbox(PROPOSAL);
  const result = run(script, "--deployed-at", "0f1e2d3");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--deployed-at needs --deployed-env/);
});

test("refuses an unchecked task until a waiver names the decision", () => {
  const files = {
    ...PROPOSAL,
    "tasks.md": "## 1. Build it\n\n- [x] 1.1 Ship it\n- [ ] 1.2 Log it\n",
  };
  const refused = run(sandbox(files).script, ...SHIPPED);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /1 task\(s\) unchecked/);
  assert.match(refused.stderr, /- \[ \] 1\.2 Log it/);

  const waived = run(
    sandbox(files).script,
    ...SHIPPED,
    "--tasks-waived",
    "@echo, the logging ships separately",
  );
  assert.equal(waived.status, 0);
});

test("a clear run writes the record quoted, over the waiver it replaces", () => {
  const { script, manifest } = sandbox({
    ...PROPOSAL,
    ".openspec.yaml":
      'schema: grade10-planning\ndeploy_waived: "@echo, nothing shipped"\n',
  });
  const result = run(script, ...SHIPPED);

  assert.equal(result.status, 0);
  assert.equal(
    readFileSync(manifest, "utf8"),
    'schema: grade10-planning\ndeployed_at: "0f1e2d3"\ndeployed_env: "production"\n',
  );
});
