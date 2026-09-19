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
/** The page this change's proposal links, and one it does not. */
const PAGE = "docs/prds/products/shared/planning/agent-rounds.md";
const UNLINKED = "docs/prds/products/shared/planning/change-stages.md";

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
    // The trees the settings are computed from: one holding a writable path,
    // the rest holding none.
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

// An input nothing reads is an input a run can be given wrongly: the job
// posts from a file and diffs against `HEAD`, so neither option is offered.
test("the notify script knows no --message: the round writes a file", () => {
  const result = refusal("reread-notify.mjs", [CHANGE, "--message", "a line"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown option --message/);
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
    assert.ok(deny.includes(`Edit(${glob})`), `missing Edit(${glob})`);
    assert.ok(deny.includes(`Write(${glob})`), `missing Write(${glob})`);
  }
  assert.ok(deny.includes(`Edit(openspec/changes/${OTHER}/**)`));
  assert.ok(deny.includes(`Write(openspec/changes/${OTHER}/**)`));
  // Reading is denied nowhere: the skill, the readers, the schema and the
  // durable specs are what a re-read reads against.
  assert.ok(!deny.some((rule) => rule.startsWith("Read(")));
  // Never its own directory, and never the archive as though it were a
  // change with a directory of its own.
  assert.ok(!deny.some((rule) => rule.includes(`openspec/changes/${CHANGE}/`)));
  assert.ok(!deny.some((rule) => rule.includes("openspec/changes/archive/**")));
});

test("settingsFor denies every tree that holds nothing the re-read may write", () => {
  const { root } = sandbox();

  const deny = settingsFor(root, CHANGE).permissions.deny;

  // The trees a round has no business in, denied though no list names them:
  // each is computed from the checkout for holding no writable path.
  for (const glob of [
    "openspec/specs/**",
    "openspec/schemas/**",
    "scripts/**",
    ".claude/**",
    "docs/governance/**",
  ]) {
    assert.ok(deny.includes(`Edit(${glob})`), `missing Edit(${glob})`);
    assert.ok(deny.includes(`Write(${glob})`), `missing Write(${glob})`);
  }
  // `docs/prds/` holds the pages the proposal links, so it is not denied
  // wholesale: the guard catches a write to a page this change never linked.
  assert.ok(!deny.some((rule) => rule.includes("docs/prds/**")));
  assert.ok(!deny.some((rule) => rule.includes("Edit(docs/**)")));
  assert.ok(!deny.some((rule) => rule.includes("Edit(openspec/**)")));
});

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
  // Somebody else's landing, which the job's checkout gains when `plan:land`
  // rebases the change's branch on a moved `origin/main`: inside the range
  // the job started from, and none of this run's business.
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
