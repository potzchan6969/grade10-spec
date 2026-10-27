import { describe, expect, it } from "vitest";
import { FILLED_DELIVERY } from "./fixtures";
import { resolveDeliverySteps } from "./resolve-delivery-steps";

describe("resolveDeliverySteps", () => {
  it("draws steps whose states the consumer supplied, dates included", () => {
    const steps = [
      { label: "Order Placed", date: "26 Aug", state: "completed" },
      { label: "Shipping", date: "SF Express · SF123", state: "current" },
      {
        label: "Completed",
        date: "Estimated delivery: 12 Sep",
        state: "upcoming",
      },
    ] as const;

    expect(
      resolveDeliverySteps({ variant: "delivery", steps }, "completed"),
    ).toEqual(steps);
  });

  it("derives states from the status when no step states one", () => {
    expect(
      resolveDeliverySteps(FILLED_DELIVERY, "processing").map(
        (step) => step.state,
      ),
    ).toEqual(["completed", "upcoming", "upcoming"]);
  });

  it("derives every state when only some steps state one", () => {
    const delivery = {
      ...FILLED_DELIVERY,
      steps: FILLED_DELIVERY.steps.map((step, index) =>
        index === 2 ? { ...step, state: "current" as const } : step,
      ),
    };

    expect(
      resolveDeliverySteps(delivery, "shipped").map((step) => step.state),
    ).toEqual(["completed", "current", "upcoming"]);
  });
});
