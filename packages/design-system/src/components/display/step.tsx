import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { StepIndicator, type StepIndicatorState } from "./step-indicator";

type StepProps = {
  label: ReactNode;
  description?: ReactNode;
  state?: StepIndicatorState;
  showLeadingConnector?: boolean;
  showTrailingConnector?: boolean;
  className?: string;
};

function StepConnector({ hidden }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px min-w-0 flex-1 border-t border-border",
        hidden && "opacity-0",
      )}
    />
  );
}

/**
 * A single step within a `Stepper`: indicator, connector lines, label, and
 * optional description.
 *
 * Figma set `Step` (`5010:5711`). Display-only — steps are not interactive.
 * Hide the leading connector on the first step and the trailing connector on
 * the last.
 */
function Step({
  label,
  description,
  state = "upcoming",
  showLeadingConnector = true,
  showTrailingConnector = true,
  className,
}: StepProps) {
  const isUpcoming = state === "upcoming";

  return (
    <VStack
      className={cn("min-w-0 flex-1 py-2", className)}
      data-slot="step"
      data-state={state}
      gap="sm"
      hAlign="center"
      vAlign="start"
    >
      <HStack className="w-full" gap="none" vAlign="center">
        <StepConnector hidden={!showLeadingConnector} />
        <StepIndicator state={state} />
        <StepConnector hidden={!showTrailingConnector} />
      </HStack>
      <VStack className="px-2 text-center" gap="none" hAlign="center">
        <p
          className={cn(
            "text-sm leading-5 font-medium whitespace-nowrap",
            /* Completed and progress share full-strength labels; only upcoming is dimmed. */
            isUpcoming ? "text-secondary-foreground" : "text-foreground",
          )}
        >
          {label}
        </p>
        {description != null ? (
          <p className="text-xs leading-4 whitespace-nowrap text-secondary-foreground">
            {description}
          </p>
        ) : null}
      </VStack>
    </VStack>
  );
}

export type { StepProps };
export { Step };
