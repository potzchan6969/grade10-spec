#!/usr/bin/env node
/**
 * The round's landing step, as one transaction:
 *
 *   pnpm run plan:land <change> <artifact|group> --perspectives a,b --stood "…"
 *   pnpm run plan:land <change> <artifact> --reviewed
 *   pnpm run plan:land <change> <artifact|group> [--as @handle] [--with-recommendations] [--dry-run]
 *
 * A landing is the hand's word turned into one commit on `main`, cut from
 * `main` itself and carrying that one artifact and nothing else — the drafts
 * above it on the branch stay on the branch. The steps below run in order and
 * stop at the first refusal. Nothing half-lands: the record line and the
 * round's row are written into the same commit, `main` is a plain
 * fast-forward — or, bound to a wake through `.round/relay.json`, is what the
 * relay makes of the commit this run asked it to land (Q54) — and the branch
 * is rebased on top afterwards.
 *
 *   1 clean    Refuse a dirty working tree or a rebase in progress - a
 *              landing that carries somebody's uncommitted edit is not a
 *              landing
 *   2 hand     Resolve the hand once: with `.round/relay.json` naming a wake,
 *              the wake's sender, and a wake with no sender lands only
 *              `--reviewed`; otherwise `git config user.email` through the
 *              team map, refusing an e-mail the map does not name and a
 *              handle that is not the hand of the stage, naming whose word it
 *              waits on; `--as @handle` is taken only where it resolves to
 *              the same e-mail. Everything after this reads that one value
 *   3 main     `git fetch origin main`, record that sha as `MAIN`, and rebase
 *              the change's branch on it
 *   4 behind   Refuse when `behindOf` names anything before the artifact, and
 *              name it and its hand; refuse while a `❓` row is open, naming
 *              the rows, unless `--with-recommendations` takes them; the rows
 *              are read through the manual's own question reader, never a
 *              second parser. Bound to a wake, ask it once here whether it is
 *              still the room's own: a run whose lease the relay has closed
 *              under it cuts nothing (Q81)
 *   5 cut      Cut the landing commit `L` from `MAIN`: for an artifact, its
 *              own files (the schema's `generates:` glob), the change's
 *              `.openspec.yaml` with `landed_by:` and, with the flag, the
 *              `reviewed:` lines of the drafted artifacts after the
 *              decisions, `rounds.md` with the round's row, `decisions.md`
 *              wherever the branch changed it - the flag's rewrite of the
 *              held rows, or the hand's own answer - and the pages the
 *              proposal links, which is the set `reread-guard.mjs` holds
 *              every push of this run to; for a task group, the rebased
 *              branch tip, since nothing is drafted ahead at Building
 *   6 gate     Run the gate - `validate:changes`, `check:manual`,
 *              `tcs:validate` - against `L`'s tree with `PLAN_NO_FETCH=1`; a
 *              refusal leaves the branch and the working tree as they were,
 *              `L` never having touched them
 *   7 land     `main`: a plain fast-forward `push L:main` from a terminal,
 *              or, bound to a wake, `L` pushed to the side ref
 *              `claude/<change>-landing` - never over the branch - so the
 *              code host holds the commit, `POST /runs/<token>/land` with
 *              `L`'s sha, the kind and the artifact, and the side ref
 *              deleted once the relay has answered
 *   8 branch   Rebase the branch onto `L`, so the drafts sit above the
 *              landing, and
 *              `git push --force-with-lease=refs/heads/<branch>:<the sha the run read>`
 *   9 again    On a 409 from the relay, or a push of `main` or the branch the
 *              remote rejected because the ref moved under it, re-read `main`
 *              once and retry from 3; losing again, reply in the thread and
 *              stop. Every other status the relay gives and every other way
 *              git can refuse a push stops the run, naming the status and
 *              the relay's reason or git's own stderr - the side ref
 *              included, which this run alone owns and nobody races it for
 *
 * `pnpm land` becomes this step when `land-on-main-through-the-gate` makes one
 * gate for both repositories (`Q36`).
 *
 * `--dry-run` cuts `L` and runs the gate against it for real, prints the same
 * lines a landing prints, and stops before step 7: nothing is pushed, and no
 * ref names the commit it made (Q79). `--root` lands in a store other than
 * this one, which is how the tests drive a fixture store - a real landing
 * never passes it. `PLAN_LAND_RACE` is the tests' own seam for losing a push
 * on purpose, and is refused at the argument parsing unless `--root` was also
 * passed: nothing about a real landing should ever read it.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatReport,
  runChecks,
} from "../../tools/manual/check/check-manual.mjs";
import { behindOf, handOfArtifact } from "../../tools/manual/src/api/stages.ts";
import { roundArtifactOf } from "../../tools/manual/src/store/read-rounds.mts";
import { parseArgs } from "./lib/args.mjs";
import { heldIdsOf, takeRecommendations } from "./lib/held.mjs";
import { appendLanded, changedPaths, LANDED } from "./lib/landed.mjs";
import {
  isGroup,
  perspectivesOf,
  planningSchema,
} from "./lib/perspectives.mjs";
import { openRecord, setEntry } from "./lib/record.mjs";
import { readWake, relayOf } from "./lib/relay.mjs";
import { readAgainst } from "./lib/reviewed.mjs";
import { listCell, roundsPath, withRoundRow } from "./lib/rounds.mjs";
import { readChangeEntry } from "./lib/store-read.mjs";
import { handleOfEmail, readTeamMap, TEAM_MAP } from "./lib/team.mjs";
import { isWritable, writableBy } from "./lib/writable.mjs";
import { git as storeGit, storeMain } from "./store-main.mjs";
import { main as validateChanges } from "./validate-changes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
/** A scenario a task line cites, the way the store writes a citation: in
 * backticks, so prose about a scenario is not read as one. */
