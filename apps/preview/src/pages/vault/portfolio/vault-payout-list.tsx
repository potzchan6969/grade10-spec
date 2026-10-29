import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import {
  formatHkd,
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
  Rejected: "error",
};

/**
 * The collector's payout requests, latest first — amount, destination and
 * the status Grade10's approval sets. Hidden when nothing has been
 * requested, matching the intake alert's rule.
 */
function VaultPayoutList({
  requests,
  className,
}: {
  requests: VaultPayoutRequest[];
  className?: string;
}) {
  if (requests.length === 0) return null;

  return (
    <section
      aria-labelledby="vault-payout-requests"
      className={cn("flex flex-col gap-4", className)}
      data-slot="vault-payout-list"
    >
      <Text
        as="h2"
        className="font-heading text-xl font-medium tracking-tight"
        id="vault-payout-requests"
      >
        Payout requests
      </Text>
      <Card padding={false}>
        <ul className="divide-y divide-border">
          {requests.map((request) => (
            <li
              className="flex items-center justify-between gap-4 px-6 py-4"
              key={request.id}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <Text weight="medium" className="tabular-nums">
                  {formatHkd(request.amountHkd)}
                </Text>
                <Text size="sm" tone="secondary">
                  {request.requestedAt} · To {PAYOUT_METHOD.bankName}{" "}
                  {PAYOUT_METHOD.maskedAccount}
                </Text>
              </div>
              <Badge size="sm" variant={STATUS_VARIANT[request.status]}>
                {request.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

export { VaultPayoutList };
