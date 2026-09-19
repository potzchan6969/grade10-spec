#!/usr/bin/env node
/**
 * Run this before `openspec archive <change-id>`:
 *
 *   pnpm run archive:preflight <change-id> --deployed-at <sha> --deployed-env <env>
 *   pnpm run archive:preflight <change-id> --deploy-waived "<who waived it, why>"
 *
 * The application repository runs this through `pnpm plan shipped <change-id>`,
 * which finds the deployed sha and commits the record. Run it by hand only to
 * write a waiver.
 *
 * The archive has five gates, and they used to be prose in a skill file —
 * which made the honest path and the fast path differ by forty minutes with
 * only one leaving a record. This makes them mechanical:
 *
 * DEPLOY   A change merged is not a change shipped; merging deploys nothing.
 *          This store cannot see the application repo's deploy runs, so the
 *          gate demands the evidence instead of trusting silence: the deployed
 *          sha that contains the change's merge commit and the environment it
 *          ran in, or an explicit waiver naming who and why.
 *
 * TASKS    An open checkbox at archive is work nobody did or a checkmark
 *          nobody wrote. Either way the record says so: check them off, or
 *          name the decision with `--tasks-waived`.
 *
 * BEHIND   Nothing is built on an artifact that is behind what it was drawn
 *          from, and the fold is no exception: this reads the change through
 *          the store's own reader — pages included, so a `reviewed:` id
 *          hashes what it always hashes — and compares it with `behindOf`,
 *          the same way `check:manual` and the manual do, refusing while
 *          anything is and naming what changed before it. Not waivable — the
 *          round's re-read is what clears it. Skipped, not refused, on a
 *          shallow clone: it cannot date a commit outside its history.
 *
 * CARRY    `openspec archive` folds `## Requirements` and nothing else, so a
 *          delta's `## Purpose`, its `## Feature set`, its `user-journeys.md`
 *          and its suites — and every `-US-` id in them — die with the change
 *          unless someone copies them into the durable capability. This checks
 *          whether they were carried, and refuses while they are not.
 *          `rounds.md` is carried too, but sideways: it is folded into no
 *          capability and archives with the change, so nothing here can check
 *          it before the archive exists — `pnpm check:manual`'s `round` rule
 *          reads the archived copy afterwards and refuses one that left it
 *          behind.
 *          `--journeys-copied` acknowledges a delta whose capability has no
 *          durable spec yet: the fold creates it, so the copy can only happen
 *          right after — the flag is a promise, and the sections stay on
 *          `pnpm check:manual`'s list.
 *
 * DECIDE   `decisions.md` is change-local: it archives with the change and is
 *          folded nowhere. So a rejected option recorded there is readable
 *          afterwards only under `openspec/changes/archive/`, which the blind
 *          suite pass is forbidden to read — the same shape as dropping a
 *          suite's `## Settled`, and the same cost: the question is asked
 *          again next quarter, answered the other way, and the record that
 *          would have caught it sits in the one tree nothing may open.
 *          Whatever still matters goes onto the capability's PRD, in its
 *          `Product decisions` block, which is durable and which the blind
 *          pass already reads. This gate asks the owner to say that happened:
 *          `--decisions-carried "<what went where>"`, or the same flag with
 *          `none` where nothing outlived the change.
 *
 *          A copy that did land is read for the four things only archive can
 *          get wrong: a written `## Purpose` replaces the durable one whole, a
 *          removed journey leaves a `## Retired` tombstone instead of vanishing
 *          (archived suites still trace its id), a carried `## Reconciliation`
 *          has its scenario ids stripped, and `## Settled` travels with the
 *          suite — drop it and every later blind pass raises the same refused
 *          reading again, with nobody left who remembers refusing it. None of
 *          those is a promise `--journeys-copied` can defer: the files are all
 *          here, so they are fixed now.
 *
 * A clear run writes what it was told into the change's `.openspec.yaml`, so
 * the record archives with the change and `pnpm check:manual` can read it back.
 *
 * No `openspec` call — every other gate reads the change's own files, and its
 * checkmarks on the store's main, where `plan-preflight.mjs` reads claims
 * too. BEHIND is the one gate that reads the store's own change reader,
 * because a second reading of what is behind would drift from the one
 * `check:manual` and the manual already carry.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { behindLabelOf } from "../../tools/manual/src/api/stage-view.ts";
import { behindOf } from "../../tools/manual/src/api/stages.ts";
import { readChangeEntry } from "./lib/store-read.mjs";
import { git, storeMain, textAt } from "./store-main.mjs";

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

const DOOMED = ["Feature set"];
const US_ID = /[a-z0-9][a-z0-9-]*-US-\d+/g;
const SC_ID = /[a-z0-9][a-z0-9-]*-SC-\d+/g;
// The anchor line as `read-specs.mts` reads it: anywhere in the scenario's
// body, bulleted or not, so this gate and the checker agree on what counts.
const SERVES = /^\s*(?:[-*]\s+)?\*\*Serves:\*\*\s*\S/m;
const SCENARIO_HEADING = /^####\s+Scenario:\s+([a-z0-9][a-z0-9-]*-SC-\d+)\b/;
const OPEN_TASK = /^\s*-\s*\[ \]\s*(.*)$/;
/** A task group heading, and the repository tag `task-ownership.md` puts at the
 * end of it: `## 3. Store prose (grade10-spec)`. An owner tag is `(owner: …)`
 * and is not a repository. */
