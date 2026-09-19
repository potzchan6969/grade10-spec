#!/usr/bin/env node
/**
 * The read record: what an artifact was last read again against.
 *
 *   pnpm run round:reviewed <change> [artifact…]
 *
 * The round calls this at its re-read: it reads the artifact against what is
 * before it, and where nothing changed it writes the line and lands it alone.
 * With no artifact named it writes every artifact of the change that has
 * something before it — one commit for a landing that put several behind.
 *
 * The id is the content id of what is before the artifact, which the store
 * computes: `contentIdOf` over the artifact's `upstream:` texts in the
 * schema's order, each with its whitespace collapsed, read here through
 * `entry.upstream[<artifact>].id`. Nothing here hashes anything, so the line
 * this writes and the freshness a surface shows cannot disagree.
 *
 * An artifact drawn from nothing in this change — the proposal of a change
 * that links no page section — has no id to write and no line to read it back
 * against, so it is reported and skipped. So is an artifact a waiver stands
 * for: a waiver says nothing is owed, so nothing after it waits on it.
 *
 * `--root` reads a store other than this one, which is how the tests read a
 * fixture.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./lib/args.mjs";
import { openRecord, saveRecord, setEntry } from "./lib/record.mjs";
import { readChangeEntry } from "./lib/store-read.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: pnpm run round:reviewed <change> [artifact…] [--root <dir>]";

const { positional, flags } = parseArgs(process.argv.slice(2), {
  keys: ["root"],
  usage: USAGE,
});
const root = flags.root ?? join(HERE, "..", "..");
const [change, ...named] = positional;
if (!change) fail(USAGE);

const { entry, artifacts } = await readChangeEntry(root, change).catch(
  (cause) => fail(cause.message),
);

const issued = new Set(artifacts.map((one) => one.id));
for (const artifact of named) {
  if (!issued.has(artifact)) {
    fail(
      `\`${artifact}\` is no artifact of the \`${entry.schema}\` schema — it issues ${[...issued].join(", ")}`,
    );
  }
}

// In the schema's order whether they were named or not: the record reads the
// same however the round listed them.
const wanted = named.length > 0 ? new Set(named) : issued;
const record = openRecord(root, change);
const written = [];
const skipped = [];
for (const { id } of artifacts) {
  if (!wanted.has(id)) continue;
  const read = entry.upstream?.[id];
  if (read === undefined) {
    skipped.push(id);
    continue;
  }
  setEntry(record.doc, "reviewed", id, read.id);
  written.push({ id, content: read.id, items: read.items });
}

if (written.length > 0) saveRecord(record);

console.log(`round:reviewed ${change}`);
for (const { id, content, items } of written) {
  console.log(`  reviewed: ${id}: ${content}`);
  console.log(`    read against ${items.join(", ")}`);
}
for (const id of skipped) {
  console.log(`  ${id}: nothing before it in this change — no line to write`);
}
if (written.length === 0) {
  console.log("  nothing written");
} else {
  const example = written[0].id;
  console.log(
    `\n${record.path} is written. Commit it, then \`pnpm run plan:land ${change} ${example} --reviewed\` lands it${written.length > 1 ? ` (repeat per artifact)` : ""}.`,
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
