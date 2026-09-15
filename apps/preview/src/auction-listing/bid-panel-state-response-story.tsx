import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import type {
  BidPanelState,
  BidPanelStateResponse,
} from "@grade10/test/bid-panel-states";
import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";

function BidPanelStateResponsePreview({
  response,
}: {
  response: BidPanelStateResponse;
}) {
  const [applied, setApplied] = useState(false);
  const [state, setState] = useState<BidPanelState>(response.state);

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
          onChangePayment={() => {
            setState((current) => ({
              ...current,
              paymentSetup: {
                requiresIframeLink: true,
                iframeLinkedPayment: current.linkedPaymentMethod,
                defaultAgeAttested: true,
              },
            }));
          }}
          onLinkPayment={() => {
            setState((current) => ({
              ...current,
              paymentEmptyState: true,
              paymentSetup: { requiresIframeLink: true },
            }));
          }}
          onPaymentSetupDismissed={() => {
            setState((current) => {
              const { paymentSetup: _paymentSetup, ...rest } = current;
              return rest;
            });
          }}
          snapshot={state}
        />
      ) : (
        <Text size="sm">Waiting for a response</Text>
      )}
    </div>
  );
}

type BidPanelStateResponseStory = StoryObj<typeof BidPanelStateResponsePreview>;

function responseStory(
  response: BidPanelStateResponse,
): BidPanelStateResponseStory {
  return {
    name: response.scenarioId,
    args: { response },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      expect(canvas.getByText("Waiting for a response")).toBeVisible();
      await userEvent.click(
        canvas.getByRole("button", { name: "Apply response" }),
      );

      if (response.dialogName) {
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
        response.expectedText === "Change" ||
          response.expectedText === "Confirm address"
          ? canvas.getByRole("button", { name: response.expectedText })
          : canvas.getByText(labelled(response.expectedText)),
      ).toBeVisible();
    },
  };
}

/**
 * Finds the element whose own text opens with a scenario's expected text.
 *
 * A standing badge reads `Leading · HK$58,000` — the label names the state and
 * the amount qualifies it, so an exact match would tie every standing scenario
 * to a fixture's money. Leaves only, so an ancestor carrying the same text is
 * never a second match.
 */
function labelled(expected: string) {
  return (_content: string, element: Element | null) => {
    if (!element || element.children.length > 0) return false;
    return (element.textContent ?? "").trimStart().startsWith(expected);
  };
}

export type { BidPanelStateResponseStory };
export { BidPanelStateResponsePreview, responseStory };
