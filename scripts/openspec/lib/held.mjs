/**
 * A change's held rows: a `## Decisions` row whose Decided cell opens with
 * ❓ waits on a person, until it is answered or waved through with its
 * recommendation (Q59, Q60). `plan-land.mjs` is the only caller — it refuses
 * the landing naming every held row, unless `--with-recommendations` takes
 * them all as recommended and stages the rewrite in the landing commit.
 *
 * Pure over the markdown text, so it is tested without a change or a git
 * checkout of its own.
 */

const HEADING = /^##\s+Decisions\s*$/;
const ANY_HEADING = /^#{1,6}\s+\S/;
const RECOMMENDED = /^❓\s*(\S+)\s*-\s*recommended:\s*([\s\S]*)$/;

/**
 * `[{ id, role, recommendation, line }]`, one per held row, in the table's
 * own order. `line` is the row's own source line, kept so `takeRecommendations`
 * can find it again without re-parsing.
 */
export function heldRowsOf(markdown) {
  const held = [];
  let inTable = false;
  let rowsSeen = 0;
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (HEADING.test(trimmed)) {
      inTable = true;
      rowsSeen = 0;
      continue;
    }
    if (!inTable) continue;
    if (ANY_HEADING.test(trimmed)) break;
    if (!trimmed.startsWith("|")) continue;
    rowsSeen += 1;
    // Row 1 is the header (`| Q | Asked | Decided | Instead of |`), row 2 its
    // `---` separator: neither is a decision.
    if (rowsSeen <= 2) continue;
    const cells = cellsOf(line);
    const decided = (cells[2] ?? "").trim();
    if (!decided.startsWith("❓")) continue;
    const match = RECOMMENDED.exec(decided);
    held.push({
      id: (cells[0] ?? "").trim(),
      role: match?.[1],
      recommendation: match
        ? match[2].trim()
        : decided.replace(/^❓\s*/, "").trim(),
      line,
    });
  }
  return held;
}

/**
 * The markdown with every held row's Decided cell replaced by its
 * recommended option — what `land with recommendations` takes (Q60). The
 * markdown is returned unchanged where nothing is held.
 */
export function takeRecommendations(markdown) {
  const held = heldRowsOf(markdown);
  if (held.length === 0) return markdown;
  const recommendationOf = new Map(
    held.map((row) => [row.line, row.recommendation]),
  );
  return markdown
    .split("\n")
    .map((line) =>
      recommendationOf.has(line)
        ? decidedAs(line, recommendationOf.get(line))
        : line,
    )
    .join("\n");
}

/** A table row's own cells, in order, exactly as written between its pipes —
 * `| Q19 | ... |` keeps each cell's own leading and trailing space, so
 * rewriting one cell and rejoining reproduces the row's original style. */
function cellsOf(line) {
  const trimmed = line.trim();
  return trimmed.replace(/^\|/, "").replace(/\|$/, "").split("|");
}

/** `line` with its Decided cell (the third column) replaced by
 * `recommendation`, every other cell untouched. */
function decidedAs(line, recommendation) {
  const cells = cellsOf(line);
  cells[2] = ` ${recommendation} `;
  return `|${cells.join("|")}|`;
}
