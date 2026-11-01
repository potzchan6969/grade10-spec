import { Badge } from "@grade10/design-system/components/display/badge";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { cn } from "@grade10/design-system/lib/utils";
import { Check, Lightning } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { EventPassPriceText } from "./event-pass-price";
import type {
  EventPassBadge,
  EventPassOpening,
  EventPassPerk,
  EventPassPrice,
  EventPassQuantity,
} from "./types";

type EventPassCardCopy = {
  /** Read before a struck-through price: `Was`. */
  was: string;
};

type EventPassCardBase = {
  copy: EventPassCardCopy;
  /** `VIP Pass`, `General Pass (Two-Day)`. Also the card's accessible name. */
  name: string;
  /** What the pass admits: `Any 2 days of the event, once a day`. */
  admits: string;
  badge?: EventPassBadge;
  /** When the pass opens, shown in place of a picker. */
  opening?: EventPassOpening;
  /** Where a later price is set, when the price in force ends:
   * `Early bird ends Sun 29 Nov, 23:59`. Drawn above `note` when both
   * apply, each its own line. */
  earlyBirdEnds?: string;
  /** A line at the foot of the card: `Sales ended when Sun 13 Dec began`,
   * or an early-access pass's `Your early access lets this email hold 4`. */
  note?: string;
  /** A sold-out pass's waiting line, at the card's foot: a
   * `TicketWaitingLineJoin`, `TicketWaitingLinePlace` or
   * `TicketWaitingLineOffer`, one per type that takes a line. */
  waitingLine?: ReactNode;
  className?: string;
};

type EventPassCardVipProps = EventPassCardBase & {
  variant: "vip";
  perks: readonly EventPassPerk[];
  price: EventPassPrice;
  quantity?: EventPassQuantity;
};

type EventPassCardRowsProps = EventPassCardBase & {
  variant: "rows";
  /** Tickets are chosen on this pass: the border turns gold. */
  chosen?: boolean;
  /** The pass's `EventPassRow`s, Adult then Child. */
  children: ReactNode;
  /** The pass's `FastPassControl`, once a ticket is chosen. */
  fastPass?: ReactNode;
};

type EventPassCardProps = EventPassCardVipProps | EventPassCardRowsProps;

function PassTitle({
  name,
  badge,
  admits,
  size,
}: {
  name: string;
  badge?: EventPassBadge;
  admits: string;
  size: "vip" | "rows";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <h2
          className={cn(
            "m-0 font-bold",
            size === "vip" ? "text-[26px] leading-8" : "text-xl leading-7",
          )}
        >
          {name}
        </h2>
        {badge ? (
          <Badge
            size="sm"
            variant={badge.tone === "access" ? "brand" : "outline"}
          >
            {badge.label}
          </Badge>
        ) : null}
      </div>
      <span className="text-sm leading-5 text-secondary-foreground">
        {admits}
      </span>
    </div>
  );
}

/** The card's foot lines: the early bird's end, then the note. */
function PassNotes({
  earlyBirdEnds,
  note,
}: {
  earlyBirdEnds?: string;
  note?: string;
}) {
  if (!earlyBirdEnds && !note) return null;
  return (
    <span
      className="flex flex-col gap-0.5 text-[13px] leading-[18px] text-secondary-foreground"
      data-slot="event-pass-notes"
    >
      {earlyBirdEnds ? <span>{earlyBirdEnds}</span> : null}
      {note ? <span>{note}</span> : null}
    </span>
  );
}

