import { Card } from "@grade10/design-system/components/display/card";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ChartLineUp } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  BidActions,
  type ListingAuctionBidFieldsCopy,
  PriceBlock,
  StandingBanner,
  TimeBlock,
} from "./listing-auction-bid-fields";
import { ListingAutoBidReveal } from "./listing-auto-bid-reveal";
import { ListingBidHistoryList } from "./listing-bid-history-list";
import type { ListingAuctionBidView, ListingBidHistoryRow } from "./types";
import "./listing-auction-bid-card.css";

type ListingAuctionBidCardCopy = ListingAuctionBidFieldsCopy & {
  recentBids: string;
  bidHistory: {
    leading?: string;
    you?: string;
    empty?: string;
  };
};

type ListingAuctionBidCardProps = {
  copy: ListingAuctionBidCardCopy;
  view: ListingAuctionBidView;
  history: readonly ListingBidHistoryRow[];
  historyResetKey?: string;
  bidMode: "manual" | "auto";
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
  onCommitMaximum: () => void;
};

function RecentBidsScrollArea({
  children,
  contentKey,
  visibleRows = 4,
}: {
  children: ReactNode;
  contentKey: string;
  visibleRows?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateFade = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const overflow = element.scrollHeight > element.clientHeight + 1;
    const atTop = element.scrollTop <= 2;
    const atBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 2;

    setShowTopFade(overflow && !atTop);
    setShowBottomFade(overflow && !atBottom);
  }, []);

  useEffect(() => {
    updateFade();
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", updateFade, { passive: true });
    const resizeObserver = new ResizeObserver(updateFade);
    resizeObserver.observe(element);
    if (element.firstElementChild instanceof HTMLElement) {
      resizeObserver.observe(element.firstElementChild);
    }

    return () => {
      element.removeEventListener("scroll", updateFade);
      resizeObserver.disconnect();
    };
  }, [contentKey, updateFade]);

  return (
    <div
      className="recent-bids-scroll-shell"
      style={
        {
          "--recent-bids-visible-rows": visibleRows,
        } as CSSProperties
      }
    >
      <div
        className="recent-bids-scroll-viewport"
        data-slot="listing-auction-recent-bids"
        ref={scrollRef}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "recent-bids-scroll-fade recent-bids-scroll-fade--top",
          showTopFade && "is-visible",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "recent-bids-scroll-fade recent-bids-scroll-fade--bottom",
          showBottomFade && "is-visible",
        )}
      />
    </div>
  );
}

function ListingAuctionBidCard({
  copy,
  view,
  history,
  historyResetKey,
  bidMode,
  onBidModeChange,
  onPlaceBid,
  onCommitMaximum,
}: ListingAuctionBidCardProps) {
  const hasFooter = view.showBidActions;
  const showRecentBids = history.length > 0;

  return (
    <Card
      className="w-full gap-0"
      data-slot="listing-auction-bid-card"
      padding={false}
    >
      <HStack
        className="w-full border-b border-border px-4 py-2"
        gap="sm"
        vAlign="center"
      >
        {view.live ? <LiveAuctionDot /> : <StatusIndicator variant="default" />}
        <Text size="sm" weight="medium">
          {view.headerLabel}
        </Text>
      </HStack>

      <StandingBanner copy={copy} view={view} />

      <div
        className={cn(
          "grid w-full grid-cols-2",
          (hasFooter || showRecentBids) && "border-b border-border",
        )}
      >
        <div className="border-r border-border px-4 py-3">
          <PriceBlock copy={copy} view={view} />
        </div>
        <div className="px-4 py-3">
          <TimeBlock copy={copy} view={view} />
        </div>
      </div>

      <ListingAutoBidReveal open={showRecentBids}>
        <VStack
          className={cn("w-full px-4 py-4", hasFooter && "border-b border-border")}
          gap="sm"
        >
          <HStack gap="xs" vAlign="center">
            <span className="text-secondary-foreground">
              <ChartLineUp aria-hidden size={14} />
            </span>
            <Text
              className="text-secondary-foreground"
              size="sm"
              tone="secondary"
              weight="medium"
            >
              {copy.recentBids}
            </Text>
          </HStack>
          <RecentBidsScrollArea
            contentKey={`${historyResetKey ?? "live"}:${history.length}:${history[0]?.id ?? ""}`}
            visibleRows={Math.min(4, Math.max(1, history.length))}
          >
            <ListingBidHistoryList
              copy={copy.bidHistory}
              entranceMode="fade"
              heading=""
              resetKey={historyResetKey}
              rows={history}
            />
          </RecentBidsScrollArea>
        </VStack>
      </ListingAutoBidReveal>

      {hasFooter ? (
        <div className="px-4 py-4">
          <VStack className="w-full" gap="md">
            <BidActions
              bidMode={bidMode}
              copy={copy}
              onBidModeChange={onBidModeChange}
              onCommitMaximum={onCommitMaximum}
              onPlaceBid={onPlaceBid}
              view={view}
            />
            <Text size="xs" tone="secondary">
              {copy.buyerFeeHint}
            </Text>
          </VStack>
        </div>
      ) : null}
    </Card>
  );
}

function LiveAuctionDot() {
  return (
    <span
      aria-hidden
      className="relative flex size-4 shrink-0 items-center justify-center"
    >
      <span className="absolute size-2 rounded-full bg-success opacity-35 animate-ping motion-reduce:animate-none" />
      <span className="size-2 rounded-full bg-success" />
    </span>
  );
}

export type { ListingAuctionBidCardCopy, ListingAuctionBidCardProps };
export { ListingAuctionBidCard };
