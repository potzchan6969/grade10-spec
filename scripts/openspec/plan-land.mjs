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
 *              second parser
 *   5 cut      Cut the landing commit `L` from `MAIN`: for an artifact, its
 *              own files (the schema's `generates:` glob), the change's
 *              `.openspec.yaml` with `landed_by:` and, with the flag, the
 *              `reviewed:` lines of the drafted artifacts after the
 *              decisions, `rounds.md` with the round's row, `decisions.md`
 *              where the flag rewrote held rows, and the pages under
 *              `docs/prds/` and `docs/references/` the branch changed; for a
 *              task group, the rebased branch tip, since nothing is drafted
 *              ahead at Building
 *   6 gate     Run the gate - `validate:changes`, `check:manual`,
 *              `tcs:validate` - against `L`'s tree with `PLAN_NO_FETCH=1`; a
 *              refusal leaves the branch and the working tree as they were,
 *              `L` never having touched them
 *   7 land     `main`: a plain fast-forward `push L:main` from a terminal, or
 *              `POST /runs/<token>/land` with `L`'s sha, the kind and the
 *              artifact, and the relay moves `main` after its checks
 *   8 branch   Rebase the branch onto `L`, so the drafts sit above the
 *              landing, and
 *              `git push --force-with-lease=refs/heads/<branch>:<the sha the run read>`
 *   9 again    On a rejected push or a 409 from the relay, re-read `main`
 *              once and retry from 3; losing again, reply in the thread and
 *              stop; a 403 names the check the relay failed, and the run
 *              replies with it and stops
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
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
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
import { heldRowsOf, takeRecommendations } from "./lib/held.mjs";
import { appendLanded, LANDED } from "./lib/landed.mjs";
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
import { git as storeGit, storeMain } from "./store-main.mjs";
import { main as validateChanges } from "./validate-changes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
/** A scenario a task line cites, the way the store writes a citation: in
 * backticks, so prose about a scenario is not read as one. */
const CITED = /`([a-z0-9][a-z0-9-]*-SC-\d+)`/g;
/** The trees a landing may carry beside the change's own directory: the pages
 * a change marks and the references it cites, and nothing else. */
const PAGES = ["docs/prds/", "docs/references/"];
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
const wake = readWake(root);
const relay = wake ? relayOf(wake) : undefined;
const [change, target] = positional;
/** The temporary indexes and worktrees this run made, removed on the way out
 * whichever way it leaves: nothing of a landing lives outside git's object
 * database and the two refs it moves. */
const scratch = [];
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
let leaseSha = remoteBranchSha();
let mainBranch;
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
  mainBranch = rebase.ref.replace(/^origin\//, "");
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
  // so it waits on no one's answer either.
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
  const ids = held.map((one) => one.id).join(", ");
  say(
    "held",
    reviewedOnly
      ? "a read that changes nothing asks nobody's word"
      : held.length > 0
        ? `taking ${ids} as recommended`
        : "nothing is held",
  );

  // ── 5 cut ────────────────────────────────────────────────────────────────
  const cells = reviewedOnly ? undefined : rowOf(read, artifact, group);
  if (dryRun) {
    say(
      "cut",
      `would cut the landing commit from ${group ? `the branch tip at ${short(git(["rev-parse", "HEAD"]))}` : short(MAIN)}`,
    );
    if (reviewedOnly) {
      console.log(
        `           it would write reviewed: ${artifact}: ${against.content}, and no row`,
      );
      console.log(`           read against ${against.items.join(", ")}`);
    } else if (group) {
      console.log(
        `           it would write one ${roundsPath(change)} row for group ${target}`,
      );
    } else {
      console.log(
        `           it would write ${artifact}'s own files, landed_by: ${artifact}: ${handle} and one ${roundsPath(change)} row`,
      );
    }
    if (!reviewedOnly && held.length > 0)
      console.log(`           would take ${ids} as recommended`);
    say("gate", "would run validate:changes, check:manual, tcs:validate");
    say(
      "land",
      relay
        ? "would ask the relay to move main to it"
        : `would push it to ${mainBranch} as a fast-forward`,
    );
    say(
      "branch",
      `would rebase ${branch} onto it and push with a lease on ${leaseSha ? short(leaseSha) : "nothing"}`,
    );
    console.log("\ndry run — nothing was pushed");
    done();
    process.exit(0);
  }

  const tip = git(["rev-parse", "HEAD"]);
  const base = group ? tip : MAIN;
  const changed = changedPaths(MAIN, tip);
  // A task group lands the rebased branch tip, which carries its code
  // already; a `--reviewed` line lands alone, carrying nothing.
  const carried =
    reviewedOnly || group
      ? []
      : [
          ...filesOf(changed, artifacts, artifact),
          ...changed.filter((path) =>
            PAGES.some((tree) => path.startsWith(tree)),
          ),
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
    if (held.length > 0) {
      written.set(
        decisionsRelPath,
        takeRecommendations(readFileSync(decisionsPath, "utf8")),
      );
    }
    const rounds = withRoundRow(root, change, cells);
    written.set(roundsPath(change), rounds.text);
    say("cut", `round ${rounds.round}: ${rounds.row}`);
  }
  if (lines.length > 0) written.set(recordPath(), recordText(lines));

  const message = reviewedOnly
    ? `chore(openspec): ${target} of ${change} read again, nothing changed`
    : `chore(openspec): land ${target} of ${change}${group ? "" : ` on @${handle}`}`;
  let commit = cutFrom(base, tip, carried, written, message);
  const gate = worktreeAt(commit);
  // The recommendations the flag took are what the drafts after the decisions
  // were drawn from, so the same commit records them as read again against
  // them and nothing goes behind (Q60). The ids are the ones `L`'s own tree
  // computes - `.openspec.yaml` is in no artifact's upstream set, so reading
  // them off a commit that holds the record without them answers the same.
  if (held.length > 0) {
    const reread = await reviewedAfterDecisions(gate, order, changed);
    if (reread.length > 0) {
      written.set(
        recordPath(),
        recordText([
          ...lines,
          ...reread.map(([id, content]) => ["reviewed", id, content]),
        ]),
      );
      commit = cutFrom(base, tip, carried, written, message);
      gitOrDie(["-C", gate, "checkout", "--quiet", "--detach", commit]);
      say(
        "cut",
        `read again against ${ids}: ${reread.map(([id]) => id).join(", ")}`,
      );
    }
  }
  say(
    "cut",
    `${short(commit)} from ${short(base)}, carrying ${[...new Set([...carried, ...written.keys()])].length} path(s)`,
  );

  // ── 6 gate, against L's tree ─────────────────────────────────────────────
  process.env.PLAN_NO_FETCH = "1";
  runValidateChanges(gate);
  await runCheckManual(gate);
  runTcsValidate(gate);
  say("gate", "validate:changes, check:manual, tcs:validate pass");
  appendLanded(root, commit);
  console.log(`           ${short(commit)} named in ${LANDED} for the guard`);

  // ── 7 land: main moves, by this run's push or by the relay ───────────────
  if (relay) {
    // The relay reads the commit from the code host, so the branch carries it
    // first: this run's own push, under this run's own lease.
    race(attempt);
    if (
      !push([
        `--force-with-lease=refs/heads/${branch}:${leaseSha}`,
        `${commit}:refs/heads/${branch}`,
      ])
    ) {
      fail(
        `${branch} moved on origin under this run — another run is on this change's branch, and this one is not overwriting it. Read it again and land from there.`,
      );
    }
    leaseSha = commit;
    const answer = await askTheRelay({
      sha: commit,
      kind: reviewedOnly ? "reviewed" : "word",
      artifact: artifact ?? roundArtifactOf(target),
    });
    if (answer.status === 403) {
      fail(`the relay refused: ${answer.body?.reason ?? "no reason given"}`);
    }
    if (answer.status !== 200) return false;
    say("land", `the relay moved ${mainBranch} to ${short(commit)}`);
  } else {
    race(attempt);
    if (!push([`${commit}:refs/heads/${mainBranch}`])) return false;
    say("land", `${short(commit)} pushed to ${mainBranch} as a fast-forward`);
  }

  // ── 8 branch — the drafts sit above the landing ──────────────────────────
  rebaseOnto(commit, artifact ?? `group ${roundArtifactOf(target)}`);
  if (
    !push([
      `--force-with-lease=refs/heads/${branch}:${leaseSha}`,
      `HEAD:refs/heads/${branch}`,
    ])
  ) {
    fail(
      `${branch} moved on origin under this run — another run is on this change's branch, and this one is not overwriting it. Read it again and land from there.`,
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
 * `POST {relay.url}/runs/{token}/land { sha, kind, artifact }` — the relay's
 * own checks before it moves `main` (Q55), through `lib/relay.mjs`, the one
 * client. A relay nobody can reach is not a `main` that moved, so it stops
 * rather than retrying.
 */
async function askTheRelay(payload) {
  try {
    return await relay.land(payload);
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

/** Every path the branch changed against `main`, the landing's own menu. */
function changedPaths(base, tip) {
  const listed = git(["diff", "--name-only", "-z", base, tip]);
  return (listed ?? "").split("\0").filter(Boolean);
}

/**
 * The landing commit, cut from `base` in a temporary index and committed with
 * `commit-tree`: the user's own working tree and index are never touched, so
 * a refusal at the gate leaves them as they were and `L` never existed
 * outside git's object database.
 *
 * `carried` are paths taken from `source` as they stand there; `written` are
 * the texts this landing wrote, hashed straight into the object database. A
 * path `source` no longer holds is removed, so an artifact file the branch
 * deleted lands as a deletion.
 */
function cutFrom(base, source, carried, written, message) {
  const dir = mkdtempSync(join(tmpdir(), "plan-land-index-"));
  scratch.push({ kind: "dir", path: dir });
  const index = join(dir, "index");
  const inIndex = (args) => gitOrDie(args, { GIT_INDEX_FILE: index });
  inIndex(["read-tree", base]);
  for (const path of carried) {
    const listed = inIndex(["ls-tree", source, "--", path]);
    if (listed === "") {
      inIndex(["update-index", "--force-remove", "--", path]);
      continue;
    }
    const [mode, , sha] = listed.split("\t")[0].split(/\s+/);
    inIndex(["update-index", "--add", "--cacheinfo", `${mode},${sha},${path}`]);
  }
  for (const [path, text] of written) {
    const sha = hashObject(text, path);
    inIndex(["update-index", "--add", "--cacheinfo", `100644,${sha},${path}`]);
  }
  const tree = inIndex(["write-tree"]);
  return inIndex(["commit-tree", tree, "-p", base, "-m", message]);
}

/** One text as a blob in the object database, named by the path it will be
 * written at so git's own attributes apply to it. */
function hashObject(text, path) {
  const ran = spawnSync(
    "git",
    ["hash-object", "-w", "--stdin", "--path", path],
    { cwd: root, encoding: "utf8", input: text },
  );
  if (ran.status !== 0) fail(`git hash-object refused:\n${ran.stderr ?? ""}`);
  return ran.stdout.trim();
}

/** A throwaway worktree at one commit: what the gate reads. A linked
 * worktree, never the user's own — the tree the gate judges is the tree that
 * lands, and the tree the round is working in stays where it is. */
function worktreeAt(commit) {
  const dir = join(mkdtempSync(join(tmpdir(), "plan-land-gate-")), "tree");
  gitOrDie(["worktree", "add", "--quiet", "--detach", dir, commit]);
  scratch.push({ kind: "worktree", path: dir });
  return dir;
}

/**
 * The `reviewed:` lines a landing with recommendations owes: one per artifact
 * after the decisions that the branch drafted, in the grammar
 * `lib/reviewed.mjs` writes, read off the tree the landing carries. An
 * artifact drawn from nothing, waived or not written has no line to write and
 * is left out.
 */
async function reviewedAfterDecisions(gate, order, changed) {
  const from = order.indexOf("decisions");
  if (from === -1) return [];
  const read = await readChangeEntry(gate, change).catch((cause) =>
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
    spawnSync("git", ["rebase", "--abort"], { cwd: root, stdio: "ignore" });
    fail(
      `the branch does not rebase on main cleanly:\n${rebased.stderr ?? ""}Resolve it on the branch, then land.`,
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
  spawnSync("git", ["rebase", "--abort"], { cwd: root, stdio: "ignore" });
  fail(
    `${named} landed, and ${branch} does not rebase onto it cleanly:\n${rebased.stderr ?? ""}Resolve it on the branch — main holds the landing already.`,
  );
}

/** What the remote holds for this branch right now, read once, before this
 * run's own rebase touches anything local — the lease every push of the
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

function gitOrDie(args, env) {
  const ran = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
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

/** The temporary indexes and worktrees this run made, removed. A worktree is
 * removed through git, so the admin file beside it goes too. */
function done() {
  for (const { kind, path } of scratch.reverse()) {
    if (kind === "worktree") {
      spawnSync("git", ["worktree", "remove", "--force", path], {
        cwd: root,
        stdio: "ignore",
      });
      rmSync(dirname(path), { force: true, recursive: true });
      continue;
    }
    rmSync(path, { force: true, recursive: true });
  }
  scratch.length = 0;
}

function fail(message) {
  done();
  console.error(message);
  process.exit(1);
}
