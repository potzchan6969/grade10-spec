import { sectionSlug } from "../api/paths.ts";
import type { Block, PageAst } from "./grammar.ts";

const HEADING = /^##\s+(.+?)\s*$/;
const FENCE = /^(`{3,}|~{3,})/;

/**
 * The text one `## ` section is drawn from: its heading and the page's own
 * lines under it, to the next level-two heading.
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
        inside = sectionSlug(heading[1]) === slug;
        if (!inside) continue;
        found = true;
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
