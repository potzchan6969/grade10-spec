#!/usr/bin/env node
/**
 * Run this before `openspec archive <change-id>`:
 *
 *   pnpm run archive:preflight <change-id> --deployed-at <sha>
 *   pnpm run archive:preflight <change-id> --deploy-waived "<who waived it, why>"
 *
 * The archive has two gates, and both used to be prose in a skill file — which
 * made the honest path and the fast path differ by forty minutes with only one
 * leaving a record. This makes them mechanical:
 *
 * DEPLOY   A change merged is not a change shipped; merging deploys nothing.
 *          This store cannot see the application repo's deploy runs, so the
 *          gate demands the evidence instead of trusting silence: the deployed
 *          sha that contains the change's merge commit, or an explicit waiver
 *          naming who and why. Either lands in the archive commit message.
 *
 * JOURNEYS `openspec archive` folds `## Requirements` and nothing else, so a
 *          delta's `## Feature set` and its `user-journeys.md` — and every `-US-`
 *          id in them — die with the change unless someone copies them into
 *          the durable spec. This checks whether they were carried, and
 *          refuses while they are not. `--journeys-copied` acknowledges a
 *          delta whose capability has no durable spec yet: the fold creates
 *          it, so the copy can only happen right after — the flag is a
 *          promise, recorded in the archive commit message.
 *
 * Zero dependencies, no `openspec` call — the checks read the change's own
 * files, the same way `plan-preflight.mjs` does.
 */

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

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const CHANGES = join(ROOT, "openspec", "changes");

const DOOMED = ["Feature set"];
const US_ID = /[a-z0-9][a-z0-9-]*-US-\d+/g;

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

function help() {
  console.log(
    `${bold("pnpm run archive:preflight")} <change-id> --deployed-at <sha> | --deploy-waived "<why>" [--journeys-copied]`,
  );
  console.log(
    dim("  The archive's two gates, mechanical: proof of deploy, and the"),
  );
  console.log(
    dim("  Feature set / user-journeys.md hand-copy the fold would discard."),
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

const argv = process.argv.slice(2);
const changeId = argv[0];
if (!changeId || changeId === "--help" || changeId === "-h") {
  help();
  process.exit();
}

let deployedAt = null;
let deployWaived = null;
let journeysCopied = false;
for (let i = 1; i < argv.length; i += 1) {
  if (argv[i] === "--deployed-at") deployedAt = argv[++i] ?? null;
  else if (argv[i] === "--deploy-waived") deployWaived = argv[++i] ?? null;
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
    "A change merged is not a change shipped — merging deploys nothing. Find the",
    "deploy that contains the merge commit (the application repo's archive-change",
    "skill has the commands), then:",
    "",
    `  ${cyan(`pnpm run archive:preflight ${changeId} --deployed-at <sha>`)}`,
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

// ── Journeys gate ───────────────────────────────────────────────────────────
const uncarried = [];
for (const { file, capability } of deltaFiles(changeId)) {
  const durableFile = join(ROOT, "openspec", "specs", capability, "spec.md");
  const durable = existsSync(durableFile)
    ? readFileSync(durableFile, "utf8")
    : null;

  for (const section of doomedSections(readFileSync(file, "utf8"))) {
    const carried =
      durable !== null &&
      durable.match(new RegExp(`^##\\s+${section.name}\\s*$`, "m")) !== null &&
      [...section.ids].every((id) => durable.includes(id));
    if (!carried) uncarried.push({ capability, section, durable });
  }

  // The stories are their own file on both sides, so the fold never touches
  // them: the change's user-journeys.md has to be copied across whole.
  const journeysFile = file.replace(/spec\.md$/, "user-journeys.md");
  if (!existsSync(journeysFile)) continue;
  const stories = readFileSync(journeysFile, "utf8");
  const ids = new Set(stories.match(US_ID) ?? []);
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
  const carried =
    landed !== null && [...ids].every((id) => landed.includes(id));
  if (!carried) {
    uncarried.push({
      capability,
      section: { name: "User journeys", ids },
      durable: landed,
    });
  }
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
    "`openspec archive` folds `## Requirements` and nothing else — the feature",
    "set, the journeys file, and every `-US-` id in it die with the change unless",
    "they are copied across to the durable capability. Copy them, then re-run this.",
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
console.log("\nRecord the gate in the archive commit message:");
console.log(
  deployedAt !== null
    ? `  Deployed-at: ${deployedAt}`
    : `  Deploy-waived: ${deployWaived}`,
);
console.log(`\nThen:  ${cyan(`openspec archive ${changeId}`)}`);
