import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";

/** The seven stages a submission passes, in order. */
type GradingStage =
  | "planned"
  | "booked"
  | "handed-in"
  | "sent"
  | "graded"
  | "back"
  | "home";

const STAGES: readonly GradingStage[] = [
  "planned",
  "booked",
  "handed-in",
  "sent",
  "graded",
  "back",
  "home",
];

type GradingStatusRailCopy = Readonly<Record<GradingStage, string>>;

type GradingStatusRailProps = {
  copy: GradingStatusRailCopy;
  stage: GradingStage;
  /** A submission that ended stays at the stage it ended on. */
  ended?: boolean;
  className?: string;
};

/**
 * Planned, Booked, Handed in, Sent, Graded, Back and Home, with the stage the
 * submission reached marked, every earlier stage done and every later one
 * still to come. An ended submission stays where it ended.
 */
function GradingStatusRail({
  copy,
  stage,
  ended = false,
  className,
}: GradingStatusRailProps) {
  const reached = STAGES.indexOf(stage);

  return (
    <Stepper
      className={className}
      data-ended={ended || undefined}
      data-slot="grading-status-rail"
    >
      {STAGES.map((name, index) => (
        <Step
          key={name}
          label={copy[name]}
          showLeadingConnector={index > 0}
          showTrailingConnector={index < STAGES.length - 1}
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
  );
}

export type { GradingStage, GradingStatusRailCopy, GradingStatusRailProps };
export { GradingStatusRail };
