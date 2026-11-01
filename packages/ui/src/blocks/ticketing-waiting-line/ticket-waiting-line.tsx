import { Button } from "@grade10/design-system/components/forms/button";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { cn } from "@grade10/design-system/lib/utils";
import { Clock, UsersThree } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { BookingNotice } from "../appointment-booking/booking-notice";
import type { EventPassQuantity } from "../ticketing-event-page/types";

/** What the service answered a press with, in the buyer's words:
 * `2 tickets are still on sale.`, `This offer has ended.` */
type TicketWaitingLineRefusal = {
  title: string;
  /** What to do now: `Buy what’s left, or join once they sell out.` */
  body?: string;
  /** Bumped on each repeat of the same answer: the notice shakes once. */
  attempt?: number;
};

type TicketWaitingLineJoinCopy = {
  /** `Join the Waiting Line`, or on a card of several passes,
   * `Join the Waiting Line: Child`. */
  join: string;
  /** What joining does: `If tickets come back, we’ll email you and hold
   * them for you.` */
  note?: string;
};

type TicketWaitingLineJoinProps = {
  copy: TicketWaitingLineJoinCopy;
  /** How many tickets to wait for, up to what the account may still hold;
   * none joins for what the page already chose. */
  quantity?: EventPassQuantity;
  /** An offer that ended, said above Join: `Your offer ended, and the
   * tickets went to the next person. You can join again, at the back.` */
  ended?: string;
  /** Join is pressed and the place is on its way. */
  pending?: boolean;
  refusal?: TicketWaitingLineRefusal;
  onJoin: () => void;
  className?: string;
};

type TicketWaitingLinePlaceCopy = {
  /** `You’re in the waiting line`. */
  title: string;
  /** `Waiting for 2 tickets`. */
  wanted: string;
  /** Roughly how far back, never an exact place: `You’re near the
   * front.` */
  band: string;
  /** `If tickets come back, we’ll email you and hold them for you.` */
  note?: string;
  /** `Leave the Line`. */
  leave: string;
};

type TicketWaitingLinePlaceProps = {
  copy: TicketWaitingLinePlaceCopy;
  /** Leave is pressed and the place is going. */
  leaving?: boolean;
  refusal?: TicketWaitingLineRefusal;
  onLeave: () => void;
  className?: string;
};

type TicketWaitingLineOfferCopy = {
  /** `Tickets are held for you`. */
  title: string;
  /** How many, until when, and what to do: `2 tickets are held for you
   * until 14:47, Sat 28 Nov. Pay before then to keep them.` */
  body: string;
  /** `Accept`; it opens the payment page, or confirms free tickets. */
  accept: string;
  /** `Decline`. */
  decline: string;
};

type TicketWaitingLineOfferProps = {
  copy: TicketWaitingLineOfferCopy;
  /** Accept is pressed and the payment page is on its way. */
  accepting?: boolean;
  /** Decline is pressed and the tickets are going back. */
  declining?: boolean;
  refusal?: TicketWaitingLineRefusal;
  onAccept: () => void;
  onDecline: () => void;
  /** What the taker fills before Accept, as at Check Your Order: the name
   * the tickets print and the agreement's tick. */
  children?: ReactNode;
  className?: string;
};

function Refusal({ refusal }: { refusal?: TicketWaitingLineRefusal }) {
  return refusal ? (
    <BookingNotice
      attempt={refusal.attempt}
      body={refusal.body}
      title={refusal.title}
    />
  ) : null;
}

function Panel({
  slot,
  tone,
  icon,
  title,
  children,
  className,
}: {
  slot: string;
  tone: "plain" | "offer";
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "flex flex-col gap-3 rounded-xl px-4 py-3.5",
        tone === "offer" ? "bg-primary-muted" : "bg-background-subtle",
        className,
      )}
      data-slot={slot}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={cn(
            "mt-0.5 inline-flex shrink-0",
            tone === "offer" ? "text-primary" : "text-secondary-foreground",
          )}
        >
          {icon}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <strong className="text-base leading-6 font-semibold">{title}</strong>
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Join on a sold-out pass that takes a waiting line: the how-many picker
 * where the page asks, Join, and what joining does. An offer that ended says
 * so above it, since joining again goes to the back. A refusal shows under
 * Join, which is usable again.
 */