const CITED = /`([a-z0-9][a-z0-9-]*-SC-\d+)`/g;
/** What a push the remote refused because the ref moved under it says, in
 * git's own words: step 9's one retry. Anything else git says is git refusing
 * to push at all, which is nobody's race to re-run. */
const REJECTED = /\[rejected\]|\[remote rejected\]|non-fast-forward|stale info/;
/** The all-zero object id, which is how `update-index --index-info` is told a
 * path is gone rather than written. */
const GONE = "0000000000000000000000000000000000000000";
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
/** The temporary indexes, worktrees and refs this run made, removed on the
 * way out whichever way it leaves: nothing of a landing lives outside git's
 * object database and the two refs it moves. */
const scratch = [];
process.on("exit", done);
// A signal kills the default listener's process without running `exit`, so
// the interrupt is turned into an exit of this run's own: the scratch a
// landing cut goes with it either way.
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => process.exit(130));
if (process.env.PLAN_LAND_RACE && !flags.root)
  fail("PLAN_LAND_RACE is a test seam and needs --root");
let wake;
try {
  wake = readWake(root);
} catch (cause) {
  fail(cause.message);
}
const relay = wake ? relayOf(wake) : undefined;
const [change, target] = positional;
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

// ── 2 hand — resolved once, and every step after this reads that one value ───
// Skipped for `--reviewed`: a read that changes nothing is the change's agent
// to land, not a hand's word, and a wake with no sender still lands one.
let handle;
let email;
if (!reviewedOnly) {
  if (wake) {
    handle = String(wake.sender?.handle ?? "")
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
        wake
          ? `--as @${asked} does not match @${handle}, the relay's own sender — a landing is the run's word`
          : `--as @${asked} does not resolve to ${email}, which ${TEAM_MAP} names @${handle} — a landing is the committer's word`,
      );
    }
  }
}

// ── 3 to 9, twice at most: a `main` that moved under the push is read again
// once and the whole landing is cut from it afresh (step 9) ─────────────────
const leaseSha = remoteBranchSha();
for (let attempt = 1; attempt <= 2; attempt += 1) {
  const landed = await attemptLanding(attempt);
  if (landed) {
    done();
    process.exit(0);
  }
  if (attempt === 1) {
    console.log(
      "  !        main moved under the push — reading it again and retrying",
    );
  }
}

fail(
  `${change}'s push lost its race twice: this run lost and is stopping, and the winner's work stands. Read main again and land on top of it.`,
);

// ── The landing, once ───────────────────────────────────────────────────────

