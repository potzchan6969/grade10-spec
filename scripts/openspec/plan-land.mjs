#!/usr/bin/env node
/**
 * The round's landing step, as one transaction:
 *
 *   pnpm run plan:land <change> <artifact|group> --perspectives a,b --stood "…"
 *   pnpm run plan:land <change> <artifact|group> [--as @handle] [--dry-run]
 *
 * A landing is the hand's word turned into one commit on `main`, and the seven
 * steps below run in order and stop at the first refusal. Nothing half-lands:
 * the record line and the round's row are written together, the branch is
 * pushed against the state this run read, and `main` is a plain fast-forward.
 *
 *   1 clean    a rebase in progress or a dirty working tree refuses the
 *              landing - a landing that carries somebody's uncommitted edit
 *              is not a landing
 *   2 hand     `git config user.email` through `docs/prds/team.yaml`; an
 *              e-mail the map does not name and a handle that is not the hand
 *              of the artifact are both refused, naming whose word it waits
 *              on. `--as @handle` is taken only where it resolves to the same
 *              e-mail, so nobody types anybody else's handle
 *   3 main     `git fetch origin main`, that sha recorded, the branch rebased
 *              on it
 *   4 behind   anything before the artifact that is behind refuses the
 *              landing, named with its hand
 *   5 gate     `validate:changes --strict`, `check:manual`, `tcs:validate`,
 *              with `PLAN_NO_FETCH=1` so the gate reads the tree this step
 *              just built rather than fetching a second time
 *   6 commit   `landed_by: <artifact>: <handle>` and the `rounds.md` row, in
 *              one commit
 *   7 push     the branch with `--force-with-lease` against the sha this run
 *              read, then `HEAD:main` as a plain fast-forward. On a rejected
 *              push it reads `main` again once and retries; losing again it
 *              says so and stops, and the winner's work stands
 *
 * `pnpm land` becomes this step when `land-on-main-through-the-gate` makes one
 * gate for both repositories (`Q36`).
 *
 * `--dry-run` prints every step and pushes nothing. `--root` lands in a store
 * other than this one and `PLAN_NO_GATE=1` skips step 5 loudly - both are how
 * the tests drive a fixture store, and a real landing uses neither. Step 3
 * fetches whatever `PLAN_NO_FETCH` says: that variable spares the preflights a
 * network call, and a landing that did not read `main` is not a landing.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { behindOf, handOfArtifact } from "../../tools/manual/src/api/stages.ts";
import { isGroup } from "./lib/perspectives.mjs";
import { openRecord, saveRecord, setEntry } from "./lib/record.mjs";
import { appendRoundRow, listCell, roundsPath } from "./lib/rounds.mjs";
import { readChangeEntry } from "./lib/store-read.mjs";
import { handleOfEmail, readTeamMap, TEAM_MAP } from "./lib/team.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  'usage: pnpm run plan:land <change> <artifact|group> [--as @handle] [--perspectives a,b] [--stood "…"] [--asked Q1] [--tests "<sc>: <file>"] [--row-file <path>] [--dry-run] [--root <dir>]';

const KEYS = [
  "as",
  "artifact",
  "perspectives",
  "stood",
  "asked",
  "tests",
  "row-file",
  "root",
];

const { positional, flags, dryRun } = parse(process.argv.slice(2));
const root = flags.root ?? join(HERE, "..", "..");
const [change, target] = positional;
if (!change || !target) fail(USAGE);

/** The three checks a landing runs, each a node script of this store. */
const GATE = [
  [
    "validate:changes",
    ["scripts/openspec/validate-changes.mjs", "--strict", change],
  ],
  ["check:manual", ["tools/manual/check/check-manual.mjs"]],
  ["tcs:validate", ["scripts/openspec/validate-test-cases.mjs"]],
];

const say = (step, line) => console.log(`  ${step.padEnd(9)}${line}`);
console.log(`plan:land ${change} ${target}${dryRun ? "  (dry run)" : ""}`);

