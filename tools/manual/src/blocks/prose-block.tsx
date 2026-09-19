import { useMemo } from "react";
import type { ProseBlock } from "../content/grammar";
import { sectionSeedOf } from "../content/mark-pips";
import { useBlockScope, usePageDir, usePageSpec } from "./block-scope";
import { MarkdownView } from "./markdown";

/** The one surface `[[refs]]` live on: prose somebody wrote for this page. */
export function ProseBlockView({ block }: { block: ProseBlock }) {
  const { index, pagePath } = useBlockScope();
  const ast = index.pageByPath.get(pagePath)?.ast ?? null;
  // The section this one block inherits, from its own place in the page —
  // computed here, where the whole page's parse is at hand, because a remark
  // plugin scoped to this block's own text cannot see it.
  const pipSeed = useMemo(() => sectionSeedOf(ast, block), [ast, block]);
  return (
    <MarkdownView
      anchors
      baseDir={usePageDir()}
      index={index}
      pageSpec={usePageSpec()}
      pipSeed={pipSeed}
      pips
      refs
      text={block.markdown}
    />
  );
}
