import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_SNAPSHOT_SETUP_SHEET,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";
import { PaymentAuthorizationDialogPreview } from "./payment-authorization-demo";

const meta = {
  title: "Auction Listing/Bid Panel/Dialogs",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function enrollmentDialogStory(snapshot: ListingBidEnrollmentSnapshot): Story {
  return {
    render: () => (
      <div className="mx-auto w-full max-w-md p-8">
        <ListingBidEnrollmentCardPreview
          onChangePayment={() => undefined}
          onLinkPayment={() => undefined}
          snapshot={snapshot}
        />
      </div>
    ),
  };
}

export const SetupModal = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET,
);
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
    within(dialog).getByRole("button", { name: "Confirm" }),
  ).toBeDisabled();
};

export const SetupModalFromChange = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
);
SetupModalFromChange.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Get Ready to Bid",
  });
  expect(
    within(dialog).getByText("Stripe card form (iframe) — linked card on file"),
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
    within(dialog).getByRole("button", { name: "Confirm" }),
  ).toBeEnabled();
};

export const PaymentAuthorizationPending: Story = {
  render: () => <PaymentAuthorizationDialogPreview state="pending" />,
  play: async () => {
    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", {
        name: "Authorize your bid",
      }),
    );
    expect(
      within(dialog).getByRole("button", {
        name: "Authorizing…",
      }),
    ).toBeDisabled();
  },
};

export const PaymentAuthorizationRefused: Story = {
  render: () => <PaymentAuthorizationDialogPreview state="refused" />,
  play: async () => {
    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", {
        name: "Authorize your bid",
      }),
    );
    expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "Your payment method was declined.",
    );
  },
};
