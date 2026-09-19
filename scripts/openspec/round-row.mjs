#!/usr/bin/env node
/**
 * One round's row in the change's record:
 *
 *   pnpm run round:row <change> --artifact <id|group> --perspectives a,b \
 *     --stood "<what stood>" [--asked Q1,Q2] [--tests "<sc>: <file>;…"]
 *
 * The round writes its row and the landing commits it, so this writes the file
 * and pushes nothing. The number is the rows already there plus one, counted
 * with the store's own reader — `rounds.md` is one table and one numbering,
 * whichever script appends to it. The file is created with its header by the
 * first round and is absent until then.
 *
 * `--perspectives` and `--stood` are owed: every round runs readers, and a
 * round that found nothing says so ("nothing stood"). `--asked` and `--tests`
 * are written `-` where the round has neither — a blank column is what the
 * `round` rule refuses.
 *
 * `--root` writes into a store other than this one, which is how the tests
 * write a fixture.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { appendRoundRow, listCell } from "./lib/rounds.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  'usage: pnpm run round:row <change> --artifact <id|group> --perspectives a,b --stood "<what stood>" [--asked Q1,Q2] [--tests "<sc>: <file>;…"] [--root <dir>]';

const KEYS = ["artifact", "perspectives", "stood", "asked", "tests", "root"];

const { positional, flags } = parse(process.argv.slice(2));
const root = flags.root ?? join(HERE, "..", "..");
const change = positional[0];
if (!change) fail(USAGE);
if (!existsSync(join(root, "openspec", "changes", change)))
  fail(`no change \`${change}\` in ${root}/openspec/changes`);
if (!flags.artifact)
  fail(`--artifact names the artifact or the group\n${USAGE}`);
if (!flags.perspectives)
  fail(`--perspectives names the readers this round ran\n${USAGE}`);
if (!flags.stood)
  fail(`--stood says what stood, or that nothing did\n${USAGE}`);

const { path, row, round, created } = appendRoundRow(root, change, {
  artifact: flags.artifact,
  perspectives: listCell(flags.perspectives),
  stood: flags.stood,
  asked: listCell(flags.asked),
  tests: flags.tests,
});

console.log(`${created ? "wrote" : "appended to"} ${path}: round ${round}`);
console.log(`  ${row}`);

/** `<change>` with the row's columns as named options. */
function parse(argv) {
  const flags = {};
  const positional = [];
  for (let at = 0; at < argv.length; at += 1) {
    const arg = argv[at];
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    const named = /^--([a-z-]+)(?:=([\s\S]*))?$/.exec(arg);
    if (named) {
      if (!KEYS.includes(named[1]))
        fail(`unknown option --${named[1]}\n${USAGE}`);
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
