import type { ManualIndex } from "../api/derive";
import { rulesOf, type SectionRule } from "../blocks/side-blocks";
import type { Block } from "../content/grammar";
import type { DraftBlock } from "./draft";

/**
 * What the attribute fields offer. Every list comes from what the manual
 * already uses — story ids, asset paths and the phases `phases.yaml` names —
 * so nothing here is a hand-kept list that can go stale.
 */

export type Suggestions = {
  storyIds: string[];
  assets: string[];
  phaseIds: string[];
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
    storyIds: [...stories].sort(),
    assets: [...assets].sort(),
    phaseIds: (index.snapshot.phases ?? []).map((phase) => phase.id),
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
  if (type === "story" && attr === "id") return suggestions.storyIds;
  if (type === "image" && attr === "src") return suggestions.assets;
  if (type === "flow" && attr === "diagram") return suggestions.assets;
  if (type === "phase" && attr === "id") return suggestions.phaseIds;
  return [];
}

const HEADING = /^#{2,4}\s/;
const FENCE = /^(`{3,}|~{3,})/;

/** A prose draft's lines outside its code, so a `##` in a fence is text. */
function readingLines(markdown: string): string[] {
  const lines: string[] = [];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) fence = opened[1];
    else lines.push(line);
  }
  return lines;
}

/** The rules of the heading a block sits under, as the page's prose around
 * it names them: what a phase block's `rules` may list. Before the first
 * heading, the page's opening. */
export function rulesAround(blocks: DraftBlock[], at: number): SectionRule[] {
  const prose = (from: number, to: number, step: 1 | -1) => {
    const found: string[] = [];
    for (let i = from; step === 1 ? i < to : i > to; i += step) {
      const block = blocks[i];
      if (block.type !== "prose" || !("markdown" in block)) continue;
      const lines = readingLines(block.markdown);
      if (step === 1) {
        const end = lines.findIndex((line) => HEADING.test(line));
        found.push(...(end === -1 ? lines : lines.slice(0, end)));
        if (end !== -1) break;
      } else {
        const start = lines.findLastIndex((line) => HEADING.test(line));
        found.unshift(...(start === -1 ? lines : lines.slice(start + 1)));
        if (start !== -1) break;
      }
    }
    return found;
  };
  const markdown = [
    ...prose(at - 1, -1, -1),
    ...prose(at + 1, blocks.length, 1),
  ].join("\n");
  return rulesOf([{ type: "prose", markdown }]);
}
