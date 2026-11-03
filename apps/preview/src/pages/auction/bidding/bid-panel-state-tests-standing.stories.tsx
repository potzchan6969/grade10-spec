import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction/Bidding/Screens/Bid Panel/State Tests/Standing",
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
AutoLeading.parameters = {
  ...AutoLeading.parameters,
  verification: { caseId: "vc_9a0853cc-df8e-41d3-92d9-441f0c9566eb" },
};
export const AutoOutbid = responseStory(BID_PANEL_STATE_RESPONSES.autoOutbid);
AutoOutbid.parameters = {
  ...AutoOutbid.parameters,
  verification: { caseId: "vc_7578d885-9dea-4d02-a76e-36acbe84dffe" },
};
export const AutoMaximumNotLeading = responseStory(
  BID_PANEL_STATE_RESPONSES.autoMaximumNotLeading,
);
AutoMaximumNotLeading.parameters = {
  ...AutoMaximumNotLeading.parameters,
  verification: { caseId: "vc_27f32b48-f2e6-4b2d-a4f1-bd1d9ef625e0" },
};
export const ManualLeading = responseStory(
  BID_PANEL_STATE_RESPONSES.manualLeading,
);
ManualLeading.parameters = {
  ...ManualLeading.parameters,
  verification: { caseId: "vc_90e13cfc-3736-403a-b15e-e69dbddd33d3" },
};
