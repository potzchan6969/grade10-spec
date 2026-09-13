/*
 * RULE: a page is the essence a reader expands from, never the expansion.
 * Past the style's budget it has become the spec, the suite or the
 * architecture doc restated: too many lines of prose, a section that opens
 * on an essay, an engineer block written as a design note, or a 🚧 buried in
 * a step or a sentence. Every finding here is a warning — it asks for the
 * rewrite and never blocks a fold.
 */
import { outline } from "../src/store/markdown.mts";
import { productPages } from "./context.mjs";

/** Non-blank lines of prose outside `example` and `detail` bodies. The three
 * pages the style says to copy sit between 75 and 90; the pages a reader
 * names as heavy start above 120. */
export const PROSE_CEILING = 120;

/** Sentences a `## ` section may open on before its first item. The style
 * asks for two; the check allows six while the standing tail is cut. */
export const LEAD_CEILING = 6;

const FENCE = /^(`{3,}|~{3,})/;
const HEADING = /^#{1,6}\s/;
const LIST_MARKER = /^\s*(?:[-*]|\d+\.)\s+/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const DIRECTIVE = /^\s*:{2,}/;
const BUILDING = /🚧/;
/** A mark that starts the line, after any list marker, quote or bold. */
const MARK_LEADS = /^\s*(?:>\s*)?(?:(?:[-*]|\d+\.)\s+)?(?:\*\*)?🚧/;
/** A sentence ends at `.`, `!` or `?`, an optional closing quote or bracket,
 * whitespace, then a capital, a backtick, a star, a bracket or an opening
 * quote. `e.g. foo`, `$1.2` and `2026/01/03` never split. */
const SENTENCE_END = /[.!?]["'”’)\]]*\s+(?=[A-Z`*(["“])/g;

export function checkDense(ctx, pages) {
  const products = productPages(ctx.roots);
  for (const page of pages) {
    if (!page.ast || !page.path.startsWith(products)) continue;
    const add = (reason) => ctx.add("dense", page.path, reason);
    checkProse(page.ast.blocks, add);
    checkLeads(page.ast.blocks, add);
    checkEngineerBlocks(page.ast.blocks, add);
    checkBuriedMarks(page.ast.blocks, add);
  }
}

/** Prose lines outside the blocks the style folds: an `example` is a checked
 * ledger and a `detail` is depth for one audience, so neither costs the
 * reader who does not open it. A flow and a callout are the page. */
function checkProse(blocks, add) {
  const count = (items) =>
    items.reduce((sum, block) => {
      if (block.type === "prose") return sum + proseLines(block.markdown);
      if (block.type === "flow" || block.type === "callout") {
        return sum + count(block.body);
      }
      return sum;
    }, 0);
  const lines = count(blocks);
  if (lines > PROSE_CEILING) {
    add(
      `${lines} lines of prose outside its examples and details — the style's ceiling is ${PROSE_CEILING}`,
    );
  }
}

/** A `## ` section opens with its rule in a sentence or two, then its items.
 * Read from top-level prose, the way the renderer anchors sections. */
function checkLeads(blocks, add) {
  for (const block of blocks) {
    if (block.type !== "prose") continue;
    for (const section of outline(block.markdown)) {
      if (section.level !== 2) continue;
      const sentences = countSentences(lead(section.body));
      if (sentences > LEAD_CEILING) {
        add(
          `\`${section.heading}\` opens on ${sentences} sentences before its items — two is the style's limit`,
        );
      }
    }
  }
}

/** The lines before the section's first item, table row, sub-heading or
 * directive, folded into one text. */
function lead(body) {
  const found = [];
  for (const line of unfenced(body)) {
    if (
      line.trim() === "" ||
      LIST_MARKER.test(line) ||
      TABLE_ROW.test(line) ||
      HEADING.test(line) ||
      DIRECTIVE.test(line)
    ) {
      if (found.length > 0 && line.trim() !== "") break;
      if (found.length > 0) continue;
      if (line.trim() === "") continue;
      break;
    }
    found.push(line.trim());
  }
  return found.join(" ");
}

function countSentences(text) {
  if (text === "") return 0;
  return (text.match(SENTENCE_END) ?? []).length + 1;
}

/** An engineer block is a code map: items of a name and a link. A paragraph
 * in one is a design note, and the architecture doc is where that lives. */
function checkEngineerBlocks(blocks, add) {
  for (const block of everyContainer(blocks)) {
    if (block.type !== "detail" || block.for !== "engineer") continue;
    const paragraphs = block.body
      .filter((item) => item.type === "prose")
      .reduce((sum, item) => sum + countParagraphs(item.markdown), 0);
    if (paragraphs > 0) {
      add(
        `engineer block \`${block.title}\` holds ${paragraphs === 1 ? "a paragraph" : `${paragraphs} paragraphs`} — a code map is names and links`,
      );
    }
  }
}

/** A run of non-blank lines whose first line is neither a heading, an item,
 * a table row nor a directive. */
function countParagraphs(markdown) {
  let count = 0;
  let open = false;
  for (const line of unfenced(markdown)) {
    if (line.trim() === "") {
      open = false;
      continue;
    }
    if (open) continue;
    open = true;
    if (
      !HEADING.test(line) &&
      !LIST_MARKER.test(line) &&
      !TABLE_ROW.test(line) &&
      !DIRECTIVE.test(line)
    ) {
      count += 1;
    }
  }
  return count;
}

/** A 🚧 starts the line of one outcome, in the section that owns it. Inside a
 * flow step it marks a scenario; mid-line it marks a clause. Both belong to
 * the delta, so the page says which line to lift or drop. */
function checkBuriedMarks(blocks, add) {
  const walk = (items, inFlow) => {
    for (const block of items) {
      if (block.type === "prose") {
        for (const line of unfenced(block.markdown)) {
          if (!BUILDING.test(line)) continue;
          if (inFlow) {
            add(
              `🚧 \`${shorten(line)}\` sits inside the flow \`${inFlow}\` — a step is a scenario's home; the outcome's line is its section's`,
            );
          } else if (!MARK_LEADS.test(line) && !marksCells(line)) {
            add(
              `🚧 mid-line in \`${shorten(line)}\` — a mark starts an outcome's line, or the line is the delta's`,
            );
          }
        }
      } else if (block.type === "flow") {
        walk(block.body, block.title);
      } else if (block.type === "callout") {
        walk(block.body, inFlow);
      }
    }
  };
  walk(blocks, null);
}

/** A table row may lead a cell with the mark. */
function marksCells(line) {
  const row = TABLE_ROW.exec(line);
  if (!row) return false;
  return row[1]
    .split("|")
    .every((cell) => !BUILDING.test(cell) || /^\s*(?:\*\*)?🚧/.test(cell));
}

function proseLines(markdown) {
  let count = 0;
  for (const line of unfenced(markdown)) {
    if (line.trim() !== "") count += 1;
  }
  return count;
}

function* unfenced(markdown) {
  let fence = null;
  for (const line of markdown.split("\n")) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) {
      fence = opened[1];
      continue;
    }
    yield line;
  }
}

function* everyContainer(blocks) {
  for (const block of blocks) {
    if (!("body" in block)) continue;
    yield block;
    yield* everyContainer(block.body);
  }
}

const SHOWN = 60;
const INLINE = /[*_`]/g;

function shorten(line) {
  const plain = Array.from(
    line
      .replace(/^\s*(?:[-*]|\d+\.)\s+/, "")
      .replace(/^🚧\s*/, "")
      .replace(INLINE, "")
      .trim(),
  );
  return plain.length <= SHOWN
    ? plain.join("")
    : `${plain
        .slice(0, SHOWN - 1)
        .join("")
        .trimEnd()}…`;
}
