#!/usr/bin/env node
/**
 * The round's landing step, as one transaction:
 *
 *   pnpm run plan:land <change> <artifact|group> --perspectives a,b --stood "…"
 *   pnpm run plan:land <change> <artifact> --reviewed
 *   pnpm run plan:land <change> <artifact|group> [--as @handle] [--dry-run]
 *
 * A landing is the hand's word turned into one commit on `main`, and the
 * steps below run in order and stop at the first refusal. Nothing half-lands:
 * the record line and the round's row are written together, the branch is
 * pushed against the state this run read, and `main` is a plain fast-forward.
 *
 *   1 clean    a rebase in progress or a dirty tracked file refuses the
 *              landing - an untracked file beside the change is nobody's
 *              business here, but a landing that carries somebody's
 *              uncommitted edit is not a landing
 *   2 hand     `git config user.email` through `docs/prds/team.yaml`; an
 *              e-mail the map does not name and a handle that is not the hand
 *              of the artifact are both refused, naming whose word it waits
 *              on. `--as @handle` is taken only where it resolves to the same
 *              e-mail, so nobody types anybody else's handle. `--reviewed`
 *              skips this: a read that changes nothing is the change's agent
 *              to land, not a hand's word
 *   3 main     the store's own main, always fetched, the branch rebased on
 *              it; that same rebase is the one reading of the change this run
 *              takes, so the hand's role and the artifact list are never read
 *              from a tree older than what the branch lands on
 *   4 behind   anything before the artifact that is behind refuses the
 *              landing, named with its hand
 *   5 write    `landed_by: <artifact>: <handle>` (never for a task group,
 *              whose plan is proven by the tick alone) and the `rounds.md`
 *              row, written to the tree before the gate below reads it — the
 *              `round` rule that refuses a tick or a landed artifact with no
 *              row is the same rule the gate runs, so the row has to be there
 *              for the gate to pass rather than land after it. A refusal at
 *              the gate undoes exactly these two paths. `--reviewed` writes
 *              neither: the `reviewed:` line it lands is already on the
 *              branch, committed by whoever ran `round:reviewed`
 *   6 gate     `validate:changes --strict`, `check:manual`, `tcs:validate`,
 *              run in this process against this store rather than spawned
 *              against a nonexistent copy of themselves in it
 *   7 commit   what step 5 wrote, added and committed in one commit
 *   8 push     the branch's remote sha, read once from the network rather
 *              than re-fetched before every attempt, leases the branch's own
 *              push; losing that lease means another run is on this same
 *              branch, so it stops rather than overwriting work still in
 *              flight. A push this run made itself moves the lease forward
 *              for the next attempt, since that is this run's own write and
 *              not a second one to guard against. Only `main`'s plain push
 *              retries: it reads `main` again, rebases, and tries once more.
 *              Losing that twice says so and stops, and the winner's work
 *              stands
 *
 * `pnpm land` becomes this step when `land-on-main-through-the-gate` makes one
 * gate for both repositories (`Q36`).
 *
 * `--dry-run` prints every step and pushes nothing. `--root` lands in a store
 * other than this one, which is how the tests drive a fixture store - a real
 * landing never passes it. `PLAN_LAND_RACE` is the tests' own seam for losing
 * a push on purpose, and is refused outright unless `--root` was also passed:
 * nothing about a real landing should ever read it.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatReport,
  runChecks,
} from "../../tools/manual/check/check-manual.mjs";
import { behindOf, handOfArtifact } from "../../tools/manual/src/api/stages.ts";
import { parseArgs } from "./lib/args.mjs";
import { isGroup } from "./lib/perspectives.mjs";
import { openRecord, saveRecord, setEntry } from "./lib/record.mjs";
import { appendRoundRow, listCell, roundsPath } from "./lib/rounds.mjs";
import { readChangeEntry } from "./lib/store-read.mjs";
import { handleOfEmail, readTeamMap, TEAM_MAP } from "./lib/team.mjs";
import { git as storeGit, storeMain } from "./store-main.mjs";
import { main as validateChanges } from "./validate-changes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  'usage: pnpm run plan:land <change> <artifact|group> [--as @handle] [--perspectives a,b] [--stood "…"] [--asked Q1] [--tests "<sc>: <file>"] [--reviewed] [--dry-run] [--root <dir>]';

const { positional, flags } = parseArgs(process.argv.slice(2), {
  keys: ["as", "perspectives", "stood", "asked", "tests", "root"],
  booleans: ["dry-run", "reviewed"],
  usage: USAGE,
});
const dryRun = Boolean(flags["dry-run"]);
const reviewedOnly = Boolean(flags.reviewed);
const root = flags.root ?? join(HERE, "..", "..");
const [change, target] = positional;
// Set once step 5 writes `landed_by:` and the round's row, and cleared once
// the gate passes: `fail` undoes exactly those two paths on a refusal in
// between, and leaves a later refusal (the push losing its race) alone.
let restoreOnFail;
if (!change || !target) fail(USAGE);

const git = (args) => storeGit(root, args);
const say = (step, line) => console.log(`  ${step.padEnd(9)}${line}`);
console.log(
  `plan:land ${change} ${target}${reviewedOnly ? "  (reviewed)" : ""}${dryRun ? "  (dry run)" : ""}`,
);

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
// Untracked files are nobody's business here — a scratch file beside the
// change blocks nothing; a tracked edit nobody committed does.
const dirty = git(["status", "--porcelain", "--untracked-files=no"]);
if (dirty) {
  fail(
    `the working tree has uncommitted edits:\n${dirty}\nA landing that carries somebody's uncommitted edit is not a landing. Commit them on the branch, then land.`,
  );
}
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
say("clean", `the tree is clean, on ${branch}`);

// ── 2 hand (skipped for --reviewed: nobody's word is asked for a no-op read) ─
let handle;
if (!reviewedOnly) {
  const map = readTeamMap(root);
  const email = git(["config", "user.email"]);
  if (!email)
    fail("`git config user.email` says nothing — a landing is somebody's word");
  handle = handleOfEmail(map, email);
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
}

// ── 3 main — always fetched, the branch rebased on it, and the one reading of
// the change this run takes, drawn from what the rebase leaves on the branch ─
let leaseSha = remoteBranchSha();
const rebase = fetchMain();
say(
  "main",
  `${rebase.ref} at ${short(rebase.commit)}, the branch rebased on it`,
);

const read = await readChangeEntry(root, change).catch((cause) =>
  fail(cause.message),
);
const artifacts = read.artifacts;
const artifact = artifactIdOf(target);
if (artifact === undefined && !isGroup(target)) {
  fail(
    `\`${target}\` is neither an artifact of the \`${read.entry.schema}\` schema nor a task group`,
  );
}
if (artifact === undefined) {
  const wanted = groupNumberOf(target);
  const known = read.entry.taskGroups.map((one) => one.num);
  if (!known.includes(wanted)) {
    fail(
      `${change}'s tasks.md holds no group ${wanted} — it holds ${known.length > 0 ? known.join(", ") : "none"}`,
    );
  }
}
if (reviewedOnly && artifact === undefined) {
  fail(
    "--reviewed names an artifact, never a task group — a group's plan is proven by the tick, and the tick is its own landing",
  );
}

const role =
  artifact === undefined
    ? handOfArtifact("tasks", artifacts)
    : handOfArtifact(artifact, artifacts);
if (role === undefined) {
  fail(
    `the store issues no hand for \`${target}\` — nothing says whose word it is`,
  );
}

if (reviewedOnly) {
  // The `reviewed:` line it lands is already on the branch, committed by
  // whoever ran `round:reviewed` — with none there at all, there is no read
  // to land, and running clean anyway would report a re-read that never
  // happened as one that did.
  if (read.entry.reviewed?.[artifact] === undefined) {
    fail("nothing to land: round:reviewed writes the line first");
  }
  say(
    "hand",
    "a read that changes nothing is the change's agent to land — no hand's word is asked",
  );
} else {
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
}

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

// ── 5 write, before the gate ─────────────────────────────────────────────────
// `landed_by:` and the round's row land in the same commit as the tick or the
// artifact they prove, so the `round` rule the gate runs reads whatever this
// step writes — never the other way around. Writing after the gate would
// deadlock every group whose tick already reached `main` with no row: the
// gate refuses the tick with no row, and the landing that would write the row
// never reaches the write that clears it. A refusal below undoes exactly
// these two paths, through `fail`, and leaves nothing else behind.
let pending;
if (!reviewedOnly && !dryRun) {
  const cells = rowOf();
  const record = openRecord(root, change);
  // Never for a task group: its plan is proven by the tick, not by a hand's
  // line, and the group names no schema artifact to write one against.
  if (artifact !== undefined)
    setEntry(record.doc, "landed_by", artifact, handle);
  saveRecord(record);
  const { row, round, created } = appendRoundRow(root, change, cells);
  pending = { record, row, round, roundsCreated: created };
  restoreOnFail = () => restorePending(pending);
}

// ── 6 gate ──────────────────────────────────────────────────────────────────
if (dryRun) {
  say("gate", "would run validate:changes, check:manual, tcs:validate");
} else {
  runValidateChanges();
  await runCheckManual();
  runTcsValidate();
  say("gate", "validate:changes, check:manual, tcs:validate pass");
}
// The gate passed: what step 5 wrote stands, and a later failure (the push
// losing its race) leaves the commit below in place rather than undoing it.
restoreOnFail = undefined;

// ── 7 commit ────────────────────────────────────────────────────────────────
if (reviewedOnly) {
  say(
    "commit",
    `nothing to commit — ${target}'s reviewed: line is already on ${branch}`,
  );
} else if (dryRun) {
  say(
    "commit",
    artifact === undefined
      ? `would write one ${roundsPath(change)} row for group ${target}`
      : `would write landed_by: ${artifact}: ${handle} and one ${roundsPath(change)} row`,
  );
} else {
  const { record, row, round } = pending;
  gitOrDie(["add", "--", record.path, roundsPath(change)]);
  gitOrDie([
    "commit",
    "--quiet",
    "-m",
    `chore(openspec): land ${target} of ${change}${artifact === undefined ? "" : ` on @${handle}`}`,
  ]);
  say(
    "commit",
    artifact === undefined
      ? `round ${round}, no landed_by: for a group`
      : `landed_by: ${artifact}: ${handle}, and round ${round}`,
  );
  console.log(`           ${row}`);
}

// ── 8 push ──────────────────────────────────────────────────────────────────
const mainBranch = rebase.ref.replace(/^origin\//, "");
if (dryRun) {
  say(
    "push",
    `would push ${branch} with a lease on ${leaseSha ? short(leaseSha) : "nothing"}, then HEAD:${mainBranch}`,
  );
  console.log("\ndry run — nothing was pushed");
  process.exit(0);
}

for (let attempt = 1; attempt <= 2; attempt += 1) {
  if (attempt > 1) {
    const again = fetchMain();
    say(
      "main",
      `${again.ref} at ${short(again.commit)}, the branch rebased on it again`,
    );
  }
  race(attempt);
  const branchPushed = push([
    `--force-with-lease=refs/heads/${branch}:${leaseSha}`,
    `HEAD:refs/heads/${branch}`,
  ]);
  if (!branchPushed) {
    fail(
      `${branch} moved on origin under this run — another run is on this change's branch, and this one is not overwriting it. Read it again and land from there.`,
    );
  }
  // The lease this run's own push just proved: what the branch holds now is
  // this run's own commit, not a concurrent write, so the next attempt's
  // lease is read from here rather than from the network a second time.
  leaseSha = git(["rev-parse", "HEAD"]);
  const landed = push([`HEAD:refs/heads/${mainBranch}`]);
  if (landed) {
    say("push", `${branch} with a lease, then HEAD:${mainBranch}`);
    console.log(
      `\n✓ ${target} of ${change} landed${reviewedOnly ? "" : ` by @${handle}`}`,
    );
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

/** A task group's number however the target spelled it — `3`, `3.`, `group
 * 3` — as `tasks.md`'s own reader carries it. */
