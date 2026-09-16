import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "build-alpha";

/** The script roots itself on its own location, so a throwaway store carries a
 * throwaway copy of it, with one planned change committed and `origin/main` at
 * that commit. Returns the copy to run and git in the store. */
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "plan-preflight-"));
  const scripts = join(root, "scripts", "openspec");
  mkdirSync(scripts, { recursive: true });
  for (const name of ["plan-preflight.mjs", "store-main.mjs"]) {
    copyFileSync(join(SCRIPTS, name), join(scripts, name));
  }
  const tasks = join(root, "openspec", "changes", CHANGE, "tasks.md");
  mkdirSync(dirname(tasks), { recursive: true });
  writeFileSync(tasks, "## 1. Build it (owner: @dana)\n\n- [x] 1.1 Ship it\n");

  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=preflight@test", "-c", "user.name=preflight", ...args],
      { cwd: root, stdio: "ignore" },
    );
  git("init", "--quiet", ".");
  git("add", "-A");
  git("commit", "--quiet", "-m", "the plan");
  git("update-ref", "refs/remotes/origin/main", "HEAD");
  return { script: join(scripts, "plan-preflight.mjs"), git };
}

const run = (script) =>
  spawnSync(process.execPath, [script, CHANGE], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", PLAN_NO_FETCH: "1" },
  });

test("clears a plan that is current with the store's main", () => {
  const result = run(sandbox().script);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /Safe to edit build-alpha — up to date with origin\/main/,
  );
});

test("refuses a store with no main to check claims against", () => {
  const { script, git } = sandbox();
  git("update-ref", "-d", "refs/remotes/origin/main");
  const result = run(script);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no origin main to check claims against/);
});
