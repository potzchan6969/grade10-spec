import { Card } from "@grade10/design-system/components/display/card";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { LedgerRow } from "./ledger-row";
import type { LedgerEntry } from "./types";

type PointsMonthCardProps = {
  /** The entries of one month, newest first. */
  entries: readonly LedgerEntry[];
  /** The group's label, already formatted — "October 2026". Absent, no
   * heading draws and `label` names the list. */
  month?: string;
  /** Accessible name of the list when no month heads it. */
  label: string;
  className?: string;
};

/** One month's settled entries: the month label over a card of ledger rows. */
function PointsMonthCard({
  entries,
  month,
  label,
  className,
}: PointsMonthCardProps) {
  return (
    <VStack className={className} data-slot="points-month-card" gap="xs">
      {month ? (
        <Text size="sm" tone="secondary" weight="medium">
          {month}
        </Text>
      ) : null}
      <Card className="gap-0">
        <List aria-label={month ?? label} className="px-(--card-spacing)">
          {entries.map((entry, index) => (
            <ListItem
              className="px-0 py-3"
              divider={index < entries.length - 1}
              key={entry.id}
            >
              <LedgerRow entry={entry} />
            </ListItem>
          ))}
        </List>
      </Card>
    </VStack>
  );
}

export type { PointsMonthCardProps };
export { PointsMonthCard };
