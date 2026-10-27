// Explicit extensions: the store's reader and the notify script load this
// under plain node, which resolves no extensionless path.

import type { Moved } from "./types.ts";

/**
 * What moved between two readings of one text before an artifact, unit by
 * unit, and whether each move is major.
 *
 * A unit is the smallest piece a hand reads again: a `## Decisions` row keyed
 * by its `Q<n>`, a `### Requirement:` block, a case under its id, each `##`
 * section less those, and the preamble before the first heading. A key the
 * text repeats is read as the whole text, so a move is never pinned to the
 * wrong one of two.
 *
 * The class reads where a move sits, never what it means
 * (`tell-each-hand-what-moved` Q4): everything is major but a small set — the
 * proposal's `## Why`, a decision row's Asked and Instead of cells, the ❓
 * wrapper around a recommendation, and punctuation. A Decided cell is
 * compared without that wrapper, so an answer that takes the recommendation
 * is no move at all (Q6).
 */
export function movedOf(item: string, before: string, after: string): Moved[] {
  if (collapse(before) === collapse(after)) return [];
  const was = unitsOf(before);
  const now = unitsOf(after);
  if (!was || !now) return [whole(item, before, after)];
  const moved: Moved[] = [];
  for (const key of new Set([...was.keys(), ...now.keys()])) {
    const one = was.get(key);
    const two = now.get(key);
    if (one === undefined || two === undefined) {
      moved.push({
        item,
        key,
        ...(one === undefined ? {} : { before: quote(one.text) }),
        ...(two === undefined ? {} : { after: quote(two.text) }),
        major: true,
      });
      continue;
    }
    const pair = classOf(item, one, two);
    if (pair) moved.push({ item, key, ...pair });
  }
  return moved;
}

/** The whole of an item as one move, major: what a reading that cannot be
 * split, or a before nobody can recover, reads as. */
export function whole(item: string, before?: string, after?: string): Moved {
  return {
    item,
    key: item,
    ...(before === undefined ? {} : { before: quote(before) }),
    ...(after === undefined ? {} : { after: quote(after) }),
    major: true,
  };
}

/** Whether a behind artifact holds the next landing: any major move does. */
export function holdsOf(moved: Moved[]): boolean {
  return moved.some((one) => one.major);
}

/**
 * A Decided cell's value, with the ❓ wrapper and the attribution taken off:
 * `❓ pm - recommended: X` and `X - the owner's word` both read `X`.
 */
export function decidedOf(cell: string): string {
  return collapse(
    cell
      .replace(ASKED, "")
      .replace(RECOMMENDED, "")
      .replace(ATTRIBUTION, "")
      .replace(/[.\s]+$/, ""),
  );
}

const ASKED = /^\s*❓\s+[a-z][a-z0-9._-]*\s+-\s+/;
const RECOMMENDED = /^\s*recommended:\s*/i;
/** The closed set a decided row is attributed with, a date and the word
 * `recommended` after it allowed. */
const ATTRIBUTION =
  /\s+-\s+(?:decided by the round|the round's word|(?:the\s+)?[a-z][a-z ]*'s word)(?:,\s*\d{4}-\d{2}-\d{2})?(?:\s*\(recommended\))?(?:\s+-\s+.*)?$/i;

type Unit = { kind: "row" | "why" | "block"; text: string; cells?: string[] };

