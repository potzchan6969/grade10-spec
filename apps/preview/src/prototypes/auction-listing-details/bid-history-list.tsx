import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BidderInitialAvatar } from "./bidder-initial-avatar";
import { formatUsd } from "./format-usd";
import type { BidHistoryRow } from "./types";
import "./bid-history-list.css";

type BidHistoryListProps = {
  rows: readonly BidHistoryRow[];
  heading?: string;
  /** Resets entrance animation when the bidding lifecycle changes. */
  resetKey?: string;
};

type BidHistoryRowItemProps = {
  row: BidHistoryRow;
  animateEnter: boolean;
  useEnterWrapper: boolean;
};

function BidHistoryRowContent({ row }: { row: BidHistoryRow }) {
  return (
    <HStack
      className="w-full py-2"
      gap="sm"
      hAlign="space-between"
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
  );
}

function BidHistoryRowItem({
  row,
  animateEnter,
  useEnterWrapper,
}: BidHistoryRowItemProps) {
  const enterRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!animateEnter || !enterRef.current) return;
    requestAnimationFrame(() => {
      enterRef.current?.classList.add("is-shown");
    });
  }, [animateEnter]);

  if (!useEnterWrapper) {
    return <BidHistoryRowContent row={row} />;
  }

  return (
    <div
      ref={enterRef}
      className={cn("bid-history-enter", !animateEnter && "is-shown")}
      data-bid-row-id={row.id}
    >
      <div className="bid-history-enter__inner">
        <div className="bid-history-enter__content">
          <BidHistoryRowContent row={row} />
        </div>
      </div>
    </div>
  );
}

function BidHistoryList({
  rows,
  heading = "Recent bids",
  resetKey,
}: BidHistoryListProps) {
  const knownIdsRef = useRef<Set<string>>(new Set());
  const skipEntranceRef = useRef(true);
  const [enteredIds, setEnteredIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [enteringId, setEnteringId] = useState<string | null>(null);

  useEffect(() => {
    knownIdsRef.current = new Set();
    skipEntranceRef.current = true;
    setEnteredIds(new Set());
    setEnteringId(null);
  }, [resetKey]);

  useEffect(() => {
    if (skipEntranceRef.current) {
      knownIdsRef.current = new Set(rows.map((row) => row.id));
      skipEntranceRef.current = false;
      return;
    }

    const newRow = rows.find((row) => !knownIdsRef.current.has(row.id));
    knownIdsRef.current = new Set(rows.map((row) => row.id));

    if (newRow) {
      setEnteredIds((prev) => new Set(prev).add(newRow.id));
      setEnteringId(newRow.id);
    }
  }, [rows]);

  useEffect(() => {
    if (!enteringId) return;
    const timer = window.setTimeout(() => setEnteringId(null), 500);
    return () => window.clearTimeout(timer);
  }, [enteringId]);

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
          <BidHistoryRowItem
            animateEnter={row.id === enteringId}
            key={row.id}
            row={row}
            useEnterWrapper={enteredIds.has(row.id)}
          />
        ))}
      </VStack>
    </VStack>
  );
}

export { BidHistoryList };