// ── 1 clean ─────────────────────────────────────────────────────────────────
if (git(["rev-parse", "--git-dir"]) === null)
  fail(`${root} is not a git repository — a landing is a push`);
// Read before the working tree, because a rebase in progress is what makes
// `git status` a report about somebody else's half-finished work.
for (const name of ["rebase-merge", "rebase-apply"]) {
  const path = git(["rev-parse", "--git-path", name]);
  if (path && existsSync(resolve(root, path)))
    fail("a rebase is in progress — finish or abort it, then land");
}
const dirty = git(["status", "--porcelain"]);
if (dirty) {
  fail(
    `the working tree has uncommitted edits:\n${dirty}\nA landing that carries somebody's uncommitted edit is not a landing. Commit them on the branch, then land.`,
  );
}
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
say("clean", `the tree is clean, on ${branch}`);

// ── 2 hand ──────────────────────────────────────────────────────────────────
const map = readTeamMap(root);
const email = git(["config", "user.email"]);
if (!email)
  fail("`git config user.email` says nothing — a landing is somebody's word");
const handle = handleOfEmail(map, email);
if (!handle) {
  fail(
    `${email} is named nowhere in ${TEAM_MAP} — a landing is recorded against a handle, and the map is the fix`,
  );
}
if (flags.as) {
  const asked = flags.as.replace(/^@/, "").trim().toLowerCase();
  if (asked !== handle) {
    fail(
      `--as @${asked} does not resolve to ${email}, which ${TEAM_MAP} names @${handle} — a landing is the committer's word`,
    );
  }
}

let read = await readChangeEntry(root, change).catch((cause) =>
  fail(cause.message),
);
const artifacts = read.artifacts;
const artifact = artifactIdOf(target);
if (artifact === undefined && !isGroup(target)) {
  fail(
    `\`${target}\` is neither an artifact of the \`${read.entry.schema}\` schema nor a task group`,
  );
}
const role =
  artifact === undefined ? "dev" : handOfArtifact(artifact, artifacts);
if (role === undefined)
  fail(
    `the store issues no hand for \`${target}\` — nothing says whose word it is`,
  );
const hand = read.entry.hands?.[role];
if (hand === undefined) {
  fail(
    `${change} names no ${role} — ${target} waits on that hand's word, and the record is the fix`,
  );
}
if (hand.toLowerCase() !== handle) {
  fail(
    `${target} waits on @${hand}'s word, not @${handle}'s — reassigning the hand is the way around`,
  );
}
say("hand", `@${handle} is the ${role} and the hand of ${target}`);

// ── 3 main ──────────────────────────────────────────────────────────────────
const rebase = fetchMain();
say("main", `origin/main at ${short(rebase.sha)}, the branch rebased on it`);
// The tree moved, so what the readers read moved with it.
if (rebase.moved) read = await readChangeEntry(root, change);

// ── 4 behind ────────────────────────────────────────────────────────────────
// A task group is after every artifact: the plan it implements is the last of
// them, so anything behind refuses it.
const order = artifacts.map((one) => one.id);
const at = artifact === undefined ? order.length : order.indexOf(artifact);
const behind = behindOf(read.entry, artifacts).filter(
  (one) => order.indexOf(one.artifact) < at,
);
if (behind.length > 0) {
  const [first] = behind;
  const whose =
    read.entry.hands?.[handOfArtifact(first.artifact, artifacts) ?? ""];
  // One of the two: what commit dates single out, or what the recorded id
  // says it is read again against without saying which part of it moved.
  const what = first.changed ?? first.before ?? [];
  fail(
    `${first.artifact} is behind ${what.join(", ")}${whose ? ` and waits on @${whose}` : ""} — it is read again before ${target} lands`,
  );
}
say("behind", `nothing before ${target} is behind`);

