import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { signed } from "./activity-row";
import type { ActivityTotals } from "./types";

/** The three labels over the ledger — Earned, Used, Pending. */
type ActivitySummaryCopy = {
  earned: string;
  used: string;
  pending: string;
};

type ActivitySummaryProps = {
  copy: ActivitySummaryCopy;
  /** The figures, signed the way deltas are. */
  totals: ActivityTotals;
  className?: string;
};

/** The stat box over a member's ledger: what they earned, spent, and still
 * has on the way. */
function ActivitySummary({ copy, totals, className }: ActivitySummaryProps) {
  return (
    <Card
      className={cn(
        "grid grid-cols-3 gap-0 divide-x divide-border",
        className,
      )}
      data-slot="activity-summary"
    >
      {(
        [
          [copy.earned, totals.earned, "success"],
          [copy.used, totals.used, "primary"],
          [copy.pending, totals.pending, "warning"],
        ] as const
      ).map(([label, value, tone]) => (
        <VStack align="center" className="px-2" gap="xs" key={label}>
          <Text size="sm" tone="secondary">
            {label}
          </Text>
          <Text className="font-semibold" size="xl" tone={tone}>
            {signed(value)}
          </Text>
        </VStack>
      ))}
    </Card>
  );
}

export type { ActivitySummaryCopy, ActivitySummaryProps };
export { ActivitySummary };
