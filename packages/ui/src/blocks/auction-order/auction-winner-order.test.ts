// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { within } from "storybook/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuctionWinnerOrder, type AuctionWinnerOrderProps } from "../../index";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type PaymentValue = "card" | "fps" | "hk_local" | "swift";

type BankDetails = {
  rail: Exclude<PaymentValue, "card">;
  title: string;
  rows: readonly { label: string; value: string }[];
  qrSrc?: string;
  note?: string;
};

type TestWinnerOrderProps = AuctionWinnerOrderProps & {
  bankDetails?: BankDetails;
  summary: AuctionWinnerOrderProps["summary"] & {
    convertedTotal?: { label: string; value: string };
    convertedFee?: { label: string; value: string };
  };
};

const COPY: AuctionWinnerOrderProps["copy"] = {
  orderProgress: "Order Progress",
  orderSummary: "Order Summary",
  invoice: "Invoice",
  invoicePdf: "Invoice PDF",
  paymentMethod: "Payment method",
  refundDetails: "Refund Details",
  winningBid: "Winning bid",
  bank: "Bank",
  bankDetailsClose: "Close",
  bankDetailsQrAlt: "FPS payment QR code",
};

const BASE_PROPS: AuctionWinnerOrderProps = {
  copy: COPY,
  title: "Winner Order",
  badge: { label: "Awaiting Setup", variant: "warning" },
  progress: null,
  lot: {
    title: "1999 Pokemon Base Set Charizard PSA 9",
    winningBid: "US$101.00",
    ariaLabel: "Open lot details",
  },
  summary: {
    lines: [
      { label: "Winning Bid", value: "US$101.00" },
      { label: "Buyer's Premium", value: "US$20.20" },
      { label: "Shipping & Handling", value: "US$10.01" },
    ],
    total: { label: "Order Total", value: "US$131.21" },
  },
};

const roots: Array<{ root: Root; container: HTMLDivElement }> = [];

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
}

if (
  typeof window !== "undefined" &&
  typeof window.PointerEvent !== "function"
) {
  Object.defineProperty(window, "PointerEvent", {
    configurable: true,
    value: class PointerEvent extends MouseEvent {},
  });
}

afterEach(() => {
  for (const { root, container } of roots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
});

function mount(overrides: Partial<TestWinnerOrderProps> = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push({ root, container });

  function rerender(next: Partial<TestWinnerOrderProps>) {
    const props = {
      ...BASE_PROPS,
      ...overrides,
      ...next,
    } as AuctionWinnerOrderProps;
    act(() => root.render(createElement(AuctionWinnerOrder, props)));
  }

  rerender({});
  return { container, rerender };
}

function summaryRowText(container: HTMLDivElement) {
  const sidebar = within(container).getByRole("complementary");
  return [
    ...sidebar.querySelectorAll<HTMLElement>(
      '[data-slot="winner-order-summary-line"]',
    ),
  ].map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? "");
}

function summaryRow(container: HTMLDivElement, expectedText: string) {
  const sidebar = within(container).getByRole("complementary");
  return [
    ...sidebar.querySelectorAll<HTMLElement>(
      '[data-slot="winner-order-summary-line"]',
    ),
  ].find(
    (row) => row.textContent?.replace(/\s+/g, " ").trim() === expectedText,
  );
}

