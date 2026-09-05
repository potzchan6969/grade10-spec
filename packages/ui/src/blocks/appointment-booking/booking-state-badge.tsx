import { Badge } from "@grade10/design-system/components/display/badge";
import type { BookingRecordState } from "./types";

const VARIANT: Record<
  BookingRecordState,
  "success" | "default" | "warning" | "outline"
> = {
  booked: "success",
  completed: "default",
  cancelled: "outline",
  no_show: "warning",
};

/** The state, in the consumer's words, in the tone the state earns. Internal. */
function BookingStateBadge({
  state,
  label,
}: {
  state: BookingRecordState;
  label: string;
}) {
  return (
    <Badge
      data-slot="booking-state"
      data-state={state}
      variant={VARIANT[state]}
    >
      {label}
    </Badge>
  );
}

export { BookingStateBadge };
