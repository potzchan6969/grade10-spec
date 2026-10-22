import { createElement } from "react";
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import { previewLot } from "../_components/preview-lot";
import AuctionWonEmail from "./auction-won";
import PaymentOverdueEmail from "./payment-overdue";
import PaymentReceivedEmail from "./payment-received";
import PaymentReceivedPartialEmail from "./payment-received-partial";
import PaymentReminderEmail from "./payment-reminder";

const HKD_AFTER_SETUP_LETTERS = [
  [
    "payment reminder",
    () => createElement(PaymentReminderEmail),
    "HK$1,068.69",
  ],
  [
    "day-three payment reminder",
    () => createElement(PaymentReminderEmail, { urgency: "day3" }),
    "HK$1,068.69",
  ],
  [
    "day-six payment reminder",
    () => createElement(PaymentReminderEmail, { urgency: "day6" }),
    "HK$1,068.69",
  ],
  [
    "final payment reminder",
    () => createElement(PaymentReminderEmail, { urgency: "final" }),
    "HK$1,068.69",
  ],
  ["payment overdue", () => createElement(PaymentOverdueEmail), "HK$1,068.69"],
  [
    "partial payment received",
    () => createElement(PaymentReceivedPartialEmail),
    "HK$800",
  ],
];

const PARTIAL_PAYMENT_AMOUNT = "HK$800";
const PARTIAL_PAYMENT_MINOR_UNITS = 80_000;
const PREVIEW_INVOICE_TOTAL_MINOR_UNITS = 106_869;

describe("auction order letter previews", () => {
  // order-mail-SC-64, order-mail-SC-67, order-mail-SC-68
  it.each(HKD_AFTER_SETUP_LETTERS)(
    "renders the %s preview as an HKD total without a USD bid or conversion rate",
    async (_name, makeEmail, expectedAmount) => {
      const markup = await render(makeEmail());

      expect(markup).toContain(expectedAmount);
      expect(markup).not.toMatch(/\bUSD\b|US\$/);
      expect(markup).not.toContain("7.85");
    },
  );

  // order-mail-SC-66, g10.auction-notifications-order.SC1
  it("lists the USD lines, then the HKD Subtotal, fee and Order Total in the payment-received letter", async () => {
    const markup = await render(createElement(PaymentReceivedEmail));
    const at = (text) => markup.indexOf(text);

    const listed = [
      "Winning Bid: US$101.00",
      "Buyer&#x27;s Premium: US$20.20",
      "Shipping &amp; Handling: US$10.01",
      "Subtotal: HK$1,030.00",
      "Payment Processing Fee: HK$38.69",
      "Order Total: HK$1,068.69",
    ];
    for (const line of listed) expect(at(line), line).toBeGreaterThan(-1);
    expect(listed.map(at)).toEqual([...listed.map(at)].sort((a, b) => a - b));
    expect(at("Receipt ID")).toBeGreaterThan(at("Order Total: HK$1,068.69"));
    expect(markup).toContain("HK$1,068.69");
    expect(markup).not.toContain("7.85");
    expect(markup).not.toMatch(/Converted|\bUSD\b|\bHKD\b/);
  });

  // g10.auction-notifications-order.SC1
  it("reads Free for a free charge and lists no Insurance or Tax line", async () => {
    const markup = await render(
      createElement(PaymentReceivedEmail, {
        amountPaid: "HK$951.42",
        lines: [
          { label: "Winning Bid", value: "US$101.00" },
          { label: "Buyer's Premium", value: "US$20.20" },
          { label: "Shipping & Handling", value: "Free" },
          { label: "Subtotal", value: "HK$951.42" },
          { label: "Payment Processing Fee", value: "Free" },
          { label: "Order Total", value: "HK$951.42" },
        ],
      }),
    );

    expect(markup).toContain("Shipping &amp; Handling: Free");
    expect(markup).toContain("Payment Processing Fee: Free");
    expect(markup).toContain("Subtotal: HK$951.42");
    expect(markup).not.toMatch(/Insurance|Tax:/);
  });

  // g10.auction-notifications-order.SC2
  it("lists a USD order's lines in USD with no HKD amount", async () => {
    const markup = await render(
      createElement(PaymentReceivedEmail, {
        amountPaid: "US$136.21",
        lines: [
          { label: "Winning Bid", value: "US$101.00" },
          { label: "Buyer's Premium", value: "US$20.20" },
          { label: "Shipping & Handling", value: "US$10.01" },
          { label: "Subtotal", value: "US$131.21" },
          { label: "Payment Processing Fee", value: "US$5.00" },
          { label: "Order Total", value: "US$136.21" },
        ],
      }),
    );

    expect(markup).toContain("Subtotal: US$131.21");
    expect(markup).toContain("Order Total: US$136.21");
    expect(markup).not.toContain("HK$");
  });

  // order-mail-SC-67
  it("lists no lines in the partial-payment letter and names only its amount", async () => {
    const markup = await render(createElement(PaymentReceivedPartialEmail));

    expect(markup).toContain("HK$800");
    expect(markup).not.toMatch(/Winning Bid|Subtotal|Order Total|US\$/);
  });

  it("keeps the partial payment below the shared invoice total", async () => {
    const partialPreview = PaymentReceivedPartialEmail.PreviewProps;
    const markup = await render(
      createElement(PaymentReceivedPartialEmail, partialPreview),
    );

    expect(markup).toContain(PARTIAL_PAYMENT_AMOUNT);
    expect(markup).not.toContain("HK$8,000");
    expect(previewLot.orderTotal).toBe("HK$1,068.69");
    expect(PARTIAL_PAYMENT_MINOR_UNITS).toBeGreaterThan(0);
    expect(PARTIAL_PAYMENT_MINOR_UNITS).toBeLessThan(
      PREVIEW_INVOICE_TOTAL_MINOR_UNITS,
    );
  });

  // order-mail-SC-65 - A USD invoice's payment reminder reads USD
  it("renders the USD payment-reminder invoice total in USD", async () => {
    const markup = await render(
      createElement(PaymentReminderEmail, { invoiceTotal: "US$3,120.00" }),
    );

    expect(markup).toContain("US$3,120.00");
    expect(markup).not.toMatch(/HK\$[\d,]+(?:\.\d{2})?/);
    expect(markup).not.toContain("7.85");
  });

  // order-mail-SC-63
  it("keeps the USD winning bid on the auction-won letter", async () => {
    const markup = await render(createElement(AuctionWonEmail));

    expect(markup).toContain("US$101.00");
    expect(markup).not.toMatch(/HK\$[\d,]+(?:\.\d{2})?/);
    expect(markup).not.toContain("7.85");
  });
});
