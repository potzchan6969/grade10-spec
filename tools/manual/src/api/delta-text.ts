/** Reading a delta as what it will do to the durable spec.
 *
 * A MODIFIED block is the whole requirement retyped, so the only way to see
 * what it changes is to compare it against the block it replaces — and the
 * only way a retyped block that quietly drops a scenario becomes reviewable.
 * The durable side is rebuilt from the entry rather than re-read: the reader
 * already split it into heading, prose and scenarios, and putting it back
 * together is cheaper than shipping the file twice.
 */
import type { Requirement, Scenario } from "./types";

export type DiffRow = { kind: "same" | "added" | "removed"; text: string };

export function scenarioHeading(scenario: Scenario): string {
  return `#### Scenario: ${scenario.id ? `${scenario.id} - ` : ""}${scenario.name}`;
}

/** The durable requirement written back out as the block a delta replaces. */
export function durableBlock(requirement: Requirement): string {
  const parts = [`### Requirement: ${requirement.name}`, requirement.text];
  for (const scenario of requirement.scenarios) {
    parts.push(scenarioHeading(scenario), scenario.text);
  }
  return parts
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .join("\n\n");
}

/** Everything under the block's own heading. Heading depth is a delta's own
 * business — the check holds the name byte-for-byte — so comparing it would
 * report a `###` against a `####` as a rewrite. */
export function blockBody(text: string): string {
  const lines = text.split("\n");
  return (lines[0]?.startsWith("#") ? lines.slice(1) : lines).join("\n");
}

function meaningful(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line !== "");
}

/**
 * A line diff over what the two blocks actually say. Blank lines are dropped
 * on both sides: a rewrapped paragraph is not a change anyone reviews, and a
 * dropped scenario is what this exists to show.
 */
export function diffLines(before: string, after: string): DiffRow[] {
  const left = meaningful(before);
  const right = meaningful(after);
  const common = longestCommon(left, right);

  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      rows.push({ kind: "same", text: left[i] });
      i += 1;
      j += 1;
    } else if (common[i + 1][j] >= common[i][j + 1]) {
      rows.push({ kind: "removed", text: left[i] });
      i += 1;
    } else {
      rows.push({ kind: "added", text: right[j] });
      j += 1;
    }
  }
  for (; i < left.length; i += 1) rows.push({ kind: "removed", text: left[i] });
  for (; j < right.length; j += 1) rows.push({ kind: "added", text: right[j] });
  return rows;
}

/** Length of the longest common subsequence from each position onward. */
function longestCommon(left: string[], right: string[]): number[][] {
  const grid = Array.from({ length: left.length + 1 }, () =>
    new Array<number>(right.length + 1).fill(0),
  );
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      grid[i][j] =
        left[i] === right[j]
          ? grid[i + 1][j + 1] + 1
          : Math.max(grid[i + 1][j], grid[i][j + 1]);
    }
  }
  return grid;
}

export function diffTotals(rows: DiffRow[]): {
  added: number;
  removed: number;
} {
  return {
    added: rows.filter((row) => row.kind === "added").length,
    removed: rows.filter((row) => row.kind === "removed").length,
  };
}
