import type { ProseBlock } from "../content/grammar";
import { useBlockScope, usePageDir } from "./block-scope";
import { MarkdownView } from "./markdown";

export function ProseBlockView({ block }: { block: ProseBlock }) {
  const { index } = useBlockScope();
  return (
    <MarkdownView
      anchors
      baseDir={usePageDir()}
      index={index}
      text={block.markdown}
    />
  );
}
