import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction/Bidding/Screens/Bid Panel/State Tests/Setup",
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
SetupRequired.parameters = {
  ...SetupRequired.parameters,
  verification: { caseId: "vc_b0ef73b7-7277-4def-821e-cd9dec22593e" },
};
export const SetupChangePayment = responseStory(
  BID_PANEL_STATE_RESPONSES.setupChangePayment,
);
SetupChangePayment.parameters = {
  ...SetupChangePayment.parameters,
  verification: { caseId: "vc_7d010c19-c784-4ae4-b845-7f0ca11742cd" },
};