/**
 * Steps 3 to 8, from a `main` read now: `true` where the landing stands,
 * `false` where `main` moved under it and step 9 gets one more go. Every
 * other refusal leaves through `fail`.
 */
async function attemptLanding(attempt) {
  // ── 3 main — always fetched, the branch rebased on it, and the one reading
  // of the change this attempt takes, drawn from what the rebase leaves ─────
  const rebase = fetchMain();
  const mainBranch = rebase.ref.replace(/^origin\//, "");
  const MAIN = rebase.commit;
  say(
    "main",
    `${rebase.ref} at ${short(MAIN)}, the branch rebased on it${attempt > 1 ? " again" : ""}`,
  );

  const read = await readChangeEntry(root, change).catch((cause) =>
    fail(cause.message),
  );
  const artifacts = read.artifacts;
  const artifact = artifactIdOf(artifacts, target);
  const group = artifact === undefined;
  if (group && !isGroup(target)) {
    fail(
      `\`${target}\` is neither an artifact of the \`${read.entry.schema}\` schema nor a task group`,
    );
  }
  if (group) {
    const wanted = roundArtifactOf(target);
    const known = read.entry.taskGroups.map((one) => one.num);
    if (!known.includes(wanted)) {
      fail(
        `${change}'s tasks.md holds no group ${wanted} — it holds ${known.length > 0 ? known.join(", ") : "none"}`,
      );
    }
  }
  if (reviewedOnly && group) {
    fail(
      "--reviewed names an artifact, never a task group — a group's plan is proven by the tick, and the tick is its own landing",
    );
  }

  const role = handOfArtifact(group ? "tasks" : artifact, artifacts);
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

  // ── 4 behind, and the held rows (Q59, Q60) ────────────────────────────────
  // A task group is after every artifact: the plan it implements is the last
  // of them, so anything behind refuses it.
  const order = artifacts.map((one) => one.id);
  const at = group ? order.length : order.indexOf(artifact);
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
    fail(
      `${first.artifact} is behind ${first.changed.join(", ")}${whose ? ` and waits on @${whose}` : ""} — it is read again before ${target} lands`,
    );
  }
  say("behind", `nothing before ${target} is behind`);

  // Skipped for --reviewed: a read that changes nothing asks nobody's word,
  // so it waits on no one's answer either. Read once, here, and every reader
  // of the table below takes that one text.
  const decisionsRelPath = `openspec/changes/${change}/decisions.md`;
  const decisionsPath = join(root, decisionsRelPath);
  const decisions =
    reviewedOnly || !existsSync(decisionsPath)
      ? undefined
      : readFileSync(decisionsPath, "utf8");
  let held = [];
  if (decisions !== undefined) {
    try {
      held = heldIdsOf(decisions);
    } catch (cause) {
      fail(cause.message);
    }
  }
  if (held.length > 0 && !flags["with-recommendations"]) {
    fail(
      `held: ${held.join(", ")} — answer them, or land with recommendations`,
    );
  }
  const ids = held.join(", ");
  say(
    "held",
    reviewedOnly
      ? "a read that changes nothing asks nobody's word"
      : held.length > 0
        ? `taking ${ids} as recommended`
        : "nothing is held",
  );

  // The wake, asked once before anything is cut: a run whose lease the relay
  // has closed under it — its budget spent, or a second wake queued on the
  // change — lands nothing rather than cutting a commit no thread is waiting
  // for (Q81).
  if (relay) {
    const alive = await askTheRelay(() => relay.alive());
    if (alive.status !== 200) {
      fail(
        `this run's wake is not the room's any more (${alive.status}) — it lands nothing`,
      );
    }
    say("wake", "the wake is alive");
  }

  // ── 5 cut ────────────────────────────────────────────────────────────────
  const cells = reviewedOnly ? undefined : rowOf(read, artifact, group);
  const tip = git(["rev-parse", "HEAD"]);
  const base = group ? tip : MAIN;
  // A git that refused is this reading broken, not a branch that changed
  // nothing: it leaves through `fail`, as `heldIdsOf` does.
  let changed = [];
  try {
    changed = changedPaths(root, MAIN, tip);
  } catch (cause) {
    fail(cause.message);
  }
  // The pages the change may write, held to the exact set the guard holds
  // every push of this run to: the change's own directory is carried by the
  // legs above this one, artifact by artifact, so the pages are what is left
  // of that set.
  const pages = writableBy(root, change).filter(
    (one) => one !== `openspec/changes/${change}/`,
  );
  // The decisions travel with the landing whenever this commit says something
  // new about them: the flag's rewrite of the held rows, or the answer the
  // hand typed into the table on the branch. A landing that left either
  // behind would put `main`'s copy of the question back over the answer.
  const carriesDecisions =
    !reviewedOnly &&
    !group &&
    (held.length > 0 || changed.includes(decisionsRelPath));
  // A task group lands the rebased branch tip, which carries its code
  // already; a `--reviewed` line lands alone, carrying nothing.
  const carried =
    reviewedOnly || group
      ? []
      : [
          ...filesOf(changed, artifacts, artifact),
          ...(carriesDecisions ? [decisionsRelPath] : []),
          ...changed.filter((path) => isWritable(pages, path)),
        ];
  // Never a `landed_by:` line for a task group: its plan is proven by the
  // tick, not by a hand's line, and the group names no schema artifact to
  // write one against.
  const lines = reviewedOnly
    ? [["reviewed", artifact, against.content]]
    : group
      ? []
      : [["landed_by", artifact, handle]];
  const written = new Map();
  if (reviewedOnly) {
    say("cut", `reviewed: ${artifact}: ${against.content}, and no row`);
    console.log(`           read against ${against.items.join(", ")}`);
  } else {
    if (held.length > 0)
      written.set(decisionsRelPath, takeRecommendations(decisions));
    const rounds = withRoundRow(root, change, cells);
    written.set(roundsPath(change), rounds.text);
    say("cut", `round ${rounds.round}: ${rounds.row}`);
  }
  // The drafts after the decisions were drawn from the decisions this landing
  // carries — the recommendations the flag took, or the hand's own answer —
  // so the same commit records them as read again against them and nothing
  // goes behind (Q60).
  if (carriesDecisions) {
    const reread = await reviewedAfterDecisions(tip, written, order, changed);
    if (reread.length > 0) {
      lines.push(...reread.map(([id, content]) => ["reviewed", id, content]));
      say(
        "cut",
        `read again against ${ids === "" ? "the decisions" : ids}: ${reread
          .map(([id]) => id)
          .join(", ")}`,
      );
    }
  }
  if (lines.length > 0) written.set(recordPath(), recordText(lines));

  const message = reviewedOnly
    ? `chore(openspec): ${target} of ${change} read again, nothing changed`
    : `chore(openspec): land ${target} of ${change}${group ? "" : ` on @${handle}`}`;
  const commit = cutFrom(
    base,
    tip,
    carried.filter((path) => !written.has(path)),
    written,
    message,
  );
  say(
    "cut",
    `${short(commit)} from ${short(base)}, carrying ${[...new Set([...carried, ...written.keys()])].length} path(s)`,
  );

  // ── 6 gate, against L's tree ─────────────────────────────────────────────
  process.env.PLAN_NO_FETCH = "1";
  const gate = worktreeAt(commit);
  runValidateChanges(gate);
  await runCheckManual(gate);
  runTcsValidate(gate);
  say("gate", "validate:changes, check:manual, tcs:validate pass");

  // A dry run stops here, having cut the commit and judged it: what it
  // reports is what ran, and no ref names what it made (Q79).
  if (dryRun) {
    say(
      "land",
      relay
        ? `would ask the relay to move ${mainBranch} to ${short(commit)}`
        : `would push ${short(commit)} to ${mainBranch} as a fast-forward`,
    );
    say(
      "branch",
      `would rebase ${branch} onto it and push with a lease on ${leaseSha ? short(leaseSha) : "nothing"}`,
    );
    console.log("\ndry run — nothing was pushed");
    done();
    process.exit(0);
  }

  // ── 7 land: main moves, by this run's push or by the relay ───────────────
  if (relay) {
    // The relay reads the commit from the code host, so a ref has to hold it:
    // this run's own side ref, force-pushed because it is scratch and deleted
    // as soon as the relay has answered. Never the change's branch — that
    // moves at step 8, after `main`, so a relay that refuses leaves the
    // branch exactly as the round left it.
    const side = `refs/heads/claude/${change}-landing`;
    race(attempt);
    // Forced onto a ref this run alone owns, so a push it refuses is no
    // race: nothing moved it under this run, and cutting the landing again
    // would ask the remote the same question twice. Step 9's retry is the
    // relay's 409 and nothing else.
    const pushed = push([`+${commit}:${side}`]);
    if (!pushed.ok)
      fail(`the landing's side ref ${side} would not push:\n${pushed.stderr}`);
    const ref = { kind: "ref", path: side };
    scratch.push(ref);
    const answer = await askTheRelay(() =>
      relay.land({
        sha: commit,
        kind: reviewedOnly ? "reviewed" : "word",
        artifact: artifact ?? roundArtifactOf(target),
      }),
    );
    remove(ref);
    if (answer.status === 409) return false;
    if (answer.status !== 200) {
      fail(
        `the relay refused (${answer.status}): ${answer.body?.reason ?? "no reason given"}`,
      );
    }
    say("land", `the relay moved ${mainBranch} to ${short(commit)}`);
  } else {
    race(attempt);
    const pushed = push([`${commit}:refs/heads/${mainBranch}`]);
    if (!pushed.ok) {
      if (!pushed.rejected) fail(`git push refused:\n${pushed.stderr}`);
      return false;
    }
    say("land", `${short(commit)} pushed to ${mainBranch} as a fast-forward`);
  }
  // `main` holds it: the guard behind this run's next push reads it here,
  // and reads nothing this run did not commit.
  appendLanded(root, commit);
  console.log(`           ${short(commit)} named in ${LANDED} for the guard`);

  // ── 8 branch — the drafts sit above the landing ──────────────────────────
  rebaseOnto(commit, artifact ?? `group ${roundArtifactOf(target)}`);
  const pushed = push([
    `--force-with-lease=refs/heads/${branch}:${leaseSha}`,
    `HEAD:refs/heads/${branch}`,
  ]);
  if (!pushed.ok) {
    fail(
      pushed.rejected
        ? `${branch} moved on origin under this run — another run is on this change's branch, and this one is not overwriting it. ${short(commit)} is on ${mainBranch} already; read the branch again and rebase it there.`
        : `git push refused:\n${pushed.stderr}`,
    );
  }
  say("branch", `${branch} rebased onto ${short(commit)} and pushed`);
  const took = held.length > 0 ? ` — took ${ids} as recommended` : "";
  console.log(
    `\n✓ ${target} of ${change} landed${reviewedOnly ? "" : ` by @${handle}`}${took}`,
  );
  return true;
}

