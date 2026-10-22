import type {
  InvoicePdfBankRails,
  InvoicePdfCopy,
  InvoicePdfData,
} from "./invoice-pdf";
import type { PdfItemRow, PdfItemTotal } from "./pdf-document";
import type { ReceiptPdfCopy, ReceiptPdfData } from "./receipt-pdf";

/** The item table's five labels, which the shared catalog does not carry yet. */
export const TABLE_LABELS = {
  itemLabel: "Item",
  winningBidLabel: "Winning Bid",
  buyersPremiumLabel: "Buyer's Premium",
  totalLabel: "Total",
  itemTotalLabel: "Item Total",
} as const;

const MONEY = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const amount = (cents: number) => MONEY.format(cents / 100);

const usd = (cents: number) => `US$${amount(cents)}`;

const hkd = (cents: number) => `HK$${amount(cents)}`;

const centsOf = (amount: string) =>
  Math.round(Number(amount.replace(/[^\d.]/g, "")) * 100);

/** The Subtotal: the USD lines' sum converted once at 1 USD = 7.85 HKD, rounded up to the cent. */
const hkdOf = (usdCents: number) => Math.ceil((usdCents * 785) / 100);

/** The card fee on a Subtotal, grossed up: 3.4% plus HK$2.35 of the amount charged. */
const cardFeeOf = (subtotal: number) =>
  Math.ceil((subtotal * 340 + 2_350_000) / 9_660);

/** The lines an HKD invoice draws under the table: USD charges, then Subtotal, fee and Order Total in HKD. */
function hkdChargesOf(
  usdLines: readonly { label: string; cents: number }[],
  usdCents: number,
  payment: "bank" | "card",
) {
  const subtotal = hkdOf(usdCents);
  const fee = payment === "card" ? cardFeeOf(subtotal) : 0;
  const total = subtotal + fee;
  return {
    total,
    lineItems: [
      ...usdLines.map(({ label, cents }) => ({
        label,
        amount: cents === 0 ? "Free" : usd(cents),
      })),
      {
        key: "subtotal" as const,
        label: "Subtotal",
        amount: hkd(subtotal),
        note: `Converted from ${usd(usdCents)} at 1 USD = 7.85 HKD`,
      },
      {
        key: "paymentProcessingFee" as const,
        label: "Payment Processing Fee",
        amount: fee === 0 ? "Free" : hkd(fee),
      },
      { key: "orderTotal" as const, label: "Order Total", amount: hkd(total) },
    ],
  };
}

/** `count` items titled `Lot 01`, `Lot 02`, ..., item n bidding n × US$100.00 with a 20% premium. */
export function sampleItems(count: number): PdfItemRow[] {
  const digits = Math.max(2, String(count).length);
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      title: `Lot ${String(n).padStart(digits, "0")}`,
      winningBid: usd(n * 10_000),
      buyersPremium: usd(n * 2_000),
      total: usd(n * 12_000),
    };
  });
}

/** The Item Total a caller would supply for `items`: each column summed. */
export function itemTotalOf(items: readonly PdfItemRow[]): PdfItemTotal {
  const sum = (key: keyof PdfItemTotal) =>
    usd(items.reduce((cents, item) => cents + centsOf(item[key]), 0));
  return {
    winningBid: sum("winningBid"),
    buyersPremium: sum("buyersPremium"),
    total: sum("total"),
  };
}

const INVOICE_COPY: InvoicePdfCopy = {
  documentTitle: "Invoice",
  billToHeading: "Bill To",
  shipToHeading: "Ship To",
  ...TABLE_LABELS,
  invoiceNumberLabel: "Invoice number",
  sentAtLabel: "Date of issue",
  paymentDeadlineLabel: "Date due",
  paymentMethodLabel: "Payment method",
  replacesInvoiceLabel: "Replaces invoice",
  bankDetailsHeading: "Bank details",
  swiftLabel: "SWIFT",
  fpsLabel: "FPS",
  hkLocalTransferLabel: "HK local transfer",
  beneficiaryLabel: "Beneficiary",
  swiftBicLabel: "SWIFT/BIC",
  accountIbanLabel: "Account/IBAN",
  fpsIdLabel: "FPS ID",
  bankAndCodeLabel: "Bank & code",
  accountNoLabel: "Account no.",
  bankReferenceNoteLabel:
    "Enter this reference in your bank app's Memo or Remarks field. Missing it delays verification. Quote this reference on your transfer:",
};

const RECEIPT_COPY: ReceiptPdfCopy = {
  documentTitle: "Receipt",
  billToHeading: "Bill To",
  shipToHeading: "Ship To",
  ...TABLE_LABELS,
  receiptNumberLabel: "Receipt number",
  invoiceNumberLabel: "Invoice number",
  datePaidLabel: "Date paid",
  paymentMethodLabel: "Payment method",
  paymentReferenceLabel: "Payment reference",
  paymentSectionLabel: "Payment",
  transferReferenceLabel: "Transfer reference",
  paymentBreakdownLabel: "Payment breakdown",
  originalInvoiceTotalLabel: "Original Invoice Total",
  previousPaymentsLabel: "Previous Payments",
  currentPaymentReceivedLabel: "Current Payment Received",
  remainingBalanceDueLabel: "Remaining Balance Due",
};

