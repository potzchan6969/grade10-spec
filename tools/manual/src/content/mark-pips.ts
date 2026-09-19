/**
 * A remark plugin that finds every 🚧 line under a `## ` section of the
 * page's own top-level prose, and tags it with that section's slug — the
 * same boundary `SectionChanges` reads under the heading itself, so the pip
 * a line wears is exactly whichever in-flight change's proposal linked the
 * section it sits in.
 *
 * Attached to the mdast tree rather than read back off the rendered text: a
 * tight list unwraps its paragraph into the `<li>` itself, dropping any data
 * held on that inner paragraph, so the tag goes on the list item node, which
 * always survives to become the `<li>` the `li` renderer reads `node.properties`
 * from. A standalone 🚧 sentence is tagged on its own paragraph, which is
 * never unwrapped outside a list.
 *
 * `markSections` takes no options — unified calls a remark plugin's own
 * factory once at attach time and then its returned transformer once per
 * parse, so a plugin threading a per-render argument through that factory
 * gets called as the transformer itself. `slugify` is the one function every
 * heading in this app is slugged by, so it is imported here rather than
 * passed in.
 */
import { slugify } from "../api/paths.js";

/** Minimal mdast: only the shape this plugin walks and tags. */
type MdastNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> };
};

export const MARK_SECTION_PROPERTY = "markSection";

const BUILDING = /^🚧/;

function plainText(node: MdastNode): string {
  if (node.value !== undefined) return node.value;
  return (node.children ?? []).map(plainText).join("");
}

function tag(node: MdastNode, slug: string | undefined): void {
  if (slug === undefined || !BUILDING.test(plainText(node).trim())) return;
  node.data = {
    ...node.data,
    hProperties: { ...node.data?.hProperties, [MARK_SECTION_PROPERTY]: slug },
  };
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

function walk(nodes: MdastNode[], slugOf: (text: string) => string): void {
  let slug: string | undefined;
  for (const node of nodes) {
    if (node.type === "heading" && node.depth === 2) {
      slug = slugOf(plainText(node));
      continue;
    }
    if (node.type === "paragraph") tag(node, slug);
    else if (node.type === "list") tagList(node, slug);
  }
}

/** The plugin. */
export function markSections() {
  return (tree: { children?: MdastNode[] }) => {
    if (tree.children) walk(tree.children, slugify);
  };
}
