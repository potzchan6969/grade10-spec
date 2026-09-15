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
 * The archive has three gates, and they used to be prose in a skill file —
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
 * CARRY    `openspec archive` folds `## Requirements` and nothing else, so a
 *          delta's `## Purpose`, its `## Feature set`, its `user-journeys.md`
 *          and its suites — and every `-US-` id in them — die with the change
 *          unless someone copies them into the durable capability. This checks
 *          whether they were carried, and refuses while they are not.
 *          `--journeys-copied` acknowledges a delta whose capability has no
 *          durable spec yet: the fold creates it, so the copy can only happen
 *          right after — the flag is a promise, and the sections stay on
 *          `pnpm check:manual`'s list.
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
 * Zero dependencies, no `openspec` call — the checks read the change's own
 * files, the same way `plan-preflight.mjs` does.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const CHANGES = join(ROOT, "openspec", "changes");

const DOOMED = ["Feature set"];
const US_ID = /[a-z0-9][a-z0-9-]*-US-\d+/g;
const SC_ID = /[a-z0-9][a-z0-9-]*-SC-\d+/g;
const OPEN_TASK = /^\s*-\s*\[ \]\s*(.*)$/;
const MANIFEST_KEY = /^([A-Za-z0-9_]+):/;
/** Every key a record owns. A write drops all of them and appends only what it
 * was told, so a waiver never outlives the record that replaces it. */
const RECORD_KEYS = new Set([
  "deployed_at",
  "deployed_env",
  "deploy_waived",
  "tasks_waived",
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

/** The unchecked tasks of the change, in file order. A change with no
 * `tasks.md` owes nothing here. */
function openTasks(changeId) {
  const file = join(CHANGES, changeId, "tasks.md");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
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
    ),
  );
  console.log(
    dim("  The archive's three gates, mechanical: proof of deploy, every task"),
  );
  console.log(
    dim("  checked off, and the purpose / feature set / journeys / suites copy"),
  );
  console.log(
    dim(
      "  the fold would discard, done and done right. A clear run writes the",
    ),
  );
  console.log(dim("  record into the change's .openspec.yaml and prints the commit."));
  const ids = changeIds();
  console.log("\nChanges in flight");
  if (ids.length === 0) console.log(dim("  none — openspec/changes is empty"));
  for (const id of ids) console.log(`  ${id}`);
}

function fail(...lines) {
  for (const line of lines) console.error(line);
  process.exitCode = 1;
}

const argv = process.argv.slice(2);
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
for (let i = 1; i < argv.length; i += 1) {
  if (argv[i] === "--deployed-at") deployedAt = argv[++i] ?? null;
  else if (argv[i] === "--deployed-env") deployedEnv = argv[++i] ?? null;
  else if (argv[i] === "--deploy-waived") deployWaived = argv[++i] ?? null;
  else if (argv[i] === "--tasks-waived") tasksWaived = argv[++i] ?? null;
  else if (argv[i] === "--journeys-copied") journeysCopied = true;
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
if (deployedAt === null && deployWaived === null) {
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

// ── Tasks gate ──────────────────────────────────────────────────────────────
// An open checkbox at archive is work nobody did or a checkmark nobody wrote.
const open = openTasks(changeId);
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

// ── Carry gate ──────────────────────────────────────────────────────────────
// Two lists, because they are two different failures. `uncarried` is a copy
// that has not happened, and against a capability the fold has yet to create
// it cannot happen until after — `--journeys-copied` defers those. `wrong` is
// a copy that landed and landed wrong: every file involved is already here, so
// no flag defers it.
const uncarried = [];
const wrong = [];
const suitesSeen = new Set();

for (const { file, capability } of deltaFiles(changeId)) {
  const delta = readFileSync(file, "utf8");
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
    const ids = [...new Set(sectionBody(arrived, "Reconciliation")?.match(SC_ID) ?? [])];
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
    yellow(`${changeId} carries ${wrong.length} section(s) across incorrectly:`),
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

const rel = writeRecord(changeId, {
  ...(deployedAt !== null
    ? { deployed_at: deployedAt, deployed_env: deployedEnv }
    : { deploy_waived: deployWaived }),
  ...(tasksWaived !== null ? { tasks_waived: tasksWaived } : {}),
});
const subject =
  deployedAt !== null
    ? `Record ${changeId} deployed at ${deployedAt} (${deployedEnv})`
    : `Record ${changeId} archived with the deploy waived`;

console.log(`\nThe record is written into ${bold(rel)}. Commit it:\n`);
console.log(`  ${cyan(`git -C "${ROOT}" commit ${rel} -m "${subject}"`)}`);
console.log(`\nThen:  ${cyan(`openspec archive ${changeId}`)}`);
