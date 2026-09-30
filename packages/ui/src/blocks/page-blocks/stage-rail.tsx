import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { cn } from "@grade10/design-system/lib/utils";

/** One stage: its id, and its label in the consumer's words. */
type StageRailStage = { id: string; label: string };

type StageRailCopy = {
  /** Every stage, in the order a case or a request walks them. */
  stages: readonly StageRailStage[];
  /** The word that says the case ended, read under the stage it ended at. */
  ended?: string;
};

type StageRailProps = {
  copy: StageRailCopy;
  /** The id of the stage reached. */
  current: string;
  /** The `data-slot` the consumer finds this rail by. */
  slot?: string;
  className?: string;
};

/**
 * How far along its stages a case or a request is: every earlier stage done,
 * the one reached in progress, every later one still to come. An ended case
 * stays where it ended, with the word that says so under that stage.
 *
 * A stage the list does not hold is refused by name rather than drawn as
 * nothing reached. On a screen narrower than its labels the rail scrolls
 * sideways inside itself, so the page never does.
 */
function StageRail({ copy, current, slot, className }: StageRailProps) {
  const reached = copy.stages.findIndex((stage) => stage.id === current);
  if (reached < 0) {
    throw new Error(
      `StageRail: stage "${current}" is not one of ${copy.stages
        .map((stage) => stage.id)
        .join(", ")}`,
    );
  }

  return (
    <div
      className={cn("w-full overflow-x-auto", className)}
      data-slot={slot}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the rail scrolls sideways on a narrow screen, and a scroll container takes focus so a keyboard can scroll it.
      tabIndex={0}
    >
      <Stepper className="min-w-max">
        {copy.stages.map((stage, index) => (
          <Step
            description={index === reached ? copy.ended : undefined}
            key={stage.id}
            label={stage.label}
            showLeadingConnector={index > 0}
            showTrailingConnector={index < copy.stages.length - 1}
            state={
              index < reached
                ? "completed"
                : index === reached
                  ? "progress"
                  : "upcoming"
            }
          />
        ))}
      </Stepper>
    </div>
  );
}

export type { StageRailCopy, StageRailProps, StageRailStage };
export { StageRail };
