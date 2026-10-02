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
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { Trash } from "@phosphor-icons/react";
import {
  type CSSProperties,
  type RefObject,
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
  awaiting_payment: "warning",
  awaiting_address: "warning",
  awaiting_address_expired: "error",
  preparing_invoice: "default",
  payment_problem: "error",
  paid: "outline",
  shipped: "default",
  delivered: "outline",
  pending_payment: "warning",
  expired: "error",
  payment_verifying: "default",
  partially_paid: "warning",
  processing: "default",
  cancelled: "outline",
  refunded: "outline",
};

type AuctionRecordRowFactLabels = {
  currentBid: string;
  standing: string;
  emailAlerts: string;
};

type AuctionRecordRowViewProps = AuctionRecordRowProps & {
  /** Page enter stagger — keeps subgrid; delay cleared while exiting. */
  enterStyle?: CSSProperties;
  /** Collapse + fade before the application drops the row. */
  exiting?: boolean;
  exitMs?: number;
  exitEase?: string;
  /**
   * `table` (default) for the md+ grid; `card` for the stacked small-viewport
   * list inside `AuctionRecord`.
   */
  presentation?: "table" | "card";
  /** Column labels reused as card fact labels when `presentation="card"`. */
  factLabels?: AuctionRecordRowFactLabels;
};

