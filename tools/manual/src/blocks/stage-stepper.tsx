import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { artifactLabel } from "../api/change-artifacts";
import {
  draftedOf,
  STAGE_COUNT,
  STAGE_LABEL,
  stageNumber,
} from "../api/stage-view";
import { STAGES } from "../api/stages";
import type { Stage } from "../api/types";
import { StageMark } from "./stage-mark";

/**
 * How far one change has come: one step per stage, the change's stage marked,
 * the agent mark with the hand's move under each of the five an agent drafts,
 * and — under the change's own step — the artifact still holding it back.
 *
 * Two readings of one fact. Eight steps do not fit a phone's width, so below
 * `sm` the stepper reads as one line — the stage's position of eight, its
 * name, and the mark and the move beneath it. Both are rendered and the
 * viewport picks: the alternative is measuring the window, which gives a
 * first paint that is wrong on every phone.
 *
 * One step of eight is a tenth of the reading column, so the eight-step
 * reading takes the short mark — the agent and the hand's move, the whole
 * sentence on hover — and the one line takes the sentence itself.
 */
export function StageStepper({
  stage,
  heldBy,
}: {
  stage: Stage;
  /** The artifact `ladderOf` stopped the walk at — the first thing the next
   * rung owes that is neither written nor waived — where an artifact is what
   * held it rather than a box, a deploy or a cut. */
  heldBy?: string;
}) {
  const at = STAGES.indexOf(stage);
  const held = heldBy ? artifactLabel(heldBy) : undefined;

  return (
    <section aria-label="Stage" className="my-5">
      <div
        className="flex flex-col items-start gap-1.5 sm:hidden"
        data-stepper="one-line"
      >
        <Text as="p" size="sm">
          {`Step ${stageNumber(stage)} of ${STAGE_COUNT} · ${STAGE_LABEL[stage]}`}
        </Text>
        <StageMark stage={stage} />
        {held ? <HeldBy label={held} /> : null}
      </div>

      <div className="hidden sm:block" data-stepper="steps">
        <Stepper>
          {STAGES.map((one, index) => (
            // `Step` takes the design system's own props and no others, so the
            // stage a step stands for is named on a wrapper that is nothing in
            // the layout.
            <div className="contents" data-stage={one} key={one}>
              <Step
                description={
                  index === at ? (
                    // A `span`, not a `div`: the design system draws the
                    // description as a paragraph, so what a step is handed is
                    // inline content however it lays itself out.
                    <span className="flex flex-col items-center gap-1">
                      {draftedOf(one) ? <StageMark short stage={one} /> : null}
                      {held ? <HeldBy label={held} /> : null}
                    </span>
                  ) : draftedOf(one) ? (
                    <StageMark short stage={one} />
                  ) : null
                }
                label={STAGE_LABEL[one]}
                showLeadingConnector={index > 0}
                showTrailingConnector={index < STAGES.length - 1}
                state={
                  index < at
                    ? "completed"
                    : index === at
                      ? "progress"
                      : "upcoming"
                }
              />
            </div>
          ))}
        </Stepper>
      </div>
    </section>
  );
}

/** What the walk stopped at, named beside the stage it stopped on — the one
 * reader of `ChangeEntry.heldBy`. */
function HeldBy({ label }: { label: string }) {
  return (
    <Text as="span" size="xs" tone="secondary">
      {`held by ${label}`}
    </Text>
  );
}
