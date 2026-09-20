#!/usr/bin/env node
/**
 * The round's landing step, as one transaction:
 *
 *   pnpm run plan:land <change> <artifact|group> --perspectives a,b --stood "…"
 *   pnpm run plan:land <change> <artifact> --reviewed
 *   pnpm run plan:land <change> <artifact|group> [--as @handle] [--with-recommendations] [--dry-run]
 *
 * A landing is the hand's word turned into one commit on `main`, and the
 * steps below run in order and stop at the first refusal. Nothing half-lands:
 * the record line and the round's row are written together, the branch is
 * pushed against the state this run read, and `main` is a plain fast-forward
 * — or, bound to a wake through `.round/relay.json`, is what the relay makes
 * of the branch this run pushed (Q54).
 *
 *   1 clean    a rebase in progress or a dirty tracked file refuses the
 *              landing - an untracked file beside the change is nobody's
 *              business here, but a landing that carries somebody's
 *              uncommitted edit is not a landing
 *   2 hand     from a terminal, `git config user.email` through
 *              `docs/prds/team.yaml`; from a run, `.round/relay.json`'s own
 *              `sender.handle` — the Slack member the relay resolved, never a
 *              git config lookup. An e-mail the map does not name, a null or
 *              handle-less `sender` (the push workflow's own wake, no message
 *              behind it), and a handle that is not the hand of the artifact
 *              are all refused, naming whose word it waits on. `--as @handle`
 *              is taken only where it resolves to the same handle, so nobody
 *              types anybody else's. `--reviewed` skips this entirely: a read
 *              that changes nothing is the change's agent to land, not a
 *              hand's word, and a wake with no sender still lands one
 *   3 main     the store's own main, always fetched, the branch rebased on
 *              it; that same rebase is the one reading of the change this run
 *              takes, so the hand's role and the artifact list are never read
 *              from a tree older than what the branch lands on
 *   4 behind   anything before the artifact that is behind refuses the
 *              landing, named with its hand
 *   5 held     skipped for `--reviewed`: any `## Decisions` row whose Decided
 *              cell opens with ❓ holds the landing, naming every such row,
 *              until `--with-recommendations` takes each one as its
 *              recommendation and stages the rewrite into the landing commit
 *              (Q59, Q60)
 *   6 write    `landed_by: <artifact>: <handle>` (never for a task group,
 *              whose plan is proven by the tick alone) and the `rounds.md`
 *              row, whose `Tests` cell owes an entry per scenario the
 *              group's own task lines cite, written to the tree before the
 *              gate below reads it — the `round` rule that refuses a tick or
 *              a landed artifact with no row is the same rule the gate runs,
 *              so the row has to be there for the gate to pass rather than
 *              land after it. A refusal at the gate undoes exactly these two
 *              paths. `--reviewed` writes
 *              `reviewed: <artifact>: <content id>` here instead, one
 *              artifact per call, and neither a row nor a `landed_by:` line:
 *              a read that changed nothing ran no perspective and waits on
 *              nobody's word (`Q42`)
 *   7 gate     `validate:changes --strict`, `check:manual`, `tcs:validate`,
 *              run in this process against this store rather than spawned
 *              against a nonexistent copy of themselves in it
 *   8 commit   what steps 5 and 6 wrote, added and committed in one commit,
 *              whose sha is named in `.round/landed`: the commits a run made
 *              are what the re-read's own guard reads, and the rebase in step
 *              3 leaves every commit `main` gained looking like one of them
 *   9 push     the branch's remote sha, read once from the network rather
 *              than re-fetched before every attempt, leases the branch's own
 *              push; losing that lease means another run is on this same
 *              branch, so it stops rather than overwriting work still in
 *              flight. A push this run made itself moves the lease forward
 *              for the next attempt, since that is this run's own write and
 *              not a second one to guard against. From a terminal, `main`'s
 *              plain push retries on a lost race: it reads `main` again,
 *              rebases, and tries once more. Bound to a relay, the same retry
 *              runs against a 409 instead — "main moved under the push" is
 *              one fact whichever pushed it — and a 403 stops at once, naming
 *              the relay's own reason (Q55). Losing the race twice says so
 *              and stops either way, and the winner's work stands
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
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatReport,
  runChecks,
} from "../../tools/manual/check/check-manual.mjs";
import { behindOf, handOfArtifact } from "../../tools/manual/src/api/stages.ts";
import { roundArtifactOf } from "../../tools/manual/src/store/read-rounds.mts";
import { parseArgs } from "./lib/args.mjs";
import { heldRowsOf, takeRecommendations } from "./lib/held.mjs";
import { appendLanded, LANDED } from "./lib/landed.mjs";
import {
  isGroup,
  perspectivesOf,
  planningSchema,
} from "./lib/perspectives.mjs";
import { openRecord, saveRecord, setEntry } from "./lib/record.mjs";
import { readAgainst } from "./lib/reviewed.mjs";
import { appendRoundRow, listCell, roundsPath } from "./lib/rounds.mjs";
import { readChangeEntry } from "./lib/store-read.mjs";
import { handleOfEmail, readTeamMap, TEAM_MAP } from "./lib/team.mjs";
import { git as storeGit, storeMain } from "./store-main.mjs";
import { main as validateChanges } from "./validate-changes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
/** A scenario a task line cites, the way the store writes a citation: in
 * backticks, so prose about a scenario is not read as one. */
