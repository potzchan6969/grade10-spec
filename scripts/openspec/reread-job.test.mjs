import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { landedShas } from "./lib/landed.mjs";
import { writableBy } from "./lib/writable.mjs";
import { outOfBounds, pushedPaths } from "./reread-guard.mjs";

/**
 * What a re-read may write (`lib/writable.mjs`), and the guard that fails on
 * a path it pushed outside that set. What the settings once denied and the
 * notice once posted are the relay's own business now — the session runs the
 * guard itself before it pushes (`reread-guard.mjs`'s own header), and
 * `relay-post.mjs` is what tells the thread. A bare remote stands in for the
 * session's checkout and the push it makes to it, so the guard is proved
 * against what a real run pushes rather than against two commits in one
 * working tree.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "reread-probe";
const OTHER = "other-change";
const DIR = `openspec/changes/${CHANGE}`;
/** The page this change's proposal links, and one it does not. */
const PAGE = "docs/prds/products/shared/planning/agent-rounds.md";
const UNLINKED = "docs/prds/products/shared/planning/change-stages.md";

/** A throwaway store with a bare remote: `main` carries two changes, and the
 * checkout is on `main`, as the session's own checkout is. */
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
    [`${DIR}/proposal.md`]: [
      "# Reread probe",
      "",
      `The page it marks: [Agent Rounds](../../../${PAGE}#the-walk).`,
      "",
    ].join("\n"),
    [`openspec/changes/${OTHER}/.openspec.yaml`]:
      "schema: demo-planning\ncreated: 2026-10-01\n",
    [`openspec/changes/${OTHER}/proposal.md`]: "# Other change\n",
    "openspec/changes/archive/2026-01-01-done-change/proposal.md": "# Done\n",
    // The trees a writable path is computed from: one holding a writable
    // path, the rest holding none.
    [PAGE]: "# Agent Rounds\n\n## The Walk\n\nThe round reads the draft.\n",
    [UNLINKED]: "# Change Stages\n\nAnother change's page.\n",
    "docs/governance/writing.md": "# Writing\n",
    "openspec/specs/shared/planning/agent-rounds/spec.md": "# Spec\n",
    "openspec/schemas/demo-planning/schema.yaml": "name: demo-planning\n",
    "scripts/openspec/plan-land.mjs": "// the landing step\n",
    ".claude/skills/round/SKILL.md": "# Round\n",
    ".github/workflows/proposal-notify.yml": "name: notify\n",
    "packages/design-system/README.md": "the design system\n",
    "tools/manual/check/rounds.mjs": "// the round rule\n",
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

// ── The guard's own argv parser ─────────────────────────────────────────────

// `lib/args.mjs` refuses a valued option given no value, naming the flag
// beside the usage.

const refusal = (script, args) =>
  spawnSync(process.execPath, [join(SCRIPTS, script), ...args], {
    encoding: "utf8",
  });

test("the guard's usage refusal names the flag it was given no value for, for the log to read", () => {
  const result = refusal("reread-guard.mjs", [CHANGE, "--before"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::--before needs a value/);
  assert.match(result.stderr, /usage: node reread-guard\.mjs/);
});

test("the guard knows no --after: it reads the checkout it was given", () => {
  const result = refusal("reread-guard.mjs", [
    CHANGE,
    "--before",
    "HEAD",
    "--after",
    "HEAD",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown option --after/);
});

// ── What a re-read may write ────────────────────────────────────────────────

test("writableBy names the change's own directory and the pages its proposal links", () => {
  const { root } = sandbox();

  assert.deepEqual(writableBy(root, CHANGE), [`${DIR}/`, PAGE]);
});

// ── The guard ────────────────────────────────────────────────────────────

test("outOfBounds keeps only what falls outside the writable set", () => {
  assert.deepEqual(
    outOfBounds(
      [
        `${DIR}/decisions.md`,
        `${DIR}/specs/x/spec.md`,
        PAGE,
        UNLINKED,
        "packages/ui/src/x.ts",
      ],
      [`${DIR}/`, PAGE],
    ),
    [UNLINKED, "packages/ui/src/x.ts"],
  );
});

test("landedShas reads one sha per line and nothing from a file that is not there", () => {
  const { root, write, git } = sandbox();

  assert.deepEqual(landedShas(root), []);

  const head = git("rev-parse", "HEAD").trim();
  write({ ".round/landed": `${head}\n\n${head}\n` });

  assert.deepEqual(landedShas(root), [head, head]);
});

test("the guard passes a page the change's proposal links", () => {
  const { root, before, write, git } = sandbox();
  write({ [PAGE]: "# Agent Rounds\n\n## The Walk\n\n❓ Who reads it?\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "mark the page the proposal links");
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

  assert.equal(result.status, 0, result.stderr);
});

test("the guard fails on a page the proposal never linked, and on a script", () => {
  const { root, before, write, git } = sandbox();
  write({
    [UNLINKED]: "# Change Stages\n\nRewritten by the wrong round.\n",
    "scripts/openspec/plan-land.mjs": "// rewritten\n",
  });
  git("add", "-A");
  git("commit", "--quiet", "-m", "reached past the pages it links");
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
  assert.match(result.stderr, /change-stages\.md/);
  assert.match(result.stderr, /scripts\/openspec\/plan-land\.mjs/);
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
  assert.match(result.stdout, /1 path\(s\) pushed/);
  assert.match(result.stdout, /all inside/);
  // No `.round/landed` in this checkout: the guard falls back to the range
  // the job started from, and says which it read.
  assert.match(result.stdout, /no \.round\/landed/);
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

test("shared-planning-agent-rounds-SC-67 - the guard reads the commits this run made, though main moved under it", () => {
  const { root, before, write, git } = sandbox();
  // Somebody else's landing, which the run's own checkout gains when
  // `plan:land` rebases the change's branch on a moved `origin/main`: inside
  // the range the run started from, and none of this run's business.
  write({ "scripts/openspec/plan-land.mjs": "// somebody else's fix\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "a fix that landed under the run");
  // This run's own commit, the one `.round/landed` names.
  write({ [`${DIR}/decisions.md`]: "## Goals\n\n- One\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the round's own commit");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  write({ ".round/landed": `${git("rev-parse", "HEAD").trim()}\n` });

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
  assert.match(result.stdout, /1 path\(s\) pushed/);
  assert.match(result.stdout, /\.round\/landed/);
});

test("the guard fails on a path the run's own commit reached outside, bound or not", () => {
  const { root, before, write, git } = sandbox();
  write({
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
    [UNLINKED]: "# Change Stages\n\nRewritten by the wrong round.\n",
  });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the round reached past its own pages");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  write({ ".round/landed": `${git("rev-parse", "HEAD").trim()}\n` });

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
  assert.match(result.stderr, /change-stages\.md/);
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
