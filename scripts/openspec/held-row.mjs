#!/usr/bin/env node
/**
 * The round's reply to the hand a held row waits on, printed for the change's
 * thread: the row, the sentence it would put on the page and the decision rows
 * it touches, quoted, and the hand mentioned.
 *
 *   node scripts/openspec/held-row.mjs <Q> --change <id> [--root <dir>]
 *
 * Keyed on the change, the round and the row in `.round/rows.txt`, read and
 * appended through the same sent-keys helpers every message uses, so a re-run
 * of one round prints it once and the next round prints it again while it is
 * still held. The key's round is the one this round's landing will write.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  decisionRows,
  handsOfRecord,
  readQuestions,
} from "../../tools/openspec-store/src/read-changes.mts";
import { parseArgs } from "./lib/args.mjs";
import { citesId } from "./lib/cites.mjs";
import { appendSentKeys, readSentKeys } from "./lib/notify.mjs";
import { nextRoundOf } from "./lib/rounds.mjs";
import { handText } from "./lib/wording.mjs";

const USAGE = "usage: node held-row.mjs <Q> --change <id> [--root <dir>]";
const LEDGER = join(".round", "rows.txt");

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2), {
    keys: ["change", "root"],
    usage: USAGE,
  });
  const [id] = positional;
  if (!id || positional.length > 1 || !flags.change) fail(USAGE);
  const root = flags.root ?? process.cwd();
  const text = heldRowText(root, flags.change, id);
  const ledger = join(root, LEDGER);
  const key = `${flags.change}/${nextRoundOf(root, flags.change)}/${id}`;
  if (readSentKeys(ledger).has(key)) {
    console.log("already said");
    return;
  }
  console.log(text);
  mkdirSync(dirname(ledger), { recursive: true });
  appendSentKeys(ledger, [key]);
}

/**
 * The reply a held row makes to the hand it waits on. The row, the hand and
 * the recommendation are read through the store's own readers — the question
 * reader, the `## Decisions` rows and the record's `hands:` — so they are the
 * ones the change page shows; the sentence it would put on the page is its
 * recommendation; the rows it touches are
 * every other decision row that names it or that it names. A row that is not
 * held is refused: a decided row asks nobody anything. A role the record
 * names no hand for is written as its label and `(open)`, as a landing reply
 * writes it (`handText`), never as a mention nobody answers to.
 */
function heldRowText(root, change, id) {
  const dir = join(root, "openspec", "changes", change);
  const decisions = readTextOr(join(dir, "decisions.md"));
  const held = readQuestions(
    decisions,
    handsOfRecord(readTextOr(join(dir, ".openspec.yaml"))),
  ).find((one) => one.id === id);
  if (!held) {
    fail(
      `${id} is not held: a row asks a hand only while its Decision cell opens ❓ — a decided row is nobody's question`,
    );
  }
  const rows = decisionRows(decisions);
  const own = rows.find((cells) => cells[0] === id) ?? [];
  const ownText = own.join(" | ");
  const touched = rows.filter(
    (cells) =>
      /^Q\d+$/.test(cells[0] ?? "") &&
      cells[0] !== id &&
      (citesId(ownText, cells[0]) || citesId(cells.join(" | "), id)),
  );
  const hand = handText(
    held.role,
    held.hand === held.role ? undefined : held.hand,
  );
  const text = [
    `${hand} — ${id} waits on you.`,
    `> ${own.join(" | ")}`,
    `The sentence it would put on the page:\n> ${held.recommended.replace(/^recommended:\s*/i, "")}`,
    touched.length > 0
      ? `The rows it touches:\n${touched.map((cells) => `> ${cells.join(" | ")}`).join("\n")}`
      : "It touches no other row.",
    `Answer with \`${id}: <your answer>\`, or \`${id}\` to take the recommendation.`,
  ].join("\n");
  return text;
}

const readTextOr = (path) =>
  existsSync(path) ? readFileSync(path, "utf8") : "";

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
