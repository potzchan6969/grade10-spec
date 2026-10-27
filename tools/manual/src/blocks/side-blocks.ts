import { sectionSlug } from "../api/paths";
import type { Block } from "../content/grammar";

/** What the side panel shows of the section being read: its screens, its
 * engineering detail, and the test cases that trace it. */
export type SideTab = "ui" | "tech" | "qa";
export const SIDE_TABS: SideTab[] = ["ui", "tech", "qa"];

/** A block the page carries for one tab rather than for its reading. */
export function sideTabOf(block: Block): SideTab | null {
  if (block.type === "story" || block.type === "figma") return "ui";
  if (block.type === "detail" && block.for === "engineer") return "tech";
  return null;
}

/** One side block, under the `##` section it sits in — `""` before the first. */
export type SideItem = { block: Block; tab: SideTab; section: string };

const H2 = /^##\s+(.+?)\s*#*\s*$/;
const FENCE = /^(`{3,}|~{3,})/;

/** The anchor of the last `##` a prose block opens, outside its code. */
function lastSection(markdown: string): string | null {
  let last: string | null = null;
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
    const heading = H2.exec(line);
    if (heading) last = sectionSlug(heading[1]);
  }
  return last;
}

/**
 * A page read in two columns: the blocks that stay in the reading, and the
 * ones that move beside it, each under its section. Only a page's own blocks
 * move; a story inside a callout is part of what the callout says.
 */
export function splitPage(blocks: Block[]): {
  main: Block[];
  side: SideItem[];
} {
  const main: Block[] = [];
  const side: SideItem[] = [];
  let section = "";
  for (const block of blocks) {
    const tab = sideTabOf(block);
    if (tab) {
      side.push({ block, tab, section });
      continue;
    }
    main.push(block);
    if (block.type === "prose")
      section = lastSection(block.markdown) ?? section;
  }
  return { main, side };
}
