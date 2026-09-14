import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Link } from "@grade10/design-system/components/forms/link";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { cn } from "@grade10/design-system/lib/utils";
import { Gavel } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  type ActivityTimeCopy,
  formatActivityAt,
  isPastActivityCap,
  resolveActivityNow,
  type ShippedLocale,
} from "../../lib/format-datetime";
import type {
  ListingUserBidHistoryRow,
  ListingUserMaximumHistoryRow,
} from "./types";

type ListingUserBidHistoryCopy = {
  link: string;
  title: string;
  /** Covers both lists: bid-up-to-max and same-max tie rule. */
  description: string;
  maximumsTab: string;
  bidsTab: string;
  maximumColumn: string;
  bidColumn: string;
  time: string;
  /** Frameless empty-state title when Bid placed has no rows. */
  emptyBidsTitle: string;
  /** Frameless empty-state description under the title. */
  emptyBidsDescription: string;
};

type ListingUserBidHistoryProps = {
  copy: ListingUserBidHistoryCopy;
  maximumRows: readonly ListingUserMaximumHistoryRow[];
  bidRows: readonly ListingUserBidHistoryRow[];
  locale: ShippedLocale;
  timeZone: string;
  activityTimeCopy: ActivityTimeCopy;
};

type HistoryTab = "maximums" | "bids";

function ListingUserBidHistory({
  copy,
  maximumRows,
  bidRows,
  locale,
  timeZone,
  activityTimeCopy,
}: ListingUserBidHistoryProps) {
  const [open, setOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const timedRows = useMemo(
    () => [...maximumRows, ...bidRows],
    [maximumRows, bidRows],
  );

  const referenceNow = resolveActivityNow(
    nowMs,
    ...timedRows
      .filter((row) => !row.timeOverride)
      .map((row) => row.acceptedAtMs),
  );
  const showFullTime = timedRows.some(
    (row) =>
      !row.timeOverride && isPastActivityCap(row.acceptedAtMs, referenceNow),
  );
  const timeColumnClass = cn(
    "shrink-0 whitespace-nowrap",
    showFullTime ? "w-48" : "w-28",
  );

  const defaultTab: HistoryTab = bidRows.length > 0 ? "bids" : "maximums";

  if (maximumRows.length === 0 && bidRows.length === 0) {
    return null;
  }

  const formatRowTime = (row: {
    acceptedAtMs: number;
    timeOverride?: string;
  }) =>
    row.timeOverride ??
    formatActivityAt(row.acceptedAtMs, {
      locale,
      timeZone,
      copy: activityTimeCopy,
      now: nowMs,
    });

  return (
    <>
      <Link
        data-slot="listing-user-bid-history"
        render={<button type="button" />}
        size="sm"
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        {copy.link}
      </Link>
      {open && (
        <Dialog onOpenChange={setOpen} open>
          <DialogContent
            className={cn(
              "flex min-h-0 max-h-[min(640px,calc(100svh-2rem))] flex-col overflow-hidden",
              showFullTime && "max-w-xl",
            )}
            showCloseButton
          >
            <DialogHeader showCloseButton={false}>
              <DialogTitle>{copy.title}</DialogTitle>
            </DialogHeader>
            <DialogBody className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
              <DialogDescription className="shrink-0">
                {copy.description}
              </DialogDescription>
              <Tabs
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
                defaultValue={defaultTab}
              >
                <TabsList fullWidth variant="pill">
                  <TabsTrigger value="bids">{copy.bidsTab}</TabsTrigger>
                  <TabsTrigger value="maximums">{copy.maximumsTab}</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="flex min-h-0 flex-1 flex-col overflow-hidden data-[hidden]:hidden"
                  value="bids"
                >
                  {bidRows.length === 0 ? (
                    <EmptyState
                      className="py-2"
                      compact
                      data-slot="listing-user-bid-history-empty-bids"
                      description={copy.emptyBidsDescription}
                      frameless
                      icon={<Gavel aria-hidden size={20} weight="regular" />}
                      title={copy.emptyBidsTitle}
                    />
                  ) : (
                    <Table className="flex min-h-0 flex-1 flex-col overflow-hidden">
                      <TableHeader className="shrink-0">
                        <TableHead className="min-w-0 flex-1">
                          {copy.bidColumn}
                        </TableHead>
                        <TableHead align="end" className={timeColumnClass}>
                          {copy.time}
                        </TableHead>
                      </TableHeader>
                      <TableBody
                        className="scroll-fade min-h-0 flex-1 overflow-y-auto overscroll-y-contain [&_[data-slot=table-row]]:shrink-0"
                        data-slot="listing-user-bid-history-scroll-bids"
                      >
                        {bidRows.map((row) => (
                          <TableRow className="shrink-0" key={row.id}>
                            <TableCell className="min-w-0 flex-1">
                              {row.amountLabel}
                            </TableCell>
                            <TableCell align="end" className={timeColumnClass}>
                              {formatRowTime(row)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                <TabsContent
                  className="flex min-h-0 flex-1 flex-col overflow-hidden data-[hidden]:hidden"
                  value="maximums"
                >
                  <Table className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <TableHeader className="shrink-0">
                      <TableHead className="min-w-0 flex-1">
                        {copy.maximumColumn}
                      </TableHead>
                      <TableHead align="end" className={timeColumnClass}>
                        {copy.time}
                      </TableHead>
                    </TableHeader>
                    <TableBody
                      className="scroll-fade min-h-0 flex-1 overflow-y-auto overscroll-y-contain [&_[data-slot=table-row]]:shrink-0"
                      data-slot="listing-user-bid-history-scroll-maximums"
                    >
                      {maximumRows.map((row) => (
                        <TableRow className="shrink-0" key={row.id}>
                          <TableCell className="min-w-0 flex-1">
                            {row.amountLabel}
                          </TableCell>
                          <TableCell align="end" className={timeColumnClass}>
                            {formatRowTime(row)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </DialogBody>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export type { ListingUserBidHistoryCopy, ListingUserBidHistoryProps };
export { ListingUserBidHistory };
