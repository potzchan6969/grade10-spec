import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DROP_OFF_BOOK_STORY_IDS,
  DROP_OFF_BOOKED_STORY_IDS,
  DROP_OFF_MANUAL_PATH,
  type DropOffBookState,
} from "../../../pages/grading/drop-off/drop-off-content";
import { DropOffBookPanel } from "../../../pages/grading/drop-off/drop-off-views";
import { expectPage } from "../../../pages/grading/grading-play";
import {
  GradingPageHeader,
  GradingPageShell,
  PrototypeNote,
} from "../../../pages/grading/grading-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";

/** The step each state's primary action leads to, in the wireframe. */
const NEXT_STEP: Partial<Record<DropOffBookState, string>> = {
  statement: DROP_OFF_BOOK_STORY_IDS.lead,
  lead: DROP_OFF_BOOK_STORY_IDS.shop,
  "bulk-lead": DROP_OFF_BOOK_STORY_IDS.shop,
  shop: DROP_OFF_BOOK_STORY_IDS.days,
  days: DROP_OFF_BOOK_STORY_IDS["batch-line"],
  "batch-line": DROP_OFF_BOOK_STORY_IDS.times,
  "batch-line-past-cut-off": DROP_OFF_BOOK_STORY_IDS.times,
  times: DROP_OFF_BOOKED_STORY_IDS.booked,
  "diary-refuses": DROP_OFF_BOOK_STORY_IDS.times,
  "joins-visit": DROP_OFF_BOOKED_STORY_IDS.joined,
  "slot-resized": DROP_OFF_BOOK_STORY_IDS.times,
};

/** Book the drop-off: the list, the shop, the day and the time. A wireframe. */
function BookDropOffPrototype({ state }: { state: DropOffBookState }) {
  const next = NEXT_STEP[state];
  return (
    <GradingPageShell>
      <PrototypeNote
        manualPath={DROP_OFF_MANUAL_PATH}
        settles="where the shop and day pickers sit beside the list, and how the batch line reads."
      />
      <GradingPageHeader
        description="Bring your cards to one visit. Nothing is paid at the shop until each card is checked and signed."
        title="Book the drop-off"
      />
      <DropOffBookPanel
        onContinue={next ? () => navigateToStory(next) : undefined}
        state={state}
      />
    </GradingPageShell>
  );
}

const meta = {
  title: "Grading/Drop Off/Prototypes/Book Drop Off",
  component: BookDropOffPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: ({ canvasElement }) => expectPage(canvasElement, "Book the drop-off"),
} satisfies Meta<typeof BookDropOffPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The collection statement is unticked: a join and the shop wait on the tick. */
export const StatementUnticked: Story = { args: { state: "statement" } };

/** A list of 12 cards: about 20 minutes, nothing paid until each card is checked. */
export const Lead: Story = { args: { state: "lead" } };

/** 20 cards or more: the longer visit, about 45 minutes. */
export const BulkLead: Story = { args: { state: "bulk-lead" } };

/** The one shop, with its address and how long a visit takes. */
export const Shop: Story = { args: { state: "shop" } };

/** The calendar: days with nothing free are disabled, a day past the horizon too. */
export const Days: Story = { args: { state: "days" } };

/** A day picked: the batch it makes, the cut-off and the day the cards leave. */
export const BatchLine: Story = { args: { state: "batch-line" } };

/** A day after the week's cut-off: the next batch's close and ship days. */
export const BatchLinePastTheCutOff: Story = {
  args: { state: "batch-line-past-cut-off" },
};

/** The times of the day, in the shop's zone, and the booking button. */
export const Times: Story = { args: { state: "times" } };

/** A day picked with nothing free: the times say so and the day can change. */
export const NothingFree: Story = { args: { state: "nothing-free" } };

/** The diary refuses the time picked: the refusal is named and the times read again. */
export const TheDiaryRefuses: Story = { args: { state: "diary-refuses" } };

/** A drop-off already booked under the email: this list joins it, with no picker. */
export const JoinsVisit: Story = { args: { state: "joins-visit" } };

/** Two lists pass 20 together: the visit is the longer one and moves once in the diary. */
export const SlotResized: Story = { args: { state: "slot-resized" } };
