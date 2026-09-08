import { Badge } from "@grade10/design-system/components/display/badge";
import type { Block, ExampleBlock } from "../content/grammar";
import { BlockView } from "./block-view";
import { Collapsible } from "./collapsible";
import { exampleId } from "./example-block";

type Run =
  | { type: "examples"; blocks: ExampleBlock[] }
  | { type: "one"; block: Block };

/** Neighbouring examples fold into one section; everything else stands alone. */
function runs(blocks: Block[]): Run[] {
  const out: Run[] = [];
  for (const block of blocks) {
    const last = out.at(-1);
    if (block.type === "example" && last?.type === "examples") {
      last.blocks.push(block);
    } else if (block.type === "example") {
      out.push({ type: "examples", blocks: [block] });
    } else {
      out.push({ type: "one", block });
    }
  }
  return out;
}

/**
 * A page's blocks in order. A run of examples folds behind one collapsed
 * `Examples` toggle, so a page reads as its rules first and its worked cases
 * on request; a deep link into a case opens the run around it.
 */
export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {runs(blocks).map((run, position) =>
        run.type === "examples" ? (
          <Examples
            blocks={run.blocks}
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
            key={`examples-${position}`}
          />
        ) : (
          <BlockView
            block={run.block}
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
            key={`${run.block.type}-${position}`}
          />
        ),
      )}
    </>
  );
}

function Examples({ blocks }: { blocks: ExampleBlock[] }) {
  const ids = blocks.map(exampleId);
  return (
    <Collapsible
      badge={
        <Badge size="sm" variant="outline">
          {blocks.length}
        </Badge>
      }
      id={`${ids[0]}-examples`}
      linkLabel="Copy link to these examples"
      targets={ids}
      title="Examples"
      variant="ghost"
    >
      {blocks.map((block, position) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
        <BlockView block={block} key={`example-${position}`} />
      ))}
    </Collapsible>
  );
}
