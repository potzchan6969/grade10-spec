import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowCounterClockwise, Lightning } from "@phosphor-icons/react";

type DoorRecentAdmissionsCopy = {
  /** "Recent admissions" */
  title: string;
  /** "Every door, HKT" */
  caption: string;
  /** "Undo" — this device's own admission, inside its window. */
  undo: string;
  /** "Reverse…" — another device's admission, which asks for a reason. */
  reverse: string;
  /** "Takes the admission back. Asks for a reason; the audit keeps it." */
  reverseHint: string;
  /** "Fast Pass used" */
  fastPassUsed: string;
  /** "Reversed" */
  reversed: string;
  /** "No admissions yet." */
  empty: string;
};

/**
 * One admission, newest first.
 * - `undo` — let in on this screen and still inside its window
 * - `reverse` — another device's; reversing it asks for a reason
 * - `none` — nothing to do: already reversed, or no grant to reverse
 */
type DoorRecentAdmission = {
  id: string;
  /** "14:05" */
  time: string;
  name: string;
  /** "General Pass (Two-Day), Adult" */
  pass: string;
  /** "Gate A phone 1", or "This screen". */
  device: string;
  fastPassUsed: boolean;
  reversed: boolean;
  action: "undo" | "reverse" | "none";
  pending?: boolean;
};

type DoorRecentAdmissionsProps = {
  copy: DoorRecentAdmissionsCopy;
  admissions: readonly DoorRecentAdmission[];
  onUndo: (admissionId: string) => void;
  onReverse: (admissionId: string) => void;
  className?: string;
};

/**
 * The console door's recent admissions from every door: when, who, on which
 * pass, by which device, whether Fast Pass was used, and Undo for this
 * screen's own or Reverse for another device's.
 */
function DoorRecentAdmissions({
  copy,
  admissions,
  onUndo,
  onReverse,
  className,
}: DoorRecentAdmissionsProps) {
  return (
    <section
      aria-label={copy.title}
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-background",
        className,
      )}
      data-slot="door-recent-admissions"
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{copy.title}</h2>
        <span className="text-xs text-secondary-foreground">
          {copy.caption}
        </span>
      </div>
      {admissions.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-secondary-foreground">
          {copy.empty}
        </p>
      ) : (
        <ul className="flex flex-col">
          {admissions.map((admission) => (
            <li
              className={cn(
                "grid grid-cols-[2.75rem_minmax(0,3fr)_minmax(0,2fr)_5.5rem] items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0",
                admission.reversed && "text-secondary-foreground",
              )}
              key={admission.id}
            >
              <span className="text-xs tabular-nums text-secondary-foreground">
                {admission.time}
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "truncate text-sm font-medium",
                    admission.reversed && "line-through",
                  )}
                >
                  {admission.name}
                </span>
                <span className="truncate text-xs text-secondary-foreground">
                  {admission.pass}
                </span>
              </span>
              <span className="flex min-w-0 flex-col text-xs">
                <span className="truncate">{admission.device}</span>
                {admission.fastPassUsed ? (
                  <span className="flex items-center gap-1 whitespace-nowrap text-secondary-foreground">
                    <Lightning aria-hidden size={12} />
                    {copy.fastPassUsed}
                  </span>
                ) : null}
              </span>
              <span className="flex justify-end">
                {admission.reversed ? (
                  <Badge variant="outline">{copy.reversed}</Badge>
                ) : admission.action === "undo" ? (
                  <Button
                    leading={<ArrowCounterClockwise />}
                    loading={admission.pending}
                    onClick={() => onUndo(admission.id)}
                    size="sm"
                    variant="outline"
                  >
                    {copy.undo}
                  </Button>
                ) : admission.action === "reverse" ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          loading={admission.pending}
                          onClick={() => onReverse(admission.id)}
                          size="sm"
                          variant="ghost"
                        />
                      }
                    >
                      {copy.reverse}
                    </TooltipTrigger>
                    <TooltipContent>{copy.reverseHint}</TooltipContent>
                  </Tooltip>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export {
  type DoorRecentAdmission,
  DoorRecentAdmissions,
  type DoorRecentAdmissionsCopy,
  type DoorRecentAdmissionsProps,
};
