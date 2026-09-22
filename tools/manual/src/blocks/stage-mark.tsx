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
 * Both branches show the same words, `agent drafts · <move>`, with the
 * agent's mark in an `sr-only` span between them so a screen reader still
 * hears the whole sentence, and that sentence on the element's `title` for a
 * pointer. The dot sits in the same text run as the move, so a caption that
 * wraps never leaves it hanging.
 *
 * `short` is the eight-step stepper's own per-step caption: one step of eight
 * is a tenth of the reading column, with no room for a pill, so it takes the
 * design system's own `Text`. The lane heading and the one-line stepper take
 * `Badge` instead, its height freed to grow rather than clip where the
 * sentence wraps.
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
  const said = `agent drafts ${drafted.mark}`;

  if (short) {
    return (
      <Text as="span" size="xs" title={`${said} · ${move}`} tone="secondary">
        {"agent drafts"}
        <span className="sr-only">{` ${drafted.mark}`}</span>
        {` · ${move}`}
      </Text>
    );
  }

  return (
    <Badge
      className="h-auto max-w-full whitespace-normal py-0.5 text-left"
      size="sm"
      title={`${said} · ${move}`}
      variant="outline"
    >
      {"agent drafts"}
      <span className="sr-only">{` ${drafted.mark}`}</span>
      {` · ${move}`}
    </Badge>
  );
}
