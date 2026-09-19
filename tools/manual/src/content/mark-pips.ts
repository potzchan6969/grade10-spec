/**
 * A remark plugin that finds every 🚧 line in one prose block and tags it
 * with the enclosing `## ` section's slug — the same boundary `open-marks.ts`
 * reads for `marksOfPage`, so the pip a line wears is exactly whichever
 * in-flight change's proposal linked the section it sits in.
 *
 * `BUILDING` is imported rather than redefined: `open-marks.ts` tests it
 * unanchored, so a 🚧 that opens a sentence rather than a line is still a
 * counted mark there, and a pip that used a stricter copy would tag fewer
 * lines than `marksOfPage(page, BUILDING)` counts.
 *
 * A page is rendered one prose block at a time — a tight list unwraps into
 * `<li>`s the renderer reads `node.properties` from, and a container's body is
 * its own block — so this plugin has no memory of a heading an earlier
 * sibling carried or of the section a callout, a detail, an example or a flow
 * is itself nested under. `sectionSeedOf` supplies that: the section carried
 * into the one block this plugin is asked to walk, and whether the walk is
 * locked against opening a new one there — every block but a page's own
 * top-level prose is locked, so nothing nested in a container, a flow's own
 * step heading among them, can start a section of its own. Attached to the
 * mdast tree rather than read back off the rendered text, for the tight-list
 * reason above; a standalone 🚧 sentence is tagged on its own paragraph,
 * which is never unwrapped outside a list.
 *
 * The seed is threaded as the plugin's own options, in the `[plugin, options]`
 * form `remarkPlugins` takes: unified calls the factory once at attach time
 * with the options it was given, so a fresh seed each render is a fresh
 * attach rather than a state a shared instance would have to be told about
 * later. A mark above a page's first `## ` heading carries no seed and wears
 * no pip — the page names no section for it to belong to, the same reason
 * `marksOfPage` gives such a line no `section` at all.
 */
import { BUILDING } from "../api/open-marks.js";
import { sectionSlug, slugify } from "../api/paths.js";
import type { Block, BodyItem, PageAst, ProseBlock } from "./grammar.ts";

/** Minimal mdast: only the shape this plugin walks and tags. */
type MdastNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> };
};

export const MARK_SECTION_PROPERTY = "markSection";

function plainText(node: MdastNode): string {
  if (node.value !== undefined) return node.value;
  return (node.children ?? []).map(plainText).join("");
}

function setSection(node: MdastNode, slug: string): void {
  node.data = {
    ...node.data,
    hProperties: { ...node.data?.hProperties, [MARK_SECTION_PROPERTY]: slug },
  };
}

function tag(node: MdastNode, slug: string | undefined): void {
  if (slug === undefined || !BUILDING.test(plainText(node).trim())) return;
  setSection(node, slug);
}

/** A list's own items, one level of nesting — a sub-list still reads as the
 * same section as the item that holds it. */
function tagList(list: MdastNode, slug: string | undefined): void {
  for (const item of list.children ?? []) {
    tag(item, slug);
    for (const child of item.children ?? []) {
      if (child.type === "list") tagList(child, slug);
    }
  }
}

/** A table's own rows: the row itself is tagged, so `markdown.tsx`'s `tr`
 * carries the property and appends the pip to its own last cell — there is
 * no single node react-markdown renders for the row's own text the way a
 * paragraph or a list item gives one. */
function tagTable(table: MdastNode, slug: string | undefined): void {
  for (const row of table.children ?? []) {
    if (row.type === "tableRow") tag(row, slug);
  }
}

function walk(
  nodes: MdastNode[],
  slugOf: (text: string) => string,
  seed: SectionSeed,
): void {
  let slug = seed.section;
  for (const node of nodes) {
    if (node.type === "heading" && node.depth === 2) {
      if (!seed.locked) slug = slugOf(plainText(node));
      continue;
    }
    if (node.type === "paragraph") tag(node, slug);
    else if (node.type === "list") tagList(node, slug);
    else if (node.type === "table") tagTable(node, slug);
  }
}

/** The section one block inherits, and whether its own top-level headings may
 * change it — `MarkdownView`'s own options for `markSections`. */
export type SectionSeed = {
  section: string | undefined;
  locked: boolean;
};

const NO_SEED: SectionSeed = { section: undefined, locked: false };

/** The plugin, its seed passed as `[markSections, seed]` in `remarkPlugins`. */
export function markSections(seed: SectionSeed = NO_SEED) {
  return (tree: { children?: MdastNode[] }) => {
    if (tree.children) walk(tree.children, slugify, seed);
  };
}

const HEADING = /^##\s+(.+?)\s*$/;
const FENCE = /^(`{3,}|~{3,})/;

/**
 * The section a specific prose block inherits, found by walking the page's
 * own blocks in the order `open-marks.ts` reads them for its `.section`
 * field: a top-level `## ` heading opens one, and it carries forward across
 * a container and into everything nested inside it — locked there, so
 * nothing inside can open a new one of its own.
 *
 * Reads the page's own parsed blocks rather than the block being rendered,
 * because a remark plugin scoped to one block's own text cannot see a
 * heading an earlier sibling carried, or know it is nested under one at all.
 * `undefined` where the target sits above the page's first `## ` heading, or
 * where the page carries no parse to walk.
 */
export function sectionSeedOf(
  ast: PageAst | null,
  target: ProseBlock,
): SectionSeed {
  let section: string | undefined;
  let found: SectionSeed | undefined;

  const scan = (markdown: string) => {
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
      const heading = HEADING.exec(line);
      if (heading) section = sectionSlug(heading[1]);
    }
  };

  const walkBlocks = (items: (Block | BodyItem)[], locked: boolean): void => {
    for (const item of items) {
      if (found) return;
      if (item === target) {
        found = { section, locked };
        return;
      }
      if (item.type === "prose") {
        if (!locked) scan(item.markdown);
      } else if ("body" in item) {
        walkBlocks(item.body, true);
      }
    }
  };

  if (ast) walkBlocks(ast.blocks, false);
  return found ?? NO_SEED;
}
