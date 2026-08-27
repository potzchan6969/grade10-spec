import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STATUS_LABELS } from "./fixtures";
import { OrderHistoryStatus } from "./order-history-status";
import type { OrderHistoryFulfillmentStatus } from "./types";

const STATUSES: OrderHistoryFulfillmentStatus[] = [
  "completed",
  "shipped",
  "pending",
  "canceled",
  "refunded",
];

const meta = {
  title: "Store Order History/OrderHistoryStatus",
  component: OrderHistoryStatus,
  tags: ["autodocs"],
  args: {
    status: "shipped",
    children: STATUS_LABELS.shipped,
  },
} satisfies Meta<typeof OrderHistoryStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shipped: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="order-history-status"]'),
    ).toHaveAttribute("data-status", "shipped");
  },
};

export const Completed: Story = {
  args: { status: "completed", children: STATUS_LABELS.completed },
};

export const Pending: Story = {
  args: { status: "pending", children: STATUS_LABELS.pending },
};

export const Canceled: Story = {
  args: { status: "canceled", children: STATUS_LABELS.canceled },
};

export const Refunded: Story = {
  args: { status: "refunded", children: STATUS_LABELS.refunded },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {STATUSES.map((status) => (
        <OrderHistoryStatus key={status} status={status}>
          {STATUS_LABELS[status]}
        </OrderHistoryStatus>
      ))}
    </div>
  ),
};
