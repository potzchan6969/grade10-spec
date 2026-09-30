import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  Bank,
  FilePdf,
  Hourglass,
  Info,
} from "@phosphor-icons/react";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { PaymentMethodCard } from "../payment-method/payment-method-card";
import {
  REVEAL_HIDDEN_CLASS,
  REVEAL_REDUCED_MOTION_CLASS,
  REVEAL_TRANSITION_CLASS,
  REVEAL_VISIBLE_CLASS,
  revealStaggerDelayMs,
  useFirstPaintReveal,
} from "../shared/use-first-paint-reveal";
import { OrderDetailsPaymentLogo } from "../store-order-detail/order-details-payment-logo";
import type {
  AuctionWinnerOrderContactAlert,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
} from "./types";

const STEPS: readonly AuctionWinnerOrderStep[] = [
  "address",
  "invoice",
  "payment",
  "shipping",
  "completed",
];

type StepState = "completed" | "progress" | "upcoming";

function stepStates(
  current: AuctionWinnerOrderStep | "done",
): Record<AuctionWinnerOrderStep, StepState> {
  const at = current === "done" ? STEPS.length : STEPS.indexOf(current);
  return Object.fromEntries(
    STEPS.map((step, index) => [
      step,
      index < at ? "completed" : index === at ? "progress" : "upcoming",
    ]),
  ) as Record<AuctionWinnerOrderStep, StepState>;
}

