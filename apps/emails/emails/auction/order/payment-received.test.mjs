import { createElement } from "react";
import { render } from "react-email";
import { describe, expect, it } from "vitest";
import PaymentReceivedEmail from "./payment-received";

describe("PaymentReceivedEmail preview", () => {
  // order-mail-SC-66
  it("renders the HKD payment received letter without a USD bid or conversion rate", async () => {
    const markup = await render(createElement(PaymentReceivedEmail));

    expect(markup).toContain("HK$1,031.00");
    expect(markup).not.toMatch(/\bUSD\b|US\$/);
    expect(markup).not.toContain("7.85");
  });
});
