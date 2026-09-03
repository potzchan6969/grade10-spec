import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  EnrollmentSetupSheet,
  PaymentMethodEmptyState,
  PaymentMethodRow,
} from "./listing-bid-enrollment";

const COPY = {
  paymentMethod: "Linked Card",
  changeCard: "Change",
  linkCardEmptyState: "Link a card to place a bid.",
  getReadyToBid: "Get Ready to Bid",
  linkCardDescription:
    "Link a card to bid on this lot. You are only charged if you win this lot.",
  ageAttestation: "I confirm I am 18 years of age or older.",
  continue: "Continue",
  iframePlaceholder: "Stripe card link (iframe)",
  iframeLinkedCardPlaceholder:
    "Stripe card form (iframe) — linked card on file",
} as const;

const meta = {
  title: "Auction Listing/Bid enrollment",
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkedCardEditable: Story = {
  render: () => (
    <PaymentMethodRow
      brand="visa"
      copy={COPY}
      maskedNumber="•••• 4242"
      onChange={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("•••• 4242")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Change" })).toBeVisible();
  },
};

export const LinkedCard: Story = {
  render: () => (
    <PaymentMethodRow brand="visa" copy={COPY} maskedNumber="•••• 4242" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("•••• 4242")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Change" }),
    ).not.toBeInTheDocument();
  },
};

const onLinkEmpty = fn();

export const EmptyLinkedCard: Story = {
  render: () => <PaymentMethodEmptyState copy={COPY} onLink={onLinkEmpty} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Link a card to place a bid." }),
    );
    expect(onLinkEmpty).toHaveBeenCalledOnce();
  },
};

export const SetupSheet: Story = {
  render: () => <EnrollmentSetupSheet copy={COPY} open requiresIframeLink />,
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Get Ready to Bid",
    });
    expect(
      within(dialog).getByText("Stripe card link (iframe)"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Continue" }),
    ).toBeDisabled();
  },
};

export const SetupSheetFromChange: Story = {
  render: () => (
    <EnrollmentSetupSheet
      copy={COPY}
      defaultAgeAttested
      iframeLinkedPayment={{ brand: "visa", maskedNumber: "•••• 4242" }}
      open
      requiresIframeLink
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Get Ready to Bid",
    });
    expect(
      within(dialog).getByText(
        "Stripe card form (iframe) — linked card on file",
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
  },
};
