import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CompleteOrderSetupDemo } from "./complete-order-setup-demo";

const meta = {
  title:
    "Auction/Post Bidding/Screens/Winner Order/Setup/Complete Order Setup/Payment Method",
  component: CompleteOrderSetupDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Step 2 of Complete Order Setup — the Pay in choice (USD or HKD, HKD preselected) then the payment method, card preselected. USD offers card, Hong Kong bank transfer and SWIFT; HKD offers card, FPS and Hong Kong bank transfer. Each currency remembers its method; Continue needs both.",
      },
    },
  },
  args: {
    initialStep: 2,
  },
} satisfies Meta<typeof CompleteOrderSetupDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function findVisibleDialog(
  page: ReturnType<typeof within>,
  name: string | RegExp,
) {
  return waitFor(() => {
    const dialog = page.getByRole("dialog", { name });
    expect(dialog).toBeVisible();
    return dialog;
  });
}

/**
 * Step 2 — Pay in choice with HKD preselected; methods show immediately
 * with card preselected. Switching to USD swaps the rails.
 */
export const PaymentMethod: Story = {
  name: "Payment method",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.getByText("Step 2 of 3")).toBeVisible();
    expect(modal.getByText("Pay in")).toBeVisible();
    const usd = modal.getByRole("button", { name: "USD" });
    const hkd = modal.getByRole("button", { name: "HKD" });
    expect(usd).toBeVisible();
    expect(hkd).toBeVisible();
    expect(usd).toHaveAttribute("aria-pressed", "false");
    expect(hkd).toHaveAttribute("aria-pressed", "true");
    const card = modal.getByRole("radio", { name: /^Card\b/i });
    expect(card).toBeVisible();
    expect(card).toBeChecked();
    expect(modal.getByRole("radio", { name: /Bank transfer/i })).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    // Clicking the pressed item again must not clear the choice.
    await userEvent.click(hkd);
    expect(hkd).toHaveAttribute("aria-pressed", "true");
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    await userEvent.click(usd);
    await waitFor(() => {
      expect(usd).toHaveAttribute("aria-pressed", "true");
    });
    expect(hkd).toHaveAttribute("aria-pressed", "false");
    // Card stays the default under USD — Continue stays enabled.
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** Step 2 with USD — card + bank transfer naming SWIFT, no FPS. */
export const PaymentMethodUsd: Story = {
  name: "Payment method — USD",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    await userEvent.click(modal.getByRole("button", { name: "USD" }));
    await waitFor(() => {
      expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeVisible();
    });
    const bankTransfer = modal.getByRole("radio", {
      name: /Bank transfer/i,
    });
    expect(bankTransfer).toBeVisible();
    expect(bankTransfer).toHaveTextContent(/Hong Kong bank transfer or SWIFT/);
    expect(bankTransfer).not.toHaveTextContent(/FPS/);
  },
};

/** Step 2 with HKD — bank transfer names FPS. */
export const PaymentMethodHkd: Story = {
  name: "Payment method — HKD",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeVisible();
    const bankTransfer = modal.getByRole("radio", {
      name: /Bank transfer/i,
    });
    expect(bankTransfer).toBeVisible();
    expect(bankTransfer).toHaveTextContent(/FPS or Hong Kong bank transfer/);
  },
};

/** Each Pay in currency remembers the last method picked for it. */
export const EachCurrencyRemembersItsMethod: Story = {
  name: "Each currency remembers its method",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    // HKD is preselected; pick bank transfer for it.
    await userEvent.click(modal.getByRole("radio", { name: /Bank transfer/i }));
    expect(modal.getByRole("radio", { name: /Bank transfer/i })).toBeChecked();

    // USD falls back to the card default.
    await userEvent.click(modal.getByRole("button", { name: "USD" }));
    await waitFor(() => {
      expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    });
    expect(
      modal.getByRole("radio", { name: /Bank transfer/i }),
    ).not.toBeChecked();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    expect(modal.getByText(/Hong Kong bank transfer or SWIFT/)).toBeVisible();

    // Back on HKD, bank transfer is checked again.
    await userEvent.click(modal.getByRole("button", { name: "HKD" }));
    await waitFor(() => {
      expect(
        modal.getByRole("radio", { name: /Bank transfer/i }),
      ).toBeChecked();
    });
    expect(modal.getByRole("radio", { name: /^Card\b/i })).not.toBeChecked();
    expect(modal.getByText(/FPS or Hong Kong bank transfer/)).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** Single settlement currency — no choice, methods shown immediately. */
export const UsdOnly: Story = {
  name: "USD only",
  args: { settlementCurrencies: ["USD"] },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.queryByText("Pay in")).not.toBeInTheDocument();
    expect(modal.getByRole("radio", { name: /^Card\b/i })).toBeChecked();
    const bankTransfer = modal.getByRole("radio", {
      name: /Bank transfer/i,
    });
    expect(bankTransfer).toHaveTextContent(/Hong Kong bank transfer or SWIFT/);
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};
