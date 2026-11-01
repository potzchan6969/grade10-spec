import { cn } from "@grade10/design-system/lib/utils";
import { Star } from "@phosphor-icons/react";

type TicketPointsAboutCopy = {
  /** The whole line, the number in it: `Earn about 115 points. They go to
   * your Grade10 account.`, or `This order is free with CREW4. It earns no
   * points.` */
  line: string;
};

type TicketPointsAboutProps = {
  copy: TicketPointsAboutCopy;
  className?: string;
};

/** Under the total: about how many points the order earns, from what is
 * paid, and where they go. A star leads it. */
function TicketPointsAbout({ copy, className }: TicketPointsAboutProps) {
  return (
    <p
      className={cn(
        "m-0 flex items-start gap-1.5 text-sm leading-5 text-secondary-foreground",
        className,
      )}
      data-slot="points-about"
    >
      <span aria-hidden className="mt-0.5 inline-flex flex-none">
        <Star size={16} />
      </span>
      <span>{copy.line}</span>
    </p>
  );
}

export type { TicketPointsAboutCopy, TicketPointsAboutProps };
export { TicketPointsAbout };
