import type { ProseBlock } from "../content/grammar";
import { useBlockScope, usePageDir } from "./block-scope";
import { MarkdownView } from "./markdown";
import { usePhaseMarks } from "./phase-chip";

/** The one surface `[[refs]]` live on: prose somebody wrote for this page.
 * It wears the page's phase chips where a heading or a rule differs. */
export function ProseBlockView({ block }: { block: ProseBlock }) {
  const { index } = useBlockScope();
  return (
    <MarkdownView
      anchors
      baseDir={usePageDir()}
      index={index}
      phases={usePhaseMarks()}
      refs
      text={block.markdown}
    />
  );
}
