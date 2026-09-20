import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { changedPaths, landedShas } from "./lib/landed.mjs";
import { writableBy } from "./lib/writable.mjs";
import { outOfBounds } from "./reread-guard.mjs";
import { answer, stubRelay, urlOf } from "./test/stub-relay.mjs";

/**
 * What a re-read may write (`lib/writable.mjs`), and the guard that fails on
 * a path it pushed outside that set. What the settings once denied and the
 * notice once posted are the relay's own business now — the session runs the
 * guard itself before it pushes (`reread-guard.mjs`'s own header), and
 * `relay-post.mjs` is what tells the thread. A bare remote stands in for the
 * session's checkout and the push it makes to it, so the guard is proved
 * against what a real run pushes rather than against two commits in one
 * working tree.
 *
 * The commits the guard reads are the union of the two facts about a run: the
 * landings it made, which `.round/landed` names and which `main` already
 * holds, and everything on `HEAD` that is not on `origin/main` yet, which is
 * every draft it has not pushed. So a test that wants a commit read either
 * leaves it unpushed or names it in `.round/landed`.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "reread-probe";
const OTHER = "other-change";
const DIR = `openspec/changes/${CHANGE}`;
/** The page this change's proposal links, and one it does not. */
const PAGE = "docs/prds/products/shared/planning/agent-rounds.md";
const UNLINKED = "docs/prds/products/shared/planning/change-stages.md";
/** The reference page it links, and one it does not: a proposal cites its
 * evidence as it marks its pages, so a re-read may correct either. */
const REFERENCE = "docs/references/round-notes.md";
const UNLINKED_REFERENCE = "docs/references/other-notes.md";
/** A sha no checkout holds: what a `.round/landed` line reads as when the
 * landing that wrote it is gone. */
const NO_SUCH_SHA = "deadbeefdeadbeefdeadbeefdeadbeefdeadbeef";

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
      `The evidence it cites: [Round Notes](../../../${REFERENCE}).`,
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
    [REFERENCE]: "# Round Notes\n\nThe owner's draft.\n",
    [UNLINKED_REFERENCE]: "# Other Notes\n\nAnother change's evidence.\n",
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

/** The guard, run over a store. */
const guard = (root, args = []) =>
  spawnSync(
    process.execPath,
    [join(SCRIPTS, "reread-guard.mjs"), CHANGE, "--root", root, ...args],
    { encoding: "utf8" },
  );

/** The guard in a child that does not block this process's event loop: what
 * the `--alive` cases need, since the stub relay answers from here. */
const guardAsync = (root, args = []) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [
      join(SCRIPTS, "reread-guard.mjs"),
      CHANGE,
      "--root",
      root,
      ...args,
    ]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });

/** `.round/relay.json` as a wake writes it. */
function writeRelayFile(root, url) {
  mkdirSync(join(root, ".round"), { recursive: true });
  writeFileSync(
    join(root, ".round", "relay.json"),
    JSON.stringify({
      relay: { url, token: "wake-tok-9" },
      change: CHANGE,
      sender: { handle: "@dana" },
    }),
  );
}

// ── The guard's own argv parser ─────────────────────────────────────────────

// `lib/args.mjs` refuses an option outside the guard's own set, naming it
// beside the usage — and `--before` is outside it: the guard reads the
// checkout it was given, so a range selects nothing and is not taken.

const refusal = (script, args) =>
  spawnSync(process.execPath, [join(SCRIPTS, script), ...args], {
    encoding: "utf8",
  });

