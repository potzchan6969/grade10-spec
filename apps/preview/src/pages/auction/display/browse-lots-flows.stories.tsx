import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import { AuctionLotCard } from "./auction-catalogue-card";
import {
  CATALOGUE_PAGE_LOTS,
  type CatalogueLot,
  type CatalogueStatus,
  ENDED_ONLY_LOTS,
} from "./auction-catalogue-content";

const meta = {
  title: "Auction/Display/Flows/Browse Lots",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function lotWithStatus(
  status: CatalogueStatus,
  lots: readonly CatalogueLot[],
): CatalogueLot {
  const lot = lots.find((item) => item.status === status);
  if (!lot) throw new Error(`No ${status} lot in the catalogue fixture`);
  return lot;
}

const ACTIVE_LOT = lotWithStatus("Active", CATALOGUE_PAGE_LOTS);
const ENDED_LOT = lotWithStatus("Ended", ENDED_ONLY_LOTS);
const UPCOMING_LOT: CatalogueLot = {
  ...ACTIVE_LOT,
  id: `${ACTIVE_LOT.id}-upcoming`,
  status: "Upcoming",
  startsAt: "2026-10-20T18:00:00+08:00",
};

const CASES: ReadonlyArray<readonly [string, CatalogueLot]> = [
  ["Collector sees a lot open for bids", ACTIVE_LOT],
  ["Collector sees a lot that opens later", UPCOMING_LOT],
  ["Collector sees a lot that has closed", ENDED_LOT],
];

const STEPS: readonly FlowWalkStep[] = [
  [CASES[0][0], /^Ends in/],
  [CASES[1][0], /^Opens in/],
  [CASES[2][0], /^Ended /],
];

/** Browse from the catalogue to a lot; each card says whether the lot can still be bid on. */
export const CardStatus: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-listing-page-US-05",
      "grade10-site-auction-lot-status-US-01",
    ],
  },
  render: () => (
    <>
      <Toast position="bottom-right" />
      <FlowContainer
        cases={CASES}
        description={
          <p>
            A lot card in the catalogue shows its status and its bid. An open
            lot says it can be bid on. An upcoming lot shows when it opens. A
            closed lot shows its result and no watch control. Selecting the card
            opens the lot at its own address.
          </p>
        }
      >
        {(lot) => (
          <AuctionLotCard
            heading
            lot={lot}
            onToggle={() => undefined}
            watched={false}
          />
        )}
      </FlowContainer>
    </>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
