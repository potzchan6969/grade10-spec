/**
 * A remark plugin that hides a rule's explicit id - `{#earn-once}` at the
 * end of a line, a bullet or a table row - and makes it the anchor of the
 * paragraph, list item or row it closes, so `page#earn-once` links to the
 * rule a test cites. `scripts/pages/pages.mjs` reads the same pattern.
 */

/** Minimal mdast: only the shape this plugin walks and tags. */
type MdastNode = {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> };
};

export const RULE_ID = /\s*\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}/g;

/** Strips every id from the text under `node` and returns the last one. */
function strip(node: MdastNode): string | undefined {
  let found: string | undefined;
  if (node.type === "text" && node.value !== undefined) {
    node.value = node.value.replace(RULE_ID, (_all, id: string) => {
      found = id;
      return "";
    });
    return found;
  }
  if (node.type === "list" || node.type === "code") return undefined;
  for (const child of node.children ?? []) {
    found = strip(child) ?? found;
  }
  return found;
}

function anchor(node: MdastNode, id: string | undefined): void {
  if (id === undefined) return;
  node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
}

function walk(nodes: MdastNode[]): void {
  for (const node of nodes) {
    if (node.type === "paragraph" || node.type === "tableRow") {
      anchor(node, strip(node));
    } else if (node.type === "listItem") {
      let id: string | undefined;
      for (const child of node.children ?? []) {
        if (child.type === "list") walk([child]);
        else id = strip(child) ?? id;
      }
      anchor(node, id);
    } else if (node.children) {
      walk(node.children);
    }
  }
}

export function ruleIds() {
  return (tree: { children?: MdastNode[] }) => {
    if (tree.children) walk(tree.children);
  };
}
