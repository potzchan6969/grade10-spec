import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FILLED_LINES, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetails } from "./order-details";

import type { OrderDetailsDelivery } from "./types";

function stepsOf(
  delivery: OrderDetailsDelivery,
  status: "shipped" | "canceled",
) {
  const html = renderToStaticMarkup(
    createElement(OrderDetails, {
      copy: ORDER_DETAILS_COPY,
      orderId: "Order #G10-10482",
      status,
      placedOn: "Placed on 26 Aug 2026",
      delivery,
      lines: FILLED_LINES,
    }),
  );
  const steps = [
    ...html.matchAll(/data-slot="step"[^>]*data-state="(\w+)"/g),
  ].map((match) => match[1]);
  return { html, steps };
}

describe("OrderDetails delivery steps", () => {
  it("draws supplied states over the status, keeping an unreached step's estimate", () => {
    const { html, steps } = stepsOf(
      {
        variant: "delivery",
        steps: [
          { label: "Order Placed", date: "26 Aug", state: "completed" },
          { label: "Shipping", date: "SF Express · SF123", state: "current" },
          {
            label: "Completed",
            date: "Estimated delivery: 2 Sep",
            state: "upcoming",
          },
        ],
      },
      "shipped",
    );

    expect(steps).toEqual(["completed", "progress", "upcoming"]);
    expect(html).toContain("Estimated delivery: 2 Sep");
  });

  it("draws a supplied two-step ending", () => {
    const { html, steps } = stepsOf(
      {
        variant: "delivery",
        steps: [
          { label: "Order Placed", date: "26 Aug", state: "completed" },
          { label: "Canceled", date: "27 Aug", state: "completed" },
        ],
      },
      "canceled",
    );

    expect(steps).toEqual(["completed", "completed"]);
    expect(html).toContain("Canceled");
  });
});
