import { Badge } from "@grade10/design-system/components/display/badge";
import { draftedOf, moveShown } from "../api/stage-view";
import type { Stage } from "../api/types";

/**
 * What the change's agent drafts at one stage, and what the hand does about
 * it — on the lane heading and under the stepper's step.
 *
 * The text carries the meaning and nothing beside it does: the design system
 * draws no hollow dashed dot, and a variant Figma does not define is not ours
 * to add. Nothing where the stage is drafted by nobody — On staging, Released
 * and Archived are a deploy, a cut and a fold.
 */
export function StageMark({ stage }: { stage: Stage }) {
  const drafted = draftedOf(stage);
  if (!drafted) return null;

  return (
    <Badge
      className="max-w-full whitespace-normal text-left"
      size="sm"
      title="The change's agent writes this stage; the hand of the stage answers"
      variant="outline"
    >
      <span>{`agent drafts ${drafted.mark}`}</span>
      <span aria-hidden>·</span>
      <span>{moveShown(drafted.moves)}</span>
    </Badge>
  );
}