const GROUP_HEADING = /^##\s+\d+\.\s*(.+?)\s*$/;
const REPO_TAG = /\(([^()@]+)\)\s*$/;
const STORE_GROUP = "grade10-spec";
const MANIFEST_KEY = /^([A-Za-z0-9_]+):/;
/** Every key a record owns. A write drops all of them and appends only what it
 * was told, so a waiver never outlives the record that replaces it. */
const RECORD_KEYS = new Set([
  "deployed_at",
  "deployed_env",
  "deploy_waived",
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

/** Every `specs/**\/spec.md` of the change, with its capability path. */
function deltaFiles(changeId) {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "spec.md") found.push(path);
    }
  };
  const specs = join(CHANGES, changeId, "specs");
  if (existsSync(specs)) walk(specs);
  return found.map((file) => ({
    file,
    capability: dirname(file)
      .slice(specs.length + 1)
      .replaceAll("\\", "/"),
  }));
}

/** The `## <name>` sections of one delta the fold would discard, with the
 * `-US-` ids they issue. Sections end at the next `## ` heading. */
function doomedSections(text) {
  const lines = text.split("\n");
  const found = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = DOOMED.includes(heading[1])
        ? { name: heading[1], ids: new Set() }
        : null;
      if (current) found.push(current);
      continue;
    }
    if (!current) continue;
    for (const id of line.match(US_ID) ?? []) current.ids.add(id);
  }
  return found;
}

/** The scenarios one delta issues that name no anchor. `anchorless` is a
 * failure on the durable store and the fold is what moves a scenario there, so
 * a delta nothing refuses here breaks `pnpm check:manual` the moment it lands.
 * The anchor belongs in the delta, where the journeys that resolve it are
 * still sitting beside it. A scenario carrying no permanent id is not one the
 * rule counts, so it is not one this counts either. */
function anchorlessScenarios(text) {
  const lines = text.split("\n");
  const found = [];
  let current = null;
  const close = () => {
    if (current && !SERVES.test(current.body.join("\n")))
      found.push(current.id);
  };
  for (const line of lines) {
    const heading = line.match(SCENARIO_HEADING);
    if (heading) {
      close();
      current = { id: heading[1], body: [] };
      continue;
    }
    if (/^#{2,4}\s/.test(line)) {
      close();
      current = null;
      continue;
    }
    if (current) current.body.push(line);
  }
  close();
  return found;
}

