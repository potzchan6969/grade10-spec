import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Card } from "@grade10/design-system/components/display/card";
import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { SiteHeader } from "@grade10/ui";
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  FilePdf,
  Hourglass,
  Info,
} from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import {
  REVEAL_HIDDEN_CLASS,
  REVEAL_REDUCED_MOTION_CLASS,
  REVEAL_TRANSITION_CLASS,
  REVEAL_VISIBLE_CLASS,
  revealStaggerDelayMs,
  useFirstPaintReveal,
} from "../../../../packages/ui/src/blocks/shared/use-first-paint-reveal";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { STORE_FOOTER } from "./store-content";
import { WinnerOrderContactDialog } from "./winner-order-contact-dialog";
import {
  contactReasonFor,
  winnerOrderContactMail,
} from "./winner-order-contact-mail";
import {
  LINE_TOOLTIPS,
  WINNER_ORDER_CONTENTS,
  type WinnerOrderContent,
  type WinnerOrderInvoiceLine,
  type WinnerOrderReceipt,
  type WinnerOrderStatus,
} from "./winner-order-content";
import { WinnerOrderPaymentProofDialog } from "./winner-order-payment-proof-dialog";
import { WinnerOrderRefundDialog } from "./winner-order-refund-dialog";
import type { WinnerOrderSetupResult } from "./winner-order-setup-dialog";
import { WinnerOrderSetupDialog } from "./winner-order-setup-dialog";
import {
  AUCTION_LOT_DETAILS_HREF,
  MY_AUCTIONS_PAGE_HREF,
} from "./workbench-story-nav";

const PROOF_SUBMITTED_TOAST = {
  title: "Proof submitted",
  description: "We’ll verify your payment shortly.",
} as const;

const PAYMENT_RECEIVED_TOAST = {
  title: "Payment received",
  description: "We’re preparing this lot to ship.",
} as const;

/** Preview-only beat while returning from a simulated card host. */
const CARD_CHECKOUT_SIMULATE_MS = 700;

const SETUP_CONFIRMED_TOAST = {
  title: "Order setup complete",
  description: "Grade10 is preparing your invoice for this destination.",
} as const;

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
      style={{
        transitionDelay: revealStaggerDelayMs(staggerIndex, revealed),
      }}
    >
      {children}
    </div>
  );
}

/**
 * Minimal placeholder PDF for Storybook — not a real invoice / receipt pipeline.
 * Opens in a new tab so the winner can view or save from the browser.
 */
const PLACEHOLDER_INVOICE_PDF = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 64 >>stream
BT /F1 18 Tf 72 720 Td (Grade10 Winner Invoice Placeholder) Tj ET
endstream endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
trailer<< /Root 1 0 R >>
%%EOF
`;

const PLACEHOLDER_RECEIPT_PDF = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 64 >>stream
BT /F1 18 Tf 72 720 Td (Grade10 Winner Receipt Placeholder) Tj ET
endstream endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
trailer<< /Root 1 0 R >>
%%EOF
`;

