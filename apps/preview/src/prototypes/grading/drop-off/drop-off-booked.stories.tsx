import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DROP_OFF_BOOK_STORY_IDS,
  DROP_OFF_MANUAL_PATH,
  DROP_OFF_OPEN_LIST_STORY_ID,
  type DropOffBookedState,
} from "../../../pages/grading/drop-off/drop-off-content";
import { DropOffBookedPanel } from "../../../pages/grading/drop-off/drop-off-views";
import { expectPage } from "../../../pages/grading/grading-play";
import {
  GradingPageHeader,
  GradingPageShell,
  PrototypeNote,
} from "../../../pages/grading/grading-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";

/** Drop-off booked: the visit, what to bring, and the list it belongs to. A wireframe. */
function DropOffBookedPrototype({ state }: { state: DropOffBookedState }) {
  return (
    <GradingPageShell>
      <PrototypeNote
        manualPath={DROP_OFF_MANUAL_PATH}
        settles="how the booked visit reads beside the list, and where move and cancel sit."
      />
      <GradingPageHeader
        description="Your visit is booked. Your list stays open until the cards are handed in."
        title="Your drop-off"
      />
      <DropOffBookedPanel
        onContinue={() => navigateToStory(DROP_OFF_BOOK_STORY_IDS.lead)}
        onOpenList={() => navigateToStory(DROP_OFF_OPEN_LIST_STORY_ID)}
        state={state}
      />
    </GradingPageShell>
  );
}

const meta = {
  title: "Grading/Drop Off/Prototypes/Drop Off Booked",
  component: DropOffBookedPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: ({ canvasElement }) => expectPage(canvasElement, "Your drop-off"),
} satisfies Meta<typeof DropOffBookedPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The visit booked: the day, the time, the shop, what to bring, move and cancel. */
export const Booked: Story = { args: { state: "booked" } };

/** A visit of 20 cards or more: it takes about 45 minutes. */
export const Bulk: Story = { args: { state: "bulk" } };

/** Item 3 names the fee at the till and the cover line beside it. */
export const FeeWithCover: Story = { args: { state: "fee-with-cover" } };

/** Item 4: the day the cards leave, and the estimated day back. */
export const TheDayTheCardsLeave: Story = { args: { state: "cards-leave" } };

/** A vault case on the same visit: its ID check is named beside the grading visit. */
export const VaultLine: Story = { args: { state: "vault-line" } };

/** Joined: the visit the first list owns, named, and read through it. */
export const Joined: Story = { args: { state: "joined" } };

/** The owner cancelled or missed the visit: the list is kept and the collector books again. */
export const VisitDetached: Story = { args: { state: "visit-detached" } };

/** Moved: the new day and time, and the email that says so. */
export const Moved: Story = { args: { state: "moved" } };