function RevealGroup({
  children,
  className,
  revealed,
  staggerIndex,
}: {
  children: ReactNode;
  className?: string;
  revealed: boolean;
  staggerIndex: number;
}) {
  return (
    <div
      className={cn(
        REVEAL_HIDDEN_CLASS,
        REVEAL_TRANSITION_CLASS,
        REVEAL_REDUCED_MOTION_CLASS,
        revealed && REVEAL_VISIBLE_CLASS,
        className,
      )}
      data-slot="winner-order-reveal"
      style={{ transitionDelay: revealStaggerDelayMs(staggerIndex, revealed) }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
      {children}
    </h3>
  );
}

function SummaryRow({
  label,
  value,
  emphasize = false,
  muted = false,
  tooltip,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  muted?: boolean;
  tooltip?: string;
}) {
  const labelNode = tooltip ? (
    <HStack className="min-w-0" gap="xs" vAlign="center">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            aria-label={tooltip}
            className="inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onPointerDown={(event) => event.preventDefault()}
            render={<Info aria-hidden size={12} />}
          />
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </HStack>
  ) : (
    label
  );

  return (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2 sm:gap-4">
      <span
        className={cn(
          "min-w-0 text-sm leading-5 text-foreground",
          emphasize && "text-base font-semibold",
          muted && !emphasize && "text-secondary-foreground",
        )}
      >
        {labelNode}
      </span>
      <span
        className={cn(
          "shrink-0 text-right text-sm leading-5 whitespace-nowrap tabular-nums text-foreground",
          emphasize && "text-base font-semibold",
          muted && "text-secondary-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function PdfLink({
  label,
  ariaLabel,
  onOpen,
  className,
}: {
  label: string;
  ariaLabel: string;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      href="#view-pdf"
      onClick={(event) => {
        event.preventDefault();
        onOpen();
      }}
      size="sm"
      variant="secondary"
    >
      <FilePdf aria-hidden size={14} weight="regular" />
      {label}
    </Link>
  );
}

function ContactAlert({
  alert,
  copy,
}: {
  alert: AuctionWinnerOrderContactAlert;
  copy: AuctionWinnerOrderCopy;
}) {
  return (
    <Alert
      actions={
        <Button onClick={alert.onContact} size="sm" variant="outline">
          {copy.contactUs}
        </Button>
      }
      dismissible={false}
      layout="inline"
      status="warning"
      title={alert.title}
    />
  );
}

function ProgressCard({
  copy,
  progress,
}: {
  copy: AuctionWinnerOrderCopy;
  progress: NonNullable<AuctionWinnerOrderProps["progress"]>;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const states = stepStates(progress.current);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-centre when the current step moves
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const scrollCurrentIntoView = () => {
      if (window.matchMedia("(min-width: 640px)").matches) return;
      const current = rail.querySelector<HTMLElement>(
        '[data-slot="step"][data-state="progress"]',
      );
      if (!current) return;
      const railRect = rail.getBoundingClientRect();
      const stepRect = current.getBoundingClientRect();
      rail.scrollLeft +=
        stepRect.left +
        stepRect.width / 2 -
        (railRect.left + railRect.width / 2);
    };

    scrollCurrentIntoView();
    const mq = window.matchMedia("(min-width: 640px)");
    mq.addEventListener("change", scrollCurrentIntoView);
    return () => mq.removeEventListener("change", scrollCurrentIntoView);
  }, [progress.current]);

  return (
    <div className="w-full" data-slot="winner-order-progress">
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between gap-3 border-b border-border bg-muted px-4 py-3 sm:px-6 sm:py-4"
          gap="none"
          vAlign="center"
        >
          <h3 className="min-w-0 text-base leading-6 font-medium text-foreground">
            {copy.orderProgress}
          </h3>
          {progress.tracking ? (
            <Link
              className="min-w-0 shrink tabular-nums"
              href={progress.tracking.href}
              rel="noopener noreferrer"
              size="sm"
              target="_blank"
              trailing={<ArrowUpRight aria-hidden size={14} weight="bold" />}
              variant="secondary"
            >
              {progress.tracking.code}
            </Link>
          ) : null}
        </HStack>
        {/*
          Five nowrap labels cannot share 320px without colliding: a
          horizontal rail on small viewports, equal flex from sm.
        */}
        <div
          className="w-full overflow-x-auto overscroll-x-contain px-2 py-3 sm:px-0 sm:py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={railRef}
        >
          <Stepper className="min-w-max sm:min-w-0 sm:w-full">
            {STEPS.map((step, index) => (
              <Step
                className="w-[7.5rem] min-w-[7.5rem] flex-none basis-[7.5rem] sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-0"
                description={progress.steps[step].description}
                key={step}
                label={progress.steps[step].label}
                showLeadingConnector={index > 0}
                showTrailingConnector={index < STEPS.length - 1}
                state={states[step]}
              />
            ))}
          </Stepper>
        </div>
      </Card>
    </div>
  );
}

function LotCard({
  copy,
  lot,
}: {
  copy: AuctionWinnerOrderCopy;
  lot: AuctionWinnerOrderProps["lot"];
}) {
  const className = cn(
    "flex w-full flex-row items-center gap-3 rounded-xl border border-border bg-card p-3 sm:gap-4 sm:p-4",
    "transition-[background-color,border-color] duration-200 ease-out",
    "hover:bg-muted/25 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    "motion-reduce:transition-none",
  );

  const body = (
    <>
      <div
        className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
        data-slot="winner-order-lot-image"
      >
        {lot.imageSrc ? (
          <img
            alt=""
            className="absolute inset-0 size-full object-contain p-0.5"
            src={lot.imageSrc}
          />
        ) : null}
      </div>
      <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
        <Text
          className="line-clamp-2 text-pretty sm:truncate sm:line-clamp-none"
          size="sm"
          weight="medium"
        >
          {lot.title}
        </Text>
        <Text className="tabular-nums" size="sm" weight="medium">
          {copy.winningBid}: {lot.winningBid}
        </Text>
      </VStack>
    </>
  );

  if (lot.href) {
    return (
      <a
        aria-label={`${lot.title} — ${copy.openLot}`}
        className={className}
        data-slot="winner-order-lot"
        href={lot.href}
        onClick={lot.onOpen}
      >
        {body}
      </a>
    );
  }

  return (
    <section
      aria-label={copy.lot}
      className={className}
      data-slot="winner-order-lot"
    >
      {body}
    </section>
  );
}

function OrderSummary({
  copy,
  summary,
}: {
  copy: AuctionWinnerOrderCopy;
  summary: AuctionWinnerOrderProps["summary"];
}) {
  const { pay } = summary;
  return (
    <VStack className="w-full" gap="md" hAlign="stretch">
      <HStack
        className="w-full justify-between gap-3"
        gap="none"
        vAlign="center"
      >
        <h3 className="min-w-0 text-sm leading-5 font-medium text-secondary-foreground">
          {copy.orderSummary}
        </h3>
        {summary.onInvoicePdf ? (
          <PdfLink
            ariaLabel={`${copy.invoice} ${copy.pdf}`}
            className="shrink-0"
            label={copy.invoice}
            onOpen={summary.onInvoicePdf}
          />
        ) : null}
      </HStack>
      <VStack className="w-full" gap="sm" hAlign="stretch">
        {summary.lines.map((line) => (
          <SummaryRow
            key={line.label}
            label={line.label}
            muted={line.muted}
            tooltip={line.tooltip}
            value={line.value}
          />
        ))}
      </VStack>
      {summary.total ? (
        <>
          <hr className="w-full border-border" />
          <SummaryRow
            emphasize
            label={summary.total.label}
            muted={summary.total.muted}
            value={summary.total.value}
          />
        </>
      ) : null}

      {summary.refund ? (
        <Alert
          actions={
            <Button onClick={summary.refund.onView} size="sm" variant="outline">
              {copy.view}
            </Button>
          }
          dismissible={false}
          icon={<ArrowCounterClockwise aria-hidden size={16} weight="bold" />}
          layout="inline"
          status="default"
          title={summary.refund.title}
        />
      ) : null}

      {summary.alert ? (
        <ContactAlert alert={summary.alert} copy={copy} />
      ) : null}

      {pay ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button
            className="w-full"
            disabled={pay.pending}
            onClick={pay.onPress}
            size="md"
          >
            {pay.label}
          </Button>
          {pay.secondary ? (
            <Button
              className="w-full"
              disabled={pay.pending}
              onClick={pay.secondary.onPress}
              size="md"
              variant="outline"
            >
              {pay.secondary.label}
            </Button>
          ) : null}
          {pay.deadline ? (
            <p className="w-full text-center text-sm leading-5 text-secondary-foreground">
              {pay.deadline}
            </p>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

function PaymentMethod({
  copy,
  method,
}: {
  copy: AuctionWinnerOrderCopy;
  method: Exclude<
    AuctionWinnerOrderProps["paymentMethod"],
    { kind: "text" } | undefined
  >;
}) {
  if (method.kind === "card") {
    return (
      <PaymentMethodCard
        label={method.masked}
        leading={<OrderDetailsPaymentLogo brand={method.brand} />}
      />
    );
  }
  return (
    <PaymentMethodCard
      description={method.bankName}
      label={method.label}
      leading={<Bank aria-label={copy.bank} size={20} weight="regular" />}
    />
  );
}

function Receipts({
  copy,
  receipts,
}: {
  copy: AuctionWinnerOrderCopy;
  receipts: NonNullable<AuctionWinnerOrderProps["receipts"]>;
}) {
  return (
    <HStack className="w-full flex-wrap" gap="sm" vAlign="center">
      {receipts.map((receipt) => (
        <PdfLink
          ariaLabel={`${receipt.label} ${copy.pdf}`}
          key={receipt.label}
          label={receipt.label}
          onOpen={receipt.onOpen}
        />
      ))}
    </HStack>
  );
}

function AddressBlock({
  copy,
  delivery,
}: {
  copy: AuctionWinnerOrderCopy;
  delivery: NonNullable<AuctionWinnerOrderProps["delivery"]>;
}) {
  return (
    <VStack className="w-full" gap="sm" hAlign="start">
      {delivery.value ? (
        <>
          <SectionHeading>{delivery.label}</SectionHeading>
          <Text className="whitespace-pre-line text-foreground" size="sm">
            {delivery.value}
          </Text>
        </>
      ) : null}
      {delivery.alert ? (
        <ContactAlert alert={delivery.alert} copy={copy} />
      ) : null}
      {delivery.confirm ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button
            className="w-full"
            onClick={delivery.confirm.onPress}
            size="md"
          >
            {delivery.confirm.label}
          </Button>
          {delivery.confirm.deadline ? (
            <p className="w-full text-center text-sm leading-5 text-secondary-foreground">
              {delivery.confirm.deadline}
            </p>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

/** Same shell as Order Details: summary, then payment, receipts and addresses. */
function OrderSidebar({
  copy,
  summary,
  paymentMethod,
  receipts = [],
  delivery,
  billing,
}: Pick<
  AuctionWinnerOrderProps,
  "copy" | "summary" | "paymentMethod" | "receipts" | "delivery" | "billing"
>) {
  const methodCard =
    paymentMethod && paymentMethod.kind !== "text" ? paymentMethod : null;
  const methodText = paymentMethod?.kind === "text" ? paymentMethod : null;
  const hasLowerSection = Boolean(
    paymentMethod || receipts.length > 0 || delivery || billing,
  );

  return (
    <aside
      className="w-full bg-background lg:sticky lg:top-8"
      data-slot="winner-order-sidebar"
    >
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <VStack
          className={cn(
            "w-full bg-background-subtle p-4 sm:p-6",
            hasLowerSection && "border-b border-border",
          )}
          gap="md"
          hAlign="stretch"
        >
          <OrderSummary copy={copy} summary={summary} />
        </VStack>
        {hasLowerSection ? (
          <VStack className="w-full p-4 sm:p-6" gap="lg" hAlign="stretch">
            {methodCard ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <SectionHeading>{copy.paymentMethod}</SectionHeading>
                <PaymentMethod copy={copy} method={methodCard} />
                {receipts.length > 0 ? (
                  <Receipts copy={copy} receipts={receipts} />
                ) : null}
              </VStack>
            ) : receipts.length > 0 ? (
              <Receipts copy={copy} receipts={receipts} />
            ) : null}
            {methodText ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <SectionHeading>{copy.paymentMethod}</SectionHeading>
                <Text className="text-foreground" size="sm">
                  {methodText.label}
                </Text>
              </VStack>
            ) : null}
            {delivery ? <AddressBlock copy={copy} delivery={delivery} /> : null}
            {billing ? (
              <VStack className="w-full" gap="sm" hAlign="start">
                <SectionHeading>{billing.label}</SectionHeading>
                <Text className="whitespace-pre-line text-foreground" size="sm">
                  {billing.value}
                </Text>
              </VStack>
            ) : null}
          </VStack>
        ) : null}
      </Card>
    </aside>
  );
}

/**
 * The Winner Order page body: title and badge, Order Progress, the lot with
 * its alerts, and the summary sidebar. It renders the parts it is given and
 * reports each press; the page chrome and the dialogs are the consumer's.
 *
 * First paint staggers the groups in (opacity + translateY, 280ms) and
 * settles immediately under reduced motion.
 */
function AuctionWinnerOrder({
  copy,
  title,
  badge,
  progress,
  note,
  lot,
  alerts = [],
  summary,
  paymentMethod,
  receipts,
  delivery,
  billing,
}: AuctionWinnerOrderProps) {
  const revealed = useFirstPaintReveal();
  const mainStaggerIndex = progress ? 1 : 0;
  const lotStaggerIndex = progress ? 2 : 1;
  const sidebarStaggerIndex = progress ? 3 : 2;

  return (
    <VStack
      className="w-full gap-8 sm:gap-12"
      data-revealed={revealed || undefined}
      data-slot="winner-order"
      gap="none"
      hAlign="stretch"
    >
      <RevealGroup revealed={revealed} staggerIndex={0}>
        <HStack className="w-full" gap="sm" vAlign="center">
          <h1 className="text-2xl leading-8 font-semibold text-balance text-foreground sm:text-3xl sm:leading-9">
            {title}
          </h1>
          <Badge size="sm" variant={badge.variant}>
            {badge.label}
          </Badge>
        </HStack>
      </RevealGroup>

      <div className="grid w-full items-start gap-6 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        {/* The note sits under progress on a phone and under the lot from lg. */}
        <VStack className="min-w-0 w-full" gap="lg" hAlign="stretch">
          {progress ? (
            <RevealGroup
              className="order-1"
              revealed={revealed}
              staggerIndex={mainStaggerIndex}
            >
              <ProgressCard copy={copy} progress={progress} />
            </RevealGroup>
          ) : null}

          {note ? (
            <RevealGroup
              className="order-2 w-full lg:order-3"
              revealed={revealed}
              staggerIndex={progress ? mainStaggerIndex + 1 : lotStaggerIndex}
            >
              <Alert
                dismissible={false}
                icon={
                  note.icon === "hourglass" ? (
                    <Hourglass aria-hidden size={16} weight="bold" />
                  ) : undefined
                }
                layout="inline"
                status="default"
                title={note.title}
              />
            </RevealGroup>
          ) : null}

          <RevealGroup
            className={cn(
              "w-full",
              progress && note ? "order-3 lg:order-2" : undefined,
            )}
            revealed={revealed}
            staggerIndex={lotStaggerIndex}
          >
            <VStack className="w-full" gap="lg" hAlign="stretch">
              <LotCard copy={copy} lot={lot} />
              {alerts.map((alert) => (
                <Alert
                  actions={
                    alert.action ? (
                      <Button
                        onClick={alert.action.onPress}
                        size="sm"
                        variant="outline"
                      >
                        {alert.action.label}
                      </Button>
                    ) : undefined
                  }
                  description={
                    alert.description ? (
                      <span className="whitespace-pre-line">
                        {alert.description}
                      </span>
                    ) : undefined
                  }
                  dismissible={false}
                  key={alert.title}
                  layout="inline"
                  status={alert.status}
                  title={alert.title}
                />
              ))}
            </VStack>
          </RevealGroup>
        </VStack>

        <RevealGroup
          className="min-w-0 w-full"
          revealed={revealed}
          staggerIndex={sidebarStaggerIndex}
        >
          <OrderSidebar
            billing={billing}
            copy={copy}
            delivery={delivery}
            paymentMethod={paymentMethod}
            receipts={receipts}
            summary={summary}
          />
        </RevealGroup>
      </div>
    </VStack>
  );
}

export type {
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
} from "./types";
export { AuctionWinnerOrder };
