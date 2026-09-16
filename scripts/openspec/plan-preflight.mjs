#!/usr/bin/env node
/**
 * Run this before editing a change that engineering is already implementing:
 *
 *   pnpm run plan:preflight reinstate-shared-ui-package
 *
 * This repo is the OpenSpec store for grade10. Engineers there claim groups and check
 * off tasks with `pnpm plan`, which commits to this store's `main`, while whoever edits
 * `tasks.md` here — the engineer who planned the delivery, restructuring a group — does
 * it in a clone. That edit has no guard: it can land on a stale copy, hit a conflict,
 * resolve toward its own side, and delete another engineer's claims and checkmarks.
 * Nothing catches that — OpenSpec parses only the `- [ ] X.Y` lines and has
 * no idea what the count should have been, so `validate --strict` still passes and the
 * board just quietly under-reports.
 *
 * This runs three checks — is this a repo, is `tasks.md` already dirty, is it behind
 * the store's main — then prints the state you are about to edit on top of, owners
 * and per-group counts, so a later diff is readable. Run it with no change id, or
 * with `--help`, for those checks and the changes in flight.
 *
 * Zero dependencies, and deliberately no `openspec` call: the CLI is not a dependency
 * of this repo, so the checks read `tasks.md` directly.
 *
 * The format the regexes below parse is defined in `docs/governance/task-ownership.md`,
 * which `scripts/openspec/plan.mjs` in the application repo implements independently.
 * Change that document first; it also lists what a format change silently invalidates.
 * This file follows that script's shape — the same color helpers, the same help
 * layout — because the two are read as one tool from opposite ends.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { git as gitIn, storeMain, textAt } from "./store-main.mjs";

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

/** Pad to a visible width — ANSI escapes take columns in `padEnd` but not on screen. */
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching the ESC of an ANSI sequence is the point
const ANSI = /\x1b\[\d+m/g;
const padVisible = (s, width) =>
  s + " ".repeat(Math.max(0, width - s.replace(ANSI, "").length));

// The store is this repo, so its root is two directories up from `scripts/openspec/` —
// no registry lookup and no dependence on the cwd you happen to run this from.
const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

const git = (args) => gitIn(ROOT, args);

/** Task groups for one change, with owner and per-group progress. */
function readGroups(text) {
  const groups = [];
  for (const line of text.split("\n")) {
    const heading = line.match(/^##\s+(\d+)\.\s*(.+?)\s*$/);
    if (heading) {
      const [, num, rest] = heading;
      const owner = rest.match(/\(owner:\s*@?([\w.-]+)\)/i);
      const handle = owner ? owner[1].toLowerCase() : null;
      groups.push({
        num,
        title: rest.replace(/\s*\(owner:[^)]*\)\s*$/i, ""),
        owner: handle && handle !== "unassigned" ? handle : null,
        tasks: [],
      });
      continue;
    }
    const task = line.match(/^\s*-\s*\[([ xX])\]\s*(\S+)\s+(.*)$/);
    if (task && groups.length) {
      groups
        .at(-1)
        .tasks.push({ done: task[1].toLowerCase() === "x", id: task[2] });
    }
  }
  return groups;
}

function changeIds() {
  const dir = join(ROOT, "openspec", "changes");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "archive")
    .map((e) => e.name)
    .sort();
}

/**
 * Every change in flight with its task counts as `main` records them — the list
 * `help` prints. Read from this checkout only where the clone has no main.
 */
function changeSummaries(main) {
  const onMain =
    main &&
    new Set(
      (
        git([
          "ls-tree",
          "-d",
          "--name-only",
          `${main.commit}:openspec/changes`,
        ]) ?? ""
      ).split("\n"),
    );
  return changeIds().map((id) => {
    const dir = `openspec/changes/${id}`;
    if (onMain && !onMain.has(id)) return { id, state: `not on ${main.ref}` };
    const abs = join(ROOT, dir, "tasks.md");
    const text = main
      ? textAt(ROOT, main.commit, `${dir}/tasks.md`)
      : existsSync(abs)
        ? readFileSync(abs, "utf8")
        : null;
    if (text === null) return { id, state: "no tasks.md yet" };
    const tasks = readGroups(text).flatMap((g) => g.tasks);
    return {
      id,
      state: `${tasks.filter((t) => t.done).length}/${tasks.length} tasks`,
    };
  });
}

