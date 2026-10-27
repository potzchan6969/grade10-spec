import { type Block, type PageAst, serializePage } from "../content/grammar";

/**
 * What a new page starts as. A capability page opens on the same two
 * paragraphs every one of them keeps — what it is, and how it looks — so a
 * reader finds theirs in the same place on every page.
 *
 * The prose is two paragraphs of one block, because that is what the grammar
 * has: prose runs between directives, so two adjacent placeholders are one
 * block however they are written.
 */

const OPENING = [
  "What this capability is for, and who relies on it. Say it in plain words.",
  "How it looks, and where to see it: add a figma card for the design and a story card for the built component.",
].join("\n\n");

export type NewPage = {
  title: string;
  /** A capability page opens on the shelf; every other kind opens empty. */
  capability?: boolean;
  /** The capability this page documents. */
  spec?: string;
};

export function newPageSource({ title, capability, spec }: NewPage): string {
  const ast: PageAst = {
    frontmatter: spec ? { title, spec } : { title },
    blocks: capability ? shelf() : [],
  };
  return serializePage(ast);
}

function shelf(): Block[] {
  return [{ type: "prose", markdown: OPENING }];
}
