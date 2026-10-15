import { formatDay } from "@grade10/date";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  type AuctionSettlementCurrency,
  AuctionWinnerOrder,
  type AuctionWinnerOrderBankDetails,
  type AuctionWinnerOrderPaymentChoice,
  type AuctionWinnerOrderProps,
  type AuctionWinnerOrderStep,
  type OrderDetailsPaymentBrand,
  SiteHeader,
} from "@grade10/ui";
import { useState } from "react";
import { AUCTION_SITE_HEADER } from "../../auction-lot-details-content";
import { AUCTION_FOOTER } from "../../store-content";
import {
  AUCTION_LOT_DETAILS_HREF,
  MY_AUCTIONS_PAGE_HREF,
} from "../../workbench-story-nav";
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
import {
  WINNER_ORDER_BANK_DETAILS,
  WinnerOrderPaymentProofDialog,
} from "./winner-order-payment-proof-dialog";
import { toastProofSubmitted } from "./winner-order-proof-feedback";
import { WinnerOrderRefundDialog } from "./winner-order-refund-dialog";
import type { WinnerOrderSetupResult } from "./winner-order-setup-dialog";
import { WinnerOrderSetupDialog } from "./winner-order-setup-dialog";

const PAYMENT_RECEIVED_TOAST = {
  title: "Payment received",
  description: "We’re preparing this lot to ship.",
} as const;

/** Preview-only beat while returning from a simulated card host. */
const CARD_CHECKOUT_SIMULATE_MS = 700;

/** Same recorded cancellation instant as the auction email preview fixture. */
const CANCELLED_AT_MS = Date.UTC(2026, 8, 25, 2, 15);
/** The clock the sample cancellation is worded on, so the day reads the same on every machine. */
const CANCELLED_ZONE = "Asia/Hong_Kong";

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

const PRODUCT_IMAGE = new URL("../../product.fixture.png", import.meta.url)
  .href;

const COPY: AuctionWinnerOrderProps["copy"] = {
  orderProgress: "Order Progress",
  orderSummary: "Order summary",
  invoice: "Invoice",
  invoicePdf: "Invoice PDF",
  paymentMethod: "Payment method",
  refundDetails: "Refund Details",
  winningBid: "Winning bid",
  bank: "Bank",
  bankDetailsClose: "Close",
  bankDetailsQrAlt: "FPS payment QR code for this order",
};