function groupNumberOf(named) {
  return String(named)
    .trim()
    .replace(/^group\s+/i, "")
    .replace(/\.$/, "");
}

/** The row the landing commits: the flags a round gave it. A landing owes a
 * row, so a run with neither is refused rather than landing work the `round`
 * rule will refuse on the next push. */
function rowOf() {
  if (!flags.perspectives || !flags.stood) {
    fail(
      `the landing commits the round's row: pass --perspectives and --stood\n${USAGE}`,
    );
  }
  return {
    artifact: artifact ?? target,
    perspectives: listCell(flags.perspectives),
    stood: flags.stood,
    asked: askedCell(flags.asked),
    tests: flags.tests ?? "",
  };
}

/** `Q1,Q2` as the row writes it so `cited` resolves each one: backticked, the
 * way every other id this store cites in prose is written. */
function askedCell(value) {
  const cell = listCell(value);
  if (cell === "") return "";
  return cell
    .split(", ")
    .map((id) => `\`${id}\``)
    .join(", ");
}

/**
 * `main` read again through the store's one git wrapper, and the branch
 * rebased on it: the sha every push of this run is made against.
 *
 * `{ fetch: "always" }` ignores `PLAN_NO_FETCH` — a landing that did not read
 * `main` is not a landing, whatever a preflight elsewhere spares itself. A
 * branch that will not rebase cleanly is a landing nobody can make from here,
 * so it says so rather than leaving a rebase in progress behind.
 */
