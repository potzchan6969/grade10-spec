import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import {
  formatHkd,
  formatUsd,
  PAYOUT_METHOD,
  type VaultPayoutRequest,
  type VaultPayoutStatus,
} from "../../vault-content";

const STATUS_VARIANT: Record<
  VaultPayoutStatus,
  "outline" | "info" | "success" | "error"
> = {
  "Pending review": "outline",
  Processing: "info",
  Paid: "success",
  Declined: "error",
};

/**
 * The collector's payout requests, latest first — amount, destination and
 * the status Grade10's approval sets. Hidden when nothing has been
 * requested, matching the intake alert's rule.
 */
function CashOutRow({
  request,
}: {
  request: VaultPayoutRequest;
}) {
  return (
    <li
      className="flex items-center justify-between gap-4 px-6 py-4"
      key={request.id}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <Text className="tabular-nums" weight="medium">
          {formatUsd(request.amountUsd)}
          {request.currency === "HKD" && request.convertedHkd != null ? (
            <span className="text-secondary-foreground font-normal">
              {" "}
              ≈ {formatHkd(request.convertedHkd)}
            </span>
          ) : null}
        </Text>
        <Text size="sm" tone="secondary">
          {request.requestedAt} · To {PAYOUT_METHOD.bankName}{" "}
          {PAYOUT_METHOD.maskedAccount} · {request.currency}
        </Text>
      </div>
      <Badge size="sm" variant={STATUS_VARIANT[request.status]}>
        {request.status}
      </Badge>
    </li>
  );
}

function CashOutList({
  requests,
  className,
}: {
  requests: VaultPayoutRequest[];
  className?: string;
}) {
  if (requests.length === 0) return null;

  return (
    <section
      aria-labelledby="cash-out-requests"
      className={cn("flex flex-col gap-4", className)}
      data-slot="cash-out-list"
    >
      <Text
        as="h2"
        className="font-heading text-xl font-semibold tracking-tight"
        id="cash-out-requests"
      >
        Cash-out requests
      </Text>
      <Card padding={false}>
        <ul className="divide-y divide-border">
          {requests.map((request) => (
            <CashOutRow key={request.id} request={request} />
          ))}
        </ul>
      </Card>
    </section>
  );
}

export { CashOutList, CashOutRow };
