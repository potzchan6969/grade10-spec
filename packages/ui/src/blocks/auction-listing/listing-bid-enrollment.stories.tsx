import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { ListingBidEnrollmentInteractiveDemo } from "./listing-bid-enrollment-demo";
import {
  ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM,
  ENROLLMENT_SNAPSHOT_NEEDS_AGE,
  ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  ENROLLMENT_SNAPSHOT_READY,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_AGE,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_PAYMENT,
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
          "Bid enrollment states on ListingAuctionBidCard: sign-in, age, payment, and optional auto-bid confirmation. Each story is one static state. For full-page gallery, header, and live auction simulation, see Pages/Auction Lot Details.",
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

function enrollmentStory(snapshot: ListingBidEnrollmentSnapshot): Story {
  return {
    render: () => <ListingBidEnrollmentCardPreview snapshot={snapshot} />,
  };
}

export const SignedOut = enrollmentStory(ENROLLMENT_SNAPSHOT_SIGNED_OUT);
SignedOut.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(
    canvas.getByRole("button", { name: "Sign In to Bid US$1,200" }),
  ).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Place Bid" }),
  ).not.toBeInTheDocument();
};

export const NeedsAge = enrollmentStory(ENROLLMENT_SNAPSHOT_NEEDS_AGE);
NeedsAge.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByRole("button", { name: "Verify" })).toBeVisible();
  expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Sign In to Bid US$1,200" }),
  ).not.toBeInTheDocument();
};

export const NeedsPayment = enrollmentStory(ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT);
NeedsPayment.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(
    canvas.getByRole("button", { name: "Link a card to place a bid." }),
  ).toBeVisible();
  expect(canvas.getByText("Linked Card")).toBeVisible();
  expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
  expect(
    canvas.queryByRole("button", { name: "Complete setup" }),
  ).not.toBeInTheDocument();
  expect(
    canvas.queryByRole("button", { name: "Sign In to Bid US$1,200" }),
  ).not.toBeInTheDocument();
};

export const SetupSheetAgeStep = enrollmentStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_AGE,
);
export const SetupSheetPaymentOnly = enrollmentStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_PAYMENT,
);
export const Ready = enrollmentStory(ENROLLMENT_SNAPSHOT_READY);
export const AutoBidConfirmation = enrollmentStory(
  ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM,
);

export const Interactive: Story = {
  render: () => <ListingBidEnrollmentInteractiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid US$1,200" }),
    ).toBeVisible();
  },
};