// ── 5 gate ──────────────────────────────────────────────────────────────────
if (process.env.PLAN_NO_GATE === "1") {
  say("gate", "SKIPPED: PLAN_NO_GATE=1 — a real landing runs the gate");
} else if (dryRun) {
  say("gate", `would run ${GATE.map(([name]) => name).join(", ")}`);
} else {
  for (const [name, args] of GATE) {
    const [script, ...rest] = args;
    const file = join(root, ...script.split("/"));
    if (!existsSync(file)) fail(`${script} is missing from ${root}`);
    const ran = spawnSync(process.execPath, [file, ...rest], {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, PLAN_NO_FETCH: "1" },
    });
    if (ran.status !== 0) fail(`the gate refuses: ${name}`);
  }
  say("gate", `${GATE.map(([name]) => name).join(", ")} pass`);
}

// ── 6 commit ────────────────────────────────────────────────────────────────
const cells = rowOf();
if (dryRun) {
  say(
    "commit",
    `would write landed_by: ${artifact ?? target}: ${handle} and one ${roundsPath(change)} row`,
  );
} else {
  const record = openRecord(root, change);
  setEntry(record.doc, "landed_by", artifact ?? target, handle);
  saveRecord(record);
  const { row, round } = appendRoundRow(root, change, cells);
  gitOrDie(["add", "--", record.path, roundsPath(change)]);
  gitOrDie([
    "commit",
    "--quiet",
    "-m",
    `chore(openspec): land ${target} of ${change} on @${handle}`,
  ]);
  say(
    "commit",
    `landed_by: ${artifact ?? target}: ${handle}, and round ${round}`,
  );
  console.log(`           ${row}`);
}

// ── 7 push ──────────────────────────────────────────────────────────────────
if (dryRun) {
  say(
    "push",
    `would push ${branch} with a lease on ${short(remoteBranch()) ?? "nothing"}, then HEAD:main`,
  );
  console.log("\ndry run — nothing was pushed");
  process.exit(0);
}

for (let attempt = 1; attempt <= 2; attempt += 1) {
  if (attempt > 1) {
    const again = fetchMain();
    say(
      "main",
      `origin/main at ${short(again.sha)}, the branch rebased on it again`,
    );
  }
  race(attempt);
  const lease = remoteBranch() ?? "";
  const landed =
    push([
      `--force-with-lease=refs/heads/${branch}:${lease}`,
      `HEAD:refs/heads/${branch}`,
    ]) && push(["HEAD:refs/heads/main"]);
  if (landed) {
    say("push", `${branch} with a lease, then HEAD:main`);
    console.log(`\n✓ ${target} of ${change} landed by @${handle}`);
    process.exit(0);
  }
  if (attempt === 1) {
    console.log(
      "  !        main moved under the push — reading it again and retrying",
    );
  }
}

fail(
  `${change}'s push lost its race twice: this run lost and is stopping, and the winner's work stands. Its landing commit is on ${branch} here — read main again and land it on top.`,
);

// ── The pieces ──────────────────────────────────────────────────────────────

/** The artifact id a target names: the schema's id, or the file it generates.
 * Nothing where the target is a task group. */
function artifactIdOf(named) {
  const wanted = String(named).trim();
  const found =
    artifacts.find((one) => one.id === wanted) ??
    artifacts.find(
      (one) => one.generates === wanted || one.generates.endsWith(`/${wanted}`),
    );
  return found?.id;
}

/** The row the landing commits: the flags, or the file a round left for it. A
 * landing owes a row, so a run with neither is refused rather than landing
 * work the `round` rule will refuse on the next push. */
