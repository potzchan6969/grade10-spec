#!/usr/bin/env node
/**
 * The readers of one draft, and the bundle each one is given:
 *
 *   node scripts/openspec/perspectives.mjs <change> <artifact|group> --diff <file>
 *   node scripts/openspec/perspectives.mjs <artifact|group> --diff <file>
 *
 * The `round` skill calls this at its Challenge step. It prints
 *
 *   { "readers": [{ "name", "agent", "when" }], "verifier": <bool>, "bundle": { "draft", "upstream" } }
 *
 * - **readers** — the perspectives the draft's own diff summons, plus every
 *   `always`, one dispatch per reader definition under `.claude/agents/`
 * - **verifier** — whether a verifier reads the findings: a round that
 *   summoned one challenger dispatches none, and that reader argues its own
 * - **bundle** — the draft, and what is before it: the artifact's `upstream:`
 *   set as the change wrote it, and the page sections the proposal marks
 *
 * The size is read from the draft. No key of the change's record is read, so
 * none can add a reader or remove one; a size somebody believes is wrong is a
 * question for the interview.
 *
 * The change may be left out where `--change` names it or the branch is
 * `change/<id>`. `--root` reads a store other than this one, which is how the
 * tests read a fixture.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  bundleFor,
  classifyDiff,
  planningSchema,
  readersFor,
  verifierNeeded,
} from "./lib/perspectives.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: node scripts/openspec/perspectives.mjs [<change>] <artifact|group> --diff <file> [--root <dir>]";

const flags = { diff: undefined, root: undefined, change: undefined };
const positional = [];
const argv = process.argv.slice(2);
for (let at = 0; at < argv.length; at += 1) {
  const arg = argv[at];
  if (arg === "--help" || arg === "-h") {
    console.log(USAGE);
    process.exit(0);
  }
  const named = /^--(diff|root|change)(?:=(.*))?$/.exec(arg);
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

const root = flags.root ?? join(HERE, "..", "..");
const target = positional.length > 1 ? positional[1] : positional[0];
const change =
  positional.length > 1 ? positional[0] : (flags.change ?? onBranch(root));

if (!target) fail(USAGE);
if (!change)
  fail(
    `name the change: a first argument, --change <id>, or a branch called change/<id>\n${USAGE}`,
  );
if (!existsSync(join(root, "openspec", "changes", change)))
  fail(`no change ${change} in ${root}/openspec/changes`);
if (flags.diff !== undefined && !existsSync(flags.diff))
  fail(`no diff at ${flags.diff}`);

// A round with no diff yet is a round on an untouched draft: the floor reads
// it and nothing else is summoned.
const diff = flags.diff === undefined ? "" : readFileSync(flags.diff, "utf8");
const schema = planningSchema(root);
const triggers = classifyDiff(diff, target);
const readers = readersFor(schema, target, triggers);

console.log(
  JSON.stringify(
    {
      readers: readers.map(({ name, agent, when }) => ({ name, agent, when })),
      verifier: verifierNeeded(readers),
      bundle: bundleFor(root, change, target, schema),
    },
    null,
    2,
  ),
);

/** The change a round is on, from the branch it drafts on. */
function onBranch(store) {
  try {
    const branch = execFileSync(
      "git",
      ["-C", store, "rev-parse", "--abbrev-ref", "HEAD"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    const named = /^change\/(.+)$/.exec(branch);
    return named ? named[1] : undefined;
  } catch {
    return undefined;
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