const BILL_TO = {
  recipient: "Alexandra Tran",
  company: "Grade10 Collector Club",
  phone: "+852 2123 4567",
  line1: "Flat A, 21/F, One Harbour Square",
  line2: "181 Java Road",
  city: "North Point",
  region: null,
  postalCode: "999077",
  countryCode: "Hong Kong SAR",
} as const;

const SHIP_TO = {
  ...BILL_TO,
  phone: null,
  company: null,
  line2: null,
} as const;

const SHIPPING_AND_INSURANCE = [
  { label: "Shipping & Handling", cents: 8_000 },
  { label: "Insurance", cents: 4_000 },
] as const;

const USD_INVOICE_ITEMS: readonly PdfItemRow[] = [
  {
    title: "1999 Pokémon Base Set Charizard PSA 9",
    winningBid: "US$101.00",
    buyersPremium: "US$20.20",
    total: "US$121.20",
  },
] as const;

const USD_INVOICE_ITEM_TOTAL: PdfItemTotal = {
  winningBid: "US$101.00",
  buyersPremium: "US$20.20",
  total: "US$121.20",
};

/** The lot of `USD_INVOICE_ITEMS` with US$10.01 of Shipping & Handling: US$131.21, HK$1,030.00. */
const HKD_BANK_CHARGES = hkdChargesOf(
  [{ label: "Shipping & Handling", cents: 1_001 }],
  13_121,
  "bank",
);

/** The same lot with free Shipping & Handling: US$121.20, HK$951.42. */
const HKD_FREE_SHIPPING_CHARGES = hkdChargesOf(
  [{ label: "Shipping & Handling", cents: 0 }],
  12_120,
  "bank",
);

const TAX_INVOICE_ITEMS: readonly PdfItemRow[] = [
  {
    title: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
    winningBid: "US$2,500.00",
    buyersPremium: "US$500.00",
    total: "US$3,000.00",
  },
] as const;

const TAX_INVOICE_ITEM_TOTAL: PdfItemTotal = {
  winningBid: "US$2,500.00",
  buyersPremium: "US$500.00",
  total: "US$3,000.00",
};

/** US$3,000.00 + US$80.00 + US$40.00 + US$156.00 tax = US$3,276.00, HK$25,716.60 on a card. */
const TAX_CHARGES = hkdChargesOf(SHIPPING_AND_INSURANCE, 327_600, "card");

const USD_SETTLEMENT_CHARGES = [
  { label: "Shipping & Handling", amount: "US$10.01" },
  { key: "subtotal" as const, label: "Subtotal", amount: "US$131.21" },
  {
    key: "paymentProcessingFee" as const,
    label: "Payment Processing Fee",
    amount: "Free",
  },
  { key: "orderTotal" as const, label: "Order Total", amount: "US$131.21" },
] as const;

export const HKD_INVOICE: InvoicePdfData = {
  items: USD_INVOICE_ITEMS,
  itemTotal: USD_INVOICE_ITEM_TOTAL,
  invoiceNumber: "INV-202609-LK7P2Q-01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  paymentMethod: "Bank transfer",
  billTo: BILL_TO,
  shipTo: SHIP_TO,
  lineItems: HKD_BANK_CHARGES.lineItems,
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: INVOICE_COPY,
};

export const SAMPLE_INVOICE = HKD_INVOICE;

/** USD source fixture kept beside the HKD settlement fixture. */
export const USD_INVOICE: InvoicePdfData = {
  ...HKD_INVOICE,
  invoiceNumber: "INV-202609-LK7P2Q-USD",
  paymentMethod: "Bank transfer",
  items: USD_INVOICE_ITEMS,
  itemTotal: USD_INVOICE_ITEM_TOTAL,
  lineItems: USD_SETTLEMENT_CHARGES,
};

/** Every rail enabled, with values a test can find on the page. */
export const ALL_BANK_RAILS: InvoicePdfBankRails = {
  swift: {
    beneficiary: "Grade10 HK Ltd.",
    swiftBic: "GRADE10HKXXX",
    account: "HK0000000000000000000",
  },
  fps: { fpsId: "165123456", beneficiary: "Grade10 HK Ltd." },
  hkLocalTransfer: {
    bankAndCode: "Example Bank (003)",
    beneficiary: "Grade10 HK Ltd.",
    accountNo: "003-456-123456-001",
  },
  reference: "LK7P2Q01",
};

export const BANK_TRANSFER_RAILS: InvoicePdfBankRails = {
  fps: { fpsId: "TBC", beneficiary: "Grade10 HK Ltd." },
  reference: "LK7P2Q01",
};

export const BANK_TRANSFER_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  paymentMethod: "Bank transfer",
  bankRails: BANK_TRANSFER_RAILS,
};

export const REPLACEMENT_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  invoiceNumber: "INV-202609-LK7P2Q-02",
  replacesInvoice: { invoiceId: SAMPLE_INVOICE.invoiceNumber },
};

