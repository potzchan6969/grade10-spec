/**
 * `rounds.md`, appended one row at a time.
 *
 * The round writes its row and the landing commits it, so two scripts write
 * this file — `round:row` on its own and `plan:land` inside the landing
 * commit. Both append through here, and both count the round's number by
 * reading the rows already there with the store's own reader
 * (`tools/manual/src/store/read-rounds.mts`): a second parser would number a
 * round differently from the surface that shows it.
 *
 * `openspec/specs/shared/planning/agent-rounds/spec.md`: "`rounds.md` holds
 * one row per round".
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
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
 * One row appended, its number the rows already there plus one.
 *
 * `cells` carries the five columns after the number; a column the round has
 * nothing for is written `-` rather than left blank, because a blank column is
 * what the `round` rule refuses. Returns the row as written, the number it
 * took and whether the file was created.
 */
export function appendRoundRow(root, change, cells) {
  const path = roundsPath(change);
  const file = join(root, path);
  const created = !existsSync(file);
  const text = created ? ROUNDS_HEADER : readFileSync(file, "utf8");
  const round = readRounds(text).length + 1;
  const row = `| ${[round, ...ROW_ORDER.map((key) => cell(cells[key]))].join(" | ")} |`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${text.replace(/\n*$/, "\n")}${row}\n`);
  return { path, file, row, round, created };
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
