import { type Block, type PageAst, serializePage } from "../content/grammar";

/**
 * What a new page starts as. A capability page opens on the shelf order every
 * one of them keeps — what it is, how it looks, the contract, acceptance — so
 * a reader finds theirs in the same place on every page. The ribbon and the
 * archived-changes timeline are automatic and are never scaffolded, and the
 * contract blocks are only laid down for a spec the store actually has: a
 * scaffold that fails the check the moment it is written is not a scaffold.
 *
 * The prose is two paragraphs of one block, because that is what the grammar
 * has: prose runs between directives, so two adjacent placeholders are one
 * block however they are written.
 */

const OPENING = [
  "What this capability is for, and who relies on it. Say it in plain words — the specs below carry the detail.",
  "How it looks, and where to see it: add a figma card for the design and a story card for the built component.",
].join("\n\n");

export type NewPage = {
  title: string;
  /** A capability page opens on the shelf; every other kind opens empty. */
  capability?: boolean;
  /** The spec this page documents, when the store already has one. */
  spec?: string;
};

export function newPageSource({ title, capability, spec }: NewPage): string {
  const ast: PageAst = {
    frontmatter: spec ? { title, spec } : { title },
    blocks: capability ? shelf(spec) : [],
  };
  return serializePage(ast);
}

function shelf(spec: string | undefined): Block[] {
  const opening: Block = { type: "prose", markdown: OPENING };
  if (!spec) return [opening];
  return [
    opening,
    { type: "spec", id: spec },
    { type: "journeys", id: spec },
    { type: "cases", id: spec },
  ];
}