// ── The pieces ──────────────────────────────────────────────────────────────

/**
 * One call on the wake, through `lib/relay.mjs`, the one client: the relay's
 * own checks before it moves `main` (Q55), and the question of whether this
 * wake is still the room's. A relay nobody can reach is not a `main` that
 * moved, so it stops rather than retrying.
 */
async function askTheRelay(call) {
  try {
    return await call();
  } catch (cause) {
    return fail(`the relay could not be reached: ${cause.message}`);
  }
}

/** Where the change's record sits, store-relative. */
function recordPath() {
  return `openspec/changes/${change}/.openspec.yaml`;
}

/**
 * The record as the landing commit carries it: what the branch holds, plus
 * the lines this landing writes. Round-tripped through the document API, so
 * every other line, comment and order of the person who wrote it stands.
 */
function recordText(entries) {
  const record = openRecord(root, change);
  for (const [key, id, value] of entries) setEntry(record.doc, key, id, value);
  return record.doc.toString();
}

/**
 * The files one artifact of the change is written as, out of what the branch
 * changed: the schema's own `generates:`, a `specs/**` artifact being one
 * artifact with one file per capability that carries it. Nothing where the
 * branch changed none of them — an artifact whose text `main` already holds
 * is carried by `main` itself.
 */
function filesOf(changed, artifacts, artifact) {
  const { generates } = artifacts.find((one) => one.id === artifact);
  const dir = `openspec/changes/${change}`;
  if (!generates.startsWith("specs/")) {
    const path = `${dir}/${generates}`;
    return changed.includes(path) ? [path] : [];
  }
  const name = generates.slice(generates.lastIndexOf("/") + 1);
  return changed.filter(
    (path) => path.startsWith(`${dir}/specs/`) && path.endsWith(`/${name}`),
  );
}

