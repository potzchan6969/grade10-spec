import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { useState } from "react";
import { BlockView } from "../blocks/block-view";
import { AttrForm } from "./attr-form";
import { BlockList } from "./block-list";
import { blockHint, blockLabel } from "./descriptions";
import {
  type BlockProblem,
  checkItem,
  type DraftBlock,
  type DraftContainer,
  type DraftProse,
  isContainer,
  type Problems,
  previewBlock,
} from "./draft";
import { ProseEditor } from "./prose-editor";

/** One block, one card: the rendered block, flipped to its editing face. */

type BlockCardProps = {
  block: DraftBlock;
  problems: Problems;
  onChange: (next: DraftBlock) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
  first: boolean;
  last: boolean;
  nested?: boolean;
};

export function BlockCard({
  block,
  problems,
  onChange,
  onMove,
  onRemove,
  first,
  last,
  nested = false,
}: BlockCardProps) {
  const own = problems.get(block.id) ?? [];
  const [editing, setEditing] = useState(() => startsOpen(block, own));
  const preview = previewBlock(block);

  return (
    <article
      className={`overflow-hidden rounded-(--radius-2xl) border bg-card ${
        own.length > 0 ? "border-destructive-border" : "border-border"
      }`}
      data-block-type={block.type}
    >
      <header className="flex items-center gap-2 border-border-subtle border-b bg-background-subtle px-3 py-2">
        <Badge size="sm" variant={own.length > 0 ? "error" : "default"}>
          {blockLabel(block.type)}
        </Badge>
        <Text
          as="span"
          className="min-w-0 truncate max-sm:hidden"
          size="xs"
          tone="secondary"
        >
          {own.length > 0 ? own[0].message : blockHint(block.type)}
        </Text>

        <div className="ml-auto flex items-center gap-0.5">
          <IconButton
            aria-label="Move up"
            disabled={first}
            onClick={() => onMove(-1)}
            size="sm"
            variant="ghost"
          >
            <ArrowUp aria-hidden />
          </IconButton>
          <IconButton
            aria-label="Move down"
            disabled={last}
            onClick={() => onMove(1)}
            size="sm"
            variant="ghost"
          >
            <ArrowDown aria-hidden />
          </IconButton>
          <IconButton
            aria-label={editing ? "Show the preview" : "Edit this block"}
            onClick={() => setEditing((on) => !on)}
            size="sm"
            variant="ghost"
          >
            {editing ? <Eye aria-hidden /> : <PencilSimple aria-hidden />}
          </IconButton>
          <IconButton
            aria-label="Delete this block"
            onClick={onRemove}
            size="sm"
            variant="ghost"
          >
            <Trash aria-hidden />
          </IconButton>
        </div>
      </header>

      <div className="px-4 py-3">
        {editing ? (
          <Editing block={block} onChange={onChange} problems={problems} />
        ) : preview ? (
          <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <BlockView block={preview} />
          </div>
        ) : (
          <ProblemList problems={own} />
        )}
      </div>

      {editing && isContainer(block) && !nested ? (
        <div className="border-border-subtle border-t bg-background-subtle/60 px-4 py-3">
          <Text
            as="p"
            className="mb-2 font-medium uppercase tracking-wide"
            size="xs"
            tone="secondary"
          >
            Body
          </Text>
          <BlockList
            blocks={block.body}
            leavesOnly
            nested
            onChange={(body) => onChange({ ...block, body })}
            problems={problems}
          />
        </div>
      ) : null}
    </article>
  );
}

function Editing({
  block,
  problems,
  onChange,
}: {
  block: DraftBlock;
  problems: Problems;
  onChange: (next: DraftBlock) => void;
}) {
  const own = problems.get(block.id) ?? [];

  if (block.type === "prose") {
    const prose = block as DraftProse;
    return (
      <ProseEditor
        markdown={prose.markdown}
        onChange={(markdown) => onChange({ ...prose, markdown })}
        problem={own[0]?.message}
      />
    );
  }

  const head = block as DraftContainer;
  const preview = previewBlock(block);

  return (
    <div className="flex flex-col gap-3">
      <AttrForm
        attrs={head.attrs}
        onChange={(attrs) => onChange({ ...head, attrs })}
        problems={own}
        type={block.type}
      />
      {preview && !isContainer(block) ? (
        <div className="rounded-(--radius-2xl) border border-border-subtle bg-background-subtle px-4 py-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <BlockView block={preview} />
        </div>
      ) : null}
    </div>
  );
}

function ProblemList({ problems }: { problems: BlockProblem[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {problems.map((problem) => (
        <li key={`${problem.attr ?? ""}-${problem.message}`}>
          <Text as="span" className="text-destructive" size="sm">
            {problem.attr ? `${problem.attr}: ` : ""}
            {problem.message}
          </Text>
        </li>
      ))}
    </ul>
  );
}

/** A block that would render as nothing opens on its form instead — which is
 * every block the palette has just added. */
function startsOpen(block: DraftBlock, problems: BlockProblem[]): boolean {
  if (problems.length > 0) return true;
  if (block.type === "prose") {
    return (block as DraftProse).markdown.trim() === "";
  }
  if (isContainer(block)) {
    return block.body.every((item) => checkItem(item).block === null);
  }
  return false;
}
