import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction/Bidding/Screens/Bid Panel/State Tests/Lifecycle",
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
Opens.parameters = {
  ...Opens.parameters,
  verification: { caseId: "vc_9eddf864-d05b-4e39-836a-8317cd8b71c6" },
};
export const ClosedSold = responseStory(BID_PANEL_STATE_RESPONSES.closedSold);
ClosedSold.parameters = {
  ...ClosedSold.parameters,
  verification: { caseId: "vc_3ff84c41-837c-4924-b59f-155da163157c" },
};
export const ClosedWonPaymentDue = responseStory(
  BID_PANEL_STATE_RESPONSES.closedWonPaymentDue,
);
ClosedWonPaymentDue.parameters = {
  ...ClosedWonPaymentDue.parameters,
  verification: { caseId: "vc_327e5887-cd16-4ca4-894e-8b008c268fed" },
};
export const ClosedWonSettled = responseStory(
  BID_PANEL_STATE_RESPONSES.closedWonSettled,
);
ClosedWonSettled.parameters = {
  ...ClosedWonSettled.parameters,
  verification: { caseId: "vc_8c69aa13-c014-4c4a-8f92-d5e362e5354b" },
};
export const ClosedLost = responseStory(BID_PANEL_STATE_RESPONSES.closedLost);
ClosedLost.parameters = {
  ...ClosedLost.parameters,
  verification: { caseId: "vc_958be133-1bb7-439e-84c3-d7c67d58572e" },
};
export const ClosedUnsold = responseStory(
  BID_PANEL_STATE_RESPONSES.closedUnsold,
);
ClosedUnsold.parameters = {
  ...ClosedUnsold.parameters,
  verification: { caseId: "vc_45aef92f-7e61-44eb-bd80-b46bcbcd027d" },
};
