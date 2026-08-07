#!/usr/bin/env node
/**
 * Run this before editing a change that engineering is already implementing:
 *
 *   pnpm run plan:preflight add-featured-markets-component
 *
 * This repo is the OpenSpec store for acetrader-predictions, and that repo's apply
 * guidance tells engineers to check off tasks in this store's `tasks.md` and commit
 * that separately from their code. So both sides write the same file from different
 * clones, and neither side has a guard: PM can edit `tasks.md` on top of a stale copy,
 * hit a conflict, resolve it toward their own side, and delete an engineer's
 * checkmarks. Nothing catches that — OpenSpec parses only the `- [ ] X.Y` lines and has
 * no idea what the count should have been, so `validate --strict` still passes and the
 * board just quietly under-reports.
 *
 * This runs three checks — is this a repo, is `tasks.md` already dirty, is the clone
 * behind its upstream — then prints the state you are about to edit on top of, owners
 * and per-group counts, so a later diff is readable.
 *
 * Zero dependencies, and deliberately no `openspec` call: the CLI is not a dependency
 * of this repo, so the checks read `tasks.md` directly.
 *
 * The format the regexes below parse is defined in `docs/governance/task-ownership.md`,
 * which `scripts/plan.mjs` in the application repo implements independently. Change
 * that document first; it also lists what a format change silently invalidates.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

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

function fail(...lines) {
  for (const l of lines) console.error(l);
  process.exitCode = 1;
}

const changeId = process.argv[2];
if (!changeId) {
  fail(
    "Usage: node scripts/openspec/plan-preflight.mjs <change-id>",
    "",
    "Changes in flight:",
  );
  for (const id of changeIds()) console.error(`  ${id}`);
  process.exit();
}

const ids = changeIds();
if (!ids.includes(changeId)) {
  fail(
    `No change in flight named '${changeId}'. Available:`,
    ...ids.map((id) => `  ${id}`),
  );
  process.exit();
}

// Checked first: without a repo there is no upstream and no diff, so every check below
// would pass vacuously and report "safe to edit" on a store that cannot be shared.
if (git(["rev-parse", "--git-dir"]) === null) {
  fail(
    yellow(`The store at ${ROOT} is not a git repository.`),
    "Engineering reads plans by pulling this repo — there is nothing to be stale against yet.",
  );
  process.exit();
}

const rel = join("openspec", "changes", changeId, "tasks.md");
const abs = join(ROOT, rel);

// A `tasks.md` you have already edited makes this check meaningless: the baseline below
// would describe your own work in progress, not what engineering pushed.
if (git(["status", "--porcelain", "--", rel])) {
  fail(
    yellow(`${rel} already has uncommitted edits.`),
    "This is a before-you-edit check — the state it prints would be your own edits, not",
    "what engineering pushed. Commit or stash them, then re-run.",
  );
  process.exit();
}

// `@{u}` otherwise reports whatever your last fetch saw, so checkmarks pushed a minute
// ago are invisible and this passes when it should not. Best-effort — offline is not an
// error. PLAN_NO_FETCH=1 skips it.
if (process.env.PLAN_NO_FETCH !== "1") git(["fetch", "--quiet"]);

const upstream = git([
  "rev-parse",
  "--abbrev-ref",
  "--symbolic-full-name",
  "@{u}",
]);
let unpushed = 0;
if (upstream) {
  const counts = git([
    "rev-list",
    "--left-right",
    "--count",
    `${upstream}...HEAD`,
  ]);
  const [behind, ahead] = (counts || "0\t0").split(/\s+/).map(Number);
  if (behind) {
    fail(
      yellow(`The store is behind ${upstream} by ${behind} commit(s).`),
      "",
      "  git pull --rebase",
      "",
      "Editing tasks.md from here is what causes conflicts, and resolving one toward",
      "your own side silently drops the checkmarks and claims engineering pushed.",
    );
    process.exit();
  }
  unpushed = ahead;
  if (ahead) {
    console.log(
      yellow(
        `${ahead} local commit(s) not yet pushed — engineering cannot see them.`,
      ),
    );
  }
} else {
  console.log(dim("No upstream configured — nothing to be stale against."));
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
  `${green("✓")} Safe to edit ${bold(changeId)}${upstream && !unpushed ? ` — up to date with ${upstream}` : ""}.`,
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
