import {
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
  ListingAuctionBidCard,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  bidHistoryForState,
  buildListingAuctionBidView,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
} from "./listing-auction-bid-fixtures";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_SNAPSHOT_LINKED_CARD,
  ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE,
  ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  ENROLLMENT_SNAPSHOT_READY,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
  ENROLLMENT_SNAPSHOT_SIGNED_OUT,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";
import { PaymentAuthorizationPreview } from "./payment-authorization-demo";

/**
 * Bid Panel (`ListingAuctionBidCard` plus enrollment chrome).
 *
 * States live as stories under this title and under Bid Panel / Dialogs,
 * Flows, and State Tests. Controls in this Docs page are the card's `onX`
 * callbacks.
 */
const meta = {
  title: "Auction Listing/Bid Panel",
  component: ListingAuctionBidCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The listing bid panel is \`ListingAuctionBidCard\`. The consumer owns product
state and every action. The card presents \`view\`, \`history\`,
\`bidEnrollment\`, and \`bidMode\`.

Enrollment chrome (linked card, setup sheet, auto-bid confirmation, sign-in)
sits around the card in the preview. The full lot page is
[Auction Lot Details](?path=/story/pages-auction-lot-details--live-auto-leading).

## Enrollment states

| State | Story | What it shows |
| --- | --- | --- |
| Signed out | [Signed Out](?path=/story/auction-listing-bid-panel--signed-out) | \`bidEnrollment="signed-out"\`. Sign In to Bid. Standing is hidden. |
| Need a card | [Need Card](?path=/story/auction-listing-bid-panel--need-card) | Empty linked-card slot. Place Bid is visible; linking is the next step. |
| Linked card, editable | [Linked Card Editable](?path=/story/auction-listing-bid-panel--linked-card-editable) | Masked card with Change, before the first bid on this lot. |
| Linked card, locked | [Linked Card](?path=/story/auction-listing-bid-panel--linked-card) | Masked card without Change, after the first bid. |
| Ready | [Ready](?path=/story/auction-listing-bid-panel--ready) | Enrollment complete. Place Bid, or Confirm / Raise a maximum. |
| Payment authorization | [Payment Authorization](?path=/story/auction-listing-bid-panel--payment-authorization) | Place Bid opens the authorize-your-bid dialog. |

## Dialogs

| State | Story | What it shows |
| --- | --- | --- |
| Setup | [Setup Modal](?path=/story/auction-listing-bid-panel-dialogs--setup-modal) | Card-link iframe and age attestation. Continue stays disabled until both are done. |
| Setup from Change | [Setup Modal From Change](?path=/story/auction-listing-bid-panel-dialogs--setup-modal-from-change) | Same sheet after Change. Age attestation stays checked when already given. |
| Auto-bid confirm | [Auto Bid Confirmation](?path=/story/auction-listing-bid-panel-dialogs--auto-bid-confirmation) | First auto-bid on a listing asks the collector to confirm the hold. |
| Payment authorization pending | [Payment Authorization Pending](?path=/story/auction-listing-bid-panel-dialogs--payment-authorization-pending) | Authorize-your-bid dialog while Stripe is authorizing. |
| Payment authorization refused | [Payment Authorization Refused](?path=/story/auction-listing-bid-panel-dialogs--payment-authorization-refused) | Authorize-your-bid dialog after the method is declined. |

## Bidding and standing

\`view.standing\` is \`none\`, \`outbid\`, \`leading-max\`, \`leading-manual\`,
\`won-payment-due\`, \`won-settled\`, or \`lost\`. Auto vs manual is \`bidMode\`.

| State | Story | What it shows |
| --- | --- | --- |
| Live, no bids | [Live No Bids](?path=/story/auction-listing-listingauctionbidcard--live-no-bids) | Starting bid, empty history. |
| Leading with a maximum | [Leading](?path=/story/auction-listing-listingauctionbidcard--leading) | \`standing="leading-max"\`. Highest bid. Raise is the next action. |
| Outbid | [Outbid](?path=/story/auction-listing-listingauctionbidcard--outbid) | \`standing="outbid"\`. Current bid is above the viewer's maximum. |
| Live sequence + auto cases | [Flows / Bidding](?path=/story/auction-listing-bid-panel-flows--bidding) | Manual bids through leading and outbid, then first maximum, leading maximum, overtaken, and accepted without leading. Enable auto-bidding, Place Bid, Confirm, and Raise are live and open the enrollment dialogs. |
| Interactive enrollment | [Flows / Interactive](?path=/story/auction-listing-bid-panel-flows--interactive) | Walks sign-in → card link → ready on one card. |
| Closed / won / lost | [Auction Lot Details](?path=/story/pages-auction-lot-details--closed-won-payment-due) | Payment due, settled, lost, sold, and unsold on the lot page. |

## Countdown

[Flows / Countdown](?path=/story/auction-listing-bid-panel-flows--countdown)
runs the signed-out card through extension evaluation, unit rollovers, close,
and already-extended.

\`view.extended\` switches the time label to Time left (auto-extended).
\`view.countdownSeconds\` (and optional \`closesAtMs\`) drives the rolling
countdown. Closed lots pass \`countdownSeconds: null\` and show the closed
moment.

## Card callbacks

Each \`onX\` reports a collector action. The consumer owns product outcomes.
Use Controls on this page; calls appear in the Actions panel.

| Callback | Fires when | Consumer owns |
| --- | --- | --- |
| \`onPlaceBid\` | Place Bid, or Sign In to Bid when signed out | Submitting the manual bid, or opening sign-in when \`bidEnrollment\` is \`signed-out\`. |
| \`onCommitMaximum\` | Confirm or Raise on the auto-bid maximum field | Validating the entered maximum, taking the hold, and writing the new cap. |
| \`onBidModeChange\` | Enable auto-bidding is toggled | The next \`bidMode\`, \`"manual"\` or \`"auto"\`. |

## Enrollment callbacks

These are not props of \`ListingAuctionBidCard\`. They belong to the chrome
around it.

| Callback | Fires when | Consumer owns |
| --- | --- | --- |
| \`PaymentMethodEmptyState.onLink\` | Empty linked-card slot is pressed | Opening setup (iframe + age attestation). |
| \`PaymentMethodRow.onChange\` | Change on an editable linked card | Opening setup to replace the card, only before the first bid on this lot. |
| \`EnrollmentSetupSheet.onContinue\` | Setup Continue | Persisting the linked card and age attestation, then closing setup. |
| \`EnrollmentSetupSheet.onOpenChange\` | Setup open state changes | Whether the setup sheet is shown. |
| \`AutoBidConfirmationDialog.onConfirm\` | Auto-bid confirmation is accepted | Recording that this listing has shown first-auto-bid confirmation. |
| \`AutoBidConfirmationDialog.onOpenChange\` | Auto-bid confirmation open state changes | Whether that dialog is shown. |
| \`SignInCard.onOpenChange\` | Sign-in overlay open state changes | Whether sign-in is shown. |
| \`SignInEmailForm.onSubmit\` | Sign-in email is submitted | Completing sign-in, then moving enrollment to ready. |
        `,
      },
    },
  },
  args: {
    copy: LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
    view: buildListingAuctionBidView("live-manual"),
    history: bidHistoryForState("live-manual"),
    bidMode: "manual",
    bidEnrollment: "ready",
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    onBidModeChange: fn(),
    onPlaceBid: fn(),
    onCommitMaximum: fn(),
  },
  argTypes: {
    copy: { table: { disable: true } },
    view: { table: { disable: true } },
    history: { table: { disable: true } },
    historyResetKey: { table: { disable: true } },
    recentBidsAccessory: { table: { disable: true } },
    locale: { table: { disable: true } },
    timeZone: { table: { disable: true } },
    bidEnrollment: {
      control: "select",
      options: ["signed-out", "ready"],
      description:
        "How far the collector has progressed through bid enrollment. signed-out replaces Place Bid with Sign In to Bid and hides standing.",
    },
    bidMode: {
      control: "select",
      options: ["manual", "auto"],
      description:
        "Whether the action row is a manual bid or an auto-bid maximum. The consumer stores this; the card only presents it.",
    },
    onPlaceBid: {
      control: false,
      description:
        "Fires on Place Bid, or on Sign In to Bid when bidEnrollment is signed-out. The consumer submits the manual bid or opens sign-in.",
    },
    onCommitMaximum: {
      control: false,
      description:
        "Fires on Confirm or Raise for the auto-bid maximum. The consumer validates the amount, takes the hold, and writes the cap.",
    },
    onBidModeChange: {
      control: false,
      description:
        "Fires when Enable auto-bidding is toggled. Argument is the next mode, manual or auto. The consumer updates bidMode.",
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingAuctionBidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SNAPSHOT_DOCS = { docs: { disable: true } } as const;

function enrollmentStory(snapshot: ListingBidEnrollmentSnapshot): Story {
  return {
    parameters: SNAPSHOT_DOCS,
    render: () => (
      <ListingBidEnrollmentCardPreview
        onChangePayment={() => undefined}
        onLinkPayment={() => undefined}
        snapshot={snapshot}
      />
    ),
  };
}

async function dismissDialog(name: string) {
  const dialog = within(document.body).getByRole("dialog", { name });
  await userEvent.click(
    within(dialog).getAllByRole("button", { name: "Close dialog" })[0],
  );
  await waitFor(() => {
    expect(
      within(document.body).queryByRole("dialog", { name }),
    ).not.toBeInTheDocument();
  });
}

function NeedCardPreview() {
  const [state, setState] = useState<ListingBidEnrollmentSnapshot>(
    ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  );

  function requirePaymentSetup() {
    setState({
      ...state,
      paymentEmptyState: undefined,
      paymentSetup: { requiresIframeLink: true },
    });
  }

  return (
    <ListingBidEnrollmentCardPreview
      onBidSubmit={requirePaymentSetup}
      onLinkPayment={requirePaymentSetup}
      onPaymentSetupDismissed={() =>
        setState(ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT)
      }
      snapshot={state}
    />
  );
}

function LinkedCardEditablePreview() {
  const [state, setState] = useState<ListingBidEnrollmentSnapshot>(
    ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE,
  );

  return (
    <ListingBidEnrollmentCardPreview
      onChangePayment={() =>
        setState(ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE)
      }
      onPaymentSetupDismissed={() =>
        setState(ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE)
      }
      snapshot={state}
    />
  );
}

/** Ready card used by Bid Panel Docs. Controls toggle enrollment and bid mode. */
export const Overview: Story = {
  tags: ["!dev"],
};

export const SignedOut = enrollmentStory(ENROLLMENT_SNAPSHOT_SIGNED_OUT);
SignedOut.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByRole("button", { name: "Sign In to Bid" })).toBeVisible();
  expect(canvas.getByText("Recent Bids")).toBeVisible();
  expect(canvas.queryByText("Highest bid")).not.toBeInTheDocument();
  expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();
  expect(
    canvas.queryByRole("button", { name: "Place Bid" }),
  ).not.toBeInTheDocument();
};

