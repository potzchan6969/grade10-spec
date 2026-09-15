import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  WINNER_ORDER_STATUS_LABELS,
  type WinnerOrderStatus,
} from "./winner-order-content";
import { WinnerOrderPage } from "./winner-order-page";

const meta = {
  title: "My Auctions/Winner Order",
  component: WinnerOrderPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Address-first auction Winner Order preview (Storybook only). Statuses follow revise-auction-winner-invoicing: Awaiting Address → Preparing Invoice → Pending Payment → fulfilment. Confirm delivery address opens a picker of selectable address cards (with remove); Add new address opens a nested form. Not a published `@grade10/ui` export yet.",
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: Object.keys(WINNER_ORDER_STATUS_LABELS) as WinnerOrderStatus[],
      labels: WINNER_ORDER_STATUS_LABELS,
    },
  },
  args: {
    status: "awaiting_address",
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AwaitingAddress: Story = {
  name: "Awaiting Address",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Winner Order" }),
    ).toBeVisible();
    expect(canvas.getByText("Awaiting Address")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Confirm delivery address" }),
    ).toBeVisible();
    expect(canvas.getByText("No address confirmed yet.")).toBeVisible();
    expect(canvas.queryByText("Invoice")).not.toBeInTheDocument();
    expect(canvas.queryByText(/pay with card/i)).not.toBeInTheDocument();
  },
};

/** Opens the address dialog, confirms a saved address, lands on Preparing Invoice. */
export const ConfirmAddressFlow: Story = {
  name: "Confirm address flow",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm delivery address" }),
    );

    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", {
        name: "Confirm delivery address",
      });
      expect(found).toBeVisible();
      return found;
    });
    const modal = within(dialog);
    await waitFor(() => {
      expect(
        modal.getByRole("heading", { name: "Confirm delivery address" }),
      ).toBeVisible();
    });
    expect(
      modal.getByText(/ship this lot here and use the address to calculate/i),
    ).toBeVisible();
    expect(modal.getByText("Wan Chai home")).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Remove Wan Chai home" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();

    await userEvent.click(
      modal.getByRole("button", { name: "Confirm address" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(canvas.getByText("Preparing Invoice")).toBeVisible();
    expect(canvas.getByText(/Harbour Road/)).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Confirm delivery address" }),
    ).not.toBeInTheDocument();
  },
};

/** Nested add-address form → Use this address → confirm → Preparing Invoice. */
export const AddNewAddressFlow: Story = {
  name: "Add new address flow",
  args: { status: "awaiting_address" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm delivery address" }),
    );

    const outerDialog = await waitFor(() => {
      const found = page.getByRole("dialog", {
        name: "Confirm delivery address",
      });
      expect(found).toBeVisible();
      return found;
    });
    await userEvent.click(
      within(outerDialog).getByRole("button", { name: "Add new address" }),
    );

    const nestedDialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Add delivery address" });
      expect(found).toBeVisible();
      return found;
    });
    const nested = within(nestedDialog);

    await userEvent.type(nested.getByLabelText("First name"), "Jordan");
    await userEvent.type(nested.getByLabelText("Last name"), "Lee");
    await userEvent.type(
      nested.getByLabelText("Street address"),
      "88 Queen's Road Central",
    );
    await userEvent.type(nested.getByLabelText("City"), "Central");
    await userEvent.type(nested.getByLabelText("Postal code"), "000000");

    await userEvent.click(
      nested.getByRole("button", { name: "Use this address" }),
    );

    await waitFor(() => {
      expect(
        page.queryByRole("dialog", { name: "Add delivery address" }),
      ).not.toBeInTheDocument();
    });

    const picker = within(
      await waitFor(() => {
        const found = page.getByRole("dialog", {
          name: "Confirm delivery address",
        });
        expect(found).toBeVisible();
        return found;
      }),
    );
    expect(picker.getByText("Jordan Lee")).toBeVisible();
    expect(picker.getByText(/Queen's Road Central/)).toBeVisible();

    await userEvent.click(
      picker.getByRole("button", { name: "Confirm address" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(canvas.getByText("Preparing Invoice")).toBeVisible();
    expect(canvas.getByText(/Queen's Road Central/)).toBeVisible();
  },
};

export const PreparingInvoice: Story = {
  name: "Preparing Invoice",
  args: { status: "preparing_invoice" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Preparing Invoice")).toBeVisible();
    expect(canvas.getByText(/Wan Chai/)).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /confirm|pay/i }),
    ).not.toBeInTheDocument();
    expect(canvas.getByText(/waiting on the operator quote/i)).toBeVisible();
  },
};

export const PendingPayment: Story = {
  name: "Pending Payment",
  args: { status: "pending_payment" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Pending Payment")).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.getByText("HK$15,660")).toBeVisible();
    expect(canvas.getByText("Shipping & Handling")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Pay with card" })).toBeVisible();
    expect(canvas.getByText(/Locked after invoice send/)).toBeVisible();
  },
};

export const PendingPaymentExpired: Story = {
  name: "Pending Payment — expired invoice",
  args: { status: "pending_payment_expired" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/expired invoice/i)).toBeVisible();
    expect(canvas.getByRole("button", { name: "Pay with card" })).toBeVisible();
    expect(canvas.getByText(/support@grade10.com/)).toBeVisible();
  },
};

export const Processing: Story = {
  args: { status: "processing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getByText(/Visa/)).toBeVisible();
  },
};

export const Shipped: Story = {
  args: { status: "shipped" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Track shipment" }),
    ).toBeVisible();
  },
};

export const Delivered: Story = {
  args: { status: "delivered" },
};

export const Cancelled: Story = {
  args: { status: "cancelled" },
};

export const Refunded: Story = {
  args: { status: "refunded" },
};
