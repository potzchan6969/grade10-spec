import { Card } from "@grade10/design-system/components/display/card";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { LedgerRow } from "./ledger-row";
import type { LedgerEntry } from "./types";

/** The card's own header — the pending variant's title and rule. */
type PointHistoryCardHeader = {
  title: string;
  description?: string;
};

type PointHistoryCardProps = {
  /** The card's entries, newest first. */
  entries: readonly LedgerEntry[];
  /** A header inside the card — the pending card's title and rule. */
  header?: PointHistoryCardHeader;
  /** The group's label, already formatted — "October 2026". Absent, no
   * heading draws and `label` names the list. */
  month?: string;
  /** Accessible name of the list when no month or header names it. */
  label: string;
  className?: string;
};

/** One card of ledger rows — a month's settled entries, or what is still on
 * the way under its own header on the pending variant. */
function PointHistoryCard({
  entries,
  header,
  month,
  label,
  className,
}: PointHistoryCardProps) {
  return (
    <VStack className={className} data-slot="point-history-card" gap="xs">
      {month ? (
        <Text size="sm" tone="secondary" weight="medium">
          {month}
        </Text>
      ) : null}
      <Card className="gap-0" padding={false}>
        {header ? (
          <div className="flex flex-col gap-0 px-(--card-spacing) py-2 [--card-spacing:--spacing(4)]">
            <Text weight="medium">{header.title}</Text>
            {header.description ? (
              <Text size="sm" tone="secondary">
                {header.description}
              </Text>
            ) : null}
          </div>
        ) : null}
        <List
          aria-label={header?.title ?? month ?? label}
          className="px-(--card-spacing) [--card-spacing:--spacing(4)]"
        >
          {entries.map((entry, index) => (
            <ListItem
              className="gap-4 px-0 py-2"
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

export type { PointHistoryCardHeader, PointHistoryCardProps };
export { PointHistoryCard };
