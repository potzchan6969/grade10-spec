import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  BID_PANEL_STATE_RESPONSES,
  type BidPanelStateResponse,
} from "@grade10/test/bid-panel-states";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";

function BidPanelStateResponsePreview({
  response,
}: {
  response: BidPanelStateResponse;
}) {
  const [applied, setApplied] = useState(false);

  return (
    <div className="w-full max-w-md space-y-4">
      <Text size="sm" tone="secondary">
        {response.source} · {response.operation}
      </Text>
      <Button onClick={() => setApplied(true)} size="sm">
        Apply response
      </Button>
      {applied ? (
        <ListingBidEnrollmentCardPreview
          onChangePayment={() => undefined}
          snapshot={response.state}
        />
      ) : (
        <Text size="sm">Waiting for a response</Text>
      )}
    </div>
  );
}

const meta = {
  title: "Auction Listing/Bid Panel/API response shapes",
  component: BidPanelStateResponsePreview,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BidPanelStateResponsePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

function responseStory(response: BidPanelStateResponse): Story {
  return {
    name: response.scenarioId,
    args: { response },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      expect(canvas.getByText("Waiting for a response")).toBeVisible();
      await userEvent.click(
        canvas.getByRole("button", { name: "Apply response" }),
      );
      if (response.state.autoConfirmOpen || response.dialogName) {
        await waitFor(() => {
          expect(
            within(document.body).getByRole("dialog", {
              name: response.dialogName ?? response.expectedText,
            }),
          ).toBeVisible();
        });
        expect(
          within(document.body).getByText(response.expectedText),
        ).toBeVisible();
        return;
      }

      expect(
        response.expectedText === "Change"
          ? canvas.getByRole("button", { name: response.expectedText })
          : canvas.getByText(response.expectedText),
      ).toBeVisible();
    },
  };
}

export const SignedOut = responseStory(BID_PANEL_STATE_RESPONSES.signedOut);
export const NeedsPayment = responseStory(
  BID_PANEL_STATE_RESPONSES.needsPayment,
);
export const AutoLeading = responseStory(BID_PANEL_STATE_RESPONSES.autoLeading);
export const AutoOutbid = responseStory(BID_PANEL_STATE_RESPONSES.autoOutbid);
export const AutoMaximumNotLeading = responseStory(
  BID_PANEL_STATE_RESPONSES.autoMaximumNotLeading,
);
export const ManualLeading = responseStory(
  BID_PANEL_STATE_RESPONSES.manualLeading,
);
export const Opens = responseStory(BID_PANEL_STATE_RESPONSES.opens);
export const ClosedSold = responseStory(BID_PANEL_STATE_RESPONSES.closedSold);
export const ClosedWonPaymentDue = responseStory(
  BID_PANEL_STATE_RESPONSES.closedWonPaymentDue,
);
export const ClosedWonSettled = responseStory(
  BID_PANEL_STATE_RESPONSES.closedWonSettled,
);
export const ClosedLost = responseStory(BID_PANEL_STATE_RESPONSES.closedLost);
export const ClosedUnsold = responseStory(
  BID_PANEL_STATE_RESPONSES.closedUnsold,
);
export const SignInSucceeded = responseStory(
  BID_PANEL_STATE_RESPONSES.signInSucceeded,
);
export const PaymentLinked = responseStory(
  BID_PANEL_STATE_RESPONSES.paymentLinked,
);
export const LinkedCardEditable = responseStory(
  BID_PANEL_STATE_RESPONSES.linkedCardEditable,
);
export const LinkedCardLocked = responseStory(
  BID_PANEL_STATE_RESPONSES.linkedCardLocked,
);
export const SetupRequired = responseStory(
  BID_PANEL_STATE_RESPONSES.setupRequired,
);
export const SetupChangePayment = responseStory(
  BID_PANEL_STATE_RESPONSES.setupChangePayment,
);
export const StaleFloor = responseStory(BID_PANEL_STATE_RESPONSES.staleFloor);
export const ManualBidAccepted = responseStory(
  BID_PANEL_STATE_RESPONSES.manualBidAccepted,
);
export const MaximumConfirmationRequired = responseStory(
  BID_PANEL_STATE_RESPONSES.maximumConfirmationRequired,
);
export const MaximumAccepted = responseStory(
  BID_PANEL_STATE_RESPONSES.maximumAccepted,
);
