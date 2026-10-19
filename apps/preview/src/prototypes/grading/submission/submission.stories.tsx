import type { Meta, StoryObj } from "@storybook/react-vite";
import { expectPage } from "../../../pages/grading/grading-play";
import {
  GradingPageHeader,
  GradingPageShell,
  PrototypeNote,
} from "../../../pages/grading/grading-shared";
import {
  SUBMISSION_COPY,
  SUBMISSION_MANUAL_PATH,
  type SubmissionState,
} from "../../../pages/grading/submission/submission-content";
import { SubmissionStatusPanel } from "../../../pages/grading/submission/submission-views";
import { navigateToStory } from "../../../pages/workbench-story-nav";

/** The collector's submission page, through the stage it has reached. A wireframe. */
function SubmissionPrototype({ state }: { state: SubmissionState }) {
  return (
    <GradingPageShell>
      <PrototypeNote
        manualPath={SUBMISSION_MANUAL_PATH}
        settles="how the status, the cards, the money and the uncollected ladder sit on the page, and how a named person shows."
      />
      <GradingPageHeader
        description={SUBMISSION_COPY.id}
        title={SUBMISSION_COPY.title}
      />
      <SubmissionStatusPanel
        onNavigate={(storyId) => navigateToStory(storyId)}
        state={state}
      />
    </GradingPageShell>
  );
}

const meta = {
  title: "Grading/Submission/Prototypes/Submission",
  component: SubmissionPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: ({ canvasElement }) => expectPage(canvasElement, "Your submission"),
} satisfies Meta<typeof SubmissionPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Not handed in yet: the plan waits on the drop-off. */
export const Planned: Story = { args: { state: "planned" } };

/** Drop-off booked: the visit, and move or cancel. */
export const Booked: Story = { args: { state: "booked" } };

/** Handed in: the cards are with us, and a card can still be withdrawn until the batch closes. */
export const HandedIn: Story = { args: { state: "handed-in" } };

/** A card asked back before the batch closes: its fee comes back at the till. */
export const WithdrawalOpen: Story = { args: { state: "withdrawal-open" } };

/** With the grader: the estimate runs from the ship day. */
export const WithTheGrader: Story = { args: { state: "with-the-grader" } };

/** Grades are in: each card's grade, shown when the cards are back at the shop. */
export const GradesAreIn: Story = { args: { state: "grades-are-in" } };

/** A card moved up a level: the difference is due at the counter before collection. */
export const MovedUpLevel: Story = { args: { state: "moved-up-level" } };

/** Back at the shop, being checked. */
export const BackAtTheShop: Story = { args: { state: "back-at-shop" } };

/** A card came back ungraded: the grader's code is named and the fee stands. */
export const ReturnedUngraded: Story = { args: { state: "returned-ungraded" } };

/** A card not returned: paid out at its declared value with its fee refunded. */
export const NotReturned: Story = { args: { state: "not-returned" } };

/** Ready to collect: the pickup code, the reminders and the storage rule. */
export const ReadyToCollect: Story = { args: { state: "ready-to-collect" } };

/** A named person collects: the ID line says what was matched and what was kept. */
export const NamedPerson: Story = { args: { state: "named-person" } };

/** Uncollected past day 90: storage accrues per card, per month. */
export const StorageAccruing: Story = { args: { state: "storage-accruing" } };

/** Back with you: collected, and the graded record stays on the page. */
export const BackWithYou: Story = { args: { state: "back-with-you" } };

/** Cancelled before the visit started: nothing is owed. */
export const Cancelled: Story = { args: { state: "cancelled" } };

/** Expired: no drop-off was booked in time, and a new plan starts again. */
export const Expired: Story = { args: { state: "expired" } };
