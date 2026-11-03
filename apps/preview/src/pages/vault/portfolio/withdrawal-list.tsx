import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { Bank, CaretRight } from "@phosphor-icons/react";
import {
  formatHkd,
  formatUsd,
  PAYOUT_METHOD,
  PAYOUT_STATUS_VARIANT,
  type VaultPayoutRequest,
} from "../../vault-content";

/**
 * The collector's payout requests, latest first — destination, the status
 * Grade10's approval sets beside the date, and the amount with its HKD
 * conversion underneath when the request pays out in HKD. Clicking the
 * row opens the request's details in a right-side drawer; rows hover
 * except the daily-incentive credit, which the ledger renders itself.
 * Hidden when nothing has been requested.
 */
function WithdrawalRow({
  request,
  onOpen,
}: {
  request: VaultPayoutRequest;
  onOpen?: (request: VaultPayoutRequest) => void;
}) {
  const declined = request.status === "Declined";
  const content = (
    <>
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-foreground sm:size-10"
      >
        <Bank size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Text weight="medium">
          To {PAYOUT_METHOD.bankName} {PAYOUT_METHOD.maskedAccount}
        </Text>
        <div className="flex flex-wrap items-center gap-x-2">
          <Badge size="sm" variant={PAYOUT_STATUS_VARIANT[request.status]}>
            {request.status}
          </Badge>
          <Text size="sm" tone="secondary">
            {request.requestedAt}
          </Text>
        </div>
      </div>
      <div
        className={cn(
          "flex shrink-0 flex-col items-end gap-1 whitespace-nowrap tabular-nums",
          declined && "line-through decoration-muted-foreground",
        )}
      >
        <Text tone={declined ? "muted" : "primary"} weight="medium">
          −{formatUsd(request.amountUsd)}
        </Text>
        {request.currency === "HKD" && request.convertedHkd != null ? (
          <Text size="sm" tone={declined ? "muted" : "secondary"}>
            {formatHkd(request.convertedHkd)}
          </Text>
        ) : null}
      </div>
      <span aria-hidden className="shrink-0 text-muted-foreground">
        <CaretRight size={16} />
      </span>
    </>
  );
  return (
    <li key={request.id}>
      {onOpen ? (
        <button
          aria-label={`View withdrawal details, ${request.status}`}
          className="flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:bg-background-subtle active:bg-background-subtle sm:gap-4 sm:p-4"
          type="button"
          onClick={() => onOpen(request)}
        >
          {content}
        </button>
      ) : (
        <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          {content}
        </div>
      )}
    </li>
  );
}

function WithdrawalList({
  requests,
  onOpenRequest,
  className,
}: {
  requests: VaultPayoutRequest[];
  onOpenRequest?: (request: VaultPayoutRequest) => void;
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
            <WithdrawalRow
              key={request.id}
              request={request}
              onOpen={onOpenRequest}
            />
          ))}
        </ul>
      </Card>
    </section>
  );
}

export { WithdrawalList, WithdrawalRow };