function LotThumbnail({
  imageSrc,
  imageAlt,
  size = "sm",
}: {
  imageSrc?: string;
  imageAlt?: string;
  /** `sm` for the table row; `lg` for the card (same footprint, tighter radii). */
  size?: "sm" | "lg";
}) {
  return (
    <div
      aria-hidden={imageSrc ? undefined : true}
      className={cn(
        "relative size-14 max-h-14 max-w-14 shrink-0 overflow-hidden border border-border bg-gradient-to-b from-background-subtle to-muted",
        // Card shell stays `rounded-2xl`; the thumb uses a tighter radius.
        size === "lg" ? "rounded-md" : "rounded-lg",
      )}
      data-slot="auction-record-row-image"
    >
      {imageSrc ? (
        <img
          alt={imageAlt ?? ""}
          // `contain` keeps portrait fixtures fully visible in the square.
          className="absolute inset-0 size-full object-contain"
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

function useCollapseOnExit(exiting: boolean): {
  ref: RefObject<HTMLElement | null>;
  collapseHeight: number | null;
} {
  const ref = useRef<HTMLElement>(null);
  const [collapseHeight, setCollapseHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!exiting) {
      setCollapseHeight(null);
      return;
    }
    const el = ref.current;
    if (!el || collapseHeight !== null) return;
    setCollapseHeight(el.getBoundingClientRect().height);
  }, [exiting, collapseHeight]);

  useLayoutEffect(() => {
    if (!exiting || collapseHeight === null || collapseHeight === 0) return;
    const frame = requestAnimationFrame(() => setCollapseHeight(0));
    return () => cancelAnimationFrame(frame);
  }, [exiting, collapseHeight]);

  return { ref, collapseHeight };
}

/**
 * One My Auctions lot: Auction, Current Bid, Status, Email alerts, and
 * Unwatch when the application supplies it for a watch-only lot.
 *
 * Figma composition `Auction Watchlist` (`6507:5463`) — Table Row + cells
 * from `md`. Below `md`, `AuctionRecord` asks for `presentation="card"`.
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
  presentation = "table",
  factLabels,
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

  const { ref, collapseHeight } = useCollapseOnExit(exiting);

  useEmailAlertsToast(alertsEnabled, emailAlertsCopy, showEmailAlerts);

  const titleClassName =
    presentation === "card"
      ? // Link defaults to `w-fit` + nowrap-friendly flex; card needs the full
        // column width so the title wraps instead of clipping mid-glyph.
        "w-full max-w-full justify-start whitespace-normal font-medium [overflow-wrap:anywhere]"
      : "truncate font-medium";

  // Card presentation: the whole card is the hit target (overlay link), so the
  // title stays plain text — nested anchors are invalid.
  const titleNode =
    presentation === "card" ? (
      <Text
        className="w-full font-medium [overflow-wrap:anywhere]"
        size="sm"
        weight="medium"
      >
        {title}
      </Text>
    ) : href ? (
      <Link
        aria-label={listingLabel}
        className={titleClassName}
        href={href}
        size="sm"
      >
        {title}
      </Link>
    ) : onOpen ? (
      <Link
        aria-label={listingLabel}
        className={titleClassName}
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

  // Whole-card hit target uses the listing/order open label; footer CTAs keep
  // their own names (Setup / View order / Unwatch).
  const cardNavigateLabel = listingLabel;

  const alertsNote =
    showEmailAlerts && emailAlertsDisabled
      ? emailAlertsCopy?.disabledReason
      : undefined;

  const bidValue = (
    <Text className="tabular-nums whitespace-nowrap" size="sm">
      {currentBid ?? noStanding}
    </Text>
  );

  const cardBidValue = (
    <Text className="tabular-nums whitespace-nowrap" size="xs" weight="medium">
      {currentBid ?? noStanding}
    </Text>
  );

  const standingValue = stateLabel ? (
    <Badge size="sm" variant={STATE_VARIANT[state]}>
      {stateLabel}
    </Badge>
  ) : (
    <Text size="sm" tone="secondary">
      {noStanding}
    </Text>
  );

  const cardStandingValue = stateLabel ? (
    <Badge size="sm" variant={STATE_VARIANT[state]}>
      {stateLabel}
    </Badge>
  ) : null;

  const alertsControl =
    showEmailAlerts && emailAlertsCopy && onEmailAlertsChange ? (
      <VStack gap="xs" hAlign="start">
        <Switch
          aria-busy={emailAlertsPending || undefined}
          aria-label={
            alertsEnabled
              ? emailAlertsCopy.onAriaLabel
              : emailAlertsCopy.offAriaLabel
          }
          checked={alertsEnabled}
          disabled={Boolean(emailAlertsDisabled) || Boolean(emailAlertsPending)}
          onCheckedChange={(checked) => onEmailAlertsChange(checked === true)}
          size="md"
        />
        {alertsNote ? (
          <Text size="xs" tone="secondary">
            {alertsNote}
          </Text>
        ) : null}
      </VStack>
    ) : null;

  /** Card footer: label beside the switch (Figma AcutionRecordCard). */
  const cardAlertsControl =
    showEmailAlerts && emailAlertsCopy && onEmailAlertsChange ? (
      <HStack className="shrink-0" gap="sm" vAlign="center">
        {factLabels?.emailAlerts ? (
          <Text
            className="whitespace-nowrap text-secondary-foreground"
            size="xs"
          >
            {factLabels.emailAlerts}
          </Text>
        ) : null}
        <Switch
          aria-busy={emailAlertsPending || undefined}
          aria-label={
            alertsEnabled
              ? emailAlertsCopy.onAriaLabel
              : emailAlertsCopy.offAriaLabel
          }
          checked={alertsEnabled}
          disabled={Boolean(emailAlertsDisabled) || Boolean(emailAlertsPending)}
          onCheckedChange={(checked) => onEmailAlertsChange(checked === true)}
          size="md"
        />
      </HStack>
    ) : null;

  const tableActionControl =
    showViewOrder && href && copy?.viewOrder ? (
      <a
        aria-label={viewOrderLabel}
        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        href={href}
      >
        {copy.viewOrder}
      </a>
    ) : showUnwatch && watchCopy && onWatchToggle ? (
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
    ) : null;

  /** Card footer action — text Link, not a filled button (Figma). */
  const cardActionControl =
    showViewOrder && href && copy?.viewOrder ? (
      <Link aria-label={viewOrderLabel} href={href} size="xs">
        {copy.viewOrder}
      </Link>
    ) : showUnwatch && watchCopy && onWatchToggle ? (
      <Link
        aria-busy={watchPending || undefined}
        aria-label={watchCopy.unwatchAriaLabel}
        disabled={watchPending || exiting}
        render={<button onClick={onWatchToggle} type="button" />}
        size="xs"
        variant="error"
      >
        {unwatchLabel}
      </Link>
    ) : null;

  const motionStyle = {
    transitionTimingFunction: exitEase,
    ...(exiting
      ? { transitionDelay: "0ms", transitionDuration: `${exitMs}ms` }
      : enterStyle),
    ...(collapseHeight != null ? { height: collapseHeight } : null),
  } as const;

  const motionClassName = cn(
    "overflow-hidden",
    "transition-[height,opacity,transform,border-color] duration-[250ms] motion-reduce:transition-none",
    className,
    exiting &&
      "pointer-events-none -translate-y-1 border-transparent opacity-0",
  );

  if (presentation === "card") {
    const showFooter = cardAlertsControl != null || cardActionControl != null;
    const bidLabel = factLabels?.currentBid
      ? `${factLabels.currentBid}:`
      : null;

    return (
      <li
        ref={ref as RefObject<HTMLLIElement | null>}
        aria-hidden={exiting || undefined}
        className={cn(
          "relative list-none rounded-2xl border border-border bg-card p-2",
          motionClassName,
        )}
        data-exiting={exiting || undefined}
        data-slot="auction-record-card"
        data-state={state}
        style={motionStyle}
      >
        {href ? (
          <a className="absolute inset-0 z-0 rounded-2xl" href={href}>
            <span className="sr-only">{cardNavigateLabel}</span>
          </a>
        ) : onOpen ? (
          <button
            aria-label={cardNavigateLabel}
            className="absolute inset-0 z-0 cursor-pointer rounded-2xl"
            onClick={onOpen}
            type="button"
          />
        ) : null}
        <div className="pointer-events-none relative z-0 flex w-full flex-col gap-3">
          <div className="flex items-start gap-4">
            <LotThumbnail imageAlt={imageAlt} imageSrc={imageSrc} size="lg" />
            <VStack className="min-w-0 flex-1" gap="sm" hAlign="start">
              {cardStandingValue}
              <VStack className="min-w-0 w-full" gap="none" hAlign="start">
                {titleNode}
                {closesAt != null ? (
                  <Text className="text-secondary-foreground" size="xs">
                    {closesAt}
                  </Text>
                ) : null}
                {detail != null ? (
                  <Text className="text-secondary-foreground" size="xs">
                    {detail}
                  </Text>
                ) : null}
              </VStack>
              <HStack className="w-full min-w-0" gap="xs" vAlign="center">
                {bidLabel ? (
                  <Text
                    className="shrink-0 whitespace-nowrap text-secondary-foreground"
                    size="xs"
                  >
                    {bidLabel}
                  </Text>
                ) : null}
                {cardBidValue}
              </HStack>
            </VStack>
          </div>

          {showFooter ? (
            <div className="pointer-events-auto relative z-10 flex w-full items-center gap-2 border-t border-border px-2 pt-2 pb-1">
              {cardActionControl}
              {cardAlertsControl ? (
                <div className="ml-auto">{cardAlertsControl}</div>
              ) : null}
            </div>
          ) : null}
        </div>
      </li>
    );
  }

  return (
    <TableRow
      ref={ref as RefObject<HTMLDivElement | null>}
      aria-hidden={exiting || undefined}
      className={cn(
        AUCTION_RECORD_TABLE_LAYOUT.row,
        "items-center",
        motionClassName,
      )}
      data-exiting={exiting || undefined}
      data-slot="auction-record-row"
      data-state={state}
      style={motionStyle}
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
        {bidValue}
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.standing}>
        {standingValue}
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.emailAlerts}>
        {alertsControl}
      </TableCell>

      <TableCell className={AUCTION_RECORD_COLUMNS.actions}>
        {tableActionControl}
      </TableCell>
    </TableRow>
  );
}

export type { AuctionRecordRowFactLabels };
export { AuctionRecordRow };
