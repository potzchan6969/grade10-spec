import { StageRail } from "../page-blocks/stage-rail";

/** The seven stages a submission passes, in order. Named as the catalog's
 * `submission.stage` family names them, so a consumer hands the family over
 * rather than reshaping it. */
type GradingStage =
  | "planned"
  | "booked"
  | "handedIn"
  | "sent"
  | "graded"
  | "back"
  | "home";

const STAGES: readonly GradingStage[] = [
  "planned",
  "booked",
  "handedIn",
  "sent",
  "graded",
  "back",
  "home",
];

type GradingStatusRailCopy = Readonly<Record<GradingStage, string>>;

type GradingStatusRailProps = {
  copy: GradingStatusRailCopy;
  stage: GradingStage;
  /** The word that says the submission ended, where it did. It reads under
   * the stage the submission ended on; none of it means the rail runs on. */
  ended?: string;
  className?: string;
};

/**
 * Planned, Booked, Handed in, Sent, Graded, Back and Home, with the stage the
 * submission reached marked, every earlier stage done and every later one
 * still to come.
 *
 * An ended submission stays where it ended and reads the word that says so
 * under that stage, so the ending is on the rail a collector looks at rather
 * than in an attribute only a test can see.
 */
function GradingStatusRail({
  copy,
  stage,
  ended,
  className,
}: GradingStatusRailProps) {
  return (
    <StageRail
      className={className}
      copy={{
        stages: STAGES.map((id) => ({ id, label: copy[id] })),
        ended,
      }}
      current={stage}
      slot="grading-status-rail"
    />
  );
}

export type { GradingStage, GradingStatusRailCopy, GradingStatusRailProps };
export { GradingStatusRail };
