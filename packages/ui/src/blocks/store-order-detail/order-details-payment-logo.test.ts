import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrderDetailsPaymentLogo } from "./order-details-payment-logo";

import type { OrderDetailsPaymentBrand } from "./types";

describe("OrderDetailsPaymentLogo", () => {
  it.each([
    ["jcb", "JCB"],
    ["unionpay", "UnionPay"],
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