function rowOf() {
  const where = flags["row-file"] ?? ".round/row.json";
  const file = resolve(root, where);
  let written = {};
  if (existsSync(file)) {
    try {
      written = JSON.parse(readFileSync(file, "utf8"));
    } catch (cause) {
      fail(`${where} is not readable JSON: ${cause.message}`);
    }
  }
  const row = {
    artifact: flags.artifact ?? written.artifact ?? target,
    perspectives: listCell(flags.perspectives ?? written.perspectives),
    stood: flags.stood ?? written.stood ?? "",
    asked: listCell(flags.asked ?? written.asked),
    tests: flags.tests ?? written.tests ?? "",
  };
  if (!row.perspectives || !row.stood) {
    fail(
      `the landing commits the round's row: pass --perspectives and --stood, or write them into ${where}\n${USAGE}`,
    );
  }
  return row;
}

/**
 * `main` read again and the branch rebased on it: the sha every push of this
 * run is made against.
 *
 * Fetched with the refspec spelled out, so the remote-tracking ref this reads
 * back is the one the fetch just wrote whatever the remote's own refspec says.
 * A branch that will not rebase cleanly is a landing nobody can make from
 * here, so it says so rather than leaving a rebase in progress behind.
 */
function fetchMain() {
  gitOrDie([
    "fetch",
    "--quiet",
    "origin",
    "+refs/heads/main:refs/remotes/origin/main",
  ]);
  const sha = git([
    "rev-parse",
    "--verify",
    "--quiet",
    "refs/remotes/origin/main^{commit}",
  ]);
  if (!sha) fail("origin has no main to land on");
  const head = git(["rev-parse", "HEAD"]);
  const rebased = spawnSync("git", ["rebase", "--quiet", sha], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (rebased.status !== 0) {
    spawnSync("git", ["rebase", "--abort"], { cwd: root, stdio: "ignore" });
    fail(
      `the branch does not rebase on main cleanly:\n${rebased.stderr ?? ""}Resolve it on the branch, then land.`,
    );
  }
  return { sha, moved: git(["rev-parse", "HEAD"]) !== head };
}

/** What the remote holds for this branch, or nothing where it holds none —
 * the lease the push is made against. */
function remoteBranch() {
  const listed = git(["ls-remote", "origin", `refs/heads/${branch}`]);
  return listed ? listed.split(/\s+/)[0] : undefined;
}

function push(args) {
  return (
    spawnSync("git", ["push", "origin", ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).status === 0
  );
}

/** The tests' own hook: a command run just before each push, so a run can be
 * made to lose its race. Set by nothing but
 * `scripts/openspec/round-scripts.test.mjs`. */
function race(attempt) {
  const hook = process.env.PLAN_LAND_RACE;
  if (!hook) return;
  spawnSync("bash", ["-c", hook], {
    cwd: root,
    stdio: "ignore",
    env: { ...process.env, PLAN_LAND_ATTEMPT: String(attempt) },
  });
}

function short(sha) {
  return sha ? sha.slice(0, 8) : sha;
}

/** Git's answer, trimmed, or null where git refused. */
function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function gitOrDie(args) {
  const ran = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (ran.status !== 0) fail(`git ${args[0]} refused:\n${ran.stderr ?? ""}`);
  return ran.stdout.trim();
}

/** `<change> <artifact|group>` with the named options and `--dry-run`. */
function parse(argv) {
  const flags = {};
  const positional = [];
  let dry = false;
  for (let at = 0; at < argv.length; at += 1) {
    const arg = argv[at];
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    if (arg === "--dry-run") {
      dry = true;
      continue;
    }
    const named = /^--([a-z-]+)(?:=([\s\S]*))?$/.exec(arg);
    if (named) {
      if (!KEYS.includes(named[1]))
        fail(`unknown option --${named[1]}\n${USAGE}`);
      let value = named[2];
      if (value === undefined) {
        at += 1;
        value = argv[at];
      }
      if (value === undefined) fail(`--${named[1]} needs a value\n${USAGE}`);
      flags[named[1]] = value;
      continue;
    }
    if (arg.startsWith("-")) fail(`unknown option ${arg}\n${USAGE}`);
    positional.push(arg);
  }
  return { positional, flags, dryRun: dry };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