function VipCard(props: EventPassCardVipProps) {
  const {
    copy,
    name,
    admits,
    badge,
    opening,
    earlyBirdEnds,
    note,
    waitingLine,
    perks,
    price,
    quantity,
    className,
  } = props;
  return (
    <article
      aria-label={name}
      className={cn(
        "@container/pass relative overflow-hidden rounded-[20px] border-2 border-primary bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))] shadow-[0_12px_32px_-18px_color-mix(in_oklab,var(--primary)_70%,transparent)]",
        className,
      )}
      data-slot="event-pass-card"
      data-variant="vip"
    >
      <div className="flex flex-col gap-4 px-4 py-5 @min-[30rem]/pass:flex-row @min-[30rem]/pass:gap-6 @min-[30rem]/pass:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <PassTitle admits={admits} badge={badge} name={name} size="vip" />
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[22px]">
            {perks.map((perk) => (
              <li className="flex gap-2.5" key={perk.id}>
                {perk.kind === "fastPass" ? (
                  <span
                    aria-hidden
                    className="inline-flex mt-0.5 shrink-0 text-primary"
                  >
                    <Lightning size={16} />
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="inline-flex mt-[3px] shrink-0 text-primary"
                  >
                    <Check size={16} weight="bold" />
                  </span>
                )}
                <span>
                  {perk.lead ? (
                    <strong className="font-semibold">{perk.lead}</strong>
                  ) : null}
                  {perk.lead ? " " : null}
                  {perk.text}
                </span>
              </li>
            ))}
          </ul>
          <PassNotes earlyBirdEnds={earlyBirdEnds} note={note} />
        </div>
        <div className="flex flex-col items-start gap-4 @min-[30rem]/pass:w-[220px] @min-[30rem]/pass:shrink-0 @min-[30rem]/pass:items-end @min-[30rem]/pass:justify-between @min-[30rem]/pass:text-right">
          <EventPassPriceText
            {...price}
            className="flex-wrap gap-x-2.5 @min-[30rem]/pass:flex-col @min-[30rem]/pass:items-end"
            size="lg"
            wasAfter
            wasWord={copy.was}
          />
          {opening ? (
            <span className="flex flex-col text-sm leading-5 font-semibold tabular-nums">
              <span>{opening.label}</span>
              {opening.countdown ? (
                <span className="font-normal text-secondary-foreground">
                  {opening.countdown}
                </span>
              ) : null}
            </span>
          ) : null}
          {quantity ? (
            <StepperInput
              aria-label={quantity.label}
              className="w-[148px] @min-[30rem]/pass:w-[200px]"
              decrementLabel={quantity.decrementLabel}
              incrementLabel={quantity.incrementLabel}
              max={quantity.max}
              min={0}
              onValueChange={quantity.onValueChange}
              value={quantity.value}
            />
          ) : null}
        </div>
      </div>
      {waitingLine ? (
        <div className="flex flex-col gap-3 px-4 pb-5 @min-[30rem]/pass:px-6 @min-[30rem]/pass:pb-6">
          {waitingLine}
        </div>
      ) : null}
    </article>
  );
}

function RowsCard(props: EventPassCardRowsProps) {
  const {
    name,
    admits,
    badge,
    opening,
    earlyBirdEnds,
    note,
    waitingLine,
    chosen,
    children,
    fastPass,
    className,
  } = props;
  return (
    <article
      aria-label={name}
      className={cn(
        "@container/pass rounded-2xl border bg-card",
        chosen ? "border-primary" : "border-border",
        className,
      )}
      data-chosen={chosen || undefined}
      data-slot="event-pass-card"
      data-variant="rows"
    >
      <div className="flex flex-col gap-1 p-4 @min-[30rem]/pass:px-6 @min-[30rem]/pass:py-5">
        <div className="pb-2">
          <PassTitle admits={admits} badge={badge} name={name} size="rows" />
        </div>
        {opening ? (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background-subtle px-4 py-3 text-sm">
            <span>{opening.label}</span>
            {opening.countdown ? (
              <span className="font-semibold tabular-nums">
                {opening.countdown}
              </span>
            ) : null}
          </div>
        ) : null}
        {children}
        <PassNotes earlyBirdEnds={earlyBirdEnds} note={note} />
        {waitingLine ? (
          <div className="mt-2 flex flex-col gap-3">{waitingLine}</div>
        ) : null}
        {fastPass ? <div className="mt-2">{fastPass}</div> : null}
      </div>
    </article>
  );
}

/**
 * One pass on the event page. `vip` is the gold-tinted card that leads the
 * list: the perks, a large price and one stepper. `rows` holds a pass's kinds
 * as `EventPassRow`s (Adult, Child), turns its border gold once any is
 * chosen, and places the pass's `FastPassControl` under them.
 *
 * A pass not selling now has no picker: a grey price and a `Sales Ended`
 * badge once it ended, or its opening line before it opens. An early-access
 * pass reads `Opens …` to anyone its access rules do not let in yet, and
 * carries the `For you now` badge and a picker for whoever they do.
 *
 * During an early bird with a later price set, the foot says when the early
 * bird ends, above the early-access note when both apply. A sold-out pass
 * that takes a waiting line holds it at its foot.
 */
function EventPassCard(props: EventPassCardProps) {
  return props.variant === "vip" ? (
    <VipCard {...props} />
  ) : (
    <RowsCard {...props} />
  );
}

export type {
  EventPassCardCopy,
  EventPassCardProps,
  EventPassCardRowsProps,
  EventPassCardVipProps,
};
export { EventPassCard };
