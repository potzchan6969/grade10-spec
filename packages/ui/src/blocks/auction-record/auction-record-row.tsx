import { Badge } from "@grade10/design-system/components/display/badge";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { Text } from "@grade10/design-system/components/display/text";
import {
  Button,
  buttonVariants,
} from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { Switch } from "@grade10/design-system/components/forms/switch";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { Trash } from "@phosphor-icons/react";
import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AUCTION_RECORD_COLUMNS, AUCTION_RECORD_TABLE_LAYOUT } from "./columns";
import type {
  AuctionRecordRowProps,
  AuctionRecordRowState,
  EmailAlertsCopy,
} from "./types";

/** Badge tone per sale / bid state. The label itself stays consumer-supplied.
 *
 * Keep the table calm: most standings use muted `default` / `outline`. Reserve
 * colour for attention (`warning`), failure (`error`), and a single positive
 * live signal (`success` on Leading) — same restraint as Order History status.
 */
const STATE_VARIANT: Record<
  AuctionRecordRowState,
  "default" | "success" | "error" | "warning" | "info" | "outline"
> = {
  scheduled: "outline",
  live: "default",
  ending_soon: "warning",
  ended: "outline",
  leading: "success",
  outbid: "warning",
  bid_submitted: "default",
  bid_not_accepted: "error",
  awaiting_payment: "warning",
  awaiting_address: "warning",
  preparing_invoice: "default",
  payment_problem: "error",
  paid: "outline",
  shipped: "outline",
  delivered: "outline",
  hold_releasing: "outline",
  hold_released: "outline",
  pending_payment: "warning",
  expired: "error",
  processing: "default",
  cancelled: "outline",
  refunded: "outline",
};

type AuctionRecordRowViewProps = AuctionRecordRowProps & {
  /** Page enter stagger — keeps subgrid; delay cleared while exiting. */
  enterStyle?: CSSProperties;
  /** Collapse + fade before the application drops the row. */
  exiting?: boolean;
  exitMs?: number;
  exitEase?: string;
};

function LotThumbnail({
  imageSrc,
  imageAlt,
}: {
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div
      aria-hidden={imageSrc ? undefined : true}
      className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
      data-slot="auction-record-row-image"
    >
      {imageSrc ? (
        <img
          alt={imageAlt ?? ""}
          className="absolute inset-0 size-full object-cover"
          src={imageSrc}
        />
      ) : null}
    </div>
  );
}

/**
 * Toasts once per confirmed change of the controlled `emailAlerts` value, so
 * the message follows what the application accepted rather than the click that
 * asked for it. Copy is consumer-supplied; without it, nothing is announced.
 * The application mounts one design-system `<Toast />` at its root.
 */
function useEmailAlertsToast(
  enabled: boolean,
  copy: EmailAlertsCopy | undefined,
  active: boolean,
) {
  const previous = useRef(enabled);

  useEffect(() => {
    if (previous.current === enabled) return;
    previous.current = enabled;
    if (!active || !copy) return;

    const message = enabled ? copy.enabledToast : copy.mutedToast;
    if (!message) return;

    toast(
      message.title,
      message.description ? { description: message.description } : undefined,
    );
  }, [active, copy, enabled]);
}

/**
 * One My Auctions table row: Auction, Current Bid, Your Standing, Email
 * alerts, and Unwatch when the application supplies it for a watch-only lot.
 *
 * Figma composition `Auction Watchlist` (`6507:5463`) — Table Row + cells.
 * Product / Image (`4872:8386`) as the key-image well; standing badge or the
 * consumer `noStanding` placeholder; Switch for alerts; secondary Unwatch.
 */