const PREVIEW_CARD_FEE_PERCENTAGES = { USD: 4.4, HKD: 3.4 };

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
  const currency = value.match(/^(HK|US)\$/)?.[0] ?? "US$";
  const withDollar = value.replaceAll(/(?:HK|US)\$/g, "$");
  return withDollar.replace(
    /^(−?)\$([\d,]+)(?:\.(\d+))?$/,
    (_match, sign: string, intPart: string, frac: string | undefined) => {
      const digits = intPart.replaceAll(",", "");
      const fracDigits = frac ?? "";
      if (Number(digits) === 0 && Number(fracDigits || "0") === 0) {
        return `${sign}${currency}0`;
      }
      const decimals = fracDigits.padEnd(2, "0");
      return `${sign}${currency}${intPart}.${decimals}`;
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
    tracking: content.trackingCode
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
    ? {
        kind: "text",
        label: `${content.setupPaymentMethod} (${content.settlementCurrency ?? "HKD"})`,
      }
    : undefined;
}

/** `US$12,800.00` → 12800, so a fee can compute off the displayed bid. */
function summaryAmountValue(line: string): number | null {
  const match = /^(?:HK|US)\$([\d,]+)(?:\.(\d+))?$/.exec(line);
  if (!match) return null;
  return Number(match[1].replaceAll(",", "")) + Number(`0.${match[2] ?? "0"}`);
}

/** A computed summary amount, formatted the same way `summaryLineAmount` writes one. */
function summaryAmountLine(value: number, prefix: "HK$" | "US$"): string {
  return `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Sidebar money rows — full invoice when issued; otherwise winning bid + the computed premium + TBD fees. */
function summaryLinesFor(
  content: WinnerOrderContent,
): WinnerOrderInvoiceLine[] {
  // Lot card keeps the lot currency; Order Summary line amounts use `$` with two decimals.
  const winningBidLine = summaryLineAmount(content.winningBid);
  if (content.invoiceLines?.length) {
    return content.invoiceLines.map((line) => ({
      ...line,
      value: line.value.startsWith("$") ? `US${line.value}` : line.value,
    }));
  }
  if (content.status === "cancelled") {
    return [
      { label: "Winning Bid", value: winningBidLine },
      { label: "Order Total", value: "—" },
    ];
  }
  // The premium is Grade10-computed — 20% of the winning bid, or the currency
  // minimum when that is higher — so it is known at close, ahead of the
  // operator's invoice. The total shows the known charges; operator-quoted
  // fees stay TBD until the invoice is sent.
  const prefix = winningBidLine.startsWith("HK$") ? "HK$" : "US$";
  const bid = summaryAmountValue(winningBidLine);
  const premium =
    bid == null ? null : Math.max(Math.round(bid * 20), 100) / 100;
  const knownTotal = bid == null || premium == null ? null : bid + premium;
  return [
    { label: "Winning Bid", value: winningBidLine },
    {
      label: "Buyer’s Premium",
      value: premium == null ? "TBD" : summaryAmountLine(premium, prefix),
      muted: premium == null,
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
    {
      label: "Order Total",
      value: knownTotal == null ? "TBD" : summaryAmountLine(knownTotal, prefix),
      muted: knownTotal == null,
      footnote:
        knownTotal == null
          ? undefined
          : "Shipping, insurance and fees are added at invoice.",
    },
  ];
}

const SETTLEMENT_CURRENCY_OPTIONS: readonly {
  value: AuctionSettlementCurrency;
  label: string;
}[] = [
  { value: "USD", label: "USD" },
  { value: "HKD", label: "HKD" },
];

const PAYMENT_RAILS_BY_CURRENCY: Record<
  AuctionSettlementCurrency,
  readonly AuctionWinnerOrderPaymentChoice[]
> = {
  HKD: [
    {
      value: "card",
      label: "Card",
      feeRange: "3.0% + HK$10 to 4.0% + HK$20",
    },
    { value: "fps", label: "FPS", feeRange: "No fee" },
    { value: "hk_local", label: "HK Local", feeRange: "No fee" },
  ],
  USD: [
    {
      value: "card",
      label: "Card",
      feeRange: "3.0% + US$1 to 4.0% + US$2",
    },
    { value: "hk_local", label: "HK Local", feeRange: "No fee" },
    {
      value: "swift",
      label: "International via SWIFT",
      feeRange: "No fee",
    },
  ],
};

function selectedPaymentChoice(
  content: WinnerOrderContent,
): AuctionWinnerOrderPaymentChoice["value"] | null {
  if (content.paymentRail) return content.paymentRail;
  if (
    content.setupPaymentMethod === "Card" ||
    content.paymentMethod === "Visa"
  ) {
    return "card";
  }
  if (content.setupPaymentMethod === "FPS") return "fps";
  if (content.setupPaymentMethod === "HK Local") return "hk_local";
  if (content.setupPaymentMethod === "International via SWIFT") return "swift";
  return null;
}

function settlementCurrencyFor(
  content: WinnerOrderContent,
): NonNullable<AuctionWinnerOrderProps["settlementCurrency"]> | undefined {
  if (content.status !== "awaiting_address" || !content.settlementCurrency) {
    return undefined;
  }
  return {
    label: "Settlement currency",
    options: SETTLEMENT_CURRENCY_OPTIONS,
    value: content.settlementCurrency,
    onChange: () => undefined,
  };
}

function paymentChoicesFor(
  content: WinnerOrderContent,
): AuctionWinnerOrderProps["paymentChoices"] | undefined {
  if (content.status !== "awaiting_address" || !content.settlementCurrency) {
    return undefined;
  }
  return {
    label: "Payment method",
    byCurrency: PAYMENT_RAILS_BY_CURRENCY,
    value: selectedPaymentChoice(content),
    onChange: () => undefined,
  };
}

function bankDetailsFor(
  content: WinnerOrderContent,
): AuctionWinnerOrderBankDetails | undefined {
  const rail = content.paymentRail;
  if (!rail) return undefined;

  const invoiceTotal = content.invoiceLines?.find(
    (line) => line.label === "Order Total",
  )?.value;
  const amountDue = content.convertedTotal ?? content.usdTotal ?? invoiceTotal;

  const rows = [
    ...(amountDue
      ? [
          {
            label: "Amount due",
            value: amountDue,
          },
        ]
      : []),
    ...(content.invoiceId
      ? [{ label: "Invoice", value: content.invoiceId }]
      : []),
  ];

  if (rail === "fps") {
    return {
      rail,
      title: "View Bank Details",
      rows: [
        ...rows,
        { label: "FPS ID", value: WINNER_ORDER_BANK_DETAILS.fpsId },
        {
          label: "Account name",
          value: WINNER_ORDER_BANK_DETAILS.beneficiaryName,
        },
        {
          label: "Payment reference",
          value: WINNER_ORDER_BANK_DETAILS.transferReference,
        },
      ],
      note: "Open your banking app and scan this QR",
    };
  }

  if (rail === "hk_local") {
    return {
      rail,
      title: "View Bank Details",
      rows: [
        ...rows,
        { label: "Bank name", value: WINNER_ORDER_BANK_DETAILS.bankName },
        { label: "Bank code", value: WINNER_ORDER_BANK_DETAILS.bankCode },
        {
          label: "Branch code",
          value: WINNER_ORDER_BANK_DETAILS.branchCode,
        },
        {
          label: "Account number",
          value: WINNER_ORDER_BANK_DETAILS.accountNumber,
        },
        {
          label: "Payment reference",
          value: WINNER_ORDER_BANK_DETAILS.transferReference,
        },
      ],
    };
  }

  return {
    rail,
    title: "View Bank Details",
    rows: [
      ...rows,
      {
        label: "Beneficiary name",
        value: WINNER_ORDER_BANK_DETAILS.beneficiaryName,
      },
      {
        label: "Beneficiary address",
        value: WINNER_ORDER_BANK_DETAILS.beneficiaryAddress,
      },
      { label: "Bank name", value: WINNER_ORDER_BANK_DETAILS.bankName },
      { label: "Bank address", value: WINNER_ORDER_BANK_DETAILS.bankAddress },
      { label: "SWIFT / BIC", value: WINNER_ORDER_BANK_DETAILS.swiftCode },
      {
        label: "Account number / IBAN",
        value: WINNER_ORDER_BANK_DETAILS.accountNumber,
      },
      {
        label: "Payment reference",
        value: WINNER_ORDER_BANK_DETAILS.transferReference,
      },
    ],
    note: "In your bank app, choose OUR for transfer fees so we receive the full order total.",
  };
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
      settlementCurrency: setup.settlementCurrency,
      setupPaymentMethod:
        setup.paymentMethod === "card"
          ? "Card"
          : setup.paymentMethod === "fps"
            ? "FPS"
            : setup.paymentMethod === "hk_local"
              ? "HK Local"
              : "International via SWIFT",
      paymentRail:
        setup.paymentMethod === "card" ? undefined : setup.paymentMethod,
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
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [cardCheckoutPending, setCardCheckoutPending] = useState(false);

  const content = resolveContent(status, setupResult, contentProp, statusProp);
  const contactReason = contactReasonFor(content.status);
  const cancelledOn =
    content.status === "cancelled"
      ? formatDay(CANCELLED_AT_MS, { locale: "en", timeZone: CANCELLED_ZONE })
      : null;
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

  const outcomeAlert =
    content.status === "cancelled" && cancelledOn
      ? {
          title: `Cancelled on ${cancelledOn}`,
          status: "warning" as const,
          action: contactAction,
        }
      : content.outcomeAlert
        ? { ...content.outcomeAlert }
        : null;

  const payCta =
    content.status === "pending_payment" && !content.overdue
      ? content.paymentRail != null
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
  const totalLine = lines.find((line) => line.label === "Order Total");
  const total = totalLine
    ? {
        ...totalLine,
        value:
          content.settlementCurrency === "HKD"
            ? totalLine.value
            : (content.usdTotal ?? totalLine.value),
      }
    : undefined;
  const cardSettlement =
    content.settlementCurrency === "HKD" &&
    !content.paymentRail &&
    (content.setupPaymentMethod === "Card" || content.paymentMethod === "Visa");
  const summaryLines = lines.filter(
    (line) =>
      line.label !== "Order Total" &&
      !(
        cardSettlement &&
        !hasIssuedInvoice(content) &&
        line.label === "Payment Processing Fee"
      ),
  );

  function handleSetupConfirm(result: WinnerOrderSetupResult) {
    setSetupResult(result);
    setStatus("preparing_invoice");
    toast.success(SETUP_CONFIRMED_TOAST.title, {
      description: SETUP_CONFIRMED_TOAST.description,
    });
    onPrimaryAction?.();
  }

  function handlePayClick() {
    if (content.paymentRail != null) {
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
            outcomeAlert
              ? [
                  {
                    title: outcomeAlert.title,
                    status: outcomeAlert.status,
                    action: outcomeAlert.action,
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
          bankDetails={bankDetailsFor(content)}
          note={noteFor(content)}
          paymentChoices={paymentChoicesFor(content)}
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
          settlementCurrency={settlementCurrencyFor(content)}
          summary={{
            lines: summaryLines,
            total: total ?? null,
            currencyToggle:
              content.settlementCurrency === "HKD"
                ? {
                    primary: "HKD",
                    secondary: "USD",
                    ariaLabel: "Amount currency",
                  }
                : undefined,
            convertedTotal: content.convertedTotal
              ? { label: "Order Total", value: content.convertedTotal }
              : undefined,
            convertedFee: content.convertedFee
              ? {
                  label: "Payment Processing Fee",
                  value: content.convertedFee,
                }
              : undefined,
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
                      payCta === "Submit Payment Proof" && content.paymentRail
                        ? {
                            label: "View Bank Details",
                            onPress: () => undefined,
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
        cardFeePercentages={PREVIEW_CARD_FEE_PERCENTAGES}
        onConfirm={handleSetupConfirm}
        onOpenChange={setSetupDialogOpen}
        open={setupDialogOpen}
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
export {
  // Closed-order stories share this page's cancellation clock.
  CANCELLED_AT_MS,
  CANCELLED_ZONE,
  WinnerOrderPage,
};
