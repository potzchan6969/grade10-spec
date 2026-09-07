import type { ManualIndex } from "../api/derive";
import type { Block } from "../content/grammar";

/**
 * What the attribute fields offer. Every list comes from the snapshot — spec
 * ids from the store, story ids and asset paths from what the manual already
 * uses — so nothing here is a hand-kept list that can go stale.
 */

export type Suggestions = {
  specIds: string[];
  storyIds: string[];
  assets: string[];
};

function walk(blocks: Block[], visit: (block: Block) => void): void {
  for (const block of blocks) {
    visit(block);
    if ("body" in block) walk(block.body as Block[], visit);
  }
}

const cache = new WeakMap<ManualIndex, Suggestions>();

export function suggestionsFor(index: ManualIndex): Suggestions {
  const cached = cache.get(index);
  if (cached) return cached;

  const stories = new Set<string>();
  const assets = new Set<string>();
  for (const page of index.pages) {
    if (!page.ast) continue;
    walk(page.ast.blocks, (block) => {
      if (block.type === "story") stories.add(block.id);
      if (block.type === "image") assets.add(block.src);
      if (block.type === "flow" && block.diagram) assets.add(block.diagram);
    });
  }

  const suggestions: Suggestions = {
    specIds: index.snapshot.specs.map((spec) => spec.id).sort(),
    storyIds: [...stories].sort(),
    assets: [...assets].sort(),
  };
  cache.set(index, suggestions);
  return suggestions;
}

/** The list a given attribute offers, or none. */
export function suggestionsForAttr(
  suggestions: Suggestions,
  type: string,
  attr: string,
): string[] {
  if (attr === "id" && (type === "spec" || type === "cases")) {
    return suggestions.specIds;
  }
  if (type === "changes" && attr === "spec") return suggestions.specIds;
  if (type === "story" && attr === "id") return suggestions.storyIds;
  if (type === "image" && attr === "src") return suggestions.assets;
  if (type === "flow" && attr === "diagram") return suggestions.assets;
  return [];
}
