import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { dependenciesOf, type ManualIndex, taskTotals } from "../api/derive";
import type { ChangeEntry } from "../api/types";
import {
  DependencyPills,
  MainStateNote,
  nextAction,
  SpecLines,
} from "./change-facts";
import { Attribution, TaskProgress } from "./change-views";
import { CopyableCommand } from "./copyable-command";

/**
 * Where the change stands, as the page reads it: one labelled row per fact,
 * and no row for a fact the change does not carry. The board's card says the
 * same things in the same components, unlabelled, because a card is read as a
 * whole and a page is read a line at a time.
 */
export function ChangeStatus({
  change,
  index,
  archived = [],
}: {
  change: ChangeEntry;
  index: ManualIndex;
  archived?: ChangeEntry[];
}) {
  const dependencies = dependenciesOf(change, index, archived);
  const { done, total } = taskTotals(change);
  const groups = change.taskGroups.length;
  const next = nextAction(change);

  return (
    <dl className="my-5 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
      {change.mainState ? (
        <Row className="[&>div]:mt-0">
          <MainStateNote change={change} />
        </Row>
      ) : null}

      {dependencies.length > 0 ? (
        <Row label="Blocked by">
          <ul className="flex flex-wrap items-center gap-1.5">
            <DependencyPills dependencies={dependencies} />
          </ul>
        </Row>
      ) : null}

      <Row label="Owners">
        <Attribution change={change} claim />
      </Row>

      {change.deltas.length > 0 ? (
        <Row label="Specs">
          <SpecLines change={change} />
        </Row>
      ) : null}

      {total > 0 ? (
        <Row label="Tasks">
          <TaskProgress
            done={done}
            label={`${groups} ${groups === 1 ? "group" : "groups"}`}
            total={total}
          />
        </Row>
      ) : null}

      {next ? (
        <Row label="Next">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <CopyableCommand command={next.command} />
            <Text as="span" size="xs" tone="secondary">
              {next.note}
            </Text>
          </span>
        </Row>
      ) : null}
    </dl>
  );
}

/** A label-less row still needs its `dt`: the grid's first column is what
 * keeps every value on the same left edge. */
function Row({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className={cn("min-w-0", className)}>{children}</dd>
    </>
  );
}