test("the guard takes no range: an option outside its set is refused, for the log to read", () => {
  const result = refusal("reread-guard.mjs", [CHANGE, "--before", "HEAD"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::unknown option --before/);
  assert.match(result.stderr, /usage: node reread-guard\.mjs/);
});

// ── What a re-read may write ────────────────────────────────────────────────

test("writableBy names the change's own directory and the pages its proposal links", () => {
  const { root } = sandbox();

  assert.deepEqual(writableBy(root, CHANGE), [`${DIR}/`, PAGE, REFERENCE]);
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
  const { root, write, git } = sandbox();
  write({ [PAGE]: "# Agent Rounds\n\n## The Walk\n\n❓ Who reads it?\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "mark the page the proposal links");

  const result = guard(root);

  assert.equal(result.status, 0, result.stderr);
});

test("the guard passes a reference page the change's proposal links", () => {
  const { root, write, git } = sandbox();
  write({ [REFERENCE]: "# Round Notes\n\nThe owner's draft, corrected.\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "correct the evidence the proposal cites");

  const result = guard(root);

  assert.equal(result.status, 0, result.stderr);
});

test("the guard fails on a reference page the proposal never linked", () => {
  const { root, write, git } = sandbox();
  write({ [UNLINKED_REFERENCE]: "# Other Notes\n\nThe wrong round's.\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "reached past the evidence it cites");

  const result = guard(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, /other-notes\.md/);
});

test("the guard fails on a page the proposal never linked, and on a script", () => {
  const { root, write, git } = sandbox();
  write({
    [UNLINKED]: "# Change Stages\n\nRewritten by the wrong round.\n",
    "scripts/openspec/plan-land.mjs": "// rewritten\n",
  });
  git("add", "-A");
  git("commit", "--quiet", "-m", "reached past the pages it links");

  const result = guard(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, /change-stages\.md/);
  assert.match(result.stderr, /scripts\/openspec\/plan-land\.mjs/);
});

test("the guard passes a commit that stays inside the change's directory", () => {
  const { root, write, git, before } = sandbox();
  write({ [`${DIR}/decisions.md`]: "## Goals\n\n- One\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the round's own commit");

  assert.deepEqual(changedPaths(root, before, "HEAD"), [`${DIR}/decisions.md`]);

  const result = guard(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 path\(s\)/);
  assert.match(result.stdout, /all inside/);
});

test("the guard fails on a path the round pushed outside its own directory", () => {
  const { root, write, git } = sandbox();
  write({
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
    "packages/design-system/README.md": "rewritten\n",
  });
  git("add", "-A");
  git("commit", "--quiet", "-m", "reached outside the change");

  const result = guard(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, /reread-probe/);
  assert.match(result.stderr, /packages\/design-system\/README\.md/);
});

test("shared-planning-agent-rounds-SC-73 - the guard reads the commits this run made, though main moved under it", () => {
  const { root, write, git } = sandbox();
  // Somebody else's landing, which the run's own checkout gains when
  // `plan:land` rebases the change's branch on a moved `origin/main`: inside
  // the range the run started from, and none of this run's business.
  write({ "scripts/openspec/plan-land.mjs": "// somebody else's fix\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "a fix that landed under the run");
  // This run's own commit, the one `.round/landed` names — and on `main`
  // already, since the landing is what pushed it.
  write({ [`${DIR}/decisions.md`]: "## Goals\n\n- One\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the round's own commit");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  write({ ".round/landed": `${git("rev-parse", "HEAD").trim()}\n` });

  const result = guard(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 path\(s\)/);
  assert.match(result.stdout, /\.round\/landed/);
});

test("the guard reads a landing main holds and a draft it has not pushed, together", () => {
  const { root, write, git } = sandbox();
  // The landing: pushed, and named in `.round/landed`.
  write({ [`${DIR}/decisions.md`]: "## Goals\n\n- One\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the landing");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  write({ ".round/landed": `${git("rev-parse", "HEAD").trim()}\n` });
  // The draft above it, pushed nowhere yet — and outside what this change
  // may write, so the guard is what catches it.
  write({ [UNLINKED]: "# Change Stages\n\nThe wrong page.\n" });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the draft above it");

  const result = guard(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /change-stages\.md/);
});

test("the guard fails on a path the run's own commit reached outside, bound or not", () => {
  const { root, write, git } = sandbox();
  write({
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
    [UNLINKED]: "# Change Stages\n\nRewritten by the wrong round.\n",
  });
  git("add", "-A");
  git("commit", "--quiet", "-m", "the round reached past its own pages");
  git("push", "--quiet", "origin", "HEAD:refs/heads/main");
  write({ ".round/landed": `${git("rev-parse", "HEAD").trim()}\n` });

  const result = guard(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, /change-stages\.md/);
});

test("the guard needs no fetch: it reads the checkout it was given", () => {
  const { root } = sandbox();

  const result = guard(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^reread-probe: 0 path\(s\)/);
});

// ── A git that refuses: loudly, never as nothing to read ────────────────────

test("a sha in .round/landed the checkout does not hold stops the guard, naming it", () => {
  const { root, write } = sandbox();
  write({ ".round/landed": `${NO_SUCH_SHA}\n` });

  const result = guard(root);

  // Not a run that pushed nothing: a sha nobody can read is the guard's own
  // reading broken, and it says so rather than passing.
  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, new RegExp(NO_SUCH_SHA));
  assert.doesNotMatch(result.stdout, /all inside/);
});

test("a checkout with no origin/main stops the guard: it cannot say what the run pushed", () => {
  const { root, git } = sandbox();
  git("update-ref", "-d", "refs/remotes/origin/main");

  const result = guard(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::no origin\/main in this checkout/);
  assert.match(result.stderr, /cannot say what this run pushed/);
});

// ── --alive: the wake asked before the push ─────────────────────────────────

test("shared-planning-agent-rounds-SC-74 - --alive with no wake asks nothing: the terminal round pushes on its own word", async () => {
  const { root } = sandbox();

  const result = await guardAsync(root, ["--alive"]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /no wake to ask about/);
});

test("shared-planning-agent-rounds-SC-74 - --alive passes while the wake is the room's own", async () => {
  let seen;
  const server = await stubRelay((req, res) => {
    seen = { method: req.method, url: req.url };
    answer(res, 200, { alive: true });
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server));

  const result = await guardAsync(root, ["--alive"]);
  server.close();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(seen.method, "GET");
  assert.equal(seen.url, "/runs/wake-tok-9/alive");
  assert.match(result.stdout, /the wake is alive/);
});

test("shared-planning-agent-rounds-SC-74 - --alive stops the run where the relay has closed its wake", async () => {
  const server = await stubRelay((_req, res) => {
    answer(res, 401, { reason: "this wake is closed" });
  });
  const { root } = sandbox();
  writeRelayFile(root, urlOf(server));

  const result = await guardAsync(root, ["--alive"]);
  server.close();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /::error::/);
  assert.match(result.stderr, /401/);
  // It stops there: nothing about the paths, which it never read.
  assert.doesNotMatch(result.stdout, /path\(s\)/);
});
