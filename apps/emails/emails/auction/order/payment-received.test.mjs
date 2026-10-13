import { createElement } from "react";
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import AuctionWonEmail from "./auction-won";
import PaymentOverdueEmail from "./payment-overdue";
import PaymentReceivedPartialEmail from "./payment-received-partial";
import PaymentReceivedEmail from "./payment-received";
import PaymentReminderEmail from "./payment-reminder";

const HKD_AFTER_SETUP_LETTERS = [
  ["payment reminder", createElement(PaymentReminderEmail), "HK$1,031.00"],
  [
    "day-three payment reminder",
    createElement(PaymentReminderEmail, { urgency: "day3" }),
    "HK$1,031.00",
  ],
  [
    "day-six payment reminder",
    createElement(PaymentReminderEmail, { urgency: "day6" }),
    "HK$1,031.00",
  ],
  [
    "final payment reminder",
    createElement(PaymentReminderEmail, { urgency: "final" }),
    "HK$1,031.00",
  ],
  ["payment overdue", createElement(PaymentOverdueEmail), "HK$1,031.00"],
  ["payment received", createElement(PaymentReceivedEmail), "HK$1,031.00"],
  [
    "partial payment received",
    createElement(PaymentReceivedPartialEmail),
    "HK$8,000",
  ],
];

describe("auction order letter previews", () => {
  // order-mail-SC-64, order-mail-SC-66, order-mail-SC-67, order-mail-SC-68
  it.each(HKD_AFTER_SETUP_LETTERS)(
    "renders the %s preview in HKD without a USD bid or conversion rate",
    async (_name, email, expectedAmount) => {
      const markup = await render(email);

      expect(markup).toContain(expectedAmount);
      expect(markup).not.toMatch(/\bUSD\b|US\$/);
      expect(markup).not.toContain("7.85");
    },
  );

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
