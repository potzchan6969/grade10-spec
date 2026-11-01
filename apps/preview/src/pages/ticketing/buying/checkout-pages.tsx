import {
  type TicketCheckoutLine,
  TicketCheckoutOrder,
  type TicketCheckoutPayState,
  TicketCheckoutRefusalNotice,
  TicketCodeUsedUpNotice,
  TicketDetailsStep,
  type TicketDetailsStepBuyer,
  TicketPointsAbout,
  TicketPromoCodeField,
  type TicketPromoCodeFieldStatus,
  TicketReviewStep,
} from "@grade10/ui";
import { ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { TicketingSite } from "../ticketing-site";
import { BUYER, hkd, rich, T, t } from "../ticketing-words";
import {
  CHECKOUT_ORDER_COPY,
  DETAILS_COPY,
  ORDER_LINES,
  ORDER_LINES_FREE,
  ORDER_LINES_FULL,
  ORDER_TOTAL,
  ORDER_TOTAL_FULL,
  PROMO_COPY,
  pointsFor,
  REFUSAL_ACTIONS,
  type Refusal,
  reviewCopy,
  SUBTITLE,
} from "./buying-content";

/** The bot check's widget as the boards draw it; the site renders the real
 * one. */
function BotCheck({ checked }: { checked: boolean }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: the board names the widget a group
    <div
      aria-label={T.details.botCheck.label}
      className="flex h-[65px] w-[300px] max-w-full items-center gap-3 rounded-lg border border-border bg-background-subtle px-4 text-sm leading-5 text-secondary-foreground"
      role="group"
    >
      {checked ? (
        <ShieldCheck aria-hidden size={20} />
      ) : (
        <span
          aria-hidden
          className="size-5 animate-spin rounded-full border-2 border-border-strong border-t-foreground"
        />
      )}
      <span>
        {checked ? T.details.botCheck.checked : T.details.botCheck.checking}
      </span>
    </div>
  );
}

