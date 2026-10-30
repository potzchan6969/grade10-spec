// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { within } from "storybook/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AuctionWinnerOrder,
  type AuctionWinnerOrderBankDetails,
  type AuctionWinnerOrderProps,
} from "../../index";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type TestWinnerOrderProps = AuctionWinnerOrderProps & {
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
  bankDetailsDone: "Done",
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

  it("shared-ui-auction-order-SC-27 and shared-ui-auction-order-SC-30 - renders USD then HKD totals and keeps the card fee on its own row", () => {
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

  it("winner-order-SC-304 and g10.shared-auction-order.SC1 - renders the Subtotal and fee rows between two separators, then the total", () => {
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        subtotal: { label: "Subtotal", value: "HK$1,030.00" },
        feeLines: [{ label: "Payment Processing Fee", value: "HK$38.69" }],
        total: { label: "Order Total", value: "HK$1,068.69" },
      },
    });

    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "SubtotalHK$1,030.00",
      "Payment Processing FeeHK$38.69",
      "Order TotalHK$1,068.69",
    ]);

    const sidebar = within(container).getByRole("complementary");
    const separators = sidebar.querySelectorAll("hr");
    expect(separators).toHaveLength(2);
    const shippingRow = summaryRow(container, "Shipping & HandlingUS$10.01");
    const subtotalRow = summaryRow(container, "SubtotalHK$1,030.00");
    const feeRow = summaryRow(container, "Payment Processing FeeHK$38.69");
    const totalRow = summaryRow(container, "Order TotalHK$1,068.69");
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

  it("g10.shared-auction-order.SC2 - shows the Subtotal's footnote under the Subtotal only", () => {
    const note = "Converted from US$131.21 at 1 USD = 7.85 HKD";
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        subtotal: { label: "Subtotal", value: "HK$1,030.00", footnote: note },
        feeLines: [{ label: "Payment Processing Fee", value: "HK$38.69" }],
        total: { label: "Order Total", value: "HK$1,068.69" },
      },
    });

    const footnotes = container.querySelectorAll(
      '[data-slot="winner-order-summary-footnote"]',
    );
    expect([...footnotes].map((node) => node.textContent)).toEqual([note]);
    expect(
      summaryRow(container, `SubtotalHK$1,030.00${note}`),
    ).not.toBeUndefined();
    expect(
      summaryRow(container, "Payment Processing FeeHK$38.69"),
    ).not.toBeUndefined();
    expect(summaryRow(container, "Order TotalHK$1,068.69")).not.toBeUndefined();
  });

  it("winner-order-SC-290 - reads an HKD order's USD lines, the Subtotal with its note, a Free fee and the HKD total with no USD total", () => {
    const note = "Converted from US$131.21 at 1 USD = 7.85 HKD";
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        subtotal: { label: "Subtotal", value: "HK$1,030.00", footnote: note },
        feeLines: [{ label: "Payment Processing Fee", value: "Free" }],
        total: { label: "Order Total", value: "HK$1,030.00" },
      },
    });

    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      `SubtotalHK$1,030.00${note}`,
      "Payment Processing FeeFree",
      "Order TotalHK$1,030.00",
    ]);
    expect(
      within(container).getByRole("complementary").querySelectorAll("hr"),
    ).toHaveLength(2);
    expect(within(container).queryByText("US$131.21")).toBeNull();
  });

  it("g10.shared-auction-order.SC4 - draws each prop on its own", () => {
    const subtotalOnly = mount({
      summary: {
        ...BASE_PROPS.summary,
        subtotal: { label: "Subtotal", value: "HK$1,030.00" },
      },
    });
    expect(summaryRowText(subtotalOnly.container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "SubtotalHK$1,030.00",
      "Order TotalUS$131.21",
    ]);
    expect(
      subtotalOnly.container.querySelectorAll(
        '[data-slot="winner-order-summary-footnote"]',
      ),
    ).toHaveLength(0);

    const feesOnly = mount({
      summary: {
        ...BASE_PROPS.summary,
        feeLines: [{ label: "Payment Processing Fee", value: "HK$38.69" }],
      },
    });
    expect(summaryRowText(feesOnly.container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "Payment Processing FeeHK$38.69",
      "Order TotalUS$131.21",
    ]);

    const emptyFees = mount({
      summary: { ...BASE_PROPS.summary, feeLines: [] },
    });
    expect(summaryRowText(emptyFees.container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "Order TotalUS$131.21",
    ]);
    expect(
      within(emptyFees.container)
        .getByRole("complementary")
        .querySelectorAll("hr"),
    ).toHaveLength(1);
  });

  it("g10.shared-auction-order.SC5 - draws the Subtotal and fee rows and the converted total and fee when both sets arrive", () => {
    const { container } = mount({
      summary: {
        ...BASE_PROPS.summary,
        subtotal: { label: "Subtotal", value: "HK$1,030.00" },
        feeLines: [{ label: "Payment Processing Fee", value: "HK$38.69" }],
        convertedTotal: { label: "Order Total", value: "HK$1,068.69" },
        convertedFee: { label: "Card Fee", value: "HK$38.69" },
      },
    });

    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "SubtotalHK$1,030.00",
      "Payment Processing FeeHK$38.69",
      "Order TotalUS$131.21",
      "Order TotalHK$1,068.69",
      "Card FeeHK$38.69",
    ]);
  });

  it("winner-order-SC-291 and shared-ui-auction-order-SC-28 and g10.shared-auction-order.SC3 - keeps a USD order to one total line, one separator and no Subtotal row", () => {
    const { container } = mount();

    const canvas = within(container);
    expect(summaryRowText(container)).toEqual([
      "Winning BidUS$101.00",
      "Buyer's PremiumUS$20.20",
      "Shipping & HandlingUS$10.01",
      "Order TotalUS$131.21",
    ]);
    expect(canvas.queryByText("HK$1,031.00")).toBeNull();
    expect(canvas.queryByText("Subtotal")).toBeNull();
    expect(canvas.queryByText(/HK\$/)).toBeNull();
    expect(
      container.querySelectorAll('[data-slot="winner-order-summary-footnote"]'),
    ).toHaveLength(0);
    expect(
      within(container).getByRole("complementary").querySelectorAll("hr"),
    ).toHaveLength(1);
  });

  const REFERENCE_WARNING =
    "Enter this reference in your bank app's Memo or Remarks field. Missing it delays verification.";

  function openBankDetails(
    bankDetails: AuctionWinnerOrderBankDetails,
    onViewBankDetails = vi.fn(),
  ) {
    const { container } = mount({
      bankDetails,
      summary: {
        ...BASE_PROPS.summary,
        pay: {
          label: "Submit Payment Proof",
          onPress: vi.fn(),
          secondary: { label: "View Bank Details", onPress: onViewBankDetails },
        },
      },
    });
    act(() => {
      within(container)
        .getByRole("button", { name: "View Bank Details" })
        .click();
    });
    return within(document.body).getByRole("dialog");
  }

  function follows(first: Node, second: Node) {
    return Boolean(
      first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  }

  function expectDoneOnly(dialog: HTMLElement) {
    expect(
      dialog.querySelector('[data-slot="dialog-header"] button'),
    ).toBeNull();
    expect(
      within(dialog)
        .getAllByRole("button")
        .map((button) => button.textContent?.trim()),
    ).toEqual(["Done"]);
  }

  const MINIMAL_RAIL: AuctionWinnerOrderBankDetails = {
    rail: "hk_local",
    title: "View Bank Details",
    amountDue: { label: "Amount due", value: "HK$16,340.00" },
    rows: [{ label: "Bank name", value: "Grade10 Bank" }],
    reference: {
      label: "Payment reference",
      value: "LK7P2Q",
      warning: REFERENCE_WARNING,
    },
  };

  it("issue-1590-TC2 - with no invoice ID supplied, the title is followed directly by the amount due", () => {
    const dialog = openBankDetails(MINIMAL_RAIL);

    expect(within(dialog).queryByText(/^Invoice:/)).toBeNull();
    expect(dialog.querySelector('[data-slot="dialog-header"] p')).toBeNull();
    const title = within(dialog).getByText("View Bank Details");
    const amount = within(dialog).getByText("Amount due");
    const between = [...dialog.querySelectorAll("*")].filter(
      (node) =>
        follows(title, node) &&
        follows(node, amount) &&
        !node.contains(amount) &&
        node.textContent?.trim(),
    );
    expect(between).toEqual([]);
  });

  it("issue-1590-TC3 - the header has no close control and Done, the only control, closes the dialog", () => {
    const dialog = openBankDetails(MINIMAL_RAIL);

    expectDoneOnly(dialog);
    act(() => {
      within(dialog).getByRole("button", { name: "Done" }).click();
    });
    expect(within(document.body).queryByRole("dialog")).toBeNull();
  });

  it("issue-1590-TC4 - Escape closes the dialog, and so does a press outside it", () => {
    const { container } = mount({
      bankDetails: MINIMAL_RAIL,
      summary: {
        ...BASE_PROPS.summary,
        pay: {
          label: "Submit Payment Proof",
          onPress: vi.fn(),
          secondary: { label: "View Bank Details", onPress: vi.fn() },
        },
      },
    });
    const open = () => {
      act(() => {
        within(container)
          .getByRole("button", { name: "View Bank Details" })
          .click();
      });
      return within(document.body).getByRole("dialog");
    };

    const first = open();
    act(() => {
      first.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(within(document.body).queryByRole("dialog")).toBeNull();

    open();
    const overlay = document.body.querySelector<HTMLElement>(
      '[data-slot="dialog-overlay"]',
    );
    expect(overlay).not.toBeNull();
    act(() => {
      for (const type of [
        "pointerdown",
        "mousedown",
        "pointerup",
        "mouseup",
        "click",
      ]) {
        overlay?.dispatchEvent(
          new (type.startsWith("pointer") ? PointerEvent : MouseEvent)(type, {
            bubbles: true,
            button: 0,
          }),
        );
      }
    });
    expect(within(document.body).queryByRole("dialog")).toBeNull();
  });

  it("winner-order-SC-181 and shared-ui-auction-order-SC-29 - opens one supplied FPS rail as its design draws it and reports the control press", () => {
    const onViewBankDetails = vi.fn();
    const dialog = openBankDetails(
      {
        rail: "fps",
        title: "View Bank Details",
        invoice: "Invoice: IN-LK7P2Q01",
        amountDue: { label: "Amount due", value: "HK$16,340.00" },
        rows: [
          { label: "FPS ID", value: "12345678" },
          { label: "Account name", value: "Grade10 Finance Limited" },
        ],
        reference: {
          label: "Payment reference",
          value: "LK7P2Q",
          warning: REFERENCE_WARNING,
        },
        qr: {
          src: "data:image/png;base64,ZmFrZS1xci1kYXRh",
          hint: "Open your banking app and scan this QR",
        },
      },
      onViewBankDetails,
    );

    expect(onViewBankDetails).toHaveBeenCalledTimes(1);
    expect(within(dialog).getByText("View Bank Details")).not.toBeNull();
    expect(within(dialog).getByText("Invoice: IN-LK7P2Q01")).not.toBeNull();
    expect(
      follows(
        within(dialog).getByText("Amount due"),
        within(dialog).getByText("HK$16,340.00"),
      ),
    ).toBe(true);
    expect(
      within(dialog).getByRole("img", { name: COPY.bankDetailsQrAlt }),
    ).not.toBeNull();
    const hint = within(dialog).getByText(
      "Open your banking app and scan this QR",
    );
    const warning = within(dialog).getByText(REFERENCE_WARNING);
    expect(hint).not.toBe(warning);
    expect(follows(within(dialog).getByText("LK7P2Q"), warning)).toBe(true);
    expect(within(dialog).getByText("12345678")).not.toBeNull();
    expect(within(dialog).queryByRole("alert")).toBeNull();
    expect(within(dialog).queryByRole("tab")).toBeNull();
    expect(within(dialog).queryByText(/HK Local|SWIFT/i)).toBeNull();
    expectDoneOnly(dialog);
  });

  it("winner-order-SC-182 - opens HK Local details with bank code and branch code side by side", () => {
    const dialog = openBankDetails({
      rail: "hk_local",
      title: "View Bank Details",
      amountDue: { label: "Amount due", value: "HK$16,340.00" },
      rows: [
        { label: "Bank name", value: "Grade10 Bank" },
        [
          { label: "Bank code", value: "004" },
          { label: "Branch code", value: "123" },
        ],
        { label: "Account number", value: "004-123-987654" },
      ],
      reference: {
        label: "Payment reference",
        value: "ORDER-HK-123",
        warning: REFERENCE_WARNING,
      },
    });

    for (const value of ["Grade10 Bank", "004", "123", "004-123-987654"]) {
      expect(within(dialog).getByText(value)).not.toBeNull();
    }
    const pair = dialog.querySelector<HTMLElement>(
      '[data-slot="winner-order-bank-pair"]',
    );
    expect(pair).not.toBeNull();
    expect(within(pair as HTMLElement).getByText("Bank code")).not.toBeNull();
    expect(within(pair as HTMLElement).getByText("Branch code")).not.toBeNull();
    expect(
      follows(
        within(dialog).getByText("ORDER-HK-123"),
        within(dialog).getByText(REFERENCE_WARNING),
      ),
    ).toBe(true);
    expect(within(dialog).queryByText(/^Invoice:/)).toBeNull();
    expect(within(dialog).queryByRole("img")).toBeNull();
    expect(within(dialog).queryByRole("alert")).toBeNull();
    expect(within(dialog).queryByRole("tab")).toBeNull();
    expect(within(dialog).queryByText(/FPS|SWIFT/i)).toBeNull();
    expectDoneOnly(dialog);
  });

  it("winner-order-SC-183 - opens SWIFT details and places the OUR warning after the payment reference", () => {
    const dialog = openBankDetails({
      rail: "swift",
      title: "View Bank Details",
      invoice: "Invoice: IN-LK7P2Q01",
      amountDue: { label: "Amount due", value: "US$16,340.00" },
      rows: [
        { label: "Beneficiary name", value: "Grade10 Finance Limited" },
        {
          label: "Beneficiary address",
          value: "Unit 2602, Central, Hong Kong",
        },
        { label: "Bank name", value: "Grade10 Bank" },
        { label: "Bank address", value: "1 Queen's Road Central" },
        [
          { label: "SWIFT / BIC", value: "G10BHKHHXXX" },
          { label: "Account number / IBAN", value: "HK00G10B000123456789" },
        ],
      ],
      reference: {
        label: "Payment reference",
        value: "ORDER-USD-123",
        warning: REFERENCE_WARNING,
      },
      alert:
        "In your bank app, choose OUR for transfer fees so we receive the full order total.",
    });

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
    const pair = dialog.querySelector<HTMLElement>(
      '[data-slot="winner-order-bank-pair"]',
    );
    expect(within(pair as HTMLElement).getByText("SWIFT / BIC")).not.toBeNull();
    const alert = within(dialog).getByRole("alert");
    expect(alert.textContent).toContain("choose OUR for transfer fees");
    expect(follows(within(dialog).getByText(REFERENCE_WARNING), alert)).toBe(
      true,
    );
    expect(within(dialog).queryByRole("tab")).toBeNull();
    expect(within(dialog).queryByText(/FPS|HK Local/i)).toBeNull();
    expectDoneOnly(dialog);
  });
});
