import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { walkCases } from "../grading-play";
import { SubmissionStatusPanel } from "./submission-views";

const meta = {
  title: "Grading/Submission/Flows/Submission Lifecycle",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FOLLOWS_TO_HOME = [
  ["Planned", "planned"],
  ["Booked", "booked"],
  ["Handed in", "handed-in"],
  ["With the grader", "with-the-grader"],
  ["Grades are in", "grades-are-in"],
  ["Back at the shop", "back-at-shop"],
  ["Ready to collect", "ready-to-collect"],
  ["Back with you", "back-with-you"],
] as const;

const WITHDRAW = [
  ["Handed in", "handed-in"],
  ["Withdrawal open", "withdrawal-open"],
] as const;

const RETURNED_UNGRADED = [
  ["Back at the shop", "back-at-shop"],
  ["Returned ungraded", "returned-ungraded"],
] as const;

const UPCHARGE = [
  ["Grades are in", "grades-are-in"],
  ["Moved up a level", "moved-up-level"],
] as const;

const NOT_RETURNED = [
  ["Back at the shop", "back-at-shop"],
  ["Not returned", "not-returned"],
] as const;

const PICKUP = [
  ["Back at the shop", "back-at-shop"],
  ["Ready to collect", "ready-to-collect"],
] as const;

const NAMED_PERSON = [
  ["Ready to collect", "ready-to-collect"],
  ["Named person", "named-person"],
] as const;

const STORAGE = [
  ["Ready to collect", "ready-to-collect"],
  ["Storage accruing", "storage-accruing"],
] as const;

const RECORD = [
  ["Ready to collect", "ready-to-collect"],
  ["Back with you", "back-with-you"],
] as const;

const CANCEL = [
  ["Booked", "booked"],
  ["Cancelled", "cancelled"],
] as const;

const titles = (cases: readonly (readonly [string, string])[]) =>
  cases.map(([title]) => title);

/** Collector follows the submission from planned to home on one page. */
export const FollowsToHome: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-01"],
  },
  render: () => (
    <FlowContainer
      cases={FOLLOWS_TO_HOME}
      description={
        <p>
          The rail moves one stage at a time, and each stage names whose move it
          is. The grades show only once the cards are back at the shop.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) =>
    walkCases(canvasElement, titles(FOLLOWS_TO_HOME)),
};

/** Collector asks for a card back before the batch closes. */
export const WithdrawBeforeBatch: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-02"],
  },
  render: () => (
    <FlowContainer
      cases={WITHDRAW}
      description={
        <p>
          A card can be withdrawn until the batch closes on Thursday 19:00. Its
          fee comes back at the till when it is collected against a receipt.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(WITHDRAW)),
};

/** Collector learns why a card came back ungraded. */
export const LearnsWhyUngraded: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-03"],
  },
  render: () => (
    <FlowContainer
      cases={RETURNED_UNGRADED}
      description={
        <p>
          A card returned ungraded carries the grader's note and code. Its fee
          stands, and the rest of the submission carries on.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) =>
    walkCases(canvasElement, titles(RETURNED_UNGRADED)),
};

/** Collector learns the upcharge the day the grades post. */
export const LearnsUpcharge: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-04"],
  },
  render: () => (
    <FlowContainer
      cases={UPCHARGE}
      description={
        <p>
          The day the grades post, a card the grader moved up a level names the
          difference from the fee sheet, due at the counter before collection.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(UPCHARGE)),
};

/** Collector is paid out for a card that did not come back. */
export const PaidOutNotReturned: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-05"],
  },
  render: () => (
    <FlowContainer
      cases={NOT_RETURNED}
      description={
        <p>
          A card not returned is paid out at its declared value, with its fee
          refunded, inside the payout window. Grade10 claims from the grader or
          the courier.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(NOT_RETURNED)),
};

/** Collector reads the pickup card when the cards are ready. */
export const ReadsPickupCard: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-06"],
  },
  render: () => (
    <FlowContainer
      cases={PICKUP}
      description={
        <p>
          When the cards are ready, the pickup card names the code, the shop and
          how the cards are collected.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(PICKUP)),
};

/** Collector names somebody else to collect. */
export const NamesSomeoneElse: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-07"],
  },
  render: () => (
    <FlowContainer
      cases={NAMED_PERSON}
      description={
        <p>
          The collector names a person on the submission page. The ID line says
          whether the ID matched, and that nothing was kept.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(NAMED_PERSON)),
};

/** Collector who leaves the cards is reminded, charged, then given notice. */
export const ReminderThenStorage: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-08"],
  },
  render: () => (
    <FlowContainer
      cases={STORAGE}
      description={
        <p>
          Uncollected cards are reminded at 30 and 60 days, charged storage from
          day 90, and given written notice at 180 days.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(STORAGE)),
};

/** Collector keeps the graded record after collection. */
export const KeepsRecord: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-09"],
  },
  render: () => (
    <FlowContainer
      cases={RECORD}
      description={
        <p>
          After collection the submission stays on the page with its graded
          record, its receipt and its dates.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(RECORD)),
};

/** Collector cancels a submission before the visit starts. */
export const CancelBeforeVisit: Story = {
  parameters: {
    journeys: ["grade10-site-grading-submission-lifecycle-US-10"],
  },
  render: () => (
    <FlowContainer
      cases={CANCEL}
      description={
        <p>
          Cancelling is offered until the visit starts or a card is checked or
          refused. A cancelled submission ends with nothing owed.
        </p>
      }
    >
      {(state, title) => (
        <SubmissionStatusPanel caseTitle={title} state={state} />
      )}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(CANCEL)),
};
