import type {
  OrderDetailsDelivery,
  OrderDetailsDeliveryStep,
  OrderDetailsDeliveryStepState,
  OrderDetailsFulfillmentStatus,
} from "./types";

type ThreeStepStates = readonly [
  OrderDetailsDeliveryStepState,
  OrderDetailsDeliveryStepState,
  OrderDetailsDeliveryStepState,
];

function deliveryStepStates(
  variant: OrderDetailsDelivery["variant"],
  status: OrderDetailsFulfillmentStatus,
): ThreeStepStates {
  if (status === "completed" || status === "refunded") {
    return ["completed", "completed", "completed"];
  }

  if (status === "canceled") {
    return ["completed", "upcoming", "upcoming"];
  }

  if (variant === "pickup") {
    if (status === "pickup") {
      return ["completed", "current", "upcoming"];
    }
    return ["completed", "upcoming", "upcoming"];
  }

  if (status === "shipped") {
    return ["completed", "current", "upcoming"];
  }

  return ["completed", "upcoming", "upcoming"];
}

/**
 * Derives stepper indicator states from fulfillment status and order channel.
 * Labels and dates come from the consumer; states follow the status so an
 * upcoming milestone is never highlighted as the current one.
 */
function resolveDeliverySteps(
  delivery: OrderDetailsDelivery,
  status: OrderDetailsFulfillmentStatus,
): readonly (OrderDetailsDeliveryStep & {
  state: OrderDetailsDeliveryStepState;
})[] {
  const states = deliveryStepStates(delivery.variant, status);

  return delivery.steps.map((step, index) => {
    const state = states[index] ?? "upcoming";
    return {
      ...step,
      state,
      date: state === "upcoming" ? undefined : step.date,
    };
  });
}

export { deliveryStepStates, resolveDeliverySteps };
