import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { walkCases } from "../grading-play";
import { PlanStep } from "./planning-views";

const meta = {
  title: "Grading/Planning/Flows/Planning a Submission",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LISTS_BY_HAND = [
  ["The cards", "cards"],
  ["The service", "service"],
  ["Book", "book"],
] as const;

const COST_BEFORE_SIGN_IN = [
  ["The fee sheet", "fee-sheet"],
  ["The cards", "cards"],
] as const;

const DEALER_BULK = [
  ["The cards", "cards"],
  ["Bulk only", "service-bulk"],
] as const;

const LEVEL_CLOSED = [
  ["The service", "service"],
  ["Level closed", "service-closed"],
] as const;

const REVIEW_BEFORE_BOOKING = [
  ["The service", "service"],
  ["The review", "book-upcharge"],
] as const;

const titles = (cases: readonly (readonly [string, string])[]) =>
  cases.map(([title]) => title);

/** Collector lists a few cards by hand, chooses the service, then reads the review. */
export const ListsByHand: Story = {
  parameters: { journeys: ["grade10-site-grading-submission-plan-US-02"] },
  render: () => (
    <FlowContainer
      cases={LISTS_BY_HAND}
      description={
        <p>
          The cards are listed one block each, the level is chosen on the
          declared value, and the book step shows the schedule and the totals
          before anything is booked.
        </p>
      }
    >
      {(state) => <PlanStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(LISTS_BY_HAND)),
};

/** Collector learns what grading costs before signing in: the fee sheet, then the first step. */
export const CostBeforeSignIn: Story = {
  parameters: { journeys: ["grade10-site-grading-submission-plan-US-01"] },
  render: () => (
    <FlowContainer
      cases={COST_BEFORE_SIGN_IN}
      description={
        <p>
          The first visit says what grading is, the four steps, the fee a card,
          the cover line and the return estimate. Only then does the first step
          ask for a name.
        </p>
      }
    >
      {(state) => <PlanStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) =>
    walkCases(canvasElement, titles(COST_BEFORE_SIGN_IN)),
};

/** Dealer submits a box of cards at Bulk: above 20 cards only Bulk is open. */
export const DealerBulk: Story = {
  parameters: { journeys: ["grade10-site-grading-submission-plan-US-04"] },
  render: () => (
    <FlowContainer
      cases={DEALER_BULK}
      description={
        <p>
          Twenty cards or more leave Bulk the only level open, with its longer
          drop-off and a fee a card that is lower than the single levels.
        </p>
      }
    >
      {(state) => <PlanStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(DEALER_BULK)),
};

/** Collector sees why a level is closed: the card or the count that closes it is named. */
export const LevelClosed: Story = {
  parameters: { journeys: ["grade10-site-grading-submission-plan-US-05"] },
  render: () => (
    <FlowContainer
      cases={LEVEL_CLOSED}
      description={
        <p>
          A closed level names its reason: the card declared above its ceiling,
          or Bulk with fewer than 20 cards. The open levels remain choosable.
        </p>
      }
    >
      {(state) => <PlanStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(LEVEL_CLOSED)),
};

/** Collector reads the review before booking: the totals, the upcharge warning and the terms. */
export const ReviewBeforeBooking: Story = {
  parameters: { journeys: ["grade10-site-grading-submission-plan-US-07"] },
  render: () => (
    <FlowContainer
      cases={REVIEW_BEFORE_BOOKING}
      description={
        <p>
          The review shows the schedule, the totals, the good-to-know lines and
          the consent line. A card that may move up a level is named with the
          difference due at the counter.
        </p>
      }
    >
      {(state) => <PlanStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) =>
    walkCases(canvasElement, titles(REVIEW_BEFORE_BOOKING)),
};
