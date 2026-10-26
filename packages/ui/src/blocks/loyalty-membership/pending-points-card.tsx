import { Card } from "@grade10/design-system/components/display/card";
import { List, ListItem } from "@grade10/design-system/components/display/list";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { cn } from "@grade10/design-system/lib/utils";
import { LedgerRow, signed } from "./ledger-row";
import type { LedgerEntry } from "./types";

/** The pending card's words. */
type PendingPointsCardCopy = {
  title: string;
  /** Why the points are not here yet, in the programme's own logic. */
  body: string;
  /** The tag under a pending delta. */
  badge: string;
  /** The unit the pending total reads — "pts". */
  points: string;
};

type PendingPointsCardProps = {
  copy: PendingPointsCardCopy;
  /** The entries still on the way; the total is summed from them. */
  entries: readonly LedgerEntry[];
  className?: string;
};

/** What is still on the way: the rule on top, the pending entries under it,
 * each tagged Pending under its delta. */
function PendingPointsCard({
  copy,
  entries,
  className,
}: PendingPointsCardProps) {
  const total = entries.reduce((sum, entry) => sum + entry.delta, 0);
  return (
    <Card
      className={cn("gap-2 border-warning-border bg-warning-muted", className)}
      data-slot="pending-points-card"
    >
      <HStack
        align="baseline"
        className="px-(--card-spacing)"
        justify="space-between"
      >
        <Text weight="medium">{copy.title}</Text>
        <Text tone="warning" weight="medium">
          {signed(total)} {copy.points}
        </Text>
      </HStack>
      <Text className="px-(--card-spacing)" size="sm" tone="secondary">
        {copy.body}
      </Text>
      <List aria-label={copy.title} className="px-(--card-spacing)">
        {entries.map((entry, index) => (
          <ListItem
            className="px-0 py-3"
            divider={index < entries.length - 1}
            key={entry.id}
          >
            <LedgerRow entry={entry} pendingBadge={copy.badge} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export type { PendingPointsCardCopy, PendingPointsCardProps };
export { PendingPointsCard };
