import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  EnrollmentSetupSheet,
  PaymentMethodEmptyState,
  PaymentMethodRow,
} from "./listing-bid-enrollment";

const { auctionListing } = getMessages("grade10", "en");

const COPY = {
  paymentMethod: auctionListing.paymentMethod,
  paymentMethodTooltip: auctionListing.paymentMethodTooltip,
  changeCard: auctionListing.changeCard,
  linkCardEmptyState: auctionListing.linkCardEmptyState,
  getReadyToBid: auctionListing.linkACardToBid,
  linkCardDescription: auctionListing.linkCardDescription,
  ageAttestation: auctionListing.ageAttestation,
  continue: auctionListing.continue,
  linking: auctionListing.linking,
  iframePlaceholder: "Stripe card link (iframe)",
  iframeLinkedCardPlaceholder:
    "Stripe card form (iframe) — linked card on file",
} as const;

function MockStripePaymentField({ label }: { label: string }) {
  return (
    <div className="flex h-12 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-sm text-secondary-foreground">
      {label}
    </div>
  );
}

const meta = {
  title: "Auction/Bidding/Blocks/ListingBidEnrollment",
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
  parameters: {
    verification: { caseId: "vc_3196476a-3ece-48b3-8f83-953e9e3cbaab" },
  },
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
    expect(canvas.getByLabelText(COPY.paymentMethodTooltip)).toBeVisible();
  },
};

export const LinkedCard: Story = {
  parameters: {
    verification: { caseId: "vc_62be9b0d-103c-4d2a-8adf-8113ffe74971" },
  },
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

export const LinkedCardKeepsStableHeight: Story = {
  parameters: {
    verification: { caseId: "vc_1f8b61e2-1ffc-4fc3-89e3-2737f8fe220d" },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <section aria-label="editable linked card">
        <PaymentMethodRow
          brand="visa"
          copy={COPY}
          maskedNumber="•••• 4242"
          onChange={() => undefined}
        />
      </section>
      <section aria-label="locked linked card">
        <PaymentMethodRow brand="visa" copy={COPY} maskedNumber="•••• 4242" />
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const editable = canvas.getByRole("region", {
      name: "editable linked card",
    });
    const locked = canvas.getByRole("region", {
      name: "locked linked card",
    });
    expect(editable.getBoundingClientRect().height).toBe(
      locked.getBoundingClientRect().height,
    );
  },
};

const onLinkEmpty = fn();

export const EmptyLinkedCard: Story = {
  parameters: {
    verification: { caseId: "vc_d0a72bcf-3057-450c-9f5c-3527fb511c1f" },
  },
  render: () => <PaymentMethodEmptyState copy={COPY} onLink={onLinkEmpty} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Link a card to bid." }),
    );
    expect(onLinkEmpty).toHaveBeenCalledOnce();
  },
};

export const SetupSheet: Story = {
  parameters: {
    verification: { caseId: "vc_000b57da-e559-42cf-a89c-e9b8220b5170" },
  },
  render: () => (
    <EnrollmentSetupSheet
      copy={COPY}
      open
      paymentField={<MockStripePaymentField label={COPY.iframePlaceholder} />}
      requiresIframeLink
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    await waitFor(() =>
      expect(
        within(dialog).getByText("Stripe card link (iframe)"),
      ).toBeVisible(),
    );
    const field = dialog.querySelector<HTMLElement>(
      '[data-slot="payment-field"]',
    );
    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("data-state", "ready");
    /* The sheet nests a scrolling body inside the dialog's own body, so name
       the one that holds the payment field rather than the first in the DOM. */
    const scrollBody = dialog
      .querySelector<HTMLElement>('[data-slot="payment-field"]')
      ?.closest<HTMLElement>('[data-slot="dialog-body"]');
    expect(scrollBody).not.toBeNull();
    expect(scrollBody).toHaveClass("max-h-[28rem]", "flex-1");
    expect(
      scrollBody?.querySelector('[data-slot="payment-field"]'),
    ).not.toBeNull();
    expect(scrollBody?.querySelector('[data-slot="input-message"]')).toBeNull();
    expect(scrollBody?.querySelector('input[type="checkbox"]')).toBeNull();
    expect(
      within(dialog).getByRole("button", { name: "Link Card" }),
    ).toBeDisabled();
  },
};