const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE = /^\s*(```|~~~)/;
const ROW = /^\|\s*(Q\d+)\s*\|/;
const REQUIREMENT = /^Requirement:\s*(.+)$/;
const CASE =
  /^([a-z0-9][a-z0-9.-]*(?:\.US\d+-TC\d+|-US-?\d+-TC-?\d+(?:-\d+)?))\s*:/;

/** The units of one text, keyed; nothing where a key repeats. */
function unitsOf(text: string): Map<string, Unit> | undefined {
  const units = new Map<string, Unit>();
  let repeated = false;
  const put = (key: string, unit: Unit) => {
    if (units.has(key)) repeated = true;
    units.set(key, unit);
  };
  const lines = text.split("\n");
  let section = "preamble";
  let sectionLines: string[] = [];
  let carved: { key: string; level: number; lines: string[] } | undefined;
  let fence: string | undefined;
  const closeCarved = () => {
    if (carved)
      put(carved.key, { kind: "block", text: carved.lines.join("\n") });
    carved = undefined;
  };
  const closeSection = () => {
    closeCarved();
    const body = sectionLines.join("\n");
    if (section !== "preamble" || body.trim() !== "")
      put(section, {
        kind: section === "## Why" ? "why" : "block",
        text: body,
      });
    sectionLines = [];
  };
  for (const line of lines) {
    if (fence !== undefined) {
      if (line.trimStart().startsWith(fence)) fence = undefined;
      (carved ? carved.lines : sectionLines).push(line);
      continue;
    }
    const fenced = FENCE.exec(line);
    if (fenced) fence = fenced[1];
    const heading = fenced ? null : HEADING.exec(line);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2];
      if (carved && level <= carved.level) closeCarved();
      if (level <= 2) {
        closeSection();
        section = `${"#".repeat(level)} ${title}`;
        sectionLines = [line];
        continue;
      }
      const requirement = REQUIREMENT.exec(title);
      const testCase = CASE.exec(title);
      if (level === 3 && (requirement || testCase)) {
        closeCarved();
        carved = {
          key: requirement
            ? `Requirement: ${requirement[1]}`
            : (testCase?.[1] ?? title),
          level,
          lines: [line],
        };
        continue;
      }
    }
    if (carved) {
      carved.lines.push(line);
      continue;
    }
    const row = section === "## Decisions" ? ROW.exec(line) : null;
    if (row) {
      put(row[1], { kind: "row", text: line, cells: cellsOf(line) });
      continue;
    }
    sectionLines.push(line);
  }
  closeSection();
  return repeated ? undefined : units;
}

/** The class of one unit that moved, or nothing where it did not. */
function classOf(
  item: string,
  one: Unit,
  two: Unit,
): Omit<Moved, "item" | "key"> | undefined {
  if (collapse(one.text) === collapse(two.text)) return undefined;
  if (bare(one.text) === bare(two.text))
    return { before: quote(one.text), after: quote(two.text), major: false };
  if (one.kind === "row" && two.kind === "row" && one.cells && two.cells)
    return rowClass(one.cells, two.cells);
  const small = item === "proposal" && one.kind === "why";
  return { before: quote(one.text), after: quote(two.text), major: !small };
}

/** A decision row, cell by cell, taking its largest class: the Asked and
 * Instead of cells are small, the Decided cell none on an equal value, small
 * where only the ❓ wrapper went on, major otherwise. */
function rowClass(
  was: string[],
  now: string[],
): Omit<Moved, "item" | "key"> | undefined {
  const [, askedWas = "", decidedWas = "", insteadWas = ""] = was;
  const [, askedNow = "", decidedNow = "", insteadNow = ""] = now;
  const moved: { before: string; after: string; major: boolean }[] = [];
  if (collapse(decidedWas) !== collapse(decidedNow)) {
    const same = decidedOf(decidedWas) === decidedOf(decidedNow);
    const wrapped = same && !decidedWas.includes("❓");
    if (!same || wrapped)
      moved.push({ before: decidedWas, after: decidedNow, major: !same });
  }
  for (const [a, b] of [
    [askedWas, askedNow],
    [insteadWas, insteadNow],
  ])
    if (collapse(a) !== collapse(b))
      moved.push({ before: a, after: b, major: false });
  if (was.length !== now.length)
    moved.push({
      before: was.join(" | "),
      after: now.join(" | "),
      major: true,
    });
  if (moved.length === 0) return undefined;
  return {
    before: moved.map((one) => one.before.trim()).join(" | "),
    after: moved.map((one) => one.after.trim()).join(" | "),
    major: moved.some((one) => one.major),
  };
}

function cellsOf(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

/** Whitespace collapsed, as `contentIdOf` collapses it. */
function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Punctuation not touching a digit taken off too: a moved comma is small,
 * a moved decimal point is not. */
function bare(text: string): string {
  return collapse(text.replace(/(?<!\d)\p{P}(?!\d)/gu, ""));
}

/** A unit as it is quoted: its own heading, which its key already names,
 * and its leading and trailing blank lines dropped. */
function quote(text: string): string {
  return text
    .replace(/^#{1,6}\s[^\n]*\n?/, "")
    .replace(/^\s*\n/, "")
    .replace(/\n\s*$/, "")
    .trim();
}
