import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "../listing-bid-enrollment-copy";
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
  title: "Auction/Bidding/Screens/Bid Panel/Dialogs",
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
SetupModal.parameters = {
  ...SetupModal.parameters,
  verification: { caseId: "vc_62b6f587-81af-438f-bf08-5079a3c8e339" },
};
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
SetupModalFromChange.parameters = {
  ...SetupModalFromChange.parameters,
  verification: { caseId: "vc_8868647a-432a-4928-8eda-2ec30ddc7bc1" },
};
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
SetupModalError.parameters = {
  ...SetupModalError.parameters,
  verification: { caseId: "vc_7a1aca5c-ff90-4781-a569-2bdc81848f28" },
};
SetupModalError.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Link a card to bid",
  });
  await waitFor(() =>
    expect(
      within(dialog).getByText(
        "Could not link that card. Check the details and try again.",
      ),
    ).toBeVisible(),
  );
  expect(
    within(dialog).getByRole("button", { name: "Link Card" }),
  ).toBeEnabled();
};

export const SetupModalLinking = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_SETUP_SHEET_LINKING,
);
SetupModalLinking.parameters = {
  ...SetupModalLinking.parameters,
  verification: { caseId: "vc_e4c5f6dd-a8eb-4604-9bab-10a8494deb52" },
};
SetupModalLinking.play = async () => {
  const dialog = within(document.body).getByRole("dialog", {
    name: "Link a card to bid",
  });
  const continueButton = within(dialog).getByRole("button", {
    name: "Linking",
  });
  expect(continueButton).toHaveAttribute("aria-disabled", "true");
  expect(continueButton).toHaveAttribute("aria-busy", "true");
  expect(
    within(dialog).getByRole("checkbox", {
      name: "I confirm I am 18 years of age or older.",
    }),
  ).toHaveAttribute("aria-disabled", "true");
};

export const PaymentAuthorizationPending = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING,
);
PaymentAuthorizationPending.parameters = {
  ...PaymentAuthorizationPending.parameters,
  verification: { caseId: "vc_629a7776-1887-4182-b0d6-046322d24f16" },
};
PaymentAuthorizationPending.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => {
    expect(
      canvas.getByRole("button", { name: /^Set maximum/ }),
    ).toHaveAttribute("aria-disabled", "true");
  });
  expect(
    canvas.queryByRole("dialog", { name: "Link a card to bid" }),
  ).not.toBeInTheDocument();
};

export const PaymentAuthorizationRefused = enrollmentDialogStory(
  ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED,
);
PaymentAuthorizationRefused.parameters = {
  ...PaymentAuthorizationRefused.parameters,
  verification: { caseId: "vc_5043a702-e541-4143-8c2d-7940784b5704" },
};
PaymentAuthorizationRefused.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(
    canvas.getByText("This card could not be used. Try another card."),
  ).toBeVisible();
  expect(
    canvas.queryByRole("dialog", { name: "Link a card to bid" }),
  ).not.toBeInTheDocument();
};
