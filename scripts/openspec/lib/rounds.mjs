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
 * A row's Perspectives cell is held to the schema here too, once for both
 * of its readers: the landing, as it writes the row, and `validate:changes`,
 * over every row a branch adds by hand.
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
import { perspectivesOf, verifierNeeded } from "./perspectives.mjs";

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
  const round = roundAfter(held);
  const row = `| ${[round, ...ROW_ORDER.map((key) => cell(cells[key]))].join(" | ")} |`;
  return {
    path,
    text: `${held.replace(/\n*$/, "\n")}${row}\n`,
    row,
    round,
    created,
  };
}

/** The number the round in progress will take: the rows written plus one,
 * which is what keys a reply the round posts before its row lands. */
export function nextRoundOf(root, change) {
  const file = join(root, roundsPath(change));
  return roundAfter(existsSync(file) ? readFileSync(file, "utf8") : "");
}

/** The number the next row of a `rounds.md` text takes: its rows plus one. */
export const roundAfter = (text) => readRounds(text).length + 1;

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

/**
 * What a row's Perspectives cell is refused for, held to the target's own list
 * in `schema` (`planningSchema`'s shape, `named` the schema's name); empty
 * where the cell stands. A name the list does not issue is a typo or a reader
 * nobody dispatched, and an `always` one left out is a round that skipped the
 * floor. ` (fallback)` after a name records that the reader ran on the
 * fallback model, and is the one thing the cell carries in parentheses.
 *
 * `floor`, where given, is the `always` readers a row may drop to —
 * `fixPassFloor`'s, for a fix pass or a row that records no flag saying it
 * was not one; without it every `always` reader of the list is owed.
 *
 * `verifier` is no perspective of any artifact: it records that a verifier
 * read the round's findings, so the cell names it, and owes it wherever more
 * than one reader ran — two readings are reconciled, and only a round of one
 * argues its own findings.
 */
export function perspectivesRefusals({ schema, named, target, cell, floor }) {
  const issued = perspectivesOf(schema, target);
  const given = new Set(
    String(cell ?? "")
      .split(/[,;]/)
      .map((one) =>
        one
          .replace(/\s*\(fallback\)\s*$/, "")
          .trim()
          .toLowerCase(),
      )
      .filter((one) => one !== ""),
  );
  const refusals = [];
  for (const one of given) {
    if (one === "verifier" || issued.some(({ name }) => name === one)) continue;
    refusals.push(
      `\`${one}\` is no perspective of ${target} — the \`${named}\` schema issues ${issued.map(({ name }) => `\`${name}\``).join(", ")}, \`verifier\` records that a verifier ran, and \` (fallback)\` after a name is the one suffix a reader carries`,
    );
  }
  for (const { name, when } of issued) {
    if (!when.includes("always") || given.has(name)) continue;
    if (floor && !floor.includes(name)) continue;
    refusals.push(
      `${target}'s \`${name}\` reads every round — a narrow re-run may name fewer readers, never an \`always\` one`,
    );
  }
  const readers = [...given].filter((one) => one !== "verifier");
  if (verifierNeeded(readers) && !given.has("verifier")) {
    refusals.push(
      `${readers.join(", ")} read ${target} and the cell names no \`verifier\` — a round of more than one reader is reconciled by one`,
    );
  }
  return refusals;
}
