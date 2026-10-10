import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { StepIndicator, type StepIndicatorState } from "./step-indicator";

type StepOrientation = "horizontal" | "vertical";

type StepProps = {
  label: ReactNode;
  description?: ReactNode;
  state?: StepIndicatorState;
  orientation?: StepOrientation;
  showLeadingConnector?: boolean;
  showTrailingConnector?: boolean;
  className?: string;
};

function StepConnector({
  hidden,
  leading = false,
  orientation,
}: {
  hidden?: boolean;
  leading?: boolean;
  orientation: StepOrientation;
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      aria-hidden
      className={cn(
        "border-border",
        isHorizontal && "h-px min-w-0 flex-1 border-t",
        !isHorizontal && "w-px min-h-0 border-l",
        !isHorizontal && leading ? "h-0.5 flex-none" : "flex-1",
        hidden && "opacity-0",
      )}
    />
  );
}

/**
 * A single step within a `Stepper`: indicator, connector lines, label, and
 * optional description.
 *
 * Figma set `Step` (`5010:5711`). Axes: `upcoming` (boolean) and `orientation`
 * (`horizontal` | `vertical`). Display-only — steps are not interactive. Hide
 * the leading connector on the first step and the trailing connector on the
 * last.
 *
 * Each step is an item of `Stepper`'s ordered list, and the one in progress
 * carries `aria-current="step"`. The indicator is decorative, so without those
 * two a reader reaches the labels with nothing saying which one is current.
 */
function Step({
  label,
  description,
  state = "upcoming",
  orientation = "horizontal",
  showLeadingConnector = true,
  showTrailingConnector = true,
  className,
}: StepProps) {
  const isUpcoming = state === "upcoming";
  const isHorizontal = orientation === "horizontal";

  return (
    <li
      aria-current={state === "progress" ? "step" : undefined}
      className={cn(
        "flex min-w-0 gap-2",
        isHorizontal
          ? "flex-1 flex-col items-center justify-start py-2"
          : "min-h-16 w-full flex-row items-stretch",
        className,
      )}
      data-slot="step"
      data-state={state}
      data-orientation={orientation}
    >
      {isHorizontal ? (
        <>
          <HStack className="w-full" gap="none" vAlign="center">
            <StepConnector
              orientation="horizontal"
              hidden={!showLeadingConnector}
            />
            <StepIndicator state={state} />
            <StepConnector
              orientation="horizontal"
              hidden={!showTrailingConnector}
            />
          </HStack>
          <VStack className="px-2 text-center" gap="none" hAlign="center">
            <p
              className={cn(
                "text-sm leading-5 font-medium whitespace-nowrap transition-colors duration-200 ease-out motion-reduce:transition-none",
                /* Completed and progress share full-strength labels; only upcoming is dimmed. */
                isUpcoming ? "text-secondary-foreground" : "text-foreground",
              )}
            >
              {label}
            </p>
            {description != null ? (
              <p className="max-w-full text-xs leading-4 text-balance text-secondary-foreground transition-opacity duration-200 ease-out motion-reduce:transition-none">
                {description}
              </p>
            ) : null}
          </VStack>
        </>
      ) : (
        <>
          <VStack className="self-stretch" gap="none" hAlign="center">
            <StepConnector
              leading
              orientation="vertical"
              hidden={!showLeadingConnector}
            />
            <StepIndicator state={state} />
            <StepConnector
              orientation="vertical"
              hidden={!showTrailingConnector}
            />
          </VStack>
          <VStack className="flex-1" gap="none" hAlign="start" vAlign="start">
            <p
              className={cn(
                "text-sm leading-5 font-medium whitespace-nowrap transition-colors duration-200 ease-out motion-reduce:transition-none",
                isUpcoming ? "text-secondary-foreground" : "text-foreground",
              )}
            >
              {label}
            </p>
            {description != null ? (
              <p className="max-w-full text-xs leading-4 text-balance text-secondary-foreground transition-opacity duration-200 ease-out motion-reduce:transition-none">
                {description}
              </p>
            ) : null}
          </VStack>
        </>
      )}
    </li>
  );
}

export type { StepProps };
export { Step };
