import { sectionSlug } from "../api/paths.ts";
import type { PageAst } from "./grammar.ts";

const HEADING = /^##\s+(.+?)\s*$/;

/**
 * The text one `## ` section is drawn from: its heading and the page's own
 * prose under it, to the next level-two heading. A `### ` under it is inside
 * the section — only a `## ` ends one — and a titled block is left to the
 * page, for the reason `marksUnder` leaves its rows there.
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
  for (const block of page.ast.blocks) {
    if (block.type !== "prose") continue;
    for (const line of block.markdown.split("\n")) {
      const heading = HEADING.exec(line);
      if (heading) {
        inside = sectionSlug(heading[1]) === slug;
        if (!inside) continue;
        found = true;
      }
      if (inside) lines.push(line);
    }
  }
  return found ? lines.join("\n").trimEnd() : undefined;
}
