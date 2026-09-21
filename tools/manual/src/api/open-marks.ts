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
 * What may sit before a mark and leave it still leading: the start of the
 * line, a table cell's own `|`, or a sentence just ended; then whitespace, a
 * blockquote's `>`, a list marker, and the lead term at most — up to 40
 * characters carrying none of `—`, `,`, `;`, `:`, `.`, `!` or `?`.
 */
const LEADS = String.raw`(?:^|\||(?<=[.]\s))[\s>]*(?:(?:[-*+]|\d+\.)[\s>]*)?[^—,;:.!?|]{0,40}?`;

/**
 * Counted: a mark leading its line, its bullet or its cell, after the key
 * term at most — `- ❓ **Term** — …`, `- **Birthday month** \`TBC\` — …`,
 * `| Birthday \`TBC\` | …`, a paragraph or a sentence opening on the mark.
 * Read as words: a mark further into a sentence, past a comma, a semicolon, a
 * dash, a colon or more than 40 characters of running text — "or a ❓ line on
 * the page" is prose about the grammar, and nobody owes it an answer.
 */
export const OPEN = new RegExp(`${LEADS}(?:❓|\\bTBC\\b)`);

/** Every ❓ and `TBC` a page writes, wherever on its line it sits. The check
 * reads this against what `openMarksOfPage` counts, so an author learns a
 * mark of theirs is being read as words. */
export const MARKED = /❓|\bTBC\b/;
export const BUILDING = /🚧/;

/** Both marks a change delivers, counted: a 🚧 line, which the pips read
 * unanchored, and a ❓ or `TBC` leading its line the way `openMarksOfPage`
 * counts one. `MARKED` is not in it — a mark further into a sentence is a
 * page writing about the grammar, and a change delivers no such line. */
export const DELIVERED = new RegExp(`${BUILDING.source}|${OPEN.source}`);
const HEADING = /^##\s+(.+?)\s*$/;
const FENCE = /^(`{3,}|~{3,})/;
const LIST_MARKER = /^\s*(?:[-*]|\d+\.)\s+/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const TABLE_RULE = /^\s*\|?\s*:?-{3,}/;
const INLINE = /[*_]/g;

/** Every ❓ and `TBC` on a page, in reading order. */
export const openMarksOfPage = <P extends MarkedPage>(page: P): OpenMark<P>[] =>
  marksOfPage(page, OPEN);

/**
 * The marks of one page that belong to a `## ` section of it, by that
 * section's slug.
 *
 * The one boundary a change is read on, walked once per page however many
 * sections a caller asks about: the store writes a change's open questions
 * from it and the change page lists the lines the change marks from it, so a
 * hand's message and a reviewer's screen can never read one page two ways.
 *
 * A mark under a `detail` or an `example` is the page's own and belongs to no
 * section — a `Product decisions` table carries what the page keeps against
 * every change that ever touched it, and reading its rows as one change's
 * would hand each change every question anybody has left there.
 */
export function marksBySection<P extends MarkedPage>(
  page: P,
  mark: RegExp,
): Map<string, OpenMark<P>[]> {
  const bySection = new Map<string, OpenMark<P>[]>();
  for (const one of marksOfPage(page, mark)) {
    const anchor = one.where?.anchor;
    if (anchor === undefined || anchor !== one.section) continue;
    bySection.set(anchor, [...(bySection.get(anchor) ?? []), one]);
  }
  return bySection;
}

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
