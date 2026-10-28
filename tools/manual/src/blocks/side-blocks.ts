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

/** One side block, by the tab it shows under. */
export type SideItem = { block: Block; tab: SideTab };

/** One `##` section of a page read in two columns: what stays in the reading,
 * and what moves beside it. `section` is the heading's anchor, `""` for what
 * comes before the first. */
export type SectionRow = { section: string; main: Block[]; side: SideItem[] };

const H2 = /^##\s+(.+?)\s*#*\s*$/;
const FENCE = /^(`{3,}|~{3,})/;

/** A prose block cut at each `##` outside its code, with the anchor each
 * piece opens — `null` for a piece before the block's first heading. */
function cutAtSections(
  markdown: string,
): { section: string | null; markdown: string }[] {
  const pieces: { section: string | null; lines: string[] }[] = [
    { section: null, lines: [] },
  ];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
    } else {
      const opened = FENCE.exec(line);
      if (opened) fence = opened[1];
      const heading = opened ? null : H2.exec(line);
      if (heading) pieces.push({ section: sectionSlug(heading[1]), lines: [] });
    }
    (pieces.at(-1) as (typeof pieces)[number]).lines.push(line);
  }
  return pieces
    .map(({ section, lines }) => ({
      section,
      markdown: lines.join("\n").trim(),
    }))
    .filter((piece) => piece.section !== null || piece.markdown !== "");
}

/**
 * A page read in two columns, one row a section: each row's reading on the
 * left, and the blocks that move beside it on the right. Only a page's own
 * blocks move; a story inside a callout is part of what the callout says.
 */
export function sectionRows(blocks: Block[]): SectionRow[] {
  const rows: SectionRow[] = [{ section: "", main: [], side: [] }];
  const current = () => rows.at(-1) as SectionRow;
  for (const block of blocks) {
    const tab = sideTabOf(block);
    if (tab) {
      current().side.push({ block, tab });
    } else if (block.type === "prose") {
      for (const piece of cutAtSections(block.markdown)) {
        if (piece.section !== null)
          rows.push({ section: piece.section, main: [], side: [] });
        if (piece.markdown !== "")
          current().main.push({ type: "prose", markdown: piece.markdown });
      }
    } else {
      current().main.push(block);
    }
  }
  return rows.filter(
    (row) => row.section !== "" || row.main.length > 0 || row.side.length > 0,
  );
}