/** The body of one `## <name>` section, trimmed, or null when the file has no
 * such heading. Sections end at the next `## ` heading, so an empty string
 * means the heading is there and says nothing — which is not the same answer. */
function sectionBody(text, name) {
  const out = [];
  let inside = false;
  for (const line of text.split("\n")) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (inside) break;
      inside = heading[1] === name;
      continue;
    }
    if (inside) out.push(line);
  }
  return inside ? out.join("\n").trim() : null;
}

/** The bullet lines of a section body, continuations folded in and whitespace
 * collapsed, so a line that was rewrapped on the way across still counts as
 * the same line. */
function bullets(body) {
  const found = [];
  for (const line of (body ?? "").split("\n")) {
    if (/^\s*[-*]\s+/.test(line)) found.push(line.replace(/^\s*[-*]\s+/, ""));
    else if (found.length > 0 && line.trim() !== "" && !line.startsWith("#")) {
      found[found.length - 1] += ` ${line.trim()}`;
    }
  }
  return found.map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
}

/** Whether every task group of a task list lands in this store. Such a change
 * deploys nothing, so there is no run to point at and no waiver owed — the same
 * exemption `check:manual`'s `archived` rule already grants, which this script
 * did not, so a store-only change could only be archived by waiving a deploy it
 * never had. A list with no tagged group is not store-only: an untagged group
 * is a group nobody said where it lands. */
