#!/usr/bin/env node
/**
 * The readers of one round on a bug fix:
 *
 *   node scripts/openspec/bug-readers.mjs diagnosis --diagnosis <file>
 *   node scripts/openspec/bug-readers.mjs fix --diff <file> --diagnosis <file>
 *
 * `docs/governance/bug-fixes.md` runs two rounds on a fix, and this prints
 * who reads each:
 *
 *   { "round", "readers": [{ "name", "agent", "when", "summonedBy" }], "verifier": <bool> }
 *
 * - **diagnosis** - read off the diagnosis itself, as a markdown draft
 * - **fix** - read off the landed diff, plus `surface` where the diagnosis
 *   raised it: a symptom a reader sees is read by design in both rounds,
 *   though a fix's code rarely names a screen
 *
 * The readers are the schema's `bug:` block, read through
 * `lib/perspectives.mjs` like every other round's. No bug record is read, so
 * nothing but the drafts can add a reader or remove one. `--root` reads a
 * store other than this one, which is how the tests read a fixture.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import {
  classifyDiff,
  planningSchema,
  readersFor,
  verifierNeeded,
} from "./lib/perspectives.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: node scripts/openspec/bug-readers.mjs <diagnosis|fix> --diagnosis <file> [--diff <file>] [--root <dir>]";

const { positional, flags } = parseArgs(process.argv.slice(2), {
  keys: ["diff", "diagnosis", "root"],
  usage: USAGE,
});

const round = positional[0];
if (round !== "diagnosis" && round !== "fix") fail(USAGE);
if (!flags.diagnosis) fail(`name the diagnosis: --diagnosis <file>\n${USAGE}`);
if (round === "fix" && !flags.diff)
  fail(`a fix round reads its diff: --diff <file>\n${USAGE}`);

const root = flags.root ?? join(HERE, "..", "..");
const schema = planningSchema(root);
const diagnosis = asAddedLines(read(flags.diagnosis));
const raisedByDiagnosis = classifyDiff(diagnosis, schema, "bug:diagnosis");
const triggers =
  round === "diagnosis"
    ? raisedByDiagnosis
    : new Set([
        ...classifyDiff(read(flags.diff), schema, "bug:fix"),
        ...[...raisedByDiagnosis].filter((one) => one === "surface"),
      ]);

try {
  const readers = readersFor(schema, `bug:${round}`, triggers);
  console.log(
    JSON.stringify(
      { round, readers, verifier: verifierNeeded(readers) },
      null,
      2,
    ),
  );
} catch (error) {
  fail(error.message);
}

/** A diagnosis is a whole new draft, so every line of it is a changed line. */
function asAddedLines(text) {
  return text
    .split("\n")
    .map((line) => `+${line}`)
    .join("\n");
}

function read(path) {
  if (!existsSync(path)) fail(`no file at ${path}`);
  return readFileSync(path, "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