/**
 * The landing commit, cut from `base` in a temporary index and committed with
 * `commit-tree`: the user's own working tree and index are never touched, so
 * a refusal at the gate leaves them as they were and `L` never existed
 * outside git's object database.
 *
 * `carried` are paths taken from `source` as they stand there, read in one
 * `ls-tree` and written in one `update-index --index-info` (Q80); `written`
 * are the texts this landing wrote, hashed straight into the object database.
 * A path `source` no longer holds is written as mode 0, which is how the
 * index is told a path is gone, so an artifact file the branch deleted lands
 * as a deletion.
 */
function cutFrom(base, source, carried, written, message) {
  const dir = mkdtempSync(join(tmpdir(), "plan-land-index-"));
  scratch.push({ kind: "dir", path: dir });
  const index = join(dir, "index");
  const inIndex = (args, options) =>
    gitOrDie(args, { ...options, env: { GIT_INDEX_FILE: index } });
  inIndex(["read-tree", base]);
  const entries = [];
  if (carried.length > 0) {
    const listed = inIndex(["ls-tree", "-z", source, "--", ...carried]);
    const held = new Map();
    for (const record of listed.split("\0").filter(Boolean)) {
      const [meta, path] = record.split("\t");
      held.set(path, `${meta}\t${path}`);
    }
    for (const path of carried)
      entries.push(held.get(path) ?? `0 ${GONE}\t${path}`);
  }
  for (const [path, text] of written)
    entries.push(`100644 ${hashObject(text, path)}\t${path}`);
  if (entries.length > 0) {
    inIndex(["update-index", "-z", "--index-info"], {
      input: `${entries.join("\0")}\0`,
    });
  }
  const tree = inIndex(["write-tree"]);
  return inIndex(["commit-tree", tree, "-p", base, "-m", message]);
}

