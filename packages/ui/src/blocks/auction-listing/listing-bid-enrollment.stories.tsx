import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { ListingBidEnrollmentInteractiveDemo } from "./listing-bid-enrollment-demo";
import {
  ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM,
  ENROLLMENT_SNAPSHOT_LINKED_CARD,
  ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE,
  ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  ENROLLMENT_SNAPSHOT_READY,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
  ENROLLMENT_SNAPSHOT_SIGNED_OUT,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";

const meta = {
  title: "Auction Listing/Bid Panel",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Bid enrollment states on ListingAuctionBidCard: sign-in, card linking with age attestation, and optional auto-bid confirmation. Each story is one static state. For full-page gallery, header, and live auction simulation, see Pages/Auction Lot Details.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function enrollmentStory(
  snapshot: ListingBidEnrollmentSnapshot,
): Story {
  return {
    render: () => (
      <ListingBidEnrollmentCardPreview
        onChangePayment={() => undefined}
        onLinkPayment={() => undefined}
        snapshot={snapshot}
      />
    ),
  };
}

export const SignedOut = enrollmentStory(ENROLLMENT_SNAPSHOT_SIGNED_OUT);
SignedOut.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(
    canvas.getByRole("button", { name: "Sign In to Bid" }),
  ).toBeVisible();
  expect(canvas.getByText("Recent Bids")).toBeVisible();
  expect(canvas.queryByText("Highest bid")).not.toBeInTheDocument();
  expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();
  expect(
    canvas.queryByRole("button", { name: "Place Bid" }),
  ).not.toBeInTheDocument();
};

export const NeedCard = enrollmentStory(ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT);
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
};

export const LinkedCardEditable = enrollmentStory(
  ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE,
);
LinkedCardEditable.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByText("•••• 4242")).toBeVisible();
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

export const SetupModal = enrollmentStory(ENROLLMENT_SNAPSHOT_SETUP_SHEET);
SetupModal.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Get Ready to Bid",
  });
  expect(
    within(dialog).getByText("Stripe card link (iframe)"),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByText(
      "Link a card to bid on this lot. You are only charged if you win this lot.",
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("button", { name: "Continue" }),
  ).toBeDisabled();
};

export const SetupModalFromChange = enrollmentStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
);
SetupModalFromChange.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Get Ready to Bid",
  });
  expect(
    within(dialog).getByText(
      "Stripe card form (iframe) — linked card on file",
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByText(
      "Link a card to bid on this lot. You are only charged if you win this lot.",
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("checkbox", {
      name: "I confirm I am 18 years of age or older.",
    }),
  ).toBeChecked();
  expect(
    within(dialog).getByRole("button", { name: "Continue" }),
  ).toBeEnabled();
};

export const Ready = enrollmentStory(ENROLLMENT_SNAPSHOT_READY);
Ready.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByText("•••• 4242")).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Change" }),
  ).not.toBeInTheDocument();
};

export const AutoBidConfirmation = enrollmentStory(
  ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM,
);

export const Interactive: Story = {
  render: () => <ListingBidEnrollmentInteractiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeVisible();
  },
};
