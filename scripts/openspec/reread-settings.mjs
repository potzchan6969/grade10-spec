#!/usr/bin/env node
/**
 * The settings JSON one matrix entry of the re-read job hands the action.
 *
 * A re-read edits one change's artifacts and the pages its proposal links —
 * `.claude/skills/round/SKILL.md` says so — so everything else is denied:
 * `.github/**`, `packages/**`, `tools/**`, and every other change's own
 * directory, computed here from the checkout rather than declared, so a
 * change opened after this file was last touched is still denied to every
 * other run.
 *
 *   node scripts/openspec/reread-settings.mjs <change> [--root <dir>] [--out <path>]
 *
 * Prints the JSON to stdout when `--out` is not given.
 */
import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: node reread-settings.mjs <change> [--root <dir>] [--out <path>]";
const CHANGE_ROOT = "openspec/changes";

/** Always denied, whatever change is being read again. */
const FIXED_DENY = [".github/**", "packages/**", "tools/**"];

/** Every other active change's directory, so a re-read of one cannot touch
 * another's draft; `archive/` is a directory of finished changes, never a
 * change of its own. */
export function otherChangeDirectories(root, change) {
  return readdirSync(join(root, CHANGE_ROOT), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== change && name !== "archive")
    .sort();
}

/** The rule set one matrix entry runs under: read, write and edit denied on
 * every path outside its own change. */
export function settingsFor(root, change) {
  const denyPaths = [
    ...FIXED_DENY,
    ...otherChangeDirectories(root, change).map(
      (name) => `${CHANGE_ROOT}/${name}/**`,
    ),
  ];
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

function main() {
  const { positional, flags } = parse(process.argv.slice(2));
  const [change] = positional;
  if (!change) fail(USAGE);
  const root = flags.root ?? join(HERE, "..", "..");
  const settings = JSON.stringify(settingsFor(root, change), null, 2);
  if (flags.out) writeFileSync(flags.out, `${settings}\n`);
  else console.log(settings);
}

function parse(argv) {
  const flags = {};
  const positional = [];
  for (let at = 0; at < argv.length; at += 1) {
    const arg = argv[at];
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    const named = /^--(root|out)(?:=(.*))?$/.exec(arg);
    if (named) {
      let value = named[2];
      if (value === undefined) {
        at += 1;
        value = argv[at];
      }
      if (value === undefined) fail(`--${named[1]} needs a value\n${USAGE}`);
      flags[named[1]] = value;
      continue;
    }
    if (arg.startsWith("-")) fail(`unknown option ${arg}\n${USAGE}`);
    positional.push(arg);
  }
  return { positional, flags };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