export const NeedCard: Story = {
  parameters: SNAPSHOT_DOCS,
  render: () => <NeedCardPreview />,
};
NeedCard.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(
    canvas.getByRole("button", { name: "Link a card to place a bid." }),
  ).toBeVisible();
  expect(canvas.getByText("Linked Card")).toBeVisible();
  expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Sign In to Bid" }),
  ).not.toBeInTheDocument();
  await userEvent.click(canvas.getByRole("button", { name: "Place Bid" }));
  await waitFor(() => {
    expect(
      within(document.body).getByRole("dialog", {
        name: "Get Ready to Bid",
      }),
    ).toBeVisible();
  });
  await dismissDialog("Get Ready to Bid");
  expect(
    canvas.getByRole("button", { name: "Link a card to place a bid." }),
  ).toBeVisible();
  expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
};

export const LinkedCardEditable: Story = {
  parameters: SNAPSHOT_DOCS,
  render: () => <LinkedCardEditablePreview />,
};
LinkedCardEditable.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByText("•••• 4242")).toBeVisible();
  expect(canvas.getByRole("button", { name: "Change" })).toBeVisible();
  await userEvent.click(canvas.getByRole("button", { name: "Change" }));
  await waitFor(() => {
    expect(
      within(document.body).getByRole("dialog", {
        name: "Get Ready to Bid",
      }),
    ).toBeVisible();
  });
  expect(
    within(
      within(document.body).getByRole("dialog", {
        name: "Get Ready to Bid",
      }),
    ).getByText("Stripe card form (iframe) — linked card on file"),
  ).toBeVisible();
  await dismissDialog("Get Ready to Bid");
  expect(canvas.getByRole("button", { name: "Change" })).toBeVisible();
};

export const LinkedCard = enrollmentStory(ENROLLMENT_SNAPSHOT_LINKED_CARD);
LinkedCard.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByText("•••• 4242")).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Change" }),
  ).not.toBeInTheDocument();
};

export const Ready = enrollmentStory(ENROLLMENT_SNAPSHOT_READY);
Ready.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByText("•••• 4242")).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Change" }),
  ).not.toBeInTheDocument();
};

export const PaymentAuthorization: Story = {
  parameters: SNAPSHOT_DOCS,
  render: () => <PaymentAuthorizationPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Place Bid" }));
    expect(
      within(document.body).getByRole("dialog", {
        name: "Authorize your bid",
      }),
    ).toBeInTheDocument();
    expect(
      within(document.body).getByText("Secure payment field"),
    ).toBeInTheDocument();
    await userEvent.click(
      within(document.body).getByRole("button", { name: /Authorize HK\$/ }),
    );
    expect(
      within(document.body).getByRole("button", {
        name: "Authorizing payment method",
      }),
    ).toBeDisabled();
    await dismissDialog("Authorize your bid");
    expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
  },
};