/**
 * The three checks, in the order they run — the same shape `pnpm plan help` prints
 * in the application repo, which is the other half of this convention and the one
 * an engineer sees far more often.
 *
 * This script has one command, so the table describes what a run does rather than
 * verbs you can pick between; the argument is always a change id.
 */
const CHECKS = [
  ["is a repo", "the store is a git repository, so it has a main at all"],
  ["clean", "tasks.md has no uncommitted edits of your own"],
  ["current", "tasks.md is not behind the store's main, where claims land"],
];

function help() {
  const width = Math.max(...CHECKS.map(([name]) => name.length));
  console.log(
    `${bold("pnpm plan:preflight")} <change-id>   ${dim("before editing a plan engineering is implementing")}`,
  );
  console.log(
    dim(
      "  Refuses an edit that would land on a stale copy, then prints the owners and",
    ),
  );
  console.log(
    dim(
      "  per-group counts you are about to edit on top of, so a later diff reads.",
    ),
  );

  console.log("\nChecks");
  for (const [name, blurb] of CHECKS)
    console.log(`  ${padVisible(cyan(name), width + 2)}${dim(blurb)}`);

  const main = storeMain(ROOT, { fetch: false });
  console.log(
    `\nChanges in flight${main ? `, counted on ${main.ref}` : " — no origin main, counted in this checkout"}`,
  );
  const changes = changeSummaries(main);
  if (!changes.length) {
    console.log(dim("  none — openspec/changes is empty"));
  } else {
    const idWidth = Math.max(...changes.map((ch) => ch.id.length));
    for (const ch of changes)
      console.log(`  ${ch.id.padEnd(idWidth + 2)}${dim(ch.state)}`);
  }

  console.log(`\n${dim("Store")}  ${ROOT}`);
  console.log(
    dim("       this repo — engineering plans against it from grade10"),
  );
  console.log(dim("       PLAN_NO_FETCH=1 skips the fetch this runs first"));
}

function fail(...lines) {
  for (const l of lines) console.error(l);
  process.exitCode = 1;
}

// No change id is not an error here: there is one command, so the help and the list
// of changes in flight are what you wanted. Only a name that does not exist fails.
const changeId = process.argv[2];
if (!changeId || changeId === "--help" || changeId === "-h") {
  help();
  process.exit();
}

if (!changeIds().includes(changeId)) {
  fail(
    `No change in flight named '${changeId}'.`,
    `Run ${cyan("pnpm plan:preflight")} for the list.`,
  );
  process.exit();
}

// Checked first: without a repo there is no main and no diff, so every check below
// would pass vacuously and report "safe to edit" on a store that cannot be shared.
if (git(["rev-parse", "--git-dir"]) === null) {
  fail(
    yellow(`The store at ${ROOT} is not a git repository.`),
    "Engineering reads plans at this repo's main — there is nothing to be stale against yet.",
  );
  process.exit();
}

const rel = join("openspec", "changes", changeId, "tasks.md");
const abs = join(ROOT, rel);

// A `tasks.md` you have already edited makes this check meaningless: the baseline below
// would describe your own work in progress, not what engineering recorded.
if (git(["status", "--porcelain", "--", rel])) {
  fail(
    yellow(`${rel} already has uncommitted edits.`),
    "This is a before-you-edit check — the state it prints would be your own edits, not",
    "what engineering recorded. Commit or stash them, then re-run.",
  );
  process.exit();
}

// Claims and checkmarks are commits on the store's main, whatever branch this clone is
// on, so that is what tasks.md has to be current with. Without main every check below
// would pass vacuously, as it would without a repo.
const main = storeMain(ROOT)?.ref;
if (!main) {
  fail(
    yellow(`The store at ${ROOT} has no origin main to check claims against.`),
    "Run `git remote set-head origin --auto`, then re-run.",
  );
  process.exit();
}

