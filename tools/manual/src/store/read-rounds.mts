import type { RoundRow } from "../api/types.ts";
import { tableRows } from "./markdown.mts";

/**
 * `rounds.md`: one row per round the change has landed.
 *
 * The file is a markdown table and nothing else, so this is read through the
 * store's own table reader — the same `tableRows` the decisions and the
 * raised tables are read with, header and rule line dropped for us. A cell is
 * kept as its author wrote it, an empty one included: a row that leaves a
 * column blank is refused by the `round` rule, and a reader that dropped it
 * would leave that rule nothing to name.
 *
 * `Round` is read as a number so the next round can be counted from the rows
 * already there; a cell that is not one reads as 0, which no round is, and the
 * rule refuses the row for the empty column instead of guessing a number.
 */
export function readRounds(text: string): RoundRow[] {
  const rows: RoundRow[] = [];
  for (const cells of tableRows(text) ?? []) {
    const [round, artifact, perspectives, stood, asked, tests] = cells;
    rows.push({
      round: Number(round) || 0,
      artifact: artifact ?? "",
      perspectives: perspectives ?? "",
      stood: stood ?? "",
      asked: asked ?? "",
      tests: tests ?? "",
    });
  }
  return rows;
}

/** The columns a row owes, in the order the requirement tables them — what
 * the rule names when a row leaves one empty. */
export const ROUND_COLUMNS = [
  "Round",
  "Artifact",
  "Perspectives",
  "Stood",
  "Asked",
  "Tests",
] as const;