function storeOnly(text) {
  const groups = text
    .split("\n")
    .map((line) => GROUP_HEADING.exec(line)?.[1])
    .filter((title) => title !== undefined)
    .map((title) => REPO_TAG.exec(title)?.[1].trim() ?? "");
  return groups.length > 0 && groups.every((repo) => repo === STORE_GROUP);
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
  console.log(
    `${bold("pnpm run archive:preflight")} <change-id> --deployed-at <sha> --deployed-env <env> | --deploy-waived "<why>"`,
  );
  console.log(
    dim(
      '                             [--tasks-waived "<who, why>"] [--journeys-copied]',
      '                             [--decisions-carried "<what went where, or none>"] [--root <dir>]',
    ),
  );
  console.log(
    dim("  The archive's five gates, mechanical: proof of deploy, every task"),
  );
  console.log(
    dim("  checked off, nothing behind what it was drawn from, the decisions"),
  );
  console.log(
    dim(
      "  that outlive the change put on the PRD, and the purpose / feature set /",
    ),
  );
  console.log(dim("  journeys / suites copy"));
  console.log(
    dim(
      "  the fold would discard, done and done right. A clear run writes the",
    ),
  );
  console.log(
    dim("  record into the change's .openspec.yaml and prints the commit."),
  );
  console.log(
    dim(
      "  Checkmarks are read on the store's main, fetched first; PLAN_NO_FETCH=1 skips the fetch.",
    ),
  );
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

let deployedAt = null;
let deployedEnv = null;
let deployWaived = null;
let tasksWaived = null;
let journeysCopied = false;
let decisionsCarried = null;
for (let i = 1; i < argv.length; i += 1) {
  if (argv[i] === "--deployed-at") deployedAt = argv[++i] ?? null;
  else if (argv[i] === "--deployed-env") deployedEnv = argv[++i] ?? null;
  else if (argv[i] === "--deploy-waived") deployWaived = argv[++i] ?? null;
  else if (argv[i] === "--tasks-waived") tasksWaived = argv[++i] ?? null;
  else if (argv[i] === "--journeys-copied") journeysCopied = true;
  else if (argv[i] === "--decisions-carried")
    decisionsCarried = argv[++i] ?? null;
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
// both are read there: this checkout can be behind main, or ticked by hand
// where main is not. Read before the deploy gate, because the tags say whether
// a deploy is owed at all.
const main = storeMain(ROOT);
if (!main) {
  fail(
    yellow(`The store at ${ROOT} has no origin main to read checkmarks on.`),
    "Run `git remote set-head origin --auto`, then re-run.",
  );
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

// ── Deploy gate ─────────────────────────────────────────────────────────────
// The application repo holds the answer (`gh run list --workflow=deploy.yml`
// and `git merge-base --is-ancestor`, per its archive-change skill); this
// store only refuses to fold without it being stated.
if (deployedAt !== null && deployWaived !== null) {
  fail(
    yellow("Pass --deployed-at or --deploy-waived, not both."),
    "One says the change shipped; the other says who decided to archive without proof.",
  );
  process.exit();
}
if (deployedAt === null && deployWaived === null && !storeOnly(tasks ?? "")) {
  fail(
    yellow(`No deploy evidence for ${changeId}.`),
    "A change merged is not a change shipped — merging deploys nothing. The",
    "application repository finds the deploy that contains the merge commit and",
    "runs this for you:",
    "",
    `  ${cyan(`pnpm plan shipped ${changeId}`)}`,
    "",
    "Archiving anyway is an owner's call, made out loud:",
    "",
    `  ${cyan(`pnpm run archive:preflight ${changeId} --deploy-waived "<who waived it, why>"`)}`,
  );
  process.exit();
}
if (deployedAt !== null && !/^[0-9a-f]{7,40}$/i.test(deployedAt)) {
  fail(
    yellow(`--deployed-at ${deployedAt} is not a commit sha.`),
    "Name the deployed sha itself, so the archive commit records something checkable.",
  );
  process.exit();
}
if (deployWaived !== null && deployWaived.trim() === "") {
  fail(yellow("--deploy-waived needs the who and the why, in quotes."));
  process.exit();
}
if (
  deployedAt !== null &&
  (deployedEnv === null || deployedEnv.trim() === "")
) {
  fail(
    yellow("--deployed-at needs --deployed-env."),
    "A staging deploy and a production one are different archives, and the record",
    "is read long after the run is gone:",
    "",
    `  ${cyan(`pnpm run archive:preflight ${changeId} --deployed-at ${deployedAt} --deployed-env production`)}`,
  );
  process.exit();
}
if (deployedAt === null && deployedEnv !== null) {
  fail(yellow("--deployed-env names an environment for no sha."));
  process.exit();
}
if (tasksWaived !== null && tasksWaived.trim() === "") {
  fail(yellow("--tasks-waived needs the who and the why, in quotes."));
  process.exit();
}
if (decisionsCarried !== null && decisionsCarried.trim() === "") {
  fail(
    yellow("--decisions-carried needs what went where, in quotes, or `none`."),
  );
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

// ── Behind gate ─────────────────────────────────────────────────────────────
// Nothing is built on a behind artifact, and the fold is no exception: an
// artifact drawn from something that has since changed is read from a
// requirement nobody has read again. `readChangeEntry` is the store's own
// change reader — pages included, so a linked section's `reviewed:` id
// hashes the same text it always hashes — and `behindOf` is the same pure
// comparison over its reading that `check:manual`, the manual and the round
// all read. A shallow clone cannot date a commit outside its history, so the
// read is skipped and said so rather than refused on the clone's account;
// run this on a full checkout to have it checked.
if (git(ROOT, ["rev-parse", "--is-shallow-repository"]) === "true") {
  console.log(
    yellow(
      `Freshness not checked — ${ROOT} is a shallow clone. Run this on a full checkout to have it checked.`,
    ),
  );
} else {
  const { entry, artifacts } = await readChangeEntry(ROOT, changeId);
  const behind = behindOf(entry, artifacts);
  if (behind.length > 0) {
    fail(
      yellow(`${changeId} archives with ${behind.length} artifact(s) behind:`),
    );
    for (const one of behind) {
      console.error(`  ${one.artifact} — ${behindLabelOf(one)}`);
    }
    fail(
      "",
      "Nothing is built on a behind artifact, and the fold is no exception.",
      "Read it again — the round's re-read writes the record line that clears",
      "this — then re-run this.",
    );
    process.exit();
  }
}

// ── Decide gate ─────────────────────────────────────────────────────────────
// `decisions.md` is folded nowhere, so a rejected option recorded only there
// survives archive in a tree the blind suite pass may not read. Whatever still
// matters belongs on the capability's PRD, in `Product decisions`. The store
// cannot judge which rows those are — the owner can, and this asks them to say
// so rather than to remember.
const decisionsFile = `openspec/changes/${changeId}/decisions.md`;
const decisions = existsSync(join(ROOT, decisionsFile))
  ? readFileSync(join(ROOT, decisionsFile), "utf8")
  : null;
const rows =
  decisions === null
    ? []
    : (sectionBody(decisions, "Decisions") ?? "")
        .split("\n")
        .filter((line) => /^\s*\|/.test(line) && !/^\s*\|\s*-{2,}/.test(line))
        .slice(1);
if (rows.length > 0 && decisionsCarried === null) {
  fail(
    yellow(
      `${changeId} records ${rows.length} decision(s) that the fold carries nowhere:`,
    ),
  );
  for (const row of rows.slice(0, SHOWN)) {
    console.error(`  ${row.trim().slice(0, 100)}`);
  }
  if (rows.length > SHOWN) {
    console.error(dim(`  … and ${rows.length - SHOWN} more`));
  }
  fail(
    "",
    "A rejected option readable only under archive/ is one the blind pass may",
    "not read, so the question comes back answered the other way. Put what",
    "still matters in the capability's `Product decisions` block, then say so:",
    "",
    `  ${cyan('--decisions-carried "<what went where>"')}`,
    `  ${cyan("--decisions-carried none")}   nothing outlived the change`,
  );
  process.exit();
}

// ── Carry gate ──────────────────────────────────────────────────────────────
// Two lists, because they are two different failures. `uncarried` is a copy
// that has not happened, and against a capability the fold has yet to create
// it cannot happen until after — `--journeys-copied` defers those. `wrong` is
// a copy that landed and landed wrong: every file involved is already here, so
// no flag defers it.
const uncarried = [];
const wrong = [];
const anchorless = [];
const suitesSeen = new Set();

for (const { file, capability } of deltaFiles(changeId)) {
  const delta = readFileSync(file, "utf8");

  const unanchored = anchorlessScenarios(delta);
  if (unanchored.length > 0) anchorless.push({ capability, ids: unanchored });
  const durableFile = join(ROOT, "openspec", "specs", capability, "spec.md");
  const durable = existsSync(durableFile)
    ? readFileSync(durableFile, "utf8")
    : null;

  for (const section of doomedSections(delta)) {
    const carried =
      durable !== null &&
      durable.match(new RegExp(`^##\\s+${section.name}\\s*$`, "m")) !== null &&
      [...section.ids].every((id) => durable.includes(id));
    if (!carried) uncarried.push({ capability, section, durable });
  }

  // A written `## Purpose` replaces the durable one whole. The durable file
  // still holding a different one means the fold took the requirements and
  // left behind the sentence that says what the capability is for.
  const purpose = sectionBody(delta, "Purpose");
  if (
    purpose !== null &&
    purpose !== "" &&
    durable !== null &&
    sectionBody(durable, "Purpose") !== purpose
  ) {
    wrong.push({
      capability,
      what: "`## Purpose` — the change wrote one and the durable spec still holds a different one",
    });
  }

  // The journeys are their own file on both sides, so the fold never touches
  // them: the change's user-journeys.md has to be copied across whole.
  const journeysFile = file.replace(/spec\.md$/, "user-journeys.md");
  const durableJourneys = join(
    ROOT,
    "openspec",
    "specs",
    capability,
    "user-journeys.md",
  );
  const landed = existsSync(durableJourneys)
    ? readFileSync(durableJourneys, "utf8")
    : null;

  if (existsSync(journeysFile)) {
    const journeys = readFileSync(journeysFile, "utf8");
    const ids = new Set(journeys.match(US_ID) ?? []);
    const carried =
      landed !== null && [...ids].every((id) => landed.includes(id));
    if (!carried) {
      uncarried.push({
        capability,
        section: { name: "User journeys", ids },
        durable: landed,
      });
    }

    // A removed journey keeps its id forever — archived suites still carry
    // `**Trace:** <id>`, and nothing recovers that join once the journey is
    // gone. Archive leaves a one-line tombstone instead of deleting it.
    const removed = new Set(
      sectionBody(journeys, "REMOVED User journeys")?.match(US_ID) ?? [],
    );
    const retired = landed === null ? null : sectionBody(landed, "Retired");
    for (const id of removed) {
      if (landed === null) continue;
      if (retired === null || !retired.includes(id)) {
        wrong.push({
          capability,
          what: `\`${id}\` is removed and leaves no \`## Retired\` tombstone — archived suites still trace that id`,
        });
      } else if (new RegExp(`^###\\s+${id}\\b`, "m").test(landed)) {
        wrong.push({
          capability,
          what: `\`${id}\` is tombstoned under \`## Retired\` and its journey is still written above it`,
        });
      }
    }
  }

  // The suites travel beside the spec — `feature-tcs.md` into the capability,
  // `domain-tcs.md` into the domain above it. Every capability under a domain
  // reaches the same domain suite, so it is read once.
  for (const [name, dir] of [
    ["feature-tcs.md", capability],
    ["domain-tcs.md", dirname(capability)],
  ]) {
    const source = join(CHANGES, changeId, "specs", dir, name);
    if (!existsSync(source) || suitesSeen.has(source)) continue;
    suitesSeen.add(source);

    const target = join(ROOT, "openspec", "specs", dir, name);
    if (!existsSync(target)) {
      uncarried.push({
        capability: dir,
        section: { name, ids: new Set() },
        durable: null,
      });
      continue;
    }
    const arrived = readFileSync(target, "utf8");

    // Scenario ids belong to the change. A `## Reconciliation` that keeps
    // them past the fold points at a change that is about to stop existing.
    const ids = [
      ...new Set(sectionBody(arrived, "Reconciliation")?.match(SC_ID) ?? []),
    ];
    if (ids.length > 0) {
      wrong.push({
        capability: dir,
        what: `${name} carries \`## Reconciliation\` with ${ids.length} scenario id(s) not stripped (${ids.slice(0, 3).join(", ")})`,
      });
    }

    // `## Settled` is a legal part of the next blind pass's isolated input:
    // what earlier readings asked and had answered. Left behind, the same
    // refused reading is raised by every future run.
    const kept = new Set(bullets(sectionBody(arrived, "Settled")));
    const owed = bullets(
      sectionBody(readFileSync(source, "utf8"), "Settled"),
    ).filter((line) => !kept.has(line));
    if (owed.length > 0) {
      wrong.push({
        capability: dir,
        what: `${name} drops ${owed.length} \`## Settled\` line(s) — the next blind pass raises them again: "${owed[0].slice(0, 60)}"`,
      });
    }
  }
}

if (wrong.length > 0) {
  fail(
    yellow(
      `${changeId} carries ${wrong.length} section(s) across incorrectly:`,
    ),
  );
  for (const { capability, what } of wrong) {
    console.error(`  ${capability} — ${what}`);
  }
  fail(
    "",
    "The copy landed; what archive owes it did not. Every file involved is",
    "still here, so none of this is waivable — the fold is what makes it",
    "unrecoverable. Fix them, then re-run this.",
  );
  process.exit();
}

if (anchorless.length > 0) {
  const total = anchorless.reduce((sum, one) => sum + one.ids.length, 0);
  fail(
    yellow(
      `The fold would add ${total} scenario(s) carrying no \`**Serves:**\` line:`,
    ),
  );
  for (const { capability, ids } of anchorless) {
    const shown = ids.slice(0, SHOWN).join(", ");
    const more = ids.length > SHOWN ? `, … and ${ids.length - SHOWN} more` : "";
    console.error(`  ${capability} — ${shown}${more}`);
  }
  fail(
    "",
    "A scenario names the journey or feature set group it serves, and",
    "`anchorless` fails on the durable store. Nothing refuses it inside a",
    "change, so the break lands on whoever folds it. Anchor them here, where",
    "the journeys that resolve them are still beside the delta, then re-run",
    "this.",
  );
  process.exit();
}

if (uncarried.length > 0 && !journeysCopied) {
  fail(
    yellow(
      `The fold would discard ${uncarried.length} section(s) of ${changeId}:`,
    ),
  );
  for (const { capability, section, durable } of uncarried) {
    const ids = [...section.ids];
    console.error(
      `  ${capability} — \`${section.name}\`${ids.length ? ` (${ids.join(", ")})` : ""}${durable === null ? dim("  · nothing durable yet") : ""}`,
    );
  }
  fail(
    "",
    "`openspec archive` folds `## Requirements` and nothing else — the purpose,",
    "the feature set, the journeys file, the suites, and every `-US-` id in them",
    "die with the change unless they are copied across to the durable",
    "capability. Copy them, then re-run this.",
    "",
    "A capability with no durable spec yet can only receive the copy after the",
    `fold creates it. Acknowledge that with ${cyan("--journeys-copied")} — the sections`,
    "stay on `pnpm check:manual`'s warning list until the copy actually lands.",
  );
  process.exit();
}

// ── Clear ───────────────────────────────────────────────────────────────────
console.log(`${green("✓")} ${bold(changeId)} is clear to archive.`);
if (uncarried.length > 0) {
  console.log(
    yellow(
      `  ${uncarried.length} section(s) acknowledged as still to copy — do it right after the fold.`,
    ),
  );
}

// A store-only change records no deploy key at all: there is no run to name
// and no waiver owed, and its `tasks.md` repository tags are the record of
// where every group landed. Writing `deploy_waived` there would put a waiver
// in the manifest for a rule the change never answered to, and a waiver
// written where none is owed is how the waiver becomes the default.
const record = {
  ...(deployedAt !== null
    ? { deployed_at: deployedAt, deployed_env: deployedEnv }
    : deployWaived !== null
      ? { deploy_waived: deployWaived }
      : {}),
  ...(tasksWaived !== null ? { tasks_waived: tasksWaived } : {}),
  // What the clear run was told about the fold's own two DECIDE gates,
  // archived with the change so `pnpm check:manual` can read it back rather
  // than being asked for again next run.
  ...(decisionsCarried !== null ? { decisions_carried: decisionsCarried } : {}),
  ...(journeysCopied ? { journeys_copied: "true" } : {}),
};
const subject =
  deployedAt !== null
    ? `Record ${changeId} deployed at ${deployedAt} (${deployedEnv})`
    : deployWaived !== null
      ? `Record ${changeId} archived with the deploy waived`
      : `Archive ${changeId}, which deploys nothing`;

if (Object.keys(record).length === 0) {
  console.log(
    `\nNo deploy record is owed — every task group lands in ${bold(STORE_GROUP)}.`,
  );
  console.log(`\nArchive it:\n`);
  console.log(
    `  ${cyan(`git -C "${ROOT}" mv openspec/changes/${changeId} openspec/changes/archive/<YYYY-MM-DD>-${changeId}`)}`,
  );
  console.log(`  ${cyan(`git -C "${ROOT}" commit -m "${subject}"`)}`);
} else {
  const rel = writeRecord(changeId, record);
  console.log(`\nThe record is written into ${bold(rel)}. Commit it:\n`);
  console.log(`  ${cyan(`git -C "${ROOT}" commit ${rel} -m "${subject}"`)}`);
}
console.log(`\nThen:  ${cyan(`openspec archive ${changeId}`)}`);
