import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING,
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET,
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
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
    name: "Authorize a card to bid",
  });
  expect(
    within(dialog).getByText("Stripe card link (iframe)"),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByText(
      "Link a card and authorize a hold for this lot. You are only charged if you win.",
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("button", { name: "Authorize" }),
  ).toBeDisabled();
};

export const SetupModalFromChange = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
);
SetupModalFromChange.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Authorize a card to bid",
  });
  expect(
    within(dialog).getByText("Stripe card form (iframe) — linked card on file"),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByText(
      "Link a card and authorize a hold for this lot. You are only charged if you win.",
    ),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("checkbox", {
      name: "I confirm I am 18 years of age or older.",
    }),
  ).toBeChecked();
  expect(
    within(dialog).getByRole("button", { name: "Authorize" }),
  ).toBeEnabled();
};

export const PaymentAuthorizationPending = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING,
);
PaymentAuthorizationPending.play = async () => {
  const dialog = await waitFor(() =>
    within(document.body).getByRole("dialog", {
      name: "Authorize a card to bid",
    }),
  );
  expect(
    within(dialog).getByRole("button", {
      name: "Authorizing",
    }),
  ).toBeDisabled();
  // The checkbox is a span carrying the role, so the disabled state it
  // publishes is `aria-disabled`. `toBeDisabled` reads only the native
  // attribute and would call every such control enabled.
  expect(
    within(dialog).getByRole("checkbox", {
      name: "I confirm I am 18 years of age or older.",
    }),
  ).toHaveAttribute("aria-disabled", "true");
  expect(within(dialog).getByRole("alert")).toHaveTextContent(
    "Your card is being authorized. Keep this dialog open while Stripe completes the request.",
  );
};

export const PaymentAuthorizationRefused = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED,
);
PaymentAuthorizationRefused.play = async () => {
  const dialog = await waitFor(() =>
    within(document.body).getByRole("dialog", {
      name: "Authorize a card to bid",
    }),
  );
  expect(within(dialog).getByRole("alert")).toHaveTextContent(
    "Your card could not be authorized.",
  );
  expect(
    within(dialog).getByText("Stripe card form (iframe) — linked card on file"),
  ).toBeInTheDocument();
  expect(
    within(dialog).getByRole("button", { name: "Authorize" }),
  ).toBeEnabled();
};
