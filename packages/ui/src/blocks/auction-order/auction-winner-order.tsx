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
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { toast } from "@grade10/design-system/components/overlays/toast";
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
  CircleNotch,
  FilePdf,
  Hourglass,
  Info,
} from "@phosphor-icons/react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  AuctionWinnerOrderAlert,
  AuctionWinnerOrderBankDetails,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderPdf,
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
    <h2 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
      {children}
    </h2>
  );
}

function SummaryRow({
  label,
  value,
  emphasize = false,
  muted = false,
  tooltip,
  subtext,
  footnote,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  muted?: boolean;
  tooltip?: string;
  subtext?: string;
  footnote?: string;
}) {
  const labelNode = tooltip ? (
    <HStack className="min-w-0" gap="xs" vAlign="center">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            aria-label={tooltip}
            className="relative inline-flex shrink-0 cursor-pointer text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 after:absolute after:-inset-3 after:content-['']"
            closeOnClick={false}
          >
            <Info aria-hidden size={12} />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </HStack>
  ) : (
    label
  );

  return (
    <div
      className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 sm:gap-x-4"
      data-slot="winner-order-summary-line"
    >
      <span
        className={cn(
          "min-w-0 text-sm leading-5 text-foreground",
          emphasize && "text-base font-semibold",
          muted && !emphasize && "text-secondary-foreground",
        )}
      >
        {labelNode}
      </span>
      <span className="flex shrink-0 flex-col items-end">
        <span
          className={cn(
            "text-right text-sm leading-5 whitespace-nowrap tabular-nums text-foreground",
            emphasize && "text-base font-semibold",
            muted && "text-secondary-foreground",
          )}
        >
          {value}
        </span>
        {subtext ? (
          <span
            className="mt-0.5 text-right text-xs leading-4 whitespace-nowrap tabular-nums text-secondary-foreground"
            data-slot="winner-order-summary-subtext"
          >
            {subtext}
          </span>
        ) : null}
      </span>
      {footnote ? (
        <span
          className="col-span-2 mt-0.5 text-left text-xs leading-4 text-secondary-foreground"
          data-slot="winner-order-summary-footnote"
        >
          {footnote}
        </span>
      ) : null}
    </div>
  );
}

function useFailedToast(failed?: string) {
  const lastToastedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!failed) {
      lastToastedRef.current = null;
      return;
    }
    if (lastToastedRef.current === failed) return;
    lastToastedRef.current = failed;
    toast.error(failed);
  }, [failed]);
}

function PdfLink({
  label,
  ariaLabel,
  pdf,
  className,
}: {
  label: string;
  ariaLabel: string;
  pdf: AuctionWinnerOrderPdf;
  className?: string;
}) {
  const { href, onOpen, pending, failed } = pdf;
  useFailedToast(failed);
  return (
    <Link
      aria-busy={pending ? true : undefined}
      aria-label={ariaLabel}
      className={className}
      href={href ?? "#view-pdf"}
      onClick={
        onOpen
          ? (event) => {
              event.preventDefault();
              if (!pending) onOpen();
            }
          : undefined
      }
      size="sm"
      variant="secondary"
    >
      {pending ? (
        <span aria-hidden className="inline-flex animate-spin">
          <CircleNotch size={14} weight="bold" />
        </span>
      ) : (
        <FilePdf aria-hidden size={14} weight="regular" />
      )}
      {label}
    </Link>
  );
}

function ActionFailed({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text as="p" role="alert" size="sm" tone="error">
      {message}
    </Text>
  );
}

