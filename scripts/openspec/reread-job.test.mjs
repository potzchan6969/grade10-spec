import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { outOfBounds, pushedPaths } from "./reread-guard.mjs";
import { addressFor, failureMessageOf } from "./reread-notify.mjs";
import { otherChangeDirectories, settingsFor } from "./reread-settings.mjs";

/**
 * The re-read job's own scripts: the settings a matrix entry runs under, the
 * guard that fails on what it pushed outside its own change, and the notice
 * a plain step posts. A bare remote stands in for the job's checkout and the
 * push the round makes to it, so the guard is proved against what a real run
 * pushes rather than against two commits in one working tree.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "reread-probe";
const OTHER = "other-change";
const DIR = `openspec/changes/${CHANGE}`;

/** A throwaway store with a bare remote: `main` carries two changes, and the
 * checkout is on `main`, as the re-read job's own checkout is. */
function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "reread-job-"));
  const write = (files) => {
    for (const [path, text] of Object.entries(files)) {
      const file = join(root, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, text);
    }
  };
  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=dana@test", "-c", "user.name=dana", ...args],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  write({
    [`${DIR}/.openspec.yaml`]: "schema: demo-planning\ncreated: 2026-10-01\n",
    [`${DIR}/proposal.md`]: "# Reread probe\n",
    [`openspec/changes/${OTHER}/.openspec.yaml`]:
      "schema: demo-planning\ncreated: 2026-10-01\n",
    [`openspec/changes/${OTHER}/proposal.md`]: "# Other change\n",
    "openspec/changes/archive/2026-01-01-done-change/proposal.md": "# Done\n",
    "packages/design-system/README.md": "the design system\n",
  });
  const remote = mkdtempSync(join(tmpdir(), "reread-remote-"));
  execFileSync("git", ["init", "--quiet", "--bare", remote]);
  execFileSync("git", [
    "-C",
    remote,
    "symbolic-ref",
    "HEAD",
    "refs/heads/main",
  ]);
  git("init", "--quiet", "--initial-branch=main", ".");
  git("add", "-A");
  git("commit", "--quiet", "-m", "the two changes");
  git("remote", "add", "origin", remote);
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  const before = git("rev-parse", "HEAD").trim();
  return { root, remote, git, write, before };
}

// ── One argv parser ───────────────────────────────────────────────────────

// `lib/args.mjs` refuses a valued option given no value, naming the flag
// beside the usage. All three of the job's scripts read their arguments
// through it rather than through a copy of the loop.

const refusal = (script, args) =>
  spawnSync(process.execPath, [join(SCRIPTS, script), ...args], {
    encoding: "utf8",
  });

test("the settings script's usage refusal names the flag it was given no value for", () => {
  const result = refusal("reread-settings.mjs", [CHANGE, "--out"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--out needs a value/);
  assert.match(result.stderr, /usage: node reread-settings\.mjs/);
});

test("the guard's usage refusal names the flag it was given no value for, for the log to read", () => {
  const result = refusal("reread-guard.mjs", [CHANGE, "--before"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::--before needs a value/);
  assert.match(result.stderr, /usage: node reread-guard\.mjs/);
});

test("the notify script's usage refusal names the flag it was given no value for", () => {
  const result = refusal("reread-notify.mjs", [CHANGE, "--message-file"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--message-file needs a value/);
  assert.match(result.stderr, /usage: node reread-notify\.mjs/);
});

// ── The settings a matrix entry runs under ─────────────────────────────────

test("otherChangeDirectories names every active change but this one and the archive", () => {
  const { root } = sandbox();

  assert.deepEqual(otherChangeDirectories(root, CHANGE), [OTHER]);
});

test("settingsFor denies the fixed paths and every other change's directory", () => {
  const { root } = sandbox();

  const settings = settingsFor(root, CHANGE);
  const deny = settings.permissions.deny;

  for (const glob of [".github/**", "packages/**", "tools/**"]) {
    assert.ok(deny.includes(`Read(${glob})`), `missing Read(${glob})`);
    assert.ok(deny.includes(`Edit(${glob})`), `missing Edit(${glob})`);
  }
  assert.ok(deny.includes(`Read(openspec/changes/${OTHER}/**)`));
  assert.ok(deny.includes(`Write(openspec/changes/${OTHER}/**)`));
  // Never its own directory, and never the archive as though it were a
  // change with a directory of its own.
  assert.ok(!deny.some((rule) => rule.includes(`openspec/changes/${CHANGE}/`)));
  assert.ok(!deny.some((rule) => rule.includes("openspec/changes/archive/**")));
});

// ── The guard ────────────────────────────────────────────────────────────

test("outOfBounds keeps only what falls outside the change's own directory", () => {
  assert.deepEqual(
    outOfBounds(
      [`${DIR}/decisions.md`, `${DIR}/specs/x/spec.md`, "packages/ui/src/x.ts"],
      CHANGE,
    ),
    ["packages/ui/src/x.ts"],
  );
});

test("the guard passes a push that stays inside the change's directory", () => {
  const { root, before, write, git } = sandbox();
  write({ [`${DIR}/decisions.md`]: "## Goals\n\n- One\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the round's own commit");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");

  assert.deepEqual(pushedPaths(root, before, "HEAD"), [`${DIR}/decisions.md`]);

  const result = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "reread-guard.mjs"),
      CHANGE,
      "--before",
      before,
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 path\(s\) pushed, all inside/);
});

test("the guard fails on a path the round pushed outside its own directory", () => {
  const { root, before, write, git } = sandbox();
  write({
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
    "packages/design-system/README.md": "rewritten\n",
  });
  git("add", "-A");
  git("commit", "--quiet", "-m", "reached outside the change");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");

  const result = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "reread-guard.mjs"),
      CHANGE,
      "--before",
      before,
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, /reread-probe/);
  assert.match(result.stderr, /packages\/design-system\/README\.md/);
});

