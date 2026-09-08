import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING,
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_ERROR,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_LINKING,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";

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
    name: "Link a card to bid",
  });
  expect(
    within(dialog).getByText("Stripe card link (iframe)"),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByText(
      LISTING_BID_ENROLLMENT_DEMO_COPY.linkCardDescription,
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("button", { name: "Link Card" }),
  ).toBeDisabled();
};

export const SetupModalFromChange = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
);
SetupModalFromChange.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Link a card to bid",
  });
  expect(
    within(dialog).getByText("Stripe card form (iframe) — linked card on file"),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByText(
      LISTING_BID_ENROLLMENT_DEMO_COPY.linkCardDescription,
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("checkbox", {
      name: "I confirm I am 18 years of age or older.",
    }),
  ).toBeChecked();
  expect(
    within(dialog).getByRole("button", { name: "Link Card" }),
  ).toBeEnabled();
};

export const SetupModalError = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_ERROR,
);
SetupModalError.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Link a card to bid",
  });
  expect(
    within(dialog).getByText(
      "Could not link that card. Check the details and try again.",
    ),
  ).toBeVisible();
  expect(
    within(dialog).getByRole("button", { name: "Link Card" }),
  ).toBeEnabled();
};

export const SetupModalLinking = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_LINKING,
);
SetupModalLinking.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Link a card to bid",
  });
  const continueButton = within(dialog).getByRole("button", {
    name: "Linking",
  });
  expect(continueButton).toBeDisabled();
  expect(continueButton).toHaveAttribute("aria-busy", "true");
  expect(
    within(dialog).getByRole("checkbox", {
      name: "I confirm I am 18 years of age or older.",
    }),
  ).toBeDisabled();
};

export const PaymentAuthorizationPending = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING,
);
PaymentAuthorizationPending.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => {
    expect(canvas.getByRole("button", { name: /^Set maximum/ })).toBeDisabled();
  });
  expect(
    canvas.queryByRole("dialog", { name: "Link a card to bid" }),
  ).not.toBeInTheDocument();
};

export const PaymentAuthorizationRefused = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED,
);
PaymentAuthorizationRefused.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(
    canvas.getByText("Your card could not be authorized. Try another card."),
  ).toBeVisible();
  expect(
    canvas.queryByRole("dialog", { name: "Link a card to bid" }),
  ).not.toBeInTheDocument();
};
