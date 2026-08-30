import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { BidderInitialAvatar } from "./bidder-initial-avatar";
import { formatUsd } from "./format-usd";
import type { BidHistoryRow } from "./types";

type BidHistoryListProps = {
  rows: readonly BidHistoryRow[];
  heading?: string;
};

function BidHistoryList({ rows, heading = "Recent bids" }: BidHistoryListProps) {
  if (rows.length === 0) {
    return (
      <Text size="sm" tone="secondary">
        No bids yet.
      </Text>
    );
  }

  return (
    <VStack className="w-full" gap="sm">
      {heading ? (
        <Text className="uppercase tracking-wide" size="sm" tone="secondary">
          {heading}
        </Text>
      ) : null}
      <VStack className="w-full divide-y divide-border" gap="none">
        {rows.map((row) => (
          <HStack
            className="w-full py-2"
            gap="sm"
            hAlign="space-between"
            key={`${row.initials}-${row.amountMinor}-${row.relativeTime}`}
            vAlign="center"
          >
            <HStack gap="sm" vAlign="center">
              <BidderInitialAvatar initials={row.initials} />
              <Text size="sm">{formatUsd(row.amountMinor)}</Text>
              {row.leading ? (
                <Badge size="sm" variant="outline">
                  Leading
                </Badge>
              ) : null}
              {row.isViewer && !row.leading ? (
                <Badge size="sm" variant="outline">
                  You
                </Badge>
              ) : null}
            </HStack>
            <Text size="xs" tone="secondary">
              {row.relativeTime}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export { BidHistoryList };
