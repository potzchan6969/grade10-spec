import { Clock } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** A length or today's hours after a clock, under a picker card's title. Internal. */
function ClockLine({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-start gap-1.5 tabular-nums">
      <span aria-hidden className="mt-[3px] inline-flex shrink-0">
        <Clock size={14} />
      </span>
      {children}
    </span>
  );
}

export { ClockLine };
