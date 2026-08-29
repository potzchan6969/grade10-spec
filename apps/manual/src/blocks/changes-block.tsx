import { changesForSpec } from "../api/derive";
import type { ChangesBlock } from "../content/grammar";
import { useBlockScope } from "./block-scope";
import { ChangeRibbon } from "./change-views";

export function ChangesBlockView({ block }: { block: ChangesBlock }) {
  const { index } = useBlockScope();
  return (
    <ChangeRibbon
      changes={changesForSpec(index, block.spec)}
      specId={block.spec}
    />
  );
}
