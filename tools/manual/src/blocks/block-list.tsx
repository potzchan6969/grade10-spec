import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@grade10/design-system/components/forms/select";
import { useEffect, useMemo, useState } from "react";
import type { Block, ExampleBlock, FlowBlock } from "../content/grammar";
import { useHashId } from "./anchor";
import { BlockView } from "./block-view";
import { Collapsible } from "./collapsible";
import { exampleId } from "./example-block";
import { FlowBlockView } from "./flow-block";
import { flowAnchors } from "./flow-steps";

type Run =
  | { type: "examples"; blocks: ExampleBlock[] }
  | { type: "cases"; blocks: FlowBlock[] }
  | { type: "one"; block: Block };

/** Neighbouring examples fold into one section, and neighbouring flows under
 * one title are one flow's cases; everything else stands alone. */
function runs(blocks: Block[]): Run[] {
  const out: Run[] = [];
  for (const block of blocks) {
    const last = out.at(-1);
    if (block.type === "example" && last?.type === "examples") {
      last.blocks.push(block);
    } else if (block.type === "example") {
      out.push({ type: "examples", blocks: [block] });
    } else if (
      block.type === "flow" &&
      last?.type === "cases" &&
      last.blocks[0].title === block.title
    ) {
      last.blocks.push(block);
    } else if (block.type === "flow") {
      out.push({ type: "cases", blocks: [block] });
    } else {
      out.push({ type: "one", block });
    }
  }
  return out;
}

/**
 * A page's blocks in order. A run of examples gathers under one `Examples`
 * toggle, open on arrival — a worked case is how the rules are read, not an
 * appendix to them — and foldable away once it has been read.
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
        ) : run.type === "cases" ? (
          <FlowCases
            blocks={run.blocks}
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
            key={`flow-${position}`}
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
      defaultOpen
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

/**
 * One flow under the case the reader picks: the normal path first, the
 * others behind the same title, so what is ordinary and what is exceptional
 * never share a diagram. A link into any case's step shows that case.
 */
function FlowCases({ blocks }: { blocks: FlowBlock[] }) {
  const anchors = useMemo(() => blocks.map(flowAnchors), [blocks]);
  const target = useHashId();
  const named = anchors.findIndex((ids) => ids.includes(target));
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (named !== -1) setAt(named);
  }, [named]);

  const shown = blocks[Math.min(at, blocks.length - 1)];
  if (blocks.length === 1) return <FlowBlockView block={shown} />;

  return (
    <FlowBlockView
      block={shown}
      select={
        <Select
          onValueChange={(next: string | null) => {
            const picked = blocks.findIndex((block) => block.case === next);
            if (picked !== -1) setAt(picked);
          }}
          value={shown.case ?? ""}
        >
          <SelectTrigger aria-label="Case" className="w-fit" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-fit min-w-(--anchor-width)">
            <SelectGroup>
              {blocks.map((block) => (
                <SelectItem key={block.case} value={block.case ?? ""}>
                  {block.case}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      }
    />
  );
}