describe("AuctionWinnerOrder settlement presentation", () => {
  it("winner-order-SC-292 - omits HKD totals before invoice send and keeps the USD lot bid", () => {
    const { container } = mount();
    const canvas = within(container);

    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "Order TotalUS$131.21",
    ]);
    expect(canvas.queryByText("HK$1,031.00")).toBeNull();
    expect(canvas.queryByText("HK$38.73")).toBeNull();
    expect(
      container.querySelector('[data-slot="winner-order-lot"]')?.textContent,
    ).toContain("Winning bid: US$101.00");
  });

  it("shared-ui-auction-order-SC-s7t - renders a line's subtext under its value", () => {
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        lines: [
          { label: "Winning Bid", value: "HK$793.00", subtext: "US$101.00" },
          { label: "Payment Processing Fee", value: "HK$38.73" },
        ],
        total: { label: "Order Total", value: "HK$831.73" },
      },
    });

    const subtexts = container.querySelectorAll(
      '[data-slot="winner-order-summary-subtext"]',
    );
    expect([...subtexts].map((node) => node.textContent)).toEqual([
      "US$101.00",
    ]);
    expect(summaryRowText(container)).toEqual([
      "Winning BidHK$793.00US$101.00",
      "Payment Processing FeeHK$38.73",
      "Order TotalHK$831.73",
    ]);
  });

  it("renders the total's footnote muted under the Order Total row", () => {
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        lines: [{ label: "Winning Bid", value: "HK$793.00" }],
        total: {
          label: "Order Total",
          value: "HK$831.73",
          footnote: "Converted from US$101.00 at 1 USD = 7.85 HKD",
        },
      },
    });

    const totalRow = summaryRow(
      container,
      "Order TotalHK$831.73Converted from US$101.00 at 1 USD = 7.85 HKD",
    );
    expect(totalRow).not.toBeUndefined();
    const footnote = totalRow?.querySelector(
      '[data-slot="winner-order-summary-footnote"]',
    );
    expect(footnote?.textContent).toBe(
      "Converted from US$101.00 at 1 USD = 7.85 HKD",
    );
  });

  it("winner-order-SC-290 and winner-order-SC-304 and shared-ui-auction-order-SC-27 and shared-ui-auction-order-SC-30 - renders USD then HKD totals and keeps the card fee on its own row", () => {
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        convertedTotal: { label: "Order Total", value: "HK$1,031.00" },
        convertedFee: { label: "Payment Processing Fee", value: "HK$38.73" },
      },
    });

    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "Order TotalUS$131.21",
      "Order TotalHK$1,031.00",
      "Payment Processing FeeHK$38.73",
    ]);

    const sidebar = within(container).getByRole("complementary");
    const separator = sidebar.querySelector("hr");
    const shippingRow = summaryRow(container, "Shipping & HandlingUS$10.01");
    const usdTotalRow = summaryRow(container, "Order TotalUS$131.21");
    expect(separator).not.toBeNull();
    expect(shippingRow).not.toBeUndefined();
    expect(usdTotalRow).not.toBeUndefined();
    if (separator && shippingRow && usdTotalRow) {
      expect(
        Boolean(
          shippingRow.compareDocumentPosition(separator) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ).toBe(true);
      expect(
        Boolean(
          separator.compareDocumentPosition(usdTotalRow) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ).toBe(true);
    }

    const lotCard = container.querySelector('[data-slot="winner-order-lot"]');
    expect(lotCard).not.toBeNull();
    expect(lotCard?.textContent).toContain("Winning bid: US$101.00");
  });

  it("winner-order-SC-290 - renders USD lines, an HKD subtotal with its rate footnote, then the fee and whole-HK$ total below", () => {
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        subtotal: {
          label: "Subtotal",
          value: "HK$1,030.00",
          footnote: "Converted from US$131.21 at 1 USD = 7.85 HKD",
        },
        feeLines: [{ label: "Payment Processing Fee", value: "HK$38.73" }],
        total: { label: "Order Total", value: "HK$1,069" },
      },
    });

    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "SubtotalHK$1,030.00Converted from US$131.21 at 1 USD = 7.85 HKD",
      "Payment Processing FeeHK$38.73",
      "Order TotalHK$1,069",
    ]);

    const sidebar = within(container).getByRole("complementary");
    const separators = sidebar.querySelectorAll("hr");
    expect(separators).toHaveLength(2);
    const shippingRow = summaryRow(container, "Shipping & HandlingUS$10.01");
    const subtotalRow = summaryRow(
      container,
      "SubtotalHK$1,030.00Converted from US$131.21 at 1 USD = 7.85 HKD",
    );
    const feeRow = summaryRow(container, "Payment Processing FeeHK$38.73");
    const totalRow = summaryRow(container, "Order TotalHK$1,069");
    expect(shippingRow && subtotalRow && feeRow && totalRow).toBeTruthy();
    if (shippingRow && subtotalRow && feeRow && totalRow) {
      const follows = (a: Node, b: Node) =>
        Boolean(
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING,
        );
      expect(follows(shippingRow, separators[0])).toBe(true);
      expect(follows(separators[0], subtotalRow)).toBe(true);
      expect(follows(subtotalRow, feeRow)).toBe(true);
      expect(follows(feeRow, separators[1])).toBe(true);
      expect(follows(separators[1], totalRow)).toBe(true);
    }
  });

  it("winner-order-SC-291 and shared-ui-auction-order-SC-28 - keeps a USD order to one total line", () => {
    const { container } = mount();

    const canvas = within(container);
    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "Order TotalUS$131.21",
    ]);
    expect(canvas.queryByText("HK$1,031.00")).toBeNull();
  });

  it("winner-order-SC-181 and shared-ui-auction-order-SC-29 - opens one supplied FPS rail and reports the control press", () => {
    const onViewBankDetails = vi.fn();
    const { container } = mount({
      bankDetails: {
        rail: "fps",
        title: "FPS bank details",
        rows: [
          { label: "FPS ID", value: "fps@example.test" },
          { label: "Account name", value: "Grade10 Finance Limited" },
          { label: "Payment reference", value: "ORDER-123" },
        ],
        qrSrc: "data:image/png;base64,ZmFrZS1xci1kYXRh",
        note: "Open your banking app and scan this QR",
      },
      summary: {
        ...BASE_PROPS.summary,
        pay: {
          label: "Submit Payment Proof",
          onPress: vi.fn(),
          secondary: {
            label: "View Bank Details",
            onPress: onViewBankDetails,
          },
        },
      },
    });

    act(() => {
      within(container)
        .getByRole("button", { name: "View Bank Details" })
        .click();
    });

    expect(onViewBankDetails).toHaveBeenCalledTimes(1);
    const dialog = within(document.body).getByRole("dialog");
    expect(within(dialog).getByText("FPS bank details")).not.toBeNull();
    expect(within(dialog).getByText("FPS ID")).not.toBeNull();
    expect(within(dialog).getByText("fps@example.test")).not.toBeNull();
    expect(within(dialog).getByText("Payment reference")).not.toBeNull();
    expect(within(dialog).getByText("ORDER-123")).not.toBeNull();
    expect(
      within(dialog).getByRole("img", { name: COPY.bankDetailsQrAlt }),
    ).not.toBeNull();
    expect(within(dialog).queryByRole("tab")).toBeNull();
    expect(within(dialog).queryByText(/HK Local|SWIFT/i)).toBeNull();
  });

  it("winner-order-SC-182 - opens HK Local details with bank and account fields", () => {
    const { container } = mount({
      bankDetails: {
        rail: "hk_local",
        title: "HK Local bank details",
        rows: [
          { label: "Bank name", value: "Grade10 Bank" },
          { label: "Bank code", value: "004" },
          { label: "Branch code", value: "123" },
          { label: "Account number", value: "004-123-987654" },
          { label: "Payment reference", value: "ORDER-HK-123" },
        ],
      },
      summary: {
        ...BASE_PROPS.summary,
        pay: {
          label: "Submit Payment Proof",
          onPress: vi.fn(),
          secondary: {
            label: "View Bank Details",
            onPress: vi.fn(),
          },
        },
      },
    });

    act(() => {
      within(container)
        .getByRole("button", { name: "View Bank Details" })
        .click();
    });

    const dialog = within(document.body).getByRole("dialog");
    expect(within(dialog).getByText("HK Local bank details")).not.toBeNull();
    for (const value of [
      "Grade10 Bank",
      "004",
      "123",
      "004-123-987654",
      "ORDER-HK-123",
    ]) {
      expect(within(dialog).getByText(value)).not.toBeNull();
    }
    expect(within(dialog).queryByRole("tab")).toBeNull();
    expect(within(dialog).queryByText(/FPS|SWIFT/i)).toBeNull();
  });

  it("winner-order-SC-183 - opens SWIFT details and places the OUR note after payment reference", () => {
    const { container } = mount({
      bankDetails: {
        rail: "swift",
        title: "International via SWIFT bank details",
        rows: [
          { label: "Beneficiary name", value: "Grade10 Finance Limited" },
          {
            label: "Beneficiary address",
            value: "Unit 2602, Central, Hong Kong",
          },
          { label: "Bank name", value: "Grade10 Bank" },
          { label: "Bank address", value: "1 Queen's Road Central" },
          { label: "SWIFT / BIC", value: "G10BHKHHXXX" },
          { label: "Account number / IBAN", value: "HK00G10B000123456789" },
          { label: "Payment reference", value: "ORDER-USD-123" },
        ],
        note: "Choose OUR for transfer fees so Grade10 receives the full order total.",
      },
      summary: {
        ...BASE_PROPS.summary,
        pay: {
          label: "Submit Payment Proof",
          onPress: vi.fn(),
          secondary: {
            label: "View Bank Details",
            onPress: vi.fn(),
          },
        },
      },
    });

    act(() => {
      within(container)
        .getByRole("button", { name: "View Bank Details" })
        .click();
    });

    const dialog = within(document.body).getByRole("dialog");
    for (const value of [
      "Grade10 Finance Limited",
      "Unit 2602, Central, Hong Kong",
      "Grade10 Bank",
      "1 Queen's Road Central",
      "G10BHKHHXXX",
      "HK00G10B000123456789",
      "ORDER-USD-123",
    ]) {
      expect(within(dialog).getByText(value)).not.toBeNull();
    }
    const reference = within(dialog).getByText("ORDER-USD-123");
    const note = within(dialog).getByText(
      "Choose OUR for transfer fees so Grade10 receives the full order total.",
    );
    expect(
      Boolean(
        reference.compareDocumentPosition(note) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
    expect(within(dialog).queryByRole("tab")).toBeNull();
    expect(within(dialog).queryByText(/FPS|HK Local/i)).toBeNull();
  });
});