/** One text as a blob in the object database, named by the path it will be
 * written at so git's own attributes apply to it. */
function hashObject(text, path) {
  return gitOrDie(["hash-object", "-w", "--stdin", "--path", path], {
    input: text,
  });
}

/** A throwaway worktree at one commit: what the gate reads, and what the
 * `reviewed:` ids are computed over. A linked worktree, never the user's
 * own — the tree the gate judges is the tree that lands, and the tree the
 * round is working in stays where it is. */
function worktreeAt(commit) {
  const dir = join(mkdtempSync(join(tmpdir(), "plan-land-gate-")), "tree");
  gitOrDie(["worktree", "add", "--quiet", "--detach", dir, commit]);
  scratch.push({ kind: "worktree", path: dir });
  return dir;
}

/**
 * The `reviewed:` lines a landing that carries the decisions owes: one per
 * artifact after them that the branch drafted, in the grammar
 * `lib/reviewed.mjs` writes.
 *
 * Read off the branch tip with this landing's own written files laid over
 * it — never off `L`'s tree, which carries `main`'s draft of everything this
 * landing does not itself land: an id computed there would say the drafts
 * were read against texts the run never saw, and every one of them would go
 * behind on the next reading.
 */
async function reviewedAfterDecisions(tip, written, order, changed) {
  const from = order.indexOf("decisions");
  if (from === -1) return [];
  const at = worktreeAt(tip);
  for (const [path, text] of written) {
    const file = join(at, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  const read = await readChangeEntry(at, change).catch((cause) =>
    fail(cause.message),
  );
  const lines = [];
  for (const id of order.slice(from + 1)) {
    if (filesOf(changed, read.artifacts, id).length === 0) continue;
    const against = readAgainst(read.entry, read.artifacts, id);
    if (against.refusal) continue;
    lines.push([id, against.content]);
  }
  return lines;
}

/** The artifact id a target names: the schema's id, or the file it generates.
 * Nothing where the target is a task group. */
function artifactIdOf(artifacts, named) {
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
function rowOf(read, artifact, group) {
  if (!flags.perspectives || !flags.stood) {
    fail(
      `the landing commits the round's row: pass --perspectives and --stood\n${USAGE}`,
    );
  }
  return {
    // A group reaches the row as its bare digits: `roundArtifactOf` is the
    // one reading of this cell, and the writer owes what every reader of it
    // expects rather than the spelling the target happened to use.
    artifact: group ? roundArtifactOf(target) : artifact,
    perspectives: perspectivesCell(read, flags.perspectives),
    stood: flags.stood,
    asked: askedCell(flags.asked),
    tests: testsCell(read, group, flags.tests),
  };
}

/** The scenarios one group's own task lines cite, in the order they are
 * written and each once: the plan on `main` is what the group owes tests for,
 * so they are read from `tasks.md` rather than taken from the round's word. */
function citedByGroup(read) {
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
function testsCell(read, group, value) {
  const cell = String(value ?? "");
  if (!group) return cell;
  const missing = citedByGroup(read).filter((id) => !cell.includes(id));
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
function perspectivesCell(read, value) {
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
  const rebased = spawnSync("git", ["rebase", "--quiet", main.commit], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (rebased.status !== 0) {
    fail(
      `the branch does not rebase on main cleanly:\n${rebased.stderr ?? ""}Resolve it on the branch, then land.${abortRebase()}`,
    );
  }
  return { ref: main.ref, commit: main.commit };
}

/**
 * The branch rebased onto the landing commit, so the drafts above it sit
 * above the landing (step 8).
 *
 * `-X ours` because the landing commit is the newer text of every path it
 * carries: it was cut from the branch's own final draft of that artifact, so
 * replaying the commits that drafted it hands git an older version of a file
 * the landing already settled, and "ours" is the one that just landed. A
 * draft of anything the landing did not carry conflicts with nothing and is
 * replayed as it stands. A conflict the strategy cannot resolve is one
 * artifact's draft against what just landed, so it names it and stops rather
 * than leaving a rebase in progress in somebody's checkout.
 */
function rebaseOnto(commit, named) {
  const rebased = spawnSync(
    "git",
    ["rebase", "--quiet", "-X", "ours", commit],
    {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  if (rebased.status === 0) return;
  fail(
    `${named} landed, and ${branch} does not rebase onto it cleanly:\n${rebased.stderr ?? ""}Resolve it on the branch — main holds the landing already.${abortRebase()}`,
  );
}

/**
 * The rebase this run started, wound back — and what is left behind where it
 * will not wind back, since a refusal that leaves a rebase in progress in
 * somebody's checkout and says nothing about it is the worse of the two.
 */
function abortRebase() {
  const aborted = spawnSync("git", ["rebase", "--abort"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (aborted.status === 0) return "";
  return `\nThe rebase would not abort either (${(aborted.stderr ?? "").trim()}): ${root} is left mid-rebase, and \`git rebase --abort\` there is the fix.`;
}

/** What the remote holds for this branch right now, read once, before this
 * run's own rebase touches anything local — the lease every push of the
 * branch is made against. Nothing this run does moves the branch before step
 * 8, so this is read once and never again: reading it fresh before the push
 * would make the lease trust whatever is there instead of protecting against
 * it. Empty for a branch the remote does not hold yet. */
function remoteBranchSha() {
  const listed = git(["ls-remote", "origin", `refs/heads/${branch}`]);
  return listed ? listed.split(/\s+/)[0] : "";
}

/**
 * `git push origin …`: `{ ok, rejected, stderr }`. A rejection is a ref that
 * moved under this run, which is step 9's one retry; every other way a push
 * can fail is git refusing to push at all — no remote, no network, a hook —
 * and nobody's race to run again.
 */
function push(args) {
  const ran = spawnSync("git", ["push", "origin", ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const stderr = ran.stderr ?? "";
  if (ran.status !== 0 && stderr) process.stderr.write(stderr);
  return {
    ok: ran.status === 0,
    rejected: REJECTED.test(stderr),
    stderr,
  };
}

/** The tests' own hook: a command run just before each push, so a run can be
 * made to lose its race. Refused at the argument parsing unless `--root` was
 * also passed, so nothing about a real landing can ever read it. Set by
 * nothing but this store's own tests. */
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

/**
 * One git command that must work, or the run stops naming what git said.
 * `input` is what it reads on stdin — the one index write and the one hash
 * this landing makes; `env` is added to this process's own.
 */
function gitOrDie(args, { env, input } = {}) {
  const ran = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    ...(input === undefined ? {} : { input }),
    ...(env ? { env: { ...process.env, ...env } } : {}),
  });
  if (ran.status !== 0) fail(`git ${args[0]} refused:\n${ran.stderr ?? ""}`);
  return ran.stdout.trim();
}

/** `validate:changes --strict <change>`, in this process against the gate's
 * tree: `main` sets `process.exitCode` rather than throwing on a validation
 * failure, so that is what is read back, and reset either way — this run's
 * own exit code is its own to set. */
function runValidateChanges(gate) {
  const before = process.exitCode;
  process.exitCode = undefined;
  try {
    validateChanges(gate, true, change);
  } catch (cause) {
    process.exitCode = before;
    fail(`the gate refuses: validate:changes\n${cause.message}`);
  }
  const failed = Boolean(process.exitCode);
  process.exitCode = before;
  if (failed) fail("the gate refuses: validate:changes");
}

/** `check:manual`, in this process: `runChecks` is pure over the root it is
 * given, so this reads the tree the landing carries rather than the branch it
 * was cut from. */
async function runCheckManual(gate) {
  let result;
  try {
    result = await runChecks(gate);
  } catch (cause) {
    fail(`the gate refuses: check:manual\n${cause.message}`);
  }
  const { text, failures } = formatReport(gate, result);
  console.log(text);
  if (failures > 0) fail("the gate refuses: check:manual");
}

/** `tcs:validate`, scoped to this change: the script reads the store its own
 * file sits in and calls `process.exit` itself, so the gate's own copy of it
 * is what runs where the tree carries one — and this store's, never a copy,
 * where it does not. Scoped to the change so this gate judges what the change
 * itself owes rather than every suite the whole store holds, the way
 * `validate:changes --strict <change>` already does. */
function runTcsValidate(gate) {
  const own = join(gate, "scripts", "openspec", "validate-test-cases.mjs");
  const file = existsSync(own) ? own : join(HERE, "validate-test-cases.mjs");
  const ran = spawnSync(
    process.execPath,
    [file, `openspec/changes/${change}`],
    { cwd: gate, stdio: "inherit" },
  );
  if (ran.status !== 0) fail("the gate refuses: tcs:validate");
}

/** One temporary thing this run made, gone: a worktree through git, so the
 * admin file beside it goes too; a side ref off the remote; a directory as it
 * stands. What will not go is said rather than left silently behind. */
function clean({ kind, path }) {
  if (kind === "ref") {
    const deleted = spawnSync("git", ["push", "origin", "--delete", path], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (deleted.status !== 0) {
      console.error(
        `the landing's side ref ${path} is still on origin: ${(deleted.stderr ?? "").trim()}`,
      );
    }
    return;
  }
  if (kind === "worktree") {
    const removed = spawnSync("git", ["worktree", "remove", "--force", path], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (removed.status !== 0) {
      // The tree itself is a temporary directory and goes below; what would
      // be left is git's own record of a worktree that is not there, which is
      // what `prune` is for.
      const pruned = spawnSync("git", ["worktree", "prune"], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      console.error(
        `the gate's worktree at ${path} would not be removed (${(removed.stderr ?? "").trim()})${
          pruned.status === 0
            ? " — pruned from git's own record instead"
            : `, and \`git worktree prune\` in ${root} refused too: it is left behind`
        }`,
      );
    }
    rmSync(dirname(path), { force: true, recursive: true });
    return;
  }
  rmSync(path, { force: true, recursive: true });
}

/** One scratch entry gone before the run ends: the side ref, once the relay
 * has answered about it. */
function remove(entry) {
  const at = scratch.indexOf(entry);
  if (at !== -1) scratch.splice(at, 1);
  clean(entry);
}

/** Everything this run made, removed. Registered on `exit` as well as called
 * on the way out, so a refusal, a throw and a clean landing all leave the
 * same nothing behind. */
function done() {
  for (const entry of scratch.reverse()) clean(entry);
  scratch.length = 0;
}

function fail(message) {
  done();
  console.error(message);
  process.exit(1);
}
