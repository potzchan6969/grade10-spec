/**
 * `<!-- equal-width -->` directly above a table makes every column share
 * width; `<!-- equal-width: 2,3 -->` names 1-based columns instead, leaving
 * the rest sized to their own content. The comment renders as nothing on
 * GitHub and everywhere else that isn't this remark plugin.
 *
 * "Sized to their own content" alongside columns forced equal is not
 * something the table auto-layout algorithm can express — an excluded
 * column's specified width competes with the marked ones for space instead
 * of standing aside for them. The `table` renderer works around this by
 * rendering the table as a CSS grid instead.
 */

/** Minimal mdast: only the shape this plugin walks and rewrites. */
type MdastNode = {
  type: string;
  value?: string;
  data?: { hProperties?: Record<string, unknown> };
  children?: MdastNode[];
};

const DIRECTIVE_RE = /^<!--\s*equal-width(?::\s*([\d,\s]+))?\s*-->$/;
export const EQUAL_WIDTH_PROPERTY = "equalWidthColumns";

function directiveSpec(value: string): string | null {
  const match = DIRECTIVE_RE.exec(value.trim());
  if (!match) return null;
  if (!match[1]) return "all";
  const columns = match[1]
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  return columns.length > 0 ? columns.join(",") : null;
}

function attach(nodes: MdastNode[]) {
  for (let i = nodes.length - 1; i >= 0; i -= 1) {
    const node = nodes[i];
    const next = nodes[i + 1];
    if (node.type === "html" && next?.type === "table") {
      const spec = directiveSpec(node.value ?? "");
      if (spec) {
        next.data = {
          ...next.data,
          hProperties: {
            ...next.data?.hProperties,
            [EQUAL_WIDTH_PROPERTY]: spec,
          },
        };
        nodes.splice(i, 1);
        continue;
      }
    }
    if (node.children) attach(node.children);
  }
}

/** Reads `equal-width` directives off the mdast tree onto the table each one
 * annotates, so the `table` renderer can size columns without re-parsing
 * markdown text itself. */
export function equalWidthTables() {
  return (tree: MdastNode) => {
    if (tree.children) attach(tree.children);
  };
}

type HeadedTable = {
  children?: { tagName?: string; children?: HeadRow[] }[];
};
type HeadRow = { tagName?: string; children?: { tagName?: string }[] };

/** The header row's cell count — the column count for the whole table.
 * mdast-to-hast interleaves whitespace text nodes between elements, so each
 * step filters by tag rather than assuming a position. */
export function columnCount(node?: HeadedTable): number {
  const head = node?.children?.find((c) => c.tagName === "thead");
  const row = head?.children?.find((c) => c.tagName === "tr");
  return row?.children?.filter((c) => c.tagName === "th").length ?? 0;
}

/**
 * A `grid-template-columns` track per column — `null` when the directive
 * names no valid column. Marked columns get an equal `1fr` share of the
 * table's own width; a column left out sizes to its own content
 * (`max-content`), which table auto-layout has no equivalent for — hence
 * rendering the table as a grid rather than fighting the table algorithm.
 */
export function equalWidthColumns(
  total: number,
  spec: string,
): string[] | null {
  if (total <= 0) return null;
  const indices =
    spec === "all"
      ? new Set(Array.from({ length: total }, (_, i) => i + 1))
      : new Set(
          spec
            .split(",")
            .map(Number)
            .filter((n) => Number.isInteger(n) && n >= 1 && n <= total),
        );
  if (indices.size === 0) return null;
  return Array.from({ length: total }, (_, i) =>
    indices.has(i + 1) ? "1fr" : "max-content",
  );
}
