import { Badge } from "@grade10/design-system/components/display/badge";
import type { TicketTone } from "./types";

const VARIANT = {
  plain: "default",
  ok: "success",
  info: "info",
  warn: "warning",
  bad: "error",
} as const satisfies Record<TicketTone, string>;

/** Where an order or a ticket stands, as one coloured word. Internal. */
function TicketStatusBadge({
  tone,
  label,
}: {
  tone: TicketTone;
  label: string;
}) {
  return (
    <Badge
      className="shrink-0"
      data-slot="ticket-status"
      variant={VARIANT[tone]}
    >
      {label}
    </Badge>
  );
}

export { TicketStatusBadge };
