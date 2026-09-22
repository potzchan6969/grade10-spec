/**
 * `rounds.md`, appended one row at a time.
 *
 * `plan-land.mjs` is the only writer: the landing commits the round's row in
 * the same commit as `landed_by:`, so the row and the line that proves it
 * land together or not at all. It counts the round's number by reading the
 * rows already there with the store's own reader
 * (`tools/manual/src/store/read-rounds.mts`): a second parser would number a
 * round differently from the surface that shows it.
 *
 * `openspec/specs/shared/planning/agent-rounds/spec.md`: "`rounds.md` holds
 * one row per round".
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ROUND_COLUMNS,
  readRounds,
} from "../../../tools/manual/src/store/read-rounds.mts";

/** What the file opens with, written by the first round. */
export const ROUNDS_HEADER = [
  "# Rounds",
  "",
  "One row per round: what it read, who read it, what stood and what it asked.",
  "Written by the landing, in the landing's own commit.",
  "",
  `| ${ROUND_COLUMNS.join(" | ")} |`,
  `| ${ROUND_COLUMNS.map(() => "---").join(" | ")} |`,
  "",
].join("\n");

/** Where a change's record of its rounds sits, store-relative. */
export const roundsPath = (change) => `openspec/changes/${change}/rounds.md`;

/**
 * The file with one row appended, its number the rows already there plus one —
 * the text alone, written nowhere. The landing hashes it straight into the
 * object database: the row lands in the commit it proves, and no working tree
 * carries it in between.
 *
 * `cells` carries the five columns after the number; a column the round has
 * nothing for is written `-` rather than left blank, because a blank column is
 * what the `round` rule refuses. Returns the file's new text, the row as
 * written, the number it took and whether the file is a new one.
 */
export function withRoundRow(root, change, cells) {
  const path = roundsPath(change);
  const file = join(root, path);
  const created = !existsSync(file);
  const held = created ? ROUNDS_HEADER : readFileSync(file, "utf8");
  const round = readRounds(held).length + 1;
  const row = `| ${[round, ...ROW_ORDER.map((key) => cell(cells[key]))].join(" | ")} |`;
  return {
    path,
    text: `${held.replace(/\n*$/, "\n")}${row}\n`,
    row,
    round,
    created,
  };
}

const ROW_ORDER = ["artifact", "perspectives", "stood", "asked", "tests"];

/** A cell as the table can hold it: a pipe would end the column, a newline the
 * row, and nothing at all is the one thing the rule refuses. */
const cell = (value) => {
  const written = String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim();
  return written === "" ? "-" : written;
};

/** A comma-separated argument as the table writes it: one space after each
 * comma, and nothing where the argument is absent. */
export const listCell = (value) =>
  String(value ?? "")
    .split(",")
    .map((one) => one.trim())
    .filter((one) => one !== "")
    .join(", ");
