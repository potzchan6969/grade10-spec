import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  AuctionWinnerOrder,
  type AuctionWinnerOrderProps,
  type AuctionWinnerOrderStep,
  type OrderDetailsPaymentBrand,
  SiteHeader,
} from "@grade10/ui";
import { useState } from "react";
import { AUCTION_SITE_HEADER } from "./auction-lot-details-content";
import { AUCTION_FOOTER } from "./store-content";
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
import { WinnerOrderHowToPayDialog } from "./winner-order-how-to-pay-dialog";
import { WinnerOrderPaymentProofDialog } from "./winner-order-payment-proof-dialog";
import { toastProofSubmitted } from "./winner-order-proof-feedback";
import { WinnerOrderRefundDialog } from "./winner-order-refund-dialog";
import type { WinnerOrderSetupResult } from "./winner-order-setup-dialog";
import { WinnerOrderSetupDialog } from "./winner-order-setup-dialog";
import {
  AUCTION_LOT_DETAILS_HREF,
  MY_AUCTIONS_PAGE_HREF,
} from "./workbench-story-nav";

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

const COPY: AuctionWinnerOrderProps["copy"] = {
  orderProgress: "Order Progress",
  orderSummary: "Order summary",
  invoice: "Invoice",
  invoicePdf: "Invoice PDF",
  paymentMethod: "Payment method",
  view: "View",
  winningBid: "Winning bid",
  bank: "Bank",
};

type WinnerOrderPageProps = {
  status?: WinnerOrderStatus;
  content?: WinnerOrderContent;
  onPrimaryAction?: () => void;
  /** Opens lot details — preview defaults to the closed-won lot story. */
  lotHref?: string;
  onLotClick?: () => void;
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
): AuctionWinnerOrderProps["badge"]["variant"] {
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
    case "shipped":
      return "default";
    default:
      return "outline";
  }
}

/** The designer's five steps; Cancelled and Refunded show none. */
function currentStepFor(
  status: WinnerOrderStatus,
): AuctionWinnerOrderStep | "done" {
  switch (status) {
    case "awaiting_address":
    case "awaiting_address_expired":
      return "address";
    case "preparing_invoice":
      return "invoice";
    case "processing":
    case "shipped":
      return "shipping";
    case "delivered":
      return "done";
    default:
      return "payment";
  }
}

/** Order Summary line money: `$` prefix, at least two decimals; `$0` stays bare. */
function summaryLineAmount(value: string): string {
  const withDollar = value.replaceAll("HK$", "$");
  return withDollar.replace(
    /^(−?)\$([\d,]+)(?:\.(\d+))?$/,
    (_match, sign: string, intPart: string, frac: string | undefined) => {
      const digits = intPart.replaceAll(",", "");
      const fracDigits = frac ?? "";
      if (Number(digits) === 0 && Number(fracDigits || "0") === 0) {
        return `${sign}$0`;
      }
      const decimals = fracDigits.padEnd(2, "0");
      return `${sign}$${intPart}.${decimals}`;
    },
  );
}

/**
 * Address, Invoice and Payment use absolute datetimes (Payment while due
 * reads “Pay by …”); Shipping reads Preparing to ship while Preparing
 * Shipment, and day-only dates once shipped.
 */
function progressFor(
  content: WinnerOrderContent,
): AuctionWinnerOrderProps["progress"] {
  if (!showWinnerProgress(content.status)) return null;
  const dates = content.progressDates;
  return {
    current: currentStepFor(content.status),
    steps: {
      address: { label: "Address", description: dates?.address },
      invoice: { label: "Invoice", description: dates?.invoice },
      payment: { label: "Payment", description: dates?.payment },
      shipping: {
        label: "Shipping",
        description:
          content.status === "processing"
            ? "Preparing to ship"
            : dates?.shipped,
      },
      completed: { label: "Completed", description: dates?.completed },
    },
    tracking:
      content.trackingCode && content.trackingHref
        ? { code: content.trackingCode, href: content.trackingHref }
        : undefined,
  };
}

function noteFor(content: WinnerOrderContent): AuctionWinnerOrderProps["note"] {
  if (!content.secondaryNote) return undefined;
  if (content.status === "preparing_invoice") {
    return { title: content.secondaryNote };
  }
  if (content.status === "payment_verifying") {
    return { title: content.secondaryNote, icon: "hourglass" };
  }
  return undefined;
}

