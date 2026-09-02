import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import {
  blockBody,
  diffLines,
  diffTotals,
  durableBlock,
} from "../api/delta-text";
import type { ManualIndex } from "../api/derive";
import { specDir } from "../api/paths";
import { findRequirement } from "../api/requirements";
import type { Delta, DeltaRequirement, Requirement } from "../api/types";
import { deltaTone } from "./change-views";
import { MarkdownView } from "./markdown";

/**
 * What a change will say, not just that it says something. ADDED reads as the
 * requirement it will become; MODIFIED reads as a diff against the block it
 * replaces, which is the only way a retyped block that drops a table or a
 * scenario becomes reviewable; REMOVED and RENAMED say what they do.
 */
export function DeltaList({
  index,
  deltas,
  defaultOpen = false,
}: {
  index: ManualIndex;
  deltas: Delta[];
  defaultOpen?: boolean;
}) {
  if (deltas.length === 0) return null;

  return (
    <div className="mt-3 space-y-3">
      {deltas.map((delta) => (
        <div key={delta.spec}>
          <ul className="divide-y divide-border-subtle rounded-(--radius-xl) border border-border-subtle bg-background-subtle">
            {delta.requirements.map((requirement) => (
              <li key={`${requirement.kind}:${requirement.name}`}>
                <DeltaRequirementRow
                  defaultOpen={defaultOpen}
                  index={index}
                  requirement={requirement}
                  spec={delta.spec}
                />
              </li>
            ))}
            {delta.requirements.length === 0 ? (
              <li className="px-3 py-2">
                <Text as="span" size="xs" tone="secondary">
                  {delta.kinds.join(", ").toLowerCase()} — this delta names no
                  requirement rows.
                </Text>
              </li>
            ) : null}
          </ul>
        </div>
      ))}
    </div>
  );
}

function DeltaRequirementRow({
  index,
  spec,
  requirement,
  defaultOpen,
}: {
  index: ManualIndex;
  spec: string;
  requirement: DeltaRequirement;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const durable = findRequirement(
    index.specById.get(spec)?.requirements ?? [],
    requirement.name,
  );

  return (
    <div>
      <button
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setOpen((on) => !on)}
        type="button"
      >
        <span
          className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${open ? "rotate-90" : ""}`}
        >
          <CaretRight aria-hidden size={12} weight="bold" />
        </span>
        <Badge size="sm" variant={deltaTone(requirement.kind)}>
          {requirement.kind}
        </Badge>
        <Text as="span" className="min-w-0 flex-1" size="sm">
          {requirement.name}
        </Text>
        {requirement.to ? (
          <Text as="span" className="min-w-0" size="xs" tone="secondary">
            → {requirement.to}
          </Text>
        ) : null}
      </button>

      {open ? (
        <div className="border-border-subtle border-t px-3 py-3">
          <DeltaBody
            durable={durable}
            index={index}
            requirement={requirement}
            spec={spec}
          />
        </div>
      ) : null}
    </div>
  );
}

function DeltaBody({
  index,
  spec,
  requirement,
  durable,
}: {
  index: ManualIndex;
  spec: string;
  requirement: DeltaRequirement;
  durable?: Requirement;
}) {
  if (requirement.kind === "renamed") {
    return (
      <Text as="p" size="sm" tone="secondary">
        Renamed to{" "}
        <span className="font-medium text-foreground">
          {requirement.to ?? "a heading the delta does not name"}
        </span>
        . The row keeps its scenarios; only the heading moves.
      </Text>
    );
  }

  if (requirement.kind === "removed") {
    return (
      <>
        <Text as="p" className="mb-2" size="sm" tone="secondary">
          This change deletes the requirement.
        </Text>
        {durable ? (
          <MarkdownView
            baseDir={specDir(spec)}
            className="manual-prose manual-prose-tight opacity-70"
            index={index}
            text={durableBlock(durable)}
          />
        ) : null}
      </>
    );
  }

  if (requirement.text === undefined) {
    return (
      <Text as="p" size="sm" tone="secondary">
        The snapshot carries no text for this delta — archived changes ship
        their headings only.
      </Text>
    );
  }

  if (requirement.kind === "modified" && durable) {
    return (
      <BlockDiff
        after={blockBody(requirement.text)}
        before={blockBody(durableBlock(durable))}
      />
    );
  }

  return (
    <MarkdownView
      baseDir={specDir(spec)}
      className="manual-prose manual-prose-tight"
      index={index}
      text={blockBody(requirement.text)}
    />
  );
}

const ROW_STYLE = {
  added: "bg-success/10 text-foreground",
  removed:
    "bg-destructive/10 text-secondary-foreground line-through decoration-destructive/40",
  same: "text-secondary-foreground",
} as const;

const MARK = { added: "+", removed: "−", same: " " } as const;

/**
 * The delta block against the durable one, line by line. Blank lines are
 * dropped on both sides — a rewrap is not a change anyone reviews — so what is
 * left in red is content this block would delete.
 */
export function BlockDiff({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const rows = diffLines(before, after);
  const { added, removed } = diffTotals(rows);

  return (
    <div>
      <Text as="p" className="mb-1.5" size="xs" tone="secondary">
        {added} {added === 1 ? "line" : "lines"} added, {removed}{" "}
        {removed === 1 ? "line" : "lines"} removed, against the durable
        requirement.
      </Text>
      <ol className="overflow-x-auto rounded-(--radius-lg) border border-border-subtle bg-card py-1 font-mono text-xs">
        {rows.map((row, position) => (
          <li
            className={`flex gap-2 px-2 py-0.5 ${ROW_STYLE[row.kind]}`}
            // biome-ignore lint/suspicious/noArrayIndexKey: a diff row is its position in one computed sequence; two identical lines are two rows.
            key={`${position}:${row.text}`}
          >
            <span aria-hidden className="shrink-0 select-none opacity-60">
              {MARK[row.kind]}
            </span>
            <span className="min-w-0 whitespace-pre-wrap">{row.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
