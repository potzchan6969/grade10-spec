import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
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
 * pill. So the caption there is the design system's own `Text` rather than a
 * badge wearing overrides: the words `agent drafts · <move>`, the agent's mark
 * between them in an `sr-only` span so a screen reader still hears the whole
 * sentence, and that sentence on the element's `title` for a pointer. The dot
 * sits in the same text run as the move, so a caption that wraps never leaves
 * it hanging. The lane heading and the one-line stepper have the width, and
 * read the sentence itself.
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
    return (
      <Text
        as="span"
        size="xs"
        title={`agent drafts ${drafted.mark} · ${move}`}
        tone="secondary"
      >
        {"agent drafts"}
        <span className="sr-only">{` ${drafted.mark}`}</span>
        {` · ${move}`}
      </Text>
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