function AuctionRecordRow({
  title,
  state,
  stateLabel,
  detail,
  currentBid,
  closesAt,
  imageSrc,
  imageAlt,
  href,
  bidPlaced,
  copy,
  onOpen,
  watchPending,
  watchCopy,
  onWatchToggle,
  emailAlerts,
  emailAlertsPending,
  emailAlertsDisabled,
  emailAlertsCopy,
  onEmailAlertsChange,
  className,
  enterStyle,
  exiting = false,
  exitMs = 200,
  exitEase = "cubic-bezier(0.23,1,0.32,1)",
}: AuctionRecordRowViewProps) {
  const alertsEnabled = emailAlerts ?? true;
  const showEmailAlerts = Boolean(onEmailAlertsChange && emailAlertsCopy);
  // Unwatch only when the application supplies it — bid rows omit these props.
  const showUnwatch = Boolean(onWatchToggle && watchCopy) && !bidPlaced;
  // Winner Order entry — consumer supplies viewOrder + href only on won rows.
  const showViewOrder = Boolean(copy?.viewOrder && href) && !showUnwatch;
  const noStanding = copy?.noStanding ?? "--";
  const unwatchLabel = watchCopy?.unwatch ?? watchCopy?.watching ?? "Unwatch";
  const listingLabel = copy?.openListing
    ? `${copy.openListing}: ${title}`
    : title;
  const viewOrderLabel = copy?.viewOrder
    ? `${copy.viewOrder}: ${title}`
    : undefined;

  const rowRef = useRef<HTMLDivElement>(null);
  const [collapseHeight, setCollapseHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!exiting) {
      setCollapseHeight(null);
      return;
    }
    const el = rowRef.current;
    if (!el || collapseHeight !== null) return;
    setCollapseHeight(el.getBoundingClientRect().height);
  }, [exiting, collapseHeight]);

  useLayoutEffect(() => {
    if (!exiting || collapseHeight === null || collapseHeight === 0) return;
    const frame = requestAnimationFrame(() => setCollapseHeight(0));
    return () => cancelAnimationFrame(frame);
  }, [exiting, collapseHeight]);

  useEmailAlertsToast(alertsEnabled, emailAlertsCopy, showEmailAlerts);

  const titleNode = href ? (
    <Link aria-label={listingLabel} className="truncate" href={href} size="sm">
      {title}
    </Link>
  ) : onOpen ? (
    <Link
      aria-label={listingLabel}
      className="truncate"
      render={<button onClick={onOpen} type="button" />}
      size="sm"
    >
      {title}
    </Link>
  ) : (
    <Text className="truncate" size="sm" weight="medium">
      {title}
    </Text>
  );

  const alertsNote =
    showEmailAlerts && emailAlertsDisabled
      ? emailAlertsCopy?.disabledReason
      : undefined;

  return (
    <TableRow
      ref={rowRef}
      aria-hidden={exiting || undefined}
      className={cn(
        AUCTION_RECORD_TABLE_LAYOUT.row,
        "items-center overflow-hidden",
        // Own the transition so enter className cannot drop `height`.
        "transition-[height,opacity,transform,border-color] duration-[250ms] motion-reduce:transition-none",
        className,
        // After enter visibility classes so exit opacity/translate win.
        exiting &&
          "pointer-events-none -translate-y-1 border-transparent opacity-0",
      )}
      data-exiting={exiting || undefined}
      data-slot="auction-record-row"
      data-state={state}
      style={{
        transitionTimingFunction: exitEase,
        ...(exiting
          ? { transitionDelay: "0ms", transitionDuration: `${exitMs}ms` }
          : enterStyle),
        ...(collapseHeight != null ? { height: collapseHeight } : null),
      }}
    >
      <TableCell className={AUCTION_RECORD_COLUMNS.auction}>
        <div className="flex items-center gap-4">
          <LotThumbnail imageAlt={imageAlt} imageSrc={imageSrc} />
          <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
            {titleNode}
            {closesAt != null ? (
              <Text className="truncate text-secondary-foreground" size="xs">
                {closesAt}
              </Text>
            ) : null}
            {detail != null ? (
              <Text className="truncate text-secondary-foreground" size="xs">
                {detail}
              </Text>
            ) : null}
          </VStack>
        </div>
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.currentBid}>
        <Text className="tabular-nums whitespace-nowrap" size="sm">
          {currentBid ?? noStanding}
        </Text>
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.standing}>
        {stateLabel ? (
          <Badge size="sm" variant={STATE_VARIANT[state]}>
            {stateLabel}
          </Badge>
        ) : (
          <Text size="sm" tone="secondary">
            {noStanding}
          </Text>
        )}
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.emailAlerts}>
        {showEmailAlerts && emailAlertsCopy && onEmailAlertsChange ? (
          <VStack gap="xs" hAlign="start">
            <Switch
              aria-busy={emailAlertsPending || undefined}
              aria-label={
                alertsEnabled
                  ? emailAlertsCopy.onAriaLabel
                  : emailAlertsCopy.offAriaLabel
              }
              checked={alertsEnabled}
              disabled={
                Boolean(emailAlertsDisabled) || Boolean(emailAlertsPending)
              }
              onCheckedChange={(checked) =>
                onEmailAlertsChange(checked === true)
              }
              size="md"
            />
            {alertsNote ? (
              <Text size="xs" tone="secondary">
                {alertsNote}
              </Text>
            ) : null}
          </VStack>
        ) : null}
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.actions}>
        {showViewOrder && href && copy?.viewOrder ? (
          <a
            aria-label={viewOrderLabel}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            href={href}
          >
            {copy.viewOrder}
          </a>
        ) : null}
        {showUnwatch && watchCopy && onWatchToggle ? (
          <Button
            aria-busy={watchPending || undefined}
            aria-label={watchCopy.unwatchAriaLabel}
            disabled={watchPending || exiting}
            leading={<Trash aria-hidden />}
            onClick={onWatchToggle}
            size="sm"
            variant="secondary"
          >
            {unwatchLabel}
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

export { AuctionRecordRow };
