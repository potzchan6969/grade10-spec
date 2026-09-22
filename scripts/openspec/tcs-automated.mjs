#!/usr/bin/env node
/**
 * Flip one or more test cases' Automation status to `automated`, in place,
 * and write the `**Decided by:**` line that names what decided them.
 *
 *   pnpm run tcs:automated <case-id…> --decided-by <path>[,<path>]
 *
 * The walk's last group is what earns the flip: every journey it drove end
 * to end through the interface its actor uses is proved, so its cases stop
 * being a run sheet's to walk by hand (`docs/governance/specs-to-test-cases.md`,
 * "The Run Sheet"). This edits the `**Automation status:**` line in place,
 * in whichever suite file holds the case, and pushes nothing — the walk's
 * own commit carries the flip alongside the code that proves it.
 *
 * The status and the line are one edit, which is what holds a flip to the
 * commit that lands its test (Q74 of `run-a-round-on-every-artifact`): a case
 * of an in-flight change cannot be flipped without naming what decides it, so
 * no commit exists where the status moved and nothing said what moved it. A
 * case already carrying the line, flipped again with no flag, keeps the line
 * it has.
 *
 * Three refusals, never conflated: an id no suite holds at all, a case a
 * suite does hold but that names no `**Automation status:**` line to flip,
 * and a flip of an in-flight change's case that names no deciding path —
 * naming every one of any kind it finds before touching a file, since a run
 * that flips three cases and refuses the fourth would leave the suite
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
import { caseIndex, commaList, findSuites, PROPERTIES } from "./lib/suites.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const USAGE =
  "usage: pnpm run tcs:automated <case-id…> [--decided-by <path>[,<path>]] [--root <dir>]";

const AUTOMATION_LINE = /^([-*]\s+\*\*Automation status:\*\*\s*)(\S.*?)\s*$/;
const HEADING = /^#{2,3}\s/;
/** A classification bullet, read by name: the block is the ten properties,
 *  and an `* **Expected result:** …` bullet further down is not one of them. */
const PROP_BULLET = /^[-*]\s+\*\*([\w ]+?):\*\*/;
const PROP_NAMES = new Set([...PROPERTIES.map(([name]) => name), "Behavior"]);
const DECIDED_LINE = /^\*\*Decided by:\*\*/;
/** A case of a change still in flight: the tree whose automated cases owe the
 *  line (Q69). A durable suite's do not, so a flip there names nothing. */
const IN_FLIGHT = /^openspec[/\\]changes[/\\]/;

const { positional: ids, flags } = parseArgs(process.argv.slice(2), {
  keys: ["decided-by", "root"],
  usage: USAGE,
});
const root = flags.root ?? join(HERE, "..", "..");
if (ids.length === 0) fail(USAGE);

const asked = flags["decided-by"] !== undefined;
const { values: decidedBy, empty } = commaList(flags["decided-by"]);
if (asked && (decidedBy.length === 0 || empty > 0))
  fail("--decided-by names an empty path — a doubled or trailing comma");

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

/** id -> the file, its lines, and the line numbers this edits between — read
 *  once, written once. */
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
  let prop = -1;
  let decided = -1;
  for (let at = start; at < end; at += 1) {
    const automation = AUTOMATION_LINE.exec(lines[at]);
    if (automation && line === -1) {
      match = automation;
      line = at;
    }
    const bullet = PROP_BULLET.exec(lines[at]);
    if (bullet && PROP_NAMES.has(bullet[1])) prop = at;
    if (decided === -1 && DECIDED_LINE.test(lines[at])) decided = at;
  }

  if (line === -1) {
    noAutomationLine.push(id);
    continue;
  }
  hits.set(id, {
    path,
    lines,
    line,
    prop,
    decided,
    inFlight: IN_FLIGHT.test(found.rel),
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

// A flip of an in-flight change's case names what decides it, or it does not
// happen. One line, because the answer is the same for every id on it.
const unnamed = ids.filter((id) => {
  const hit = hits.get(id);
  return (
    hit.inFlight && !hit.already && decidedBy.length === 0 && hit.decided === -1
  );
});
if (unnamed.length > 0)
  fail(
    `${unnamed.join(", ")} — a case of an in-flight change owes \`--decided-by <path>\`: name the test that decides the flip`,
  );

// Validated whole before anything is written: a refusal after three of four
// files were already flipped would leave the suite half-migrated with nothing
// saying so. Inside a file the cases are written bottom up, because writing
// the line inserts two lines and every case above it keeps its numbers.
const written = `**Decided by:** ${decidedBy
  .map((one) => `\`${one}\``)
  .join(", ")}`;
const touched = new Map();
const order = ids
  .filter((id) => !hits.get(id).already || decidedBy.length > 0)
  .sort((a, b) => hits.get(b).line - hits.get(a).line);
for (const id of order) {
  const hit = hits.get(id);
  if (!hit.already) {
    const match = AUTOMATION_LINE.exec(hit.lines[hit.line]);
    hit.lines[hit.line] = `${match[1]}automated`;
  }
  if (decidedBy.length > 0) {
    if (hit.decided === -1) hit.lines.splice(hit.prop + 1, 0, "", written);
    else hit.lines[hit.decided] = written;
  }
  touched.set(hit.path, hit.lines);
}
for (const [path, lines] of touched) writeFileSync(path, lines.join("\n"));

console.log(`tcs:automated ${ids.join(" ")}`);
const decided =
  decidedBy.length > 0 ? `, decided by ${decidedBy.join(", ")}` : "";
for (const id of ids) {
  const hit = hits.get(id);
  const moved = hit.already ? "automated" : "manual → automated";
  console.log(
    hit.already && decidedBy.length === 0
      ? `  ${id}: already automated`
      : `  ${id}: ${moved} (${relative(root, hit.path)})${decided}`,
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
