#!/usr/bin/env node
/**
 * Flip one or more test cases' Automation status to `automated`, in place.
 *
 *   pnpm run tcs:automated <case-id…>
 *
 * The walk's last group is what earns the flip: every journey it drove end
 * to end through the interface its actor uses is proved, so its cases stop
 * being a run sheet's to walk by hand (`docs/governance/specs-to-test-cases.md`,
 * "The Run Sheet"). This edits the `**Automation status:**` line in place,
 * in whichever suite file holds the case, and pushes nothing — the walk's
 * own commit carries the flip alongside the code that proves it.
 *
 * Two refusals, never conflated: an id no suite holds at all, and a case a
 * suite does hold but that names no `**Automation status:**` line to flip —
 * naming every one of either kind it finds before touching a file, since a
 * run that flips three cases and refuses the fourth would leave the suite
 * half-migrated with nothing saying so.
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
import { parseArgs } from "./lib/args.mjs";
import { caseIndex, findSuites } from "./lib/suites.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE = "usage: pnpm run tcs:automated <case-id…> [--root <dir>]";

const AUTOMATION_LINE = /^([-*]\s+\*\*Automation status:\*\*\s*)(\S.*?)\s*$/;
const HEADING = /^#{2,3}\s/;

const { positional: ids, flags } = parseArgs(process.argv.slice(2), {
  keys: ["root"],
  usage: USAGE,
});
const root = flags.root ?? join(HERE, "..", "..");
if (ids.length === 0) fail(USAGE);

// One reading of "which case is where", shared with the rest of the store
// rather than a second scan over the same headings: `caseIndex` already
// walks every suite `findSuites` finds and records each id's file and the
// line its heading starts on.
const index = caseIndex(root, findSuites(root));

const missing = ids.filter((id) => !index.has(id));
if (missing.length > 0) {
  fail(
    missing.length === 1
      ? `\`${missing[0]}\` names no case in any suite this store holds`
      : `${missing.length} case ids name no case in any suite this store holds:\n` +
          missing.map((id) => `  ${id}`).join("\n"),
  );
}

/** id -> { path, lines, line, already } — read once, written once. */
const hits = new Map();
const noAutomationLine = [];
const fileLines = new Map();

for (const id of ids) {
  const found = index.get(id);
  const path = join(root, found.rel);
  const lines =
    fileLines.get(found.rel) ?? readFileSync(path, "utf8").split("\n");
  fileLines.set(found.rel, lines);

  // The case's own span: from its heading to the line before the next `##`
  // or `###` heading, so a search never wanders into the next case's bullets.
  const start = found.line;
  let end = lines.length;
  for (let at = start; at < lines.length; at += 1) {
    if (HEADING.test(lines[at])) {
      end = at;
      break;
    }
  }

  let match = null;
  let line = -1;
  for (let at = start; at < end; at += 1) {
    match = AUTOMATION_LINE.exec(lines[at]);
    if (match) {
      line = at;
      break;
    }
  }

  if (line === -1) {
    noAutomationLine.push(id);
    continue;
  }
  hits.set(id, {
    path,
    lines,
    line,
    already: match[2].trim().toLowerCase() === "automated",
  });
}

if (noAutomationLine.length > 0) {
  fail(
    noAutomationLine.length === 1
      ? `\`${noAutomationLine[0]}\` has no \`**Automation status:**\` line`
      : `${noAutomationLine.length} case ids have no \`**Automation status:**\` line:\n` +
          noAutomationLine.map((id) => `  ${id}`).join("\n"),
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

function fail(message) {
  console.error(message);
  process.exit(1);
}