function OrderAlert({ alert }: { alert: AuctionWinnerOrderAlert }) {
  const { action } = alert;
  return (
    <>
      <Alert
        actions={
          action ? (
            <Button
              loading={action.pending}
              onClick={action.onPress}
              size="sm"
              variant="outline"
            >
              {action.label}
            </Button>
          ) : undefined
        }
        description={
          alert.description ? (
            <span className="whitespace-pre-line">{alert.description}</span>
          ) : undefined
        }
        dismissible={false}
        layout={alert.description ? "block" : "inline"}
        role={alert.role ?? "alert"}
        status={alert.status}
        title={alert.title}
      />
      <ActionFailed message={action?.failed} />
    </>
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

    let settled = false;
    let raf = 0;
    const mq = window.matchMedia("(min-width: 640px)");
    const ro = new ResizeObserver(() => {
      if (!settled) scrollFocusIntoView();
    });

    // The current step, or the last completed one once every step is done.
    function scrollFocusIntoView() {
      if (!rail) return;
      if (mq.matches) {
        settled = true;
        ro.disconnect();
        return;
      }
      const completed = rail.querySelectorAll<HTMLElement>(
        '[data-slot="step"][data-state="completed"]',
      );
      const target =
        rail.querySelector<HTMLElement>(
          '[data-slot="step"][data-state="progress"]',
        ) ?? completed[completed.length - 1];
      const max = rail.scrollWidth - rail.clientWidth;
      // Overflow can open a frame late (fonts, reveal, viewport).
      if (!target || max <= 0) return;
      const left =
        target.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft;
      rail.scrollLeft = Math.min(
        max,
        Math.max(0, left + target.offsetWidth / 2 - rail.clientWidth / 2),
      );
      settled = true;
      ro.disconnect();
    }

    const arm = () => {
      settled = false;
      ro.observe(rail);
      scrollFocusIntoView();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scrollFocusIntoView);
    };

    arm();
    mq.addEventListener("change", arm);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq.removeEventListener("change", arm);
    };
  }, [progress.current]);

  return (
    <div className="w-full" data-slot="winner-order-progress">
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between gap-3 border-b border-border bg-muted px-4 py-3 sm:px-6 sm:py-4"
          gap="none"
          vAlign="center"
        >
          <h2 className="min-w-0 text-base leading-6 font-medium text-foreground">
            {copy.orderProgress}
          </h2>
          {progress.tracking?.href ? (
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
          ) : progress.tracking ? (
            <span className="min-w-0 shrink tabular-nums text-sm font-normal text-secondary-foreground">
              {progress.tracking.code}
            </span>
          ) : null}
        </HStack>
        {/*
          Five nowrap labels cannot share 320px without colliding: a
          horizontal rail on small viewports, equal flex from sm.
        */}
        <div
          className="w-full overflow-x-auto overscroll-x-contain px-2 py-3 sm:px-0 sm:py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-slot="winner-order-progress-rail"
          ref={railRef}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the rail scrolls sideways on a narrow screen, and a scroll container takes focus so a keyboard can scroll it.
          tabIndex={0}
        >
          <Stepper
            aria-label={copy.orderProgress}
            className="min-w-max sm:min-w-0 sm:w-full"
          >
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
            className="absolute inset-0 size-full object-cover"
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
        <Text
          className="tabular-nums text-secondary-foreground"
          size="sm"
          weight="regular"
        >
          {copy.winningBid}: {lot.winningBid}
        </Text>
      </VStack>
    </>
  );

  if (lot.href) {
    return (
      <a
        aria-label={lot.ariaLabel}
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
      aria-label={lot.ariaLabel}
      className={className}
      data-slot="winner-order-lot"
    >
      {body}
    </section>
  );
}

