import type { Block, PageAst } from "../content/grammar.ts";
import { sectionSlug, slugify } from "./paths.ts";

/**
 * This module is the one reader of the ❓/`TBC` grammar, so it stays reachable
 * from plain node — the store marks a change's questions with it — and never
 * imports `derive.ts`, which parses pages for the app and cannot go there.
 * The least a page needs to be scanned for marks is its path and its parsed
 * AST: the app's own `ParsedPage`, carrying its route and its parse error,
 * satisfies this and so does the store's own page plus the AST it keeps
 * beside it, which is why the store can mark a change's questions without
 * building the app's full page shape.
 */
export type MarkedPage = { path: string; ast: PageAst | null };

/** One line a page marked ❓ or `TBC`: what nobody has confirmed, where it
 * sits, and the anchor that opens the page there. Carries back whatever page
 * shape it was read from — the app's own `ParsedPage`, with its route, where
 * a mark opens the page, or the store's leaner `MarkedPage`, where nothing
 * here reads more of the page than its path. */
export type OpenMark<P extends MarkedPage = MarkedPage> = {
  page: P;
  /** The `## ` section or the titled block the line sits under. */
  where?: { title: string; anchor: string };
  /** Slug of the `## ` section the line sits under, as a proposal's
   * `## References` link names it. Absent above the page's first heading. */
  section?: string;
  /** The line as written, list marker dropped; a table row as its cells. */
  text: string;
};

/**
 * What may sit before a mark that leads its line: the whitespace and the
 * markers that open a line rather than say anything on it — a list marker, a
 * blockquote's `>`, a bold or italic opener, a backtick — and a table cell's
 * own `|`.
 */
const LEADS = String.raw`(?:^|\|)[\s>]*(?:(?:[-*+]|\d+\.)[\s>]*)?[*_~\`]*\s*`;

/**
 * A mark leads its line, or a cell of its row: `- ❓ **Term** — …`, a
 * paragraph opening on the mark, `| ❓ Open |`. A ❓ inside a sentence is
 * prose about the grammar — "or a ❓ line on the page" — and nobody owes it an
 * answer, so it is read as words.
 */
const OPEN = new RegExp(`${LEADS}(?:❓|\\bTBC\\b)`);
export const BUILDING = /🚧/;
const HEADING = /^##\s+(.+?)\s*$/;
const FENCE = /^(`{3,}|~{3,})/;
const LIST_MARKER = /^\s*(?:[-*]|\d+\.)\s+/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const TABLE_RULE = /^\s*\|?\s*:?-{3,}/;
const INLINE = /[*_]/g;

/** Every ❓ and `TBC` on a page, in reading order. */
export const openMarksOfPage = <P extends MarkedPage>(page: P): OpenMark<P>[] =>
  marksOfPage(page, OPEN);

/** Every line carrying the mark, in reading order. */
export function marksOfPage<P extends MarkedPage>(
  page: P,
  mark: RegExp,
): OpenMark<P>[] {
  if (!page.ast) return [];
  const marks: OpenMark<P>[] = [];
  let section: OpenMark<P>["where"];

  const scan = (markdown: string, where: OpenMark<P>["where"] | null) => {
    for (const line of items(markdown)) {
      const heading = HEADING.exec(line);
      if (heading) {
        if (where === null) {
          section = {
            title: plain(heading[1]),
            anchor: sectionSlug(heading[1]),
          };
        }
        continue;
      }
      if (!mark.test(line) || TABLE_RULE.test(line)) continue;
      const text = textOf(line);
      if (text === "") continue;
      marks.push({
        page,
        where: where ?? section,
        ...(section ? { section: section.anchor } : {}),
        text,
      });
    }
  };

  // `null` is the page's own prose, whose headings are the sections; a
  // titled block's body is read against that block, and an untitled one
  // against the section it sits in.
  const walk = (blocks: Block[], where: OpenMark<P>["where"] | null) => {
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