function openPlaceholderPdf(bytes: string, downloadName: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = downloadName;
    anchor.rel = "noopener";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function openPlaceholderInvoicePdf() {
  openPlaceholderPdf(PLACEHOLDER_INVOICE_PDF, "grade10-winner-invoice.pdf");
}

function openPlaceholderReceiptPdf(fileName = "grade10-winner-receipt.pdf") {
  openPlaceholderPdf(PLACEHOLDER_RECEIPT_PDF, fileName);
}

/** Invoice exists from Pending Payment onward (incl. paid / delivery / refunded). */
function hasIssuedInvoice(content: WinnerOrderContent): boolean {
  return Boolean(content.invoiceLines?.length);
}

/** Receipt PDF row — explicit list, or one default after full payment. */
function receiptLinksFor(content: WinnerOrderContent): WinnerOrderReceipt[] {
  if (content.receipts?.length) {
    return content.receipts;
  }
  if (
    content.status === "processing" ||
    content.status === "shipped" ||
    content.status === "delivered" ||
    content.status === "refunded"
  ) {
    return [{ label: "Receipt" }];
  }
  return [];
}

const PRODUCT_IMAGE = new URL("./product.fixture.png", import.meta.url).href;

type WinnerOrderPageProps = {
  status?: WinnerOrderStatus;
  content?: WinnerOrderContent;
  onPrimaryAction?: () => void;
  /** Opens lot details — preview defaults to the closed-won lot story. */
  lotHref?: string;
  onLotClick?: () => void;
};

type WinnerProgressStep = {
  label: string;
  description?: string;
  state: "completed" | "current" | "upcoming";
};

/** Happy-path winner stages — not Cancelled / Refunded. */
function showWinnerProgress(status: WinnerOrderStatus): boolean {
  return (
    status === "awaiting_address" ||
    status === "awaiting_address_expired" ||
    status === "preparing_invoice" ||
    status === "pending_payment" ||
    status === "pending_payment_expired" ||
    status === "payment_verifying" ||
    status === "partially_paid" ||
    status === "processing" ||
    status === "shipped" ||
    status === "delivered"
  );
}

/** Same `Badge` variants as My Auctions `AuctionRecordRow`, not the store order badge. */
function winnerOrderBadgeVariant(
  status: WinnerOrderStatus,
): "default" | "error" | "warning" | "outline" {
  switch (status) {
    case "awaiting_address":
    case "pending_payment":
    case "partially_paid":
      return "warning";
    case "awaiting_address_expired":
    case "pending_payment_expired":
      return "error";
    case "preparing_invoice":
    case "payment_verifying":
    case "processing":
      return "default";
    default:
      return "outline";
  }
}

/**
 * Post-auction winner progress — designer-required five steps.
 * Address → Invoice → Payment → Shipped → Completed.
 * Cancelled / Refunded omit the stepper.
 *
 * Subtext: Address / Invoice / Payment use absolute datetimes (Payment while
 * due reads “Pay by …”). Shipped and Completed use day-only dates like store
 * Order Details.
 */
function winnerProgressStepsFor(
  status: WinnerOrderStatus,
  content: WinnerOrderContent,
): WinnerProgressStep[] {
  const dates = content.progressDates;
  const address: WinnerProgressStep = {
    label: "Address",
    description: dates?.address,
    state: "upcoming",
  };
  const invoice: WinnerProgressStep = {
    label: "Invoice",
    description: dates?.invoice,
    state: "upcoming",
  };
  const payment: WinnerProgressStep = {
    label: "Payment",
    description: dates?.payment,
    state: "upcoming",
  };
  const shipped: WinnerProgressStep = {
    label: "Shipped",
    description: dates?.shipped,
    state: "upcoming",
  };
  const completed: WinnerProgressStep = {
    label: "Completed",
    description: dates?.completed,
    state: "upcoming",
  };

  switch (status) {
    case "awaiting_address":
    case "awaiting_address_expired":
      return [
        { ...address, state: "current" },
        invoice,
        payment,
        shipped,
        completed,
      ];
    case "preparing_invoice":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "current" },
        payment,
        shipped,
        completed,
      ];
    case "pending_payment":
    case "pending_payment_expired":
    case "payment_verifying":
    case "partially_paid":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "current" },
        shipped,
        completed,
      ];
    case "processing":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "completed" },
        { ...shipped, state: "current" },
        completed,
      ];
    case "shipped":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "completed" },
        { ...shipped, state: "current" },
        completed,
      ];
    case "delivered":
      return [
        { ...address, state: "completed" },
        { ...invoice, state: "completed" },
        { ...payment, state: "completed" },
        { ...shipped, state: "completed" },
        { ...completed, state: "completed" },
      ];
    default:
      return [address, invoice, payment, shipped, completed];
  }
}

