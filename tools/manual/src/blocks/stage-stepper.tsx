import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
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
 * and the agent mark with the hand's move under each of the five an agent
 * drafts.
 *
 * Two readings of one fact. Eight steps do not fit a phone's width, so below
 * `sm` the stepper reads as one line — the stage's position of eight, its
 * name, and the mark and the move beneath it. Both are rendered and the
 * viewport picks: the alternative is measuring the window, which gives a
 * first paint that is wrong on every phone.
 */
export function StageStepper({ stage }: { stage: Stage }) {
  const at = STAGES.indexOf(stage);

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
      </div>

      <div className="hidden sm:block" data-stepper="steps">
        <Stepper>
          {STAGES.map((one, index) => (
            // `Step` takes the design system's own props and no others, so the
            // stage a step stands for is named on a wrapper that is nothing in
            // the layout.
            <div className="contents" data-stage={one} key={one}>
              <Step
                description={draftedOf(one) ? <StageMark stage={one} /> : null}
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
