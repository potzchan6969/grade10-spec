import type { ProseBlock } from "../content/grammar";
import { useBlockScope, usePageDir, usePageSpec } from "./block-scope";
import { MarkdownView } from "./markdown";

/** The one surface `[[refs]]` live on: prose somebody wrote for this page. */
export function ProseBlockView({ block }: { block: ProseBlock }) {
  const { index } = useBlockScope();
  return (
    <MarkdownView
      anchors
      baseDir={usePageDir()}
      index={index}
      pageSpec={usePageSpec()}
      refs
      text={block.markdown}
    />
  );
}