export const HKD_FREE_SHIPPING_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  lineItems: HKD_FREE_SHIPPING_CHARGES.lineItems,
};

export const WITH_TAX_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  paymentMethod: "Card",
  items: TAX_INVOICE_ITEMS,
  itemTotal: TAX_INVOICE_ITEM_TOTAL,
  lineItems: TAX_CHARGES.lineItems,
  taxLine: { label: "Tax", amount: usd(15_600) },
};

/** The invoice with a Subtotal note too wide for the summary, which wraps under the Subtotal. */
export const WIDE_NOTE_INVOICE: InvoicePdfData = {
  ...HKD_INVOICE,
  lineItems: HKD_INVOICE.lineItems.map((line) =>
    line.key === "subtotal"
      ? {
          ...line,
          note: "Converted from US$1,234,567,890.12 at 1 USD = 7.85 HKD",
        }
      : line,
  ),
};

export const HKD_RECEIPT: ReceiptPdfData = {
  items: HKD_INVOICE.items,
  itemTotal: HKD_INVOICE.itemTotal,
  receiptNumber: "REC-202609-LK7P2Q-01-P1",
  paidAt: HKD_INVOICE.sentAt,
  invoiceId: HKD_INVOICE.invoiceNumber,
  paymentReferenceCode: "LK7P2Q01",
  billTo: BILL_TO,
  shipTo: SHIP_TO,
  lineItems: HKD_BANK_CHARGES.lineItems,
  paymentBreakdown: {
    originalInvoiceTotal: hkd(HKD_BANK_CHARGES.total),
    previousPayments: "HK$0.00",
    currentPaymentReceived: hkd(HKD_BANK_CHARGES.total),
    remainingBalanceDue: "HK$0.00",
  },
  paymentMethod: "Bank transfer",
  paymentReference: null,
  issuerName: HKD_INVOICE.issuerName,
  issuerEmail: HKD_INVOICE.issuerEmail,
  copy: RECEIPT_COPY,
};

export const SAMPLE_RECEIPT = HKD_RECEIPT;

/** A first payment of HK$300.00 against the HK$1,030.00 invoice. */
export const HKD_PART_PAYMENT_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  paymentBreakdown: {
    originalInvoiceTotal: hkd(HKD_BANK_CHARGES.total),
    previousPayments: "HK$0.00",
    currentPaymentReceived: hkd(30_000),
    remainingBalanceDue: hkd(HKD_BANK_CHARGES.total - 30_000),
  },
};

export const WIDE_NOTE_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  lineItems: WIDE_NOTE_INVOICE.lineItems,
};

export const BANK_TRANSFER_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  paymentMethod: "Bank transfer, recorded manually by admin",
  paymentReference: "TRF-LK7P2Q01",
};

export const WITH_TAX_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  paymentMethod: "Visa card ending 4242",
  items: TAX_INVOICE_ITEMS,
  itemTotal: TAX_INVOICE_ITEM_TOTAL,
  lineItems: TAX_CHARGES.lineItems,
  taxLine: { label: "Tax", amount: usd(15_600) },
  paymentBreakdown: {
    originalInvoiceTotal: hkd(TAX_CHARGES.total),
    previousPayments: "HK$0.00",
    currentPaymentReceived: hkd(TAX_CHARGES.total),
    remainingBalanceDue: "HK$0.00",
  },
};

/** The item table, charges and summary a caller would supply for `items`, and the Order Total they come to. */
function orderValueOf(items: readonly PdfItemRow[]): {
  table: Pick<InvoicePdfData, "items" | "itemTotal" | "lineItems">;
  orderTotal: string;
} {
  const itemTotal = itemTotalOf(items);
  const usdCents = SHIPPING_AND_INSURANCE.reduce(
    (cents, charge) => cents + charge.cents,
    centsOf(itemTotal.total),
  );
  const charges = hkdChargesOf(SHIPPING_AND_INSURANCE, usdCents, "card");
  return {
    table: { items, itemTotal, lineItems: charges.lineItems },
    orderTotal: hkd(charges.total),
  };
}

function invoiceFor(items: readonly PdfItemRow[]): InvoicePdfData {
  return {
    ...SAMPLE_INVOICE,
    paymentMethod: "Card",
    ...orderValueOf(items).table,
  };
}

function receiptFor(items: readonly PdfItemRow[]): ReceiptPdfData {
  const { table, orderTotal } = orderValueOf(items);
  return {
    ...SAMPLE_RECEIPT,
    paymentMethod: "Visa card ending 4242",
    ...table,
    paymentBreakdown: {
      originalInvoiceTotal: orderTotal,
      previousPayments: "HK$0.00",
      currentPaymentReceived: orderTotal,
      remainingBalanceDue: "HK$0.00",
    },
  };
}

export const SEVERAL_ITEMS_INVOICE = invoiceFor(sampleItems(3));
export const LONG_TABLE_INVOICE = invoiceFor(sampleItems(30));
export const SEVERAL_ITEMS_RECEIPT = receiptFor(sampleItems(3));
export const LONG_TABLE_RECEIPT = receiptFor(sampleItems(30));
