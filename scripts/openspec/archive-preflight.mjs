#!/usr/bin/env node
/** Verify implementation evidence for the accepted fingerprint before the
 * change directory is moved to history. This command never folds the delta. */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyAcceptance } from "./lib/acceptance.mjs";
import { storeMain, textAt } from "./store-main.mjs";

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

// `--root <dir>` is read here, ahead of everything else below, and dropped
// from `argv` — as `plan-land.mjs` reads its own — so the change id and
// every other flag are read at their usual position whichever side of the
// store it names the flag sits on. This store's own tests run the checkout's
// script against a throwaway store this way, rather than a copy of the tree
// it imports from.
const argv = process.argv.slice(2);
const rootIndex = argv.indexOf("--root");
const ROOT = rootIndex === -1 ? HERE : (argv[rootIndex + 1] ?? HERE);
if (rootIndex !== -1) argv.splice(rootIndex, 2);
const CHANGES = join(ROOT, "openspec", "changes");

const OPEN_TASK = /^\s*-\s*\[ \]\s*(.*)$/;
const MANIFEST_KEY = /^([A-Za-z0-9_]+):/;
/** Every key a record owns. A write drops all of them and appends only what it
 * was told, so a waiver never outlives the record that replaces it. */
const RECORD_KEYS = new Set([
  "tasks_waived",
  "decisions_carried",
  "journeys_copied",
]);
const SHOWN = 10;

function changeIds() {
  if (!existsSync(CHANGES)) return [];
  return readdirSync(CHANGES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "archive")
    .map((entry) => entry.name)
    .sort();
}

/** The unchecked tasks of a task list, in file order. */
function openTasks(text) {
  return text
    .split("\n")
    .map((line) => OPEN_TASK.exec(line)?.[1])
    .filter((task) => task !== undefined);
}

/** Writes each key into the change's manifest as a quoted scalar, dropping
 * every record line the file already holds at column 0. The file is a flat
 * mapping, and a yaml round-trip would reformat every line around these.
 * Returns its store path. */
function writeRecord(changeId, entries) {
  const rel = `openspec/changes/${changeId}/.openspec.yaml`;
  const file = join(CHANGES, changeId, ".openspec.yaml");
  const kept = (existsSync(file) ? readFileSync(file, "utf8") : "")
    .split("\n")
    .filter((line) => !RECORD_KEYS.has(MANIFEST_KEY.exec(line)?.[1]))
    .join("\n")
    .replace(/\n+$/, "");
  const written = Object.entries(entries).map(
    ([key, value]) =>
      `${key}: "${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
  );
  writeFileSync(
    file,
    `${kept === "" ? "" : `${kept}\n`}${written.join("\n")}\n`,
  );
  return rel;
}

function help() {
  console.log(`${bold("pnpm run archive:preflight")} <change-id>`);
  console.log(dim('                             [--tasks-waived "<who, why>"] [--root <dir>]'));
  console.log(dim("  Verifies accepted contract implementation evidence and prints the archive move."));
  console.log(dim("  It does not fold the delta. Checkmarks are read from main; PLAN_NO_FETCH=1 skips fetch."));
  const ids = changeIds();
  console.log("\nChanges in flight");
  if (ids.length === 0) console.log(dim("  none — openspec/changes is empty"));
  for (const id of ids) console.log(`  ${id}`);
}

function fail(...lines) {
  for (const line of lines) console.error(line);
  process.exitCode = 1;
}

const changeId = argv[0];
if (!changeId || changeId === "--help" || changeId === "-h") {
  help();
  process.exit();
}

let tasksWaived = null;
for (let i = 1; i < argv.length; i += 1) {
  if (argv[i] === "--tasks-waived") tasksWaived = argv[++i] ?? null;
  else {
    fail(`Unknown argument: ${argv[i]}`, `Run with ${cyan("--help")}.`);
    process.exit();
  }
}

if (!changeIds().includes(changeId)) {
  fail(
    `No change in flight named '${changeId}'.`,
    `Run ${cyan("pnpm run archive:preflight")} for the list.`,
  );
  process.exit();
}

// ── The plan, as main holds it ──────────────────────────────────────────────
// `pnpm plan` records checkmarks and repository tags on the store's main, so
// both are read there: this checkout can be behind main, or ticked by hand.
const main = storeMain(ROOT);
if (!main) {
  fail(
    yellow(`The store at ${ROOT} has no origin main to read checkmarks on.`),
    "Run `git remote set-head origin --auto`, then re-run.",
  );
  process.exit();
}

// Acceptance and implementation evidence are facts only after their commit is
// published on main. Reading every accepted artifact at the same revision as
// the task list prevents a local acceptance.json or implementation.json from
// making a change archivable before the team can actually build from it.
const acceptanceCheck = verifyAcceptance(ROOT, changeId, {
  requireImplementation: true,
  readFile: (path) => textAt(ROOT, main.commit, path),
});
if (!acceptanceCheck.ok) {
  fail(yellow(`${changeId} cannot archive before implementation verification on ${main.ref}:`));
  for (const error of acceptanceCheck.errors) console.error(`  - ${error}`);
  process.exit();
}
const tasksFile = `openspec/changes/${changeId}/tasks.md`;
const tasks = textAt(ROOT, main.commit, tasksFile);
if (tasks === null && existsSync(join(ROOT, tasksFile))) {
  fail(
    yellow(`${tasksFile} is not on ${main.ref}.`),
    "Nobody can claim or check off a plan main does not hold — merge it first.",
  );
  process.exit();
}

if (tasksWaived !== null && tasksWaived.trim() === "") {
  fail(yellow("--tasks-waived needs the who and the why, in quotes."));
  process.exit();
}
// ── Tasks gate ──────────────────────────────────────────────────────────────
// An open checkbox at archive is work nobody did or a checkmark nobody wrote.
const open = openTasks(tasks ?? "");
if (open.length > 0 && tasksWaived === null) {
  fail(yellow(`${changeId} archives with ${open.length} task(s) unchecked:`));
  for (const task of open.slice(0, SHOWN)) console.error(`  - [ ] ${task}`);
  if (open.length > SHOWN) {
    console.error(dim(`  … and ${open.length - SHOWN} more`));
  }
  fail(
    "",
    "Check off what landed. Archiving over the rest is an owner's call, made",
    "out loud, on the same command:",
    "",
    `  ${cyan('--tasks-waived "<who waived it, why>"')}`,
  );
  process.exit();
}

// ── Clear ─────────────────────────────────────────────────────────────────
console.log(`${green("✓")} ${bold(changeId)} is clear to archive.`);
console.log(`\nAccepted contract ${acceptanceCheck.fingerprint} matches the verified implementation.`);
console.log(`\nArchive the change directory without folding it again:\n`);
console.log(`  ${cyan(`git -C "${ROOT}" mv openspec/changes/${changeId} openspec/changes/archive/<YYYY-MM-DD>-${changeId}`)}`);
console.log(`  ${cyan(`git -C "${ROOT}" commit -m "Archive ${changeId} after implementation verification"`)}`);
