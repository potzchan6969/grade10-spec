import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Gavel } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  REVEAL_REDUCED_MOTION_CLASS,
  revealStaggerDelayMs,
  useFirstPaintReveal,
} from "../shared/use-first-paint-reveal";
import { AuctionRecordRow } from "./auction-record-row";
import { AUCTION_RECORD_COLUMNS, AUCTION_RECORD_TABLE_LAYOUT } from "./columns";
import type { AuctionRecordProps, AuctionRecordRowProps } from "./types";

/** Enter: snappy ease-out, short travel (page content, not a panel). */
const ENTER_EASE = "cubic-bezier(0.23,1,0.32,1)";
const ENTER_TRANSITION_CLASS =
  "transition-[opacity,transform] duration-[250ms] motion-reduce:transition-none";
const ENTER_HIDDEN_CLASS = "translate-y-1 opacity-0";
const ENTER_VISIBLE_CLASS = "translate-y-0 opacity-100";

/** Exit: slightly quicker than enter so Unwatch feels decisive. */
const ROW_EXIT_MS = 200;
const ROW_EXIT_EASE = ENTER_EASE;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function rowKey(item: AuctionRecordRowProps) {
  return item.id ?? item.href ?? item.title;
}

function enterStyle(staggerIndex: number, revealed: boolean) {
  return {
    transitionTimingFunction: ENTER_EASE,
    transitionDelay: revealStaggerDelayMs(staggerIndex, revealed),
  } as const;
}

function enterClassName(revealed: boolean, className?: string) {
  return cn(
    ENTER_HIDDEN_CLASS,
    ENTER_TRANSITION_CLASS,
    REVEAL_REDUCED_MOTION_CLASS,
    revealed && ENTER_VISIBLE_CLASS,
    className,
  );
}

/** Visibility only — the row owns `transition` so exit can tween height. */
function enterVisibilityClass(revealed: boolean) {
  return cn(
    ENTER_HIDDEN_CLASS,
    REVEAL_REDUCED_MOTION_CLASS,
    revealed && ENTER_VISIBLE_CLASS,
  );
}

/** Remounts on each empty visit so filled → empty also enters, not only first paint. */
function AuctionRecordEmptyBody({
  copy,
  onBrowseCatalogue,
}: {
  copy: AuctionRecordProps["copy"];
  onBrowseCatalogue?: () => void;
}) {
  const revealed = useFirstPaintReveal();

  return (
    <div
      className={cn(
        "w-full scale-[0.98] opacity-0",
        ENTER_TRANSITION_CLASS,
        "motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        revealed && "scale-100 opacity-100",
      )}
      data-slot="auction-record-empty"
      style={{ transitionTimingFunction: ENTER_EASE }}
    >
      <EmptyState
        actions={
          onBrowseCatalogue != null ? (
            <Button size="md" variant="secondary" onClick={onBrowseCatalogue}>
              {copy.browseCatalogue}
            </Button>
          ) : undefined
        }
        description={copy.emptyDescription}
        icon={<Gavel aria-hidden size={24} weight="regular" />}
        title={copy.emptyTitle}
      />
    </div>
  );
}

/**
 * My Auctions page body: breadcrumbs, title with watching-count badge, one
 * table of bookmarked lots (bid rows first), or one page-level empty state.
 * Site chrome stays outside, and so does the `<Toast />` the application
 * mounts at its root.
 *
 * Table composition matches Figma `Auction Watchlist` (`6507:5463`).
 *
 * Motion: title → header → rows stagger in; Unwatch collapses the row before
 * the application is told to drop it.
 */
