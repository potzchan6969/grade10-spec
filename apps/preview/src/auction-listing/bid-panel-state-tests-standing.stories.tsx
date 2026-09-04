import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction Listing/Bid Panel/State Tests/Standing",
  component: BidPanelStateResponsePreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Live standing snapshots. `auto-outbid` is max below the current bid; `auto-maximum-not-leading` is max equal to the current bid (accepted without leading). `maximum-accepted` aliases `auto-leading` via `rendersAs`.",
      },
    },
  },
} satisfies Meta<typeof BidPanelStateResponsePreview>;

export default meta;

export const AutoLeading = responseStory(BID_PANEL_STATE_RESPONSES.autoLeading);
export const AutoOutbid = responseStory(BID_PANEL_STATE_RESPONSES.autoOutbid);
export const AutoMaximumNotLeading = responseStory(
  BID_PANEL_STATE_RESPONSES.autoMaximumNotLeading,
);
export const ManualLeading = responseStory(
  BID_PANEL_STATE_RESPONSES.manualLeading,
);
