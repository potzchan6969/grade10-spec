import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { cn } from "@grade10/design-system/lib/utils";

/** One stage: its id, and its label in the consumer's words. */
type VaultStage = { id: string; label: string };

type VaultStageRailCopy = {
  /** Every stage, in the order a case or a request walks them. */
  stages: readonly VaultStage[];
  /** The word that says the case ended, read under the stage it ended at. */
  ended?: string;
};

type VaultStageRailProps = {
  copy: VaultStageRailCopy;
  /** The id of the stage reached. */
  current: string;
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
function VaultStageRail({ copy, current, className }: VaultStageRailProps) {
  const reached = copy.stages.findIndex((stage) => stage.id === current);
  if (reached < 0) {
    throw new Error(
      `VaultStageRail: stage "${current}" is not one of ${copy.stages
        .map((stage) => stage.id)
        .join(", ")}`,
    );
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: the rail scrolls sideways on a narrow screen, and a scroll container takes focus so a keyboard can scroll it.
    <div className={cn("w-full overflow-x-auto", className)} tabIndex={0}>
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

export type { VaultStage, VaultStageRailCopy, VaultStageRailProps };
export { VaultStageRail };
