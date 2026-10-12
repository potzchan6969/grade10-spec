import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction Listing/Bid Panel/State Tests/Lifecycle",
  component: BidPanelStateResponsePreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Scheduled and closed lot snapshots — opens, sold, won (payment due / settled), lost, and unsold.",
      },
    },
  },
} satisfies Meta<typeof BidPanelStateResponsePreview>;

export default meta;

export const Opens = responseStory(BID_PANEL_STATE_RESPONSES.opens);
export const ClosedSold = responseStory(BID_PANEL_STATE_RESPONSES.closedSold);
export const ClosedWonPaymentDue = responseStory({
  ...BID_PANEL_STATE_RESPONSES.closedWonPaymentDue,
  expectedText: "Complete Order Setup",
});
export const ClosedWonSettled = responseStory(
  BID_PANEL_STATE_RESPONSES.closedWonSettled,
);
export const ClosedLost = responseStory(BID_PANEL_STATE_RESPONSES.closedLost);
export const ClosedUnsold = responseStory(
  BID_PANEL_STATE_RESPONSES.closedUnsold,
);
