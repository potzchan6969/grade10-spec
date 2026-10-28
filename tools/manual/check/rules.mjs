/*
 * RULE: a rule is a list item, its name in bold, so a case can trace it and
 * the manual can file its cases under it. A bold name opening a paragraph
 * reads the same but names no rule, and its cases fall back to the section.
 */
import { productPages } from "./context.mjs";

const FENCE = /^(`{3,}|~{3,})/;
const LOOSE_RULE = /^(?:(?:🚧|❓)\s*)?\*\*([^*]+?)\*\*\s*[-—–]\s/u;

/** Prose and callouts are the page; a flow's steps and a detail's depth hold
 * no rules. */
export function checkLooseRules(ctx, pages) {
  const products = productPages(ctx.roots);
  for (const page of pages) {
    if (!page.ast || !page.path.startsWith(products)) continue;
    for (const markdown of pageProse(page.ast.blocks)) {
      for (const line of unfenced(markdown)) {
        const loose = LOOSE_RULE.exec(line);
        if (!loose) continue;
        ctx.add(
          "rule",
          page.path,
          `**${loose[1]}** opens a paragraph — write it \`- **${loose[1]}** — …\` so its cases can trace it`,
        );
      }
    }
  }
}

function* pageProse(blocks) {
  for (const block of blocks) {
    if (block.type === "prose") yield block.markdown;
    else if (block.type === "callout") yield* pageProse(block.body);
  }
}

function* unfenced(markdown) {
  let fence = null;
  for (const line of markdown.split("\n")) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) fence = opened[1];
    else yield line;
  }
}
