import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import type { BoardLane } from "../api/board";
import type { ManualIndex } from "../api/derive";
import { ROLE_LABEL, STAGE_LABEL } from "../api/stage-view";
import { useHashTarget } from "./anchor";
import { ChangeCard } from "./change-detail";
import { StageMark } from "./stage-mark";

/**
 * One lane of the board: its stage, its count, the roles nobody is named for,
 * and — on the five an agent drafts — the mark and the hand's move.
 *
 * A lane opens when its stage names a hand and arrives collapsed when it
 * names nobody, because eight lanes make a long page and the three nobody
 * holds are the three nobody has to read. A lane with nothing in it stays
 * collapsed to its heading and says which roles a change arriving in it would
 * be on; a deep link onto a card inside a lane opens it whichever lane the
 * change has moved into since the link was copied.
 */

/** Past this many cards a lane is a list, not a lane: the archive's own
 * timeline below the board is where the rest is read. */
const SHOWN = 12;

export function StageLane({
  lane,
  index,
  archivedCount,
}: {
  lane: BoardLane;
  index: ManualIndex;
  /** The archive's own total, for the Archived lane's heading — its rows are
   * the in-flight changes only, which is always none, so the count a reader
   * wants there is the archive's, not this lane's own empty one. */
  archivedCount?: number;
}) {
  const targeted = useHashTarget(...lane.rows.map((row) => row.change.id));
  const [open, setOpen] = useState(lane.open);

  if (lane.stage === "archived") {
    return (
      <section className="mb-8" data-lane={lane.stage}>
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-lg" id={lane.stage}>
            {STAGE_LABEL[lane.stage]}
          </h2>
          <Badge size="sm" variant="outline">
            {archivedCount ?? 0}
          </Badge>
        </div>
        <Text as="p" className="mt-1 ml-1" size="xs" tone="secondary">
          Shipped changes are folded into the durable specs —{" "}
          <Link className="underline underline-offset-2" to="#archive">
            the archive below
          </Link>{" "}
          keeps the record.
        </Text>
      </section>
    );
  }

  const expanded = (open || targeted) && lane.rows.length > 0;
  const shown = lane.rows.slice(0, SHOWN);
  const rest = lane.rows.length - shown.length;

  return (
    <section className="mb-8">
      <button
        aria-expanded={expanded}
        className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-2 rounded-(--radius-lg) px-2 py-1 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        data-lane={lane.stage}
        onClick={() => setOpen((on) => !on)}
        type="button"
      >
        <span
          className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
        >
          <CaretRight aria-hidden size={14} weight="bold" />
        </span>
        <h2 className="font-heading font-bold text-lg" id={lane.stage}>
          {STAGE_LABEL[lane.stage]}
        </h2>
        <Badge size="sm" variant="outline">
          {lane.rows.length}
        </Badge>
        <OpenRoles lane={lane} />
      </button>

      <div className="mt-1 ml-6">
        <StageMark stage={lane.stage} />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!expanded}>
          <ul className="mt-3 space-y-3">
            {shown.map((row) => (
              <li key={row.change.id}>
                <ChangeCard
                  change={row.change}
                  index={index}
                  overlays={row.overlays}
                />
              </li>
            ))}
          </ul>
          {rest > 0 ? (
            <Text as="p" className="mt-2 ml-1" size="xs" tone="secondary">
              {`and ${rest} more — the archive's own timeline is below`}
            </Text>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** The roles nobody is named for: the lane's own where it holds changes, and
 * the roles the stage names where it holds none. */
function OpenRoles({ lane }: { lane: BoardLane }) {
  if (lane.openHands.length === 0) return null;

  return (
    <Text as="span" className="ml-auto text-right" size="xs" tone="secondary">
      {`open: ${lane.openHands.map((role) => ROLE_LABEL[role]).join(", ")}`}
    </Text>
  );
}
