import { cn } from "@grade10/design-system/lib/utils";
import {
  CalendarBlank,
  Check,
  CreditCard,
  MapPin,
} from "@phosphor-icons/react";
import { type ReactNode, useId, useState } from "react";
import type {
  BookingConfirmationCopy,
  BookingConfirmationProps,
} from "../appointment-booking/booking-confirmation";
import {
  INK_2,
  PILL_OUTLINE,
  PILL_PRIMARY,
  TEXT_LINK,
} from "../appointment-booking/booking-look";
import { formatBookingWhen } from "../appointment-booking/booking-when";
import type { FactRow } from "../page-blocks/fact-card";
import type { VisitPassCopy } from "./visit-pass";

type VisitBookedPassCopy = {
  confirmation: BookingConfirmationCopy;
  /** The pass's words, drawn when the visit has a name. */
  pass: VisitPassCopy;
  directions: string;
  /** Until when it can be changed or cancelled. */
  until: string;
  before: string;
  getThere: string;
  another: string;
  /** Said on the calendar press once the file is taken: `Calendar file saved`. */
  calendarSaved?: string;
  /** The mark at the top of the pass: `Grade10`. */
  brand?: string;
};

type VisitBookedPassProps = {
  copy: VisitBookedPassCopy;
  confirmation: Omit<BookingConfirmationProps, "copy" | "className">;
  /** Who the visit is booked for; without a name the pass names no one. */
  name?: string | null;
  /** The visit's time, worded: `Thu 22 Oct, 15:00 to 15:30 HKT`. */
  when?: string;
  /** What was paid at booking, drawn on the pass. */
  paid?: { label: string; value: ReactNode; refund?: ReactNode };
  /** Under the sent line: the receipt went with the mail. */
  receipt?: ReactNode;
  /** The shop on a map, opened outside the site. */
  directionsHref: string;
  /** What to bring and know, one line each. */
  before: readonly string[];
  /** The shop's name, address, directions and phone; the values are drawn
   * unlabelled, the first as the shop's name. */
  getThere: readonly FactRow[];
  onAgain: () => void;
  className?: string;
};

const CARD = "flex flex-col rounded-xl border border-border px-4 py-3.5";

/** Booked: the pass with the calendar file, Directions and the way to change
 * it; beside it what to bring, how to get there, and what the collector told
 * us. */
