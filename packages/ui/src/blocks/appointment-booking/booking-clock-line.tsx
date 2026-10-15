import { Clock } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/** A length or today's hours after a clock, under a picker card's title. Internal. */
function ClockLine({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-start gap-1.5 tabular-nums">
      <Clock aria-hidden className="mt-[3px] shrink-0" size={14} />
      {children}
    </span>
  );
}

export { ClockLine };
