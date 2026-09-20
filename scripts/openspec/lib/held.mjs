/**
 * A change's held rows: a `## Decisions` row whose Decided cell opens with
 * ❓ waits on a person, until it is answered or waved through with its
 * recommendation (Q59, Q60). `plan-land.mjs` is the only caller — it reads
 * `decisions.md` once and passes the text here, refuses the landing naming
 * every held row, and, with `--with-recommendations`, writes the rewrite into
 * the landing commit.
 *
 * The rows are read through the manual's own question reader,
 * `readQuestions` in `tools/manual/src/store/read-changes.mts` — the same
 * reader `My turn`, the digest and the ❓ counts read, over the same table
 * reader every other table of this store is read with. There is no second
 * parser here: two readers of one table drift the day a column moves.
 *
 * The one thing that reader cannot answer is a ❓ cell it does not recognise.
 * `readQuestions` lists a row written `❓ <role> - <what is recommended>` and
 * passes over everything else, so a cell that opens ❓ and names no role, or
 * names one and recommends nothing, would read here as a row nobody is
 * holding and land under a word that never answered it. Both are refused by
 * name instead, off the same table the rows are read from.
 *
 * Pure over the markdown text, so it is tested without a change or a git
 * checkout of its own.
 */
import {
  cellsOf,
  outline,
  tableRows,
} from "../../../tools/manual/src/store/markdown.mts";
import { readQuestions } from "../../../tools/manual/src/store/read-changes.mts";

/** `❓ <role> - recommended: <option>` is how the interview writes what it
 * would do; a cell that says it another way is its own recommendation. */
const RECOMMENDED = /^recommended:\s*/;

/** A row of the table this reads: `Q<n>` in the first cell, the same id the
 * question reader answers with. */
const DECISION_ROW = /^Q\d+$/;

/** A cell nobody has settled, whatever else it says. */
const OPEN = /^❓/;

/** What a row taken as recommended reads afterwards: the option, and that
 * nobody's word settled it (Q60). */
const DECIDED_BY_THE_ROUND = "decided by the round";

/**
 * The ids of the held rows, in the table's own order — what the refusal and
 * the landing's summary name.
 *
 * Throws on a row this cannot take: the landing prints the message and stops,
 * since a held row nothing can answer is a landing nobody can make.
 */
export function heldIdsOf(markdown) {
  return heldRowsOf(markdown).map((row) => row.id);
}

/**
 * The markdown with every held row's Decided cell rewritten as
 * `<option> - decided by the round` — what `land with recommendations` takes
 * (Q60), and what the landing commit carries. The markdown is returned
 * unchanged where nothing is held.
 *
 * Fenced to the `## Decisions` section the rows were read from, and written
 * only over a cell that still opens with ❓: a row of another table carrying
 * the same id, and a row an earlier pass already took, are both left as they
 * stand.
 */
export function takeRecommendations(markdown) {
  const held = heldRowsOf(markdown);
  if (held.length === 0) return markdown;
  const recommendationOf = new Map(
    held.map((row) => [row.id, row.recommendation]),
  );
  const lines = markdown.split("\n");
  const { from, until } = decisionsIn(markdown);
  for (let at = from; at < until; at += 1) {
    const cells = cellsOf(lines[at]);
    if (!cells || !OPEN.test(cells[2] ?? "")) continue;
    const taken = recommendationOf.get(cells[0]);
    if (taken === undefined) continue;
    cells[2] = `${taken} - ${DECIDED_BY_THE_ROUND}`;
    lines[at] = `| ${cells.join(" | ")} |`;
  }
  return lines.join("\n");
}

/**
 * `[{ id, recommendation }]`, one per held row, in the table's own order —
 * and a refusal naming any row the reader cannot take.
 */
function heldRowsOf(markdown) {
  const read = decisionsIn(markdown);
  if (!read) return [];
  const recommended = new Map(
    readQuestions(markdown).map((one) => [one.id, one.recommended]),
  );
  const rows = [];
  for (const cells of tableRows(read.section.raw) ?? []) {
    const id = cells[0] ?? "";
    if (!DECISION_ROW.test(id) || !OPEN.test(cells[2] ?? "")) continue;
    const says = recommended.get(id);
    if (says === undefined) {
      refuse(
        id,
        "its cell names no role by the grammar, so nobody is being asked",
      );
    }
    if (!RECOMMENDED.test(says)) {
      refuse(id, "its cell recommends nothing, so there is nothing to take");
    }
    rows.push({ id, recommendation: says.replace(RECOMMENDED, "").trim() });
  }
  return rows;
}

/**
 * The `## Decisions` section, and the lines of the file it holds: the one
 * table the rows are read from, and the fence the rewrite stays inside.
 *
 * The section is found the way `readQuestions` finds it, so both read the
 * same table of the same file. Its lines run from the one after its heading
 * to the one before the next heading at its level or above — the same span
 * `raw` covers, read here as line numbers because the rewrite writes lines.
 */
function decisionsIn(markdown) {
  const roots = outline(markdown);
  const section = roots
    .flatMap((one) => (one.level === 1 ? one.children : [one]))
    .find((one) => /^Decisions\b/.test(one.heading));
  if (!section) return undefined;
  const next = flatten(roots).find(
    (one) => one.line > section.line && one.level <= section.level,
  );
  return {
    section,
    // `line` is the 1-based line of the heading, which is the 0-based index
    // of the line after it.
    from: section.line,
    until: next ? next.line - 1 : markdown.split("\n").length,
  };
}

const flatten = (sections) =>
  sections.flatMap((one) => [one, ...flatten(one.children)]);

function refuse(id, why) {
  throw new Error(
    `${id} is held and cannot be taken: ${why}. Write the cell as \`❓ <role> - recommended: <option>\`, or answer the row.`,
  );
}
