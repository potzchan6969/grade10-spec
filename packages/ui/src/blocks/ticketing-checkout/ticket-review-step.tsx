import { Alert } from "@grade10/design-system/components/display/alert";
import { Link } from "@grade10/design-system/components/forms/link";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import { BookingActionBar } from "../appointment-booking/booking-action-bar";
import { NoteList, type NoteListItem } from "../page-blocks/note-list";
import { CHECKOUT_CARD, CHECKOUT_CARD_HEADING } from "./checkout-look";
import {
  TicketAgreementCheck,
  type TicketAgreementCheckCopy,
} from "./ticket-agreement-check";
import type { TicketCheckoutPayState } from "./types";

type TicketReviewStepCopy = {
  /** The way back, at the top and in the bar: `Your Details`. */
  back: string;
  /** `Check Your Order`. */
  title: string;
  /** The read-back card's heading and name: `Your Details`. */
  details: string;
  /** `Edit`. */
  edit: string;
  /** The Edit press's accessible name: `Edit your details`. */
  editLabel: string;
  /** `Name on the tickets`. */
  name: string;
  /** `Email`. */
  email: string;
  /** Under the email: a guest, `Your tickets go here as one PDF. Check it's
   * right.`; signed in, `Your account's email. Your tickets go here as one
   * PDF.` */
  emailHint: string;
  /** The notes' name: `Before you pay`. */
  notesLabel: string;
  /** Over the bar, Pay pressed unticked: `Tick the box to agree first.` */
  agreeFirst: string;
  /** Under Pay after 3 seconds of a crowd: `Lots of people are buying right
   * now. Still trying.` */
  slow: string;
  /** Under Pay, the payment page on its way: `Opening payment…` */
  opening: string;
  agreement: TicketAgreementCheckCopy;
};

type TicketReviewStepProps = {
  copy: TicketReviewStepCopy;
  /** Under the title: `[Show Name]: Sat 12 and Sun 13 Dec 2026`. */
  subtitle: string;
  /** The read-back: `Alex Chan`. */
  buyerName: string;
  /** The read-back: `alex.chan@example.com`. */
  buyerEmail: string;
  /** A price period ended while the buyer was here: what changed. */
  priceNotice?: { title: string; description: string };
  /** A refusal, or the code used up at Pay, under the title. */
  notice?: ReactNode;
  /** Your Order with the Promo code field and the points. */
  order: ReactNode;
  /** What the tick agrees to, links included: a guest the Terms of Sale and
   * Grade10's Terms and Privacy Policy, signed in the Terms of Sale only. */
  agreementStatement: ReactNode;
  /** The tick as the step opens: kept when the buyer comes back from Edit. */
  defaultAgreed?: boolean;
  /** The bot check's widget, where one is on. */
  botCheck?: ReactNode;
  /** Before you pay: where they pay, the hold, how the tickets arrive. */
  notes: readonly NoteListItem[];
  /** The refund policy, in one line. */
  refundPolicy?: string;
  /** The press: `Pay HK$1,150.00`, or `Get Tickets` for a free order. */
  payLabel: string;
  /** `slow` keeps trying in a crowd; `opening` leaves for the payment page. */
  payState?: TicketCheckoutPayState;
  onBack: () => void;
  onEdit: () => void;
  onAgreedChange?: (agreed: boolean) => void;
  /** Pay, or Get Tickets, with the tick given. */
  onPay: () => void;
  className?: string;
};

/**
 * Check Your Order, before the payment page: the name and email read back
 * with Edit, the order with its code and total, the points it earns, the tick
 * that agrees to the terms, and Pay. Pay unticked says to tick first; a
 * crowd says it is still trying; leaving says it is opening the payment
 * page.
 */
function TicketReviewStep({
  copy,
  subtitle,
  buyerName,
  buyerEmail,
  priceNotice,
  notice,
  order,
  agreementStatement,
  defaultAgreed = false,
  botCheck,
  notes,
  refundPolicy,
  payLabel,
  payState = "idle",
  onBack,
  onEdit,
  onAgreedChange,
  onPay,
  className,
}: TicketReviewStepProps) {
  const [agreed, setAgreed] = useState(defaultAgreed);
  const [tried, setTried] = useState(false);
  const busy = payState !== "idle";
  const unticked = tried && !agreed;

  const pay = () => {
    if (busy) return;
    if (!agreed) {
      setTried(true);
      return;
    }
    onPay();
  };

  return (
    <div
      className={cn("flex flex-col bg-background", className)}
      data-slot="review-step"
    >
      <div className="flex flex-col gap-5 px-4 pt-2 pb-6">
        <div className="flex flex-col gap-1">
          <Link
            className="min-h-11 self-start no-underline"
            onClick={onBack}
            render={<button type="button" />}
            size="sm"
            variant="secondary"
          >
            <CaretLeft aria-hidden size={16} />
            {copy.back}
          </Link>
          <h1 className="m-0 text-2xl leading-8 font-bold">{copy.title}</h1>
          <p className="m-0 text-sm leading-5 text-secondary-foreground">
            {subtitle}
          </p>
        </div>
        {priceNotice ? (
          <Alert
            description={priceNotice.description}
            dismissible={false}
            status="warning"
            title={priceNotice.title}
          />
        ) : null}
        {notice}
        <section
          aria-label={copy.details}
          className={cn(CHECKOUT_CARD, "gap-3")}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className={CHECKOUT_CARD_HEADING}>{copy.details}</h2>
            <Link
              aria-label={copy.editLabel}
              className="min-h-11 font-medium"
              disabled={busy}
              onClick={busy ? undefined : onEdit}
              render={<button type="button" />}
              size="sm"
            >
              {copy.edit}
            </Link>
          </div>
          <dl className="m-0 flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm leading-5 text-secondary-foreground">
                {copy.name}
              </dt>
              <dd className="m-0 text-base leading-6 font-medium">
                {buyerName}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm leading-5 text-secondary-foreground">
                {copy.email}
              </dt>
              <dd className="m-0 text-base leading-6 font-medium break-all">
                {buyerEmail}
              </dd>
              <dd className="m-0 text-sm leading-5 text-secondary-foreground">
                {copy.emailHint}
              </dd>
            </div>
          </dl>
        </section>
        {order}
        <TicketAgreementCheck
          checked={agreed}
          copy={copy.agreement}
          disabled={busy}
          invalid={unticked}
          onCheckedChange={(next) => {
            setAgreed(next);
            onAgreedChange?.(next);
          }}
          statement={agreementStatement}
        />
        {botCheck}
        <NoteList copy={{ label: copy.notesLabel }} notes={notes} />
        {refundPolicy ? (
          <p className="m-0 text-sm leading-5 text-secondary-foreground">
            {refundPolicy}
          </p>
        ) : null}
      </div>
      <BookingActionBar
        back={{ label: copy.back, onClick: onBack }}
        busy={busy}
        className="px-4"
        error={unticked ? copy.agreeFirst : undefined}
        note={
          payState === "slow"
            ? copy.slow
            : payState === "opening"
              ? copy.opening
              : undefined
        }
        noteLive={busy}
        primary={{ label: payLabel, onClick: pay }}
      />
    </div>
  );
}

export type { TicketReviewStepCopy, TicketReviewStepProps };
export { TicketReviewStep };
