import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrderDetailsPaymentLogo } from "./order-details-payment-logo";

import type { OrderDetailsPaymentBrand } from "./types";

describe("OrderDetailsPaymentLogo", () => {
  it.each([
    ["jcb", "JCB"],
    ["unionpay", "UnionPay"],
    ["discover", "Discover"],
    ["diners", "Diners Club"],
  ] as const)("draws the %s mark named %s", (brand, name) => {
    const html = renderToStaticMarkup(
      createElement(OrderDetailsPaymentLogo, {
        brand: brand as OrderDetailsPaymentBrand,
      }),
    );
    expect(html).toContain(`aria-label="${name}"`);
    expect(html).toContain('role="img"');
  });
});

describe("OrderDetailsPaymentLogo for a card of no known brand", () => {
  it("draws a plain card mark that leaves the name to the masked number", () => {
    const html = renderToStaticMarkup(
      createElement(OrderDetailsPaymentLogo, {
        brand: "card" as OrderDetailsPaymentBrand,
      }),
    );
    expect(html).toContain("<svg");
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
  });
});