/** Sidebar money rows — full invoice when issued; otherwise winning bid + TBD fees. */
function summaryLinesFor(
  content: WinnerOrderContent,
): WinnerOrderInvoiceLine[] {
  if (content.invoiceLines?.length) {
    return [...content.invoiceLines];
  }
  if (content.status === "cancelled") {
    return [
      { label: "Winning Bid", value: content.winningBid },
      { label: "Order Total", value: "—" },
    ];
  }
  return [
    { label: "Winning Bid", value: content.winningBid },
    {
      label: "Buyer’s Premium",
      value: "TBD",
      muted: true,
      tooltip: LINE_TOOLTIPS.buyersPremium,
    },
    {
      label: "Shipping & Handling",
      value: "TBD",
      muted: true,
      tooltip: LINE_TOOLTIPS.shippingHandling,
    },
    {
      label: "Payment Processing Fee",
      value: "TBD",
      muted: true,
      tooltip: LINE_TOOLTIPS.processingFee,
    },
    { label: "Order Total", value: "TBD", muted: true },
  ];
}

function resolveContent(
  status: WinnerOrderStatus,
  setup: WinnerOrderSetupResult | null,
  content?: WinnerOrderContent,
  statusProp?: WinnerOrderStatus,
): WinnerOrderContent {
  // Story content overrides apply only while status still matches the arg —
  // CTA-driven transitions (proof submit, card pay) must take the new status.
  if (content && (statusProp === undefined || status === statusProp)) {
    return content;
  }
  const base = WINNER_ORDER_CONTENTS[status];
  if (status === "preparing_invoice" && setup) {
    return {
      ...base,
      addressValue: setup.delivery,
      setupPaymentMethod:
        setup.paymentMethod === "bank_transfer" ? "Bank transfer" : "Card",
      billingLabel: "Billing address",
      billingValue: setup.billing,
    };
  }
  return base;
}