export const SetupSheetLoadedMockStripe: Story = {
  parameters: {
    verification: { caseId: "vc_3ff7a44d-d0ca-4294-bf10-31b7fd10c5d6" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      open
      paymentField={<MockStripePaymentField label={COPY.iframePlaceholder} />}
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    await waitFor(() =>
      expect(
        within(dialog).getByText("Stripe card link (iframe)"),
      ).toBeVisible(),
    );
    const field = dialog.querySelector<HTMLElement>(
      '[data-slot="payment-field"]',
    );
    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("data-state", "ready");
  },
};

export const SetupSheetFromChange: Story = {
  parameters: {
    verification: { caseId: "vc_01fe138f-fdd6-4216-bd84-1df3e0543fa1" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      iframeLinkedPayment={{ brand: "visa", maskedNumber: "•••• 4242" }}
      open
      paymentField={
        <MockStripePaymentField label={COPY.iframeLinkedCardPlaceholder} />
      }
      requiresIframeLink
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    await waitFor(() =>
      expect(within(dialog).getByText("•••• 4242")).toBeVisible(),
    );
    expect(
      within(dialog).getByText(
        "Stripe card form (iframe) — linked card on file",
      ),
    ).toBeVisible();
    const field = dialog.querySelector<HTMLElement>(
      '[data-slot="payment-field"]',
    );
    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("data-state", "ready");
    expect(
      within(dialog).getByRole("checkbox", {
        name: "I confirm I am 18 years of age or older.",
      }),
    ).toBeChecked();
    expect(
      within(dialog).getByRole("button", { name: "Link Card" }),
    ).toBeEnabled();
  },
};

export const SetupSheetError: Story = {
  parameters: {
    verification: { caseId: "vc_c3e8f293-244e-47a8-a444-8d2bfb3a7ca0" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      errorMessage="Could not link that card. Check the details and try again."
      iframeLinkedPayment={{ brand: "visa", maskedNumber: "•••• 4242" }}
      open
      paymentField={
        <MockStripePaymentField label={COPY.iframeLinkedCardPlaceholder} />
      }
      requiresIframeLink
    />
  ),
  play: async () => {
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
    expect(within(dialog).getByText("•••• 4242")).toBeVisible();
    expect(
      within(dialog).getByText(
        "Stripe card form (iframe) — linked card on file",
      ),
    ).toBeVisible();
    expect(
      within(dialog).getByRole("button", { name: "Link Card" }),
    ).toBeEnabled();
  },
};

const onLinkingOpenChange = fn();

export const SetupSheetLinking: Story = {
  parameters: {
    verification: { caseId: "vc_22115a9e-d6df-44f7-9da2-5da6774f52ef" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      linking
      open
      onOpenChange={onLinkingOpenChange}
      paymentField={
        <MockStripePaymentField label={COPY.iframeLinkedCardPlaceholder} />
      }
      requiresIframeLink
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    await waitFor(() =>
      expect(
        within(dialog).getByText(
          "Stripe card form (iframe) — linked card on file",
        ),
      ).toBeVisible(),
    );
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
    await userEvent.keyboard("{Escape}");
    expect(onLinkingOpenChange).not.toHaveBeenCalled();
  },
};

export const SetupSheetProviderFieldIsLockedWhileLinking: Story = {
  parameters: {
    verification: { caseId: "vc_852aa8a2-8e5b-4ea7-9f2d-0d974712573a" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      linking
      open
      paymentField={<button type="button">Card field</button>}
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    const field = within(dialog).getByRole("button", { name: "Card field" });
    const slot = field.closest<HTMLElement>('[data-slot="payment-field"]');
    expect(slot).toHaveAttribute("inert");
    expect(slot).toHaveAttribute("aria-disabled", "true");
    expect(
      within(dialog).getByRole("checkbox", {
        name: "I confirm I am 18 years of age or older.",
      }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      within(dialog).queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  },
};

const onContinueFromReadyField = fn();

export const SetupSheetProviderFieldReadiness: Story = {
  parameters: {
    verification: { caseId: "vc_6328e052-46a0-4de4-b9b6-730c5d0ec0ee" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady={false}
      copy={COPY}
      defaultAgeAttested
      open
      onContinue={onContinueFromReadyField}
      paymentField={<input aria-label="Card number field" />}
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    await waitFor(() =>
      expect(
        within(dialog).getByRole("textbox", { name: "Card number field" }),
      ).toBeVisible(),
    );
    expect(
      within(dialog).getByRole("button", { name: "Link Card" }),
    ).toBeDisabled();
  },
};

export const SetupSheetProviderFieldReady: Story = {
  parameters: {
    verification: { caseId: "vc_48f8c1c1-0e0b-4436-8cd1-9312236eb5ca" },
  },
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      open
      onContinue={onContinueFromReadyField}
      paymentField={<input aria-label="Card number field" />}
    />
  ),
  play: async () => {
    const dialog = within(document.body).getByRole("dialog", {
      name: "Link a card to bid",
    });
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Link Card" }),
    );
    expect(onContinueFromReadyField).toHaveBeenCalledOnce();
  },
};
