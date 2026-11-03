import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction/Bidding/Screens/Bid Panel/State Tests/Enrollment",
  component: BidPanelStateResponsePreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Query snapshots for enrollment chrome. Mutations that land on the same render (`sign-in-succeeded` → needs-payment, `payment-linked` → linked-card-editable, `manual-bid-accepted` → linked-card-locked) stay in the catalogue with `rendersAs` and are asserted in Vitest, not duplicated here.",
      },
    },
  },
} satisfies Meta<typeof BidPanelStateResponsePreview>;

export default meta;

export const SignedOut = responseStory(BID_PANEL_STATE_RESPONSES.signedOut);
SignedOut.parameters = {
  ...SignedOut.parameters,
  verification: { caseId: "vc_b81278e3-5e44-4414-a72e-b6c2635b4fa9" },
};
export const NeedsPayment = responseStory(
  BID_PANEL_STATE_RESPONSES.needsPayment,
);
NeedsPayment.parameters = {
  ...NeedsPayment.parameters,
  verification: { caseId: "vc_a10dabd7-5a87-47ae-a458-3395d81b6523" },
};
export const LinkedCardEditable = responseStory(
  BID_PANEL_STATE_RESPONSES.linkedCardEditable,
);
LinkedCardEditable.parameters = {
  ...LinkedCardEditable.parameters,
  verification: { caseId: "vc_8dbda0b1-8d77-4cff-b88e-8d4b065a4b87" },
};
export const LinkedCardLocked = responseStory(
  BID_PANEL_STATE_RESPONSES.linkedCardLocked,
);
LinkedCardLocked.parameters = {
  ...LinkedCardLocked.parameters,
  verification: { caseId: "vc_924caf9d-0a51-47a2-a18b-439c9f431a96" },
};