function SummaryRow({
  label,
  value,
  emphasize = false,
  muted = false,
  tooltip,
  valueClassName,
}: {
  label: ReactNode;
  value: ReactNode;
  emphasize?: boolean;
  muted?: boolean;
  tooltip?: string;
  valueClassName?: string;
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
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function LotCard({
  content,
  href,
  onClick,
}: {
  content: WinnerOrderContent;
  href?: string;
  onClick?: () => void;
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
        <img
          alt=""
          className="absolute inset-0 size-full object-contain p-0.5"
          src={PRODUCT_IMAGE}
        />
      </div>
      <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
        <Text
          className="line-clamp-2 text-pretty sm:truncate sm:line-clamp-none"
          size="sm"
          weight="medium"
        >
          {content.lotTitle}
        </Text>
        <Text className="tabular-nums" size="sm" weight="medium">
          Winning bid: {content.winningBid}
        </Text>
        <p className="text-sm leading-5 text-secondary-foreground">
          {content.endedAt}
        </p>
      </VStack>
    </>
  );

  if (href) {
    return (
      <a
        aria-label={`${content.lotTitle} — open lot details`}
        className={className}
        data-slot="winner-order-lot"
        href={href}
        onClick={onClick}
      >
        {body}
      </a>
    );
  }

  return (
    <section
      aria-label="Lot"
      className={className}
      data-slot="winner-order-lot"
    >
      {body}
    </section>
  );
}

function AddressBlock({
  content,
  confirmCta,
  onConfirmAddress,
  onContact,
}: {
  content: WinnerOrderContent;
  confirmCta?: string | null;
  onConfirmAddress?: () => void;
  onContact?: () => void;
}) {
  const addressOverdue =
    content.overdue &&
    (content.status === "awaiting_address" ||
      content.status === "awaiting_address_expired");

  return (
    <VStack className="w-full" gap="sm" hAlign="start">
      {content.addressValue ? (
        <>
          <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
            {content.addressLabel}
          </h3>
          <Text className="whitespace-pre-line text-foreground" size="sm">
            {content.addressValue}
          </Text>
        </>
      ) : null}
      {addressOverdue ? (
        <Alert
          actions={
            <Button onClick={onContact} size="sm" variant="outline">
              Contact Us
            </Button>
          }
          dismissible={false}
          layout="inline"
          status="warning"
          title={content.deadline ?? "Missed setup deadline"}
        />
      ) : null}
      {confirmCta && onConfirmAddress && !addressOverdue ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button className="w-full" onClick={onConfirmAddress} size="md">
            {confirmCta}
          </Button>
          {content.deadline ? (
            <p className="w-full text-center text-sm leading-5 text-secondary-foreground">
              {content.deadline}
            </p>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

function OrderSummary({
  lines,
  refund,
  payCta,
  deadline,
  overdue = false,
  settlementContact = null,
  onPay,
  onViewInvoicePdf,
  onViewRefundDetails,
  onContact,
}: {
  lines: WinnerOrderInvoiceLine[];
  refund?: WinnerOrderContent["refund"];
  payCta?: string | null;
  deadline?: string | null;
  overdue?: boolean;
  /** Partially Paid — Contact Us, no balance figure. */
  settlementContact?: string | null;
  onPay?: () => void;
  onViewInvoicePdf?: () => void;
  onViewRefundDetails?: () => void;
  onContact?: () => void;
}) {
  const total = lines.find((line) => line.label === "Order Total");
  const rest = lines.filter((line) => line.label !== "Order Total");

  return (
    <VStack className="w-full" gap="md" hAlign="stretch">
      <HStack
        className="w-full justify-between gap-3"
        gap="none"
        vAlign="center"
      >
        <h3 className="min-w-0 text-sm leading-5 font-medium text-secondary-foreground">
          Order summary
        </h3>
        {onViewInvoicePdf ? (
          <Link
            aria-label="Invoice PDF"
            className="shrink-0"
            href="#view-invoice-pdf"
            onClick={(event) => {
              event.preventDefault();
              onViewInvoicePdf();
            }}
            size="sm"
            variant="secondary"
          >
            <FilePdf aria-hidden size={14} weight="regular" />
            Invoice
          </Link>
        ) : null}
      </HStack>
      <VStack className="w-full" gap="sm" hAlign="stretch">
        {rest.map((line) => (
          <SummaryRow
            key={line.label}
            label={line.label}
            muted={line.muted || line.value === "TBD"}
            tooltip={line.tooltip}
            value={line.value}
          />
        ))}
      </VStack>
      {total ? (
        <>
          <hr className="w-full border-border" />
          <SummaryRow
            emphasize
            label={total.label}
            muted={total.muted || total.value === "TBD"}
            value={total.value}
          />
        </>
      ) : null}

      {refund ? (
        <Alert
          actions={
            <Button onClick={onViewRefundDetails} size="sm" variant="outline">
              View
            </Button>
          }
          dismissible={false}
          icon={<ArrowCounterClockwise aria-hidden size={16} weight="bold" />}
          layout="inline"
          status="default"
          title={`Refund ${refund.amount}`}
        />
      ) : null}

      {overdue ? (
        <Alert
          actions={
            <Button onClick={onContact} size="sm" variant="outline">
              Contact Us
            </Button>
          }
          dismissible={false}
          layout="inline"
          status="warning"
          title={deadline ?? "Payment deadline passed"}
        />
      ) : null}

      {settlementContact && !overdue ? (
        <Alert
          actions={
            <Button onClick={onContact} size="sm" variant="outline">
              Contact Us
            </Button>
          }
          dismissible={false}
          layout="inline"
          status="warning"
          title={settlementContact}
        />
      ) : null}

      {payCta && onPay && !overdue && !settlementContact ? (
        <VStack className="w-full" gap="sm" hAlign="stretch">
          <Button className="w-full" onClick={onPay} size="md">
            {payCta}
          </Button>
          {deadline ? (
            <p className="w-full text-center text-sm leading-5 text-secondary-foreground">
              {deadline}
            </p>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

function WinnerProgressCard({
  steps,
  trackLabel,
  onTrack,
}: {
  steps: WinnerProgressStep[];
  trackLabel?: string | null;
  onTrack?: () => void;
}) {
  return (
    <div className="w-full" data-slot="winner-order-progress">
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between gap-3 border-b border-border bg-muted px-4 py-3 sm:px-6 sm:py-4"
          gap="none"
          vAlign="center"
        >
          <h3 className="min-w-0 text-base leading-6 font-medium text-foreground">
            Order progress
          </h3>
          {trackLabel && onTrack ? (
            <Button
              className="shrink-0"
              onClick={onTrack}
              size="md"
              trailing={<ArrowUpRight aria-hidden size={14} weight="bold" />}
              variant="outline"
            >
              {trackLabel}
            </Button>
          ) : null}
        </HStack>
        {/*
          Five nowrap labels cannot share 320px without colliding. Keep a
          horizontal scroll rail on small viewports; restore equal flex at sm+.
        */}
        <div className="w-full overflow-x-auto overscroll-x-contain px-2 py-3 sm:px-0 sm:py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Stepper className="min-w-max sm:min-w-0 sm:w-full">
            {steps.map((step, index) => (
              <Step
                className="w-[4.75rem] flex-none basis-[4.75rem] sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-0"
                description={step.description}
                key={step.label}
                label={step.label}
                showLeadingConnector={index > 0}
                showTrailingConnector={index < steps.length - 1}
                state={
                  step.state === "current"
                    ? "progress"
                    : step.state === "completed"
                      ? "completed"
                      : "upcoming"
                }
              />
            ))}
          </Stepper>
        </div>
      </Card>
    </div>
  );
}

/**
 * Right sidebar — same shell as Order Details: summary, optional payment,
 * delivery address. Pre-invoice rows use TBD for unquoted fees.
 */
function OrderSidebar({
  content,
  confirmAddressCta,
  onConfirmAddress,
  payCta,
  onPay,
  onViewInvoicePdf,
  receipts,
}: {
  content: WinnerOrderContent;
  confirmAddressCta?: string | null;
  onConfirmAddress?: () => void;
  payCta?: string | null;
  onPay?: () => void;
  onViewInvoicePdf?: () => void;
  receipts?: WinnerOrderReceipt[];
}) {
  const lines = summaryLinesFor(content);
  const showPayment = Boolean(content.paymentMethod);
  const isPendingPayment =
    content.status === "pending_payment" ||
    content.status === "pending_payment_expired";
  const showAddress = content.status !== "cancelled";
  const paymentOverdue =
    Boolean(content.overdue) && content.status === "pending_payment_expired";
  const settlementContact =
    content.status === "partially_paid"
      ? (content.secondaryNote ??
        "Only part of this invoice is settled. Contact Grade10 about what remains.")
      : null;
  const showSetupPaymentMethod =
    !showPayment && !isPendingPayment && Boolean(content.setupPaymentMethod);
  const showBilling = Boolean(content.billingValue);
  const receiptList = receipts ?? [];
  const hasLowerSection =
    showPayment ||
    showAddress ||
    showSetupPaymentMethod ||
    showBilling ||
    receiptList.length > 0;
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contactReason = contactReasonFor(content.status);
  const contactMail = contactReason
    ? winnerOrderContactMail({
        reason: contactReason,
        lotTitle: content.lotTitle,
        invoiceId: content.invoiceId,
        receiptIds: (content.receipts ?? [])
          .map((receipt) => receipt.fileName?.replace(/\.pdf$/i, ""))
          .filter((id): id is string => Boolean(id)),
      })
    : null;

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
            deadline={paymentOverdue || payCta ? content.deadline : null}
            lines={lines}
            onPay={onPay}
            onViewInvoicePdf={onViewInvoicePdf}
            onViewRefundDetails={
              content.refund ? () => setRefundDialogOpen(true) : undefined
            }
            onContact={contactMail ? () => setContactOpen(true) : undefined}
            overdue={paymentOverdue}
            payCta={payCta}
            refund={content.refund}
            settlementContact={settlementContact}
          />
        </VStack>
        {hasLowerSection ? (
          <VStack className="w-full p-4 sm:p-6" gap="lg" hAlign="stretch">
            {showPayment ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
                  Payment method
                </h3>
                <Card className="gap-0 p-3" padding={false}>
                  <HStack className="w-full" gap="sm" vAlign="center">
                    <span className="text-sm leading-5 font-medium text-foreground">
                      {content.paymentMethod}
                    </span>
                    {content.paymentMasked ? (
                      <>
                        <span
                          aria-hidden
                          className="h-5 w-px shrink-0 bg-border"
                        />
                        <span className="text-sm leading-5 font-medium text-foreground">
                          {content.paymentMasked}
                        </span>
                      </>
                    ) : null}
                  </HStack>
                </Card>
                {receiptList.length > 0 ? (
                  <HStack className="w-full flex-wrap" gap="sm" vAlign="center">
                    {receiptList.map((receipt) => (
                      <Link
                        aria-label={
                          receipt.label === "Receipt"
                            ? "Receipt PDF"
                            : `${receipt.label} PDF`
                        }
                        href="#view-receipt-pdf"
                        key={receipt.label}
                        onClick={(event) => {
                          event.preventDefault();
                          openPlaceholderReceiptPdf(
                            receipt.fileName ?? "grade10-winner-receipt.pdf",
                          );
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        <FilePdf aria-hidden size={14} weight="regular" />
                        {receipt.label}
                      </Link>
                    ))}
                  </HStack>
                ) : null}
              </VStack>
            ) : null}
            {!showPayment && receiptList.length > 0 ? (
              <HStack className="w-full flex-wrap" gap="sm" vAlign="center">
                {receiptList.map((receipt) => (
                  <Link
                    aria-label={
                      receipt.label === "Receipt"
                        ? "Receipt PDF"
                        : `${receipt.label} PDF`
                    }
                    href="#view-receipt-pdf"
                    key={receipt.label}
                    onClick={(event) => {
                      event.preventDefault();
                      openPlaceholderReceiptPdf(
                        receipt.fileName ?? "grade10-winner-receipt.pdf",
                      );
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    <FilePdf aria-hidden size={14} weight="regular" />
                    {receipt.label}
                  </Link>
                ))}
              </HStack>
            ) : null}
            {showSetupPaymentMethod ? (
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
                  Payment method
                </h3>
                <Text className="text-foreground" size="sm">
                  {content.setupPaymentMethod}
                </Text>
              </VStack>
            ) : null}
            {showAddress ? (
              <AddressBlock
                confirmCta={confirmAddressCta}
                content={content}
                onConfirmAddress={onConfirmAddress}
                onContact={contactMail ? () => setContactOpen(true) : undefined}
              />
            ) : null}
            {showBilling ? (
              <VStack className="w-full" gap="sm" hAlign="start">
                <h3 className="w-full text-sm leading-5 font-medium text-secondary-foreground">
                  {content.billingLabel ?? "Billing address"}
                </h3>
                <Text className="whitespace-pre-line text-foreground" size="sm">
                  {content.billingValue}
                </Text>
              </VStack>
            ) : null}
          </VStack>
        ) : null}
      </Card>
      {content.refund ? (
        <WinnerOrderRefundDialog
          onOpenChange={setRefundDialogOpen}
          open={refundDialogOpen}
          refund={content.refund}
        />
      ) : null}
      {contactMail ? (
        <WinnerOrderContactDialog
          mail={contactMail}
          onOpenChange={setContactOpen}
          open={contactOpen}
        />
      ) : null}
    </aside>
  );
}

/**
 * Preview-only Winner Order page. Always uses the Order Details 2-column shell
 * (main + sticky summary sidebar). Storybook-first — not a published
 * `@grade10/ui` export and not the store Order Details contract.
 *
 * First paint: title, progress (when present), lot, and sidebar stagger in
 * (opacity + translateY, 280ms) via `useFirstPaintReveal` — same pattern as
 * Order Details. Settles immediately under reduced motion.
 */
function WinnerOrderPage({
  status: statusProp = "awaiting_address",
  content: contentProp,
  onPrimaryAction,
  lotHref = AUCTION_LOT_DETAILS_HREF,
  onLotClick,
}: WinnerOrderPageProps) {
  const [status, setStatus] = useState(statusProp);
  const [setupResult, setSetupResult] = useState<WinnerOrderSetupResult | null>(
    null,
  );
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [cardCheckoutPending, setCardCheckoutPending] = useState(false);
  const revealed = useFirstPaintReveal();

  useEffect(() => {
    setStatus(statusProp);
    if (statusProp !== "preparing_invoice") {
      setSetupResult(null);
    }
  }, [statusProp]);

  const content = resolveContent(status, setupResult, contentProp, statusProp);
  const confirmAddressCta =
    content.status === "awaiting_address" &&
    content.primaryCta === "Complete Order Setup"
      ? content.primaryCta
      : null;
  const payCta =
    content.status === "pending_payment" && !content.overdue
      ? content.setupPaymentMethod === "Bank transfer"
        ? "Pay by Bank Transfer"
        : "Pay with Card"
      : null;
  const progress = showWinnerProgress(content.status)
    ? winnerProgressStepsFor(content.status, content)
    : null;
  const mainStaggerIndex = progress ? 1 : 0;
  const lotStaggerIndex = progress ? 2 : 1;
  const sidebarStaggerIndex = progress ? 3 : 2;
  const statusInfoAlert =
    content.status === "preparing_invoice" && content.secondaryNote ? (
      <Alert
        dismissible={false}
        layout="inline"
        status="default"
        title={content.secondaryNote}
      />
    ) : content.status === "payment_verifying" && content.secondaryNote ? (
      <Alert
        dismissible={false}
        icon={<Hourglass aria-hidden size={16} weight="bold" />}
        layout="inline"
        status="default"
        title={content.secondaryNote}
      />
    ) : null;

  function handlePrimaryAction() {
    onPrimaryAction?.();
  }

  function handleConfirmAddressClick() {
    setSetupDialogOpen(true);
  }

  function handleSetupConfirm(result: WinnerOrderSetupResult) {
    setSetupResult(result);
    setStatus("preparing_invoice");
    toast.success(SETUP_CONFIRMED_TOAST.title, {
      description: SETUP_CONFIRMED_TOAST.description,
    });
    onPrimaryAction?.();
  }

  function handlePayClick() {
    if (content.setupPaymentMethod === "Bank transfer") {
      setProofDialogOpen(true);
      return;
    }
    if (cardCheckoutPending) return;
    setCardCheckoutPending(true);
    window.setTimeout(() => {
      setCardCheckoutPending(false);
      setStatus("processing");
      toast.success(PAYMENT_RECEIVED_TOAST.title, {
        description: PAYMENT_RECEIVED_TOAST.description,
      });
      onPrimaryAction?.();
    }, CARD_CHECKOUT_SIMULATE_MS);
  }

  function handleProofSubmit() {
    setStatus("payment_verifying");
    toast.success(PROOF_SUBMITTED_TOAST.title, {
      description: PROOF_SUBMITTED_TOAST.description,
    });
    onPrimaryAction?.();
  }

  return (
    <div
      className="flex min-h-svh w-full flex-col bg-background"
      data-revealed={revealed || undefined}
      data-slot="winner-order-page"
      data-status={content.status}
    >
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pt-6 pb-16 sm:gap-12 sm:px-8 sm:pt-8">
        <Breadcrumbs>
          <BreadcrumbItem href="#account">Account</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href={MY_AUCTIONS_PAGE_HREF}>
            My Auctions
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Winner Order</BreadcrumbItem>
        </Breadcrumbs>

        <RevealGroup revealed={revealed} staggerIndex={0}>
          <HStack className="w-full" gap="sm" vAlign="center">
            <h1 className="text-2xl leading-8 font-semibold text-balance text-foreground sm:text-3xl sm:leading-9">
              {content.title}
            </h1>
            <Badge size="sm" variant={winnerOrderBadgeVariant(content.status)}>
              {content.statusLabel}
            </Badge>
          </HStack>
        </RevealGroup>

        <div className="grid w-full items-start gap-6 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
          {/*
            On small viewports the status inline alert sits under Order progress
            (before the lot). From lg up it stays under the lot card.
          */}
          <VStack className="min-w-0 w-full" gap="lg" hAlign="stretch">
            {progress ? (
              <RevealGroup
                className="order-1"
                revealed={revealed}
                staggerIndex={mainStaggerIndex}
              >
                <WinnerProgressCard
                  onTrack={
                    content.primaryCta === "Track shipment"
                      ? handlePrimaryAction
                      : undefined
                  }
                  steps={progress}
                  trackLabel={
                    content.primaryCta === "Track shipment"
                      ? content.primaryCta
                      : null
                  }
                />
              </RevealGroup>
            ) : null}

            {statusInfoAlert ? (
              <RevealGroup
                className="order-2 w-full lg:order-3"
                revealed={revealed}
                staggerIndex={progress ? mainStaggerIndex + 1 : lotStaggerIndex}
              >
                {statusInfoAlert}
              </RevealGroup>
            ) : null}

            <RevealGroup
              className={cn(
                "w-full",
                progress && statusInfoAlert ? "order-3 lg:order-2" : undefined,
              )}
              revealed={revealed}
              staggerIndex={lotStaggerIndex}
            >
              <VStack className="w-full" gap="lg" hAlign="stretch">
                <LotCard
                  content={content}
                  href={lotHref}
                  onClick={onLotClick}
                />

                {content.outcomeAlert ? (
                  <Alert
                    dismissible={false}
                    layout="inline"
                    status={content.outcomeAlert.status}
                    title={content.outcomeAlert.title}
                  />
                ) : null}

                {content.secondaryNote && content.status === "shipped" ? (
                  <Text size="sm" tone="secondary">
                    {content.secondaryNote}
                  </Text>
                ) : null}
              </VStack>
            </RevealGroup>
          </VStack>

          <RevealGroup
            className="min-w-0 w-full"
            revealed={revealed}
            staggerIndex={sidebarStaggerIndex}
          >
            <OrderSidebar
              confirmAddressCta={confirmAddressCta}
              content={content}
              onConfirmAddress={handleConfirmAddressClick}
              onPay={payCta ? handlePayClick : undefined}
              onViewInvoicePdf={
                hasIssuedInvoice(content)
                  ? openPlaceholderInvoicePdf
                  : undefined
              }
              payCta={
                cardCheckoutPending && payCta === "Pay with Card"
                  ? "Redirecting…"
                  : payCta
              }
              receipts={receiptLinksFor(content)}
            />
          </RevealGroup>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />

      <WinnerOrderSetupDialog
        onConfirm={handleSetupConfirm}
        onOpenChange={setSetupDialogOpen}
        open={setupDialogOpen}
      />
      <WinnerOrderPaymentProofDialog
        onOpenChange={setProofDialogOpen}
        onSubmit={handleProofSubmit}
        open={proofDialogOpen}
      />
    </div>
  );
}

export type { WinnerOrderPageProps };
export { WinnerOrderPage };