function fetchMain() {
  const main = storeMain(root, { fetch: "always" });
  if (!main) fail("origin has no main to land on");
  const head = git(["rev-parse", "HEAD"]);
  const rebased = spawnSync("git", ["rebase", "--quiet", main.commit], {
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
  return {
    ref: main.ref,
    commit: main.commit,
    moved: git(["rev-parse", "HEAD"]) !== head,
  };
}

/** What the remote holds for this branch right now, read once, before this
 * run's own rebase touches anything local — the lease the first push of the
 * branch is made against. A push this run makes itself moves `leaseSha`
 * forward for the attempt after it, so this is never called again: reading it
 * fresh before every push would make the lease trust whatever is there
 * instead of protecting against it. Empty for a branch the remote does not
 * hold yet. */
function remoteBranchSha() {
  const listed = git(["ls-remote", "origin", `refs/heads/${branch}`]);
  return listed ? listed.split(/\s+/)[0] : "";
}

function push(args) {
  const ran = spawnSync("git", ["push", "origin", ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (ran.status !== 0 && ran.stderr) process.stderr.write(ran.stderr);
  return ran.status === 0;
}

/** The tests' own hook: a command run just before each push, so a run can be
 * made to lose its race. Refused unless `--root` was also passed, so nothing
 * about a real landing can ever read it. Set by nothing but
 * `scripts/openspec/round-scripts.test.mjs`. */
function race(attempt) {
  const hook = process.env.PLAN_LAND_RACE;
  if (!hook) return;
  if (!flags.root) fail("PLAN_LAND_RACE is a test seam and needs --root");
  spawnSync("bash", ["-c", hook], {
    cwd: root,
    stdio: "ignore",
    env: { ...process.env, PLAN_LAND_ATTEMPT: String(attempt) },
  });
}

function short(sha) {
  return sha ? sha.slice(0, 8) : sha;
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

/** `validate:changes --strict <change>`, in this process: `main` sets
 * `process.exitCode` rather than throwing on a validation failure, so that is
 * what is read back, and reset either way — this run's own exit code is its
 * own to set. */
function runValidateChanges() {
  const before = process.exitCode;
  process.exitCode = undefined;
  try {
    validateChanges(root, true, change);
  } catch (cause) {
    process.exitCode = before;
    fail(`the gate refuses: validate:changes\n${cause.message}`);
  }
  const failed = Boolean(process.exitCode);
  process.exitCode = before;
  if (failed) fail("the gate refuses: validate:changes");
}

/** `check:manual`, in this process: `runChecks` is pure over the root it is
 * given, so this reads the tree the landing just built rather than spawning a
 * copy of the checker that may not even exist under it. */
async function runCheckManual() {
  let result;
  try {
    result = await runChecks(root);
  } catch (cause) {
    fail(`the gate refuses: check:manual\n${cause.message}`);
  }
  const { text, failures } = formatReport(root, result);
  console.log(text);
  if (failures > 0) fail("the gate refuses: check:manual");
}

/** `tcs:validate`, scoped to this change: the script hardcodes its own root
 * to its file's own location and calls `process.exit` itself, so it is
 * spawned from here — the real file, never a copy this store's own tree may
 * not carry — rather than imported. Scoped to the change so this gate judges
 * what the change itself owes rather than every suite the whole store holds,
 * the way `validate:changes --strict <change>` already does. */
function runTcsValidate() {
  const file = join(HERE, "validate-test-cases.mjs");
  const ran = spawnSync(
    process.execPath,
    [file, `openspec/changes/${change}`],
    { cwd: root, stdio: "inherit" },
  );
  if (ran.status !== 0) fail("the gate refuses: tcs:validate");
}

/** What step 5 wrote to the tree, undone: the record back to what `main`
 * holds, and the round's row either back to it too or, where the row's own
 * file did not exist yet, removed outright rather than left as an untracked
 * file the next run's own clean check would have to explain. */
function restorePending({ record, roundsCreated }) {
  const path = roundsPath(change);
  const ran = spawnSync("git", ["checkout", "--", record.path], {
    cwd: root,
    stdio: "ignore",
  });
  if (ran.status === 0 && roundsCreated) {
    rmSync(join(root, path), { force: true });
  } else if (ran.status === 0) {
    spawnSync("git", ["checkout", "--", path], { cwd: root, stdio: "ignore" });
  }
}

function fail(message) {
  const restore = restoreOnFail;
  restoreOnFail = undefined;
  if (restore) restore();
  console.error(message);
  process.exit(1);
}
