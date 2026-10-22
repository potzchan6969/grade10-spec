import { getMessages } from "@grade10/i18n";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import {
  ALL_BANK_RAILS,
  HKD_FREE_SHIPPING_INVOICE,
  SAMPLE_INVOICE,
  TABLE_LABELS,
  USD_INVOICE,
  WITH_TAX_INVOICE,
} from "./fixtures";
import type { InvoicePdfBankRails } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import {
  A4_WIDTH,
  LINE_HEIGHT,
  MARGIN,
  RIGHT_EDGE,
  SUMMARY_LEFT,
} from "./pdf-document";
import type { DrawnText } from "./pdf-test-helpers";
import {
  drawnContent,
  drawnHorizontalLines,
  drawnRectangles,
  drawnRow,
  drawnStrings,
  drawnText,
  textRight,
} from "./pdf-test-helpers";

const { auctionInvoicePdf } = getMessages("grade10", "en");

const COPY = {
  ...auctionInvoicePdf.document,
  ...auctionInvoicePdf.invoice,
  ...TABLE_LABELS,
  replacesInvoiceLabel: "Remplace la facture",
} as const;

const BANK_RAILS = ALL_BANK_RAILS;

const ENABLED_BANK_RAILS = {
  swift: BANK_RAILS.swift,
  fps: BANK_RAILS.fps,
  reference: BANK_RAILS.reference,
};

const HK_LOCAL_RAIL_WITHOUT_BENEFICIARY: InvoicePdfBankRails = {
  hkLocalTransfer: {
    bankAndCode: "Example Bank (003)",
    accountNo: "test-account",
  },
  reference: "TEST-REFERENCE",
};

const HK_LOCAL_RAIL_WITH_BENEFICIARY: InvoicePdfBankRails = {
  hkLocalTransfer: {
    bankAndCode: "Example Bank (003)",
    beneficiary: "Test account holder",
    accountNo: "test-account",
  },
  reference: "TEST-REFERENCE",
};

const HK_LOCAL_RAIL_WITH_EMPTY_BENEFICIARY: InvoicePdfBankRails = {
  hkLocalTransfer: {
    bankAndCode: "Example Bank (003)",
    beneficiary: "",
    accountNo: "test-account",
  },
  reference: "TEST-REFERENCE",
};

