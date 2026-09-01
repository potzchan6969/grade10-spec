import {
  Avatar,
  AvatarFallback,
  avatarInitial,
} from "@grade10/design-system/components/display/avatar";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { CrownSimple } from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatUsd } from "./format-usd";
import type { ListingBidHistoryRow } from "./types";
import "./listing-bid-history-list.css";

type ListingBidHistoryListCopy = {
  leading?: string;
  you?: string;
  empty?: string;
};

type ListingBidHistoryListProps = {
  copy?: ListingBidHistoryListCopy;
  rows: readonly ListingBidHistoryRow[];
  heading?: string;
  /** Resets entrance animation when the bidding lifecycle changes. */
  resetKey?: string;
  /** `fade` keeps row height stable inside a fixed scroll slot. */
  entranceMode?: "expand" | "fade";
};

type BidHistoryRowItemProps = {
  copy: ListingBidHistoryListCopy;
  row: ListingBidHistoryRow;
  animateEnter: boolean;
  useEnterWrapper: boolean;
  entranceMode: "expand" | "fade";
};

function BidHistoryRowContent({
  copy,
  row,
}: {
  copy: ListingBidHistoryListCopy;
  row: ListingBidHistoryRow;
}) {
  return (
    <HStack
      className="w-full py-2"
      gap="sm"
      hAlign="space-between"
      vAlign="center"
    >
      <HStack gap="sm" vAlign="center">
        <Avatar size="xs">
          <AvatarFallback aria-hidden>
            {avatarInitial(row.initials)}
          </AvatarFallback>
        </Avatar>
        <Text className="inline-flex items-center gap-1.5" size="sm">
          {formatUsd(row.amountMinor)}
          {row.leading ? (
            <span
              aria-label={copy.leading ?? "Leading"}
              className="bid-history-leading-crown shrink-0"
              role="img"
            >
              <CrownSimple aria-hidden color="currentColor" weight="fill" />
            </span>
          ) : null}
        </Text>
        {row.isViewer && !row.leading ? (
          <Badge size="sm" variant="outline">
            {copy.you ?? "You"}
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
  copy,
  row,
  animateEnter,
  useEnterWrapper,
  entranceMode,
}: BidHistoryRowItemProps) {
  const enterRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!animateEnter || !enterRef.current) return;
    requestAnimationFrame(() => {
      enterRef.current?.classList.add("is-shown");
    });
  }, [animateEnter]);

  if (!useEnterWrapper) {
    return <BidHistoryRowContent copy={copy} row={row} />;
  }

  return (
    <div
      ref={enterRef}
      className={cn(
        "bid-history-enter",
        entranceMode === "fade" && "bid-history-enter--fade",
        !animateEnter && "is-shown",
      )}
      data-bid-row-id={row.id}
    >
      <div className="bid-history-enter__inner">
        <div className="bid-history-enter__content">
          <BidHistoryRowContent copy={copy} row={row} />
        </div>
      </div>
    </div>
  );
}

function ListingBidHistoryList({
  resetKey,
  ...props
}: ListingBidHistoryListProps) {
  return <BidHistoryEntrances key={resetKey} {...props} />;
}

function BidHistoryEntrances({
  copy = {},
  rows,
  heading = "Recent bids",
  entranceMode = "expand",
}: Omit<ListingBidHistoryListProps, "resetKey">) {
  const knownIdsRef = useRef<Set<string>>(new Set());
  const skipEntranceRef = useRef(true);
  const [enteredIds, setEnteredIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [enteringId, setEnteringId] = useState<string | null>(null);

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
        {copy.empty ?? "No bids yet."}
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
            copy={copy}
            entranceMode={entranceMode}
            key={row.id}
            row={row}
            useEnterWrapper={enteredIds.has(row.id)}
          />
        ))}
      </VStack>
    </VStack>
  );
}

export type { ListingBidHistoryListCopy, ListingBidHistoryListProps };
export { ListingBidHistoryList };
