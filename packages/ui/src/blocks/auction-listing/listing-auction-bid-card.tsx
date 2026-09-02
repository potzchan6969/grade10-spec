import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  ActivityTimeCopy,
  ShippedLocale,
} from "../../lib/format-datetime";
import {
  BidActions,
  BuyerFeeHint,
  type ListingAuctionBidFieldsCopy,
  PriceBlock,
  StandingBanner,
  StandingStatusBadge,
  TimeBlock,
} from "./listing-auction-bid-fields";
import { ListingAutoBidReveal } from "./listing-auto-bid-reveal";
import { ListingBidHistoryList } from "./listing-bid-history-list";
import type {
  BidEnrollment,
  ListingAuctionBidView,
  ListingBidHistoryRow,
} from "./types";
import "./listing-auction-bid-card.css";

type ListingAuctionBidCardCopy = ListingAuctionBidFieldsCopy & {
  recentBids: string;
  bidHistory: {
    you?: string;
    empty?: string;
  };
  activityTimeCopy: ActivityTimeCopy;
};

type ListingAuctionBidCardProps = {
  copy: ListingAuctionBidCardCopy;
  view: ListingAuctionBidView;
  history: readonly ListingBidHistoryRow[];
  historyResetKey?: string;
  bidMode: "manual" | "auto";
  bidEnrollment?: BidEnrollment;
  locale: ShippedLocale;
  timeZone: string;
  onBidModeChange: (mode: "manual" | "auto") => void;
  onPlaceBid: () => void;
  onCommitMaximum: () => void;
  recentBidsAccessory?: ReactNode;
};

/** Full rows for short lists; a half-row peek when more bids exist below the fold. */
function recentBidsVisibleRows(bidCount: number): number {
  if (bidCount >= 4) return 3.5;
  return Math.max(1, bidCount);
}

function RecentBidsScrollArea({
  children,
  contentKey,
  visibleRows = 3.5,
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

  /**
   * `contentKey` is a signal, not a read: a new list replaces the child this
   * effect observes, so the subscription has to be rebuilt against the node
   * that is there now.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
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
  bidEnrollment,
  locale,
  timeZone,
  onBidModeChange,
  onPlaceBid,
  onCommitMaximum,
  recentBidsAccessory,
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
        hAlign="space-between"
        vAlign="center"
      >
        <HStack gap="sm" vAlign="center">
          {view.live && !view.opens && !view.closed ? <LiveAuctionDot /> : null}
          <Text size="sm" weight="medium">
            {view.headerLabel}
          </Text>
        </HStack>
        <StandingStatusBadge
          bidEnrollment={bidEnrollment}
          copy={copy}
          view={view}
        />
      </HStack>

      <StandingBanner bidEnrollment={bidEnrollment} copy={copy} view={view} />

      <div
        className={cn(
          "grid w-full grid-cols-2",
          (hasFooter || showRecentBids) && "border-b border-border",
        )}
      >
        <div className="border-r border-border px-4 py-3">
          <PriceBlock copy={copy} locale={locale} view={view} />
        </div>
        <div className="px-4 py-3">
          <TimeBlock
            copy={copy}
            locale={locale}
            timeZone={timeZone}
            view={view}
          />
        </div>
      </div>

      <ListingAutoBidReveal open={showRecentBids}>
        <VStack
          className={cn(
            "w-full px-4 py-3",
            hasFooter && "border-b border-border",
          )}
          gap="sm"
        >
          <HStack
            className="w-full"
            gap="xs"
            hAlign="space-between"
            vAlign="center"
          >
            <Text
              className="text-secondary-foreground"
              size="sm"
              tone="secondary"
              weight="medium"
            >
              {copy.recentBids}
            </Text>
            {recentBidsAccessory}
          </HStack>
          <RecentBidsScrollArea
            contentKey={`${historyResetKey ?? "live"}:${history.length}:${history[0]?.id ?? ""}`}
            visibleRows={recentBidsVisibleRows(history.length)}
          >
            <ListingBidHistoryList
              activityTimeCopy={copy.activityTimeCopy}
              copy={copy.bidHistory}
              currency={view.currency}
              entranceMode="fade"
              heading=""
              locale={locale}
              resetKey={historyResetKey}
              rows={history}
              timeZone={timeZone}
            />
          </RecentBidsScrollArea>
        </VStack>
      </ListingAutoBidReveal>

      {hasFooter ? (
        <div className="px-4 py-4">
          <VStack className="w-full" gap="md">
            <BidActions
              bidEnrollment={bidEnrollment}
              bidMode={bidMode}
              copy={copy}
              locale={locale}
              onBidModeChange={onBidModeChange}
              onCommitMaximum={onCommitMaximum}
              onPlaceBid={onPlaceBid}
              view={view}
            />
            {bidEnrollment === "signed-out" ? null : (
              <BuyerFeeHint copy={copy} />
            )}
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
