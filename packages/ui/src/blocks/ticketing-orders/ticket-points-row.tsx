import { cn } from "@grade10/design-system/lib/utils";

/** Where an order's points stand. */
type TicketPointsRowKind =
  /** Priced, not yet recorded: "About 1,150". */
  | "about"
  /** Recorded on the account. */
  | "earned"
  /** A refund took some or all of them back. */
  | "takenBack";

/** The words the row says. */
type TicketPointsRowCopy = {
  /** "Points" */
  label: string;
  /** The figure or its word: "About 1,150", "+1,150", "Taken back". */
  value: string;
  /** The line under it: where the points go, or what was taken back. */
  note?: string;
};

type TicketPointsRowProps = {
  copy: TicketPointsRowCopy;
  kind: TicketPointsRowKind;
  className?: string;
};

/**
 * What an order earns in points, on its own card under the order: the
 * figure on the right in the point history's weight, green once earned, and
 * a line saying where the points go or what a refund took back.
 */
function TicketPointsRow({ copy, kind, className }: TicketPointsRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground",
        className,
      )}
      data-kind={kind}
      data-slot="ticket-points-row"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm leading-5 text-secondary-foreground">
          {copy.label}
        </span>
        <strong
          className={cn(
            "text-base leading-6 font-bold whitespace-nowrap",
            kind === "earned" && "text-success",
          )}
          data-slot="ticket-points-value"
        >
          {copy.value}
        </strong>
      </div>
      {copy.note ? (
        <p className="text-sm leading-5 text-secondary-foreground">
          {copy.note}
        </p>
      ) : null}
    </div>
  );
}

export type { TicketPointsRowCopy, TicketPointsRowKind, TicketPointsRowProps };
export { TicketPointsRow };
