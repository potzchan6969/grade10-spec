import type { Meta, StoryObj } from "@storybook/react-vite";
import { expectPage } from "../../../pages/grading/grading-play";
import {
  GradingPageHeader,
  GradingPageShell,
  PrototypeNote,
} from "../../../pages/grading/grading-shared";
import {
  PLAN_BOOK_DROP_OFF_STORY_ID,
  PLAN_COPY,
  PLAN_STORY_IDS,
  PLANNING_MANUAL_PATH,
  type PlanState,
} from "../../../pages/grading/planning/planning-content";
import { PlanStep } from "../../../pages/grading/planning/planning-views";
import { navigateToStory } from "../../../pages/workbench-story-nav";

/** The step each state's primary action leads to, in the wireframe. */
const NEXT_STEP: Partial<Record<PlanState, string>> = {
  "fee-sheet": PLAN_STORY_IDS.cards,
  cards: PLAN_STORY_IDS.service,
  service: PLAN_STORY_IDS.book,
  "service-closed": PLAN_STORY_IDS.book,
  "service-bulk": PLAN_STORY_IDS.book,
};

/** Planning a submission: the cards, the service, then the book step. A wireframe. */
function PlanSubmissionPrototype({ state }: { state: PlanState }) {
  const next = NEXT_STEP[state];
  return (
    <GradingPageShell>
      <PrototypeNote
        manualPath={PLANNING_MANUAL_PATH}
        settles="how the wizard's pages lay out on a phone, and how the schedule and the upcharge warning sit on the book step."
      />
      <GradingPageHeader
        description={PLAN_COPY.description}
        title={PLAN_COPY.title}
      />
      <PlanStep
        onBook={() => navigateToStory(PLAN_BOOK_DROP_OFF_STORY_ID)}
        onContinue={next ? () => navigateToStory(next) : undefined}
        state={state}
      />
    </GradingPageShell>
  );
}

const meta = {
  title: "Grading/Planning/Prototypes/Plan Submission",
  component: PlanSubmissionPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: ({ canvasElement }) => expectPage(canvasElement, "Plan a submission"),
} satisfies Meta<typeof PlanSubmissionPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before any sign-in: what grading is, the four steps and the fee sheet with its cover line. */
export const FeeSheet: Story = { args: { state: "fee-sheet" } };

/** The cards: contact details, then one block per card with its declared value. */
export const Cards: Story = { args: { state: "cards" } };

/** The service: the grader and the level, with the estimate for the cards. */
export const Service: Story = { args: { state: "service" } };

/** A card above Regular's ceiling: the levels it closes name the card that closes them. */
export const ServiceClosed: Story = { args: { state: "service-closed" } };

/** More than 20 cards: Bulk is the only level open. */
export const ServiceBulk: Story = { args: { state: "service-bulk" } };

/** The book step: the schedule, the totals, the good-to-know lines and the consent. */
export const Book: Story = { args: { state: "book" } };

/** A card may move up a level at the grader: the difference is named before booking. */
export const BookUpcharge: Story = { args: { state: "book-upcharge" } };
