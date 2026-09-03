import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { Link } from "@grade10/design-system/components/forms/link";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { cn } from "@grade10/design-system/lib/utils";
import { useEffect, useState } from "react";
import {
  type ActivityTimeCopy,
  formatActivityAt,
  isPastActivityCap,
  resolveActivityNow,
  type ShippedLocale,
} from "../../lib/format-datetime";
import type { ListingUserBidHistoryRow } from "./types";

type ListingUserBidHistoryCopy = {
  link: string;
  title: string;
  amount: string;
  type: string;
  time: string;
};

type ListingUserBidHistoryProps = {
  copy: ListingUserBidHistoryCopy;
  rows: readonly ListingUserBidHistoryRow[];
  locale: ShippedLocale;
  timeZone: string;
  activityTimeCopy: ActivityTimeCopy;
};

function bidTypeBadgeVariant(
  bidType: ListingUserBidHistoryRow["bidType"],
): "outline" | "info" {
  return bidType === "manual" ? "outline" : "info";
}

function ListingUserBidHistory({
  copy,
  rows,
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

  const referenceNow = resolveActivityNow(
    nowMs,
    ...rows.filter((row) => !row.timeOverride).map((row) => row.acceptedAtMs),
  );
  const showFullTime = rows.some(
    (row) =>
      !row.timeOverride && isPastActivityCap(row.acceptedAtMs, referenceNow),
  );
  const typeColumnClass = "w-28 shrink-0";
  const timeColumnClass = cn(
    "shrink-0 whitespace-nowrap",
    showFullTime ? "w-48" : "w-28",
  );

  if (rows.length === 0) {
    return null;
  }

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
            <DialogBody className="min-h-0 flex-1 overflow-hidden p-0">
              <Table className="flex h-full min-h-0 flex-col overflow-hidden">
                <TableHeader className="shrink-0">
                  <TableHead className="min-w-0 flex-1">
                    {copy.amount}
                  </TableHead>
                  <TableHead className={typeColumnClass}>{copy.type}</TableHead>
                  <TableHead align="end" className={timeColumnClass}>
                    {copy.time}
                  </TableHead>
                </TableHeader>
                <TableBody
                  className="scroll-fade min-h-0 flex-1 overflow-y-auto overscroll-y-contain [&_[data-slot=table-row]]:shrink-0"
                  data-slot="listing-user-bid-history-scroll"
                >
                  {rows.map((row) => (
                    <TableRow className="shrink-0" key={row.id}>
                      <TableCell className="min-w-0 flex-1">
                        {row.amountLabel}
                      </TableCell>
                      <TableCell className={typeColumnClass}>
                        <Badge
                          size="sm"
                          variant={bidTypeBadgeVariant(row.bidType)}
                        >
                          {row.bidTypeLabel}
                        </Badge>
                      </TableCell>
                      <TableCell align="end" className={timeColumnClass}>
                        {row.timeOverride ??
                          formatActivityAt(row.acceptedAtMs, {
                            locale,
                            timeZone,
                            copy: activityTimeCopy,
                            now: nowMs,
                          })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogBody>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export type { ListingUserBidHistoryCopy, ListingUserBidHistoryProps };
export { ListingUserBidHistory };
