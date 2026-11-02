import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretRight, HandCoins } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { formatUsd, type VaultPayoutRequest } from "../../vault-content";
import { animateEnter } from "../../vault-shared";
import { WithdrawalRow } from "./withdrawal-list";

type LedgerTab = "all" | "incentives" | "withdrawal";

type IncentiveEntry = { date: string; amountUsd: number };

/** "29 Oct 2026" → "Oct 2026". */
function monthKey(date: string) {
  const parts = date.split(" ");
  return `${parts[1]} ${parts[2]}`;
}

/**
 * One day's incentive sum — the credit variant of the withdrawal row: a
 * primary-muted coin icon, no status pill, no chevron and no hover, since
 * there is no request to open.
 */
function IncentiveRow({ entry }: { entry: IncentiveEntry }) {
  return (
    <li className="flex items-center gap-4 p-4">
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-muted text-(--orange-600)"
      >
        <HandCoins size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Text className="truncate" weight="medium">
          Daily Incentives
        </Text>
        <Text size="sm" tone="secondary">
          {entry.date}
        </Text>
      </div>
      <Text className="shrink-0 whitespace-nowrap tabular-nums" weight="medium">
        +{formatUsd(entry.amountUsd)}
      </Text>
      <span aria-hidden className="size-4 shrink-0 opacity-0">
        <CaretRight size={16} />
      </span>
    </li>
  );
}

/** Entries under one month header, grouped like the points ledger. */
function MonthGroup({
  month,
  children,
}: {
  month: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Text as="h3" size="sm" tone="secondary" weight="medium">
        {month}
      </Text>
      <Card padding={false}>
        <ul className="divide-y divide-border">{children}</ul>
      </Card>
    </div>
  );
}

/**
 * Incentive and withdrawal activity under one heading — All reads the two
 * kinds on one timeline, Incentives lists each day's incentive sum,
 * Withdrawal lists every request with the status Grade10's approval sets.
 * Entries are grouped by month and year, like the points history ledger.
 */
function RewardsLedger({
  dailyIncentives,
  payoutRequests,
  onOpenWithdrawal,
  tab,
  onTabChange,
  className,
}: {
  dailyIncentives: IncentiveEntry[];
  /** Opens a withdrawal request's details in the right-side drawer. */
  onOpenWithdrawal?: (request: VaultPayoutRequest) => void;
  payoutRequests: VaultPayoutRequest[];
  /** Controlled tab; defaults to All internally. */
  tab?: LedgerTab;
  onTabChange?: (tab: LedgerTab) => void;
  className?: string;
}) {
  const [internalTab, setInternalTab] = useState<LedgerTab>("all");
  const activeTab = tab ?? internalTab;
  const setTab = (value: LedgerTab) => {
    setInternalTab(value);
    onTabChange?.(value);
  };
  const groupsRef = useRef<HTMLDivElement>(null);

  /* Enter: the month groups rise in on each tab switch. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: activeTab is what re-runs the rise
  useEffect(() => {
    animateEnter(groupsRef.current, { duration: 160, rise: 4 });
  }, [activeTab]);

  /* All: the two kinds merged on one timeline, latest date first. */
  const merged = [
    ...dailyIncentives.map((entry) => ({
      kind: "incentive" as const,
      date: entry.date,
      entry,
    })),
    ...payoutRequests.map((request) => ({
      kind: "withdrawal" as const,
      date: request.requestedAt,
      request,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const months: { month: string; nodes: React.ReactNode[] }[] = [];
  const push = (month: string, node: React.ReactNode) => {
    const last = months[months.length - 1];
    if (last && last.month === month) last.nodes.push(node);
    else months.push({ month, nodes: [node] });
  };

  if (activeTab === "all") {
    for (const item of merged) {
      push(
        monthKey(item.date),
        item.kind === "incentive" ? (
          <IncentiveRow entry={item.entry} key={`r-${item.date}`} />
        ) : (
          <WithdrawalRow
            key={item.request.id}
            request={item.request}
            onOpen={onOpenWithdrawal}
          />
        ),
      );
    }
  } else if (activeTab === "incentives") {
    for (const entry of dailyIncentives) {
      push(
        monthKey(entry.date),
        <IncentiveRow entry={entry} key={entry.date} />,
      );
    }
  } else {
    for (const request of payoutRequests) {
      push(
        monthKey(request.requestedAt),
        <WithdrawalRow
          key={request.id}
          request={request}
          onOpen={onOpenWithdrawal}
        />,
      );
    }
  }

  return (
    <section
      aria-label="Incentive and withdrawal activity"
      className={cn("flex flex-col gap-6", className)}
      data-slot="rewards-ledger"
    >
      <fieldset
        aria-label="Activity filters"
        className="flex flex-wrap items-center gap-2"
      >
        {(["all", "incentives", "withdrawal"] as const).map((key) => (
          <Button
            aria-pressed={key === activeTab}
            key={key}
            size="md"
            type="button"
            variant={key === activeTab ? "secondary" : "outline"}
            onClick={() => setTab(key)}
          >
            {key === "withdrawal"
              ? "Withdrawal"
              : key === "incentives"
                ? "Incentives"
                : "All"}
          </Button>
        ))}
      </fieldset>

      <div className="flex flex-col gap-6" ref={groupsRef}>
        {months.map((group) => (
          <MonthGroup key={group.month} month={group.month}>
            {group.nodes}
          </MonthGroup>
        ))}
      </div>
    </section>
  );
}

export { RewardsLedger };