type BankDetailsDialogProps = {
  bankDetails: AuctionWinnerOrderBankDetails;
  copy: AuctionWinnerOrderCopy;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

function BankDetailsDialog({
  bankDetails,
  copy,
  onOpenChange,
  open,
}: BankDetailsDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="max-h-[min(640px,calc(100dvh-2rem))] min-h-0"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{bankDetails.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {bankDetails.qrSrc ? (
            <img
              alt={copy.bankDetailsQrAlt}
              className="mx-auto size-40 rounded-lg border border-border object-contain"
              src={bankDetails.qrSrc}
            />
          ) : null}
          <dl className="grid w-full gap-3">
            {bankDetails.rows.map((row) => (
              <div
                className="grid gap-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-4"
                key={`${row.label}-${row.value}`}
              >
                <dt className="text-sm font-medium text-secondary-foreground">
                  {row.label}
                </dt>
                <dd className="break-words text-sm text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          {bankDetails.note ? (
            <p className="text-sm leading-5 text-secondary-foreground">
              {bankDetails.note}
            </p>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button size="md" variant="outline" />}>
            {copy.bankDetailsClose}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrderSummary({
  copy,
  onViewBankDetails,
  summary,
}: {
  copy: AuctionWinnerOrderCopy;
  onViewBankDetails?: () => void;
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
        <HStack gap="sm" vAlign="center">
          <h2 className="min-w-0 text-sm leading-5 font-medium text-secondary-foreground">
            {copy.orderSummary}
          </h2>
        </HStack>
        {summary.invoicePdf ? (
          <PdfLink
            ariaLabel={summary.invoicePdf.ariaLabel ?? copy.invoicePdf}
            className="shrink-0"
            label={copy.invoice}
            pdf={summary.invoicePdf}
          />
        ) : null}
      </HStack>
      <VStack className="w-full" gap="sm" hAlign="stretch">
        {summary.lines.map((line) => (
          <SummaryRow
            footnote={line.footnote}
            key={line.label}
            label={line.label}
            muted={line.muted}
            subtext={line.subtext}
            tooltip={line.tooltip}
            value={line.value}
          />
        ))}
      </VStack>
      {summary.total || summary.convertedTotal ? (
        <>
          <hr className="w-full border-border" />
          {summary.total ? (
            <SummaryRow
              emphasize
              footnote={summary.total.footnote}
              label={summary.total.label}
              muted={summary.total.muted}
              subtext={summary.total.subtext}
              value={summary.total.value}
            />
          ) : null}
          {summary.convertedTotal ? (
            <SummaryRow
              emphasize
              footnote={summary.convertedTotal.footnote}
              label={summary.convertedTotal.label}
              muted={summary.convertedTotal.muted}
              value={summary.convertedTotal.value}
            />
          ) : null}
        </>
      ) : null}

      {summary.convertedFee ? (
        <>
          <hr className="w-full border-border" />
          <SummaryRow
            footnote={summary.convertedFee.footnote}
            label={summary.convertedFee.label}
            muted={summary.convertedFee.muted}
            value={summary.convertedFee.value}
          />
        </>
      ) : null}

      {summary.refund ? (
        <Alert
          actions={
            summary.refund.onView ? (
              <Button
                onClick={summary.refund.onView}
                size="sm"
                variant="outline"
              >
                {copy.refundDetails}
              </Button>
            ) : undefined
          }
          dismissible={false}
          icon={<ArrowCounterClockwise aria-hidden size={16} weight="bold" />}
          layout="inline"
          status="default"
          title={summary.refund.title}
        />
      ) : null}

      {summary.alert ? <OrderAlert alert={summary.alert} /> : null}

      {pay ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button
            className="w-full"
            disabled={pay.disabled}
            loading={pay.loading || pay.pending}
            onClick={pay.onPress}
            size="md"
          >
            {pay.label}
          </Button>
          <ActionFailed message={pay.failed} />
          {pay.secondary ? (
            <Button
              className="w-full"
              disabled={pay.disabled || pay.loading || pay.pending}
              loading={pay.secondary.pending}
              onClick={onViewBankDetails ?? pay.secondary.onPress}
              size="md"
              variant="outline"
            >
              {pay.secondary.label}
            </Button>
          ) : null}
          <ActionFailed message={pay.secondary?.failed} />
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
  receipts,
}: {
  receipts: NonNullable<AuctionWinnerOrderProps["receipts"]>;
}) {
  return (
    <HStack className="w-full flex-wrap" gap="sm" vAlign="center">
      {receipts.map((receipt) => (
        <PdfLink
          ariaLabel={receipt.ariaLabel ?? receipt.label}
          key={receipt.label}
          label={receipt.label}
          pdf={receipt}
        />
      ))}
    </HStack>
  );
}

function AddressBlock({
  delivery,
}: {
  delivery: NonNullable<AuctionWinnerOrderProps["delivery"]>;
}) {
  useFailedToast(delivery.confirm?.failed);
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
      {delivery.alert ? <OrderAlert alert={delivery.alert} /> : null}
      {delivery.confirm ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button
            className="w-full"
            loading={delivery.confirm.pending}
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
  bankDetails,
}: Pick<
  AuctionWinnerOrderProps,
  | "copy"
  | "summary"
  | "paymentMethod"
  | "receipts"
  | "delivery"
  | "billing"
  | "bankDetails"
>) {
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
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
          <OrderSummary
            copy={copy}
            onViewBankDetails={() => {
              summary.pay?.secondary?.onPress();
              if (bankDetails) setBankDetailsOpen(true);
            }}
            summary={summary}
          />
        </VStack>
        {hasLowerSection ? (
          <VStack className="w-full p-4 sm:p-6" gap="lg" hAlign="stretch">
            {methodCard ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <SectionHeading>{copy.paymentMethod}</SectionHeading>
                <PaymentMethod copy={copy} method={methodCard} />
                {receipts.length > 0 ? <Receipts receipts={receipts} /> : null}
              </VStack>
            ) : receipts.length > 0 ? (
              <Receipts receipts={receipts} />
            ) : null}
            {methodText ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <SectionHeading>{copy.paymentMethod}</SectionHeading>
                <Text className="text-foreground" size="sm">
                  {methodText.label}
                </Text>
              </VStack>
            ) : null}
            {delivery ? <AddressBlock delivery={delivery} /> : null}
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
      {bankDetails ? (
        <BankDetailsDialog
          bankDetails={bankDetails}
          copy={copy}
          onOpenChange={setBankDetailsOpen}
          open={bankDetailsOpen}
        />
      ) : null}
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
  bankDetails,
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
                <OrderAlert alert={alert} key={alert.title} />
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
            bankDetails={bankDetails}
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
  AuctionPaymentRail,
  AuctionWinnerOrderBankDetails,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
} from "./types";
export { AuctionWinnerOrder };
