import { BID_PANEL_STATE_RESPONSES } from "@grade10/test/bid-panel-states";
import type { Meta } from "@storybook/react-vite";
import {
  BidPanelStateResponsePreview,
  responseStory,
} from "./bid-panel-state-response-story";

const meta = {
  title: "Auction Listing/Bid Panel/State Tests/Enrollment",
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
export const NeedsPayment = responseStory(
  BID_PANEL_STATE_RESPONSES.needsPayment,
);
export const LinkedCardEditable = responseStory(
  BID_PANEL_STATE_RESPONSES.linkedCardEditable,
);
export const LinkedCardLocked = responseStory(
  BID_PANEL_STATE_RESPONSES.linkedCardLocked,
);
