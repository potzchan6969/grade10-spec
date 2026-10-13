import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { walkCases } from "../grading-play";
import { DropOffStep } from "./drop-off-views";

const meta = {
  title: "Grading/Drop Off/Flows/Drop-off Booking",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const BOOK_FROM_PLAN = [
  ["Read the statement", "statement"],
  ["Pick the shop", "shop"],
  ["Pick the day", "days"],
  ["Batch line", "batch-line"],
  ["Pick the time", "times"],
  ["Booked", "booked"],
] as const;

const MOVE_OR_CANCEL = [
  ["Booked", "booked"],
  ["Moved", "moved"],
] as const;

const BOOK_AGAIN = [
  ["Visit closed", "visit-detached"],
  ["Pick the shop", "shop"],
  ["Pick the day", "days"],
] as const;

const JOIN_VISIT = [
  ["Join the visit", "joins-visit"],
  ["Slot resized", "slot-resized"],
  ["Joined", "joined"],
] as const;

const BULK_DROP_OFF = [
  ["Bulk lead", "bulk-lead"],
  ["Slot resized", "slot-resized"],
  ["Bulk booked", "bulk"],
] as const;

const titles = (cases: readonly (readonly [string, string])[]) =>
  cases.map(([title]) => title);

/** Collector books the drop-off from the plan: the statement, the shop, the day, the time. */
export const BookFromPlan: Story = {
  parameters: { journeys: ["grade10-site-grading-dropoff-booking-US-01"] },
  render: () => (
    <FlowContainer
      cases={BOOK_FROM_PLAN}
      description={
        <p>
          Each case is one step of booking from the plan. The statement must be
          ticked before a shop is chosen. The batch line says when the cards
          leave, and the booked view ends the walk.
        </p>
      }
    >
      {(state) => <DropOffStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(BOOK_FROM_PLAN)),
};

/** Collector moves or cancels the drop-off: the booked view, then the moved time. */
export const MoveOrCancel: Story = {
  parameters: { journeys: ["grade10-site-grading-dropoff-booking-US-02"] },
  render: () => (
    <FlowContainer
      cases={MOVE_OR_CANCEL}
      description={
        <p>
          Move or cancel is offered on the booked view until the visit starts.
          Moving sends the new time; the list and its estimate stay as they
          were.
        </p>
      }
    >
      {(state) => <DropOffStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(MOVE_OR_CANCEL)),
};

/** Collector who missed the drop-off books another: the closed visit, then a new time. */
export const BookAgainAfterMissed: Story = {
  parameters: { journeys: ["grade10-site-grading-dropoff-booking-US-03"] },
  render: () => (
    <FlowContainer
      cases={BOOK_AGAIN}
      description={
        <p>
          A missed visit closes the visit and keeps the list and the estimate.
          The collector books another drop-off from the same page.
        </p>
      }
    >
      {(state) => <DropOffStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(BOOK_AGAIN)),
};

/** Collector brings a second submission to the same drop-off: it joins the visit. */
export const JoinVisit: Story = {
  parameters: { journeys: ["grade10-site-grading-dropoff-booking-US-04"] },
  render: () => (
    <FlowContainer
      cases={JOIN_VISIT}
      description={
        <p>
          A second list joins the visit the first one booked, with no picker.
          Two lists passing 20 together make the visit the longer one, moved
          once in the diary. The visit is read through the first submission, and
          its page shows the same day and time.
        </p>
      }
    >
      {(state) => <DropOffStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(JOIN_VISIT)),
};

/** Dealer books the longer Bulk drop-off: twenty cards or more, about 45 minutes. */
export const BulkDropOff: Story = {
  parameters: { journeys: ["grade10-site-grading-dropoff-booking-US-06"] },
  render: () => (
    <FlowContainer
      cases={BULK_DROP_OFF}
      description={
        <p>
          Twenty cards or more book the Bulk visit, about 45 minutes. Two lists
          passing 20 together resize the visit once in the diary.
        </p>
      }
    >
      {(state) => <DropOffStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(BULK_DROP_OFF)),
};
