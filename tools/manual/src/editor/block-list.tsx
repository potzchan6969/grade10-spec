import { Text } from "@grade10/design-system/components/display/text";
import { BlockCard } from "./block-card";
import { type DraftBlock, newDraftBlock, type Problems } from "./draft";
import { insertAt, moveBy, removeAt, replaceAt } from "./list";
import { AddBlock } from "./palette";

/** The page's blocks in order, with a place to add one between any two. */

type BlockListProps = {
  blocks: DraftBlock[];
  problems: Problems;
  onChange: (next: DraftBlock[]) => void;
  leavesOnly?: boolean;
  nested?: boolean;
};

export function BlockList({
  blocks,
  problems,
  onChange,
  leavesOnly = false,
  nested = false,
}: BlockListProps) {
  const add = (index: number) => (type: string) =>
    onChange(insertAt(blocks, index, newDraftBlock(type)));

  return (
    <div className="flex flex-col">
      {blocks.length === 0 ? (
        <Text as="p" className="mb-2" size="sm" tone="secondary">
          No blocks yet.
        </Text>
      ) : null}

      {blocks.map((block, index) => (
        <div key={block.id}>
          <BlockCard
            block={block}
            first={index === 0}
            last={index === blocks.length - 1}
            nested={nested}
            onChange={(next) => onChange(replaceAt(blocks, index, next))}
            onMove={(delta) => onChange(moveBy(blocks, index, delta))}
            onRemove={() => onChange(removeAt(blocks, index))}
            problems={problems}
          />
          <InsertPoint leavesOnly={leavesOnly} onAdd={add(index + 1)} />
        </div>
      ))}

      {blocks.length === 0 ? (
        <div>
          <AddBlock leavesOnly={leavesOnly} onAdd={add(0)} />
        </div>
      ) : null}
    </div>
  );
}

/** Deliberately quiet: it sits between every pair of cards. */
function InsertPoint({
  onAdd,
  leavesOnly,
}: {
  onAdd: (type: string) => void;
  leavesOnly: boolean;
}) {
  return (
    <div className="flex items-center justify-center py-1.5 opacity-45 transition-opacity hover:opacity-100 focus-within:opacity-100">
      <AddBlock label="Add block here" leavesOnly={leavesOnly} onAdd={onAdd} />
    </div>
  );
}
