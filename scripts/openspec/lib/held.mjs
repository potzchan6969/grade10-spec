/**
 * A change's held rows: a `## Decisions` row whose Decided cell opens with
 * ❓ waits on a person, until it is answered or waved through with its
 * recommendation (Q59, Q60). `plan-land.mjs` is the only caller — it refuses
 * the landing naming every held row, unless `--with-recommendations` takes
 * them all as recommended and writes the rewrite into the landing commit.
 *
 * The rows are read through the manual's own question reader,
 * `readQuestions` in `tools/manual/src/store/read-changes.mts` — the same
 * reader `My turn`, the digest and the ❓ counts read, over the same table
 * reader every other table of this store is read with. There is no second
 * parser here: two readers of one table drift the day a column moves.
 *
 * Pure over the markdown text, so it is tested without a change or a git
 * checkout of its own.
 */
import { cellsOf } from "../../../tools/manual/src/store/markdown.mts";
import { readQuestions } from "../../../tools/manual/src/store/read-changes.mts";

/** `❓ <role> - recommended: <option>` is how the interview writes what it
 * would do; a cell that says it another way is its own recommendation. */
const RECOMMENDED = /^recommended:\s*/;

/** What a row taken as recommended reads afterwards: the option, and that
 * nobody's word settled it (Q60). */
const DECIDED_BY_THE_ROUND = "decided by the round";

/**
 * `[{ id, role, recommendation }]`, one per held row, in the table's own
 * order.
 */
export function heldRowsOf(markdown) {
  return readQuestions(markdown).map(({ id, role, recommended }) => ({
    id,
    role,
    recommendation: recommended.replace(RECOMMENDED, "").trim(),
  }));
}

/**
 * The markdown with every held row's Decided cell rewritten as
 * `<option> - decided by the round` — what `land with recommendations` takes
 * (Q60), and what the landing commit carries. The markdown is returned
 * unchanged where nothing is held.
 */
export function takeRecommendations(markdown) {
  const held = heldRowsOf(markdown);
  if (held.length === 0) return markdown;
  const recommendationOf = new Map(
    held.map((row) => [row.id, row.recommendation]),
  );
  return markdown
    .split("\n")
    .map((line) => {
      const cells = cellsOf(line);
      const taken = cells && recommendationOf.get(cells[0]);
      if (!taken) return line;
      cells[2] = `${taken} - ${DECIDED_BY_THE_ROUND}`;
      return `| ${cells.join(" | ")} |`;
    })
    .join("\n");
}
