#!/usr/bin/env node
/**
 * Flip one or more test cases' Automation status to `automated`, in place.
 *
 *   pnpm run tcs:automated <case-id…>
 *
 * The walk's last group is what earns the flip
 * (`docs/governance/specs-to-test-cases.md`, "The last group walks the
 * journeys"): every journey it drove end to end through the interface its
 * actor uses is proved, so its cases stop being a run sheet's to walk by
 * hand. This edits the `**Automation status:**` line in place, in whichever
 * suite file holds the case, and pushes nothing — the walk's own commit
 * carries the flip alongside the code that proves it.
 *
 * Refuses an id no suite holds, naming every one it could not find before
 * touching a file: a run that flips three cases and refuses the fourth would
 * leave the suite half-migrated with nothing saying so.
 *
 * Reads the durable specs and every in-flight change's, never the archive —
 * the same tree `findSuites` reads for every suite check, since an archived
 * suite is not this store's to edit any more.
 *
 * `--root` reads a store other than this one, which is how the tests read a
 * fixture.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { findSuites } from "./lib/suites.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE = "usage: pnpm run tcs:automated <case-id…> [--root <dir>]";

const CASE_HEADING = /^###\s+(\S+?):/;
const AUTOMATION_LINE = /^([-*]\s+\*\*Automation status:\*\*\s*)(\S.*?)\s*$/;

const { positional: ids, flags } = parse(process.argv.slice(2));
const root = flags.root ?? join(HERE, "..", "..");
if (ids.length === 0) fail(USAGE);

const wanted = new Set(ids);
/** id -> { path, lines, line, already } — read once, written once. */
const hits = new Map();

for (const path of findSuites(root)) {
  const lines = readFileSync(path, "utf8").split("\n");
  let current = null;
  for (let at = 0; at < lines.length; at += 1) {
    const heading = CASE_HEADING.exec(lines[at]);
    if (heading) {
      current = heading[1];
      continue;
    }
    if (current === null || !wanted.has(current) || hits.has(current)) {
      continue;
    }
    const match = AUTOMATION_LINE.exec(lines[at]);
    if (match) {
      hits.set(current, {
        path,
        lines,
        line: at,
        already: match[2].trim().toLowerCase() === "automated",
      });
    }
  }
}

const missing = ids.filter((id) => !hits.has(id));
if (missing.length > 0) {
  fail(
    missing.length === 1
      ? `\`${missing[0]}\` names no case in any suite this store holds`
      : `${missing.length} case ids name no case in any suite this store holds:\n` +
          missing.map((id) => `  ${id}`).join("\n"),
  );
}

// Validated whole before anything is written: a refusal after three of four
// files were already flipped would leave the suite half-migrated with
// nothing saying so.
const touched = new Map();
for (const id of ids) {
  const hit = hits.get(id);
  if (hit.already) continue;
  const match = AUTOMATION_LINE.exec(hit.lines[hit.line]);
  hit.lines[hit.line] = `${match[1]}automated`;
  touched.set(hit.path, hit.lines);
}
for (const [path, lines] of touched) writeFileSync(path, lines.join("\n"));

console.log(`tcs:automated ${ids.join(" ")}`);
for (const id of ids) {
  const hit = hits.get(id);
  console.log(
    hit.already
      ? `  ${id}: already automated`
      : `  ${id}: manual → automated (${relative(root, hit.path)})`,
  );
}
console.log(
  touched.size > 0
    ? "\nNothing pushed — carry this in the walk's own commit."
    : "\nNothing to flip — every case named was automated already.",
);

/** `<case-id…>` with `--root <dir>`; `--help` prints the usage. */
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
