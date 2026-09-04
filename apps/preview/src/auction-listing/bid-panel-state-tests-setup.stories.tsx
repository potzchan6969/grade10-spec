import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction Listing/Bid Panel/State Tests/Setup",
  component: BidPanelStateResponsePreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Payment-setup responses. Apply opens the setup sheet and leaves it open so you can inspect it — the play does not dismiss the dialog.",
      },
    },
  },
} satisfies Meta<typeof BidPanelStateResponsePreview>;

export default meta;

export const SetupRequired = responseStory(
  BID_PANEL_STATE_RESPONSES.setupRequired,
);
export const SetupChangePayment = responseStory(
  BID_PANEL_STATE_RESPONSES.setupChangePayment,
);