function TicketWaitingLineJoin({
  copy,
  quantity,
  ended,
  pending = false,
  refusal,
  onJoin,
  className,
}: TicketWaitingLineJoinProps) {
  return (
    <div
      className={cn("flex flex-col items-start gap-3", className)}
      data-slot="ticket-waiting-line-join"
    >
      {ended ? (
        <p className="m-0 text-sm leading-5 text-secondary-foreground">
          {ended}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {quantity ? (
          <StepperInput
            aria-label={quantity.label}
            className="w-[148px]"
            decrementLabel={quantity.decrementLabel}
            incrementLabel={quantity.incrementLabel}
            max={quantity.max}
            min={1}
            onValueChange={quantity.onValueChange}
            value={quantity.value}
          />
        ) : null}
        <Button
          loading={pending}
          onClick={onJoin}
          type="button"
          variant="outline"
        >
          {copy.join}
        </Button>
      </div>
      {copy.note ? (
        <p className="m-0 text-[13px] leading-[18px] text-secondary-foreground">
          {copy.note}
        </p>
      ) : null}
      <Refusal refusal={refusal} />
    </div>
  );
}

/**
 * The buyer's place in a pass's waiting line: that they are in it, how many
 * tickets it waits for, roughly how far back as a band, and Leave.
 */
function TicketWaitingLinePlace({
  copy,
  leaving = false,
  refusal,
  onLeave,
  className,
}: TicketWaitingLinePlaceProps) {
  return (
    <Panel
      className={className}
      icon={<UsersThree size={20} />}
      slot="ticket-waiting-line-place"
      title={copy.title}
      tone="plain"
    >
      <span className="text-sm leading-5">{copy.wanted}</span>
      <span className="text-sm leading-5 text-secondary-foreground">
        {copy.band}
      </span>
      {copy.note ? (
        <span className="text-[13px] leading-[18px] text-secondary-foreground">
          {copy.note}
        </span>
      ) : null}
      <div className="mt-2 flex flex-col items-start gap-3">
        <Button
          loading={leaving}
          onClick={onLeave}
          size="sm"
          type="button"
          variant="outline"
        >
          {copy.leave}
        </Button>
        <Refusal refusal={refusal} />
      </div>
    </Panel>
  );
}

/**
 * Tickets the waiting line holds for the buyer: how many, until when, Accept
 * (on to payment, or confirmed where free) and Decline. While one press is
 * under way the other waits.
 */
function TicketWaitingLineOffer({
  copy,
  accepting = false,
  declining = false,
  refusal,
  onAccept,
  onDecline,
  children,
  className,
}: TicketWaitingLineOfferProps) {
  return (
    <Panel
      className={className}
      icon={<Clock size={20} />}
      slot="ticket-waiting-line-offer"
      title={copy.title}
      tone="offer"
    >
      <span className="text-sm leading-5">{copy.body}</span>
      {children ? (
        <div className="mt-2 flex flex-col gap-3">{children}</div>
      ) : null}
      <div className="mt-2 flex flex-col items-start gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={declining}
            loading={accepting}
            onClick={onAccept}
            type="button"
          >
            {copy.accept}
          </Button>
          <Button
            disabled={accepting}
            loading={declining}
            onClick={onDecline}
            type="button"
            variant="outline"
          >
            {copy.decline}
          </Button>
        </div>
        <Refusal refusal={refusal} />
      </div>
    </Panel>
  );
}

export type {
  TicketWaitingLineJoinCopy,
  TicketWaitingLineJoinProps,
  TicketWaitingLineOfferCopy,
  TicketWaitingLineOfferProps,
  TicketWaitingLinePlaceCopy,
  TicketWaitingLinePlaceProps,
  TicketWaitingLineRefusal,
};
export {
  TicketWaitingLineJoin,
  TicketWaitingLineOffer,
  TicketWaitingLinePlace,
};
