import { Toast } from "@grade10/design-system/components/overlays/toast";
import { ListingLotHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  AUCTION_LOT,
  AUCTION_LOT_DETAILS_COPY,
} from "../../auction-lot-details-content";
import {
  MY_AUCTIONS_PAGE_STORY_ID,
  navigateToStory,
} from "../../workbench-story-nav";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";

const meta = {
  title: "Auction/Display/Flows/Watch A Lot",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type WatchStep = {
  watched: boolean;
  /** A bid stands on the lot: Watching stays on and locked. */
  watchLocked?: boolean;
  /** A closed lot has no watch control at all. */
  closed?: boolean;
};

/** The lot header with its watch control; pressing the control flips it, as a collector would. */
function WatchStepHeader({ watched, watchLocked, closed }: WatchStep) {
  const [isWatched, setIsWatched] = useState(watched);
  return (
    <ListingLotHeader
      copy={AUCTION_LOT_DETAILS_COPY.header}
      onUnwatchedToastAction={() => setIsWatched(true)}
      onWatchToggle={closed ? undefined : () => setIsWatched((value) => !value)}
      onWatchedToastAction={() => navigateToStory(MY_AUCTIONS_PAGE_STORY_ID)}
      title={AUCTION_LOT.title}
      watchLocked={watchLocked}
      watched={isWatched}
    />
  );
}

const CASES: ReadonlyArray<readonly [string, WatchStep]> = [
  ["Collector watches a lot without bidding", { watched: false }],
  ["Watching with email alerts on", { watched: true }],
  [
    "Bid placed, so Watching stays locked",
    { watched: true, watchLocked: true },
  ],
  ["Closed lot offers no watch control", { watched: false, closed: true }],
];

const STEPS: readonly FlowWalkStep[] = [
  [CASES[0][0], "Watch", "Watching"],
  [CASES[1][0], "Watching"],
  [CASES[2][0], "Watching"],
  [CASES[3][0], AUCTION_LOT.title, /^Watch(ing)?$/],
];

/** Watch, unwatch and undo on a lot; after a bid the watch is locked; a closed lot has none. */
export const WatchAndUnwatch: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-listing-page-US-06",
      "grade10-site-auction-listing-page-US-07",
      "grade10-site-auction-listing-page-US-08",
      "grade10-site-auction-listing-page-US-09",
    ],
  },
  render: () => (
    <>
      <Toast position="bottom-right" />
      <FlowContainer
        cases={CASES}
        description={
          <p>
            Watching turns email alerts on and offers My Auctions from its
            toast. Unwatch turns alerts off and its toast offers Undo. A bid
            locks the control as Watching, and the bid toast fires once. A
            closed lot, sold or unsold, shows no watch control.
          </p>
        }
      >
        {(step, title) => <WatchStepHeader key={title} {...step} />}
      </FlowContainer>
    </>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
