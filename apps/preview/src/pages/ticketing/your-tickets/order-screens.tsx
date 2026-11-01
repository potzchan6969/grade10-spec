import {
  TicketConfirmingDrawer,
  type TicketConfirmingDrawerStage,
  TicketOrderPage,
  type TicketOrderPageProps,
  TicketOrderStatusBanner,
  TicketPointsRow,
  TicketReturnOutcome,
  type TicketReturnOutcomeKind,
  TicketWaitingLineOffer,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import { type TicketingSession, TicketingSite } from "../ticketing-site";
import { BUYER, hkd, rich, SHOW, T, t } from "../ticketing-words";
import {
  CONFIRMING_COPY,
  FREE_TICKETS,
  LINES,
  orderCopy,
  PAID_BY,
  TICKETS,
  TICKETS_AFTER_DAY_ONE,
  TICKETS_PART_REFUNDED,
  TICKETS_REFUNDED,
} from "./your-tickets-content";

const YOUR_TICKETS_HREF = "/tickets/orders";

/** The page's foot for a signed-in buyer: lost tickets live in Your
 * Tickets. */
const lostFooter = (
  <p className="m-0 text-sm leading-5 text-secondary-foreground">
    {rich(
      T.order.lost,
      {},
      {
        link: (chunk) => (
          <a className="text-foreground underline" href={YOUR_TICKETS_HREF}>
            {chunk}
          </a>
        ),
      },
    )}
  </p>
);

const pointsAbout = (
  <TicketPointsRow
    copy={{
      label: T.order.points.label,
      value: t(T.order.points.about, { points: "115" }),
      note: t(T.order.points.aboutNote, { email: BUYER.email }),
    }}
    kind="about"
  />
);

const pointsEarned = (
  <TicketPointsRow
    copy={{ label: T.order.points.label, value: "+115" }}
    kind="earned"
  />
);

const summary = (
  more: Partial<TicketOrderPageProps["summary"]> = {},
  copy: Partial<TicketOrderPageProps["summary"]["copy"]> = {},
): TicketOrderPageProps["summary"] => ({
  copy: {
    title: T.order.lines.title,
    totalLabel: T.common.total,
    paidBy: PAID_BY,
    ...copy,
  },
  lines: LINES,
  total: hkd(1150),
  ...more,
});

export type OrderState =
  | "paid"
  | "confirmed"
  | "held"
  | "offered"
  | "checking"
  | "afterDayOne"
  | "partRefunded"
  | "refunded"
  | "eventCancelled"
  | "free"
  | "guest";

type OrderView = Omit<TicketOrderPageProps, "className">;

/** The order page in each of its states, as the OrderPhone board draws
 * them. */
function orderView(
  state: OrderState,
  onContinueToPayment: () => void,
  onSignIn: () => void,
): OrderView {
  const confirmed: OrderView = {
    copy: orderCopy(T.order.status.confirmed),
    tone: "ok",
    yourTicketsHref: YOUR_TICKETS_HREF,
    tickets: TICKETS,
    summary: summary(),
    points: pointsEarned,
    footer: lostFooter,
  };
  const unpaid = summary({}, { paidBy: undefined });
  switch (state) {
    case "confirmed":
      return confirmed;
    case "paid":
      return {
        ...confirmed,
        lead: (
          <TicketReturnOutcome
            copy={{
              status: T.return.paid.badge,
              title: T.return.paid.title,
              body: t(T.return.paid.body, { count: 3, email: BUYER.email }),
              note: t(T.return.paid.points, {
                points: "115",
                email: BUYER.email,
              }),
            }}
            kind="paid"
          />
        ),
        points: pointsAbout,
        footer: undefined,
      };
    case "held":
      return {
        copy: orderCopy(T.order.status.held, { held: true }),
        tone: "warn",
        yourTicketsHref: YOUR_TICKETS_HREF,
        tickets: [],
        summary: unpaid,
        banner: (
          <TicketOrderStatusBanner
            act={{ label: T.order.held.continue, onClick: onContinueToPayment }}
            copy={{
              title: T.order.held.heldFor,
              body: t(T.order.held.until, { count: 3, time: "14:47" }),
            }}
            countdown="12:34"
            kind="held"
          />
        ),
        footer: (
          <p className="m-0 text-sm leading-5 text-secondary-foreground">
            {T.order.held.note}
          </p>
        ),
      };
    case "offered":
      return {
        copy: orderCopy(T.order.status.offered, { held: true }),
        tone: "warn",
        yourTicketsHref: YOUR_TICKETS_HREF,
        tickets: [],
        summary: unpaid,
        banner: (
          <TicketWaitingLineOffer
            copy={{
              title: T.event.waitingLine.offer.title,
              body: t(T.event.waitingLine.offer.body, {
                count: 3,
                deadline: "14:47, Sat 28 Nov",
              }),
              accept: T.event.waitingLine.offer.accept,
              decline: T.event.waitingLine.offer.decline,
            }}
            onAccept={onContinueToPayment}
            onDecline={() => {}}
          />
        ),
      };
    case "checking":
      return {
        copy: orderCopy(T.order.status.checking, { held: true }),
        tone: "plain",
        yourTicketsHref: YOUR_TICKETS_HREF,
        tickets: [],
        summary: unpaid,
        banner: (
          <TicketOrderStatusBanner
            copy={{
              title: T.order.status.checking,
              body: T.order.checking.body,
            }}
            kind="checking"
          />
        ),
      };
    case "afterDayOne":
      return {
        ...confirmed,
        copy: orderCopy(t(T.order.status.daysLeft, { count: 1 })),
        tone: "info",
        tickets: TICKETS_AFTER_DAY_ONE,
      };
    case "partRefunded":
      return {
        ...confirmed,
        copy: orderCopy(T.order.status.partRefunded),
        tone: "info",
        tickets: TICKETS_PART_REFUNDED,
        banner: (
          <TicketOrderStatusBanner
            copy={{
              title: t(T.order.partRefund.title, { amount: hkd(190) }),
              body: t(T.order.partRefund.body, {
                count: 1,
                date: "2 Dec 2026",
                method: t(T.common.card, { brand: "Visa", last4: "4242" }),
              }),
            }}
            kind="partRefunded"
          />
        ),
        summary: summary(
          { refund: t(T.common.minus, { amount: hkd(190) }), total: hkd(960) },
          {
            totalLabel: T.order.lines.totalAfterRefund,
            refundLabel: T.order.lines.refund,
          },
        ),
        points: (
          <TicketPointsRow
            copy={{
              label: T.order.points.label,
              value: "+96",
              note: t(T.order.points.partTakenBack, { points: 19, count: 1 }),
            }}
            kind="takenBack"
          />
        ),
      };
    case "refunded":
      return {
        ...confirmed,
        copy: orderCopy(T.order.status.refunded),
        tone: "bad",
        tickets: TICKETS_REFUNDED,
        banner: (
          <TicketOrderStatusBanner
            copy={{
              title: t(T.order.fullRefund.title, {
                amount: hkd(1150),
                date: "3 Dec 2026",
              }),
              body: t(T.order.fullRefund.body, {
                method: t(T.common.card, { brand: "Visa", last4: "4242" }),
              }),
            }}
            kind="refunded"
          />
        ),
        summary: summary({}, { totalLabel: T.order.status.refunded }),
        points: (
          <TicketPointsRow
            copy={{
              label: T.order.points.label,
              value: T.order.points.takenBack,
              note: T.order.points.allTakenBack,
            }}
            kind="takenBack"
          />
        ),
      };
    case "eventCancelled":
      return {
        ...confirmed,
        copy: orderCopy(T.order.status.cancelled),
        tone: "bad",
        tickets: TICKETS_REFUNDED,
        banner: (
          <TicketOrderStatusBanner
            copy={{
              title: T.order.eventCancelled.title,
              body: t(T.order.eventCancelled.body, {
                event: SHOW.name,
                amount: hkd(1150),
                method: t(T.common.card, { brand: "Visa", last4: "4242" }),
              }),
            }}
            kind="eventCancelled"
          />
        ),
        points: undefined,
      };
    case "free":
      return {
        ...confirmed,
        copy: orderCopy(T.order.status.confirmed, { reference: "TK9F4D" }),
        tickets: FREE_TICKETS,
        summary: {
          copy: { title: T.order.lines.title, totalLabel: T.common.total },
          lines: [
            {
              key: "guest",
              label: t(T.common.lineQuantity, {
                quantity: 2,
                pass: "Guest Pass (Two-Day)",
              }),
              amount: T.common.free,
            },
          ],
          total: T.common.free,
        },
        points: (
          <p className="m-0 text-sm leading-5 text-secondary-foreground">
            {T.order.points.free}
          </p>
        ),
      };
    case "guest":
      return {
        ...confirmed,
        copy: { ...orderCopy(T.order.status.confirmed), breadcrumb: undefined },
        points: pointsAbout,
        footer: (
          <TicketOrderStatusBanner
            act={{ label: T.common.signIn, onClick: onSignIn }}
            copy={{
              title: T.order.guest.title,
              body: t(T.order.guest.body, { email: BUYER.email }),
            }}
            kind="guest"
          />
        ),
      };
  }
}

export type OrderScreenProps = {
  state: OrderState;
  onContinueToPayment?: () => void;
  onSignIn?: () => void;
};

/** One order's page under the site header. */
export function OrderScreen({
  state,
  onContinueToPayment = () => {},
  onSignIn = () => {},
}: OrderScreenProps) {
  const session: TicketingSession =
    state === "guest" || state === "paid" ? "signed-out" : "signed-in";
  return (
    <TicketingSite session={session}>
      <div className="mx-auto box-border w-full max-w-[640px] px-4 pt-5 pb-12">
        <TicketOrderPage {...orderView(state, onContinueToPayment, onSignIn)} />
      </div>
    </TicketingSite>
  );
}

export type ReturnState =
  | "confirming"
  | "safeToClose"
  | Exclude<TicketReturnOutcomeKind, "paid">;

export type ReturnScreenProps = {
  state: ReturnState;
  /** The confirming drawer's wait, in seconds, before the payment lands
   * and the order shows. None waits. */
  landsAfter?: number;
  onLanded?: () => void;
  onChooseAgain?: () => void;
  onSignIn?: () => void;
};

/** What the order page says when the buyer comes back from Stripe, the
 * ReturnPhone board. */
export function ReturnScreen({
  state,
  landsAfter,
  onLanded = () => {},
  onChooseAgain = () => {},
  onSignIn = () => {},
}: ReturnScreenProps) {
  const [stage, setStage] = useState<TicketConfirmingDrawerStage>(
    state === "safeToClose" ? "safeToClose" : "waiting",
  );
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (state !== "confirming" || landsAfter === undefined) return;
    const timer = window.setTimeout(onLanded, landsAfter * 1000);
    return () => window.clearTimeout(timer);
  }, [state, landsAfter, onLanded]);

  if (state === "confirming" || state === "safeToClose")
    return (
      <>
        <OrderScreen state="held" />
        <TicketConfirmingDrawer
          copy={CONFIRMING_COPY}
          onClose={() => {
            setOpen(false);
            setStage("waiting");
          }}
          open={open}
          stage={stage}
        />
      </>
    );

  const card = t(T.common.card, { brand: "Visa", last4: "4242" });
  const outcome = {
    wentBack: {
      copy: {
        status: T.return.wentBack.badge,
        title: T.return.wentBack.title,
        body: T.return.wentBack.body,
      },
      act: { label: T.return.wentBack.action, onClick: onChooseAgain },
    },
    holdRanOut: {
      copy: {
        title: t(T.return.holdRanOut.title, { minutes: SHOW.holdMinutes }),
        body: T.return.holdRanOut.body,
      },
      act: { label: T.return.wentBack.action, onClick: onChooseAgain },
    },
    paidTooLate: {
      copy: {
        status: T.return.paidTooLate.badge,
        title: T.return.paidTooLate.title,
        body: t(T.return.paidTooLate.body, {
          minutes: SHOW.holdMinutes,
          amount: hkd(1150),
        }),
        note: t(T.return.paidTooLate.where, {
          method: card,
          email: BUYER.email,
        }),
      },
    },
    otherBrowser: {
      copy: {
        title: T.return.otherBrowser.title,
        body: T.return.otherBrowser.body,
        note: T.return.otherBrowser.note,
      },
      act: { label: T.common.signInWithEmail, onClick: onSignIn },
    },
    notTheirs: {
      copy: {
        title: T.return.notTheirs.title,
        body: t(T.return.notTheirs.body, { email: "sam.lee@example.com" }),
      },
      act: { label: T.return.notTheirs.anotherEmail, onClick: onSignIn },
      secondaryAct: { label: T.common.signOut, onClick: () => {} },
    },
  }[state];

  return (
    <TicketingSite session={state === "notTheirs" ? "signed-in" : "signed-out"}>
      <div className="mx-auto box-border w-full max-w-[640px] px-4 pt-10 pb-16">
        <TicketReturnOutcome kind={state} {...outcome} />
      </div>
    </TicketingSite>
  );
}
