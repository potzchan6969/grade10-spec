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

type ResolvedDeliveryStep = OrderDetailsDeliveryStep & {
  state: OrderDetailsDeliveryStepState;
};

function hasState(
  step: OrderDetailsDeliveryStep,
): step is ResolvedDeliveryStep {
  return step.state != null;
}

/**
 * Stepper indicator states for a delivery card. A consumer that knows where
 * the parcel is states every step itself, and those steps are drawn as
 * supplied. Otherwise states follow the order status as a fallback, so an
 * upcoming milestone is never highlighted as the current one.
 */
function resolveDeliverySteps(
  delivery: OrderDetailsDelivery,
  status: OrderDetailsFulfillmentStatus,
): readonly ResolvedDeliveryStep[] {
  if (delivery.steps.length > 0 && delivery.steps.every(hasState)) {
    return delivery.steps.filter(hasState);
  }

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
