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

const HKD = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const hkd = (cents: number) => `HKD ${HKD.format(cents / 100)}`;

const centsOf = (amount: string) =>
  Math.round(Number(amount.replace(/[^\d.]/g, "")) * 100);

/** `count` items titled `Lot 01`, `Lot 02`, ..., item n bidding n × HKD 100.00 with a 20% premium. */
export function sampleItems(count: number): PdfItemRow[] {
  const digits = Math.max(2, String(count).length);
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      title: `Lot ${String(n).padStart(digits, "0")}`,
      winningBid: hkd(n * 10_000),
      buyersPremium: hkd(n * 2_000),
      total: hkd(n * 12_000),
    };
  });
}

/** The Item Total a caller would supply for `items`: each column summed. */
export function itemTotalOf(items: readonly PdfItemRow[]): PdfItemTotal {
  const sum = (key: keyof PdfItemTotal) =>
    hkd(items.reduce((cents, item) => cents + centsOf(item[key]), 0));
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

const ITEMS: readonly PdfItemRow[] = [
  {
    title: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
    winningBid: "HKD 2,500.00",
    buyersPremium: "HKD 500.00",
    total: "HKD 3,000.00",
  },
];

const INVOICE_CHARGES = [
  { label: "Shipping & Handling", amount: "HKD 80.00" },
  { label: "Insurance", amount: "HKD 40.00" },
  { key: "subtotal" as const, label: "Subtotal", amount: "HKD 3,120.00" },
  {
    key: "paymentProcessingFee" as const,
    label: "Payment Processing Fee",
    amount: "HKD 112.25",
  },
  {
    key: "orderTotal" as const,
    label: "Order Total",
    amount: "HKD 3,232.25",
  },
] as const;

const RECEIPT_CHARGES = INVOICE_CHARGES.map((item) => ({ ...item }));

export const SAMPLE_INVOICE: InvoicePdfData = {
  items: ITEMS,
  itemTotal: itemTotalOf(ITEMS),
  invoiceNumber: "INV-202609-LK7P2Q-01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  paymentMethod: "Card",
  billTo: BILL_TO,
  shipTo: SHIP_TO,
  lineItems: INVOICE_CHARGES,
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: INVOICE_COPY,
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
  swift: {
    beneficiary: "Grade10 HK Ltd.",
    swiftBic: "TBC",
    account: "TBC",
  },
  fps: { fpsId: "TBC", beneficiary: "Grade10 HK Ltd." },
  reference: "LK7P2Q01",
};

export const BANK_TRANSFER_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  paymentMethod: "Bank transfer",
  lineItems: [
    ...INVOICE_CHARGES.slice(0, 2),
    { key: "subtotal", label: "Subtotal", amount: "HKD 3,120.00" },
    {
      key: "paymentProcessingFee",
      label: "Payment Processing Fee",
      amount: "Free",
    },
    { key: "orderTotal", label: "Order Total", amount: "HKD 3,120.00" },
  ],
  bankRails: BANK_TRANSFER_RAILS,
};

export const REPLACEMENT_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  invoiceNumber: "INV-202609-LK7P2Q-02",
  replacesInvoice: { invoiceId: SAMPLE_INVOICE.invoiceNumber },
};

export const WITH_TAX_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  lineItems: [
    ...INVOICE_CHARGES.slice(0, 2),
    { key: "subtotal", label: "Subtotal", amount: "HKD 3,276.00" },
    {
      key: "paymentProcessingFee",
      label: "Payment Processing Fee",
      amount: "HKD 118.00",
    },
    { key: "orderTotal", label: "Order Total", amount: "HKD 3,394.00" },
  ],
  taxLine: { label: "Tax", amount: "HKD 156.00" },
};

export const SAMPLE_RECEIPT: ReceiptPdfData = {
  items: SAMPLE_INVOICE.items,
  itemTotal: SAMPLE_INVOICE.itemTotal,
  receiptNumber: "REC-202609-LK7P2Q-01-P1",
  paidAt: SAMPLE_INVOICE.sentAt,
  invoiceId: SAMPLE_INVOICE.invoiceNumber,
  paymentReferenceCode: "LK7P2Q01",
  billTo: BILL_TO,
  shipTo: SHIP_TO,
  lineItems: RECEIPT_CHARGES,
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 3,232.25",
    previousPayments: "HKD 0.00",
    currentPaymentReceived: "HKD 3,232.25",
    remainingBalanceDue: "HKD 0.00",
  },
  paymentMethod: "Visa card ending 4242",
  paymentReference: null,
  issuerName: SAMPLE_INVOICE.issuerName,
  issuerEmail: SAMPLE_INVOICE.issuerEmail,
  copy: RECEIPT_COPY,
};

export const BANK_TRANSFER_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  paymentMethod: "Bank transfer, recorded manually by admin",
  paymentReference: "TRF-LK7P2Q01",
};

export const WITH_TAX_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  lineItems: [
    ...INVOICE_CHARGES.slice(0, 2),
    { key: "subtotal", label: "Subtotal", amount: "HKD 3,276.00" },
    {
      key: "paymentProcessingFee",
      label: "Payment Processing Fee",
      amount: "HKD 118.00",
    },
    { key: "orderTotal", label: "Order Total", amount: "HKD 3,394.00" },
  ],
  taxLine: { label: "Tax", amount: "HKD 156.00" },
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 3,394.00",
    previousPayments: "HKD 0.00",
    currentPaymentReceived: "HKD 3,394.00",
    remainingBalanceDue: "HKD 0.00",
  },
};

/** The item table, charges and summary a caller would supply for `items`, and the Order Total they come to. */
function orderValueOf(items: readonly PdfItemRow[]): {
  table: Pick<InvoicePdfData, "items" | "itemTotal" | "lineItems">;
  orderTotal: string;
} {
  const itemTotal = itemTotalOf(items);
  const charges = INVOICE_CHARGES.slice(0, 2);
  const subtotal = charges.reduce(
    (cents, charge) => cents + centsOf(charge.amount),
    centsOf(itemTotal.total),
  );
  const fee = Math.round(subtotal * 0.036);
  const orderTotal = hkd(subtotal + fee);
  return {
    table: {
      items,
      itemTotal,
      lineItems: [
        ...charges,
        { key: "subtotal", label: "Subtotal", amount: hkd(subtotal) },
        {
          key: "paymentProcessingFee",
          label: "Payment Processing Fee",
          amount: hkd(fee),
        },
        { key: "orderTotal", label: "Order Total", amount: orderTotal },
      ],
    },
    orderTotal,
  };
}

function invoiceFor(items: readonly PdfItemRow[]): InvoicePdfData {
  return { ...SAMPLE_INVOICE, ...orderValueOf(items).table };
}

function receiptFor(items: readonly PdfItemRow[]): ReceiptPdfData {
  const { table, orderTotal } = orderValueOf(items);
  return {
    ...SAMPLE_RECEIPT,
    ...table,
    paymentBreakdown: {
      originalInvoiceTotal: orderTotal,
      previousPayments: "HKD 0.00",
      currentPaymentReceived: orderTotal,
      remainingBalanceDue: "HKD 0.00",
    },
  };
}

export const SEVERAL_ITEMS_INVOICE = invoiceFor(sampleItems(3));
export const LONG_TABLE_INVOICE = invoiceFor(sampleItems(30));
export const SEVERAL_ITEMS_RECEIPT = receiptFor(sampleItems(3));
export const LONG_TABLE_RECEIPT = receiptFor(sampleItems(30));
