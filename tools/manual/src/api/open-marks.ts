import type { Block } from "../content/grammar";
import type { ManualIndex, ParsedPage } from "./derive";
import { pagePath, slugify } from "./paths.ts";

/** One line a page marked ❓ or `TBC`: what nobody has confirmed, where it
 * sits, and the anchor that opens the page there. */
export type OpenMark = {
  page: ParsedPage;
  /** The `## ` section or the titled block the line sits under. */
  where?: { title: string; anchor: string };
  /** The line as written, list marker dropped; a table row as its cells. */
  text: string;
};

const OPEN = /❓|\bTBC\b/;
export const BUILDING = /🚧/;
const HEADING = /^##\s+(.+?)\s*$/;
const FENCE = /^(`{3,}|~{3,})/;
const LIST_MARKER = /^\s*(?:[-*]|\d+\.)\s+/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const TABLE_RULE = /^\s*\|?\s*:?-{3,}/;
const INLINE = /[*_]/g;

/** Every ❓ and `TBC` on a page, in reading order. */
export const openMarksOfPage = (page: ParsedPage): OpenMark[] =>
  marksOfPage(page, OPEN);

/** Every line carrying the mark, in reading order. */
export function marksOfPage(page: ParsedPage, mark: RegExp): OpenMark[] {
  if (!page.ast) return [];
  const marks: OpenMark[] = [];
  let section: OpenMark["where"];

  const scan = (markdown: string, where: OpenMark["where"] | null) => {
    for (const line of items(markdown)) {
      const heading = HEADING.exec(line);
      if (heading) {
        if (where === null) {
          const title = plain(heading[1]);
          section = { title, anchor: slugify(title) };
        }
        continue;
      }
      if (!mark.test(line) || TABLE_RULE.test(line)) continue;
      const text = textOf(line);
      if (text !== "") marks.push({ page, where: where ?? section, text });
    }
  };

  // `null` is the page's own prose, whose headings are the sections; a
  // titled block's body is read against that block, and an untitled one
  // against the section it sits in.
  const walk = (blocks: Block[], where: OpenMark["where"] | null) => {
    for (const block of blocks) {
      if (block.type === "prose") scan(block.markdown, where);
      else if ("body" in block) {
        walk(
          block.body,
          block.type === "detail"
            ? { title: block.title, anchor: `detail-${slugify(block.title)}` }
            : block.type === "example"
              ? {
                  title: block.title,
                  anchor: `example-${slugify(block.title)}`,
                }
              : (where ?? section),
        );
      }
    }
  };

  walk(page.ast.blocks, null);
  return marks;
}

const STARTS = [HEADING, FENCE, LIST_MARKER, TABLE_ROW, /^\s*:{2,}/];

/** The lines as items: a wrapped bullet or paragraph folded back into one
 * line, fenced code left out. */
function items(markdown: string): string[] {
  const found: string[] = [];
  let fence: string | null = null;
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
    if (line.trim() === "") {
      found.push("");
      continue;
    }
    const last = found.at(-1);
    if (last && last !== "" && !STARTS.some((start) => start.test(line))) {
      found[found.length - 1] = `${last} ${line.trim()}`;
    } else {
      found.push(line);
    }
  }
  return found;
}

/** The marks of every page under a product, pages in their nav order. */
export function openMarksForProduct(
  index: ManualIndex,
  productId: string,
): OpenMark[] {
  const dir = `${pagePath(index.manualDir, "products", productId)}/`;
  return index.pages
    .filter((page) => page.path.startsWith(dir) && page.route)
    .sort(byOrder)
    .flatMap(openMarksOfPage);
}

function byOrder(a: ParsedPage, b: ParsedPage): number {
  const order = (page: ParsedPage) =>
    page.path.endsWith("/index.md")
      ? -1
      : (page.ast?.frontmatter.order ?? Number.POSITIVE_INFINITY);
  return order(a) - order(b) || a.path.localeCompare(b.path);
}

function textOf(line: string): string {
  const row = TABLE_ROW.exec(line);
  if (row) {
    return row[1]
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "")
      .join(" · ");
  }
  return line.replace(LIST_MARKER, "").trim();
}

function plain(heading: string): string {
  return heading.replace(INLINE, "").replace(/`/g, "").trim();
}
