import { Card } from "@grade10/design-system/components/display/card";
import { Step } from "@grade10/design-system/components/display/step";
import type { StepIndicatorState } from "@grade10/design-system/components/display/step-indicator";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowUpRight } from "@phosphor-icons/react";
import type {
  OrderDetailsDeliveryCopy,
  OrderDetailsDeliveryStep,
} from "./types";

type OrderDetailsDeliveryStatusProps = {
  copy: OrderDetailsDeliveryCopy;
  steps: readonly OrderDetailsDeliveryStep[];
  trackOrder?: boolean;
  onTrackOrder?: () => void;
  className?: string;
};

function toStepIndicatorState(
  state: OrderDetailsDeliveryStep["state"],
): StepIndicatorState {
  if (state === "current") return "progress";
  return state ?? "upcoming";
}

/**
 * Displays order delivery/fulfillment progress as a horizontal stepper within
 * a card.
 *
 * Figma set `Product / Order / Order Details Delivery Status` (`5010:6234`).
 * Shown for online orders (delivery and in-store pickup via online purchase);
 * hidden for offline store payment orders. Step labels swap by order type:
 * delivery (`Order Placed → Shipped → Completed`) vs pickup
 * (`Order Placed → Pickup → Completed`). The stepper is
 * display-only — steps are not interactive.
 */
function OrderDetailsDeliveryStatus({
  copy,
  steps,
  trackOrder = false,
  onTrackOrder,
  className,
}: OrderDetailsDeliveryStatusProps) {
  const showTrack = trackOrder && onTrackOrder != null;

  return (
    <div
      className={cn("w-full", className)}
      data-slot="order-details-delivery-status"
    >
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between border-b border-border bg-muted px-6 py-4"
          gap="none"
          vAlign="center"
        >
          <h3 className="text-base leading-6 font-medium text-foreground">
            {copy.title}
          </h3>
          {showTrack ? (
            <Button
              size="md"
              trailing={<ArrowUpRight aria-hidden size={14} weight="bold" />}
              variant="outline"
              onClick={onTrackOrder}
            >
              {copy.trackOrder}
            </Button>
          ) : null}
        </HStack>
        <div className="w-full px-0 py-4">
          <Stepper>
            {steps.map((step, index) => (
              <Step
                description={step.date}
                key={String(step.label)}
                label={step.label}
                showLeadingConnector={index > 0}
                showTrailingConnector={index < steps.length - 1}
                state={toStepIndicatorState(step.state)}
              />
            ))}
          </Stepper>
        </div>
      </Card>
    </div>
  );
}

export type { OrderDetailsDeliveryStatusProps };
export { OrderDetailsDeliveryStatus };
