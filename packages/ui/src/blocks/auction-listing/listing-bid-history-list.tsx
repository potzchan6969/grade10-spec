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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  type ActivityTimeCopy,
  formatActivityAt,
  type ShippedLocale,
} from "../../lib/format-datetime";
import { formatMoney } from "../../lib/format-money";
import type { ListingBidHistoryRow } from "./types";
import "./listing-bid-history-list.css";

type ListingBidHistoryListCopy = {
  you?: string;
  empty?: string;
};

type ListingBidHistoryListProps = {
  copy?: ListingBidHistoryListCopy;
  rows: readonly ListingBidHistoryRow[];
  heading?: string;
  currency: string;
  locale: ShippedLocale;
  timeZone: string;
  activityTimeCopy: ActivityTimeCopy;
  /** Resets entrance animation when the bidding lifecycle changes. */
  resetKey?: string;
  /** `fade` keeps row height stable inside a fixed scroll slot. */
  entranceMode?: "expand" | "fade";
};

type BidHistoryRowItemProps = {
  copy: ListingBidHistoryListCopy;
  row: ListingBidHistoryRow;
  currency: string;
  recessed: boolean;
  animateEnter: boolean;
  useEnterWrapper: boolean;
  entranceMode: "expand" | "fade";
  locale: ShippedLocale;
  timeZone: string;
  activityTimeCopy: ActivityTimeCopy;
  nowMs: number;
};

function formatRowTime(
  row: ListingBidHistoryRow,
  locale: ShippedLocale,
  timeZone: string,
  activityTimeCopy: ActivityTimeCopy,
  nowMs: number,
): string {
  if (row.timeOverride) return row.timeOverride;
  return formatActivityAt(row.acceptedAtMs, {
    locale,
    timeZone,
    copy: activityTimeCopy,
    now: nowMs,
  });
}

function BidHistoryRowContent({
  copy,
  row,
  currency,
  recessed,
  locale,
  timeZone,
  activityTimeCopy,
  nowMs,
}: Omit<
  BidHistoryRowItemProps,
  "animateEnter" | "useEnterWrapper" | "entranceMode"
>) {
  return (
    <HStack
      className="w-full py-1.5"
      gap="sm"
      hAlign="space-between"
      vAlign="center"
    >
      <HStack gap="sm" vAlign="center">
        <Avatar className={recessed ? "opacity-80" : undefined} size="xs">
          <AvatarFallback aria-hidden>
            {avatarInitial(row.initials)}
          </AvatarFallback>
        </Avatar>
        <Text
          className="inline-flex items-center gap-1.5"
          size="sm"
          tone={recessed ? "secondary" : "primary"}
          weight={recessed ? "regular" : "medium"}
        >
          {formatMoney(row.amountMinor, currency, { locale })}
        </Text>
        {row.isViewer ? (
          <Badge size="sm" variant="outline">
            {copy.you ?? "You"}
          </Badge>
        ) : null}
      </HStack>
      <Text size="xs" tone="secondary">
        {formatRowTime(row, locale, timeZone, activityTimeCopy, nowMs)}
      </Text>
    </HStack>
  );
}

function BidHistoryRowItem({
  copy,
  row,
  currency,
  recessed,
  animateEnter,
  useEnterWrapper,
  entranceMode,
  locale,
  timeZone,
  activityTimeCopy,
  nowMs,
}: BidHistoryRowItemProps) {
  const enterRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!animateEnter || !enterRef.current) return;
    requestAnimationFrame(() => {
      enterRef.current?.classList.add("is-shown");
    });
  }, [animateEnter]);

  if (!useEnterWrapper) {
    return (
      <BidHistoryRowContent
        activityTimeCopy={activityTimeCopy}
        copy={copy}
        currency={currency}
        locale={locale}
        nowMs={nowMs}
        recessed={recessed}
        row={row}
        timeZone={timeZone}
      />
    );
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
          <BidHistoryRowContent
            activityTimeCopy={activityTimeCopy}
            copy={copy}
            currency={currency}
            locale={locale}
            nowMs={nowMs}
            recessed={recessed}
            row={row}
            timeZone={timeZone}
          />
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

function useActivityTimeTick(rows: readonly ListingBidHistoryRow[]): number {
  const [nowMs, setNowMs] = useState(() => Date.now());

  /**
   * `rows` is a signal, not a read: a replaced list needs a fresh now so
   * relative times start from the moment the new rows arrived.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useLayoutEffect(() => {
    setNowMs(Date.now());
  }, [rows]);

  useEffect(() => {
    const hasRecentRow = rows.some((row) => {
      if (row.timeOverride) return false;
      return Date.now() - row.acceptedAtMs < 60_000;
    });
    const intervalMs = hasRecentRow ? 15_000 : 30_000;
    const timer = window.setInterval(() => setNowMs(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [rows]);

  return nowMs;
}

function BidHistoryEntrances({
  copy = {},
  rows,
  heading = "Recent bids",
  entranceMode = "expand",
  currency,
  locale,
  timeZone,
  activityTimeCopy,
}: Omit<ListingBidHistoryListProps, "resetKey">) {
  const nowMs = useActivityTimeTick(rows);
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
        {rows.map((row, index) => (
          <BidHistoryRowItem
            activityTimeCopy={activityTimeCopy}
            animateEnter={row.id === enteringId}
            copy={copy}
            currency={currency}
            entranceMode={entranceMode}
            key={row.id}
            locale={locale}
            nowMs={nowMs}
            recessed={index > 0}
            row={row}
            timeZone={timeZone}
            useEnterWrapper={enteredIds.has(row.id)}
          />
        ))}
      </VStack>
    </VStack>
  );
}

export type { ListingBidHistoryListCopy, ListingBidHistoryListProps };
export { ListingBidHistoryList };