test("the guard needs no fetch: it reads the checkout it was given --before", () => {
  const { root, before } = sandbox();

  const result = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "reread-guard.mjs"),
      CHANGE,
      "--before",
      before,
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^reread-probe: 0 path\(s\) pushed/);
});

// ── The failure and thread-summary notice ──────────────────────────────────

test("failureMessageOf names the change and links the run", () => {
  const text = failureMessageOf(CHANGE, "https://example.test/runs/9");

  assert.match(text, /Read again failed/);
  assert.match(text, /`reread-probe`/);
  assert.match(text, /<https:\/\/example\.test\/runs\/9\|Run>/);
});

test("failureMessageOf carries no link when the run has none", () => {
  assert.doesNotMatch(failureMessageOf(CHANGE), /<.*\|Run>/);
});

test("addressFor reads the change's own thread from its record", () => {
  const { root } = sandbox();

  assert.deepEqual(addressFor(root, OTHER, "C-FALLBACK"), {
    channel: "C-FALLBACK",
  });
});

test("addressFor prefers the thread over the fallback channel", () => {
  const { root, write } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]:
      "schema: demo-planning\ncreated: 2026-10-01\nthread: C0AB1/1700000000.000100\n",
  });

  assert.deepEqual(addressFor(root, CHANGE, "C-FALLBACK"), {
    channel: "C0AB1",
    threadTs: "1700000000.000100",
  });
});

test("addressFor throws when the change has neither a thread nor a fallback", () => {
  const { root } = sandbox();

  assert.throws(() => addressFor(root, OTHER, undefined), /no thread:/);
});

test("the notify script's dry run prints the failure line to the change's thread", () => {
  const { root, write } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]:
      "schema: demo-planning\ncreated: 2026-10-01\nthread: C0AB1/1700000000.000100\n",
  });

  const result = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "reread-notify.mjs"),
      CHANGE,
      "--run-url",
      "https://example.test/runs/9",
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /C0AB1/);
  assert.match(result.stdout, /Read again failed/);
});

test("the notify script skips an empty message file rather than posting nothing", () => {
  const { root, write } = sandbox();
  const file = join(root, "thread.txt");
  write({
    [`${DIR}/.openspec.yaml`]:
      "schema: demo-planning\ncreated: 2026-10-01\nthread: C0AB1/1700000000.000100\n",
  });
  writeFileSync(file, "\n");

  const result = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "reread-notify.mjs"),
      CHANGE,
      "--message-file",
      file,
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nothing to post/);
});

test("the notify script posts a written thread summary as it stands", () => {
  const { root, write } = sandbox();
  const file = join(root, "thread.txt");
  write({
    [`${DIR}/.openspec.yaml`]:
      "schema: demo-planning\ncreated: 2026-10-01\nthread: C0AB1/1700000000.000100\n",
  });
  writeFileSync(file, "*Read again* — nothing changed on `decisions`.\n");

  const result = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "reread-notify.mjs"),
      CHANGE,
      "--message-file",
      file,
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nothing changed on `decisions`/);
});