const PAYMENT_BRAND_BY_LABEL: Record<string, OrderDetailsPaymentBrand> = {
  Visa: "visa",
  Mastercard: "mastercard",
  "American Express": "amex",
  "Apple Pay": "apple-pay",
  "Google Pay": "google-pay",
};

function paymentMethodFor(
  content: WinnerOrderContent,
): AuctionWinnerOrderProps["paymentMethod"] {
  const method = content.paymentMethod;
  if (method) {
    const brand = PAYMENT_BRAND_BY_LABEL[method];
    if (brand) return { kind: "card", brand, masked: content.paymentMasked };
    return {
      kind: "bank",
      label: content.paymentMasked ?? method,
      bankName: method !== "Bank transfer" ? method : undefined,
    };
  }
  const pendingPayment =
    content.status === "pending_payment" ||
    content.status === "pending_payment_expired";
  return content.setupPaymentMethod && !pendingPayment
    ? { kind: "text", label: content.setupPaymentMethod }
    : undefined;
}

/** Sidebar money rows — full invoice when issued; otherwise winning bid + TBD fees. */
function summaryLinesFor(
  content: WinnerOrderContent,
): WinnerOrderInvoiceLine[] {
  // Lot card keeps HK$; Order Summary line amounts use `$` with two decimals.
  const winningBidLine = summaryLineAmount(content.winningBid);
  if (content.invoiceLines?.length) {
    return [...content.invoiceLines];
  }
  if (content.status === "cancelled") {
    return [
      { label: "Winning Bid", value: winningBidLine },
      { label: "Order Total", value: "—" },
    ];
  }
  return [
    { label: "Winning Bid", value: winningBidLine },
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
      label: "Insurance",
      value: "TBD",
      muted: true,
      tooltip: LINE_TOOLTIPS.shippingInsurance,
    },
    {
      label: "Tax",
      value: "TBD",
      muted: true,
      tooltip: LINE_TOOLTIPS.tax,
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

/**
 * Preview-only Winner Order page: the preview's chrome, status transitions,
 * card checkout simulation and dialogs around the published
 * `AuctionWinnerOrder` block.
 */
function WinnerOrderPage({
  status: statusProp = "awaiting_address",
  content: contentProp,
  onPrimaryAction,
  lotHref = AUCTION_LOT_DETAILS_HREF,
  onLotClick,
}: WinnerOrderPageProps) {
  return (
    <WinnerOrderPageState
      key={statusProp}
      content={contentProp}
      lotHref={lotHref}
      onLotClick={onLotClick}
      onPrimaryAction={onPrimaryAction}
      status={statusProp}
    />
  );
}

function WinnerOrderPageState({
  status: statusProp = "awaiting_address",
  content: contentProp,
  onPrimaryAction,
  lotHref,
  onLotClick,
}: WinnerOrderPageProps) {
  const [status, setStatus] = useState(statusProp);
  const [setupResult, setSetupResult] = useState<WinnerOrderSetupResult | null>(
    null,
  );
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [howToPayDialogOpen, setHowToPayDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [cardCheckoutPending, setCardCheckoutPending] = useState(false);

  const content = resolveContent(status, setupResult, contentProp, statusProp);
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
  const contactAction = {
    label: "Contact Us",
    onPress: () => {
      if (contactMail) setContactOpen(true);
    },
  };

  const payCta =
    content.status === "pending_payment" && !content.overdue
      ? content.setupPaymentMethod === "Bank transfer"
        ? "Submit Payment Proof"
        : "Pay with Card"
      : null;
  const paymentOverdue =
    Boolean(content.overdue) && content.status === "pending_payment_expired";
  const addressOverdue =
    Boolean(content.overdue) &&
    (content.status === "awaiting_address" ||
      content.status === "awaiting_address_expired");
  const settlementContact =
    content.status === "partially_paid"
      ? (content.secondaryNote ??
        "Only part of this invoice is settled. Contact Grade10 about what remains.")
      : null;
  const lines = summaryLinesFor(content);
  const total = lines.find((line) => line.label === "Order Total");

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
    toastProofSubmitted();
    onPrimaryAction?.();
  }

  return (
    <div
      className="flex min-h-svh w-full flex-col bg-background"
      data-slot="winner-order-page"
      data-status={content.status}
    >
      <SiteHeader {...AUCTION_SITE_HEADER} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pt-6 pb-16 sm:gap-12 sm:px-8 sm:pt-8">
        <Breadcrumbs>
          <BreadcrumbItem href={MY_AUCTIONS_PAGE_HREF}>
            My Auctions
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Winner Order</BreadcrumbItem>
        </Breadcrumbs>

        <AuctionWinnerOrder
          alerts={
            content.outcomeAlert
              ? [
                  {
                    title: content.outcomeAlert.title,
                    status: content.outcomeAlert.status,
                  },
                ]
              : []
          }
          badge={{
            label: content.statusLabel,
            variant: winnerOrderBadgeVariant(content.status),
          }}
          billing={
            content.billingValue
              ? {
                  label: content.billingLabel ?? "Billing address",
                  value: content.billingValue,
                }
              : undefined
          }
          copy={COPY}
          delivery={
            content.status === "cancelled"
              ? undefined
              : {
                  label: content.addressLabel,
                  value: content.addressValue ?? undefined,
                  alert: addressOverdue
                    ? {
                        title: content.deadline ?? "Missed setup deadline",
                        status: "warning",
                        action: contactAction,
                      }
                    : undefined,
                  confirm:
                    content.status === "awaiting_address" &&
                    content.primaryCta === "Complete Order Setup" &&
                    !addressOverdue
                      ? {
                          label: content.primaryCta,
                          onPress: () => setSetupDialogOpen(true),
                          deadline: content.deadline,
                        }
                      : undefined,
                }
          }
          lot={{
            title: content.lotTitle,
            winningBid: content.winningBid,
            imageSrc: PRODUCT_IMAGE,
            href: lotHref,
            onOpen: onLotClick,
            ariaLabel: lotHref
              ? `${content.lotTitle} — open lot details`
              : "Winning lot",
          }}
          note={noteFor(content)}
          paymentMethod={paymentMethodFor(content)}
          progress={progressFor(content)}
          receipts={receiptLinksFor(content).map((receipt) => ({
            label: receipt.label,
            ariaLabel: `${receipt.label} PDF`,
            onOpen: () =>
              openPlaceholderReceiptPdf(
                receipt.fileName ?? "grade10-winner-receipt.pdf",
              ),
          }))}
          summary={{
            lines: lines.filter((line) => line !== total),
            total: total ?? null,
            invoicePdf: hasIssuedInvoice(content)
              ? { onOpen: openPlaceholderInvoicePdf }
              : undefined,
            refund: content.refund
              ? {
                  title: `Refund ${content.refund.amount}`,
                  onView: () => setRefundDialogOpen(true),
                }
              : undefined,
            alert: paymentOverdue
              ? {
                  title: content.deadline ?? "Payment deadline passed",
                  status: "warning",
                  action: contactAction,
                }
              : settlementContact
                ? {
                    title: settlementContact,
                    status: "warning",
                    action: contactAction,
                  }
                : undefined,
            pay:
              payCta && !paymentOverdue && !settlementContact
                ? {
                    label:
                      cardCheckoutPending && payCta === "Pay with Card"
                        ? "Redirecting…"
                        : payCta,
                    onPress: handlePayClick,
                    loading: cardCheckoutPending,
                    secondary:
                      payCta === "Submit Payment Proof"
                        ? {
                            label: "View Bank Details",
                            onPress: () => setHowToPayDialogOpen(true),
                          }
                        : undefined,
                    deadline: content.deadline,
                  }
                : undefined,
          }}
          title={content.title}
        />
      </main>
      <Footer {...AUCTION_FOOTER} />
      <Toast position="bottom-right" />

      <WinnerOrderSetupDialog
        onConfirm={handleSetupConfirm}
        onOpenChange={setSetupDialogOpen}
        open={setupDialogOpen}
      />
      <WinnerOrderHowToPayDialog
        invoiceId={content.invoiceId ?? undefined}
        onOpenChange={setHowToPayDialogOpen}
        open={howToPayDialogOpen}
      />
      <WinnerOrderPaymentProofDialog
        onOpenChange={setProofDialogOpen}
        onSubmit={handleProofSubmit}
        open={proofDialogOpen}
      />
      {content.refund ? (
        <WinnerOrderRefundDialog
          onOpenChange={setRefundDialogOpen}
          open={refundDialogOpen}
          refund={content.refund}
        />
      ) : null}
      {contactMail ? (
        <WinnerOrderContactDialog
          key={contactOpen ? contactMail.body : "closed"}
          mail={contactMail}
          onOpenChange={setContactOpen}
          open={contactOpen}
        />
      ) : null}
    </div>
  );
}

export type { WinnerOrderPageProps };
export { WinnerOrderPage };
