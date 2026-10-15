import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CompleteOrderSetupDemo } from "./complete-order-setup-demo";

const meta = {
  title: "Auction/Post Bidding/Parts/CompleteOrderSetupDemo",
  component: CompleteOrderSetupDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order Complete Order Setup (delivery, payment method, billing). Same dialog the Awaiting Setup page opens. Replaces the retired Confirm Delivery Address stories. Step folders sit beside this: `Delivery Address` draws step 1 and its address book states, `Payment Method` draws step 2's settlement currency and method offer.",
      },
    },
  },
  args: {
    cardFeePercentages: { USD: 4.4, HKD: 3.4 },
    initialNewAddressOpen: false,
    initialStep: 1,
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

/** Step 3 — same-as-delivery default. */
export const BillingAddress: Story = {
  name: "Billing address",
  args: { initialStep: 3 },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Billing Address");
    const modal = within(dialog);
    expect(modal.getByText("Step 3 of 3")).toBeVisible();
    expect(modal.getByText("Same as delivery address")).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Complete Order Setup" }),
    ).toBeEnabled();
  },
};

/** Full three steps → confirmed payload on the demo surface. */
export const FinishSetup: Story = {
  name: "Finish setup",
  args: { onConfirm: fn() },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);
    const dialog = await findVisibleDialog(page, "Delivery Address");
    const modal = within(dialog);

    await userEvent.click(modal.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(modal.getByText("Step 2 of 3")).toBeVisible();
    });
    // The winner must select both currency and payment method.
    expect(modal.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(modal.getByRole("button", { name: "HKD" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await userEvent.click(modal.getByRole("button", { name: "HKD" }));
    await userEvent.click(modal.getByRole("radio", { name: /^Card\b/i }));
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
    await userEvent.click(modal.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(modal.getByText("Step 3 of 3")).toBeVisible();
    });
    await userEvent.click(
      modal.getByRole("button", { name: "Complete Order Setup" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(canvas.getByText(/Confirmed delivery/i)).toBeVisible();
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        settlementCurrency: "HKD",
        paymentMethod: "card",
        sameAsDelivery: true,
      }),
    );
  },
};
