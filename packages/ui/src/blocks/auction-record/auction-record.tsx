import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Gavel } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
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

const NO_ROWS: readonly AuctionRecordRowProps[] = [];

/** Exit: slightly quicker than enter so Unwatch feels decisive. */
const ROW_EXIT_MS = 200;
const ROW_EXIT_EASE = ENTER_EASE;

/** Matches Tailwind `md` — table from here; cards below. */
const MD_UP_MQ = "(min-width: 768px)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True from the Tailwind `md` breakpoint up — keep one surface mounted. */
function useIsMdUp() {
  const [mdUp, setMdUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MD_UP_MQ).matches : true,
  );

  useEffect(() => {
    const media = window.matchMedia(MD_UP_MQ);
    setMdUp(media.matches);
    const onChange = () => setMdUp(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return mdUp;
}

function rowKey(item: AuctionRecordRowProps) {
  return item.id ?? item.href ?? item.title;
}

type LeavingRow = {
  item: AuctionRecordRowProps;
  index: number;
  since: number;
};

/**
 * Keeps a row the collector unwatched on screen, collapsing, for
 * `ROW_EXIT_MS` after the application drops it. The row leaves as the result
 * of its removal, so a refused Unwatch leaves it in place and pressable.
 */
function useLeavingRows(rows: readonly AuctionRecordRowProps[]) {
  const [unwatched, setUnwatched] = useState<ReadonlySet<string>>(new Set());
  const [previous, setPrevious] = useState(rows);
  const [leaving, setLeaving] = useState<ReadonlyMap<string, LeavingRow>>(
    new Map(),
  );

  if (previous !== rows) {
    const live = new Set(rows.map(rowKey));
    const next = new Map([...leaving].filter(([id]) => !live.has(id)));
    const departed = new Set<string>();
    previous.forEach((item, index) => {
      const id = rowKey(item);
      if (live.has(id) || !unwatched.has(id)) return;
      departed.add(id);
      if (!prefersReducedMotion()) {
        next.set(id, { item, index, since: performance.now() });
      }
    });
    setPrevious(rows);
    setLeaving(next);
    if (departed.size > 0) {
      setUnwatched(new Set([...unwatched].filter((id) => !departed.has(id))));
    }
  }

  useEffect(() => {
    if (leaving.size === 0) return;
    const earliest = Math.min(...[...leaving.values()].map((row) => row.since));
    const timerId = window.setTimeout(
      () => {
        const now = performance.now();
        setLeaving(
          (current) =>
            new Map(
              [...current].filter(([, row]) => now - row.since < ROW_EXIT_MS),
            ),
        );
      },
      Math.max(0, earliest + ROW_EXIT_MS - performance.now()),
    );
    return () => window.clearTimeout(timerId);
  }, [leaving]);

  const displayRows: { item: AuctionRecordRowProps; leaving: boolean }[] =
    rows.map((item) => ({ item, leaving: false }));
  for (const row of [...leaving.values()].sort((a, b) => a.index - b.index)) {
    displayRows.splice(Math.min(row.index, displayRows.length), 0, {
      item: row.item,
      leaving: true,
    });
  }

  const markUnwatched = (id: string) =>
    setUnwatched((current) => new Set(current).add(id));

  return { displayRows, markUnwatched };
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
 * list of bookmarked lots (bid lots first), or one page-level empty state.
 * Below `md` each lot is a stacked card; from `md` the five-column table
 * matches Figma `Auction Watchlist` (`6507:5463`). Site chrome stays outside,
 * and so does the `<Toast />` the application mounts at its root.
 *
 * Motion: title → header → rows stagger in; an unwatched row collapses once
 * the application drops it, and stays while its Unwatch is pending.
 */
function AuctionRecord({
  copy,
  breadcrumbs,
  watchingItems = NO_ROWS,
  biddingItems = NO_ROWS,
  onBrowseCatalogue,
  className,
}: AuctionRecordProps) {
  const revealed = useFirstPaintReveal();
  const mdUp = useIsMdUp();
  const rows = useMemo(
    () => [...biddingItems, ...watchingItems],
    [biddingItems, watchingItems],
  );
  const { displayRows, markUnwatched } = useLeavingRows(rows);
  const isEmpty = displayRows.length === 0;

  const requestUnwatch = (item: AuctionRecordRowProps) => {
    markUnwatched(rowKey(item));
    item.onWatchToggle?.();
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
      ) : mdUp ? (
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
              {/* No copy names the actions column, so it holds a cell rather
                  than a header with no name. */}
              <TableCell className={AUCTION_RECORD_COLUMNS.actions} />
            </TableHeader>
            <TableBody className={AUCTION_RECORD_TABLE_LAYOUT.body}>
              {displayRows.map(({ item, leaving }, index) => {
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
                    exiting={leaving}
                    exitEase={ROW_EXIT_EASE}
                    exitMs={ROW_EXIT_MS}
                    onWatchToggle={
                      item.onWatchToggle
                        ? () => requestUnwatch(item)
                        : undefined
                    }
                    presentation="table"
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <ul
          className="flex w-full flex-col gap-3"
          data-slot="auction-record-cards"
        >
          {displayRows.map(({ item, leaving }, index) => {
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
                exiting={leaving}
                exitEase={ROW_EXIT_EASE}
                exitMs={ROW_EXIT_MS}
                factLabels={{
                  currentBid: copy.currentBidColumn,
                  standing: copy.standingColumn,
                  emailAlerts: copy.emailAlertsColumn,
                }}
                onWatchToggle={
                  item.onWatchToggle ? () => requestUnwatch(item) : undefined
                }
                presentation="card"
              />
            );
          })}
        </ul>
      )}
    </VStack>
  );
}

export { AuctionRecord };
