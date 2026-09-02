import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight, Kanban } from "@phosphor-icons/react";
import { useState } from "react";
import {
  byLastMoved,
  laneOf,
  type ManualIndex,
  taskTotals,
} from "../api/derive";
import type { ChangeEntry, ChangeLane } from "../api/types";
import { useArchive } from "../api/use-archive";
import { useManualIndex } from "../api/use-manual-index";
import { useHashTarget } from "../blocks/anchor";
import { ChangeCard } from "../blocks/change-detail";
import { ReadOnlyNotice } from "../editor/read-only-notice";
import { ArchiveTimeline } from "./archive-timeline";
import { MaintenancePanel } from "./maintenance-panel";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

type LaneSpec = {
  lane: ChangeLane;
  title: string;
  summary: string;
  /** Open on arrival, or collapsed until somebody asks. */
  open: boolean;
};

/** The board's columns, in the order work moves through them. Each is derived
 * from the artifacts a change has written — never stored, never set by hand. */
const LANES: LaneSpec[] = [
  {
    lane: "proposed",
    title: "Proposed",
    summary: "No deltas yet — the reason, and what it is about.",
    open: false,
  },
  {
    lane: "specified",
    title: "Specified",
    summary:
      "Deltas written, no task list. The engineer who picks one up promotes it — each card carries the command.",
    open: true,
  },
  {
    lane: "in-progress",
    title: "In progress",
    summary: "Boxes still open.",
    open: true,
  },
  {
    lane: "complete",
    title: "Complete",
    summary: "Every task done — waiting on the archive.",
    open: true,
  },
];

export function InFlightPage() {
  const index = useManualIndex();
  useDocumentTitle("In Flight");
  // The archive answers whether a dependency shipped; without it a shipped one
  // would read as missing, which is the one answer worth avoiding.
  const archive = useArchive();
  const archived =
    archive.status === "ready" ? archive.archive.changes : undefined;

  const byLane = new Map<ChangeLane, ChangeEntry[]>();
  for (const change of [...index.snapshot.changes].sort(byLastMoved)) {
    const lane = laneOf(change);
    byLane.set(lane, [...(byLane.get(lane) ?? []), change]);
  }

  return (
    <>
      <ReadOnlyNotice className="mb-3 text-right" />
      <PageHeading
        summary="Every change in flight, in the lane its own artifacts put it in."
        title="In Flight"
      />

      {index.snapshot.changes.length === 0 ? (
        <EmptyState
          description="No change is in flight in this snapshot."
          icon={<Kanban aria-hidden />}
          title="Nothing in flight"
        />
      ) : (
        LANES.map((spec) => (
          <Lane
            archived={archived}
            changes={byLane.get(spec.lane) ?? []}
            index={index}
            key={spec.lane}
            spec={spec}
          />
        ))
      )}

      <ArchiveTimeline title="Archive" />
      <MaintenancePanel />
    </>
  );
}

/** One lane. Collapsible, and opened by a link that names a change inside it —
 * a deep link from a requirement row has to land on the card, whichever lane
 * the change has moved into since the link was copied. */
function Lane({
  spec,
  changes,
  index,
  archived,
}: {
  spec: LaneSpec;
  changes: ChangeEntry[];
  index: ManualIndex;
  archived?: ChangeEntry[];
}) {
  const targeted = useHashTarget(...changes.map((change) => change.id));
  const [open, setOpen] = useState(spec.open);

  if (changes.length === 0) return null;
  const expanded = open || targeted;

  return (
    <section className="mb-8">
      <button
        aria-expanded={expanded}
        className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-2 rounded-(--radius-lg) px-2 py-1 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setOpen((on) => !on)}
        type="button"
      >
        <span
          className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
        >
          <CaretRight aria-hidden size={14} weight="bold" />
        </span>
        <h2 className="font-heading font-bold text-lg" id={spec.lane}>
          {spec.title}
        </h2>
        <Badge
          size="sm"
          variant={spec.lane === "complete" ? "success" : "outline"}
        >
          {changes.length}
        </Badge>
        <LaneProgress changes={changes} lane={spec.lane} />
      </button>

      <Text as="p" className="mt-1 ml-6" size="sm" tone="secondary">
        {spec.summary}
      </Text>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!expanded}>
          <ul className="mt-3 space-y-3">
            {changes.map((change) => (
              <li key={change.id}>
                <ChangeCard archived={archived} change={change} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** The lane's own number, where a lane has one worth reading at a glance. */
function LaneProgress({
  changes,
  lane,
}: {
  changes: ChangeEntry[];
  lane: ChangeLane;
}) {
  if (lane !== "in-progress") return null;
  const totals = changes.reduce(
    (sum, change) => {
      const { done, total } = taskTotals(change);
      return { done: sum.done + done, total: sum.total + total };
    },
    { done: 0, total: 0 },
  );
  if (totals.total === 0) return null;

  return (
    <Text as="span" className="ml-auto font-mono" size="xs" tone="secondary">
      {totals.done}/{totals.total} tasks
    </Text>
  );
}
