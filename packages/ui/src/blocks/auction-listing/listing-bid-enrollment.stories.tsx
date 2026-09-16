import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  EnrollmentSetupSheet,
  PaymentMethodEmptyState,
  PaymentMethodRow,
} from "./listing-bid-enrollment";

const COPY = {
  paymentMethod: "Linked Card",
  paymentMethodTooltip:
    "We authorize your card for bidding. You're only charged if you win.",
  changeCard: "Change",
  linkCardEmptyState: "Link a card to place a bid.",
  getReadyToBid: "Link a card to bid",
  linkCardDescription:
    "Link a card for bidding. You're only charged if you win.",
  ageAttestation: "I confirm I am 18 years of age or older.",
  continue: "Link Card",
  linking: "Linking",
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
    expect(canvas.getByLabelText(COPY.paymentMethodTooltip)).toBeVisible();
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

export const LinkedCardKeepsStableHeight: Story = {
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
    expect(within(dialog).getByText("Stripe card link (iframe)")).toBeVisible();
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
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
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
    const field = dialog.querySelector<HTMLElement>(
      '[data-slot="payment-field"]',
    );
    expect(field).not.toBeNull();
    expect(field).toHaveAttribute("data-state", "ready");
    expect(
      within(dialog).getByText(
        "Stripe card form (iframe) — linked card on file",
      ),
    ).toBeVisible();
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
  render: () => (
    <EnrollmentSetupSheet
      cardReady
      copy={COPY}
      defaultAgeAttested
      errorMessage="Could not link that card. Check the details and try again."
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
    expect(
      within(dialog).getByText(
        "Stripe card form (iframe) — linked card on file",
      ),
    ).toBeVisible();
    const continueButton = within(dialog).getByRole("button", {
      name: "Linking",
    });
    expect(continueButton).toBeDisabled();
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