function AuctionRecord({
  copy,
  breadcrumbs,
  watchingItems = [],
  biddingItems = [],
  onBrowseCatalogue,
  className,
}: AuctionRecordProps) {
  const revealed = useFirstPaintReveal();
  const rows = useMemo(
    () => [...biddingItems, ...watchingItems],
    [biddingItems, watchingItems],
  );
  const isEmpty = rows.length === 0;

  const [exitingIds, setExitingIds] = useState(() => new Set<string>());
  const exitTimersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    return () => {
      for (const timerId of exitTimersRef.current.values()) {
        window.clearTimeout(timerId);
      }
      exitTimersRef.current.clear();
    };
  }, []);

  // Drop exit bookkeeping once the consumer removed the row (or restored it).
  useEffect(() => {
    const liveIds = new Set(rows.map(rowKey));
    setExitingIds((prev) => {
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (liveIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
          const timerId = exitTimersRef.current.get(id);
          if (timerId != null) {
            window.clearTimeout(timerId);
            exitTimersRef.current.delete(id);
          }
        }
      }
      return changed ? next : prev;
    });
  }, [rows]);

  const requestUnwatch = (item: AuctionRecordRowProps) => {
    const id = rowKey(item);
    if (exitingIds.has(id) || !item.onWatchToggle) return;

    if (prefersReducedMotion()) {
      item.onWatchToggle();
      return;
    }

    setExitingIds((prev) => new Set(prev).add(id));
    const timerId = window.setTimeout(() => {
      exitTimersRef.current.delete(id);
      item.onWatchToggle?.();
    }, ROW_EXIT_MS);
    exitTimersRef.current.set(id, timerId);
  };

  return (
    <VStack
      className={cn(
        "mx-auto w-full max-w-7xl gap-12 overflow-x-clip px-4 pt-8 pb-16 sm:px-8",
        className,
      )}
      data-revealed={revealed || undefined}
      data-slot="auction-record"
      hAlign="stretch"
    >
      {breadcrumbs}
      <div
        className={enterClassName(revealed, "w-fit max-w-full")}
        style={enterStyle(0, revealed)}
      >
        <HStack className="w-fit max-w-full" gap="sm" vAlign="center">
          <h1
            className={cn(
              "shrink-0 text-3xl font-bold leading-none text-foreground",
              // Match Badge: trim ascent/descent so center aligns on cap height.
              "[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]",
            )}
          >
            {copy.title}
          </h1>
          {!isEmpty ? (
            <Badge className="shrink-0" size="sm" variant="default">
              {rows.length}
            </Badge>
          ) : null}
        </HStack>
      </div>
      {isEmpty ? (
        <AuctionRecordEmptyBody
          copy={copy}
          onBrowseCatalogue={onBrowseCatalogue}
        />
      ) : (
        <div className="scroll-fade-x w-full overflow-x-auto overscroll-x-contain">
          <Table className={AUCTION_RECORD_TABLE_LAYOUT.table}>
            <TableHeader
              className={enterClassName(
                revealed,
                AUCTION_RECORD_TABLE_LAYOUT.row,
              )}
              style={enterStyle(1, revealed)}
            >
              <TableHead className={AUCTION_RECORD_COLUMNS.auction}>
                {copy.auctionColumn}
              </TableHead>
              <TableHead className={AUCTION_RECORD_COLUMNS.currentBid}>
                {copy.currentBidColumn}
              </TableHead>
              <TableHead className={AUCTION_RECORD_COLUMNS.standing}>
                {copy.standingColumn}
              </TableHead>
              <TableHead className={AUCTION_RECORD_COLUMNS.emailAlerts}>
                {copy.emailAlertsColumn}
              </TableHead>
              <TableHead className={AUCTION_RECORD_COLUMNS.actions} />
            </TableHeader>
            <TableBody className={AUCTION_RECORD_TABLE_LAYOUT.body}>
              {rows.map((item, index) => {
                const id = rowKey(item);
                return (
                  <AuctionRecordRow
                    key={id}
                    {...item}
                    className={enterVisibilityClass(revealed)}
                    copy={{
                      openListing: copy.openListing,
                      openBidding: copy.openBidding,
                      noStanding: copy.noStanding,
                      viewOrder: copy.viewOrder,
                      ...item.copy,
                    }}
                    enterStyle={enterStyle(index + 2, revealed)}
                    exiting={exitingIds.has(id)}
                    exitEase={ROW_EXIT_EASE}
                    exitMs={ROW_EXIT_MS}
                    onWatchToggle={
                      item.onWatchToggle
                        ? () => requestUnwatch(item)
                        : undefined
                    }
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </VStack>
  );
}

export { AuctionRecord };