/** The narrow column the checkout steps sit in under the site header. */
function Column({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[560px]">{children}</div>;
}

export type DetailsPageProps = {
  buyer: "guest" | "signedIn" | "signedInNoName" | "resolving";
  /** A free order: no points line. */
  free?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
};

/** Your Details as the site mounts it. */
export function DetailsPage({
  buyer,
  free = false,
  onBack = () => {},
  onContinue = () => {},
}: DetailsPageProps) {
  const signedIn = buyer === "signedIn" || buyer === "signedInNoName";
  const stepBuyer: TicketDetailsStepBuyer =
    buyer === "resolving"
      ? { kind: "resolving" }
      : signedIn
        ? { kind: "signedIn", email: BUYER.email }
        : { kind: "guest" };
  const points = free
    ? undefined
    : signedIn
      ? t(T.details.pointsAbout, { points: pointsFor(ORDER_TOTAL) })
      : T.details.pointsGuest;
  return (
    <TicketingSite
      session={
        buyer === "resolving"
          ? "pending"
          : signedIn
            ? "signed-in"
            : "signed-out"
      }
    >
      <Column>
        <TicketDetailsStep
          botCheck={signedIn ? undefined : <BotCheck checked={false} />}
          buyer={stepBuyer}
          copy={{
            ...DETAILS_COPY,
            nameHint:
              buyer === "signedIn" ? T.details.name.hintSignedIn : undefined,
          }}
          defaultValues={
            buyer === "signedIn" ? { name: BUYER.name } : undefined
          }
          onBack={onBack}
          onContinue={onContinue}
          onNotYou={() => {}}
          onSignIn={() => {}}
          order={
            <TicketCheckoutOrder
              copy={CHECKOUT_ORDER_COPY}
              lines={free ? ORDER_LINES_FREE : ORDER_LINES}
              points={
                points ? (
                  <TicketPointsAbout copy={{ line: points }} />
                ) : undefined
              }
              total={free ? T.summary.free : hkd(ORDER_TOTAL)}
            />
          }
          subtitle={SUBTITLE}
        />
      </Column>
    </TicketingSite>
  );
}

/** The codes the stand-in knows; the service answers the real ones. */
const CODES = {
  SPRING20: {
    off: 190,
    detail: t(T.promo.discount.percentOff, {
      percent: 20,
      passes: "General passes",
    }),
  },
  CREW4: {
    off: ORDER_TOTAL,
    detail: t(T.promo.discount.allFree, { count: 3, fastPass: "yes" }),
  },
} as const;
type Code = keyof typeof CODES;

/** What a refused code reads as, by what was typed. */
const REFUSED: Record<string, string> = {
  AUTUMN10: t(T.promo.errors.expired, {
    code: "AUTUMN10",
    date: "31 Oct 2026",
  }),
  WINTER: t(T.promo.errors.notStarted, { code: "WINTER", date: "1 Dec 2026" }),
  EARLY50: t(T.promo.errors.usedUp, { code: "EARLY50" }),
  FRIEND: t(T.promo.errors.alreadyUsed, { code: "FRIEND", email: BUYER.email }),
  GROUP4: t(T.promo.errors.minTickets, { code: "GROUP4", count: 4 }),
  VIPONLY: t(T.promo.errors.otherPasses, { code: "VIPONLY" }),
  PRESS: t(T.promo.errors.emailsOnly, { code: "PRESS" }),
};
const WRONG_LIMIT = 5;

export type ReviewPageProps = {
  signedIn?: boolean;
  /** A code already on the order. */
  code?: Code;
  /** What the field says as the step opens. */
  promoStatus?: TicketPromoCodeFieldStatus;
  /** The early bird ended while the buyer was here. */
  priceChanged?: boolean;
  /** Pay found the code's last use gone. */
  codeUsedUp?: boolean;
  /** A refusal the checkout answered. */
  refusal?: Refusal;
  payState?: TicketCheckoutPayState;
  defaultAgreed?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
  /** Pay with the tick given: the page opens the payment page. */
  onPay?: () => void;
};

/** Check Your Order as the site mounts it, holding the code, the tick and
 * the press the way the Review and Promo boards' logic does. */
export function ReviewPage({
  signedIn = false,
  code: startCode,
  promoStatus = { kind: "idle" },
  priceChanged = false,
  codeUsedUp = false,
  refusal,
  payState: startPayState = "idle",
  defaultAgreed = false,
  onBack = () => {},
  onEdit = () => {},
  onPay = () => {},
}: ReviewPageProps) {
  const [code, setCode] = useState<Code | undefined>(startCode);
  const [status, setStatus] = useState<TicketPromoCodeFieldStatus>(promoStatus);
  const [wrong, setWrong] = useState(0);
  const [usedUp, setUsedUp] = useState(codeUsedUp);
  const [payState, setPayState] =
    useState<TicketCheckoutPayState>(startPayState);

  const full = priceChanged ? ORDER_TOTAL_FULL : ORDER_TOTAL;
  const free = code === "CREW4" && !usedUp;
  const off = code && !usedUp ? Math.min(CODES[code].off, full) : 0;
  const total = full - off;
  const lines: readonly TicketCheckoutLine[] = free
    ? ORDER_LINES.map((line) => ({
        ...line,
        promoNote: t(T.promo.freeWith, { code: "CREW4" }),
        amount: T.summary.free,
      }))
    : priceChanged
      ? ORDER_LINES_FULL
      : ORDER_LINES;

  const apply = (typed: string) => {
    const upper = typed.toUpperCase();
    if (upper in CODES) {
      setCode(upper as Code);
      setStatus({ kind: "idle" });
      return;
    }
    const next = wrong + 1;
    setWrong(next);
    if (next >= WRONG_LIMIT) {
      setStatus({
        kind: "tooManyTries",
        message: t(T.promo.errors.tooManyTries, { minutes: 10 }),
      });
      return;
    }
    setStatus({
      kind: "refused",
      message: REFUSED[upper] ?? T.promo.errors.notFound,
    });
  };

  const removeCode = () => {
    setCode(undefined);
    setUsedUp(false);
  };

  const pointsLine = free
    ? t(T.promo.freeOrder, { code: "CREW4" })
    : signedIn
      ? t(T.review.pointsSignedIn, { points: pointsFor(total) })
      : t(T.review.pointsGuest, {
          points: pointsFor(total),
          email: BUYER.email,
        });

  const link = (href: string) => (chunk: string) => <a href={href}>{chunk}</a>;
  const statement = rich(
    signedIn ? T.review.agreeSignedIn : T.review.agreeGuest,
    {},
    {
      sale: link("#terms-of-sale"),
      terms: link("#terms"),
      privacy: link("#privacy"),
    },
  );

  const notes = free
    ? [
        { id: "pdf", content: T.review.notes.pdfFree },
        { id: "charge", content: T.review.notes.nothingCharged },
      ]
    : [
        { id: "stripe", content: T.review.notes.stripe },
        { id: "hold", content: t(T.review.notes.hold, { minutes: 15 }) },
        { id: "pdf", content: T.review.notes.pdf },
      ];

  const notice =
    usedUp && code ? (
      <TicketCodeUsedUpNotice
        copy={{
          title: t(T.promo.usedUpAtPay.title, { code }),
          body: t(T.promo.usedUpAtPay.body, { amount: hkd(full) }),
          payFull: t(T.promo.usedUpAtPay.payFull, { amount: hkd(full) }),
          removeCode: T.promo.usedUpAtPay.removeCode,
        }}
        onPayFull={onPay}
        onRemoveCode={removeCode}
      />
    ) : refusal ? (
      <TicketCheckoutRefusalNotice
        action={
          refusal.action
            ? { ...REFUSAL_ACTIONS[refusal.action], onClick: () => {} }
            : undefined
        }
        copy={refusal.copy}
      />
    ) : undefined;

  return (
    <TicketingSite session={signedIn ? "signed-in" : "signed-out"}>
      <Column>
        <TicketReviewStep
          agreementStatement={statement}
          botCheck={signedIn ? undefined : <BotCheck checked />}
          buyerEmail={BUYER.email}
          buyerName={BUYER.name}
          copy={reviewCopy(signedIn)}
          defaultAgreed={defaultAgreed}
          notes={notes}
          notice={notice}
          onBack={onBack}
          onEdit={onEdit}
          onPay={() => {
            setPayState("opening");
            onPay();
          }}
          order={
            <TicketCheckoutOrder
              copy={CHECKOUT_ORDER_COPY}
              lines={lines}
              points={<TicketPointsAbout copy={{ line: pointsLine }} />}
              promo={
                <TicketPromoCodeField
                  applied={
                    code
                      ? {
                          copy: {
                            title: t(T.promo.applied, { code }),
                            detail: usedUp
                              ? t(T.promo.errors.usedUp, { code })
                              : CODES[code].detail,
                            remove: T.promo.remove,
                            removeLabel: t(T.promo.removeLabel, { code }),
                          },
                          amount: t(T.common.minus, {
                            amount: hkd(CODES[code].off),
                          }),
                          state: usedUp ? "usedUp" : "applied",
                          onRemove: removeCode,
                        }
                      : undefined
                  }
                  copy={PROMO_COPY}
                  onApply={apply}
                  status={status}
                />
              }
              total={free ? T.summary.free : hkd(total)}
            />
          }
          payLabel={
            free ? T.review.getTickets : t(T.review.pay, { amount: hkd(total) })
          }
          payState={payState}
          priceNotice={
            priceChanged
              ? {
                  title: t(T.review.priceChanged.title, { time: "23:59" }),
                  description: t(T.review.priceChanged.body, {
                    amount: hkd(full),
                  }),
                }
              : undefined
          }
          subtitle={SUBTITLE}
        />
      </Column>
    </TicketingSite>
  );
}
