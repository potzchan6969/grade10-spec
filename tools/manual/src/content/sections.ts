import { sectionSlug } from "../api/paths.ts";
import {
  type Block,
  CONTAINER_CLOSE_RE,
  CONTAINER_OPEN_RE,
  type PageAst,
} from "./grammar.ts";

const HEADING = /^(#{2,4})\s+(.+?)\s*$/;
const FENCE = /^(`{3,}|~{3,})/;

/**
 * The text one product section is drawn from: its heading and the page's own
 * lines under it, to the next heading at the same or a higher level. PRDs use
 * `##` capability sections with focused `###` and `####` outcome sections.
 *
 * One boundary, and the same one the questions under a section are counted by.
 * Only the page's own prose carries a heading that ends a section: a `### `
 * under it is inside the section, a `## ` inside a code fence is text, and a
 * `## ` inside a callout or a flow is that block's own — a flow writes its
 * steps as headings, so reading them as sections would cut the page up at
 * every step. A callout's and a flow's body are the section's lines, because
 * the section is where their author put them; a `detail` and an `example` are
 * left to the page, for the reason `markQuestions` leaves their rows there.
 *
 * Undefined where the page carries no such section, so a caller hashing it
 * cannot mistake a link nobody kept for a section with nothing in it.
 *
 * Beside the grammar rather than in `src/api`, because both halves of the
 * package read it: the app, where a change's questions are counted, and the
 * store, where what is before an artifact is hashed. It asks for the parsed
 * page and nothing else about it.
 */
export function sectionTextOf(
  page: { ast: PageAst | null },
  slug: string,
): string | undefined {
  if (!page.ast) return undefined;
  const lines: string[] = [];
  let inside = false;
  let found = false;
  let level = 0;

  /** The page's own prose: its headings are what open and close a section. */
  const scan = (markdown: string) => {
    let fence: string | null = null;
    for (const line of markdown.split("\n")) {
      if (fence !== null) {
        if (line.startsWith(fence)) fence = null;
        if (inside) lines.push(line);
        continue;
      }
      const opened = FENCE.exec(line);
      if (opened) fence = opened[1];
      const heading = opened ? null : HEADING.exec(line);
      if (heading) {
        const headingLevel = heading[1].length;
        if (sectionSlug(heading[2]) === slug) {
          inside = true;
          found = true;
          level = headingLevel;
        } else if (inside && headingLevel <= level) {
          inside = false;
        }
        if (!inside) continue;
      }
      if (inside) lines.push(line);
    }
  };

  /** A block's own lines, which no heading of theirs opens or closes. */
  const held = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.type === "prose") {
        if (inside) lines.push(block.markdown);
      } else if (block.type === "callout" || block.type === "flow") {
        held(block.body);
      }
    }
  };

  for (const block of page.ast.blocks) {
    if (block.type === "prose") scan(block.markdown);
    else if (block.type === "callout" || block.type === "flow")
      held(block.body);
  }
  return found ? lines.join("\n").trimEnd() : undefined;
}

/**
 * The lines one section spans in its page, 1-based and inclusive: from its
 * heading to the last filled line before the next heading of the page's own
 * prose at the same or a higher level - `sectionTextOf`'s boundary. A block
 * inside the span is the section's whole, a `detail` and an `example`
 * included, so a reader given the lines reads what the hash reads and the
 * blocks beside it; a heading inside a block neither opens nor closes one.
 *
 * Read off the text rather than the parsed page, because a parsed block keeps
 * no line of its own. Undefined where the page carries no such section.
 */
export function sectionLinesOf(
  text: string,
  slug: string,
): { start: number; end: number } | undefined {
  const lines = text.split("\n");
  let fence: string | null = null;
  let inBlock = false;
  let start = 0;
  let level = 0;
  let end = lines.length;
  const body = lines[0] === "---" ? lines.indexOf("---", 1) + 1 : 0;
  for (let i = body; i < lines.length; i += 1) {
    const line = lines[i];
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) {
      fence = opened[1];
      continue;
    }
    if (inBlock) {
      if (CONTAINER_CLOSE_RE.test(line)) inBlock = false;
      continue;
    }
    if (CONTAINER_OPEN_RE.test(line)) {
      inBlock = true;
      continue;
    }
    const heading = HEADING.exec(line);
    if (!heading) continue;
    if (start === 0) {
      if (sectionSlug(heading[2]) === slug) {
        start = i + 1;
        level = heading[1].length;
      }
    } else if (heading[1].length <= level) {
      end = i;
      break;
    }
  }
  if (start === 0) return undefined;
  while (end > start && lines[end - 1].trim() === "") end -= 1;
  return { start, end };
}
