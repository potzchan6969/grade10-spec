#!/usr/bin/env node
/**
 * The change's thread, written once:
 *
 *   pnpm run round:thread <change> <channel>/<ts>
 *
 * The round calls this when it answers the first planning-channel message
 * about a change — the sentence that opened it, or the first later message
 * naming it. Every reply, every direct message and every wake on a landing
 * reads the address back from the record, so it is written once and never
 * rewritten: a `thread:` already there stops this and says what it holds. A
 * wrong address is a person's edit to the record.
 *
 * The push workflow's own per-push post is a channel message about several
 * changes, so it is never a change's thread, and a change opened from a
 * terminal carries no `thread:` until a channel message about it arrives.
 *
 * `--root` writes into a store other than this one, which is how the tests
 * write a fixture.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  openRecord,
  saveRecord,
  setValue,
  writtenValue,
} from "./lib/record.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: pnpm run round:thread <change> <channel>/<ts> [--root <dir>]";

/** A Slack channel and the message the thread hangs off, as every link to it
 * is built: `C…` and the message's timestamp. */
const ADDRESS = /^C[A-Z0-9]+\/\d+\.\d+$/;

const { positional, flags } = parse(process.argv.slice(2));
const root = flags.root ?? join(HERE, "..", "..");
const [change, address] = positional;
if (!change || !address) fail(USAGE);
if (!existsSync(join(root, "openspec", "changes", change)))
  fail(`no change \`${change}\` in ${root}/openspec/changes`);
if (!ADDRESS.test(address))
  fail(
    `\`${address}\` is not a thread's address: <channel>/<ts>, as in C0456EFGH/1758270000.000100`,
  );

const record = openRecord(root, change);
const held = writtenValue(record.doc, "thread");
if (held !== undefined) {
  if (held === address) {
    console.log(`${record.path} already holds thread: ${held}`);
    process.exit(0);
  }
  fail(
    `${record.path} already holds thread: ${held} — the round never rewrites it; a wrong address is a person's edit to the record`,
  );
}

setValue(record.doc, "thread", address);
saveRecord(record);
console.log(`${record.path}: thread: ${address}`);

/** `<change> <channel>/<ts>` with `--root <dir>`. */
function parse(argv) {
  const flags = {};
  const positional = [];
  for (let at = 0; at < argv.length; at += 1) {
    const arg = argv[at];
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      process.exit(0);
    }
    const named = /^--(root)(?:=(.*))?$/.exec(arg);
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
