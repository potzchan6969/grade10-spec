// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { within } from "storybook/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuctionWinnerOrder, type AuctionWinnerOrderProps } from "../../index";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type SettlementCurrency = "USD" | "HKD";
type PaymentValue = "card" | "fps" | "hk_local" | "swift";

type SettlementCurrencyChoice = {
  label: string;
  options: readonly { value: SettlementCurrency; label: string }[];
  value: SettlementCurrency | null;
  onChange: (value: SettlementCurrency) => void;
};

type PaymentChoice = {
  value: PaymentValue;
  label: string;
  feeRange: string;
  unavailable?: string;
};

type PaymentChoices = {
  label: string;
  byCurrency: Record<SettlementCurrency, readonly PaymentChoice[]>;
  value: PaymentValue | null;
  onChange: (value: PaymentValue) => void;
  none?: string;
};

type BankDetails = {
  rail: Exclude<PaymentValue, "card">;
  title: string;
  rows: readonly { label: string; value: string }[];
  qrSrc?: string;
  note?: string;
};

type TestWinnerOrderProps = AuctionWinnerOrderProps & {
  settlementCurrency?: SettlementCurrencyChoice;
  paymentChoices?: PaymentChoices;
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
  view: "View",
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

const CURRENCY_OPTIONS: SettlementCurrencyChoice["options"] = [
  { value: "USD", label: "USD" },
  { value: "HKD", label: "HKD" },
];

const PAYMENT_CHOICES: PaymentChoices["byCurrency"] = {
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
  it("winner-order-SC-278 and shared-ui-auction-order-SC-21 and shared-ui-auction-order-SC-22 - offers USD and HKD with neither selected and reports a pick", () => {
    const onChange = vi.fn();
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: null,
        onChange,
      },
    });
    const canvas = within(container);

    const usd = canvas.getByRole("radio", { name: /^USD$/ });
    const hkd = canvas.getByRole("radio", { name: /^HKD$/ });
    expect(usd.getAttribute("aria-checked")).toBe("false");
    expect(hkd.getAttribute("aria-checked")).toBe("false");

    act(() => hkd.click());
    expect(onChange).toHaveBeenCalledWith("HKD");
  });

  it("shared-ui-auction-order-SC-23 and winner-order-SC-293 - lists only the picked currency's rails with fee ranges", () => {
    const onCurrencyChange = vi.fn();
    const onPaymentChange = vi.fn();
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "HKD",
        onChange: onCurrencyChange,
      },
      paymentChoices: {
        label: "Payment method",
        byCurrency: PAYMENT_CHOICES,
        value: null,
        onChange: onPaymentChange,
      },
    });
    const canvas = within(container);

    expect(canvas.getByRole("radio", { name: /^Card\b/i })).not.toBeNull();
    expect(canvas.getByRole("radio", { name: /^FPS\b/i })).not.toBeNull();
    expect(canvas.getByRole("radio", { name: /^HK Local\b/i })).not.toBeNull();
    expect(
      canvas.queryByRole("radio", { name: /International via SWIFT/i }),
    ).toBeNull();
    expect(canvas.getByText("3.0% + HK$10 to 4.0% + HK$20")).not.toBeNull();
    expect(canvas.getAllByText("No fee").length).toBe(2);

    act(() => canvas.getByRole("radio", { name: /^FPS\b/i }).click());
    expect(onPaymentChange).toHaveBeenCalledWith("fps");
  });

  it("shared-ui-auction-order-SC-24 - lists no payment rail before a settlement currency is picked", () => {
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: null,
        onChange: vi.fn(),
      },
      paymentChoices: {
        label: "Payment method",
        byCurrency: PAYMENT_CHOICES,
        value: null,
        onChange: vi.fn(),
      },
    });
    const canvas = within(container);

    expect(canvas.getByRole("radio", { name: /^USD$/ })).not.toBeNull();
    expect(canvas.getByRole("radio", { name: /^HKD$/ })).not.toBeNull();
    expect(canvas.queryByRole("radio", { name: /^Card\b/i })).toBeNull();
    expect(canvas.queryByRole("radio", { name: /^FPS\b/i })).toBeNull();
  });

  it("shared-ui-auction-order-SC-25 and winner-order-SC-297 - renders an unavailable USD card without making it selectable", () => {
    const onPaymentChange = vi.fn();
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "USD",
        onChange: vi.fn(),
      },
      paymentChoices: {
        label: "Payment method",
        byCurrency: {
          ...PAYMENT_CHOICES,
          USD: [
            {
              ...PAYMENT_CHOICES.USD[0],
              unavailable: "Card is not yet available in USD",
            },
            ...PAYMENT_CHOICES.USD.slice(1),
          ],
        },
        value: null,
        onChange: onPaymentChange,
      },
    });
    const canvas = within(container);
    const card = canvas.getByRole("radio", { name: /^Card\b/i });

    expect(canvas.getByText("Card is not yet available in USD")).not.toBeNull();
    expect(
      card.parentElement?.querySelector<HTMLInputElement>('input[type="radio"]')
        ?.disabled,
    ).toBe(true);
    expect(canvas.getByRole("radio", { name: /^HK Local\b/i })).not.toBeNull();
    expect(
      canvas.getByRole("radio", { name: /International via SWIFT/i }),
    ).not.toBeNull();
    expect(canvas.queryByRole("radio", { name: /^FPS\b/i })).toBeNull();
    act(() => card.click());
    expect(onPaymentChange).not.toHaveBeenCalled();
  });

  it("shared-ui-auction-order-SC-26 and winner-order-SC-295 - clears the selected method when the controlled currency changes", () => {
    const paymentChoices: PaymentChoices = {
      label: "Payment method",
      byCurrency: PAYMENT_CHOICES,
      value: "swift",
      onChange: vi.fn(),
    };
    const { container, rerender } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "USD",
        onChange: vi.fn(),
      },
      paymentChoices,
    });
    const canvas = within(container);
    expect(
      canvas
        .getByRole("radio", { name: /International via SWIFT/i })
        .getAttribute("aria-checked"),
    ).toBe("true");

    rerender({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "HKD",
        onChange: vi.fn(),
      },
      paymentChoices: {
        ...paymentChoices,
        value: null,
      },
    });

    expect(
      canvas.queryByRole("radio", { name: /International via SWIFT/i }),
    ).toBeNull();
    const paymentRadios = [
      canvas.getByRole("radio", { name: /^Card\b/i }),
      canvas.getByRole("radio", { name: /^FPS\b/i }),
      canvas.getByRole("radio", { name: /^HK Local\b/i }),
    ];
    expect(
      paymentRadios.every(
        (radio) => radio.getAttribute("aria-checked") === "false",
      ),
    ).toBe(true);
  });

  it("winner-order-SC-296 - keeps a method selected when both currencies offer it", () => {
    const paymentChoices: PaymentChoices = {
      label: "Payment method",
      byCurrency: PAYMENT_CHOICES,
      value: "hk_local",
      onChange: vi.fn(),
    };
    const { container, rerender } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "USD",
        onChange: vi.fn(),
      },
      paymentChoices,
    });
    const canvas = within(container);

    expect(
      canvas
        .getByRole("radio", { name: /^HK Local\b/i })
        .getAttribute("aria-checked"),
    ).toBe("true");

    rerender({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "HKD",
        onChange: vi.fn(),
      },
      paymentChoices: {
        ...paymentChoices,
        value: "hk_local",
      },
    });

    expect(
      canvas
        .getByRole("radio", { name: /^HK Local\b/i })
        .getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      canvas.queryByRole("radio", { name: /International via SWIFT/i }),
    ).toBeNull();
  });

  it("winner-order-SC-294 - offers USD card, HK Local and SWIFT without FPS", () => {
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "USD",
        onChange: vi.fn(),
      },
      paymentChoices: {
        label: "Payment method",
        byCurrency: PAYMENT_CHOICES,
        value: null,
        onChange: vi.fn(),
      },
    });
    const canvas = within(container);

    expect(canvas.getByRole("radio", { name: /^Card\b/i })).not.toBeNull();
    expect(canvas.getByRole("radio", { name: /^HK Local\b/i })).not.toBeNull();
    expect(
      canvas.getByRole("radio", { name: /International via SWIFT/i }),
    ).not.toBeNull();
    expect(canvas.queryByRole("radio", { name: /^FPS\b/i })).toBeNull();
    expect(
      canvas
        .getByRole("radio", { name: /^Card\b/i })
        .getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("winner-order-SC-303 - renders the card fee percentage for the picked currency", () => {
    const feeChoices: PaymentChoices["byCurrency"] = {
      USD: [
        {
          value: "card",
          label: "Card",
          feeRange: "Card fee about 4.4% + a fixed amount",
        },
      ],
      HKD: [
        {
          value: "card",
          label: "Card",
          feeRange: "Card fee about 3.4% + a fixed amount",
        },
      ],
    };
    const paymentChoices: PaymentChoices = {
      label: "Payment method",
      byCurrency: feeChoices,
      value: null,
      onChange: vi.fn(),
    };
    const { container, rerender } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "USD",
        onChange: vi.fn(),
      },
      paymentChoices,
    });
    const canvas = within(container);

    expect(
      canvas.getByText("Card fee about 4.4% + a fixed amount"),
    ).not.toBeNull();
    rerender({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "HKD",
        onChange: vi.fn(),
      },
      paymentChoices,
    });
    expect(
      canvas.getByText("Card fee about 3.4% + a fixed amount"),
    ).not.toBeNull();
    expect(
      canvas.queryByText("Card fee about 4.4% + a fixed amount"),
    ).toBeNull();
  });

  it("winner-order-SC-292 - omits HKD totals before invoice send and keeps the USD lot bid", () => {
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "HKD",
        onChange: vi.fn(),
      },
    });
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

  it("winner-order-SC-291 and shared-ui-auction-order-SC-28 - keeps a USD order to one total line", () => {
    const { container } = mount({
      settlementCurrency: {
        label: "Settlement currency",
        options: CURRENCY_OPTIONS,
        value: "USD",
        onChange: vi.fn(),
      },
    });

    const canvas = within(container);
    expect(
      canvas.getByRole("radio", { name: /^USD$/ }).getAttribute("aria-checked"),
    ).toBe("true");
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