const CITED = /`([a-z0-9][a-z0-9-]*-SC-\d+)`/g;
/** Where a wake's own run writes the relay it was given, before anything
 * else — `.round/relay.json`'s presence is what makes this a relay landing. */
const RELAY_FILE = ".round/relay.json";
const USAGE =
  'usage: pnpm run plan:land <change> <artifact|group> [--as @handle] [--perspectives a,b] [--stood "…"] [--asked Q1] [--tests "<sc>: <file>"] [--reviewed] [--with-recommendations] [--dry-run] [--root <dir>]';

const { positional, flags } = parseArgs(process.argv.slice(2), {
  keys: ["as", "perspectives", "stood", "asked", "tests", "root"],
  booleans: ["dry-run", "reviewed", "with-recommendations"],
  usage: USAGE,
});
const dryRun = Boolean(flags["dry-run"]);
const reviewedOnly = Boolean(flags.reviewed);
const root = flags.root ?? join(HERE, "..", "..");
const relay = relayOf(root);
const [change, target] = positional;
// Set once step 6 writes `landed_by:` and the round's row, and cleared once
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
let email;
if (!reviewedOnly) {
  if (relay) {
    handle = String(relay.sender?.handle ?? "")
      .replace(/^@/, "")
      .trim()
      .toLowerCase();
    if (!handle) {
      fail(
        "this wake has no word behind it: nobody said land — only --reviewed lands here",
      );
    }
  } else {
    const map = readTeamMap(root);
    email = git(["config", "user.email"]);
    if (!email)
      fail(
        "`git config user.email` says nothing — a landing is somebody's word",
      );
    handle = handleOfEmail(map, email);
    if (!handle) {
      fail(
        `${email} is named nowhere in ${TEAM_MAP} — a landing is recorded against a handle, and the map is the fix`,
      );
    }
  }
  if (flags.as) {
    const asked = flags.as.replace(/^@/, "").trim().toLowerCase();
    if (asked !== handle) {
      fail(
        relay
          ? `--as @${asked} does not match @${handle}, the relay's own sender — a landing is the run's word`
          : `--as @${asked} does not resolve to ${email}, which ${TEAM_MAP} names @${handle} — a landing is the committer's word`,
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
  const wanted = roundArtifactOf(target);
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

// The line a read that changed nothing lands, read before anything is
// written: an artifact drawn from nothing, waived, or not written yet has no
// line to write, and each says which it is rather than landing clean and
// reporting a read that never happened as one that did.
let against;
if (reviewedOnly) {
  against = readAgainst(read.entry, artifacts, artifact);
  if (against.refusal) fail(against.refusal);
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
  // What the artifact is read again against: the items the commit dates
  // single out, or the whole of what is before it where the recorded id is
  // what says it moved.
  const what = first.changed;
  fail(
    `${first.artifact} is behind ${what.join(", ")}${whose ? ` and waits on @${whose}` : ""} — it is read again before ${target} lands`,
  );
}
say("behind", `nothing before ${target} is behind`);

// ── 5 held (Q59, Q60) ────────────────────────────────────────────────────────
// Skipped for --reviewed: a read that changes nothing asks nobody's word, so
// it waits on no one's answer either.
const decisionsRelPath = `openspec/changes/${change}/decisions.md`;
const decisionsPath = join(root, decisionsRelPath);
const held =
  reviewedOnly || !existsSync(decisionsPath)
    ? []
    : heldRowsOf(readFileSync(decisionsPath, "utf8"));
if (held.length > 0 && !flags["with-recommendations"]) {
  fail(
    `held: ${held.map((one) => one.id).join(", ")} — answer them, or land with recommendations`,
  );
}
say(
  "held",
  reviewedOnly
    ? "a read that changes nothing asks nobody's word"
    : held.length > 0
      ? `taking ${held.map((one) => one.id).join(", ")} as recommended`
      : "nothing is held",
);

// ── 6 write, before the gate ─────────────────────────────────────────────────
// `landed_by:` and the round's row land in the same commit as the tick or the
// artifact they prove, so the `round` rule the gate runs reads whatever this
// step writes — never the other way around. Writing after the gate would
// deadlock every group whose tick already reached `main` with no row: the
// gate refuses the tick with no row, and the landing that would write the row
// never reaches the write that clears it. A refusal below undoes exactly what
// this step wrote, through `fail`, and leaves nothing else behind.
//
// `--reviewed` writes one line and no row: the read ran no perspective, so
// there is no round to record and no hand's word to record it against.
const cells = reviewedOnly ? undefined : rowOf();
let pending;
if (!dryRun) {
  const record = openRecord(root, change);
  if (reviewedOnly) {
    setEntry(record.doc, "reviewed", artifact, against.content);
    saveRecord(record);
    pending = { record };
  } else {
    // The rewrite a held row's recommendation takes, staged beside the record
    // and the row rather than committed on its own.
    if (held.length > 0) {
      writeFileSync(
        decisionsPath,
        takeRecommendations(readFileSync(decisionsPath, "utf8")),
      );
    }
    // Never for a task group: its plan is proven by the tick, not by a hand's
    // line, and the group names no schema artifact to write one against.
    if (artifact !== undefined)
      setEntry(record.doc, "landed_by", artifact, handle);
    saveRecord(record);
    const { row, round, created } = appendRoundRow(root, change, cells);
    pending = {
      record,
      row,
      round,
      roundsCreated: created,
      heldRewritten: held.length > 0 ? decisionsRelPath : undefined,
    };
  }
  restoreOnFail = () => restorePending(pending);
}

// ── 7 gate ──────────────────────────────────────────────────────────────────
if (dryRun) {
  say("gate", "would run validate:changes, check:manual, tcs:validate");
} else {
  runValidateChanges();
  await runCheckManual();
  runTcsValidate();
  say("gate", "validate:changes, check:manual, tcs:validate pass");
}
// The gate passed: what steps 5 and 6 wrote stand, and a later failure (the
// push losing its race) leaves the commit below in place rather than undoing
// it.
restoreOnFail = undefined;

// ── 8 commit ────────────────────────────────────────────────────────────────
if (dryRun) {
  say(
    "commit",
    reviewedOnly
      ? `would write reviewed: ${artifact}: ${against.content} and no row`
      : artifact === undefined
        ? `would write one ${roundsPath(change)} row for group ${target}`
        : `would write landed_by: ${artifact}: ${handle} and one ${roundsPath(change)} row`,
  );
  if (reviewedOnly)
    console.log(`           read against ${against.items.join(", ")}`);
  else if (held.length > 0)
    console.log(
      `           would take ${held.map((one) => one.id).join(", ")} as recommended`,
    );
} else if (reviewedOnly) {
  const { record } = pending;
  gitOrDie(["add", "--", record.path]);
  gitOrDie([
    "commit",
    "--quiet",
    "-m",
    `chore(openspec): ${target} of ${change} read again, nothing changed`,
  ]);
  say("commit", `reviewed: ${artifact}: ${against.content}, and no row`);
  console.log(`           read against ${against.items.join(", ")}`);
  nameCommit();
} else {
  const { record, row, round } = pending;
  const paths = [record.path, roundsPath(change)];
  if (held.length > 0) paths.push(decisionsRelPath);
  gitOrDie(["add", "--", ...paths]);
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
  if (held.length > 0)
    console.log(
      `           took ${held.map((one) => one.id).join(", ")} as recommended`,
    );
  nameCommit();
}

// ── 9 push ──────────────────────────────────────────────────────────────────
const mainBranch = rebase.ref.replace(/^origin\//, "");
if (dryRun) {
  say(
    "push",
    relay
      ? `would push ${branch} with a lease on ${leaseSha ? short(leaseSha) : "nothing"}, then ask the relay to land it`
      : `would push ${branch} with a lease on ${leaseSha ? short(leaseSha) : "nothing"}, then HEAD:${mainBranch}`,
  );
  console.log("\ndry run — nothing was pushed");
  process.exit(0);
}

/** What one landing says once it has actually landed — the hand's word for a
 * terminal or a word wake, held nothing owed for --reviewed, and every held
 * row this landing took as recommended. */
function landedLine() {
  const took =
    held.length > 0
      ? ` — took ${held.map((one) => one.id).join(", ")} as recommended`
      : "";
  return `\n✓ ${target} of ${change} landed${reviewedOnly ? "" : ` by @${handle}`}${took}`;
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

  if (relay) {
    const answer = await landThroughRelay(relay, {
      sha: leaseSha,
      kind: reviewedOnly ? "reviewed" : "word",
      artifact: artifact ?? roundArtifactOf(target),
    });
    if (answer.status === 200) {
      say("push", `${branch} with a lease, then the relay landed it on main`);
      console.log(landedLine());
      process.exit(0);
    }
    if (answer.status === 403) {
      fail(`the relay refused: ${answer.body?.reason ?? "no reason given"}`);
    }
    if (attempt === 1) {
      console.log(
        "  !        main moved under the push — reading it again and retrying",
      );
    }
    continue;
  }

  const landed = push([`HEAD:refs/heads/${mainBranch}`]);
  if (landed) {
    say("push", `${branch} with a lease, then HEAD:${mainBranch}`);
    console.log(landedLine());
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

/** The relay this run's wake was given, or nothing for a terminal landing.
 * `.round/relay.json` is the run's own file, written before anything else —
 * its presence, not a flag, is what makes this a relay landing. */
function relayOf(store) {
  const file = join(store, RELAY_FILE);
  if (!existsSync(file)) return undefined;
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (cause) {
    fail(`${RELAY_FILE} is not JSON: ${cause.message}`);
  }
  if (!parsed.relay?.url || !parsed.relay?.token) {
    fail(`${RELAY_FILE} names no relay.url and relay.token`);
  }
  return {
    url: parsed.relay.url,
    token: parsed.relay.token,
    sender: parsed.sender,
  };
}

/**
 * `POST {relay.url}/runs/{relay.token}/land { sha, kind, artifact }` — the
 * relay's own checks before it moves `main` (Q55). A function of its own so
 * the tests can stub `relay.url` with a local server; nothing else here ever
 * talks to the code host directly.
 */
async function landThroughRelay(relayTarget, payload) {
  const response = await fetch(
    `${relayTarget.url}/runs/${relayTarget.token}/land`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const text = await response.text().catch(() => "");
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }
  return { status: response.status, body };
}

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
    // A group reaches the row as its bare digits: `roundArtifactOf` is the
    // one reading of this cell, and the writer owes what every reader of it
    // expects rather than the spelling the target happened to use.
    artifact: artifact ?? roundArtifactOf(target),
    perspectives: perspectivesCell(flags.perspectives),
    stood: flags.stood,
    asked: askedCell(flags.asked),
    tests: testsCell(flags.tests),
  };
}

/** The scenarios one group's own task lines cite, in the order they are
 * written and each once: the plan on `main` is what the group owes tests for,
 * so they are read from `tasks.md` rather than taken from the round's word. */
function citedByGroup() {
  const wanted = roundArtifactOf(target);
  const group = read.entry.taskGroups.find((one) => one.num === wanted);
  const ids = [];
  for (const task of group?.tasks ?? []) {
    for (const [, id] of task.text.matchAll(CITED)) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

/**
 * The `Tests` cell, held to what the group's tasks cite: the landing summary
 * and the row name the tests per scenario id, so a group whose task lines
 * cite scenarios owes an entry for each of them and is refused naming the
 * ones left out. A group whose tasks cite none owes nothing, and the row's
 * cell reads `-` like every other column a round has nothing for.
 *
 * An artifact's landing is not held to anything here: no artifact of the
 * schema carries scenario ids of its own to answer for.
 */
function testsCell(value) {
  const cell = String(value ?? "");
  if (artifact !== undefined) return cell;
  const missing = citedByGroup().filter((id) => !cell.includes(id));
  if (missing.length > 0) {
    fail(
      `${target}'s tasks cite a scenario --tests names no test for:\n${missing
        .map((id) => `  ${id}`)
        .join(
          "\n",
        )}\nThe row names the tests per scenario id, so pass --tests "<id>: <file>[; …]" naming one for each.`,
    );
  }
  return cell;
}

/**
 * The readers the round says it dispatched, held to the target's own list in
 * the schema: a name the list does not issue is a typo or a reader nobody
 * dispatched, and an `always` one left out is a round that skipped the floor.
 * A narrow re-run may name fewer readers than the last round did — a trigger
 * the draft no longer raises summons nobody — but never fewer than the
 * `always` set.
 *
 * `verifier` is no perspective of any artifact: it records that a verifier
 * read the round's findings, so the cell is allowed to name it.
 */
function perspectivesCell(value) {
  const cell = listCell(value);
  const issued = perspectivesOf(
    planningSchema(root, read.entry.schema),
    target,
  );
  const named = new Set(
    cell
      .split(/[,;]/)
      .map((one) =>
        one
          .replace(/\(.*\)/, "")
          .trim()
          .toLowerCase(),
      )
      .filter((one) => one !== ""),
  );
  for (const one of named) {
    if (one === "verifier" || issued.some(({ name }) => name === one)) continue;
    fail(
      `\`${one}\` is no perspective of ${target} — the \`${read.entry.schema}\` schema issues ${issued.map(({ name }) => `\`${name}\``).join(", ")}, and \`verifier\` records that a verifier ran`,
    );
  }
  for (const { name, when } of issued) {
    if (!when.includes("always") || named.has(name)) continue;
    fail(
      `${target}'s \`${name}\` reads every round — a narrow re-run may name fewer readers, never an \`always\` one`,
    );
  }
  return cell;
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

/** The commit this landing just made, named in `.round/landed` — what the
 * re-read's own guard reads instead of every commit the job's checkout gained
 * while the round was reading, the landing's rebase on a moved `main`
 * included. Written after the commit, so what it names is a commit that
 * exists. */
function nameCommit() {
  const sha = gitOrDie(["rev-parse", "HEAD"]);
  appendLanded(root, sha);
  console.log(`           ${short(sha)} named in ${LANDED} for the guard`);
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

/** What steps 5 and 6 wrote to the tree, undone: the record back to what
 * `main` holds, the recommendation a held row took with it, and the round's
 * row either back to it too or, where the row's own file did not exist yet,
 * removed outright rather than left as an untracked file the next run's own
 * clean check would have to explain. A `--reviewed` landing wrote the record
 * alone, so there is no row and nothing held to undo. */
function restorePending({ record, row, roundsCreated, heldRewritten }) {
  const path = roundsPath(change);
  const ran = spawnSync("git", ["checkout", "--", record.path], {
    cwd: root,
    stdio: "ignore",
  });
  if (heldRewritten) {
    spawnSync("git", ["checkout", "--", heldRewritten], {
      cwd: root,
      stdio: "ignore",
    });
  }
  if (row === undefined) return;
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