function VisitBookedPass({
  copy,
  confirmation,
  name,
  when,
  paid,
  receipt,
  directionsHref,
  before,
  getThere,
  onAgain,
  className,
}: VisitBookedPassProps) {
  const ids = useId();
  const [saved, setSaved] = useState(false);
  const { record, answers = [], manageHref, calendarHref } = confirmation;
  const span =
    when ??
    formatBookingWhen({
      start: record.start,
      end: record.end,
      timeZone: record.timeZone,
      timeZoneLabel: confirmation.timeZoneLabel,
      locale: confirmation.locale,
    });
  const [shop, ...lines] = getThere;
  return (
    <section
      aria-labelledby={`${ids}-done`}
      className={cn(
        "flex animate-in flex-col gap-6 slide-in-from-bottom-2 duration-200",
        className,
      )}
      data-slot="booking-booked"
    >
      <div className="flex flex-col gap-2">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-success-muted text-(--green-700)"
        >
          <Check size={20} weight="bold" />
        </span>
        <h1
          className="m-0 text-2xl leading-[30px] font-bold"
          id={`${ids}-done`}
        >
          {copy.confirmation.title}
        </h1>
        <p
          className={cn("m-0 text-[15px] leading-[22px]", INK_2)}
          role="status"
        >
          {copy.confirmation.body}
        </p>
        {receipt ? (
          <p className="m-0 flex items-center gap-2 text-sm leading-5 text-(--green-700) tabular-nums">
            <CreditCard aria-hidden size={14} />
            {receipt}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 max-w-[400px] flex-[1_1_300px] flex-col gap-3">
          <div
            className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-md"
            data-slot="visit-pass"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold">{copy.brand ?? ""}</span>
              <span className="inline-flex h-5.5 items-center rounded-full bg-success-muted px-2.5 text-[11px] font-bold text-(--green-700)">
                {copy.pass.title}
              </span>
            </div>
            {name ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs leading-4 text-secondary-foreground">
                  {copy.pass.nameLabel}
                </span>
                <span className="text-[32px] leading-10 font-bold [overflow-wrap:anywhere]">
                  {name}
                </span>
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <span className="text-lg leading-6 font-bold">
                {record.service}
              </span>
              <span className="text-[15px] leading-[22px] font-semibold tabular-nums">
                {span}
              </span>
              <span className={cn("text-sm leading-5", INK_2)}>
                {record.location}
                {record.address ? <> · {record.address}</> : null}
              </span>
            </div>
            {paid ? (
              <div
                className="flex flex-col gap-0.5 border-t border-border pt-3"
                data-slot="visit-pass-paid"
              >
                <span className="flex justify-between gap-3 text-sm leading-5">
                  <span className={INK_2}>{paid.label}</span>
                  <span className="font-bold tabular-nums">{paid.value}</span>
                </span>
                {paid.refund ? (
                  <span className="text-[13px] leading-[18px] text-secondary-foreground">
                    {paid.refund}
                  </span>
                ) : null}
              </div>
            ) : null}
            {copy.pass.note ? (
              <div className="flex flex-col items-center border-t border-dashed border-border-strong pt-4">
                <span className="text-center text-[13px] leading-[18px] text-secondary-foreground">
                  {copy.pass.note}
                </span>
              </div>
            ) : null}
          </div>
          {calendarHref ? (
            <a
              className={cn(PILL_PRIMARY, "no-underline")}
              data-slot="booking-calendar-link"
              download="visit.ics"
              href={calendarHref}
              onClick={() => setSaved(true)}
            >
              {saved ? (
                <Check aria-hidden size={16} />
              ) : (
                <CalendarBlank aria-hidden size={16} />
              )}
              {saved && copy.calendarSaved
                ? copy.calendarSaved
                : copy.confirmation.calendar}
            </a>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <a
              className={cn(PILL_OUTLINE, "flex-[1_1_140px] text-[15px]")}
              href={directionsHref}
              rel="noopener"
              target="_blank"
            >
              <MapPin aria-hidden size={16} />
              {copy.directions}
            </a>
            <a
              className={cn(PILL_OUTLINE, "flex-[1_1_140px] text-[15px]")}
              data-slot="booking-manage-link"
              href={manageHref}
            >
              {copy.confirmation.manage}
            </a>
          </div>
          <span className="text-center text-[13px] leading-[18px] text-secondary-foreground tabular-nums">
            {copy.until}
          </span>
        </div>
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          {before.length > 0 ? (
            <section
              aria-labelledby={`${ids}-before`}
              className={cn(CARD, "gap-2")}
              data-slot="booking-before"
            >
              <h2
                className="m-0 text-[15px] leading-5 font-bold"
                id={`${ids}-before`}
              >
                {copy.before}
              </h2>
              <ul
                className={cn(
                  "m-0 flex list-disc flex-col gap-1.5 pl-[18px] text-sm leading-5 tabular-nums",
                  INK_2,
                )}
              >
                {before.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <section
            aria-labelledby={`${ids}-there`}
            className={cn(CARD, "gap-1")}
            data-slot="booking-get-there"
          >
            <h2
              className="m-0 mb-1 text-[15px] leading-5 font-bold"
              id={`${ids}-there`}
            >
              {copy.getThere}
            </h2>
            {shop ? (
              <span className="text-sm leading-5 font-semibold">
                {shop.value}
              </span>
            ) : null}
            {lines.map((line) => (
              <span className={cn("text-sm leading-5", INK_2)} key={line.label}>
                {line.value}
              </span>
            ))}
          </section>
          {answers.length > 0 ? (
            <section
              aria-labelledby={`${ids}-told`}
              className={cn(CARD, "pb-1.5")}
              data-slot="booking-answers"
            >
              <h2
                className="m-0 mb-1.5 text-[15px] leading-5 font-bold"
                id={`${ids}-told`}
              >
                {copy.confirmation.answers}
              </h2>
              <dl className="m-0">
                {answers.map((line) => (
                  <div
                    className="flex justify-between gap-4 border-t border-border py-2 text-sm leading-5"
                    key={line.key}
                  >
                    <dt className={INK_2}>{line.label}</dt>
                    <dd className="m-0 text-right font-semibold [overflow-wrap:anywhere] tabular-nums">
                      {typeof line.answer === "string"
                        ? line.answer
                        : line.answer.join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          <button
            className={cn(TEXT_LINK, "self-start")}
            onClick={onAgain}
            type="button"
          >
            {copy.another}
          </button>
        </div>
      </div>
    </section>
  );
}

export type { VisitBookedPassCopy, VisitBookedPassProps };
export { VisitBookedPass };
