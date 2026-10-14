import { Card } from "@grade10/design-system/components/display/card";
import { Step } from "@grade10/design-system/components/display/step";
import type { StepIndicatorState } from "@grade10/design-system/components/display/step-indicator";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useLayoutEffect, useRef } from "react";
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
 * delivery (`Order Placed → Shipping → Completed`) vs pickup
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
  const railRef = useRef<HTMLDivElement>(null);
  const currentIndex = steps.findIndex((step) => step.state === "current");

  // Same rail as Winner Order's Order Progress: nowrap step labels cannot
  // share a narrow viewport, so the stepper scrolls sideways under sm and the
  // current step is scrolled into view.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-centre when the current step moves
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let settled = false;
    let raf = 0;
    const mq = window.matchMedia("(min-width: 640px)");
    const ro = new ResizeObserver(() => {
      if (!settled) scrollFocusIntoView();
    });

    // The current step, or the last completed one once every step is done.
    function scrollFocusIntoView() {
      if (!rail) return;
      if (mq.matches) {
        settled = true;
        ro.disconnect();
        return;
      }
      const completed = rail.querySelectorAll<HTMLElement>(
        '[data-slot="step"][data-state="completed"]',
      );
      const target =
        rail.querySelector<HTMLElement>(
          '[data-slot="step"][data-state="progress"]',
        ) ?? completed[completed.length - 1];
      const max = rail.scrollWidth - rail.clientWidth;
      // Overflow can open a frame late (fonts, reveal, viewport).
      if (!target || max <= 0) return;
      const left =
        target.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft;
      rail.scrollLeft = Math.min(
        max,
        Math.max(0, left + target.offsetWidth / 2 - rail.clientWidth / 2),
      );
      settled = true;
      ro.disconnect();
    }

    const arm = () => {
      settled = false;
      ro.observe(rail);
      scrollFocusIntoView();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scrollFocusIntoView);
    };

    arm();
    mq.addEventListener("change", arm);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mq.removeEventListener("change", arm);
    };
  }, [currentIndex]);

  return (
    <div
      className={cn("w-full", className)}
      data-slot="order-details-delivery-status"
    >
      <Card className="gap-0 overflow-hidden p-0" padding={false}>
        <HStack
          className="w-full justify-between gap-3 border-b border-border bg-muted px-4 py-3 sm:px-6 sm:py-4"
          gap="none"
          vAlign="center"
        >
          <h2 className="min-w-0 text-base leading-6 font-medium text-foreground">
            {copy.title}
          </h2>
          {showTrack ? (
            <Button
              className="shrink-0"
              size="md"
              trailing={<ArrowUpRight aria-hidden size={14} weight="bold" />}
              variant="outline"
              onClick={onTrackOrder}
            >
              {copy.trackOrder}
            </Button>
          ) : null}
        </HStack>
        <div
          className="w-full overflow-x-auto overscroll-x-contain px-2 py-3 sm:px-0 sm:py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-slot="order-details-delivery-rail"
          ref={railRef}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the rail scrolls sideways on a narrow screen, and a scroll container takes focus so a keyboard can scroll it.
          tabIndex={0}
        >
          <Stepper
            aria-label={copy.title}
            className="min-w-max sm:min-w-0 sm:w-full"
          >
            {steps.map((step, index) => (
              <Step
                className="w-30 min-w-30 flex-none basis-30 sm:w-auto sm:min-w-0 sm:flex-1 sm:basis-0"
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