const ADDRESS = {
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

const COMPLETE_ADDRESS = { ...ADDRESS, region: "Kowloon" } as const;

const LOT_A = {
  title: "Lot A",
  winningBid: "HKD 100.00",
  buyersPremium: "HKD 20.00",
  total: "HKD 120.00",
} as const;

const DATA = {
  items: [LOT_A],
  itemTotal: {
    winningBid: LOT_A.winningBid,
    buyersPremium: LOT_A.buyersPremium,
    total: LOT_A.total,
  },
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  paymentMethod: "Card",
  billTo: ADDRESS,
  shipTo: null,
  lineItems: [
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { key: "orderTotal", label: "Order Total", amount: "HKD 200.00" },
  ],
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: COPY,
} as const;

const SUMMARY = [
  { key: "subtotal" as const, label: "Subtotal", amount: "HKD 240.00" },
  {
    key: "paymentProcessingFee" as const,
    label: "Payment Processing Fee",
    amount: "HKD 5.00",
  },
  { key: "orderTotal" as const, label: "Order Total", amount: "HKD 245.00" },
];

const SHIPPING = { label: "Shipping & Handling", amount: "HKD 80.00" };
const INSURANCE = { label: "Insurance", amount: "HKD 40.00" };

const SUMMARY_LINE_ITEMS = [SHIPPING, ...SUMMARY];

const HKD_INVOICE_AMOUNTS = [
  "US$101.00",
  "US$20.20",
  "US$121.20",
  "US$10.01",
  "HK$1,030.00",
] as const;

async function amountBeside(rows: DrawnText[], label: string, amount: string) {
  const labelRow = drawnRow(rows, label);
  return rows.some(
    (row) => row.text === amount && Math.abs(row.y - labelRow.y) < 0.01,
  );
}

const HKD_FPS_RAIL = {
  label: "FPS",
  details: ["165123456", "Grade10 HK Ltd."],
  reference: "LK7P2Q01",
} as const;

const HKD_FPS_BANK_RAILS = {
  fps: { fpsId: HKD_FPS_RAIL.details[0], beneficiary: HKD_FPS_RAIL.details[1] },
  reference: HKD_FPS_RAIL.reference,
} as const;

/** The lines drawn in the Item column from `top` (inclusive) down to `bottom` (exclusive). */
function titleLines(rows: DrawnText[], top: number, bottom: number) {
  return rows.filter(
    (row) => Math.abs(row.x - MARGIN) < 0.01 && row.y <= top && row.y > bottom,
  );
}

describe("invoice PDF renderer", () => {
  it("keeps the tax invoice fixture in USD lines with a converted HKD summary", async () => {
    const strings = await drawnStrings(await InvoicePdf(WITH_TAX_INVOICE));
    const amounts = new Map(
      WITH_TAX_INVOICE.lineItems.map((item) => [item.label, item.amount]),
    );

    expect(WITH_TAX_INVOICE.itemTotal).toEqual({
      winningBid: "US$2,500.00",
      buyersPremium: "US$500.00",
      total: "US$3,000.00",
    });
    expect(amounts.get("Shipping & Handling")).toBe("US$80.00");
    expect(amounts.get("Insurance")).toBe("US$40.00");
    expect(WITH_TAX_INVOICE.taxLine).toEqual({
      label: "Tax",
      amount: "US$156.00",
    });
    expect(amounts.get("Subtotal")).toBe("HK$25,716.60");
    expect(amounts.get("Payment Processing Fee")).toBe("HK$907.58");
    expect(amounts.get("Order Total")).toBe("HK$26,624.18");
    expect(3_000 + 80 + 40 + 156).toBe(3_276);
    expect(Math.ceil(327_600 * 7.85)).toBe(2_571_660);
    expect(2_571_660 + 90_758).toBe(2_662_418);
    for (const amount of [
      "US$2,500.00",
      "US$500.00",
      "US$3,000.00",
      "US$80.00",
      "US$40.00",
      "US$156.00",
      "HK$25,716.60",
      "HK$907.58",
      "HK$26,624.18",
    ]) {
      expect(strings).toContain(amount);
    }
  });

  // g10.auction-winner-order.SC3
  it("draws the USD lot row and Shipping & Handling, then the HKD Subtotal, fee and Order Total", async () => {
    const bytes = await InvoicePdf(SAMPLE_INVOICE);
    const strings = await drawnStrings(bytes);
    const rows = await drawnText(bytes);

    expect(10_100 + 2_020).toBe(12_120);
    expect(Math.ceil(13_121 * 7.85)).toBe(103_000);
    for (const amount of HKD_INVOICE_AMOUNTS) expect(strings).toContain(amount);
    for (const [label, amount] of [
      ["Shipping & Handling", "US$10.01"],
      ["Subtotal", "HK$1,030.00"],
      ["Payment Processing Fee", "Free"],
      ["Order Total", "HK$1,030.00"],
    ] as const) {
      expect(await amountBeside(rows, label, amount)).toBe(true);
    }
    const text = strings.join(" ");
    expect(text).not.toContain("7.85");
    expect(text).not.toMatch(/Converted|\bUSD\b|\bHKD\b|1,031/);
  });

  // g10.auction-winner-order.SC3
  it("draws every amount as US$ or HK$ with a symbol and nothing bare", async () => {
    const strings = await drawnStrings(await InvoicePdf(SAMPLE_INVOICE));

    const amounts = strings.filter((value) =>
      /^(?:US\$|HK\$|\d)[\d,]*\.\d{2}$/.test(value),
    );
    expect(new Set(amounts)).toEqual(new Set(HKD_INVOICE_AMOUNTS));
    expect(strings.filter((value) => /^\d[\d,]*\.\d{2}$/.test(value))).toEqual(
      [],
    );
  });

  // g10.auction-winner-order.SC6
  it("reads Free for a free charge, with no Insurance or Tax line, and the Subtotal still shows", async () => {
    const bytes = await InvoicePdf(HKD_FREE_SHIPPING_INVOICE);
    const strings = await drawnStrings(bytes);
    const rows = await drawnText(bytes);

    expect(Math.ceil(12_120 * 7.85)).toBe(95_142);
    for (const [label, amount] of [
      ["Shipping & Handling", "Free"],
      ["Subtotal", "HK$951.42"],
      ["Payment Processing Fee", "Free"],
      ["Order Total", "HK$951.42"],
    ] as const) {
      expect(await amountBeside(rows, label, amount)).toBe(true);
    }
    expect(strings).not.toContain("Insurance");
    expect(strings).not.toContain("Tax");
  });

  // g10.auction-winner-order.SC7
  it("keeps a USD invoice in USD with no HKD amount", async () => {
    const bytes = await InvoicePdf(USD_INVOICE);
    const strings = await drawnStrings(bytes);
    const rows = await drawnText(bytes);

    for (const [label, amount] of [
      ["Shipping & Handling", "US$10.01"],
      ["Subtotal", "US$131.21"],
      ["Order Total", "US$131.21"],
    ] as const) {
      expect(await amountBeside(rows, label, amount)).toBe(true);
    }
    expect(strings.join(" ")).not.toContain("HK$");
  });

  // winner-order-SC-288, winner-order-SC-299
  it("renders only the selected settlement rail and its details on the HKD invoice", async () => {
    const strings = await drawnStrings(
      await InvoicePdf({ ...SAMPLE_INVOICE, bankRails: HKD_FPS_BANK_RAILS }),
    );
    const text = strings.join(" ");

    expect(strings).toContain(HKD_FPS_RAIL.label);
    for (const detail of HKD_FPS_RAIL.details) expect(text).toContain(detail);
    expect(text).toContain(HKD_FPS_RAIL.reference);
    expect(text).not.toContain("SWIFT");
    expect(text).not.toContain("GRADE10HKXXX");
    expect(text).not.toContain("HK local transfer");
    expect(text).not.toContain("Example Bank (003)");
  });

  // shared-ui-invoice-and-receipt-pdf-SC-67
  it("renders an invoice that fits as exactly one A4 page", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      billTo: {
        recipient: "Alexandra Tran",
        line1: "Flat A, 21/F, One Harbour Square",
        city: "North Point",
        countryCode: "Hong Kong SAR",
      },
      shipTo: {
        recipient: "Alexandra Tran",
        line1: "Flat A, 21/F, One Harbour Square",
        city: "North Point",
        countryCode: "Hong Kong SAR",
      },
      lineItems: [SHIPPING, INSURANCE, ...SUMMARY],
      bankRails: BANK_RAILS,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getSize()).toEqual({ width: 595.28, height: 841.89 });
    expect((await drawnStrings(bytes)).join(" ")).toContain(DATA.invoiceNumber);
  });

  it("renders 'Not recorded' when Bill To or Ship To is withheld entirely", async () => {
    const bytes = await InvoicePdf({ ...DATA, billTo: null, shipTo: null });
    expect(
      (await drawnStrings(bytes)).filter((line) => line === "Not recorded"),
    ).toHaveLength(2);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-17
  it("draws every label from the copy argument, not a hardcoded string", async () => {
    const arbitraryCopy = {
      documentTitle: "Facture",
      billToHeading: "Facturer à",
      shipToHeading: "Expédier à",
      itemLabel: "Article",
      winningBidLabel: "Enchère gagnante",
      buyersPremiumLabel: "Prime de l'acheteur",
      totalLabel: "Montant",
      itemTotalLabel: "Total des articles",
      invoiceNumberLabel: "Numéro de facture",
      sentAtLabel: "Date d'émission",
      paymentDeadlineLabel: "Date d'échéance",
      paymentMethodLabel: "Mode de paiement",
      replacesInvoiceLabel: "Remplace la facture",
      bankDetailsHeading: "Coordonnées bancaires",
      swiftLabel: "SWIFT",
      fpsLabel: "FPS",
      hkLocalTransferLabel: "Virement local HK",
      beneficiaryLabel: "Bénéficiaire",
      swiftBicLabel: "SWIFT/BIC",
      accountIbanLabel: "Compte/IBAN",
      fpsIdLabel: "ID FPS",
      bankAndCodeLabel: "Banque et code",
      accountNoLabel: "Numéro de compte",
      bankReferenceNoteLabel:
        "Indiquez cette référence dans le champ mémo de votre virement.",
    };
    const strings = await drawnStrings(
      await InvoicePdf({ ...DATA, copy: arbitraryCopy }),
    );
    for (const label of [
      "Facture",
      "Article",
      "Enchère gagnante",
      "Prime de l'acheteur",
      "Montant",
      "Total des articles",
    ]) {
      expect(strings).toContain(label);
    }
    for (const english of Object.values(TABLE_LABELS)) {
      expect(strings).not.toContain(english);
    }
  });

  // shared-ui-invoice-and-receipt-pdf-SC-47, shared-ui-invoice-and-receipt-pdf-SC-49,
  // shared-ui-invoice-and-receipt-pdf-US1-TC3-1, shared-ui-invoice-and-receipt-pdf-US1-TC47-1
  it("renders the Bank details section when bankRails is given", async () => {
    const bytes = await InvoicePdf({ ...DATA, bankRails: BANK_RAILS });
    const strings = await drawnStrings(bytes);
    expect(strings.join(" ")).toContain("HK local transfer");
    expect(strings.join(" ")).toContain(BANK_RAILS.reference);
    expect(await drawnContent(bytes)).toMatch(/Tf/);
  });

  it("renders HK Local details when the accepted rail has no beneficiary", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      paymentMethod: "Bank transfer",
      bankRails: HK_LOCAL_RAIL_WITHOUT_BENEFICIARY,
    });
    const strings = await drawnStrings(bytes);
    const text = strings.join(" ");

    expect(text).toContain(COPY.bankDetailsHeading);
    expect(text).toContain(COPY.hkLocalTransferLabel);
    expect(text).toContain(`${COPY.bankAndCodeLabel}: Example Bank (003)`);
    expect(text).toContain(`${COPY.accountNoLabel}: test-account`);
    expect(text).toContain("TEST-REFERENCE");
    expect(text).not.toContain(`${COPY.beneficiaryLabel}:`);
    expect(text).not.toContain(COPY.swiftLabel);
    expect(text).not.toContain(COPY.fpsLabel);
  });

  it("keeps a supplied HK Local beneficiary row, including an empty value", async () => {
    const rows = await drawnText(
      await InvoicePdf({
        ...DATA,
        paymentMethod: "Bank transfer",
        bankRails: HK_LOCAL_RAIL_WITH_BENEFICIARY,
      }),
    );
    const bankRow = drawnRow(
      rows,
      `${COPY.bankAndCodeLabel}: Example Bank (003)`,
    );
    const beneficiaryRow = drawnRow(
      rows,
      `${COPY.beneficiaryLabel}: Test account holder`,
    );
    const accountRow = drawnRow(rows, `${COPY.accountNoLabel}: test-account`);
    expect(bankRow.y).toBeGreaterThan(beneficiaryRow.y);
    expect(beneficiaryRow.y).toBeGreaterThan(accountRow.y);

    const emptyRows = await drawnText(
      await InvoicePdf({
        ...DATA,
        paymentMethod: "Bank transfer",
        bankRails: HK_LOCAL_RAIL_WITH_EMPTY_BENEFICIARY,
      }),
    );
    expect(
      emptyRows.some((row) => row.text.startsWith(`${COPY.beneficiaryLabel}:`)),
    ).toBe(true);
    expect(emptyRows.map((row) => row.text)).toContain(
      `${COPY.accountNoLabel}: test-account`,
    );
  });

  // shared-ui-invoice-and-receipt-pdf-SC-48, shared-ui-invoice-and-receipt-pdf-US1-TC2-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC46-1
  it("renders no Bank details section when bankRails is omitted", async () => {
    const withRails = await InvoicePdf({ ...DATA, bankRails: BANK_RAILS });
    const withoutRails = await InvoicePdf(DATA);
    const pdf = await PDFDocument.load(withoutRails);
    expect(pdf.getPageCount()).toBe(1);
    expect(withoutRails.byteLength).toBeLessThan(withRails.byteLength);

    const strings = await drawnStrings(withoutRails);
    expect(strings).not.toContain("Bank details");
    expect(strings).not.toContain("SWIFT");
    expect(strings).not.toContain("FPS");
    expect(strings).not.toContain(BANK_RAILS.reference);
    const rows = await drawnText(withoutRails);
    const totalIndex = rows.findIndex((row) => row.text === "Order Total");
    const issuerIndex = rows.findIndex((row) => row.text === "Grade10");
    expect(totalIndex).toBeGreaterThanOrEqual(0);
    expect(issuerIndex).toBeGreaterThan(totalIndex);
    expect(rows[issuerIndex]?.y).toBeCloseTo(MARGIN + LINE_HEIGHT);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-49, shared-ui-invoice-and-receipt-pdf-SC-50,
  // shared-ui-invoice-and-receipt-pdf-US1-TC47-1, shared-ui-invoice-and-receipt-pdf-US1-TC48-1
  it("renders only enabled bank rails and bolds the reference text", async () => {
    const bytes = await InvoicePdf({ ...DATA, bankRails: ENABLED_BANK_RAILS });
    const strings = await drawnStrings(bytes);
    const text = strings.join(" ");
    expect(text).toContain("SWIFT");
    expect(text).toContain("FPS");
    expect(text).not.toContain("HK local transfer");
    expect(text).toContain(BANK_RAILS.reference);
    const content = await drawnContent(bytes);
    const referenceHex = Buffer.from(BANK_RAILS.reference, "latin1")
      .toString("hex")
      .toUpperCase();
    const referenceOffset = content.indexOf(`<${referenceHex}> Tj`);
    expect(referenceOffset).toBeGreaterThan(0);
    expect(
      content.slice(Math.max(0, referenceOffset - 120), referenceOffset),
    ).toMatch(/\/Helvetica-Bold-\d+\s+9\s+Tf/);
    const rows = await drawnText(bytes);
    const swiftHeading = drawnRow(rows, "SWIFT");
    const fpsHeading = drawnRow(rows, "FPS");
    const bankHeading = drawnRow(rows, "Bank details");
    expect(bankHeading.y).toBeGreaterThan(swiftHeading.y);
    expect(swiftHeading.y).toBeCloseTo(fpsHeading.y);
    expect(fpsHeading.x).toBeCloseTo(MARGIN + (A4_WIDTH - MARGIN * 2) / 2);
    expect(rows.some((row) => row.text.includes("GRADE10HKXXX"))).toBe(true);
    expect(rows.some((row) => row.text.includes("HK0000000000000000000"))).toBe(
      true,
    );
    expect(rows.some((row) => row.text.includes("165123456"))).toBe(true);
    expect(
      rows.filter((row) => row.text.includes("Grade10 HK Ltd.")).length,
    ).toBe(2);
    const note = rows.find((row) => row.text.startsWith("Enter"));
    const reference = drawnRow(rows, BANK_RAILS.reference);
    expect(note?.font).toMatch(/Helvetica-(?!Bold)/);
    expect(reference.font).toMatch(/Helvetica-Bold/);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-50, shared-ui-invoice-and-receipt-pdf-US1-TC48-1
  it("wraps the complete bank note before its bold reference", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      copy: {
        ...COPY,
        bankReferenceNoteLabel:
          "Please include this transfer note in your bank app Memo or Remarks field before submitting the payment for manual verification and settlement through the specified receiving account before the payment is matched",
      },
      bankRails: {
        ...ENABLED_BANK_RAILS,
        reference: "LONG-REFERENCE-12345678901234567890",
      },
    });
    const rows = await drawnText(bytes);
    const note = rows.find((row) => row.text.startsWith("Please"));
    const reference = rows.find((row) =>
      row.text.includes("LONG-REFERENCE-12345678901234567890"),
    );
    expect(note).toBeDefined();
    expect(reference).toBeDefined();
    expect(reference?.x).toBeCloseTo(MARGIN);
    expect(reference?.y).toBeLessThan(note?.y ?? A4_WIDTH);
    expect(note?.font).toMatch(/Helvetica-(?!Bold)/);
    expect(reference?.font).toMatch(/Helvetica-Bold/);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-56
  it("draws one item as one row under the column header, closed by its Item Total", async () => {
    const title = "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10";
    const bytes = await InvoicePdf({
      ...DATA,
      items: [
        {
          title,
          winningBid: "HKD 2500.00",
          buyersPremium: "HKD 500.00",
          total: "HKD 3000.00",
        },
      ],
      itemTotal: {
        winningBid: "HKD 2500.00",
        buyersPremium: "HKD 500.00",
        total: "HKD 3000.00",
      },
    });
    const rows = await drawnText(bytes);
    const rightOf = await textRight();
    const header = ["Item", "Winning Bid", "Buyer's Premium", "Total"].map(
      (label) => drawnRow(rows, label),
    );
    for (const [index, label] of header.entries()) {
      expect(label.y).toBeCloseTo(header[0].y);
      if (index > 0) expect(label.x).toBeGreaterThan(header[index - 1].x);
    }
    expect(header[0].x).toBeCloseTo(MARGIN);
    const divider = (await drawnHorizontalLines(bytes)).find(
      (rule) =>
        rule.y < header[0].y &&
        rule.y > header[0].y - LINE_HEIGHT &&
        Math.abs(rule.x1 - MARGIN) < 0.01 &&
        Math.abs(rule.x2 - RIGHT_EDGE) < 0.01,
    );
    expect(divider).toBeDefined();

    const itemTotal = drawnRow(rows, "Item Total");
    const lines = titleLines(rows, divider?.y ?? 0, itemTotal.y);
    expect(lines.map((line) => line.text).join(" ")).toBe(title);
    const titleRow = lines[0] as DrawnText;
    for (const [column, amount] of [
      [1, "HKD 2500.00"],
      [2, "HKD 500.00"],
      [3, "HKD 3000.00"],
    ] as const) {
      const drawn = rows.filter((row) => row.text === amount);
      expect(drawn.map((row) => row.y)).toEqual([titleRow.y, itemTotal.y]);
      for (const row of drawn) {
        expect(rightOf(row)).toBeCloseTo(rightOf(header[column]));
      }
    }
    for (const line of lines) expect(line.font).not.toMatch(/Bold/);
    const aboveHeader = rows
      .filter((row) => row.y > header[0].y)
      .map((row) => row.text);
    expect(aboveHeader).not.toContain(title);
    for (const line of lines) expect(aboveHeader).not.toContain(line.text);
    const strings = rows.map((row) => row.text);
    expect(strings).not.toContain("Description");
    expect(strings).not.toContain("Amount");
  });

  // shared-ui-invoice-and-receipt-pdf-SC-58
  it("wraps a long item title inside the Item column, its amounts on the first line", async () => {
    const long =
      "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10 BLACK LABEL AUTOGRAPHED SERIAL NUMBERED TO TEN";
    const lotB = { ...LOT_A, title: "Lot B" };
    const bytes = await InvoicePdf({
      ...DATA,
      items: [{ ...LOT_A, title: long }, lotB],
    });
    const rows = await drawnText(bytes);
    const rightOf = await textRight();
    const header = drawnRow(rows, "Item");
    const lotBRow = drawnRow(rows, "Lot B");
    const lines = titleLines(rows, header.y - 1, lotBRow.y);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.map((line) => line.text).join(" ")).toBe(long);
    const winningBidLeft = Math.min(
      ...rows
        .filter(
          (row) =>
            row.text === "Winning Bid" ||
            (row.text === LOT_A.winningBid && row.y > lotBRow.y),
        )
        .map((row) => row.x),
    );
    for (const line of lines)
      expect(rightOf(line)).toBeLessThan(winningBidLeft);
    const firstLine = lines[0] as DrawnText;
    for (const amount of [LOT_A.winningBid, LOT_A.buyersPremium, LOT_A.total]) {
      const drawn = rows.filter(
        (row) => row.text === amount && row.y > lotBRow.y,
      );
      expect(drawn.map((row) => row.y)).toEqual([firstLine.y]);
    }
    expect(lotBRow.y).toBeLessThan(lines[lines.length - 1]?.y ?? 0);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-59
  it("breaks a word wider than the Item column inside the word", async () => {
    const unspaced =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const serial = `Serial ${unspaced} PSA-10`;
    const bytes = await InvoicePdf({
      ...DATA,
      items: [
        { ...LOT_A, title: unspaced },
        { ...LOT_A, title: serial },
      ],
    });
    const rows = await drawnText(bytes);
    const rightOf = await textRight();
    const header = drawnRow(rows, "Item");
    const itemTotal = drawnRow(rows, "Item Total");
    const winningBids = rows.filter((row) => row.text === LOT_A.winningBid);
    const [firstRow, secondRow] = winningBids;
    const winningBidLeft = Math.min(
      drawnRow(rows, "Winning Bid").x,
      ...winningBids.map((row) => row.x),
    );
    const first = titleLines(rows, header.y - 1, secondRow?.y ?? 0);
    const second = titleLines(rows, secondRow?.y ?? 0, itemTotal.y);
    for (const lines of [first, second]) {
      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) {
        expect(rightOf(line)).toBeLessThan(winningBidLeft);
      }
    }
    expect(first.map((line) => line.text).join("")).toBe(unspaced);
    expect(first[0]?.y).toBeCloseTo(firstRow?.y ?? 0);
    expect(second[0]?.y).toBeCloseTo(secondRow?.y ?? 0);
    expect(second[0]?.text.startsWith("Serial")).toBe(true);
    expect(second[second.length - 1]?.text.endsWith("PSA-10")).toBe(true);
    expect(
      rows.filter((row) => row.text === LOT_A.total && row.y > itemTotal.y),
    ).toHaveLength(2);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-27
  it("still draws a whitespace Subtotal and a blank-titled item's row", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      items: [{ ...LOT_A, title: "" }],
      lineItems: [
        SHIPPING,
        { key: "subtotal", label: "Subtotal", amount: "   " },
        { key: "orderTotal", label: "Order Total", amount: "HKD 200.00" },
      ],
    });
    const rows = await drawnText(bytes);
    drawnRow(rows, "Subtotal");
    const itemTotal = drawnRow(rows, "Item Total");
    const header = drawnRow(rows, "Item");
    for (const amount of [LOT_A.winningBid, LOT_A.buyersPremium, LOT_A.total]) {
      const drawn = rows.filter((row) => row.text === amount);
      expect(drawn).toHaveLength(2);
      expect(drawn[0]?.y).toBeLessThan(header.y);
      expect(drawn[0]?.y).toBeGreaterThan(itemTotal.y);
    }
    const rowY = rows.find((row) => row.text === LOT_A.winningBid)?.y;
    expect(
      rows.filter(
        (row) =>
          Math.abs(row.x - MARGIN) < 0.01 &&
          Math.abs(row.y - (rowY ?? 0)) < 0.01 &&
          row.text.trim() !== "",
      ),
    ).toEqual([]);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-3, shared-ui-invoice-and-receipt-pdf-SC-4
  it.each([
    [
      "every charge",
      [SHIPPING, INSURANCE],
      ["Shipping & Handling", "Insurance"],
    ],
    ["Insurance omitted", [SHIPPING], ["Shipping & Handling"]],
  ])(
    "draws the charges below the Item Total row in the order given, then the summary (%s)",
    async (_case, charges, expected) => {
      const bytes = await InvoicePdf({
        ...DATA,
        lineItems: [...charges, ...SUMMARY],
      });
      const rows = await drawnText(bytes);
      const itemTotal = drawnRow(rows, "Item Total");
      const drawnCharges = rows.filter(
        (row) => row.text === "Shipping & Handling" || row.text === "Insurance",
      );
      expect(drawnCharges.map((row) => row.text)).toEqual(expected);
      for (const charge of drawnCharges) {
        expect(charge.y).toBeLessThan(itemTotal.y);
      }
      const subtotal = drawnRow(rows, "Subtotal");
      const fee = drawnRow(rows, "Payment Processing Fee");
      const total = drawnRow(rows, "Order Total");
      const lastCharge = drawnCharges[drawnCharges.length - 1] as DrawnText;
      expect(subtotal.y).toBeLessThan(lastCharge.y);
      expect(fee.y).toBeLessThan(subtotal.y);
      expect(total.y).toBeLessThan(fee.y);
      for (const row of [subtotal, fee, total]) {
        expect(row.x).toBeCloseTo(SUMMARY_LEFT, 2);
      }
      expect(
        (await drawnHorizontalLines(bytes)).some(
          (rule) =>
            Math.abs(rule.x1 - SUMMARY_LEFT) < 0.01 &&
            rule.y < fee.y &&
            rule.y > total.y,
        ),
      ).toBe(true);
    },
  );

  // shared-ui-invoice-and-receipt-pdf-SC-3
  it("draws the summary without a border", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      lineItems: [SHIPPING, INSURANCE, ...SUMMARY],
    });
    expect(await drawnRectangles(bytes)).toEqual([]);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-16
  it("draws Order Total exactly as given, not the sum of Subtotal and the fee", async () => {
    const strings = await drawnStrings(
      await InvoicePdf({
        ...DATA,
        lineItems: [
          { key: "subtotal", label: "Subtotal", amount: "HKD 100.00" },
          {
            key: "paymentProcessingFee",
            label: "Payment Processing Fee",
            amount: "HKD 5.00",
          },
          { key: "orderTotal", label: "Order Total", amount: "HKD 999.00" },
        ],
      }),
    );
    expect(strings).toContain("HKD 999.00");
    expect(strings).not.toContain("HKD 105.00");
  });

  // shared-ui-invoice-and-receipt-pdf-SC-51, shared-ui-invoice-and-receipt-pdf-US1-TC6-1
  it("renders a replacement row with a distinct prior invoice ID only when supplied", async () => {
    const replacement = await InvoicePdf({
      ...DATA,
      replacesInvoice: { invoiceId: "IN-PRIOR-001" },
    });
    const replacementText = (await drawnStrings(replacement)).join(" ");
    expect(replacementText).toContain("Remplace la facture");
    expect(replacementText).toContain("IN-PRIOR-001");
    expect(replacementText).toContain(DATA.invoiceNumber);

    const current = await InvoicePdf({ ...DATA, replacesInvoice: null });
    expect((await drawnStrings(current)).join(" ")).not.toContain(
      "Remplace la facture",
    );
  });

  // shared-ui-invoice-and-receipt-pdf-SC-31, shared-ui-invoice-and-receipt-pdf-SC-32,
  // shared-ui-invoice-and-receipt-pdf-US1-TC27-1, shared-ui-invoice-and-receipt-pdf-US1-TC28-1
  it("renders optional address fields without reserved blank rows", async () => {
    const withPhone = await InvoicePdf(DATA);
    expect((await drawnStrings(withPhone)).join(" ")).toContain(ADDRESS.phone);

    const withoutPhone = await InvoicePdf({
      ...DATA,
      billTo: { ...ADDRESS, phone: null },
    });
    expect((await drawnStrings(withoutPhone)).join(" ")).not.toContain(
      ADDRESS.phone,
    );
    const withPhoneRows = await drawnText(withPhone);
    const withoutPhoneRows = await drawnText(withoutPhone);
    expect(
      drawnRow(withoutPhoneRows, "North Point, 999077").y -
        drawnRow(withPhoneRows, "North Point, 999077").y,
    ).toBeCloseTo(LINE_HEIGHT);
    expect(
      drawnRow(withoutPhoneRows, "Hong Kong SAR").y -
        drawnRow(withPhoneRows, "Hong Kong SAR").y,
    ).toBeCloseTo(LINE_HEIGHT);

    const personal = await InvoicePdf({
      ...DATA,
      billTo: {
        ...ADDRESS,
        company: null,
        phone: null,
        line2: null,
        region: null,
      },
    });
    const personalText = await drawnStrings(personal);
    expect(personalText).toContain(ADDRESS.recipient);
    expect(personalText).toContain(ADDRESS.line1);
    expect(personalText).toContain("North Point, 999077");
    expect(personalText).toContain(ADDRESS.countryCode);
    expect(personalText).not.toContain(ADDRESS.company);
    expect(personalText).not.toContain(ADDRESS.phone);
    expect(personalText).not.toContain(ADDRESS.line2);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-31, shared-ui-invoice-and-receipt-pdf-US1-TC27-1
  it("renders every supplied company address field", async () => {
    const bytes = await InvoicePdf({ ...DATA, billTo: COMPLETE_ADDRESS });
    const strings = await drawnStrings(bytes);
    expect(strings).toContain(COMPLETE_ADDRESS.recipient);
    expect(strings).toContain(COMPLETE_ADDRESS.company);
    expect(strings).toContain(COMPLETE_ADDRESS.phone);
    expect(strings).toContain(COMPLETE_ADDRESS.line1);
    expect(strings).toContain(COMPLETE_ADDRESS.line2);
    expect(strings).toContain("North Point, Kowloon, 999077");
    expect(strings).toContain(COMPLETE_ADDRESS.countryCode);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-52, shared-ui-invoice-and-receipt-pdf-SC-53,
  // shared-ui-invoice-and-receipt-pdf-US1-TC16-1, shared-ui-invoice-and-receipt-pdf-US1-TC17-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC18-1, shared-ui-invoice-and-receipt-pdf-US1-TC21-1
  it("renders a supplied tax line and compacts null or omitted tax", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: { label: "Tax", amount: "HKD 12.00" },
    });
    const strings = await drawnStrings(bytes);
    expect(strings.indexOf("Tax")).toBeGreaterThan(
      strings.indexOf("Shipping & Handling"),
    );
    expect(strings.indexOf("Tax")).toBeLessThan(strings.indexOf("Subtotal"));
    expect(strings.join(" ")).toContain("HKD 12.00");

    const withoutTax = await InvoicePdf({
      ...DATA,
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: null,
    });
    const omittedTax = await InvoicePdf({
      ...DATA,
      lineItems: SUMMARY_LINE_ITEMS,
    });
    expect((await drawnStrings(withoutTax)).join(" ")).not.toContain("Tax");
    expect((await drawnStrings(omittedTax)).join(" ")).not.toContain("Tax");
    const nullRows = await drawnText(withoutTax);
    const omittedRows = await drawnText(omittedTax);
    expect(drawnRow(nullRows, "Subtotal").y).toBeCloseTo(
      drawnRow(omittedRows, "Subtotal").y,
    );
    expect(drawnRow(nullRows, "Payment Processing Fee").y).toBeCloseTo(
      drawnRow(omittedRows, "Payment Processing Fee").y,
    );
  });
});

const NOTE = "Converted from US$131.21 at 1 USD = 7.85 HKD";

const WITH_NOTE = SAMPLE_INVOICE.lineItems.map((item) =>
  item.key === "subtotal" ? { ...item, note: NOTE } : item,
);

describe("an invoice's Subtotal note", () => {
  // g10.shared-invoice-and-receipt-pdf.SC1
  it("draws the note once, between Subtotal and Payment Processing Fee, and above the bank details", async () => {
    const rows = await drawnText(
      await InvoicePdf({
        ...SAMPLE_INVOICE,
        lineItems: WITH_NOTE,
        bankRails: ALL_BANK_RAILS,
      }),
    );
    expect(rows.filter((row) => row.text === NOTE)).toHaveLength(1);
    const note = drawnRow(rows, NOTE);
    expect(note.y).toBeLessThan(drawnRow(rows, "Subtotal").y);
    expect(note.y).toBeGreaterThan(drawnRow(rows, "Payment Processing Fee").y);
    expect(note.y).toBeGreaterThan(drawnRow(rows, "Bank details").y);
  });
});
