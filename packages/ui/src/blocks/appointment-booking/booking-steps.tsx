import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { BookingStep } from "./types";

const STEPS: readonly BookingStep[] = [
  "service",
  "location",
  "day",
  "time",
  "details",
];

type BookingStepsCopy = {
  steps: Record<BookingStep, string>;
  back: string;
};

type BookingStepsProps = {
  copy: BookingStepsCopy;
  current: BookingStep;
  /** Reported with the step before the current one. Omit it on the first
   * step, or when there is no way back, and no control renders. */
  onBack?: (step: BookingStep) => void;
  className?: string;
};

/** Where the collector is in the flow, and the way back. */
function BookingSteps({ copy, current, onBack, className }: BookingStepsProps) {
  const index = STEPS.indexOf(current);
  const previous = index > 0 ? STEPS[index - 1] : undefined;
  return (
    <VStack className={className} data-slot="booking-steps" gap="sm">
      <Stepper>
        {STEPS.map((step, at) => (
          <Step
            key={step}
            label={copy.steps[step]}
            showLeadingConnector={at > 0}
            showTrailingConnector={at < STEPS.length - 1}
            state={
              at < index ? "completed" : at === index ? "progress" : "upcoming"
            }
          />
        ))}
      </Stepper>
      {previous && onBack ? (
        <Button
          onClick={() => onBack(previous)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {copy.back}
        </Button>
      ) : null}
    </VStack>
  );
}

export type { BookingStepsCopy, BookingStepsProps };
export { BookingSteps };
