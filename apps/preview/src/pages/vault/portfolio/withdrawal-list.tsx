import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowUpRight } from "@phosphor-icons/react";
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
function WithdrawalRow({ request }: { request: VaultPayoutRequest }) {
  return (
    <li
      className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
      key={request.id}
    >
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-foreground"
      >
        <ArrowUpRight size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text className="truncate" weight="medium">
          To {PAYOUT_METHOD.bankName} {PAYOUT_METHOD.maskedAccount}
        </Text>
        <Text size="sm" tone="secondary">
          {request.requestedAt} · {request.currency}
        </Text>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Text className="whitespace-nowrap tabular-nums" weight="medium">
          −{formatUsd(request.amountUsd)}
          {request.currency === "HKD" && request.convertedHkd != null ? (
            <span className="hidden text-secondary-foreground font-normal sm:inline">
              {" "}
              ≈ {formatHkd(request.convertedHkd)}
            </span>
          ) : null}
        </Text>
        {request.currency === "HKD" && request.convertedHkd != null ? (
          <Text
            size="sm"
            tone="secondary"
            className="whitespace-nowrap tabular-nums sm:hidden"
          >
            ≈ {formatHkd(request.convertedHkd)}
          </Text>
        ) : null}
        <Badge size="sm" variant={STATUS_VARIANT[request.status]}>
          {request.status}
        </Badge>
      </div>
    </li>
  );
}

function WithdrawalList({
  requests,
  className,
}: {
  requests: VaultPayoutRequest[];
  className?: string;
}) {
  if (requests.length === 0) return null;

  return (
    <section
      aria-labelledby="withdrawal-requests"
      className={cn("flex flex-col gap-4", className)}
      data-slot="withdrawal-list"
    >
      <Text
        as="h2"
        className="font-heading text-xl font-semibold tracking-tight"
        id="withdrawal-requests"
      >
        Withdrawal requests
      </Text>
      <Card padding={false}>
        <ul className="divide-y divide-border">
          {requests.map((request) => (
            <WithdrawalRow key={request.id} request={request} />
          ))}
        </ul>
      </Card>
    </section>
  );
}

export { WithdrawalList, WithdrawalRow };