const commitsTouching = (range) =>
  Number(git(["rev-list", "--count", range, "--", rel]) || 0);
const behind = commitsTouching(`HEAD..${main}`);
if (behind) {
  fail(
    yellow(`${main} has ${behind} commit(s) to ${rel} this clone does not.`),
    "",
    `  git rebase ${main}`,
    "",
    "Editing tasks.md from here is what causes conflicts, and resolving one toward",
    `your own side silently drops the claims and checkmarks engineering recorded on ${main}.`,
  );
  process.exit();
}
const unmerged = commitsTouching(`${main}..HEAD`);
if (unmerged) {
  console.log(
    yellow(
      `${unmerged} commit(s) to ${rel} not yet on ${main} — engineering cannot see them.`,
    ),
  );
}

if (!existsSync(abs)) {
  console.log(`${green("✓")} Safe to edit ${bold(changeId)}.`);
  console.log(
    dim(`${rel} does not exist yet — nobody is implementing this change.`),
  );
  process.exit();
}

const groups = readGroups(readFileSync(abs, "utf8"));
const total = groups.reduce((n, g) => n + g.tasks.length, 0);
const doneTotal = groups.reduce(
  (n, g) => n + g.tasks.filter((t) => t.done).length,
  0,
);

console.log(
  `${green("✓")} Safe to edit ${bold(changeId)}${unmerged ? "" : ` — up to date with ${main}`}.`,
);
console.log(`\n${bold(changeId)}  ${dim(`${doneTotal}/${total} tasks`)}\n`);

const width = Math.max(0, ...groups.map((g) => g.title.length));
for (const g of groups) {
  const gd = g.tasks.filter((t) => t.done).length;
  const owner = g.owner ? `@${g.owner}` : dim("unassigned");
  const state =
    gd === 0
      ? ""
      : gd === g.tasks.length
        ? green("  done")
        : cyan("  in progress");
  console.log(
    `  ${g.num}. ${g.title.padEnd(width)}  ${padVisible(owner, 12)}  ${String(gd).padStart(2)}/${g.tasks.length}${state}`,
  );
}

// A group of its own for the archive hand-off is what `planning-dev` now tells
// planners not to write. The routine copy is already mechanical —
// `archive:preflight` refuses the archive while the feature set and the journeys
// are uncarried — and the box cannot be ticked when the work is, since it waits
// on a deploy. No change in flight carries one any more; this stays advisory
// rather than a refusal, so a stray group is flagged and not blocked.
const handOff = groups.filter((g) => /\barchive\b/i.test(g.title));
if (handOff.length) {
  console.log(
    `\n${yellow("Archive hand-off:")} group(s) ${handOff.map((g) => g.num).join(", ")} — the routine copy is the preflight's job.`,
  );
  console.log(
    dim(
      "Keep a task only for what `archive:preflight` cannot check: sequencing behind",
    ),
  );
  console.log(
    dim(
      "another change, a capability with no durable spec yet, a README row or shelf.",
    ),
  );
  console.log(dim("The rule is in `.claude/skills/planning-dev/SKILL.md`."));
}

// Renumbering is the hazard git cannot warn about: a claim is recorded against a group
// number and a checkmark against a task id, so renumbering silently points someone's
// claim at different work while every id still validates.
const live = groups.filter((g) => g.owner || g.tasks.some((t) => t.done));
if (live.length) {
  console.log(
    `\n${yellow("In flight:")} ${live.map((g) => g.num).join(", ")} — do not renumber these groups or their tasks.`,
  );
  console.log(
    dim(
      "Append tasks to the end of a group, or add a new group. To split one, say so in the commit.",
    ),
  );
  console.log(
    dim(
      "Then commit and push promptly — the longer you hold tasks.md, the more there is to conflict.",
    ),
  );
} else {
  console.log(
    `\n${dim("Nothing claimed or checked off — this change is yours to restructure freely.")}`,
  );
}
