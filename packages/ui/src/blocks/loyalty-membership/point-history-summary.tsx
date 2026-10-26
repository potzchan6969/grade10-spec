import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { PointsTotals } from "./types";

/** The three labels over the ledger — Earned, Used, Pending — and the unit
 * the figures read. */
type PointHistorySummaryCopy = {
  earned: string;
  used: string;
  pending: string;
  /** The unit after each figure — "pts". */
  points: string;
};

type PointHistorySummaryProps = {
  copy: PointHistorySummaryCopy;
  /** The figures; each renders its magnitude with the points unit. */
  totals: PointsTotals;
  className?: string;
};

/** The stat box over a member's ledger: what they earned, spent, and still
 * has on the way. */
function PointHistorySummary({
  copy,
  totals,
  className,
}: PointHistorySummaryProps) {
  return (
    <Card
      className={cn("grid grid-cols-3 gap-0 divide-x divide-border", className)}
      data-slot="point-history-summary"
      padding={false}
    >
      {(
        [
          [copy.earned, totals.earned, "success"],
          [copy.used, totals.used, "primary"],
          [copy.pending, totals.pending, "secondary"],
        ] as const
      ).map(([label, value, tone]) => (
        <VStack align="center" className="px-2 py-3" gap="xs" key={label}>
          <Text className="uppercase" size="xs" tone="secondary" weight="medium">
            {label}
          </Text>
          <Text className="font-semibold" size="xl" tone={tone}>
            {Math.abs(value)} {copy.points}
          </Text>
        </VStack>
      ))}
    </Card>
  );
}

export type { PointHistorySummaryCopy, PointHistorySummaryProps };
export { PointHistorySummary };
