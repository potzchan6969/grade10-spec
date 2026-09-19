#!/usr/bin/env node
/**
 * The settings JSON one matrix entry of the re-read job hands the action.
 *
 * A re-read edits one change's artifacts and the pages its proposal links —
 * `.claude/skills/round/SKILL.md` says so, and `lib/writable.mjs` is that
 * boundary read by this step and by the guard alike — so every tree of the
 * checkout that holds neither is denied. Computed from the checkout rather
 * than declared: a tree or a change opened after this file was last touched
 * is denied to every run it does not belong to, with nothing to keep in step.
 *
 *   node scripts/openspec/reread-settings.mjs <change> [--root <dir>] [--out <path>]
 *
 * Prints the JSON to stdout when `--out` is not given.
 */
import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import { writableBy } from "./lib/writable.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: node reread-settings.mjs <change> [--root <dir>] [--out <path>]";
const CHANGE_ROOT = "openspec/changes";

/** Every other active change's directory, so a re-read of one cannot touch
 * another's draft; `archive/` is a directory of finished changes, never a
 * change of its own, and a re-read may read what has shipped. */
export function otherChangeDirectories(root, change) {
  return readdirSync(join(root, CHANGE_ROOT), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== change && name !== "archive")
    .sort();
}

/**
 * The rule set one matrix entry runs under: read, write and edit denied on
 * every tree that holds nothing this change may write.
 *
 * Two levels deep, because two of the store's trees hold a writable path
 * among many that are nobody's business here: inside `openspec/` everything
 * but `changes/` is denied, and every other change's directory with it;
 * inside `docs/` everything but `prds/` is. `docs/prds/` itself stays open —
 * a page the proposal never linked is the guard's to fail, not something to
 * enumerate every page of the manual against.
 */
export function settingsFor(root, change) {
  const writable = writableBy(root, change);
  const holds = (tree) => writable.some((path) => path.startsWith(`${tree}/`));
  const denyPaths = [];
  for (const tree of treesIn(root, "")) {
    if (!holds(tree)) {
      denyPaths.push(`${tree}/**`);
      continue;
    }
    for (const inside of treesIn(root, tree)) {
      if (inside === CHANGE_ROOT) {
        denyPaths.push(
          ...otherChangeDirectories(root, change).map(
            (name) => `${CHANGE_ROOT}/${name}/**`,
          ),
        );
      } else if (!holds(inside)) {
        denyPaths.push(`${inside}/**`);
      }
    }
  }
  return {
    permissions: {
      deny: denyPaths.flatMap((path) => [
        `Read(${path})`,
        `Edit(${path})`,
        `Write(${path})`,
      ]),
    },
  };
}

/** The directories one directory of the checkout holds, store-relative.
 * `.git` is git's own, not a tree of the store, and nothing the settings
 * govern reaches it. */
function treesIn(root, dir) {
  return readdirSync(join(root, dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== ".git")
    .map((entry) => (dir === "" ? entry.name : `${dir}/${entry.name}`))
    .sort();
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2), {
    keys: ["root", "out"],
    usage: USAGE,
  });
  const [change] = positional;
  if (!change) fail(USAGE);
  const root = flags.root ?? join(HERE, "..", "..");
  const settings = JSON.stringify(settingsFor(root, change), null, 2);
  if (flags.out) writeFileSync(flags.out, `${settings}\n`);
  else console.log(settings);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
