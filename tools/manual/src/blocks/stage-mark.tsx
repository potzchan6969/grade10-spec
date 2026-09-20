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
 *
 * `short` is the eight-step stepper's reading: one step of eight is a tenth of
 * the reading column, and the whole sentence in it came out as a truncated
 * pill. So the caption there is the agent and the hand's move, the sentence
 * stays on the element as its `title` and its `aria-label`, and what is left
 * wraps rather than clips. The lane heading and the one-line stepper have the
 * width, and read the sentence itself.
 */
export function StageMark({
  stage,
  short = false,
}: {
  stage: Stage;
  short?: boolean;
}) {
  const drafted = draftedOf(stage);
  if (!drafted) return null;
  const move = moveShown(drafted.moves);

  if (short) {
    const whole = `agent drafts ${drafted.mark} · ${move}`;
    return (
      <Badge
        aria-label={whole}
        className="h-auto min-h-5 max-w-full flex-wrap whitespace-normal py-0.5"
        size="sm"
        title={whole}
        variant="outline"
      >
        <span>agent drafts</span>
        {/* The separator travels with the move, so a caption that wraps
         * breaks between the two rather than leaving the dot hanging at the
         * end of the first line. */}
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>·</span>
          <span>{move}</span>
        </span>
      </Badge>
    );
  }

  return (
    <Badge
      className="max-w-full whitespace-normal text-left"
      size="sm"
      title="The change's agent writes this stage; the hand of the stage answers"
      variant="outline"
    >
      <span>{`agent drafts ${drafted.mark}`}</span>
      <span aria-hidden>·</span>
      <span>{move}</span>
    </Badge>
  );
}
