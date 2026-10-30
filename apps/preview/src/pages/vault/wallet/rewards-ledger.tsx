import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { cn } from "@grade10/design-system/lib/utils";
import { Sparkle } from "@phosphor-icons/react";
import { useState } from "react";
import {
  formatHkd,
  type VaultPayoutRequest,
} from "../../vault-content";
import { CashOutRow } from "./cash-out-list";

type LedgerTab = "rewards" | "cash-out";

/**
 * Rewards and cash-out activity under one heading — the Rewards chip lists
 * each day's incentive as a single sum, the Cash-out chip lists every
 * request with the status Grade10's approval sets. Modelled on the points
 * history ledger: icon tile, name over date, amount trailing.
 */
function RewardsLedger({
  dailyIncentives,
  payoutRequests,
  className,
}: {
  dailyIncentives: { date: string; amountHkd: number }[];
  payoutRequests: VaultPayoutRequest[];
  className?: string;
}) {
  const [tab, setTab] = useState<LedgerTab>("rewards");

  return (
    <section
      aria-label="Rewards and cash-out activity"
      className={cn("flex flex-col gap-4", className)}
      data-slot="rewards-ledger"
    >
      <Tabs value={tab} onValueChange={(value) => setTab(value as LedgerTab)}>
        <TabsList aria-label="Rewards and cash-out filters" variant="pill">
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="cash-out">Cash-out</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "rewards" ? (
        <Card padding={false}>
          <ul className="divide-y divide-border">
            {dailyIncentives.map((entry) => (
              <li
                className="flex items-center gap-4 px-6 py-4"
                key={entry.date}
              >
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-foreground"
                >
                  <Sparkle size={16} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Text weight="medium">Daily incentive</Text>
                  <Text size="sm" tone="secondary">
                    {entry.date}
                  </Text>
                </div>
                <Text
                  className="shrink-0 whitespace-nowrap tabular-nums"
                  tone="success"
                  weight="medium"
                >
                  +{formatHkd(entry.amountHkd)}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card padding={false}>
          <ul className="divide-y divide-border">
            {payoutRequests.map((request) => (
              <CashOutRow key={request.id} request={request} />
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

export { RewardsLedger };
