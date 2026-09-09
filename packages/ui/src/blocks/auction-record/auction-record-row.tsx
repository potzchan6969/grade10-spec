import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Switch } from "@grade10/design-system/components/forms/switch";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useRef } from "react";
import type {
  AuctionRecordRowProps,
  AuctionRecordRowState,
  EmailAlertsCopy,
} from "./types";
import { WatchButton } from "./watch-button";

/** Badge tone per sale / bid state. The label itself stays consumer-supplied. */
const STATE_VARIANT: Record<
  AuctionRecordRowState,
  "default" | "success" | "error" | "warning" | "info" | "outline"
> = {
  scheduled: "outline",
  live: "success",
  ending_soon: "warning",
  ended: "default",
  leading: "success",
  outbid: "error",
  bid_submitted: "info",
  bid_not_accepted: "error",
  awaiting_payment: "warning",
  payment_problem: "error",
  paid: "success",
  shipped: "info",
  delivered: "success",
  hold_releasing: "info",
  hold_released: "default",
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
      className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-gradient-to-b from-background-subtle to-muted sm:size-20"
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
 * One fact, label over value. Facts sit in their own cells rather than reading
 * as a middle-dot run, so the amount carries the weight and the close reads as
 * a time rather than more of the same sentence.
 */
function Fact({
  label,
  value,
  strong = false,
}: {
  label?: ReactNode;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="min-w-0" data-slot="auction-record-row-fact">
      {label != null ? (
        <Text as="div" className="mb-0.5" size="xs" tone="secondary">
          {label}
        </Text>
      ) : null}
      <Text
        as="div"
        className={cn("tabular-nums", strong && "tracking-tight")}
        size="sm"
        weight={strong ? "medium" : "regular"}
        tone={strong ? "primary" : "secondary"}
      >
        {value}
      </Text>
    </div>
  );
}

function Facts({
  currentBid,
  closesAt,
  detail,
  copy,
}: Pick<AuctionRecordRowProps, "currentBid" | "closesAt" | "detail" | "copy">) {
  if (currentBid == null && closesAt == null && detail == null) return null;

  return (
    <div className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-2">
      {currentBid != null ? (
        <Fact label={copy?.currentBidLabel} strong value={currentBid} />
      ) : null}
      {closesAt != null ? (
        <Fact label={copy?.closesAtLabel} value={closesAt} />
      ) : null}
      {detail != null ? <Fact value={detail} /> : null}
    </div>
  );
}

/** Links into the Bidding section for a watched lot the collector has bid on. */
function BidOnMark({
  label,
  href,
  onOpen,
}: {
  label: string;
  href?: string;
  onOpen?: () => void;
}) {
  const content = (
    <>
      {label}
      <ArrowRight aria-hidden />
    </>
  );

  if (href) {
    return (
      <Badge
        className="gap-1 hover:bg-muted"
        render={<a href={href}>{content}</a>}
        size="sm"
        variant="outline"
      />
    );
  }

  if (onOpen) {
    return (
      <Badge
        className="cursor-pointer gap-1 hover:bg-muted"
        render={
          <button onClick={onOpen} type="button">
            {content}
          </button>
        }
        size="sm"
        variant="outline"
      />
    );
  }

  return (
    <Badge size="sm" variant="outline">
      {label}
    </Badge>
  );
}

function EmailAlertsControl({
  enabled,
  pending,
  disabled,
  copy,
  onChange,
}: {
  enabled: boolean;
  pending?: boolean;
  disabled?: boolean;
  copy: EmailAlertsCopy;
  onChange: (enabled: boolean) => void;
}) {
  const isLocked = Boolean(disabled) || Boolean(pending);

  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-control px-3",
        isLocked && "opacity-60",
      )}
      data-slot="auction-record-row-email-alerts"
    >
      {/* Envelope, not a bell: the bell belongs to the watch control, and
          these alerts are mail. The switch carries on / off. */}
      <span
        className={cn(
          "inline-flex",
          enabled ? "text-foreground" : "text-muted-foreground",
        )}
        aria-hidden
      >
        <EnvelopeSimple size={14} />
      </span>
      <Text className="hidden sm:inline" size="xs" tone="secondary">
        {copy.label}
      </Text>
      <Switch
        aria-busy={pending || undefined}
        aria-label={enabled ? copy.onAriaLabel : copy.offAriaLabel}
        checked={enabled}
        disabled={isLocked}
        onCheckedChange={(checked) => onChange(checked === true)}
        size="md"
      />
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
  biddingHref,
  onOpenBidding,
  copy,
  onOpen,
  watched,
  watchPending,
  watchCopy,
  onWatchToggle,
  emailAlerts,
  emailAlertsPending,
  emailAlertsDisabled,
  emailAlertsCopy,
  onEmailAlertsChange,
  className,
}: AuctionRecordRowProps) {
  const alertsEnabled = emailAlerts ?? true;
  const showEmailAlerts = Boolean(onEmailAlertsChange && emailAlertsCopy);
  const showWatch = Boolean(onWatchToggle && watchCopy);
  const bidLabel = bidPlaced ? copy?.openBidding : undefined;
  const listingLabel = copy?.openListing
    ? `${copy.openListing}: ${title}`
    : title;

  useEmailAlertsToast(alertsEnabled, emailAlertsCopy, showEmailAlerts);

  const identity = (
    <>
      <LotThumbnail imageAlt={imageAlt} imageSrc={imageSrc} />
      <div className="min-w-0 flex-1">
        <Text
          as="div"
          className="group-hover/row:underline group-hover/row:underline-offset-4"
          size="base"
          truncate
          weight="medium"
        >
          {title}
        </Text>
        <Facts
          closesAt={closesAt}
          copy={copy}
          currentBid={currentBid}
          detail={detail}
        />
      </div>
    </>
  );

  const isLink = Boolean(href);
  const isButton = !isLink && Boolean(onOpen);

  // Why the alerts switch is locked reads as a note under the row, so it never
  // stretches the action cluster it explains.
  const alertsNote =
    showEmailAlerts && emailAlertsDisabled
      ? emailAlertsCopy?.disabledReason
      : undefined;

  return (
    <div
      className={cn(
        "group/row rounded-2xl border border-border bg-card p-4",
        "transition-[border-color,background-color] duration-150 ease-out",
        "sm:p-5",
        (isLink || isButton) && "hover:border-border-strong",
        "motion-reduce:transition-none",
        className,
      )}
      data-slot="auction-record-row"
      data-state={state}
    >
      {/* Wraps rather than switching direction: below ~19rem of identity the
          action cluster drops to its own line. */}
      <HStack gap="lg" vAlign="center" wrap>
        {isLink ? (
          <a
            aria-label={listingLabel}
            className="flex min-w-72 flex-1 items-start gap-4 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            href={href}
          >
            {identity}
          </a>
        ) : isButton ? (
          <button
            aria-label={listingLabel}
            className="flex min-w-72 flex-1 items-start gap-4 rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onOpen}
            type="button"
          >
            {identity}
          </button>
        ) : (
          <div className="flex min-w-72 flex-1 items-start gap-4">
            {identity}
          </div>
        )}

        <HStack gap="sm" vAlign="center" wrap>
          {stateLabel ? (
            <Badge size="sm" variant={STATE_VARIANT[state]}>
              {stateLabel}
            </Badge>
          ) : null}

          {bidLabel ? (
            <BidOnMark
              href={biddingHref}
              label={bidLabel}
              onOpen={onOpenBidding}
            />
          ) : null}

          {showEmailAlerts && emailAlertsCopy && onEmailAlertsChange ? (
            <EmailAlertsControl
              copy={emailAlertsCopy}
              disabled={emailAlertsDisabled}
              enabled={alertsEnabled}
              onChange={onEmailAlertsChange}
              pending={emailAlertsPending}
            />
          ) : null}

          {showWatch && watchCopy && onWatchToggle ? (
            <WatchButton
              copy={watchCopy}
              onPress={onWatchToggle}
              pending={watchPending}
              watched={watched ?? true}
            />
          ) : null}
        </HStack>
      </HStack>

      {alertsNote ? (
        <Text
          as="p"
          className="mt-4 border-t border-border-subtle pt-3"
          size="xs"
          tone="secondary"
        >
          {alertsNote}
        </Text>
      ) : null}
    </div>
  );
}

export { AuctionRecordRow };
