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
    "HK$1,031.00",
  ],
  [
    "day-three payment reminder",
    () => createElement(PaymentReminderEmail, { urgency: "day3" }),
    "HK$1,031.00",
  ],
  [
    "day-six payment reminder",
    () => createElement(PaymentReminderEmail, { urgency: "day6" }),
    "HK$1,031.00",
  ],
  [
    "final payment reminder",
    () => createElement(PaymentReminderEmail, { urgency: "final" }),
    "HK$1,031.00",
  ],
  ["payment overdue", () => createElement(PaymentOverdueEmail), "HK$1,031.00"],
  [
    "payment received",
    () => createElement(PaymentReceivedEmail),
    "HK$1,031.00",
  ],
  [
    "partial payment received",
    () => createElement(PaymentReceivedPartialEmail),
    "HK$800",
  ],
];

const PARTIAL_PAYMENT_AMOUNT = "HK$800";
const PARTIAL_PAYMENT_MINOR_UNITS = 80_000;
const PREVIEW_INVOICE_TOTAL_MINOR_UNITS = 103_100;

describe("auction order letter previews", () => {
  // order-mail-SC-64, order-mail-SC-66, order-mail-SC-67, order-mail-SC-68
  it.each(HKD_AFTER_SETUP_LETTERS)(
    "renders the %s preview in HKD without a USD bid or conversion rate",
    async (_name, makeEmail, expectedAmount) => {
      const markup = await render(makeEmail());

      expect(markup).toContain(expectedAmount);
      expect(markup).not.toMatch(/\bUSD\b|US\$/);
      expect(markup).not.toContain("7.85");
    },
  );

  it("keeps the partial payment below the shared invoice total", async () => {
    const partialPreview = PaymentReceivedPartialEmail.PreviewProps;
    const markup = await render(
      createElement(PaymentReceivedPartialEmail, partialPreview),
    );

    expect(markup).toContain(PARTIAL_PAYMENT_AMOUNT);
    expect(markup).not.toContain("HK$8,000");
    expect(previewLot.orderTotal).toBe("HK$1,031.00");
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
